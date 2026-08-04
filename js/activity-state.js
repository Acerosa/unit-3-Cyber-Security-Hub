/**
 * Non-sensitive attempt state for the Activity API engine.
 * Never stores learner identity fields.
 */

(function (global) {
  'use strict';

  var configModule = global.Unit3ActivityEngineConfig || {};

  function storageKey(activityId) {
    return 'unit3-activity-api-state:' + activityId;
  }

  function createAttemptId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return (
      'attempt-' +
      Date.now().toString(36) +
      '-' +
      Math.random().toString(36).slice(2, 10)
    );
  }

  function getStore() {
    var mode =
      (configModule.ACTIVITY_ENGINE_CONFIG &&
        configModule.ACTIVITY_ENGINE_CONFIG.stateStorage) ||
      'session';
    return mode === 'local' ? global.localStorage : global.sessionStorage;
  }

  function emptyState(activityId) {
    return {
      activityId: activityId,
      attemptId: createAttemptId(),
      startedAt: Date.now(),
      responses: {},
      markedSections: {},
      invalidatedSections: {},
      finalSubmission: null
    };
  }

  function load(activityId) {
    try {
      var raw = getStore().getItem(storageKey(activityId));
      if (!raw) return emptyState(activityId);
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.activityId !== activityId || !parsed.attemptId) {
        return emptyState(activityId);
      }
      return {
        activityId: activityId,
        attemptId: parsed.attemptId,
        startedAt: Number(parsed.startedAt) || Date.now(),
        responses: parsed.responses || {},
        markedSections: parsed.markedSections || {},
        invalidatedSections: parsed.invalidatedSections || {},
        finalSubmission: parsed.finalSubmission || null
      };
    } catch (err) {
      return emptyState(activityId);
    }
  }

  function save(state) {
    if (!state || !state.activityId) return;
    var payload = {
      activityId: state.activityId,
      attemptId: state.attemptId,
      startedAt: state.startedAt,
      responses: state.responses || {},
      markedSections: state.markedSections || {},
      invalidatedSections: state.invalidatedSections || {},
      finalSubmission: state.finalSubmission || null
    };
    try {
      getStore().setItem(storageKey(state.activityId), JSON.stringify(payload));
    } catch (err) {
      /* storage may be unavailable */
    }
  }

  function clear(activityId) {
    try {
      getStore().removeItem(storageKey(activityId));
    } catch (err) {
      /* ignore */
    }
  }

  function setResponse(state, questionId, value) {
    state.responses[questionId] = value;
    save(state);
  }

  function setMarkedSection(state, sectionId, markData) {
    state.markedSections[sectionId] = markData;
    if (state.invalidatedSections) {
      delete state.invalidatedSections[sectionId];
    }
    save(state);
  }

  function invalidateSection(state, sectionId) {
    if (state.markedSections && state.markedSections[sectionId]) {
      delete state.markedSections[sectionId];
    }
    state.invalidatedSections = state.invalidatedSections || {};
    state.invalidatedSections[sectionId] = true;
    save(state);
  }

  function setFinalSubmission(state, submissionData) {
    state.finalSubmission = submissionData;
    save(state);
  }

  function completionTimeSeconds(state) {
    var seconds = Math.floor((Date.now() - (state.startedAt || Date.now())) / 1000);
    return Math.max(1, Math.min(7200, seconds || 1));
  }

  function beginNewAttempt(activityId) {
    clear(activityId);
    var state = emptyState(activityId);
    save(state);
    return state;
  }

  global.Unit3ActivityState = {
    storageKey: storageKey,
    createAttemptId: createAttemptId,
    load: load,
    save: save,
    clear: clear,
    setResponse: setResponse,
    setMarkedSection: setMarkedSection,
    invalidateSection: invalidateSection,
    setFinalSubmission: setFinalSubmission,
    completionTimeSeconds: completionTimeSeconds,
    beginNewAttempt: beginNewAttempt
  };
})(window);
