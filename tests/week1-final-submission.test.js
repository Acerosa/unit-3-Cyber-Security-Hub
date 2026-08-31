const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

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

function loadWeek1Modules(overrides) {
  const signedIn = Boolean(overrides && overrides.signedIn);
  const rpcCalls = [];
  const gasCalls = [];
  const platformAttemptIds = new Map();
  const sandboxWindow = {
    location: {
      pathname: "/activities/activity.html",
      search: "?activityId=U3-W01-BASELINE&backend=APPS_SCRIPT"
    },
    localStorage: createStorage(),
    sessionStorage: createStorage(),
    crypto: require("node:crypto").webcrypto,
    fetch: function () {
      gasCalls.push("fetch");
      return Promise.reject(new Error("GAS fetch must not run in this test"));
    },
    setTimeout,
    clearTimeout,
    document: {
      getElementById() {
        return {
          textContent: "",
          hidden: false,
          appendChild() {}
        };
      },
      createElement() {
        return { className: "", textContent: "" };
      },
      body: {
        getAttribute() {
          return "U3-W01-BASELINE";
        }
      }
    },
    LearningPlatform: {
      ready: Promise.resolve({ status: signedIn ? "authenticated" : "signed-out" }),
      platform: {
        auth: {
          isSignedIn() {
            return signedIn;
          },
          getSession() {
            return signedIn ? { user: { id: "auth-user" } } : null;
          },
          getState() {
            return {
              status: signedIn ? "authenticated" : "signed-out",
              session: signedIn ? { user: { id: "auth-user" } } : null,
              error: null
            };
          },
          subscribe() {
            return function () {};
          }
        },
        learner: {
          getContext() {
            return signedIn
              ? { firstName: "Test", displayName: "Test Learner", studentNumber: "AB123456" }
              : null;
          },
          getState() {
            return {
              status: signedIn ? "authenticated" : "signed-out",
              context: null,
              error: null
            };
          },
          subscribe() {
            return function () {};
          }
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
          validateProfile() { return { ok: true, value: {} }; },
          validateAccount() { return { ok: true, value: {} }; },
          savePending() {},
          getPending() { return null; },
          clearPending() {},
          getRegistrationOptions() { return Promise.resolve([]); },
          complete() { return Promise.resolve(null); }
        },
        submission: {
          getAttemptId(activityKey) {
            if (!platformAttemptIds.has(activityKey)) {
              platformAttemptIds.set(activityKey, "attempt-" + activityKey);
            }
            return platformAttemptIds.get(activityKey);
          },
          beginAttempt(activityKey) {
            const id = "attempt-new-" + activityKey;
            platformAttemptIds.set(activityKey, id);
            return id;
          }
        },
        client: {
          schema() {
            return {
              rpc(name, payload) {
                rpcCalls.push({ name: name, payload: payload });
                if (overrides && typeof overrides.rpc === "function") {
                  return overrides.rpc(name, payload);
                }
                return Promise.resolve({
                  data: {
                    client_attempt_id: payload.p_client_attempt_id,
                    activity_key: payload.p_activity_key,
                    attempt_number: 1,
                    score: 0,
                    max_score: 10,
                    received_at: "2026-08-31T00:00:00.000Z",
                    idempotent: false,
                    marking_source: "requires_review"
                  },
                  error: null
                });
              }
            };
          }
        }
      }
    }
  };
  sandboxWindow.localStorage.setItem("unit3.backendMode", "APPS_SCRIPT");
  const context = vm.createContext({
    window: sandboxWindow,
    console,
    setTimeout,
    clearTimeout,
    URLSearchParams
  });
  context.location = sandboxWindow.location;
  context.localStorage = sandboxWindow.localStorage;
  context.sessionStorage = sandboxWindow.sessionStorage;
  context.crypto = sandboxWindow.crypto;

  [
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
    "js/course-context.js",
    "js/core/unit3-supabase-submit-runner.js",
    "js/core/week1-final-submit.js"
  ].forEach((file) => {
    const wrapped =
      "(function (window) {" +
      "var location = window.location;" +
      "var localStorage = window.localStorage;" +
      "var sessionStorage = window.sessionStorage;" +
      "var crypto = window.crypto;" +
      "var document = window.document;" +
      read(file) +
      "})(window);";
    vm.runInContext(wrapped, context, { filename: file });
  });

  return {
    window: sandboxWindow,
    rpcCalls: rpcCalls,
    gasCalls: gasCalls
  };
}

