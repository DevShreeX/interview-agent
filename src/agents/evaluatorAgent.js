import { generateStructuredJSON } from "../config/llm.js";

/**
 * Evaluator Agent (Section 4 of 02_AI_BACKEND.md)
 * Evaluates candidate technical answers objectively without inventing evidence.
 */

export async function evaluateAnswer({ question, answer, targetRole = "AI Engineer", persona = "alex" }) {
  const prompt = `
Target Role: ${targetRole}
Interviewer Question: "${question}"
Candidate Answer: "${answer}"

Evaluate the candidate's answer with extreme technical precision.
Accuracy levels:
- 1.0 = completely correct
- 0.7 = mostly correct
- 0.5 = partially correct
- 0.3 = surface understanding
- 0.0 = incorrect/no meaningful answer

Depth options: "deep", "structured", "surface"

Required schema:
{
  "accuracy": number (0.0, 0.3, 0.5, 0.7, or 1.0),
  "depth": "deep" | "structured" | "surface",
  "explanation": "concise objective assessment of the answer",
  "concepts_hit": ["array of correctly identified technical concepts"],
  "concepts_missed": ["array of expected key concepts that were omitted or incorrect"],
  "follow_up": "suggested follow-up probing question testing depth",
  "follow_up_angle": "WHY" | "trade-offs" | "failure modes" | "scaling" | "deployment" | "edge cases",
  "evidence_quote": "direct verbatim quote from candidate answer demonstrating mastery or flaw",
  "misconception": "string describing misconception if any, else null"
}
`;

  const fallback = {
    accuracy: answer.length > 50 ? 0.7 : 0.4,
    depth: answer.length > 100 ? "structured" : "surface",
    explanation: "Candidate provided a basic answer to the technical question.",
    concepts_hit: ["core concepts"],
    concepts_missed: ["edge case handling", "production trade-offs"],
    follow_up: "What failure modes should we anticipate under peak load?",
    follow_up_angle: "failure modes",
    evidence_quote: answer.substring(0, 100),
    misconception: null
  };

  const result = await generateStructuredJSON(
    prompt,
    "You are a rigorous technical evaluator. Never invent evidence. Be strictly objective.",
    fallback
  );

  return result;
}
