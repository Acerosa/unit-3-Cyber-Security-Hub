# Catalogue migration (Weeks 1–7)

Cyber learner activities render through `@learning-platform/ui` **v0.1.5** where the exercise fits shared components. Pages CI pins that UI tag. This hub keeps classic per-activity `app.js` only for worksheets the library cannot express cleanly.

## Player modes

| Mode | Behaviour | Examples |
| --- | --- | --- |
| **catalogue** | Content package blocks → `InteractiveActivity` (OptionCards, Classification, ShortResponse / Reflection). Empty HTML shell; progress scripts only. **No** per-activity `app.js`. | Retrieval / learning MCQs, sorts & classify activities, short written checkpoints |
| **host** | Existing activity UI via `PageHost` + `week-N/<slug>/app.js` (+ data globals as needed). Free-text answers should mount library `LearningTextField` via `window.Unit3LearningText.mount` (paste/minChars/counter, **no** per-field Save; host keeps one Submit). | OCR shells, peer / answer-improvement, multi-field registers, dual-select matching, planners, checklists |
| **hybrid** | Practical shell stays; catalogue writing overlays | Week 2 TryHackMe `vulnerabilities101` + reflection |

Mode lists live in `src/catalogue/week-activities.ts` (`WEEK_HOST_ACTIVITY_IDS`, `WEEK_HYBRID_ACTIVITY_IDS`, `WEEK_ACTIVITY_SLUGS`).

## Full interactive set (every teaching week)

On the **catalogue** path each week exposes at least:

1. **OptionCards** — Content `single-choice` (rendered as `data-lp-block="option-cards"`)
2. **Classification** — Content `classification`
3. **Writing** — `short-response` and/or `reflection`

Writing is **threaded** through sessions (roughly one short formative prompt after every two scored MCQ/classify activities), not only dumped onto end-of-week host worksheets. Host OCR / registers / dual-field tools do **not** count toward that catalogue bar.

## What remains on classic `app.js`

Do not delete these engines without an explicit port. Host free-text answers mount `@learning-platform/ui` `LearningTextField` through `window.Unit3LearningText.createMounts()` / `.mount` (installed in `loadHubAdapters`) — paste/minChars/counter, **no** per-field Save; host keeps one Submit. Catalogue `ShortResponse` / `Reflection` stay on the catalogue path.

Pilot + Waves 2–4 rolled through main week host worksheets (OCR extended, peer/answer-improvement, planners, grids, registers, northbank analysis/exposure, hybrid THM reflection). Clipboard helper textareas are not learning fields.

- **Week 2:** northbank analysis, OCR, peer-marking, vulnerability register; hybrid THM shell
- **Week 3:** OCR, peer-marking
- **Week 4:** OCR, answer-improvement, mtm-mapping, northbank-exposure, analyse-practice
- **Week 5:** OCR, answer-improvement, ransomware-companion, stakeholder-grid, impact-analysis
- **Week 6:** legislation-matching (dual field), government-initiatives, ncsc-guidance, discuss-learning/planner, stakeholder-debate, revision-organiser, exercise-decision-record, OCR, answer-improvement
- **Week 7:** risk-register, heightened-threat, OCR, answer-improvement

Directed study / support-challenge / other extras outside the main slug map may still load their own shells; they are not catalogue-owned.

## Content load

Catalogue activities can paint when `contentReady` is true without waiting for sequential adapter boot (`adaptersReady`). Do not regress that split.

## Integrity checks

`test/site-integrity.test.js` asserts catalogue routes neither inventory-load nor retain per-activity `app.js`, while host (and hybrid practical) engines remain on disk and in inventory.
