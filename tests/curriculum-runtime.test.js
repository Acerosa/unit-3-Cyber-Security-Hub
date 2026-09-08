const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "content/unit-3-cyber-security/package.json"), "utf8"));

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

test("the converted Unit 3 package keeps hub identity, weeks and activity ids", () => {
  assert.equal(pkg.hub.id, "unit-3-cyber-security");
  assert.equal(pkg.curriculum.metadata.course, "ocr-level-3-it");
  assert.equal(pkg.version, "0.2.0");
  assert.equal(pkg.weeks.length, 7);
  assert.equal(pkg.activities.length, 128);
  assert.ok(pkg.weeks.every((week, index) => week.id === `week-${index + 1}`));
  assert.ok(pkg.activities.some((activity) => activity.id === "week2-threat-vulnerability-sort"));
  assert.ok(pkg.activities.some((activity) => activity.id === "u3-w01-baseline"));
  const order = pkg.sessions.flatMap((session) => session.relationships.activities);
  assert.equal(order[0], "u3-w01-baseline");
});

test("the live hub loads teaching content through platform.curriculum.loadLatest", () => {
  const hook = read("src/hooks/useHubPlatform.ts");
  const platform = read("src/platform.ts");
  assert.match(hook, /loadUnit3Curriculum\(platform\)/);
  assert.match(hook, /setContentReady/);
  assert.match(hook, /loadHubAdapters\(root\)/);
  assert.match(hook, /Promise\.all\(\[adapters, ready\]\)/);
  assert.match(platform, /validateLearnerSafePackage/);
  assert.match(platform, /validatePackage: validateLearnerSafePackage/);
  assert.doesNotMatch(platform, /import\s*\{\s*validatePackage\s*\}/);
  assert.match(platform, /loadBundled/);
  assert.match(platform, /import\("\.\.\/content\/unit-3-cyber-security\/package\.json"\)/);
  assert.doesNotMatch(platform, /fetch\(new URL/);
  assert.doesNotMatch(platform, /published_curriculum_package/);
  assert.doesNotMatch(hook, /lp\.curriculum\.cache/);
  assert.match(read("src/curriculum/apply-runtime.ts"), /loadLatest/);
});

test("a published package change does not require the Git teaching snapshot", () => {
  const git = read("week-2/data/threat-vulnerability-sort.js");
  assert.match(git, /Threat or Vulnerability Sort/);
  const activity = pkg.activities.find((item) => item.id === "week2-threat-vulnerability-sort");
  activity.metadata.title = "Edited in Admin without a Git commit";
  assert.equal(activity.metadata.title, "Edited in Admin without a Git commit");
  assert.match(git, /title: 'Threat or Vulnerability Sort'/);
  assert.doesNotMatch(git, /Edited in Admin without a Git commit/);
});

test("Git data banks are an explicit fallback only", () => {
  assert.match(read("week-2/data/threat-vulnerability-sort.js"), /__lpPublishedCurriculum/);
  assert.match(read("src/curriculum/apply-runtime.ts"), /UNIT3_CURRICULUM_FALLBACK/);
});

test("activities do not dangle question refs and Week 1 does not invent 0.1.0 versions", () => {
  assert.ok(pkg.activities.every((item) => Array.isArray(item.relationships.questions) && item.relationships.questions.length === 0));
  const week1 = pkg.activities.filter((item) => String(item.id).startsWith("u3-w01-"));
  assert.equal(week1.length, 56);
  for (const item of week1) {
    assert.match(String(item.version), /^\d+\.\d+\.\d+$/);
    assert.notEqual(item.version, "0.1.0");
  }
  assert.equal(week1.find((item) => item.id === "u3-w01-baseline")?.version, "1.3.0");
  assert.equal(week1.find((item) => item.id === "u3-w01-misconceptions")?.version, "1.0.0");
});

test("CI pins the reviewed Content package that exports learner-safe validation", () => {
  assert.match(read(".github/workflows/pages.yml"), /learning-platform-content[\s\S]*ref: v0\.1\.4/);
});

test("learner-safe validation accepts the Unit 3 package after answer maps are stripped", () => {
  const { createRequire } = require("node:module");
  const requireFromHub = createRequire(path.join(root, "package.json"));
  const {
    validateLearnerSafePackage,
    formatIssues
  } = requireFromHub("@learning-platform/content");
  assert.equal(typeof validateLearnerSafePackage, "function");
  const learner = validateLearnerSafePackage(pkg);
  assert.equal(learner.valid, true, formatIssues?.(learner.issues) || JSON.stringify(learner.issues));
  const stripped = JSON.parse(JSON.stringify(pkg));
  for (const activity of stripped.activities || []) {
    for (const block of activity.blocks || []) {
      if (block.content && Object.prototype.hasOwnProperty.call(block.content, "correct")) {
        delete block.content.correct;
      }
      if (block.content && Object.prototype.hasOwnProperty.call(block.content, "correctOptionId")) {
        delete block.content.correctOptionId;
      }
      if (block.content && Object.prototype.hasOwnProperty.call(block.content, "correctCategoryId")) {
        delete block.content.correctCategoryId;
      }
    }
  }
  const strippedResult = validateLearnerSafePackage(stripped);
  assert.equal(
    strippedResult.valid,
    true,
    formatIssues?.(strippedResult.issues) || JSON.stringify(strippedResult.issues)
  );
});
