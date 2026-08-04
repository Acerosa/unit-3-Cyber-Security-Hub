/**
 * CIA Triad Learning application logic.
 *
 * Correct answers live in content.js (public static data).
 * This is formative guided learning, not a secure assessment.
 */

(function () {
  'use strict';

  var utils = window.Unit3ActivityUtils || {};
  var submissions = window.Unit3Submissions || {};
  var learnerDetails = window.Unit3LearnerDetails || {};
  var courseContext = window.Unit3CourseContext || {};
  var el = utils.el;
  var setStatusMessage = utils.setStatusMessage;

  var ACTIVITY_ID = 'U3-W01-CIA';
  var ATTEMPT_KEY = 'unit3-w01-cia-attempt-id';
  var REFLECTION_MIN = 40;
  var REFLECTION_MAX = 500;
  var STAGE_ORDER = [
    'details',
    'learn',
    'guided',
    'definitions',
    'scenarios',
    'multi',
    'result'
  ];
  var STAGE_LABELS = {
    details: 'Your details',
    learn: 'Learn the model',
    guided: 'Guided examples',
    definitions: 'Definition check',
    scenarios: 'Northbank scenarios',
    multi: 'Combined impacts',
    result: 'Reflection and result'
  };

  var state = {
    stage: 'details',
    learner: null,
    activityMeta: null,
    started: false,
    startTime: null,
    completionTime: null,
    definitionOrder: {},
    answers: {
      definitions: {},
      scenarios: {},
      multi: {}
    },
    sectionChecked: {
      definitions: false,
      scenarios: false,
      multi: false
    },
    sectionScores: {
      definitions: 0,
      scenarios: 0,
      multi: 0
    },
    itemScores: {},
    questionsForReview: [],
    score: 0,
    guidedRevealed: {},
    submitting: false,
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
          node.appendChild(
            typeof child === 'string' ? document.createTextNode(child) : child
          );
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
          el('p', {
            className: 'message message-' + (type || 'info'),
            textContent: message
          })
        );
      };
    }
  }

  function content() {
    return typeof CIA_TRIAD_CONTENT !== 'undefined' ? CIA_TRIAD_CONTENT : null;
  }

  function activityMeta() {
    if (state.activityMeta) return state.activityMeta;
    state.activityMeta = courseContext.getActivity
      ? courseContext.getActivity(ACTIVITY_ID)
      : null;
    return state.activityMeta;
  }

  function maximumScore() {
    var meta = activityMeta();
    return meta && meta.maximumScore ? meta.maximumScore : 15;
  }

  function shuffle(array) {
    var copy = array.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function updateProgress() {
    var index = STAGE_ORDER.indexOf(state.stage);
    var text = document.getElementById('progress-text');
    if (text) {
      text.textContent =
        'Stage ' +
        (index + 1) +
        ' of ' +
        STAGE_ORDER.length +
        ': ' +
        STAGE_LABELS[state.stage];
    }
    document.querySelectorAll('.cia-progress-list li').forEach(function (item) {
      var stage = item.getAttribute('data-stage');
      var stageIndex = STAGE_ORDER.indexOf(stage);
      item.classList.toggle('is-current', stage === state.stage);
      item.classList.toggle('is-complete', stageIndex > -1 && stageIndex < index);
    });
  }

  function showStage(stage) {
    state.stage = stage;
    STAGE_ORDER.forEach(function (name) {
      var panel = document.getElementById('panel-' + name);
      if (panel) panel.hidden = name !== stage;
    });
    updateProgress();
    var heading = document.getElementById(stage + '-heading') ||
      document.querySelector('#panel-' + stage + ' h2');
    if (heading && typeof heading.focus === 'function') {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
    window.scrollTo(0, 0);
  }

  function markEvidence(text, evidence) {
    if (!evidence || text.indexOf(evidence) === -1) {
      return el('p', { textContent: text });
    }
    var p = el('p');
    var parts = text.split(evidence);
    p.appendChild(document.createTextNode(parts[0]));
    p.appendChild(el('mark', { className: 'evidence-mark', textContent: evidence }));
    p.appendChild(document.createTextNode(parts.slice(1).join(evidence)));
    return p;
  }

  function renderTriad() {
    var host = document.getElementById('cia-triad-host');
    var data = content();
    if (!host || !data) return;
    host.textContent = '';
    data.aims.forEach(function (aim) {
      var card = el('article', {
        className: 'cia-aim-card',
        role: 'listitem',
        'aria-labelledby': 'aim-' + aim.id
      });
      card.appendChild(el('h3', { id: 'aim-' + aim.id, textContent: aim.name }));
      card.appendChild(el('p', { textContent: aim.summary }));
      var dl = el('dl');
      dl.appendChild(el('dt', { textContent: 'Definition' }));
      dl.appendChild(el('dd', { textContent: aim.definition }));
      dl.appendChild(el('dt', { textContent: 'Northbank example' }));
      dl.appendChild(el('dd', { textContent: aim.northbankExample }));
      dl.appendChild(el('dt', { textContent: 'What could go wrong?' }));
      dl.appendChild(el('dd', { textContent: aim.whatCouldGoWrong }));
      card.appendChild(dl);
      host.appendChild(card);
    });
  }

  function allGuidedRevealed() {
    var data = content();
    if (!data) return false;
    return data.guidedExamples.every(function (example) {
      return state.guidedRevealed[example.id];
    });
  }

  function renderGuided() {
    var host = document.getElementById('guided-host');
    var data = content();
    if (!host || !data) return;
    host.textContent = '';

    data.guidedExamples.forEach(function (example, index) {
      var card = el('article', {
        className: 'guided-card',
        'aria-labelledby': 'guided-' + example.id
      });
      card.appendChild(
        el('h3', {
          id: 'guided-' + example.id,
          textContent: 'Guided example ' + (index + 1)
        })
      );
      card.appendChild(el('p', { textContent: example.scenario }));

      var predict = el('fieldset', { className: 'guided-predict' });
      predict.appendChild(
        el('legend', { textContent: 'Which CIA aim do you think is mainly affected?' })
      );
      var list = el('ul', { className: 'choice-list' });
      data.aimChoices.forEach(function (aim) {
        var inputId = example.id + '-' + aim.toLowerCase();
        var input = el('input', {
          type: 'radio',
          name: example.id + '-predict',
          id: inputId,
          value: aim
        });
        var label = el('label', { className: 'choice', htmlFor: inputId }, [
          input,
          el('span', { textContent: aim })
        ]);
        list.appendChild(el('li', null, [label]));
      });
      predict.appendChild(list);
      card.appendChild(predict);

      var revealBtn = el('button', {
        type: 'button',
        className: 'btn btn-secondary',
        textContent: state.guidedRevealed[example.id]
          ? 'Explanation shown'
          : 'Reveal explanation'
      });
      if (state.guidedRevealed[example.id]) {
        revealBtn.disabled = true;
      }
      revealBtn.addEventListener('click', function () {
        state.guidedRevealed[example.id] = true;
        renderGuided();
        document.getElementById('btn-to-definitions').disabled = !allGuidedRevealed();
        setStatusMessage(
          'start-status',
          '',
          'info'
        );
      });
      card.appendChild(revealBtn);

      if (state.guidedRevealed[example.id]) {
        var reveal = el('div', {
          className: 'guided-reveal',
          role: 'region',
          'aria-label': 'Explanation for guided example ' + (index + 1)
        });
        reveal.appendChild(
          el('p', { textContent: 'Main CIA aim: ' + example.aim })
        );
        reveal.appendChild(markEvidence(example.scenario, example.evidence));
        reveal.appendChild(el('p', { textContent: example.explanation }));
        reveal.appendChild(el('p', { textContent: example.whyOthers }));
        card.appendChild(reveal);
      }

      host.appendChild(card);
    });

    document.getElementById('btn-to-definitions').disabled = !allGuidedRevealed();
  }

  function optionOrdersForDefinitions() {
    var data = content();
    data.definitionQuestions.forEach(function (question) {
      if (!state.definitionOrder[question.number]) {
        state.definitionOrder[question.number] = shuffle(
          question.options.map(function (option) {
            return option.id;
          })
        );
      }
    });
  }

  function getDefinitionOption(question, optionId) {
    for (var i = 0; i < question.options.length; i += 1) {
      if (question.options[i].id === optionId) return question.options[i];
    }
    return null;
  }

  function renderDefinitions() {
    var form = document.getElementById('definitions-form');
    var data = content();
    if (!form || !data) return;
    optionOrdersForDefinitions();
    form.textContent = '';

    data.definitionQuestions.forEach(function (question) {
      var block = el('div', {
        className: 'question-block',
        id: 'definition-q' + question.number
      });
      var fieldset = el('fieldset');
      fieldset.appendChild(
        el('legend', {
          textContent: 'Question ' + question.number + '. ' + question.prompt
        })
      );
      var list = el('ul', { className: 'choice-list' });
      state.definitionOrder[question.number].forEach(function (optionId) {
        var option = getDefinitionOption(question, optionId);
        if (!option) return;
        var inputId = 'def-' + question.number + '-' + option.id;
        var input = el('input', {
          type: 'radio',
          name: 'definition-' + question.number,
          id: inputId,
          value: option.id
        });
        if (state.answers.definitions[question.number] === option.id) {
          input.checked = true;
        }
        if (state.sectionChecked.definitions) {
          input.disabled = true;
        }
        input.addEventListener('change', function () {
          state.answers.definitions[question.number] = option.id;
        });
        var label = el('label', { className: 'choice', htmlFor: inputId }, [
          input,
          el('span', { textContent: option.text })
        ]);
        if (state.sectionChecked.definitions) {
          if (option.id === question.correctId) {
            label.classList.add('is-correct-option');
          } else if (state.answers.definitions[question.number] === option.id) {
            label.classList.add('is-incorrect-selected');
          }
        }
        list.appendChild(el('li', null, [label]));
      });
      fieldset.appendChild(list);
      block.appendChild(fieldset);
      if (state.sectionChecked.definitions) {
        var correct = state.itemScores[question.number] === 1;
        block.classList.add(correct ? 'is-correct' : 'is-incorrect');
        block.appendChild(
          el('p', {
            className: 'locked-note',
            textContent: correct
              ? 'Correct. Answer locked.'
              : 'Incorrect. Answer locked. See feedback below.'
          })
        );
      }
      form.appendChild(block);
    });
  }

  function renderScenarios() {
    var form = document.getElementById('scenarios-form');
    var data = content();
    if (!form || !data) return;
    form.textContent = '';

    data.scenarioQuestions.forEach(function (question) {
      var block = el('div', {
        className: 'question-block',
        id: 'scenario-q' + question.number
      });
      var fieldset = el('fieldset');
      fieldset.appendChild(
        el('legend', {
          textContent: 'Question ' + question.number + '. ' + question.prompt
        })
      );
      var list = el('ul', { className: 'choice-list' });
      data.aimChoices.forEach(function (aim) {
        var inputId = 'scenario-' + question.number + '-' + aim.toLowerCase();
        var input = el('input', {
          type: 'radio',
          name: 'scenario-' + question.number,
          id: inputId,
          value: aim
        });
        if (state.answers.scenarios[question.number] === aim) {
          input.checked = true;
        }
        if (state.sectionChecked.scenarios) input.disabled = true;
        input.addEventListener('change', function () {
          state.answers.scenarios[question.number] = aim;
        });
        var label = el('label', { className: 'choice', htmlFor: inputId }, [
          input,
          el('span', { textContent: aim })
        ]);
        if (state.sectionChecked.scenarios) {
          if (aim === question.correct) label.classList.add('is-correct-option');
          else if (state.answers.scenarios[question.number] === aim) {
            label.classList.add('is-incorrect-selected');
          }
        }
        list.appendChild(el('li', null, [label]));
      });
      fieldset.appendChild(list);
      block.appendChild(fieldset);
      if (state.sectionChecked.scenarios) {
        var correct = state.itemScores[question.number] === 1;
        block.classList.add(correct ? 'is-correct' : 'is-incorrect');
        block.appendChild(
          el('p', {
            className: 'locked-note',
            textContent: correct
              ? 'Correct. Answer locked.'
              : 'Incorrect. Answer locked. See feedback below.'
          })
        );
      }
      form.appendChild(block);
    });
  }

  function renderMulti() {
    var form = document.getElementById('multi-form');
    var data = content();
    if (!form || !data) return;
    form.textContent = '';

    data.multiAimQuestions.forEach(function (question) {
      if (!state.answers.multi[question.number]) {
        state.answers.multi[question.number] = {};
      }
      var block = el('div', {
        className: 'question-block',
        id: 'multi-q' + question.number
      });
      var fieldset = el('fieldset');
      fieldset.appendChild(
        el('legend', {
          textContent:
            'Question ' +
            question.number +
            '. ' +
            question.prompt +
            ' Select exactly the affected aims.'
        })
      );
      var list = el('ul', { className: 'choice-list' });
      data.aimChoices.forEach(function (aim) {
        var inputId = 'multi-' + question.number + '-' + aim.toLowerCase();
        var input = el('input', {
          type: 'checkbox',
          name: 'multi-' + question.number,
          id: inputId,
          value: aim
        });
        if (state.answers.multi[question.number][aim]) input.checked = true;
        if (state.sectionChecked.multi) input.disabled = true;
        input.addEventListener('change', function () {
          state.answers.multi[question.number][aim] = input.checked;
        });
        var label = el('label', { className: 'choice', htmlFor: inputId }, [
          input,
          el('span', { textContent: aim })
        ]);
        if (state.sectionChecked.multi) {
          var isCorrectAim = question.correctAims.indexOf(aim) !== -1;
          var selected = !!state.answers.multi[question.number][aim];
          if (isCorrectAim) label.classList.add('is-correct-option');
          else if (selected) label.classList.add('is-incorrect-selected');
        }
        list.appendChild(el('li', null, [label]));
      });
      fieldset.appendChild(list);
      block.appendChild(fieldset);
      if (state.sectionChecked.multi) {
        var marks = state.itemScores[question.number] || 0;
        if (marks === 2) block.classList.add('is-correct');
        else if (marks === 1) block.classList.add('is-partial');
        else block.classList.add('is-incorrect');
        block.appendChild(
          el('p', {
            className: 'locked-note',
            textContent:
              'Score for this question: ' +
              marks +
              ' / 2. Answers locked. See feedback below.'
          })
        );
      }
      form.appendChild(block);
    });
  }

  function missingDefinitionNumbers() {
    return content().definitionQuestions
      .filter(function (question) {
        return !state.answers.definitions[question.number];
      })
      .map(function (question) {
        return question.number;
      });
  }

  function missingScenarioNumbers() {
    return content().scenarioQuestions
      .filter(function (question) {
        return !state.answers.scenarios[question.number];
      })
      .map(function (question) {
        return question.number;
      });
  }

  function missingMultiNumbers() {
    return content().multiAimQuestions
      .filter(function (question) {
        var selected = state.answers.multi[question.number] || {};
        return !content().aimChoices.some(function (aim) {
          return selected[aim];
        });
      })
      .map(function (question) {
        return question.number;
      });
  }

  function focusQuestion(prefix, number) {
    var host = document.getElementById(prefix + number);
    if (!host) return;
    var control = host.querySelector('input');
    if (control) control.focus();
    else host.scrollIntoView({ block: 'center' });
  }

  function scoreDefinitions() {
    var score = 0;
    content().definitionQuestions.forEach(function (question) {
      var correct = state.answers.definitions[question.number] === question.correctId;
      state.itemScores[question.number] = correct ? 1 : 0;
      if (correct) score += 1;
    });
    state.sectionScores.definitions = score;
    return score;
  }

  function scoreScenarios() {
    var score = 0;
    content().scenarioQuestions.forEach(function (question) {
      var correct = state.answers.scenarios[question.number] === question.correct;
      state.itemScores[question.number] = correct ? 1 : 0;
      if (correct) score += 1;
    });
    state.sectionScores.scenarios = score;
    return score;
  }

  function scoreMulti() {
    var score = 0;
    content().multiAimQuestions.forEach(function (question) {
      var selected = state.answers.multi[question.number] || {};
      var marks = 0;
      question.correctAims.forEach(function (aim) {
        if (selected[aim]) marks += 1;
      });
      marks = Math.min(2, marks);
      state.itemScores[question.number] = marks;
      score += marks;
    });
    state.sectionScores.multi = score;
    return score;
  }

  function rebuildReviewList() {
    var review = [];
    content().definitionQuestions.forEach(function (question) {
      if ((state.itemScores[question.number] || 0) < 1) review.push(question.number);
    });
    content().scenarioQuestions.forEach(function (question) {
      if ((state.itemScores[question.number] || 0) < 1) review.push(question.number);
    });
    content().multiAimQuestions.forEach(function (question) {
      if ((state.itemScores[question.number] || 0) < 2) review.push(question.number);
    });
    state.questionsForReview = review;
  }

  function renderDefinitionFeedback() {
    var host = document.getElementById('definitions-feedback');
    host.textContent = '';
    host.hidden = false;
    content().definitionQuestions.forEach(function (question) {
      var item = el('article', { className: 'feedback-item' });
      var selectedId = state.answers.definitions[question.number];
      var selected = getDefinitionOption(question, selectedId);
      var correct = getDefinitionOption(question, question.correctId);
      item.appendChild(
        el('h3', {
          textContent:
            'Question ' +
            question.number +
            ': ' +
            ((state.itemScores[question.number] || 0) === 1 ? 'Correct' : 'Incorrect')
        })
      );
      item.appendChild(
        el('p', {
          textContent: 'Your answer: ' + (selected ? selected.text : 'No answer')
        })
      );
      item.appendChild(
        el('p', { textContent: 'Correct answer: ' + (correct ? correct.text : '') })
      );
      item.appendChild(
        el('p', {
          textContent:
            'This matches the CIA definition for this aim. Use the exact wording when revising.'
        })
      );
      host.appendChild(item);
    });
  }

  function renderScenarioFeedback() {
    var host = document.getElementById('scenarios-feedback');
    host.textContent = '';
    host.hidden = false;
    content().scenarioQuestions.forEach(function (question) {
      var item = el('article', { className: 'feedback-item' });
      var selected = state.answers.scenarios[question.number] || 'No answer';
      item.appendChild(
        el('h3', {
          textContent:
            'Question ' +
            question.number +
            ': ' +
            ((state.itemScores[question.number] || 0) === 1 ? 'Correct' : 'Incorrect')
        })
      );
      item.appendChild(el('p', { textContent: 'Your answer: ' + selected }));
      item.appendChild(el('p', { textContent: 'Correct CIA aim: ' + question.correct }));
      item.appendChild(markEvidence(question.prompt, question.evidence));
      item.appendChild(el('p', { textContent: question.explanation }));
      host.appendChild(item);
    });
  }

  function renderMultiFeedback() {
    var host = document.getElementById('multi-feedback');
    host.textContent = '';
    host.hidden = false;
    content().multiAimQuestions.forEach(function (question) {
      var item = el('article', { className: 'feedback-item' });
      var selected = state.answers.multi[question.number] || {};
      var selectedAims = content().aimChoices.filter(function (aim) {
        return selected[aim];
      });
      var marks = state.itemScores[question.number] || 0;
      item.appendChild(
        el('h3', {
          textContent:
            'Question ' + question.number + ': ' + marks + ' / 2 marks'
        })
      );
      item.appendChild(
        el('p', {
          textContent:
            'Your selected aims: ' +
            (selectedAims.length ? selectedAims.join(', ') : 'None')
        })
      );
      item.appendChild(
        el('p', {
          textContent: 'Correct aims: ' + question.correctAims.join(' and ')
        })
      );
      question.correctAims.forEach(function (aim) {
        item.appendChild(
          el('p', { textContent: aim + ': ' + question.explanations[aim] })
        );
      });
      item.appendChild(el('p', { textContent: question.teachingPoint }));
      host.appendChild(item);
    });
  }

  function checkDefinitions() {
    var missing = missingDefinitionNumbers();
    if (missing.length) {
      setStatusMessage(
        'definitions-status',
        'Answer every definition question before checking. Missing: ' +
          missing.join(', ') +
          '.',
        'error'
      );
      focusQuestion('definition-q', missing[0]);
      return;
    }
    scoreDefinitions();
    state.sectionChecked.definitions = true;
    renderDefinitions();
    renderDefinitionFeedback();
    document.getElementById('btn-check-definitions').hidden = true;
    document.getElementById('btn-to-scenarios').hidden = false;
    setStatusMessage(
      'definitions-status',
      'Definitions checked. Score so far for this section: ' +
        state.sectionScores.definitions +
        ' / 3. Review the feedback, then continue.',
      'success'
    );
    document.getElementById('btn-to-scenarios').focus();
  }

  function checkScenarios() {
    var missing = missingScenarioNumbers();
    if (missing.length) {
      setStatusMessage(
        'scenarios-status',
        'Answer every scenario question before checking. Missing: ' +
          missing.join(', ') +
          '.',
        'error'
      );
      focusQuestion('scenario-q', missing[0]);
      return;
    }
    scoreScenarios();
    state.sectionChecked.scenarios = true;
    renderScenarios();
    renderScenarioFeedback();
    document.getElementById('btn-check-scenarios').hidden = true;
    document.getElementById('btn-to-multi').hidden = false;
    setStatusMessage(
      'scenarios-status',
      'Scenarios checked. Score for this section: ' +
        state.sectionScores.scenarios +
        ' / 6. Review the feedback, then continue.',
      'success'
    );
    document.getElementById('btn-to-multi').focus();
  }

  function checkMulti() {
    var missing = missingMultiNumbers();
    if (missing.length) {
      setStatusMessage(
        'multi-status',
        'Select at least one aim for every combined-impact question. Missing: ' +
          missing.join(', ') +
          '.',
        'error'
      );
      focusQuestion('multi-q', missing[0]);
      return;
    }
    scoreMulti();
    state.sectionChecked.multi = true;
    rebuildReviewList();
    state.score =
      state.sectionScores.definitions +
      state.sectionScores.scenarios +
      state.sectionScores.multi;
    if (state.startTime) {
      state.completionTime = Math.max(
        1,
        Math.min(7200, Math.floor((Date.now() - state.startTime) / 1000))
      );
    } else {
      state.completionTime = 1;
    }
    renderMulti();
    renderMultiFeedback();
    document.getElementById('btn-check-multi').hidden = true;
    document.getElementById('btn-to-result').hidden = false;
    setStatusMessage(
      'multi-status',
      'Combined impacts checked. Score for this section: ' +
        state.sectionScores.multi +
        ' / 6. Review the feedback, then continue.',
      'success'
    );
    document.getElementById('btn-to-result').focus();
  }

  function performanceLabel(score) {
    if (score >= 13) return 'Secure understanding';
    if (score >= 10) return 'Developing securely';
    if (score >= 7) return 'Some concepts need review';
    return 'Revisit the CIA definitions and examples';
  }

  function populateMostDifficult() {
    var select = document.getElementById('most-difficult');
    select.textContent = '';
    select.appendChild(el('option', { value: '', textContent: 'None' }));
    for (var i = 1; i <= 12; i += 1) {
      select.appendChild(
        el('option', { value: String(i), textContent: 'Question ' + i })
      );
    }
  }

  function renderResultSummary() {
    var host = document.getElementById('score-summary');
    host.textContent = '';
    var learner = state.learner || {};
    host.appendChild(
      el('p', {
        className: 'result-line',
        textContent: 'Learner: ' + learner.firstName + ' ' + learner.surname
      })
    );
    host.appendChild(
      el('p', {
        className: 'result-line',
        textContent: 'Student ID: ' + learner.studentId
      })
    );
    host.appendChild(
      el('p', {
        className: 'result-line',
        textContent: 'Class group: ' + learner.classGroup
      })
    );
    host.appendChild(
      el('p', {
        className: 'result-line',
        textContent: 'Activity: CIA Triad Learning'
      })
    );
    host.appendChild(
      el('p', {
        className: 'result-line',
        textContent: 'Score: ' + state.score + ' / ' + maximumScore()
      })
    );
    host.appendChild(
      el('p', {
        className: 'result-line',
        textContent:
          'Questions to revisit: ' +
          (state.questionsForReview.length
            ? state.questionsForReview.join(', ')
            : 'None')
      })
    );
    host.appendChild(
      el('p', {
        className: 'performance-message',
        textContent: performanceLabel(state.score)
      })
    );
    host.appendChild(
      el('p', {
        className: 'panel-note',
        textContent:
          'This performance label is formative guidance only. It is not an OCR grade and is not submitted as the score.'
      })
    );
  }

  function updateReflectionCount() {
    var value = document.getElementById('reflection').value || '';
    document.getElementById('reflection-count').textContent =
      value.length + ' / ' + REFLECTION_MAX;
  }

  function getReflection() {
    return String(document.getElementById('reflection').value || '')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s+/g, ' ');
  }

  function getMostDifficultItem() {
    var value = document.getElementById('most-difficult').value;
    return value ? String(value) : '';
  }

  function validateBeforeSubmit() {
    var errors = [];
    var reflection = getReflection();
    if (!state.learner) errors.push('Learner details are missing.');
    if (!state.sectionChecked.multi) {
      errors.push('Complete and check all scored sections before submitting.');
    }
    if (reflection.length < REFLECTION_MIN) {
      errors.push('Reflection must be at least 40 characters.');
    }
    if (reflection.length > REFLECTION_MAX) {
      errors.push('Reflection must not exceed 500 characters.');
    }
    if (!submissions.isConfigured || !submissions.isConfigured(submissions.COLLECTOR_URL)) {
      errors.push('Submission is not configured yet.');
    }
    if (state.score < 0 || state.score > maximumScore()) {
      errors.push('Score must be between 0 and ' + maximumScore() + '.');
    }
    return { valid: errors.length === 0, errors: errors, reflection: reflection };
  }

  function buildSubmissionInput(recordType, reflection) {
    var attemptId = submissions.getOrCreateAttemptId
      ? submissions.getOrCreateAttemptId(ATTEMPT_KEY)
      : String(Date.now());
    return {
      recordType: recordType || 'LIVE',
      attemptId: attemptId,
      courseContext: courseContext.COURSE_CONTEXT,
      activity: activityMeta(),
      learner: state.learner,
      score: state.score,
      questionsForReview: state.questionsForReview.slice(),
      mostDifficultItem: getMostDifficultItem(),
      reflection: reflection,
      completionTimeSeconds: Math.max(1, state.completionTime || 1),
      sourcePage: window.location.href
    };
  }

  function showSubmissionSummary() {
    if (!learnerDetails.renderSubmissionSummary || !state.learner) return;
    learnerDetails.renderSubmissionSummary('submission-summary-host', {
      firstName: state.learner.firstName,
      surname: state.learner.surname,
      studentId: state.learner.studentId,
      classGroup: state.learner.classGroup,
      activityName: activityMeta().activityName,
      score: state.score,
      maximumScore: maximumScore()
    });
  }

  function handleSubmit() {
    if (state.submitting) return;
    var validation = validateBeforeSubmit();
    if (!validation.valid) {
      setStatusMessage('submission-messages', validation.errors.join(' '), 'error');
      document.getElementById('reflection').focus();
      return;
    }

    state.submitting = true;
    document.getElementById('btn-submit').disabled = true;
    showSubmissionSummary();
    setStatusMessage('submission-messages', 'Sending your result.', 'info');

    var result = submissions.submitSchema3
      ? submissions.submitSchema3(buildSubmissionInput('LIVE', validation.reflection))
      : { started: false, errors: ['Submission helper unavailable.'] };

    if (!result.started) {
      state.submitting = false;
      document.getElementById('btn-submit').disabled = false;
      setStatusMessage('submission-messages', result.errors.join(' '), 'error');
      return;
    }

    state.submitted = true;
    state.submitting = false;
    if (submissions.markAttemptCompleted) {
      submissions.markAttemptCompleted(ATTEMPT_KEY);
    }
    document.getElementById('btn-retry').hidden = false;
    document.getElementById('btn-start-another').hidden = false;
    setStatusMessage(
      'submission-messages',
      'A confirmation tab has opened. Check for “Results received”. Opening a tab does not by itself prove the result was saved.',
      'info'
    );
  }

  function handleRetry() {
    if (state.submitting) return;
    var validation = validateBeforeSubmit();
    if (!validation.valid) {
      setStatusMessage('submission-messages', validation.errors.join(' '), 'error');
      return;
    }
    state.submitting = true;
    document.getElementById('btn-submit').disabled = true;
    setStatusMessage(
      'submission-messages',
      'Retrying submission with the same Attempt ID.',
      'info'
    );
    var result = submissions.submitSchema3
      ? submissions.submitSchema3(buildSubmissionInput('LIVE', validation.reflection))
      : { started: false, errors: ['Submission helper unavailable.'] };
    state.submitting = false;
    if (!result.started) {
      document.getElementById('btn-submit').disabled = false;
      setStatusMessage('submission-messages', result.errors.join(' '), 'error');
      return;
    }
    document.getElementById('btn-retry').hidden = false;
    document.getElementById('btn-start-another').hidden = false;
    setStatusMessage(
      'submission-messages',
      'A confirmation tab has opened. The same Attempt ID was reused for this retry.',
      'info'
    );
  }

  function startActivity() {
    var learnerValidation = learnerDetails.validateLearnerDetails
      ? learnerDetails.validateLearnerDetails({ showPartner: false })
      : { valid: false, errors: ['Learner details form is unavailable.'] };

    if (!learnerValidation.valid) {
      learnerDetails.showValidationSummary('learner-details-errors', learnerValidation);
      setStatusMessage('start-status', 'Complete your details before starting.', 'error');
      return;
    }

    if (!content()) {
      setStatusMessage('start-status', 'Learning content failed to load.', 'error');
      return;
    }

    state.learner = learnerValidation.learner;
    if (submissions.getOrCreateAttemptId) {
      submissions.getOrCreateAttemptId(ATTEMPT_KEY);
    }
    state.started = true;
    state.startTime = Date.now();
    renderTriad();
    showStage('learn');
  }

  function resetAttempt() {
    var confirmed = window.confirm(
      'Starting another attempt will create a new Attempt ID. Continue only if you have finished with this result or your tutor has asked you to repeat the activity.'
    );
    if (!confirmed) return;

    if (submissions.startNewAttempt) {
      submissions.startNewAttempt(ATTEMPT_KEY);
    }

    state.stage = 'details';
    state.learner = null;
    state.started = false;
    state.startTime = null;
    state.completionTime = null;
    state.definitionOrder = {};
    state.answers = { definitions: {}, scenarios: {}, multi: {} };
    state.sectionChecked = { definitions: false, scenarios: false, multi: false };
    state.sectionScores = { definitions: 0, scenarios: 0, multi: 0 };
    state.itemScores = {};
    state.questionsForReview = [];
    state.score = 0;
    state.guidedRevealed = {};
    state.submitting = false;
    state.submitted = false;

    document.getElementById('definitions-feedback').hidden = true;
    document.getElementById('scenarios-feedback').hidden = true;
    document.getElementById('multi-feedback').hidden = true;
    document.getElementById('definitions-feedback').textContent = '';
    document.getElementById('scenarios-feedback').textContent = '';
    document.getElementById('multi-feedback').textContent = '';
    document.getElementById('btn-check-definitions').hidden = false;
    document.getElementById('btn-check-scenarios').hidden = false;
    document.getElementById('btn-check-multi').hidden = false;
    document.getElementById('btn-to-scenarios').hidden = true;
    document.getElementById('btn-to-multi').hidden = true;
    document.getElementById('btn-to-result').hidden = true;
    document.getElementById('btn-to-definitions').disabled = true;
    document.getElementById('btn-submit').disabled = false;
    document.getElementById('btn-retry').hidden = true;
    document.getElementById('btn-start-another').hidden = true;
    document.getElementById('reflection').value = '';
    document.getElementById('most-difficult').value = '';
    document.getElementById('submission-summary-host').textContent = '';
    document.getElementById('score-summary').textContent = '';
    updateReflectionCount();
    setStatusMessage('submission-messages', '', 'info');
    setStatusMessage(
      'start-status',
      'Ready for a new attempt. Timing starts when you select Start CIA Triad Learning.',
      'info'
    );
    initLearnerDetails();
    showStage('details');
    document.getElementById('btn-start').focus();
  }

  function initLearnerDetails() {
    var meta = activityMeta();
    if (!meta) return;
    if (learnerDetails.renderCourseDetails) {
      learnerDetails.renderCourseDetails('course-details-host', meta);
    }
    if (learnerDetails.renderLearnerForm) {
      learnerDetails.renderLearnerForm('learner-details-host', { showPartner: false });
    }
  }

  function bindControls() {
    document.getElementById('btn-start').addEventListener('click', startActivity);
    document.getElementById('btn-to-guided').addEventListener('click', function () {
      renderGuided();
      showStage('guided');
    });
    document.getElementById('btn-to-definitions').addEventListener('click', function () {
      if (!allGuidedRevealed()) return;
      renderDefinitions();
      showStage('definitions');
    });
    document
      .getElementById('btn-check-definitions')
      .addEventListener('click', checkDefinitions);
    document.getElementById('btn-to-scenarios').addEventListener('click', function () {
      if (!state.sectionChecked.definitions) return;
      renderScenarios();
      showStage('scenarios');
    });
    document
      .getElementById('btn-check-scenarios')
      .addEventListener('click', checkScenarios);
    document.getElementById('btn-to-multi').addEventListener('click', function () {
      if (!state.sectionChecked.scenarios) return;
      renderMulti();
      showStage('multi');
    });
    document.getElementById('btn-check-multi').addEventListener('click', checkMulti);
    document.getElementById('btn-to-result').addEventListener('click', function () {
      if (!state.sectionChecked.multi) return;
      populateMostDifficult();
      renderResultSummary();
      showStage('result');
      document.getElementById('reflection').focus();
    });
    document
      .getElementById('reflection')
      .addEventListener('input', updateReflectionCount);
    document.getElementById('btn-submit').addEventListener('click', handleSubmit);
    document.getElementById('btn-retry').addEventListener('click', handleRetry);
    document
      .getElementById('btn-start-another')
      .addEventListener('click', resetAttempt);
  }

  function buildProbePayload(overrides) {
    var meta = activityMeta();
    var learner = {
      studentId: 'TEST-PRIMARY',
      firstName: 'Cursor',
      surname: 'Test',
      classGroup: 'TEST',
      partnerStudentId: '',
      partnerFirstName: '',
      partnerSurname: ''
    };
    var input = {
      recordType: 'TEST',
      attemptId: submissions.createAttemptId
        ? submissions.createAttemptId()
        : String(Date.now()),
      courseContext: courseContext.COURSE_CONTEXT,
      activity: meta,
      learner: learner,
      score: 15,
      questionsForReview: [],
      mostDifficultItem: '',
      reflection:
        'Cyber security protects confidentiality and availability. At Northbank, patient records must stay private and systems must work in clinic hours.',
      completionTimeSeconds: 90,
      sourcePage: window.location.href
    };
    if (overrides) {
      Object.keys(overrides).forEach(function (key) {
        input[key] = overrides[key];
      });
    }
    return submissions.buildSchema3Payload
      ? submissions.buildSchema3Payload(input)
      : null;
  }

  function exposeProbeHelper() {
    window.Unit3CiaProbe = {
      activityId: ACTIVITY_ID,
      attemptStorageKey: ATTEMPT_KEY,
      buildTestPayload: buildProbePayload,
      submitTest: function (overrides) {
        var payload = buildProbePayload(overrides);
        if (!payload || !submissions.submitViaForm) {
          return { started: false, errors: ['Probe helper unavailable.'] };
        }
        var started = submissions.submitViaForm(payload);
        return { started: started, payload: payload };
      },
      note:
        'Do not run against the live collector until U3-W01-CIA is Active in the Activities worksheet.'
    };
  }

  ready(function () {
    ensureHelpers();
    if (!content()) {
      setStatusMessage(
        'start-status',
        'Learning content failed to load. Check that content.js is available.',
        'error'
      );
      return;
    }
    if (!activityMeta()) {
      setStatusMessage(
        'start-status',
        'Activity metadata is missing from the shared course context.',
        'error'
      );
      return;
    }
    bindControls();
    initLearnerDetails();
    updateProgress();
    updateReflectionCount();
    exposeProbeHelper();
  });
})();
