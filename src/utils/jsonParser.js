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

  // Find first { or [ and last } or ]
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");

  let startIdx = -1;
  let isArray = false;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    isArray = false;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    isArray = true;
  }

  if (startIdx !== -1) {
    const endIdx = isArray ? cleaned.lastIndexOf("]") : cleaned.lastIndexOf("}");
    if (endIdx > startIdx) {
      cleaned = cleaned.substring(startIdx, endIdx + 1);
    }
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn("JSON Parse Warning: Failed to parse LLM JSON output. Raw:", rawText);
    return fallbackObj;
  }
}
