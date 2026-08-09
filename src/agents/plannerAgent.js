import { generateCompletion } from "../config/llm.js";
import { getPersona } from "../utils/personas.js";
import { buildSystemPrompt } from "../config/promptRegistry.js";
import { logPrivacyAudit } from "../services/privacyAudit.js";
import { getPlannerMemoryContext } from "../services/breetheMemory.js";

/**
 * Planner Agent (Section 3 of 02_AI_BACKEND.md & Section 12 of 03_MEMORY_PRIVACY_PROMPTS.md)
 */

export async function generateNextQuestion({ personaId = "alex", targetRole = "AI Engineer", questionNumber = 1, history = [], beliefState = {}, lastCalibration = null, sessionId = "sess_planner", candidateId = "default_candidate" }) {
  const persona = getPersona(personaId);

  // Fetch long-term memory context if available
  const memoryContext = getPlannerMemoryContext(candidateId);
  const memoryPromptAddon = memoryContext ? `\n\nLONG-TERM CANDIDATE MEMORY CONTEXT:\n${memoryContext.contextMessage}` : "";

  // Log Privacy Audit
  logPrivacyAudit({
    sessionId,
    agentType: "planner",
    promptId: "PLANNER_V1",
    promptVersion: "1.0.0",
    topic: history[history.length - 1]?.evaluation?.follow_up_angle || "system_design",
    questionNumber,
    fieldsUsed: ["beliefState", "history", "lastCalibration", "memoryContext"],
    estimatedTokens: 220
  });

  const systemInstruction = buildSystemPrompt(["MASTER_V1", "PRIVACY_WRAPPER_V1", "PLANNER_V1"]) + `\n\n${persona.systemPrompt}${memoryPromptAddon}`;

  // Question 1 initial baseline
  if (questionNumber === 1 || history.length === 0) {
    const initialPrompt = `
You are starting a technical interview for the role of ${targetRole}.
Generate the initial interview question.
Rules:
- Ask exactly ONE clear technical question.
- Maximum THREE sentences.
- Sound like a senior technical interviewer.
- Do NOT mention scoring criteria or internal tags.
`;
    const response = await generateCompletion(initialPrompt, systemInstruction);
    if (response) return response.trim();

    return `Welcome to the interview for ${targetRole}. To start off, could you walk me through an architecture design you built recently and the key trade-offs you had to make?`;
  }

  const lastTurn = history[history.length - 1];

  const prompt = `
Role: ${targetRole}
Current Question Number: ${questionNumber}

Belief State: ${JSON.stringify(beliefState)}
Last Answer Evaluation: ${JSON.stringify(lastTurn?.evaluation || {})}
Last Calibration Delta: ${lastCalibration?.calibrationDelta} (${lastCalibration?.category})

Previous Questions Asked:
${history.map((h, i) => `${i + 1}. ${h.question}`).join("\n")}

Rules for next question:
- Ask exactly ONE targeted technical question.
- Adapt difficulty based on belief state: increase difficulty if accuracy was high; target weaknesses or probe misconceptions if accuracy was low or overconfidence was detected.
- Avoid repeated concepts.
- Maximum THREE sentences.
- Never expose internal scoring criteria or curriculum labels.
- Sound like a senior technical interviewer.
`;

  const response = await generateCompletion(prompt, systemInstruction);

  if (response) {
    return response.trim();
  }

  // Fallback question based on persona focus
  const fallbackTopic = persona.focusTopics[questionNumber % persona.focusTopics.length];
  return `Let's discuss ${fallbackTopic.replace("_", " ")}. Under production load, what failure modes would you monitor for first, and how would your system recover?`;
}
