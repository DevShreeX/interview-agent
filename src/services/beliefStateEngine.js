/**
 * Belief State Engine (Section 8 of 02_AI_BACKEND.md)
 * Maintains candidate mastery probabilities across technical topics.
 */

export const DEFAULT_DOMAINS = ["rag", "agents", "mcp", "system_design", "deployment"];

export function getInitialBeliefState() {
  return {
    rag: 0.50,
    agents: 0.50,
    mcp: 0.50,
    system_design: 0.50,
    deployment: 0.50
  };
}

/**
 * Update belief state vector based on evaluated answer evidence.
 */
export function updateBeliefState(currentBelief = getInitialBeliefState(), { topic = "system_design", accuracy = 0.5, depth = "structured" }) {
  const updated = { ...currentBelief };
  const topicKey = (topic || "system_design").toLowerCase().replace(/[\s-]/g, "_");

  // Determine target topic key or map to nearest domain
  let targetKey = DEFAULT_DOMAINS.find(d => topicKey.includes(d)) || topicKey;

  const oldVal = updated[targetKey] !== undefined ? updated[targetKey] : 0.5;

  // Depth weight signal adjustment
  let depthWeight = 0.85;
  if (depth === "deep") depthWeight = 1.0;
  if (depth === "surface") depthWeight = 0.6;

  const signal = accuracy * depthWeight;
  const alpha = 0.35; // Update rate

  const newVal = Number((oldVal * (1 - alpha) + signal * alpha).toFixed(2));
  updated[targetKey] = Math.min(1.0, Math.max(0.0, newVal));

  return {
    beliefState: updated,
    updatedTopic: targetKey,
    previousScore: oldVal,
    newScore: updated[targetKey]
  };
}

export function getWeakestTopic(beliefState = getInitialBeliefState()) {
  let weakest = null;
  let minScore = 2.0;

  for (const [topic, score] of Object.entries(beliefState)) {
    if (score < minScore) {
      minScore = score;
      weakest = topic;
    }
  }

  return { topic: weakest || "system_design", score: minScore === 2.0 ? 0.5 : minScore };
}
