const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..', '..');
// Host-only engines still ship app.js. Catalogue Week 6 activities use Content + UI.
const scoredApps = [
  'legislation-matching',
  'government-initiatives',
  'ncsc-guidance',
  'exercise-decision-record',
  'stakeholder-debate',
  'discuss-learning',
  'discuss-planner',
  'ocr-practice',
  'answer-improvement',
  'revision-organiser'
];

const catalogueEvidencePatterns = {
  'legislation-matching': [/evidence\.structured\(scenario\.id/],
  'government-initiatives': [/fromQuizResult\(result, data\.comparisonQuiz\)/],
  'ncsc-guidance': [/'NC' \+ \(index \+ 1\)/],
  'exercise-decision-record': [/'ED1'/, /'ED2'/, /'ED3'/, /'ED4'/, /'ED5'/],
  'stakeholder-debate': [/'SD0'/, /'SD' \+ \(index \+ 1\)/],
  'discuss-learning': [/'DL' \+ \(index \+ 1\)/],
  'discuss-planner': [/'DP1'/, /'DP2'/, /'DP3'/, /'DP4'/, /'DP5'/, /'DP6'/],
  'ocr-practice': [/'OCR6_' \+ \(index \+ 1\)/],
  'answer-improvement': [/'AI1'/, /'AI2'/, /'AI3'/, /'AI4'/, /'AI5'/, /'AI6'/],
  'revision-organiser': [/'RO' \+ \(index \+ 1\)/]
};

scoredApps.forEach((directory) => {
  const source = fs.readFileSync(path.join(root, 'week-6', directory, 'app.js'), 'utf8');
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
  Unit3Week6Progress: {},
  location: { href: 'https://example.test/week-6/test' }
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

const submitSource = fs.readFileSync(path.join(root, 'js', 'week6-submit.js'), 'utf8');
vm.runInContext(submitSource, context, { filename: 'js/week6-submit.js' });

const responses = [
  {
    questionId: 'R1',
    response: { chosenIndex: 0 },
    responseType: 'single-choice',
    correct: true,
    score: 1
  }
];
sandboxWindow.Unit3Week6Submit.submitResult({
  activityId: 'week6-session1-review',
  score: 3,
  total: 3,
  getResponses: () => responses,
  startedAt: '2026-08-12T10:00:00.000Z',
  completedAt: '2026-08-12T10:01:00.000Z',
  canSubmit: () => true
});

setImmediate(() => {
  assert.ok(runnerOptions, 'Supabase mode must delegate to the shared runner');
  assert.equal(fetchCalled, false, 'Supabase mode must not call the Apps Script endpoint');
  assert.equal(runnerOptions.activityId, 'week6-session1-review');
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

  // Evidence helpers must quantize partial marks for submission contract 0.1.0.
  vm.runInContext(
    fs.readFileSync(path.join(root, 'js', 'core', 'supabase-evidence.js'), 'utf8'),
    context,
    { filename: 'js/core/supabase-evidence.js' }
  );
  const evidence = sandboxWindow.Unit3SupabaseEvidence;
  const partial = evidence.structured('OCR6_1', { text: 'draft', selfAssessedMarks: 3 }, {
    maxScore: 6,
    score: 3
  });
  assert.equal(partial.correct, false);
  assert.equal(partial.score, 0);
  const full = evidence.structured('OCR6_1', { text: 'complete', selfAssessedMarks: 6 }, {
    maxScore: 6,
    score: 6
  });
  assert.equal(full.correct, true);
  assert.equal(full.score, 6);
  const half = evidence.structured('LM1', { legislation: 'ok' }, {
    maxScore: 1,
    score: 0.5
  });
  assert.equal(half.correct, false);
  assert.equal(half.score, 0);

  console.log('PASS: Week 6 shared-backend contract (18 activities + runner branch)');
});
