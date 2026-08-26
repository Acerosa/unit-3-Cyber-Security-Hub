/**
 * Host free-text mounts library LearningTextField (option B).
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");

const WAVE_HOST_APPS = [
  "week-2/northbank-analysis/app.js",
  "week-2/ocr-practice/app.js",
  "week-2/peer-marking/app.js",
  "week-2/vulnerability-register/app.js",
  "week-2/vulnerabilities101/app.js",
  "week-3/ocr-practice/app.js",
  "week-3/peer-marking/app.js",
  "week-4/northbank-exposure/app.js",
  "week-4/analyse-practice/app.js",
  "week-4/answer-improvement/app.js",
  "week-4/mtm-mapping/app.js",
  "week-4/ocr-practice/app.js",
  "week-5/impact-analysis/app.js",
  "week-5/answer-improvement/app.js",
  "week-5/ransomware-companion/app.js",
  "week-5/stakeholder-grid/app.js",
  "week-5/ocr-practice/app.js",
  "week-6/discuss-planner/app.js",
  "week-6/stakeholder-debate/app.js",
  "week-6/revision-organiser/app.js",
  "week-6/answer-improvement/app.js",
  "week-6/exercise-decision-record/app.js",
  "week-6/ocr-practice/app.js",
  "week-7/answer-improvement/app.js",
  "week-7/ocr-practice/app.js",
  "week-7/risk-register/app.js",
  "week-7/heightened-threat/app.js"
];

test("wave host apps mount Unit3LearningText instead of plain learning textareas", function () {
  for (const relative of WAVE_HOST_APPS) {
    const source = fs.readFileSync(path.join(root, relative), "utf8");
    assert.match(
      source,
      /Unit3LearningText/,
      relative + " must use Unit3LearningText"
    );
    assert.match(
      source,
      /createMounts/,
      relative + " must use createMounts()"
    );
  }
});
