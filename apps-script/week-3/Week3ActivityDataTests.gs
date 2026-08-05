/**
 * Self-tests for Week 3 activity content packs and manifest alignment.
 */

function runAllWeek3ActivityDataTests() {
  var results = [];
  results.push(runNamedActivityDataTest_('Manifest registry parity', testWeek3ManifestRegistryParity_));
  results.push(runNamedActivityDataTest_('Pack coverage', testWeek3PackCoverage_));
  results.push(runNamedActivityDataTest_('Totals and versions', testWeek3TotalsAndVersions_));
  results.push(runNamedActivityDataTest_('Question integrity', testWeek3QuestionIntegrity_));
  results.push(runNamedActivityDataTest_('Public data sanitisation', testWeek3PublicDataSanitisation_));
  results.push(runNamedActivityDataTest_('OCR extended item', testWeek3OcrManualItem_));
  results.push(runNamedActivityDataTest_('Peer marking pack', testWeek3PeerChecklist_));
  results.push(runNamedActivityDataTest_('Case matching coverage', testWeek3CaseCoverage_));
  results.push(runNamedActivityDataTest_('Activity types', testWeek3ActivityTypes_));

  var failed = results.filter(function (item) {
    return !item.ok;
  });
  var summary = results
    .map(function (item) {
      return (item.ok ? 'PASS' : 'FAIL') + ' — ' + item.name + (item.detail ? ': ' + item.detail : '');
    })
    .join('\n');

  Logger.log('Week 3 activity data self-test summary\n' + summary);
  if (failed.length) {
    throw new Error('Week 3 activity data tests failed (' + failed.length + '):\n' + summary);
  }
  return summary;
}

function testWeek3ManifestRegistryParity_() {
  var manifestIds = getWeek3ManifestIds_().slice().sort();
  var registryIds = getWeek3ActivityIds_().slice().sort();
  assertActivityData_(manifestIds.join('|') === registryIds.join('|'), 'Manifest and registry IDs must match');
  assertActivityData_(manifestIds.length === 7, 'Expected 7 Week 3 scored activities');
}

function testWeek3PackCoverage_() {
  getWeek3ManifestIds_().forEach(function (activityId) {
    var pack = Week3ActivityDataService.getPackByActivityId_(activityId);
    assertActivityData_(!!pack, 'Missing pack for ' + activityId);
    assertActivityData_(pack.meta.activityId === activityId, 'Pack activityId mismatch for ' + activityId);
  });
}

function testWeek3TotalsAndVersions_() {
  getWeek3ManifestIds_().forEach(function (activityId) {
    var manifest = getWeek3ManifestEntry_(activityId);
    var registry = getWeek3Activity_(activityId);
    var pack = Week3ActivityDataService.getPackByActivityId_(activityId);

    assertActivityData_(manifest.activityVersion === '1.0', activityId + ' version must be 1.0');
    assertActivityData_(pack.meta.activityVersion === manifest.activityVersion, activityId + ' pack version mismatch');
    assertActivityData_(pack.meta.maximumScore === manifest.maximumScore, activityId + ' pack total mismatch');
    assertActivityData_(registry.total === manifest.maximumScore, activityId + ' registry total mismatch');
    assertActivityData_(registry.version === manifest.activityVersion, activityId + ' registry version mismatch');
    assertActivityData_(manifest.weekNumber === 3, activityId + ' week must be 3');
    assertActivityData_(
      manifest.sessionNumber === 1 || manifest.sessionNumber === 2,
      activityId + ' session must be 1 or 2'
    );
  });
}

