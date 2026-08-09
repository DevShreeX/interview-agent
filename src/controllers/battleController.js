import { getInterviewSession, createBattleSession, getBattleSession, updateBattleSession } from "../data/sessionStore.js";
import { getWeakestTopic } from "../services/beliefStateEngine.js";
import { generateBattleQuestion, calculateBattleResults } from "../agents/battleModeAgent.js";
import { evaluateAnswer } from "../agents/evaluatorAgent.js";

/**
 * POST /api/battle/start
 * Payload: { sessionId: "..." }
 */
export async function startBattle(req, res) {
  try {
    const { sessionId, weakestTopic: paramWeakest, persona: paramPersona } = req.body || {};

    let weakestTopic = paramWeakest || "system_design";
    let persona = paramPersona || "alex";
    let beforeScore = 0.45;

    if (sessionId) {
      const interviewSession = getInterviewSession(sessionId);
      if (interviewSession) {
        persona = interviewSession.persona || persona;
        const topicInfo = getWeakestTopic(interviewSession.beliefState);
        weakestTopic = topicInfo.topic;
        beforeScore = topicInfo.score;
      }
    }

    const battleSession = createBattleSession({
      sessionId: sessionId || "standalone",
      weakestTopic,
      persona
    });
    battleSession.beforeScore = beforeScore;

    const firstQuestion = await generateBattleQuestion({
      battleSession,
      personaId: persona
    });

    battleSession.history.push({
      questionNumber: 1,
      question: firstQuestion,
      answer: null,
      evaluation: null
    });

    updateBattleSession(battleSession.battleId, battleSession);

    return res.status(200).json({
      battleId: battleSession.battleId,
      weakestTopic: battleSession.weakestTopic,
      question: firstQuestion,
      questionNumber: 1,
      maxQuestions: 5,
      progress: 0.2
    });
  } catch (error) {
    console.error("[Start Battle Error]:", error);
    return res.status(500).json({ error: "Failed to initialize Battle Mode session." });
  }
}

/**
 * POST /api/battle/continue
 * Payload: { battleId: "...", answer: "..." }
 */
export async function continueBattle(req, res) {
  try {
    const { battleId, answer } = req.body || {};
    if (!battleId || !answer) {
      return res.status(400).json({ error: "battleId and answer are required." });
    }

    const battleSession = getBattleSession(battleId);
    if (!battleSession) {
      return res.status(404).json({ error: "Battle session not found." });
    }

    if (battleSession.completed) {
      return res.status(400).json({ error: "Battle session completed. Call POST /api/battle/complete to view results." });
    }

    const currentTurnIdx = battleSession.history.length - 1;
    const currentQuestion = battleSession.history[currentTurnIdx]?.question || "Pressure question";

    // Evaluate answer
    const evaluation = await evaluateAnswer({
      question: currentQuestion,
      answer,
      persona: battleSession.persona
    });

    battleSession.history[currentTurnIdx].answer = answer;
    battleSession.history[currentTurnIdx].evaluation = evaluation;

    const nextQNumber = battleSession.questionNumber + 1;
    battleSession.questionNumber = nextQNumber;

    if (nextQNumber > 5) {
      battleSession.completed = true;
      updateBattleSession(battleId, battleSession);

      return res.status(200).json({
        battleId: battleSession.battleId,
        completed: true,
        message: "Battle Mode completed. Call POST /api/battle/complete to retrieve recovery metrics."
      });
    }

    // Generate next pressure question
    const nextQuestion = await generateBattleQuestion({
      battleSession,
      personaId: battleSession.persona
    });

    battleSession.history.push({
      questionNumber: nextQNumber,
      question: nextQuestion,
      answer: null,
      evaluation: null
    });

    updateBattleSession(battleId, battleSession);

    return res.status(200).json({
      battleId: battleSession.battleId,
      question: nextQuestion,
      questionNumber: nextQNumber,
      progress: Number((nextQNumber / 5).toFixed(2))
    });
  } catch (error) {
    console.error("[Continue Battle Error]:", error);
    return res.status(500).json({ error: "Failed to process Battle Mode turn." });
  }
}

/**
 * POST /api/battle/complete
 * Payload: { battleId: "..." }
 */
export async function completeBattle(req, res) {
  try {
    const { battleId } = req.body || {};
    if (!battleId) {
      return res.status(400).json({ error: "battleId is required." });
    }

    const battleSession = getBattleSession(battleId);
    if (!battleSession) {
      return res.status(404).json({ error: "Battle session not found." });
    }

    battleSession.completed = true;

    const results = await calculateBattleResults({ battleSession });
    battleSession.afterScore = results.after_score / 100;
    updateBattleSession(battleId, battleSession);

    return res.status(200).json({
      battleId: battleSession.battleId,
      weakestTopic: battleSession.weakestTopic,
      ...results
    });
  } catch (error) {
    console.error("[Complete Battle Error]:", error);
    return res.status(500).json({ error: "Failed to compute Battle Mode results." });
  }
}
