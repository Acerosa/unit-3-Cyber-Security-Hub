/**
 * Northbank Cyber Incident Classification
 *
 * Scenario data is loaded from js/scenarios.js (SCENARIOS array).
 *
 * Security notes for teachers and maintainers:
 * - Browser validation improves usability only.
 * - The Apps Script validates all values again on the server side.
 * - A public static site cannot securely authenticate learners.
 * - This activity is for formative evidence, not high-stakes assessment.
 * - Never store API keys, passwords, spreadsheet IDs or private sheet links here.
 * - Learner text must never be inserted with innerHTML; use textContent or safe DOM APIs.
 */

/** Paste the full Google Apps Script web app URL ending in /exec */
const COLLECTOR_URL = 'https://script.google.com/macros/s/AKfycbz3y931cm-BEu_t_fAo8Eit3tzxxMD_dj4mKIFbjo5U_ySu2jfsUn0Lzp0fS3HRsoyE/exec';

const TOTAL_CARDS = 12;
const ACTIVITY_VERSION = '1.0';
const ATTEMPT_STORAGE_KEY = 'northbank-card-sort-attempt-id';

const CIA_OPTIONS = ['Confidentiality', 'Integrity', 'Availability'];

const STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CORRECT: 'correct',
  REVIEW: 'review'
};

const STATUS_LABELS = {
  'not-started': { text: 'Not started', icon: '○' },
  'in-progress': { text: 'In progress', icon: '◐' },
  completed: { text: 'Completed', icon: '●' },
  correct: { text: 'Correct', icon: '✓' },
  review: { text: 'Requires review', icon: '!' }
};

/** @type {{ answers: Record<number, { incidentType: string, cia: string[], evidence: string }>, checked: boolean, score: number, incorrectCards: number[], startTime: number, completionTime: number|null }} */
const state = {
  answers: {},
  checked: false,
  score: 0,
  incorrectCards: [],
  startTime: Date.now(),
  completionTime: null,
  currentIndex: 0
};

function el(tag, attrs, children) {
  const node = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(function (key) {
      const value = attrs[key];
      if (key === 'className') {
        node.className = value;
      } else if (key === 'textContent') {
        node.textContent = value;
      } else if (key === 'htmlFor') {
        node.htmlFor = value;
      } else if (value !== null && value !== undefined && value !== false) {
        node.setAttribute(key, value === true ? '' : String(value));
      }
    });
  }
  if (children) {
    children.forEach(function (child) {
      if (child === null || child === undefined) {
        return;
      }
      if (typeof child === 'string') {
        node.appendChild(document.createTextNode(child));
      } else {
        node.appendChild(child);
      }
    });
  }
  return node;
}

function getScenario(id) {
  return SCENARIOS.find(function (s) {
    return s.id === id;
  });
}

function ensureAnswer(id) {
  if (!state.answers[id]) {
    state.answers[id] = {
      incidentType: '',
      cia: [],
      evidence: ''
    };
  }
  return state.answers[id];
}

function isCardComplete(id) {
  const answer = ensureAnswer(id);
  return Boolean(
    answer.incidentType &&
      answer.cia.length > 0 &&
      answer.evidence.trim().length > 0
  );
}

function isCardStarted(id) {
  const answer = ensureAnswer(id);
  return Boolean(
    answer.incidentType ||
      answer.cia.length > 0 ||
      answer.evidence.trim().length > 0
  );
}

function getCardStatus(id) {
  if (state.checked && isCardComplete(id)) {
    return state.incorrectCards.indexOf(id) === -1 ? STATUS.CORRECT : STATUS.REVIEW;
  }
  if (isCardComplete(id)) {
    return STATUS.COMPLETED;
  }
  if (isCardStarted(id)) {
    return STATUS.IN_PROGRESS;
  }
  return STATUS.NOT_STARTED;
}

