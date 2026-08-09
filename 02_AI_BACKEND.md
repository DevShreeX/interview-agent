# 02 — INTERVIEW MIRROR AI / BACKEND INTELLIGENCE

## Mission

Build the intelligence engine that makes Interview Mirror fundamentally different from a normal mock-interview chatbot.

Core loop:

**Plan → Evaluate → Calibrate → Infer Thinking → Update Belief → Predict → Attack → Improve**

---

# 1. What this team owns

- Planner Agent
- Evaluator Agent
- Follow-Up Agent
- Reporter
- Belief State
- Calibration engine
- Thinking Style Detector
- Breakpoint Prediction
- Battle Mode engine
- Interviewer personas
- Session APIs
- Structured model outputs
- Backend business rules

---

# 2. Architecture

```text
User Answer
    ↓
Evaluator
    ↓
Evidence
    ↓
Accuracy / Depth
    ↓
Calibration Engine
    ↓
Belief State Update
    ↓
Thinking Style
    ↓
Planner
    ↓
Next Question
```

At completion:

```text
Evidence
 ↓
Reporter
 ↓
Breakpoint Prediction
 ↓
Battle Mode
 ↓
Learning Plan
```

---

# 3. Planner Agent

The Planner selects the next question using:

- current belief state
- previous questions
- answer evaluations
- confidence
- calibration
- demonstrated weaknesses
- curriculum coverage
- stale topics from memory

Rules:

- ask one question
- avoid repeated concepts
- start simple when evidence is absent
- increase difficulty when knowledge is demonstrated
- target useful weaknesses
- never expose hidden scoring criteria
- never mention internal curriculum labels
- maximum three sentences
- sound like a senior technical interviewer

---

# 4. Evaluator Agent

Evaluate every answer.

Required fields:

```text
accuracy
depth
explanation
concepts_hit
concepts_missed
follow_up
follow_up_angle
evidence_quote
misconception
```

Accuracy:

```text
1.0 = completely correct
0.7 = mostly correct
0.5 = partially correct
0.3 = surface understanding
0.0 = incorrect/no meaningful answer
```

Depth:

```text
deep
structured
surface
```

The evaluator must never invent evidence.

---

# 5. Follow-Up Agent

The follow-up should test whether the candidate actually understands the concept.

Possible targets:

```text
WHY
trade-offs
failure modes
scaling
deployment
edge cases
recovery from misconception
```

Do not teach the answer during the pressure phase.

---

# 6. Calibration Engine — CODE, NOT LLM

Confidence must be treated as structured data.

Normalize:

```text
confidence 1–5
```

Then calculate:

```text
calibration_delta =
normalized_confidence - demonstrated_accuracy
```

Suggested interpretation:

```text
> +1.5  high overconfidence
> +0.5  medium overconfidence
< -0.5  underestimation
else    well calibrated
```

The backend is the source of truth.

The LLM may explain the result but must not own the final arithmetic.

---

# 7. Why calibration matters

Example:

```text
Confidence = 4.6 / 5
Accuracy   = 0.56

Result:
HIGH OVERCONFIDENCE
```

The system should then consider targeting that topic.

Another:

```text
Confidence = 2.0 / 5
Accuracy   = 0.88

Result:
UNDERCONFIDENCE
```

This should also influence the next interview.

---

# 8. Belief State — CORE DIFFERENTIATOR

Maintain a structured state such as:

```json
{
  "rag": 0.81,
  "agents": 0.63,
  "mcp": 0.72,
  "system_design": 0.48,
  "deployment": 0.39
}
```

After every evaluated answer:

```text
old belief
→ evidence
→ update
→ new belief
```

Example:

```text
System Design
52%
↓
strong architecture answer
↓
67%
```

Then:

```text
67%
↓
weak failure-mode answer
↓
58%
```

The AI must be able to **change its assessment based on new evidence**.

---

# 9. Thinking Style Detector

Possible styles:

```text
First Principles
Pattern Matcher
Framework Applier
Intuition Led
Uncertainty Aware
Overclaimer
```

Output:

```json
{
  "primary_style": "pattern_matcher",
  "confidence": 0.82,
  "evidence_phrase": "...",
  "interview_implication": "..."
}
```

Rules:

