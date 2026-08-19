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

test("hub CSS applies dark-theme tokens to page surfaces, not only the navigation chrome", function () {
  const main = read("css/main.css");
  assert.match(main, /html\[data-theme="dark"\]/);
  assert.match(main, /--color-heading/);
  assert.match(main, /--color-surface-muted/);
  assert.match(main, /--lp-background:\s*var\(--color-bg\)/);
  assert.match(main, /--lp-text:\s*var\(--color-text\)/);
  assert.match(main, /\.lp-shell\s*\{[\s\S]*color:\s*var\(--color-text\)/);
  assert.match(main, /\.panel h2[\s\S]*color:\s*var\(--color-heading\)/);
  assert.match(main, /\.lp-navigation\s*\{[\s\S]*background:\s*var\(--color-navy\)/);
});

test("the home page uses a Unit 14-style welcome and start-card layout", function () {
  const html = read("index.html");
  assert.match(html, /<h2 id="start-heading">Where to start<\/h2>/);
  assert.doesNotMatch(html, /start-heading" class="visually-hidden"/);
  assert.doesNotMatch(html, /home-start-grid/);
  assert.doesNotMatch(html, /home-primary-card/);
  assert.match(html, /<h3>Week 1<\/h3>/);
  assert.match(html, />Open Week 1</);
  assert.match(html, /class="home-week-scroller"/);
  const main = read("css/main.css");
  assert.match(main, /repeat\(auto-fit, minmax\(min\(100%, 16rem\), 1fr\)\)/);
  assert.match(main, /\.home-week-scroller[\s\S]*overflow-y:\s*auto/);
  assert.match(main, /\.home-week-scroller[\s\S]*\(--home-week-row\) \* 2/);
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

test("activity engine cards follow hub theme tokens instead of hardcoded white", function () {
  const css = read("css/activity-engine.css");
  assert.match(css, /\.ae-content-block[\s\S]*background:\s*var\(--color-surface-muted\)/);
  assert.match(css, /\.ae-question \{[\s\S]*background:\s*var\(--color-surface-muted\)/);
  assert.match(css, /\.ae-choice \{[\s\S]*background:\s*var\(--color-input-bg\)/);
  assert.doesNotMatch(css, /background:\s*#fff\b/);
  assert.match(read("css/main.css"), /--color-input-bg/);
});

test("learner-facing activity copy does not mention API, TEST mode or marking path", function () {
  const learnerFiles = [
    "src/pages/ActivityPage.tsx",
    "src/page-copy.ts",
    "activities/activity.html",
    "js/activity-engine.js",
    "js/activity-renderer.js"
  ].map(read).join("\n");
  assert.doesNotMatch(learnerFiles, /Week 1 Activity API/);
  assert.doesNotMatch(learnerFiles, /marking path/);
  assert.doesNotMatch(learnerFiles, /Submit TEST/);
  assert.doesNotMatch(learnerFiles, /TEST mode/);
  assert.doesNotMatch(learnerFiles, /LIVE submissions/);
  assert.match(read("src/pages/ActivityPage.tsx"), /Formative activity/);
  assert.match(read("activities/activity.html"), /Submit your result/);
});

test("Week 1 activity.html keeps the activityId query contract", function () {
  const html = read("activities/activity.html");
  assert.match(html, /data-view="week1-activity"/);
  assert.match(html, /data-activity-id="U3-W01-COMMAND-WORDS"/);
  assert.match(read("src/page-context.ts"), /activityId/);
  assert.match(read("src/page-context.ts"), /URLSearchParams/);
  assert.match(read("js/core/backend-mode.js"), /isWeek1ActivityApiPage/);
});
