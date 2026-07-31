/**
 * Week 1 Baseline Knowledge Check application logic.
 *
 * Correct answers live in questions.js (public static data) and may be
 * inspected by a technically knowledgeable learner. This diagnostic is
 * low stakes. Do not treat it as a secure assessment or use it for formal grading.
 * Do not display correct answers in the normal learner interface.
 */

(function () {
  'use strict';

  var utils = window.Unit3ActivityUtils || {};
  var submissions = window.Unit3Submissions || {};
  var el = utils.el;
  var setStatusMessage = utils.setStatusMessage;

  var ATTEMPT_KEY = 'unit3-baseline-knowledge-check-attempt-id';
  var TOTAL_RESPONSES = 12;
  var TOTAL_MARKS = 10;
  var JUSTIFICATION_MAX = 1000;

  var state = {
    started: false,
    checked: false,
    answers: {},
    currentIndex: 0,
    startTime: null,
    completionTime: null,
    elapsedSeconds: 0,
    timerId: null,
    timeHidden: false,
    score: 0,
    incorrectNumbers: [],
    confidence: '',
    submitted: false
  };

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function ensureHelpers() {
    if (!el) {
      el = function (tag, attrs, children) {
        var node = document.createElement(tag);
        if (attrs) {
          Object.keys(attrs).forEach(function (key) {
            var value = attrs[key];
            if (key === 'className') node.className = value;
            else if (key === 'textContent') node.textContent = value;
            else if (key === 'htmlFor') node.htmlFor = value;
            else if (value !== null && value !== undefined && value !== false) {
              node.setAttribute(key, value === true ? '' : String(value));
            }
          });
        }
        (children || []).forEach(function (child) {
          if (child == null) return;
          node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
        });
        return node;
      };
    }
    if (!setStatusMessage) {
      setStatusMessage = function (id, message, type) {
        var host = document.getElementById(id);
        if (!host) return;
        host.textContent = '';
        if (!message) return;
        host.appendChild(
          el('p', { className: 'message message-' + (type || 'info'), textContent: message })
        );
      };
    }
  }

  function quiz() {
    return typeof BASELINE_QUIZ !== 'undefined' ? BASELINE_QUIZ : null;
  }

  function questions() {
    return quiz() ? quiz().questions : [];
  }

  function scoredQuestions() {
    return questions().filter(function (q) {
      return q.type === 'single-choice';
    });
  }

  function formatElapsed(totalSeconds) {
    var mins = Math.floor(totalSeconds / 60);
    var secs = totalSeconds % 60;
    var minsText = mins < 10 ? '0' + mins : String(mins);
    var secsText = secs < 10 ? '0' + secs : String(secs);
    return minsText + ':' + secsText;
  }

  function updateElapsedDisplay() {
    var display = document.getElementById('elapsed-display');
    if (!display) return;
    display.textContent = 'Time used: ' + formatElapsed(state.elapsedSeconds);
    display.classList.toggle('is-hidden-visually', state.timeHidden);
    display.setAttribute('aria-hidden', state.timeHidden ? 'true' : 'false');
  }

  function tickElapsed() {
    if (!state.started || state.checked || !state.startTime) return;
    state.elapsedSeconds = Math.max(
      0,
      Math.floor((Date.now() - state.startTime) / 1000)
    );
    updateElapsedDisplay();
  }

  function startElapsedTimer() {
    state.startTime = Date.now();
    state.elapsedSeconds = 0;
    updateElapsedDisplay();
    if (state.timerId) clearInterval(state.timerId);
    state.timerId = setInterval(tickElapsed, 1000);
  }

  function stopElapsedTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    if (state.startTime) {
      state.elapsedSeconds = Math.max(
        0,
        Math.floor((Date.now() - state.startTime) / 1000)
      );
      state.completionTime = state.elapsedSeconds;
    } else {
      state.completionTime = 0;
    }
    updateElapsedDisplay();
  }

  function toggleTimeDisplay() {
    state.timeHidden = !state.timeHidden;
    var btn = document.getElementById('btn-toggle-time');
    btn.textContent = state.timeHidden ? 'Show time' : 'Hide time';
    updateElapsedDisplay();
  }

  function isResponseComplete(question) {
    var value = state.answers[question.id];
    if (question.type === 'prior-knowledge') {
      return typeof value === 'string' && value.trim().length > 0;
    }
    return value !== undefined && value !== null && value !== '';
  }

  function completedCount() {
    return questions().filter(isResponseComplete).length;
  }

  function unansweredNumbers() {
    return questions()
      .filter(function (q) {
        return !isResponseComplete(q);
      })
      .map(function (q) {
        return q.number;
      });
  }

  function refreshProgress() {
    var progress = document.getElementById('quiz-progress');
    if (progress) {
      progress.textContent =
        completedCount() + ' of ' + TOTAL_RESPONSES + ' responses completed';
    }
    var finish = document.getElementById('btn-finish');
    if (finish) {
      finish.disabled = completedCount() < TOTAL_RESPONSES || state.checked;
    }
    refreshNav();
  }

  function buildNav() {
    var host = document.getElementById('question-nav');
    host.textContent = '';
    questions().forEach(function (question, index) {
      var btn = el('button', {
        type: 'button',
        className: 'q-nav-btn',
        'data-index': String(index),
        textContent: String(question.number)
      });
      btn.addEventListener('click', function () {
        showQuestion(index);
      });
      host.appendChild(btn);
    });
  }

  function refreshNav() {
    var buttons = document.querySelectorAll('.q-nav-btn');
    buttons.forEach(function (btn) {
      var index = Number(btn.getAttribute('data-index'));
      var question = questions()[index];
      btn.dataset.status = isResponseComplete(question) ? 'completed' : 'incomplete';
      btn.setAttribute(
        'aria-label',
        'Question ' +
          question.number +
          (isResponseComplete(question) ? ', completed' : ', not completed')
      );
      if (index === state.currentIndex) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });
  }

  function setAnswer(questionId, value) {
    state.answers[questionId] = value;
    if (questionId === 'q11') {
      state.confidence = value;
    }
    refreshProgress();
  }

  function renderChoiceQuestion(question) {
    var fieldset = el('fieldset', { className: 'choice-list' });
    fieldset.appendChild(el('legend', { className: 'visually-hidden', textContent: question.prompt }));

    question.options.forEach(function (option) {
      var inputId = question.id + '-' + option.id;
      var input = el('input', {
        type: 'radio',
        name: question.id,
        id: inputId,
        value: option.id
      });
      if (state.answers[question.id] === option.id) {
        input.checked = true;
      }
      input.addEventListener('change', function () {
        setAnswer(question.id, option.id);
      });
      var label = el('label', { htmlFor: inputId });
      label.appendChild(document.createTextNode(option.id + '. ' + option.text));
      fieldset.appendChild(el('div', { className: 'choice' }, [input, label]));
    });

    return fieldset;
  }

  function renderConfidence(question) {
    var fieldset = el('fieldset', { className: 'choice-list' });
    fieldset.appendChild(
      el('legend', { className: 'visually-hidden', textContent: question.prompt })
    );

    question.options.forEach(function (option) {
      var inputId = question.id + '-' + option.id;
      var input = el('input', {
        type: 'radio',
        name: question.id,
        id: inputId,
        value: option.id
      });
      if (state.answers[question.id] === option.id) {
        input.checked = true;
      }
      input.addEventListener('change', function () {
        setAnswer(question.id, option.id);
      });
      var label = el('label', { htmlFor: inputId });
      label.appendChild(document.createTextNode(option.id + '. ' + option.text));
      fieldset.appendChild(el('div', { className: 'choice' }, [input, label]));
    });

    return fieldset;
  }

  function renderPriorKnowledge(question) {
    var wrap = el('div', { className: 'prior-knowledge-field' });
    var textareaId = question.id + '-response';
    var textarea = el('textarea', {
      id: textareaId,
      name: question.id,
      maxlength: String(question.maxLength || 400),
      'aria-required': 'true',
      rows: '5'
    });
    var current = typeof state.answers[question.id] === 'string' ? state.answers[question.id] : '';
    textarea.value = current;

    var counter = el('p', {
      className: 'char-count',
      id: textareaId + '-count',
      textContent: current.length + ' / ' + (question.maxLength || 400) + ' characters'
    });

    textarea.addEventListener('input', function () {
      var value = textarea.value.slice(0, question.maxLength || 400);
      if (textarea.value !== value) {
        textarea.value = value;
      }
      setAnswer(question.id, value);
      counter.textContent = value.length + ' / ' + (question.maxLength || 400) + ' characters';
    });

    wrap.appendChild(el('label', { htmlFor: textareaId, className: 'visually-hidden', textContent: question.prompt }));
    wrap.appendChild(textarea);
    wrap.appendChild(counter);
    return wrap;
  }

  function renderQuestion() {
    var question = questions()[state.currentIndex];
    var stage = document.getElementById('question-stage');
    stage.textContent = '';

    var card = el('article', {
      className: 'question-card',
      'aria-labelledby': 'question-title-' + question.id
    });

    if (question.category) {
      card.appendChild(el('span', { className: 'category-label', textContent: question.category }));
    }

    var titlePrefix =
      question.type === 'confidence'
        ? 'Question 11 (not scored)'
        : question.type === 'prior-knowledge'
          ? 'Question 12 (not scored)'
          : 'Question ' + question.number;

    card.appendChild(
      el('h3', {
        id: 'question-title-' + question.id,
        textContent: titlePrefix
      })
    );
    card.appendChild(el('p', { textContent: question.prompt }));

    if (question.type === 'single-choice') {
      card.appendChild(renderChoiceQuestion(question));
    } else if (question.type === 'confidence') {
      card.appendChild(renderConfidence(question));
    } else if (question.type === 'prior-knowledge') {
      card.appendChild(renderPriorKnowledge(question));
    }

    stage.appendChild(card);

    document.getElementById('btn-prev').disabled = state.currentIndex === 0 || state.checked;
    document.getElementById('btn-next').disabled =
      state.currentIndex >= questions().length - 1 || state.checked;

    refreshNav();
  }

  function showQuestion(index, options) {
    options = options || {};
    if (index < 0 || index >= questions().length) return;
    state.currentIndex = index;
    if (!options.keepValidation) {
      clearValidationSummary();
    }
    renderQuestion();
    if (options.focus === false) {
      return;
    }
    var focusTarget = document.querySelector(
      '#question-stage input, #question-stage textarea, #question-stage button'
    );
    if (focusTarget) focusTarget.focus();
  }

  function clearValidationSummary() {
    var host = document.getElementById('validation-summary');
    if (host) host.textContent = '';
  }

  function showValidationSummary(missing) {
    var host = document.getElementById('validation-summary');
    host.textContent = '';

    var heading = el('h3', { textContent: 'Please complete the missing responses' });
    var intro = el('p', {
      textContent:
        'You still need to answer question' +
        (missing.length === 1 ? ' ' : 's ') +
        formatList(missing) +
        '.'
    });
    var list = el('ul');

    missing.forEach(function (number) {
      var index = questions().findIndex(function (q) {
        return q.number === number;
      });
      var link = el('button', {
        type: 'button',
        className: 'btn btn-secondary btn-small',
        textContent: 'Go to question ' + number
      });
      link.addEventListener('click', function () {
        showQuestion(index);
      });
      list.appendChild(el('li', null, [link]));
    });

    host.appendChild(heading);
    host.appendChild(intro);
    host.appendChild(list);
    host.focus();
  }

  function formatList(items) {
    if (!items.length) return '';
    if (items.length === 1) return String(items[0]);
    if (items.length === 2) return items[0] + ' and ' + items[1];
    return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
  }

  function confidenceLabel(value) {
    var q11 = questions().find(function (q) {
      return q.id === 'q11';
    });
    if (!q11) return value + '/5';
    var option = q11.options.find(function (opt) {
      return opt.id === value;
    });
    return value + '/5' + (option ? ' (' + option.text + ')' : '');
  }

  function calculateScore() {
    var score = 0;
    var incorrect = [];

    scoredQuestions().forEach(function (question) {
      var selected = state.answers[question.id];
      if (selected === question.correctOption) {
        score += 1;
      } else {
        incorrect.push(question.number);
      }
    });

    state.score = score;
    state.incorrectNumbers = incorrect;
    state.confidence = state.answers.q11 || '';
    return { score: score, incorrect: incorrect };
  }

  function populateHardest() {
    var select = document.getElementById('hardest-card');
    select.textContent = '';
    select.appendChild(el('option', { value: '', textContent: 'Select a question' }));
    for (var i = 1; i <= 10; i += 1) {
      select.appendChild(el('option', { value: String(i), textContent: 'Question ' + i }));
    }
  }

  function showResults() {
    var percentage = Math.round((state.score / TOTAL_MARKS) * 100);
    var summary = document.getElementById('score-summary');
    summary.textContent = '';

    summary.appendChild(
      el('p', {
        textContent:
          'Your baseline has been completed. The result shows your current starting point and will help the tutor identify topics that need more support.'
      })
    );
    summary.appendChild(
      el('p', { textContent: 'Score: ' + state.score + ' / ' + TOTAL_MARKS + ' (' + percentage + '%)' })
    );
    summary.appendChild(
      el('p', {
        textContent: 'Time used: ' + formatElapsed(state.completionTime || 0)
      })
    );
    summary.appendChild(
      el('p', { textContent: 'Confidence rating: ' + confidenceLabel(state.confidence) })
    );

    if (state.incorrectNumbers.length) {
      summary.appendChild(
        el('p', {
          textContent:
            'Questions to revisit later: ' +
            formatList(state.incorrectNumbers) +
            '. The tutor can review these after the relevant content has been taught.'
        })
      );
    } else {
      summary.appendChild(
        el('p', {
          textContent:
            'No scored questions need revisiting from this attempt. The tutor will still use this baseline to plan support.'
        })
      );
    }

    populateHardest();
    document.getElementById('results-panel').hidden = false;
    document.getElementById('submission-panel').hidden = false;
    document.getElementById('results-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('hardest-card').focus();
  }

  function finishAndCheck() {
    var missing = unansweredNumbers();
    if (missing.length) {
      showValidationSummary(missing);
      return;
    }

    clearValidationSummary();
    stopElapsedTimer();
    state.checked = true;
    calculateScore();

    document.getElementById('btn-finish').disabled = true;
    document.getElementById('btn-prev').disabled = true;
    document.getElementById('btn-next').disabled = true;
    document.querySelectorAll('#question-stage input, #question-stage textarea').forEach(function (control) {
      control.disabled = true;
    });
    document.querySelectorAll('.q-nav-btn').forEach(function (btn) {
      btn.disabled = true;
    });

    showResults();
  }

  function getLearnerDetails() {
    return {
      classGroup: (document.getElementById('class-group').value || '').trim(),
      pairCode: (document.getElementById('pair-code').value || '').trim(),
      learner1: (document.getElementById('learner-1').value || '').trim(),
      learner2: ''
    };
  }

  function buildJustification() {
    var answerParts = scoredQuestions().map(function (question) {
      return question.number + '=' + (state.answers[question.id] || '');
    });

    var prior = (state.answers.q12 || '').trim().replace(/\s+/g, ' ');
    var parts = [
      'Activity: Baseline Knowledge Check',
      'Answers: ' + answerParts.join('; '),
      'Confidence: ' + (state.confidence || '') + '/5',
      'Prior knowledge: ' + prior
    ];

    return parts.join('\n').slice(0, JUSTIFICATION_MAX);
  }

  function validateSubmission() {
    var details = getLearnerDetails();
    var hardest = document.getElementById('hardest-card').value;
    var errors = [];
    var prior = (state.answers.q12 || '').trim();

    if (!state.checked) errors.push('Complete the knowledge check before submitting.');
    if (!details.classGroup) errors.push('Class or group is required.');
    if (!details.pairCode) errors.push('Learner code is required.');
    if (state.score < 0 || state.score > TOTAL_MARKS) {
      errors.push('Score must be between 0 and 10.');
    }
    if (!state.confidence) errors.push('Confidence rating is required.');
    if (!prior) errors.push('Prior-knowledge response is required.');
    if (!hardest || Number(hardest) < 1 || Number(hardest) > 10) {
      errors.push('Select the scored question you were least confident about (1 to 10).');
    }
    if (!submissions.isConfigured || !submissions.isConfigured(submissions.COLLECTOR_URL)) {
      errors.push('Submission is not configured yet.');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      details: details,
      hardestCard: Number(hardest)
    };
  }

  function buildPayload(validation) {
    var attemptId = utils.getOrCreateAttemptId
      ? utils.getOrCreateAttemptId(ATTEMPT_KEY)
      : String(Date.now());

    return {
      attemptId: attemptId,
      classGroup: validation.details.classGroup,
      pairCode: validation.details.pairCode,
      learner1: validation.details.learner1,
      learner2: '',
      score: String(state.score),
      totalCards: String(TOTAL_MARKS),
      incorrectCards: state.incorrectNumbers.length
        ? state.incorrectNumbers.join(',')
        : 'None',
      hardestCard: String(validation.hardestCard),
      justification: buildJustification(),
      completionTime: String(state.completionTime || 0),
      activityVersion: quiz().activityVersion,
      sourcePage: window.location.href
    };
  }

  function handleSubmit() {
    var validation = validateSubmission();
    if (!validation.valid) {
      setStatusMessage('submission-messages', validation.errors.join(' '), 'error');
      if (!document.getElementById('hardest-card').value) {
        document.getElementById('hardest-card').focus();
      }
      return;
    }

    var ok = submissions.submitViaForm(buildPayload(validation));
    if (!ok) {
      setStatusMessage(
        'submission-messages',
        'Submission could not be started. Check the collector URL and that Allowed totals includes 10.',
        'error'
      );
      return;
    }

    state.submitted = true;
    document.getElementById('btn-submit').disabled = true;
    document.getElementById('btn-retry').hidden = false;
    setStatusMessage(
      'submission-messages',
      'A confirmation tab has opened. Check whether the result was accepted. Opening a tab does not by itself prove the result was saved. Ten-mark rows require Allowed totals to include 10.',
      'info'
    );
  }

  function handleRetry() {
    var validation = validateSubmission();
    if (!validation.valid) {
      setStatusMessage('submission-messages', validation.errors.join(' '), 'error');
      return;
    }

    var ok = submissions.submitViaForm(buildPayload(validation));
    if (!ok) {
      setStatusMessage('submission-messages', 'Retry could not be started.', 'error');
      return;
    }

    setStatusMessage(
      'submission-messages',
      'A confirmation tab has opened. Check whether the result was accepted. The same Attempt ID was reused for this retry.',
      'info'
    );
  }

  function startQuiz() {
    var details = getLearnerDetails();
    if (!details.classGroup || !details.pairCode) {
      setStatusMessage(
        'start-status',
        'Enter class or group and learner code before starting.',
        'error'
      );
      document.getElementById(!details.classGroup ? 'class-group' : 'pair-code').focus();
      return;
    }
    if (!quiz()) {
      setStatusMessage('start-status', 'Quiz data failed to load.', 'error');
      return;
    }

    if (utils.getOrCreateAttemptId) {
      utils.getOrCreateAttemptId(ATTEMPT_KEY);
    }

    state.started = true;
    document.getElementById('start-panel').hidden = true;
    document.getElementById('quiz-panel').hidden = false;
    buildNav();
    showQuestion(0);
    startElapsedTimer();

    var firstControl = document
      .getElementById('question-stage')
      .querySelector('input, textarea, button');
    if (firstControl) firstControl.focus();
  }

  function resetAttempt() {
    var confirmed = window.confirm(
      'Starting again will create a new attempt. Your first submitted attempt will remain in the results sheet. Continue only if your tutor has asked you to repeat the diagnostic.'
    );
    if (!confirmed) return;

    stopElapsedTimer();
    if (utils.clearAttemptId) utils.clearAttemptId(ATTEMPT_KEY);
    else {
      try {
        sessionStorage.removeItem(ATTEMPT_KEY);
      } catch (err) {
        /* sessionStorage may be unavailable */
      }
    }

    state.started = false;
    state.checked = false;
    state.answers = {};
    state.currentIndex = 0;
    state.startTime = null;
    state.completionTime = null;
    state.elapsedSeconds = 0;
    state.timeHidden = false;
    state.score = 0;
    state.incorrectNumbers = [];
    state.confidence = '';
    state.submitted = false;

    document.getElementById('start-panel').hidden = false;
    document.getElementById('quiz-panel').hidden = true;
    document.getElementById('results-panel').hidden = true;
    document.getElementById('submission-panel').hidden = true;
    document.getElementById('btn-submit').disabled = false;
    document.getElementById('btn-retry').hidden = true;
    document.getElementById('hardest-card').value = '';
    document.getElementById('btn-toggle-time').textContent = 'Hide time';
    document.getElementById('question-stage').textContent = '';
    document.getElementById('question-nav').textContent = '';
    clearValidationSummary();
    updateElapsedDisplay();
    setStatusMessage('submission-messages', '', 'info');
    setStatusMessage(
      'start-status',
      'Ready for a new attempt. Timing starts when you select Start knowledge check.',
      'info'
    );
    document.getElementById('btn-start').focus();
  }

  function bindControls() {
    document.getElementById('btn-start').addEventListener('click', startQuiz);
    document.getElementById('btn-prev').addEventListener('click', function () {
      showQuestion(state.currentIndex - 1);
    });
    document.getElementById('btn-next').addEventListener('click', function () {
      showQuestion(state.currentIndex + 1);
    });
    document.getElementById('btn-toggle-time').addEventListener('click', toggleTimeDisplay);
    document.getElementById('btn-review').addEventListener('click', function () {
      var missing = unansweredNumbers();
      if (!missing.length) {
        setStatusMessage(
          'validation-summary',
          'All 12 responses are complete.',
          'success'
        );
        return;
      }
      showValidationSummary(missing);
    });
    document.getElementById('btn-finish').addEventListener('click', finishAndCheck);
    document.getElementById('btn-new-attempt').addEventListener('click', resetAttempt);
    document.getElementById('btn-submit').addEventListener('click', handleSubmit);
    document.getElementById('btn-retry').addEventListener('click', handleRetry);
  }

  ready(function () {
    ensureHelpers();
    if (!quiz()) {
      setStatusMessage(
        'start-status',
        'Quiz data failed to load. Check that questions.js is available.',
        'error'
      );
      return;
    }
    bindControls();
    updateElapsedDisplay();
  });
})();
