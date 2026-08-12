/**
 * Unit 3 scored-evidence adapter.
 *
 * Core owns attempt identity and secure top-level submission fields. This
 * adapter retains only Cyber-specific activity/question key normalisation and
 * contract 0.1.0 client-mark evidence fields.
 */
(function () {
  "use strict";

  var STORAGE_PREFIX = "learning-platform.attempt.v1:";

  function keyMap() {
    return window.Unit3ActivityKeyMap || {};
  }

  function submissionService() {
    return window.LearningPlatform &&
      window.LearningPlatform.platform &&
      window.LearningPlatform.platform.submission;
  }

  function normaliseActivityKey(value) {
    var normalise = keyMap().normaliseActivityKey || String;
    return normalise(value);
  }

  function storageKey(activityKey) {
    return STORAGE_PREFIX + encodeURIComponent(normaliseActivityKey(activityKey));
  }

  function getOrCreateClientAttemptId(activityKey) {
    var service = submissionService();
    if (!service) throw new Error("LEARNING_PLATFORM_SUBMISSION_UNAVAILABLE");
    return service.getAttemptId(normaliseActivityKey(activityKey));
  }

  function clearClientAttemptId(activityKey) {
    try {
      window.sessionStorage.removeItem(storageKey(activityKey));
    } catch (error) {
      /* sessionStorage may be unavailable */
    }
  }

  function beginNewClientAttempt(activityKey) {
    var service = submissionService();
    if (!service) throw new Error("LEARNING_PLATFORM_SUBMISSION_UNAVAILABLE");
    return service.beginAttempt(normaliseActivityKey(activityKey));
  }

  function finite(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function timestamp(value) {
    if (!value) return null;
    var date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  function normaliseResponse(raw, activityKey) {
    var normaliseQuestion = keyMap().normaliseQuestionKey || String;
    if (!raw || typeof raw !== "object") {
      throw new Error("Response evidence must be an object.");
    }
    var questionKey = normaliseQuestion(
      raw.questionId || raw.question_id || raw.stableKey || raw.stable_key,
      activityKey
    );
    if (!questionKey) {
      throw new Error("Response evidence is missing a question stable key.");
    }
    var evidence = raw.response;
    if (evidence === undefined) evidence = raw.response_payload;
    if (evidence === undefined) evidence = raw.value;
    if (evidence === undefined) evidence = raw.answer;
    var payload = {
      question_id: questionKey,
      response_payload: evidence
    };
    if (typeof raw.correct === "boolean") payload.is_correct = raw.correct;
    else if (typeof raw.is_correct === "boolean") {
      payload.is_correct = raw.is_correct;
    }
    if (finite(raw.score)) payload.awarded_score = raw.score;
    else if (finite(raw.awarded_score)) {
      payload.awarded_score = raw.awarded_score;
    }
    if (typeof raw.responseType === "string" && raw.responseType) {
      payload.response_type = raw.responseType;
    } else if (typeof raw.response_type === "string" && raw.response_type) {
      payload.response_type = raw.response_type;
    }
    if (typeof raw.chosenIndex === "number") {
      payload.chosen_index = raw.chosenIndex;
    }
    return payload;
  }

  function buildRpcPayload(result) {
    if (!result || typeof result !== "object") {
      throw new Error("A Unit 3 activity result is required.");
    }
    if (typeof keyMap().assertNoLearnerIdentity === "function") {
      keyMap().assertNoLearnerIdentity(result);
    }
    var activityKey = normaliseActivityKey(
      result.activityId || result.activityKey || result.activity_id
    );
    var normaliseVersion = keyMap().normaliseActivityVersion || String;
    var activityVersion = normaliseVersion(
      result.activityVersion || result.activity_version || result.version || "1.0"
    );
    var responses = Array.isArray(result.responses) ? result.responses : [];
    if (!activityKey || !activityVersion || responses.length === 0) {
      throw new Error("Activity key, version and response evidence are required.");
    }
    return {
      p_activity_key: activityKey,
      p_activity_version: activityVersion,
      p_client_attempt_id: result.clientAttemptId || result.attemptId ||
        getOrCreateClientAttemptId(activityKey),
      p_responses: responses.map(function (response) {
        return normaliseResponse(response, activityKey);
      }),
      p_source_page: typeof result.sourcePage === "string"
        ? result.sourcePage.split(/[?#]/, 1)[0]
        : window.location.pathname,
      p_started_at: timestamp(result.startedAt || result.started_at),
      p_completed_at: timestamp(result.completedAt || result.completed_at),
      p_programming_language: null
    };
  }

  function submit(result) {
    var payload;
    try {
      payload = buildRpcPayload(result);
    } catch (error) {
      return Promise.reject(error);
    }
    return window.SupabaseLearningApi.submitAttempt(payload).then(function (value) {
      clearClientAttemptId(payload.p_activity_key);
      return value;
    });
  }

  window.Unit3SupabaseAdapter = Object.freeze({
    buildRpcPayload: buildRpcPayload,
    normaliseResponse: normaliseResponse,
    submit: submit,
    getOrCreateClientAttemptId: getOrCreateClientAttemptId,
    beginNewClientAttempt: beginNewClientAttempt,
    clearClientAttemptId: clearClientAttemptId,
    STORAGE_PREFIX: STORAGE_PREFIX
  });
})();
