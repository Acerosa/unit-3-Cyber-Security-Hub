/**
 * Generic Activity API engine controller.
 * Pilot: U3-W01-COMMAND-WORDS via Activity API only (never Collector v3).
 */

(function () {
  'use strict';

  var configModule = window.Unit3ActivityEngineConfig || {};
  var api = window.Unit3ActivityApi || {};
  var stateApi = window.Unit3ActivityState || {};
  var renderer = window.Unit3ActivityRenderer || {};
  var learnerDetails = window.Unit3LearnerDetails || {};
  var utils = window.Unit3ActivityUtils || {};
  var setStatusMessage = utils.setStatusMessage;

  var FALLBACK_ACTIVITY_ID = 'U3-W01-COMMAND-WORDS';
  var activityData = null;
  var state = null;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function ensureStatusHelper() {
    if (!setStatusMessage) {
      setStatusMessage = function (id, message, type) {
        var host = document.getElementById(id);
        if (!host) return;
        host.textContent = '';
        if (!message) return;
        var p = document.createElement('p');
        p.className = 'message message-' + (type || 'info');
        p.textContent = message;
        host.appendChild(p);
      };
    }
  }

  function resolveActivityId() {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = (params.get('activityId') || '').trim();
    if (fromQuery) return fromQuery;
    var fromBody = document.body.getAttribute('data-activity-id');
    return (fromBody || FALLBACK_ACTIVITY_ID).trim();
  }

  function showPanel(id, visible) {
    var node = document.getElementById(id);
    if (node) node.hidden = !visible;
  }

  function assessmentSections() {
    if (!activityData || !activityData.sections) return [];
    return renderer.sortByDisplayOrder(activityData.sections).filter(function (section) {
      return section.sectionType === 'assessment';
    });
  }

  function completedAssessmentCount() {
    return assessmentSections().filter(function (section) {
      return state.markedSections && state.markedSections[section.sectionId];
    }).length;
  }

  function allAssessmentsMarked() {
    var sections = assessmentSections();
    return (
      sections.length > 0 &&
      sections.every(function (section) {
        return state.markedSections && state.markedSections[section.sectionId];
      })
    );
  }

  function firstUnfinishedAssessmentId() {
    var sections = assessmentSections();
    for (var i = 0; i < sections.length; i += 1) {
      if (!state.markedSections[sections[i].sectionId]) {
        return sections[i].sectionId;
      }
    }
    return sections.length ? sections[0].sectionId : null;
  }

  function validateActivityPayload(data) {
    if (!data || !data.activity || !data.sections || !data.sections.length) {
      throw new Error('The activity response was incomplete.');
    }
    var activity = data.activity;
    if (!activity.activityId || !activity.activityName || !activity.activityVersion) {
      throw new Error('The activity metadata was incomplete.');
    }
    return data;
  }

  function sectionById(sectionId) {
    var sections = activityData.sections || [];
    for (var i = 0; i < sections.length; i += 1) {
      if (sections[i].sectionId === sectionId) return sections[i];
    }
    return null;
  }

  function questionById(questionId) {
    var sections = (activityData && activityData.sections) || [];
    for (var i = 0; i < sections.length; i += 1) {
      var questions = sections[i].questions || [];
      for (var j = 0; j < questions.length; j += 1) {
        if (questions[j].questionId === questionId) return questions[j];
      }
    }
    return null;
  }

  function normalisedText(value) {
    return String(value == null ? '' : value)
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s+/g, ' ');
  }

  function isTextResponseType(questionType) {
    return (
      questionType === 'short-response' || questionType === 'extended-response'
    );
  }

  function isMissingResponse(question, value) {
    if (question.required === false) return false;
    if (question.questionType === 'classification') {
      if (!value || typeof value !== 'object') return true;
      var evidence = normalisedText(value.evidence);
      var minChars =
        question.minimumCharacters != null ? Number(question.minimumCharacters) : 1;
      return (
        !value.incidentType ||
        !value.ciaAim ||
        evidence.length < minChars
      );
    }
    if (isTextResponseType(question.questionType)) {
      var text = normalisedText(value);
      var minLen =
        question.minimumCharacters != null ? Number(question.minimumCharacters) : 1;
      return text.length < minLen;
    }
    return value === undefined || value === null || value === '';
  }

  function isOverMaxResponse(question, value) {
    if (!question || !isTextResponseType(question.questionType)) return false;
    if (question.maximumCharacters == null) return false;
    return normalisedText(value).length > Number(question.maximumCharacters);
  }

  function normalizeResponseValue(question, value) {
    if (question && question.questionType === 'classification') {
      return {
        incidentType: String((value && value.incidentType) || ''),
        ciaAim: String((value && value.ciaAim) || ''),
        evidence: normalisedText(value && value.evidence)
      };
    }
    if (question && isTextResponseType(question.questionType)) {
      return normalisedText(value);
    }
    return value == null ? '' : String(value);
  }

  function collectSectionResponses(section) {
    var responses = [];
    var missing = [];
    var tooLong = [];
    (section.questions || []).forEach(function (question) {
      var value = state.responses[question.questionId];
      if (isMissingResponse(question, value)) {
        missing.push(question.questionId);
      } else if (isOverMaxResponse(question, value)) {
        tooLong.push(question.questionId);
      } else if (value !== undefined && value !== null && value !== '') {
        responses.push({
          questionId: question.questionId,
          value: normalizeResponseValue(question, value)
        });
      }
    });
    return { responses: responses, missing: missing, tooLong: tooLong };
  }

  function collectAllResponses() {
    var responses = [];
    Object.keys(state.responses || {}).forEach(function (questionId) {
      var question = questionById(questionId);
      var value = state.responses[questionId];
      if (!question || isMissingResponse(question, value)) return;
      if (value === undefined || value === null || value === '') return;
      responses.push({
        questionId: questionId,
        value: normalizeResponseValue(question, value)
      });
    });
    return responses;
  }

  function updateProgress() {
    renderer.renderProgress(
      document.getElementById('ae-progress'),
      completedAssessmentCount(),
      assessmentSections().length
    );
  }

  function updateFinalFormVisibility() {
    var readyForSubmit = allAssessmentsMarked();
    showPanel('ae-final-panel', readyForSubmit);
    if (readyForSubmit && learnerDetails.renderLearnerForm) {
      learnerDetails.renderLearnerForm('ae-learner-host', {
        showPartner: Boolean(activityData.activity.allowsPartner)
      });
      populateMostDifficult();
    }
  }

  function populateMostDifficult() {
    var select = document.getElementById('ae-most-difficult');
    if (!select) return;
    var previous = select.value;
    select.textContent = '';
    var none = document.createElement('option');
    none.value = '';
    none.textContent = 'None';
    select.appendChild(none);
    (activityData.sections || []).forEach(function (section) {
      (section.questions || []).forEach(function (question) {
        var opt = document.createElement('option');
        opt.value = question.questionId;
        opt.textContent = question.questionId;
        select.appendChild(opt);
      });
    });
    if (previous) select.value = previous;
  }

  function renderActivity() {
    var activity = activityData.activity;
    document.title = activity.activityName + ' | Unit 3 Cyber Security Hub';
    var heading = document.getElementById('ae-activity-heading');
    if (heading) heading.textContent = activity.activityName;
    var crumb = document.getElementById('ae-breadcrumb-current');
    if (crumb) crumb.textContent = activity.activityName;
    var intro = document.getElementById('ae-introduction');
    if (intro) {
      intro.textContent = activity.introduction || '';
      intro.hidden = !activity.introduction;
    }

    renderer.renderMetadata(
      document.getElementById('ae-metadata'),
      activity,
      configModule.resolveRecordType()
    );

    var host = document.getElementById('ae-sections');
    host.textContent = '';
    var openId = firstUnfinishedAssessmentId();
    renderer.sortByDisplayOrder(activityData.sections).forEach(function (section) {
      var shouldOpen =
        section.sectionType === 'assessment'
          ? section.sectionId === openId
          : section.displayOrder === 1;
      host.appendChild(
        renderer.renderSection(
          section,
          state,
          {
            onAnswer: handleAnswer,
            onMarkSection: handleMarkSection
          },
          { open: shouldOpen }
        )
      );
    });

    updateProgress();
    updateFinalFormVisibility();

    if (state.finalSubmission) {
      showSubmissionResult(state.finalSubmission, false);
    }
  }

  function handleAnswer(questionId, value, opts) {
    opts = opts || {};
    var question = questionById(questionId);
    stateApi.setResponse(
      state,
      questionId,
      normalizeResponseValue(question, value)
    );
    Object.keys(state.markedSections || {}).forEach(function (sectionId) {
      var section = sectionById(sectionId);
      if (!section) return;
      var ownsQuestion = (section.questions || []).some(function (q) {
        return q.questionId === questionId;
      });
      if (ownsQuestion) {
        stateApi.invalidateSection(state, sectionId);
      }
    });
    if (opts.deferRender) {
      updateProgress();
      updateFinalFormVisibility();
      return;
    }
    renderActivity();
  }

  function handleMarkSection(sectionId) {
    var section = sectionById(sectionId);
    if (!section) return;
    var collected = collectSectionResponses(section);
    if (collected.missing.length) {
      setStatusMessage(
        'section-status-' + sectionId,
        'Complete every required response before checking. Incomplete: ' +
          collected.missing.join(', ') +
          '.',
        'error'
      );
      var firstMissing = document.getElementById(
        'question-' + collected.missing[0]
      );
      if (firstMissing) {
        var missingControl = firstMissing.querySelector('input, textarea, select');
        if (missingControl) missingControl.focus();
      }
      return;
    }
    if (collected.tooLong && collected.tooLong.length) {
      setStatusMessage(
        'section-status-' + sectionId,
        'Shorten the responses that exceed the maximum length: ' +
          collected.tooLong.join(', ') +
          '.',
        'error'
      );
      var firstLong = document.getElementById('question-' + collected.tooLong[0]);
      if (firstLong) {
        var longControl = firstLong.querySelector('input, textarea, select');
        if (longControl) longControl.focus();
      }
      return;
    }

    setStatusMessage(
      'section-status-' + sectionId,
      'Checking this section…',
      'info'
    );

    api
      .markSection({
        requestId: api.createRequestId(),
        attemptId: state.attemptId,
        activityId: activityData.activity.activityId,
        activityVersion: activityData.activity.activityVersion,
        sectionId: sectionId,
        responses: collected.responses
      })
      .then(function (data) {
        stateApi.setMarkedSection(state, sectionId, data);
        setStatusMessage(
          'section-status-' + sectionId,
          'Section checked. Review the feedback below.',
          'success'
        );
        renderActivity();
        var panel = document.getElementById('section-' + sectionId);
        if (panel) panel.open = true;
      })
      .catch(function (err) {
        setStatusMessage(
          'section-status-' + sectionId,
          (err && err.learnerMessage) || (err && err.message) || 'Section check failed.',
          'error'
        );
      });
  }

  function showSubmissionResult(data, justSubmitted) {
    showPanel('ae-result-panel', true);
    var host = document.getElementById('ae-result-summary');
    host.textContent = '';
    function line(text) {
      var p = document.createElement('p');
      p.textContent = text;
      host.appendChild(p);
    }
    line(data.recorded ? 'Result recorded.' : 'Result was not recorded.');
    if (data.duplicate) line('This was recognised as a duplicate retry of the same attempt.');
    line('Record type: ' + (data.recordType || configModule.resolveRecordType()));
    line(
      'Score: ' +
        (data.score != null ? data.score : '-') +
        ' / ' +
        (data.maximumScore != null ? data.maximumScore : '-')
    );
    if (data.percentage != null) line('Percentage: ' + data.percentage + '%');
    if (data.attemptNumber != null) {
      line('Attempt number: ' + data.attemptNumber);
    } else if ((data.recordType || '') === 'TEST') {
      line('Attempt number: not assigned for TEST records.');
    }
    if ((data.recordType || configModule.resolveRecordType()) === 'TEST') {
      line('TEST mode: this submission does not count as a learner attempt.');
    }
    if (justSubmitted) {
      setStatusMessage(
        'ae-submit-status',
        'Submission complete. Check the summary below.',
        'success'
      );
    }
  }

  function handleSubmit() {
    if (!allAssessmentsMarked()) {
      setStatusMessage(
        'ae-submit-status',
        'Check every assessment section before submitting.',
        'error'
      );
      return;
    }

    var validation = learnerDetails.validateLearnerDetails
      ? learnerDetails.validateLearnerDetails({
          showPartner: Boolean(activityData.activity.allowsPartner)
        })
      : { valid: false, errors: ['Learner form unavailable.'] };

    if (!validation.valid) {
      learnerDetails.showValidationSummary('learner-details-errors', validation);
      setStatusMessage('ae-submit-status', 'Complete your details before submitting.', 'error');
      return;
    }

    var reflection = String(
      (document.getElementById('ae-reflection') || {}).value || ''
    )
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s+/g, ' ');
    var mostDifficult = String(
      (document.getElementById('ae-most-difficult') || {}).value || ''
    );

    var learner = validation.learner;
    var partner = null;
    if (learner.isPaired) {
      partner = {
        studentId: learner.partnerStudentId,
        firstName: learner.partnerFirstName,
        surname: learner.partnerSurname
      };
    }
    var payload = {
      requestId: api.createRequestId(),
      recordType: configModule.resolveRecordType(),
      attemptId: state.attemptId,
      activityId: activityData.activity.activityId,
      activityVersion: activityData.activity.activityVersion,
      learner: {
        studentId: learner.studentId,
        firstName: learner.firstName,
        surname: learner.surname,
        classGroup: learner.classGroup
      },
      partner: partner,
      responses: collectAllResponses(),
      reflection: reflection,
      mostDifficultItem: mostDifficult,
      completionTimeSeconds: stateApi.completionTimeSeconds(state),
      sourcePage: window.location.href
    };

    if (
      payload.recordType === 'LIVE' &&
      !configModule.isLiveSubmissionEnabled()
    ) {
      setStatusMessage(
        'ae-submit-status',
        'LIVE submissions are disabled for this pilot.',
        'error'
      );
      return;
    }

    document.getElementById('ae-btn-submit').disabled = true;
    setStatusMessage('ae-submit-status', 'Submitting your TEST result…', 'info');

    api
      .submitAttempt(payload)
      .then(function (data) {
        stateApi.setFinalSubmission(state, data);
        showSubmissionResult(data, true);
        document.getElementById('ae-btn-start-another').hidden = false;
      })
      .catch(function (err) {
        document.getElementById('ae-btn-submit').disabled = false;
        setStatusMessage(
          'ae-submit-status',
          (err && err.learnerMessage) || (err && err.message) || 'Submission failed.',
          'error'
        );
      });
  }

  function handleStartAnother() {
    if (
      !window.confirm(
        'Start another attempt? Your previous TEST submission remains in the results workbook if it was recorded.'
      )
    ) {
      return;
    }
    state = stateApi.beginNewAttempt(activityData.activity.activityId);
    document.getElementById('ae-btn-submit').disabled = false;
    document.getElementById('ae-btn-start-another').hidden = true;
    showPanel('ae-result-panel', false);
    setStatusMessage('ae-submit-status', '', 'info');
    if (document.getElementById('ae-reflection')) {
      document.getElementById('ae-reflection').value = '';
    }
    renderActivity();
  }

  function boot() {
    ensureStatusHelper();
    var activityId = resolveActivityId();

    if (!configModule.usesActivityApi || !configModule.usesActivityApi(activityId)) {
      showPanel('ae-loading', false);
      showPanel('ae-error', true);
      setStatusMessage(
        'ae-error-messages',
        'This page only runs activities configured for the Activity API. Activity ID: ' +
          activityId,
        'error'
      );
      return;
    }

    showPanel('ae-loading', true);
    showPanel('ae-error', false);
    showPanel('ae-main', false);

    api
      .health()
      .then(function (healthData) {
        return api.validateHealthData(healthData);
      })
      .then(function () {
        return api.getActivity(activityId);
      })
      .then(function (data) {
        activityData = validateActivityPayload(data);
        if (activityData.activity.activityId !== activityId) {
          throw new Error('The loaded activity ID did not match the requested activity.');
        }
        state = stateApi.load(activityId);
        showPanel('ae-loading', false);
        showPanel('ae-main', true);
        renderActivity();
      })
      .catch(function (err) {
        showPanel('ae-loading', false);
        showPanel('ae-main', false);
        showPanel('ae-error', true);
        setStatusMessage(
          'ae-error-messages',
          (err && err.learnerMessage) || (err && err.message) || 'The activity could not be loaded.',
          'error'
        );
      });
  }

  ready(function () {
    var submitBtn = document.getElementById('ae-btn-submit');
    var anotherBtn = document.getElementById('ae-btn-start-another');
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    if (anotherBtn) anotherBtn.addEventListener('click', handleStartAnother);
    boot();
  });
})();
