# Shared Learning Platform integration

The hub vendors the reviewed `learning-platform-core` 0.2.0 browser build from
commit `f59614ee`. Vite production uses `@learning-platform/core` 0.2.0
(`createPlatform` in `src/platform.ts`). Pages CI pins
`@learning-platform/ui` **v0.1.5** for catalogue chrome (`InteractiveActivity`,
`ShortResponse`, `Reflection`). `js/core/platform.js` remains a
compatibility composition root for Node tests. Core owns
the Supabase client, Auth session, learner context, onboarding, profile,
enrolments, assignments, attempts, progress, platform state, theme and account
dialog.

Weeks 1–7 activity **catalogue vs host vs hybrid** behaviour, writing rhythm,
and what still uses classic `app.js` are documented in
[catalogue-migration.md](./catalogue-migration.md).

Cyber-specific curriculum, rendering, marking, evidence extraction, stable-key
aliases and draft recovery remain in this repository. The `Supabase*` globals
under `js/core/` are temporary compatibility facades for existing week code;
they delegate shared concerns to `window.LearningPlatform.platform`.

## Default submission behaviour

Weeks 1–7 share the same authoritative evidence boundary:
authenticated `api.submit_attempt` via `SUPABASE_CONFIG.backendMode = "SUPABASE"`.
Learners do not need `?backend=supabase` for normal operation. Activity and
question keys remain normalized by the Cyber adapter, including uppercase
Week 1 aliases and catalogue version `1.2.0` for `u3-w01-*`. Shared-backend
payloads never include a browser-selected learner, group, enrolment,
assignment or attempt number. Typed name / Student ID on the Week 1 form is
display-only and is not sent as identity. This hub conforms to Hub Security
Baseline v1 (see `learning-platform-core` `docs/hub-security-baseline-v1.md`).

Backend completion returned by Core progress services is authoritative in
Supabase mode. Local storage remains for drafts, unsent completed work and
immediate continuity. A local completion without a corresponding backend
attempt is displayed as pending/in progress after reconciliation rather than
as an authoritative completion.

## Week 1 content and formative compatibility

Week 1 still uses the existing Apps Script Activity API for `getActivity`
and `markSection`. `markSection` returns section-level marking and feedback
used by the generic Week 1 engine before final submission. Neither Core 0.2.0
nor learner API/submission contract 0.1.0 provides an equivalent operation.

That is a split of providers, not a second evidence path:

- content / formative provider: Apps Script (`getActivity`, `markSection`)
- authoritative submission provider: authenticated `api.submit_attempt`

GAS `submitAttempt` remains implemented for health checks and explicit
`backendMode: "APPS_SCRIPT"` rollback only. The browser does not call it
for learner final submission. There is no silent downgrade from a Supabase
failure to GAS authoritative submit.

Core still owns Week 1 account/session/platform behavior because the shared
foundation is loaded on the Week 1 routes.

## Controlled Apps Script rollback

Apps Script implementations remain in the repository for Week 1
content/formative support (required) and Weeks 2–7 (rollback-only).
`Unit3BackendMode.getMode()` / `getSubmissionProvider()` do **not** honour
`?backend=` or `localStorage['unit3.backendMode']`. Learners cannot switch
transport.

Support rollback for final evidence is an explicit `backendMode` change in
`js/config/supabase-config.js`, not a query-string or browser-storage switch.

There is no silent transport fallback. If Supabase fails, the failure stays
visible.

## Backend activation prerequisites

Shared-backend submission for Weeks 1–7 requires the hosted backend to have:

1. published the grounded activity versions used by `api.submit_attempt`
   (Week 1 catalogue `1.2.0`; Weeks 2–7 Batch B);
2. an open Cyber registration group with a registration key;
3. active assignments for those published versions;
4. verified onboarding and `api.submit_attempt` smoke coverage.

Those prerequisites are satisfied on the hosted Learning Platform backend for
the synthetic `CYBER-TEST-A` delivery. Curriculum publication of hub package
`0.2.10` is a separate later step and is not required for the Week 1
submission cutover itself.
