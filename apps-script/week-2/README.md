# Unit 3 Cyber Security — Week 2 Apps Script API

Standalone Google Apps Script web app that records **Week 2: Threats and Vulnerabilities** formative activity results into the shared Unit 3 Google Spreadsheet.

This project is separate from the Week 1 Activity API. Do not modify the Week 1 Apps Script project when working here.

## Purpose

- Accept Week 2 activity submissions through a single `doPost()` endpoint
- Provide a `doGet()` health check
- Validate activity IDs, versions, totals, scores and learner details
- Protect against duplicate submissions from double-clicks or retries
- Write accepted results to **All Submissions** and **Week 2 Results**
- Record rejected payloads in **Errors and Rejections**

## Spreadsheet configuration

Configure the spreadsheet ID only in `Config.gs`:

```javascript
spreadsheetId: "1Q85_zt8cSrqpzSMNPuhvHXfa767QEhXSPnQznvSZe08"
```

The API opens the workbook with:

```javascript
SpreadsheetApp.openById(CONFIG.spreadsheetId)
```

Do not use `SpreadsheetApp.getActiveSpreadsheet()` in this standalone project.

Do not put the spreadsheet ID in frontend code.

## Worksheet tabs

| Tab | Role |
| --- | --- |
| `All Submissions` | Canonical log of accepted Week 2 submissions |
| `Week 2 Results` | Week 2–focused results view |
| `Errors and Rejections` | Parse/validation/server rejections |

Existing Week 1 tabs are left untouched. Setup creates missing Week 2-related tabs only.

## Activity IDs and totals

| Activity ID | Session | Total |
| --- | --- | --- |
| `week2-session1-retrieval` | 1 | 10 |
| `week2-threat-vulnerability-learning` | 1 | 6 |
| `week2-malware-symptoms` | 1 | 10 |
| `week2-threat-vulnerability-sort` | 1 | 12 |
| `week2-vulnerabilities101-reflection` | 1 | 2 |
| `week2-session2-retrieval` | 2 | 10 |
| `week2-northbank-vulnerability-analysis` | 2 | 5 |
| `week2-six-mark-response-guide` | 2 | 3 |
| `week2-ocr-question-practice` | 2 | 20 |
| `week2-peer-marking-answer-improvement` | 2 | 6 |
| `week2-northbank-vulnerability-register` | 2 | 5 |

All registered activities use `activityVersion: "1.0"`.

## Local clasp workflow

From the repository root:

```bash
clasp pull
git status
# edit files under apps-script/week-2/
clasp push
```

Project mapping is defined in the repository-root `.clasp.json` (`rootDir`: `apps-script/week-2`).

Do **not** run `clasp push --force` unless the remote project has been backed up and there is a documented reason.

## Setup instructions

1. Open the Apps Script project in the browser (clasp open or the script editor URL).
2. Authorise the script when prompted (Sheets access).
3. Run `setupWeek2Workbook()` once.
4. Run `runAllWeek2SelfTests()`.
5. Run `openWeek2Submissions()` when learners may submit.
6. Deploy as a web app (see below).

To repair missing tabs/headers later without clearing results, run `repairWeek2Workbook()`.

## Opening and closing submissions

| Function | Effect |
| --- | --- |
| `openWeek2Submissions()` | Sets Script Property `WEEK2_ACCEPTING_SUBMISSIONS` to `"true"` |
| `closeWeek2Submissions()` | Sets the property to `"false"` |
| `getWeek2SubmissionStatus()` | Logs/returns the current status |
| `areWeek2SubmissionsOpen_()` | Returns true only when the stored value is exactly `"true"` |

## Test instructions

In the Apps Script editor:

1. Select `runAllWeek2SelfTests`
2. Run
3. Confirm the execution log shows all tests passed

Ordinary self-tests do **not** write fake learner submissions.

Optional integration write/cleanup (labelled test data only):

1. Run `runWeek2WriteCleanupIntegrationTest`
2. Confirm the temporary TEST DATA row is removed afterwards

