const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const requireFromHub = createRequire(path.join(root, "package.json"));

test("shared package exports resolve for week visibility migration", async () => {
  const core = await import("@learning-platform/core/curriculum-runtime");

  assert.equal(typeof core.isWeekAvailable, "function");
  assert.equal(typeof core.overlayLiveWeekMetadata, "function");
  assert.equal(typeof core.weeksFromPublication, "function");

  const uiPackagePath = requireFromHub.resolve("@learning-platform/ui/package.json");
  const uiPackage = JSON.parse(fs.readFileSync(uiPackagePath, "utf8"));
  const uiTypesPath = path.join(path.dirname(uiPackagePath), "dist", "index.d.ts");
  const uiTypes = fs.readFileSync(uiTypesPath, "utf8");

  assert.match(uiPackage.version, /^0\.1\.(6|[7-9]|\d{2,})/);
  assert.match(uiTypes, /export \{ WeekAccessLink \}/);
  assert.match(uiTypes, /export \{ WeekAccessGuard \}/);
});
