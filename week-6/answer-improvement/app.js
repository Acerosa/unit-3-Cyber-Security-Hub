(function () {
  'use strict';

  var data = window.Week6AnswerImprovement;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'answer-improvement';
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var state = {
    criteria: {},
    rewrite: '',
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
    if (String(state.rewrite || '').trim().length >= 25) marks += 1;
    if (String(state.improved || '').trim().length >= 50) marks += 1;
    if (String(state.nextAction || '').trim().length >= 15) marks += 1;
    var improved = String(state.improved || '').toLowerCase();
    if (improved.indexOf('concession') !== -1 || improved.indexOf('however') !== -1) {
      marks += 1;
    }
    var rewrite = String(state.rewrite || '').toLowerCase();
    if (
      rewrite.indexOf('data protection') !== -1 ||
      rewrite.indexOf('computer misuse') !== -1 ||
      rewrite.indexOf('ethical') !== -1
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
    if (String(state.rewrite || '').trim().length < 25) {
      messages.push('Rewrite the weakest sentence.');
    }
    if (String(state.improved || '').trim().length < 50) {
      messages.push('Write an improved extended Discuss response.');
    }
    if (String(state.nextAction || '').trim().length < 15) {
      messages.push('Add one next-exam action.');
    }
    return messages;
  }

  function field(parent, id, labelText, key, rows) {
    var wrap = document.createElement('div');
    wrap.className = 'w6-reflection-field';
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
      '<p class="w6-callout" role="note"><strong>Common Week 6 slip:</strong> ' +
      data.commonError +
      '</p>';

    var sample = document.createElement('blockquote');
    sample.className = 'w6-scenario w6-weak-response';
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
    schemeHeading.textContent = 'Self-mark checklist';
    panel.appendChild(schemeHeading);
    data.markSchemePoints.forEach(function (criterion) {
      var label = document.createElement('label');
      label.className = 'w6-checkbox-label';
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

    field(panel, 'rewrite', data.rewritePrompt, 'rewrite', 4);
    field(panel, 'improved', data.improvePrompt, 'improved', 8);
    field(panel, 'next-action', data.nextActionPrompt, 'nextAction', 3);

    if (state.submittedAttempt) {
      var model = document.createElement('p');
      model.className = 'w6-callout';
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
    actions.className = 'w6-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete marking and improvement';
    btn.addEventListener('click', function () {
      var messages = validate();
      var status = document.getElementById('w6-improve-status');
      if (!status) {
        status = document.createElement('div');
        status.id = 'w6-improve-status';
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
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var selected = Object.keys(state.criteria).filter(function (key) {
            return state.criteria[key];
          });
          var improved = String(state.improved || '');
          var rewrite = String(state.rewrite || '');
          var items = [
            { id: 'AI1', value: { selectedCriteria: selected }, complete: selected.length >= 3 },
            { id: 'AI2', value: rewrite, complete: rewrite.trim().length >= 25 },
            { id: 'AI3', value: improved, complete: improved.trim().length >= 50 },
            { id: 'AI4', value: state.nextAction || '', complete: String(state.nextAction || '').trim().length >= 15 },
            { id: 'AI5', value: improved, complete: /concession|however/i.test(improved) },
            { id: 'AI6', value: rewrite, complete: /data protection|computer misuse|ethical/i.test(rewrite) }
          ];
          return items.map(function (item) {
            return evidence && evidence.structured
              ? evidence.structured(item.id, item.value, {
                  responseType: typeof item.value === 'string' ? 'text' : 'structured',
                  correct: item.complete,
                  score: item.complete ? 1 : 0
                })
              : {
                  questionId: item.id,
                  response: item.value,
                  correct: item.complete,
                  score: item.complete ? 1 : 0,
                  responseType: typeof item.value === 'string' ? 'text' : 'structured'
                };
          });
        },
        getStartedAt: function () {
          return new Date(startedAt).toISOString();
        },
        getCompletedAt: function () {
          return new Date().toISOString();
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
