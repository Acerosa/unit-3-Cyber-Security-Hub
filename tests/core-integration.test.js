const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const coreAsset = "vendor/learning-platform-core/0.1.0/learning-platform-core.iife.js";

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

function routeFiles() {
  const routes = [
    "index.html",
    "account/index.html",
    "activities/activity.html",
    "help/index.html",
    "resources/index.html"
  ];
  for (let week = 1; week <= 7; week += 1) {
    const base = path.join(root, `week-${week}`);
    const visit = (directory) => {
      fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
        if (entry.name === "tests") return;
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) visit(absolute);
        else if (entry.name === "index.html") {
          routes.push(path.relative(root, absolute));
        }
      });
    };
    visit(base);
  }
  return Array.from(new Set(routes)).sort();
}

function loadCore() {
  const sandbox = { console, URL, Date, setTimeout, clearTimeout };
  vm.createContext(sandbox);
  vm.runInContext(read(coreAsset), sandbox, { filename: coreAsset });
  return sandbox.LearningPlatformCore;
}

test("vendored Core is the exact reviewed f484b2d browser build", () => {
  const hash = crypto.createHash("sha256").update(read(coreAsset)).digest("hex");
  assert.equal(hash, "87a940431dc981af4aeb65d4c0a4c215c497346b0ce5a10d996261f0f1be44ed");
  assert.match(read("vendor/learning-platform-core/0.1.0/PROVENANCE.md"), /f484b2d/);
});

test("reviewed Core exposes shared state, theme, error, and account UI contracts", () => {
  const core = loadCore();
  [
    "createPlatform",
    "createAuthService",
    "createLearnerContext",
    "createOnboardingService",
    "createAccountDialog",
    "createThemeService",
    "createLoadingState",
    "createErrorBanner"
  ].forEach((name) => {
    assert.equal(typeof core[name], "function", `${name} must be available`);
  });
});

