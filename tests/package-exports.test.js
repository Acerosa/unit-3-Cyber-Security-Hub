const assert = require("node:assert/strict");
const test = require("node:test");

test("shared package exports resolve for week visibility migration", async () => {
  const core = await import("@learning-platform/core/curriculum-runtime");
  const ui = await import("@learning-platform/ui");

  assert.equal(typeof core.isWeekAvailable, "function");
  assert.equal(typeof core.overlayLiveWeekMetadata, "function");
  assert.equal(typeof core.weeksFromPublication, "function");
  assert.equal(typeof ui.WeekAccessLink, "function");
  assert.equal(typeof ui.WeekAccessGuard, "function");
});
