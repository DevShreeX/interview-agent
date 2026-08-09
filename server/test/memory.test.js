import test from "node:test";
import assert from "node:assert/strict";
import { getOrCreateCandidateMemory, recordSessionToMemory, recordBattleToMemory, getPlannerMemoryContext, clearMemoryStore } from "../src/services/breetheMemory.js";

test("Breethe Memory — Cross-Session Growth Trajectory & Stale Topics", () => {
  clearMemoryStore();

  const candidateId = "cand_test_99";

  // Session 1
  recordSessionToMemory(candidateId, {
    readiness: 58,
    beliefState: { system_design: 0.48, rag: 0.7 },
    calibrationSummary: { averageDelta: 1.7 },
    weakestTopic: "system_design"
  });

  let mem = getOrCreateCandidateMemory(candidateId);
  assert.equal(mem.interviewCount, 1);
  assert.equal(mem.growthTrajectory.length, 1);
  assert.equal(mem.growthTrajectory[0].readiness, 58);
  assert.equal(mem.growthTrajectory[0].averageCalibrationDelta, 1.7);
  assert.ok(mem.staleTopics.includes("system_design"));

  // Session 2
  recordSessionToMemory(candidateId, {
    readiness: 64,
    beliefState: { system_design: 0.61, rag: 0.7 },
    calibrationSummary: { averageDelta: 1.1 },
    weakestTopic: "system_design"
  });

  mem = getOrCreateCandidateMemory(candidateId);
  assert.equal(mem.interviewCount, 2);
  assert.equal(mem.growthTrajectory[1].readiness, 64);
  assert.equal(mem.growthTrajectory[1].averageCalibrationDelta, 1.1);

  // Battle Mode Recovery
  recordBattleToMemory(candidateId, {
    weakestTopic: "system_design",
    beforeScore: 0.48,
    afterScore: 0.64,
    riskChange: 16
  });

  mem = getOrCreateCandidateMemory(candidateId);
  assert.equal(mem.battleRecoveryHistory.length, 1);
  assert.equal(mem.battleRecoveryHistory[0].riskChange, 16);

  // Planner Memory Context
  const context = getPlannerMemoryContext(candidateId);
  assert.equal(context.interviewCount, 2);
  assert.ok(context.contextMessage.includes("Candidate has completed 2 previous interview(s)"));
});
