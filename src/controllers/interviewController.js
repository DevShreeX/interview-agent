import { createInterviewSession, getInterviewSession, updateInterviewSession } from "../data/sessionStore.js";
import { generateNextQuestion } from "../agents/plannerAgent.js";
import { evaluateAnswer } from "../agents/evaluatorAgent.js";
import { calculateCalibration, summarizeCalibrationLog } from "../services/calibrationEngine.js";
import { updateBeliefState, getWeakestTopic } from "../services/beliefStateEngine.js";
import { detectThinkingStyle } from "../services/thinkingStyleDetector.js";
import { predictBreakpoint } from "../services/breakpointPredictor.js";

/**
 * POST /api/interview/start
 * Payload: { persona: "alex" | "priya" | "marcus", targetRole: "AI Engineer" }
 */
export async function startInterview(req, res) {
  try {
    const { persona = "alex", targetRole = "AI Engineer" } = req.body || {};

    const session = createInterviewSession({ persona, targetRole });

    const firstQuestion = await generateNextQuestion({
      personaId: session.persona,
      targetRole: session.targetRole,
      questionNumber: 1,
      history: [],
      beliefState: session.beliefState
    });

    session.history.push({
      questionId: "q1",
      question: firstQuestion,
      answer: null,
      confidence: null,
      evaluation: null
    });

    updateInterviewSession(session.sessionId, session);

    return res.status(200).json({
      sessionId: session.sessionId,
      question: firstQuestion,
      questionNumber: 1,
      progress: 0.125
    });
  } catch (error) {
    console.error("[Start Interview Error]:", error);
    return res.status(500).json({ error: "Failed to initialize interview session." });
  }
}

/**
 * POST /api/interview/continue
 * Payload: { sessionId: "...", answer: "...", confidence: 4 }
 */
export async function continueInterview(req, res) {
  try {
    const { sessionId, answer, confidence = 3 } = req.body || {};

    if (!sessionId || !answer) {
      return res.status(400).json({ error: "sessionId and answer are required." });
    }

    const session = getInterviewSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    if (session.completed) {
      return res.status(400).json({ error: "Session is already completed. Call /api/interview/complete or GET /api/report/:sessionId." });
    }

    // Current un-answered question entry
    const currentTurnIdx = session.history.length - 1;
    const currentQuestion = session.history[currentTurnIdx]?.question || "Technical question";

    // 1. Evaluator Agent
    const evaluation = await evaluateAnswer({
      question: currentQuestion,
      answer,
      targetRole: session.targetRole,
      persona: session.persona
    });

    // 2. Calibration Engine (Deterministic Arithmetic)
    const calibration = calculateCalibration({
      confidence,
      accuracy: evaluation.accuracy
    });

    session.calibrationLog.push(calibration);

    // 3. Belief State Engine Update
    const beliefUpdate = updateBeliefState(session.beliefState, {
      topic: evaluation.follow_up_angle || "system_design",
      accuracy: evaluation.accuracy,
      depth: evaluation.depth
    });

    session.beliefState = beliefUpdate.beliefState;

    // Update current turn entry
    session.history[currentTurnIdx].answer = answer;
    session.history[currentTurnIdx].confidence = confidence;
    session.history[currentTurnIdx].evaluation = evaluation;
    session.history[currentTurnIdx].calibrationDelta = calibration.calibrationDelta;

    const nextQuestionNumber = session.questionNumber + 1;
    session.questionNumber = nextQuestionNumber;

    // Check completion gate (Minimum 8 questions required per 02_AI_BACKEND.md Section 15)
    if (nextQuestionNumber > 8) {
      session.completed = true;
      updateInterviewSession(sessionId, session);

      return res.status(200).json({
        sessionId: session.sessionId,
        completed: true,
        message: "Interview complete. Call POST /api/interview/complete or GET /api/report/:sessionId to fetch final dossier."
      });
    }

    // 4. Planner Agent for Next Question
    const nextQuestion = await generateNextQuestion({
      personaId: session.persona,
      targetRole: session.targetRole,
      questionNumber: nextQuestionNumber,
      history: session.history,
      beliefState: session.beliefState,
      lastCalibration: calibration
    });

    session.history.push({
      questionId: `q${nextQuestionNumber}`,
      question: nextQuestion,
      answer: null,
      confidence: null,
      evaluation: null
    });

    updateInterviewSession(sessionId, session);

    const progress = Number((nextQuestionNumber / 8).toFixed(2));

    return res.status(200).json({
      sessionId: session.sessionId,
      question: nextQuestion,
      questionNumber: nextQuestionNumber,
      progress: Math.min(1.0, progress)
    });
  } catch (error) {
    console.error("[Continue Interview Error]:", error);
    return res.status(500).json({ error: "Failed to process answer and generate next question." });
  }
}

/**
 * POST /api/interview/complete
 * Payload: { sessionId: "..." }
 */
export async function completeInterview(req, res) {
  try {
    const { sessionId } = req.body || {};
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const session = getInterviewSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    session.completed = true;

    // Run Thinking Style Detector & Breakpoint Predictor
    const calibrationSummary = summarizeCalibrationLog(session.calibrationLog);
    const thinkingStyle = await detectThinkingStyle(session.history, calibrationSummary);
    const weakestTopicInfo = getWeakestTopic(session.beliefState);
    const breakpoint = await predictBreakpoint(session.history, session.beliefState, weakestTopicInfo);

    session.thinkingStyle = thinkingStyle;
    session.breakpoint = breakpoint;
    updateInterviewSession(sessionId, session);

    return res.status(200).json({
      sessionId: session.sessionId,
      readiness: Math.round(Object.values(session.beliefState).reduce((a, b) => a + b, 0) / 5 * 100),
      calibration: calibrationSummary,
      thinkingStyle,
      evidence: session.history.map(h => h.evaluation?.evidence_quote).filter(Boolean),
      breakpoint,
      battleAvailable: true
    });
  } catch (error) {
    console.error("[Complete Interview Error]:", error);
    return res.status(500).json({ error: "Failed to finalize interview session." });
  }
}
