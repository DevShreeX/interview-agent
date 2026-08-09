import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "../src/server.js";
import { createInterviewSession } from "../src/data/sessionStore.js";

test("Interview Controller - /continue validation errors", async () => {
  let res = await request(app).post("/api/interview/continue").send({});
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error, "sessionId and answer are required.");

  res = await request(app).post("/api/interview/continue").send({ sessionId: "fake", answer: "test" });
  assert.strictEqual(res.status, 404);
  assert.strictEqual(res.body.error, "Session not found.");
});

test("Interview Controller - /complete validation errors", async () => {
  let res = await request(app).post("/api/interview/complete").send({});
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error, "sessionId is required.");

  res = await request(app).post("/api/interview/complete").send({ sessionId: "fake" });
  assert.strictEqual(res.status, 404);
  assert.strictEqual(res.body.error, "Session not found.");
});

test("Interview Controller - /battle/turn validation errors", async () => {
  let res = await request(app).post("/api/battle/turn").send({});
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error, "sessionId is required.");

  res = await request(app).post("/api/battle/turn").send({ sessionId: "fake", answer: "test" });
  assert.strictEqual(res.status, 404);
  assert.strictEqual(res.body.error, "Interview session not found.");
});

test("Interview Controller - Session completed error", async () => {
  // Create a real session and mark it completed
  const session = createInterviewSession({ persona: "alex", targetRole: "AI Engineer" });
  session.completed = true;
  
  const res = await request(app).post("/api/interview/continue").send({ sessionId: session.sessionId, answer: "test" });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error, "Session is already completed. Call /api/interview/complete.");
});

test("Battle Controller - Initializing battle session without answer", async () => {
  const session = createInterviewSession({ persona: "alex", targetRole: "AI Engineer" });
  const res = await request(app).post("/api/battle/turn").send({ sessionId: session.sessionId });
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.question);
  
  // Test missing answer when battle session exists
  const res2 = await request(app).post("/api/battle/turn").send({ sessionId: session.sessionId });
  assert.strictEqual(res2.status, 400);
  assert.strictEqual(res2.body.error, "answer is required for a battle turn.");
  
  // Test already completed battle
  session.battleSession.completed = true;
  const res3 = await request(app).post("/api/battle/turn").send({ sessionId: session.sessionId, answer: "test" });
  assert.strictEqual(res3.status, 400);
  assert.strictEqual(res3.body.error, "Battle session already completed.");
});
