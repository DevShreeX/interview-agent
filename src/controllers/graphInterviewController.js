import { buildInterviewGraph } from "../graphs/interviewGraph.js";
import { buildBattleGraph } from "../graphs/battleGraph.js";
import { createInterviewSession, getInterviewSession, updateInterviewSession } from "../data/sessionStore.js";
import { generateNextQuestion } from "../agents/plannerAgent.js";
import { summarizeCalibrationLog } from "../services/calibrationEngine.js";
import { getWeakestTopic } from "../services/beliefStateEngine.js";
import { detectThinkingStyle } from "../services/thinkingStyleDetector.js";
import { predictBreakpoint } from "../services/breakpointPredictor.js";
import { recordSessionToMemory, recordBattleToMemory } from "../services/breetheMemory.js";
import { EXAMPLE_CANDIDATES } from "../data/exampleCandidates.js";
import { getCurriculumModule, getTopicsForModule, getAllObjectivesForModule } from "../data/curriculum.js";

// Compiled LangGraph instances — built once, reused per request
let _interviewGraph = null;
let _battleGraph = null;

function getInterviewGraph() {
  if (!_interviewGraph) _interviewGraph = buildInterviewGraph();
  return _interviewGraph;
}

function getBattleGraph() {
  if (!_battleGraph) _battleGraph = buildBattleGraph();
  return _battleGraph;
}

// ============================================================
// POST /api/interview/start  (Graph-powered)
// ============================================================
export async function startInterview(req, res) {
  try {
    const { persona = "alex", targetRole = "AI Engineer", curriculumScope = null, exampleCandidateId = null } = req.body || {};

    const session = createInterviewSession({ persona, targetRole });
    session.curriculumScope = curriculumScope;

    // Check if we are loading an example candidate
    if (exampleCandidateId && EXAMPLE_CANDIDATES[exampleCandidateId]) {
      const demoCandidate = EXAMPLE_CANDIDATES[exampleCandidateId];
      session.candidateId = demoCandidate.id;
      session.beliefState = { ...demoCandidate.beliefState };
      session.history = [...demoCandidate.history];
      session.questionNumber = session.history.length + 1;
    }

    const firstQuestion = await generateNextQuestion({
      personaId: session.persona,
      targetRole: session.targetRole,
      questionNumber: session.questionNumber || 1,
      history: session.history || [],
      beliefState: session.beliefState,
      curriculumContext: session.curriculumScope,
      candidateId: session.candidateId || "default_candidate"
    });

    session.history.push({
      questionId: `q${session.questionNumber || 1}`,
      question: firstQuestion,
      answer: null,
      confidence: null,
      evaluation: null
    });

    updateInterviewSession(session.sessionId, session);

    let returnPayload = {
      sessionId: session.sessionId,
      question: firstQuestion,
      questionNumber: session.questionNumber || 1,
      progress: (session.questionNumber || 1) / 8,
      engine: "LangGraph StatefulGraph v1"
    };

    if (curriculumScope && curriculumScope.moduleNumber) {
      const moduleMeta = getCurriculumModule(curriculumScope.moduleNumber);
      returnPayload.curriculumModule = moduleMeta ? `${moduleMeta.title} (Days ${moduleMeta.days.join("-")})` : `Module ${curriculumScope.moduleNumber}`;
      returnPayload.topicsInScope = getTopicsForModule(curriculumScope.moduleNumber);
      returnPayload.objectivesToProbe = getAllObjectivesForModule(curriculumScope.moduleNumber).length;
    }

    return res.status(200).json(returnPayload);
  } catch (error) {
    console.error("[Graph Start Interview Error]:", error);
    return res.status(500).json({ error: "Failed to initialize graph interview session." });
  }
}

