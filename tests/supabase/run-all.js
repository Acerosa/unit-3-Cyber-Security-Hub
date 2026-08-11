/**
 * Run every headless Supabase migration check in a single command.
 *
 *   node tests/supabase/run-all.js
 *
 * Exits with code 0 when both the module-level and static-file check
 * suites pass. Non-zero exit codes surface the first failing suite.
 */
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const scripts = [
  path.join(__dirname, "run-node.js"),
  path.join(__dirname, "validate-onboarding.js"),
  path.join(__dirname, "run-static-checks.js")
];

let failures = 0;
scripts.forEach((script) => {
  const result = spawnSync(process.execPath, [script], { stdio: "inherit" });
  if (result.status !== 0) {
    failures += 1;
  }
});

process.exit(failures === 0 ? 0 : 1);
