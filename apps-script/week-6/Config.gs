/**
 * Week 6 Apps Script API configuration.
 *
 * Uses the shared Unit 3 spreadsheet. Do not put this ID in browser code.
 */

var CONFIG = Object.freeze({
  spreadsheetId: '1Q85_zt8cSrqpzSMNPuhvHXfa767QEhXSPnQznvSZe08',
  weekNumber: 6,
  activityVersion: '1.0',
  submissionsSheetName: 'All Submissions',
  weekResultsSheetName: 'Week 6 Results',
  errorsSheetName: 'Errors and Rejections',
  acceptingSubmissionsProperty: 'WEEK6_ACCEPTING_SUBMISSIONS'
});

var CONFIG_PLACEHOLDER_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';

/**
 * @return {GoogleAppsScript.Spreadsheet.Spreadsheet}
 */
function getWorkbook_() {
  return SpreadsheetApp.openById(CONFIG.spreadsheetId);
}

/**
 * @return {{ok: boolean, messages: string[]}}
 */
function checkWeek6Config() {
  var messages = [];
  var ok = true;

  if (!CONFIG.spreadsheetId || CONFIG.spreadsheetId === CONFIG_PLACEHOLDER_ID) {
    ok = false;
    messages.push('Spreadsheet ID is still the placeholder value.');
  }

  if (CONFIG.weekNumber !== 6) {
    ok = false;
    messages.push('CONFIG.weekNumber must be 6.');
  }

  var spreadsheet;
  try {
    spreadsheet = getWorkbook_();
    messages.push('Spreadsheet opened successfully: ' + spreadsheet.getName());
  } catch (err) {
    ok = false;
    messages.push('Unable to open the spreadsheet. Check the ID and sharing permissions.');
    Logger.log('checkWeek6Config open error: ' + err);
    return { ok: ok, messages: messages };
  }

  var requiredSheets = [
    CONFIG.submissionsSheetName,
    CONFIG.weekResultsSheetName,
    CONFIG.errorsSheetName
  ];

  requiredSheets.forEach(function (sheetName) {
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      ok = false;
      messages.push('Missing worksheet tab: ' + sheetName);
    } else {
      messages.push('Found worksheet tab: ' + sheetName);
    }
  });

  return { ok: ok, messages: messages };
}
