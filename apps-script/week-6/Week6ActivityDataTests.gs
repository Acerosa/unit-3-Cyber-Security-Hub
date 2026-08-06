/**
 * Self-tests for Week 6 activity content packs and manifest alignment.
 */

function runAllWeek6ActivityDataTests() {
  var results = [];
  results.push(runNamedActivityDataTest_('Manifest registry parity', testWeek6ManifestRegistryParity_));
  results.push(runNamedActivityDataTest_('Pack coverage', testWeek6PackCoverage_));
  results.push(runNamedActivityDataTest_('Totals and versions', testWeek6TotalsAndVersions_));
  results.push(runNamedActivityDataTest_('Question integrity', testWeek6QuestionIntegrity_));
  results.push(runNamedActivityDataTest_('Public data sanitisation', testWeek6PublicDataSanitisation_));
  results.push(runNamedActivityDataTest_('Classification values', testWeek6ClassificationValues_));
  results.push(runNamedActivityDataTest_('Legislation matching compounds', testWeek6LegislationMatching_));
  results.push(runNamedActivityDataTest_('Diagnostic topics', testWeek6DiagnosticTopics_));
  results.push(runNamedActivityDataTest_('Stakeholder roles', testWeek6StakeholderRoles_));
  results.push(runNamedActivityDataTest_('Discuss concession', testWeek6DiscussConcession_));
  results.push(runNamedActivityDataTest_('NCSC guidance', testWeek6NcscGuidance_));
  results.push(runNamedActivityDataTest_('Guidance and links', testWeek6GuidanceCoverage_));
  results.push(runNamedActivityDataTest_('OCR mark scheme hidden', testWeek6OcrSanitisation_));
  results.push(runNamedActivityDataTest_('Classification marking sample', testWeek6ClassificationMarking_));

  var failed = results.filter(function (item) {
    return !item.ok;
  });
  var summary = results
    .map(function (item) {
      return (item.ok ? 'PASS' : 'FAIL') + ' - ' + item.name + (item.detail ? ': ' + item.detail : '');
    })
    .join('\n');

  Logger.log('Week 6 activity data self-test summary\n' + summary);
  if (failed.length) {
    throw new Error('Week 6 activity data tests failed (' + failed.length + '):\n' + summary);
  }
  return summary;
}

function testWeek6ManifestRegistryParity_() {
  var manifestIds = getWeek6ManifestIds_().slice().sort();
  var registryIds = getWeek6ActivityIds_().slice().sort();
  assertActivityData_(manifestIds.join('|') === registryIds.join('|'), 'Manifest and registry IDs must match');
  assertActivityData_(manifestIds.length === 18, 'Expected 18 Week 6 scored activities');
}

function testWeek6PackCoverage_() {
  getWeek6ManifestIds_().forEach(function (activityId) {
    var pack = Week6ActivityDataService.getPackByActivityId_(activityId);
    assertActivityData_(!!pack, 'Missing pack for ' + activityId);
    assertActivityData_(pack.meta.activityId === activityId, 'Pack activityId mismatch for ' + activityId);
  });
}

function testWeek6TotalsAndVersions_() {
  getWeek6ManifestIds_().forEach(function (activityId) {
    var manifest = getWeek6ManifestEntry_(activityId);
    var registry = getWeek6Activity_(activityId);
    var pack = Week6ActivityDataService.getPackByActivityId_(activityId);
    var marks = 0;
    (pack.sections || []).forEach(function (section) {
      if (section.sectionType !== 'assessment') return;
      (section.questions || []).forEach(function (question) {
        marks += Number(question.marks) || 0;
      });
    });
    assertActivityData_(manifest.activityVersion === '1.0', activityId + ' version must be 1.0');
    assertActivityData_(typeof manifest.activityVersion === 'string', activityId + ' version must be a string');
    assertActivityData_(pack.meta.maximumScore === manifest.maximumScore, activityId + ' pack total mismatch');
    assertActivityData_(marks === manifest.maximumScore, activityId + ' assessment marks mismatch');
    assertActivityData_(registry.total === manifest.maximumScore, activityId + ' registry total mismatch');
    assertActivityData_(manifest.weekNumber === 6, activityId + ' week must be 6');
  });
}

