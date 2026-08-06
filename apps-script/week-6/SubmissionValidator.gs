/**
 * Validates normalised Week 6 submissions against the activity registry.
 */

var SubmissionValidator = (function () {
  /**
   * @param {Object} submission
   * @return {{valid: boolean, errors: Object[]}}
   */
  function validate(submission) {
    var errors = [];

    if (!submission || typeof submission !== 'object') {
      return {
        valid: false,
        errors: [
          {
            field: 'submission',
            code: 'MISSING_SUBMISSION',
            message: 'Submission data is missing.'
          }
        ]
      };
    }

    if (!submission.learnerName) {
      errors.push({
        field: 'learnerName',
        code: 'LEARNER_NAME_REQUIRED',
        message: 'Learner name is required.'
      });
    }

    // Matches the existing Week 1 / Collector contract: class group is required.
    if (!submission.groupName) {
      errors.push({
        field: 'groupName',
        code: 'GROUP_REQUIRED',
        message: 'Class group is required.'
      });
    }

    if (submission.weekNumber !== CONFIG.weekNumber) {
      errors.push({
        field: 'weekNumber',
        code: 'WEEK_NOT_ACCEPTED',
        message: 'Week number must be 6 for this API.'
      });
    }

    if (submission.sessionNumber !== 1 && submission.sessionNumber !== 2) {
      errors.push({
        field: 'sessionNumber',
        code: 'SESSION_NOT_ACCEPTED',
        message: 'Session number must be 1 or 2.'
      });
    }

    if (!submission.activityId) {
      errors.push({
        field: 'activityId',
        code: 'ACTIVITY_ID_REQUIRED',
        message: 'Activity ID is required.'
      });
    } else {
      var activity = getWeek6Activity_(submission.activityId);
      if (!activity) {
        errors.push({
          field: 'activityId',
          code: 'UNKNOWN_ACTIVITY',
          message: 'Activity ID is not recognised for Week 6.'
        });
      } else {
        if (activity.enabled !== true) {
          errors.push({
            field: 'activityId',
            code: 'ACTIVITY_DISABLED',
            message: 'This activity is not currently accepting submissions.'
          });
        }

        if (submission.activityVersion !== activity.version) {
          errors.push({
            field: 'activityVersion',
            code: 'VERSION_NOT_ACCEPTED',
            message: 'Activity version is not accepted.'
          });
        }

        if (submission.total !== activity.total) {
          errors.push({
            field: 'total',
            code: 'TOTAL_MISMATCH',
            message: 'Submitted total does not match the configured activity.'
          });
        }

        if (submission.sessionNumber === 1 || submission.sessionNumber === 2) {
          if (submission.sessionNumber !== activity.session) {
            errors.push({
              field: 'sessionNumber',
              code: 'SESSION_MISMATCH',
              message: 'Session number does not match the registered activity.'
            });
          }
        }
      }
    }

    if (submission.score === null || submission.score === undefined || typeof submission.score !== 'number' || !isFinite(submission.score)) {
      errors.push({
        field: 'score',
        code: 'SCORE_NOT_NUMERIC',
        message: 'Score must be a number.'
      });
    } else {
      if (!isWholeNumber_(submission.score)) {
        errors.push({
          field: 'score',
          code: 'SCORE_NOT_WHOLE',
          message: 'Score must be a whole number.'
        });
      }
      if (submission.score < 0) {
        errors.push({
          field: 'score',
          code: 'SCORE_NEGATIVE',
          message: 'Score cannot be below zero.'
        });
      }

      var expectedTotal = null;
      var registered = getWeek6Activity_(submission.activityId);
      if (registered) {
        expectedTotal = registered.total;
      } else if (typeof submission.total === 'number') {
        expectedTotal = submission.total;
      }

      if (expectedTotal !== null && submission.score > expectedTotal) {
        errors.push({
          field: 'score',
          code: 'SCORE_ABOVE_TOTAL',
          message: 'Score cannot exceed the expected total.'
        });
      }
    }

    if (submission.total === null || submission.total === undefined || typeof submission.total !== 'number' || !isFinite(submission.total)) {
      // TOTAL_MISMATCH already covers registry mismatch; this covers missing/invalid input.
      if (!hasErrorCode_(errors, 'TOTAL_MISMATCH')) {
        errors.push({
          field: 'total',
          code: 'TOTAL_REQUIRED',
          message: 'Total is required and must be numeric.'
        });
      }
    }

    if (
      submission.attemptNumber === null ||
      submission.attemptNumber === undefined ||
      typeof submission.attemptNumber !== 'number' ||
      !isWholeNumber_(submission.attemptNumber) ||
      submission.attemptNumber < 1
    ) {
      errors.push({
        field: 'attemptNumber',
        code: 'ATTEMPT_INVALID',
        message: 'Attempt number must be a whole number of 1 or greater.'
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  function isWholeNumber_(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }

  function hasErrorCode_(errors, code) {
    for (var i = 0; i < errors.length; i++) {
      if (errors[i].code === code) {
        return true;
      }
    }
    return false;
  }

  return {
    validate: validate
  };
})();
