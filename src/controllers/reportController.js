import { getInterviewSession } from "../data/sessionStore.js";
import { summarizeCalibrationLog } from "../services/calibrationEngine.js";
import { detectThinkingStyle } from "../services/thinkingStyleDetector.js";
import { predictBreakpoint } from "../services/breakpointPredictor.js";
import { getWeakestTopic } from "../services/beliefStateEngine.js";
import { generateSessionReport } from "../agents/reporterAgent.js";

/**
 * GET /api/report/:sessionId
 */
export async function getReport(req, res) {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId parameter is required." });
    }

    const session = getInterviewSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found." });
    }

    const calibrationSummary = summarizeCalibrationLog(session.calibrationLog);

    if (!session.thinkingStyle) {
      session.thinkingStyle = await detectThinkingStyle(session.history, calibrationSummary);
    }

    const weakestTopicInfo = getWeakestTopic(session.beliefState);

    if (!session.breakpoint) {
      session.breakpoint = await predictBreakpoint(session.history, session.beliefState, weakestTopicInfo);
    }

    const report = await generateSessionReport({
      session,
      calibrationSummary,
      thinkingStyle: session.thinkingStyle,
      breakpoint: session.breakpoint,
      weakestTopicInfo
    });

    return res.status(200).json(report);
  } catch (error) {
    console.error("[Get Report Error]:", error);
    return res.status(500).json({ error: "Failed to compile interview report." });
  }
}
