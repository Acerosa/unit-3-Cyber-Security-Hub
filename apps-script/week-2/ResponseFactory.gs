/**
 * Consistent JSON responses for the Week 2 API.
 *
 * Never expose stack traces, spreadsheet IDs or internal details to learners.
 */

var ResponseFactory = (function () {
  /**
   * @param {Object} payload
   * @return {GoogleAppsScript.Content.TextOutput}
   */
  function json(payload) {
    return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
      ContentService.MimeType.JSON
    );
  }

  /**
   * @param {Object} data
   * @return {GoogleAppsScript.Content.TextOutput}
   */
  function health(data) {
    return json({
      ok: true,
      service: data.service,
      week: data.week,
      status: data.status,
      acceptingSubmissions: data.acceptingSubmissions === true
    });
  }

  /**
   * @param {Object} submission
   * @return {GoogleAppsScript.Content.TextOutput}
   */
  function recorded(submission) {
    return json({
      ok: true,
      recorded: true,
      duplicate: false,
      message: 'Submission recorded.',
      activityId: submission.activityId,
      score: submission.score,
      total: submission.total
    });
  }

  /**
   * @return {GoogleAppsScript.Content.TextOutput}
   */
  function duplicate() {
    return json({
      ok: true,
      recorded: false,
      duplicate: true,
      message: 'This submission has already been recorded.'
    });
  }

  /**
   * @param {Object[]} errors
   * @param {string=} message
   * @return {GoogleAppsScript.Content.TextOutput}
   */
  function rejected(errors, message) {
    return json({
      ok: false,
      recorded: false,
      duplicate: false,
      message: message || 'Submission not recorded.',
      errors: (errors || []).map(function (item) {
        return {
          code: item.code,
          field: item.field,
          message: item.message
        };
      })
    });
  }

  /**
   * @param {string} message
   * @return {GoogleAppsScript.Content.TextOutput}
   */
  function closed(message) {
    return json({
      ok: false,
      recorded: false,
      duplicate: false,
      message: message || 'Submissions are closed.',
      errors: [
        {
          code: 'SUBMISSIONS_CLOSED',
          field: 'submissions',
          message: message || 'Submissions are closed.'
        }
      ]
    });
  }

  /**
   * @return {GoogleAppsScript.Content.TextOutput}
   */
  function serverError() {
    return json({
      ok: false,
      recorded: false,
      duplicate: false,
      message: 'Submission could not be processed. Please try again or ask your tutor.',
      errors: [
        {
          code: 'SERVER_ERROR',
          field: 'server',
          message: 'An unexpected error occurred.'
        }
      ]
    });
  }

  /**
   * Week 1–compatible Activity API envelope for content and marking routes.
   *
   * @param {Object} payload
   * @return {GoogleAppsScript.Content.TextOutput}
   */
  function apiEnvelope(payload) {
    return json(payload);
  }

  return {
    json: json,
    health: health,
    apiEnvelope: apiEnvelope,
    recorded: recorded,
    duplicate: duplicate,
    rejected: rejected,
    closed: closed,
    serverError: serverError
  };
})();
