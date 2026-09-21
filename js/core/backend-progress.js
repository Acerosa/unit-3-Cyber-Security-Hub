/**
 * Reconciles week-local draft state with backend-authoritative completion.
 *
 * Local stores remain available for drafts and immediate continuity. In
 * Supabase mode only completed attempts returned by Core progress services are
 * presented as authoritative completion.
 */
(function () {
  "use strict";

  var rows = null;
  var wrapped = [];
  var reconcilePromise = null;
  var reconciledUserId = null;
  var hydratedWeeks = Object.create(null);

  function isSharedBackend() {
    return Boolean(
      window.Unit3BackendMode &&
      window.Unit3BackendMode.isSupabase &&
      window.Unit3BackendMode.isSupabase()
    );
  }

  function normalise(activityId) {
    var keys = window.Unit3ActivityKeyMap;
    return keys && keys.normaliseActivityKey
      ? keys.normaliseActivityKey(activityId)
      : String(activityId || "");
  }

  function rowFor(activityId) {
    if (!rows) return null;
    return rows.get(normalise(activityId)) || null;
  }

  function authoritativeState(local, activityId) {
    if (!isSharedBackend() || rows === null) return local;
    var backend = rowFor(activityId);
    if (backend) {
      return Object.assign({}, local, {
        status: "completed",
        score: backend.latest_score,
        total: backend.max_score,
        attempts: Number(backend.attempt_count) || 0,
        submitted: true,
        lastUpdated: backend.latest_attempt_at,
        progressSource: "backend"
      });
    }
    if (local.status === "completed") {
      return Object.assign({}, local, {
        status: "in-progress",
        submitted: false,
        progressSource: "local-pending",
        extra: Object.assign({}, local.extra || {}, {
          localCompleted: true
        })
      });
    }
    return Object.assign({}, local, {
      progressSource: "local-draft"
    });
  }

  function wrap(progress) {
    if (!progress || wrapped.indexOf(progress) !== -1) return;
    wrapped.push(progress);
    progress.__lpGetActivityState = progress.getActivityState;
    var getActivityState = progress.getActivityState;
    var markCompleted = progress.markCompleted;
    var markSubmitted = progress.markSubmitted;

    progress.getActivityState = function (activityId) {
      return authoritativeState(getActivityState(activityId), activityId);
    };
    progress.getCompletionSummary = function () {
      var completed = 0;
      var inProgress = 0;
      progress.ACTIVITY_CATALOG.forEach(function (item) {
        var state = progress.getActivityState(item.activityId);
        if (state.status === "completed") completed += 1;
        else if (state.status === "in-progress") inProgress += 1;
      });
      return {
        total: progress.ACTIVITY_CATALOG.length,
        completed: completed,
        inProgress: inProgress,
        notStarted: progress.ACTIVITY_CATALOG.length - completed - inProgress
      };
    };
    progress.markCompleted = function (activityId, score, total, extra) {
      var value = markCompleted(activityId, score, total, extra);
      if (!isSharedBackend()) return value;
      return progress.updateActivity(activityId, {
        status: "in-progress",
        submitted: false,
        extra: Object.assign({}, value.extra || {}, {
          localCompleted: true
        })
      });
    };
    progress.markSubmitted = function (activityId) {
      if (!isSharedBackend()) return markSubmitted(activityId);
      reconcile({ force: true });
      return progress.getActivityState(activityId);
    };
    wrapPersist(progress);
  }

  function persistActivitySlice(progress, activityId) {
    var remote = window.Unit3RemoteLearnerWork;
    if (!remote || typeof remote.persistWeekRoot !== "function") return;
    remote.persistWeekRoot(progress, activityId);
  }

  function wrapPersist(progress) {
    if (!progress || progress.__lpRemotePersist) return;
    progress.__lpRemotePersist = true;
    progress.__lpUpdateActivity = progress.updateActivity;
    progress.__lpSetDraft = progress.setDraft;
    progress.__lpSaveRegister = progress.saveRegister;
    if (typeof progress.__lpUpdateActivity === "function") {
      progress.updateActivity = function (activityId, patch) {
        var value = progress.__lpUpdateActivity(activityId, patch);
        persistActivitySlice(progress, activityId);
        return value;
      };
    }
    if (typeof progress.__lpSetDraft === "function") {
      progress.setDraft = function (key, value) {
        var stored = progress.__lpSetDraft(key, value);
        persistActivitySlice(progress, key);
        return stored;
      };
    }
    if (typeof progress.__lpSaveRegister === "function" && progress.REGISTER_KEY) {
      progress.saveRegister = function (register) {
        var stored = progress.__lpSaveRegister(register);
        var remote = window.Unit3RemoteLearnerWork;
        if (remote) {
          remote.persistStorageKey(
            progress.REGISTER_KEY,
            "week2-northbank-vulnerability-register",
            register || {}
          );
        }
        return stored;
      };
    }
  }

  function hydrateProgressDrafts(progress) {
    var remote = window.Unit3RemoteLearnerWork;
    if (!remote || !progress) return Promise.resolve(false);
    if (typeof remote.hydrateWeekRoot === "function") {
      return remote.hydrateWeekRoot(progress).then(function () {
        return true;
      }).catch(function () {
        return false;
      });
    }
    return Promise.resolve(false);
  }

  function hydrateUnhydratedWeeks() {
    var week;
    var hydrations = [];
    wrapAvailableWeeks();
    for (week = 2; week <= 7; week += 1) {
      if (!window["Unit3Week" + week + "Progress"] || hydratedWeeks[week]) continue;
      hydrations.push((function (weekNumber) {
        return hydrateProgressDrafts(window["Unit3Week" + weekNumber + "Progress"]).then(function (hydrated) {
          if (hydrated) hydratedWeeks[weekNumber] = true;
        });
      })(week));
    }
    return Promise.all(hydrations);
  }

  function signedInUserId() {
    var current = window.LearningPlatform && window.LearningPlatform.platform;
    try {
      var session = current && current.auth && typeof current.auth.getSession === "function"
        ? current.auth.getSession()
        : null;
      if (session && session.user && session.user.id) return String(session.user.id);
      if (current && current.auth && typeof current.auth.isSignedIn === "function" && current.auth.isSignedIn()) {
        return "signed-in";
      }
    } catch (err) {
      /* ignore */
    }
    return "";
  }

  function wrapAvailableWeeks() {
    for (var week = 2; week <= 7; week += 1) {
      wrap(window["Unit3Week" + week + "Progress"]);
    }
  }

  function dispatch() {
    window.dispatchEvent(new CustomEvent("unit3:backend-progress", {
      detail: { count: rows ? rows.size : 0 }
    }));
  }

  function reconcile(options) {
    wrapAvailableWeeks();
    if (!isSharedBackend()) {
      rows = null;
      reconciledUserId = null;
      hydratedWeeks = Object.create(null);
      dispatch();
      return Promise.resolve([]);
    }
    var platform = window.LearningPlatform && window.LearningPlatform.platform;
    if (!platform || !platform.auth.isSignedIn()) {
      rows = new Map();
      reconciledUserId = null;
      hydratedWeeks = Object.create(null);
      dispatch();
      return Promise.resolve([]);
    }
    var force = Boolean(options && options.force);
    var userId = signedInUserId();
    if (!force && reconcilePromise) return reconcilePromise;
    if (!force && reconciledUserId === userId && rows !== null) {
      return hydrateUnhydratedWeeks().then(function () {
        dispatch();
        return [];
      });
    }
    reconcilePromise = platform.progress.getProgress().then(function (result) {
      rows = new Map();
      (Array.isArray(result) ? result : []).forEach(function (row) {
        if (row && row.activity_key) rows.set(normalise(row.activity_key), row);
      });
      reconciledUserId = userId;
      return hydrateUnhydratedWeeks().then(function () {
        dispatch();
        return result;
      });
    }).catch(function (error) {
      console.warn("[Unit3BackendProgress] Progress refresh failed", error);
      throw error;
    }).finally(function () {
      reconcilePromise = null;
    });
    return reconcilePromise;
  }

  function mount() {
    wrapAvailableWeeks();
    window.LearningPlatform.ready.then(reconcile).catch(function () {
      /* Signed-out and unavailable-backend states retain local drafts. */
    });
    window.SupabaseAuth.subscribe(function (state) {
      if (state.status === "authenticated") reconcile().catch(function () {});
      if (state.status === "signed-out") {
        rows = isSharedBackend() ? new Map() : null;
        reconciledUserId = null;
        hydratedWeeks = Object.create(null);
        dispatch();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  window.Unit3BackendProgress = Object.freeze({
    reconcile: reconcile,
    isAuthoritative: function () {
      return isSharedBackend() && rows !== null;
    },
    getRow: rowFor
  });
})();
