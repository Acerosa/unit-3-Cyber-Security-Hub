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

This foundation release provides the hub shell, Week 1 overview, the Baseline Knowledge Check, CIA Triad Learning, Incident Classification, the interactive Cyber Security Glossary, Session 2 Retrieval Quiz, and the OCR Command-Word Guide.

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
│   ├── OCR Command-Word Guide           (Active API pilot)
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

Route: `activities/activity.html?activityId=U3-W01-BASELINE`

Published path (after Pages deployment):

`https://acerosa.github.io/unit-3-Cyber-Security-Hub/activities/activity.html?activityId=U3-W01-BASELINE`

Purpose: a low-stakes teacher-created baseline diagnostic that identifies learners' starting knowledge before Week 1 cyber security teaching begins. It is completed independently without notes. It is not a formal grade and not an official OCR assessment.

It uses the generic Activity API engine. Content and marking come from the private Activity API. Browser code does not contain the question bank or answer key.

Question structure (from the API):

- three sections
- ten scored single-choice questions
- maximum score 10
- inactive diagnostic extension questions are not published to the browser

Submission notes:

- Activity ID: `U3-W01-BASELINE`
- Submits through the Activity API only (`markSection` and `submitAttempt`)
- Current Hub configuration keeps `submissionMode: 'TEST'` and `allowLiveSubmissions: false`
- Does not use Collector v3
- See `docs/activity-api-engine.md`

Privacy and answer-security notes:

- Do not collect email addresses, passwords or other sensitive personal information
- Correct answers are not hard-coded in the Hub repository
- Do not describe this diagnostic as a secure examination or use it for formal grading

### CIA Triad Learning

Route: `activities/activity.html?activityId=U3-W01-CIA`

Published path (after Pages deployment):

`https://acerosa.github.io/unit-3-Cyber-Security-Hub/activities/activity.html?activityId=U3-W01-CIA`

Purpose: guided formative learning on the CIA triad (confidentiality, integrity and availability), with Northbank examples and a 15-mark knowledge check.

It uses the generic Activity API engine. Content and marking come from the private Activity API. Browser code does not contain the question bank or answer key.

Expected API structure:

- nine sections
- twelve single-choice questions
- four assessment sections (maximum scores 3, 3, 3 and 6)
- maximum score 15

Submission notes:

- Activity ID: `U3-W01-CIA`
- Submits through the Activity API only (`markSection` and `submitAttempt`)
- Current Hub configuration keeps `submissionMode: 'TEST'` and `allowLiveSubmissions: false`
- Does not use Collector v3
- See `docs/activity-api-engine.md`

### Incident Classification

Route: `activities/activity.html?activityId=U3-W01-INCIDENTS`

Published path (after Pages deployment):

`https://acerosa.github.io/unit-3-Cyber-Security-Hub/activities/activity.html?activityId=U3-W01-INCIDENTS`

Purpose: analyse realistic Northbank security incidents, choose the incident type and affected CIA aim, and supply short evidence for each classification.

It uses the generic Activity API engine. Content and marking come from the private Activity API. Browser code does not contain the scenario bank or answer key.

Expected API structure:

- five sections (intro, three assessment packs of four, reflection)
- twelve `classification` questions
- maximum score 12
- optional partner details (`allowsPartner: true`)

Submission notes:

- Activity ID: `U3-W01-INCIDENTS`
- Submits through the Activity API only (`markSection` and `submitAttempt`)
- Structured response value: `{ incidentType, ciaAim, evidence }`
- Current Hub configuration keeps `submissionMode: 'TEST'` and `allowLiveSubmissions: false`
- Does not use Collector v3
- See `docs/activity-api-engine.md`

### Cyber Security Glossary

Route: `activities/activity.html?activityId=U3-W01-GLOSSARY`

Published path (after Pages deployment):

`https://acerosa.github.io/unit-3-Cyber-Security-Hub/activities/activity.html?activityId=U3-W01-GLOSSARY`

Purpose: build understanding of essential cyber security terms using clear definitions and realistic Northbank examples, then complete three terminology checks.

It uses the generic Activity API engine. Content and marking come from the private Activity API. Browser code does not contain the glossary bank or answer key.

Expected API structure:

- eight sections
- twelve single-choice questions
- three assessment sections (maximum scores 3, 6 and 3)
- maximum score 12
- partner not allowed

Submission notes:

- Activity ID: `U3-W01-GLOSSARY`
- Submits through the Activity API only (`markSection` and `submitAttempt`)
- Current Hub configuration keeps `submissionMode: 'TEST'` and `allowLiveSubmissions: false`
- Does not use Collector v3
- See `docs/activity-api-engine.md`

Compatibility: `week-1/glossary/` is a lightweight redirect to the Activity API route.

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

- OCR-Style Question Practice
- Directed Independent Study

The OCR Command-Word Guide is an Active API pilot at:

`activities/activity.html?activityId=U3-W01-COMMAND-WORDS`

