(function () {
  'use strict';

  var data = window.Week6EmployeeMonitoring;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'employee-monitoring';
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var state = { role: '' };
  data.fields.forEach(function (field) {
    state[field.id] = '';
  });

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
    if (String(state.role || '').trim()) marks += 1;
    data.fields.forEach(function (field) {
      if (String(state[field.id] || '').trim().length >= field.minLength) marks += 1;
    });
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    if (!String(state.role || '').trim()) {
      messages.push('Select a stakeholder role.');
    }
    data.fields.forEach(function (field) {
      if (String(state[field.id] || '').trim().length < field.minLength) {
        messages.push('Complete: ' + field.label);
      }
    });
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
    area.rows = rows || 4;
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
      '<h2>Northbank employee monitoring scenario</h2>' +
      '<p class="w6-scenario">' +
      data.scenario +
      '</p>' +
      '<p class="w6-callout" role="note">' +
      data.instructions +
      '</p>' +
      '<p class="panel-note"><strong>Optional starters:</strong> ' +
      data.sentenceStarters.join(' ') +
      '</p>';

    var roleWrap = document.createElement('div');
    roleWrap.className = 'w6-reflection-field';
    var roleLabel = document.createElement('label');
    roleLabel.setAttribute('for', 'stakeholder-role');
    roleLabel.textContent = 'Select your stakeholder role';
    roleWrap.appendChild(roleLabel);
    var select = document.createElement('select');
    select.id = 'stakeholder-role';
    var empty = document.createElement('option');
    empty.value = '';
    empty.textContent = 'Choose a role…';
    select.appendChild(empty);
    data.stakeholderRoles.forEach(function (role) {
      var opt = document.createElement('option');
      opt.value = role.id;
      opt.textContent = role.label;
      if (state.role === role.id) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', function () {
      state.role = select.value;
      save();
    });
    roleWrap.appendChild(select);
    panel.appendChild(roleWrap);

    data.promptGroups.forEach(function (group) {
      var block = document.createElement('section');
      block.className = 'w6-review-item';
      block.innerHTML = '<h3>' + group.label + '</h3><ul class="section-list">';
      group.questions.forEach(function (q) {
        block.innerHTML += '<li>' + q + '</li>';
      });
      block.innerHTML += '</ul>';
      panel.appendChild(block);
    });

    var response = document.createElement('section');
    response.className = 'w6-review-item';
    response.innerHTML = '<h3>Your stakeholder position</h3>';
    data.fields.forEach(function (item) {
      field(response, item.id, item.label, item.id, 4);
    });
    panel.appendChild(response);

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete scenario preparation';
    btn.addEventListener('click', function () {
      var messages = validate();
      var status = document.getElementById('w6-monitoring-status');
      if (!status) {
        status = document.createElement('div');
        status.id = 'w6-monitoring-status';
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
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
      status.innerHTML =
        '<p class="message message-success">Scenario preparation completed (' +
        score +
        ' / ' +
        data.total +
        '). Bring this position to the classroom debate. This activity does not decide the outcome for Northbank.</p>';
      window.Unit3Week6Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w6-submit-host',
        getScore: function () {
          return score;
        },
        getTotal: function () {
          return data.total;
        },
        getReflection: function () {
          return JSON.stringify({ role: state.role });
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var items = [
            {
              id: 'EM0',
              value: state.role,
              complete: Boolean(String(state.role || '').trim()),
              type: 'single-choice'
            }
          ];
          data.fields.forEach(function (field, index) {
            items.push({
              id: 'EM' + (index + 1),
              value: state[field.id] || '',
              complete: String(state[field.id] || '').trim().length >= field.minLength,
              type: 'text'
            });
          });
          return items.map(function (item) {
            return evidence && evidence.freeText
              ? evidence.freeText(item.id, item.value, {
                  responseType: item.type,
                  correct: item.complete,
                  score: item.complete ? 1 : 0
                })
              : {
                  questionId: item.id,
                  response: item.value,
                  correct: item.complete,
                  score: item.complete ? 1 : 0,
                  responseType: item.type
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
