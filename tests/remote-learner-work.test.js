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
    vm.createContext({ window, global: window, Date, Math, Object, JSON, Promise })
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
  await flush();
  api.persistStorageKey("unit3-week3-attacker-research-profile", "week3-peer-marking", { field: "C" });
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
