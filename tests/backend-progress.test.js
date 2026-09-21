const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.resolve(
  __dirname,
  "..",
  "js/core/backend-progress.js"
), "utf8");

function progressStore() {
  let state = {
    activityId: "week2-session1-retrieval",
    status: "completed",
    score: 9,
    total: 10,
    submitted: false,
    attempts: 1,
    extra: {}
  };
  return {
    ROOT_KEY: "unit3-week2-progress",
    ACTIVITY_CATALOG: [{ activityId: state.activityId }],
    getActivityState() { return { ...state, extra: { ...state.extra } }; },
    updateActivity(activityId, patch) {
      state = { ...state, ...patch, activityId };
      return this.getActivityState();
    },
    markCompleted(activityId, score, total, extra) {
      return this.updateActivity(activityId, {
        status: "completed",
        score,
        total,
        extra: extra || {}
      });
    },
    markSubmitted(activityId) {
      return this.updateActivity(activityId, { submitted: true });
    }
  };
}

async function load({ signedIn, rows }) {
  const progress = progressStore();
  let progressCalls = 0;
  const weekHydrates = [];
  let authListener = null;
  const window = {
    Unit3BackendMode: { isSupabase() { return true; } },
    Unit3ActivityKeyMap: { normaliseActivityKey(value) { return value; } },
    Unit3Week2Progress: progress,
    Unit3RemoteLearnerWork: {
      hydrateWeekRoot(store) {
        weekHydrates.push(store && store.ROOT_KEY);
        return Promise.resolve();
      }
    },
    LearningPlatform: {
      ready: Promise.resolve(),
      platform: {
        auth: {
          isSignedIn() { return signedIn; },
          getSession() { return signedIn ? { user: { id: "auth-user" } } : null; }
        },
        progress: {
          getProgress() {
            progressCalls += 1;
            return Promise.resolve(rows);
          }
        }
      }
    },
    SupabaseAuth: {
      subscribe(listener) {
        authListener = listener;
        listener({ status: signedIn ? "authenticated" : "signed-out" });
      }
    },
    dispatchEvent() {}
  };
  const context = vm.createContext({
    window,
    document: { readyState: "complete" },
    CustomEvent: class CustomEvent {
      constructor(name, init) { this.type = name; this.detail = init.detail; }
    },
    console,
    Promise,
    Map,
    Object,
    Array
  });
  vm.runInContext(source, context);
  await window.LearningPlatform.ready.catch(() => {});
  if (window.Unit3BackendProgress && typeof window.Unit3BackendProgress.reconcile === "function") {
    await window.Unit3BackendProgress.reconcile().catch(() => {});
  }
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
  return {
    progress,
    adapter: window.Unit3BackendProgress,
    progressCalls: () => progressCalls,
    weekHydrates,
    window,
    authListener
  };
}

test("signed-out shared mode does not treat local completion as authoritative", async () => {
  const { progress, adapter } = await load({ signedIn: false, rows: [] });
  const state = progress.getActivityState("week2-session1-retrieval");
  assert.equal(adapter.isAuthoritative(), true);
  assert.equal(state.status, "in-progress");
  assert.equal(state.progressSource, "local-pending");
  assert.equal(state.extra.localCompleted, true);
});

test("Core backend progress overrides the local completion snapshot", async () => {
  const { progress, progressCalls } = await load({
    signedIn: true,
    rows: [{
      activity_key: "week2-session1-retrieval",
      latest_score: 7,
      max_score: 10,
      attempt_count: 2,
      latest_attempt_at: "2026-08-12T12:00:00.000Z"
    }]
  });
  const state = progress.getActivityState("week2-session1-retrieval");
  assert.equal(state.status, "completed");
  assert.equal(state.progressSource, "backend");
  assert.equal(state.score, 7);
  assert.equal(state.attempts, 2);
  assert.equal(state.submitted, true);
  assert.equal(progressCalls(), 1);
});

