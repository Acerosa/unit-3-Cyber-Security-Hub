# Week 2: Threats and Vulnerabilities

Learner route: `/week-2/`

Week 2 is a separate weekly application area inside the Unit 3 Cyber Security Hub. Week 1 continues to use the Activity API engine. Week 2 local activity pages submit JSON through the Week 2 Apps Script `/exec` endpoint (`week2-api` in `js/activity-engine-config.js`).

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
Submission routing: `js/activity-engine-config.js` → `week2-api` for all Week 2 IDs.

## TryHackMe practical learning

Landing section: **TryHackMe Practical Learning** on `/week-2/` (between Session 1 and Session 2).

| Resource | Room URL | Delivery | Scored activity / resource ID |
| --- | --- | --- | --- |
| Vulnerabilities 101 | https://tryhackme.com/room/vulnerabilities101 | In-class practical (Session 1) | Scored: `week2-vulnerabilities101-reflection` (total **2**, version **1.0**) |
| MAL: Malware Introductory | https://tryhackme.com/room/malmalintroductory | Directed independent study | Non-scored resource: `week2-malware-introductory-directed-study` |

Do not claim rooms are free, premium or permanently available.

### Tutor access notice

Room access and availability must be confirmed by the tutor before the lesson. Learners should not purchase a subscription to complete a college activity unless the college has explicitly authorised it.

### Completion evidence

| Evidence | Source |
| --- | --- |
| TryHackMe room / task completion | Tutor checks the learner’s TryHackMe dashboard (no automated THM integration) |
| Supporting reflection (Vulnerabilities 101) | Existing two-point Week 2 API submission for `week2-vulnerabilities101-reflection` |
| Directed-study notes (malware) | Local browser notes only; TryHackMe remains the main completion evidence |

App progress labels (local only): Instructions viewed · Room opened · Notes started · Reflection complete · Submission recorded · TryHackMe completion checked by tutor.

Opening a room link **does not** mark an activity complete.

### Local storage keys

| Key | Purpose |
| --- | --- |
| `unit3-week2-progress` | Week 2 activity status, scores, attempts, drafts |
| `unit3-week2-vulnerabilities101-notes` | Non-scored Vulnerabilities 101 lesson notes |
| `unit3-week2-malware-introductory-notes` | Non-scored malware directed-study table |
| `unit3-week2-tryhackme-preparation-checklist` (+ optional resource suffix) | Preparation checklist |
| `unit3-week2-tryhackme-progress` | Local THM resource progress labels |
| `unit3-week2-northbank-vulnerability-register` | Five register entries (Week 7-ready fields included) |
| `unit3-week2-attempt:<activityId>` | Week 2 API attempt ID (sessionStorage) |

Week 1 progress and Activity API session keys are not overwritten.

### Safety expectations

- Practical actions stay inside the authorised TryHackMe environment for the room.
- Do not scan, test, attack or experiment on college systems, personal devices, websites or networks.
- Do not download or run suspicious/malicious files on college or personal computers.
- Do not store TryHackMe answer strings, flags or walkthrough answers in the Unit 3 application.

### Academic integrity (site-wide soft controls)

Shared helper: `js/academic-integrity.js` (loaded from `js/navigation.js` on hub pages).

- Shows a “Write in your own words” notice on pages with learning response fields.
- Adds field reminders under learning textareas.
- Announces a polite reminder if a learner pastes into a learning field (**paste is not blocked**).
- **Excluded:** learner details forms (`#learner-details-form` / `data-academic-integrity="exclude"`), partner fields, and other opted-out controls.
- Tutors should still review responses for pasted flags or walkthrough answers.
- Opt out on a page with `data-academic-integrity="off"` on `<body>` if needed (for example staff test pages).

### Availability and fallback

Configurable in `week-2/data/tryhackme-resources.js` per room:

