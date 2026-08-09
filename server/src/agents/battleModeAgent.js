import { generateCompletion, generateStructuredJSON } from "../config/llm.js";
import { getPersona } from "../utils/personas.js";

/**
 * Battle Mode Engine & Agent (Section 11 & 12 of 02_AI_BACKEND.md)
 * Conducts a 5-question pressure sequence on candidate's weakest topic.
 */

const PRESSURE_STEPS = [
  "Technical question targeted at weakness",
  "Counter-question probing assumption",
  "Trade-off analysis",
  "Failure mode under load",
  "Recovery & architecture resilience"
];

export async function generateBattleQuestion({ battleSession, personaId = "alex" }) {
  const persona = getPersona(personaId);
  const stepIdx = Math.min(battleSession.questionNumber - 1, PRESSURE_STEPS.length - 1);
  const currentStep = PRESSURE_STEPS[stepIdx];

  const prompt = `
BATTLE MODE — PRESSURE QUESTION #${battleSession.questionNumber} of 5
Weakest Topic: ${battleSession.weakestTopic}
Pressure Focus for this question: ${currentStep}

Previous Battle History:
${JSON.stringify(battleSession.history.map((h, i) => ({ q: h.question, a: h.answer })), null, 2)}

Generate the next pressure question.
Rules:
- Ask exactly ONE direct, high-pressure technical counter-question.
- Test whether the candidate truly understands or relies on surface-level hand-waving.
- Sound like a senior engineering lead conducting an intensive architecture review.
- Maximum 3 sentences.
`;

  const questionText = await generateCompletion(prompt, persona.systemPrompt);

  if (questionText) return questionText.trim();

  // Fallback pressure questions
  const fallbacks = [
    `In your ${battleSession.weakestTopic} design, what specific bottle-necks emerge when traffic spikes 10x unexpectedly?`,
    `If write latency increases by 500ms in that architecture, how do you prevent cascading failures across downstream services?`,
    `What consistency trade-offs are you making here, and why is your approach superior to standard replication?`,
    `When that node fails silently during peak hours, how does the system detect and recover without data corruption?`,
    `How would you redesign this component from scratch if hardware budget was reduced by 50%?`
  ];

  return fallbacks[stepIdx] || fallbacks[0];
}

export async function calculateBattleResults({ battleSession }) {
  const initialScore = Math.round((battleSession.beforeScore || 0.4) * 100);

  const prompt = `
Analyze the 5-question Battle Mode session on the topic "${battleSession.weakestTopic}".

Battle Session History:
${JSON.stringify(battleSession.history, null, 2)}

Initial Topic Score: ${initialScore}%

Evaluate performance and calculate recovery score. Return ONLY valid JSON matching this schema:
{
  "before_score": ${initialScore},
  "after_score": number (0 to 100),
  "recovered_concepts": ["array of concepts successfully demonstrated during pressure"],
  "remaining_weakness": "string summarizing remaining gaps",
  "next_learning_action": "concrete actionable recommendation (e.g. Implement index rebuild benchmarks)",
  "risk_change": number (difference between after_score and before_score, e.g. +16)
}
`;

  const fallback = {
    before_score: initialScore,
    after_score: Math.min(100, initialScore + 15),
    recovered_concepts: ["Failure mode mitigation", "Resilience principles"],
    remaining_weakness: "Deep quantitative latency trade-off benchmarking",
    next_learning_action: `Benchmark latency/quality trade-offs under simulated network partitions for ${battleSession.weakestTopic}.`,
    risk_change: 15
  };

  const result = await generateStructuredJSON(prompt, "You are a senior Battle Mode evaluator.", fallback);
  return result;
}
