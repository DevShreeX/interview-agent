# 01 — INTERVIEW MIRROR FRONTEND / EXPERIENCE

## Mission

Build the complete judge-facing product experience.

The goal is NOT to build a generic AI interview website.

The goal is to make the judge experience this story:

**Interview → Measure → Reveal the Gap → Explain → Predict → Battle → Improve → Remember**

### Winning positioning

> **Interview Mirror discovers the gap between your confidence and your demonstrated capability, predicts where your interview will break, and creates a targeted interview to attack that weakness.**

---

# 1. What this team owns

- Landing website
- Interview experience
- Confidence interaction
- Results/report
- Calibration Gap visualization
- Thinking Style visualization
- Evidence trail
- Breakpoint Prediction
- Battle Mode interface
- Growth/Memory interface
- Privacy presentation
- Responsive design
- Animation
- API integration
- Hackathon demo mode

---

# 2. Product design direction

Use a premium technical AI aesthetic:

- near-black background
- subtle cyan/electric blue/violet accents
- fine grid/noise
- technical network visual
- restrained glow
- strong typography
- generous whitespace
- sharp cards
- minimal glassmorphism

Avoid:

- generic purple AI landing pages
- cartoon robots
- excessive glass
- excessive glow
- giant gradients
- dashboard clutter
- unnecessary animations

The interface should feel like an **AI intelligence instrument**, not a chatbot.

---

# 3. Landing page

## Hero

Headline:

> **Know what you know. Know what breaks you.**

Supporting text:

> Interview Mirror is an adaptive AI technical interviewer that measures what you know, how you reason, how accurately you judge your own knowledge, and the exact weakness most likely to expose you.

CTA:

```text
Start an Interview
```

Secondary:

```text
See How It Works
```

### Hero visual — BEST CHOICE

Use a **Living Data / Knowledge Network**.

The network represents:

```text
Knowledge
Confidence
Evidence
Memory
Weakness
Questions
```

Animation must be slow and subtle:

- breathing nodes
- tiny data pulses
- slow connection movement
- slight cursor response
- no giant arcs
- no constant flying particles

---

# 4. Landing page story

Build these sections in this order:

```text
Hero
↓
Why traditional interviews fail
↓
Calibration Gap
↓
How the AI thinks
↓
Evidence
↓
Breakpoint Prediction
↓
Battle Mode
↓
Memory / Growth
↓
Privacy
↓
Start Interview
```

Do NOT make the page a feature checklist.

---

# 5. Calibration Gap — HIGHEST PRIORITY

This is the main visual differentiator.

Show:

```text
YOUR CONFIDENCE
████████████████████  4.6 / 5

DEMONSTRATED DEPTH
███████████           2.8 / 5

CALIBRATION GAP
+1.8

HIGH OVERCONFIDENCE
```

Then:

> **You don't have a knowledge problem here. You have a depth problem.**

Add:

```text
WHY?
```

Clicking it opens evidence from actual interview answers.

### Animation

1. Confidence appears.
2. Demonstrated score appears.
3. Gap expands.
4. Evidence appears.
5. Breakpoint appears.
6. Battle Mode becomes available.

This should be the biggest “wow” moment before Battle Mode.

---

# 6. Interview screen

Route:

```text
/interview
```

Required:

- interviewer persona
- question
- answer area
- confidence 1–5
- progress
- submit
- loading
- error handling

Example:

```text
QUESTION 04 / 10

Design a production RAG system for
10,000 concurrent users.

[ Answer ]

How confident are you?

1  2  3  4  5

[ Submit ]
```

Do not show hidden evaluation criteria.

---

# 7. Confidence must matter

Confidence is NOT decorative.

The UI sends it to the backend.

Examples:

```text
5/5 + weak answer
→ calibration risk

2/5 + strong answer
→ possible underconfidence
```

The backend decides how this affects future questioning.

---

# 8. Adaptive state indicator

Optional subtle panel:

```text
LIVE INTERVIEW SIGNAL

Topic:
RAG

Confidence:
4.4

Question:
04 / 10
```

Do not expose internal hidden reasoning.

---

# 9. Interview personas

### Alex
Socratic / warm / rigorous / system design / production AI.

### Priya
First-principles / direct / precise / ML / RAG.

### Marcus
Practical / no-nonsense / deployment / agents / MCP.

The interface should make personas feel different through tone and question presentation.

---

# 10. Results / Report

Route:

```text
/report
```

Top:

```text
INTERVIEW READINESS
72 / 100
```

