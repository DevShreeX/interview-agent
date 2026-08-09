import test from "node:test";
import assert from "node:assert/strict";
import { calculateCalibration, summarizeCalibrationLog } from "../src/services/calibrationEngine.js";

test("Calibration Engine — High Overconfidence Example (Section 7)", () => {
  // Confidence = 4.6 / 5, Accuracy = 0.56 -> High Overconfidence
  const res = calculateCalibration({ confidence: 4.6, accuracy: 0.56 });
  assert.equal(res.rawConfidence, 4.6);
  assert.equal(res.demonstratedAccuracy, 0.56);
  assert.equal(res.demonstratedScore, 2.8);
  assert.equal(res.calibrationDelta, 1.8);
  assert.equal(res.category, "high_overconfidence");
});

test("Calibration Engine — Underconfidence Example (Section 7)", () => {
  // Confidence = 2.0 / 5, Accuracy = 0.88 -> Underestimation
  const res = calculateCalibration({ confidence: 2.0, accuracy: 0.88 });
  assert.equal(res.rawConfidence, 2.0);
  assert.equal(res.demonstratedAccuracy, 0.88);
  assert.equal(res.demonstratedScore, 4.4);
  assert.equal(res.calibrationDelta, -2.4);
  assert.equal(res.category, "underestimation");
});

test("Calibration Engine — Well Calibrated", () => {
  const res = calculateCalibration({ confidence: 4.0, accuracy: 0.8 });
  assert.equal(res.calibrationDelta, 0);
  assert.equal(res.category, "well_calibrated");
});

test("Calibration Log Summary", () => {
  const log = [
    { calibrationDelta: 1.8 },
    { calibrationDelta: 1.4 },
    { calibrationDelta: 1.6 }
  ];
  const summary = summarizeCalibrationLog(log);
  assert.equal(summary.overallStatus, "high_overconfidence");
  assert.equal(summary.totalEvaluations, 3);
});
