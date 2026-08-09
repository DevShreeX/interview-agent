import { generateStructuredJSON } from "../config/llm.js";

/**
 * Reporter Agent (Section 13 of 02_AI_BACKEND.md)
 * Compiles comprehensive candidate intelligence report upon interview completion.
 */

export async function generateSessionReport({ session, calibrationSummary, thinkingStyle, breakpoint, weakestTopicInfo }) {
  // Convert belief state decimals to percentages for skill radar
  const skillRadar = {};
  for (const [topic, score] of Object.entries(session.beliefState || {})) {
    skillRadar[topic] = Math.round(score * 100);
  }

  // Calculate overall readiness score based on belief state average
  const scores = Object.values(skillRadar);
  const avgSkill = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 50;
  const readiness = Math.min(98, Math.max(20, avgSkill));

  const prompt = `
Generate a final Interview Intelligence Report for session ${session.sessionId}.

Target Role: ${session.targetRole}
Readiness Score calculated: ${readiness}%
Skill Radar: ${JSON.stringify(skillRadar)}
Calibration Summary: ${JSON.stringify(calibrationSummary)}
Thinking Style: ${JSON.stringify(thinkingStyle)}
Predicted Breakpoint: ${JSON.stringify(breakpoint)}

History Summary:
${JSON.stringify(session.history.map(h => ({
    q: h.question,
    accuracy: h.evaluation?.accuracy,
    conceptsHit: h.evaluation?.concepts_hit,
    conceptsMissed: h.evaluation?.concepts_missed
  })), null, 2)}

Return ONLY valid JSON matching this schema:
{
  "readiness": ${readiness},
  "executive_summary": "3-4 sentence high-level executive summary of candidate readiness",
  "strengths": ["list of 2-3 specific demonstrated technical strengths"],
  "weaknesses": ["list of 2-3 specific demonstrated technical weaknesses"],
  "calibration": ${JSON.stringify(calibrationSummary)},
  "thinkingStyle": ${JSON.stringify(thinkingStyle)},
  "skillRadar": ${JSON.stringify(skillRadar)},
  "evidence": ["list of key evidence quotes from session"],
  "breakpoint": ${JSON.stringify(breakpoint)},
  "battleAvailable": true,
  "battleRecommendation": "Why candidate should enter Battle Mode for ${weakestTopicInfo.topic}",
  "learningPlan": ["3 concrete, non-generic learning actions (e.g. Explain vector-index failure modes and quantify latency trade-offs)"]
}
`;

  const fallback = {
    readiness,
    executive_summary: `Candidate demonstrated solid foundation in general software engineering with an overall readiness of ${readiness}%. Shows promise in system design but requires calibration on failure modes.`,
    strengths: ["Clear architectural communication", "Solid baseline understanding of system design"],
    weaknesses: [`Depth of failure-mode reasoning in ${weakestTopicInfo.topic || "system design"}`],
    calibration: calibrationSummary,
    thinkingStyle,
    skillRadar,
    evidence: session.history.map(h => h.evaluation?.evidence_quote).filter(Boolean).slice(0, 3),
    breakpoint,
    battleAvailable: true,
    battleRecommendation: `Recommended Battle Mode attack on ${weakestTopicInfo.topic} to stress-test failure modes.`,
    learningPlan: [
      `Quantify latency vs recall trade-offs for ${weakestTopicInfo.topic} in production.`,
      `Design zero-downtime failover mechanics for active agent state sessions.`,
      `Implement automated evaluation suites for non-deterministic model outputs.`
    ]
  };

  const report = await generateStructuredJSON(prompt, "You are a lead technical reporter generating candidate evaluation dossiers.", fallback);
  return report;
}
