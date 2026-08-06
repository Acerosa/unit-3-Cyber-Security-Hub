(function () {
  'use strict';

  var data = window.Week6RevisionOrganiser;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'revision-organiser';
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var state = {};

  data.sections.forEach(function (section) {
    state[section.id] = {};
    section.fields.forEach(function (field) {
      state[section.id][field.id] = '';
    });
  });
  data.weakestFields.forEach(function (field) {
    state[field.id] = '';
  });
  data.priorityFields.forEach(function (field) {
    state[field.id] = '';
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      Object.keys(draft.state || {}).forEach(function (key) {
        if (typeof draft.state[key] === 'object' && draft.state[key]) {
          state[key] = Object.assign(state[key] || {}, draft.state[key]);
        } else {
          state[key] = draft.state[key];
        }
      });
    }
    var diagnostic = progress.getDraft(data.diagnosticDraftKey);
    if (diagnostic && diagnostic.revisionPriorities) {
      var labels =
        (window.Week6Lo2Diagnostic && window.Week6Lo2Diagnostic.topicLabels) || {};
      if (!String(state.weakest1 || '').trim() && diagnostic.revisionPriorities.topic1) {
        state.weakest1 =
          labels[diagnostic.revisionPriorities.topic1] || diagnostic.revisionPriorities.topic1;
      }
      if (!String(state.weakest2 || '').trim() && diagnostic.revisionPriorities.topic2) {
        state.weakest2 =
          labels[diagnostic.revisionPriorities.topic2] || diagnostic.revisionPriorities.topic2;
      }
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

  function sectionComplete(section) {
    var row = state[section.id] || {};
    for (var i = 0; i < section.fields.length; i += 1) {
      var field = section.fields[i];
      if (String(row[field.id] || '').trim().length < field.minLength) return false;
    }
    return true;
  }

  function computeScore() {
    var marks = 0;
    data.sections.forEach(function (section) {
      if (sectionComplete(section)) marks += 1;
    });
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    data.sections.forEach(function (section) {
      if (!sectionComplete(section)) {
        messages.push('Complete all fields for section ' + section.code + ' ' + section.title + '.');
      }
    });
    data.weakestFields.forEach(function (field) {
      if (String(state[field.id] || '').trim().length < field.minLength) {
        messages.push('Complete: ' + field.label);
      }
    });
    data.priorityFields.forEach(function (field) {
      if (String(state[field.id] || '').trim().length < field.minLength) {
        messages.push('Complete: ' + field.label);
      }
    });
    return messages.slice(0, 8);
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>LO2 revision organiser</h2>' +
      '<p class="panel-note">Work across sections 2.1 to 2.6. Weakest topics prefill from your LO2 diagnostic draft when available.</p>';

    data.sections.forEach(function (section) {
      var card = document.createElement('section');
      card.className = 'w6-review-item';
      card.innerHTML = '<h3>Section ' + section.code + ': ' + section.title + '</h3>';
      section.fields.forEach(function (field) {
        var wrap = document.createElement('div');
        wrap.className = 'w6-reflection-field';
        var label = document.createElement('label');
        var inputId = section.id + '-' + field.id;
        label.setAttribute('for', inputId);
        label.textContent = field.label;
        wrap.appendChild(label);
        var area = document.createElement('textarea');
        area.id = inputId;
        area.rows = field.id === 'practiceQuestion' ? 3 : 2;
        area.value = (state[section.id] && state[section.id][field.id]) || '';
        area.addEventListener('input', function () {
          state[section.id][field.id] = area.value;
          save();
        });
        wrap.appendChild(area);
        card.appendChild(wrap);
      });
      panel.appendChild(card);
    });

    var diagnosticBlock = document.createElement('section');
    diagnosticBlock.className = 'w6-review-item';
    diagnosticBlock.innerHTML = '<h3>Diagnostic revision priorities</h3>';
    data.weakestFields.forEach(function (field) {
      var wrap = document.createElement('div');
      wrap.className = 'w6-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.textContent = field.label;
      wrap.appendChild(label);
      var area = document.createElement('textarea');
      area.id = field.id;
      area.rows = 2;
      area.value = state[field.id] || '';
      area.addEventListener('input', function () {
        state[field.id] = area.value;
        save();
      });
      wrap.appendChild(area);
      diagnosticBlock.appendChild(wrap);
    });
    data.priorityFields.forEach(function (field) {
      var wrap = document.createElement('div');
      wrap.className = 'w6-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.textContent = field.label;
      wrap.appendChild(label);
      var area = document.createElement('textarea');
      area.id = field.id;
      area.rows = 2;
      area.value = state[field.id] || '';
      area.addEventListener('input', function () {
        state[field.id] = area.value;
        save();
      });
      wrap.appendChild(area);
      diagnosticBlock.appendChild(wrap);
    });
    panel.appendChild(diagnosticBlock);

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete revision organiser';
    btn.addEventListener('click', function () {
      var messages = validate();
      var status = document.getElementById('w6-revision-status');
      if (!status) {
        status = document.createElement('div');
        status.id = 'w6-revision-status';
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
        '<p class="message message-success">Revision organiser completed (' +
        score +
        ' / ' +
        data.total +
        ' sections).</p>';
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
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
