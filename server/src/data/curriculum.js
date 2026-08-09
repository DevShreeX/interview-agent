import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the curriculum JSON once
const curriculumData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "curriculum.json"), "utf8")
);

const MODULE_KEYS = [
  "env_tooling",
  "data_foundations",
  "embeddings_vector",
  "llm_prompting",
  "chatbot_build",
  "agentic_mcp",
  "eval_security_deploy",
  "production_capstone"
];

export function getCurriculumModule(moduleNumber) {
  return curriculumData.modules.find(m => m.n === moduleNumber) || null;
}

export function getCurriculumDay(dayNumber) {
  return curriculumData.days.find(d => d.day === dayNumber) || null;
}

export function getTopicsForModule(moduleNumber) {
  const mod = getCurriculumModule(moduleNumber);
  if (!mod) return [];
  const days = curriculumData.days.filter(d => d.day >= mod.days[0] && d.day <= mod.days[1]);
  const tools = new Set();
  days.forEach(d => {
    (d.tools || []).forEach(t => tools.add(t));
  });
  return Array.from(tools);
}

export function getModuleBeliefKeys() {
  return MODULE_KEYS;
}

export function getModuleKey(moduleNumber) {
  return MODULE_KEYS[moduleNumber - 1];
}

export function buildQuestionContext(dayNumber) {
  const day = getCurriculumDay(dayNumber);
  if (!day) return "";
  
  return `
CURRICULUM CONTEXT:
Day: ${day.title} (${day.type})
Tools to Test: ${day.tools.join(", ")}
Objectives:
${day.objectives.map(o => "- " + o).join("\n")}
`;
}

export function mapToolToModule(toolName) {
  if (!toolName) return null;
  const lower = toolName.toLowerCase();
  
  for (const day of curriculumData.days) {
    if (day.tools.some(t => t.toLowerCase().includes(lower) || lower.includes(t.toLowerCase()))) {
      const module = curriculumData.modules.find(m => day.day >= m.days[0] && day.day <= m.days[1]);
      if (module) return getModuleKey(module.n);
    }
  }
  return null;
}

export function getAllObjectivesForModule(moduleNumber) {
  const mod = getCurriculumModule(moduleNumber);
  if (!mod) return [];
  const days = curriculumData.days.filter(d => d.day >= mod.days[0] && d.day <= mod.days[1]);
  return days.flatMap(d => d.objectives);
}
