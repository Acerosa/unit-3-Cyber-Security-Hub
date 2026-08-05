# Unit 3 Cyber Security — Week 3 Apps Script API

Standalone Google Apps Script web app for **Week 3: Types of Attackers**.

Project name: **Unit 3 Cyber Security - Week 3 API**

Script ID: `1D_EtgBeEcmtTqyJIhDLt2E5fxfUZEpuIkQJhkCjOiGXAeADm2aYPhVyH`

It provides:

- Week 3 activity content using the Week 1/2 Activity API contract (`getActivity`, `manifest`, `markSection`)
- Submission recording into the shared Unit 3 Google Spreadsheet
- Validation, duplicate protection and JSON responses

This project is separate from the Week 1 and Week 2 APIs. Do not modify those projects when working here.

## Architecture

```text
One Unit 3 Google Sheet
  ← Week 1 web app (/exec)
  ← Week 2 web app (/exec)
  ← Week 3 web app (/exec)   ← this project
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
| `Week 3 Results` | Week 3 results view |
| `Errors and Rejections` | Rejected payloads |
| `Week 3 Activity Catalogue` | Seeded activity metadata |

## Activity configuration

| Activity | ID | Version | Expected items | Maximum |
| --- | --- | --- | ---: | ---: |
| Session 1 Retrieval | `week3-session1-retrieval` | 1.0 | 10 | 10 |
| Attacker Types Learning | `week3-attacker-types-learning` | 1.0 | 8 | 8 |
| Case Study Matching | `week3-attacker-case-matching` | 1.0 | 8 | 8 |
| Justified Identification | `week3-justified-identification` | 1.0 | 4 | 12 |
| Session 2 Retrieval | `week3-session2-retrieval` | 1.0 | 12 | 12 |
| OCR-Style Practice | `week3-ocr-question-practice` | 1.0 | 6 | 20 |
| Peer Marking | `week3-peer-marking` | 1.0 | completion | 6 |

Source of truth: `Week3ActivityManifest.gs` (+ derived helpers in `Week3Activities.gs`).

## File structure

```text
apps-script/week-3/
  appsscript.json
  Config.gs
  Code.gs
  RequestParser.gs
  ResponseFactory.gs
  SubmissionValidator.gs
  DuplicateChecker.gs
  SheetRepository.gs
  SubmissionService.gs
  SetupWorkbook.gs
  Week3ActivityManifest.gs
  Week3Activities.gs
  Week3ActivityDataService.gs
  Week3*Data.gs
  Week3ActivitySeed.gs
  Week3Tests.gs
  Week3ActivityDataTests.gs
```

## API routes

```text
GET  ?action=health
GET  ?action=manifest
GET  ?action=getActivity&activityId=week3-session1-retrieval
GET  ?action=bootstrapSetup&confirm=Unit3-Week3-Bootstrap-Once
POST { "action": "markSection", ... }
POST { "action": "submitAttempt", ... }   // or results payload without markSection
```

Successful submission confirmation requires `recorded: true` in the JSON body. HTTP 200 alone is not enough.

## Seed and self-test

```text
setupWeek3Workbook()
seedWeek3Activities()          // alias of seedAllWeek3ActivityData()
openWeek3Submissions()
runWeek3SelfTest()             // alias of runAllWeek3SelfTests()
runAllWeek3ActivityDataTests()
runWeek3DeploymentBootstrap()  // one-shot setup used by bootstrapSetup
```

Seeds are idempotent. They do not delete learner submissions or modify Week 1/2 rows.

## Local clasp workflow

Root `.clasp.json` normally points at Week 2. Use the Week 3 project file:

```bash
cp .clasp.week-3.json .clasp.json
clasp push --force
clasp version "description"
clasp deploy -i <deploymentId> -V <version> -d "Week 3 API production"
cp .clasp.week-2.active.json .clasp.json   # restore Week 2 default
```

## Deploy as web app (required once in the UI)

`clasp deploy` creates a deployment entry, but a new project usually needs a one-time Apps Script UI deploy so Google authorises spreadsheet scopes for anonymous `/exec` access (same step used for Week 2).

1. Open: https://script.google.com/d/1D_EtgBeEcmtTqyJIhDLt2E5fxfUZEpuIkQJhkCjOiGXAeADm2aYPhVyH/edit
2. Run `checkWeek3Config` once and accept spreadsheet permissions.
3. Deploy → New deployment → Web app  
   - Execute as: Me  
   - Who has access: Anyone  
4. Copy the `/exec` URL into `js/activity-engine-config.js` → `week3ApiBaseUrl`.
5. Bootstrap:

```text
GET /exec?action=bootstrapSetup&confirm=Unit3-Week3-Bootstrap-Once&requestId=setup-1
```

6. Confirm health returns JSON with `"week": 3`.

After code changes: `clasp push`, create a new version, then **Manage deployments → Edit → New version** (or `clasp deploy -i …`). Do not replace the Week 1 or Week 2 deployments.

## Front-end wiring

```javascript
// js/activity-engine-config.js
week3ApiBaseUrl: 'https://script.google.com/macros/s/<WEEK3_DEPLOYMENT_ID>/exec'
```

Week 3 pages keep local `week-3/data/*.js` banks for rendering (Week 2 pattern) and submit results through `js/week3-submit.js` to the Week 3 API only.

## Common rejection codes

| Code | Meaning |
| --- | --- |
| `UNKNOWN_ACTIVITY` | Activity ID not in Week 3 registry |
| `VERSION_NOT_ACCEPTED` | Version is not exactly `"1.0"` |
| `TOTAL_MISMATCH` | Maximum score / item total does not match registry |
| `SCORE_ABOVE_TOTAL` / `SCORE_NEGATIVE` | Score out of range |
| `WEEK_NOT_ACCEPTED` | Payload week is not 3 |
| `SUBMISSIONS_CLOSED` | Gate closed via Script Properties |

## Verify a result in the Google Sheet

1. Submit a TEST attempt from a Week 3 activity page.
2. Confirm API JSON includes `"recorded": true`.
3. Open the shared workbook → `Week 3 Results` / `All Submissions`.
4. Check Activity ID, version `1.0`, week `3`, score, maximum score and item total.
