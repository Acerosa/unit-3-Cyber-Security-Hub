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
  assert.equal(routeFiles.length, 100);
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

test("week 2 and 3 quiz engines use optionLabel instead of stringifying option objects", function () {
  ["js/week2-quiz.js", "js/week3-quiz.js"].forEach(function (file) {
    const source = read(file);
    assert.match(source, /optionLabel\(/);
    assert.doesNotMatch(source, /createTextNode\(' ' \+ option\)/);
  });
  assert.match(read("js/activity-utils.js"), /function optionLabel/);
  assert.match(read("src/curriculum/from-package.ts"), /normalizeActivityQuestions/);
});

test("GitHub Pages consumes reviewed UI 0.1.6 for catalogue chrome", function () {
  const workflow = read(".github/workflows/pages.yml");
  assert.match(workflow, /Check out reviewed UI/);
  assert.match(workflow, /Acerosa\/Acerosa-learning-platform-ui/);
  assert.match(workflow, /ref:\s*v0\.1\.6/);
  assert.match(workflow, /ref:\s*v0\.2\.1/);
});

test("Week 2 lists activities on the week page and links each activity to the next", function () {
  const weekPage = read("src/pages/WeekPage.tsx");
  assert.match(weekPage, /weekPageFromPackage/);
  assert.match(weekPage, /Open activity/);
  assert.match(weekPage, /<PageHost/);
  assert.doesNotMatch(weekPage, /InteractiveActivity/);
  assert.match(read("src/pages/ActivityPage.tsx"), /InteractiveActivity/);
  assert.match(read("src/pages/ActivityPage.tsx"), /ActivitySequenceNav/);
  assert.doesNotMatch(read("src/pages/ActivityPage.tsx"), /CataloguePilot/);
  assert.equal(fs.existsSync(path.join(projectRoot, "src/pages/CataloguePilot.tsx")), false);
  assert.doesNotMatch(read("week-2/session1-retrieval/index.html"), /url=\.\.\//);
  assert.match(read("week-2/session1-retrieval/index.html"), /data-view="activity"/);
  const inventory = read("test/fixtures/route-inventory.json");
  const catalogueOwned = [
    "week-2/session1-retrieval/index.html",
    "week-2/session2-retrieval/index.html",
    "week-2/threat-vulnerability-learning/index.html",
    "week-2/malware-symptoms/index.html",
    "week-2/threat-vulnerability-sort/index.html",
    "week-2/six-mark-guide/index.html"
  ];
  catalogueOwned.forEach((route) => {
    const chunk = inventory.split(route)[1].split('"redirectTo"')[0];
    assert.doesNotMatch(chunk, /week2-quiz\.js/);
    assert.doesNotMatch(chunk, /\/app\.js/);
  });
  const week3CatalogueOwned = [
    "week-3/session1-retrieval/index.html",
    "week-3/session2-retrieval/index.html",
    "week-3/attacker-types-learning/index.html",
    "week-3/attacker-case-matching/index.html",
    "week-3/justified-identification/index.html"
  ];
  week3CatalogueOwned.forEach((route) => {
    const chunk = inventory.split(route)[1].split('"redirectTo"')[0];
    assert.doesNotMatch(chunk, /\/app\.js/);
    assert.doesNotMatch(chunk, /week3-quiz\.js/);
  });
  const week4CatalogueOwned = [
    "week-4/session1-retrieval/index.html",
    "week-4/session2-retrieval/index.html",
    "week-4/motivations-learning/index.html",
    "week-4/targets-methods/index.html",
    "week-4/ethical-review/index.html"
  ];
  week4CatalogueOwned.forEach((route) => {
    const chunk = inventory.split(route)[1].split('"redirectTo"')[0];
    assert.doesNotMatch(chunk, /\/app\.js/);
    assert.doesNotMatch(chunk, /week4-quiz\.js/);
  });
  const week5CatalogueOwned = [
    "week-5/session1-retrieval/index.html",
    "week-5/session2-retrieval/index.html",
    "week-5/impacts-learning/index.html",
    "week-5/impact-classification/index.html",
    "week-5/exercise-debrief/index.html"
  ];
  week5CatalogueOwned.forEach((route) => {
    const chunk = inventory.split(route)[1].split('"redirectTo"')[0];
    assert.doesNotMatch(chunk, /\/app\.js/);
    assert.doesNotMatch(chunk, /week5-quiz\.js/);
  });
  assert.match(inventory.split("week-5/ransomware-companion/index.html")[1].split("week-5/session1")[0], /week-5\/ransomware-companion\/app\.js/);
  assert.match(inventory.split("week-5/stakeholder-grid/index.html")[1].split('"redirectTo"')[0], /week-5\/stakeholder-grid\/app\.js/);
  assert.match(inventory.split("week-5/impact-analysis/index.html")[1].split("week-5/impact-classification")[0], /week-5\/impact-analysis\/app\.js/);
  assert.match(inventory.split("week-5/ocr-practice/index.html")[1].split("week-5/ransomware")[0], /week-5\/ocr-practice\/app\.js/);
  const week6CatalogueOwned = [
    "week-6/lo2-diagnostic/index.html",
    "week-6/ethical-learning/index.html",
    "week-6/ethical-classification/index.html",
    "week-6/legislation-learning/index.html",
    "week-6/operational-considerations/index.html",
    "week-6/session1-review/index.html",
    "week-6/legislation-retrieval/index.html",
    "week-6/employee-monitoring/index.html"
  ];
  week6CatalogueOwned.forEach((route) => {
    const chunk = inventory.split(route)[1].split('"redirectTo"')[0];
    assert.doesNotMatch(chunk, /\/app\.js/);
    assert.doesNotMatch(chunk, /week6-quiz\.js/);
  });
  assert.match(inventory.split("week-6/legislation-matching/index.html")[1].split('"redirectTo"')[0], /week-6\/legislation-matching\/app\.js/);
  assert.match(inventory.split("week-6/government-initiatives/index.html")[1].split('"redirectTo"')[0], /week-6\/government-initiatives\/app\.js/);
  assert.match(inventory.split("week-6/ncsc-guidance/index.html")[1].split('"redirectTo"')[0], /week-6\/ncsc-guidance\/app\.js/);
  assert.match(inventory.split("week-6/discuss-learning/index.html")[1].split('"redirectTo"')[0], /week-6\/discuss-learning\/app\.js/);
  assert.match(inventory.split("week-6/discuss-planner/index.html")[1].split('"redirectTo"')[0], /week-6\/discuss-planner\/app\.js/);
  assert.match(inventory.split("week-6/ocr-practice/index.html")[1].split('"redirectTo"')[0], /week-6\/ocr-practice\/app\.js/);
  const week7CatalogueOwned = [
    "week-7/session1-retrieval/index.html",
    "week-7/risk-management-learning/index.html",
    "week-7/testing-methods/index.html",
    "week-7/sandbox-observation/index.html",
    "week-7/detection-prevention/index.html",
    "week-7/session2-retrieval/index.html",
    "week-7/testing-matching/index.html",
    "week-7/recommendation-practice/index.html"
  ];
  week7CatalogueOwned.forEach((route) => {
    const chunk = inventory.split(route)[1].split('"redirectTo"')[0];
    assert.doesNotMatch(chunk, /\/app\.js/);
    assert.doesNotMatch(chunk, /week7-quiz\.js/);
  });
  assert.match(inventory.split("week-7/risk-register/index.html")[1].split('"redirectTo"')[0], /week-7\/risk-register\/app\.js/);
  assert.match(inventory.split("week-7/heightened-threat/index.html")[1].split('"redirectTo"')[0], /week-7\/heightened-threat\/app\.js/);
  assert.match(inventory.split("week-7/ocr-practice/index.html")[1].split('"redirectTo"')[0], /week-7\/ocr-practice\/app\.js/);
  assert.match(inventory.split("week-7/answer-improvement/index.html")[1].split('"redirectTo"')[0], /week-7\/answer-improvement\/app\.js/);
  assert.match(inventory.split("week-4/mtm-mapping/index.html")[1].split("week-4/northbank")[0], /week-4\/mtm-mapping\/app\.js/);
  assert.match(inventory.split("week-4/ocr-practice/index.html")[1].split("week-4/passive-recon")[0], /week-4\/ocr-practice\/app\.js/);
  assert.match(inventory.split("week-4/analyse-practice/index.html")[1].split("week-4/answer-improvement")[0], /week-4\/analyse-practice\/app\.js/);
  assert.match(inventory.split("week-4/northbank-exposure/index.html")[1].split("week-4/ocr-practice")[0], /week-4\/northbank-exposure\/app\.js/);
  assert.match(inventory.split("week-3/ocr-practice/index.html")[1].split("week-3/peer-marking")[0], /week-3\/ocr-practice\/app\.js/);
  assert.match(inventory.split("week-3/peer-marking/index.html")[1].split("week-3/pentesting")[0], /week-3\/peer-marking\/app\.js/);
  assert.match(inventory.split("week-2/ocr-practice/index.html")[1].split("week-2/peer-marking")[0], /week-2\/ocr-practice\/app\.js/);
  assert.match(inventory.split("week-2/vulnerabilities101/index.html")[1].split("week-2/vulnerability-register")[0], /week2-tryhackme\.js/);
  assert.match(read("src/catalogue/week-activities.ts"), /CATALOGUE_WEEKS = \[1, 2, 3, 4, 5, 6, 7\]/);
  assert.match(read("src/catalogue/fallback.tsx"), /isCatalogueReactType/);
  assert.doesNotMatch(read("src/catalogue/fallback.tsx"), /Save response/);
});

test("catalogue routes never ship or inventory-load per-activity app.js", function () {
  const weekActivities = read("src/catalogue/week-activities.ts");
  const inventoryJson = JSON.parse(read("test/fixtures/route-inventory.json"));

  function parseWeekObjectMap(name) {
    const match = weekActivities.match(new RegExp(`export const ${name}[\\s\\S]*?=\\s*(\\{[\\s\\S]*?\\n\\};)`));
    assert.ok(match, name);
    const out = {};
    for (let week = 1; week <= 7; week += 1) {
      const weekMatch = match[1].match(new RegExp(`${week}:\\s*\\{([^}]*)\\}`));
      out[week] = {};
      if (!weekMatch) continue;
      for (const kv of weekMatch[1].matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
        out[week][kv[1]] = kv[2];
      }
    }
    return out;
  }

  function parseWeekIdList(name) {
    const match = weekActivities.match(new RegExp(`export const ${name}[\\s\\S]*?=\\s*(\\{[\\s\\S]*?\\n\\};)`));
    assert.ok(match, name);
    const out = {};
    for (let week = 1; week <= 7; week += 1) {
      const weekMatch = match[1].match(new RegExp(`${week}:\\s*\\[([^\\]]*)\\]`));
      out[week] = [];
      if (!weekMatch) continue;
      for (const id of weekMatch[1].matchAll(/"([^"]+)"/g)) out[week].push(id[1]);
    }
    return out;
  }

  const slugs = parseWeekObjectMap("WEEK_ACTIVITY_SLUGS");
  const host = parseWeekIdList("WEEK_HOST_ACTIVITY_IDS");
  const hybrid = parseWeekIdList("WEEK_HYBRID_ACTIVITY_IDS");

  for (let week = 1; week <= 7; week += 1) {
    for (const [activityId, slug] of Object.entries(slugs[week] || {})) {
      const isHost = (host[week] || []).includes(activityId);
      const isHybrid = (hybrid[week] || []).includes(activityId);
      const route = `week-${week}/${slug}/index.html`;
      const entry = inventoryJson.routes.find((item) => item.route === route);
      assert.ok(entry, `inventory missing ${route}`);
      const scripts = entry.scripts || [];
      const loadsApp = scripts.some((script) => String(script).endsWith(`/${slug}/app.js`));
      const appPath = path.join(projectRoot, `week-${week}`, slug, "app.js");
      if (isHost) {
        assert.equal(loadsApp, true, `${activityId} host must inventory-load app.js`);
        assert.equal(fs.existsSync(appPath), true, `${activityId} host app.js must exist`);
      } else if (isHybrid) {
        // Hybrid keeps the practical shell engine (e.g. TryHackMe).
        assert.equal(fs.existsSync(appPath), true, `${activityId} hybrid app.js must exist`);
      } else {
        assert.equal(loadsApp, false, `${activityId} catalogue must not inventory-load app.js`);
        assert.equal(fs.existsSync(appPath), false, `${activityId} catalogue app.js must be retired`);
        assert.equal(
          scripts.some((script) => /week\d+-quiz\.js$/.test(String(script))),
          false,
          `${activityId} catalogue must not load week quiz engine`
        );
      }
    }
  }
});

test("week pages keep docked catalogue progress chrome", function () {
  const weekPage = read("src/pages/WeekPage.tsx");
  assert.match(weekPage, /PracticeProgressPanel/);
  assert.match(weekPage, /defaultCollapsed/);
  assert.match(weekPage, /showProgress:\s*false/);
  assert.match(weekPage, /data-lp-week-page/);
  assert.match(read("src/pages/PageHost.tsx"), /unit3-page-body/);
  assert.match(read("src/pages/PageHost.tsx"), /loadPageScripts/);
});

test("Week 1 activity.html keeps the activityId query contract", function () {
  const html = read("activities/activity.html");
  assert.match(html, /data-view="week1-activity"/);
  assert.match(html, /data-activity-id="U3-W01-COMMAND-WORDS"/);
  assert.match(read("src/page-context.ts"), /activityId/);
  assert.match(read("src/page-context.ts"), /URLSearchParams/);
  assert.match(read("js/core/backend-mode.js"), /isWeek1ActivityApiPage/);
});
