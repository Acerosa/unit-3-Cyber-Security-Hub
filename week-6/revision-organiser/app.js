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

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for revision-organiser fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        state: state,
        savedAt: new Date().toISOString()
      });
    }
  }

  function fieldMinChars(field) {
    return field.minLength != null ? field.minLength : 40;
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
    textFields.destroyAll();
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
        var inputId = section.id + '-' + field.id;
        textFields.mount(card, {
          wrapClass: 'w6-reflection-field',
          id: inputId,
          prompt: field.label,
          minChars: fieldMinChars(field),
          value: (state[section.id] && state[section.id][field.id]) || '',
          rows: field.id === 'practiceQuestion' ? 3 : 2,
          onChange: function (next) {
            state[section.id][field.id] = next;
            save();
          }
        });
      });
      panel.appendChild(card);
    });

    var diagnosticBlock = document.createElement('section');
    diagnosticBlock.className = 'w6-review-item';
    diagnosticBlock.innerHTML = '<h3>Diagnostic revision priorities</h3>';
    data.weakestFields.forEach(function (field) {
      textFields.mount(diagnosticBlock, {
        wrapClass: 'w6-reflection-field',
        id: field.id,
        prompt: field.label,
        minChars: fieldMinChars(field),
        value: state[field.id] || '',
        rows: 2,
        onChange: function (next) {
          state[field.id] = next;
          save();
        }
      });
    });
    data.priorityFields.forEach(function (field) {
      textFields.mount(diagnosticBlock, {
        wrapClass: 'w6-reflection-field',
        id: field.id,
        prompt: field.label,
        minChars: fieldMinChars(field),
        value: state[field.id] || '',
        rows: 2,
        onChange: function (next) {
          state[field.id] = next;
          save();
        }
      });
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
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          return data.sections.map(function (section, index) {
            var complete = sectionComplete(section);
            var payload = Object.assign(
              {
                sectionId: section.id,
                sectionCode: section.code,
                weakestTopics: [state.weakest1, state.weakest2],
                priorities: [state.priority1, state.priority2]
              },
              state[section.id] || {}
            );
            return evidence && evidence.structured
              ? evidence.structured('RO' + (index + 1), payload, {
                  responseType: 'structured',
                  correct: complete,
                  score: complete ? 1 : 0
                })
              : {
                  questionId: 'RO' + (index + 1),
                  response: payload,
                  correct: complete,
                  score: complete ? 1 : 0,
                  responseType: 'structured'
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
