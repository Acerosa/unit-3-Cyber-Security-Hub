/**
 * Idempotent Week 4 activity catalogue seed helpers.
 *
 * Educational content is stored in .gs packs (Week 1 Activity API pattern).
 * Seeds upsert catalogue rows in the shared spreadsheet for tutor visibility
 * without duplicating Week 1 records or rewriting learner results.
 */

var WEEK4_ACTIVITY_CATALOGUE_SHEET = 'Week 4 Activity Catalogue';

var WEEK4_ACTIVITY_CATALOGUE_HEADERS = Object.freeze([
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
 * Seeds every Week 4 activity catalogue row.
 *
 * @return {Object}
 */
function seedAllWeek4ActivityData() {
  var summary = blankSeedSummary_('seedAllWeek4ActivityData');
  ensureWeek4ActivityCatalogueSheet_(summary);

  getWeek4ManifestIds_().forEach(function (activityId) {
    mergeSeedSummary_(summary, seedWeek4ActivityById_(activityId));
  });

  Logger.log(JSON.stringify(summary, null, 2));
  if (summary.failed.length) {
    throw new Error(
      'Week 4 activity seeding completed with failures: ' + summary.failed.join('; ')
    );
  }
  return summary;
}

function seedWeek4Activities() {
  return seedAllWeek4ActivityData();
}

function seedWeek4Session1Retrieval() {
  return seedWeek4ActivityById_('week4-session1-retrieval');
}

function seedWeek4MotivationsLearning() {
  return seedWeek4ActivityById_('week4-motivations-learning');
}

function seedWeek4TargetsMethods() {
  return seedWeek4ActivityById_('week4-targets-methods');
}

function seedWeek4NorthbankExposure() {
  return seedWeek4ActivityById_('week4-northbank-exposure');
}

function seedWeek4Session2Retrieval() {
  return seedWeek4ActivityById_('week4-session2-retrieval');
}

function seedWeek4MtmMapping() {
  return seedWeek4ActivityById_('week4-mtm-mapping');
}

function seedWeek4AnalysePractice() {
  return seedWeek4ActivityById_('week4-analyse-practice');
}

function seedWeek4OcrPractice() {
  return seedWeek4ActivityById_('week4-ocr-question-practice');
}

function seedWeek4AnswerImprovement() {
  return seedWeek4ActivityById_('week4-answer-improvement');
}

function seedWeek4EthicalReview() {
  return seedWeek4ActivityById_('week4-ethical-review');
}

/**
 * @param {string} activityId
 * @return {Object}
 */
function seedWeek4ActivityById_(activityId) {
  var summary = blankSeedSummary_('seed:' + activityId);
  ensureWeek4ActivityCatalogueSheet_(summary);

  var manifest = getWeek4ManifestEntry_(activityId);
  if (!manifest) {
    summary.failed.push(activityId + ': unknown activity ID');
    return summary;
  }

  if (WEEK_4_ACCEPTED_ACTIVITY_TYPES.indexOf(manifest.activityType) === -1) {
    summary.failed.push(
      activityId + ': activity type not accepted: ' + manifest.activityType
    );
    return summary;
  }

  var pack = Week4ActivityDataService.getPackByActivityId_(activityId);
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

  var sheet = getRequiredSheet_(WEEK4_ACTIVITY_CATALOGUE_SHEET);
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

function ensureWeek4ActivityCatalogueSheet_(summary) {
  var spreadsheet = getWorkbook_();
  var sheet = spreadsheet.getSheetByName(WEEK4_ACTIVITY_CATALOGUE_SHEET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(WEEK4_ACTIVITY_CATALOGUE_SHEET);
    if (summary) {
      summary.messages.push('Created worksheet: ' + WEEK4_ACTIVITY_CATALOGUE_SHEET);
    }
  }

  var headers = sheet.getRange(1, 1, 1, WEEK4_ACTIVITY_CATALOGUE_HEADERS.length).getValues()[0];
  var matches = WEEK4_ACTIVITY_CATALOGUE_HEADERS.every(function (title, index) {
    return String(headers[index] || '') === title;
  });
  if (!matches) {
    if (sheet.getLastRow() <= 1 && !hasAnyCatalogueHeader_(headers)) {
      sheet.getRange(1, 1, 1, WEEK4_ACTIVITY_CATALOGUE_HEADERS.length).setValues([
        WEEK4_ACTIVITY_CATALOGUE_HEADERS.slice()
      ]);
    } else if (!matches && sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, WEEK4_ACTIVITY_CATALOGUE_HEADERS.length).setValues([
        WEEK4_ACTIVITY_CATALOGUE_HEADERS.slice()
      ]);
    } else if (!hasAnyCatalogueHeader_(headers)) {
      sheet.getRange(1, 1, 1, WEEK4_ACTIVITY_CATALOGUE_HEADERS.length).setValues([
        WEEK4_ACTIVITY_CATALOGUE_HEADERS.slice()
      ]);
    }
  }

  sheet.setFrozenRows(1);
  applyActivityTypeValidation_(sheet);
  return sheet;
}

function applyActivityTypeValidation_(sheet) {
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(WEEK_4_ACCEPTED_ACTIVITY_TYPES.slice(), true)
    .setAllowInvalid(false)
    .setHelpText('Use an accepted Week 1 / Week 4 activity type exactly.')
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
