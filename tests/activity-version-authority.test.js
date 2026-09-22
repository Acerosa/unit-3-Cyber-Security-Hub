const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function loadMapper(packageActivities) {
  const sandbox = {
    window: {
      __lpPackage: packageActivities ? { activities: packageActivities } : undefined
    }
  };
  const context = vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(root, "js/core/question-key-aliases.js"), "utf8"),
    context
  );
  vm.runInContext(
    fs.readFileSync(path.join(root, "js/core/activity-key-map.js"), "utf8"),
    context
  );
  return sandbox.window.Unit3ActivityKeyMap;
}

test("classic map keeps hardcoded fallbacks when no package is loaded", () => {
  const mapper = loadMapper();
  assert.equal(mapper.catalogueVersionFor("U3-W01-BASELINE"), "1.2.0");
  assert.equal(mapper.catalogueVersionFor("week2-session1-retrieval"), "1.1.0");
  assert.equal(mapper.catalogueVersionFor("week2-malware-symptoms"), "1.1.0");
  assert.equal(mapper.catalogueVersionFor("week2-ocr-question-practice"), "1.2.0");
  assert.equal(mapper.hardcodedCatalogueVersion("u3-w01-baseline"), "1.2.0");
});

test("catalogue package version wins: u3-w01-baseline stays 1.3.0 not 1.2.0", () => {
  const mapper = loadMapper([{ id: "u3-w01-baseline", version: "1.3.0" }]);
  assert.equal(mapper.catalogueVersionFor("u3-w01-baseline"), "1.3.0");
  assert.equal(mapper.normaliseActivityVersion("1.2.0", "u3-w01-baseline"), "1.3.0");
  assert.equal(mapper.hardcodedCatalogueVersion("u3-w01-baseline"), "1.2.0");
});

test("catalogue package version wins: week2-session1-retrieval stays 1.0.0 not 1.1.0", () => {
  const mapper = loadMapper([{ id: "week2-session1-retrieval", version: "1.0.0" }]);
  assert.equal(mapper.catalogueVersionFor("week2-session1-retrieval"), "1.0.0");
  assert.equal(mapper.normaliseActivityVersion("1.1.0", "week2-session1-retrieval"), "1.0.0");
});

test("historical probes use attributed versions only, not a 1.0.0–1.3.0 sweep", () => {
  const mapper = loadMapper([{ id: "week2-session1-retrieval", version: "1.0.0" }]);
  assert.equal(
    Array.from(mapper.knownHistoricalVersionsFor("week2-session1-retrieval", "1.0.0")).join(","),
    ""
  );
  const baseline = loadMapper([{ id: "u3-w01-baseline", version: "1.3.0" }]);
  assert.equal(
    Array.from(baseline.knownHistoricalVersionsFor("u3-w01-baseline", "1.3.0")).join(","),
    "1.2.0"
  );
});


test("classic host OCR keeps 1.2.0 even when the package stub is 1.0.0", () => {
  const mapper = loadMapper([{ id: "week2-ocr-question-practice", version: "1.0.0" }]);
  assert.equal(mapper.isClassicHostActivity("week2-ocr-question-practice"), true);
  assert.equal(mapper.catalogueVersionFor("week2-ocr-question-practice"), "1.2.0");
});
