/**
 * Runnable self-tests for the Week 3 Apps Script API.
 *
 * Ordinary self-tests do not write fake learner submissions.
 */

/**
 * Runs every Week 3 self-test and throws when any assertion fails.
 */
function runAllWeek3SelfTests() {
  var results = [];
  results.push(runNamedTest_('Activity registry', runWeek3ActivityRegistrySelfTest));
  results.push(runNamedTest_('Totals', runWeek3TotalsSelfTest));
  results.push(runNamedTest_('Versions', runWeek3VersionsSelfTest));
  results.push(runNamedTest_('Validation', runWeek3ValidationSelfTest));
  results.push(runNamedTest_('Duplicate keys', runWeek3DuplicateKeySelfTest));
  results.push(runNamedTest_('Spreadsheet connection', runWeek3SpreadsheetConnectionTest));

  var failed = results.filter(function (item) {
    return !item.ok;
  });

  var summary = results
    .map(function (item) {
      return (item.ok ? 'PASS' : 'FAIL') + ' — ' + item.name + (item.detail ? ': ' + item.detail : '');
    })
    .join('\n');

  Logger.log('Week 3 self-test summary\n' + summary);

  if (failed.length > 0) {
    throw new Error(
      'Week 3 self-tests failed (' + failed.length + '):\n' + summary
    );
  }

  Logger.log('All Week 3 self-tests passed.');
  return summary;
}

function runWeek3ActivityRegistrySelfTest() {
  var ids = getWeek3ActivityIds_();
  assert_(ids.length === 11, 'Expected 11 Week 3 activities, found ' + ids.length);

  var unique = {};
  ids.forEach(function (id) {
    assert_(!unique[id], 'Duplicate activity ID: ' + id);
    unique[id] = true;

    var activity = getWeek3Activity_(id);
    assert_(!!activity, 'Missing activity record for ' + id);
    assert_(activity.week === 2, id + ' must belong to week 3');
    assert_(activity.session === 1 || activity.session === 2, id + ' session must be 1 or 2');
    assert_(activity.enabled === true, id + ' should be enabled');
  });

  assert_(!getWeek3Activity_('not-a-real-activity'), 'Unknown activities must not resolve');
  assert_(!isWeek3ActivityEnabled_('not-a-real-activity'), 'Unknown activities must not be enabled');
}

function runWeek3TotalsSelfTest() {
  var expected = {
    'week3-session1-retrieval': 10,
    'week3-attacker-types-learning': 8,
    'week3-attacker-case-matching': 8,
    'week3-justified-identification': 12,
    'week3-session2-retrieval': 12,
    'week3-ocr-question-practice': 20,
    'week3-peer-marking': 6
  };

  Object.keys(expected).forEach(function (id) {
    var activity = getWeek3Activity_(id);
    assert_(!!activity, 'Missing activity ' + id);
    assert_(
      typeof activity.total === 'number' && activity.total > 0 && Math.floor(activity.total) === activity.total,
      id + ' total must be a positive whole number'
    );
    assert_(activity.total === expected[id], id + ' total expected ' + expected[id] + ' got ' + activity.total);
  });
}

function runWeek3VersionsSelfTest() {
  getWeek3ActivityIds_().forEach(function (id) {
    var activity = getWeek3Activity_(id);
    assert_(activity.version === '1.0', id + ' version must be 1.0');
  });
}

function runWeek3ValidationSelfTest() {
  var valid = SubmissionValidator.validate(buildValidSubmission_());
  assert_(valid.valid === true, 'Correct submission should pass validation: ' + JSON.stringify(valid.errors));

  var unknown = SubmissionValidator.validate(
    buildValidSubmission_({ activityId: 'week3-does-not-exist' })
  );
  assert_(!unknown.valid, 'Unknown activity should be rejected');
  assert_(hasCode_(unknown.errors, 'UNKNOWN_ACTIVITY'), 'Expected UNKNOWN_ACTIVITY');

  var badTotal = SubmissionValidator.validate(buildValidSubmission_({ total: 99 }));
  assert_(!badTotal.valid, 'Incorrect total should be rejected');
  assert_(hasCode_(badTotal.errors, 'TOTAL_MISMATCH'), 'Expected TOTAL_MISMATCH');

  var badVersion = SubmissionValidator.validate(
    buildValidSubmission_({ activityVersion: '9.9' })
  );
  assert_(!badVersion.valid, 'Incorrect version should be rejected');
  assert_(hasCode_(badVersion.errors, 'VERSION_NOT_ACCEPTED'), 'Expected VERSION_NOT_ACCEPTED');

  var aboveMax = SubmissionValidator.validate(buildValidSubmission_({ score: 13 }));
  assert_(!aboveMax.valid, 'Score above maximum should be rejected');
  assert_(hasCode_(aboveMax.errors, 'SCORE_ABOVE_TOTAL'), 'Expected SCORE_ABOVE_TOTAL');

  var negative = SubmissionValidator.validate(buildValidSubmission_({ score: -1 }));
  assert_(!negative.valid, 'Negative score should be rejected');
  assert_(hasCode_(negative.errors, 'SCORE_NEGATIVE'), 'Expected SCORE_NEGATIVE');

  var wrongWeek = SubmissionValidator.validate(buildValidSubmission_({ weekNumber: 1 }));
  assert_(!wrongWeek.valid, 'Week 1 submissions must be rejected by the Week 3 API');
  assert_(hasCode_(wrongWeek.errors, 'WEEK_NOT_ACCEPTED'), 'Expected WEEK_NOT_ACCEPTED');

  var parsedAlias = RequestParser.parse({
    postData: {
      type: 'application/json',
      contents: JSON.stringify({
        firstName: 'Alex',
        surname: 'Taylor',
        studentId: 'STU1234',
        classGroup: 'Group A',
        weekNumber: 3,
        sessionName: 'Session 1',
        activityId: 'week3-attacker-case-matching',
        activityVersion: '1.0',
        score: 8,
        maximumScore: 8,
        attemptId: 'attempt-demo-1'
      })
    }
  });
  assert_(parsedAlias.ok, 'Collector-style aliases should parse');
  var aliasValidation = SubmissionValidator.validate(parsedAlias.submission);
  assert_(
    aliasValidation.valid,
    'Collector-style aliases should validate: ' + JSON.stringify(aliasValidation.errors)
  );
}

