/**
 * Unit 3 Supabase submission adapter.
 *
 * ONE shared adapter that translates the existing Unit 3 activity result
 * shapes (Week 2–7 quiz/scenario results plus the Week 1 Activity API
 * engine results) into the api.submit_attempt RPC payload.
 *
 * The RPC signature is:
 *   api.submit_attempt(
 *     p_activity_key text,
 *     p_activity_version text,
 *     p_client_attempt_id text,
 *     p_responses jsonb,
 *     p_source_page text default null,
 *     p_started_at timestamptz default null,
 *     p_completed_at timestamptz default null,
 *     p_programming_language text default null
 *   )
 *
 * The adapter:
 *   - normalises activity keys to lower-case (Week 1 U3-W01-* -> u3-w01-*)
 *   - upgrades activity version 1.0 -> 1.0.0 via ActivityKeyMap
 *   - uppercases question stable keys (s1-q1 -> S1-Q1)
 *   - preserves heterogeneous response evidence unchanged
 *   - reuses a stable client_attempt_id across retries of the same attempt
 *   - forces p_programming_language to null (Unit 3 is not programming)
 *   - refuses to send any browser-owned learner/assignment/score identity
 */
(function () {
  "use strict";

  var STORAGE_PREFIX = "unit3.supabase.clientAttempt:";

  function keys() {
    return window.Unit3ActivityKeyMap || {};
  }

  function crypto() {
    return window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto
      : null;
  }

  function createUuid() {
    var runtimeCrypto = crypto();
    if (runtimeCrypto) {
      return runtimeCrypto.randomUUID();
    }
    return (
      "unit3-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 10) +
      "-" +
      Math.random().toString(36).slice(2, 10)
    );
  }

  function storageKey(activityKey) {
    return STORAGE_PREFIX + String(activityKey);
  }

  function readStoredAttemptId(activityKey) {
    try {
      var value =
        window.sessionStorage &&
        window.sessionStorage.getItem(storageKey(activityKey));
      return typeof value === "string" && value.trim() ? value.trim() : "";
    } catch (error) {
      return "";
    }
  }

  function writeStoredAttemptId(activityKey, attemptId) {
    try {
      window.sessionStorage.setItem(
        storageKey(activityKey),
        String(attemptId)
      );
    } catch (error) {
      /* sessionStorage may be unavailable */
    }
  }

  /**
   * Retrieve a stable client_attempt_id for the given activity. If a
   * genuine attempt is already in progress the existing UUID is returned;
   * otherwise a new UUID is created and stored. This is required so a
   * network retry of the same submission remains idempotent from the
   * backend's point of view.
   */
  function getOrCreateClientAttemptId(activityKey) {
    var backendKey = (keys().normaliseActivityKey || String)(activityKey);
    var existing = readStoredAttemptId(backendKey);
    if (existing) return existing;
    var next = createUuid();
    writeStoredAttemptId(backendKey, next);
    return next;
  }

  function clearClientAttemptId(activityKey) {
    var backendKey = (keys().normaliseActivityKey || String)(activityKey);
    try {
      window.sessionStorage.removeItem(storageKey(backendKey));
    } catch (error) {
      /* ignore */
    }
  }

  function beginNewClientAttempt(activityKey) {
    clearClientAttemptId(activityKey);
    return getOrCreateClientAttemptId(activityKey);
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function toIsoOrNull(value) {
    if (!value) return null;
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) {
      return new Date(value).toISOString();
    }
    return null;
  }

  function normaliseResponse(raw, activityKey) {
    var normaliseKey = keys().normaliseQuestionKey || String;
    if (!raw || typeof raw !== "object") {
      throw new Error("Response evidence must be an object.");
    }
    var questionKey = normaliseKey(
      raw.questionId || raw.question_id || raw.stableKey || raw.stable_key,
      activityKey
    );
    if (!questionKey) {
      throw new Error(
        "Response evidence is missing a question stable key."
      );
    }
    var evidence = raw.response;
    if (evidence === undefined) evidence = raw.response_payload;
    if (evidence === undefined) evidence = raw.value;
    if (evidence === undefined) evidence = raw.answer;
    var payload = { question_id: questionKey, response_payload: evidence };
    if (typeof raw.correct === "boolean") {
      payload.is_correct = raw.correct;
    } else if (typeof raw.is_correct === "boolean") {
      payload.is_correct = raw.is_correct;
    }
    if (isFiniteNumber(raw.score)) {
      payload.awarded_score = raw.score;
    } else if (isFiniteNumber(raw.awarded_score)) {
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
    var keyMap = keys();
    if (!result || typeof result !== "object") {
      throw new Error("A Unit 3 activity result is required.");
    }
    if (typeof keyMap.assertNoLearnerIdentity === "function") {
      keyMap.assertNoLearnerIdentity(result);
    }
    var activityKey = (keyMap.normaliseActivityKey || String)(
      result.activityId || result.activityKey || result.activity_id
    );
    if (!activityKey) {
      throw new Error("Activity key is required.");
    }
    var activityVersion = (keyMap.normaliseActivityVersion || String)(
      result.activityVersion ||
        result.activity_version ||
        result.version ||
        "1.0"
    );
    if (!activityVersion) {
      throw new Error("Activity version is required.");
    }
    var responses = Array.isArray(result.responses) ? result.responses : [];
    if (!responses.length) {
      throw new Error("At least one response is required.");
    }
    var clientAttemptId =
      typeof result.clientAttemptId === "string" && result.clientAttemptId
        ? result.clientAttemptId
        : typeof result.attemptId === "string" && result.attemptId
        ? result.attemptId
        : getOrCreateClientAttemptId(activityKey);

    var sourcePage =
      (typeof result.sourcePage === "string" && result.sourcePage) ||
      (window.location && typeof window.location.pathname === "string"
        ? window.location.pathname
        : null);

    var payload = {
      p_activity_key: activityKey,
      p_activity_version: activityVersion,
      p_client_attempt_id: clientAttemptId,
      p_responses: responses.map(function (item) {
        return normaliseResponse(item, activityKey);
      }),
      p_source_page: sourcePage || null,
      p_started_at: toIsoOrNull(result.startedAt || result.started_at),
      p_completed_at: toIsoOrNull(result.completedAt || result.completed_at),
      p_programming_language: null
    };
    writeStoredAttemptId(activityKey, clientAttemptId);
    return payload;
  }

  function submit(result) {
    var payload;
    try {
      payload = buildRpcPayload(result);
    } catch (error) {
      return Promise.reject(error);
    }
    var api = window.SupabaseLearningApi;
    if (!api || typeof api.submitAttempt !== "function") {
      return Promise.reject(
        new Error(
          "Supabase learning API is not available on this page. Ensure supabase-learning-api.js is loaded."
        )
      );
    }
    return api.submitAttempt(payload).then(
      function (submission) {
        clearClientAttemptId(payload.p_activity_key);
        return submission;
      }
      // NOTE: failures deliberately keep the stored client_attempt_id so a
      // network retry of the same attempt remains idempotent server-side.
    );
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