test("Week 1 final submission uses authenticated api.submit_attempt", async () => {
  const harness = loadWeek1Modules({ signedIn: true });
  const helper = harness.window.Unit3Week1FinalSubmit;
  const questions = helper.assertLiveBankMatchesCatalogue("U3-W01-BASELINE", {
    sections: [
      {
        questions: Array.from({ length: 10 }, (_, index) => ({
          questionId: "BAS-Q" + String(index + 1).padStart(2, "0"),
          questionType: "single-choice"
        }))
      }
    ]
  });
  const mapped = helper.mapCollectedResponses(
    "U3-W01-BASELINE",
    questions.map((question) => ({ questionId: question.questionId, value: "C" })),
    questions
  );
  const submission = await helper.submitFinal({
    activityId: "U3-W01-BASELINE",
    getResponses: function () {
      return mapped;
    }
  });
  assert.equal(harness.rpcCalls.length, 1);
  assert.equal(harness.rpcCalls[0].name, "submit_attempt");
  assert.equal(harness.rpcCalls[0].payload.p_activity_key, "u3-w01-baseline");
  assert.equal(harness.rpcCalls[0].payload.p_activity_version, "1.2.0");
  assert.equal(harness.gasCalls.length, 0);
  assert.equal(submission.activityKey, "u3-w01-baseline");
  const serialised = JSON.stringify(harness.rpcCalls[0].payload);
  assert.equal(serialised.includes("awarded_score"), false);
  assert.equal(serialised.includes("is_correct"), false);
  assert.equal(serialised.includes("studentId"), false);
  assert.equal(serialised.includes("learner_id"), false);
});

test("Week 1 signed-out submit does not fall back to GAS", async () => {
  const harness = loadWeek1Modules({ signedIn: false });
  await assert.rejects(
    () => harness.window.Unit3Week1FinalSubmit.submitFinal({
      activityId: "U3-W01-BASELINE",
      getResponses: function () {
        return [{ questionId: "BAS-Q01", response: { optionId: "C" } }];
      }
    }),
    (error) => error && error.code === "AUTHENTICATION_REQUIRED"
  );
  assert.equal(harness.rpcCalls.length, 0);
  assert.equal(harness.gasCalls.length, 0);
});

test("Week 1 Supabase failure does not call GAS submitAttempt", async () => {
  const harness = loadWeek1Modules({
    signedIn: true,
    rpc() {
      return Promise.resolve({
        data: null,
        error: { code: "NETWORK_ERROR", message: "NETWORK_ERROR" }
      });
    }
  });
  await assert.rejects(() =>
    harness.window.Unit3Week1FinalSubmit.submitFinal({
      activityId: "U3-W01-CIA",
      getResponses: function () {
        return [{ questionId: "CIA-Q01", response: { optionId: "A" } }];
      }
    })
  );
  assert.equal(harness.rpcCalls.length, 1);
  assert.equal(harness.gasCalls.length, 0);
});

test("query and localStorage backend overrides remain ignored on Week 1", () => {
  const harness = loadWeek1Modules({ signedIn: true });
  const mode = harness.window.Unit3BackendMode;
  assert.equal(mode.fromQuery(), "APPS_SCRIPT");
  assert.equal(mode.fromStorage(), "APPS_SCRIPT");
  assert.equal(mode.getSubmissionProvider(), "SUPABASE");
  assert.equal(mode.getFormativeProvider(), "APPS_SCRIPT");
  assert.equal(mode.getMode(), "SUPABASE");
});

test("Weeks 2–7 still use the shared runner when isSupabase() is true", () => {
  const week2 = read("js/week2-submit.js");
  const week7 = read("js/week7-submit.js");
  ["week2", "week3", "week4", "week5", "week6", "week7"].forEach((week) => {
    const source = read("js/" + week + "-submit.js");
    assert.match(source, /isSupabaseMode/);
    assert.match(source, /Unit3SupabaseSubmitRunner/);
    assert.doesNotMatch(source, /Unit3Week1FinalSubmit/);
  });
  assert.match(week2, /modules\.backendMode\.isSupabase\(\)/);
  assert.match(week7, /modules\.backendMode\.isSupabase\(\)/);
});

test("activity engine keeps GAS getActivity/markSection and does not dual-write", () => {
  const engine = read("js/activity-engine.js");
  const api = read("js/activity-api.js");
  const helper = read("js/core/week1-final-submit.js");
  assert.match(engine, /api\s*\.\s*health\(\)/);
  assert.match(engine, /api\s*\.\s*getActivity/);
  assert.match(engine, /api\s*\.\s*markSection/);
  assert.match(engine, /handleSupabaseFinalSubmit/);
  assert.match(helper, /does not call\s*\n \* GAS submitAttempt/);
  assert.match(api, /ROLLBACK_ONLY/);
  const supabaseFn = engine.match(
    /function handleSupabaseFinalSubmit\(\) \{[\s\S]*?\n  function handleAppsScriptRollbackSubmit/
  );
  assert.ok(supabaseFn);
  assert.doesNotMatch(supabaseFn[0], /submitAttempt/);
  assert.doesNotMatch(supabaseFn[0], /studentId/);
  assert.match(engine, /handleAppsScriptRollbackSubmit/);
});
