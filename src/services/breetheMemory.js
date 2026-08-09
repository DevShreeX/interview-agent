import { getInitialBeliefState } from "./beliefStateEngine.js";

// Global candidate memory store (keyed by candidate ID or default candidate)
const memoryStore = new Map();

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
  const readiness = sessionSummary.readiness || Math.round(Object.values(memory.beliefState).reduce((a, b) => a + b, 0) / 5 * 100);
  const avgCalibrationDelta = sessionSummary.calibrationSummary?.averageDelta || 0;

  memory.growthTrajectory.push({
    sessionNumber: memory.interviewCount,
    readiness,
    averageCalibrationDelta: avgCalibrationDelta,
    date: memory.lastSessionDate
  });

  // 3. Detect Stale Topics & Unresolved Weaknesses
  const weakestTopic = sessionSummary.weakestTopic || "system_design";
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

  const lastWeakness = memory.unresolvedWeaknesses[0] || "system_design";
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
