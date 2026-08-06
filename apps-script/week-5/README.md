# Unit 3 Cyber Security — Week 5 Apps Script API

Standalone Google Apps Script web app for **Week 5: Impacts of Cyber Security Incidents**.

Project name: **Unit 3 Cyber Security - Week 5 API**

Script ID: `1E2ErUExfYv3QD2yCguJyjb7k1oLGnz67RRHjCgEPnt0nbJ4gf1jwTcQ8`

Web app `/exec`: `https://script.google.com/macros/s/AKfycbxHrV2qIqhHqmWiCxoGn9WdQlL6a3YcnUUM7rC6Tz8QS_utstkJZjllENHyX77UqI6V/exec`

It provides:

- Week 5 activity content using the Week 1–4 Activity API contract (`getActivity`, `manifest`, `markSection`, `submitAttempt`)
- Submission recording into the shared Unit 3 Google Spreadsheet
- Validation, duplicate protection and JSON responses

This project is separate from the Week 1–4 APIs. Do not modify those projects when working here.

## Architecture

```text
One Unit 3 Google Sheet
  ← Week 1 web app (/exec)
  ← Week 2 web app (/exec)
  ← Week 3 web app (/exec)
  ← Week 4 web app (/exec)
  ← Week 5 web app (/exec)   ← this project
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
| `Week 5 Results` | Week 5 results view |
| `Errors and Rejections` | Rejected payloads |
| `Week 5 Activity Catalogue` | Seeded activity metadata |

## Activity configuration

| Activity | ID | Version | Maximum |
| --- | --- | ---: | ---: |
| Session 1 Retrieval | `week5-session1-retrieval` | 1.0 | 8 |
| Impacts Learning | `week5-impacts-learning` | 1.0 | 9 |
| Impact Classification | `week5-impact-classification` | 1.0 | 8 |
| Ransomware Companion | `week5-ransomware-companion` | 1.0 | 4 |
| Exercise Debrief | `week5-exercise-debrief` | 1.0 | 4 |
| Session 2 Retrieval | `week5-session2-retrieval` | 1.0 | 12 |
| Stakeholder Impact Grid | `week5-stakeholder-grid` | 1.0 | 10 |
| Impact Analysis | `week5-impact-analysis` | 1.0 | 6 |
| OCR-Style Practice | `week5-ocr-question-practice` | 1.0 | 20 |
| Answer Improvement | `week5-answer-improvement` | 1.0 | 6 |

Source of truth: `Week5ActivityManifest.gs`.

## API routes

```text
GET  ?action=health
GET  ?action=manifest
GET  ?action=getActivity&activityId=week5-session1-retrieval
GET  ?action=bootstrapSetup&confirm=Unit3-Week5-Bootstrap-Once
POST { "action": "markSection", ... }
POST { "action": "submitAttempt", ... }
```

Successful submission confirmation requires `recorded: true` in the JSON body. HTTP 200 alone is not enough.

## Seed and self-test

```text
setupWeek5Workbook()
seedWeek5Activities()
openWeek5Submissions()
runWeek5SelfTest()
runAllWeek5ActivityDataTests()
runWeek5DeploymentBootstrap()
```

Seeds are idempotent. They do not delete learner submissions or modify Week 1–4 rows.

## Local clasp workflow

Root `.clasp.json` normally points at Week 2. Use the Week 5 project file:

```bash
cp .clasp.week-5.json .clasp.json
clasp push --force
clasp version "description"
clasp deploy -i <deploymentId> -V <version> -d "Week 5 API production"
cp .clasp.week-2.active.json .clasp.json   # restore Week 2 default
```

## Deploy as web app (required once in the UI)

`clasp deploy` creates a deployment entry, but a new project needs a one-time Apps Script UI deploy so Google authorises spreadsheet scopes for anonymous `/exec` access (same step used for Weeks 2–4).

1. Open the Week 5 script project from the clasp create output URL.
2. Run `checkWeek5Config` once and accept spreadsheet permissions.
3. Deploy → New deployment → Web app  
   - Execute as: Me  
   - Who has access: Anyone  
4. Copy the `/exec` URL into `js/activity-engine-config.js` → `week5ApiBaseUrl`.
5. Bootstrap:

```text
GET /exec?action=bootstrapSetup&confirm=Unit3-Week5-Bootstrap-Once&requestId=setup-1
```

6. Confirm health returns JSON with `"week": 5`.

After code changes: `clasp push`, create a new version, then **Manage deployments → Edit → New version** (or `clasp deploy -i …`). Do not replace the Week 1–4 deployments.

## Front-end wiring

```javascript
// js/activity-engine-config.js
week5ApiBaseUrl: 'https://script.google.com/macros/s/<WEEK5_DEPLOYMENT_ID>/exec'
```

Week 5 pages keep local `week-5/data/*.js` banks for rendering and submit results through `js/week5-submit.js` to the Week 5 API only.

## Common rejection codes

| Code | Meaning |
| --- | --- |
| `UNKNOWN_ACTIVITY` | Activity ID not in Week 5 registry |
| `VERSION_NOT_ACCEPTED` | Version is not exactly `"1.0"` |
| `TOTAL_MISMATCH` | Maximum score / item total does not match registry |
| `SCORE_ABOVE_TOTAL` / `SCORE_NEGATIVE` | Score out of range |
| `WEEK_NOT_ACCEPTED` | Payload week is not 5 |
| `SUBMISSIONS_CLOSED` | Gate closed via Script Properties |

## Verify a result in the Google Sheet

1. Submit a TEST attempt from a Week 5 activity page.
2. Confirm API JSON includes `"recorded": true`.
3. Open the shared workbook → `Week 5 Results` / `All Submissions`.
4. Check Activity ID, version `1.0`, week `5`, score, maximum score and item total.
