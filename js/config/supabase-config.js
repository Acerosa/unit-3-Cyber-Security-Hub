/**
 * Unit 3 Cyber Security Hub — public Supabase browser configuration.
 *
 * Only browser-safe values may live in this file:
 *   - project URL
 *   - publishable (anon) browser key
 *   - schema name
 *   - non-secret runtime toggles
 *
 * Never commit a service-role key, database password, CLI credential
 * or any secret. All privileged access happens server-side via Supabase RLS.
 *
 * `backendMode` controls which submission transport is used:
 *   - "SUPABASE"     -> api.submit_attempt on the shared Supabase project
 *   - "APPS_SCRIPT"  -> existing Google Apps Script /exec endpoints (rollback)
 *
 * Default is SUPABASE for Weeks 2–7 after hosted backend activation. There is
 * NO silent fallback: a Supabase failure remains visible to the learner and
 * the tutor. Controlled rollback for support/dev:
 *   - ?backend=apps_script in the URL, or
 *   - localStorage['unit3.backendMode'] = 'APPS_SCRIPT'
 * are honoured by Unit3BackendMode.getMode() when present. Learners are not
 * shown backend-selection UI.
 *
 * Week 1 override (deterministic, not an error fallback):
 *   Activity API pages under /activities/activity.html, /week-1/, and
 *   activity keys matching U3-W01-* are forced to APPS_SCRIPT because
 *   Week 1 still depends on the legacy markSection workflow and there is
 *   no safe Supabase equivalent in the current backend contract.
 */
(function () {
  "use strict";

  var VERSION_ALIASES = Object.freeze({
    /*
     * Frontend activity metadata records activityVersion as '1.0' but the
     * Supabase catalogue stores activity versions as '1.0.0'. This is a
     * single central mapping — never scatter conversion logic across
     * week scripts.
     */
    "1.0": "1.0.0"
  });

  window.SUPABASE_CONFIG = Object.freeze({
    backend: "supabase",
    module: "unit-3-cyber-security",
    course: "ocr-level-3-it",
    projectUrl: "https://hubwpkrqndorznwzvaer.supabase.co",
    publishableKey: "sb_publishable_SlcVwn-vjm-hTUZlC_UH7g_V3GedixM",
    backendMode: "SUPABASE",
    supportedBackendModes: Object.freeze(["APPS_SCRIPT", "SUPABASE"]),
    activityVersionAliases: VERSION_ALIASES,
    /*
     * Activities that have been catalogued into the Unit 3 Supabase import.
     * Week 1 keys are stored lower-case in Supabase even though the
     * legacy Activity API engine references them upper-case. The submission
     * adapter normalises the outgoing key.
     */
    enabledActivities: Object.freeze([
      "u3-w01-baseline",
      "u3-w01-cia",
      "u3-w01-incidents",
      "u3-w01-glossary",
      "u3-w01-retrieval",
      "u3-w01-command-words",
      "u3-w01-ocr-practice",
      "u3-w01-peer-improvement",
      "week2-session1-retrieval",
      "week2-threat-vulnerability-learning",
      "week2-malware-symptoms",
      "week2-threat-vulnerability-sort",
      "week2-vulnerabilities101-reflection",
      "week2-session2-retrieval",
      "week2-northbank-vulnerability-analysis",
      "week2-six-mark-response-guide",
      "week2-ocr-question-practice",
      "week2-peer-marking-answer-improvement",
      "week2-northbank-vulnerability-register",
      "week3-session1-retrieval",
      "week3-attacker-types-learning",
      "week3-attacker-case-matching",
      "week3-justified-identification",
      "week3-session2-retrieval",
      "week3-ocr-question-practice",
      "week3-peer-marking",
      "week4-session1-retrieval",
      "week4-motivations-learning",
      "week4-targets-methods",
      "week4-northbank-exposure",
      "week4-session2-retrieval",
      "week4-mtm-mapping",
      "week4-analyse-practice",
      "week4-ocr-question-practice",
      "week4-answer-improvement",
      "week4-ethical-review",
      "week5-session1-retrieval",
      "week5-vulnerability-patterns",
      "week5-threat-vulnerability-risk",
      "week5-impacts-learning",
      "week5-impact-classification",
      "week5-ransomware-companion",
      "week5-exercise-debrief",
      "week5-session2-retrieval",
      "week5-stakeholder-grid",
      "week5-impact-analysis",
      "week5-controls-matching",
      "week5-secure-rewrite",
      "week5-ocr-question-practice",
      "week5-answer-improvement",
      "week6-lo2-diagnostic",
      "week6-ethical-learning",
      "week6-ethical-classification",
      "week6-legislation-learning",
      "week6-legislation-matching",
      "week6-operational-considerations",
      "week6-government-initiatives",
      "week6-ncsc-guidance",
      "week6-exercise-decision-record",
      "week6-session1-review",
      "week6-legislation-retrieval",
      "week6-employee-monitoring",
      "week6-stakeholder-debate",
      "week6-discuss-learning",
      "week6-discuss-planner",
      "week6-ocr-question-practice",
      "week6-answer-improvement",
      "week6-revision-organiser",
      "week7-session1-retrieval",
      "week7-risk-management-learning",
      "week7-northbank-risk-register",
      "week7-testing-methods",
      "week7-sandbox-observation",
      "week7-detection-prevention",
      "week7-heightened-threat",
      "week7-session2-retrieval",
      "week7-testing-matching",
      "week7-recommendation-practice",
      "week7-ocr-question-practice",
      "week7-answer-improvement"
    ])
  });
})();
