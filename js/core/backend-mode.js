/**
 * Central Unit 3 backend-mode selector.
 *
 * Two independent providers are resolved so Week 1 can keep Apps Script
 * content/formative marking without making Apps Script authoritative for
 * final evidence:
 *
 *   content / formative  -> getActivity + markSection (Week 1 still Apps Script)
 *   submission           -> final evidence, score, identity, progress
 *
 * Modes:
 *   APPS_SCRIPT  -> existing Google Apps Script /exec endpoints (rollback)
 *   SUPABASE     -> api.submit_attempt on the shared Supabase project
 *
 * There is no automatic fallback. If Supabase final submission fails, the
 * failure remains visible to the learner. Switching to Apps Script must be
 * an explicit, observable configuration change in SUPABASE_CONFIG.
 *
 * Resolution order for the submission provider (first match wins):
 *   1. SUPABASE_CONFIG.backendMode
 *   2. default SUPABASE
 *
 * Week 1 Activity API pages keep Apps Script as the content/formative
 * provider regardless of the global default. That is a deterministic
 * compatibility route, not an error fallback.
 *
 * Learners cannot switch transport via query string or localStorage.
 * Those were previously support overrides and are ignored.
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
   * Week 1 still depends on the legacy Activity API getActivity/markSection
   * workflow. There is no Supabase equivalent in the current backend
   * contract, so content and formative marking remain on Apps Script.
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

  function configuredSubmissionMode() {
    var resolved = fromConfig();
    if (resolved && isSupported(resolved)) {
      return resolved;
    }
    return MODE.SUPABASE;
  }

  function getContentProvider() {
    if (isWeek1ActivityApiPage()) return MODE.APPS_SCRIPT;
    return configuredSubmissionMode();
  }

  function getFormativeProvider() {
    return getContentProvider();
  }

  function getSubmissionProvider() {
    return configuredSubmissionMode();
  }

  /**
   * Compatibility alias for Weeks 2–7 submit scripts. Returns the
   * authoritative submission provider. Query/localStorage overrides are
   * ignored. Week 1 final evidence now uses this same provider.
   */
  function getMode() {
    return getSubmissionProvider();
  }

  function isSupabase() {
    return getSubmissionProvider() === MODE.SUPABASE;
  }

  function isAppsScript() {
    return getSubmissionProvider() === MODE.APPS_SCRIPT;
  }

  function usesAppsScriptContent() {
    return getContentProvider() === MODE.APPS_SCRIPT;
  }

  function usesAppsScriptFormative() {
    return getFormativeProvider() === MODE.APPS_SCRIPT;
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
    if (isWeek1ActivityApiPage()) {
      return getSubmissionProvider() === MODE.SUPABASE
        ? "week1-formative-apps-script"
        : "week1-rollback-apps-script";
    }
    if (fromConfig()) return "supabase-config";
    return "default-supabase";
  }

  window.Unit3BackendMode = Object.freeze({
    MODE: MODE,
    getMode: getMode,
    getContentProvider: getContentProvider,
    getFormativeProvider: getFormativeProvider,
    getSubmissionProvider: getSubmissionProvider,
    isSupabase: isSupabase,
    isAppsScript: isAppsScript,
    usesAppsScriptContent: usesAppsScriptContent,
    usesAppsScriptFormative: usesAppsScriptFormative,
    isWeek1ActivityApiPage: isWeek1ActivityApiPage,
    setMode: setMode,
    clearOverride: clearOverride,
    describeSource: describeSource,
    STORAGE_KEY: STORAGE_KEY,
    QUERY_PARAMETER: QUERY_PARAMETER,
    fromQuery: fromQuery,
    fromStorage: fromStorage
  });
})();
