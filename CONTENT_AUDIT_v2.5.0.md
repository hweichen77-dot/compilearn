# Compilearn Content Audit — v2.5.0

Full review of all 503 lessons across 63 modules. Two layers: a programmatic pass (structure + every challenge solution executed against its test cases) and 16 parallel reviewers who read and graded every lesson 1–5 on correctness, clarity, progression, enrichment, and polish.

---

## Headline

The content is in strong shape. It is structurally complete and technically correct. The problems that exist are concentrated, specific, and fixable in a day, not spread thin across the whole course.

- **Overall grade: 4.66 / 5** (63 modules, range 4.1–5.0)
- **1,579 / 1,579 challenge test cases pass** in real Python / Java / C++. Zero failing solutions.
- **No missing lessons.** Every module's declared lesson count matches its actual count. No order gaps, no duplicate orders.
- **No broken challenges.** Every challenge has a solution and test cases.
- **No thin lessons.** Shortest explanation is 1,250 chars; median 2,505.

### Score by track

| Track | Modules | Avg | Weakest |
|---|---|---|---|
| AP CSA (Java) | 11 | **4.76** | csa-09, csa-10 (4.5) |
| AI Curriculum (AITrack page) | 22 | **4.69** | ai-18, ai-21 (4.3) |
| AI Projects (Projects tab) | 23 | **4.66** | prod-05, prod-06 (4.3) |
| AP CSP | 7 | **4.44** | csp-dat, csp-aap1 (4.1) |

CSP is the weakest track, dragged down by a rounding-trap challenge and a sequencing problem, not by wrong content.

---

## Tier 0 — Must fix (student sees something wrong)

All five are in the **older AI Curriculum** track (the AITrack page), which was not part of the recent enrichment pass. These are leftover AI self-correction artifacts that shipped into student-facing text.

1. **ai-18-l5** — displayed example output is `15` but the correct (and graded) answer is `9`. The explanation contains a visible ramble: *"Wait recompute: drifts 1+0+8=9... but actual sample: see notes."* Fix the shown output to `9` and rewrite the explanation.
2. **ai-18-l6** — same problem: shows `24`, correct answer is `14`. Strip the artifact.
3. **ai-17-l5** (Prefill Reassembler) — shows `chars 26`, correct value is `27` (15+12). Explanation reads *"15 + 12 wait recount: see notes."*
4. **ai-21-l5** — a live multiple-choice quiz ships two garbage distractor options: `"$0.012000 ... no, $0.012"` and `"$0.012000 total is wrong; it is $0.012000"`. The right answer is correct; the wrong answers are editing debris. Replace with real distractors.
5. **ai-21-l8** — worked example step contains `"...= $0.032... Recompute: ..."` self-correction text.

> Note: the underlying test cases hold the correct values in every case, so the challenges still grade correctly. The damage is purely that a learner reads a wrong number and a garbled sentence. I grep-confirmed these artifacts exist in exactly 3 files (curriculum module-17, 18, 21) and nowhere else in the codebase.

---

## Tier 1 — Should fix (real code bugs and self-contradictions)

### Course-wide

6. **Fake model ID.** Every AI Project code sample hardcodes `model="claude-sonnet-4-6"`, which is not a real Anthropic model. Flagged independently by 5 reviewers. If a learner runs the code against the live API it 404s. Decide once: use a real ID (e.g. `claude-sonnet-4-5` / `claude-haiku-4-5`, or the current Sonnet 5 / Haiku 4.5), or add a one-line "replace with your model" note. This is a global find/replace.

7. **Provider mismatch in the onboarding path.** The new prod-00 "Starter Tech Stack" lesson (mine) sets students up on **Groq + the `openai` library + `AI_API_KEY`**, but every build project (prod-01…22) uses the **Anthropic SDK + `ANTHROPIC_API_KEY`**. A beginner who follows the playbook literally cannot run the first project. Pick one: either point prod-00 at Anthropic to match the projects, or add a sentence in prod-00 saying the build track uses Anthropic and why. (Groq is genuinely simpler/free, so the cleaner fix may be to make one or two early projects provider-agnostic.)

### "Ship" lessons that contradict their own building blocks

