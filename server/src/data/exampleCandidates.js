/**
 * Real candidate profiles derived from candidates.json
 * Each candidate's beliefState is computed from their actual mission performance:
 *   - passed on attempt 1 → high mastery (0.9)
 *   - passed on attempt 2–3 → moderate (0.7)
 *   - passed on attempt 4–5 → struggled but passed (0.5)
 *   - failed → low mastery (0.2)
 *   - skipped → untested (0.3)
 *   - not tested in module → neutral (0.5)
 *
 * Day → Module mapping (from curriculum.json):
 *   Days 1-3   → env_tooling (Module 1)
 *   Days 4-6   → data_foundations (Module 2)
 *   Days 7-10  → embeddings_vector (Module 3)
 *   Days 11-15 → llm_prompting (Module 4)
 *   Days 16-20 → chatbot_build (Module 5)
 *   Days 21-24 → agentic_mcp (Module 6)
 *   Days 25-28 → eval_security_deploy (Module 7)
 *   Days 29-31 → production_capstone (Module 8)
 */

const DAY_TO_MODULE = (day) => {
  if (day <= 3)  return "env_tooling";
  if (day <= 6)  return "data_foundations";
  if (day <= 10) return "embeddings_vector";
  if (day <= 15) return "llm_prompting";
  if (day <= 20) return "chatbot_build";
  if (day <= 24) return "agentic_mcp";
  if (day <= 28) return "eval_security_deploy";
  return "production_capstone";
};

const SCORE_FOR_MISSION = (m) => {
  if (m.skipped) return 0.3;
  if (!m.passed) return 0.2;
  if (m.attempts === 1) return 0.9;
  if (m.attempts <= 3) return 0.7;
  return 0.5;
};

function buildBeliefState(missions) {
  const MODULE_KEYS = [
    "env_tooling", "data_foundations", "embeddings_vector", "llm_prompting",
    "chatbot_build", "agentic_mcp", "eval_security_deploy", "production_capstone"
  ];

  const sums = {};
  const counts = {};
  MODULE_KEYS.forEach(k => { sums[k] = 0; counts[k] = 0; });

  missions.forEach(m => {
    const key = DAY_TO_MODULE(m.day);
    sums[key] += SCORE_FOR_MISSION(m);
    counts[key]++;
  });

  const belief = {};
  MODULE_KEYS.forEach(k => {
    belief[k] = counts[k] > 0 ? Number((sums[k] / counts[k]).toFixed(2)) : 0.5;
  });

  return belief;
}

// === Real Candidate Profiles ===

