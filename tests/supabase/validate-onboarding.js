/** Focused headless checks for Core-owned learner onboarding. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..", "..");
const storageItems = new Map();
const storage = {
  getItem(key) { return storageItems.has(key) ? storageItems.get(key) : null; },
  setItem(key, value) { storageItems.set(key, String(value)); },
  removeItem(key) { storageItems.delete(key); }
};

function loadCore() {
  const sandbox = { console, URL, Date, setTimeout, clearTimeout };
  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(
      root,
      "vendor/learning-platform-core/0.2.0/learning-platform-core.iife.js"
    ), "utf8"),
    sandbox
  );
  return sandbox.LearningPlatformCore;
}

function fakeClient({ session, rpcs }) {
  return {
    auth: {
      onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
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
        rpc(name, payload) {
          return Promise.resolve({ data: rpcs(name, payload), error: null });
        }
      };
    }
  };
}

async function run() {
  const calls = [];
  const core = loadCore();
  const platform = core.createPlatform({
    hubCode: "unit-3-cyber-security",
    hubName: "Unit 3 Cyber Security Hub",
    supabase: {
      projectUrl: "https://example.supabase.co",
      publishableKey: "sb_publishable_example"
    }
  }, {
    supabaseClient: fakeClient({
      session: null,
      rpcs() { return []; }
    }),
    sessionStorage: storage,
    document: null,
    window: null
  });
  const onboarding = platform.onboarding;

  assert.equal(onboarding.validateProfile({
    firstName: "Ada",
    surname: "Lovelace",
    studentNumber: "001234"
  }).value.studentNumber, "001234");
  assert.equal(onboarding.validateAccount({
    email: "ada@college.invalid",
    password: "password-one"
  }).ok, true);

  onboarding.savePending({
    firstName: " Ada ",
    surname: " Lovelace ",
    studentNumber: "001234",
    password: "must-not-store",
    accessToken: "must-not-store"
  });
  assert.deepEqual(JSON.parse(storage.getItem(onboarding.pendingKey)), {
    firstName: "Ada",
    surname: "Lovelace",
    studentNumber: "001234"
  });

  await assert.rejects(
    onboarding.getRegistrationOptions(),
    (error) => error.code === "AUTH_REQUIRED"
  );
  assert.equal(calls.length, 0);
  platform.destroy();

  const signedIn = core.createPlatform({
    hubCode: "unit-3-cyber-security",
    hubName: "Unit 3 Cyber Security Hub",
    supabase: {
      projectUrl: "https://example.supabase.co",
      publishableKey: "sb_publishable_example"
    }
  }, {
    supabaseClient: fakeClient({
      session: { user: { id: "auth-user" }, access_token: "managed" },
      rpcs(name, payload) {
        if (name === "registration_options") {
          calls.push({ operation: "options" });
          return [{
            registration_option: "unit3-year-1",
            academic_year: "2026-27",
            year_group: "Year 1",
            course_title: "OCR Level 3 IT",
            group_code: "U3-Y1",
            group_name: "Unit 3 Year 1",
            group_id: "must-not-leak"
          }];
        }
        if (name === "complete_learner_onboarding") {
          calls.push({ operation: "complete", payload });
          return [{ student_number: "001234" }];
        }
        return [];
      }
    }),
    sessionStorage: storage,
    document: null,
    window: null
  });
  await signedIn.initialise();
  const options = await signedIn.onboarding.getRegistrationOptions();
  assert.equal(options.length, 1);
  assert.equal(options[0].registrationKey, "unit3-year-1");
  assert.equal(Object.hasOwn(options[0], "groupId"), false);

  await signedIn.onboarding.complete(signedIn.onboarding.getPending(), options[0].registrationKey);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[1].payload)), {
    p_first_name: "Ada",
    p_surname: "Lovelace",
    p_student_number: "001234",
    p_registration_option: "unit3-year-1"
  });
  assert.equal(storage.getItem(signedIn.onboarding.pendingKey), null);
  signedIn.destroy();

  console.log("All 12 focused Core onboarding checks passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