function createStatusBadge(status) {
  const meta = STATUS_LABELS[status];
  return el('span', {
    className: 'status-badge status-' + status,
    role: 'status'
  }, [
    el('span', { className: 'status-icon', 'aria-hidden': 'true', textContent: meta.icon }),
    el('span', { className: 'status-text', textContent: meta.text })
  ]);
}

function updateCardStatusBadge(cardId) {
  const badgeHost = document.getElementById('status-badge-' + cardId);
  if (!badgeHost) {
    return;
  }
  badgeHost.textContent = '';
  badgeHost.appendChild(createStatusBadge(getCardStatus(cardId)));
}

function buildCard(scenario) {
  const answer = ensureAnswer(scenario.id);
  const card = el('article', {
    className: 'incident-card',
    id: 'card-' + scenario.id,
    'data-card-id': String(scenario.id),
    'aria-labelledby': 'card-title-' + scenario.id
  });

  const header = el('div', { className: 'card-header' }, [
    el('h3', {
      className: 'card-title',
      id: 'card-title-' + scenario.id,
      tabindex: '-1',
      textContent: 'Card ' + scenario.id + ': ' + scenario.title
    }),
    el('div', { id: 'status-badge-' + scenario.id, className: 'status-badge-host' })
  ]);

  const meta = el('p', {
    className: 'card-meta',
    textContent: 'Organisation: ' + scenario.organisation
  });

  const scenarioBlock = el('div', { className: 'card-scenario' }, [
    el('p', { textContent: scenario.scenario })
  ]);

  const incidentFieldset = el('fieldset', { className: 'fieldset' });
  incidentFieldset.appendChild(
    el('legend', { textContent: 'Incident type' })
  );
  const radioGroup = el('div', {
    className: 'radio-group',
    role: 'radiogroup',
    'aria-label': 'Incident type for card ' + scenario.id
  });

  scenario.incidentOptions.forEach(function (option, index) {
    const inputId = 'incident-' + scenario.id + '-' + index;
    const input = el('input', {
      type: 'radio',
      name: 'incident-' + scenario.id,
      id: inputId,
      value: option
    });
    if (answer.incidentType === option) {
      input.checked = true;
    }
    input.addEventListener('change', function () {
      ensureAnswer(scenario.id).incidentType = option;
      updateCardStatusBadge(scenario.id);
      refreshProgress();
    });
    radioGroup.appendChild(
      el('div', { className: 'choice' }, [
        input,
        el('label', { htmlFor: inputId, textContent: option })
      ])
    );
  });
  incidentFieldset.appendChild(radioGroup);

  const ciaFieldset = el('fieldset', { className: 'fieldset' });
  ciaFieldset.appendChild(el('legend', { textContent: 'CIA security aim(s) affected' }));
  const checkboxGroup = el('div', {
    className: 'checkbox-group',
    role: 'group',
    'aria-label': 'CIA aims for card ' + scenario.id
  });

  CIA_OPTIONS.forEach(function (option, index) {
    const inputId = 'cia-' + scenario.id + '-' + index;
    const input = el('input', {
      type: 'checkbox',
      name: 'cia-' + scenario.id,
      id: inputId,
      value: option
    });
    if (answer.cia.indexOf(option) !== -1) {
      input.checked = true;
    }
    input.addEventListener('change', function () {
      const current = ensureAnswer(scenario.id);
      if (input.checked) {
        if (current.cia.indexOf(option) === -1) {
          current.cia.push(option);
        }
      } else {
        current.cia = current.cia.filter(function (item) {
          return item !== option;
        });
      }
      updateCardStatusBadge(scenario.id);
      refreshProgress();
    });
    checkboxGroup.appendChild(
      el('div', { className: 'choice' }, [
        input,
        el('label', { htmlFor: inputId, textContent: option })
      ])
    );
  });
  ciaFieldset.appendChild(checkboxGroup);

  const evidenceId = 'evidence-' + scenario.id;
  const evidenceField = el('div', { className: 'field' }, [
    el('label', {
      htmlFor: evidenceId,
      textContent: 'Evidence / justification'
    }),
    el('textarea', {
      id: evidenceId,
      name: 'evidence-' + scenario.id,
      rows: '4',
      maxlength: '1000',
      'aria-describedby': 'evidence-hint-' + scenario.id
    }),
    el('p', {
      id: 'evidence-hint-' + scenario.id,
      className: 'panel-note',
      textContent: 'Select evidence from the scenario and briefly justify your classification.'
    })
  ]);

  const textarea = evidenceField.querySelector('textarea');
  textarea.value = answer.evidence;
  textarea.addEventListener('input', function () {
    ensureAnswer(scenario.id).evidence = textarea.value;
    updateCardStatusBadge(scenario.id);
    refreshProgress();
  });

  const feedbackHost = el('div', {
    id: 'feedback-' + scenario.id,
    className: 'card-feedback',
    hidden: true
  });

  card.appendChild(header);
  card.appendChild(meta);
  card.appendChild(scenarioBlock);
  card.appendChild(incidentFieldset);
  card.appendChild(ciaFieldset);
  card.appendChild(evidenceField);
  card.appendChild(feedbackHost);

  return card;
}

