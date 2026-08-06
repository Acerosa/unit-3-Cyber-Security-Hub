# Unit 3 Cyber Security - Week 6 Apps Script API

Standalone Google Apps Script web app for **Week 6: Ethical, Legal and Operational Considerations**.

Project name: **Unit 3 Cyber Security - Week 6 API**

Script ID: `1EXCrsYit7iLwi6D3ESNGco6MqBT8IvFqTRranAyBYuJyNxnL2G9DT6qA`

Web app `/exec`: `https://script.google.com/macros/s/AKfycbxSoLlXq-nPmdlZf-rIiU99TA_NXPkF-rr1VuJbTnjvAAzgoo5bmKKgK2p2iDun9euu/exec`

First browser visit must authorize spreadsheet access for the deploying account. Until then anonymous `/exec` calls may return HTTP 403.

It provides:

- Week 6 activity content using the Week 1-5 Activity API contract (`getActivity`, `manifest`, `markSection`, `submitAttempt`)
- Submission recording into the shared Unit 3 Google Spreadsheet
- Validation, duplicate protection and JSON responses

This project is separate from the Week 1-5 APIs. Do not modify those projects when working here.

## Architecture

```text
One Unit 3 Google Sheet
  <- Week 1 web app (/exec)
  <- Week 2 web app (/exec)
  <- Week 3 web app (/exec)
  <- Week 4 web app (/exec)
  <- Week 5 web app (/exec)
  <- Week 6 web app (/exec)   <- this project
```

## Spreadsheet configuration

Configure the spreadsheet ID only in `Config.gs`:

```javascript
spreadsheetId: "1Q85_zt8cSrqpzSMNPuhvHXfa767QEhXSPnQznvSZe08"
```

Do not expose this ID in front-end code.

## Worksheet tabs

| Tab | Role |
| --- | --- |
| `All Submissions` | Accepted submission log |
| `Week 6 Results` | Week 6 results view |
| `Errors and Rejections` | Rejected payloads |
| `Week 6 Activity Catalogue` | Seeded activity metadata |

## Activity configuration

Aligned with the Week 6 frontend (`js/week6-progress.js`).

| Activity | ID | Version | Maximum |
| --- | --- | ---: | ---: |
| LO2 Diagnostic | `week6-lo2-diagnostic` | 1.0 | 12 |
| Ethical Learning | `week6-ethical-learning` | 1.0 | 6 |
| Ethical Classification | `week6-ethical-classification` | 1.0 | 8 |
| Legislation Learning | `week6-legislation-learning` | 1.0 | 6 |
| Legislation Matching | `week6-legislation-matching` | 1.0 | 6 |
| Operational Considerations | `week6-operational-considerations` | 1.0 | 7 |
| Government Initiatives | `week6-government-initiatives` | 1.0 | 4 |
| NCSC Guidance | `week6-ncsc-guidance` | 1.0 | 4 |
| Exercise Decision Record | `week6-exercise-decision-record` | 1.0 | 5 |
| Session 1 Review | `week6-session1-review` | 1.0 | 3 |
| Legislation Retrieval | `week6-legislation-retrieval` | 1.0 | 10 |
| Employee Monitoring | `week6-employee-monitoring` | 1.0 | 6 |
| Stakeholder Debate | `week6-stakeholder-debate` | 1.0 | 10 |
| Discuss Learning | `week6-discuss-learning` | 1.0 | 5 |
| Discuss Planner | `week6-discuss-planner` | 1.0 | 6 |
| OCR-Style Practice | `week6-ocr-question-practice` | 1.0 | 20 |
| Answer Improvement | `week6-answer-improvement` | 1.0 | 6 |
| LO2 Revision Organiser | `week6-revision-organiser` | 1.0 | 6 |

Source of truth: `Week6ActivityManifest.gs`.

Directed study / support content lives in `Week6GuidanceData.gs` (not a scored submit activity).

## API routes

```text
GET  ?action=health
GET  ?action=manifest
GET  ?action=getActivity&activityId=week6-lo2-diagnostic
GET  ?action=bootstrapSetup&confirm=Unit3-Week6-Bootstrap-Once
POST { "action": "markSection", ... }
POST { "action": "submitAttempt", ... }
```

Successful submission confirmation requires `recorded: true` in the JSON body. HTTP 200 alone is not enough.

API version: `1.0`  
Content schema version: `1.0`  
Result schema version: `3.0`  
Activity version: `1.0`

## Seed and self-test

In the Apps Script editor:

1. `checkWeek6Config()`
2. `setupWeek6Workbook()` (or `setupWeek6Api()` / `runWeek6DeploymentBootstrap()`)
3. `runAllWeek6ActivityDataTests()`
4. `seedAllWeek6ActivityData()` twice (must upsert, not duplicate)
5. `runWeek6SelfTest()`
6. `openWeek6Submissions()`

## clasp workflow

```bash
cp clasp.week-6.json.example .clasp.week-6.json
# paste scriptId after creating the Apps Script project
cp .clasp.week-6.json .clasp.json
clasp push
# create version + web app deploy (Execute as: Me; Who has access: Anyone)
# restore previous .clasp.json when finished
```

## Frontend wiring

Set in `js/activity-engine-config.js` (separate frontend task):

```javascript
week6ApiBaseUrl: 'https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec'
```

Do not hard-code deployment URLs inside Apps Script activity packs.

## External links used by Week 6

- NCSC Exercise in a Box: Insider threat resulting in a data breach  
  https://www.ncsc.gov.uk/section/exercise-in-a-box/insider-threat-data-breach
- TryHackMe ISO27001: https://tryhackme.com/room/iso27001
- TryHackMe Legal Considerations in DFIR: https://tryhackme.com/room/dfirprocesslegalconsiderations

The API does not verify Cisco or TryHackMe completion.

## Legal content tutor-review flags

Legislation packs keep wording within the weekly plan. Plain-language legal summaries are flagged in pack `tutorData.tutorReviewFlags` as `legal-plain-language-only`. Do not invent statutory sections, penalties or notification periods.
