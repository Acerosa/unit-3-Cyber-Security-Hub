/**
 * Unit 3 Cyber Security — Week 2 API entry points.
 *
 * Keep this file small. Business logic lives in dedicated modules.
 */

/**
 * Health-check and activity-content endpoint for the Week 2 web app.
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
      service: 'Unit 3 Cyber Security Week 2 API',
      week: 2,
      status: 'ok',
      acceptingSubmissions: areWeek2SubmissionsOpen_()
    });
  }

  return Week2ActivityDataService.handleGet(e);
}

/**
 * Submission and Activity API marking endpoint.
 *
 * @param {Object} e
 * @return {GoogleAppsScript.Content.TextOutput}
 */
function doPost(e) {
  var routed = Week2ActivityDataService.handlePost(e);
  if (routed) {
    return routed;
  }
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

/**
 * One-shot deployment bootstrap: workbook setup, data tests, catalogue seed,
 * then open Week 2 submissions.
 *
 * @return {Object}
 */
function runWeek2DeploymentBootstrap() {
  var setup = setupWeek2Workbook();
  var dataTests = runAllWeek2ActivityDataTests();
  var seed = seedAllWeek2ActivityData();
  openWeek2Submissions();
  var apiTests;
  try {
    apiTests = runAllWeek2SelfTests();
  } catch (err) {
    // Spreadsheet tab checks may fail before setup; re-run after setup above.
    apiTests = runAllWeek2SelfTests();
  }

  var summary = {
    setupOk: !!(setup && setup.ok),
    dataTests: dataTests,
    seedInserted: (seed && seed.inserted) || [],
    seedUpdated: (seed && seed.updated) || [],
    seedFailed: (seed && seed.failed) || [],
    apiTests: apiTests,
    acceptingSubmissions: areWeek2SubmissionsOpen_()
  };
  Logger.log(JSON.stringify(summary, null, 2));
  return summary;
}
