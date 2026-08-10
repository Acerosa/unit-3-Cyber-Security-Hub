/**
 * Shared Week 3 submission helper.
 * Posts JSON results to the Week 3 Apps Script /exec URL.
 */

(function (global) {
  'use strict';

  var submitting = false;
  var awaitNewAttempt = false;

  function getModules() {
    return {
      course: global.Unit3CourseContext,
      learner: global.Unit3LearnerDetails,
      submissions: global.Unit3Submissions,
      progress: global.Unit3Week3Progress,
      utils: global.Unit3ActivityUtils,
      config: global.Unit3ActivityEngineConfig,
      backendMode: global.Unit3BackendMode,
      adapter: global.Unit3SupabaseAdapter,
      runner: global.Unit3SupabaseSubmitRunner
    };
  }

  function isSupabaseMode() {
    var modules = getModules();
    return Boolean(
      modules.backendMode &&
        typeof modules.backendMode.isSupabase === 'function' &&
        modules.backendMode.isSupabase()
    );
  }

  function submitResultViaSupabase(options) {
    var modules = getModules();
    if (!modules.runner || typeof modules.runner.submit !== 'function') {
      setMessage(
        'w3-submit-status',
        'The learner service is not available on this device. Contact your tutor.',
        'error'
      );
      return;
    }
    submitting = true;
    modules.runner
      .submit({
        activityId: options.activityId,
        getResponses: options.getResponses,
        getStartedAt: options.startedAt
          ? function () { return options.startedAt; }
          : null,
        getCompletedAt: options.completedAt
          ? function () { return options.completedAt; }
          : null,
        progress: modules.progress,
        statusHostId: 'w3-submit-status',
        summaryHostId: 'w3-submission-summary',
        buttonId: 'w3-btn-submit',
        submitLabel: 'Submit formative result',
        onSubmitted: function (info) {
          awaitNewAttempt = true;
          if (typeof options.onSubmitted === 'function') {
            options.onSubmitted(info);
          }
        },
        onError: options.onError
      })
      .catch(function () { /* runner already surfaced the message */ })
      .then(function () {
        submitting = false;
      });
  }

  function resolveActivity(activityId) {
    var modules = getModules();
    if (!modules.course || !modules.course.getActivity) {
      return null;
    }
    return modules.course.getActivity(activityId);
  }

  function getWeek3ApiUrl() {
    var modules = getModules();
    if (modules.config && typeof modules.config.getWeek3ApiBaseUrl === 'function') {
      return modules.config.getWeek3ApiBaseUrl();
    }
    var cfg = modules.config && modules.config.ACTIVITY_ENGINE_CONFIG;
    return (cfg && cfg.week3ApiBaseUrl) || '';
  }

  function attemptNumberKey(storageKey) {
    return storageKey + '-attempt-number';
  }

  function getAttemptNumber(storageKey) {
    try {
      var raw = sessionStorage.getItem(attemptNumberKey(storageKey));
      var parsed = parseInt(raw, 10);
      return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
    } catch (err) {
      return 1;
    }
  }

  function setAttemptNumber(storageKey, value) {
    try {
      sessionStorage.setItem(attemptNumberKey(storageKey), String(value));
    } catch (err) {
      /* sessionStorage may be unavailable */
    }
  }

  function beginNextAttemptNumber(storageKey) {
    var next = getAttemptNumber(storageKey) + 1;
    setAttemptNumber(storageKey, next);
    return next;
  }

  function sessionNumberFromActivity(activity) {
    if (!activity) return null;
    if (activity.sessionNumber === 1 || activity.sessionNumber === 2) {
      return activity.sessionNumber;
    }
    var match = String(activity.sessionName || '').match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  function renderSubmitPanel(options) {
    var modules = getModules();
    var hostId = options.hostId || 'w3-submit-host';
    var host = document.getElementById(hostId);
    if (!host || !modules.learner) return;

    awaitNewAttempt = false;
    host.hidden = false;
    host.textContent = '';

    var courseHost = document.createElement('div');
    courseHost.id = 'w3-course-details';
    host.appendChild(courseHost);

    var formHost = document.createElement('div');
    formHost.id = 'w3-learner-form';
    if (isSupabaseMode()) {
      formHost.hidden = true;
    }
    host.appendChild(formHost);

    var errors = document.createElement('div');
    errors.id = 'w3-submit-errors';
    errors.className = 'status-messages';
    errors.setAttribute('aria-live', 'assertive');
    errors.setAttribute('aria-atomic', 'true');
    host.appendChild(errors);

    var status = document.createElement('div');
    status.id = 'w3-submit-status';
    status.className = 'status-messages';
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    host.appendChild(status);

    var actions = document.createElement('div');
    actions.className = 'ae-submit-actions';
    var submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.id = 'w3-btn-submit';
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Submit formative result';
    actions.appendChild(submitBtn);
    host.appendChild(actions);

    var summary = document.createElement('div');
    summary.id = 'w3-submission-summary';
    host.appendChild(summary);

    var activity = resolveActivity(options.activityId);
    modules.learner.renderCourseDetails('w3-course-details', activity);
    if (!isSupabaseMode()) {
      modules.learner.renderLearnerForm('w3-learner-form', {
        showPartner: Boolean(activity && activity.allowsPartner)
      });
    }

    if (activity && activity.attemptStorageKey) {
      setAttemptNumber(
        activity.attemptStorageKey,
        getAttemptNumber(activity.attemptStorageKey)
      );
    }

    submitBtn.addEventListener('click', function () {
      if (awaitNewAttempt) {
        var current = resolveActivity(options.activityId);
        if (current && modules.submissions) {
          modules.submissions.startNewAttempt(current.attemptStorageKey);
          beginNextAttemptNumber(current.attemptStorageKey);
        }
        if (current && modules.adapter && modules.adapter.beginNewClientAttempt) {
          modules.adapter.beginNewClientAttempt(current.activityId);
        }
        awaitNewAttempt = false;
        submitBtn.textContent = 'Submit formative result';
        setMessage(
          'w3-submit-status',
          'New attempt ready. Submit again when you are ready.',
          'info'
        );
        return;
      }
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
        getResponses: options.getResponses,
        startedAt: options.getStartedAt ? options.getStartedAt() : null,
        completedAt: options.getCompletedAt ? options.getCompletedAt() : null,
        onSubmitted: options.onSubmitted,
        onError: options.onError,
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

  function buildWeek3Payload(activity, learner, options, attemptId, attemptNumber) {
    return {
      learnerName: [learner.firstName, learner.surname].filter(Boolean).join(' '),
      learnerId: learner.studentId || '',
      groupName: learner.classGroup || '',
      classGroup: learner.classGroup || '',
      firstName: learner.firstName || '',
      surname: learner.surname || '',
      studentId: learner.studentId || '',
      weekNumber: activity.weekNumber || 3,
      sessionNumber: sessionNumberFromActivity(activity),
      sessionName: activity.sessionName || '',
      activityId: activity.activityId,
      activityVersion: activity.activityVersion || '1.0',
      score: options.score,
      total: options.total,
      maximumScore: options.total,
      attemptNumber: attemptNumber,
      attemptId: attemptId,
      completedAt: new Date().toISOString(),
      recordType: 'LIVE',
      questionsForReview: options.questionsForReview || '',
      mostDifficultItem: options.mostDifficultItem || '',
      reflection: options.reflection || '',
      completionTimeSeconds: options.completionTimeSeconds || 60,
      sourcePage: global.location ? global.location.href : ''
    };
  }

  function postWeek3Submission(payload) {
    var url = getWeek3ApiUrl();
    if (!url || !/\/exec\/?$/.test(url)) {
      return Promise.reject(new Error('Week 3 API URL is not configured.'));
    }

    return fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.text().then(function (text) {
        var envelope;
        try {
          envelope = JSON.parse(text);
        } catch (err) {
          throw new Error('The Week 3 API returned an unexpected response.');
        }
        return { response: response, envelope: envelope };
      });
    });
  }

  function submitResult(options) {
    var modules = getModules();
    if (submitting) {
      setMessage('w3-submit-status', 'Submission already in progress. Please wait.', 'warning');
      return;
    }

    if (options.canSubmit && !options.canSubmit()) {
      setMessage(
        'w3-submit-status',
        'Complete the activity before submitting your result.',
        'warning'
      );
      return;
    }

    if (isSupabaseMode()) {
      submitResultViaSupabase(options);
      return;
    }

    if (!modules.learner || !modules.submissions || !modules.course) {
      setMessage(
        'w3-submit-status',
        'Submission tools could not load. Refresh the page and try again.',
        'error'
      );
      return;
    }

    var activity = resolveActivity(options.activityId);
    if (!activity) {
      setMessage(
        'w3-submit-status',
        'This activity is not registered. Contact your tutor.',
        'error'
      );
      console.error('[Week3Submit] Missing registry entry for', options.activityId);
      return;
    }

    var validation = modules.learner.validateLearnerDetails({
      showPartner: Boolean(activity.allowsPartner)
    });
    modules.learner.showValidationSummary('w3-submit-errors', validation);
    if (!validation.valid) {
      setMessage('w3-submit-status', 'Check your details and try again.', 'warning');
      return;
    }

    if (modules.submissions.isAttemptCompleted(activity.attemptStorageKey)) {
      setMessage(
        'w3-submit-status',
        'This attempt has already been submitted. Start another attempt if your tutor asks you to retry.',
        'warning'
      );
      return;
    }

    var attemptId = modules.submissions.getOrCreateAttemptId(activity.attemptStorageKey);
    var attemptNumber = getAttemptNumber(activity.attemptStorageKey);
    var score = Number(options.score);
    var total = Number(options.total != null ? options.total : activity.maximumScore);

    if (!Number.isInteger(score) || score < 0 || score > total) {
      setMessage(
        'w3-submit-status',
        'The score could not be submitted because it is outside the allowed range.',
        'error'
      );
      console.error('[Week3Submit] Invalid score', score, total);
      return;
    }

    if (total !== activity.maximumScore) {
      setMessage(
        'w3-submit-status',
        'The activity total does not match the registered maximum. Contact your tutor.',
        'error'
      );
      console.error('[Week3Submit] Total mismatch', total, activity.maximumScore);
      return;
    }

    submitting = true;
    var btn = document.getElementById('w3-btn-submit');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Submitting…';
    }
    setMessage('w3-submit-status', 'Submitting your formative result…', 'info');

    var payload = buildWeek3Payload(
      activity,
      validation.learner,
      {
        score: score,
        total: total,
        questionsForReview: options.questionsForReview || '',
        mostDifficultItem: options.mostDifficultItem || '',
        reflection: options.reflection || '',
        completionTimeSeconds: options.completionTimeSeconds || 60
      },
      attemptId,
      attemptNumber
    );

    postWeek3Submission(payload)
      .then(function (result) {
        var envelope = result.envelope || {};
        if (envelope.ok === true && (envelope.recorded === true || envelope.duplicate === true)) {
          modules.submissions.markAttemptCompleted(activity.attemptStorageKey);
          if (modules.progress && modules.progress.markSubmitted) {
            modules.progress.markSubmitted(options.activityId);
          }
          if (modules.learner.renderSubmissionSummary) {
            modules.learner.renderSubmissionSummary('w3-submission-summary', {
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
          awaitNewAttempt = true;
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Start another attempt';
          }
          setMessage(
            'w3-submit-status',
            envelope.duplicate
              ? 'This submission was already recorded.'
              : envelope.message || 'Submission recorded.',
            'success'
          );
          if (typeof options.onSubmitted === 'function') {
            try {
              options.onSubmitted({
                recorded: envelope.recorded === true,
                duplicate: envelope.duplicate === true,
                envelope: envelope
              });
            } catch (callbackErr) {
              console.error('[Week3Submit] onSubmitted callback failed', callbackErr);
            }
          }
          return;
        }

        var detail = envelope.message || 'Submission not recorded.';
        if (envelope.errors && envelope.errors.length) {
          detail =
            envelope.errors
              .map(function (item) {
                return item.message || item.code;
              })
              .filter(Boolean)
              .join(' ') || detail;
        }
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Submit formative result';
        }
        setMessage('w3-submit-status', 'Your result was not saved. ' + detail, 'error');
      })
      .catch(function (err) {
        console.error('[Week3Submit] Submission failed', err);
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Submit formative result';
        }
        setMessage(
          'w3-submit-status',
          'Your result was not saved. ' +
            ((err && err.message) || 'Check your connection and try again.'),
          'error'
        );
      })
      .then(function () {
        submitting = false;
      });
  }

  global.Unit3Week3Submit = {
    renderSubmitPanel: renderSubmitPanel,
    submitResult: submitResult
  };
})(window);
