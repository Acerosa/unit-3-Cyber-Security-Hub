# Week 2 Apps Script notes

## Dedicated Week 2 API

A standalone Week 2 Apps Script API lives in `apps-script/week-2/`.

- Opens the shared Unit 3 spreadsheet with `SpreadsheetApp.openById(CONFIG.spreadsheetId)`
- Serves Week 2 activity content using the Week 1 Activity API contract (`manifest`, `getActivity`, `markSection`)
- Stores complete educational packs in `Week2*Data.gs` files
- Validates Week 2 activity IDs, versions and totals from `Week2ActivityManifest.gs` / `Week2Activities.gs`
- Writes to `All Submissions`, `Week 2 Results`, and `Errors and Rejections`
- Seeds catalogue metadata with `seedAllWeek2ActivityData()`
- Deploy and operate using `apps-script/week-2/README.md`

Do not modify the Week 1 Activity API project when changing Week 2 collection.

## Current frontend routing

Week 2 formative activities currently still submit Collector schema 3.0 payloads through the existing Collector `/exec` URL in `js/submissions.js`.

Point the frontend at the Week 2 API `/exec` URL only after that web app has been deployed and smoke-tested.

## Allowed totals

Whether using the Collector or the Week 2 API, accepted Week 2 totals include:

```text
2,3,5,6,10,12,20
```

## Registered Week 2 activity IDs

See `js/course-context.js`, `docs/week-2.md`, and `apps-script/week-2/Week2Activities.gs`. Every Week 2 activity uses `activityVersion: "1.0"`.
