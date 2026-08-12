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

## Submission readiness

Weeks 2–7 use `Unit3SupabaseSubmitRunner` when the explicit Supabase backend
mode is selected. Activity and question keys remain normalized by the Cyber
adapter, including uppercase Week 1 aliases and the `1.0` to `1.0.0` activity
version mapping. Shared-backend payloads never include a browser-selected
learner, group, enrolment, assignment or attempt number.

Backend completion returned by Core progress services is authoritative in
Supabase mode. Local storage remains for drafts, unsent completed work and
immediate continuity. A local completion without a corresponding backend
attempt is displayed as pending/in progress after reconciliation rather than
as an authoritative completion.

## Week 1 compatibility exception

Week 1 continues to use the existing Apps Script Activity API. Its
`markSection` operation returns section-level marking and feedback used by the
generic Week 1 engine before final submission. Neither Core 0.1.0 nor learner
API/submission contract 0.1.0 provides an equivalent operation. Week 1 is
therefore forced to `APPS_SCRIPT`; this is an explicit compatibility route, not
an error fallback.

Core still owns Week 1 account/session/platform behavior because the shared
foundation is loaded on the Week 1 routes.

## Backend activation blockers

The backend repository imports all 76 activity versions, but the reviewed
catalogue migration leaves their `published_at` values null. The submission RPC
also requires exactly one active assignment for the authenticated learner.
Production Supabase submission must therefore remain disabled as the global
default until an approved backend release:

1. publishes the required activity versions;
2. configures group delivery and assignments;
3. confirms onboarding registration groups are open and keyed; and
4. verifies the hosted migration history before applying backend migrations.

Until those backend actions are approved, Apps Script remains the configured
default and Supabase is an explicit test/readiness mode. No backend repository
files are modified by this frontend integration.
