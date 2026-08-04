# Information density review

Unit 3 Cyber Security Hub progressive-disclosure audit.

Date: August 2026  
Branch context: `feat/reduce-information-overload`

## Summary

Most interactive activities already limit what learners see at once (one question or card, staged CIA panels, collapsed glossary terms, collapsible Week 1 sessions). Remaining load came mainly from always-open topic summaries, Help topic lists, competing Home CTAs, always-visible course metadata, Incident instructions competing with the task, and the Glossary knowledge check showing all 12 questions together.

## Pages reviewed

### Home (`index.html`)

- Concern: Two equally prominent Active cards (Week 1 and Incident Classification) compete for the first action.
- Learner impact: Learners may jump into one activity and miss the Week 1 sequence.
- Decision: Minor simplification.
- Pattern: Keep Week 1 as the primary card. Move Incident Classification to a secondary text link.
- Default: N/A.
- Accessibility: Single primary path; secondary link remains keyboard accessible.
- Change made: Yes.

### Week 1 overview (`week-1/index.html`)

- Concern: Topic summary lists duplicated Session 1 content above the already-open Session 1 activity group.
- Learner impact: Long first screen with repeated information.
- Decision: Disclosure for summary groups; keep existing session disclosures.
- Pattern: Native `details` / `summary` for Session 1 topics, Session 2 topics and Directed independent study inside the summary panel. All collapsed by default. Session activity groups unchanged (Session 1 open, later groups closed).
- Default: Summary topic groups closed; Session 1 activities open.
- Accessibility: Native disclosure; headings retained inside summaries.
- Change made: Yes.

### Activities page

- Concern: There is no separate top-level Activities page.
- Decision: Future scaling preparation only.
- Pattern: When later weeks grow, group by week with `.session-disclosure`. Keep the current week open when the list remains short.
- Threshold: Enable week grouping once more than one week has active activities, or when the page exceeds about one viewport of cards.
- Change made: No (documented only).

### Baseline Knowledge Check

- Concern: Start screen includes course metadata plus learner form; quiz already shows one question.
- Decision: Minor simplification via shared course-details disclosure.
- Pattern: Course details collapsed by default; learner fields and Start remain visible. Keep one-question quiz flow.
- Change made: Yes (shared course-details disclosure).

### CIA Triad Learning

- Concern: Low for stage model (already staged). Scenarios show six items in one stage.
- Decision: No change now.
- Reason: Staging already hides future panels. Six scenario radios are manageable after definitions; splitting further would add clicks without clear benefit yet.
- Change made: No.

### Incident Classification

- Concern: Instructions, learner form, progress and card chrome appear together before the first card.
- Decision: Disclosure for instructions.
- Pattern: Instructions in a native disclosure, collapsed by default. Short “Before you begin” learner panel stays visible. One-card presentation unchanged.
- Change made: Yes.

### Cyber Security Glossary

- Concern: Browse mode is manageable (28 collapsed terms, search and filters). Knowledge check rendered all 12 questions at once.
- Decision: Staged flow for the knowledge check only.
- Pattern: One question at a time with Previous / Next, progress text, and Check answers when complete. After checking, feedback for all questions remains available.
- Change made: Yes.

### Session 2 Retrieval Quiz

- Concern: Start form density only; quiz already one section at a time.
- Decision: Minor simplification via shared course-details disclosure.
- Change made: Yes (shared).

### Resources

- Concern: Several “coming soon” panels; few live links.
- Decision: Future scaling only.
- Reason: Page is short. Collapse empty groups when more live resources arrive.
- Change made: No.

### Help

- Concern: Eight open panels create a long linear scan.
- Decision: Disclosure needed.
- Pattern: Native disclosures. Keep navigation and submission troubleshooting open by default. Collapse browser, load, confirmation, formative and privacy topics. Keep contact guidance visible.
- Change made: Yes.

### Shared learner-details start screen

- Concern: Course details seven-row list competes with required identity fields.
- Decision: Disclosure.
- Pattern: Course details in a closed native disclosure labelled with the activity name. Privacy notice and identity fields remain visible.
- Change made: Yes.

### Mobile navigation

- Concern: None beyond existing menu toggle.
- Decision: No change.
- Change made: No.

## Patterns introduced or reused

| Pattern | Where used |
| --- | --- |
| `.session-disclosure` | Week 1 session groups (existing); Week 1 summary topic groups; Help topics |
| Course-details disclosure | Shared `js/learner-details.js` |
| Staged one-item quiz | Glossary knowledge check |
| Primary vs secondary Home CTA | Home |

## Essential information kept visible

- Week 1 primary route from Home
- Session 1 activity cards when that session is open
- Learner identity fields and privacy notice before activities
- Current question / incident card during tasks
- Validation and submission errors
- Scores and feedback after checking
- Help navigation and submission recovery steps
- Help contact guidance

## Individual activity cards

Not made collapsible. Only parent groups and secondary explanations use progressive disclosure.

## Future recommendations

1. When Resources gains several live links, collapse empty categories and open categories that contain links.
2. Add a week-grouped Activities overview only after Week 2 is active.
3. Revisit CIA scenario paging if classroom feedback shows six questions are too dense on phones.
4. Keep glossary search/filters; reconsider alphabetic grouping only if the term list grows past about 40 to 50 items.
