/**
 * Idempotent Week 2 activity catalogue seed helpers.
 *
 * Educational content is stored in .gs packs (Week 1 Activity API pattern).
 * Seeds upsert catalogue rows in the shared spreadsheet for tutor visibility
 * without duplicating Week 1 records or rewriting learner results.
 */

var WEEK2_ACTIVITY_CATALOGUE_SHEET = 'Week 2 Activity Catalogue';

var WEEK2_ACTIVITY_CATALOGUE_HEADERS = Object.freeze([
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
 * Seeds every Week 2 activity catalogue row.
 *
 * @return {Object}
 */
function seedAllWeek2ActivityData() {
  var summary = blankSeedSummary_('seedAllWeek2ActivityData');
  ensureWeek2ActivityCatalogueSheet_(summary);

  getWeek2ManifestIds_().forEach(function (activityId) {
    mergeSeedSummary_(summary, seedWeek2ActivityById_(activityId));
  });

  Logger.log(JSON.stringify(summary, null, 2));
  if (summary.failed.length) {
    throw new Error(
      'Week 2 activity seeding completed with failures: ' + summary.failed.join('; ')
    );
  }
  return summary;
}

function seedWeek2Activities() {
  return seedAllWeek2ActivityData();
}

function seedWeek2Session1Retrieval() {
  return seedWeek2ActivityById_('week2-session1-retrieval');
}

function seedWeek2ThreatVulnerabilityLearning() {
  return seedWeek2ActivityById_('week2-threat-vulnerability-learning');
}

function seedWeek2MalwareSymptoms() {
  return seedWeek2ActivityById_('week2-malware-symptoms');
}

function seedWeek2ThreatVulnerabilitySort() {
  return seedWeek2ActivityById_('week2-threat-vulnerability-sort');
}

function seedWeek2Vulnerabilities101Reflection() {
  return seedWeek2ActivityById_('week2-vulnerabilities101-reflection');
}

function seedWeek2Session2Retrieval() {
  return seedWeek2ActivityById_('week2-session2-retrieval');
}

function seedWeek2NorthbankAnalysis() {
  return seedWeek2ActivityById_('week2-northbank-vulnerability-analysis');
}

function seedWeek2SixMarkGuide() {
  return seedWeek2ActivityById_('week2-six-mark-response-guide');
}

function seedWeek2OcrPractice() {
  return seedWeek2ActivityById_('week2-ocr-question-practice');
}

function seedWeek2PeerMarking() {
  return seedWeek2ActivityById_('week2-peer-marking-answer-improvement');
}

function seedWeek2VulnerabilityRegister() {
  return seedWeek2ActivityById_('week2-northbank-vulnerability-register');
}

/**
 * @param {string} activityId
 * @return {Object}
 */
function seedWeek2ActivityById_(activityId) {
  var summary = blankSeedSummary_('seed:' + activityId);
  ensureWeek2ActivityCatalogueSheet_(summary);

  var manifest = getWeek2ManifestEntry_(activityId);
  if (!manifest) {
    summary.failed.push(activityId + ': unknown activity ID');
    return summary;
  }

  if (WEEK_2_ACCEPTED_ACTIVITY_TYPES.indexOf(manifest.activityType) === -1) {
    summary.failed.push(
      activityId + ': activity type not accepted: ' + manifest.activityType
    );
    return summary;
  }

  var pack = Week2ActivityDataService.getPackByActivityId_(activityId);
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

  var sheet = getRequiredSheet_(WEEK2_ACTIVITY_CATALOGUE_SHEET);
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

function ensureWeek2ActivityCatalogueSheet_(summary) {
  var spreadsheet = getWorkbook_();
  var sheet = spreadsheet.getSheetByName(WEEK2_ACTIVITY_CATALOGUE_SHEET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(WEEK2_ACTIVITY_CATALOGUE_SHEET);
    if (summary) {
      summary.messages.push('Created worksheet: ' + WEEK2_ACTIVITY_CATALOGUE_SHEET);
    }
  }

  var headers = sheet.getRange(1, 1, 1, WEEK2_ACTIVITY_CATALOGUE_HEADERS.length).getValues()[0];
  var matches = WEEK2_ACTIVITY_CATALOGUE_HEADERS.every(function (title, index) {
    return String(headers[index] || '') === title;
  });
  if (!matches) {
    if (sheet.getLastRow() <= 1 && !hasAnyCatalogueHeader_(headers)) {
      sheet.getRange(1, 1, 1, WEEK2_ACTIVITY_CATALOGUE_HEADERS.length).setValues([
        WEEK2_ACTIVITY_CATALOGUE_HEADERS.slice()
      ]);
    } else if (!matches && sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, WEEK2_ACTIVITY_CATALOGUE_HEADERS.length).setValues([
        WEEK2_ACTIVITY_CATALOGUE_HEADERS.slice()
      ]);
    } else if (!hasAnyCatalogueHeader_(headers)) {
      sheet.getRange(1, 1, 1, WEEK2_ACTIVITY_CATALOGUE_HEADERS.length).setValues([
        WEEK2_ACTIVITY_CATALOGUE_HEADERS.slice()
      ]);
    }
  }

  sheet.setFrozenRows(1);
  applyActivityTypeValidation_(sheet);
  return sheet;
}

function applyActivityTypeValidation_(sheet) {
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(WEEK_2_ACCEPTED_ACTIVITY_TYPES.slice(), true)
    .setAllowInvalid(false)
    .setHelpText('Use an accepted Week 1 / Week 2 activity type exactly.')
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
