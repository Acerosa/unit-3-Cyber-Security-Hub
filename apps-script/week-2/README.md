# Unit 3 Cyber Security — Week 2 Apps Script API

Standalone Google Apps Script web app for **Week 2: Threats and Vulnerabilities**.

It provides:

- Week 2 activity content using the Week 1 Activity API contract (`getActivity`, `manifest`, `markSection`)
- Submission recording into the shared Unit 3 Google Spreadsheet
- Validation, duplicate protection and JSON responses

This project is separate from the Week 1 Activity API. Do not modify the Week 1 Apps Script project when working here.

## Architecture (aligned with Week 1)

Week 1 stores educational activity data in Apps Script and serves it through:

```text
GET /exec?action=health
GET /exec?action=getActivity&activityId=...
POST /exec  { "action": "markSection", ... }
```

Week 2 follows the same pattern:

- Content packs live in `.gs` data files (not guessed spreadsheet question rows)
- `Week2ActivityDataService.gs` builds the public learner payload
- Correct answers, mark schemes and tutor notes stay in `assessment` / `tutorData`
- Catalogue metadata can be seeded into the shared spreadsheet for tutor visibility

## Spreadsheet configuration

Configure the spreadsheet ID only in `Config.gs`:

```javascript
spreadsheetId: "1Q85_zt8cSrqpzSMNPuhvHXfa767QEhXSPnQznvSZe08"
```

Open with `SpreadsheetApp.openById(CONFIG.spreadsheetId)` only.

## Worksheet tabs

| Tab | Role |
| --- | --- |
| `All Submissions` | Accepted submission log |
| `Week 2 Results` | Week 2 results view |
| `Errors and Rejections` | Rejected payloads |
| `Week 2 Activity Catalogue` | Seeded activity metadata (not learner answers) |

## Complete Week 2 activity inventory

| Activity ID | Type | Version | Total | Component ID | Data file |
| --- | --- | --- | --- | --- | --- |
| `week2-session1-retrieval` | Retrieval quiz | 1.0 | 10 | `quiz` | `Week2Session1RetrievalData.gs` |
| `week2-threat-vulnerability-learning` | Guided learning | 1.0 | 6 | `guided-learning` | `Week2ThreatVulnerabilityLearningData.gs` |
| `week2-malware-symptoms` | Knowledge check | 1.0 | 10 | `matching` | `Week2MalwareSymptomsData.gs` |
| `week2-threat-vulnerability-sort` | Practical classification | 1.0 | 12 | `classification` | `Week2ThreatVulnerabilitySortData.gs` |
| `week2-vulnerabilities101-reflection` | Reflection | 1.0 | 2 | `external-room-reflection` | `Week2Vulnerabilities101Data.gs` |
| `week2-session2-retrieval` | Retrieval quiz | 1.0 | 10 | `quiz` | `Week2Session2RetrievalData.gs` |
| `week2-northbank-vulnerability-analysis` | Scenario analysis | 1.0 | 5 | `scenario-analysis` | `Week2NorthbankAnalysisData.gs` |
| `week2-six-mark-response-guide` | Exam skills | 1.0 | 3 | `exam-guide` | `Week2SixMarkGuideData.gs` |
| `week2-ocr-question-practice` | Exam skills | 1.0 | 20 | `ocr-question-practice` | `Week2OcrPracticeData.gs` |
| `week2-peer-marking-answer-improvement` | Reflection | 1.0 | 6 | `peer-marking` | `Week2PeerMarkingData.gs` |
| `week2-northbank-vulnerability-register` | Scenario analysis | 1.0 | 5 | `structured-register` | `Week2VulnerabilityRegisterData.gs` |

Single source of truth for IDs, versions, totals, types and enabled flags:

- `Week2ActivityManifest.gs`
- Derived registry helpers in `Week2Activities.gs`

## Data-file locations

```text
apps-script/week-2/
  Week2ActivityManifest.gs
  Week2*Data.gs
  Week2ActivityDataService.gs
  Week2ActivitySeed.gs
  Week2ActivityDataTests.gs
```

## Public / revealed / tutor-only data

| Layer | Included | Exposed to learners |
| --- | --- | --- |
| Public `getActivity` | Activity metadata, learning blocks, question prompts/options | Yes |
| Revealed after `markSection` | Status, marks awarded, feedback, explanation, correct option text for objective items | Yes, after check |
| Tutor-only | `tutorData`, full mark schemes before peer stage, indicative prose answers, spreadsheet IDs | No |

## Activity content API

```text
GET  ?action=health
GET  ?action=manifest
GET  ?action=getActivity&activityId=week2-session1-retrieval
POST { "action": "markSection", "activityId": "...", "sectionId": "...", "responses": [...] }
```

A bare `GET` with no `action` still returns the original simple health payload.

`submitAttempt` remains available through the existing Week 2 submission service path when the POST body is a results payload rather than an Activity API marking request.

## Seed functions

Content itself is code-hosted. Seeds upsert catalogue rows only:

- `seedAllWeek2ActivityData()` / `seedWeek2Activities()`
- `seedWeek2Session1Retrieval()`
- `seedWeek2ThreatVulnerabilityLearning()`
- `seedWeek2MalwareSymptoms()`
- `seedWeek2ThreatVulnerabilitySort()`
- `seedWeek2Vulnerabilities101Reflection()`
- `seedWeek2Session2Retrieval()`
- `seedWeek2NorthbankAnalysis()`
- `seedWeek2SixMarkGuide()`
- `seedWeek2OcrPractice()`
- `seedWeek2PeerMarking()`
- `seedWeek2VulnerabilityRegister()`

