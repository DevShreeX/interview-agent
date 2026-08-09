import { Router } from "express";
import { getReport } from "../controllers/reportController.js";

const router = Router();

router.get("/:sessionId", getReport);

export default router;