A recurring pattern: the final assembly lesson wires pieces in a way that breaks the discipline the module just taught.

8. **prod-22-8** (capstone) charges the budget guard **after** the model call, directly contradicting lesson 22-7's "guard before you spend." As wired, the guard cannot prevent overspend. Reorder.
9. **prod-11-8** (capstone) checks `outcome["status"] == "failed"`, a status its own lesson-6 `run_step_safe` never returns (it yields `ok`/`skipped` or raises). A failed step throws instead of returning FAILURE.
10. **prod-20-5** starter code TODO says "append user AND assistant turn," but the solution/hints append assistant only, so a learner following the starter duplicates the user turn.

### Real runtime bugs in reference solutions

11. **prod-17-2** — `cosine_similarity` has no zero-vector guard (prod-16 has one). An empty or failed embedding crashes the whole Notes Brain with `ZeroDivisionError`. Add the guard.
12. **prod-07-4** — `extract_json` uses `.index`/`.rindex`, which crash on a reply with no JSON array, despite the lesson selling it as the defensive guard. Its twin prod-06-3 does it correctly with `.find` + `-1`. Copy that.
13. **prod-15-1** — `chunk_text` infinite-loops when `overlap >= size`. Silent hang, never guarded or mentioned.
14. **prod-14-4** — reference solution has a dead/duplicated tag lookup and a `SELF_CLOSING` tag-name-vs-type-name inconsistency between lesson and challenge.
15. **prod-18-2** — lesson teaches `ast.parse` but the challenge uses a `startswith` line scan that misses async/decorated/nested defs. Note the simplification or use `ast`.

### AP CSP

16. **csp-dat-l5** (highest-impact CSP fix) — the "round to nearest 10" challenge silently depends on Python's banker's rounding (`round(5)`→0, `round(25)`→20). A student who implements the intuitive round-half-up **fails the hidden tests** with correct-looking code. Either change the test values to avoid ties or teach the tie rule explicitly.
17. **csp-aap1 sequencing** — every challenge in this module needs loops and conditionals, but the module never teaches them, and the module that does (csp-lab) is ordered *after* it. Add a short control-flow primer to aap1, or reorder so the lab comes first.
18. **csp-aap1-l8** — the Python global-reassignment example is technically wrong (it raises `UnboundLocalError`, it does not "create a new local"), masked by a vague `# ERROR` comment.
19. **csn-l1** — the no-leading-zeros rule appears only in the challenge and contradicts the lesson's own example that accepts `007`.
20. **aap2-l8** — uses "intractable" where AP says "unreasonable time," and labels a deterministic walk as "random."

### AP CSA — AP Java subset drift

The CSA challenges are all correct Java, but several lean on features outside the tested AP CSA subset. For an exam-accurate course this matters. Grouped because the fix is one editorial sweep:

21. **Internal contradiction:** csa-10-l4 teaches string recursion with `charAt` (6 uses) while csa-11-l2 explicitly tells students *the exam does not use charAt*. Fix csa-10-l4 to `substring(0,1)`.
22. Outside-subset usage to reframe as "convenience, not exam syntax": `Scanner` I/O (everywhere, an auto-grading convention — needs one up-front disclaimer), `StringBuilder` (csa-07/08 output), `instanceof` (csa-09-l7, the whole lesson), `Math.max` (csa-10-l5), `Arrays.copyOfRange` (csa-10-l7), `long` (csa-04-l4/l8 — just switch to `int`), `Integer.parseInt`/`Double.parseDouble` (csa-02-l7), `protected` (csa-09).
23. **csa-05-l7** — a stray malformed `"objects": []` field in the second quiz question. Delete it.
24. **csa-10-l2** — lesson teaches `countDown` (output order), but every diagram and step-through shows factorial instead, so the "work before vs after the recursive call" idea is never actually illustrated.

---

## Tier 2 — Polish

