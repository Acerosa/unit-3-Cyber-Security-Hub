const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

test("Week 6 registry and legal-content checks pass against host data objects", () => {
  const sandbox = { window: {}, globalThis: {}, console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  const context = vm.createContext(sandbox);
  const files = [
    "js/course-context.js",
    "js/activity-engine-config.js",
    "js/week5-progress.js",
    "js/week6-progress.js",
    "week-6/data/lo2-diagnostic.js",
    "week-6/data/ethical-learning.js",
    "week-6/data/ethical-classification.js",
    "week-6/data/legislation-learning.js",
    "week-6/data/legislation-matching.js",
    "week-6/data/operational-considerations.js",
    "week-6/data/government-initiatives.js",
    "week-6/data/ncsc-guidance.js",
    "week-6/data/exercise-decision-record.js",
    "week-6/data/session1-review.js",
    "week-6/data/legislation-retrieval.js",
    "week-6/data/employee-monitoring.js",
    "week-6/data/stakeholder-debate.js",
    "week-6/data/discuss-learning.js",
    "week-6/data/discuss-planner.js",
    "week-6/data/ocr-practice.js",
    "week-6/data/answer-improvement.js",
    "week-6/data/revision-organiser.js",
    "week-6/data/directed-study.js",
    "week-6/data/support-challenge.js",
    "week-6/tests/validate-registry.js"
  ];
  files.forEach((file) => {
    vm.runInContext(read(file), context, { filename: file });
  });
  const results = context.Unit3Week6Tests.runWeek6RegistryTests();
  const failed = results.filter((item) => !item.ok);
  assert.equal(
    failed.length,
    0,
    failed.map((item) => `${item.name}: ${item.detail}`).join("\n")
  );
  assert.ok(results.length >= 18);
});
