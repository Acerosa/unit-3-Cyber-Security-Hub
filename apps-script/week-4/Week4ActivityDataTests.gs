/**
 * Self-tests for Week 4 activity content packs and manifest alignment.
 */

function runAllWeek4ActivityDataTests() {
  var results = [];
  results.push(runNamedActivityDataTest_('Manifest registry parity', testWeek4ManifestRegistryParity_));
  results.push(runNamedActivityDataTest_('Pack coverage', testWeek4PackCoverage_));
  results.push(runNamedActivityDataTest_('Totals and versions', testWeek4TotalsAndVersions_));
  results.push(runNamedActivityDataTest_('Question integrity', testWeek4QuestionIntegrity_));
  results.push(runNamedActivityDataTest_('Public data sanitisation', testWeek4PublicDataSanitisation_));
  results.push(runNamedActivityDataTest_('OCR review items', testWeek4OcrManualItem_));
  results.push(runNamedActivityDataTest_('Motivations coverage', testWeek4MotivationsCoverage_));
  results.push(runNamedActivityDataTest_('MTM mapping coverage', testWeek4MtmCoverage_));
  results.push(runNamedActivityDataTest_('Guidance data', testWeek4GuidanceCoverage_));
  results.push(runNamedActivityDataTest_('Activity types', testWeek4ActivityTypes_));
  results.push(runNamedActivityDataTest_('HTTPS external links', testWeek4HttpsLinks_));

  var failed = results.filter(function (item) {
    return !item.ok;
  });
  var summary = results
    .map(function (item) {
      return (item.ok ? 'PASS' : 'FAIL') + ' — ' + item.name + (item.detail ? ': ' + item.detail : '');
    })
    .join('\n');

  Logger.log('Week 4 activity data self-test summary\n' + summary);
  if (failed.length) {
    throw new Error('Week 4 activity data tests failed (' + failed.length + '):\n' + summary);
  }
  return summary;
}

function testWeek4ManifestRegistryParity_() {
  var manifestIds = getWeek4ManifestIds_().slice().sort();
  var registryIds = getWeek4ActivityIds_().slice().sort();
  assertActivityData_(manifestIds.join('|') === registryIds.join('|'), 'Manifest and registry IDs must match');
  assertActivityData_(manifestIds.length === 10, 'Expected 10 Week 4 scored activities');
}

function testWeek4PackCoverage_() {
  getWeek4ManifestIds_().forEach(function (activityId) {
    var pack = Week4ActivityDataService.getPackByActivityId_(activityId);
    assertActivityData_(!!pack, 'Missing pack for ' + activityId);
    assertActivityData_(pack.meta.activityId === activityId, 'Pack activityId mismatch for ' + activityId);
  });
}

function testWeek4TotalsAndVersions_() {
  getWeek4ManifestIds_().forEach(function (activityId) {
    var manifest = getWeek4ManifestEntry_(activityId);
    var registry = getWeek4Activity_(activityId);
    var pack = Week4ActivityDataService.getPackByActivityId_(activityId);

    assertActivityData_(manifest.activityVersion === '1.0', activityId + ' version must be 1.0');
    assertActivityData_(typeof manifest.activityVersion === 'string', activityId + ' version must be a string');
    assertActivityData_(pack.meta.activityVersion === manifest.activityVersion, activityId + ' pack version mismatch');
    assertActivityData_(pack.meta.maximumScore === manifest.maximumScore, activityId + ' pack total mismatch');
    assertActivityData_(registry.total === manifest.maximumScore, activityId + ' registry total mismatch');
    assertActivityData_(registry.version === manifest.activityVersion, activityId + ' registry version mismatch');
    assertActivityData_(manifest.weekNumber === 4, activityId + ' week must be 4');
    assertActivityData_(
      manifest.sessionNumber === 1 || manifest.sessionNumber === 2,
      activityId + ' session must be 1 or 2'
    );
  });
}

