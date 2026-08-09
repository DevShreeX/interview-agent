import { Router } from "express";
import { getCohortData } from "./controllers/cohortController.js";
import {
  startInterview,
  continueInterview,
  completeInterview,
  battleGraphTurn
} from "./controllers/graphInterviewController.js";
import { getCandidateMemory, clearCandidateMemory, searchMemory } from "./controllers/memoryController.js";
import { getReport } from "./controllers/reportController.js";

const router = Router();

// --- Cohort Routes ---
router.get("/cohort", getCohortData);

// --- Interview Routes ---
router.post("/interview/start", startInterview);
router.post("/interview/continue", continueInterview);
router.post("/interview/complete", completeInterview);

// --- Battle Routes ---
router.post("/battle/turn", battleGraphTurn);

// --- Memory Routes ---
router.get("/memory", getCandidateMemory);
router.post("/memory/search", searchMemory);
router.post("/memory/clear", clearCandidateMemory);

// --- Report Routes ---
router.get("/report/:sessionId", getReport);

export default router;
