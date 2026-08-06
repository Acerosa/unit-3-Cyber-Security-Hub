/**
 * Unit 3 Cyber Security — Week 4 API entry points.
 *
 * Keep this file small. Business logic lives in dedicated modules.
 */

/**
 * Health-check and activity-content endpoint for the Week 4 web app.
 *
 * Unsupported content actions fall back to the original health payload so
 * simple uptime checks keep working.
 *
 * @param {Object} e
 * @return {GoogleAppsScript.Content.TextOutput}
 */
function doGet(e) {
  var params = (e && e.parameter) || {};
  var action = String(params.action || '');

  if (!action) {
    return ResponseFactory.health({
      service: 'Unit 3 Cyber Security Week 4 API',
      week: 4,
      status: 'ok',
      acceptingSubmissions: areWeek4SubmissionsOpen_()
    });
  }

  return Week4ActivityDataService.handleGet(e);
}

/**
 * Submission and Activity API marking endpoint.
 *
 * @param {Object} e
 * @return {GoogleAppsScript.Content.TextOutput}
 */
function doPost(e) {
  var routed = Week4ActivityDataService.handlePost(e);
  if (routed) {
    return routed;
  }
  return SubmissionService.handle(e);
}

/**
 * Opens Week 4 submissions via Script Properties.
 */
function openWeek4Submissions() {
  PropertiesService.getScriptProperties().setProperty(
    CONFIG.acceptingSubmissionsProperty,
    'true'
  );
  Logger.log('Week 4 submissions are now open.');
}

/**
 * Closes Week 4 submissions via Script Properties.
 */
function closeWeek4Submissions() {
  PropertiesService.getScriptProperties().setProperty(
    CONFIG.acceptingSubmissionsProperty,
    'false'
  );
  Logger.log('Week 4 submissions are now closed.');
}

/**
 * @return {boolean}
 */
function areWeek4SubmissionsOpen_() {
  var value = PropertiesService.getScriptProperties().getProperty(
    CONFIG.acceptingSubmissionsProperty
  );
  return value === 'true';
}

/**
 * Logs and returns the current Week 4 submission gate status.
 *
 * @return {{acceptingSubmissions: boolean, propertyValue: string}}
 */
function getWeek4SubmissionStatus() {
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

/**
 * One-shot deployment bootstrap: workbook setup, data tests, catalogue seed,
 * then open Week 4 submissions.
 *
 * @return {Object}
 */
function runWeek4DeploymentBootstrap() {
  var setup = setupWeek4Workbook();
  var dataTests = runAllWeek4ActivityDataTests();
  var seed = seedAllWeek4ActivityData();
  openWeek4Submissions();
  var apiTests;
  try {
    apiTests = runAllWeek4SelfTests();
  } catch (err) {
    // Spreadsheet tab checks may fail before setup; re-run after setup above.
    apiTests = runAllWeek4SelfTests();
  }

  var summary = {
    setupOk: !!(setup && setup.ok),
    dataTests: dataTests,
    seedInserted: (seed && seed.inserted) || [],
    seedUpdated: (seed && seed.updated) || [],
    seedFailed: (seed && seed.failed) || [],
    apiTests: apiTests,
    acceptingSubmissions: areWeek4SubmissionsOpen_()
  };
  Logger.log(JSON.stringify(summary, null, 2));
  return summary;
}
