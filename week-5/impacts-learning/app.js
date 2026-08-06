(function () {
  'use strict';

  var data = window.Week5ImpactsLearning;
  var progress = window.Unit3Week5Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var mode = 'overview';
  var lossIndex = 0;
  var host = document.getElementById('w5-activity-host');
  var startedAt = Date.now();
  var checkAnswers = {};

  if (progress) progress.markStarted(ACTIVITY_ID);

  function escapeText(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function navButton(label, nextMode, opts) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary';
    btn.textContent = label;
    btn.addEventListener('click', function () {
      mode = nextMode;
      if (opts && typeof opts.index === 'number') lossIndex = opts.index;
      render();
      host.focus();
    });
    return btn;
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    if (mode === 'overview') renderOverview();
    else if (mode === 'loss') renderLoss();
    else if (mode === 'disruption') renderDisruption();
    else if (mode === 'check') renderCheck();
  }

  function renderOverview() {
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Impacts of cyber security incidents</h2>' +
      '<p class="w5-formula" role="note">Impacts = Loss · Disruption · Safety</p>' +
      '<p class="panel-note">' +
      escapeText(data.overviewNote) +
      '</p>' +
      '<div class="w5-two-col">' +
      '<article class="w5-def-card"><h3>Loss</h3><p>' +
      escapeText(data.definitions.loss) +
      '</p></article>' +
      '<article class="w5-def-card"><h3>Disruption</h3><p>' +
      escapeText(data.definitions.disruption) +
      '</p></article>' +
      '<article class="w5-def-card"><h3>Safety</h3><p>' +
      escapeText(data.definitions.safety) +
      '</p></article>' +
      '</div>';
    var actions = document.createElement('div');
    actions.className = 'w5-actions';
    actions.appendChild(navButton('Learn loss forms', 'loss', { index: 0 }));
    actions.appendChild(navButton('Disruption and safety', 'disruption'));
    actions.appendChild(navButton('Knowledge check (9 marks)', 'check'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderLoss() {
    var item = data.lossForms[lossIndex];
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<p class="panel-note" aria-live="polite">Loss form ' +
      (lossIndex + 1) +
      ' of ' +
      data.lossForms.length +
      '</p>' +
      '<h2>' +
      escapeText(item.term) +
      '</h2>' +
      '<ul class="section-list">' +
      '<li><strong>Explanation:</strong> ' +
      escapeText(item.explanation) +
      '</li>' +
      '<li><strong>Northbank / healthcare example:</strong> ' +
      escapeText(item.example) +
      '</li>' +
      '<li><strong>Distinction:</strong> ' +
      escapeText(item.distinction) +
      '</li></ul>';

    var check = item.check;
    var fieldset = document.createElement('fieldset');
    fieldset.className = 'w5-options';
    var legend = document.createElement('legend');
    legend.textContent = check.prompt;
    fieldset.appendChild(legend);
    check.options.forEach(function (option, optionIndex) {
      var id = item.id + '-opt-' + optionIndex;
      var label = document.createElement('label');
      label.className = 'w5-option';
      label.setAttribute('for', id);
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = item.id + '-check';
      input.id = id;
      input.value = String(optionIndex);
      if (checkAnswers[item.id] === optionIndex) input.checked = true;
      input.addEventListener('change', function () {
        checkAnswers[item.id] = optionIndex;
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + option));
      fieldset.appendChild(label);
    });
    panel.appendChild(fieldset);

    var feedback = document.createElement('div');
    feedback.className = 'status-messages';
    feedback.setAttribute('aria-live', 'polite');
    panel.appendChild(feedback);

    var checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'btn btn-primary';
    checkBtn.textContent = 'Check this learner item';
    checkBtn.addEventListener('click', function () {
      if (checkAnswers[item.id] == null) {
        feedback.innerHTML =
          '<p class="message message-warning">Select an answer before checking.</p>';
        return;
      }
      var correct = checkAnswers[item.id] === check.correctIndex;
      feedback.innerHTML =
        '<p class="message message-' +
        (correct ? 'success' : 'error') +
        '">' +
        (correct ? 'Correct. ' : 'Not quite. ') +
        escapeText(check.explanation) +
        '</p>';
    });
    panel.appendChild(checkBtn);

    var actions = document.createElement('div');
    actions.className = 'w5-actions';
    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'btn btn-secondary';
    prev.textContent = 'Previous';
    prev.disabled = lossIndex === 0;
    prev.addEventListener('click', function () {
      lossIndex -= 1;
      render();
    });
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'btn btn-primary';
    next.textContent =
      lossIndex === data.lossForms.length - 1
        ? 'Go to disruption and safety'
        : 'Next loss form';
    next.addEventListener('click', function () {
      if (lossIndex === data.lossForms.length - 1) mode = 'disruption';
      else lossIndex += 1;
      render();
    });
    actions.appendChild(prev);
    actions.appendChild(next);
    actions.appendChild(navButton('Overview', 'overview'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderDisruption() {
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Disruption and safety</h2>' +
      '<p class="w5-callout" role="note">' +
      escapeText(data.safetyTeaching) +
      '</p>' +
      '<h3>Disruption contexts from the weekly plan</h3>';
    var list = document.createElement('ul');
    list.className = 'section-list';
    data.disruptionContexts.forEach(function (item) {
      var li = document.createElement('li');
      li.innerHTML =
        '<strong>' +
        escapeText(item.context) +
        ':</strong> ' +
        escapeText(item.explanation) +
        ' <em>Example:</em> ' +
        escapeText(item.example);
      list.appendChild(li);
    });
    panel.appendChild(list);
    var safety = document.createElement('div');
    safety.innerHTML = '<h3>Safety examples</h3>';
    var sList = document.createElement('ul');
    sList.className = 'section-list';
    data.safetyExamples.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item;
      sList.appendChild(li);
    });
    safety.appendChild(sList);
    panel.appendChild(safety);
    var guide = document.createElement('p');
    guide.className = 'panel-note';
    guide.textContent =
      'When classifying, ask: which service stopped or became unreliable, who depended on it, how they were affected, and whether the impact is loss, disruption, safety or a defensible combination.';
    panel.appendChild(guide);
    var actions = document.createElement('div');
    actions.className = 'w5-actions';
    actions.appendChild(navButton('Back to loss forms', 'loss'));
    actions.appendChild(navButton('Knowledge check (9 marks)', 'check'));
    actions.appendChild(navButton('Overview', 'overview'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderCheck() {
    host.textContent = '';
    if (!window.Unit3Week5Quiz) return;
    window.Unit3Week5Quiz.createQuiz({
      activityId: ACTIVITY_ID,
      questions: data.knowledgeCheck.slice(),
      hostId: 'w5-activity-host',
      onComplete: function (result) {
        window.Unit3Week5Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w5-submit-host',
          getScore: function () {
            return result.score;
          },
          getTotal: function () {
            return result.total;
          },
          getQuestionsForReview: function () {
            return result.incorrectIndexes;
          },
          getCompletionTimeSeconds: function () {
            return (
              result.completionTimeSeconds ||
              Math.max(1, Math.round((Date.now() - startedAt) / 1000))
            );
          },
          canSubmit: function () {
            return true;
          }
        });
      },
      onRetry: function () {
        var submit = document.getElementById('w5-submit-host');
        if (submit) {
          submit.hidden = true;
          submit.textContent = '';
        }
      }
    });
  }

  render();
})();