Then:

1. Calibration
2. Thinking Style
3. Skill Radar
4. Strengths
5. Gaps
6. Evidence
7. Breakpoint Prediction
8. Battle Mode
9. Learning Plan

---

# 11. Thinking Style

Possible labels:

```text
First Principles
Pattern Matcher
Framework Applier
Intuition Led
Uncertainty Aware
Overclaimer
```

Example:

```text
YOUR REASONING PATTERN

PATTERN MATCHER

82% confidence

Strength:
Fast recognition of familiar architectures.

Risk:
Reasoning becomes less structured
when the familiar pattern breaks.
```

Always describe this as an **interview reasoning pattern**, not a psychological diagnosis.

---

# 12. Evidence trail

Never show only:

```text
System Design: 61%
```

Show:

```text
SYSTEM DESIGN
61%

✓ Identified major components
✓ Mentioned caching

✕ Did not address failure recovery
✕ Did not quantify trade-offs

Evidence:
Q04
Q07
Q09
```

Add:

```text
What would change this score?
```

---

# 13. Breakpoint Prediction — HIGHEST PRIORITY

After the report:

# ⚠️ YOUR BREAKPOINT

```text
Question most likely to expose your weakness:

"Your vector database is causing
P95 latency to exceed 800ms.
What changes first, and why?"
```

Then:

```text
WHY WE CHOSE THIS

3 answers
→ strong architecture recognition

2 answers
→ weak failure-mode reasoning

1 answer
→ high confidence despite missing trade-offs
```

CTA:

```text
PROVE THE AI WRONG
```

This opens Battle Mode.

---

# 14. Battle Mode — HIGHEST PRIORITY

Route:

```text
/battle
```

Battle Mode should feel focused and serious.

```text
BATTLE MODE

TARGET
System Design Depth

INTERVIEWER
Marcus

DIFFICULTY
High
```

The AI asks one pressure question at a time.

Example flow:

```text
Candidate:
"I would add replicas."

AI:
"What happens to consistency and
write amplification?"
```

Then:

```text
Candidate answers

AI:
"Now assume traffic increases 10x.
Which component becomes the bottleneck first?"
```

Do not turn this into a game.

---

# 15. Battle result

Show:

```text
BATTLE COMPLETE

TARGET:
System Design Depth

BEFORE
41%

AFTER
57%

RECOVERY
+16

STILL UNSTABLE:
Failure-mode reasoning

NEXT ACTION:
30-minute production architecture drill
```

This before/after visual is a key demo moment.

---

# 16. Memory / Growth

Route:

```text
/memory
```

Show:

```text
READINESS
58 → 64 → 72

CALIBRATION
+1.7 → +1.1 → +0.4
```

Then:

> Your confidence is becoming more aligned with your demonstrated knowledge.

Next session should visibly reference previous weaknesses.

Example:

> Last time, failure-mode reasoning was your biggest weakness. Today we're testing it under a production constraint.

---

# 17. Cohort

Optional but valuable:

```text
YOUR PERCENTILE
78th

COMMON COHORT BLINDSPOT
Evaluation depth

YOUR RELATIVE STRENGTH
RAG fundamentals
```

Only aggregate data.

---

# 18. Privacy

Show:

```text
PRIVACY BY DESIGN

✓ PII excluded from prompt audits
✓ Session isolation
✓ Evidence traceability
✓ Aggregate cohort data
✓ Versioned prompts
```

---

# 19. Navigation

```text
Interview
Reports
Battle
Memory
Cohort

                    Start Interview
```

---

# 20. Component structure

```text
components/
├── ui/
├── landing/
├── interview/
├── report/
├── battle/
├── memory/
├── cohort/
└── privacy/
```

---

# 21. Frontend API contract

```text
POST /api/interview/start
POST /api/interview/continue
POST /api/interview/complete

GET /api/report/:sessionId

POST /api/battle/start
POST /api/battle/continue
POST /api/battle/complete

GET /api/memory
GET /api/cohort
```

---

# 22. Demo mode

Create deterministic demo data.

The judge must be able to experience:

```text
Interview
→ Confidence
→ Evaluation
→ Calibration Gap
→ Thinking Style
→ Breakpoint
→ Battle
→ Recovery
→ Memory
```

even if an external AI service fails.

---

# 23. Definition of done

The judge must understand the product within 10 seconds and complete the core journey without developer intervention.

The frontend is successful when the judge remembers:

> **“It found the question that would break me.”**
