/**
 * Self-tests for Week 5 activity content packs and manifest alignment.
 */

function runAllWeek5ActivityDataTests() {
  var results = [];
  results.push(runNamedActivityDataTest_('Manifest registry parity', testWeek5ManifestRegistryParity_));
  results.push(runNamedActivityDataTest_('Pack coverage', testWeek5PackCoverage_));
  results.push(runNamedActivityDataTest_('Totals and versions', testWeek5TotalsAndVersions_));
  results.push(runNamedActivityDataTest_('Question integrity', testWeek5QuestionIntegrity_));
  results.push(runNamedActivityDataTest_('Public data sanitisation', testWeek5PublicDataSanitisation_));
  results.push(runNamedActivityDataTest_('OCR review items', testWeek5OcrManualItem_));
  results.push(runNamedActivityDataTest_('Impacts learning coverage', testWeek5ImpactsLearningCoverage_));
  results.push(runNamedActivityDataTest_('Classification coverage', testWeek5ClassificationCoverage_));
  results.push(runNamedActivityDataTest_('Ransomware companion roles', testWeek5RansomwareCompanionCoverage_));
  results.push(runNamedActivityDataTest_('Stakeholder grid coverage', testWeek5StakeholderGridCoverage_));
  results.push(runNamedActivityDataTest_('Guidance data', testWeek5GuidanceCoverage_));
  results.push(runNamedActivityDataTest_('Activity types', testWeek5ActivityTypes_));
  results.push(runNamedActivityDataTest_('HTTPS external links', testWeek5HttpsLinks_));
  results.push(runNamedActivityDataTest_('Classification marking samples', testWeek5ClassificationMarking_));

  var failed = results.filter(function (item) {
    return !item.ok;
  });
  var summary = results
    .map(function (item) {
      return (item.ok ? 'PASS' : 'FAIL') + ' — ' + item.name + (item.detail ? ': ' + item.detail : '');
    })
    .join('\n');

  Logger.log('Week 5 activity data self-test summary\n' + summary);
  if (failed.length) {
    throw new Error('Week 5 activity data tests failed (' + failed.length + '):\n' + summary);
  }
  return summary;
}

function testWeek5ManifestRegistryParity_() {
  var manifestIds = getWeek5ManifestIds_().slice().sort();
  var registryIds = getWeek5ActivityIds_().slice().sort();
  assertActivityData_(manifestIds.join('|') === registryIds.join('|'), 'Manifest and registry IDs must match');
  assertActivityData_(manifestIds.length === 10, 'Expected 10 Week 5 scored activities');
}

function testWeek5PackCoverage_() {
  getWeek5ManifestIds_().forEach(function (activityId) {
    var pack = Week5ActivityDataService.getPackByActivityId_(activityId);
    assertActivityData_(!!pack, 'Missing pack for ' + activityId);
    assertActivityData_(pack.meta.activityId === activityId, 'Pack activityId mismatch for ' + activityId);
  });
}

function testWeek5TotalsAndVersions_() {
  getWeek5ManifestIds_().forEach(function (activityId) {
    var manifest = getWeek5ManifestEntry_(activityId);
    var registry = getWeek5Activity_(activityId);
    var pack = Week5ActivityDataService.getPackByActivityId_(activityId);

    assertActivityData_(manifest.activityVersion === '1.0', activityId + ' version must be 1.0');
    assertActivityData_(typeof manifest.activityVersion === 'string', activityId + ' version must be a string');
    assertActivityData_(pack.meta.activityVersion === manifest.activityVersion, activityId + ' pack version mismatch');
    assertActivityData_(pack.meta.maximumScore === manifest.maximumScore, activityId + ' pack total mismatch');
    assertActivityData_(registry.total === manifest.maximumScore, activityId + ' registry total mismatch');
    assertActivityData_(registry.version === manifest.activityVersion, activityId + ' registry version mismatch');
    assertActivityData_(manifest.weekNumber === 5, activityId + ' week must be 5');
    assertActivityData_(
      manifest.sessionNumber === 1 || manifest.sessionNumber === 2,
      activityId + ' session must be 1 or 2'
    );
  });
}

