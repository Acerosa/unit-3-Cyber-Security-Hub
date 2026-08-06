/**
 * Idempotent Week 6 activity catalogue seed helpers.
 *
 * Educational content is stored in .gs packs (Week 1 Activity API pattern).
 * Seeds upsert catalogue rows in the shared spreadsheet for tutor visibility
 * without duplicating earlier-week records or rewriting learner results.
 */

var WEEK6_ACTIVITY_CATALOGUE_SHEET = 'Week 6 Activity Catalogue';

var WEEK6_ACTIVITY_CATALOGUE_HEADERS = Object.freeze([
  'Activity ID',
  'Activity Name',
  'Week',
  'Session',
  'Activity Type',
  'Activity Version',
  'Maximum Score',
  'Enabled',
  'Component ID',
  'Question Count',
  'Last Seeded At',
  'Seed Status'
]);

/**
 * Seeds every Week 6 activity catalogue row.
 *
 * @return {Object}
 */
function seedAllWeek6ActivityData() {
  var summary = blankSeedSummary_('seedAllWeek6ActivityData');
  ensureWeek6ActivityCatalogueSheet_(summary);

  getWeek6ManifestIds_().forEach(function (activityId) {
    mergeSeedSummary_(summary, seedWeek6ActivityById_(activityId));
  });

  Logger.log(JSON.stringify(summary, null, 2));
  if (summary.failed.length) {
    throw new Error(
      'Week 6 activity seeding completed with failures: ' + summary.failed.join('; ')
    );
  }
  return summary;
}


function seedWeek6Activities() {
  return seedAllWeek6ActivityData();
}

function seedWeek6Lo2Diagnostic() { return seedWeek6ActivityById_('week6-lo2-diagnostic'); }
function seedWeek6EthicalLearning() { return seedWeek6ActivityById_('week6-ethical-learning'); }
function seedWeek6EthicalClassification() { return seedWeek6ActivityById_('week6-ethical-classification'); }
function seedWeek6LegislationLearning() { return seedWeek6ActivityById_('week6-legislation-learning'); }
function seedWeek6LegislationMatching() { return seedWeek6ActivityById_('week6-legislation-matching'); }
function seedWeek6OperationalConsiderations() { return seedWeek6ActivityById_('week6-operational-considerations'); }
function seedWeek6GovernmentInitiatives() { return seedWeek6ActivityById_('week6-government-initiatives'); }
function seedWeek6NcscGuidance() { return seedWeek6ActivityById_('week6-ncsc-guidance'); }
function seedWeek6ExerciseDecisionRecord() { return seedWeek6ActivityById_('week6-exercise-decision-record'); }
function seedWeek6Session1Review() { return seedWeek6ActivityById_('week6-session1-review'); }
function seedWeek6LegislationRetrieval() { return seedWeek6ActivityById_('week6-legislation-retrieval'); }
function seedWeek6EmployeeMonitoring() { return seedWeek6ActivityById_('week6-employee-monitoring'); }
function seedWeek6StakeholderDebate() { return seedWeek6ActivityById_('week6-stakeholder-debate'); }
function seedWeek6DiscussLearning() { return seedWeek6ActivityById_('week6-discuss-learning'); }
function seedWeek6DiscussPlanner() { return seedWeek6ActivityById_('week6-discuss-planner'); }
function seedWeek6OcrPractice() { return seedWeek6ActivityById_('week6-ocr-question-practice'); }
function seedWeek6AnswerImprovement() { return seedWeek6ActivityById_('week6-answer-improvement'); }
function seedWeek6RevisionOrganiser() { return seedWeek6ActivityById_('week6-revision-organiser'); }

/** Brief aliases */
function setupWeek6Api() { return runWeek6DeploymentBootstrap(); }
function validateWeek6Data() { return runAllWeek6ActivityDataTests(); }
function repairWeek6Data() { repairWeek6Workbook(); return seedAllWeek6ActivityData(); }