function refreshProgress() {
  const completed = SCENARIOS.filter(function (s) {
    return isCardComplete(s.id);
  }).length;

  const progressText = document.getElementById('progress-text');
  const progressFill = document.getElementById('progress-fill');
  const progressBar = document.querySelector('.progress-bar');
  const checkBtn = document.getElementById('btn-check');

  if (progressText) {
    progressText.textContent = completed + ' of ' + TOTAL_CARDS + ' completed';
  }
  if (progressFill) {
    progressFill.style.width = (completed / TOTAL_CARDS) * 100 + '%';
  }
  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', String(completed));
  }
  if (checkBtn) {
    checkBtn.disabled = completed < TOTAL_CARDS || state.checked;
  }

  SCENARIOS.forEach(function (scenario) {
    updateCardStatusBadge(scenario.id);
  });
  refreshCardNavLabels();
}

function renderCards() {
  const container = document.getElementById('cards-container');
  if (!container) {
    return;
  }
  container.textContent = '';

  if (typeof SCENARIOS === 'undefined' || !Array.isArray(SCENARIOS) || SCENARIOS.length === 0) {
    const p = el('p', {
      className: 'message message-error',
      textContent: 'Scenario data failed to load. Check that js/scenarios.js is available.'
    });
    container.appendChild(p);
    return;
  }

  SCENARIOS.forEach(function (scenario) {
    container.appendChild(buildCard(scenario));
  });

  refreshProgress();
}

function setStatusMessage(containerId, message, type) {
  const host = document.getElementById(containerId);
  if (!host) {
    return;
  }
  host.textContent = '';
  if (!message) {
    return;
  }
  host.appendChild(
    el('p', {
      className: 'message message-' + (type || 'info'),
      textContent: message
    })
  );
}

function getUnansweredIds() {
  return SCENARIOS.filter(function (s) {
    return !isCardComplete(s.id);
  }).map(function (s) {
    return s.id;
  });
}

function announceCardChange(scenario) {
  const status = getCardStatus(scenario.id);
  const label = STATUS_LABELS[status].text;
  setStatusMessage(
    'status-messages',
    'Showing card ' +
      scenario.id +
      ' of ' +
      TOTAL_CARDS +
      ': ' +
      scenario.title +
      '. Status: ' +
      label +
      '.',
    'info'
  );
}

