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
      reconcile();
      return progress.getActivityState(activityId);
    };
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

  function reconcile() {
    wrapAvailableWeeks();
    if (!isSharedBackend()) {
      rows = null;
      dispatch();
      return Promise.resolve([]);
    }
    var platform = window.LearningPlatform && window.LearningPlatform.platform;
    if (!platform || !platform.auth.isSignedIn()) {
      rows = new Map();
      dispatch();
      return Promise.resolve([]);
    }
    return platform.progress.getProgress().then(function (result) {
      rows = new Map();
      (Array.isArray(result) ? result : []).forEach(function (row) {
        if (row && row.activity_key) rows.set(normalise(row.activity_key), row);
      });
      dispatch();
      return result;
    }).catch(function (error) {
      console.warn("[Unit3BackendProgress] Progress refresh failed", error);
      throw error;
    });
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
