import test from "node:test";
import assert from "node:assert/strict";
import { calculateCohortIntelligence } from "../src/services/cohortService.js";

test("Cohort Intelligence — Privacy-safe Aggregate Reporting", () => {
  const result = calculateCohortIntelligence(78);
  assert.equal(result.status, "available");
  assert.ok(result.percentile);
  assert.ok(result.common_blindspots.length > 0);
  assert.ok(result.aggregate_confidence);

  // Guarantee no individual names or transcripts are exposed
  const str = JSON.stringify(result);
  assert.ok(!str.includes("candidate_name"));
  assert.ok(!str.includes("transcript"));
});
