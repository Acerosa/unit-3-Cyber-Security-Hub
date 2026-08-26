const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const zlib = require("node:zlib");

const dist = path.resolve(__dirname, "../../dist");
const inventory = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../fixtures/route-inventory.json"), "utf8"));

test("the Vite production build preserves every inventoried public route", function () {
  assert.equal(fs.existsSync(path.join(dist, ".nojekyll")), true);
  assert.equal(inventory.routes.length, 100);
  inventory.routes.forEach(function (route) {
    assert.equal(fs.existsSync(path.join(dist, route.route)), true, route.route);
  });
  assert.equal(fs.existsSync(path.join(dist, "js/core/theme-bootstrap.js")), true);
  const home = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  const activity = fs.readFileSync(path.join(dist, "activities/activity.html"), "utf8");
  const nested = fs.readFileSync(path.join(dist, "week-6/ncsc-guidance/index.html"), "utf8");
  assert.match(home, /type="module"/);
  assert.match(activity, /data-view="week1-activity"/);
  assert.match(nested, /data-activity="ncsc-guidance"/);
  assert.doesNotMatch(home + activity, /express|next\/server|Server Actions/i);
  assert.equal(fs.existsSync(path.join(dist, "content/unit-3-cyber-security/package.json")), true);
  const assets = path.join(dist, "assets");
  const jsFiles = fs.readdirSync(assets).filter(function (name) { return name.endsWith(".js"); });
  const cssFiles = fs.readdirSync(assets).filter(function (name) { return name.endsWith(".css"); });
  const packageJs = jsFiles.filter(function (name) { return name.startsWith("package-"); });
  const appJsFiles = jsFiles.filter(function (name) { return !name.startsWith("package-"); });
  assert.ok(jsFiles.length >= 1);
  assert.ok(cssFiles.length >= 1);
  assert.ok(packageJs.length >= 1, "bundled curriculum package should be a Vite chunk");
  const jsTotal = appJsFiles.reduce(function (sum, name) {
    return sum + fs.statSync(path.join(assets, name)).size;
  }, 0);
  const cssTotal = cssFiles.reduce(function (sum, name) {
    return sum + fs.statSync(path.join(assets, name)).size;
  }, 0);
  const gzipTotal = appJsFiles.reduce(function (sum, name) {
    return sum + zlib.gzipSync(fs.readFileSync(path.join(assets, name))).length;
  }, 0);
  assert.ok(jsTotal < 900 * 1024, "learner JS should stay under 900KB uncompressed, got " + jsTotal);
  assert.ok(cssTotal < 200 * 1024, "learner CSS should stay under 200KB, got " + cssTotal);
  assert.ok(gzipTotal < 300 * 1024, "learner JS gzip should stay under 300KB, got " + gzipTotal);
});
