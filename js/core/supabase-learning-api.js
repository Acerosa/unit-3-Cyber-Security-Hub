/**
 * Unit 3 Supabase learning API.
 *
 * Thin, browser-safe wrapper around the api schema:
 *   api.my_profile
 *   api.my_enrolments
 *   api.my_assignments
 *   api.my_activity_delivery
 *   api.curriculum_weeks
 *   api.my_attempts
 *   api.my_responses
 *   api.my_activity_progress
 *   api.submit_attempt (RPC)
 *
 * The learner never sends student, group, assignment, score or attempt
 * identity. Identity is derived server-side from auth.uid().
 *
 * Learner-facing error codes are mapped to safe, learner-friendly
 * messages. Raw database internals are never surfaced in the message,
 * but the original code is preserved for the development console.
 */
(function () {
  "use strict";

  var config = window.SUPABASE_CONFIG || {};
  var client = window.SupabaseClient;
  var auth = window.SupabaseAuth;

  var LEARNER_MESSAGES = Object.freeze({
    AUTH_REQUIRED:
      "Sign in to your learner account before submitting or viewing progress.",
    AUTHENTICATION_REQUIRED:
      "Sign in to your learner account before submitting or viewing progress.",
    PERMISSION_DENIED:
      "Your account does not have permission to submit this activity.",
    UNKNOWN_ACTIVITY:
      "This activity is not recognised by the learner service. Contact your tutor.",
    VERSION_MISMATCH:
      "This activity version is out of date. Refresh the page and try again.",
    ASSIGNMENT_NOT_FOUND:
      "This activity is not assigned to you. Contact your tutor if you were expecting it.",
    ATTEMPT_ID_CONFLICT:
      "This attempt was already submitted with different answers. Start a new attempt if your tutor asks you to.",
    CLIENT_ATTEMPT_ID_CONFLICT:
      "This attempt was already submitted with different answers. Start a new attempt if your tutor asks you to.",
    INVALID_RESPONSE_SCORE:
      "One or more answers could not be accepted. Check your responses and try again.",
    UNKNOWN_QUESTION:
      "One or more questions are not recognised by the learner service. Refresh the page and try again.",
    NETWORK_ERROR:
      "The learner service could not be reached. Your completed work remains saved on this device.",
    CONFIGURATION_ERROR:
      "The learner service is misconfigured on this device. Contact your tutor.",
    INVALID_RESPONSE:
      "The learner service returned an unexpected response. Try again in a moment.",
    VALIDATION_FAILED:
      "The submission was rejected before it was sent. Refresh the page and try again.",
    INVALID_FIRST_NAME: "Enter your first name.",
    INVALID_SURNAME: "Enter your surname.",
    INVALID_STUDENT_NUMBER: "Enter your Student ID.",
    INVALID_REGISTRATION_OPTION: "Choose an available year and group.",
    GROUP_INACTIVE: "That group is no longer accepting registrations.",
    ACADEMIC_YEAR_INACTIVE:
      "That academic year is no longer accepting registrations.",
    STUDENT_NUMBER_ALREADY_LINKED:
      "That Student ID is already linked to another account. Contact your tutor.",
    AUTH_ACCOUNT_ALREADY_LINKED:
      "This account is already linked to a different learner profile.",
    ONBOARDING_CONFLICT:
      "These details do not match the learner record. Contact your tutor."
  });

  function SupabaseLearningError(code, message) {
    this.name = "SupabaseLearningError";
    this.code = code || "SERVER_ERROR";
    this.learnerMessage =
      LEARNER_MESSAGES[this.code] ||
      "Something went wrong. Try again or contact your tutor.";
    this.message = message || this.learnerMessage;
  }

  SupabaseLearningError.prototype = Object.create(Error.prototype);
  SupabaseLearningError.prototype.constructor = SupabaseLearningError;

  function mappedError(error) {
    var sourceCode = error && error.code ? String(error.code) : "";
    var sourceMessage = error && error.message ? String(error.message) : "";
    if (
      sourceMessage.indexOf("CLIENT_ATTEMPT_ID_CONFLICT") !== -1 ||
      sourceCode === "23505"
    ) {
      return new SupabaseLearningError(
        "ATTEMPT_ID_CONFLICT",
        sourceMessage || undefined
      );
    }
    if (sourceMessage.indexOf("UNKNOWN_ACTIVITY") !== -1) {
      return new SupabaseLearningError("UNKNOWN_ACTIVITY", sourceMessage);
    }
    if (sourceMessage.indexOf("VERSION_MISMATCH") !== -1) {
      return new SupabaseLearningError("VERSION_MISMATCH", sourceMessage);
    }
    if (sourceMessage.indexOf("ASSIGNMENT_NOT_FOUND") !== -1) {
      return new SupabaseLearningError("ASSIGNMENT_NOT_FOUND", sourceMessage);
    }
    if (sourceMessage.indexOf("UNKNOWN_QUESTION") !== -1) {
      return new SupabaseLearningError("UNKNOWN_QUESTION", sourceMessage);
    }
    if (sourceMessage.indexOf("INVALID_RESPONSE_SCORE") !== -1) {
      return new SupabaseLearningError(
        "INVALID_RESPONSE_SCORE",
        sourceMessage
      );
    }
    if (
      sourceCode === "42501" ||
      sourceCode === "AUTHENTICATION_REQUIRED" ||
      sourceMessage.indexOf("AUTH_REQUIRED") !== -1
    ) {
      return new SupabaseLearningError("PERMISSION_DENIED", sourceMessage);
    }
    if (sourceCode === "NETWORK_ERROR") {
      return new SupabaseLearningError("NETWORK_ERROR", sourceMessage);
    }
    return new SupabaseLearningError(
      sourceCode || "SERVER_ERROR",
      sourceMessage || undefined
    );
  }

  function enabledActivities() {
    return Array.isArray(config.enabledActivities)
      ? Array.from(config.enabledActivities)
      : [];
  }

  function isEnabledFor(activityKey) {
    return (
      typeof activityKey === "string" &&
      enabledActivities().indexOf(activityKey) !== -1
    );
  }

  function isAuthenticated() {
    if (auth && typeof auth.isAuthenticated === "function") {
      return auth.isAuthenticated();
    }
    return Boolean(client && client.hasSession && client.hasSession());
  }

  function canSubmit(payload) {
    return Boolean(
      client &&
        client.isConfigured() &&
        isAuthenticated() &&
        payload &&
        isEnabledFor(payload.p_activity_key)
    );
  }

  function isValidPayload(payload) {
    if (!payload || typeof payload !== "object") return false;
    if (
      typeof payload.p_activity_key !== "string" ||
      !payload.p_activity_key.trim()
    ) {
      return false;
    }
    if (
      typeof payload.p_activity_version !== "string" ||
      !payload.p_activity_version.trim()
    ) {
      return false;
    }
    if (
      typeof payload.p_client_attempt_id !== "string" ||
      !payload.p_client_attempt_id.trim()
    ) {
      return false;
    }
    if (!Array.isArray(payload.p_responses)) return false;
    return true;
  }

  function safeSubmission(payload) {
    var row = Array.isArray(payload) ? payload[0] : payload;
    var valid =
      row &&
      typeof row.client_attempt_id === "string" &&
      row.client_attempt_id &&
      typeof row.activity_key === "string" &&
      row.activity_key &&
      Number.isInteger(row.attempt_number) &&
      typeof row.score === "number" &&
      typeof row.max_score === "number" &&
      typeof row.received_at === "string" &&
      typeof row.idempotent === "boolean";
    if (!valid) {
      throw new SupabaseLearningError("INVALID_RESPONSE");
    }
    return {
      attemptId: row.client_attempt_id,
      activityKey: row.activity_key,
      attemptNumber: row.attempt_number,
      score: row.score,
      maxScore: row.max_score,
      percentage:
        row.max_score > 0
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
    if (!isValidPayload(payload)) {
      return Promise.reject(new SupabaseLearningError("VALIDATION_FAILED"));
    }
    if (!canSubmit(payload)) {
      return Promise.reject(new SupabaseLearningError("AUTHENTICATION_REQUIRED"));
    }
    return client
      .request("/rest/v1/rpc/submit_attempt", {
        method: "POST",
        schema: "api",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then(safeSubmission)
      .catch(function (error) {
        if (error && error.name === "SupabaseLearningError") {
          throw error;
        }
        throw mappedError(error);
      });
  }

  function requireSession() {
    if (!isAuthenticated()) {
      return Promise.reject(new SupabaseLearningError("AUTHENTICATION_REQUIRED"));
    }
    return Promise.resolve();
  }

  function requireSignedInSession() {
    var signedIn = auth && typeof auth.isSignedIn === "function"
      ? auth.isSignedIn()
      : Boolean(client && client.hasSession && client.hasSession());
    if (!signedIn) {
      return Promise.reject(new SupabaseLearningError("AUTH_REQUIRED"));
    }
    return Promise.resolve();
  }

  function onboardingError(error) {
    var sourceCode = error && error.code ? String(error.code) : "";
    var sourceMessage = error && error.message ? String(error.message) : "";
    var codes = [
      "INVALID_FIRST_NAME",
      "INVALID_SURNAME",
      "INVALID_STUDENT_NUMBER",
      "INVALID_REGISTRATION_OPTION",
      "GROUP_INACTIVE",
      "ACADEMIC_YEAR_INACTIVE",
      "STUDENT_NUMBER_ALREADY_LINKED",
      "AUTH_ACCOUNT_ALREADY_LINKED",
      "ONBOARDING_CONFLICT",
      "AUTH_REQUIRED"
    ];
    var matched = codes.find(function (code) {
      return sourceCode === code || sourceMessage.indexOf(code) !== -1;
    });
    if (matched) return new SupabaseLearningError(matched, sourceMessage);
    return mappedError(error);
  }

  function getRegistrationOptions() {
    return requireSignedInSession().then(function () {
      return client.request("/rest/v1/rpc/registration_options", {
        method: "POST",
        schema: "api",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      });
    }).catch(function (error) {
      throw onboardingError(error);
    });
  }

  function completeLearnerOnboarding(details) {
    return requireSignedInSession().then(function () {
      return client.request("/rest/v1/rpc/complete_learner_onboarding", {
        method: "POST",
        schema: "api",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details)
      });
    }).catch(function (error) {
      throw onboardingError(error);
    });
  }

  function getMyProfile() {
    return requireSession().then(function () {
      return client.request(
        "/rest/v1/my_profile?select=*&limit=1",
        { schema: "api" }
      );
    });
  }

  function getMyEnrolments() {
    return requireSession().then(function () {
      return client.request(
        "/rest/v1/my_enrolments?select=*&order=joined_on.asc",
        { schema: "api" }
      );
    });
  }

  function getMyAssignments() {
    return requireSession().then(function () {
      return client.request(
        "/rest/v1/my_assignments?select=*&order=activity_key.asc",
        { schema: "api" }
      );
    });
  }

  function getMyActivityDelivery() {
    return requireSession().then(function () {
      return client.request(
        "/rest/v1/my_activity_delivery?select=*&order=week_number.asc,session_number.asc,sort_order.asc",
        { schema: "api" }
      );
    });
  }

  function getCurriculumWeeks() {
    return requireSession().then(function () {
      return client.request(
        "/rest/v1/curriculum_weeks?select=*&order=week_number.asc",
        { schema: "api" }
      );
    });
  }

  function getMyAttempts(activityKey) {
    return requireSession().then(function () {
      var path =
        "/rest/v1/my_attempts?select=*&order=received_at.desc";
      if (typeof activityKey === "string" && activityKey.trim()) {
        path +=
          "&activity_key=eq." + encodeURIComponent(activityKey.trim());
      }
      return client.request(path, { schema: "api" });
    });
  }

  function getMyResponses(activityKey) {
    return requireSession().then(function () {
      var path =
        "/rest/v1/my_responses?select=*&order=received_at.desc";
      if (typeof activityKey === "string" && activityKey.trim()) {
        path +=
          "&activity_key=eq." + encodeURIComponent(activityKey.trim());
      }
      return client.request(path, { schema: "api" });
    });
  }

  function getMyActivityProgress(activityKey) {
    return requireSession().then(function () {
      var path = "/rest/v1/my_activity_progress?select=*";
      if (typeof activityKey === "string" && activityKey.trim()) {
        path +=
          "&activity_key=eq." + encodeURIComponent(activityKey.trim());
      }
      return client.request(path, { schema: "api" });
    });
  }

  window.SupabaseLearningApi = Object.freeze({
    isEnabledFor: isEnabledFor,
    canSubmit: canSubmit,
    submitAttempt: submitAttempt,
    getMyProfile: getMyProfile,
    getMyEnrolments: getMyEnrolments,
    getRegistrationOptions: getRegistrationOptions,
    completeLearnerOnboarding: completeLearnerOnboarding,
    getMyAssignments: getMyAssignments,
    getMyActivityDelivery: getMyActivityDelivery,
    getCurriculumWeeks: getCurriculumWeeks,
    getMyAttempts: getMyAttempts,
    getMyResponses: getMyResponses,
    getMyActivityProgress: getMyActivityProgress,
    LEARNER_MESSAGES: LEARNER_MESSAGES,
    Error: SupabaseLearningError
  });
})();
