/**
 * Orchestrates Week 6 submission handling.
 */

var SubmissionService = (function () {
  var LOCK_WAIT_MS = 30000;

  /**
   * @param {Object} e
   * @return {GoogleAppsScript.Content.TextOutput}
   */
  function handle(e) {
    var lock = LockService.getScriptLock();
    var lockAcquired = false;

    try {
      if (!areWeek6SubmissionsOpen_()) {
        return ResponseFactory.closed('Week 6 submissions are currently closed.');
      }

      var parsed = RequestParser.parse(e);
      if (!parsed.ok) {
        try {
          appendRejectedSubmission_({}, parsed.errors, parsed.rawPayload || '');
        } catch (logErr) {
          Logger.log('Unable to record parse rejection: ' + logErr);
        }
        return ResponseFactory.rejected(parsed.errors);
      }

      var submission = parsed.submission;
      var validation = SubmissionValidator.validate(submission);
      if (!validation.valid) {
        try {
          appendRejectedSubmission_(submission, validation.errors, parsed.rawPayload || '');
        } catch (logErr) {
          Logger.log('Unable to record validation rejection: ' + logErr);
        }
        return ResponseFactory.rejected(validation.errors);
      }

      lockAcquired = lock.tryLock(LOCK_WAIT_MS);
      if (!lockAcquired) {
        Logger.log('SubmissionService could not acquire script lock.');
        return ResponseFactory.serverError();
      }

      var duplicate = DuplicateChecker.check(submission);
      submission.submissionKey = duplicate.submissionKey;

      if (duplicate.isDuplicate) {
        return ResponseFactory.duplicate();
      }

      submission.serverTimestamp = new Date();
      submission.status = 'RECORDED';

      appendSubmission_(submission);
      appendWeek6Result_(submission);

      return ResponseFactory.recorded(submission);
    } catch (err) {
      Logger.log('SubmissionService error: ' + err);
      try {
        appendRejectedSubmission_(
          {},
          [
            {
              field: 'server',
              code: 'SERVER_ERROR',
              message: 'An unexpected error occurred.'
            }
          ],
          ''
        );
      } catch (logErr) {
        Logger.log('Unable to record server rejection: ' + logErr);
      }
      return ResponseFactory.serverError();
    } finally {
      if (lockAcquired) {
        lock.releaseLock();
      }
    }
  }

  return {
    handle: handle
  };
})();
