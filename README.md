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

This foundation release provides the hub shell, Week 1 overview, and the migrated Northbank Incident Classification activity.

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
│   ├── Cyber Security Glossary          (Coming soon)
│   ├── Incident Classification          (Active)
│   ├── Session 2 Retrieval Quiz         (Coming soon)
│   ├── OCR Command-Word Guide           (Coming soon)
│   ├── OCR-Style Question Practice      (Coming soon)
│   └── Directed Independent Study       (Coming soon)
├── Resources
└── Help
```

There is no top-level Activities page. Week activities live inside each week area.

## 6. Why activities are organised within each week

Learners follow a weekly sequence. Keeping Session 1, Session 2 and independent study inside the week page preserves that journey and avoids duplicating the full activity list on Home or Resources.

## 7. Current implemented activity

**Incident Classification**

Route:

`week-1/incident-classification/`

Published path (after Pages deployment):

`https://acerosa.github.io/unit-3-Cyber-Security-Hub/week-1/incident-classification/`

## 8. Planned Week 1 activities

Still marked Coming soon on the Week 1 page:

- Cyber Security Glossary
- Session 2 Retrieval Quiz
- OCR Command-Word Guide
- OCR-Style Question Practice
- Directed Independent Study

Baseline knowledge check remains an in-class diagnostic for now.

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
    activity-utils.js
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
    /incident-classification
      index.html
      app.js
      scenarios.js
      activity.css
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
   - `http://localhost:8080/week-1/incident-classification/`
   - `http://localhost:8080/resources/`
   - `http://localhost:8080/help/`

4. Confirm CSS/JS load, navigation works, and the classifier shows 12 cards.
5. Refresh nested URLs directly to confirm GitHub Pages-style deep links work.

## 11. GitHub Pages deployment

1. Merge the feature branch into `main` when ready.
2. In GitHub: **Settings → Pages**.
3. Source: **Deploy from a branch**.
4. Branch: `main`, folder: `/ (root)`.
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

Only Incident Classification is active. Coming soon items are not links and are not clickable cards.

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

## 15. Apps Script configuration

Collector URL is set in:

`week-1/incident-classification/app.js`

as `COLLECTOR_URL` (full web app URL ending in `/exec`).

Do not commit spreadsheet IDs, private Google Sheet links, API keys or passwords.

## 16. Current submission field names

Exact fields posted by the classifier:

| Field | Description |
| --- | --- |
| `attemptId` | Unique attempt identifier |
| `classGroup` | Class or group name |
| `pairCode` | Pair code |
| `learner1` | Optional learner 1 name |
| `learner2` | Optional learner 2 name |
| `score` | Score out of 12 |
| `totalCards` | Always `12` |
| `incorrectCards` | Comma-separated incorrect card numbers, or `None` |
| `hardestCard` | Card number 1–12 |
| `justification` | Written reflection (max 1,000 characters) |
| `completionTime` | Completion time in seconds |
| `activityVersion` | Activity version string |
| `sourcePage` | Page URL used for the attempt |

Submission uses a dynamically created HTML form (`POST`, `target="_blank"`).

## 17. Attempt ID behaviour

- Created with `crypto.randomUUID()` when available
- Fallback: timestamp + random value
- Stored only in `sessionStorage` under `northbank-card-sort-attempt-id`
- Names, answers, scores, pair codes and justifications are not stored in `sessionStorage`
- Retry reuses the same Attempt ID
- Reset clears the Attempt ID so the next submission starts a new attempt

## 18. Privacy limitations

- Formative collection only; not a secure examination system
- Do not ask for email addresses, passwords or sensitive personal data
- Browser validation improves usability only; Apps Script must validate again
- A public static site cannot securely authenticate learners

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
