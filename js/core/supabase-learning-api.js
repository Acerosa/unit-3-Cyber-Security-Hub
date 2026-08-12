/**
 * Unit 3 learner API compatibility adapter.
 *
 * Core owns Auth, profile, enrolment, assignment and progress reads. The
 * scored-evidence RPC remains a hub adapter because submission contract 0.1.0
 * still expects client-marked awarded_score/is_correct fields.
 */
(function () {
  "use strict";

  var config = window.SUPABASE_CONFIG || {};
  var platform = window.LearningPlatform && window.LearningPlatform.platform;
  var client = platform && platform.client;
  var auth = platform && platform.auth;

  if (!client || !auth) {
    throw new Error("LEARNING_PLATFORM_API_UNAVAILABLE");
  }

  var LEARNER_MESSAGES = Object.freeze({
    AUTH_REQUIRED: "Sign in to your learner account before submitting or viewing progress.",
    AUTHENTICATION_REQUIRED: "Sign in to your learner account before submitting or viewing progress.",
    PERMISSION_DENIED: "Your account does not have permission to submit this activity.",
    UNKNOWN_ACTIVITY: "This activity is not recognised by the learner service. Contact your tutor.",
    INVALID_ACTIVITY_VERSION: "This activity version is not published for learner submission.",
    VERSION_MISMATCH: "This activity version is out of date. Refresh the page and try again.",
    ACTIVITY_NOT_ASSIGNED: "This activity is not assigned to you. Contact your tutor.",
    ASSIGNMENT_NOT_FOUND: "This activity is not assigned to you. Contact your tutor.",
    ACTIVITY_ASSIGNMENT_AMBIGUOUS: "This activity has conflicting assignments. Contact your tutor.",
    ATTEMPT_ID_CONFLICT: "This attempt was already submitted with different answers. Start a new attempt.",
    CLIENT_ATTEMPT_ID_CONFLICT: "This attempt was already submitted with different answers. Start a new attempt.",
    INVALID_RESPONSE_SCORE: "One or more answers could not be accepted. Check your responses and try again.",
    INCONSISTENT_CLIENT_MARK: "The learner service could not verify this marked response.",
    UNKNOWN_QUESTION: "One or more questions are not recognised by the learner service.",
    NETWORK_ERROR: "The learner service could not be reached. Your completed work remains saved on this device.",
    INVALID_RESPONSE: "The learner service returned an unexpected response.",
    VALIDATION_FAILED: "The submission was rejected before it was sent."
  });

  function SupabaseLearningError(code, message) {
    this.name = "SupabaseLearningError";
    this.code = code || "SERVER_ERROR";
    this.learnerMessage = LEARNER_MESSAGES[this.code] ||
      "Something went wrong. Try again or contact your tutor.";
    this.message = message || this.learnerMessage;
  }

  SupabaseLearningError.prototype = Object.create(Error.prototype);
  SupabaseLearningError.prototype.constructor = SupabaseLearningError;

  function mappedError(error) {
    var sourceCode = error && error.code ? String(error.code) : "";
    var sourceMessage = error && error.message ? String(error.message) : "";
    var known = Object.keys(LEARNER_MESSAGES).find(function (code) {
      return sourceCode === code || sourceMessage.indexOf(code) !== -1;
    });
    if (known) return new SupabaseLearningError(known, sourceMessage);
    if (sourceCode === "23505") {
      return new SupabaseLearningError("ATTEMPT_ID_CONFLICT", sourceMessage);
    }
    if (sourceCode === "42501") {
      return new SupabaseLearningError("PERMISSION_DENIED", sourceMessage);
    }
    return new SupabaseLearningError(sourceCode || "SERVER_ERROR", sourceMessage);
  }

  function enabledActivities() {
    return Array.isArray(config.enabledActivities)
      ? Array.from(config.enabledActivities)
      : [];
  }

  function isEnabledFor(activityKey) {
    return typeof activityKey === "string" &&
      enabledActivities().indexOf(activityKey) !== -1;
  }

  function canSubmit(payload) {
    var activityKey = payload &&
      (payload.p_activity_key || payload.activityKey || payload.activityId);
    return Boolean(auth.isSignedIn() && isEnabledFor(activityKey));
  }

  function safeSubmission(payload) {
    var row = Array.isArray(payload) ? payload[0] : payload;
    if (
      !row ||
      typeof row.client_attempt_id !== "string" ||
      typeof row.activity_key !== "string" ||
      !Number.isInteger(row.attempt_number) ||
      typeof row.score !== "number" ||
      typeof row.max_score !== "number" ||
      typeof row.received_at !== "string" ||
      typeof row.idempotent !== "boolean"
    ) {
      throw new SupabaseLearningError("INVALID_RESPONSE");
    }
    return {
      attemptId: row.client_attempt_id,
      activityKey: row.activity_key,
      activityId: row.activity_key,
      attemptNumber: row.attempt_number,
      score: row.score,
      maxScore: row.max_score,
      percentage: row.max_score > 0
        ? Math.round((row.score / row.max_score) * 10000) / 100
        : 0,
      status: "completed",
      submittedAt: row.received_at,
      duplicate: row.idempotent,
      markingSource: row.marking_source || null,
      evidenceLevel: row.evidence_level || null
    };
  }

  function submitAttempt(payload) {
    if (!canSubmit(payload)) {
      return Promise.reject(new SupabaseLearningError("AUTHENTICATION_REQUIRED"));
    }
    return client.schema("api").rpc("submit_attempt", payload)
      .then(function (result) {
        if (result.error) throw result.error;
        return safeSubmission(result.data);
      })
      .catch(function (error) {
        if (error && error.name === "SupabaseLearningError") throw error;
        throw mappedError(error);
      });
  }

  function getCurriculumWeeks() {
    return client.schema("api")
      .from("curriculum_weeks")
      .select("*")
      .order("week_number", { ascending: true })
      .then(function (result) {
        if (result.error) throw mappedError(result.error);
        return result.data || [];
      });
  }

  window.SupabaseLearningApi = Object.freeze({
    isEnabledFor: isEnabledFor,
    canSubmit: canSubmit,
    submitAttempt: submitAttempt,
    getMyProfile: function () {
      return platform.profile.getProfile().then(function (row) {
        return row ? [row] : [];
      });
    },
    getMyEnrolments: platform.enrolment.getEnrolments,
    getRegistrationOptions: platform.api.getRegistrationOptions,
    completeLearnerOnboarding: platform.api.completeOnboarding,
    getMyAssignments: platform.assignment.getAssignments,
    getMyActivityDelivery: platform.assignment.getCurriculumDelivery,
    getCurriculumWeeks: getCurriculumWeeks,
    getMyAttempts: platform.progress.getAttempts,
    getMyResponses: platform.progress.getResponses,
    getMyActivityProgress: platform.progress.getProgress,
    LEARNER_MESSAGES: LEARNER_MESSAGES,
    Error: SupabaseLearningError
  });
})();
