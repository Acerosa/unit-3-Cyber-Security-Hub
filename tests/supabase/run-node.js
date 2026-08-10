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
  "js/core/supabase-submission-adapter.js",
  "js/core/supabase-evidence.js",
  "js/core/unit3-supabase-submit-runner.js",
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
