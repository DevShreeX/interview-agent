import { StateGraph } from "@langchain/langgraph";
import { evaluateAnswer } from "../agents/evaluatorAgent.js";
import { generateBattleQuestion } from "../agents/battleModeAgent.js";
import { generateCompletion } from "../config/llm.js";
import { BattleStateAnnotation } from "./graphState.js";
import { buildSystemPrompt } from "../config/promptRegistry.js";
import { logPrivacyAudit } from "../services/privacyAudit.js";

const PRESSURE_ANGLES = [
  "direct_technical_attack",
  "assumption_challenge",
  "trade_off_pressure",
  "failure_mode_deep_dive",
  "scaling_and_recovery"
];

/**
 * NODE 1: Battle Evaluator Node
 * Evaluates the candidate's answer during Battle Mode.
 */
async function battleEvaluatorNode(state) {
  const { currentQuestion, currentAnswer, personaId, battleId } = state;
  if (!currentAnswer) return {};

  logPrivacyAudit({ sessionId: battleId, agentType: "graph:battle_evaluator", promptId: "EVALUATOR_V1", topic: state.weakestTopic, questionNumber: state.questionNumber });

  const evaluation = await evaluateAnswer({
    question: currentQuestion,
    answer: currentAnswer,
    persona: personaId,
    sessionId: battleId
  });

  const updatedHistory = [
    ...(state.history || []),
    {
      questionNumber: state.questionNumber,
      question: currentQuestion,
      answer: currentAnswer,
      evaluation
    }
  ];

  return { evaluation, history: updatedHistory };
}

/**
 * NODE 2: Battle Pressure Routing Node
 * Analyzes the evaluation and decides the next pressure angle.
 */
async function battlePressureRoutingNode(state) {
  const { evaluation, questionNumber, history, weakestTopic, battleId } = state;

  logPrivacyAudit({ sessionId: battleId, agentType: "graph:battle_pressure_router", promptId: "BATTLE_V1", topic: weakestTopic, questionNumber });

  const stepIdx = Math.min((questionNumber || 1) - 1, PRESSURE_ANGLES.length - 1);
  const angle = PRESSURE_ANGLES[stepIdx];

  const systemInstruction = buildSystemPrompt(["MASTER_V1", "BATTLE_V1"]);

  const prompt = `
BATTLE MODE — INTERNAL PRESSURE ROUTING — NOT FOR CANDIDATE

Topic Under Attack: ${weakestTopic}
Question Number: ${questionNumber} / 5
Pressure Angle for This Step: ${angle.replace(/_/g, " ")}

Last Answer Evaluation:
- Accuracy: ${evaluation?.accuracy}
- Depth: ${evaluation?.depth}
- Concepts Missed: ${JSON.stringify(evaluation?.concepts_missed)}
- Misconception: ${evaluation?.misconception || "none"}

Decide the pressure posture for the next question:
{
  "pressure_angle": "${angle}",
  "escalate": true or false,
  "rationale": "one sentence explaining why this angle targets the identified weakness"
}
`;

  const fallback = { pressure_angle: angle, escalate: true, rationale: `Targeting ${weakestTopic} with ${angle.replace(/_/g, " ")}.` };

  const raw = await generateCompletion(prompt, systemInstruction);
  let pressureAngle = angle;

  if (raw) {
    try {
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned.substring(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1));
      pressureAngle = parsed.pressure_angle || angle;
    } catch { /* use fallback */ }
  }

  return { pressureAngle };
}

/**
 * NODE 3: Battle Question Generator Node
 * Generates the next targeted pressure question.
 */
async function battleQuestionGeneratorNode(state) {
  const { weakestTopic, personaId, questionNumber, history, pressureAngle, battleId } = state;

  logPrivacyAudit({ sessionId: battleId, agentType: "graph:battle_question_gen", promptId: "BATTLE_V1", topic: weakestTopic, questionNumber });

  const nextQuestion = await generateBattleQuestion({
    battleSession: {
      battleId,
      weakestTopic,
      persona: personaId,
      questionNumber: (questionNumber || 1) + 1,
      history: history || []
    },
    personaId
  });

  return { nextQuestion: nextQuestion };
}

/**
 * NODE 4: Battle Self-Critique Node
 * Critiques the generated battle question before delivery.
 */
async function battleSelfCritiqueNode(state) {
  const { nextQuestion, weakestTopic, history, battleId } = state;

  const alreadyAsked = (history || []).map(h => h.question).join(" | ");

  const systemInstruction = buildSystemPrompt(["MASTER_V1"]);

  const prompt = `
BATTLE MODE SELF-CRITIQUE — INTERNAL ONLY

Proposed Pressure Question: "${nextQuestion}"
Target Weakness: ${weakestTopic}
Previous Battle Questions: ${alreadyAsked || "(none)"}

Quality gates:
1. Does it directly target the weakness?
2. Is it a follow-up probe (not a repeat)?
3. Does it apply real pressure without revealing the rubric?

Return ONLY valid JSON:
{
  "passes_quality": true or false,
  "improved_version": "refined question if fails, else null"
}
`;

  const raw = await generateCompletion(prompt, systemInstruction);
  if (!raw) return { selfCritique: "Skipped", questionRefined: false };

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned.substring(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1));

    if (!parsed.passes_quality && parsed.improved_version) {
      return { currentQuestion: parsed.improved_version, questionRefined: true };
    }
  } catch { /* use original */ }

  return { currentQuestion: nextQuestion, questionRefined: false };
}

// ============================================================
// CONDITIONAL ROUTING
// ============================================================

function routeAfterBattleEval(state) {
  const nextQNum = (state.questionNumber || 1) + 1;
  if (nextQNum > 5 || state.completed) {
    return "complete";
  }
  return "route_pressure";
}

function routeAfterCritique(state) {
  return "output";
}

// ============================================================
// GRAPH ASSEMBLY
// ============================================================

export function buildBattleGraph() {
  const graph = new StateGraph(BattleStateAnnotation)
    .addNode("battle_evaluate", battleEvaluatorNode)
    .addNode("route_pressure", battlePressureRoutingNode)
    .addNode("generate_question", battleQuestionGeneratorNode)
    .addNode("battle_critique", battleSelfCritiqueNode)
    .addEdge("__start__", "battle_evaluate")
    .addConditionalEdges("battle_evaluate", routeAfterBattleEval, {
      route_pressure: "route_pressure",
      complete: "__end__"
    })
    .addEdge("route_pressure", "generate_question")
    .addEdge("generate_question", "battle_critique")
    .addConditionalEdges("battle_critique", routeAfterCritique, {
      output: "__end__"
    });

  return graph.compile();
}