## Example request

`POST` JSON body:

```json
{
  "learnerName": "Student Name",
  "learnerId": "STU1001",
  "groupName": "Group A",
  "weekNumber": 2,
  "sessionNumber": 1,
  "activityId": "week2-threat-vulnerability-sort",
  "activityVersion": "1.0",
  "score": 10,
  "total": 12,
  "attemptNumber": 1,
  "completedAt": "2026-08-05T18:30:00.000Z"
}
```

Collector schema 3.0 aliases are also accepted and normalised:

- `firstName` + `surname` → `learnerName`
- `studentId` → `learnerId`
- `classGroup` → `groupName`
- `maximumScore` → `total`
- `sessionName` (for example `Session 1`) → `sessionNumber`

## Example responses

Success:

```json
{
  "ok": true,
  "recorded": true,
  "duplicate": false,
  "message": "Submission recorded.",
  "activityId": "week2-threat-vulnerability-sort",
  "score": 10,
  "total": 12
}
```

Duplicate:

```json
{
  "ok": true,
  "recorded": false,
  "duplicate": true,
  "message": "This submission has already been recorded."
}
```

Rejected:

```json
{
  "ok": false,
  "recorded": false,
  "duplicate": false,
  "message": "Submission not recorded.",
  "errors": [
    {
      "code": "TOTAL_MISMATCH",
      "field": "total",
      "message": "Submitted total does not match the configured activity."
    }
  ]
}
```

Health check (`GET`):

```json
{
  "ok": true,
  "service": "Unit 3 Cyber Security Week 2 API",
  "week": 2,
  "status": "ok",
  "acceptingSubmissions": true
}
```

## Deployment instructions

Do not create a deployment from Cursor automatically. In the Apps Script UI:

1. Run `setupWeek2Workbook()`.
2. Run `runAllWeek2SelfTests()`.
3. Run `openWeek2Submissions()`.
4. From the repo root: `clasp push`.
5. In Apps Script: **Deploy → New deployment**.
6. Type: **Web app**.
7. Description: e.g. `Week 2 API v1`.
8. Execute as: **Me** (project owner).
9. Who has access: choose the college-appropriate setting (often anyone in the organisation, or anyone with the link for learner devices).
10. Deploy and copy the `/exec` URL.
11. Add that URL to the Week 2 frontend configuration when you are ready to switch from the current Collector endpoint.
12. Submit one controlled test.
13. Confirm the row appears in both **All Submissions** and **Week 2 Results**.

After later code changes, create a **new version** and update the existing web app deployment so learners are not left on an old `/exec` revision.

## Frontend note

The current hub Week 2 pages still post Collector schema 3.0 form data to the existing Collector `/exec` URL in `js/submissions.js`. This Week 2 API is the dedicated Apps Script project for JSON (and alias-compatible) Week 2 collection into the shared spreadsheet. Point the frontend at this `/exec` URL only after deployment and a controlled test.

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Spreadsheet cannot be opened | Wrong ID or no access for the script owner | Check `Config.gs`, share the Sheet with the owner account |
| Missing worksheet | Setup not run | Run `setupWeek2Workbook()` or `repairWeek2Workbook()` |
| Activity version rejected | Client sent a version other than `1.0` | Align frontend `activityVersion` with the registry |
| Total mismatch | Client total does not match registry | Use the totals table above; never trust a client-invented total |
| Submissions closed | Script property is not `"true"` | Run `openWeek2Submissions()` |
| Duplicate submission | Same learner/group/activity/version/attempt already stored | Use a new `attemptNumber` for a genuine retry |
| Web app still running an older version | Deployment not updated after `clasp push` | Deploy a new version / update the web app deployment |

## Security notes

- Do not commit Google passwords or OAuth tokens
- Do not expose the spreadsheet ID in frontend code
- Do not accept arbitrary worksheet names or activity IDs from clients
- Do not return stack traces or spreadsheet IDs in API responses
- Do not store unnecessary full written reflections in the errors tab
