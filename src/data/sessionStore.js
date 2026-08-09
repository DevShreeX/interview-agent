import { getInitialBeliefState } from "../services/beliefStateEngine.js";

const sessions = new Map();
const battleSessions = new Map();

export function createInterviewSession({ persona = "alex", targetRole = "AI Engineer" } = {}) {
  const sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
  const session = {
    sessionId,
    persona,
    targetRole,
    questionNumber: 1,
    history: [],
    beliefState: getInitialBeliefState(),
    calibrationLog: [],
    thinkingStyle: null,
    breakpoint: null,
    completed: false,
    createdAt: new Date().toISOString()
  };

  sessions.set(sessionId, session);
  return session;
}

export function getInterviewSession(sessionId) {
  return sessions.get(sessionId) || null;
}

export function updateInterviewSession(sessionId, updates) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  Object.assign(session, updates);
  sessions.set(sessionId, session);
  return session;
}

export function createBattleSession({ sessionId, weakestTopic, persona }) {
  const battleId = "battle_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
  const battleSession = {
    battleId,
    parentSessionId: sessionId,
    weakestTopic,
    persona,
    questionNumber: 1,
    maxQuestions: 5,
    history: [],
    beforeScore: 0,
    afterScore: 0,
    completed: false,
    createdAt: new Date().toISOString()
  };

  battleSessions.set(battleId, battleSession);
  return battleSession;
}

export function getBattleSession(battleId) {
  return battleSessions.get(battleId) || null;
}

export function updateBattleSession(battleId, updates) {
  const session = battleSessions.get(battleId);
  if (!session) return null;
  Object.assign(session, updates);
  battleSessions.set(battleId, session);
  return session;
}
