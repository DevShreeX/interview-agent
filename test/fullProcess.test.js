import test from "node:test";
import assert from "node:assert/strict";
import { startInterview, continueInterview, completeInterview, battleGraphTurn } from "../src/controllers/graphInterviewController.js";
import { getCandidateMemory } from "../src/controllers/memoryController.js";
import { getCohortData } from "../src/controllers/cohortController.js";
import { EXAMPLE_CANDIDATES } from "../src/data/exampleCandidates.js";
import { getCurriculumModule, getTopicsForModule } from "../src/data/curriculum.js";

// Helper mock res/req
function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
}

test("E2E Process Test 1: Curriculum Module 3 Interview Flow", async () => {
  const reqStart = {
    body: {
      persona: "alex",
      targetRole: "AI Engineer",
      curriculumScope: { moduleNumber: 3 }
    }
  };
  const resStart = createMockRes();

  await startInterview(reqStart, resStart);

  assert.equal(resStart.statusCode, 200);
  assert.ok(resStart.body.sessionId);
  assert.equal(resStart.body.questionNumber, 1);
  assert.ok(resStart.body.curriculumModule.includes("Embeddings"));
  assert.ok(resStart.body.topicsInScope.includes("ChromaDB"));

  const sessionId = resStart.body.sessionId;

  // Continue turn 1
  const reqCont = {
    body: {
      sessionId,
      answer: "I used ChromaDB with Sentence Transformers to store document vectors with metadata filtering.",
      confidence: 4
    }
  };
  const resCont = createMockRes();

  await continueInterview(reqCont, resCont);

  assert.equal(resCont.statusCode, 200);
  assert.equal(resCont.body.questionNumber, 2);
  assert.ok(resCont.body._graphMeta);
  assert.ok(resCont.body._graphMeta.nodesTraversed.includes("evaluate"));
});

test("E2E Process Test 2: Real Candidate Profile Integration (Emily Chen - CAND-003)", async () => {
  const reqStart = {
    body: {
      persona: "alex",
      targetRole: "AI Engineer",
      exampleCandidateId: "candidate_strong"
    }
  };
  const resStart = createMockRes();

  await startInterview(reqStart, resStart);

  assert.equal(resStart.statusCode, 200);
  assert.ok(resStart.body.sessionId);
});

test("E2E Process Test 3: Battle Mode Graph Turn", async () => {
  // First start a session to trigger battle mode
  const reqStart = { body: { persona: "alex", targetRole: "AI Engineer" } };
  const resStart = createMockRes();
  await startInterview(reqStart, resStart);

  const sessionId = resStart.body.sessionId;

  // Complete interview to initialize battle availability
  const reqComp = { body: { sessionId } };
  const resComp = createMockRes();
  await completeInterview(reqComp, resComp);

  assert.equal(resComp.statusCode, 200);
  assert.equal(resComp.body.battleAvailable, true);
});

test("E2E Process Test 4: Breethe Memory & Cohort Intelligence API", async () => {
  const reqMem = { query: { candidateId: "CAND-001" } };
  const resMem = createMockRes();
  await getCandidateMemory(reqMem, resMem);

  assert.equal(resMem.statusCode, 200);

  const reqCohort = { query: {} };
  const resCohort = createMockRes();
  await getCohortData(reqCohort, resCohort);

  assert.equal(resCohort.statusCode, 200);
  assert.ok(resCohort.body.status);
});
