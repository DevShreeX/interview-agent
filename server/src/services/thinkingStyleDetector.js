import { generateStructuredJSON } from "../config/llm.js";

/**
 * Thinking Style Detector (Section 9 of 02_AI_BACKEND.md)
 */

export const THINKING_STYLES = [
  "First Principles",
  "Pattern Matcher",
  "Framework Applier",
  "Intuition Led",
  "Uncertainty Aware",
  "Overclaimer"
];

export async function detectThinkingStyle(history = [], calibrationSummary = {}) {
  if (!history || history.length === 0) {
    return {
      primary_style: "Framework Applier",
      confidence: 0.5,
      evidence_phrase: "Initial assessment based on baseline setup.",
      interview_implication: "Requires further technical question evaluations to establish candidate patterns."
    };
  }

  const prompt = `
Analyze the candidate's interview responses and calibration deltas to determine their primary technical thinking style.

Candidates history:
${JSON.stringify(history.map((h, i) => ({
    q: h.question,
    a: h.answer,
    confidence: h.confidence,
    accuracy: h.evaluation?.accuracy,
    depth: h.evaluation?.depth,
    evidenceQuote: h.evaluation?.evidence_quote
  })), null, 2)}

Overall Calibration Status: ${calibrationSummary.overallStatus} (average delta: ${calibrationSummary.averageDelta})

Choose EXACTLY ONE primary thinking style from:
- First Principles (deconstructs problems to fundamental truths, architectural mechanics)
- Pattern Matcher (relies heavily on known blueprints and previous experiences)
- Framework Applier (reaches for high-level tools, libraries, or methodologies first)
- Intuition Led (uses gut feel and heuristic guesses rather than structured analysis)
- Uncertainty Aware (explicitly states assumptions, edge cases, and confidence boundaries)
- Overclaimer (claims high confidence on concepts with low demonstrated accuracy)

Return ONLY valid JSON matching this schema:
{
  "primary_style": "string",
  "confidence": number (0.0 to 1.0),
  "evidence_phrase": "exact string or quote from candidate supporting this classification",
  "interview_implication": "concise 1-sentence note for senior interviewers on how to push candidate further"
}
`;

  const fallback = {
    primary_style: calibrationSummary.overallStatus === "high_overconfidence" ? "Overclaimer" : "Pattern Matcher",
    confidence: 0.7,
    evidence_phrase: history[0]?.answer?.substring(0, 80) || "Based on candidate answer structure.",
    interview_implication: "Test trade-off choices and failure modes under pressure."
  };

  const result = await generateStructuredJSON(prompt, "You are an expert technical interviewer analyzing candidate cognitive patterns.", fallback);
  return result;
}