export const EXAMPLE_CANDIDATES = {
  "CAND-001": {
    id: "CAND-001",
    name: "Sarah Johnson",
    jobRole: "Senior Data Engineer",
    yearsExperience: 9,
    beliefState: buildBeliefState([
      { day: 7, passed: true, attempts: 1 },
      { day: 8, passed: true, attempts: 1 },
      { day: 10, passed: true, attempts: 2 },
      { day: 12, passed: true, attempts: 4 },
      { day: 16, passed: true, attempts: 1 },
      { day: 22, passed: true, attempts: 2 },
      { day: 23, passed: true, attempts: 2 },
      { day: 28, passed: true, attempts: 3 },
      { day: 29, skipped: true },
      { day: 31, passed: true, attempts: 1 }
    ]),
    signals: { commitDays: 28, missionsCompleted: 30, missionsFirstTry: 20 },
    history: []
  },

  "CAND-002": {
    id: "CAND-002",
    name: "Alex Turner",
    jobRole: "Backend Software Engineer",
    yearsExperience: 5,
    beliefState: buildBeliefState([
      { day: 7, passed: true, attempts: 3 },
      { day: 8, passed: true, attempts: 2 },
      { day: 10, passed: true, attempts: 4 },
      { day: 12, passed: true, attempts: 5 },
      { day: 13, passed: true, attempts: 4 },
      { day: 16, passed: true, attempts: 1 },
      { day: 18, passed: true, attempts: 1 },
      { day: 22, passed: true, attempts: 3 },
      { day: 28, passed: true, attempts: 1 },
      { day: 31, passed: true, attempts: 2 }
    ]),
    signals: { commitDays: 22, missionsCompleted: 29, missionsFirstTry: 10 },
    history: []
  },

  "CAND-003": {
    id: "CAND-003",
    name: "Emily Chen",
    jobRole: "AI Engineer",
    yearsExperience: 6,
    beliefState: buildBeliefState([
      { day: 7, passed: true, attempts: 1 },
      { day: 8, passed: true, attempts: 1 },
      { day: 10, passed: true, attempts: 1 },
      { day: 11, passed: true, attempts: 1 },
      { day: 12, passed: true, attempts: 1 },
      { day: 13, passed: true, attempts: 1 },
      { day: 21, passed: true, attempts: 1 },
      { day: 22, passed: true, attempts: 1 },
      { day: 23, passed: true, attempts: 1 },
      { day: 31, passed: true, attempts: 1 }
    ]),
    signals: { commitDays: 31, missionsCompleted: 31, missionsFirstTry: 30 },
    history: []
  },

  "CAND-004": {
    id: "CAND-004",
    name: "David Miller",
    jobRole: "Business Analyst",
    yearsExperience: 8,
    beliefState: buildBeliefState([
      { day: 7, passed: true, attempts: 4 },
      { day: 8, passed: true, attempts: 5 },
      { day: 10, passed: true, attempts: 5 },
      { day: 12, passed: true, attempts: 3 },
      { day: 16, passed: true, attempts: 2 },
      { day: 20, passed: true, attempts: 3 },
      { day: 22, passed: true, attempts: 4 },
      { day: 23, passed: true, attempts: 5 },
      { day: 28, skipped: true },
      { day: 31, passed: true, attempts: 2 }
    ]),
    signals: { commitDays: 18, missionsCompleted: 28, missionsFirstTry: 6 },
    history: []
  },

  "CAND-005": {
    id: "CAND-005",
    name: "Michael Brown",
    jobRole: "DevOps Engineer",
    yearsExperience: 10,
    beliefState: buildBeliefState([
      { day: 7, passed: true, attempts: 2 },
      { day: 8, passed: true, attempts: 2 },
      { day: 10, passed: true, attempts: 2 },
      { day: 12, passed: true, attempts: 4 },
      { day: 18, passed: true, attempts: 1 },
      { day: 22, passed: true, attempts: 2 },
      { day: 23, passed: true, attempts: 3 },
      { day: 28, passed: true, attempts: 1 },
      { day: 29, passed: true, attempts: 1 },
      { day: 31, passed: true, attempts: 1 }
    ]),
    signals: { commitDays: 30, missionsCompleted: 31, missionsFirstTry: 22 },
    history: []
  },

  "CAND-010": {
    id: "CAND-010",
    name: "Gerald Combs",
    jobRole: "IT Support Specialist",
    yearsExperience: 20,
    beliefState: buildBeliefState([
      { day: 1, passed: true, attempts: 2 },
      { day: 7, passed: true, attempts: 5 },
      { day: 8, passed: false, attempts: 4 },
      { day: 10, passed: false, attempts: 3 },
      { day: 12, passed: true, attempts: 5 },
      { day: 16, passed: true, attempts: 4 },
      { day: 22, passed: false, attempts: 3 },
      { day: 27, skipped: true },
      { day: 28, skipped: true },
      { day: 31, passed: true, attempts: 3 }
    ]),
    signals: { commitDays: 22, missionsCompleted: 23, missionsFirstTry: 1 },
    history: []
  },

  "CAND-011": {
    id: "CAND-011",
    name: "Mia Alvarez",
    jobRole: "UX Researcher",
    yearsExperience: 6,
    beliefState: buildBeliefState([
      { day: 1, passed: true, attempts: 2 },
      { day: 2, passed: true, attempts: 1 },
      { day: 3, passed: true, attempts: 3 },
      { day: 4, passed: true, attempts: 2 },
      { day: 7, skipped: true },
      { day: 8, skipped: true },
      { day: 12, skipped: true },
      { day: 16, skipped: true },
      { day: 22, skipped: true },
      { day: 31, passed: true, attempts: 4 }
    ]),
    signals: { commitDays: 9, missionsCompleted: 14, missionsFirstTry: 5 },
    history: []
  },

  "CAND-018": {
    id: "CAND-018",
    name: "Diane Foster",
    jobRole: "AI Engineer",
    yearsExperience: 4,
    beliefState: buildBeliefState([
      { day: 7, passed: true, attempts: 1 },
      { day: 8, passed: true, attempts: 1 },
      { day: 10, passed: true, attempts: 1 },
      { day: 12, passed: true, attempts: 1 },
      { day: 13, passed: true, attempts: 1 },
      { day: 22, passed: true, attempts: 1 },
      { day: 23, passed: true, attempts: 1 },
      { day: 27, passed: true, attempts: 1 },
      { day: 28, passed: true, attempts: 1 },
      { day: 31, passed: true, attempts: 1 }
    ]),
    signals: { commitDays: 31, missionsCompleted: 31, missionsFirstTry: 31 },
    history: []
  }
};

// Convenience lookup keys (backwards-compatible with old demo names)
EXAMPLE_CANDIDATES["candidate_strong"]  = EXAMPLE_CANDIDATES["CAND-003"];  // Emily Chen — perfect AI Engineer
EXAMPLE_CANDIDATES["candidate_average"] = EXAMPLE_CANDIDATES["CAND-002"];  // Alex Turner — struggled with prompting
EXAMPLE_CANDIDATES["candidate_weak"]    = EXAMPLE_CANDIDATES["CAND-010"];  // Gerald Combs — multiple failures/skips
