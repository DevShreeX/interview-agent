import crypto from "crypto";

const auditLogs = [];

/**
 * Hash raw session identifier to prevent PII / candidate tracing in audit logs.
 */
export function hashIdentifier(rawId) {
  if (!rawId) return "anon_hash";
  return crypto.createHash("sha256").update(String(rawId)).digest("hex").substring(0, 16);
}

/**
 * Log prompt execution metadata while strictly stripping PII values.
 */
export function logPrivacyAudit({ sessionId, agentType, promptId, promptVersion = "1.0.0", topic = "system_design", questionNumber = 1, fieldsUsed = [], estimatedTokens = 150 }) {
  const PII_EXCLUDED_FIELDS = ["name", "email", "username", "raw_candidate_id", "personal_identifiers"];

  const auditEntry = {
    audit_id: "audit_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
    timestamp: new Date().toISOString(),
    hashed_session: hashIdentifier(sessionId),
    agent_type: agentType,
    prompt_id: promptId,
    prompt_version: promptVersion,
    topic,
    question_number: questionNumber,
    fields_used: fieldsUsed,
    pii_fields_excluded: PII_EXCLUDED_FIELDS,
    estimated_tokens: estimatedTokens
  };

  auditLogs.push(auditEntry);
  return auditEntry;
}

export function getAuditLogs() {
  return [...auditLogs];
}

export function clearAuditLogs() {
  auditLogs.length = 0;
}