function showCard(index, options) {
  if (!SCENARIOS.length) {
    return;
  }
  const opts = options || {};
  const clamped = Math.max(0, Math.min(index, SCENARIOS.length - 1));
  state.currentIndex = clamped;
  const scenario = SCENARIOS[clamped];

  SCENARIOS.forEach(function (item, i) {
    const card = document.getElementById('card-' + item.id);
    if (!card) {
      return;
    }
    if (i === clamped) {
      card.removeAttribute('hidden');
      card.setAttribute('aria-hidden', 'false');
    } else {
      card.setAttribute('hidden', '');
      card.setAttribute('aria-hidden', 'true');
    }
  });

  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  if (prevBtn) {
    prevBtn.disabled = clamped === 0;
    prevBtn.setAttribute(
      'aria-label',
      clamped === 0 ? 'Previous card (unavailable)' : 'Previous card'
    );
  }
  if (nextBtn) {
    nextBtn.disabled = clamped === SCENARIOS.length - 1;
    nextBtn.setAttribute(
      'aria-label',
      clamped === SCENARIOS.length - 1
        ? 'Next card (unavailable)'
        : 'Next card'
    );
  }

  refreshCardNavLabels();

  const navButtons = document.querySelectorAll('.card-num-btn');
  navButtons.forEach(function (btn) {
    const btnIndex = Number(btn.getAttribute('data-index'));
    if (btnIndex === clamped) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  });

  if (opts.announce !== false && scenario) {
    announceCardChange(scenario);
  }
}

function refreshCardNavLabels() {
  const navButtons = document.querySelectorAll('.card-num-btn');
  navButtons.forEach(function (btn) {
    const id = Number(btn.getAttribute('data-card-id'));
    const status = getCardStatus(id);
    const label = STATUS_LABELS[status].text;
    btn.setAttribute(
      'aria-label',
      'Go to card ' + id + ', status: ' + label
    );
    btn.dataset.status = status;
  });
}

function buildCardNumberNav() {
  const host = document.getElementById('card-number-nav');
  if (!host) {
    return;
  }
  host.textContent = '';
  SCENARIOS.forEach(function (scenario, index) {
    const btn = el('button', {
      type: 'button',
      className: 'card-num-btn',
      'data-index': String(index),
      'data-card-id': String(scenario.id),
      'aria-label': 'Go to card ' + scenario.id
    });
    btn.textContent = String(scenario.id);
    btn.addEventListener('click', function () {
      showCard(index);
      const title = document.getElementById('card-title-' + scenario.id);
      if (title) {
        title.focus();
      }
    });
    host.appendChild(btn);
  });
  refreshCardNavLabels();
}

function reviewUnanswered() {
  const unanswered = getUnansweredIds();
  if (unanswered.length === 0) {
    setStatusMessage(
      'status-messages',
      'All cards are complete. You can check your answers.',
      'success'
    );
    return;
  }

  const firstId = unanswered[0];
  const index = SCENARIOS.findIndex(function (s) {
    return s.id === firstId;
  });
  showCard(index);
  setStatusMessage(
    'status-messages',
    'Unanswered cards: ' + unanswered.join(', ') + '. Showing card ' + firstId + '.',
    'warning'
  );
  const card = document.getElementById('card-' + firstId);
  if (card) {
    const firstControl = card.querySelector('input, textarea, button');
    if (firstControl) {
      firstControl.focus();
    }
  }
}

function resetActivity() {
  const confirmed = window.confirm(
    'Reset the activity? This will clear all card answers for this session. Learner detail fields will not be cleared.'
  );
  if (!confirmed) {
    return;
  }

  state.answers = {};
  state.checked = false;
  state.score = 0;
  state.incorrectCards = [];
  state.completionTime = null;
  state.startTime = Date.now();
  state.currentIndex = 0;

  try {
    sessionStorage.removeItem(ATTEMPT_STORAGE_KEY);
  } catch (err) {
    /* sessionStorage may be unavailable */
  }

  renderCards();
  buildCardNumberNav();
  showCard(0);

  const resultsPanel = document.getElementById('results-panel');
  const submissionPanel = document.getElementById('submission-panel');
  const hardest = document.getElementById('hardest-card');
  const justification = document.getElementById('justification');
  const submitBtn = document.getElementById('btn-submit');
  const retryBtn = document.getElementById('btn-retry');
  if (resultsPanel) {
    resultsPanel.hidden = true;
  }
  if (submissionPanel) {
    submissionPanel.hidden = true;
  }
  if (hardest) {
    hardest.value = '';
  }
  if (justification) {
    justification.value = '';
    updateJustificationCount();
  }
  if (submitBtn) {
    submitBtn.disabled = false;
  }
  if (retryBtn) {
    retryBtn.hidden = true;
  }
  setStatusMessage('submission-messages', '', 'info');

  setStatusMessage(
    'status-messages',
    'Activity reset. A new attempt will start when you submit results.',
    'info'
  );
}

