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
  const window = {
    Unit3BackendMode: { isSupabase() { return true; } },
    Unit3ActivityKeyMap: { normaliseActivityKey(value) { return value; } },
    Unit3Week2Progress: progress,
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
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
  return { progress, adapter: window.Unit3BackendProgress, progressCalls: () => progressCalls };
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
