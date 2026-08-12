/**
 * Central Unit 3 backend-mode selector.
 *
 * Exposes the runtime submission transport in one place so no week script
 * has to make transport decisions on its own. Modes:
 *
 *   APPS_SCRIPT  -> existing Google Apps Script /exec endpoints (rollback)
 *   SUPABASE     -> api.submit_attempt on the shared Supabase project
 *
 * There is no automatic fallback. If Supabase fails, the failure remains
 * visible to the learner. Switching to Apps Script must be an explicit,
 * observable configuration change.
 *
 * Resolution order (first match wins):
 *   1. Week 1 Activity API pages are forced to APPS_SCRIPT (no markSection RPC)
 *   2. ?backend=supabase / ?backend=apps_script in the current URL
 *   3. localStorage['unit3.backendMode'] = 'SUPABASE' | 'APPS_SCRIPT'
 *   4. SUPABASE_CONFIG.backendMode (default SUPABASE for Weeks 2–7)
 */
(function () {
  "use strict";

  var STORAGE_KEY = "unit3.backendMode";
  var QUERY_PARAMETER = "backend";
  var MODE = Object.freeze({
    APPS_SCRIPT: "APPS_SCRIPT",
    SUPABASE: "SUPABASE"
  });

  function config() {
    return window.SUPABASE_CONFIG || {};
  }

  function isSupported(mode) {
    var supported = config().supportedBackendModes;
    if (Array.isArray(supported)) {
      return supported.indexOf(mode) !== -1;
    }
    return mode === MODE.APPS_SCRIPT || mode === MODE.SUPABASE;
  }

  function normalise(value) {
    if (typeof value !== "string") return "";
    var upper = value.trim().toUpperCase();
    if (upper === "SUPABASE") return MODE.SUPABASE;
    if (upper === "APPS_SCRIPT" || upper === "APPS-SCRIPT") {
      return MODE.APPS_SCRIPT;
    }
    return "";
  }

  function fromQuery() {
    try {
      if (!window.location || typeof window.location.search !== "string") {
        return "";
      }
      var params = new URLSearchParams(window.location.search);
      var raw = params.get(QUERY_PARAMETER);
      return normalise(raw);
    } catch (error) {
      return "";
    }
  }

  function fromStorage() {
    try {
      var raw =
        window.localStorage && window.localStorage.getItem(STORAGE_KEY);
      return normalise(raw);
    } catch (error) {
      return "";
    }
  }

  function fromConfig() {
    return normalise(config().backendMode);
  }

  /**
   * Week 1 still depends on the legacy Activity API markSection workflow.
   * There is no Supabase equivalent in the current backend contract, so
   * these pages remain explicitly on Apps Script even when the global
   * default is SUPABASE. This is a deterministic override, not a silent
   * error fallback.
   */
  function isWeek1ActivityApiPage() {
    try {
      var path =
        window.location && typeof window.location.pathname === "string"
          ? window.location.pathname
          : "";
      if (/\/activities\/activity\.html$/i.test(path)) {
        return true;
      }
      if (/\/week-1\//i.test(path)) {
        return true;
      }
      var body =
        typeof document !== "undefined" && document.body
          ? document.body.getAttribute("data-activity-id")
          : "";
      if (body && /^U3-W01-/i.test(body.trim())) {
        return true;
      }
      if (window.location && typeof window.location.search === "string") {
        var params = new URLSearchParams(window.location.search);
        var activityId = params.get("activityId") || "";
        if (/^U3-W01-/i.test(activityId.trim())) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  function getMode() {
    if (isWeek1ActivityApiPage()) {
      return MODE.APPS_SCRIPT;
    }
    var resolved = fromQuery() || fromStorage() || fromConfig();
    if (resolved && isSupported(resolved)) {
      return resolved;
    }
    return MODE.SUPABASE;
  }

  function isSupabase() {
    return getMode() === MODE.SUPABASE;
  }

  function isAppsScript() {
    return getMode() === MODE.APPS_SCRIPT;
  }

  function setMode(mode) {
    var normalised = normalise(mode);
    if (!normalised || !isSupported(normalised)) {
      throw new Error("Unsupported Unit 3 backend mode: " + String(mode));
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, normalised);
    } catch (error) {
      /* localStorage unavailable — mode reverts on reload */
    }
    return normalised;
  }

  function clearOverride() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* ignore */
    }
  }

  function describeSource() {
    if (isWeek1ActivityApiPage()) return "week1-forced-apps-script";
    if (fromQuery()) return "query-string";
    if (fromStorage()) return "local-storage-override";
    if (fromConfig()) return "supabase-config";
    return "default-supabase";
  }

  window.Unit3BackendMode = Object.freeze({
    MODE: MODE,
    getMode: getMode,
    isSupabase: isSupabase,
    isAppsScript: isAppsScript,
    isWeek1ActivityApiPage: isWeek1ActivityApiPage,
    setMode: setMode,
    clearOverride: clearOverride,
    describeSource: describeSource,
    STORAGE_KEY: STORAGE_KEY,
    QUERY_PARAMETER: QUERY_PARAMETER
  });
})();
