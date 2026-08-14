const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const inventory = JSON.parse(fs.readFileSync(path.join(projectRoot, "test/fixtures/route-inventory.json"), "utf8"));
const routeFiles = inventory.routes.map((route) => route.route);

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

test("the committed inventory lists every learner-facing public route", function () {
  assert.equal(routeFiles.length, 94);
  assert.equal(inventory.routes.filter((route) => route.view === "week").length, 7);
  assert.equal(inventory.routes.filter((route) => route.view === "week1-activity").length, 1);
  assert.equal(inventory.routes.some((route) => route.route === "activities/activity.html"), true);
  routeFiles.forEach(function (route) {
    assert.equal(fs.existsSync(path.join(projectRoot, route)), true, route);
  });
});

test("all GitHub Pages routes are Vite shells that mount the React hub", function () {
  routeFiles.forEach(function (route) {
    const html = read(route);
    assert.match(html, /id="root"/);
    assert.match(html, /type="module"/);
    assert.match(html, /src\/main\.tsx/);
    assert.match(html, /theme-bootstrap\.js\?v=2/);
    assert.match(html, /id="unit3-page-body"/);
    assert.ok(html.indexOf("theme-bootstrap.js") < html.indexOf('type="module"'));
    assert.doesNotMatch(html, /learning-platform-core\.iife\.js/);
    assert.doesNotMatch(html, /cdn\.jsdelivr\.net/);
  });
  const main = read("src/main.tsx");
  assert.match(main, /@learning-platform\/core\/theme\.css/);
  assert.match(main, /from "\.\/App"/);
});

test("APP_CONFIG navigation is the single learner IA", function () {
  const config = read("src/config.ts") + read("js/config/app-config.js");
  ["Home", "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Resources", "Help", "Account"]
    .forEach(function (label) {
      assert.match(config, new RegExp(label));
    });
  assert.match(read("src/platform.ts"), /navigationMode:\s*"as-supplied"/);
  assert.match(read("src/App.tsx"), /resolveHref/);
  assert.match(read("src/page-copy.ts"), /path:/);
});

test("Week 1 activity.html keeps the activityId query contract", function () {
  const html = read("activities/activity.html");
  assert.match(html, /data-view="week1-activity"/);
  assert.match(html, /data-activity-id="U3-W01-COMMAND-WORDS"/);
  assert.match(read("src/page-context.ts"), /activityId/);
  assert.match(read("src/page-context.ts"), /URLSearchParams/);
  assert.match(read("js/core/backend-mode.js"), /isWeek1ActivityApiPage/);
});
