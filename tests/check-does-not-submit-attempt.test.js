const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const engine = fs.readFileSync(path.resolve(__dirname, "..", "js/activity-engine.js"), "utf8");
const week1Submit = fs.readFileSync(path.resolve(__dirname, "..", "js/core/week1-final-submit.js"), "utf8");
const activityPage = fs.readFileSync(path.resolve(__dirname, "..", "src/pages/ActivityPage.tsx"), "utf8");
const draft = fs.readFileSync(path.resolve(__dirname, "..", "src/catalogue/activity-draft.ts"), "utf8");

test("Week 1 section Check does not call submit_attempt", () => {
  const checkHandler = engine.slice(
    engine.indexOf("function handleMarkSection"),
    engine.indexOf("function showSubmissionResult")
  );
  assert.match(checkHandler, /markSection/);
  assert.match(checkHandler, /setChecked/);
  assert.doesNotMatch(checkHandler, /submitFinal|submitAttempt|submit_attempt|submitActivityDraft/);
});

test("Week 1 explicit Submit your result is the attempt boundary", () => {
  assert.match(engine, /ae-btn-submit/);
  assert.match(engine, /submitFinal/);
  assert.match(week1Submit, /api\.submit_attempt|runner\.submit/);
  assert.match(engine, /addEventListener\('click', handleSubmit\)/);
});

test("Catalogue Check persists without submitting", () => {
  assert.match(activityPage, /persistCatalogueDraft/);
  assert.match(activityPage, /initialResponses=\{initialDraft\.responses\}/);
  assert.match(activityPage, /initialChecked=\{initialDraft\.checked\}/);
  assert.match(activityPage, /Finish activity/);
  assert.match(activityPage, /finishActivity/);
  const checkPath = activityPage.slice(
    activityPage.indexOf("const recordPracticeResult"),
    activityPage.indexOf("const finishActivity")
  );
  assert.doesNotMatch(checkPath, /submitCatalogueDraft|submission\.submit/);
});

test("Catalogue Finish is the only submitCatalogueDraft caller in ActivityPage", () => {
  const finish = activityPage.slice(activityPage.indexOf("const finishActivity"));
  assert.match(finish, /submitCatalogueDraft/);
  const matches = activityPage.match(/submitCatalogueDraft/g) || [];
  assert.equal(matches.length, 2);
});

test("Catalogue draft save never marks the activity completed", () => {
  assert.match(draft, /completed:\s*false/);
  assert.match(draft, /submitCatalogueDraft/);
});
