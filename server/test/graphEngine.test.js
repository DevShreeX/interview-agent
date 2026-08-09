/**
 * TASK-005: LangGraph Self-Thinking Engine — Smoke Test
 * Tests that the interview graph compiles and runs a minimal state transition.
 */

import test from "node:test";
import assert from "node:assert/strict";

test("TASK-005: interviewGraph — StateGraph compiles without error", async () => {
  const { buildInterviewGraph } = await import("../src/graphs/interviewGraph.js");
  const graph = buildInterviewGraph();
  assert.ok(graph, "StateGraph compiled successfully");
  assert.strictEqual(typeof graph.invoke, "function", "Graph exposes .invoke()");
});

test("TASK-005: battleGraph — StateGraph compiles without error", async () => {
  const { buildBattleGraph } = await import("../src/graphs/battleGraph.js");
  const graph = buildBattleGraph();
  assert.ok(graph, "Battle StateGraph compiled successfully");
  assert.strictEqual(typeof graph.invoke, "function", "Battle graph exposes .invoke()");
});

test("TASK-005: graphState — InterviewStateAnnotation exports both annotations", async () => {
  const { InterviewStateAnnotation, BattleStateAnnotation } = await import("../src/graphs/graphState.js");
  assert.ok(InterviewStateAnnotation, "InterviewStateAnnotation exported");
  assert.ok(BattleStateAnnotation, "BattleStateAnnotation exported");
});

test("TASK-005: graphInterviewController — exports all four handlers", async () => {
  const mod = await import("../src/controllers/graphInterviewController.js");
  assert.strictEqual(typeof mod.startInterview, "function", "startInterview exported");
  assert.strictEqual(typeof mod.continueInterview, "function", "continueInterview exported");
  assert.strictEqual(typeof mod.completeInterview, "function", "completeInterview exported");
  assert.strictEqual(typeof mod.battleGraphTurn, "function", "battleGraphTurn exported");
});
