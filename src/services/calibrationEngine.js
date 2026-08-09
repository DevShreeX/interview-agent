/**
 * Calibration Engine — CODE, NOT LLM (Section 6 & 7 of 02_AI_BACKEND.md)
 * 
 * Rules:
 * - Confidence is rated 1–5
 * - Accuracy is 0.0–1.0
 * - Demonstrated Score = accuracy * 5
 * - Calibration Delta = raw_confidence - demonstrated_score
 * 
 * Interpretation:
 * > +1.5  high_overconfidence
 * > +0.5  medium_overconfidence
 * < -0.5  underestimation
 * else    well_calibrated
 */

export function calculateCalibration({ confidence, accuracy }) {
  // Clamp confidence to 1–5
  const rawConfidence = Math.min(5, Math.max(1, Number(confidence) || 3));
  // Clamp accuracy to 0.0–1.0
  const demonstratedAccuracy = Math.min(1, Math.max(0, Number(accuracy) || 0));

  const demonstratedScore = Number((demonstratedAccuracy * 5).toFixed(2));
  const calibrationDelta = Number((rawConfidence - demonstratedScore).toFixed(2));

  let category = "well_calibrated";
  if (calibrationDelta > 1.5) {
    category = "high_overconfidence";
  } else if (calibrationDelta > 0.5) {
    category = "medium_overconfidence";
  } else if (calibrationDelta < -0.5) {
    category = "underestimation";
  }

  return {
    rawConfidence,
    demonstratedAccuracy,
    demonstratedScore,
    calibrationDelta,
    category
  };
}

export function summarizeCalibrationLog(calibrationLog = []) {
  if (!calibrationLog.length) {
    return { averageDelta: 0, overallStatus: "well_calibrated", totalEvaluations: 0 };
  }

  const totalDelta = calibrationLog.reduce((sum, item) => sum + item.calibrationDelta, 0);
  const averageDelta = Number((totalDelta / calibrationLog.length).toFixed(2));

  let overallStatus = "well_calibrated";
  if (averageDelta > 1.5) {
    overallStatus = "high_overconfidence";
  } else if (averageDelta > 0.5) {
    overallStatus = "medium_overconfidence";
  } else if (averageDelta < -0.5) {
    overallStatus = "underestimation";
  }

  return {
    averageDelta,
    overallStatus,
    totalEvaluations: calibrationLog.length
  };
}