function runWeek3DuplicateKeySelfTest() {
  var base = buildValidSubmission_();
  var key1 = DuplicateChecker.buildSubmissionKey(base);
  var key2 = DuplicateChecker.buildSubmissionKey(base);
  assert_(key1 === key2, 'Duplicate keys must be stable for the same submission');

  var laterAttempt = buildValidSubmission_({ attemptNumber: 2 });
  var keyLater = DuplicateChecker.buildSubmissionKey(laterAttempt);
  assert_(key1 !== keyLater, 'Different attempt numbers must produce different keys');

  var byId = DuplicateChecker.buildSubmissionKey(
    buildValidSubmission_({ learnerId: 'STU999', learnerName: 'Different Name' })
  );
  var byNameOnly = DuplicateChecker.buildSubmissionKey(
    buildValidSubmission_({ learnerId: '', learnerName: 'Student Name' })
  );
  assert_(byId !== byNameOnly, 'Learner ID and learner-name keys should differ when IDs differ');
}

function runWeek3SpreadsheetConnectionTest() {
  assert_(
    CONFIG.spreadsheetId && CONFIG.spreadsheetId !== CONFIG_PLACEHOLDER_ID,
    'Spreadsheet ID must be configured'
  );

  var spreadsheet = getWorkbook_();
  assert_(!!spreadsheet, 'Spreadsheet must open by ID');
  assert_(!!spreadsheet.getName(), 'Spreadsheet must have a name');

  var required = [
    CONFIG.submissionsSheetName,
    CONFIG.weekResultsSheetName,
    CONFIG.errorsSheetName
  ];

  required.forEach(function (sheetName) {
    var sheet = spreadsheet.getSheetByName(sheetName);
    assert_(
      !!sheet,
      'Required tab missing: ' +
        sheetName +
        '. Run setupWeek3Workbook() before relying on sheet writes.'
    );
  });
}

/**
 * Integration helper: writes clearly labelled TEST rows, then removes them.
 * Not called by runAllWeek3SelfTests().
 */
function runWeek3WriteCleanupIntegrationTest() {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  var submission = buildValidSubmission_({
    learnerName: 'TEST DATA — Week 3 API Self-Check',
    learnerId: 'TEST-WEEK2-API',
    groupName: 'TEST-GROUP',
    attemptNumber: 999001
  });
  submission.serverTimestamp = new Date();
  submission.submissionKey = DuplicateChecker.buildSubmissionKey(submission);
  submission.status = 'TEST';

  try {
    appendSubmission_(submission);
    appendWeek3Result_(submission);

    var existing = findSubmissionByKey_(submission.submissionKey);
    assert_(existing !== null, 'Test submission key should be findable');

    cleanupWeek3TestSubmission_(submission.submissionKey);
    assert_(
      findSubmissionByKey_(submission.submissionKey) === null,
      'Test submission should be removed by cleanup'
    );
  } finally {
    lock.releaseLock();
  }
}

/**
 * Removes rows labelled with the given submission key from All Submissions
 * and Week 3 Results. Intended for TEST DATA cleanup only.
 *
 * @param {string} submissionKey
 */
function cleanupWeek3TestSubmission_(submissionKey) {
  deleteRowsByKey_(CONFIG.submissionsSheetName, ALL_SUBMISSIONS_HEADERS, submissionKey);
  deleteRowsByKey_(CONFIG.weekResultsSheetName, WEEK_3_RESULTS_HEADERS, submissionKey);
}

function deleteRowsByKey_(sheetName, headers, submissionKey) {
  var sheet = getRequiredSheet_(sheetName);
  var keyColumn = headers.indexOf('Submission Key') + 1;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2 || keyColumn < 1) {
    return;
  }

  var values = sheet.getRange(2, keyColumn, lastRow, keyColumn).getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]) === submissionKey) {
      sheet.deleteRow(i + 2);
    }
  }
}

function buildValidSubmission_(overrides) {
  var base = {
    learnerName: 'Student Name',
    learnerId: 'STU1001',
    groupName: 'Group A',
    weekNumber: 3,
    sessionNumber: 1,
    activityId: 'week3-attacker-case-matching',
    activityVersion: '1.0',
    score: 8,
    total: 8,
    attemptNumber: 1,
    completedAt: '2026-08-05T18:30:00.000Z',
    serverTimestamp: null,
    submissionKey: '',
    status: 'PENDING'
  };

  var merged = {};
  Object.keys(base).forEach(function (key) {
    merged[key] = base[key];
  });
  if (overrides) {
    Object.keys(overrides).forEach(function (key) {
      merged[key] = overrides[key];
    });
  }
  return merged;
}

function runNamedTest_(name, fn) {
  try {
    fn();
    return { ok: true, name: name, detail: '' };
  } catch (err) {
    return { ok: false, name: name, detail: String(err.message || err) };
  }
}

function assert_(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function hasCode_(errors, code) {
  return (errors || []).some(function (item) {
    return item.code === code;
  });
}
