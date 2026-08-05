/**
 * Creates and repairs Week 3 worksheet tabs in the shared Unit 3 spreadsheet.
 *
 * Existing Week 1 tabs and learner results are preserved.
 */

/**
 * Sets up Week 3 tabs, headers and formatting.
 *
 * @return {{ok: boolean, messages: string[]}}
 */
function setupWeek3Workbook() {
  var messages = [];
  var spreadsheet = getWorkbook_();
  messages.push('Opened spreadsheet: ' + spreadsheet.getName());

  ensureSheetWithHeaders_(
    spreadsheet,
    CONFIG.submissionsSheetName,
    ALL_SUBMISSIONS_HEADERS,
    messages
  );
  ensureSheetWithHeaders_(
    spreadsheet,
    CONFIG.weekResultsSheetName,
    WEEK_3_RESULTS_HEADERS,
    messages
  );
  ensureSheetWithHeaders_(
    spreadsheet,
    CONFIG.errorsSheetName,
    ERRORS_HEADERS,
    messages
  );

  formatSubmissionsSheet_(spreadsheet.getSheetByName(CONFIG.submissionsSheetName));
  formatWeek3ResultsSheet_(spreadsheet.getSheetByName(CONFIG.weekResultsSheetName));
  formatErrorsSheet_(spreadsheet.getSheetByName(CONFIG.errorsSheetName));

  ensureWeek3ActivityCatalogueSheet_({ messages: messages });
  messages.push('Week 3 Activity Catalogue is ready for seedAllWeek3ActivityData().');

  messages.push('Week 3 workbook setup complete.');
  Logger.log(messages.join('\n'));
  return { ok: true, messages: messages };
}

/**
 * Repairs missing Week 3 tabs or headers without clearing learner data.
 *
 * @return {{ok: boolean, messages: string[]}}
 */
function repairWeek3Workbook() {
  var messages = [];
  var spreadsheet = getWorkbook_();
  messages.push('Repairing spreadsheet: ' + spreadsheet.getName());

  ensureSheetWithHeaders_(
    spreadsheet,
    CONFIG.submissionsSheetName,
    ALL_SUBMISSIONS_HEADERS,
    messages
  );
  ensureSheetWithHeaders_(
    spreadsheet,
    CONFIG.weekResultsSheetName,
    WEEK_3_RESULTS_HEADERS,
    messages
  );
  ensureSheetWithHeaders_(
    spreadsheet,
    CONFIG.errorsSheetName,
    ERRORS_HEADERS,
    messages
  );

  formatSubmissionsSheet_(spreadsheet.getSheetByName(CONFIG.submissionsSheetName));
  formatWeek3ResultsSheet_(spreadsheet.getSheetByName(CONFIG.weekResultsSheetName));
  formatErrorsSheet_(spreadsheet.getSheetByName(CONFIG.errorsSheetName));

  messages.push('Week 3 workbook repair complete.');
  Logger.log(messages.join('\n'));
  return { ok: true, messages: messages };
}

/**
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet
 * @param {string} sheetName
 * @param {string[]} headers
 * @param {string[]} messages
 */
function ensureSheetWithHeaders_(spreadsheet, sheetName, headers, messages) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    messages.push('Created worksheet: ' + sheetName);
  } else {
    messages.push('Reused worksheet: ' + sheetName);
  }

  var lastColumn = Math.max(sheet.getLastColumn(), headers.length);
  var existingHeader = [];
  if (sheet.getLastRow() >= 1 && sheet.getLastColumn() >= 1) {
    existingHeader = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  }

  var hasExpectedHeader = headers.every(function (title, index) {
    return String(existingHeader[index] || '') === title;
  });

  if (sheet.getLastRow() === 0 || !hasExpectedHeader) {
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      messages.push('Added headers to ' + sheetName);
    } else if (!hasAnyHeaderValue_(existingHeader)) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      messages.push('Added headers to empty header row on ' + sheetName);
    } else {
      messages.push(
        'Left existing headers on ' +
          sheetName +
          ' unchanged to protect learner data. Expected headers differ.'
      );
      Logger.log(
        'Header mismatch on ' +
          sheetName +
          '. Existing=' +
          JSON.stringify(existingHeader) +
          ' Expected=' +
          JSON.stringify(headers)
      );
    }
  } else {
    messages.push('Headers already present on ' + sheetName);
  }

  sheet.setFrozenRows(1);
  if (!sheet.getFilter()) {
    var filterRows = Math.max(sheet.getLastRow(), 2);
    sheet.getRange(1, 1, filterRows, headers.length).createFilter();
  }
}

function hasAnyHeaderValue_(row) {
  for (var i = 0; i < row.length; i++) {
    if (String(row[i] || '') !== '') {
      return true;
    }
  }
  return false;
}

function formatSubmissionsSheet_(sheet) {
  if (!sheet) return;
  applyHeaderStyle_(sheet, ALL_SUBMISSIONS_HEADERS.length);
  sheet.setColumnWidths(1, ALL_SUBMISSIONS_HEADERS.length, 120);
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 160);
  sheet.setColumnWidth(7, 220);
  sheet.setColumnWidth(14, 220);
  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sheet.getRange('K:K').setNumberFormat('0.0%');

  var scoreRule = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThanOrEqualTo(0)
    .setAllowInvalid(false)
    .setHelpText('Score must be zero or greater.')
    .build();
  sheet.getRange('I2:I').setDataValidation(scoreRule);
}

function formatWeek3ResultsSheet_(sheet) {
  if (!sheet) return;
  applyHeaderStyle_(sheet, WEEK_3_RESULTS_HEADERS.length);
  sheet.setColumnWidths(1, WEEK_3_RESULTS_HEADERS.length, 120);
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 160);
  sheet.setColumnWidth(6, 220);
  sheet.setColumnWidth(12, 220);
  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sheet.getRange('J:J').setNumberFormat('0.0%');
}

function formatErrorsSheet_(sheet) {
  if (!sheet) return;
  applyHeaderStyle_(sheet, ERRORS_HEADERS.length);
  sheet.setColumnWidths(1, ERRORS_HEADERS.length, 120);
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(10, 200);
  sheet.setColumnWidth(11, 260);
  sheet.setColumnWidth(12, 260);
  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
}

function applyHeaderStyle_(sheet, columnCount) {
  var header = sheet.getRange(1, 1, 1, columnCount);
  header.setFontWeight('bold');
  header.setBackground('#E8EEF7');
  header.setWrap(true);
}
