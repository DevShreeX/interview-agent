import { Router } from "express";
import { getCandidateMemory, clearCandidateMemory } from "../controllers/memoryController.js";

const router = Router();

router.get("/", getCandidateMemory);
router.post("/clear", clearCandidateMemory);

export default router;
