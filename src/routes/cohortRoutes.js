import { Router } from "express";
import { getCohortData } from "../controllers/cohortController.js";

const router = Router();

router.get("/", getCohortData);

export default router;
