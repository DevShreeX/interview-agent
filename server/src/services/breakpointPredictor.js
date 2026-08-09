import { generateStructuredJSON } from "../config/llm.js";

/**
 * Breakpoint Predictor (Section 10 of 02_AI_BACKEND.md)
 * Predicts the candidate's highest-risk failure point and likely breaking scenarios.
 */

export async function predictBreakpoint(history = [], beliefState = {}, weakestTopicInfo = {}) {
  const prompt = `
Analyze candidate evaluation evidence and belief state mastery to predict their Breakpoint (highest-risk technical failure point).

Candidate Weakest Topic: ${weakestTopicInfo.topic} (score: ${weakestTopicInfo.score})
Belief State Map: ${JSON.stringify(beliefState)}

Evaluation Evidence Log:
${JSON.stringify(history.map(h => ({
    q: h.question,
    a: h.answer,
    accuracy: h.evaluation?.accuracy,
    misconception: h.evaluation?.misconception,
    conceptsMissed: h.evaluation?.concepts_missed
  })), null, 2)}

Return ONLY valid JSON matching this exact schema:
{
  "weakness": "short description of demonstrated weakness",
  "evidence": ["list of evidence quotes or question references"],
  "predicted_breakpoint": "specific production scenario likely to expose candidate breakpoint",
  "highest_risk_failure_point": "single critical risk factor (e.g. failure-mode reasoning under latency constraints)",
  "likely_pass_scenario": "scenario candidate is most likely to ace",
  "confidence": number (0.0 to 1.0)
}
`;

  const fallback = {
    weakness: `Lack of deep structural understanding in ${weakestTopicInfo.topic || "system design"}.`,
    evidence: history.slice(0, 2).map(h => h.question),
    predicted_breakpoint: `Production scale outage recovery and edge-case handling in ${weakestTopicInfo.topic || "system design"}.`,
    highest_risk_failure_point: "Failure-mode and trade-off reasoning under real-world pressure.",
    likely_pass_scenario: "Standard high-level architecture overview.",
    confidence: 0.75
  };

  const result = await generateStructuredJSON(prompt, "You are a senior technical assessor specializing in technical breakpoint prediction.", fallback);
  return result;
}