function testWeek4QuestionIntegrity_() {
  getWeek4ManifestIds_().forEach(function (activityId) {
    var pack = Week4ActivityDataService.getPackByActivityId_(activityId);
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
          if (assessment.scoringMode === 'rubric' && assessment.acceptedOptionIds) {
            assessment.acceptedOptionIds.forEach(function (optionId) {
              assertActivityData_(!!optionIds[optionId], activityId + ' acceptedOptionId missing: ' + optionId);
            });
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

function testWeek4PublicDataSanitisation_() {
  getWeek4ManifestIds_().forEach(function (activityId) {
    var pack = Week4ActivityDataService.getPackByActivityId_(activityId);
    var publicPayload = Week4ActivityDataService.buildPublicActivityPayload_(pack);
    var json = JSON.stringify(publicPayload);
    assertActivityData_(json.indexOf('correctOptionId') === -1, activityId + ' public payload leaks correctOptionId');
    assertActivityData_(json.indexOf('markScheme') === -1, activityId + ' public payload leaks markScheme');
    assertActivityData_(json.indexOf('tutorNotes') === -1, activityId + ' public payload leaks tutorNotes');
    assertActivityData_(json.indexOf('indicativeResponse') === -1, activityId + ' public payload leaks indicativeResponse');
    assertActivityData_(json.indexOf(CONFIG.spreadsheetId) === -1, activityId + ' public payload leaks spreadsheet ID');
  });
}

function testWeek4OcrManualItem_() {
  var pack = Week4ActivityDataService.getPackByActivityId_('week4-ocr-question-practice');
  assertActivityData_(!!pack, 'OCR pack missing');
  var manualCount = 0;
  Object.keys(pack.assessment).forEach(function (questionId) {
    var item = pack.assessment[questionId];
    if (item.autoMark === false) {
      manualCount += 1;
      assertActivityData_(
        item.scoringMode === 'manual' || item.scoringMode === 'completion',
        'OCR non-auto item must use manual or completion scoring'
      );
    }
  });
  assertActivityData_(manualCount >= 1, 'OCR practice must include at least one non-auto-marked item');
}

function testWeek4MotivationsCoverage_() {
  var pack = Week4ActivityDataService.getPackByActivityId_('week4-motivations-learning');
  assertActivityData_(!!pack.tutorData && !!pack.tutorData.motivations, 'Motivation tutor data missing');
  var ids = {};
  pack.tutorData.motivations.forEach(function (motivation) {
    ids[String(motivation.id)] = true;
  });
  WEEK_4_REQUIRED_MOTIVATIONS.forEach(function (requiredId) {
    assertActivityData_(!!ids[requiredId], 'Missing required motivation: ' + requiredId);
  });
  assertActivityData_(Object.keys(ids).length === 8, 'Expected eight motivations');
}

function testWeek4MtmCoverage_() {
  var pack = Week4ActivityDataService.getPackByActivityId_('week4-mtm-mapping');
  assertActivityData_(!!pack.tutorData, 'MTM tutor data missing');
  assertActivityData_((pack.tutorData.workedRows || []).length === 2, 'Expected two worked mapping rows');
  assertActivityData_((pack.tutorData.scenarios || []).length === 4, 'Expected four mapping scenarios');
  var ambiguous = (pack.tutorData.scenarios || []).filter(function (scenario) {
    return scenario.ambiguous === true;
  });
  assertActivityData_(ambiguous.length >= 1, 'Expected at least one ambiguous mapping scenario');
  var assessQuestions = [];
  (pack.sections || []).forEach(function (section) {
    if (section.sectionType === 'assessment') {
      assessQuestions = assessQuestions.concat(section.questions || []);
    }
  });
  assertActivityData_(assessQuestions.length === 8, 'MTM assessment must contain eight objective items');
}

function testWeek4GuidanceCoverage_() {
  assertActivityData_(typeof WEEK4_GUIDANCE_DATA !== 'undefined', 'WEEK4_GUIDANCE_DATA missing');
  assertActivityData_(!!WEEK4_GUIDANCE_DATA.tryHackMe, 'TryHackMe guidance missing');
  assertActivityData_(!!WEEK4_GUIDANCE_DATA.directedStudy, 'Directed study guidance missing');
  assertActivityData_(!!WEEK4_GUIDANCE_DATA.supportChallenge, 'Support/challenge guidance missing');
  assertActivityData_((WEEK4_GUIDANCE_DATA.learningOutcomes || []).length >= 4, 'Learning outcomes incomplete');
}

function testWeek4ActivityTypes_() {
  getWeek4ManifestIds_().forEach(function (activityId) {
    var entry = getWeek4ManifestEntry_(activityId);
    assertActivityData_(
      WEEK_4_ACCEPTED_ACTIVITY_TYPES.indexOf(entry.activityType) !== -1,
      activityId + ' uses unaccepted activity type: ' + entry.activityType
    );
  });
}

function testWeek4HttpsLinks_() {
  var payload = JSON.stringify(WEEK4_GUIDANCE_DATA || {});
  var matches = payload.match(/https?:\\?\/\\?\/[^"\\s]+/g) || [];
  matches.forEach(function (url) {
    var cleaned = url.replace(/\\/g, '');
    assertActivityData_(cleaned.indexOf('https://') === 0, 'Non-HTTPS link found: ' + cleaned);
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