function arraysEqualAsSets(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  const sortedA = a.slice().sort();
  const sortedB = b.slice().sort();
  return sortedA.every(function (item, index) {
    return item === sortedB[index];
  });
}

function isCardCorrect(scenario) {
  const answer = ensureAnswer(scenario.id);
  if (answer.incidentType !== scenario.correctIncidentType) {
    return false;
  }
  return arraysEqualAsSets(answer.cia, scenario.correctCIA);
}

function calculateScore() {
  let score = 0;
  const incorrect = [];

  SCENARIOS.forEach(function (scenario) {
    if (isCardCorrect(scenario)) {
      score += 1;
    } else {
      incorrect.push(scenario.id);
    }
  });

  if (score > TOTAL_CARDS) {
    score = TOTAL_CARDS;
  }
  if (score < 0) {
    score = 0;
  }

  state.score = score;
  state.incorrectCards = incorrect;
  state.completionTime = Math.max(
    1,
    Math.round((Date.now() - state.startTime) / 1000)
  );
  return {
    score: score,
    percentage: Math.round((score / TOTAL_CARDS) * 100),
    incorrectCards: incorrect,
    completionTime: state.completionTime
  };
}

function showCardFeedback(scenario) {
  const host = document.getElementById('feedback-' + scenario.id);
  if (!host) {
    return;
  }
  host.textContent = '';

  if (!state.checked || !isCardComplete(scenario.id)) {
    host.hidden = true;
    return;
  }

  const correct = isCardCorrect(scenario);
  const block = el('div', {
    className: 'feedback-block ' + (correct ? 'correct' : 'incorrect'),
    role: 'region',
    'aria-label': 'Feedback for card ' + scenario.id
  });

  block.appendChild(
    el('p', {
      textContent: correct
        ? 'Result: Correct'
        : 'Result: Requires review'
    })
  );
  block.appendChild(
    el('p', {
      textContent: 'Correct incident type: ' + scenario.correctIncidentType
    })
  );
  block.appendChild(
    el('p', {
      textContent: 'Correct CIA aim(s): ' + scenario.correctCIA.join(', ')
    })
  );

  const evidenceHeading = el('p', { textContent: 'Supporting evidence from the scenario:' });
  block.appendChild(evidenceHeading);
  const list = el('ul');
  scenario.evidencePoints.forEach(function (point) {
    list.appendChild(el('li', { textContent: point }));
  });
  block.appendChild(list);

  block.appendChild(
    el('p', { textContent: 'Explanation: ' + scenario.explanation })
  );

  host.appendChild(block);
  host.hidden = false;
}

function renderAllFeedback() {
  const reviewHost = document.getElementById('review-feedback');
  if (reviewHost) {
    reviewHost.textContent = '';
    if (state.checked) {
      reviewHost.appendChild(
        el('h3', { textContent: 'Card-by-card feedback' })
      );
      if (state.incorrectCards.length) {
        reviewHost.appendChild(
          el('p', {
            textContent:
              'Focus on cards requiring review: ' +
              state.incorrectCards.join(', ') +
              '.'
          })
        );
      } else {
        reviewHost.appendChild(
          el('p', {
            textContent: 'All classifications matched the expected answers.'
          })
        );
      }
    }
  }

  SCENARIOS.forEach(function (scenario) {
    showCardFeedback(scenario);
  });
}

