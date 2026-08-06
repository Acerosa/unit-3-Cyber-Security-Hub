(function () {
  'use strict';

  var data = window.Week7AnswerImprovement;
  var progress = window.Unit3Week7Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'answer-improvement';
  var host = document.getElementById('w7-activity-host');
  var startedAt = Date.now();
  var state = {
    criteria: {},
    measure: '',
    evidence: '',
    justification: '',
    effectiveness: '',
    limitation: '',
    improved: '',
    nextAction: '',
    submittedAttempt: false
  };

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      state = Object.assign(state, draft.state || {});
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        state: state,
        savedAt: new Date().toISOString()
      });
    }
  }

  function computeScore() {
    var marks = 0;
    var selected = Object.keys(state.criteria).filter(function (key) {
      return state.criteria[key];
    }).length;
    if (selected >= 3) marks += 1;
    if (String(state.measure || '').trim().length >= 4) marks += 1;
    if (String(state.evidence || '').trim().length >= 25) marks += 1;
    if (String(state.justification || '').trim().length >= 25) marks += 1;
    var eff = String(state.effectiveness || '').trim().toLowerCase();
    if (eff.length >= 20 && eff.indexOf('installed') === -1) marks += 1;
    if (
      String(state.limitation || '').trim().length >= 15 &&
      String(state.improved || '').trim().length >= 50
    ) {
      marks += 1;
    }
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    var selected = Object.keys(state.criteria).filter(function (key) {
      return state.criteria[key];
    }).length;
    if (selected < 2) {
      messages.push('Mark the sample against at least two checklist points before continuing.');
    }
    if (String(state.measure || '').trim().length < 4) {
      messages.push('Identify the measure.');
    }
    if (String(state.evidence || '').trim().length < 25) {
      messages.push('Highlight contextual evidence from Northbank.');
    }
    if (String(state.justification || '').trim().length < 25) {
      messages.push('Add justification.');
    }
    var eff = String(state.effectiveness || '').trim().toLowerCase();
    if (eff.length < 20 || eff === 'installed' || eff.indexOf('we installed') !== -1) {
      messages.push('Add a measurable effectiveness statement that is not only “installed”.');
    }
    if (String(state.limitation || '').trim().length < 15) {
      messages.push('State a limitation or cost.');
    }
    if (String(state.improved || '').trim().length < 50) {
      messages.push('Save an improved full answer.');
    }
    if (String(state.nextAction || '').trim().length < 12) {
      messages.push('Add one next-exam action.');
    }
    return messages;
  }

  function field(parent, id, labelText, key, rows) {
    var wrap = document.createElement('div');
    wrap.className = 'w7-reflection-field';
    var label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    wrap.appendChild(label);
    var area = document.createElement('textarea');
    area.id = id;
    area.rows = rows;
    area.value = state[key] || '';
    area.addEventListener('input', function () {
      state[key] = area.value;
      save();
    });
    wrap.appendChild(area);
    parent.appendChild(wrap);
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Marking and answer improvement</h2>' +
      '<p><strong>Question (' +
      data.question.marks +
      ' marks · ' +
      data.question.commandWord +
      '):</strong> ' +
      data.question.prompt +
      '</p>' +
      '<p class="w7-callout" role="note"><strong>Common Week 7 slip:</strong> ' +
      data.commonError +
      '</p>';

    var sample = document.createElement('blockquote');
    sample.className = 'w7-scenario w7-weak-response';
    sample.textContent = data.sampleResponse.text;
    panel.appendChild(sample);

    var issues = document.createElement('ul');
    issues.className = 'section-list';
    data.dominantIssues.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item;
      issues.appendChild(li);
    });
    panel.appendChild(issues);

    var schemeHeading = document.createElement('h3');
    schemeHeading.textContent = '1. Review mark scheme checklist';
    panel.appendChild(schemeHeading);
    data.markSchemePoints.forEach(function (criterion) {
      var label = document.createElement('label');
      label.className = 'w7-checkbox-label';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!state.criteria[criterion.id];
      input.addEventListener('change', function () {
        state.criteria[criterion.id] = input.checked;
        save();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + criterion.label));
      panel.appendChild(label);
    });

    field(panel, 'measure', '2. ' + data.workflowPrompts.measure, 'measure', 2);
    field(panel, 'evidence', '3. ' + data.workflowPrompts.evidence, 'evidence', 3);
    field(panel, 'justification', '4. ' + data.workflowPrompts.justification, 'justification', 3);
    field(panel, 'effectiveness', '5. ' + data.workflowPrompts.effectiveness, 'effectiveness', 3);
    field(panel, 'limitation', '6. ' + data.workflowPrompts.limitation, 'limitation', 2);
    field(panel, 'improved', '7. ' + data.workflowPrompts.improved, 'improved', 8);
    field(panel, 'next-action', data.nextActionPrompt, 'nextAction', 3);

    if (state.submittedAttempt) {
      var model = document.createElement('p');
      model.className = 'w7-callout';
      model.textContent = data.modelAfterSubmit;
      panel.appendChild(model);
    } else {
      var hold = document.createElement('p');
      hold.className = 'panel-note';
      hold.textContent =
        'A fuller improvement guidance note appears after you complete the activity.';
      panel.appendChild(hold);
    }

    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete marking and improvement';
    btn.addEventListener('click', function () {
      var messages = validate();
      var status = document.getElementById('w7-improve-status');
      if (!status) {
        status = document.createElement('div');
        status.id = 'w7-improve-status';
        status.className = 'status-messages';
        status.setAttribute('aria-live', 'polite');
        panel.appendChild(status);
      }
      status.textContent = '';
      if (messages.length) {
        messages.forEach(function (msg) {
          var p = document.createElement('p');
          p.className = 'message message-warning';
          p.textContent = msg;
          status.appendChild(p);
        });
        return;
      }
      state.submittedAttempt = true;
      save();
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
      render();
      window.Unit3Week7Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w7-submit-host',
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
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
