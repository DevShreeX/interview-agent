import test from "node:test";
import assert from "node:assert/strict";
import { logPrivacyAudit, getAuditLogs, clearAuditLogs, hashIdentifier } from "../src/services/privacyAudit.js";

test("Privacy Audit — PII Excluded and Session Hashed", () => {
  clearAuditLogs();

  const rawSession = "sess_user_john_doe_secret_123";
  const entry = logPrivacyAudit({
    sessionId: rawSession,
    agentType: "planner",
    promptId: "PLANNER_V1",
    promptVersion: "1.0.0",
    topic: "system_design",
    questionNumber: 2,
    fieldsUsed: ["beliefState", "history"]
  });

  assert.ok(entry.audit_id);
  assert.equal(entry.hashed_session, hashIdentifier(rawSession));
  assert.notEqual(entry.hashed_session, rawSession);
  assert.ok(!JSON.stringify(entry).includes("john_doe"));
  assert.ok(entry.pii_fields_excluded.includes("name"));
  assert.ok(entry.pii_fields_excluded.includes("email"));

  const logs = getAuditLogs();
  assert.equal(logs.length, 1);
});