```js
{
  roomId: "vulnerabilities101",
  status: "tutor-check-required", // available | unavailable | tutor-check-required
  checkedAt: "",
  fallbackActivityId: "week2-northbank-vulnerability-analysis"
}
```

Default status is `tutor-check-required`. The browser does **not** auto-check TryHackMe availability.

| Room | Fallback activity |
| --- | --- |
| Vulnerabilities 101 | `week2-northbank-vulnerability-analysis` → `northbank-analysis/` |
| MAL: Malware Introductory | `week2-malware-symptoms` → `malware-symptoms/` |

When status is `unavailable`, the external-room button is disabled and learners are directed to the fallback. The room is not auto-marked complete.

### How tutors update TryHackMe settings

1. **Room URLs / titles / estimated time** — edit the resource object in `week-2/data/tryhackme-resources.js` (and matching guidance in `apps-script/week-2/Week2Vulnerabilities101Data.gs` if the API pack is re-seeded).
2. **Room status** — set `availabilityStatus` to `available`, `unavailable` or `tutor-check-required`; optionally set `checkedAt`.
3. **Classroom codes** — do not hard-code classroom codes in the repo. Issue them through the tutor’s usual TryHackMe classroom workflow.
4. **Verify learner completion** — use the TryHackMe dashboard (or classroom assignment view) plus the Week 2 reflection submission for Vulnerabilities 101.

Frontend content files:

- `week-2/data/tryhackme-resources.js` — rooms, guide, troubleshooting, checklist, tutor notes
- `js/week2-tryhackme.js` — shared rendering helpers
- `week-2/vulnerabilities101/` — in-class practical + scored reflection
- `week-2/malware-introductory/` — directed-study guide (non-scored)

## Editing question data

Tutor-editable content lives under `week-2/data/`:

- `retrieval-session-1.js`
- `threat-vulnerability-learning.js`
- `malware-symptoms.js` (**tutor must confirm OCR malware categories**)
- `threat-vulnerability-sort.js`
- `tryhackme-resources.js`
- `retrieval-session-2.js`
- `northbank-analysis.js`
- `six-mark-guide.js`
- `ocr-practice.js`
- `peer-marking.js`
- `vulnerability-register.js`

When adding a quiz question:

1. Edit the data file only.
2. Keep `total` in the data file aligned with `maximumScore` in `js/course-context.js`.
3. Keep `activityVersion` at `1.0` unless staff intentionally bump both hub and Week 2 API expectations.
4. Re-run `week-2/tests/` registry checks.

Changing a total without updating the registry will cause submission rejection in the browser helper.

## API integration

- Learner identity: shared `js/learner-details.js`
- Payload builder: shared `js/submissions.js`
- Week 2 wrapper: `js/week2-submit.js`
- Week 2 API URL: `Unit3ActivityEngineConfig.week2ApiBaseUrl`
- Do not add `week2-malware-introductory-directed-study` to the scored submission registry

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
- [ ] `/week-2/` lists Session 1, TryHackMe Practical Learning, and Session 2
- [ ] Both TryHackMe room links use HTTPS, `target="_blank"` and `rel="noopener noreferrer"`
- [ ] Vulnerabilities 101 still uses `week2-vulnerabilities101-reflection`, total 2, version 1.0
- [ ] Opening a room does not mark the activity complete
- [ ] Lesson notes and malware table persist after refresh
- [ ] Week 1 storage untouched
- [ ] Safety and troubleshooting content visible and keyboard accessible
- [ ] Unavailable room status disables the external button and shows the fallback
- [ ] Malware directed study is not submitted as a scored activity
- [ ] Open `week-2/tests/` and confirm all checks pass

## Known limitations

- There is **no** authorised TryHackMe completion integration; tutors verify platform completion manually.
- Room availability is tutor-managed in data; the browser does not scrape TryHackMe.
- Classroom codes are not stored in source control.
- OCR six-mark prose is not auto-marked by keywords; peer marking provides qualitative review.
- Malware category list requires tutor confirmation against the OCR specification.