- **AI-tell vocabulary** in ~18 lessons, almost all in the AI Curriculum track: "robust" (heaviest — ai-08, ai-09, ai-13, csa-08-l2, prod-15-7), "unlock" (ai-15, ai-17, ai-11), "leverage" (ai-08, ai-18, ai-21). One global editorial swap → reliable/resilient/hardened.
- **ai-05 range notation** — "0, 255" and "0, 1" read as tuples throughout a vectors lesson. This is an em-dash-strip artifact from an earlier humanize pass; restore "0 to 255".
- **Render bugs:** stray `\$40,000` (ai-14-l7) and `$`-escape (ai-02-l7 comparison table has a bare `", "` cell) render literal backslashes/commas.
- **Lesson-vs-challenge drift** (small but undercuts the exact discipline being taught): stop-word sets diverge (prod-09-3), normalize step never exercised (prod-13-8), median rule differs (prod-21-6), float-equality on money (prod-06-7), dedup approaches differ (prod-07-8).
- **xp_reward inconsistency** across CSA modules (100 in csa-06, 10 in csa-05, absent in csa-04).

---

## Missing content

Structurally nothing is missing. Two genuine pedagogical gaps:

- **ai-03 (Prompt Engineering) has no chain-of-thought lesson** — a core technique. Worth adding.
- **csp-aap1 has no control-flow lesson** despite its challenges requiring it (see #17).

Redundancy to trim (the inverse problem): ai-03-l2 ≈ ai-01-l2 (same tokenizer content), ai-21-l1 ≈ ai-21-l5 (same asymmetric-pricing point), csa-08-l3 ≈ csa-08-l5 (per-row accumulator), and csp-lab re-teaches csp-aap1 wholesale (acceptable as a lab, worth a "recap" label).

---

## The animated-diagram gap (the "not polished" question)

The recent enrichment added animated diagrams to all 327 lessons in Projects + CSP + CSA. The **176 AI Curriculum lessons have none** — but this is softer than it looks: every one of those lessons already carries a static `concept_diagram` plus `step_throughs`, which render today. So the curriculum is not visually barren; it just hasn't been upgraded to the new autoplaying diagrams.

**Verify one thing:** confirm the AITrack renderer actually displays `concept_diagram`. Two reviewers flagged that if the page only reads `animated_diagrams`, those 176 lessons would show no diagram at all. (It should render — `ConceptDiagram` is wired in `LessonEnhancements` — but worth a 2-minute check on a live AITrack lesson.)

If you want to upgrade the curriculum diagrams, prioritize the process-heavy lessons: ai-01-l5/l7 (softmax, attention), ai-13-l2 (SSE streaming), ai-14-l4/l6 (layered defense), ai-15-l4 (ReAct loop), ai-16-l5 (retry/fallback), ai-19-l5 (softmax sampling), ai-20-l7 (tool loop).

---

## Recommended order of work

1. **Tier 0** (5 curriculum artifacts) — an hour, and it is the only student-visible-wrong content. Do this first.
2. **Model ID** global fix (#6) and **prod-00 provider mismatch** (#7) — these affect every project.
3. **Capstone contradictions** (#8–10) and **runtime bugs** (#11–15) — the capstones are the finale; they should not contradict themselves.
4. **csp-dat-l5 rounding** (#16) and **csp-aap1 sequencing** (#17) — the two CSP fixes that most affect a student's success.
5. **CSA subset sweep** (#21–24) — one editorial pass for exam accuracy.
6. **Tier 2 polish** — AI-tell swap, render bugs, drift cleanup.

---

## What is genuinely excellent (don't touch)

- **Every coding challenge is provably correct** (1,579/1,579). That is rare and worth protecting with the existing `verify-solutions.mjs` in CI.
- csa-03 (Boolean/if) scored a perfect 5.0. csa-06, prod-02, prod-13, ai-07, ai-13/14/15/16 all near-perfect.
- Standout individual lessons: prod-01-6 (map-reduce with exact call accounting), prod-11-3 (topological sort + cycle detection), prod-19-6 (fail-safe policy config), ai-04-l7 (re-inject system prompt on /clear), ai-14-l4 (cumulative jailbreak defense), csa-11-l8 (model FRQ walkthrough), csp-aap2-l7 (binary search).
- Prose in the enriched tracks (Projects/CSP/CSA) is clean: no em dashes, no curly quotes, no AI-tell words. The humanize pass held.

---

*Per-module, per-lesson findings for all 63 modules are in `scratchpad/audit/r01…r16-*.md`.*
