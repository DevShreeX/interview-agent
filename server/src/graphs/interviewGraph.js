import { StateGraph, END } from "@langchain/langgraph";
import { evaluateAnswer } from "../agents/evaluatorAgent.js";
import { generateNextQuestion } from "../agents/plannerAgent.js";
import { calculateCalibration } from "../services/calibrationEngine.js";
import { updateBeliefState } from "../services/beliefStateEngine.js";
import { generateCompletion } from "../config/llm.js";
import { InterviewStateAnnotation } from "./graphState.js";
import { buildSystemPrompt } from "../config/promptRegistry.js";
import { logPrivacyAudit } from "../services/privacyAudit.js";

// ============================================================
// NODE DEFINITIONS
// ============================================================

/**
 * NODE 1: Evaluator Node
 * Evaluates the candidate's latest answer against the question.
 */
async function evaluatorNode(state) {
  const { currentQuestion, currentAnswer, targetRole, personaId, sessionId, questionNumber } = state;

  logPrivacyAudit({ sessionId, agentType: "graph:evaluator", promptId: "EVALUATOR_V1", topic: "evaluation", questionNumber });

  const evaluation = await evaluateAnswer({
    question: currentQuestion,
    answer: currentAnswer,
    targetRole,
    persona: personaId,
    sessionId
  });

  return { evaluation };
}

/**
 * NODE 2: Calibration Node
 * Deterministic arithmetic — no LLM.
 */
async function calibrationNode(state) {
  const { currentConfidence, evaluation } = state;
  const calibration = calculateCalibration({
    confidence: currentConfidence || 3,
    accuracy: evaluation?.accuracy || 0.5
  });

  const newLog = [...(state.calibrationLog || []), calibration];
  return { calibration, calibrationLog: newLog };
}

/**
 * NODE 3: Belief State Update Node
 * Updates topic mastery probabilities — deterministic.
 */
async function beliefUpdateNode(state) {
  const { evaluation, beliefState } = state;
  const { beliefState: updatedBelief } = updateBeliefState(
    beliefState || {},
    {
      topic: evaluation?.follow_up_angle || "system_design",
      accuracy: evaluation?.accuracy || 0.5,
      depth: evaluation?.depth || "structured"
    }
  );

  return { beliefState: updatedBelief };
}

/**
 * NODE 4: Thinking Node (Self-Reflection Hypothesis)
 * The AI forms an internal hypothesis about the candidate's mental model
 * and sets strategic intent for the next question.
 * This reasoning is internal — NEVER exposed to the candidate.
 */
async function thinkingNode(state) {
  const { evaluation, calibration, beliefState, history, sessionId, questionNumber } = state;

  logPrivacyAudit({ sessionId, agentType: "graph:thinking", promptId: "METACOGNITION_V1", topic: "hypothesis", questionNumber });

  const systemInstruction = buildSystemPrompt(["MASTER_V1", "PRIVACY_WRAPPER_V1", "ANTI_HALLUCINATION_V1"]);

  const prompt = `
INTERNAL METACOGNITIVE REFLECTION — NOT FOR CANDIDATE

Evaluation Evidence:
- Accuracy: ${evaluation?.accuracy}
- Depth: ${evaluation?.depth}
- Concepts Missed: ${JSON.stringify(evaluation?.concepts_missed)}
- Evidence Quote: "${evaluation?.evidence_quote}"
- Misconception: ${evaluation?.misconception || "none"}

Calibration Delta: ${calibration?.calibrationDelta} (${calibration?.category})

Belief State: ${JSON.stringify(beliefState)}

Questions Asked So Far: ${history?.length || 0}

Task: Form a brief internal hypothesis about the candidate's mental model and select a strategic interview intent.
Return ONLY valid JSON:
{
  "observed_pattern": "one sentence describing what pattern you observe in the candidate's reasoning",
  "hypothesis": "one sentence hypothesis about the candidate's mental model or knowledge gap",
  "strategic_intent": "one of: probe_deeper | attack_misconception | test_edge_cases | increase_difficulty | target_weakness | test_recovery",
  "reasoning": "one sentence explaining your strategic choice"
}
`;

  const fallback = {
    observed_pattern: `Candidate demonstrates ${evaluation?.depth || "structured"} depth with accuracy ${evaluation?.accuracy || 0.5}.`,
    hypothesis: calibration?.category === "high_overconfidence"
      ? "Candidate overestimates their understanding — gap between claimed and demonstrated knowledge."
      : "Candidate shows consistent technical patterns; increasing complexity will reveal depth limits.",
    strategic_intent: calibration?.category === "high_overconfidence" ? "attack_misconception" : "increase_difficulty",
    reasoning: "Calibration delta indicates the candidate's confidence exceeds demonstrated depth."
  };

  const raw = await generateCompletion(prompt, systemInstruction);
  if (!raw) return { hypothesis: fallback.hypothesis, strategicIntent: fallback.strategic_intent };

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned.substring(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1));
    return {
      hypothesis: parsed.hypothesis || fallback.hypothesis,
      strategicIntent: parsed.strategic_intent || fallback.strategic_intent
    };
  } catch {
    return { hypothesis: fallback.hypothesis, strategicIntent: fallback.strategic_intent };
  }
}

