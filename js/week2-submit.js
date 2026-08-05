/**
 * Shared Week 2 Collector v3 submission helper.
 * Reuses Unit3LearnerDetails and Unit3Submissions; does not duplicate API clients.
 */

(function (global) {
  'use strict';

  var submitting = false;

  function getModules() {
    return {
      course: global.Unit3CourseContext,
      learner: global.Unit3LearnerDetails,
      submissions: global.Unit3Submissions,
      progress: global.Unit3Week2Progress,
      utils: global.Unit3ActivityUtils
    };
  }

  function resolveActivity(activityId) {
    var modules = getModules();
    if (!modules.course || !modules.course.getActivity) {
      return null;
    }
    return modules.course.getActivity(activityId);
  }

  function renderSubmitPanel(options) {
    var modules = getModules();
    var hostId = options.hostId || 'w2-submit-host';
    var host = document.getElementById(hostId);
    if (!host || !modules.learner) return;

    host.hidden = false;
    host.textContent = '';

    var courseHost = document.createElement('div');
    courseHost.id = 'w2-course-details';
    host.appendChild(courseHost);

    var formHost = document.createElement('div');
    formHost.id = 'w2-learner-form';
    host.appendChild(formHost);

    var errors = document.createElement('div');
    errors.id = 'w2-submit-errors';
    errors.className = 'status-messages';
    errors.setAttribute('aria-live', 'assertive');
    errors.setAttribute('aria-atomic', 'true');
    host.appendChild(errors);

    var status = document.createElement('div');
    status.id = 'w2-submit-status';
    status.className = 'status-messages';
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    host.appendChild(status);

    var actions = document.createElement('div');
    actions.className = 'ae-submit-actions';
    var submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.id = 'w2-btn-submit';
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Submit formative result';
    actions.appendChild(submitBtn);
    host.appendChild(actions);

    var summary = document.createElement('div');
    summary.id = 'w2-submission-summary';
    host.appendChild(summary);

    var activity = resolveActivity(options.activityId);
    modules.learner.renderCourseDetails('w2-course-details', activity);
    modules.learner.renderLearnerForm('w2-learner-form', {
      showPartner: Boolean(activity && activity.allowsPartner)
    });

    submitBtn.addEventListener('click', function () {
      submitResult({
        activityId: options.activityId,
        score: options.getScore(),
        total: options.getTotal(),
        questionsForReview: options.getQuestionsForReview
          ? options.getQuestionsForReview()
          : '',
        mostDifficultItem: options.getMostDifficultItem
          ? options.getMostDifficultItem()
          : '',
        reflection: options.getReflection ? options.getReflection() : '',
        completionTimeSeconds: options.getCompletionTimeSeconds
          ? options.getCompletionTimeSeconds()
          : 60,
        canSubmit: options.canSubmit
      });
    });
  }

  function setMessage(containerId, message, type) {
    var modules = getModules();
    if (modules.utils && modules.utils.setStatusMessage) {
      modules.utils.setStatusMessage(containerId, message, type);
      return;
    }
    var host = document.getElementById(containerId);
    if (!host) return;
    host.textContent = '';
    if (!message) return;
    var p = document.createElement('p');
    p.className = 'message message-' + (type || 'info');
    p.textContent = message;
    host.appendChild(p);
  }

  function submitResult(options) {
    var modules = getModules();
    if (submitting) {
      setMessage('w2-submit-status', 'Submission already in progress. Please wait.', 'warning');
      return;
    }

    if (options.canSubmit && !options.canSubmit()) {
      setMessage(
        'w2-submit-status',
        'Complete the activity before submitting your result.',
        'warning'
      );
      return;
    }

    if (!modules.learner || !modules.submissions || !modules.course) {
      setMessage(
        'w2-submit-status',
        'Submission tools could not load. Refresh the page and try again.',
        'error'
      );
      return;
    }

    var activity = resolveActivity(options.activityId);
    if (!activity) {
      setMessage(
        'w2-submit-status',
        'This activity is not registered. Contact your tutor.',
        'error'
      );
      console.error('[Week2Submit] Missing registry entry for', options.activityId);
      return;
    }

    var validation = modules.learner.validateLearnerDetails({
      showPartner: Boolean(activity.allowsPartner)
    });
    modules.learner.showValidationSummary('w2-submit-errors', validation);
    if (!validation.valid) {
      setMessage('w2-submit-status', 'Check your details and try again.', 'warning');
      return;
    }

    if (modules.submissions.isAttemptCompleted(activity.attemptStorageKey)) {
      setMessage(
        'w2-submit-status',
        'This attempt has already been submitted. Start another attempt if your tutor asks you to retry.',
        'warning'
      );
      return;
    }

    var attemptId = modules.submissions.getOrCreateAttemptId(activity.attemptStorageKey);
    var score = Number(options.score);
    var total = Number(options.total != null ? options.total : activity.maximumScore);

    if (!Number.isInteger(score) || score < 0 || score > total) {
      setMessage(
        'w2-submit-status',
        'The score could not be submitted because it is outside the allowed range.',
        'error'
      );
      console.error('[Week2Submit] Invalid score', score, total);
      return;
    }

    if (total !== activity.maximumScore) {
      setMessage(
        'w2-submit-status',
        'The activity total does not match the registered maximum. Contact your tutor.',
        'error'
      );
      console.error('[Week2Submit] Total mismatch', total, activity.maximumScore);
      return;
    }

    submitting = true;
    var btn = document.getElementById('w2-btn-submit');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Submitting…';
    }
    setMessage('w2-submit-status', 'Submitting your formative result…', 'info');

    var result = modules.submissions.submitSchema3({
      courseContext: modules.course.COURSE_CONTEXT,
      activity: activity,
      learner: validation.learner,
      attemptId: attemptId,
      recordType: 'LIVE',
      score: score,
      maximumScore: total,
      questionsForReview: options.questionsForReview || '',
      mostDifficultItem: options.mostDifficultItem || '',
      reflection: options.reflection || '',
      completionTimeSeconds: options.completionTimeSeconds || 60,
      sourcePage: global.location ? global.location.href : ''
    });

    if (!result.started) {
      submitting = false;
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Submit formative result';
      }
      var detail =
        result.errors && result.errors.length
          ? result.errors.join(' ')
          : 'The submission could not be started.';
      console.error('[Week2Submit] Submission failed to start', result.errors);
      setMessage(
        'w2-submit-status',
        'Your result was not saved. ' + detail + ' You can try again.',
        'error'
      );
      return;
    }

    modules.submissions.markAttemptCompleted(activity.attemptStorageKey);
    if (modules.progress && modules.progress.markSubmitted) {
      modules.progress.markSubmitted(options.activityId);
    }
    if (modules.learner.renderSubmissionSummary) {
      modules.learner.renderSubmissionSummary('w2-submission-summary', {
        firstName: validation.learner.firstName,
        surname: validation.learner.surname,
        studentId: validation.learner.studentId,
        classGroup: validation.learner.classGroup,
        activityName: activity.activityName,
        score: score,
        maximumScore: total,
        partnerStudentId: validation.learner.partnerStudentId,
        partnerFirstName: validation.learner.partnerFirstName,
        partnerSurname: validation.learner.partnerSurname
      });
    }

    submitting = false;
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Submit again (new attempt)';
      btn.addEventListener(
        'click',
        function onNew() {
          modules.submissions.startNewAttempt(activity.attemptStorageKey);
          btn.textContent = 'Submit formative result';
          btn.removeEventListener('click', onNew);
        },
        { once: true }
      );
    }
    setMessage(
      'w2-submit-status',
      'A results confirmation page should open in a new tab. Check that page to confirm your result was received.',
      'success'
    );
  }

  global.Unit3Week2Submit = {
    renderSubmitPanel: renderSubmitPanel,
    submitResult: submitResult
  };
})(window);
