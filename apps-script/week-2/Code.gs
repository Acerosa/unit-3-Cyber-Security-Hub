/**
 * Unit 3 Cyber Security — Week 2 API entry points.
 *
 * Keep this file small. Business logic lives in dedicated modules.
 */

/**
 * Health-check endpoint for the Week 2 web app.
 *
 * @param {Object} e
 * @return {GoogleAppsScript.Content.TextOutput}
 */
function doGet(e) {
  return ResponseFactory.health({
    service: 'Unit 3 Cyber Security Week 2 API',
    week: 2,
    status: 'ok',
    acceptingSubmissions: areWeek2SubmissionsOpen_()
  });
}

/**
 * Submission endpoint for the Week 2 web app.
 *
 * @param {Object} e
 * @return {GoogleAppsScript.Content.TextOutput}
 */
function doPost(e) {
  return SubmissionService.handle(e);
}

/**
 * Opens Week 2 submissions via Script Properties.
 */
function openWeek2Submissions() {
  PropertiesService.getScriptProperties().setProperty(
    CONFIG.acceptingSubmissionsProperty,
    'true'
  );
  Logger.log('Week 2 submissions are now open.');
}

/**
 * Closes Week 2 submissions via Script Properties.
 */
function closeWeek2Submissions() {
  PropertiesService.getScriptProperties().setProperty(
    CONFIG.acceptingSubmissionsProperty,
    'false'
  );
  Logger.log('Week 2 submissions are now closed.');
}

/**
 * @return {boolean}
 */
function areWeek2SubmissionsOpen_() {
  var value = PropertiesService.getScriptProperties().getProperty(
    CONFIG.acceptingSubmissionsProperty
  );
  return value === 'true';
}

/**
 * Logs and returns the current Week 2 submission gate status.
 *
 * @return {{acceptingSubmissions: boolean, propertyValue: string}}
 */
function getWeek2SubmissionStatus() {
  var raw = PropertiesService.getScriptProperties().getProperty(
    CONFIG.acceptingSubmissionsProperty
  );
  var status = {
    acceptingSubmissions: raw === 'true',
    propertyValue: raw === null || raw === undefined ? '' : String(raw)
  };
  Logger.log(JSON.stringify(status));
  return status;
}
