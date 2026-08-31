/**
 * Headless Node runner for the Supabase migration tests.
 *
 * Loads each module into a shared vm sandbox that mimics a browser
 * `window`, then runs the same suite that the browser HTML runner uses.
 * Exits with code 0 when every check passes, or 1 otherwise. This is
 * intended for local validation only.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..", "..");

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

function createStorage() {
  const items = new Map();
  return {
    getItem(key) {
      return items.has(key) ? items.get(key) : null;
    },
    setItem(key, value) {
      items.set(key, String(value));
    },
    removeItem(key) {
      items.delete(key);
    },
    clear() {
      items.clear();
    }
  };
}

const sandboxWindow = {
  location: { search: "", pathname: "/tests/supabase/run-node.js" },
  localStorage: createStorage(),
  sessionStorage: createStorage(),
  crypto: require("node:crypto").webcrypto,
  fetch: () => Promise.reject(new Error("fetch is not available in the Node runner")),
  setTimeout,
  clearTimeout,
  document: undefined
};

const platformAttemptIds = new Map();
const signedOutAuthState = { status: "signed-out", session: null, error: null };
const signedOutLearnerState = { status: "signed-out", context: null, error: null };
const fakePlatform = {
  client: {
    schema() {
      return {
        rpc() { return Promise.resolve({ data: [], error: null }); },
        from() {
          return {
            select() {
              return {
                order() { return Promise.resolve({ data: [], error: null }); }
              };
            }
          };
        }
      };
    }
  },
  auth: {
    getSession() { return null; },
    getState() { return signedOutAuthState; },
    isSignedIn() { return false; },
    subscribe(listener) { listener(signedOutAuthState); return function () {}; },
    signIn() { return Promise.reject(new Error("not available in headless test")); },
    signUp() { return Promise.reject(new Error("not available in headless test")); },
    signOut() { return Promise.resolve(true); }
  },
  learner: {
    getContext() { return null; },
    getState() { return signedOutLearnerState; },
    subscribe(listener) { listener(signedOutLearnerState); return function () {}; },
    refresh() { return Promise.resolve(null); }
  },
  profile: { getProfile() { return Promise.resolve(null); } },
  enrolment: { getEnrolments() { return Promise.resolve([]); } },
  assignment: {
    getAssignments() { return Promise.resolve([]); },
    getCurriculumDelivery() { return Promise.resolve([]); }
  },
  progress: {
    getProgress() { return Promise.resolve([]); },
    getAttempts() { return Promise.resolve([]); },
    getResponses() { return Promise.resolve([]); }
  },
  onboarding: {
    pendingKey: "learning-platform.pending-onboarding.v1:unit-3-cyber-security",
    validateProfile(details) {
      const value = {
        firstName: String(details.firstName || "").trim(),
        surname: String(details.surname || "").trim(),
        studentNumber: String(details.studentNumber || "").trim()
      };
      return value.firstName && value.surname && value.studentNumber
        ? { ok: true, value }
        : { ok: false, code: "INVALID_STUDENT_NUMBER" };
    },
    validateAccount() { return { ok: true, value: {} }; },
    savePending(details) { return details; },
    getPending() { return null; },
    clearPending() {},
    getRegistrationOptions() { return Promise.resolve([]); },
    complete() { return Promise.resolve(null); }
  },
  submission: {
    getAttemptId(activityKey) {
      if (!platformAttemptIds.has(activityKey)) {
        platformAttemptIds.set(activityKey, require("node:crypto").randomUUID());
      }
      return platformAttemptIds.get(activityKey);
    },
    beginAttempt(activityKey) {
      const id = require("node:crypto").randomUUID();
      platformAttemptIds.set(activityKey, id);
      return id;
    }
  },
  api: {
    getRegistrationOptions() { return Promise.resolve([]); },
    completeOnboarding() { return Promise.resolve(null); }
  }
};
sandboxWindow.LearningPlatform = {
  ready: Promise.resolve({ status: "signed-out" }),
  platform: fakePlatform
};

const context = vm.createContext({
  window: sandboxWindow,
  console,
  setTimeout,
  clearTimeout,
  URLSearchParams
});

// Expose window globals for scripts that assume the browser context
context.location = sandboxWindow.location;
context.localStorage = sandboxWindow.localStorage;
context.sessionStorage = sandboxWindow.sessionStorage;
context.crypto = sandboxWindow.crypto;

function run(file) {
  const code = read(file);
  const wrapped =
    "(function (window) {" +
    "var location = window.location;" +
    "var localStorage = window.localStorage;" +
    "var sessionStorage = window.sessionStorage;" +
    "var crypto = window.crypto;" +
    "var document = window.document;" +
    code +
    "})(window);";
  vm.runInContext(wrapped, context, { filename: file });
}

const modules = [
  "js/config/supabase-config.js",
  "js/core/backend-mode.js",
  "js/core/activity-key-map.js",
  "js/core/question-key-aliases.js",
  "js/core/supabase-client.js",
  "js/core/supabase-auth.js",
  "js/core/supabase-learning-api.js",
  "js/core/supabase-onboarding.js",
  "js/core/supabase-submission-adapter.js",
  "js/core/supabase-evidence.js",
  "js/core/unit3-supabase-submit-runner.js",
  "js/core/week1-final-submit.js",
  "tests/supabase/validate-supabase-modules.js"
];

modules.forEach(run);

const results = sandboxWindow.Unit3SupabaseTests.runSupabaseModuleTests();
const failed = results.filter((r) => !r.ok);

results.forEach((r) => {
  const status = r.ok ? "PASS" : "FAIL";
  const detail = r.detail ? " — " + r.detail : "";
  console.log(status + ": " + r.name + detail);
});

console.log("");
if (failed.length === 0) {
  console.log("All " + results.length + " Supabase migration checks passed.");
  process.exit(0);
} else {
  console.log(
    failed.length + " of " + results.length + " Supabase migration checks failed."
  );
  process.exit(1);
}
