import { getInitialBeliefState } from "./beliefStateEngine.js";

// Global candidate memory store (keyed by candidate ID or default candidate)
const memoryStore = new Map();

const BREETH_API_BASE = "https://api.thebreeth.com/v1";

function getApiKey() {
  return process.env.MEMORY_API_KEY || process.env.LLM_API_KEY || "";
}

/**
 * Official Breeth API: Save Episode (POST /v1/episodes)
 * @param {Array<{role: string, content: string}>} messages 
 */
export async function saveBreethEpisode(messages) {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === "your_memory_api_key_here" || apiKey === "your_api_key_here") {
    return null;
  }

  try {
    const res = await fetch(`${BREETH_API_BASE}/episodes`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages })
    });

    if (!res.ok) {
      console.warn(`[Breeth API Warning] POST /v1/episodes returned status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("[Breeth API Error] Failed to save episode:", error.message);
    return null;
  }
}

/**
 * Official Breeth API: Search Memory (POST /v1/search)
 * @param {string} query 
 * @param {number} limit 
 */
export async function searchBreethMemory(query, limit = 5) {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === "your_memory_api_key_here" || apiKey === "your_api_key_here") {
    return null;
  }

  try {
    const res = await fetch(`${BREETH_API_BASE}/search`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, limit })
    });

    if (!res.ok) {
      console.warn(`[Breeth API Warning] POST /v1/search returned status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("[Breeth API Error] Failed to search memory:", error.message);
    return null;
  }
}

export function getOrCreateCandidateMemory(candidateId = "default_candidate") {
  if (!memoryStore.has(candidateId)) {
    memoryStore.set(candidateId, {
      candidateId,
      interviewCount: 0,
      beliefState: getInitialBeliefState(),
      growthTrajectory: [],
      staleTopics: [],
      unresolvedWeaknesses: [],
      battleRecoveryHistory: [],
      lastSessionDate: null,
      metacognitiveTraits: []
    });
  }
  return memoryStore.get(candidateId);
}

/**
 * Record completed interview session into long-term Breethe memory.
 */
export function recordSessionToMemory(candidateId = "default_candidate", sessionSummary) {
  const memory = getOrCreateCandidateMemory(candidateId);

  memory.interviewCount += 1;
  memory.lastSessionDate = new Date().toISOString();

  // 1. Update belief state
  if (sessionSummary.beliefState) {
    memory.beliefState = { ...sessionSummary.beliefState };
  }

  // 2. Record Growth Trajectory entry
  const readiness = sessionSummary.readiness || Math.round(Object.values(memory.beliefState).reduce((a, b) => a + b, 0) / 8 * 100);
  const avgCalibrationDelta = sessionSummary.calibrationSummary?.averageDelta || 0;

  memory.growthTrajectory.push({
    sessionNumber: memory.interviewCount,
    readiness,
    averageCalibrationDelta: avgCalibrationDelta,
    date: memory.lastSessionDate
  });

  // 3. Detect Stale Topics & Unresolved Weaknesses
  const weakestTopic = sessionSummary.weakestTopic || "llm_prompting";
  if (!memory.unresolvedWeaknesses.includes(weakestTopic)) {
    memory.unresolvedWeaknesses.push(weakestTopic);
  }

  // Detect stale topics (topics tested least or with score < 0.55)
  const stale = [];
  for (const [topic, score] of Object.entries(memory.beliefState)) {
    if (score < 0.55 || topic === weakestTopic) {
      stale.push(topic);
    }
  }
  memory.staleTopics = [...new Set(stale)];

  // 4. Metacognitive traits
  if (sessionSummary.thinkingStyle?.primary_style) {
    if (!memory.metacognitiveTraits.includes(sessionSummary.thinkingStyle.primary_style)) {
      memory.metacognitiveTraits.push(sessionSummary.thinkingStyle.primary_style);
    }
  }

  memoryStore.set(candidateId, memory);

  // Sync session to Breeth Cloud API asynchronously if configured
  const messages = [
    { role: "user", content: `Candidate ${candidateId} completed interview session ${memory.interviewCount}. Demonstrated readiness: ${readiness}%, weakest topic: ${weakestTopic}.` },
    { role: "assistant", content: `Recorded session summary into Breeth memory for candidate ${candidateId}.` }
  ];
  saveBreethEpisode(messages).catch(() => {});

  return memory;
}

/**
 * Record completed Battle Mode recovery into Breethe memory.
 */
export function recordBattleToMemory(candidateId = "default_candidate", battleSummary) {
  const memory = getOrCreateCandidateMemory(candidateId);

  memory.battleRecoveryHistory.push({
    date: new Date().toISOString(),
    weakestTopic: battleSummary.weakestTopic,
    beforeScore: battleSummary.beforeScore,
    afterScore: battleSummary.afterScore,
    riskChange: battleSummary.riskChange
  });

  // If battle score improved significantly, remove from unresolved weaknesses
  if (battleSummary.riskChange > 10) {
    memory.unresolvedWeaknesses = memory.unresolvedWeaknesses.filter(w => w !== battleSummary.weakestTopic);
  }

  memoryStore.set(candidateId, memory);

  // Sync battle episode to Breeth Cloud API
  const messages = [
    { role: "user", content: `Candidate ${candidateId} underwent Battle Mode pressure test on ${battleSummary.weakestTopic}. Score moved from ${battleSummary.beforeScore} to ${battleSummary.afterScore}.` },
    { role: "assistant", content: `Battle recovery recorded. Risk change: ${battleSummary.riskChange}%.` }
  ];
  saveBreethEpisode(messages).catch(() => {});

  return memory;
}

/**
 * Formulate memory prompt context for the next interview planner.
 */
export function getPlannerMemoryContext(candidateId = "default_candidate") {
  const memory = getOrCreateCandidateMemory(candidateId);

  if (memory.interviewCount === 0) {
    return null;
  }

  const lastWeakness = memory.unresolvedWeaknesses[0] || "llm_prompting";
  const trajectoryStr = memory.growthTrajectory.map(g => `S${g.sessionNumber}: readiness ${g.readiness}% (calibration ${g.averageCalibrationDelta >= 0 ? '+' : ''}${g.averageCalibrationDelta})`).join(" -> ");

  return {
    interviewCount: memory.interviewCount,
    lastWeakness,
    staleTopics: memory.staleTopics,
    trajectoryStr,
    contextMessage: `Candidate has completed ${memory.interviewCount} previous interview(s). Last demonstrated weakness: ${lastWeakness.replace("_", " ")}. Previous trajectory: ${trajectoryStr}.`
  };
}

export function clearMemoryStore() {
  memoryStore.clear();
}

