# Week 4: Motivations and Targets

Learner route: `/week-4/`

Week 4 follows the Week 2/3 pattern: local formative pages plus a dedicated Apps Script project under `apps-script/week-4/`, writing to the **shared Unit 3 spreadsheet** (new `Week 4 Results` / `Week 4 Activity Catalogue` tabs).

## Learning focus

- Unit: OCR Level 3 IT, Unit 3 Cyber Security
- LO2 / specification sections **2.3 Motivations** and **2.4 Targets**
- Organisation context: Northbank Community Health Partnership

## Scored activities

| # | Activity | Activity ID | Total | Version |
| --- | --- | --- | ---: | --- |
| 1 | Session 1 Retrieval Quiz | `week4-session1-retrieval` | 10 | 1.0 |
| 2 | Motivations Learning | `week4-motivations-learning` | 8 | 1.0 |
| 3 | Targets and Methods | `week4-targets-methods` | 8 | 1.0 |
| 4 | Northbank Exposure | `week4-northbank-exposure` | 3 | 1.0 |
| 5 | Session 2 Retrieval Quiz | `week4-session2-retrieval` | 12 | 1.0 |
| 6 | Motivation–Target–Method Mapping | `week4-mtm-mapping` | 8 | 1.0 |
| 7 | Analyse Practice | `week4-analyse-practice` | 6 | 1.0 |
| 8 | OCR-Style Question Practice | `week4-ocr-question-practice` | 20 | 1.0 |
| 9 | Answer Improvement | `week4-answer-improvement` | 6 | 1.0 |
| 10 | Ethical Review | `week4-ethical-review` | 2 | 1.0 |

## API registration

- Frontend routing: `js/activity-engine-config.js` → `WEEK4_API` / `week4ApiBaseUrl`
- Progress: `js/week4-progress.js`
- Submit helper: `js/week4-submit.js`
- Apps Script: `apps-script/week-4/`
- Manifest source of truth: `Week4ActivityManifest.gs`

`week4ApiBaseUrl` is set in `js/activity-engine-config.js` to the Week 4 `/exec` deployment. If health returns Access denied, re-authorise the web app in the Apps Script UI (Execute as: Me; Who has access: Anyone), then bootstrap.

## Google Apps Script setup

Project: **Unit 3 Cyber Security - Week 4 API**  
Script ID: `1krOU6kyBOE9gelYKXBiv9rEyr7ht5mN3W5RlpdWgsTEMDJhnBETnxLyM`  
Editor: https://script.google.com/d/1krOU6kyBOE9gelYKXBiv9rEyr7ht5mN3W5RlpdWgsTEMDJhnBETnxLyM/edit  
Clasp mapping: `.clasp.week-4.json` (root `.clasp.json` remains Week 2)

1. Confirm `Config.gs` uses the shared Unit 3 spreadsheet ID (not exposed to the browser).
2. In the Apps Script editor, run `checkWeek4Config` once and accept spreadsheet permissions.
3. Deploy → New deployment → Web app (Execute as: Me; Who has access: Anyone). Prefer a UI deployment so anonymous `/exec` works — same step used for Weeks 2 and 3.
4. Paste the production `/exec` URL into `js/activity-engine-config.js` → `week4ApiBaseUrl` if it differs from the clasp deployment already wired.
5. Bootstrap once:

```text
GET /exec?action=bootstrapSetup&confirm=Unit3-Week4-Bootstrap-Once
```

This runs workbook setup, data tests, `seedWeek4Activities()`, `openWeek4Submissions()`, and `runWeek4SelfTest()`.

6. Confirm `GET /exec?action=health` returns JSON with `"week": 4` and `acceptingSubmissions: true`.
7. Submit a TEST formative result and confirm a row in `Week 4 Results` with version `1.0`.

Do **not** replace Week 1, Week 2 or Week 3 web app deployments.

## Testing

- Smoke-test each activity page loads without console errors
- After deployment, submit one TEST result and confirm a `Week 4 Results` row
