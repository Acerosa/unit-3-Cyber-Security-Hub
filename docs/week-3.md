# Week 3: Types of Attacker

Learner route: `/week-3/`

Week 3 follows the Week 2 pattern: local formative pages plus a dedicated Apps Script project under `apps-script/week-3/`, writing to the **shared Unit 3 spreadsheet** (new `Week 3 Results` / `Week 3 Activity Catalogue` tabs).

## Learning focus

- Unit: OCR Level 3 IT, Unit 3 Cyber Security
- LO2 / specification section **2.2 Types of attackers**
- Organisation context: Northbank Community Health Partnership

## Scored activities

| # | Activity | Activity ID | Session | Total | Version |
| --- | --- | --- | --- | --- | --- |
| 1 | Session 1 Retrieval Quiz | `week3-session1-retrieval` | 1 | 10 | 1.0 |
| 2 | Attacker Types Learning | `week3-attacker-types-learning` | 1 | 8 | 1.0 |
| 3 | Attacker Case Study Matching | `week3-attacker-case-matching` | 1 | 8 | 1.0 |
| 4 | Justified Identification Practice | `week3-justified-identification` | 1 | 12 | 1.0 |
| 5 | Session 2 Retrieval Quiz | `week3-session2-retrieval` | 2 | 12 | 1.0 |
| 6 | OCR-Style Question Practice | `week3-ocr-question-practice` | 2 | 20 | 1.0 |
| 7 | Peer Marking and Answer Improvement | `week3-peer-marking` | 2 | 6 | 1.0 |

Non-scored guidance:

- TryHackMe Pentesting Fundamentals — `week-3/pentesting-fundamentals/`
- Directed study (Cisco 1.4 + TryHackMe Hacker Methodology + research template) — `week3-directed-study` content only

## External links

| Resource | URL | Use |
| --- | --- | --- |
| Pentesting Fundamentals | https://tryhackme.com/room/pentestingfundamentals | In-class practical |
| The Hacker Methodology | https://tryhackme.com/room/hackermethodology | Directed study |
| Cisco Networking Academy | Introduction to Cybersecurity · Topic 1.4 Cyber Attackers | Directed study |

## API registration

- Frontend routing: `js/activity-engine-config.js` → `WEEK3_API` / `week3ApiBaseUrl`
- Registry: `js/course-context.js`
- Progress: `js/week3-progress.js` (`unit3-week3-progress`)
- Submit helper: `js/week3-submit.js`
- Apps Script: `apps-script/week-3/`
- Manifest source of truth: `Week3ActivityManifest.gs`

`week3ApiBaseUrl` starts empty until the Week 3 Apps Script web app is deployed. Update the URL in `activity-engine-config.js` after deployment.

## Google Apps Script setup

1. Create a **new** Apps Script project for Week 3 (do not modify Week 1 or Week 2 projects).
2. Point clasp at `apps-script/week-3` (see `clasp.week-3.json.example`).
3. Confirm `Config.gs` uses the shared Unit 3 spreadsheet ID.
4. Run `setupWeek3Workbook()` to create Week 3 tabs.
5. Run `seedAllWeek3ActivityData()`.
6. Run `openWeek3Submissions()`.
7. Deploy as web app (`ANYONE_ANONYMOUS` execute access, same pattern as Week 2).
8. Paste the `/exec` URL into `week3ApiBaseUrl`.

## Testing

- Open `/week-3/tests/`
- Confirm all registry checks pass
- Smoke-test each activity page loads without console errors
- After deployment, submit one TEST result and confirm a `Week 3 Results` row

## Local storage keys

| Key | Purpose |
| --- | --- |
| `unit3-week3-progress` | Activity status, drafts, scores |
| `unit3-week3-attempt:<activityId>` | Attempt IDs (sessionStorage via submissions helper) |
| `unit3-week3-pentest-checklist` | THM checklist |
| `unit3-week3-attacker-research-profile` | Directed-study template |

Week 1 and Week 2 storage keys are not overwritten.
