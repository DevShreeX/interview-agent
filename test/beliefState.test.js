import test from "node:test";
import assert from "node:assert/strict";
import { getInitialBeliefState, updateBeliefState, getWeakestTopic } from "../src/services/beliefStateEngine.js";

test("Belief State Engine — Initial State", () => {
  const state = getInitialBeliefState();
  assert.equal(state.rag, 0.5);
  assert.equal(state.agents, 0.5);
  assert.equal(state.mcp, 0.5);
  assert.equal(state.system_design, 0.5);
  assert.equal(state.deployment, 0.5);
});

test("Belief State Engine — High score updates belief up", () => {
  const initial = getInitialBeliefState();
  const res = updateBeliefState(initial, { topic: "system_design", accuracy: 1.0, depth: "deep" });
  assert.ok(res.newScore > 0.5);
  assert.equal(res.updatedTopic, "system_design");
});

test("Belief State Engine — Weak score updates belief down", () => {
  const initial = getInitialBeliefState();
  const res = updateBeliefState(initial, { topic: "deployment", accuracy: 0.1, depth: "surface" });
  assert.ok(res.newScore < 0.5);
  assert.equal(res.updatedTopic, "deployment");
});

test("Belief State Engine — Identify Weakest Topic", () => {
  const state = {
    rag: 0.8,
    agents: 0.6,
    mcp: 0.7,
    system_design: 0.35,
    deployment: 0.5
  };
  const weakest = getWeakestTopic(state);
  assert.equal(weakest.topic, "system_design");
  assert.equal(weakest.score, 0.35);
});
