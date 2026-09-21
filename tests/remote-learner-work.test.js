const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key)
  };
}

function load({ signedIn = true, saves = [] } = {}) {
  const window = {
    localStorage: createStorage(),
    LearningPlatform: {
      platform: {
        auth: { isSignedIn: () => signedIn },
        progress: {
          createStore({ activityKey, legacyKeys }) {
            return {
              save(payload, options) {
                saves.push({ activityKey, payload, options, legacyKeys });
              },
              async hydrate(local) {
                return local || { responses: {}, checked: {}, localKeys: {} };
              }
            };
          }
        }
      }
    },
    Unit3ActivityKeyMap: {
      normaliseActivityKey: (value) => String(value || "").toLowerCase(),
      normaliseActivityVersion: () => "1.1.0"
    }
  };
  vm.runInContext(
    fs.readFileSync(path.resolve(__dirname, "..", "js/core/remote-learner-work.js"), "utf8"),
    vm.createContext({
      window,
      global: window,
      Date,
      Math,
      Object,
      JSON,
      Promise,
      setTimeout,
      clearTimeout
    })
  );
  return { api: window.Unit3RemoteLearnerWork, saves, storage: window.localStorage };
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setImmediate(resolve));
}

test("Weeks 2-7 notes persist onto published host carriers without submitting", async () => {
  const saves = [];
  const { api } = load({ saves });
  api.persistStorageKey("unit3-week3-attacker-research-profile", "week3-directed-study", {
    field: "C"
  });
  await api.flushPending();
  await flush();
  assert.ok(saves.length >= 1);
  assert.ok(saves.every((row) => (
    row.activityKey === "week3-peer-marking" || row.activityKey === "week3-ocr-question-practice"
  )));
  assert.ok(saves.every((row) => row.activityKey !== "week3-directed-study"));
  assert.equal(saves[0].payload.localKeys["unit3-week3-attacker-research-profile"].field, "C");
  assert.equal(saves[0].payload.completed, false);
  assert.equal(saves[0].options.immediate, true);
  const restored = await api.restoreStorageKey(
    "unit3-week3-attacker-research-profile",
    "week3-directed-study"
  );
  assert.equal(restored.field, "C");
});

test("Retry replaces the stored note instead of appending", async () => {
  const saves = [];
  const { api } = load({ saves });
  api.persistStorageKey("unit3-week3-attacker-research-profile", "week3-peer-marking", { field: "A" });
  await api.flushPending();
  await flush();
  api.persistStorageKey("unit3-week3-attacker-research-profile", "week3-peer-marking", { field: "C" });
  await api.flushPending();
  await flush();
  const latest = saves[saves.length - 1];
  assert.equal(latest.payload.localKeys["unit3-week3-attacker-research-profile"].field, "C");
  assert.equal(Object.keys(latest.payload.localKeys).length, 1);
});

test("unpublished activity ids are not treated as persistable catalogue keys", () => {
  const { api } = load();
  assert.equal(api.publishedActivityKey("week3-directed-study"), "");
  assert.equal(api.publishedActivityKey("unit3-week2-tryhackme-progress"), "");
  assert.equal(api.publishedActivityKey("week3-peer-marking"), "week3-peer-marking");
  assert.equal(
    api.publishedActivityKey("unit3-week2-northbank-vulnerability-register"),
    "week2-northbank-vulnerability-register"
  );
});

test("backend-progress persist hook does not call submit_attempt", () => {
  const source = fs.readFileSync(path.resolve(__dirname, "..", "js/core/backend-progress.js"), "utf8");
  assert.match(source, /Unit3RemoteLearnerWork/);
  assert.match(source, /hydrateProgressDrafts|hydrateWeekRoot/);
  assert.doesNotMatch(source, /submit_attempt|submitAttempt|submitResult/);
});

test("Week 3 directed-study notes use remote persist", () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, "..", "week-3/directed-study/app.js"),
    "utf8"
  );
  assert.match(source, /persistStorageKey/);
  assert.match(source, /restoreStorageKey/);
  assert.doesNotMatch(source, /submit_attempt/);
});

test("Weeks 4-7 directed-study restore before render", () => {
  ["week-4", "week-5", "week-6", "week-7"].forEach((week) => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "..", week, "directed-study/app.js"),
      "utf8"
    );
    assert.match(source, /persistStorageKey/);
    assert.match(source, /restoreStorageKey/);
    assert.doesNotMatch(source, /submit_attempt/);
  });
});

