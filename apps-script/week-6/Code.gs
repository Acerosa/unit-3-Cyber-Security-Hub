/**
 * Unit 3 Cyber Security  -  Week 6 API entry points.
 *
 * Keep this file small. Business logic lives in dedicated modules.
 */

/**
 * Health-check and activity-content endpoint for the Week 6 web app.
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
      service: 'Unit 3 Cyber Security Week 6 API',
      week: 6,
      status: 'ok',
      acceptingSubmissions: areWeek6SubmissionsOpen_()
    });
  }

  return Week6ActivityDataService.handleGet(e);
}

/**
 * Submission and Activity API marking endpoint.
 *
 * @param {Object} e
 * @return {GoogleAppsScript.Content.TextOutput}
 */
function doPost(e) {
  var routed = Week6ActivityDataService.handlePost(e);
  if (routed) {
    return routed;
  }
  return SubmissionService.handle(e);
}

/**
 * Opens Week 6 submissions via Script Properties.
 */
function openWeek6Submissions() {
  PropertiesService.getScriptProperties().setProperty(
    CONFIG.acceptingSubmissionsProperty,
    'true'
  );
  Logger.log('Week 6 submissions are now open.');
}

/**
 * Closes Week 6 submissions via Script Properties.
 */
function closeWeek6Submissions() {
  PropertiesService.getScriptProperties().setProperty(
    CONFIG.acceptingSubmissionsProperty,
    'false'
  );
  Logger.log('Week 6 submissions are now closed.');
}

/**
 * @return {boolean}
 */
function areWeek6SubmissionsOpen_() {
  var value = PropertiesService.getScriptProperties().getProperty(
    CONFIG.acceptingSubmissionsProperty
  );
  return value === 'true';
}

/**
 * Logs and returns the current Week 6 submission gate status.
 *
 * @return {{acceptingSubmissions: boolean, propertyValue: string}}
 */
function getWeek6SubmissionStatus() {
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
 * then open Week 6 submissions.
 *
 * @return {Object}
 */
function runWeek6DeploymentBootstrap() {
  var setup = setupWeek6Workbook();
  var dataTests = runAllWeek6ActivityDataTests();
  var seed = seedAllWeek6ActivityData();
  openWeek6Submissions();
  var apiTests;
  try {
    apiTests = runAllWeek6SelfTests();
  } catch (err) {
    // Spreadsheet tab checks may fail before setup; re-run after setup above.
    apiTests = runAllWeek6SelfTests();
  }

  var summary = {
    setupOk: !!(setup && setup.ok),
    dataTests: dataTests,
    seedInserted: (seed && seed.inserted) || [],
    seedUpdated: (seed && seed.updated) || [],
    seedFailed: (seed && seed.failed) || [],
    apiTests: apiTests,
    acceptingSubmissions: areWeek6SubmissionsOpen_()
  };
  Logger.log(JSON.stringify(summary, null, 2));
  return summary;
}
