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

const inventory = JSON.parse(read("test/fixtures/route-inventory.json"));

const REQUIRED_ADAPTERS = [
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
  "js/core/week1-final-submit.js"
];

function assertScriptOrder(html, label) {
  record(label + "-vite-shell", /id="root"/.test(html) && /src\/main\.tsx/.test(html));
  record(label + "-no-cdn-supabase", !/cdn\.jsdelivr\.net/.test(html));
  const missing = REQUIRED_ADAPTERS.filter((token) => inventory.sharedAdapters.indexOf(token) === -1);
  record(
    label + "-includes-supabase-modules",
    missing.length === 0,
    missing.length ? "missing: " + missing.join(", ") : ""
  );
  let lastIndex = -1;
  let orderOk = true;
  REQUIRED_ADAPTERS.forEach((token) => {
    const current = inventory.sharedAdapters.indexOf(token);
    if (current === -1 || current < lastIndex) orderOk = false;
    else lastIndex = current;
  });
  record(
    label + "-module-order",
    orderOk,
    orderOk ? "" : "Supabase adapter order is not stable"
  );
}

const scored = scoredActivityDirs();
const scoredRel = scored
  .map((absDir) => path.relative(root, absDir).split(path.sep).join("/"))
  .sort();

// Catalogue-player activities must not keep a host renderSubmitPanel engine.
const CATALOGUE_PLAYER_ACTIVITY_DIRS = ["week-4/ocr-practice"];
const leakedHostEngines = scoredRel.filter((rel) =>
  CATALOGUE_PLAYER_ACTIVITY_DIRS.includes(rel)
);
record(
  "catalogue-player-has-no-host-engine",
  leakedHostEngines.length === 0,
  leakedHostEngines.length
    ? "catalogue player still has host engine: " + leakedHostEngines.join(", ")
    : ""
);

CATALOGUE_PLAYER_ACTIVITY_DIRS.forEach((rel) => {
  const appPath = path.join(root, rel, "app.js");
  const htmlPath = path.join(root, rel, "index.html");
  record(
    rel + "-catalogue-shell",
    existsAt(rel + "/index.html") &&
      !existsAt(rel + "/app.js") &&
      /src\/main\.tsx/.test(fs.readFileSync(htmlPath, "utf8")),
    existsAt(rel + "/app.js")
      ? "legacy app.js still present"
      : "expected Vite catalogue shell without app.js"
  );
});

// Host/hybrid scored engines are the remaining week folders whose app.js still
// calls renderSubmitPanel. Keep an explicit allowlist so catalogue migrations
// update integrity intentionally instead of a brittle raw count.
const EXPECTED_HOST_SCORED_ENGINES = [
  "week-2/northbank-analysis",
  "week-2/ocr-practice",
  "week-2/peer-marking",
  "week-2/vulnerabilities101",
  "week-2/vulnerability-register",
  "week-3/ocr-practice",
  "week-3/peer-marking",
  "week-4/analyse-practice",
  "week-4/answer-improvement",
  "week-4/mtm-mapping",
  "week-4/northbank-exposure",
  "week-5/answer-improvement",
  "week-5/impact-analysis",
  "week-5/ocr-practice",
  "week-5/stakeholder-grid",
  "week-6/answer-improvement",
  "week-6/discuss-learning",
  "week-6/discuss-planner",
  "week-6/exercise-decision-record",
  "week-6/government-initiatives",
  "week-6/legislation-matching",
  "week-6/ncsc-guidance",
  "week-6/ocr-practice",
  "week-6/revision-organiser",
  "week-6/stakeholder-debate",
  "week-7/answer-improvement",
  "week-7/heightened-threat",
  "week-7/ocr-practice",
  "week-7/risk-register"
].slice().sort();

const missingHost = EXPECTED_HOST_SCORED_ENGINES.filter((rel) => !scoredRel.includes(rel));
const extraHost = scoredRel.filter((rel) => !EXPECTED_HOST_SCORED_ENGINES.includes(rel));
record(
  "host-scored-engines-match-allowlist",
  missingHost.length === 0 && extraHost.length === 0,
  [
    missingHost.length ? "missing: " + missingHost.join(", ") : "",
    extraHost.length ? "unexpected: " + extraHost.join(", ") : ""
  ]
    .filter(Boolean)
    .join("; ")
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
    /css\/supabase-auth\.css/.test(read("src/main.tsx"))
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
  path.join(root, "dist"),
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

if (existsAt("account/index.html")) {
  const accountHtml = read("account/index.html");
  record(
    "account-page-has-no-legacy-register-form",
    !/id="register-form"/.test(accountHtml)
    && !/id="signin-form"/.test(accountHtml)
    && !/Step 1 of 2/.test(accountHtml)
    && !/Create learner account/.test(accountHtml)
  );
  record(
    "account-page-does-not-load-legacy-app",
    !existsAt("account/app.js") && !/account\/app\.js/.test(accountHtml)
  );
  record(
    "account-page-mounts-react-hub",
    /id="root"/.test(accountHtml) && /src\/main\.tsx/.test(accountHtml)
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
    "week1-split-providers",
    /isWeek1ActivityApiPage/.test(mode) &&
      /getSubmissionProvider/.test(mode) &&
      /getFormativeProvider/.test(mode) &&
      /week1-formative-apps-script/.test(mode)
  );
}

if (existsAt("js/core/question-key-aliases.js")) {
  const aliases = read("js/core/question-key-aliases.js");
  record(
    "question-aliases-cover-ocr-and-mtm",
    /W2OCR-Q01/.test(aliases) &&
      /W2OCR-Q08/.test(aliases) &&
      /MAP1MOT/.test(aliases) &&
      /MOTKC1/.test(aliases)
  );
}

if (existsAt("week-2/ocr-practice/app.js")) {
  const ocrApp = read("week-2/ocr-practice/app.js");
  record(
    "week2-ocr-submits-local-ids-for-alias-layer",
    /evidence\.structured\(q\.id/.test(ocrApp) &&
      /evidence\.freeText\(q\.id/.test(ocrApp) &&
      !/skip the 7th MCQ/.test(ocrApp)
  );
}

if (existsAt("js/core/activity-key-map.js")) {
  const keyMap = read("js/core/activity-key-map.js");
  record(
    "key-map-targets-batch-b-versions",
    /week2-ocr-question-practice/.test(keyMap) &&
      /1\.2\.0/.test(keyMap) &&
      /WEEK5_MARKING_V1/.test(keyMap)
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