function weekProgress(drafts = {}, activities = {}) {
  return {
    ROOT_KEY: "unit3-week3-progress",
    ACTIVITY_CATALOG: [],
    getRoot() {
      return { drafts, activities };
    }
  };
}

test("one logical edit coalesces updateActivity and setDraft onto two carriers", async () => {
  const saves = [];
  const { api } = load({ saves });
  const progress = weekProgress(
    { "week3-peer-marking": { answer: "A" } },
    { "week3-peer-marking": { status: "in-progress" } }
  );
  api.persistWeekRoot(progress, "week3-peer-marking");
  api.persistWeekRoot(progress, "week3-peer-marking");
  assert.equal(saves.length, 0);
  await api.flushPending();
  await flush();
  assert.equal(saves.length, 2);
  assert.ok(saves.every((row) => (
    row.activityKey === "week3-peer-marking" || row.activityKey === "week3-ocr-question-practice"
  )));
  assert.ok(saves.every((row) => row.options.immediate === true));
  assert.equal(saves[0].payload.weekRoot.drafts["week3-peer-marking"].answer, "A");
});

test("rapid identical note edits persist once per carrier after flush", async () => {
  const saves = [];
  const { api } = load({ saves });
  api.persistStorageKey("unit3-week3-attacker-research-profile", "week3-peer-marking", { field: "same" });
  api.persistStorageKey("unit3-week3-attacker-research-profile", "week3-peer-marking", { field: "same" });
  api.persistStorageKey("unit3-week3-attacker-research-profile", "week3-peer-marking", { field: "same" });
  await api.flushPending();
  await flush();
  assert.equal(saves.length, 2);
  assert.equal(saves[0].payload.localKeys["unit3-week3-attacker-research-profile"].field, "same");
});

test("reload restores drafts and completed activity extras from carrier state", async () => {
  const saves = [];
  const { api, storage } = load({ saves });
  const progress = weekProgress(
    { "week3-peer-marking": { answer: "kept" } },
    { "week3-peer-marking": { status: "completed", extra: { localCompleted: true } } }
  );
  api.persistWeekRoot(progress, "week3-peer-marking");
  await api.flushPending();
  await flush();
  const restored = await api.restoreStorageKey(
    "unit3-week3-attacker-research-profile",
    "week3-peer-marking"
  );
  assert.equal(typeof restored, "object");
  assert.equal(storage.getItem("unit3-week3-attacker-research-profile") !== null, true);
  const peer = saves.find((row) => row.activityKey === "week3-peer-marking");
  assert.equal(peer.payload.weekRoot.activities["week3-peer-marking"].status, "completed");
  assert.equal(peer.payload.weekRoot.drafts["week3-peer-marking"].answer, "kept");
});

test("pagehide flushes pending carrier writes", async () => {
  const saves = [];
  const listeners = {};
  const window = {
    localStorage: createStorage(),
    addEventListener(type, handler) { listeners[type] = handler; },
    LearningPlatform: {
      platform: {
        auth: { isSignedIn: () => true },
        progress: {
          createStore({ activityKey, legacyKeys }) {
            return {
              save(payload, options) {
                saves.push({ activityKey, payload, options, legacyKeys });
              },
              async hydrate(local) {
                return local || { responses: {}, checked: {}, localKeys: {} };
              }
            };
          }
        }
      }
    },
    Unit3ActivityKeyMap: {
      normaliseActivityKey: (value) => String(value || "").toLowerCase(),
      normaliseActivityVersion: () => "1.1.0"
    }
  };
  vm.runInContext(
    fs.readFileSync(path.resolve(__dirname, "..", "js/core/remote-learner-work.js"), "utf8"),
    vm.createContext({
      window,
      global: window,
      Date,
      Math,
      Object,
      JSON,
      Promise,
      setTimeout,
      clearTimeout
    })
  );
  window.Unit3RemoteLearnerWork.persistStorageKey(
    "unit3-week3-attacker-research-profile",
    "week3-peer-marking",
    { field: "leave" }
  );
  assert.equal(saves.length, 0);
  listeners.pagehide();
  await flush();
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.ok(saves.length >= 1);
  assert.equal(saves[0].payload.localKeys["unit3-week3-attacker-research-profile"].field, "leave");
});

