/**
 * Static-file guards for the Unit 3 Supabase migration.
 *
 * Exits with code 0 when every check passes, or 1 otherwise.
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const results = [];

function record(name, ok, detail) {
  results.push({ name, ok: !!ok, detail: detail || "" });
}

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

function existsAt(relative) {
  return fs.existsSync(path.join(root, relative));
}

function walk(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".git")) continue;
    if (entry.name === "node_modules") continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, callback);
    } else if (entry.isFile()) {
      callback(abs);
    }
  }
}

function scoredActivityDirs() {
  const dirs = [];
  for (const week of [2, 3, 4, 5, 6, 7]) {
    const weekRoot = path.join(root, "week-" + week);
    if (!fs.existsSync(weekRoot)) continue;
    walk(weekRoot, (abs) => {
      if (!abs.endsWith(path.sep + "app.js") && !abs.endsWith("/app.js")) return;
      if (abs.includes(path.sep + "tests" + path.sep)) return;
      const src = fs.readFileSync(abs, "utf8");
      if (src.includes("renderSubmitPanel")) {
        dirs.push(path.dirname(abs));
      }
    });
  }
  return dirs;
}

const REQUIRED_SCRIPTS = [
  "js/config/app-config.js",
  "js/config/supabase-config.js",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3",
  "vendor/learning-platform-core/0.1.0/learning-platform-core.iife.js",
  "js/core/platform.js",
  "js/core/supabase-client.js",
  "js/core/supabase-auth.js",
  "js/core/supabase-learning-api.js",
  "js/core/supabase-onboarding.js",
  "js/core/backend-mode.js",
  "js/core/activity-key-map.js",
  "js/core/question-key-aliases.js",
  "js/core/supabase-submission-adapter.js",
  "js/core/supabase-evidence.js",
  "js/core/unit3-supabase-submit-runner.js",
  "js/supabase-auth-widget.js"
];

function assertScriptOrder(html, label) {
  let lastIndex = -1;
  let orderOk = true;
  const missing = [];
  REQUIRED_SCRIPTS.forEach((token) => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp('<script[^>]+src="[^"]*' + escaped + '"');
    const match = re.exec(html);
    if (!match) {
      missing.push(token);
      orderOk = false;
      return;
    }
    if (match.index < lastIndex) orderOk = false;
    else lastIndex = match.index;
  });
  record(
    label + "-includes-supabase-modules",
    missing.length === 0,
    missing.length ? "missing: " + missing.join(", ") : ""
  );
  record(
    label + "-module-order",
    orderOk,
    orderOk ? "" : "Supabase module include order is not stable"
  );
}

const scored = scoredActivityDirs();
record(
  "scored-activity-count",
  scored.length === 68,
  "expected 68 scored activities, found " + scored.length
);

scored.forEach((absDir) => {
  const rel = path.relative(root, absDir);
  const htmlPath = path.join(absDir, "index.html");
  const appPath = path.join(absDir, "app.js");
  if (!fs.existsSync(htmlPath) || !fs.existsSync(appPath)) {
    record("activity-files-" + rel, false, "index.html or app.js missing");
    return;
  }
  const html = fs.readFileSync(htmlPath, "utf8");
  const app = fs.readFileSync(appPath, "utf8");
  assertScriptOrder(html, rel);
  record(
    rel + "-has-auth-css",
    /css\/supabase-auth\.css/.test(html)
  );
  record(
    rel + "-exposes-getResponses",
    /getResponses\s*:/.test(app),
    "expected getResponses in app.js"
  );
  record(
    rel + "-no-supabase-studentId-identity",
    !/p_student_id|student_id\s*:/.test(app)
  );
});

// Privileged credential scan
const forbiddenPattern =
  /sb_secret_|service_role|SUPABASE_DB_PASSWORD|SUPABASE_SERVICE_ROLE|postgresql:\/\//i;
const skipDirs = new Set([
  path.join(root, ".git"),
  path.join(root, "node_modules"),
  path.join(root, "tmp")
]);
const skipFileExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".pdf",
  ".ico"
]);
const leaks = [];
walk(root, (abs) => {
  for (const dir of skipDirs) {
    if (abs.startsWith(dir + path.sep)) return;
  }
  const ext = path.extname(abs).toLowerCase();
  if (skipFileExtensions.has(ext)) return;
  try {
    const text = fs.readFileSync(abs, "utf8");
    if (forbiddenPattern.test(text)) {
      if (abs.endsWith(path.join("tests", "supabase", "run-static-checks.js"))) {
        return;
      }
      if (abs.endsWith(path.join("tests", "supabase", "validate-supabase-modules.js"))) {
        return;
      }
      leaks.push(path.relative(root, abs));
    }
  } catch (error) {
    /* skip */
  }
});
record(
  "no-privileged-supabase-credentials-in-repo",
  leaks.length === 0,
  leaks.length ? "found in: " + leaks.join(", ") : ""
);

if (existsAt("js/config/supabase-config.js")) {
  const config = read("js/config/supabase-config.js");
  record(
    "config-default-backend-mode-is-supabase",
    /backendMode:\s*"SUPABASE"/.test(config)
  );
  record(
    "config-lists-only-lower-case-week1-keys",
    /"u3-w01-baseline"/.test(config) && !/"U3-W01-BASELINE"/.test(config)
  );
}

