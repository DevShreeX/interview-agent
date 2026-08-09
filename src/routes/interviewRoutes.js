import { Router } from "express";
import { startInterview, continueInterview, completeInterview } from "../controllers/interviewController.js";

const router = Router();

router.post("/start", startInterview);
router.post("/continue", continueInterview);
router.post("/complete", completeInterview);

export default router;