test("one composition root owns shared platform services", () => {
  const source = read("js/core/platform.js");
  assert.equal((source.match(/core\.createPlatform\(/g) || []).length, 1);
  assert.match(source, /platform\.initialise\(\)/);
  assert.match(source, /window\.LearningPlatform/);
  assert.match(read("js/config/app-config.js"), /coreVersion:\s*"0\.1\.0"/);
});

test("legacy compatibility files delegate to Core without parallel sessions", () => {
  const client = read("js/core/supabase-client.js");
  const auth = read("js/core/supabase-auth.js");
  const onboarding = read("js/core/supabase-onboarding.js");
  assert.match(client, /LearningPlatform\.platform/);
  assert.doesNotMatch(client, /createClient|accessToken|refreshToken|fetch\(/);
  assert.match(auth, /platform\.auth/);
  assert.match(auth, /platform\.learner/);
  assert.match(onboarding, /platform\.onboarding/);
  assert.doesNotMatch(onboarding, /sessionStorage|localStorage/);
});

test("Core Auth restores the SDK-owned session", async () => {
  const core = loadCore();
  const session = { user: { id: "learner-1" }, access_token: "sdk-owned" };
  const auth = core.createAuthService({
    client: {
      auth: {
        onAuthStateChange() {
          return { data: { subscription: { unsubscribe() {} } } };
        },
        getSession() { return Promise.resolve({ data: { session }, error: null }); },
        signOut() { return Promise.resolve({ error: null }); }
      }
    },
    logger: { warn() {} }
  });
  await auth.initialise();
  assert.equal(auth.getSession(), session);
  assert.equal(auth.isSignedIn(), true);
});

test("canonical manifest declares the active Phase 1 contracts", () => {
  const manifest = JSON.parse(read("learning-platform-hub.json"));
  assert.equal(manifest.manifestVersion, "1.0.0");
  assert.equal(manifest.hubId, "unit-3-cyber-security");
  assert.deepEqual(manifest.courses, ["ocr-level-3-it"]);
  assert.deepEqual(manifest.compatibility.required, {
    coreVersion: "0.1.0",
    learnerApiContractVersion: "0.1.0",
    submissionContractVersion: "0.1.0"
  });
});

test("all static learner routes load Core in dependency order", () => {
  const routes = routeFiles();
  assert.equal(routes.length, 94);
  const tokens = [
    "js/core/theme-bootstrap.js",
    "js/config/app-config.js",
    "js/config/supabase-config.js",
    "@supabase/supabase-js@2.112.3",
    "learning-platform-core.iife.js",
    "js/core/platform.js",
    "js/core/supabase-client.js",
    "js/core/supabase-auth.js",
    "js/core/supabase-learning-api.js",
    "js/core/supabase-onboarding.js"
  ];
  routes.forEach((route) => {
    const html = read(route);
    let previous = -1;
    tokens.forEach((token) => {
      const current = html.indexOf(token);
      assert.ok(current > previous, `${route} must load ${token} in order`);
      previous = current;
    });
  });
});

test("all learner route assets and local navigation targets still exist", () => {
  routeFiles().forEach((route) => {
    const html = read(route);
    const pattern = /\b(?:href|src)=(["'])(.*?)\1/gi;
    let match;
    while ((match = pattern.exec(html))) {
      const reference = match[2];
      if (/^(?:[a-z]+:|#|\/\/)/i.test(reference)) continue;
      const clean = reference.split(/[?#]/)[0];
      if (!clean) continue;
      let target = path.resolve(root, path.dirname(route), clean);
      if (
        clean.endsWith("/") ||
        fs.existsSync(target) && fs.statSync(target).isDirectory()
      ) {
        target = path.join(target, "index.html");
      }
      assert.equal(
        fs.existsSync(target),
        true,
        `${route} references missing local file ${reference}`
      );
    }
  });
});

test("the Cyber registry still contains all 76 activities", () => {
  const registry = read("js/course-context.js");
  assert.equal((registry.match(/\bactivityId:\s*['"]/g) || []).length, 76);
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read("js/config/supabase-config.js"), sandbox);
  assert.equal(sandbox.window.SUPABASE_CONFIG.enabledActivities.length, 76);
  assert.equal(new Set(sandbox.window.SUPABASE_CONFIG.enabledActivities).size, 76);
});

test("shared-backend payloads reject browser-authoritative identity", () => {
  const keyMap = read("js/core/activity-key-map.js");
  const adapter = read("js/core/supabase-submission-adapter.js");
  assert.match(keyMap, /studentId/);
  assert.match(adapter, /assertNoLearnerIdentity/);
  assert.doesNotMatch(adapter, /p_student_id|p_group_id|p_assignment_id|p_attempt_number/);
});

test("backend progress overrides completion while retaining local pending work", () => {
  const progress = read("js/core/backend-progress.js");
  assert.match(progress, /progressSource:\s*"backend"/);
  assert.match(progress, /progressSource:\s*"local-pending"/);
  assert.match(progress, /platform\.progress\.getProgress/);
  assert.match(progress, /localCompleted:\s*true/);
});

test("Week 1 remains an explicit Apps Script marking exception", () => {
  const mode = read("js/core/backend-mode.js");
  const config = read("js/activity-engine-config.js");
  const supabaseConfig = read("js/config/supabase-config.js");
  assert.match(supabaseConfig, /backendMode:\s*"SUPABASE"/);
  assert.match(mode, /week1-forced-apps-script/);
  assert.match(mode, /isWeek1ActivityApiPage/);
  assert.match(mode, /return MODE\.APPS_SCRIPT/);
  assert.match(config, /markSection/);
});

test("Weeks 2–7 default to shared Supabase without query override", () => {
  const mode = read("js/core/backend-mode.js");
  assert.match(mode, /return MODE\.SUPABASE/);
  assert.match(mode, /default-supabase/);
  ["week2", "week3", "week4", "week5", "week6", "week7"].forEach((week) => {
    const submit = read(`js/${week}-submit.js`);
    assert.match(submit, /isSupabaseMode/);
    assert.match(submit, /Unit3SupabaseSubmitRunner/);
  });
});

test("Core account dialog is used on shared-backend activity pages", () => {
  const widget = read("js/supabase-auth-widget.js");
  assert.match(widget, /core\.createAccountDialog/);
  assert.match(widget, /authService:\s*platform\.auth/);
  assert.match(widget, /learnerContext:\s*platform\.learner/);
  assert.match(widget, /onboardingService:\s*platform\.onboarding/);
});