// ============================================================
// POST /api/interview/continue  (Graph-powered)
// Runs the answer through: Evaluate → Calibrate → UpdateBelief
// → (conditional) ThinkingNode → Planner → SelfCritique → Output
// ============================================================
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
      return res.status(400).json({ error: "Session is already completed. Call /api/interview/complete." });
    }

    const currentTurnIdx = session.history.length - 1;
    const currentQuestion = session.history[currentTurnIdx]?.question || "Technical question";

    // ── RUN LANGGRAPH ──────────────────────────────────────────
    const graph = getInterviewGraph();

    const initialState = {
      sessionId,
      candidateId: session.candidateId || "default_candidate",
      personaId: session.persona,
      targetRole: session.targetRole,
      questionNumber: session.questionNumber,
      currentQuestion,
      currentAnswer: answer,
      currentConfidence: confidence,
      beliefState: session.beliefState || {},
      history: session.history || [],
      calibrationLog: session.calibrationLog || []
    };

    const graphResult = await graph.invoke(initialState);
    // ──────────────────────────────────────────────────────────

    // Extract graph outputs
    const evaluation = graphResult.evaluation || {};
    const calibration = graphResult.calibration || {};
    const beliefState = graphResult.beliefState || session.beliefState;
    const nextQuestion = graphResult.nextQuestion;
    const hypothesis = graphResult.hypothesis;
    const strategicIntent = graphResult.strategicIntent;
    const selfCritique = graphResult.selfCritique;
    const questionRefined = graphResult.questionRefined || false;

    // Update session state from graph output
    session.calibrationLog.push(calibration);
    session.beliefState = beliefState;

    session.history[currentTurnIdx].answer = answer;
    session.history[currentTurnIdx].confidence = confidence;
    session.history[currentTurnIdx].evaluation = evaluation;
    session.history[currentTurnIdx].calibrationDelta = calibration.calibrationDelta;
    // Store internal reasoning (never exposed directly to candidate)
    session.history[currentTurnIdx]._internal = { hypothesis, strategicIntent, selfCritique, questionRefined };

    const nextQuestionNumber = session.questionNumber + 1;
    session.questionNumber = nextQuestionNumber;

    // Completion gate
    if (nextQuestionNumber > 8 || graphResult.completed) {
      session.completed = true;
      updateInterviewSession(sessionId, session);

      return res.status(200).json({
        sessionId: session.sessionId,
        completed: true,
        message: "Interview complete. Call POST /api/interview/complete to fetch the final dossier."
      });
    }

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
      progress: Math.min(1.0, progress),
      _graphMeta: {
        strategicIntent: strategicIntent || "normal",
        questionRefined,
        calibrationCategory: calibration.category || "neutral",
        nodesTraversed: ["evaluate", "calibrate", "update_belief", strategicIntent ? "think" : null, "plan", "critique"].filter(Boolean)
      }
    });
  } catch (error) {
    console.error("[Graph Continue Interview Error]:", error);
    return res.status(500).json({ error: "Failed to process answer through LangGraph." });
  }
}

