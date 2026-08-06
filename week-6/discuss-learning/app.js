(function () {
  'use strict';

  var data = window.Week6DiscussLearning;
  var progress = window.Unit3Week6Progress;
  if (!data || !window.Unit3Week6Quiz) return;

  var ACTIVITY_ID = data.activityId;
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var mode = 'learn';
  var checkIndex = 0;
  var checkAnswers = [];

  if (progress) progress.markStarted(ACTIVITY_ID);

  function renderLearn() {
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Balanced Discuss response structure</h2>' +
      '<p class="w6-formula" role="note">Issue · Supported consideration · Competing consideration · Concession · Justified conclusion</p>' +
      '<p class="w6-scenario">' +
      data.scenario +
      '</p>';

    var list = document.createElement('ol');
    list.className = 'section-list';
    data.structure.forEach(function (item) {
      var li = document.createElement('li');
      li.innerHTML = '<strong>' + item.label + ':</strong> ' + item.description;
      list.appendChild(li);
    });
    panel.appendChild(list);

    var weak = document.createElement('blockquote');
    weak.className = 'w6-scenario w6-weak-response';
    weak.innerHTML =
      '<strong>' +
      data.weakResponse.label +
      ':</strong> ' +
      data.weakResponse.text +
      '<ul class="section-list">' +
      data.weakResponse.problems
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>';
    panel.appendChild(weak);

    var strong = document.createElement('blockquote');
    strong.className = 'w6-scenario w6-improved-response';
    strong.innerHTML =
      '<strong>' +
      data.strongResponse.label +
      ':</strong> ' +
      data.strongResponse.text +
      '<ul class="section-list">' +
      data.strongResponse.strengths
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>';
    panel.appendChild(strong);

    var note = document.createElement('p');
    note.className = 'panel-note';
    note.textContent =
      'The stronger response is balanced, not merely longer. It weighs both sides before concluding.';
    panel.appendChild(note);

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Start knowledge checks (' + data.total + ')';
    btn.addEventListener('click', function () {
      mode = 'check';
      checkIndex = 0;
      checkAnswers = [];
      renderCheck();
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderCheck() {
    if (checkIndex >= data.knowledgeChecks.length) {
      finishChecks();
      return;
    }
    var q = data.knowledgeChecks[checkIndex];
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'activity-panel';
    panel.innerHTML =
      '<p class="panel-note">Knowledge check ' +
      (checkIndex + 1) +
      ' of ' +
      data.knowledgeChecks.length +
      '</p>' +
      '<h2>' +
      q.prompt +
      '</h2>';

    var fieldset = document.createElement('fieldset');
    fieldset.className = 'w6-options';
    var legend = document.createElement('legend');
    legend.className = 'visually-hidden';
    legend.textContent = 'Choose an answer';
    fieldset.appendChild(legend);
    q.options.forEach(function (option, optionIndex) {
      var id = 'dl-check-' + checkIndex + '-' + optionIndex;
      var label = document.createElement('label');
      label.className = 'w6-option';
      label.setAttribute('for', id);
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'dl-check';
      input.id = id;
      input.value = String(optionIndex);
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + option));
      fieldset.appendChild(label);
    });
    panel.appendChild(fieldset);

    var feedback = document.createElement('div');
    feedback.className = 'status-messages';
    feedback.setAttribute('aria-live', 'polite');
    panel.appendChild(feedback);

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent =
      checkIndex === data.knowledgeChecks.length - 1 ? 'Finish checks' : 'Next check';
    var locked = false;
    btn.addEventListener('click', function () {
      if (locked) {
        checkIndex += 1;
        renderCheck();
        return;
      }
      var selected = panel.querySelector('input[name="dl-check"]:checked');
      if (!selected) {
        feedback.textContent = '';
        var warn = document.createElement('p');
        warn.className = 'message message-warning';
        warn.textContent = 'Select an answer before continuing.';
        feedback.appendChild(warn);
        return;
      }
      locked = true;
      var chosen = Number(selected.value);
      var correct = chosen === q.correctIndex;
      checkAnswers.push({ correct: correct });
      panel.querySelectorAll('input[name="dl-check"]').forEach(function (input) {
        input.disabled = true;
      });
      feedback.textContent = '';
      var msg = document.createElement('p');
      msg.className = 'message message-' + (correct ? 'success' : 'error');
      msg.textContent = correct ? 'Correct. ' + q.explanation : 'Not quite. ' + q.explanation;
      feedback.appendChild(msg);
      btn.textContent =
        checkIndex === data.knowledgeChecks.length - 1 ? 'Finish checks' : 'Next check';
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function finishChecks() {
    var score = checkAnswers.reduce(function (sum, item) {
      return sum + (item && item.correct ? 1 : 0);
    }, 0);
    if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Knowledge checks complete</h2>' +
      '<p aria-live="polite">Your score: ' +
      score +
      ' / ' +
      data.total +
      '.</p>';
    host.appendChild(panel);
    window.Unit3Week6Submit.renderSubmitPanel({
      activityId: ACTIVITY_ID,
      hostId: 'w6-submit-host',
      getScore: function () {
        return score;
      },
      getTotal: function () {
        return data.total;
      },
      getCompletionTimeSeconds: function () {
        return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      },
      canSubmit: function () {
        return true;
      }
    });
  }

  function render() {
    if (mode === 'learn') renderLearn();
    else renderCheck();
  }

  render();
})();
