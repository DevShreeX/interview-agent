import dotenv from "dotenv";
import { parseStructuredJSON } from "../utils/jsonParser.js";

dotenv.config();

const API_KEY = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
const PROVIDER = (process.env.LLM_PROVIDER || "gemini").toLowerCase();
const MODEL = process.env.LLM_MODEL || (PROVIDER === "openai" ? "gpt-4o" : "gemini-2.5-flash");

/**
 * Call the configured LLM with prompt and optional system instruction.
 */
export async function generateCompletion(prompt, systemInstruction = "") {
  if (!API_KEY || API_KEY === "your_api_key_here") {
    console.log("[LLM Adapter] No API key set. Operating in mock response mode.");
    return null;
  }

  try {
    if (PROVIDER === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt }]
          }
        ]
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return responseText;
    } else if (PROVIDER === "openai") {
      const url = "https://api.openai.com/v1/chat/completions";
      const messages = [];
      if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
      messages.push({ role: "user", content: prompt });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ model: MODEL, messages })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenAI API HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    }
  } catch (error) {
    console.error("[LLM API Error]:", error.message);
    return null;
  }

  return null;
}

/**
 * Helper to request structured JSON output from LLM, with fallback handling.
 */
export async function generateStructuredJSON(prompt, systemInstruction = "", fallbackObj = {}) {
  const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema without any markdown formatting or commentary.`;
  const rawText = await generateCompletion(jsonPrompt, systemInstruction);
  if (!rawText) return fallbackObj;
  return parseStructuredJSON(rawText, fallbackObj);
}