function checkAnswers() {
  const unanswered = getUnansweredIds();
  if (unanswered.length > 0) {
    setStatusMessage(
      'status-messages',
      'Complete all cards before checking answers. Still unanswered: ' +
        unanswered.join(', '),
      'error'
    );
    reviewUnanswered();
    return;
  }

  state.checked = true;
  const result = calculateScore();
  refreshProgress();
  renderAllFeedback();

  const checkBtn = document.getElementById('btn-check');
  if (checkBtn) {
    checkBtn.disabled = true;
  }

  setStatusMessage(
    'status-messages',
    'Checked: ' +
      result.score +
      ' of ' +
      TOTAL_CARDS +
      ' correct (' +
      result.percentage +
      '%). Completion time: ' +
      result.completionTime +
      ' seconds.' +
      (result.incorrectCards.length
        ? ' Cards requiring review: ' + result.incorrectCards.join(', ') + '.'
        : ' All cards correct.'),
    result.incorrectCards.length ? 'warning' : 'success'
  );

  showScoreSummary(result);

  if (result.incorrectCards.length) {
    const firstIncorrect = result.incorrectCards[0];
    const index = SCENARIOS.findIndex(function (s) {
      return s.id === firstIncorrect;
    });
    showCard(index);
  }

  const resultsPanel = document.getElementById('results-panel');
  if (resultsPanel) {
    resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showScoreSummary(result) {
  const resultsPanel = document.getElementById('results-panel');
  const submissionPanel = document.getElementById('submission-panel');
  const scoreSummary = document.getElementById('score-summary');
  const resultScore = document.getElementById('result-score');
  const resultPercentage = document.getElementById('result-percentage');
  const resultIncorrect = document.getElementById('result-incorrect');

  if (resultsPanel) {
    resultsPanel.hidden = false;
  }
  if (submissionPanel) {
    submissionPanel.hidden = false;
  }
  if (scoreSummary) {
    scoreSummary.textContent = '';
    scoreSummary.appendChild(
      el('p', {
        textContent:
          'Overall result: ' +
          result.score +
          ' / ' +
          TOTAL_CARDS +
          ' (' +
          result.percentage +
          '%)'
      })
    );
    scoreSummary.appendChild(
      el('p', {
        textContent: 'Completion time: ' + result.completionTime + ' seconds'
      })
    );
    scoreSummary.appendChild(
      el('p', {
        textContent: result.incorrectCards.length
          ? 'Cards requiring review: ' + result.incorrectCards.join(', ')
          : 'No cards require review.'
      })
    );
  }
  if (resultScore) {
    resultScore.textContent = result.score + ' / ' + TOTAL_CARDS;
  }
  if (resultPercentage) {
    resultPercentage.textContent = result.percentage + '%';
  }
  if (resultIncorrect) {
    resultIncorrect.textContent = result.incorrectCards.length
      ? result.incorrectCards.join(', ')
      : 'None';
  }

  populateHardestCardOptions();
}

function populateHardestCardOptions() {
  const select = document.getElementById('hardest-card');
  if (!select) {
    return;
  }
  const previous = select.value;
  select.textContent = '';
  select.appendChild(el('option', { value: '', textContent: 'Select a card' }));
  for (let i = 1; i <= TOTAL_CARDS; i += 1) {
    select.appendChild(
      el('option', { value: String(i), textContent: 'Card ' + i })
    );
  }
  if (previous) {
    select.value = previous;
  }
}

function updateJustificationCount() {
  const textarea = document.getElementById('justification');
  const counter = document.getElementById('justification-count');
  if (!textarea || !counter) {
    return;
  }
  counter.textContent = textarea.value.length + ' / 1000 characters';
}

function getLearnerDetails() {
  const classGroupEl = document.getElementById('class-group');
  const pairCodeEl = document.getElementById('pair-code');
  const learner1El = document.getElementById('learner-1');
  const learner2El = document.getElementById('learner-2');
  return {
    classGroup: classGroupEl ? classGroupEl.value.trim() : '',
    pairCode: pairCodeEl ? pairCodeEl.value.trim() : '',
    learner1: learner1El ? learner1El.value.trim() : '',
    learner2: learner2El ? learner2El.value.trim() : ''
  };
}

/**
 * Browser validation improves usability only.
 * The Apps Script validates all values again.
 */
function validateReflectionAndDetails() {
  const details = getLearnerDetails();
  const hardest = document.getElementById('hardest-card');
  const justification = document.getElementById('justification');
  const errors = [];

  if (!details.classGroup) {
    errors.push('Class or group is required.');
  }
  if (!details.pairCode) {
    errors.push('Pair code is required.');
  }
  if (!state.checked) {
    errors.push('Check your answers before submitting results.');
  }
  if (state.score < 0 || state.score > TOTAL_CARDS) {
    errors.push('Score must be between 0 and 12.');
  }

  const hardestValue = hardest && hardest.value ? Number(hardest.value) : NaN;
  if (
    Number.isNaN(hardestValue) ||
    hardestValue < 1 ||
    hardestValue > TOTAL_CARDS
  ) {
    errors.push('Choose the hardest card (1 to 12).');
  }

  const justificationText = justification ? justification.value.trim() : '';
  if (!justificationText) {
    errors.push('A written justification is required.');
  } else if (justificationText.length > 1000) {
    errors.push('Justification must be no longer than 1,000 characters.');
  }

  return {
    valid: errors.length === 0,
    errors: errors,
    details: details,
    hardestCard: hardestValue,
    justification: justificationText
  };
}

function bindReflectionForm() {
  const justification = document.getElementById('justification');
  if (justification) {
    justification.addEventListener('input', updateJustificationCount);
    updateJustificationCount();
  }
  populateHardestCardOptions();
}

/**
 * Generate a unique Attempt ID.
 * Prefer crypto.randomUUID(); fall back to timestamp + random value.
 * Only the Attempt ID is stored in sessionStorage — never names, answers,
 * scores, pair codes or written justifications.
 */
function createAttemptId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return (
    'attempt-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 10)
  );
}

function getOrCreateAttemptId() {
  try {
    const existing = sessionStorage.getItem(ATTEMPT_STORAGE_KEY);
    if (existing) {
      return existing;
    }
    const created = createAttemptId();
    sessionStorage.setItem(ATTEMPT_STORAGE_KEY, created);
    return created;
  } catch (err) {
    return createAttemptId();
  }
}

function clearAttemptId() {
  try {
    sessionStorage.removeItem(ATTEMPT_STORAGE_KEY);
  } catch (err) {
    /* sessionStorage may be unavailable */
  }
}

function buildSubmissionPayload(validation) {
  const percentage = Math.round((state.score / TOTAL_CARDS) * 100);
  return {
    attemptId: getOrCreateAttemptId(),
    classGroup: validation.details.classGroup,
    pairCode: validation.details.pairCode,
    learner1: validation.details.learner1,
    learner2: validation.details.learner2,
    score: String(state.score),
    totalCards: String(TOTAL_CARDS),
    incorrectCards: state.incorrectCards.length
      ? state.incorrectCards.join(',')
      : 'None',
    hardestCard: String(validation.hardestCard),
    justification: validation.justification,
    completionTime: String(state.completionTime || 0),
    activityVersion: ACTIVITY_VERSION,
    sourcePage: window.location.href
  };
}

/**
 * Submit via a dynamically created HTML form (POST, target=_blank).
 * Do not use JSON fetch as the main submission method.
 * A public static site cannot securely authenticate learners.
 */
function submitResultsViaForm(payload) {
  if (
    !COLLECTOR_URL ||
    COLLECTOR_URL.indexOf('PASTE_THE_FULL_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE') !== -1
  ) {
    setStatusMessage(
      'submission-messages',
      'Submission is not configured yet. Ask your teacher to paste the Google Apps Script /exec URL into js/app.js (COLLECTOR_URL).',
      'error'
    );
    return false;
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = COLLECTOR_URL;
  form.target = '_blank';
  form.acceptCharset = 'UTF-8';
  form.style.display = 'none';

  Object.keys(payload).forEach(function (name) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = payload[name];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
  return true;
}

function markSubmissionAttempted() {
  const submitBtn = document.getElementById('btn-submit');
  const retryBtn = document.getElementById('btn-retry');
  if (submitBtn) {
    submitBtn.disabled = true;
  }
  if (retryBtn) {
    retryBtn.hidden = false;
  }
  setStatusMessage(
    'submission-messages',
    'A confirmation tab has opened. Check that your result was accepted.',
    'info'
  );
}

function handleSubmitResults() {
  const validation = validateReflectionAndDetails();
  if (!validation.valid) {
    setStatusMessage(
      'submission-messages',
      validation.errors.join(' '),
      'error'
    );
    const firstInvalid =
      document.getElementById('class-group') &&
      !document.getElementById('class-group').value.trim()
        ? document.getElementById('class-group')
        : document.getElementById('pair-code') &&
            !document.getElementById('pair-code').value.trim()
          ? document.getElementById('pair-code')
          : document.getElementById('hardest-card') &&
              !document.getElementById('hardest-card').value
            ? document.getElementById('hardest-card')
            : document.getElementById('justification');
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }

  const payload = buildSubmissionPayload(validation);
  const submitted = submitResultsViaForm(payload);
  if (submitted) {
    markSubmissionAttempted();
  }
}

function handleRetrySubmission() {
  const validation = validateReflectionAndDetails();
  if (!validation.valid) {
    setStatusMessage(
      'submission-messages',
      validation.errors.join(' '),
      'error'
    );
    return;
  }
  const payload = buildSubmissionPayload(validation);
  const submitted = submitResultsViaForm(payload);
  if (submitted) {
    setStatusMessage(
      'submission-messages',
      'A confirmation tab has opened. Check that your result was accepted. The same Attempt ID was reused for this retry.',
      'info'
    );
  }
}

function bindSubmissionControls() {
  const submitBtn = document.getElementById('btn-submit');
  const retryBtn = document.getElementById('btn-retry');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmitResults);
  }
  if (retryBtn) {
    retryBtn.addEventListener('click', handleRetrySubmission);
  }
}

function isTypingTarget(target) {
  if (!target || !target.tagName) {
    return false;
  }
  const tag = target.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable
  );
}

