/**
 * Clean and parse JSON from LLM outputs safely.
 */
export function parseStructuredJSON(rawText, fallbackObj = {}) {
  if (!rawText || typeof rawText !== "string") {
    return fallbackObj;
  }

  // Remove markdown code fences like ```json ... ``` or ``` ... ```
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  const match = cleaned.match(/{[\s\S]*}|\[[\s\S]*\]/);
  if (match) {
    cleaned = match[0];
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn("JSON Parse Warning: Failed to parse LLM JSON output. Raw:", rawText);
    return fallbackObj;
  }
}
