/**
 * Unit 3 formative results collector v2
 *
 * Backward-compatible update for activities that submit either 12 or 15
 * as totalCards while preserving the existing field names and worksheet.
 *
 * Tutor deployment steps are documented in README.md in this folder.
 *
 * Expected POST fields:
 * attemptId, classGroup, pairCode, learner1, learner2, score, totalCards,
 * incorrectCards, hardestCard, justification, completionTime,
 * activityVersion, sourcePage
 */

var CONFIG_SHEET = 'Configuration';
var RESULTS_SHEET = 'Results';
var LOCK_TIMEOUT_MS = 30000;

function doGet() {
  return HtmlService.createHtmlOutput(
    '<p>Unit 3 collector is ready for POST submissions.</p>'
  );
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(LOCK_TIMEOUT_MS);
    var params = (e && e.parameter) ? e.parameter : {};
    var result = processSubmission_(params);
    return HtmlService.createHtmlOutput(result.html);
  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<h1>Submission error</h1><p>' +
        escapeHtml_(String(err && err.message ? err.message : err)) +
        '</p>'
    );
  } finally {
    try { lock.releaseLock(); } catch (releaseErr) { /* ignore */ }
  }
}

function setupWorkbook() {
  var ss = SpreadsheetApp.getActive();
  ensureConfiguration_(ss);
  ensureResultsSheet_(ss);
}

function processSubmission_(params) {
  var ss = SpreadsheetApp.getActive();
  ensureConfiguration_(ss);
  ensureResultsSheet_(ss);

  var config = readConfiguration_(ss);
  var validation = validateSubmission_(params, config);
  if (!validation.valid) {
    return {
      html:
        '<h1>Submission rejected</h1><ul><li>' +
        validation.errors.map(escapeHtml_).join('</li><li>') +
        '</li></ul>'
    };
  }

  if (isDuplicateAttempt_(ss, validation.data.attemptId)) {
    return {
      html:
        '<h1>Duplicate attempt</h1><p>Attempt ID already recorded: ' +
        escapeHtml_(validation.data.attemptId) +
        '</p>'
    };
  }

  appendResult_(ss, validation.data);
  return {
    html:
      '<h1>Submission accepted</h1><p>Attempt ID: ' +
      escapeHtml_(validation.data.attemptId) +
      '</p><p>Score: ' +
      escapeHtml_(String(validation.data.score)) +
      ' / ' +
      escapeHtml_(String(validation.data.totalCards)) +
      '</p>'
  };
}

function ensureConfiguration_(ss) {
  var sheet = ss.getSheetByName(CONFIG_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG_SHEET);
    sheet.getRange(1, 1, 1, 2).setValues([['Setting', 'Value']]);
  }

  var values = sheet.getDataRange().getValues();
  var map = {};
  for (var i = 1; i < values.length; i++) {
    map[String(values[i][0])] = values[i][1];
  }

  var defaults = {
    'Total cards': 12,
    'Allowed totals': '12,15',
    'Max justification length': 1000,
    'Max completion time seconds': 7200
  };

  Object.keys(defaults).forEach(function (key) {
    if (map[key] === undefined || map[key] === null || map[key] === '') {
      sheet.appendRow([key, defaults[key]]);
    }
  });
}

function readConfiguration_(ss) {
  var sheet = ss.getSheetByName(CONFIG_SHEET);
  var values = sheet.getDataRange().getValues();
  var map = {};
  for (var i = 1; i < values.length; i++) {
    map[String(values[i][0])] = values[i][1];
  }

  var allowedTotals = parseAllowedTotals_(map['Allowed totals'], map['Total cards']);
  return {
    allowedTotals: allowedTotals,
    maxJustification: Number(map['Max justification length']) || 1000,
    maxCompletionTime: Number(map['Max completion time seconds']) || 7200
  };
}

function parseAllowedTotals_(allowedTotalsValue, fallbackTotal) {
  if (allowedTotalsValue !== undefined && allowedTotalsValue !== null && String(allowedTotalsValue).trim() !== '') {
    return String(allowedTotalsValue)
      .split(',')
      .map(function (part) { return Number(String(part).trim()); })
      .filter(function (n) { return Number.isInteger(n) && n > 0; });
  }
  var fallback = Number(fallbackTotal);
  return Number.isInteger(fallback) && fallback > 0 ? [fallback] : [12];
}

function ensureResultsSheet_(ss) {
  var sheet = ss.getSheetByName(RESULTS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(RESULTS_SHEET);
    sheet.appendRow([
      'timestamp',
      'attemptId',
      'classGroup',
      'pairCode',
      'learner1',
      'learner2',
      'score',
      'totalCards',
      'incorrectCards',
      'hardestCard',
      'justification',
      'completionTime',
      'activityVersion',
      'sourcePage'
    ]);
  }
}

function validateSubmission_(params, config) {
  var errors = [];
  var data = {
    attemptId: cleanText_(params.attemptId, 100),
    classGroup: cleanText_(params.classGroup, 100),
    pairCode: cleanText_(params.pairCode, 50),
    learner1: cleanText_(params.learner1, 100),
    learner2: cleanText_(params.learner2, 100),
    score: Number(params.score),
    totalCards: Number(params.totalCards),
    incorrectCards: cleanText_(params.incorrectCards, 200),
    hardestCard: Number(params.hardestCard),
    justification: cleanText_(params.justification, config.maxJustification),
    completionTime: Number(params.completionTime),
    activityVersion: cleanText_(params.activityVersion, 20),
    sourcePage: cleanText_(params.sourcePage, 500)
  };

  if (!data.attemptId) errors.push('attemptId is required.');
  if (!data.classGroup) errors.push('classGroup is required.');
  if (!data.pairCode) errors.push('pairCode is required.');
  if (config.allowedTotals.indexOf(data.totalCards) === -1) {
    errors.push('totalCards must be one of: ' + config.allowedTotals.join(', '));
  }
  if (!Number.isInteger(data.score) || data.score < 0 || data.score > data.totalCards) {
    errors.push('score must be a whole number from 0 to totalCards.');
  }
  if (!Number.isInteger(data.hardestCard) || data.hardestCard < 1) {
    errors.push('hardestCard must be a positive whole number.');
  }
  if (!Number.isInteger(data.completionTime) || data.completionTime < 1 || data.completionTime > config.maxCompletionTime) {
    errors.push('completionTime is invalid.');
  }
  if (!data.activityVersion) errors.push('activityVersion is required.');
  if (!data.justification) errors.push('justification is required.');

  return { valid: errors.length === 0, errors: errors, data: data };
}

function isDuplicateAttempt_(ss, attemptId) {
  var sheet = ss.getSheetByName(RESULTS_SHEET);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][1]) === String(attemptId)) return true;
  }
  return false;
}

function appendResult_(ss, data) {
  var sheet = ss.getSheetByName(RESULTS_SHEET);
  sheet.appendRow([
    new Date(),
    data.attemptId,
    data.classGroup,
    data.pairCode,
    data.learner1,
    data.learner2,
    data.score,
    data.totalCards,
    data.incorrectCards,
    data.hardestCard,
    data.justification,
    data.completionTime,
    data.activityVersion,
    data.sourcePage
  ]);
}

function cleanText_(value, maxLength) {
  var text = value == null ? '' : String(value);
  text = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
  if (/^[=+\-@]/.test(text)) {
    text = "'" + text;
  }
  if (text.length > maxLength) {
    text = text.slice(0, maxLength);
  }
  return text;
}

function escapeHtml_(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
