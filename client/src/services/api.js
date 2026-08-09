/**
 * API client helper for Interview Mirror backend service
 */

export async function startInterviewAPI(persona = 'alex', targetRole = 'Senior AI Engineer') {
  const res = await fetch('/api/interview/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona, targetRole })
  });
  if (!res.ok) throw new Error('Failed to start interview');
  return res.json();
}

export async function continueInterviewAPI(sessionId, answer, confidence) {
  const res = await fetch('/api/interview/continue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, answer, confidence: Number(confidence) })
  });
  if (!res.ok) throw new Error('Failed to continue interview');
  return res.json();
}

export async function completeInterviewAPI(sessionId) {
  const res = await fetch('/api/interview/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });
  if (!res.ok) throw new Error('Failed to complete interview');
  return res.json();
}

export async function fetchReportAPI(sessionId) {
  const res = await fetch(`/api/report/${sessionId}`);
  if (!res.ok) throw new Error('Failed to fetch report');
  return res.json();
}

export async function turnBattleAPI(sessionId, answer = null) {
  const res = await fetch('/api/battle/turn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, answer })
  });
  if (!res.ok) throw new Error('Failed battle turn');
  return res.json();
}

export async function fetchMemoryAPI(candidateId = 'CAND-001') {
  const res = await fetch(`/api/memory?candidateId=${candidateId}`);
  if (!res.ok) throw new Error('Failed to fetch memory');
  return res.json();
}
