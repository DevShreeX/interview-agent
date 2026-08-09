import { Router } from "express";
import {
  startInterview,
  continueInterview,
  completeInterview,
  battleGraphTurn
} from "../controllers/graphInterviewController.js";

const router = Router();

// Graph-powered routes (LangGraph StateGraph v1)
router.post("/start", startInterview);
router.post("/continue", continueInterview);       // runs full 6-node graph
router.post("/complete", completeInterview);
router.post("/battle/turn", battleGraphTurn);       // battle mode graph turn

export default router;
