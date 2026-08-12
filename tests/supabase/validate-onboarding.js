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
      "vendor/learning-platform-core/0.1.0/learning-platform-core.iife.js"
    ), "utf8"),
    sandbox
  );
  return sandbox.LearningPlatformCore;
}

async function run() {
  const calls = [];
  let signedIn = false;
  let refreshCalls = 0;
  const core = loadCore();
  const onboarding = core.createOnboardingService({
    api: {
      getRegistrationOptions() {
        calls.push({ operation: "options" });
        return Promise.resolve([{
          registration_option: "unit3-year-1",
          academic_year: "2026-27",
          year_group: "Year 1",
          course_title: "OCR Level 3 IT",
          group_code: "U3-Y1",
          group_name: "Unit 3 Year 1",
          group_id: "must-not-leak"
        }]);
      },
      completeOnboarding(payload) {
        calls.push({ operation: "complete", payload });
        return Promise.resolve([{ student_number: "001234" }]);
      }
    },
    authService: { isSignedIn() { return signedIn; } },
    learnerContext: {
      refresh() { refreshCalls += 1; return Promise.resolve(); }
    },
    storage,
    pendingKey: "learning-platform.pending-onboarding.v1:unit-3-cyber-security"
  });

  assert.equal(onboarding.validateProfile({
    firstName: "Ada",
    surname: "Lovelace",
    studentNumber: "001234"
  }).value.studentNumber, "001234");
  assert.equal(onboarding.validateAccount({
    email: "ada@college.invalid",
    password: "password-one",
    confirmPassword: "different"
  }).code, "PASSWORD_MISMATCH");

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

  signedIn = true;
  const options = await onboarding.getRegistrationOptions();
  assert.equal(options.length, 1);
  assert.equal(options[0].registrationKey, "unit3-year-1");
  assert.equal(Object.hasOwn(options[0], "groupId"), false);

  await onboarding.complete(onboarding.getPending(), options[0].registrationKey);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[1].payload)), {
    p_first_name: "Ada",
    p_surname: "Lovelace",
    p_student_number: "001234",
    p_registration_option: "unit3-year-1"
  });
  assert.equal(storage.getItem(onboarding.pendingKey), null);
  assert.equal(refreshCalls, 1);

  console.log("All 12 focused Core onboarding checks passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
