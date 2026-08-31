const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const coreAsset = "vendor/learning-platform-core/0.2.0/learning-platform-core.iife.js";

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

test("vendored Core is the exact reviewed 0.2.0 browser build", () => {
  const hash = crypto.createHash("sha256").update(read(coreAsset)).digest("hex");
  assert.equal(hash, "5307fe582fe882b31697d3bb905019106b911cf7d1267697462ef91d1b9c8fc2");
  assert.match(read("vendor/learning-platform-core/0.2.0/PROVENANCE.md"), /curriculum-runtime/);
});

test("reviewed Core exposes the 0.2.0 stable browser contract", () => {
  const core = loadCore();
  [
    "createPlatform",
    "createAccountDialog",
    "createThemeService",
    "createLoadingState",
    "createErrorBanner"
  ].forEach((name) => {
    assert.equal(typeof core[name], "function", `${name} must be available`);
  });
  assert.equal(typeof core.createAuthService, "undefined");
});

test("one composition root owns shared platform services", () => {
  const source = read("src/platform.ts");
  assert.match(source, /createPlatformFn\(/);
  assert.match(source, /supabaseClient:\s*client/);
  assert.match(source, /assignment:\s*platform\.assignments/);
  assert.match(source, /navigationMode:\s*"as-supplied"/);
  assert.match(read("js/config/app-config.js"), /coreVersion:\s*"0\.2\.1"/);
  assert.match(read("src/config.ts"), /coreVersion:\s*"0\.2\.1"/);
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
  assert.doesNotMatch(read("js/core/supabase-learning-api.js"), /platform\.api\./);
});

test("Core Auth restores the SDK-owned session", async () => {
  const core = loadCore();
  const session = { user: { id: "learner-1" }, access_token: "sdk-owned" };
  const platform = core.createPlatform({
    hubCode: "unit-3-cyber-security",
    hubName: "Unit 3 Cyber Security Hub",
    supabase: {
      projectUrl: "https://example.supabase.co",
      publishableKey: "sb_publishable_example"
    }
  }, {
    supabaseClient: {
      auth: {
        onAuthStateChange() {
          return { data: { subscription: { unsubscribe() {} } } };
        },
        getSession() { return Promise.resolve({ data: { session }, error: null }); },
        signOut() { return Promise.resolve({ error: null }); }
      },
      schema() {
        return {
          from() {
            return {
              select() { return this; },
              eq() { return this; },
              order() { return this; },
              then(resolve) { return Promise.resolve({ data: [], error: null }).then(resolve); }
            };
          },
          rpc() { return Promise.resolve({ data: [], error: null }); }
        };
      }
    },
    document: null,
    window: null
  });
  await platform.initialise();
  assert.equal(platform.auth.getSession(), session);
  assert.equal(platform.auth.isSignedIn(), true);
  platform.destroy();
});

test("canonical manifest declares the active Phase 1 contracts", () => {
  const manifest = JSON.parse(read("learning-platform-hub.json"));
  assert.equal(manifest.manifestVersion, "1.0.0");
  assert.equal(manifest.hubId, "unit-3-cyber-security");
  assert.deepEqual(manifest.courses, ["ocr-level-3-it"]);
  assert.deepEqual(manifest.compatibility.required, {
    coreVersion: "0.2.1",
    learnerApiContractVersion: "0.1.0",
    submissionContractVersion: "0.1.0"
  });
});

test("all static learner routes are Vite shells that mount the React hub", () => {
  const routes = routeFiles();
  assert.equal(routes.length, 104);
  routes.forEach((route) => {
    const html = read(route);
    assert.match(html, /id="root"/, route);
    assert.match(html, /src\/main\.tsx/, route);
    assert.match(html, /theme-bootstrap\.js\?v=2/, route);
    assert.ok(html.indexOf("theme-bootstrap.js") < html.indexOf('type="module"'), route);
    assert.doesNotMatch(html, /learning-platform-core\.iife\.js/);
    assert.doesNotMatch(html, /cdn\.jsdelivr\.net/);
  });
  assert.match(read("src/main.tsx"), /@learning-platform\/core\/theme\.css/);
  assert.match(read("package.json"), /"@learning-platform\/core": "file:\.\.\/learning-platform-core"/);
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

test("the Cyber registry still contains all 80 activities", () => {
  const registry = read("js/course-context.js");
  assert.equal((registry.match(/\bactivityId:\s*['"]/g) || []).length, 80);
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read("js/config/supabase-config.js"), sandbox);
  assert.equal(sandbox.window.SUPABASE_CONFIG.enabledActivities.length, 80);
  assert.equal(new Set(sandbox.window.SUPABASE_CONFIG.enabledActivities).size, 80);
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

test("Week 1 splits Apps Script formative from Supabase final submission", () => {
  const mode = read("js/core/backend-mode.js");
  const config = read("js/activity-engine-config.js");
  const supabaseConfig = read("js/config/supabase-config.js");
  const engine = read("js/activity-engine.js");
  const api = read("js/activity-api.js");
  assert.match(supabaseConfig, /backendMode:\s*"SUPABASE"/);
  assert.match(mode, /week1-formative-apps-script/);
  assert.match(mode, /isWeek1ActivityApiPage/);
  assert.match(mode, /getSubmissionProvider/);
  assert.match(mode, /getFormativeProvider/);
  assert.match(config, /markSection/);
  assert.match(api, /ROLLBACK_ONLY/);
  assert.match(engine, /usesSupabaseFinalSubmit/);
  assert.match(engine, /handleSupabaseFinalSubmit/);
  assert.match(engine, /Unit3Week1FinalSubmit/);
  const supabaseFn = engine.match(
    /function handleSupabaseFinalSubmit\(\) \{[\s\S]*?\n  function handleAppsScriptRollbackSubmit/
  );
  assert.ok(supabaseFn, "Supabase final submit handler must be extractable");
  assert.doesNotMatch(supabaseFn[0], /submitAttempt/);
  assert.match(engine, /api\s*\.\s*getActivity/);
  assert.match(engine, /api\s*\.\s*markSection/);
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
  const hook = read("src/hooks/useHubPlatform.ts");
  assert.match(widget, /core\.createAccountDialog/);
  assert.match(hook, /createAccountDialog/);
  assert.match(hook, /LearningPlatform = \{ platform, coreVersion: APP_CONFIG\.coreVersion, ready \}/);
  assert.match(hook, /authService:\s*platform\.auth/);
  assert.match(hook, /learnerContext:\s*platform\.learner/);
  assert.match(hook, /onboardingService:\s*platform\.onboarding/);
});