/**
 * NODE 5: Planner Node
 * Generates the next question guided by the strategic intent from ThinkingNode.
 */
async function plannerNode(state) {
  const { personaId, targetRole, questionNumber, history, beliefState, calibration, sessionId, candidateId, strategicIntent, hypothesis } = state;

  logPrivacyAudit({ sessionId, agentType: "graph:planner", promptId: "PLANNER_V1", topic: "question_selection", questionNumber });

  // Inject strategic intent into planner context
  const intentHint = strategicIntent
    ? `\n\nINTERNAL STRATEGY CONTEXT (do not reveal to candidate): ${strategicIntent.replace(/_/g, " ")}. Hypothesis: ${hypothesis}`
    : "";

  const nextQuestion = await generateNextQuestion({
    personaId,
    targetRole,
    questionNumber: (questionNumber || 1) + 1,
    history: history || [],
    beliefState: beliefState || {},
    lastCalibration: calibration,
    sessionId,
    candidateId
  });

  return { nextQuestion, questionRefined: false };
}

/**
 * NODE 6: Self-Critique Node
 * The AI critiques its own proposed question before delivering it.
 * If the question is generic/repetitive, it loops back to the planner.
 */
async function selfCritiqueNode(state) {
  const { nextQuestion, history, personaId, sessionId, questionNumber } = state;

  logPrivacyAudit({ sessionId, agentType: "graph:self_critique", promptId: "SELF_CRITIQUE_V1", topic: "question_critique", questionNumber });

  const alreadyAsked = (history || []).map(h => h.question).join(" | ");

  const systemInstruction = buildSystemPrompt(["MASTER_V1"]);

  const prompt = `
INTERNAL SELF-CRITIQUE — NOT FOR CANDIDATE

Proposed Question: "${nextQuestion}"
Previous Questions Asked: ${alreadyAsked || "(none yet)"}
Interviewer Persona: ${personaId}

Critique this proposed question against the following quality gates:
1. Is it generic? (e.g., "Tell me about system design" = FAIL)
2. Does it repeat a concept already tested? (check Previous Questions)
3. Is it too easy given current belief state?
4. Does it probe the specific weakness identified?

Return ONLY valid JSON:
{
  "passes_quality": true or false,
  "critique": "one sentence explanation",
  "improved_version": "refined version of the question if it fails, else null"
}
`;

  const fallback = { passes_quality: true, critique: "Question meets quality standards.", improved_version: null };

  const raw = await generateCompletion(prompt, systemInstruction);
  if (!raw) return { selfCritique: "Skipped (no LLM key)", questionRefined: false };

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned.substring(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1));

    if (!parsed.passes_quality && parsed.improved_version) {
      return {
        selfCritique: parsed.critique,
        nextQuestion: parsed.improved_version,
        questionRefined: true
      };
    }

    return { selfCritique: parsed.critique, questionRefined: false };
  } catch {
    return { selfCritique: fallback.critique, questionRefined: false };
  }
}

// ============================================================
// CONDITIONAL ROUTING FUNCTIONS
// ============================================================

/**
 * Route after BeliefUpdateNode based on calibration & evaluation evidence.
 */
function routeAfterBelief(state) {
  const { calibration, evaluation, questionNumber, history } = state;
  const delta = calibration?.calibrationDelta || 0;
  const accuracy = evaluation?.accuracy || 0.5;
  const numQuestions = questionNumber || 1;

  // Check session completion gate (min 8 questions)
  if (numQuestions >= 8) {
    return "complete";
  }

  // High overconfidence → ThinkingNode to form attack hypothesis
  if (delta > 1.0 || (delta > 0.5 && accuracy < 0.5)) {
    return "think";
  }

  // Misconception detected → ThinkingNode for recovery probing
  if (evaluation?.misconception && evaluation.misconception !== "null" && evaluation.misconception !== null) {
    return "think";
  }

  // Normal flow → Planner
  return "plan";
}

/**
 * Route after SelfCritiqueNode.
 * If question was refined, skip second critique (prevent infinite loop).
 * Otherwise, always send final question out.
 */
function routeAfterCritique(state) {
  // Always proceed after one critique pass
  return "output";
}

// ============================================================
// GRAPH ASSEMBLY
// ============================================================

export function buildInterviewGraph() {
  const graph = new StateGraph(InterviewStateAnnotation)
    .addNode("evaluate", evaluatorNode)
    .addNode("calibrate", calibrationNode)
    .addNode("update_belief", beliefUpdateNode)
    .addNode("think", thinkingNode)
    .addNode("plan", plannerNode)
    .addNode("critique", selfCritiqueNode)
    .addEdge("__start__", "evaluate")
    .addEdge("evaluate", "calibrate")
    .addEdge("calibrate", "update_belief")
    .addConditionalEdges("update_belief", routeAfterBelief, {
      think: "think",
      plan: "plan",
      complete: "__end__"
    })
    .addEdge("think", "plan")
    .addEdge("plan", "critique")
    .addConditionalEdges("critique", routeAfterCritique, {
      output: "__end__"
    });

  return graph.compile();
}