function testWeek3QuestionIntegrity_() {
  getWeek3ManifestIds_().forEach(function (activityId) {
    var pack = Week3ActivityDataService.getPackByActivityId_(activityId);
    var ids = {};
    var marks = 0;

    (pack.sections || []).forEach(function (section) {
      (section.questions || []).forEach(function (question) {
        assertActivityData_(!!question.questionId, activityId + ' has a question without questionId');
        assertActivityData_(!ids[question.questionId], activityId + ' duplicate questionId ' + question.questionId);
        ids[question.questionId] = true;

        if (section.sectionType === 'assessment') {
          marks += Number(question.marks) || 0;
        }

        if (question.questionType === 'single-choice') {
          assertActivityData_(question.options && question.options.length >= 2, activityId + ' ' + question.questionId + ' needs options');
          var optionIds = {};
          question.options.forEach(function (option) {
            assertActivityData_(!!option.optionId, activityId + ' option missing optionId');
            assertActivityData_(!optionIds[option.optionId], activityId + ' duplicate optionId ' + option.optionId);
            optionIds[option.optionId] = true;
          });
          var assessment = pack.assessment[question.questionId];
          assertActivityData_(!!assessment, activityId + ' missing assessment for ' + question.questionId);
          if (assessment.autoMark === true) {
            assertActivityData_(!!assessment.correctOptionId, activityId + ' missing correctOptionId for ' + question.questionId);
            assertActivityData_(!!optionIds[assessment.correctOptionId], activityId + ' correctOptionId not in options for ' + question.questionId);
            assertActivityData_(!!assessment.explanation, activityId + ' missing explanation for ' + question.questionId);
          }
        }

        if (
          question.questionType === 'extended-response' ||
          question.questionType === 'reflection' ||
          question.questionType === 'short-response'
        ) {
          var proseAssessment = pack.assessment[question.questionId] || {};
          if (proseAssessment.scoringMode === 'manual') {
            assertActivityData_(proseAssessment.autoMark !== true, activityId + ' manual item must not auto-mark');
          }
        }
      });
    });

    assertActivityData_(
      marks === pack.meta.maximumScore,
      activityId + ' assessment marks (' + marks + ') must equal maximumScore (' + pack.meta.maximumScore + ')'
    );
  });
}

function testWeek3PublicDataSanitisation_() {
  getWeek3ManifestIds_().forEach(function (activityId) {
    var pack = Week3ActivityDataService.getPackByActivityId_(activityId);
    var publicPayload = Week3ActivityDataService.buildPublicActivityPayload_(pack);
    var json = JSON.stringify(publicPayload);
    assertActivityData_(json.indexOf('correctOptionId') === -1, activityId + ' public payload leaks correctOptionId');
    assertActivityData_(json.indexOf('markScheme') === -1, activityId + ' public payload leaks markScheme');
    assertActivityData_(json.indexOf('tutorNotes') === -1, activityId + ' public payload leaks tutorNotes');
    assertActivityData_(json.indexOf('indicativeResponse') === -1, activityId + ' public payload leaks indicativeResponse');
    assertActivityData_(json.indexOf(CONFIG.spreadsheetId) === -1, activityId + ' public payload leaks spreadsheet ID');
  });
}

function testWeek3OcrManualItem_() {
  var pack = Week3ActivityDataService.getPackByActivityId_('week3-ocr-question-practice');
  var manual = pack.assessment.O6;
  assertActivityData_(!!manual, 'OCR extended item missing');
  assertActivityData_(manual.autoMark === false, 'OCR extended item must not auto-mark');
  assertActivityData_(manual.scoringMode === 'completion', 'OCR extended item must use completion scoring');
}

function testWeek3PeerChecklist_() {
  var pack = Week3ActivityDataService.getPackByActivityId_('week3-peer-marking');
  assertActivityData_(!!pack, 'Peer marking pack missing');
  assertActivityData_(pack.meta.maximumScore === 6, 'Peer marking total must be 6');
  assertActivityData_(
    pack.tutorData && pack.tutorData.samples && pack.tutorData.samples.length === 3,
    'Peer marking must include three sample responses'
  );
}

function testWeek3CaseCoverage_() {
  var pack = Week3ActivityDataService.getPackByActivityId_('week3-attacker-case-matching');
  var questions = [];
  (pack.sections || []).forEach(function (section) {
    (section.questions || []).forEach(function (question) {
      questions.push(question);
    });
  });
  assertActivityData_(questions.length === 8, 'Case matching must contain eight scenarios');
  var answers = questions.map(function (question) {
    return pack.assessment[question.questionId].correctOptionId;
  });
  var unique = {};
  answers.forEach(function (answer) {
    unique[answer] = true;
  });
  assertActivityData_(Object.keys(unique).length === 8, 'Each attacker type must appear once as best answer');
}

function testWeek3ActivityTypes_() {
  getWeek3ManifestIds_().forEach(function (activityId) {
    var entry = getWeek3ManifestEntry_(activityId);
    assertActivityData_(
      WEEK_3_ACCEPTED_ACTIVITY_TYPES.indexOf(entry.activityType) !== -1,
      activityId + ' uses unaccepted activity type: ' + entry.activityType
    );
  });
}

function runNamedActivityDataTest_(name, fn) {
  try {
    fn();
    return { ok: true, name: name, detail: '' };
  } catch (err) {
    return { ok: false, name: name, detail: String(err.message || err) };
  }
}

function assertActivityData_(condition, message) {
  if (!condition) {
    throw new Error(message || 'Activity data assertion failed');
  }
}
