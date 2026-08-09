import { generateCompletion } from "../config/llm.js";
import { getPersona } from "../utils/personas.js";

/**
 * Planner Agent (Section 3 of 02_AI_BACKEND.md)
 * Selects the next dynamic question based on candidate belief state, past history, and calibration.
 */

export async function generateNextQuestion({ personaId = "alex", targetRole = "AI Engineer", questionNumber = 1, history = [], beliefState = {}, lastCalibration = null }) {
  const persona = getPersona(personaId);

  // If question 1 and no history, generate initial baseline question
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
    const response = await generateCompletion(initialPrompt, persona.systemPrompt);
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

  const response = await generateCompletion(prompt, persona.systemPrompt);

  if (response) {
    return response.trim();
  }

  // Fallback question based on persona focus
  const fallbackTopic = persona.focusTopics[questionNumber % persona.focusTopics.length];
  return `Let's discuss ${fallbackTopic.replace("_", " ")}. Under production load, what failure modes would you monitor for first, and how would your system recover?`;
}