function bindKeyboardNavigation() {
  document.addEventListener('keydown', function (event) {
    if (isTypingTarget(event.target)) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showCard(state.currentIndex - 1);
      const scenario = SCENARIOS[state.currentIndex];
      const title = scenario
        ? document.getElementById('card-title-' + scenario.id)
        : null;
      if (title) {
        title.focus();
      }
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showCard(state.currentIndex + 1);
      const scenario = SCENARIOS[state.currentIndex];
      const title = scenario
        ? document.getElementById('card-title-' + scenario.id)
        : null;
      if (title) {
        title.focus();
      }
    }
  });
}

function bindNavigation() {
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const reviewBtn = document.getElementById('btn-review-unanswered');
  const resetBtn = document.getElementById('btn-reset');
  const checkBtn = document.getElementById('btn-check');

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      showCard(state.currentIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      showCard(state.currentIndex + 1);
    });
  }
  if (reviewBtn) {
    reviewBtn.addEventListener('click', reviewUnanswered);
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', resetActivity);
  }
  if (checkBtn) {
    checkBtn.addEventListener('click', checkAnswers);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderCards();
  buildCardNumberNav();
  bindNavigation();
  bindReflectionForm();
  bindSubmissionControls();
  bindKeyboardNavigation();
  showCard(0, { announce: false });
  setStatusMessage(
    'status-messages',
    'Complete each card by selecting an incident type, CIA aim(s) and a short justification. Use Previous, Next, card numbers, or Left and Right arrow keys to move between cards.',
    'info'
  );
});
