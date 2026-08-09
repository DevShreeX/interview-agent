import { getModuleBeliefKeys, mapToolToModule } from "../data/curriculum.js";

/**
 * Belief State Engine (Section 8 of 02_AI_BACKEND.md)
 * Maintains candidate mastery probabilities across technical topics.
 */

export function getInitialBeliefState(moduleScope = null) {
  const keys = getModuleBeliefKeys();
  const state = {};

  if (moduleScope && typeof moduleScope === 'number') {
    // If scoped, initialize all to 0 except the scoped one to focus on it
    keys.forEach((k, idx) => { state[k] = (idx + 1 === moduleScope) ? 0.50 : 0.0; });
  } else {
    keys.forEach(k => { state[k] = 0.50; });
  }
  return state;
}

/**
 * Update belief state vector based on evaluated answer evidence.
 */
export function updateBeliefState(currentBelief = getInitialBeliefState(), { topic = "system_design", accuracy = 0.5, depth = "structured" }) {
  const updated = { ...currentBelief };

  // Try to map the topic to a curriculum module
  let targetKey = mapToolToModule(topic);

  // If not found in curriculum, fall back to best guess or default to llm_prompting
  if (!targetKey) {
    const topicKey = (topic || "system_design").toLowerCase().replace(/[\s-]/g, "_");
    const keys = getModuleBeliefKeys();
    targetKey = keys.find(k => topicKey.includes(k)) || keys.find(k => k.includes(topicKey)) || "llm_prompting";
  }

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
    // ignore topics that weren't being tracked (score = 0.0)
    if (score > 0.0 && score < minScore) {
      minScore = score;
      weakest = topic;
    }
  }

  return { topic: weakest || "llm_prompting", score: minScore === 2.0 ? 0.5 : minScore };
}
