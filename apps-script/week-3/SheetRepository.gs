/**
 * Spreadsheet access for the Week 3 API.
 *
 * Always opens the shared workbook by CONFIG.spreadsheetId.
 */

var ALL_SUBMISSIONS_HEADERS = Object.freeze([
  'Server Timestamp',
  'Learner Name',
  'Learner ID',
  'Group',
  'Week',
  'Session',
  'Activity ID',
  'Activity Version',
  'Score',
  'Total',
  'Percentage',
  'Attempt Number',
  'Client Completed At',
  'Submission Key',
  'Status'
]);

var WEEK_3_RESULTS_HEADERS = Object.freeze([
  'Server Timestamp',
  'Learner Name',
  'Learner ID',
  'Group',
  'Session',
  'Activity ID',
  'Activity Version',
  'Score',
  'Total',
  'Percentage',
  'Attempt Number',
  'Submission Key'
]);

var ERRORS_HEADERS = Object.freeze([
  'Server Timestamp',
  'Learner Name',
  'Group',
  'Week',
  'Session',
  'Activity ID',
  'Activity Version',
  'Submitted Score',
  'Submitted Total',
  'Error Codes',
  'Error Messages',
  'Raw Payload'
]);

/**
 * @param {string} sheetName
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getRequiredSheet_(sheetName) {
  var spreadsheet = getWorkbook_();
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Required worksheet is missing: ' + sheetName);
  }
  return sheet;
}

/**
 * @param {Object} submission
 */
function appendSubmission_(submission) {
  var sheet = getRequiredSheet_(CONFIG.submissionsSheetName);
  var percentage = calculatePercentage_(submission.score, submission.total);
  sheet.appendRow([
    submission.serverTimestamp,
    submission.learnerName,
    submission.learnerId || '',
    submission.groupName,
    submission.weekNumber,
    submission.sessionNumber,
    submission.activityId,
    submission.activityVersion,
    submission.score,
    submission.total,
    percentage,
    submission.attemptNumber,
    submission.completedAt || '',
    submission.submissionKey,
    submission.status || 'RECORDED'
  ]);
}

/**
 * @param {Object} submission
 */
function appendWeek3Result_(submission) {
  var sheet = getRequiredSheet_(CONFIG.weekResultsSheetName);
  var percentage = calculatePercentage_(submission.score, submission.total);
  sheet.appendRow([
    submission.serverTimestamp,
    submission.learnerName,
    submission.learnerId || '',
    submission.groupName,
    submission.sessionNumber,
    submission.activityId,
    submission.activityVersion,
    submission.score,
    submission.total,
    percentage,
    submission.attemptNumber,
    submission.submissionKey
  ]);
}

/**
 * @param {Object} submission
 * @param {Object[]} errors
 * @param {string=} rawPayload
 */
function appendRejectedSubmission_(submission, errors, rawPayload) {
  var sheet = getRequiredSheet_(CONFIG.errorsSheetName);
  var safeSubmission = submission || {};
  var codes = (errors || [])
    .map(function (item) {
      return item.code;
    })
    .join('; ');
  var messages = (errors || [])
    .map(function (item) {
      return item.message;
    })
    .join('; ');

  sheet.appendRow([
    new Date(),
    safeSubmission.learnerName || '',
    safeSubmission.groupName || '',
    safeSubmission.weekNumber === null || safeSubmission.weekNumber === undefined
      ? ''
      : safeSubmission.weekNumber,
    safeSubmission.sessionNumber === null || safeSubmission.sessionNumber === undefined
      ? ''
      : safeSubmission.sessionNumber,
    safeSubmission.activityId || '',
    safeSubmission.activityVersion || '',
    safeSubmission.score === null || safeSubmission.score === undefined
      ? ''
      : safeSubmission.score,
    safeSubmission.total === null || safeSubmission.total === undefined
      ? ''
      : safeSubmission.total,
    codes,
    messages,
    sanitiseRawPayload_(rawPayload || '')
  ]);
}

/**
 * @param {string} submissionKey
 * @return {number|null} 1-based row number, or null when not found
 */
function findSubmissionByKey_(submissionKey) {
  if (!submissionKey) {
    return null;
  }

  var sheet = getRequiredSheet_(CONFIG.submissionsSheetName);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return null;
  }

  var keyColumn = ALL_SUBMISSIONS_HEADERS.indexOf('Submission Key') + 1;
  if (keyColumn < 1) {
    throw new Error('Submission Key column is missing from All Submissions headers.');
  }

  var values = sheet.getRange(2, keyColumn, lastRow, keyColumn).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]) === submissionKey) {
      return i + 2;
    }
  }
  return null;
}

/**
 * @param {number} score
 * @param {number} total
 * @return {number|string}
 */
function calculatePercentage_(score, total) {
  if (typeof score !== 'number' || typeof total !== 'number' || total <= 0) {
    return '';
  }
  return score / total;
}

/**
 * Avoid storing lengthy free-text reflections or partner details in the errors tab.
 *
 * @param {string} rawPayload
 * @return {string}
 */
function sanitiseRawPayload_(rawPayload) {
  var text = String(rawPayload || '');
  try {
    var parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object') {
      delete parsed.reflection;
      delete parsed.questionsForReview;
      delete parsed.mostDifficultItem;
      delete parsed.partnerFirstName;
      delete parsed.partnerSurname;
      delete parsed.partnerStudentId;
      text = JSON.stringify(parsed);
    }
  } catch (err) {
    // Keep a truncated plain-text summary when the payload is not JSON.
  }
  if (text.length > 500) {
    return text.substring(0, 500) + '…';
  }
  return text;
}