function seedWeek6ActivityById_(activityId) {
  var summary = blankSeedSummary_('seed:' + activityId);
  ensureWeek6ActivityCatalogueSheet_(summary);

  var manifest = getWeek6ManifestEntry_(activityId);
  if (!manifest) {
    summary.failed.push(activityId + ': unknown activity ID');
    return summary;
  }

  if (WEEK_6_ACCEPTED_ACTIVITY_TYPES.indexOf(manifest.activityType) === -1) {
    summary.failed.push(
      activityId + ': activity type not accepted: ' + manifest.activityType
    );
    return summary;
  }

  var pack = Week6ActivityDataService.getPackByActivityId_(activityId);
  if (!pack) {
    summary.failed.push(activityId + ': activity pack missing');
    return summary;
  }

  if (pack.meta.activityVersion !== manifest.activityVersion) {
    summary.failed.push(activityId + ': pack version mismatch');
    return summary;
  }
  if (pack.meta.maximumScore !== manifest.maximumScore) {
    summary.failed.push(activityId + ': pack total mismatch');
    return summary;
  }

  var questionMarks = sumAssessmentMarks_(pack);
  if (questionMarks !== manifest.maximumScore) {
    summary.failed.push(
      activityId +
        ': question marks sum (' +
        questionMarks +
        ') does not match maximumScore (' +
        manifest.maximumScore +
        ')'
    );
    return summary;
  }

  var sheet = getRequiredSheet_(WEEK6_ACTIVITY_CATALOGUE_SHEET);
  var existingRow = findCatalogueRow_(sheet, activityId);
  var row = [
    manifest.activityId,
    manifest.activityName,
    manifest.weekNumber,
    manifest.sessionNumber,
    manifest.activityType,
    manifest.activityVersion,
    manifest.maximumScore,
    manifest.enabled === true ? 'TRUE' : 'FALSE',
    manifest.componentId,
    countQuestions_(pack),
    new Date(),
    existingRow ? 'UPDATED' : 'INSERTED'
  ];

  try {
    if (existingRow) {
      sheet.getRange(existingRow, 1, existingRow, row.length).setValues([row]);
      summary.updated.push(activityId);
    } else {
      sheet.appendRow(row);
      summary.inserted.push(activityId);
    }
  } catch (err) {
    Logger.log('Seed write failed for ' + activityId + ': ' + err);
    summary.failed.push(activityId + ': spreadsheet write rejected');
  }

  return summary;
}

function ensureWeek6ActivityCatalogueSheet_(summary) {
  var spreadsheet = getWorkbook_();
  var sheet = spreadsheet.getSheetByName(WEEK6_ACTIVITY_CATALOGUE_SHEET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(WEEK6_ACTIVITY_CATALOGUE_SHEET);
    if (summary) {
      summary.messages.push('Created worksheet: ' + WEEK6_ACTIVITY_CATALOGUE_SHEET);
    }
  }

  var headers = sheet.getRange(1, 1, 1, WEEK6_ACTIVITY_CATALOGUE_HEADERS.length).getValues()[0];
  var matches = WEEK6_ACTIVITY_CATALOGUE_HEADERS.every(function (title, index) {
    return String(headers[index] || '') === title;
  });
  if (!matches) {
    if (sheet.getLastRow() <= 1 && !hasAnyCatalogueHeader_(headers)) {
      sheet.getRange(1, 1, 1, WEEK6_ACTIVITY_CATALOGUE_HEADERS.length).setValues([
        WEEK6_ACTIVITY_CATALOGUE_HEADERS.slice()
      ]);
    } else if (!matches && sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, WEEK6_ACTIVITY_CATALOGUE_HEADERS.length).setValues([
        WEEK6_ACTIVITY_CATALOGUE_HEADERS.slice()
      ]);
    } else if (!hasAnyCatalogueHeader_(headers)) {
      sheet.getRange(1, 1, 1, WEEK6_ACTIVITY_CATALOGUE_HEADERS.length).setValues([
        WEEK6_ACTIVITY_CATALOGUE_HEADERS.slice()
      ]);
    }
  }

  sheet.setFrozenRows(1);
  applyActivityTypeValidation_(sheet);
  return sheet;
}

function applyActivityTypeValidation_(sheet) {
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(WEEK_6_ACCEPTED_ACTIVITY_TYPES.slice(), true)
    .setAllowInvalid(false)
    .setHelpText('Use an accepted Week 6 activity type exactly.')
    .build();
  sheet.getRange('E2:E').setDataValidation(rule);
}

function findCatalogueRow_(sheet, activityId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return null;
  }
  var values = sheet.getRange(2, 1, lastRow, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]) === activityId) {
      return i + 2;
    }
  }
  return null;
}

function sumAssessmentMarks_(pack) {
  var total = 0;
  (pack.sections || []).forEach(function (section) {
    if (section.sectionType !== 'assessment') {
      return;
    }
    (section.questions || []).forEach(function (question) {
      total += Number(question.marks) || 0;
    });
  });
  return total;
}

function countQuestions_(pack) {
  var count = 0;
  (pack.sections || []).forEach(function (section) {
    count += (section.questions || []).length;
  });
  return count;
}

function blankSeedSummary_(name) {
  return {
    operation: name,
    inserted: [],
    updated: [],
    skipped: [],
    failed: [],
    messages: []
  };
}

function mergeSeedSummary_(target, part) {
  ['inserted', 'updated', 'skipped', 'failed', 'messages'].forEach(function (key) {
    target[key] = target[key].concat(part[key] || []);
  });
}

function hasAnyCatalogueHeader_(row) {
  for (var i = 0; i < row.length; i++) {
    if (String(row[i] || '') !== '') {
      return true;
    }
  }
  return false;
}
