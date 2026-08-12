# Shared Learning Platform integration

The hub vendors the reviewed `learning-platform-core` 0.1.0 browser build from
commit `f484b2d`. `js/core/platform.js` is the single composition root. Core owns
the Supabase client, Auth session, learner context, onboarding, profile,
enrolments, assignments, attempts, progress, platform state, theme and account
dialog.

Cyber-specific curriculum, rendering, marking, evidence extraction, stable-key
aliases and draft recovery remain in this repository. The `Supabase*` globals
under `js/core/` are temporary compatibility facades for existing week code;
they delegate shared concerns to `window.LearningPlatform.platform`.

## Default submission behaviour

Weeks 2–7 default to the shared Supabase backend (`api.submit_attempt`) via
`SUPABASE_CONFIG.backendMode = "SUPABASE"`. Learners do not need
`?backend=supabase` for normal operation. Activity and question keys remain
normalized by the Cyber adapter, including uppercase Week 1 aliases and the
`1.0` to `1.0.0` activity version mapping. Shared-backend payloads never include
a browser-selected learner, group, enrolment, assignment or attempt number.

Backend completion returned by Core progress services is authoritative in
Supabase mode. Local storage remains for drafts, unsent completed work and
immediate continuity. A local completion without a corresponding backend
attempt is displayed as pending/in progress after reconciliation rather than
as an authoritative completion.

## Week 1 compatibility exception

Week 1 continues to use the existing Apps Script Activity API. Its
`markSection` operation returns section-level marking and feedback used by the
generic Week 1 engine before final submission. Neither Core 0.1.0 nor learner
API/submission contract 0.1.0 provides an equivalent operation. Week 1 pages
are therefore forced to `APPS_SCRIPT` regardless of the global default; this is
an explicit compatibility route, not an error fallback.

Core still owns Week 1 account/session/platform behavior because the shared
foundation is loaded on the Week 1 routes.

## Controlled Apps Script rollback

Apps Script implementations remain in the repository. Support/dev can force
rollback for Weeks 2–7 without changing learner-facing UI:

- URL: `?backend=apps_script`
- Storage: `localStorage['unit3.backendMode'] = 'APPS_SCRIPT'`

There is no silent transport fallback. If Supabase fails, the failure stays
visible. Rollback must be an explicit, observable override.

## Backend activation prerequisites

Shared-backend submission for Weeks 2–7 requires the hosted backend to have:

1. published the grounded Weeks 2–7 activity versions;
2. an open Cyber registration group with a registration key;
3. active assignments for those published versions;
4. verified onboarding and `api.submit_attempt` smoke coverage.

Those prerequisites are satisfied on the hosted Learning Platform backend for
the synthetic `CYBER-TEST-A` delivery. Week 1 remains unpublished on purpose
and must stay on Apps Script until a proven `markSection` replacement exists.
