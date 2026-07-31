/**
 * Cyber Security Glossary interactive activity.
 * Modes: searchable glossary, flashcards, 12-question knowledge check.
 */

(function () {
  'use strict';

  var utils = window.Unit3ActivityUtils || {};
  var submissions = window.Unit3Submissions || {};
  var el = utils.el;
  var setStatusMessage = utils.setStatusMessage;

  var ATTEMPT_STORAGE_KEY = 'unit3-glossary-attempt-id';
  var FLASH_STORAGE_KEY = 'unit3-glossary-flash-progress';
  var TOTAL_QUESTIONS = 12;
  var ACTIVITY_VERSION = '1.0';

  var quizState = {
    answers: {},
    checked: false,
    score: 0,
    incorrectQuestions: [],
    startTime: null,
    completionTime: null
  };

  var flashState = {
    order: [],
    index: 0,
    revealed: false,
    understood: {},
    review: {}
  };

  var activeCategories = {};

  var QUIZ_QUESTIONS = [
    {
      id: 1,
      prompt: 'What does cyber security mean?',
      options: [
        'Only installing antivirus software on school computers',
        'Protecting digital systems and the information stored, processed or transferred by them',
        'Deleting unused student accounts every term',
        'Printing paper backups of every file'
      ],
      correctIndex: 1,
      explanation: 'Cyber security means protecting digital systems and the information they store, process or transfer.'
    },
    {
      id: 2,
      prompt: 'What is the CIA triad?',
      options: [
        'A list of malware types used in Northbank scenarios',
        'A model containing confidentiality, integrity and availability',
        'A password policy for college staff only',
        'A type of denial of service attack'
      ],
      correctIndex: 1,
      explanation: 'The CIA triad is the model of confidentiality, integrity and availability.'
    },
    {
      id: 3,
      prompt: 'A Northbank clinic spreadsheet containing staff National Insurance numbers is emailed to an external contact by mistake. Which CIA aim is most directly affected?',
      options: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
      correctIndex: 0,
      explanation: 'Confidentiality is affected because personal information was seen by someone who should not have received it.',
      scenario: true
    },
    {
      id: 4,
      prompt: 'A staff member changes the dosage shown on a patient record without permission. Which CIA aim is most directly affected?',
      options: ['Confidentiality', 'Integrity', 'Availability', 'Authorisation'],
      correctIndex: 1,
      explanation: 'Integrity is affected because the information was changed without permission and may no longer be accurate.',
      scenario: true
    },
    {
      id: 5,
      prompt: 'The college VLE becomes unreachable during an assessment window because of a flood of connection requests. Which CIA aim is most directly affected?',
      options: ['Confidentiality', 'Integrity', 'Availability', 'Evidence'],
      correctIndex: 2,
      explanation: 'Availability is affected because authorised learners cannot access the system when they need it.',
      scenario: true
    },
    {
      id: 6,
      prompt: 'What is unauthorised access?',
      options: [
        'A person or system gains access to information, an account or a service without permission',
        'A backup is stored in a locked cupboard',
        'A user resets their own password after forgetting it',
        'A teacher shares a lesson file with their class'
      ],
      correctIndex: 0,
      explanation: 'Unauthorised access means gaining access to information, an account or a service without permission.'
    },
    {
      id: 7,
      prompt: 'What does information disclosure mean?',
      options: [
        'A system is offline during maintenance',
        'Information is revealed to people who are not permitted to see it',
        'A password is changed after a reminder expires',
        'A file is compressed to save storage space'
      ],
      correctIndex: 1,
      explanation: 'Information disclosure means information is revealed to people who are not permitted to see it.'
    },
    {
      id: 8,
      prompt: 'LocalGoods product prices are changed to £0.01 overnight by someone using a privileged account without permission. Which incident classification best fits this change?',
      options: ['Information disclosure', 'Modification of data', 'Denial of service', 'Identify'],
      correctIndex: 1,
      explanation: 'Modification of data fits because information was changed without permission, affecting accuracy.',
      scenario: true
    },
    {
      id: 9,
      prompt: 'What does inaccessible data mean?',
      options: [
        'Authorised users cannot access information or systems when they need them',
        'Data is copied to a second server for backup',
        'A file is labelled confidential',
        'A learner prints a revision sheet'
      ],
      correctIndex: 0,
      explanation: 'Inaccessible data means authorised users cannot reach the information or systems they need.'
    },
    {
      id: 10,
      prompt: 'Which definition best matches destruction?',
      options: [
        'Checking that a user is who they claim to be',
        'Data, software or equipment is deliberately or accidentally deleted or damaged',
        'Naming the correct CIA aim in an exam answer',
        'Using two different checks to verify identity'
      ],
      correctIndex: 1,
      explanation: 'Destruction means data, software or equipment is deleted or damaged, deliberately or accidentally.'
    },
    {
      id: 11,
      prompt: 'Banking malware harvests a tutor’s business email form data without permission. Which incident classification best fits this?',
      options: ['Theft', 'Describe', 'Availability', 'Organisational data'],
      correctIndex: 0,
      explanation: 'Theft fits because credentials and account information were taken without permission.',
      scenario: true
    },
    {
      id: 12,
      prompt: 'What is multi-factor authentication?',
      options: [
        'Using two or more different checks to verify a user’s identity',
        'Saving passwords in a shared spreadsheet',
        'Turning a computer off overnight',
        'Printing every login attempt for filing'
      ],
      correctIndex: 0,
      explanation: 'Multi-factor authentication uses two or more different checks to verify identity.'
    }
  ];

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
      setStatusMessage = function (containerId, message, type) {
        var host = document.getElementById(containerId);
        if (!host) return;
        host.textContent = '';
        if (!message) return;
        host.appendChild(el('p', { className: 'message message-' + (type || 'info'), textContent: message }));
      };
    }
  }

  function getTerms() {
    return typeof GLOSSARY_TERMS !== 'undefined' && Array.isArray(GLOSSARY_TERMS)
      ? GLOSSARY_TERMS.slice()
      : [];
  }

  function getCategories() {
    return typeof GLOSSARY_CATEGORIES !== 'undefined' && Array.isArray(GLOSSARY_CATEGORIES)
      ? GLOSSARY_CATEGORIES.slice()
      : [];
  }

  function sortedTerms() {
    return getTerms().sort(function (a, b) {
      return a.term.localeCompare(b.term, 'en-GB');
    });
  }

  function setMode(mode) {
    var panels = {
      glossary: document.getElementById('panel-glossary'),
      flashcards: document.getElementById('panel-flashcards'),
      quiz: document.getElementById('panel-quiz')
    };
    var tabs = {
      glossary: document.getElementById('tab-glossary'),
      flashcards: document.getElementById('tab-flashcards'),
      quiz: document.getElementById('tab-quiz')
    };
    Object.keys(panels).forEach(function (key) {
      var selected = key === mode;
      if (panels[key]) panels[key].hidden = !selected;
      if (tabs[key]) tabs[key].setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }

  function bindModeTabs() {
    document.getElementById('tab-glossary').addEventListener('click', function () { setMode('glossary'); });
    document.getElementById('tab-flashcards').addEventListener('click', function () { setMode('flashcards'); });
    document.getElementById('tab-quiz').addEventListener('click', function () {
      setMode('quiz');
      if (!quizState.startTime && !quizState.checked) {
        quizState.startTime = Date.now();
      }
    });
  }

  function buildCategoryFilters() {
    var host = document.getElementById('category-filters');
    host.textContent = '';
    getCategories().forEach(function (category, index) {
      activeCategories[category] = true;
      var id = 'cat-filter-' + index;
      var input = el('input', { type: 'checkbox', id: id, checked: true, value: category });
      input.addEventListener('change', function () {
        activeCategories[category] = input.checked;
        renderGlossaryList();
      });
      host.appendChild(
        el('div', { className: 'choice' }, [
          input,
          el('label', { htmlFor: id, textContent: category })
        ])
      );
    });
  }

  function termMatches(term, query) {
    if (!query) return true;
    var haystack = [
      term.term,
      term.definition,
      term.category,
      (term.relatedTerms || []).join(' ')
    ]
      .join(' ')
      .toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function getFilteredTerms() {
    var query = (document.getElementById('glossary-search').value || '').trim().toLowerCase();
    return sortedTerms().filter(function (term) {
      return activeCategories[term.category] && termMatches(term, query);
    });
  }

  function renderGlossaryList() {
    var list = document.getElementById('glossary-list');
    var filtered = getFilteredTerms();
    list.textContent = '';
    document.getElementById('term-count').textContent =
      filtered.length + ' term' + (filtered.length === 1 ? '' : 's') + ' shown';

    if (!filtered.length) {
      list.appendChild(el('p', { className: 'panel-note', textContent: 'No terms match the current search or filters.' }));
      return;
    }

    filtered.forEach(function (term) {
      var bodyId = 'term-body-' + term.id;
      var toggleId = 'term-toggle-' + term.id;
      var body = el('div', { id: bodyId, className: 'term-card-body', hidden: true }, [
        el('p', { textContent: term.definition }),
        el('p', { textContent: 'Northbank example: ' + term.northbankExample }),
        el('p', { textContent: 'Related terms:' }),
        el(
          'ul',
          { className: 'related-terms' },
          (term.relatedTerms || []).map(function (related) {
            return el('li', { textContent: related });
          })
        )
      ]);
      var toggle = el('button', {
        type: 'button',
        id: toggleId,
        className: 'term-card-toggle',
        'aria-expanded': 'false',
        'aria-controls': bodyId
      });
      toggle.appendChild(el('span', { textContent: term.term }));
      toggle.appendChild(el('span', { className: 'category-label', textContent: term.category }));
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
        body.hidden = open;
      });
      list.appendChild(el('article', { className: 'term-card' }, [toggle, body]));
    });
  }

  function bindGlossaryControls() {
    document.getElementById('glossary-search').addEventListener('input', renderGlossaryList);
    document.getElementById('btn-clear-filters').addEventListener('click', function () {
      document.getElementById('glossary-search').value = '';
      getCategories().forEach(function (category) {
        activeCategories[category] = true;
      });
      Array.prototype.forEach.call(document.querySelectorAll('#category-filters input'), function (input) {
        input.checked = true;
      });
      renderGlossaryList();
      setStatusMessage('glossary-status', 'Search and category filters cleared.', 'info');
    });
  }

  function loadFlashProgress() {
    try {
      var raw = sessionStorage.getItem(FLASH_STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        flashState.understood = data.understood || {};
        flashState.review = data.review || {};
        if (Array.isArray(data.order) && data.order.length) {
          flashState.order = data.order;
        }
        if (typeof data.index === 'number') {
          flashState.index = data.index;
        }
      }
    } catch (err) {
      /* ignore */
    }
  }

  function saveFlashProgress() {
    try {
      sessionStorage.setItem(
        FLASH_STORAGE_KEY,
        JSON.stringify({
          understood: flashState.understood,
          review: flashState.review,
          order: flashState.order,
          index: flashState.index
        })
      );
    } catch (err) {
      /* ignore */
    }
  }

  function ensureFlashOrder() {
    if (!flashState.order.length) {
      flashState.order = sortedTerms().map(function (term) { return term.id; });
    }
    if (flashState.index < 0 || flashState.index >= flashState.order.length) {
      flashState.index = 0;
    }
  }

  function currentFlashTerm() {
    ensureFlashOrder();
    var id = flashState.order[flashState.index];
    return getTerms().find(function (term) { return term.id === id; });
  }

  function countMarked(map) {
    return Object.keys(map).filter(function (key) { return map[key]; }).length;
  }

  function renderFlashcard() {
    ensureFlashOrder();
    var term = currentFlashTerm();
    var stage = document.getElementById('flashcard-stage');
    var progress = document.getElementById('flashcard-progress');
    stage.textContent = '';
    if (!term) {
      stage.appendChild(el('p', { textContent: 'No flashcards available.' }));
      return;
    }

    progress.textContent =
      flashState.index + 1 +
      ' of ' +
      flashState.order.length +
      ' · Understood: ' +
      countMarked(flashState.understood) +
      ' · Review: ' +
      countMarked(flashState.review);

    var card = el('div', { className: 'flashcard', tabindex: '0', 'aria-label': 'Flashcard for ' + term.term });
    card.appendChild(el('h3', { className: 'flash-term', textContent: term.term }));
    card.appendChild(el('p', { className: 'category-label', textContent: term.category }));
    if (flashState.revealed) {
      card.appendChild(el('p', { textContent: term.definition }));
      card.appendChild(el('p', { textContent: 'Northbank example: ' + term.northbankExample }));
    } else {
      card.appendChild(el('p', { textContent: 'Definition hidden. Use Reveal definition or press Enter.' }));
    }
    stage.appendChild(card);
    document.getElementById('btn-flash-reveal').textContent = flashState.revealed
      ? 'Hide definition'
      : 'Reveal definition';
    document.getElementById('btn-flash-prev').disabled = flashState.index === 0;
    document.getElementById('btn-flash-next').disabled = flashState.index >= flashState.order.length - 1;
  }

  function bindFlashcards() {
    loadFlashProgress();
    ensureFlashOrder();
    renderFlashcard();

    document.getElementById('btn-flash-reveal').addEventListener('click', function () {
      flashState.revealed = !flashState.revealed;
      renderFlashcard();
    });
    document.getElementById('btn-flash-prev').addEventListener('click', function () {
      flashState.index = Math.max(0, flashState.index - 1);
      flashState.revealed = false;
      saveFlashProgress();
      renderFlashcard();
    });
    document.getElementById('btn-flash-next').addEventListener('click', function () {
      flashState.index = Math.min(flashState.order.length - 1, flashState.index + 1);
      flashState.revealed = false;
      saveFlashProgress();
      renderFlashcard();
    });
    document.getElementById('btn-flash-shuffle').addEventListener('click', function () {
      var order = flashState.order.slice();
      for (var i = order.length - 1; i > 0; i -= 1) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = order[i];
        order[i] = order[j];
        order[j] = tmp;
      }
      flashState.order = order;
      flashState.index = 0;
      flashState.revealed = false;
      saveFlashProgress();
      renderFlashcard();
      setStatusMessage('flashcard-status', 'Flashcards shuffled.', 'info');
    });
    document.getElementById('btn-flash-understood').addEventListener('click', function () {
      var term = currentFlashTerm();
      if (!term) return;
      flashState.understood[term.id] = true;
      flashState.review[term.id] = false;
      saveFlashProgress();
      renderFlashcard();
      setStatusMessage('flashcard-status', term.term + ' marked as understood.', 'success');
    });
    document.getElementById('btn-flash-review').addEventListener('click', function () {
      var term = currentFlashTerm();
      if (!term) return;
      flashState.review[term.id] = true;
      flashState.understood[term.id] = false;
      saveFlashProgress();
      renderFlashcard();
      setStatusMessage('flashcard-status', term.term + ' marked for review.', 'warning');
    });
    document.getElementById('btn-flash-reset').addEventListener('click', function () {
      if (!window.confirm('Reset flashcard progress for this session?')) return;
      flashState.understood = {};
      flashState.review = {};
      flashState.order = sortedTerms().map(function (term) { return term.id; });
      flashState.index = 0;
      flashState.revealed = false;
      try { sessionStorage.removeItem(FLASH_STORAGE_KEY); } catch (err) { /* ignore */ }
      renderFlashcard();
      setStatusMessage('flashcard-status', 'Flashcard progress reset.', 'info');
    });

    document.getElementById('flashcard-stage').addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        flashState.revealed = !flashState.revealed;
        renderFlashcard();
      }
    });
  }

  function answeredCount() {
    return QUIZ_QUESTIONS.filter(function (q) {
      return quizState.answers[q.id] !== undefined && quizState.answers[q.id] !== null && quizState.answers[q.id] !== '';
    }).length;
  }

  function unansweredIds() {
    return QUIZ_QUESTIONS.filter(function (q) {
      return quizState.answers[q.id] === undefined || quizState.answers[q.id] === null || quizState.answers[q.id] === '';
    }).map(function (q) { return q.id; });
  }

  function refreshQuizProgress() {
    var completed = answeredCount();
    document.getElementById('quiz-progress').textContent = completed + ' of ' + TOTAL_QUESTIONS + ' answered';
    document.getElementById('btn-check-quiz').disabled = completed < TOTAL_QUESTIONS || quizState.checked;
  }

  function renderQuiz() {
    var host = document.getElementById('quiz-container');
    host.textContent = '';
    QUIZ_QUESTIONS.forEach(function (question) {
      var fieldset = el('fieldset', {
        className: 'quiz-question',
        id: 'question-' + question.id
      });
      fieldset.appendChild(
        el('legend', {
          textContent: 'Question ' + question.id + ': ' + question.prompt
        })
      );
      var list = el('div', {
        className: 'choice-list',
        role: 'radiogroup',
        'aria-label': 'Answers for question ' + question.id
      });
      question.options.forEach(function (option, index) {
        var inputId = 'q' + question.id + '-opt' + index;
        var input = el('input', {
          type: 'radio',
          name: 'question-' + question.id,
          id: inputId,
          value: String(index)
        });
        if (String(quizState.answers[question.id]) === String(index)) {
          input.checked = true;
        }
        if (quizState.checked) {
          input.disabled = true;
        }
        input.addEventListener('change', function () {
          if (quizState.checked) return;
          if (!quizState.startTime) quizState.startTime = Date.now();
          quizState.answers[question.id] = index;
          refreshQuizProgress();
        });
        list.appendChild(
          el('div', { className: 'choice' }, [
            input,
            el('label', { htmlFor: inputId, textContent: option })
          ])
        );
      });
      fieldset.appendChild(list);

      if (quizState.checked) {
        var correct = Number(quizState.answers[question.id]) === question.correctIndex;
        fieldset.appendChild(
          el('div', {
            className: 'quiz-explanation ' + (correct ? 'correct' : 'incorrect'),
            role: 'region',
            'aria-label': 'Feedback for question ' + question.id
          }, [
            el('p', { textContent: correct ? 'Result: Correct' : 'Result: Requires review' }),
            el('p', { textContent: 'Correct answer: ' + question.options[question.correctIndex] }),
            el('p', { textContent: 'Explanation: ' + question.explanation })
          ])
        );
      }

      host.appendChild(fieldset);
    });
    refreshQuizProgress();
  }

  function populateHardestOptions() {
    var select = document.getElementById('hardest-card');
    var previous = select.value;
    select.textContent = '';
    select.appendChild(el('option', { value: '', textContent: 'Select a question' }));
    for (var i = 1; i <= TOTAL_QUESTIONS; i += 1) {
      select.appendChild(el('option', { value: String(i), textContent: 'Question ' + i }));
    }
    if (previous) select.value = previous;
  }

  function showResults(result) {
    var resultsPanel = document.getElementById('results-panel');
    var submissionPanel = document.getElementById('submission-panel');
    resultsPanel.hidden = false;
    submissionPanel.hidden = false;

    var summary = document.getElementById('score-summary');
    summary.textContent = '';
    summary.appendChild(el('p', {
      textContent: 'Overall result: ' + result.score + ' / ' + TOTAL_QUESTIONS + ' (' + result.percentage + '%)'
    }));
    summary.appendChild(el('p', {
      textContent: 'Completion time: ' + result.completionTime + ' seconds'
    }));
    summary.appendChild(el('p', {
      textContent: result.incorrectQuestions.length
        ? 'Questions requiring review: ' + result.incorrectQuestions.join(', ')
        : 'No questions require review.'
    }));

    document.getElementById('result-score').textContent = result.score + ' / ' + TOTAL_QUESTIONS;
    document.getElementById('result-percentage').textContent = result.percentage + '%';
    document.getElementById('result-incorrect').textContent = result.incorrectQuestions.length
      ? result.incorrectQuestions.join(', ')
      : 'None';

    populateHardestOptions();
  }

  function checkQuiz() {
    var unanswered = unansweredIds();
    if (unanswered.length) {
      setStatusMessage(
        'quiz-status',
        'Complete all questions before checking answers. Still unanswered: ' + unanswered.join(', '),
        'error'
      );
      document.getElementById('question-' + unanswered[0]).scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    var score = 0;
    var incorrect = [];
    QUIZ_QUESTIONS.forEach(function (question) {
      if (Number(quizState.answers[question.id]) === question.correctIndex) {
        score += 1;
      } else {
        incorrect.push(question.id);
      }
    });

    quizState.checked = true;
    quizState.score = score;
    quizState.incorrectQuestions = incorrect;
    quizState.completionTime = Math.max(
      1,
      Math.round((Date.now() - (quizState.startTime || Date.now())) / 1000)
    );

    document.getElementById('btn-check-quiz').disabled = true;
    document.getElementById('btn-new-attempt').hidden = false;
    renderQuiz();
    showResults({
      score: score,
      percentage: Math.round((score / TOTAL_QUESTIONS) * 100),
      incorrectQuestions: incorrect,
      completionTime: quizState.completionTime
    });

    setStatusMessage(
      'quiz-status',
      'Checked: ' + score + ' of ' + TOTAL_QUESTIONS + ' correct (' +
        Math.round((score / TOTAL_QUESTIONS) * 100) + '%).',
      incorrect.length ? 'warning' : 'success'
    );

    document.getElementById('results-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('hardest-card').focus();
  }

  function startNewAttempt() {
    if (!window.confirm('Start a new attempt? This clears quiz answers, score, reflection and the glossary Attempt ID.')) {
      return;
    }
    if (utils.clearAttemptId) {
      utils.clearAttemptId(ATTEMPT_STORAGE_KEY);
    } else {
      try { sessionStorage.removeItem(ATTEMPT_STORAGE_KEY); } catch (err) { /* ignore */ }
    }

    quizState.answers = {};
    quizState.checked = false;
    quizState.score = 0;
    quizState.incorrectQuestions = [];
    quizState.startTime = Date.now();
    quizState.completionTime = null;

    document.getElementById('results-panel').hidden = true;
    document.getElementById('submission-panel').hidden = true;
    document.getElementById('btn-new-attempt').hidden = true;
    document.getElementById('btn-submit').disabled = false;
    document.getElementById('btn-retry').hidden = true;
    document.getElementById('hardest-card').value = '';
    document.getElementById('justification').value = '';
    updateJustificationCount();
    setStatusMessage('submission-messages', '', 'info');
    renderQuiz();
    setStatusMessage('quiz-status', 'New attempt started. A new Attempt ID will be created when you submit.', 'info');
  }

  function getLearnerDetails() {
    return {
      classGroup: (document.getElementById('class-group').value || '').trim(),
      pairCode: (document.getElementById('pair-code').value || '').trim(),
      learner1: (document.getElementById('learner-1').value || '').trim(),
      learner2: (document.getElementById('learner-2').value || '').trim()
    };
  }

  function updateJustificationCount() {
    var textarea = document.getElementById('justification');
    var counter = document.getElementById('justification-count');
    counter.textContent = textarea.value.length + ' / 1000 characters';
  }

  function validateSubmission() {
    var details = getLearnerDetails();
    var hardest = document.getElementById('hardest-card');
    var justification = (document.getElementById('justification').value || '').trim();
    var errors = [];

    if (!details.classGroup) errors.push('Class or group is required.');
    if (!details.pairCode) errors.push('Learner or pair code is required.');
    if (!quizState.checked) errors.push('Check your answers before submitting results.');
    if (quizState.score < 0 || quizState.score > TOTAL_QUESTIONS) {
      errors.push('Score must be between 0 and 12.');
    }
    var hardestValue = hardest.value ? Number(hardest.value) : NaN;
    if (Number.isNaN(hardestValue) || hardestValue < 1 || hardestValue > TOTAL_QUESTIONS) {
      errors.push('Choose the hardest question (1 to 12).');
    }
    if (!justification) errors.push('A written reflection is required.');
    else if (justification.length > 1000) errors.push('Reflection must be no longer than 1,000 characters.');

    var collector = submissions.COLLECTOR_URL;
    if (!submissions.isConfigured || !submissions.isConfigured(collector)) {
      errors.push('Submission is not configured yet. Ask your teacher to check the collector URL.');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      details: details,
      hardestCard: hardestValue,
      justification: justification
    };
  }

  function buildPayload(validation) {
    var attemptId = utils.getOrCreateAttemptId
      ? utils.getOrCreateAttemptId(ATTEMPT_STORAGE_KEY)
      : String(Date.now());
    return {
      attemptId: attemptId,
      classGroup: validation.details.classGroup,
      pairCode: validation.details.pairCode,
      learner1: validation.details.learner1,
      learner2: validation.details.learner2,
      score: String(quizState.score),
      totalCards: String(TOTAL_QUESTIONS),
      incorrectCards: quizState.incorrectQuestions.length
        ? quizState.incorrectQuestions.join(',')
        : 'None',
      hardestCard: String(validation.hardestCard),
      justification: validation.justification,
      completionTime: String(quizState.completionTime || 0),
      activityVersion: ACTIVITY_VERSION,
      sourcePage: window.location.href
    };
  }

  function handleSubmit() {
    var validation = validateSubmission();
    if (!validation.valid) {
      setStatusMessage('submission-messages', validation.errors.join(' '), 'error');
      var focusId = !validation.details.classGroup
        ? 'class-group'
        : !validation.details.pairCode
          ? 'pair-code'
          : !document.getElementById('hardest-card').value
            ? 'hardest-card'
            : 'justification';
      document.getElementById(focusId).focus();
      return;
    }
    var payload = buildPayload(validation);
    var ok = submissions.submitViaForm
      ? submissions.submitViaForm(payload)
      : false;
    if (!ok) {
      setStatusMessage('submission-messages', 'Submission could not be started. Check the collector URL.', 'error');
      return;
    }
    document.getElementById('btn-submit').disabled = true;
    document.getElementById('btn-retry').hidden = false;
    setStatusMessage(
      'submission-messages',
      'A confirmation tab has opened. Check that your result was accepted. Opening a tab does not by itself prove the result was saved.',
      'info'
    );
  }

  function handleRetry() {
    var validation = validateSubmission();
    if (!validation.valid) {
      setStatusMessage('submission-messages', validation.errors.join(' '), 'error');
      return;
    }
    var payload = buildPayload(validation);
    var ok = submissions.submitViaForm ? submissions.submitViaForm(payload) : false;
    if (!ok) {
      setStatusMessage('submission-messages', 'Retry could not be started. Check the collector URL.', 'error');
      return;
    }
    setStatusMessage(
      'submission-messages',
      'A confirmation tab has opened. Check that your result was accepted. The same Attempt ID was reused for this retry.',
      'info'
    );
  }

  function bindQuiz() {
    renderQuiz();
    populateHardestOptions();
    document.getElementById('btn-review-unanswered').addEventListener('click', function () {
      var unanswered = unansweredIds();
      if (!unanswered.length) {
        setStatusMessage('quiz-status', 'All questions are answered. You can check your answers.', 'success');
        return;
      }
      setStatusMessage(
        'quiz-status',
        'Unanswered questions: ' + unanswered.join(', ') + '. Showing question ' + unanswered[0] + '.',
        'warning'
      );
      var target = document.getElementById('question-' + unanswered[0]);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var control = target.querySelector('input');
        if (control) control.focus();
      }
    });
    document.getElementById('btn-check-quiz').addEventListener('click', checkQuiz);
    document.getElementById('btn-new-attempt').addEventListener('click', startNewAttempt);
    document.getElementById('justification').addEventListener('input', updateJustificationCount);
    document.getElementById('btn-submit').addEventListener('click', handleSubmit);
    document.getElementById('btn-retry').addEventListener('click', handleRetry);
    updateJustificationCount();
  }

  ready(function () {
    ensureHelpers();
    if (!getTerms().length) {
      setStatusMessage('glossary-status', 'Glossary terms failed to load. Check that terms.js is available.', 'error');
      return;
    }
    bindModeTabs();
    buildCategoryFilters();
    bindGlossaryControls();
    renderGlossaryList();
    bindFlashcards();
    bindQuiz();
    setMode('glossary');
  });
})();
