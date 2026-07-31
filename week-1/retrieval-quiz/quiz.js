/**
 * Week 1 Session 2 Retrieval Quiz application logic.
 * Low-stakes formative activity. Static answer data can be inspected.
 */

(function () {
  'use strict';

  var utils = window.Unit3ActivityUtils || {};
  var submissions = window.Unit3Submissions || {};
  var el = utils.el;
  var setStatusMessage = utils.setStatusMessage;

  var ATTEMPT_KEY = 'unit3-session2-retrieval-attempt-id';
  var TOTAL_SECTIONS = 12;
  var TOTAL_MARKS = 15;

  var state = {
    started: false,
    checked: false,
    selfMarked: false,
    answers: {},
    selfMarks: { confidentiality: false, integrity: false },
    sectionIndex: 0,
    startTime: null,
    completionTime: null,
    remainingSeconds: 600,
    timerId: null,
    lastAnnouncedMinute: null,
    objectiveScore: 0,
    writtenScore: 0,
    incorrectNumbers: [],
    withinTime: true
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
        host.appendChild(el('p', { className: 'message message-' + (type || 'info'), textContent: message }));
      };
    }
  }

  function quiz() {
    return typeof RETRIEVAL_QUIZ !== 'undefined' ? RETRIEVAL_QUIZ : null;
  }

  function questions() {
    return quiz() ? quiz().questions : [];
  }

  function formatTime(totalSeconds) {
    var mins = Math.floor(totalSeconds / 60);
    var secs = totalSeconds % 60;
    var secsText = secs < 10 ? '0' + secs : String(secs);
    return String(mins) + ':' + secsText;
  }

  function updateTimerDisplay(announce) {
    var display = document.getElementById('timer-display');
    var sr = document.getElementById('timer-sr');
    var timer = document.getElementById('timer');
    display.textContent = state.remainingSeconds > 0 ? formatTime(state.remainingSeconds) : '0:00';
    timer.classList.toggle('is-warning', state.remainingSeconds > 0 && state.remainingSeconds <= 120);
    timer.classList.toggle('is-expired', state.remainingSeconds <= 0);

    if (state.remainingSeconds <= 0) {
      if (announce) sr.textContent = 'Time is up. You may finish your current responses.';
      display.textContent = 'Time is up';
      return;
    }

    if (announce) {
      var minutesLeft = Math.ceil(state.remainingSeconds / 60);
      if (state.remainingSeconds === 120) {
        sr.textContent = 'Two minutes remaining.';
        state.lastAnnouncedMinute = minutesLeft;
      } else if (state.lastAnnouncedMinute !== minutesLeft && state.remainingSeconds % 60 === 0) {
        sr.textContent = minutesLeft + ' minutes remaining.';
        state.lastAnnouncedMinute = minutesLeft;
      }
    }
  }

  function tickTimer() {
    if (state.remainingSeconds <= 0) {
      clearInterval(state.timerId);
      state.timerId = null;
      state.withinTime = false;
      updateTimerDisplay(true);
      setStatusMessage('quiz-status', 'Time is up. You may finish your current responses. Answers are not deleted.', 'warning');
      return;
    }
    state.remainingSeconds -= 1;
    if (state.remainingSeconds === 0) {
      state.withinTime = false;
    }
    updateTimerDisplay(true);
  }

  function startTimer() {
    state.remainingSeconds = quiz().durationSeconds;
    state.lastAnnouncedMinute = 10;
    updateTimerDisplay(true);
    if (state.timerId) clearInterval(state.timerId);
    state.timerId = setInterval(tickTimer, 1000);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function isSectionComplete(question) {
    var value = state.answers[question.id];
    if (question.type === 'multi-select') {
      return Array.isArray(value) && value.length === question.maxSelections;
    }
    if (question.type === 'written') {
      return typeof value === 'string' && value.trim().length > 0;
    }
    return value !== undefined && value !== null && value !== '';
  }

  function completedCount() {
    return questions().filter(isSectionComplete).length;
  }

  function unansweredLabels() {
    return questions()
      .filter(function (q) { return !isSectionComplete(q); })
      .map(function (q) { return q.number; });
  }

  function refreshProgress() {
    document.getElementById('quiz-progress').textContent =
      completedCount() + ' of ' + TOTAL_SECTIONS + ' response sections completed';
    document.getElementById('btn-finish').disabled = completedCount() < TOTAL_SECTIONS || state.checked;
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
        textContent: question.number
      });
      btn.addEventListener('click', function () {
        showSection(index);
      });
      host.appendChild(btn);
    });
  }

  function refreshNav() {
    var buttons = document.querySelectorAll('.q-nav-btn');
    buttons.forEach(function (btn) {
      var index = Number(btn.getAttribute('data-index'));
      var question = questions()[index];
      btn.dataset.status = isSectionComplete(question) ? 'completed' : 'incomplete';
      btn.setAttribute(
        'aria-label',
        'Go to question ' + question.number + ', status: ' +
          (isSectionComplete(question) ? 'completed' : 'incomplete')
      );
      if (index === state.sectionIndex) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });
  }

  function getMultiSelectAnswers(id) {
    if (!Array.isArray(state.answers[id])) state.answers[id] = [];
    return state.answers[id];
  }

  function renderSection() {
    var stage = document.getElementById('question-stage');
    var question = questions()[state.sectionIndex];
    stage.textContent = '';
    if (!question) return;

    var card = el('article', {
      className: 'question-card',
      'aria-labelledby': 'question-title-' + question.id
    });

    if (question.groupHeading && question.id === 'q2a') {
      card.appendChild(el('h3', {
        textContent: question.groupHeading + ' [' + question.groupMarks + ']'
      }));
    }

    var title = el('h3', {
      id: 'question-title-' + question.id
    });
    title.appendChild(document.createTextNode(
      'Question ' + question.number + '. ' + question.prompt
    ));
    title.appendChild(el('span', {
      className: 'marks-badge',
      textContent: '[' + question.marks + ']'
    }));
    card.appendChild(title);

    if (question.questionText) {
      card.appendChild(el('p', { textContent: question.questionText }));
    }
    if (question.instruction) {
      card.appendChild(el('p', { className: 'panel-note', textContent: question.instruction }));
    }
    if (question.type === 'evidence') {
      card.appendChild(el('p', {
        textContent: 'Question 4 scenario: ' + question.relatedScenarioText
      }));
    }

    if (question.type === 'multi-select') {
      var group = el('div', {
        className: 'choice-list',
        role: 'group',
        'aria-label': 'Options for question ' + question.number
      });
      question.options.forEach(function (option, index) {
        var inputId = question.id + '-opt-' + index;
        var input = el('input', {
          type: 'checkbox',
          id: inputId,
          value: option
        });
        var selected = getMultiSelectAnswers(question.id);
        if (selected.indexOf(option) !== -1) input.checked = true;
        if (state.checked) input.disabled = true;
        input.addEventListener('change', function () {
          if (state.checked) return;
          var current = getMultiSelectAnswers(question.id).slice();
          if (input.checked) {
            if (current.length >= question.maxSelections) {
              input.checked = false;
              setStatusMessage('quiz-status', 'Select exactly three options for Question 1.', 'warning');
              return;
            }
            current.push(option);
          } else {
            current = current.filter(function (item) { return item !== option; });
          }
          state.answers[question.id] = current;
          refreshProgress();
        });
        group.appendChild(el('div', { className: 'choice' }, [
          input,
          el('label', { htmlFor: inputId, textContent: option })
        ]));
      });
      card.appendChild(group);
    } else if (
      question.type === 'cia-radio' ||
      question.type === 'incident-radio' ||
      question.type === 'evidence'
    ) {
      var radios = el('div', {
        className: 'choice-list',
        role: 'radiogroup',
        'aria-label': 'Answers for question ' + question.number
      });
      question.options.forEach(function (option, index) {
        var inputId = question.id + '-opt-' + index;
        var input = el('input', {
          type: 'radio',
          name: question.id,
          id: inputId,
          value: option
        });
        if (state.answers[question.id] === option) input.checked = true;
        if (state.checked) input.disabled = true;
        input.addEventListener('change', function () {
          if (state.checked) return;
          state.answers[question.id] = option;
          refreshProgress();
        });
        radios.appendChild(el('div', { className: 'choice' }, [
          input,
          el('label', { htmlFor: inputId, textContent: option })
        ]));
      });
      card.appendChild(radios);
    } else if (question.type === 'written') {
      var textareaId = 'written-' + question.id;
      var textarea = el('textarea', {
        id: textareaId,
        rows: '6',
        maxlength: String(question.maxLength),
        'aria-describedby': 'written-count-' + question.id
      });
      textarea.value = state.answers[question.id] || '';
      if (state.checked) textarea.disabled = true;
      var counter = el('p', {
        id: 'written-count-' + question.id,
        className: 'char-count',
        textContent: (textarea.value.length || 0) + ' / ' + question.maxLength + ' characters'
      });
      textarea.addEventListener('input', function () {
        if (state.checked) return;
        state.answers[question.id] = textarea.value;
        counter.textContent = textarea.value.length + ' / ' + question.maxLength + ' characters';
        refreshProgress();
      });
      card.appendChild(el('label', { htmlFor: textareaId, textContent: 'Your answer' }));
      card.appendChild(textarea);
      card.appendChild(counter);
    }

    stage.appendChild(card);
    document.getElementById('btn-prev').disabled = state.sectionIndex === 0;
    document.getElementById('btn-next').disabled = state.sectionIndex >= questions().length - 1;
    refreshProgress();
  }

  function showSection(index) {
    state.sectionIndex = Math.max(0, Math.min(index, questions().length - 1));
    renderSection();
  }

  function scoreObjective() {
    var score = 0;
    var incorrect = {};

    questions().forEach(function (question) {
      if (question.type === 'written') return;

      if (question.type === 'multi-select') {
        var selected = getMultiSelectAnswers(question.id);
        var earned = 0;
        question.correctAnswers.forEach(function (answer) {
          if (selected.indexOf(answer) !== -1) earned += 1;
        });
        score += earned;
        if (earned < question.marks) incorrect[question.reportNumber] = true;
        question._earned = earned;
        question._learnerDisplay = selected.join(', ') || 'No selection';
      } else {
        var correct = state.answers[question.id] === question.correctAnswer;
        if (correct) score += question.marks;
        else incorrect[question.reportNumber] = true;
        question._earned = correct ? question.marks : 0;
        question._learnerDisplay = state.answers[question.id] || 'No answer';
      }
    });

    state.objectiveScore = score;
    state.incorrectNumbers = Object.keys(incorrect)
      .map(Number)
      .sort(function (a, b) { return a - b; });
    return score;
  }

  function finishAndCheck() {
    var missing = unansweredLabels();
    if (missing.length) {
      setStatusMessage(
        'quiz-status',
        'Complete all response sections before checking. Still unanswered: ' + missing.join(', '),
        'error'
      );
      var firstMissing = questions().findIndex(function (q) { return !isSectionComplete(q); });
      if (firstMissing >= 0) {
        showSection(firstMissing);
        var firstControl = document.querySelector('#question-stage input, #question-stage textarea');
        if (firstControl) firstControl.focus();
      }
      return;
    }

    stopTimer();
    state.checked = true;
    state.completionTime = Math.max(
      1,
      Math.round((Date.now() - state.startTime) / 1000)
    );
    if (state.remainingSeconds <= 0) state.withinTime = false;

    scoreObjective();
    document.getElementById('btn-finish').disabled = true;
    openSelfMarkPanel();
  }

  function openSelfMarkPanel() {
    var q9 = questions().find(function (q) { return q.id === 'q9'; });
    var guidance = document.getElementById('selfmark-guidance');
    var response = document.getElementById('selfmark-response');
    var checks = document.getElementById('selfmark-checks');

    guidance.textContent = '';
    guidance.appendChild(el('h3', { textContent: 'Marking guidance' }));
    q9.markingGuidance.forEach(function (point) {
      guidance.appendChild(el('p', { textContent: point }));
    });

    response.textContent = '';
    response.appendChild(el('h3', { textContent: 'Your written response' }));
    response.appendChild(el('p', { textContent: state.answers.q9 || '' }));

    checks.textContent = '';
    q9.selfMarkLabels.forEach(function (label, index) {
      var key = index === 0 ? 'confidentiality' : 'integrity';
      var id = 'selfmark-' + key;
      var input = el('input', { type: 'checkbox', id: id });
      input.checked = !!state.selfMarks[key];
      input.addEventListener('change', function () {
        state.selfMarks[key] = input.checked;
      });
      checks.appendChild(el('div', { className: 'choice' }, [
        input,
        el('label', { htmlFor: id, textContent: label + ' [1]' })
      ]));
    });

    document.getElementById('selfmark-panel').hidden = false;
    document.getElementById('selfmark-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('btn-confirm-selfmark').focus();
    setStatusMessage(
      'quiz-status',
      'Objective answers checked. Complete Question 9 self-marking to see your final score.',
      'info'
    );
    renderSection();
  }

  function confirmSelfMark() {
    state.writtenScore =
      (state.selfMarks.confidentiality ? 1 : 0) +
      (state.selfMarks.integrity ? 1 : 0);
    state.selfMarked = true;

    if (state.writtenScore < 2 && state.incorrectNumbers.indexOf(9) === -1) {
      state.incorrectNumbers.push(9);
      state.incorrectNumbers.sort(function (a, b) { return a - b; });
    } else if (state.writtenScore === 2) {
      state.incorrectNumbers = state.incorrectNumbers.filter(function (n) { return n !== 9; });
    }

    document.getElementById('selfmark-panel').hidden = true;
    showResults();
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
    var total = state.objectiveScore + state.writtenScore;
    var percentage = Math.round((total / TOTAL_MARKS) * 100);
    var summary = document.getElementById('score-summary');
    summary.textContent = '';
    summary.appendChild(el('p', { textContent: 'Final score: ' + total + ' / ' + TOTAL_MARKS + ' (' + percentage + '%)' }));
    summary.appendChild(el('p', { textContent: 'Objective subtotal: ' + state.objectiveScore + ' / 13' }));
    summary.appendChild(el('p', { textContent: 'Question 9 self-mark: ' + state.writtenScore + ' / 2' }));
    summary.appendChild(el('p', { textContent: 'Time taken: ' + state.completionTime + ' seconds' }));
    summary.appendChild(el('p', {
      textContent: state.withinTime ? 'Timer status: within time' : 'Timer status: over time'
    }));
    summary.appendChild(el('p', {
      textContent: state.incorrectNumbers.length
        ? 'Questions requiring review: ' + state.incorrectNumbers.join(', ')
        : 'No questions require review.'
    }));

    var host = document.getElementById('feedback-host');
    host.textContent = '';
    host.appendChild(el('h3', { textContent: 'Question-by-question feedback' }));

    questions().forEach(function (question) {
      var item = el('article', { className: 'feedback-item' });
      if (question.type === 'written') {
        item.classList.add(state.writtenScore === 2 ? 'correct' : 'incorrect');
        item.appendChild(el('h4', { textContent: 'Question ' + question.number }));
        item.appendChild(el('p', { textContent: 'Your answer: ' + (state.answers.q9 || '') }));
        item.appendChild(el('p', { textContent: 'Self-awarded marks: ' + state.writtenScore + ' / 2' }));
        question.markingGuidance.forEach(function (point) {
          item.appendChild(el('p', { textContent: 'Marking point: ' + point }));
        });
        item.appendChild(el('p', { textContent: 'Model full-mark response: ' + question.modelAnswer }));
      } else {
        var full = question._earned === question.marks;
        item.classList.add(full ? 'correct' : 'incorrect');
        item.appendChild(el('h4', { textContent: 'Question ' + question.number }));
        item.appendChild(el('p', { textContent: 'Your answer: ' + question._learnerDisplay }));
        if (question.type === 'multi-select') {
          item.appendChild(el('p', {
            textContent: 'Correct answers: ' + question.correctAnswers.join(', ')
          }));
          item.appendChild(el('p', { textContent: 'Marks awarded: ' + question._earned + ' / ' + question.marks }));
        } else {
          item.appendChild(el('p', { textContent: 'Correct answer: ' + question.correctAnswer }));
        }
        item.appendChild(el('p', { textContent: 'Explanation: ' + question.explanation }));
      }
      host.appendChild(item);
    });

    populateHardest();
    document.getElementById('results-panel').hidden = false;
    document.getElementById('submission-panel').hidden = false;
    document.getElementById('results-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('hardest-card').focus();
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
    var parts = [
      'Question 9 response: ' + (state.answers.q9 || '').trim(),
      'Question 9 self-mark: ' + state.writtenScore + '/2',
      'Term to revisit: ' + (document.getElementById('revisit-term').value || '').trim(),
      'Timer status: ' + (state.withinTime ? 'within time' : 'over time')
    ];
    return parts.join('\n').slice(0, 1000);
  }

  function validateSubmission() {
    var details = getLearnerDetails();
    var hardest = document.getElementById('hardest-card').value;
    var revisit = (document.getElementById('revisit-term').value || '').trim();
    var errors = [];
    var total = state.objectiveScore + state.writtenScore;

    if (!state.checked || !state.selfMarked) errors.push('Complete checking and Question 9 self-marking first.');
    if (!details.classGroup) errors.push('Class or group is required.');
    if (!details.pairCode) errors.push('Learner code is required.');
    if (total < 0 || total > TOTAL_MARKS) errors.push('Score must be between 0 and 15.');
    if (!hardest || Number(hardest) < 1 || Number(hardest) > 10) {
      errors.push('Choose the hardest numbered question (1 to 10).');
    }
    if (!revisit) errors.push('Enter one term to revisit.');
    if (!submissions.isConfigured || !submissions.isConfigured(submissions.COLLECTOR_URL)) {
      errors.push('Submission is not configured yet.');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      details: details,
      hardestCard: Number(hardest),
      total: total
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
      score: String(validation.total),
      totalCards: String(TOTAL_MARKS),
      incorrectCards: state.incorrectNumbers.length ? state.incorrectNumbers.join(',') : 'None',
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
      return;
    }
    var ok = submissions.submitViaForm(buildPayload(validation));
    if (!ok) {
      setStatusMessage('submission-messages', 'Submission could not be started. Check the collector URL and collector v2 deployment.', 'error');
      return;
    }
    document.getElementById('btn-submit').disabled = true;
    document.getElementById('btn-retry').hidden = false;
    setStatusMessage(
      'submission-messages',
      'A confirmation tab has opened. Check that your result was accepted. Opening a tab does not by itself prove the result was saved. Fifteen-mark rows require collector v2 to be deployed.',
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
      'A confirmation tab has opened. Check that your result was accepted. The same Attempt ID was reused for this retry.',
      'info'
    );
  }

  function startQuiz() {
    var details = getLearnerDetails();
    if (!details.classGroup || !details.pairCode) {
      setStatusMessage('start-status', 'Enter class or group and learner code before starting.', 'error');
      document.getElementById(!details.classGroup ? 'class-group' : 'pair-code').focus();
      return;
    }
    if (!quiz()) {
      setStatusMessage('start-status', 'Quiz data failed to load.', 'error');
      return;
    }

    state.started = true;
    state.startTime = Date.now();
    document.getElementById('start-panel').hidden = true;
    document.getElementById('quiz-panel').hidden = false;
    buildNav();
    showSection(0);
    startTimer();
    setStatusMessage('quiz-status', 'Quiz started. The 10-minute timer is running.', 'info');
    var firstControl = document.getElementById('question-stage').querySelector('input, textarea, button');
    if (firstControl) firstControl.focus();
  }

  function resetAttempt() {
    if (!window.confirm('Start a new attempt? This clears all answers, the timer, score and the retrieval Attempt ID.')) {
      return;
    }
    stopTimer();
    if (utils.clearAttemptId) utils.clearAttemptId(ATTEMPT_KEY);
    else {
      try { sessionStorage.removeItem(ATTEMPT_KEY); } catch (err) { /* ignore */ }
    }

    state.started = false;
    state.checked = false;
    state.selfMarked = false;
    state.answers = {};
    state.selfMarks = { confidentiality: false, integrity: false };
    state.sectionIndex = 0;
    state.startTime = null;
    state.completionTime = null;
    state.remainingSeconds = 600;
    state.objectiveScore = 0;
    state.writtenScore = 0;
    state.incorrectNumbers = [];
    state.withinTime = true;

    document.getElementById('start-panel').hidden = false;
    document.getElementById('quiz-panel').hidden = true;
    document.getElementById('selfmark-panel').hidden = true;
    document.getElementById('results-panel').hidden = true;
    document.getElementById('submission-panel').hidden = true;
    document.getElementById('btn-submit').disabled = false;
    document.getElementById('btn-retry').hidden = true;
    document.getElementById('hardest-card').value = '';
    document.getElementById('revisit-term').value = '';
    setStatusMessage('submission-messages', '', 'info');
    setStatusMessage('start-status', 'Ready for a new attempt. The timer starts when you select Start quiz.', 'info');
    document.getElementById('btn-start').focus();
  }

  function bindControls() {
    document.getElementById('btn-start').addEventListener('click', startQuiz);
    document.getElementById('btn-prev').addEventListener('click', function () {
      showSection(state.sectionIndex - 1);
    });
    document.getElementById('btn-next').addEventListener('click', function () {
      showSection(state.sectionIndex + 1);
    });
    document.getElementById('btn-review').addEventListener('click', function () {
      var missing = unansweredLabels();
      if (!missing.length) {
        setStatusMessage('quiz-status', 'All response sections are complete.', 'success');
        return;
      }
      var firstMissing = questions().findIndex(function (q) { return !isSectionComplete(q); });
      setStatusMessage(
        'quiz-status',
        'Unanswered: ' + missing.join(', ') + '. Showing question ' + questions()[firstMissing].number + '.',
        'warning'
      );
      showSection(firstMissing);
      var control = document.querySelector('#question-stage input, #question-stage textarea');
      if (control) control.focus();
    });
    document.getElementById('btn-finish').addEventListener('click', finishAndCheck);
    document.getElementById('btn-confirm-selfmark').addEventListener('click', confirmSelfMark);
    document.getElementById('btn-new-attempt').addEventListener('click', resetAttempt);
    document.getElementById('btn-submit').addEventListener('click', handleSubmit);
    document.getElementById('btn-retry').addEventListener('click', handleRetry);
  }

  ready(function () {
    ensureHelpers();
    if (!quiz()) {
      setStatusMessage('start-status', 'Quiz data failed to load. Check that questions.js is available.', 'error');
      return;
    }
    bindControls();
    updateTimerDisplay(false);
  });
})();
