/**
 * Unit 3 Cyber Security — Week 3 API entry points.
 *
 * Keep this file small. Business logic lives in dedicated modules.
 */

/**
 * Health-check and activity-content endpoint for the Week 3 web app.
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
      service: 'Unit 3 Cyber Security Week 3 API',
      week: 3,
      status: 'ok',
      acceptingSubmissions: areWeek3SubmissionsOpen_()
    });
  }

  return Week3ActivityDataService.handleGet(e);
}

/**
 * Submission and Activity API marking endpoint.
 *
 * @param {Object} e
 * @return {GoogleAppsScript.Content.TextOutput}
 */
function doPost(e) {
  var routed = Week3ActivityDataService.handlePost(e);
  if (routed) {
    return routed;
  }
  return SubmissionService.handle(e);
}

/**
 * Opens Week 3 submissions via Script Properties.
 */
function openWeek3Submissions() {
  PropertiesService.getScriptProperties().setProperty(
    CONFIG.acceptingSubmissionsProperty,
    'true'
  );
  Logger.log('Week 3 submissions are now open.');
}

/**
 * Closes Week 3 submissions via Script Properties.
 */
function closeWeek3Submissions() {
  PropertiesService.getScriptProperties().setProperty(
    CONFIG.acceptingSubmissionsProperty,
    'false'
  );
  Logger.log('Week 3 submissions are now closed.');
}

/**
 * @return {boolean}
 */
function areWeek3SubmissionsOpen_() {
  var value = PropertiesService.getScriptProperties().getProperty(
    CONFIG.acceptingSubmissionsProperty
  );
  return value === 'true';
}

/**
 * Logs and returns the current Week 3 submission gate status.
 *
 * @return {{acceptingSubmissions: boolean, propertyValue: string}}
 */
function getWeek3SubmissionStatus() {
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
 * then open Week 3 submissions.
 *
 * @return {Object}
 */
function runWeek3DeploymentBootstrap() {
  var setup = setupWeek3Workbook();
  var dataTests = runAllWeek3ActivityDataTests();
  var seed = seedAllWeek3ActivityData();
  openWeek3Submissions();
  var apiTests;
  try {
    apiTests = runAllWeek3SelfTests();
  } catch (err) {
    // Spreadsheet tab checks may fail before setup; re-run after setup above.
    apiTests = runAllWeek3SelfTests();
  }

  var summary = {
    setupOk: !!(setup && setup.ok),
    dataTests: dataTests,
    seedInserted: (seed && seed.inserted) || [],
    seedUpdated: (seed && seed.updated) || [],
    seedFailed: (seed && seed.failed) || [],
    apiTests: apiTests,
    acceptingSubmissions: areWeek3SubmissionsOpen_()
  };
  Logger.log(JSON.stringify(summary, null, 2));
  return summary;
}
