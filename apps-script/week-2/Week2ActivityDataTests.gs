/**
 * Self-tests for Week 2 activity content packs and manifest alignment.
 */

function runAllWeek2ActivityDataTests() {
  var results = [];
  results.push(runNamedActivityDataTest_('Manifest registry parity', testWeek2ManifestRegistryParity_));
  results.push(runNamedActivityDataTest_('Pack coverage', testWeek2PackCoverage_));
  results.push(runNamedActivityDataTest_('Totals and versions', testWeek2TotalsAndVersions_));
  results.push(runNamedActivityDataTest_('Question integrity', testWeek2QuestionIntegrity_));
  results.push(runNamedActivityDataTest_('Public data sanitisation', testWeek2PublicDataSanitisation_));
  results.push(runNamedActivityDataTest_('OCR manual item', testWeek2OcrManualItem_));
  results.push(runNamedActivityDataTest_('Peer checklist', testWeek2PeerChecklist_));
  results.push(runNamedActivityDataTest_('Vulnerability register', testWeek2RegisterSlots_));
  results.push(runNamedActivityDataTest_('Activity types', testWeek2ActivityTypes_));

  var failed = results.filter(function (item) {
    return !item.ok;
  });
  var summary = results
    .map(function (item) {
      return (item.ok ? 'PASS' : 'FAIL') + ' — ' + item.name + (item.detail ? ': ' + item.detail : '');
    })
    .join('\n');

  Logger.log('Week 2 activity data self-test summary\n' + summary);
  if (failed.length) {
    throw new Error('Week 2 activity data tests failed (' + failed.length + '):\n' + summary);
  }
  return summary;
}

function testWeek2ManifestRegistryParity_() {
  var manifestIds = getWeek2ManifestIds_().slice().sort();
  var registryIds = getWeek2ActivityIds_().slice().sort();
  assertActivityData_(manifestIds.join('|') === registryIds.join('|'), 'Manifest and registry IDs must match');
  assertActivityData_(manifestIds.length === 11, 'Expected 11 Week 2 activities');
}

function testWeek2PackCoverage_() {
  getWeek2ManifestIds_().forEach(function (activityId) {
    var pack = Week2ActivityDataService.getPackByActivityId_(activityId);
    assertActivityData_(!!pack, 'Missing pack for ' + activityId);
    assertActivityData_(pack.meta.activityId === activityId, 'Pack activityId mismatch for ' + activityId);
  });
}

function testWeek2TotalsAndVersions_() {
  getWeek2ManifestIds_().forEach(function (activityId) {
    var manifest = getWeek2ManifestEntry_(activityId);
    var registry = getWeek2Activity_(activityId);
    var pack = Week2ActivityDataService.getPackByActivityId_(activityId);

    assertActivityData_(manifest.activityVersion === '1.0', activityId + ' version must be 1.0');
    assertActivityData_(pack.meta.activityVersion === manifest.activityVersion, activityId + ' pack version mismatch');
    assertActivityData_(pack.meta.maximumScore === manifest.maximumScore, activityId + ' pack total mismatch');
    assertActivityData_(registry.total === manifest.maximumScore, activityId + ' registry total mismatch');
    assertActivityData_(registry.version === manifest.activityVersion, activityId + ' registry version mismatch');
    assertActivityData_(manifest.weekNumber === 2, activityId + ' week must be 2');
    assertActivityData_(
      manifest.sessionNumber === 1 || manifest.sessionNumber === 2,
      activityId + ' session must be 1 or 2'
    );
  });
}

function testWeek2QuestionIntegrity_() {
  getWeek2ManifestIds_().forEach(function (activityId) {
    var pack = Week2ActivityDataService.getPackByActivityId_(activityId);
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

function testWeek2PublicDataSanitisation_() {
  getWeek2ManifestIds_().forEach(function (activityId) {
    var pack = Week2ActivityDataService.getPackByActivityId_(activityId);
    var publicPayload = Week2ActivityDataService.buildPublicActivityPayload_(pack);
    var json = JSON.stringify(publicPayload);
    assertActivityData_(json.indexOf('correctOptionId') === -1, activityId + ' public payload leaks correctOptionId');
    assertActivityData_(json.indexOf('markScheme') === -1, activityId + ' public payload leaks markScheme');
    assertActivityData_(json.indexOf('tutorNotes') === -1, activityId + ' public payload leaks tutorNotes');
    assertActivityData_(json.indexOf('indicativeResponse') === -1, activityId + ' public payload leaks indicativeResponse');
    assertActivityData_(json.indexOf(CONFIG.spreadsheetId) === -1, activityId + ' public payload leaks spreadsheet ID');
  });
}

function testWeek2OcrManualItem_() {
  var pack = Week2ActivityDataService.getPackByActivityId_('week2-ocr-question-practice');
  var manual = pack.assessment['W2OCR-Q07'];
  assertActivityData_(!!manual, 'OCR six-mark item missing');
  assertActivityData_(manual.autoMark === false, 'OCR six-mark item must not auto-mark');
  assertActivityData_(manual.scoringMode === 'manual', 'OCR six-mark item must be manual');
}

function testWeek2PeerChecklist_() {
  var pack = Week2ActivityDataService.getPackByActivityId_('week2-peer-marking-answer-improvement');
  var checklistQuestions = [];
  (pack.sections || []).forEach(function (section) {
    if (section.sectionId === 'W2PM-CHECKLIST') {
      checklistQuestions = section.questions || [];
    }
  });
  assertActivityData_(checklistQuestions.length === 6, 'Peer checklist must contain six items');
  var labels = checklistQuestions.map(function (q) {
    return q.prompt;
  }).join(' | ');
  assertActivityData_(/Threat/i.test(labels), 'Checklist must include threat');
  assertActivityData_(/Vulnerability/i.test(labels), 'Checklist must include vulnerability');
  assertActivityData_(/Relationship/i.test(labels), 'Checklist must include relationship');
  assertActivityData_(/Northbank/i.test(labels), 'Checklist must include Northbank');
  assertActivityData_(/Consequence|incident/i.test(labels), 'Checklist must include consequence');
  assertActivityData_(/command word/i.test(labels), 'Checklist must include command word');
}

function testWeek2RegisterSlots_() {
  var pack = Week2ActivityDataService.getPackByActivityId_('week2-northbank-vulnerability-register');
  var entryQuestions = [];
  (pack.sections || []).forEach(function (section) {
    if (section.sectionId === 'W2REG-ENTRIES') {
      entryQuestions = section.questions || [];
    }
  });
  assertActivityData_(entryQuestions.length === 5, 'Register must contain five entry slots');
  assertActivityData_(
    pack.tutorData && pack.tutorData.emptyRegisterTemplate.length === 5,
    'Register template must contain five entries'
  );
  assertActivityData_(
    pack.tutorData.week7ReservedFields.indexOf('likelihood') !== -1,
    'Register must reserve Week 7 likelihood field'
  );
}

function testWeek2ActivityTypes_() {
  getWeek2ManifestIds_().forEach(function (activityId) {
    var entry = getWeek2ManifestEntry_(activityId);
    assertActivityData_(
      WEEK_2_ACCEPTED_ACTIVITY_TYPES.indexOf(entry.activityType) !== -1,
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
