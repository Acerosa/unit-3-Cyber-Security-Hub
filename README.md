# Unit 3 Cyber Security Hub

Interactive learning, revision and formative assessment resources for **OCR Level 3 IT Unit 3 Cyber Security**.

## 1. Project purpose

This repository is the central learner-facing website for Unit 3. It will eventually contain:

- weekly lesson resources
- interactive activities
- retrieval quizzes
- examination practice
- glossaries
- directed independent study
- formative result collection

This foundation release provides the hub shell, Week 1 overview, the Baseline Knowledge Check, CIA Triad Learning, the interactive Cyber Security Glossary, Session 2 Retrieval Quiz, and the migrated Northbank Incident Classification activity.

## 2. Source repository

[https://github.com/Acerosa/northbank-incident-classification](https://github.com/Acerosa/northbank-incident-classification)

The original classifier retains its own development history and GitHub Pages site during testing. **Do not archive the source repository yet.**

## 3. Target repository

[https://github.com/Acerosa/unit-3-Cyber-Security-Hub](https://github.com/Acerosa/unit-3-Cyber-Security-Hub)

Local working folder name used in this migration: `unit3-cyber-security-hub`.

Published site (after GitHub Pages is enabled):

[https://acerosa.github.io/unit-3-Cyber-Security-Hub/](https://acerosa.github.io/unit-3-Cyber-Security-Hub/)

## 4. Migration approach

- Clean file copy into the hub (no submodule, no subtree, no shared `.git` history)
- Application logic in `app.js` and scenario data in `scenarios.js` copied unchanged
- Nested relative paths updated for GitHub Pages project hosting
- Shared hub header, navigation, breadcrumbs and footer added around the activity
- Google Apps Script `/exec` collector URL preserved exactly
- Source repository left unmodified

## 5. Learner-facing information architecture

```text
Unit 3 Cyber Security Hub
├── Home
├── Week 1
│   ├── Week 1 Overview
│   ├── Baseline Knowledge Check         (Active)
│   ├── CIA Triad Learning               (Active)
│   ├── Incident Classification          (Active)
│   ├── Cyber Security Glossary          (Active)
│   ├── Session 2 Retrieval Quiz         (Active)
│   ├── OCR Command-Word Guide           (Coming soon)
│   ├── OCR-Style Question Practice      (Coming soon)
│   └── Directed Independent Study       (Coming soon)
├── Resources
└── Help
```

There is no top-level Activities page. Week activities live inside each week area.

## 6. Why activities are organised within each week

Learners follow a weekly sequence. Keeping Session 1, Session 2 and independent study inside the week page preserves that journey and avoids duplicating the full activity list on Home or Resources.

## 7. Current implemented activities

### Baseline Knowledge Check

Route: `week-1/baseline-knowledge-check/`

Published path (after Pages deployment):

`https://acerosa.github.io/unit-3-Cyber-Security-Hub/week-1/baseline-knowledge-check/`

Purpose: a low-stakes teacher-created baseline diagnostic that identifies learners' starting knowledge before Week 1 cyber security teaching begins. It is completed independently without notes. It is not a formal grade and not an official OCR assessment.

Question structure:

- 10 scored single-choice questions (1 diagnostic mark each)
- Question 11: required confidence rating (not scored)
- Question 12: required prior-knowledge free-text response (not scored, max 400 characters)
- 12 responses in total; maximum diagnostic mark is 10

After checking:

- score, percentage, time used and confidence are shown
- incorrect scored-question numbers are listed
- correct answers are not revealed in the learner interface

Submission notes:

- Attempt ID key: `unit3-baseline-knowledge-check-attempt-id` (sessionStorage only)
- Activity ID: `U3-W01-BASELINE`
- Submits Collector schema 3.0 with `maximumScore` 10
- `reflection` includes answer codes for Questions 1 to 10, confidence and the prior-knowledge response
- answer codes help the tutor diagnose distractor misconceptions without sending full option text
- Requires the live Apps Script deployment to identify as `UNIT3-COLLECTOR-V3.0`

Privacy and answer-security limitations:

- Do not collect email addresses, passwords or other sensitive personal information
- Correct answers are stored in public static JavaScript and may be inspected
- Do not describe this diagnostic as secure or use it for formal grading

### CIA Triad Learning

Route: `week-1/cia-triad-learning/`

Published path (after Pages deployment):

`https://acerosa.github.io/unit-3-Cyber-Security-Hub/week-1/cia-triad-learning/`

Purpose: guided formative learning on the CIA triad (confidentiality, integrity and availability), with Northbank examples, unscored guided practice, then a 15-mark knowledge check.

Learning stages:

1. Your details
2. Learn the model
3. Guided examples (not scored)
4. Definition check (Questions 1 to 3, 3 marks)
5. Northbank scenarios (Questions 4 to 9, 6 marks)
6. Combined impacts (Questions 10 to 12, 6 marks)
7. Reflection and result

Scoring notes:

- Maximum score: 15
- Item range: 1 to 12
- Questions 10 to 12 award one mark per correct selected aim (maximum 2 per question)
- Partially correct multi-aim items are included in `questionsForReview`
- Reflection is required (40 to 500 characters) and is not auto-scored

Submission notes:

- Attempt ID key: `unit3-w01-cia-attempt-id` (sessionStorage only)
- Activity ID: `U3-W01-CIA`
- Activity type: Guided learning
- Schema version: 3.0
- Partner fields are not shown
- Browser probe helper: `window.Unit3CiaProbe` (TEST only; no TEST option in the learner UI)

Collector registry dependency (manual staff action):

The live Apps Script collector validates Activity IDs against its Activities worksheet. Cursor cannot edit that private sheet. Before LIVE or TEST submissions can be accepted for this activity, staff must add this row:

| Field | Value |
| --- | --- |
| Activity ID | `U3-W01-CIA` |
| Activity name | CIA Triad Learning |
| Unit ID | `U3` |
| Week number | `1` |
| Session | Session 1 |
| Activity type | Guided learning |
| Maximum score | `15` |
| Activity version | `1.0` |
| Allows partner | `FALSE` |
| Item minimum | `1` |
| Item maximum | `12` |
| Active | `TRUE` |

Until that row is Active, endpoint tests should report the missing registry dependency rather than remapping the payload to another activity.

### Incident Classification

Route: `week-1/incident-classification/`

Published path (after Pages deployment):

`https://acerosa.github.io/unit-3-Cyber-Security-Hub/week-1/incident-classification/`

### Cyber Security Glossary

Route: `week-1/glossary/`

Published path (after Pages deployment):

`https://acerosa.github.io/unit-3-Cyber-Security-Hub/week-1/glossary/`

Purpose: help learners learn Week 1 terminology, search and filter terms, practise with flashcards, complete a 12-question knowledge check, reflect on one term, and submit a formative result to the existing Google Sheets collector.

### Session 2 Retrieval Quiz

Route: `week-1/retrieval-quiz/`

Published path (after Pages deployment):

`https://acerosa.github.io/unit-3-Cyber-Security-Hub/week-1/retrieval-quiz/`

Purpose: a 10-minute, 15-mark formative retrieval starter for Session 2. It checks recall of the CIA triad, the six Week 1 incident types, the difference between confidentiality and integrity, and selecting exact evidence from a scenario.

- Timing: 10 minutes (timer starts on Start quiz)
- Total marks: 15
- Numbered questions: 10 (including 2(a), 2(b), 2(c))
- Response sections: 12
- Question 9 written response is self-marked using two teacher marking points
- Attempt ID key: `unit3-session2-retrieval-attempt-id`
- Activity ID: `U3-W01-RETRIEVAL`
- Submits Collector schema 3.0 with `maximumScore` 15 and review items numbered 1 to 10

## 8. Planned Week 1 activities

Still marked Coming soon on the Week 1 page:

- OCR Command-Word Guide
- OCR-Style Question Practice
- Directed Independent Study

## 9. File structure

```text
/
  index.html
  README.md
  .gitignore
  .nojekyll
  /css
    main.css
    activity.css
  /js
    navigation.js
    session-disclosure.js
    activity-utils.js
    course-context.js
    learner-details.js
    submissions.js
  /assets
    /images
    /icons
  /resources
    index.html
  /help
    index.html
  /week-1
    index.html
    /baseline-knowledge-check
      index.html
      questions.js
      baseline.js
      activity.css
    /cia-triad-learning
      index.html
      content.js
      app.js
      styles.css
    /glossary
      index.html
      terms.js
      glossary.js
      activity.css
    /retrieval-quiz
      index.html
      questions.js
      quiz.js
      activity.css
    /incident-classification
      index.html
      app.js
      scenarios.js
      activity.css
  /docs
    /apps-script
      /collector-v2
        Code.gs
        README.md
```

No frameworks, npm packages, build tools or server-side code.

## 10. Local testing

1. Clone this repository.
2. From the repository root, start a simple static server, for example:

   ```bash
   python -m http.server 8080
   ```

3. Open:

   - `http://localhost:8080/`
   - `http://localhost:8080/week-1/`
   - `http://localhost:8080/week-1/baseline-knowledge-check/`
   - `http://localhost:8080/week-1/cia-triad-learning/`
   - `http://localhost:8080/week-1/glossary/`
   - `http://localhost:8080/week-1/retrieval-quiz/`
   - `http://localhost:8080/week-1/incident-classification/`
   - `http://localhost:8080/resources/`
   - `http://localhost:8080/help/`

4. Confirm CSS/JS load, navigation works, the baseline diagnostic scores out of 10 without revealing answers, the glossary shows searchable terms, and the classifier shows 12 cards.
5. Refresh nested URLs directly to confirm GitHub Pages-style deep links work.

## 11. GitHub Pages deployment

1. Use the default branch `unit-3-Cyber-Security-Hub` (or merge the feature branch into it when ready).
2. In GitHub: **Settings → Pages**.
3. Source: **Deploy from a branch**.
4. Branch: `unit-3-Cyber-Security-Hub`, folder: `/ (root)`.
5. Save and wait for publishing.
6. Confirm `.nojekyll` is present so asset paths are not processed by Jekyll.
7. Test the published Home, Week 1 and Incident Classification URLs.

## 12. Shared navigation

Main navigation on every page:

- Home
- Week 1
- Resources
- Help

Links are page-relative and work without JavaScript. `js/navigation.js` only enhances the mobile menu (`aria-expanded`, Escape, link close, outside click).

Week 1 is structured so a future Weeks menu can be added later without a top-level Activities page.

## 13. Week 1 structure

`week-1/index.html` is the central Week 1 page:

- Session 1
- Session 2
- Directed independent study

Five Week 1 activities are active: Baseline Knowledge Check, CIA Triad Learning, Incident Classification, Cyber Security Glossary and Session 2 Retrieval Quiz. Coming soon items are not links and are not clickable cards.

### Collapsible session sections

Session and study groups use native HTML `details` and `summary` disclosure controls with the reusable `.session-disclosure` styles in `css/main.css`.

- Session 1 opens by default
- Session 2 and Directed independent study are collapsed by default
- Week 1 topic summary groups are collapsed by default
- Multiple sections may remain open at the same time
- Expanded or collapsed state is not stored in browser storage
- Individual activity cards are not collapsible
- The same pattern can be reused for later weeks
- `js/session-disclosure.js` only opens a collapsed section when a URL fragment targets content inside it; disclosure still works without JavaScript

Cognitive-load decisions for the wider hub are recorded in `docs/information-density-review.md`.

## 13a. Cyber Security Glossary

Route:

```text
/week-1/glossary/
```

Breadcrumb: Home > Week 1 > Cyber Security Glossary

### Term-data structure

Edit `week-1/glossary/terms.js`. Each term object uses:

```javascript
{
  id: "confidentiality",
  term: "Confidentiality",
  category: "Core cyber security",
  definition: "...",
  northbankExample: "...",
  relatedTerms: ["Authorised", "Information disclosure"]
}
```

Categories currently used:

- Core cyber security
- Incident classifications
- Information and impact
- Threats and protection
- Examination language

### How to add or edit a term

1. Open `week-1/glossary/terms.js`.
2. Add or edit an object in `GLOSSARY_TERMS`.
3. Keep `id` values unique and URL-safe.
4. Keep category names aligned with `GLOSSARY_CATEGORIES`.
5. Refresh the glossary page and confirm search, filters and flashcards include the term.

### Knowledge-check structure

`week-1/glossary/glossary.js` contains a fixed set of **12** questions covering:

1. cyber security
2. CIA triad
3. confidentiality
4. integrity
5. availability
6. unauthorised access
7. information disclosure
8. modification of data
9. inaccessible data
10. destruction
11. theft
12. authentication / multi-factor authentication

Question order does not change between submission and review. Self-rated flashcards do not affect the knowledge-check score.

### Glossary submission mapping

The glossary submits Collector schema 3.0 via `js/submissions.js`:

| Field | Glossary use |
| --- | --- |
| `activityId` | `U3-W01-GLOSSARY` |
| `attemptId` | Glossary Attempt ID (`unit3-glossary-attempt-id`) |
| `studentId` / `firstName` / `surname` / `classGroup` | Learner identity |
| `score` / `maximumScore` | Knowledge-check score out of 12 |
| `questionsForReview` | Incorrect question numbers 1 to 12 |
| `mostDifficultItem` | Hardest question 1 to 12 |
| `reflection` | Glossary reflection |
| `completionTimeSeconds` | Seconds from starting the check to checking answers |
| `sourcePage` | Current glossary page URL |

### Glossary Attempt ID storage key

`unit3-glossary-attempt-id` in `sessionStorage` only.

This key is separate from the classifier key `northbank-card-sort-attempt-id`.

### Glossary testing checklist

- All terms load; search and category filters update the term count
- Expandable term cards work with keyboard controls
- Flashcards reveal, navigate, shuffle, mark understood/review and reset
- Knowledge check requires all 12 answers before checking
- Scoring, percentage and incorrect question numbers are correct
- Start new attempt clears quiz state and the glossary Attempt ID
- Submission validation blocks incomplete forms
- Retries reuse the same glossary Attempt ID
- Incident Classification still loads and submits independently

### Privacy limitations

Do not collect email addresses, dates of birth, home addresses or other sensitive personal information. The glossary is formative only and is not a secure examination system.

## 14. Classifier route

```text
/week-1/incident-classification/
```

Breadcrumb:

Home > Week 1 > Incident Classification

Activity heading retained:

**Northbank Cyber Incident Classification**

Subtitle retained:

**Classify each incident and identify the affected CIA security aim.**

## 15. Collector v3 learner submissions

All five Week 1 activities submit **schema version 3.0** to the existing Apps Script web app URL configured in:

`js/submissions.js` as `Unit3Submissions.COLLECTOR_URL`

Do not change that `/exec` URL from Cursor unless a staff member provides a replacement deployment. Google Apps Script and Google Sheet setup are managed manually outside this repository.

Do not commit spreadsheet IDs, private Google Sheet links, API keys or passwords.

### What learners enter

Before starting each activity, learners enter:

- Student ID
- First name
- Surname
- Class group

Incident Classification also supports optional paired work with Partner Student ID, Partner first name and Partner surname.

### What the app supplies automatically

From `js/course-context.js`:

- Academic year `2026/27`
- Programme year `Year 1` (payload property `yearGroup`)
- Level `Level 3`
- Programme `OCR Level 3 IT`
- Unit ID, unit name and unit code
- Activity ID, activity name, week, session, activity type, activity version and maximum score

Learners cannot edit these values.

### Activity IDs

| Activity | Activity ID | Maximum score | Item range |
| --- | --- | --- | --- |
| Baseline Knowledge Check | `U3-W01-BASELINE` | 10 | 1 to 10 |
| CIA Triad Learning | `U3-W01-CIA` | 15 | 1 to 12 |
| Incident Classification | `U3-W01-INCIDENTS` | 12 | 1 to 12 |
| Cyber Security Glossary | `U3-W01-GLOSSARY` | 12 | 1 to 12 |
| Session 2 Retrieval Quiz | `U3-W01-RETRIEVAL` | 15 | 1 to 10 |

### Class-group configuration

Edit `classGroups` in `js/course-context.js`.

- Empty array: learners type a class group (trimmed, single spaces, uppercase)
- Non-empty array: learners choose from a required select list

Confirmed college class-group codes should be added there when available. The browser never reads the private Google Sheet Configuration worksheet.

### Schema 3.0 payload

Learner-facing submissions always send:

- `schemaVersion: "3.0"`
- `recordType: "LIVE"`

They also send learner identity, course metadata, activity metadata, score, maximum score, questions for review, most difficult item, reflection, completion time in seconds and source page.

They do **not** send:

- `attemptNumber`, `primaryAttemptNumber`, `partnerAttemptNumber`
- `percentage`
- legacy fields such as `pairCode`, `learner1`, `totalCards`, `incorrectCards`, `hardestCard`, `justification`, `completionTime`

Attempt numbers are calculated by the collector from academic year + Student ID + Activity ID. Only LIVE rows count as learner attempts.

### Attempt ID behaviour

An Attempt ID is a duplicate-protection identifier, not the learner attempt number.

- Generated with `crypto.randomUUID()` when available
- Fallback uses letters, numbers, hyphens and underscores
- Stored only in `sessionStorage` under an activity-specific key
- Retained across refresh during an unfinished attempt
- Reused for failed-submission retries
- Marked completed after a successful submit
- Regenerated only when the learner deliberately starts another attempt
- Personal data is never stored in `sessionStorage` or `localStorage`

### TEST versus LIVE

Automated probes must use `recordType: "TEST"` with recognisable test identity such as `TEST-PRIMARY`. TEST rows go to the collector’s test worksheet and do not receive learner attempt numbers. The learner interface never offers a TEST option.

### Baseline Knowledge Check testing checklist

- Exactly 10 scored questions; Questions 11 and 12 are unscored
- Perfect score is 10; confidence and prior knowledge do not affect the score
- Learner details are required before Start knowledge check
- Schema 3.0 LIVE payload uses activity ID `U3-W01-BASELINE`
- Retries reuse `unit3-baseline-knowledge-check-attempt-id`
- Start another attempt creates a new Attempt ID

## 16. Current schema 3.0 field names

| Field | Description |
| --- | --- |
| `schemaVersion` | Always `3.0` |
| `recordType` | `LIVE` for learners; `TEST` for automated probes |
| `attemptId` | Unique attempt identifier |
| `academicYear` | Fixed course year |
| `yearGroup` | Fixed programme year |
| `qualificationLevel` | Fixed level |
| `programme` | Fixed programme name |
| `unitId` / `unitName` / `unitCode` | Fixed unit metadata |
| `classGroup` | Learner class group |
| `studentId` / `firstName` / `surname` | Primary learner |
| `partnerStudentId` / `partnerFirstName` / `partnerSurname` | Partner when paired |
| `activityId` / `activityName` / `weekNumber` / `sessionName` / `activityType` / `activityVersion` | Activity metadata |
| `score` / `maximumScore` | Result marks |
| `questionsForReview` | Incorrect item numbers |
| `mostDifficultItem` | Optional hardest item number |
| `reflection` | Written response or summary |
| `completionTimeSeconds` | Elapsed seconds (1 to 7200) |
| `sourcePage` | Current activity URL |

Submission uses a dynamically created HTML form (`POST`, `target="_blank"`). HTTP 200 alone does not prove success; check the confirmation HTML for **Results received** or **Submission not recorded**.

## 17. Shared front-end modules

- `js/course-context.js`: fixed course context and activity registry
- `js/learner-details.js`: course details display, learner form, validation and submission summary
- `js/submissions.js`: schema 3.0 payload builder, Attempt ID lifecycle and collector POST helper

## 18. Privacy limitations

- Formative collection only; not a secure examination system
- Collect only the requested identity fields
- Do not ask for email addresses, passwords or other sensitive personal data
- Browser validation improves usability only; Apps Script must validate again
- A public static site cannot securely authenticate or verify learner identity
- Personal details must not appear in URLs, browser storage or console logs

## 19. How to add a future week

1. Create `/week-2/index.html` (or the next week number).
2. Copy the shared header, navigation, breadcrumbs and footer pattern from Week 1.
3. Use relative paths (`../css/main.css`, `../js/navigation.js`, and so on).
4. Add a Week 2 link in the main navigation on every page (or later convert Week 1 into a Weeks menu).
5. Add a Week 2 card on the Home page when that week becomes active.

## 20. How to add an activity to a week

1. Create a folder under the week, for example `week-1/retrieval-quiz/`.
2. Add `index.html` plus any activity JS/CSS required.
3. Link it from the week overview as an Active card.
4. Keep activity-specific CSS in the activity folder; put genuinely shared styles in `/css/activity.css`.

## 21. How to add an item to Resources

Edit `resources/index.html` and place the item in the most suitable section:

- Northbank organisation briefing
- Learning platform links
- OCR examination support
- Unit reference material
- Technical guidance

Do not paste the full weekly activity list into Resources.

## 22. How to mark an activity as Coming soon

On the week page:

- use the `hub-card is-coming-soon` classes
- show a `Coming soon` status label with a non-colour indicator
- do **not** wrap the card in a link
- do **not** create an empty activity folder until the activity is ready

## 23. Migration verification

Before release, confirm:

- [ ] Source repository is unchanged
- [ ] All 12 scenarios are present
- [ ] Scoring and CIA multi-select behaviour still work
- [ ] Attempt ID create / retry / reset behaviour still works
- [ ] Apps Script `/exec` URL is unchanged
- [ ] Nested relative paths load after refresh
- [ ] No spreadsheet IDs or secrets were committed
- [ ] Hub Home, Week 1, Resources, Help and classifier pages load

## 24. Preservation of the source repository

- The source repository retains its original development history
- The hub uses a clean migration of working files
- The original site remains available during testing
- The original repository must not be archived yet
- Do not commit to, rename, delete from, or rewrite the history of the source repository as part of hub work
