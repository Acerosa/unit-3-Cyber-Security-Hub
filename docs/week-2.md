# Week 2: Threats and Vulnerabilities

Learner route: `/week-2/`

Week 2 is a separate weekly application area inside the Unit 3 Cyber Security Hub. Week 1 continues to use the Activity API engine. Week 2 activities are local formative pages that submit through the existing Collector v3 `/exec` endpoint and the same staff spreadsheet workflow.

## Key teaching idea

> A threat exploits a vulnerability to cause a cyber security incident.

## Activities

| # | Activity | Activity ID | Session | Total | Version |
| --- | --- | --- | --- | --- | --- |
| 1 | Session 1 Retrieval Quiz | `week2-session1-retrieval` | 1 | 10 | 1.0 |
| 2 | Threats and Vulnerabilities Learning | `week2-threat-vulnerability-learning` | 1 | 6 | 1.0 |
| 3 | Malware Categories and Symptoms | `week2-malware-symptoms` | 1 | 10 | 1.0 |
| 4 | Threat or Vulnerability Sort | `week2-threat-vulnerability-sort` | 1 | 12 | 1.0 |
| 5 | TryHackMe: Vulnerabilities 101 | `week2-vulnerabilities101-reflection` | 1 | 2 | 1.0 |
| 6 | Session 2 Retrieval Quiz | `week2-session2-retrieval` | 2 | 10 | 1.0 |
| 7 | Northbank Vulnerability Analysis | `week2-northbank-vulnerability-analysis` | 2 | 5 | 1.0 |
| 8 | Six-Mark Response Guide | `week2-six-mark-response-guide` | 2 | 3 | 1.0 |
| 9 | OCR-Style Question Practice | `week2-ocr-question-practice` | 2 | 20 | 1.0 |
| 10 | Peer Marking and Answer Improvement | `week2-peer-marking-answer-improvement` | 2 | 6 | 1.0 |
| 11 | Northbank Vulnerability Register | `week2-northbank-vulnerability-register` | 2 | 5 | 1.0 |

Registry source of truth: `js/course-context.js`  
Submission routing: `js/activity-engine-config.js` → `collector-v3` for all Week 2 IDs.

## Local storage keys

| Key | Purpose |
| --- | --- |
| `unit3-week2-progress` | Week 2 activity status, scores, attempts, drafts |
| `unit3-week2-northbank-vulnerability-register` | Five register entries (Week 7-ready fields included) |
| `unit3-week2-attempt:<activityId>` | Collector Attempt ID (sessionStorage) |

Week 1 progress and Activity API session keys are not overwritten.

## Editing question data

Tutor-editable content lives under `week-2/data/`:

- `retrieval-session-1.js`
- `threat-vulnerability-learning.js`
- `malware-symptoms.js` (**tutor must confirm OCR malware categories**)
- `threat-vulnerability-sort.js`
- `retrieval-session-2.js`
- `northbank-analysis.js`
- `six-mark-guide.js`
- `ocr-practice.js`
- `peer-marking.js`
- `vulnerability-register.js`

When adding a quiz question:

1. Edit the data file only.
2. Keep `total` in the data file aligned with `maximumScore` in `js/course-context.js`.
3. Keep `activityVersion` at `1.0` unless staff intentionally bump both hub and collector expectations.
4. Re-run `week-2/tests/` registry checks.

Changing a total without updating the registry will cause submission rejection in the browser helper.

## API integration

- Learner identity: shared `js/learner-details.js`
- Payload builder: shared `js/submissions.js` (schema 3.0)
- Week 2 wrapper: `js/week2-submit.js`
- Collector URL remains the existing `Unit3Submissions.COLLECTOR_URL`
- No second spreadsheet and no new Apps Script deployment from this repo
- Staff must ensure Configuration **Allowed totals** include Week 2 values: `2,3,5,6,10,12,20` (plus existing Week 1 totals as required)

Week 1 Activity API activities are unchanged.

## Vulnerability register and Week 7

Saved JSON entries include reserved fields:

- `likelihood`
- `impact`
- `riskScore`
- `mitigation`
- `priority`

Week 7 can load `unit3-week2-northbank-vulnerability-register` and extend these fields without rebuilding the five assets.

## Manual test checklist

- [ ] Home shows Week 2 card; nav links to Week 2 from Home, Week 1, Resources, Help
- [ ] `/week-2/` lists Session 1 and Session 2 cards with status
- [ ] Every activity opens without console errors
- [ ] Week 1 Activity API routes still load
- [ ] Progress survives refresh; Week 1 storage untouched
- [ ] Scored activities submit correct `activityId`, version `1.0`, matching totals
- [ ] Duplicate submit blocked until “Start another attempt”
- [ ] Network/config failure does not claim success
- [ ] Threat/vulnerability sort works with keyboard Move buttons
- [ ] Register keeps five entries after refresh; reset asks for confirmation
- [ ] TryHackMe link uses `target="_blank"` and `rel="noopener noreferrer"`
- [ ] Mobile width and 200% zoom remain usable
- [ ] Open `week-2/tests/` and confirm all registry checks pass

## Known limitations

- Week 2 uses Collector v3 form POST confirmation tabs (same pattern as legacy collector helpers), not the Activity API JSON engine used by Week 1.
- OCR six-mark prose is not auto-marked by keywords; peer marking provides qualitative review.
- Northbank analysis marking uses tutor-defined acceptable answers with flexible matching — unusual wording may need tutor review.
- Malware category list requires tutor confirmation against the OCR specification.