Seeds are idempotent: matching Activity IDs are updated, not duplicated. Week 1 tabs/rows are not cleared.

Accepted activity types (exact strings):

```text
Retrieval quiz
Guided learning
Knowledge check
Practical classification
Reflection
Scenario analysis
Exam skills
```

## How to update content safely

| Change | What to edit | Then run |
| --- | --- | --- |
| Question wording / options | Relevant `Week2*Data.gs` pack | `runAllWeek2ActivityDataTests()` then `clasp push` |
| Correct answer | `assessment.correctOptionId` in the same pack | tests + push |
| Total / version | `Week2ActivityManifest.gs` **and** pack `meta.maximumScore` / marks sum | tests + `seedAllWeek2ActivityData()` |
| Re-seed catalogue only | no content edit required | `seedAllWeek2ActivityData()` |

Never change a total in only one of: manifest, pack marks, submission registry, or frontend registry.

## Testing

```text
runAllWeek2ActivityDataTests()
runAllWeek2SelfTests()
```

Activity-data tests check IDs, versions, totals, unique question IDs, option integrity, explanations, manual OCR item, peer checklist, register slots and public-payload sanitisation.

## Local clasp workflow

```bash
clasp pull
git status
# edit files under apps-script/week-2/
clasp push
```

Do **not** run `clasp push --force` unless the remote project has been backed up and there is a documented reason.

## Setup sequence

1. `setupWeek2Workbook()`
2. `runAllWeek2ActivityDataTests()`
3. `runAllWeek2SelfTests()`
4. `seedAllWeek2ActivityData()`
5. `openWeek2Submissions()`
6. Deploy web app (manual)
7. Controlled test submission

## Frontend components expected

Current Week 2 hub pages still render from local `week-2/data/*.js` banks and submit JSON results to `week2ApiBaseUrl` in `js/activity-engine-config.js`.

One-shot remote bootstrap (locks after first success):

```text
GET /exec?action=bootstrapSetup&confirm=Unit3-Week2-Bootstrap-Once&requestId=setup-1
```

When moving a page onto the Activity API engine, use the `componentId` values above.

| Component ID | Notes |
| --- | --- |
| `quiz` | Activity API `single-choice` sections |
| `guided-learning` | Content blocks + knowledge check |
| `matching` | Malware reference + MCQ |
| `classification` | Threat/vulnerability cards as single-choice |
| `external-room-reflection` | TryHackMe reflections |
| `scenario-analysis` | Preferred multi-field UI; API pack also provides extended-response completion items |
| `exam-guide` | Six-mark teaching + 3-mark check |
| `ocr-question-practice` | Mixed objective + manual prose |
| `peer-marking` | Checklist + improvement reflections |
| `structured-register` | Preferred register UI; API pack provides five structured entry slots |

## Week 7 reuse of the vulnerability register

Register entries already reserve:

`likelihood`, `impact`, `riskScore`, `mitigation`, `priority`, `reviewDate`

Do not collapse register rows into one prose blob if Week 7 risk scoring will extend them.

## Opening and closing submissions

| Function | Effect |
| --- | --- |
| `openWeek2Submissions()` | Script property `WEEK2_ACCEPTING_SUBMISSIONS = "true"` |
| `closeWeek2Submissions()` | `"false"` |
| `getWeek2SubmissionStatus()` | Current status |
| `areWeek2SubmissionsOpen_()` | True only when value is exactly `"true"` |

## Example content request

```text
GET /exec?action=getActivity&apiVersion=1.0&requestId=demo&activityId=week2-threat-vulnerability-sort
```

## Example submission request

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

## Deployment instructions

1. Run `setupWeek2Workbook()`.
2. Run `runAllWeek2ActivityDataTests()` and `runAllWeek2SelfTests()`.
3. Run `seedAllWeek2ActivityData()`.
4. Run `openWeek2Submissions()`.
5. `clasp push`
6. Deploy as a web app (execute as Me; choose access setting).
7. Copy `/exec` URL into the Week 2 frontend when ready to switch.
8. Controlled test; confirm **All Submissions** and **Week 2 Results**.

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Spreadsheet cannot be opened | Wrong ID / sharing | Check `Config.gs` and Sheet sharing |
| Missing worksheet | Setup not run | `setupWeek2Workbook()` |
| Activity version rejected | Client version drift | Keep `1.0` everywhere |
| Total mismatch | Marks/manifest/frontend disagree | Update all four places together |
| Submissions closed | Property not `"true"` | `openWeek2Submissions()` |
| Duplicate submission | Same submission key | New `attemptNumber` for a real retry |
| Older web app version | Deployment not updated | New version / update deployment |
| Seed fails on activity type | Exact type string mismatch | Use accepted list above |

## Security notes

- Do not commit Google passwords or OAuth tokens
- Do not expose the spreadsheet ID in frontend code
- Do not send tutor-only mark schemes in `getActivity`
- Do not auto-mark the six-mark OCR prose item
- Do not treat peer-checklist points as verified examination scores
