const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..', '..');
// Host-only engines still ship app.js. Catalogue Week 7 activities use Content + UI.
const scoredApps = [
  'risk-register',
  'heightened-threat',
  'ocr-practice',
  'answer-improvement'
];

const catalogueEvidencePatterns = {
  'risk-register': [/RR.*index \+ 1/, /'RR6'/, /'RR7'/, /'RR8'/, /'RR9'/, /'RR10'/],
  'heightened-threat': [/'HT1'/, /'HT2'/, /'HT3'/, /'HT4'/, /'HT5'/],
  'ocr-practice': [/OCR7_.*index \+ 1/],
  'answer-improvement': [/'AI1'/, /'AI2'/, /'AI3'/, /'AI4'/, /'AI5'/, /'AI6'/]
};

scoredApps.forEach((directory) => {
  const source = fs.readFileSync(path.join(root, 'week-7', directory, 'app.js'), 'utf8');
  assert.match(source, /getResponses\s*:/, directory + ' must expose question evidence');
  assert.match(source, /getStartedAt\s*:/, directory + ' must expose a start timestamp');
  assert.match(source, /getCompletedAt\s*:/, directory + ' must expose a completion timestamp');
  catalogueEvidencePatterns[directory].forEach((pattern) => {
    assert.match(source, pattern, directory + ' must use backend catalogue keys');
  });
  assert.doesNotMatch(
    source,
    /p_student_id|student_id\s*:|learnerId\s*:|assignmentId\s*:|attemptNumber\s*:/,
    directory + ' must not send identity or attempt metadata'
  );
});

let runnerOptions = null;
let fetchCalled = false;
const sandboxWindow = {
  Unit3BackendMode: { isSupabase: () => true },
  Unit3SupabaseAdapter: {},
  Unit3SupabaseSubmitRunner: {
    submit(options) {
      runnerOptions = options;
      return Promise.resolve({ score: 1, maxScore: 1 });
    }
  },
  Unit3Week7Progress: {},
  location: { href: 'https://example.test/week-7/test' }
};
const context = vm.createContext({
  window: sandboxWindow,
  document: { getElementById: () => null },
  fetch: () => {
    fetchCalled = true;
    return Promise.reject(new Error('Apps Script fetch should not run'));
  },
  console,
  Date,
  Promise,
  Number,
  Boolean,
  String,
  Object,
  Array,
  Math,
  parseInt
});

const submitSource = fs.readFileSync(path.join(root, 'js', 'week7-submit.js'), 'utf8');
vm.runInContext(submitSource, context, { filename: 'js/week7-submit.js' });

const responses = [
  {
    questionId: 'S2R1',
    response: { chosenIndex: 0 },
    responseType: 'single-choice',
    correct: true,
    score: 1
  }
];
sandboxWindow.Unit3Week7Submit.submitResult({
  activityId: 'week7-session2-retrieval',
  score: 10,
  total: 10,
  getResponses: () => responses,
  startedAt: '2026-08-12T10:00:00.000Z',
  completedAt: '2026-08-12T10:01:00.000Z',
  canSubmit: () => true
});

setImmediate(() => {
  assert.ok(runnerOptions, 'Supabase mode must delegate to the shared runner');
  assert.equal(fetchCalled, false, 'Supabase mode must not call the Apps Script endpoint');
  assert.equal(runnerOptions.activityId, 'week7-session2-retrieval');
  assert.deepEqual(runnerOptions.getResponses(), responses);
  assert.equal(runnerOptions.getStartedAt(), '2026-08-12T10:00:00.000Z');
  assert.equal(runnerOptions.getCompletedAt(), '2026-08-12T10:01:00.000Z');
  ['score', 'total', 'learnerId', 'assignmentId', 'attemptNumber'].forEach((key) => {
    assert.equal(
      Object.prototype.hasOwnProperty.call(runnerOptions, key),
      false,
      'runner options must omit ' + key
    );
  });

  vm.runInContext(
    fs.readFileSync(path.join(root, 'js', 'core', 'supabase-evidence.js'), 'utf8'),
    context,
    { filename: 'js/core/supabase-evidence.js' }
  );
  const evidence = sandboxWindow.Unit3SupabaseEvidence;
  const empty = evidence.freeText('OCR7_1', '', { maxScore: 6, score: 2 });
  assert.equal(typeof empty.response, 'object');
  assert.equal(empty.response.answered, false);
  assert.equal(empty.correct, false);
  assert.equal(empty.score, 0);
  const partial = evidence.structured('OCR7_2', { text: 'partial' }, {
    maxScore: 6,
    score: 4
  });
  assert.equal(partial.correct, false);
  assert.equal(partial.score, 0);
  const fractional = evidence.structured('M1', { selectedMeasure: 'alt' }, {
    maxScore: 1,
    score: 0.25
  });
  assert.equal(fractional.correct, false);
  assert.equal(fractional.score, 0);

  console.log('PASS: Week 7 shared-backend contract (12 activities + runner branch)');
});
