/**
 * Academic integrity paste-block smoke checks.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");

test("academic-integrity blocks paste on host textareas and skips catalogue fields", function () {
  const source = fs.readFileSync(path.join(root, "js/academic-integrity.js"), "utf8");
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /Paste is disabled/);
  assert.match(source, /data-lp-block="short-response"/);
  assert.match(source, /addEventListener\('drop'/);

  const inventory = JSON.parse(
    fs.readFileSync(path.join(root, "test/fixtures/route-inventory.json"), "utf8")
  );
  assert.ok(
    inventory.sharedAdapters.includes("js/academic-integrity.js"),
    "React hub must load academic-integrity via sharedAdapters"
  );
});

test("northbank-exposure mounts library LearningTextField fields", function () {
  const source = fs.readFileSync(
    path.join(root, "week-4/northbank-exposure/app.js"),
    "utf8"
  );
  assert.match(source, /MIN_CHARS\s*=\s*80/);
  assert.match(source, /Unit3LearningText/);
  assert.match(source, /\.mount\(/);
  assert.doesNotMatch(source, /createElement\('textarea'\)/);
});