function testWeek6QuestionIntegrity_() {
  getWeek6ManifestIds_().forEach(function (activityId) {
    var pack = Week6ActivityDataService.getPackByActivityId_(activityId);
    var ids = {};
    (pack.sections || []).forEach(function (section) {
      (section.questions || []).forEach(function (question) {
        assertActivityData_(!!question.questionId, activityId + ' missing questionId');
        assertActivityData_(!ids[question.questionId], activityId + ' duplicate questionId');
        ids[question.questionId] = true;
        if (question.questionType === 'single-choice' || question.questionType === 'classification') {
          assertActivityData_(question.options && question.options.length >= 2, activityId + ' needs options');
          var assessment = pack.assessment[question.questionId];
          if (assessment && assessment.autoMark === true) {
            assertActivityData_(!!assessment.correctOptionId, activityId + ' missing correctOptionId');
            var optionIds = question.options.map(function (option) {
              return option.optionId;
            });
            assertActivityData_(
              optionIds.indexOf(assessment.correctOptionId) !== -1,
              activityId + ' correctOptionId not in options'
            );
          }
        }
      });
    });
  });
}

function testWeek6PublicDataSanitisation_() {
  getWeek6ManifestIds_().forEach(function (activityId) {
    var pack = Week6ActivityDataService.getPackByActivityId_(activityId);
    var publicPayload = Week6ActivityDataService.buildPublicActivityPayload_(pack);
    var blob = JSON.stringify(publicPayload);
    assertActivityData_(blob.indexOf('correctOptionId') === -1, activityId + ' leaked correctOptionId');
    assertActivityData_(blob.indexOf('"assessment"') === -1, activityId + ' leaked assessment');
    assertActivityData_(blob.indexOf('markScheme') === -1, activityId + ' leaked markScheme');
    assertActivityData_(blob.indexOf('tutorData') === -1, activityId + ' leaked tutorData');
  });
}

function testWeek6ClassificationValues_() {
  var pack = Week6ActivityDataService.getPackByActivityId_('week6-ethical-classification');
  assertActivityData_(!!pack, 'ethical classification pack missing');
  var cats = {};
  (pack.sections || []).forEach(function (section) {
    (section.questions || []).forEach(function (question) {
      (question.options || []).forEach(function (option) {
        cats[option.optionId] = true;
      });
    });
  });
  ['unethical', 'unlawful', 'both', 'neither'].forEach(function (id) {
    assertActivityData_(cats[id] === true, 'Missing classification option ' + id);
  });
}

function testWeek6LegislationMatching_() {
  var pack = Week6ActivityDataService.getPackByActivityId_('week6-legislation-matching');
  assertActivityData_(!!pack, 'matching pack missing');
  var count = 0;
  (pack.sections || []).forEach(function (section) {
    if (section.sectionType !== 'assessment') return;
    (section.questions || []).forEach(function (question) {
      count += 1;
      var assessment = pack.assessment[question.questionId];
      assertActivityData_(!!assessment && !!assessment.correctOptionId, 'matching needs compound key');
      assertActivityData_(
        String(assessment.correctOptionId).indexOf('__') !== -1,
        'matching correctOptionId must encode legislation and duty'
      );
    });
  });
  assertActivityData_(count === 6, 'Expected exactly six legislation scenarios');
}

function testWeek6DiagnosticTopics_() {
  var pack = Week6ActivityDataService.getPackByActivityId_('week6-lo2-diagnostic');
  assertActivityData_(!!pack, 'diagnostic pack missing');
  var topics = {};
  Object.keys(pack.assessment || {}).forEach(function (questionId) {
    var item = pack.assessment[questionId];
    assertActivityData_(!!item.topic, questionId + ' missing topic');
    assertActivityData_(!!item.teachingContentCode, questionId + ' missing teachingContentCode');
    topics[item.topic] = true;
  });
  assertActivityData_(Object.keys(topics).length >= 6, 'Diagnostic should cover multiple LO2 topics');
}

