(function () {
  'use strict';

  var data = window.Week6StakeholderDebate;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'stakeholder-debate';
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var state = { participationRole: '' };
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
    if (String(state.participationRole || '').trim()) marks += 1;
    data.fields.forEach(function (field) {
      if (String(state[field.id] || '').trim().length >= field.minLength) marks += 1;
    });
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    if (!String(state.participationRole || '').trim()) {
      messages.push('Select your participation role: speaker, recorder or evidence checker.');
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
      '<h2>Stakeholder debate preparation</h2>' +
      '<p class="w6-scenario">' +
      data.scenario +
      '</p>' +
      '<p class="panel-note">Completion checks that fields are present. The hub does not auto-score argument quality.</p>';

    var part = document.createElement('fieldset');
    part.className = 'w6-pair-fieldset';
    var legend = document.createElement('legend');
    legend.textContent = 'Participation role';
    part.appendChild(legend);
    data.participationRoles.forEach(function (role) {
      var label = document.createElement('label');
      label.className = 'w6-checkbox-label';
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'participation-role';
      input.value = role.id;
      input.checked = state.participationRole === role.id;
      input.addEventListener('change', function () {
        state.participationRole = role.id;
        save();
      });
      label.appendChild(input);
      label.appendChild(
        document.createTextNode(' ' + role.label + ': ' + role.description)
      );
      part.appendChild(label);
    });
    panel.appendChild(part);

    var rolesNote = document.createElement('p');
    rolesNote.className = 'panel-note';
    rolesNote.textContent =
      'Stakeholder roles for debate: ' + data.stakeholderRoles.join(', ') + '.';
    panel.appendChild(rolesNote);

    data.fields.forEach(function (item) {
      field(panel, item.id, item.label, item.id, item.id === 'opening' ? 3 : 4);
    });

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete debate preparation';
    btn.addEventListener('click', function () {
      var messages = validate();
      var status = document.getElementById('w6-debate-status');
      if (!status) {
        status = document.createElement('div');
        status.id = 'w6-debate-status';
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
        '<p class="message message-success">Debate preparation completed (' +
        score +
        ' / ' +
        data.total +
        ').</p>';
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
          return JSON.stringify({ participationRole: state.participationRole });
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var items = [
            {
              id: 'SD0',
              value: state.participationRole,
              complete: Boolean(String(state.participationRole || '').trim())
            }
          ];
          data.fields.forEach(function (field, index) {
            items.push({
              id: 'SD' + (index + 1),
              value: state[field.id] || '',
              complete: String(state[field.id] || '').trim().length >= field.minLength
            });
          });
          return items.map(function (item) {
            return evidence && evidence.freeText
              ? evidence.freeText(item.id, item.value, {
                  responseType: 'text',
                  correct: item.complete,
                  score: item.complete ? 1 : 0
                })
              : {
                  questionId: item.id,
                  response: item.value,
                  correct: item.complete,
                  score: item.complete ? 1 : 0,
                  responseType: 'text'
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