// ============================================================
// POST /api/interview/complete  (unchanged — no graph needed)
// ============================================================
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

    const calibrationSummary = summarizeCalibrationLog(session.calibrationLog);
    const thinkingStyle = await detectThinkingStyle(session.history, calibrationSummary);
    const weakestTopicInfo = getWeakestTopic(session.beliefState);
    const breakpoint = await predictBreakpoint(session.history, session.beliefState, weakestTopicInfo);

    session.thinkingStyle = thinkingStyle;
    session.breakpoint = breakpoint;
    updateInterviewSession(sessionId, session);

    recordSessionToMemory(session.candidateId || "default_candidate", {
      beliefState: session.beliefState,
      calibrationSummary,
      thinkingStyle,
      weakestTopic: weakestTopicInfo.topic
    });

    const beliefScores = Object.values(session.beliefState || {});
    const keysCount = beliefScores.length || 8;
    const readiness = Math.round((beliefScores.reduce((a, b) => a + b, 0) / keysCount) * 100);

    return res.status(200).json({
      sessionId: session.sessionId,
      readiness,
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

// ============================================================
// POST /api/interview/battle/turn  (Battle Graph step)
// Processes one battle turn through the Battle Mode State Graph
// ============================================================
export async function battleGraphTurn(req, res) {
  try {
    const { sessionId, answer } = req.body || {};
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const session = getInterviewSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found." });
    }

    // Auto-initialize battle session if it doesn't exist
    if (!session.battleSession) {
      const weakestTopicObj = Object.entries(session.beliefState || {}).sort((a,b)=>a[1]-b[1])[0];
      const weakestTopic = weakestTopicObj ? weakestTopicObj[0] : "Vector Databases";

      session.battleSession = {
        battleId: sessionId,
        weakestTopic: weakestTopic,
        persona: session.persona,
        questionNumber: 1,
        history: [],
        beforeScore: session.readiness || 0.45,
        completed: false
      };

      // If no answer is provided, we treat this as the "start" of the battle
      if (!answer) {
         session.battleSession.currentQuestion = `Let's dive deeper into ${weakestTopic}. Can you explain how you would handle edge cases in this area?`;
         return res.status(200).json({
            battleId: sessionId,
            weakestTopic: weakestTopic,
            questionNumber: 1,
            question: session.battleSession.currentQuestion
         });
      }
    }

    if (!answer) {
      return res.status(400).json({ error: "answer is required for a battle turn." });
    }

    const battle = session.battleSession;
    if (battle.completed) {
      return res.status(400).json({ error: "Battle session already completed." });
    }

    const graph = getBattleGraph();

    const initialState = {
      battleId: battle.battleId || sessionId,
      weakestTopic: battle.weakestTopic,
      personaId: battle.persona,
      questionNumber: battle.questionNumber || 1,
      maxQuestions: 5,
      currentQuestion: battle.currentQuestion,
      currentAnswer: answer,
      history: battle.history || [],
      beforeScore: battle.beforeScore || 0.45,
      completed: false
    };

    const graphResult = await graph.invoke(initialState);

    // Sync graph output back to battle session
    battle.history = graphResult.history || battle.history;
    battle.questionNumber = (battle.questionNumber || 1) + 1;

    if (battle.questionNumber > 5 || graphResult.completed) {
      battle.completed = true;
      battle.currentQuestion = null;
    } else {
      battle.currentQuestion = graphResult.currentQuestion || graphResult.nextQuestion;
    }

    session.battleSession = battle;
    updateInterviewSession(sessionId, session);

    if (battle.completed) {
      const avgAcc = battle.history.length > 0
        ? battle.history.reduce((sum, h) => sum + (h.evaluation?.accuracy || 0.5), 0) / battle.history.length
        : 0.5;
      const afterScore = Number(avgAcc.toFixed(2));
      const beforeScore = battle.beforeScore || 0.45;
      const riskChange = Math.round(((afterScore - beforeScore) / beforeScore) * 100);

      recordBattleToMemory(session.candidateId || "default_candidate", {
        weakestTopic: battle.weakestTopic,
        beforeScore,
        afterScore,
        riskChange
      });

      return res.status(200).json({
        sessionId,
        battleComplete: true,
        summary: { weakestTopic: battle.weakestTopic, beforeScore, afterScore, riskChange },
        message: "Battle Mode complete. Call GET /api/battle/results/:sessionId."
      });
    }

    return res.status(200).json({
      sessionId,
      question: battle.currentQuestion,
      questionNumber: battle.questionNumber,
      pressureAngle: graphResult.pressureAngle?.replace(/_/g, " ") || "technical_attack",
      _graphMeta: {
        selfCritique: graphResult.selfCritique || "passed",
        questionRefined: graphResult.questionRefined || false,
        nodesTraversed: ["battle_evaluate", "route_pressure", "generate_question", "battle_critique"]
      }
    });
  } catch (error) {
    console.error("[Battle Graph Turn Error]:", error);
    return res.status(500).json({ error: "Failed to process battle turn through LangGraph." });
  }
}
