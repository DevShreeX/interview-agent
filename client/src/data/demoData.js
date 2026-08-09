/**
 * Static offline demo data for Interview Mirror.
 * All pages read from here — swap for a real API when hosted.
 */

export const personas = [
  {
    id: 'alex',
    name: 'Alex',
    role: 'Backend Engineer',
    focus: 'System Design · Distributed Systems',
    accent: 'var(--accent-electric)',
    glyph: 'M',
  },
  {
    id: 'priya',
    name: 'Priya',
    role: 'Full-Stack Engineer',
    focus: 'Database · API Design',
    accent: 'var(--accent-indigo)',
    glyph: 'P',
  },
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'Staff Engineer',
    focus: 'Resilience · Failure Modes',
    accent: 'var(--accent-amber)',
    glyph: 'M',
  },
];

export const interview = {
  personaId: 'alex',
  totalQuestions: 10,
  currentIndex: 3, // 0-based → "Q 04 / 10"
  track: 'RAG',
  confidence: 4.4,
  question: {
    number: 4,
    prompt:
      'Design a production RAG system for 10,000 concurrent users. What are the key bottlenecks, and where would you instrument first?',
    intent: 'System Design Depth',
  },
};

export const report = {
  readiness: 72,
  personaName: 'Alex',
  track: 'System Design',
  date: 'Aug 08, 2026 · 14:32',
  calibration: {
    confidence: 4.6,
    demonstrated: 2.8,
    gap: 1.8,
    verdict: 'HIGH OVERCONFIDENCE',
    note: "You don't have a knowledge problem here. You have a depth problem.",
  },
  thinkingStyle: {
    label: 'PATTERN MATCHER',
    strength: 'Fast recognition of familiar architectures.',
    risk: 'Reasoning becomes less structured when the familiar pattern breaks.',
  },
  skills: [
    { name: 'System Design', score: 2.8, max: 5 },
    { name: 'Databases', score: 3.9, max: 5 },
    { name: 'Resilience', score: 2.1, max: 5 },
    { name: 'Performance', score: 3.2, max: 5 },
    { name: 'Security', score: 3.6, max: 5 },
    { name: 'Communication', score: 4.4, max: 5 },
  ],
  evidence: {
    strong: [
      'Identified major components (ingestion, embedding, retrieval, ranking)',
      'Mentioned caching and chunking strategy',
      'Scoped concurrency assumptions clearly',
    ],
    weak: [
      'Did not address failure recovery',
      'Did not quantify trade-offs between recall and latency',
      'Skipped instrumentation / observability plan',
    ],
  },
  breakpoint: {
    label: 'YOUR BREAKPOINT',
    area: 'Failure-Mode Reasoning',
    prediction:
      'Your vector database is causing P95 latency to exceed 800ms. What changes first, and why?',
    confidence: 0.83,
  },
};

export const battle = {
  target: 'Failure-Mode Reasoning',
  difficulty: 'High',
  interviewer: 'Marcus',
  exchange: [
    {
      speaker: 'Interviewer',
      text: 'Assume traffic increases 10x overnight. Which component becomes the bottleneck first in your proposed architecture, and what do you instrument to prove it?',
    },
  ],
  result: {
    before: 41,
    after: 57,
    recovery: 16,
    stillUnstable: 'Failure-mode reasoning',
    nextAction: '30-minute production architecture drill',
  },
};

export const memory = {
  sessions: [
    { date: 'Jun 02', readiness: 58, gap: 1.7 },
    { date: 'Jun 18', readiness: 64, gap: 1.1 },
    { date: 'Jul 09', readiness: 72, gap: 0.4 },
  ],
  insight:
    'Your confidence is becoming more aligned with your demonstrated knowledge. Last time, failure-mode reasoning was your biggest weakness. Today we tested it under a production constraint, and you showed marked improvement.',
  nextSession: {
    focus: 'Failure-mode reasoning under production constraints',
    context: 'Resume where the last session ended — depth on recovery paths.',
  },
};

export const gapBars = [
  { label: 'CONFIDENCE', score: 4.6, max: 5, pct: 92, color: 'var(--text-primary)' },
  { label: 'DEMONSTRATED DEPTH', score: 2.8, max: 5, pct: 56, color: 'var(--accent-indigo)' },
];
