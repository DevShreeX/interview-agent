import { calculateCohortIntelligence } from "../services/cohortService.js";

/**
 * GET /api/cohort
 */
export async function getCohortData(req, res) {
  try {
    const userReadiness = Number(req.query.readiness) || 72;
    const cohortData = calculateCohortIntelligence(userReadiness);

    return res.status(200).json(cohortData);
  } catch (error) {
    console.error("[Get Cohort Error]:", error);
    return res.status(500).json({ error: "Failed to fetch cohort intelligence data." });
  }
}
