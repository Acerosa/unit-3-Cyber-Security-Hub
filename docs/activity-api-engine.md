# Activity API engine (Phase 6)

Generic learner activity engine for API-driven activities.

## Endpoint ownership

| Activity ID | Service | Module |
| --- | --- | --- |
| `U3-W01-BASELINE` | Activity API only | `js/activity-api.js` |
| `U3-W01-CIA` | Activity API only | `js/activity-api.js` |
| `U3-W01-INCIDENTS` | Activity API only | `js/activity-api.js` |
| `U3-W01-GLOSSARY` | Activity API only | `js/activity-api.js` |
| `U3-W01-RETRIEVAL` | Activity API only | `js/activity-api.js` |
| `U3-W01-COMMAND-WORDS` | Activity API only | `js/activity-api.js` |
| `U3-W01-OCR-PRACTICE` | Activity API only | `js/activity-api.js` |
| `U3-W01-PEER-IMPROVEMENT` | Activity API only | `js/activity-api.js` |

All current Week 1 formative activities use the generic Activity API engine only.
Former Collector-based activity pages have been removed or reduced to lightweight redirects.

Routing is defined in `js/activity-engine-config.js` as `SUBMISSION_ROUTING`.

Do not choose the endpoint from display text or folder location.

Do not send one completed activity to both endpoints.

## Pilot routes

```text
activities/activity.html?activityId=U3-W01-COMMAND-WORDS
activities/activity.html?activityId=U3-W01-BASELINE
activities/activity.html?activityId=U3-W01-CIA
activities/activity.html?activityId=U3-W01-INCIDENTS
activities/activity.html?activityId=U3-W01-GLOSSARY
activities/activity.html?activityId=U3-W01-RETRIEVAL
activities/activity.html?activityId=U3-W01-OCR-PRACTICE
activities/activity.html?activityId=U3-W01-PEER-IMPROVEMENT
```

The query-string `activityId` takes priority over the HTML fallback.

## Configuration

`js/activity-engine-config.js`:

- `apiBaseUrl`: permanent `script.google.com` `/exec` URL
- `submissionMode`: `TEST`
- `allowLiveSubmissions`: `false`

LIVE is sent only when both `submissionMode: 'LIVE'` and `allowLiveSubmissions: true`.

## Engine files

- `js/activity-engine-config.js`
- `js/activity-api.js`
- `js/activity-state.js`
- `js/activity-renderer.js`
- `js/activity-engine.js`
- `css/activity-engine.css`
- `activities/activity.html`

## Browser rules

- No hard-coded pilot questions or answer keys
- No browser-calculated final score for submission
- No Collector calls from the pilot page (`js/submissions.js` is not loaded)
- sessionStorage holds Attempt ID, responses, marked sections and final API response only
- Learner identity is not stored in browser storage

## Test checklist

1. Health validation succeeds (`UNIT3-ACTIVITY-API-V1.6`, `resultsConnected: true`).
2. Activity loads from `getActivity`.
3. Supported question types include `reflection` and `self-assessment`.
4. Peer Marking (`U3-W01-PEER-IMPROVEMENT`) renders seven sections and seven controls.
5. Completion results use Completed / steps-completed wording, not quiz Correct / Score wording.
6. Page source before marking contains no correct-answer fields from the API.
7. Missing required answers and minimum character limits are blocked.
8. Progress reaches 4 of 4 assessment sections for Peer Marking.
9. Final learner form appears only after all assessment sections are checked.
10. Optional partner fields appear; self-marking works without a partner.
11. TEST `submitAttempt` records successfully.
12. Retry of the same attempt is treated as a duplicate.
12. Refresh before submission restores Attempt ID and responses.
13. Network panel shows Activity API `/exec` only (no Collector URL).
14. Existing Collector activities still load and still use `js/submissions.js`.
