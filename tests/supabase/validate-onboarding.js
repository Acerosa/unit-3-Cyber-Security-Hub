/** Focused headless tests for secure learner onboarding state and API calls. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..", "..");
const items = new Map();
const sessionStorage = {
  getItem(key) { return items.has(key) ? items.get(key) : null; },
  setItem(key, value) { items.set(key, String(value)); },
  removeItem(key) { items.delete(key); }
};

let signedIn = false;
let optionCalls = 0;
let onboardingBody = null;
let refreshCalls = 0;

const sandboxWindow = {
  sessionStorage,
  SupabaseAuth: {
    isSignedIn() { return signedIn; },
    refreshContext() { refreshCalls += 1; return Promise.resolve(); }
  },
  SupabaseLearningApi: {
    getRegistrationOptions() {
      optionCalls += 1;
      return Promise.resolve([{
        registration_option: "unit3-year-1",
        academic_year: "2026-27",
        year_group: "Year 1",
        course_key: "ocr-level-3-it",
        course_title: "OCR Level 3 IT",
        group_code: "U3-Y1",
        group_name: "Unit 3 Year 1",
        group_id: "must-not-leak"
      }]);
    },
    completeLearnerOnboarding(body) {
      onboardingBody = body;
      return Promise.resolve([{
        student_number: "001234",
        first_name: "Ada",
        surname: "Lovelace"
      }]);
    }
  }
};

const context = vm.createContext({ window: sandboxWindow, console, Promise });
const source = fs.readFileSync(
  path.join(root, "js/core/supabase-onboarding.js"),
  "utf8"
);
vm.runInContext(source, context, { filename: "supabase-onboarding.js" });
const onboarding = sandboxWindow.SupabaseOnboarding;

async function run() {
  assert.equal(onboarding.validateProfile({
    firstName: "Ada",
    surname: "Lovelace",
    studentNumber: "001234"
  }).value.studentNumber, "001234", "leading zeroes are preserved as text");

  assert.equal(onboarding.validateAccount({
    email: "ada@college.invalid",
    password: "password-one",
    confirmPassword: "different"
  }).code, "PASSWORD_MISMATCH", "password mismatch blocks signup validation");

  onboarding.savePending({
    firstName: " Ada ",
    surname: " Lovelace ",
    studentNumber: "001234",
    email: "must-not-store@college.invalid",
    password: "must-not-store",
    accessToken: "must-not-store"
  });
  const stored = sessionStorage.getItem(onboarding.PENDING_KEY);
  assert.deepEqual(
    JSON.parse(stored),
    { firstName: "Ada", surname: "Lovelace", studentNumber: "001234" },
    "pending state contains profile fields only"
  );

  await assert.rejects(
    onboarding.getRegistrationOptions(),
    (error) => error.code === "AUTH_REQUIRED"
  );
  assert.equal(optionCalls, 0, "registration options are not requested while signed out");

  signedIn = true;
  const options = await onboarding.getRegistrationOptions();
  assert.equal(optionCalls, 1, "registration options are requested after authentication");
  assert.equal(options[0].registrationKey, "unit3-year-1");
  assert.equal(Object.hasOwn(options[0], "groupId"), false, "internal group IDs are not exposed");

  await onboarding.complete(onboarding.getPending(), options[0].registrationKey);
  assert.deepEqual(JSON.parse(JSON.stringify(onboardingBody)), {
    p_first_name: "Ada",
    p_surname: "Lovelace",
    p_student_number: "001234",
    p_registration_option: "unit3-year-1"
  }, "onboarding sends only profile fields and the safe registration key");
  assert.equal(sessionStorage.getItem(onboarding.PENDING_KEY), null,
    "successful onboarding clears pending state");
  assert.equal(refreshCalls, 1, "successful onboarding reloads profile and enrolment context");

  const mapped = onboarding.mapError({ message: "STUDENT_NUMBER_ALREADY_LINKED" });
  assert.equal(mapped.code, "STUDENT_NUMBER_ALREADY_LINKED");
  assert.match(mapped.learnerMessage, /already linked/i);

  console.log("All 12 focused learner onboarding checks passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
