import test from "node:test";
import assert from "node:assert/strict";
import { getInitialBeliefState, updateBeliefState, getWeakestTopic } from "../src/services/beliefStateEngine.js";

test("Belief State Engine — Initial State", () => {
  const state = getInitialBeliefState();
  assert.equal(state.env_tooling, 0.5);
  assert.equal(state.data_foundations, 0.5);
  assert.equal(state.embeddings_vector, 0.5);
  assert.equal(state.llm_prompting, 0.5);
  assert.equal(state.chatbot_build, 0.5);
  assert.equal(state.agentic_mcp, 0.5);
  assert.equal(state.eval_security_deploy, 0.5);
  assert.equal(state.production_capstone, 0.5);
});

test("Belief State Engine — High score updates belief up", () => {
  const initial = getInitialBeliefState();
  const res = updateBeliefState(initial, { topic: "ChromaDB", accuracy: 1.0, depth: "deep" });
  assert.ok(res.newScore > 0.5);
  assert.equal(res.updatedTopic, "embeddings_vector");
});

test("Belief State Engine — Weak score updates belief down", () => {
  const initial = getInitialBeliefState();
  const res = updateBeliefState(initial, { topic: "Docker", accuracy: 0.1, depth: "surface" });
  assert.ok(res.newScore < 0.5);
  assert.equal(res.updatedTopic, "eval_security_deploy");
});

test("Belief State Engine — Identify Weakest Topic", () => {
  const state = {
    env_tooling: 0.8,
    data_foundations: 0.6,
    embeddings_vector: 0.7,
    llm_prompting: 0.35,
    eval_security_deploy: 0.5
  };
  const weakest = getWeakestTopic(state);
  assert.equal(weakest.topic, "llm_prompting");
  assert.equal(weakest.score, 0.35);
});
