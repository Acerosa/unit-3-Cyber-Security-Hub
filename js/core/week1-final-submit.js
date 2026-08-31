/**
 * Week 1 authoritative final-submission adapter.
 *
 * Content and formative section checks remain on Apps Script
 * (getActivity / markSection). Final evidence, identity, score and
 * progress use the shared authenticated Supabase path:
 *
 *   Unit3ActivityKeyMap → Unit3SupabaseAdapter → Unit3SupabaseSubmitRunner
 *   → api.submit_attempt
 *
 * This module does not create a second Supabase client. It does not call
 * GAS submitAttempt. Supabase failures do not downgrade to GAS.
 */
(function () {
  "use strict";

  var EXPECTED_QUESTION_COUNTS = Object.freeze({
    "u3-w01-baseline": 10,
    "u3-w01-cia": 12,
    "u3-w01-incidents": 12,
    "u3-w01-glossary": 12,
    "u3-w01-retrieval": 12,
    "u3-w01-command-words": 6,
    "u3-w01-ocr-practice": 11,
    "u3-w01-peer-improvement": 7
  });

  function keyMap() {
    return window.Unit3ActivityKeyMap || {};
  }

  function backendMode() {
    return window.Unit3BackendMode || {};
  }

  function usesSupabaseFinalSubmit() {
    var mode = backendMode();
    if (typeof mode.getSubmissionProvider === "function") {
      return mode.getSubmissionProvider() === "SUPABASE";
    }
    return Boolean(mode.isSupabase && mode.isSupabase());
  }

  function usesAppsScriptFormative() {
    var mode = backendMode();
    if (typeof mode.getFormativeProvider === "function") {
      return mode.getFormativeProvider() === "APPS_SCRIPT";
    }
    return Boolean(
      mode.isWeek1ActivityApiPage && mode.isWeek1ActivityApiPage()
    );
  }

  function collectLiveQuestions(activityPayload) {
    var questions = [];
    ((activityPayload && activityPayload.sections) || []).forEach(function (section) {
      (section.questions || []).forEach(function (question) {
        if (question && question.questionId) questions.push(question);
      });
    });
    return questions;
  }

  function assertLiveBankMatchesCatalogue(activityId, activityPayload) {
    var map = keyMap();
    var activityKey =
      typeof map.normaliseActivityKey === "function"
        ? map.normaliseActivityKey(activityId)
        : String(activityId || "").toLowerCase();
    var expected = EXPECTED_QUESTION_COUNTS[activityKey];
    if (expected == null) {
      throw new Error("UNKNOWN_ACTIVITY: " + String(activityId || ""));
    }
    var questions = collectLiveQuestions(activityPayload);
    if (questions.length !== expected) {
      throw new Error(
        "QUESTION_COUNT_MISMATCH: " +
          activityKey +
          " live " +
          questions.length +
          " expected " +
          expected
      );
    }
    var seen = {};
    questions.forEach(function (question) {
      if (typeof map.normaliseQuestionKey !== "function") {
        throw new Error("UNKNOWN_QUESTION: " + question.questionId);
      }
      var canonical = map.normaliseQuestionKey(question.questionId, activityKey);
      if (!canonical) {
        throw new Error("UNKNOWN_QUESTION: " + question.questionId);
      }
      if (seen[canonical]) {
        throw new Error("DUPLICATE_QUESTION: " + canonical);
      }
      seen[canonical] = true;
    });
    return questions;
  }

  function mapEvidence(question, value) {
    var type = question && question.questionType;
    if (type === "classification") {
      return {
        incidentType: String((value && value.incidentType) || ""),
        ciaAim: String((value && value.ciaAim) || ""),
        evidence: String((value && value.evidence) || "")
      };
    }
    if (type === "single-choice" || type === "self-assessment") {
      var optionId =
        typeof value === "string"
          ? value
          : value && (value.optionId || value.selectedOptionId || value.option_id);
      return { optionId: String(optionId || "") };
    }
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value;
    }
    return String(value == null ? "" : value);
  }

  function mapCollectedResponses(activityId, collected, questions) {
    var map = keyMap();
    var activityKey =
      typeof map.normaliseActivityKey === "function"
        ? map.normaliseActivityKey(activityId)
        : String(activityId || "").toLowerCase();
    var byId = {};
    (questions || []).forEach(function (question) {
      byId[question.questionId] = question;
    });
    var out = [];
    (collected || []).forEach(function (item) {
      if (!item || !item.questionId) return;
      var question = byId[item.questionId];
      if (!question) {
        if (typeof map.normaliseQuestionKey === "function") {
          map.normaliseQuestionKey(item.questionId, activityKey);
        }
        throw new Error("UNKNOWN_QUESTION: " + item.questionId);
      }
      var value = item.response !== undefined ? item.response : item.value;
      if (value === undefined || value === null || value === "") return;
      var responseType = question.questionType || "";
      out.push({
        questionId: item.questionId,
        response: mapEvidence(question, value),
        responseType: responseType
      });
    });
    return out;
  }

  function isSignedIn() {
    var auth = window.SupabaseAuth;
    if (auth && typeof auth.isSignedIn === "function") {
      return auth.isSignedIn() === true;
    }
    var platform = window.LearningPlatform && window.LearningPlatform.platform;
    return Boolean(
      platform && platform.auth && typeof platform.auth.isSignedIn === "function" &&
        platform.auth.isSignedIn()
    );
  }

  function learnerFacingError(error, fallback) {
    return (
      (error && (error.learnerMessage || error.message)) ||
      fallback ||
      "Your result was not saved. Check your connection and try again."
    );
  }

  function submitFinal(options) {
    options = options || {};
    if (!usesSupabaseFinalSubmit()) {
      return Promise.reject(
        new Error("Week 1 final submission is not routed to Supabase.")
      );
    }
    if (!isSignedIn()) {
      var authError = new Error(
        "Sign in to your learner account before submitting."
      );
      authError.code = "AUTHENTICATION_REQUIRED";
      authError.learnerMessage = authError.message;
      return Promise.reject(authError);
    }
    var runner = window.Unit3SupabaseSubmitRunner;
    if (!runner || typeof runner.submit !== "function") {
      return Promise.reject(
        new Error("The learner service is not available on this device. Contact your tutor.")
      );
    }
    return runner.submit({
      activityId: options.activityId,
      getResponses: options.getResponses,
      getStartedAt: options.getStartedAt,
      getCompletedAt: options.getCompletedAt,
      statusHostId: options.statusHostId || "ae-submit-status",
      buttonId: options.buttonId,
      submitLabel: options.submitLabel || "Submit your result",
      onSubmitted: options.onSubmitted,
      onError: options.onError
    });
  }

  window.Unit3Week1FinalSubmit = Object.freeze({
    EXPECTED_QUESTION_COUNTS: EXPECTED_QUESTION_COUNTS,
    usesSupabaseFinalSubmit: usesSupabaseFinalSubmit,
    usesAppsScriptFormative: usesAppsScriptFormative,
    collectLiveQuestions: collectLiveQuestions,
    assertLiveBankMatchesCatalogue: assertLiveBankMatchesCatalogue,
    mapCollectedResponses: mapCollectedResponses,
    isSignedIn: isSignedIn,
    learnerFacingError: learnerFacingError,
    submitFinal: submitFinal
  });
})();