function testWeek5QuestionIntegrity_() {
  getWeek5ManifestIds_().forEach(function (activityId) {
    var pack = Week5ActivityDataService.getPackByActivityId_(activityId);
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
          assertActivityData_(
            question.options && question.options.length >= 2,
            activityId + ' ' + question.questionId + ' needs options'
          );
          var optionIds = {};
          question.options.forEach(function (option) {
            assertActivityData_(!!option.optionId, activityId + ' option missing optionId');
            assertActivityData_(!optionIds[option.optionId], activityId + ' duplicate optionId ' + option.optionId);
            optionIds[option.optionId] = true;
          });
          var assessment = pack.assessment[question.questionId];
          assertActivityData_(!!assessment, activityId + ' missing assessment for ' + question.questionId);
          if (assessment.autoMark === true) {
            assertActivityData_(
              !!assessment.correctOptionId,
              activityId + ' missing correctOptionId for ' + question.questionId
            );
            assertActivityData_(
              !!optionIds[assessment.correctOptionId],
              activityId + ' correctOptionId not in options for ' + question.questionId
            );
            assertActivityData_(!!assessment.explanation, activityId + ' missing explanation for ' + question.questionId);
          }
          if (assessment.acceptedOptionIds) {
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

function testWeek5PublicDataSanitisation_() {
  getWeek5ManifestIds_().forEach(function (activityId) {
    var pack = Week5ActivityDataService.getPackByActivityId_(activityId);
    var publicPayload = Week5ActivityDataService.buildPublicActivityPayload_(pack);
    var json = JSON.stringify(publicPayload);
    assertActivityData_(json.indexOf('correctOptionId') === -1, activityId + ' public payload leaks correctOptionId');
    assertActivityData_(json.indexOf('markScheme') === -1, activityId + ' public payload leaks markScheme');
    assertActivityData_(json.indexOf('tutorNotes') === -1, activityId + ' public payload leaks tutorNotes');
    assertActivityData_(json.indexOf('indicativeResponse') === -1, activityId + ' public payload leaks indicativeResponse');
    assertActivityData_(json.indexOf(CONFIG.spreadsheetId) === -1, activityId + ' public payload leaks spreadsheet ID');
  });
}

function testWeek5OcrManualItem_() {
  var pack = Week5ActivityDataService.getPackByActivityId_('week5-ocr-question-practice');
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

  var blob = JSON.stringify(pack);
  assertActivityData_(
    blob.toLowerCase().indexOf('not official ocr') !== -1 ||
      blob.toLowerCase().indexOf('not an official ocr') !== -1,
    'OCR pack must explicitly say questions are not official OCR items'
  );
  assertActivityData_(
    blob.indexOf('OCR-style') !== -1 || blob.indexOf('OCR-style practice') !== -1 || blob.indexOf('practice') !== -1,
    'OCR pack should describe practice marking language'
  );
}

function testWeek5ImpactsLearningCoverage_() {
  var pack = Week5ActivityDataService.getPackByActivityId_('week5-impacts-learning');
  assertActivityData_(!!pack.tutorData, 'Impacts learning tutor data missing');
  assertActivityData_((pack.tutorData.lossForms || []).length === 9, 'Expected nine loss forms');
  assertActivityData_((pack.tutorData.disruptionExamples || []).length === 5, 'Expected five disruption examples');
  assertActivityData_((pack.tutorData.safetyExamples || []).length === 4, 'Expected four safety examples');
  var categories = WEEK_5_REQUIRED_IMPACT_CATEGORIES.slice();
  categories.forEach(function (category) {
    assertActivityData_(
      JSON.stringify(pack).toLowerCase().indexOf(category) !== -1,
      'Impacts learning must cover category: ' + category
    );
  });
  var lossTypes = [
    'confidentiality',
    'integrity',
    'availability',
    'financial',
    'reputational',
    'identity'
  ];
  lossTypes.forEach(function (token) {
    assertActivityData_(
      JSON.stringify(pack).toLowerCase().indexOf(token) !== -1,
      'Impacts learning missing loss theme: ' + token
    );
  });
}

function testWeek5ClassificationCoverage_() {
  var pack = Week5ActivityDataService.getPackByActivityId_('week5-impact-classification');
  assertActivityData_(!!pack.tutorData, 'Classification tutor data missing');
  assertActivityData_(
    pack.tutorData.cancelledAppointmentExample === 'C7',
    'Cancelled appointment example must be C7'
  );
  var c7 = pack.assessment.C7;
  assertActivityData_(!!c7, 'C7 assessment missing');
  assertActivityData_(c7.acceptedOptionIds.indexOf('disruption') !== -1, 'C7 must accept disruption');
  assertActivityData_(c7.acceptedOptionIds.indexOf('safety') !== -1, 'C7 must accept safety');
  assertActivityData_(c7.acceptedOptionIds.indexOf('multi') !== -1, 'C7 must accept multi');
  assertActivityData_(c7.acceptedOptionIds.indexOf('loss') !== -1, 'C7 must accept justified loss');
  assertActivityData_(c7.requiresEvidence !== true, 'C7 must not block marks via requiresEvidence');
}

function testWeek5RansomwareCompanionCoverage_() {
  var pack = Week5ActivityDataService.getPackByActivityId_('week5-ransomware-companion');
  assertActivityData_(!!pack.tutorData && !!pack.tutorData.roles, 'Companion roles missing');
  assertActivityData_(pack.tutorData.roles.length === 4, 'Expected exactly four roles');
  var ids = {};
  pack.tutorData.roles.forEach(function (role) {
    ids[role.id] = true;
    assertActivityData_((role.prompts || []).length === 3, role.id + ' needs three prompts');
  });
  WEEK_5_REQUIRED_ROLES.forEach(function (roleId) {
    assertActivityData_(!!ids[roleId], 'Missing required role: ' + roleId);
  });
  assertActivityData_(!!pack.tutorData.ncsc && !!pack.tutorData.ncsc.url, 'NCSC URL missing');
  assertActivityData_(
    pack.tutorData.ncsc.url.indexOf('https://www.ncsc.gov.uk/') === 0,
    'NCSC URL must be official HTTPS'
  );
  var blob = JSON.stringify(pack).toLowerCase();
  assertActivityData_(blob.indexOf('eradication') === -1, 'Companion must not teach LO4 eradication stages');
  assertActivityData_(blob.indexOf('incident-response stage') === -1, 'Companion must not teach LO4 stage sequencing');
}

function testWeek5StakeholderGridCoverage_() {
  var pack = Week5ActivityDataService.getPackByActivityId_('week5-stakeholder-grid');
  assertActivityData_(!!pack.tutorData, 'Stakeholder grid tutor data missing');
  var required = WEEK_5_REQUIRED_STAKEHOLDERS.slice();
  required.forEach(function (stakeholder) {
    assertActivityData_(
      JSON.stringify(pack).toLowerCase().indexOf(stakeholder) !== -1,
      'Stakeholder grid missing: ' + stakeholder
    );
  });
}

function testWeek5GuidanceCoverage_() {
  assertActivityData_(typeof WEEK5_GUIDANCE_DATA !== 'undefined', 'WEEK5_GUIDANCE_DATA missing');
  assertActivityData_(!!WEEK5_GUIDANCE_DATA.tryHackMe, 'TryHackMe guidance missing');
  assertActivityData_(!!WEEK5_GUIDANCE_DATA.directedStudy, 'Directed study guidance missing');
  assertActivityData_(!!WEEK5_GUIDANCE_DATA.supportChallenge, 'Support/challenge guidance missing');
  assertActivityData_((WEEK5_GUIDANCE_DATA.learningOutcomes || []).length >= 4, 'Learning outcomes incomplete');
  assertActivityData_((WEEK5_GUIDANCE_DATA.examinationFocus || []).length >= 4, 'Examination focus incomplete');
  assertActivityData_((WEEK5_GUIDANCE_DATA.challenges || []).length === 3, 'Expected three challenges');
  assertActivityData_(
    WEEK5_GUIDANCE_DATA.tryHackMe.room === 'Juicy Details',
    'TryHackMe room must be Juicy Details'
  );
}

function testWeek5ActivityTypes_() {
  getWeek5ManifestIds_().forEach(function (activityId) {
    var entry = getWeek5ManifestEntry_(activityId);
    assertActivityData_(
      WEEK_5_ACCEPTED_ACTIVITY_TYPES.indexOf(entry.activityType) !== -1,
      activityId + ' uses unaccepted activity type: ' + entry.activityType
    );
  });
}

function testWeek5HttpsLinks_() {
  var payload = JSON.stringify(WEEK5_GUIDANCE_DATA || {});
  var matches = payload.match(/https?:\\?\/\\?\/[^"\\s]+/g) || [];
  matches.forEach(function (url) {
    var cleaned = url.replace(/\\/g, '');
    assertActivityData_(cleaned.indexOf('https://') === 0, 'Non-HTTPS link found: ' + cleaned);
  });
}

function testWeek5ClassificationMarking_() {
  var pack = Week5ActivityDataService.getPackByActivityId_('week5-impact-classification');
  var questions = pack.sections[1].questions;
  var byId = {};
  questions.forEach(function (question) {
    byId[question.questionId] = question;
  });

  var loss = Week5ActivityDataService.markQuestion_(byId.C1, 'loss', pack.assessment.C1);
  assertActivityData_(loss.status === 'correct' && loss.marksAwarded === 1, 'Clear loss example should mark correct');

  var disruption = Week5ActivityDataService.markQuestion_(byId.C2, 'disruption', pack.assessment.C2);
  assertActivityData_(
    disruption.status === 'correct' && disruption.marksAwarded === 1,
    'Clear disruption example should mark correct'
  );

  var cancelledOrg = Week5ActivityDataService.markQuestion_(byId.C7, 'disruption', pack.assessment.C7);
  assertActivityData_(
    cancelledOrg.status === 'correct',
    'Cancelled appointment as disruption for organisation should be accepted'
  );

  var cancelledPatient = Week5ActivityDataService.markQuestion_(byId.C7, 'safety', pack.assessment.C7);
  assertActivityData_(
    cancelledPatient.status === 'correct',
    'Cancelled appointment as safety for patient should be accepted'
  );

  var cancelledMulti = Week5ActivityDataService.markQuestion_(byId.C7, 'multi', pack.assessment.C7);
  assertActivityData_(cancelledMulti.status === 'correct', 'Cancelled appointment multi category should be accepted');

  var invalid = Week5ActivityDataService.markQuestion_(byId.C1, 'not-a-category', pack.assessment.C1);
  assertActivityData_(invalid.status === 'incorrect' && invalid.marksAwarded === 0, 'Invalid category must score zero');
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
