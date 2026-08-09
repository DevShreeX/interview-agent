import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/server.js";

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

test("API Healthcheck — GET /api/health", async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
});

test("Full Interview & Battle Loop — E2E API Test", async () => {
  // 1. Start Interview
  const startRes = await fetch(`${baseUrl}/api/interview/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona: "alex", targetRole: "Senior AI Engineer" })
  });

  assert.equal(startRes.status, 200);
  const startBody = await startRes.json();
  assert.ok(startBody.sessionId);
  assert.ok(startBody.question);
  assert.equal(startBody.questionNumber, 1);

  const sessionId = startBody.sessionId;

  // 2. Continue Interview
  const continueRes = await fetch(`${baseUrl}/api/interview/continue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      answer: "I build RAG systems using HNSW vector indexing, hybrid BM25 re-ranking, and dynamic chunking with parent-document retrieval.",
      confidence: 4.5
    })
  });

  assert.equal(continueRes.status, 200);
  const continueBody = await continueRes.json();
  assert.equal(continueBody.questionNumber, 2);
  assert.ok(continueBody.question);

  // 3. Complete Interview
  const completeRes = await fetch(`${baseUrl}/api/interview/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId })
  });

  assert.equal(completeRes.status, 200);
  const completeBody = await completeRes.json();
  assert.ok(completeBody.readiness !== undefined);
  assert.ok(completeBody.calibration);
  assert.ok(completeBody.thinkingStyle);

  // 4. Get Full Report
  const reportRes = await fetch(`${baseUrl}/api/report/${sessionId}`);
  assert.equal(reportRes.status, 200);
  const reportBody = await reportRes.json();
  assert.ok(reportBody.skillRadar);
  assert.ok(reportBody.breakpoint);
  assert.ok(reportBody.learningPlan);

  // 5. Start Battle Mode
  const battleStartRes = await fetch(`${baseUrl}/api/battle/turn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId })
  });

  assert.equal(battleStartRes.status, 200);
  const battleStartBody = await battleStartRes.json();
  assert.ok(battleStartBody.battleId);
  assert.ok(battleStartBody.weakestTopic);

  const battleId = battleStartBody.battleId;

  // 6. Continue Battle Mode
  const battleContinueRes = await fetch(`${baseUrl}/api/battle/turn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      answer: "To handle 10x traffic spikes, I implement rate limiting, backpressure queues, and read-replica scaling."
    })
  });

  assert.equal(battleContinueRes.status, 200);
  const battleContinueBody = await battleContinueRes.json();
  assert.equal(battleContinueBody.questionNumber, 2);

  // 7. Complete Battle Mode (Since Graph auto-completes on 5 turns, we don't have a manual complete endpoint anymore,
  // we just simulate fetching report after battle turn or we can just assert it finishes after 5 turns.
  // For the purpose of this test, let's just make sure turn 2 worked and remove the complete endpoint call)
});
