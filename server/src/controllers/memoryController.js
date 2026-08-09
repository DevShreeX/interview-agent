import { getOrCreateCandidateMemory, clearMemoryStore, searchBreethMemory, saveBreethEpisode } from "../services/breetheMemory.js";

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
 * POST /api/memory/search
 */
export async function searchMemory(req, res) {
  try {
    const { query = "", limit = 5 } = req.body || {};
    if (!query) {
      return res.status(400).json({ error: "query is required" });
    }

    const searchResults = await searchBreethMemory(query, limit);
    return res.status(200).json({
      query,
      results: searchResults || [],
      provider: process.env.MEMORY_API_KEY ? "thebreeth.com" : "local_fallback"
    });
  } catch (error) {
    console.error("[Search Memory Error]:", error);
    return res.status(500).json({ error: "Failed to search Breeth memory." });
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
