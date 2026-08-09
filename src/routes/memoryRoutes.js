import { Router } from "express";
import { getCandidateMemory, clearCandidateMemory, searchMemory } from "../controllers/memoryController.js";

const router = Router();

router.get("/", getCandidateMemory);
router.post("/search", searchMemory);
router.post("/clear", clearCandidateMemory);

export default router;
