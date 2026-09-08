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

function load({ progress, signedIn = true, storage } = {}) {
  const window = {
    localStorage: storage || createStorage(),
    sessionStorage: createStorage(),
    crypto: { randomUUID: () => "attempt-1" },
    Unit3ActivityEngineConfig: { ACTIVITY_ENGINE_CONFIG: { stateStorage: "local" } },
    Unit3ActivityKeyMap: { normaliseActivityKey: (value) => value },
    LearningPlatform: {
      platform: {
        auth: {
          isSignedIn: () => signedIn,
          getSession: () => (signedIn ? { user: { id: "auth-user" } } : null)
        },
        progress
      }
    }
  };
  vm.runInContext(
    fs.readFileSync(path.resolve(__dirname, "..", "js/activity-state.js"), "utf8"),
    vm.createContext({ window, global: window, Date, Math, Object, JSON, Promise, encodeURIComponent })
  );
  return window.Unit3ActivityState;
}

test("Unit 3 restores in-progress answers from the shared progress API", async () => {
  const api = load({
    progress: {
      createStore() {
        return {
          async hydrate() {
            return {
              responses: { Q1: "a", Q2: "b", Q3: "c" },
              markedSections: { s1: { checked: true } },
              attemptId: "server-attempt"
            };
          },
          save() {}
        };
      }
    }
  });
  const state = api.load("U3-W01-CIA");
  state.activityVersion = "1.0.0";
  const restored = await api.hydrate(state);
  assert.equal(restored.responses.Q1, "a");
  assert.equal(restored.responses.Q3, "c");
  assert.equal(restored.markedSections.s1.checked, true);
});

test("Unit 3 keeps local answers when the network save fails", async () => {
  const storage = createStorage();
  const api = load({
    storage,
    progress: {
      createStore() {
        return {
          async hydrate(local) { return local; },
          save() { throw new Error("offline"); }
        };
      }
    }
  });
  const state = api.load("U3-W01-CIA");
  state.activityVersion = "1.0.0";
  api.setResponse(state, "Q1", "kept");
  assert.equal(api.load("U3-W01-CIA").responses.Q1, "kept");
});

test("Unit 3 uses localStorage as cache rather than sessionStorage by default", () => {
  const source = fs.readFileSync(path.resolve(__dirname, "..", "js/activity-engine-config.js"), "utf8");
  assert.match(source, /stateStorage:\s*'local'/);
});