It uses the Activity API only. See `docs/activity-api-engine.md`.

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
    activity-engine.css
  /js
    navigation.js
    session-disclosure.js
    activity-utils.js
    course-context.js
    learner-details.js
    submissions.js
    activity-engine-config.js
    activity-api.js
    activity-state.js
    activity-renderer.js
    activity-engine.js
  /activities
    activity.html
  /assets
    /images
    /icons
  /resources
    index.html
  /help
    index.html
  /week-1
    index.html
    /glossary
      index.html   (redirect to Activity API route)
    /retrieval-quiz
      index.html
      questions.js
      quiz.js
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
   - `http://localhost:8080/activities/activity.html?activityId=U3-W01-BASELINE`
   - `http://localhost:8080/activities/activity.html?activityId=U3-W01-CIA`
   - `http://localhost:8080/activities/activity.html?activityId=U3-W01-INCIDENTS`
   - `http://localhost:8080/activities/activity.html?activityId=U3-W01-GLOSSARY`
   - `http://localhost:8080/week-1/glossary/` (redirect)
   - `http://localhost:8080/week-1/retrieval-quiz/`
   - `http://localhost:8080/resources/`
   - `http://localhost:8080/help/`

4. Confirm CSS/JS load, navigation works, and the Baseline, CIA, Incident Classification and Glossary Activity API routes load without hard-coded answers.
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
/activities/activity.html?activityId=U3-W01-GLOSSARY
```

Breadcrumb: Home > Week 1 > Cyber Security Glossary

Compatibility redirect:

```text
/week-1/glossary/ → Activity API route
```

### Glossary testing checklist

- Opens via `activities/activity.html?activityId=U3-W01-GLOSSARY`
- Health and `getActivity` succeed for `U3-W01-GLOSSARY`
- Eight sections and twelve single-choice questions render from the API
- No correct answers appear before section marking
- Assessment sections mark out of 3, 6 and 3
- Final `submitAttempt` uses `recordType: TEST` while LIVE remains disabled
- The page does not load `js/submissions.js` or call Collector v3
- Refresh restores Attempt ID and selected responses from sessionStorage
- `week-1/glossary/` only redirects to the Activity API route

### Privacy limitations

Do not collect email addresses, dates of birth, home addresses or other sensitive personal information. The glossary is formative only and is not a secure examination system.

## 14. Incident Classification route

```text
/activities/activity.html?activityId=U3-W01-INCIDENTS
```

Breadcrumb:

Home > Week 1 > Incident Classification

## 15. Collector v3 learner submissions

Glossary and Retrieval submit **schema version 3.0** to the existing Apps Script web app URL configured in:

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
| Baseline Knowledge Check (Activity API) | `U3-W01-BASELINE` | 10 | BAS-Q01 to BAS-Q10 |
| CIA Triad Learning (Activity API) | `U3-W01-CIA` | 15 | CIA-Q01 to CIA-Q12 |
| Incident Classification (Activity API) | `U3-W01-INCIDENTS` | 12 | INC-Q01 to INC-Q12 |
| Cyber Security Glossary (Activity API) | `U3-W01-GLOSSARY` | 12 | GLO-Q01 to GLO-Q12 |
| Session 2 Retrieval Quiz | `U3-W01-RETRIEVAL` | 15 | 1 to 10 |
| OCR Command-Word Guide (Activity API pilot) | `U3-W01-COMMAND-WORDS` | 12 | Q001 to Q006 |

Collector v3 continues to serve Retrieval. Baseline, CIA, Incident Classification, Glossary and the Command-Word Guide submit only through the Activity API (`docs/activity-api-engine.md`).

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

- Opens via `activities/activity.html?activityId=U3-W01-BASELINE`
- Health and `getActivity` succeed for `U3-W01-BASELINE`
- Three sections and ten single-choice questions render from the API
- BAS-Q11 and BAS-Q12 do not appear
- No correct answers appear before section marking
- `markSection` returns a score out of 10
- Final `submitAttempt` uses `recordType: TEST` while LIVE remains disabled
- The page does not load `js/submissions.js` or call Collector v3
- Refresh restores Attempt ID and selected responses from sessionStorage

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
- [ ] Incident Classification opens via the Activity API engine route
- [ ] Activity API health reports `UNIT3-ACTIVITY-API-V1.3` with `resultsConnected: true`
- [ ] Twelve classification questions load from `getActivity` with no answer leak
- [ ] `markSection` and TEST `submitAttempt` succeed for `U3-W01-INCIDENTS`
- [ ] Nested relative paths load after refresh
- [ ] No spreadsheet IDs or secrets were committed
- [ ] Hub Home, Week 1, Resources, Help and Activity API routes load

## 24. Preservation of the source repository

- The source repository retains its original development history
- The hub uses a clean migration of working files
- The original site remains available during testing
- The original repository must not be archived yet
- Do not commit to, rename, delete from, or rewrite the history of the source repository as part of hub work
