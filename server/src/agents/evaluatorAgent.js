import { generateStructuredJSON } from "../config/llm.js";
import { buildSystemPrompt } from "../config/promptRegistry.js";
import { logPrivacyAudit } from "../services/privacyAudit.js";

/**
 * Evaluator Agent (Section 4 of 02_AI_BACKEND.md & Section 13 of 03_MEMORY_PRIVACY_PROMPTS.md)
 */

export async function evaluateAnswer({ question, answer, targetRole = "AI Engineer", persona = "alex", sessionId = "sess_eval", curriculumObjectives = [] }) {
  logPrivacyAudit({
    sessionId,
    agentType: "evaluator",
    promptId: "EVALUATOR_V1",
    promptVersion: "1.0.0",
    topic: "answer_evaluation",
    questionNumber: 1,
    fieldsUsed: ["question", "answer", "targetRole", "curriculumObjectives"],
    estimatedTokens: 180
  });

  const systemInstruction = buildSystemPrompt([
    "MASTER_V1",
    "PRIVACY_WRAPPER_V1",
    "ANTI_HALLUCINATION_V1",
    "EVALUATOR_V1",
    "UNIVERSAL_OUTPUT_RULE"
  ]);

  const objectivesContext = curriculumObjectives && curriculumObjectives.length > 0 
    ? `\nCurriculum Objectives Being Tested:\n${curriculumObjectives.map(o => "- " + o).join("\n")}`
    : "";

  const prompt = `
Target Role: ${targetRole}
Interviewer Question: "${question}"
Candidate Answer: "${answer}"
${objectivesContext}

Evaluate the candidate's answer with extreme technical precision.
Accuracy levels: 1.0 (completely correct), 0.7 (mostly correct), 0.5 (partially correct), 0.3 (surface understanding), 0.0 (incorrect).
Depth options: "deep", "structured", "surface"

Required JSON schema:
{
  "accuracy": number (0.0, 0.3, 0.5, 0.7, or 1.0),
  "depth": "deep" | "structured" | "surface",
  "explanation": "concise objective assessment",
  "concepts_hit": ["array of correctly identified concepts"],
  "concepts_missed": ["array of omitted/incorrect concepts"],
  "objectives_hit": ["array of exact curriculum objectives the candidate successfully addressed (if any)"],
  "follow_up": "suggested follow-up question testing depth",
  "follow_up_angle": "WHY" | "trade-offs" | "failure modes" | "scaling" | "deployment" | "edge cases",
  "evidence_quote": "verbatim quote from candidate answer",
  "misconception": "string describing misconception if any, else null"
}
`;

  const fallback = {
    accuracy: answer.length > 50 ? 0.7 : 0.4,
    depth: answer.length > 100 ? "structured" : "surface",
    explanation: "Candidate provided a basic answer to the technical question.",
    concepts_hit: ["core concepts"],
    concepts_missed: ["edge case handling", "production trade-offs"],
    objectives_hit: [],
    follow_up: "What failure modes should we anticipate under peak load?",
    follow_up_angle: "failure modes",
    evidence_quote: answer.substring(0, 100),
    misconception: null
  };

  const result = await generateStructuredJSON(
    prompt,
    systemInstruction,
    fallback
  );

  return result;
}