[
  "js/week2-submit.js",
  "js/week3-submit.js",
  "js/week4-submit.js",
  "js/week5-submit.js",
  "js/week6-submit.js",
  "js/week7-submit.js"
].forEach(
  (relative) => {
    const source = read(relative);
    record(
      "supabase-branch-in-" + relative,
      /if\s*\(\s*isSupabaseMode\s*\(\s*\)\s*\)\s*\{\s*submitResultViaSupabase\s*\(\s*options\s*\)/m.test(
        source
      )
    );
    record(
      "uses-shared-runner-" + relative,
      /Unit3SupabaseSubmitRunner/.test(source)
    );
  }
);

if (existsAt("js/core/supabase-submission-adapter.js")) {
  const adapter = read("js/core/supabase-submission-adapter.js");
  record(
    "adapter-forces-null-programming-language",
    /p_programming_language:\s*null/.test(adapter)
  );
  record(
    "adapter-normalises-activity-key",
    /normaliseActivityKey/.test(adapter)
  );
  record(
    "adapter-normalises-question-key",
    /normaliseQuestionKey/.test(adapter)
  );
}

if (existsAt("js/core/unit3-supabase-submit-runner.js")) {
  const runner = read("js/core/unit3-supabase-submit-runner.js");
  record(
    "submit-runner-sends-site-relative-source-page",
    /window\.location\.pathname\s*\+\s*window\.location\.search/.test(runner) &&
      !/sourcePage:\s*window\.location\s*\?\s*window\.location\.href/.test(runner)
  );
}

if (existsAt("account/index.html") && existsAt("account/app.js")) {
  const accountHtml = read("account/index.html");
  const accountApp = read("account/app.js");
  const signinForm = (accountHtml.match(
    /<form id="signin-form"[\s\S]*?<\/form>/
  ) || [""])[0];
  [
    "register-first-name",
    "register-surname",
    "register-student-number",
    "register-option",
    "register-email",
    "register-password",
    "register-password-confirm"
  ].forEach((id) => {
    record("registration-form-has-" + id, accountHtml.includes('id="' + id + '"'));
  });
  record(
    "signin-form-has-no-registration-fields",
    Boolean(signinForm) && !/register-(?:first-name|surname|student-number|option)/.test(signinForm)
  );
  record(
    "registration-uses-auth-abstraction",
    /SupabaseAuth\.signUpWithPassword/.test(accountApp) &&
      !/\/auth\/v1\/signup/.test(accountApp)
  );
  record(
    "registration-resumes-pending-onboarding",
    /signed-in-unlinked/.test(accountApp) && /getPending\(\)/.test(accountApp)
  );
}

if (existsAt("js/core/supabase-onboarding.js")) {
  const onboarding = read("js/core/supabase-onboarding.js");
  record(
    "pending-onboarding-is-owned-by-core",
    /platform\.onboarding/.test(onboarding) &&
      !/sessionStorage/.test(onboarding) &&
      !/localStorage/.test(onboarding)
  );
  record(
    "pending-onboarding-does-not-store-password",
    !/pending\.(?:password|confirmPassword|accessToken|refreshToken)\s*=/.test(onboarding)
  );
  record(
    "onboarding-is-a-thin-core-facade",
    /validateProfile:\s*onboarding\.validateProfile/.test(onboarding) &&
      /getRegistrationOptions:\s*onboarding\.getRegistrationOptions/.test(onboarding) &&
      /complete:\s*onboarding\.complete/.test(onboarding)
  );
}

if (existsAt("js/learner-session-summary.js")) {
  const summary = read("js/learner-session-summary.js");
  record(
    "session-summary-renders-safe-identity",
    /fullName/.test(summary) && /yearGroup/.test(summary) && /contactEmail/.test(summary)
  );
  record(
    "session-summary-clears-when-signed-out",
    /state\.status !== "authenticated"[\s\S]*clear\(\)/.test(summary)
  );
}

if (existsAt("js/core/backend-mode.js")) {
  const mode = read("js/core/backend-mode.js");
  record(
    "week1-forced-apps-script-override",
    /isWeek1ActivityApiPage/.test(mode) && /week1-forced-apps-script/.test(mode)
  );
}

if (existsAt("js/core/question-key-aliases.js")) {
  const aliases = read("js/core/question-key-aliases.js");
  record(
    "question-aliases-cover-ocr-and-mtm",
    /W2OCR-Q01/.test(aliases) && /MAP1/.test(aliases) && /MOTKC1/.test(aliases)
  );
}

results.forEach((r) => {
  const status = r.ok ? "PASS" : "FAIL";
  const detail = r.detail ? " — " + r.detail : "";
  console.log(status + ": " + r.name + detail);
});

const failed = results.filter((r) => !r.ok);
console.log("");
if (failed.length === 0) {
  console.log(
    "All " + results.length + " Supabase static-file checks passed."
  );
  process.exit(0);
}
console.log(
  failed.length + " of " + results.length + " Supabase static-file checks failed."
);
process.exit(1);