- use technical interview evidence
- never diagnose personality
- lower confidence when evidence is weak
- include evidence

---

# 10. Breakpoint Prediction — CORE DIFFERENTIATOR

Predict:

```text
question most likely to expose weakness
reason
evidence
confidence
```

Example:

```text
Weakness:
failure-mode reasoning

Evidence:
Q04, Q07, Q09

Predicted breakpoint:
production RAG under latency constraints
```

Also optionally predict:

```text
likely rejection reason
likely pass scenario
question likely to be aced
30-day readiness trajectory
```

Never promise a hiring outcome.

Use:

> highest-risk failure point

rather than:

> guaranteed rejection.

---

# 11. Battle Mode — CORE DIFFERENTIATOR

Input:

```text
weakest_topic
weakness_evidence
persona
```

Run approximately five targeted questions.

Pressure sequence:

```text
Weakness
↓
Technical question
↓
Answer
↓
Counter-question
↓
Trade-off
↓
Failure mode
↓
Scaling/deployment
↓
Recovery
```

Example:

```text
Candidate:
"I would add replicas."

AI:
"What happens to consistency and write amplification?"
```

The purpose is not to embarrass the candidate.

The purpose is to determine whether the weakness is real and whether the candidate can recover.

---

# 12. Battle result

Calculate:

```text
before_score
after_score
recovered_concepts
remaining_weakness
next_learning_action
risk_change
```

Example:

```text
Before: 41%
After: 57%
Recovery: +16
```

---

# 13. Reporter Agent

Generate:

```text
executive summary
readiness
strengths
weaknesses
calibration
thinking style
skill radar
evidence
breakpoint
Battle recommendation
learning plan
```

Avoid generic statements such as:

> Practice more.

Instead:

> Explain vector-index failure modes and quantify the latency/quality trade-off in a production RAG design.

---

# 14. Personas

## Alex

```text
Socratic
Warm
Rigorous
Production-oriented
System design
Production AI
```

## Priya

```text
First-principles
Direct
Precise
ML
RAG
Evaluation
```

## Marcus

```text
Practical
No-nonsense
Deployment
Agents
MCP
Operational failure modes
```

---

# 15. Completion rules

Backend controls completion.

Minimum:

```text
8 questions
4 curriculum days
target belief state populated
4 calibration deltas
```

Do not allow the LLM to override these gates.

---

# 16. Structured output

Every important LLM response must be schema validated.

If invalid:

```text
attempt 1
↓
validate
↓
retry once
↓
safe fallback
```

Never write malformed model output into persistent state.

---

# 17. API

Implement:

```text
POST /api/interview/start
POST /api/interview/continue
POST /api/interview/complete

GET /api/report/:sessionId

POST /api/battle/start
POST /api/battle/continue
POST /api/battle/complete
```

---

# 18. Final integration contract

Frontend sends:

```json
{
  "sessionId": "...",
  "answer": "...",
  "confidence": 4
}
```

Backend returns only user-safe state such as:

```json
{
  "question": "...",
  "questionNumber": 4,
  "progress": 0.4
}
```

After completion:

```json
{
  "readiness": 72,
  "calibration": {},
  "thinkingStyle": {},
  "evidence": [],
  "breakpoint": {},
  "battleAvailable": true
}
```

Do not send hidden prompts, hidden reasoning or internal chain-of-thought to the frontend.

---

# 19. Hackathon priority

Build in this order:

### P0 — MUST WORK
1. adaptive interview
2. evaluator
3. confidence
4. calibration
5. belief state
6. report
7. breakpoint prediction
8. Battle Mode

### P1 — SHOULD WORK
9. thinking style
10. follow-up intelligence
11. learning plan
12. readiness forecast

### P2 — NICE TO HAVE
13. advanced cohort intelligence
14. additional personas
15. advanced forecasting

If time becomes limited, protect P0.

---

# 20. Definition of done

A complete session must execute:

```text
Start
↓
Question
↓
Answer + Confidence
↓
Evaluate
↓
Update Belief
↓
Calculate Calibration
↓
Choose Next Question
↓
Complete
↓
Report
↓
Predict Breakpoint
↓
Battle
↓
Measure Recovery
```

This is the actual intelligence core of Interview Mirror.
