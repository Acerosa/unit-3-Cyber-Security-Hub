/**
 * Runnable self-tests for the Week 6 Apps Script API.
 *
 * Ordinary self-tests do not write fake learner submissions.
 */

function runAllWeek6SelfTests() {
  var results = [];
  results.push(runNamedTest_('Activity registry', runWeek6ActivityRegistrySelfTest));
  results.push(runNamedTest_('Totals', runWeek6TotalsSelfTest));
  results.push(runNamedTest_('Versions', runWeek6VersionsSelfTest));
  results.push(runNamedTest_('Validation', runWeek6ValidationSelfTest));
  results.push(runNamedTest_('Duplicate keys', runWeek6DuplicateKeySelfTest));
  results.push(runNamedTest_('Spreadsheet connection', runWeek6SpreadsheetConnectionTest));

  var failed = results.filter(function (item) {
    return !item.ok;
  });

  var summary = results
    .map(function (item) {
      return (item.ok ? 'PASS' : 'FAIL') + ' - ' + item.name + (item.detail ? ': ' + item.detail : '');
    })
    .join('\n');

  Logger.log('Week 6 self-test summary\n' + summary);

  if (failed.length > 0) {
    throw new Error('Week 6 self-tests failed (' + failed.length + '):\n' + summary);
  }

  Logger.log('All Week 6 self-tests passed.');
  return summary;
}

function runWeek6SelfTest() {
  return runAllWeek6SelfTests();
}

function runWeek6ActivityRegistrySelfTest() {
  var ids = getWeek6ActivityIds_();
  assert_(ids.length === 18, 'Expected 18 Week 6 activities, found ' + ids.length);

  var unique = {};
  ids.forEach(function (id) {
    assert_(!unique[id], 'Duplicate activity ID: ' + id);
    unique[id] = true;

    var activity = getWeek6Activity_(id);
    assert_(!!activity, 'Missing activity record for ' + id);
    assert_(activity.week === 6, id + ' must belong to week 6');
    assert_(activity.session === 1 || activity.session === 2, id + ' session must be 1 or 2');
    assert_(activity.enabled === true, id + ' should be enabled');
    assert_(activity.version === '1.0', id + ' version must be 1.0');
  });

  assert_(!getWeek6Activity_('not-a-real-activity'), 'Unknown activities must not resolve');
  assert_(!isWeek6ActivityEnabled_('not-a-real-activity'), 'Unknown activities must not be enabled');
}

function runWeek6TotalsSelfTest() {
  var expected = {
    'week6-lo2-diagnostic': 12,
    'week6-ethical-learning': 6,
    'week6-ethical-classification': 8,
    'week6-legislation-learning': 6,
    'week6-legislation-matching': 6,
    'week6-operational-considerations': 7,
    'week6-government-initiatives': 4,
    'week6-ncsc-guidance': 4,
    'week6-exercise-decision-record': 5,
    'week6-session1-review': 3,
    'week6-legislation-retrieval': 10,
    'week6-employee-monitoring': 6,
    'week6-stakeholder-debate': 10,
    'week6-discuss-learning': 5,
    'week6-discuss-planner': 6,
    'week6-ocr-question-practice': 20,
    'week6-answer-improvement': 6,
    'week6-revision-organiser': 6
  };

  Object.keys(expected).forEach(function (id) {
    var activity = getWeek6Activity_(id);
    assert_(!!activity, 'Missing activity ' + id);
    assert_(activity.total === expected[id], id + ' total expected ' + expected[id] + ' got ' + activity.total);
  });
}

function runWeek6VersionsSelfTest() {
  getWeek6ActivityIds_().forEach(function (id) {
    var activity = getWeek6Activity_(id);
    assert_(activity.version === '1.0', id + ' version must be 1.0');
    var pack = Week6ActivityDataService.getPackByActivityId_(id);
    assert_(!!pack, id + ' pack missing');
    assert_(String(pack.meta.activityVersion) === '1.0', id + ' pack version must be string 1.0');
  });
}

function runWeek6ValidationSelfTest() {
  var sample = {
    learnerName: 'Test Learner',
    learnerId: 'STU-TEST-001',
    groupName: 'IT-L3-A',
    weekNumber: 6,
    sessionNumber: 1,
    activityId: 'week6-lo2-diagnostic',
    activityVersion: '1.0',
    score: 8,
    total: 12,
    attemptNumber: 1
  };
  var ok = SubmissionValidator.validate(sample);
  assert_(ok.valid === true, 'Valid submission should pass');

  var badWeek = Object.assign({}, sample, { weekNumber: 5 });
  var badWeekResult = SubmissionValidator.validate(badWeek);
  assert_(badWeekResult.valid === false, 'Wrong week must reject');

  var badActivity = Object.assign({}, sample, { activityId: 'week6-not-real' });
  var badActivityResult = SubmissionValidator.validate(badActivity);
  assert_(badActivityResult.valid === false, 'Unknown activity must reject');

  var badTotal = Object.assign({}, sample, { total: 99 });
  var badTotalResult = SubmissionValidator.validate(badTotal);
  assert_(badTotalResult.valid === false, 'Question-total mismatch must reject');
}

function runWeek6DuplicateKeySelfTest() {
  var a = {
    learnerId: 'STU-1',
    groupName: 'G1',
    activityId: 'week6-legislation-matching',
    activityVersion: '1.0',
    attemptNumber: 1,
    learnerName: 'A'
  };
  var b = Object.assign({}, a);
  var keyA = DuplicateChecker.buildSubmissionKey(a);
  var keyB = DuplicateChecker.buildSubmissionKey(b);
  assert_(keyA === keyB, 'Identical submissions must share a key');
  var later = Object.assign({}, a, { attemptNumber: 2 });
  assert_(
    DuplicateChecker.buildSubmissionKey(later) !== keyA,
    'Different attempt numbers must produce different keys'
  );
}

function runWeek6SpreadsheetConnectionTest() {
  var check = checkWeek6Config();
  assert_(check.ok === true, check.messages.join('; '));
}

function runNamedTest_(name, fn) {
  try {
    fn();
    return { name: name, ok: true };
  } catch (err) {
    return { name: name, ok: false, detail: String(err.message || err) };
  }
}

function assert_(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}
