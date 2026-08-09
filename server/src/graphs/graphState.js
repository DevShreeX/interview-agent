import { Annotation } from "@langchain/langgraph";

/**
 * Interview Graph State Schema
 * Shared state flowing through every node in the interview decision graph.
 */
export const InterviewStateAnnotation = Annotation.Root({
  // Session identifiers
  sessionId: Annotation({ reducer: (_, b) => b }),
  candidateId: Annotation({ reducer: (_, b) => b }),
  personaId: Annotation({ reducer: (_, b) => b }),
  targetRole: Annotation({ reducer: (_, b) => b }),
  questionNumber: Annotation({ reducer: (_, b) => b }),

  // Current turn data
  currentQuestion: Annotation({ reducer: (_, b) => b }),
  currentAnswer: Annotation({ reducer: (_, b) => b }),
  currentConfidence: Annotation({ reducer: (_, b) => b }),

  // Evaluation results
  evaluation: Annotation({ reducer: (_, b) => b }),
  calibration: Annotation({ reducer: (_, b) => b }),
  beliefState: Annotation({ reducer: (_, b) => b }),

  // AI internal reasoning (never sent to frontend)
  hypothesis: Annotation({ reducer: (_, b) => b }),
  strategicIntent: Annotation({ reducer: (_, b) => b }),
  selfCritique: Annotation({ reducer: (_, b) => b }),
  questionRefined: Annotation({ reducer: (_, b) => b }),

  // Routing decision
  routingDecision: Annotation({ reducer: (_, b) => b }),
  nextQuestion: Annotation({ reducer: (_, b) => b }),

  // Full history
  history: Annotation({ reducer: (_, b) => b, default: () => [] }),
  calibrationLog: Annotation({ reducer: (_, b) => b, default: () => [] }),

  // Output flags
  completed: Annotation({ reducer: (_, b) => b, default: () => false }),
  error: Annotation({ reducer: (_, b) => b, default: () => null }),
});

/**
 * Battle Graph State Schema
 */
export const BattleStateAnnotation = Annotation.Root({
  battleId: Annotation({ reducer: (_, b) => b }),
  weakestTopic: Annotation({ reducer: (_, b) => b }),
  personaId: Annotation({ reducer: (_, b) => b }),
  questionNumber: Annotation({ reducer: (_, b) => b }),
  maxQuestions: Annotation({ reducer: (_, b) => b, default: () => 5 }),

  currentQuestion: Annotation({ reducer: (_, b) => b }),
  currentAnswer: Annotation({ reducer: (_, b) => b }),
  evaluation: Annotation({ reducer: (_, b) => b }),

  // Battle-specific internal reasoning
  pressureAngle: Annotation({ reducer: (_, b) => b }),
  selfCritique: Annotation({ reducer: (_, b) => b }),
  questionRefined: Annotation({ reducer: (_, b) => b }),

  history: Annotation({ reducer: (_, b) => b, default: () => [] }),
  beforeScore: Annotation({ reducer: (_, b) => b, default: () => 0.45 }),
  completed: Annotation({ reducer: (_, b) => b, default: () => false }),
  error: Annotation({ reducer: (_, b) => b, default: () => null }),
});