test("duplicate authenticated reconcile does not repeat getProgress", async () => {
  const { adapter, progressCalls } = await load({
    signedIn: true,
    rows: [{ activity_key: "week2-session1-retrieval", latest_score: 7, max_score: 10, attempt_count: 1 }]
  });
  assert.equal(progressCalls(), 1);
  await adapter.reconcile();
  assert.equal(progressCalls(), 1);
  await adapter.reconcile({ force: true });
  assert.equal(progressCalls(), 2);
});

test("first signed-in reconcile hydrates only loaded week carriers once", async () => {
  const { weekHydrates, adapter } = await load({
    signedIn: true,
    rows: [{ activity_key: "week2-session1-retrieval", latest_score: 7, max_score: 10, attempt_count: 1 }]
  });
  assert.deepEqual(weekHydrates, ["unit3-week2-progress"]);
  await adapter.reconcile();
  await adapter.reconcile({ force: true });
  assert.deepEqual(weekHydrates, ["unit3-week2-progress"]);
});

function weekStore(rootKey) {
  return {
    ROOT_KEY: rootKey,
    ACTIVITY_CATALOG: [],
    getActivityState() { return {}; },
    updateActivity() { return {}; },
    markCompleted() { return {}; },
    markSubmitted() { return {}; }
  };
}

test("skip path hydrates a newly loaded week without repeating getProgress", async () => {
  const { adapter, progressCalls, weekHydrates, window } = await load({
    signedIn: true,
    rows: [{ activity_key: "week2-session1-retrieval", latest_score: 7, max_score: 10, attempt_count: 1 }]
  });
  window.Unit3Week4Progress = weekStore("unit3-week4-progress");
  await adapter.reconcile();
  assert.equal(progressCalls(), 1);
  assert.deepEqual(weekHydrates, ["unit3-week2-progress", "unit3-week4-progress"]);
  await adapter.reconcile();
  assert.equal(progressCalls(), 1);
  assert.deepEqual(weekHydrates, ["unit3-week2-progress", "unit3-week4-progress"]);
});

test("revisiting an already hydrated week does not issue another carrier hydrate", async () => {
  const { adapter, weekHydrates, window } = await load({
    signedIn: true,
    rows: [{ activity_key: "week2-session1-retrieval", latest_score: 7, max_score: 10, attempt_count: 1 }]
  });
  window.Unit3Week4Progress = weekStore("unit3-week4-progress");
  await adapter.reconcile();
  await adapter.reconcile();
  assert.deepEqual(weekHydrates, ["unit3-week2-progress", "unit3-week4-progress"]);
});

test("sign-out clears week hydrate intern and sign-in hydrates the loaded week again", async () => {
  const { adapter, weekHydrates, authListener } = await load({
    signedIn: true,
    rows: [{ activity_key: "week2-session1-retrieval", latest_score: 7, max_score: 10, attempt_count: 1 }]
  });
  assert.deepEqual(weekHydrates, ["unit3-week2-progress"]);
  authListener({ status: "signed-out" });
  authListener({ status: "authenticated" });
  await adapter.reconcile();
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(weekHydrates, ["unit3-week2-progress", "unit3-week2-progress"]);
});

test("compatibility carrier keys remain for weeks 2-7", () => {
  const remote = fs.readFileSync(path.resolve(__dirname, "..", "js/core/remote-learner-work.js"), "utf8");
  [
    "week2-northbank-vulnerability-register",
    "week2-ocr-question-practice",
    "week3-peer-marking",
    "week3-ocr-question-practice",
    "week4-analyse-practice",
    "week4-ocr-question-practice",
    "week5-impact-analysis",
    "week5-ocr-question-practice",
    "week6-revision-organiser",
    "week6-ocr-question-practice",
    "week7-heightened-threat",
    "week7-ocr-question-practice"
  ].forEach((key) => {
    assert.match(remote, new RegExp(key));
  });
});
