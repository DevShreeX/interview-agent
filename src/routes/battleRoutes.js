import { Router } from "express";
import { startBattle, continueBattle, completeBattle } from "../controllers/battleController.js";

const router = Router();

router.post("/start", startBattle);
router.post("/continue", continueBattle);
router.post("/complete", completeBattle);

export default router;
