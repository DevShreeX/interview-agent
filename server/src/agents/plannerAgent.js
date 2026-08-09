import { generateCompletion } from "../config/llm.js";
import { getPersona } from "../utils/personas.js";
import { buildSystemPrompt } from "../config/promptRegistry.js";
import { logPrivacyAudit } from "../services/privacyAudit.js";
import { getPlannerMemoryContext } from "../services/breetheMemory.js";
import { getTopicsForModule, getAllObjectivesForModule, buildQuestionContext } from "../data/curriculum.js";

/**
 * Planner Agent (Section 3 of 02_AI_BACKEND.md & Section 12 of 03_MEMORY_PRIVACY_PROMPTS.md)
 */

function buildCurriculumPromptAddon(curriculumContext) {
  if (!curriculumContext) return "";
  
  if (curriculumContext.dayNumber) {
    return buildQuestionContext(curriculumContext.dayNumber);
  }
  
  if (curriculumContext.moduleNumber) {
    const tools = getTopicsForModule(curriculumContext.moduleNumber);
    const objectives = getAllObjectivesForModule(curriculumContext.moduleNumber);
    
    // Grab a subset of objectives if there are too many, or just join them
    const objSubset = objectives.slice(0, 5); // Just 5 to keep prompt from exploding
    
    return `
CURRICULUM CONTEXT:
Module: ${curriculumContext.moduleNumber}
Tools in Scope: ${tools.join(", ")}
Objectives to Probe:
${objSubset.map(o => "- " + o).join("\n")}
`;
  }
  return "";
}

export async function generateNextQuestion({ personaId = "alex", targetRole = "AI Engineer", questionNumber = 1, history = [], beliefState = {}, lastCalibration = null, sessionId = "sess_planner", candidateId = "default_candidate", curriculumContext = null }) {
  const persona = getPersona(personaId);

  // Fetch long-term memory context if available
  const memoryContext = getPlannerMemoryContext(candidateId);
  const memoryPromptAddon = memoryContext ? `\n\nLONG-TERM CANDIDATE MEMORY CONTEXT:\n${memoryContext.contextMessage}` : "";
  
  const curriculumPromptAddon = buildCurriculumPromptAddon(curriculumContext);

  // Log Privacy Audit
  logPrivacyAudit({
    sessionId,
    agentType: "planner",
    promptId: "PLANNER_V1",
    promptVersion: "1.0.0",
    topic: history[history.length - 1]?.evaluation?.follow_up_angle || "system_design",
    questionNumber,
    fieldsUsed: ["beliefState", "history", "lastCalibration", "memoryContext", "curriculumContext"],
    estimatedTokens: 220
  });

  const systemInstruction = buildSystemPrompt(["MASTER_V1", "PRIVACY_WRAPPER_V1", "PLANNER_V1"]) + `\n\n${persona.systemPrompt}${memoryPromptAddon}`;

  // Question 1 initial baseline
  if (questionNumber === 1 || history.length === 0) {
    const initialPrompt = `
You are starting a technical interview for the role of ${targetRole}.
${curriculumPromptAddon}
Generate the initial interview question.
Rules:
- Ask exactly ONE clear technical question.
${curriculumPromptAddon ? "- The question MUST probe the specific tools and objectives listed in the CURRICULUM CONTEXT." : ""}
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

${curriculumPromptAddon}

Previous Questions Asked:
${history.map((h, i) => `${i + 1}. ${h.question}`).join("\n")}

Rules for next question:
- Ask exactly ONE targeted technical question.
${curriculumPromptAddon ? "- The question MUST probe the specific tools and objectives listed in the CURRICULUM CONTEXT." : ""}
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
