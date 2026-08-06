/**
 * Headless runner for Week 7 registry tests (no browser required).
 * Usage: node scripts/run-week7-tests.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function load(rel, context) {
  const code = fs.readFileSync(path.join(root, rel), 'utf8');
  vm.runInContext(code, context, { filename: rel });
}

const context = {
  window: {},
  console,
  Object,
  Array,
  String,
  Number,
  Boolean,
  JSON,
  Math,
  Date,
  RegExp
};
context.window = context;
context.global = context;
vm.createContext(context);

const files = [
  'js/course-context.js',
  'js/activity-engine-config.js',
  'js/week6-progress.js',
  'js/week7-progress.js',
  'week-7/data/session1-retrieval.js',
  'week-7/data/risk-management-learning.js',
  'week-7/data/risk-register.js',
  'week-7/data/testing-methods.js',
  'week-7/data/sandbox-observation.js',
  'week-7/data/detection-prevention.js',
  'week-7/data/heightened-threat.js',
  'week-7/data/session2-retrieval.js',
  'week-7/data/testing-matching.js',
  'week-7/data/recommendation-practice.js',
  'week-7/data/ocr-practice.js',
  'week-7/data/answer-improvement.js',
  'week-7/data/directed-study.js',
  'week-7/data/support-challenge.js',
  'week-7/tests/validate-registry.js'
];

for (const file of files) load(file, context);

const results = context.Unit3Week7Tests.runWeek7RegistryTests();
const failed = results.filter((r) => !r.ok);
for (const r of results) {
  console.log((r.ok ? 'PASS' : 'FAIL') + ': ' + r.name + (r.detail ? ' - ' + r.detail : ''));
}
console.log(
  failed.length === 0
    ? `\nAll ${results.length} checks passed.`
    : `\n${failed.length} of ${results.length} checks failed.`
);
process.exit(failed.length ? 1 : 0);
