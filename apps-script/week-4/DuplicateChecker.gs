/**
 * Deterministic duplicate-submission protection for Week 4.
 */

var DuplicateChecker = (function () {
  /**
   * Builds a stable key for learner + group + activity + version + attempt.
   *
   * @param {Object} submission
   * @return {string}
   */
  function buildSubmissionKey(submission) {
    var learnerPart = normaliseKeyPart_(
      submission.learnerId ? submission.learnerId : submission.learnerName
    );
    var groupPart = normaliseKeyPart_(submission.groupName);
    var activityPart = normaliseKeyPart_(submission.activityId);
    var versionPart = normaliseKeyPart_(submission.activityVersion);
    var attemptPart = String(
      submission.attemptNumber === null || submission.attemptNumber === undefined
        ? 1
        : submission.attemptNumber
    );

    return [learnerPart, groupPart, activityPart, versionPart, attemptPart].join('|');
  }

  /**
   * @param {Object} submission
   * @return {{isDuplicate: boolean, existingRow: number|null, submissionKey: string}}
   */
  function check(submission) {
    var submissionKey = buildSubmissionKey(submission);
    var existingRow = findSubmissionByKey_(submissionKey);
    return {
      isDuplicate: existingRow !== null,
      existingRow: existingRow,
      submissionKey: submissionKey
    };
  }

  function normaliseKeyPart_(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  return {
    buildSubmissionKey: buildSubmissionKey,
    check: check
  };
})();
