# Unit 3 Cyber Security — Week 4 Apps Script API

Standalone Google Apps Script web app for **Week 4: Motivations and Targets**.

Project name: **Unit 3 Cyber Security - Week 4 API**

Script ID: `1krOU6kyBOE9gelYKXBiv9rEyr7ht5mN3W5RlpdWgsTEMDJhnBETnxLyM`

It provides:

- Week 4 activity content using the Week 1–3 Activity API contract (`getActivity`, `manifest`, `markSection`)
- Submission recording into the shared Unit 3 Google Spreadsheet
- Validation, duplicate protection and JSON responses

This project is separate from the Week 1, Week 2 and Week 3 APIs. Do not modify those projects when working here.

## Architecture

```text
One Unit 3 Google Sheet
  ← Week 1 web app (/exec)
  ← Week 2 web app (/exec)
  ← Week 3 web app (/exec)
  ← Week 4 web app (/exec)   ← this project
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
| `Week 4 Results` | Week 4 results view |
| `Errors and Rejections` | Rejected payloads |
| `Week 4 Activity Catalogue` | Seeded activity metadata |

## Activity configuration

| Activity | ID | Version | Maximum |
| --- | --- | --- | ---: |
| Session 1 Retrieval | `week4-session1-retrieval` | 1.0 | 10 |
| Motivations Learning | `week4-motivations-learning` | 1.0 | 8 |
| Targets and Methods | `week4-targets-methods` | 1.0 | 8 |
| Northbank Exposure | `week4-northbank-exposure` | 1.0 | 3 |
| Session 2 Retrieval | `week4-session2-retrieval` | 1.0 | 12 |
| Motivation–Target–Method Mapping | `week4-mtm-mapping` | 1.0 | 8 |
| Analyse Practice | `week4-analyse-practice` | 1.0 | 6 |
| OCR-Style Practice | `week4-ocr-question-practice` | 1.0 | 20 |
| Answer Improvement | `week4-answer-improvement` | 1.0 | 6 |
| Ethical Review | `week4-ethical-review` | 1.0 | 2 |

Source of truth: `Week4ActivityManifest.gs`.

## API routes

```text
GET  ?action=health
GET  ?action=manifest
GET  ?action=getActivity&activityId=week4-session1-retrieval
GET  ?action=bootstrapSetup&confirm=Unit3-Week4-Bootstrap-Once
POST { "action": "markSection", ... }
POST { "action": "submitAttempt", ... }
```

Successful submission confirmation requires `recorded: true` in the JSON body. HTTP 200 alone is not enough.

## Seed and self-test

```text
setupWeek4Workbook()
seedWeek4Activities()
openWeek4Submissions()
runWeek4SelfTest()
runAllWeek4ActivityDataTests()
```

Seeds are idempotent. They do not delete learner submissions or modify Week 1–3 rows.

## Local clasp workflow

Root `.clasp.json` normally points at Week 2. Use the Week 4 project file:

```bash
cp .clasp.week-4.json .clasp.json
clasp push --force
clasp version "description"
clasp deploy -i <deploymentId> -V <version> -d "Week 4 API production"
cp .clasp.week-2.active.json .clasp.json   # restore Week 2 default
```

## Deploy as web app (required once in the UI)

`clasp deploy` creates a deployment entry, but a new project needs a one-time Apps Script UI deploy so Google authorises spreadsheet scopes for anonymous `/exec` access (same step used for Weeks 2 and 3).

1. Open: https://script.google.com/d/1krOU6kyBOE9gelYKXBiv9rEyr7ht5mN3W5RlpdWgsTEMDJhnBETnxLyM/edit
2. Run `checkWeek4Config` once and accept spreadsheet permissions.
3. Deploy → New deployment → Web app  
   - Execute as: Me  
   - Who has access: Anyone  
4. Copy the `/exec` URL into `js/activity-engine-config.js` → `week4ApiBaseUrl` (already set to the clasp production deployment if you reuse it).
5. Bootstrap:

```text
GET /exec?action=bootstrapSetup&confirm=Unit3-Week4-Bootstrap-Once&requestId=setup-1
```

6. Confirm health returns JSON with `"week": 4`.

After code changes: `clasp push`, create a new version, then **Manage deployments → Edit → New version** (or `clasp deploy -i …`). Do not replace the Week 1–3 deployments.

## Front-end wiring

```javascript
// js/activity-engine-config.js
week4ApiBaseUrl: 'https://script.google.com/macros/s/<WEEK4_DEPLOYMENT_ID>/exec'
```

Week 4 pages keep local `week-4/data/*.js` banks for rendering and submit results through `js/week4-submit.js` to the Week 4 API only.

## Common rejection codes

| Code | Meaning |
| --- | --- |
| `UNKNOWN_ACTIVITY` | Activity ID not in Week 4 registry |
| `VERSION_NOT_ACCEPTED` | Version is not exactly `"1.0"` |
| `TOTAL_MISMATCH` | Maximum score / item total does not match registry |
| `SCORE_ABOVE_TOTAL` / `SCORE_NEGATIVE` | Score out of range |
| `WEEK_NOT_ACCEPTED` | Payload week is not 4 |
| `SUBMISSIONS_CLOSED` | Gate closed via Script Properties |

## Verify a result in the Google Sheet

1. Submit a TEST attempt from a Week 4 activity page.
2. Confirm API JSON includes `"recorded": true`.
3. Open the shared workbook → `Week 4 Results` / `All Submissions`.
4. Check Activity ID, version `1.0`, week `4`, score, maximum score and item total.