function testWeek6StakeholderRoles_() {
  var pack = Week6ActivityDataService.getPackByActivityId_('week6-employee-monitoring');
  var blob = JSON.stringify(pack).toLowerCase();
  WEEK_6_REQUIRED_STAKEHOLDER_ROLES.forEach(function (role) {
    assertActivityData_(blob.indexOf(role) !== -1, 'Missing stakeholder role ' + role);
  });
}

function testWeek6DiscussConcession_() {
  var pack = Week6ActivityDataService.getPackByActivityId_('week6-discuss-planner');
  var blob = JSON.stringify(pack).toLowerCase();
  assertActivityData_(blob.indexOf('concession') !== -1, 'Discuss planner must require concession');
}

function testWeek6NcscGuidance_() {
  var pack = Week6ActivityDataService.getPackByActivityId_('week6-ncsc-guidance');
  var blob = JSON.stringify(pack);
  assertActivityData_(blob.indexOf(WEEK_6_NCSC_EXERCISE.url) !== -1, 'NCSC URL missing');
  assertActivityData_(blob.indexOf(WEEK_6_NCSC_EXERCISE.title) !== -1, 'NCSC title missing');
  assertActivityData_(!/inject\s+\d|stage\s+1:/i.test(blob), 'Must not invent NCSC staged prompts');
}

function testWeek6GuidanceCoverage_() {
  assertActivityData_(typeof WEEK6_GUIDANCE_DATA === 'object', 'WEEK6_GUIDANCE_DATA missing');
  var blob = JSON.stringify(WEEK6_GUIDANCE_DATA);
  assertActivityData_(blob.indexOf('tryhackme.com/room/iso27001') !== -1, 'ISO27001 room missing');
  assertActivityData_(
    blob.indexOf('tryhackme.com/room/dfirprocesslegalconsiderations') !== -1,
    'DFIR legal room missing'
  );
  WEEK_6_REQUIRED_GOVERNMENT_INITIATIVES.forEach(function (name) {
    assertActivityData_(blob.indexOf(name) !== -1 || JSON.stringify(WEEK6_PACK_GOVERNMENT_INITIATIVES).indexOf(name) !== -1, 'Initiative missing: ' + name);
  });
}

function testWeek6OcrSanitisation_() {
  var pack = Week6ActivityDataService.getPackByActivityId_('week6-ocr-question-practice');
  var publicPayload = Week6ActivityDataService.buildPublicActivityPayload_(pack);
  assertActivityData_(JSON.stringify(publicPayload).indexOf('markScheme') === -1, 'OCR mark scheme leaked');
  var hasScheme = Object.keys(pack.assessment || {}).some(function (id) {
    return !!(pack.assessment[id].markScheme || pack.assessment[id].modelPoints);
  });
  assertActivityData_(hasScheme, 'OCR pack should keep markScheme server-side');
}

function testWeek6ClassificationMarking_() {
  var pack = Week6ActivityDataService.getPackByActivityId_('week6-ethical-classification');
  var question = null;
  (pack.sections || []).forEach(function (section) {
    (section.questions || []).forEach(function (item) {
      if (!question) question = item;
    });
  });
  assertActivityData_(!!question, 'No classification question');
  var assessment = pack.assessment[question.questionId];
  var correct = Week6ActivityDataService.markQuestion_(question, assessment, assessment.correctOptionId);
  assertActivityData_(correct.status === 'correct', 'Correct classification should mark correct');
  var wrong = Week6ActivityDataService.markQuestion_(question, assessment, 'neither');
  if (assessment.correctOptionId !== 'neither') {
    assertActivityData_(wrong.status === 'incorrect', 'Wrong classification should mark incorrect');
  }
}

function runNamedActivityDataTest_(name, fn) {
  try {
    fn();
    return { name: name, ok: true };
  } catch (err) {
    return { name: name, ok: false, detail: String(err.message || err) };
  }
}

function assertActivityData_(condition, message) {
  if (!condition) {
    throw new Error(message || 'Activity data assertion failed');
  }
}
