/**
 * Non-sensitive attempt state for the Activity API engine.
 * Never stores learner identity fields.
 *
 * Browser storage is cache / guest fallback only. Signed-in drafts persist
 * through Core progress.createStore → api.save_activity_state.
 * Question Check must not create learning.attempts rows.
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
      'local';
    if (mode === 'session') return global.sessionStorage;
    return global.localStorage;
  }

  function getRemote(state) {
    var platform = global.LearningPlatform && global.LearningPlatform.platform;
    var progress = platform && platform.progress;
    var activityKey;
    var activityVersion;
    if (!progress || typeof progress.createStore !== 'function') return null;
    if (!platform.auth || typeof platform.auth.isSignedIn !== 'function' || !platform.auth.isSignedIn()) {
      return null;
    }
    activityKey = state && (state.activityKey || state.activityId);
    activityVersion = state && state.activityVersion;
    if (global.Unit3ActivityKeyMap && typeof global.Unit3ActivityKeyMap.normaliseActivityKey === 'function' && activityKey) {
      activityKey = global.Unit3ActivityKeyMap.normaliseActivityKey(activityKey);
    }
    if (global.Unit3ActivityKeyMap && typeof global.Unit3ActivityKeyMap.normaliseActivityVersion === 'function') {
      activityVersion = global.Unit3ActivityKeyMap.normaliseActivityVersion(activityVersion, activityKey);
    }
    if (!activityKey || !activityVersion) return null;
    try {
      return progress.createStore({
        activityKey: activityKey,
        activityVersion: activityVersion,
        storage: global.localStorage,
        legacyKeys: [storageKey(state.activityId)]
      });
    } catch (err) {
      return null;
    }
  }

  function emptyState(activityId) {
    return {
      activityId: activityId,
      attemptId: createAttemptId(),
      startedAt: Date.now(),
      responses: {},
      checked: {},
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
        activityKey: parsed.activityKey || activityId,
        activityVersion: parsed.activityVersion || null,
        attemptId: parsed.attemptId,
        startedAt: Number(parsed.startedAt) || Date.now(),
        responses: parsed.responses || {},
        checked: parsed.checked || {},
        markedSections: parsed.markedSections || {},
        invalidatedSections: parsed.invalidatedSections || {},
        finalSubmission: parsed.finalSubmission || null
      };
    } catch (err) {
      return emptyState(activityId);
    }
  }

  function persistPayload(state) {
    return {
      activityId: state.activityId,
      activityKey: state.activityKey || state.activityId,
      activityVersion: state.activityVersion || null,
      attemptId: state.attemptId,
      startedAt: state.startedAt,
      responses: state.responses || {},
      checked: state.checked || {},
      markedSections: state.markedSections || {},
      invalidatedSections: state.invalidatedSections || {},
      finalSubmission: state.finalSubmission || null,
      completed: false
    };
  }

  function save(state, options) {
    if (!state || !state.activityId) return;
    var payload = persistPayload(state);
    try {
      getStore().setItem(storageKey(state.activityId), JSON.stringify(payload));
    } catch (err) {
      /* storage may be unavailable */
    }
    if (payload.finalSubmission) return;
    var remote = getRemote(payload);
    if (remote && typeof remote.save === 'function') {
      try { remote.save(payload, options || {}); } catch (err) { /* keep local cache */ }
    }
  }

  function hydrate(state) {
    var remote = getRemote(state);
    if (!remote || typeof remote.hydrate !== 'function') {
      return Promise.resolve(state);
    }
    return remote.hydrate(state).then(function (resolved) {
      if (!resolved) return state;
      var next = {
        activityId: state.activityId,
        activityKey: state.activityKey || resolved.activityKey,
        activityVersion: state.activityVersion || resolved.activityVersion,
        attemptId: resolved.attemptId || state.attemptId,
        startedAt: resolved.startedAt || state.startedAt,
        responses: resolved.responses || {},
        checked: resolved.checked || {},
        markedSections: resolved.markedSections || {},
        invalidatedSections: resolved.invalidatedSections || {},
        finalSubmission: resolved.finalSubmission || null
      };
      save(next, { remote: false });
      return next;
    }).catch(function () {
      return state;
    });
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
    state.checked = state.checked || {};
    state.checked[questionId] = false;
    save(state);
  }

  function setChecked(state, questionId, value) {
    state.checked = state.checked || {};
    state.checked[questionId] = Boolean(value);
    save(state, { immediate: true });
  }

  function setMarkedSection(state, sectionId, markData) {
    state.markedSections[sectionId] = markData;
    if (state.invalidatedSections) {
      delete state.invalidatedSections[sectionId];
    }
    save(state, { immediate: true });
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
    save(state, { remote: false });
  }

  function completionTimeSeconds(state) {
    var seconds = Math.floor((Date.now() - (state.startedAt || Date.now())) / 1000);
    return Math.max(1, Math.min(7200, seconds || 1));
  }

  function beginNewAttempt(activityId) {
    var previous = load(activityId);
    var remote = getRemote(previous);
    clear(activityId);
    if (remote && typeof remote.clear === 'function') {
      try { remote.clear({ local: false }); } catch (err) {}
    }
    var state = emptyState(activityId);
    state.activityVersion = previous.activityVersion || null;
    state.activityKey = previous.activityKey || activityId;
    save(state);
    return state;
  }

  global.Unit3ActivityState = {
    storageKey: storageKey,
    createAttemptId: createAttemptId,
    load: load,
    save: save,
    hydrate: hydrate,
    clear: clear,
    setResponse: setResponse,
    setChecked: setChecked,
    setMarkedSection: setMarkedSection,
    invalidateSection: invalidateSection,
    setFinalSubmission: setFinalSubmission,
    completionTimeSeconds: completionTimeSeconds,
    beginNewAttempt: beginNewAttempt
  };
})(window);
