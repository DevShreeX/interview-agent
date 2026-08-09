import { getOrCreateCandidateMemory, clearMemoryStore } from "../services/breetheMemory.js";

/**
 * GET /api/memory
 */
export async function getCandidateMemory(req, res) {
  try {
    const candidateId = req.query.candidateId || "default_candidate";
    const memory = getOrCreateCandidateMemory(candidateId);

    return res.status(200).json({
      candidateId: memory.candidateId,
      interviewCount: memory.interviewCount,
      beliefState: memory.beliefState,
      growthTrajectory: memory.growthTrajectory,
      staleTopics: memory.staleTopics,
      unresolvedWeaknesses: memory.unresolvedWeaknesses,
      metacognitiveTraits: memory.metacognitiveTraits,
      battleRecoveryHistory: memory.battleRecoveryHistory,
      lastSessionDate: memory.lastSessionDate
    });
  } catch (error) {
    console.error("[Get Memory Error]:", error);
    return res.status(500).json({ error: "Failed to fetch candidate long-term memory." });
  }
}

/**
 * POST /api/memory/clear
 */
export async function clearCandidateMemory(req, res) {
  try {
    clearMemoryStore();
    return res.status(200).json({ status: "cleared", message: "Breethe memory store successfully reset." });
  } catch (error) {
    console.error("[Clear Memory Error]:", error);
    return res.status(500).json({ error: "Failed to reset memory store." });
  }
}
