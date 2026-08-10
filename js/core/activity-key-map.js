/**
 * Deterministic Unit 3 activity/version/question key normalisation.
 *
 * The legacy frontend uses:
 *   - upper-case activity IDs for Week 1 (U3-W01-BASELINE etc.)
 *   - lower-case activity IDs for Weeks 2–5 (week2-session1-retrieval etc.)
 *   - lower-case question IDs everywhere (s1-q1, tv-q1, sort-01 …)
 *   - activity version "1.0"
 *
 * The Unit 3 Supabase catalogue stores:
 *   - lower-case activity stable keys (u3-w01-baseline etc.)
 *   - upper-case question stable keys (S1-Q1, TV-Q1, SORT-01 …)
 *   - activity version "1.0.0"
 *
 * This module is the single source of truth for both directions.
 * Never scatter this logic across week scripts.
 */
(function () {
  "use strict";

  function config() {
    return window.SUPABASE_CONFIG || {};
  }

  function trim(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function normaliseActivityKey(activityId) {
    var raw = trim(activityId);
    if (!raw) return "";
    return raw.toLowerCase();
  }

  function normaliseQuestionKey(questionId, activityKey) {
    var raw = trim(questionId);
    if (!raw) return "";
    var aliases = window.Unit3QuestionKeyAliases;
    if (aliases && typeof aliases.resolve === "function") {
      var aliased = aliases.resolve(
        typeof activityKey === "string" ? activityKey : "",
        raw
      );
      if (aliased) return aliased;
    }
    return raw.toUpperCase();
  }

  function normaliseActivityVersion(version) {
    var raw = trim(version);
    if (!raw) return "";
    var aliases = config().activityVersionAliases || {};
    if (
      Object.prototype.hasOwnProperty.call(aliases, raw) &&
      typeof aliases[raw] === "string" &&
      aliases[raw].trim()
    ) {
      return aliases[raw].trim();
    }
    return raw;
  }

  /*
   * Validate the shape of a Unit 3 canonical activity result before it
   * reaches the submission adapter. Rejects payloads that would leak a
   * browser-owned learner identity or authoritative score, and payloads
   * whose activityId/version are missing.
   */
  var FORBIDDEN_FIELDS = Object.freeze([
    "studentId",
    "student_id",
    "learnerId",
    "learner_id",
    "enrolmentId",
    "enrolment_id",
    "assignmentId",
    "assignment_id",
    "attemptNumber",
    "attempt_number",
    "maximumScore",
    "max_score",
    "authoritativeScore",
    "serverTimestamp",
    "server_timestamp"
  ]);

  function assertNoLearnerIdentity(payload) {
    if (!payload || typeof payload !== "object") return;
    for (var i = 0; i < FORBIDDEN_FIELDS.length; i += 1) {
      var key = FORBIDDEN_FIELDS[i];
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        throw new Error(
          "Unit 3 Supabase payload must not include " + key + "."
        );
      }
    }
  }

  window.Unit3ActivityKeyMap = Object.freeze({
    normaliseActivityKey: normaliseActivityKey,
    normaliseQuestionKey: normaliseQuestionKey,
    normaliseActivityVersion: normaliseActivityVersion,
    assertNoLearnerIdentity: assertNoLearnerIdentity,
    FORBIDDEN_FIELDS: FORBIDDEN_FIELDS
  });
})();
