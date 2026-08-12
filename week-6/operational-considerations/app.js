(function () {
  'use strict';

  var data = window.Week6OperationalConsiderations;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'operational-considerations';
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var answers = { measure: data.measurePrompt };

  data.formFields.forEach(function (field) {
    if (!answers[field.id]) answers[field.id] = '';
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      answers = Object.assign(answers, draft.answers || {});
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        answers: answers,
        savedAt: new Date().toISOString()
      });
    }
  }

  function fieldScore(fieldId) {
    return String(answers[fieldId] || '').trim().length >= 12 ? 1 : 0;
  }

  function computeScore() {
    var scoredFields = [
      'financial',
      'staffTime',
      'downtime',
      'usability',
      'productivity',
      'workaround',
      'proportionate'
    ];
    return scoredFields.reduce(function (sum, id) {
      return sum + fieldScore(id);
    }, 0);
  }

  function validate() {
    var messages = [];
    data.formFields.forEach(function (field) {
      if (field.required && String(answers[field.id] || '').trim().length < 12) {
        messages.push('Complete: ' + field.label);
      }
    });
    return messages;
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel w6-operational';
    panel.innerHTML =
      '<h2><span class="w6-dimension-label w6-operational">Operational</span> Security measure analysis</h2>' +
      '<p class="panel-note">' +
      data.intro +
      '</p>' +
      '<h3>Operational factors to consider</h3>' +
      '<ul class="section-list">' +
      data.factors
        .map(function (factor) {
          return (
            '<li><strong>' +
            factor.label +
            ':</strong> ' +
            factor.description +
            '</li>'
          );
        })
        .join('') +
      '</ul>';

    data.formFields.forEach(function (field) {
      var wrap = document.createElement('div');
      wrap.className = 'w6-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.textContent = field.label + (field.required ? ' (required)' : '');
      wrap.appendChild(label);
      var area = document.createElement('textarea');
      area.id = field.id;
      area.rows = field.rows || 3;
      area.value = answers[field.id] || '';
      area.addEventListener('input', function () {
        answers[field.id] = area.value;
        save();
      });
      wrap.appendChild(area);
      panel.appendChild(wrap);
    });

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete operational analysis';
    btn.addEventListener('click', function () {
      var messages = validate();
      var status = document.createElement('div');
      status.className = 'status-messages';
      status.setAttribute('aria-live', 'polite');
      if (messages.length) {
        status.innerHTML = messages
          .map(function (msg) {
            return '<p class="message message-warning">' + msg + '</p>';
          })
          .join('');
        panel.appendChild(status);
        return;
      }
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
      status.innerHTML =
        '<p class="message message-success">Analysis completed (' +
        score +
        ' / ' +
        data.total +
        ').</p>';
      panel.appendChild(status);
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
          return answers.proportionate || '';
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var fields = [
            'financial',
            'staffTime',
            'downtime',
            'usability',
            'productivity',
            'workaround',
            'proportionate'
          ];
          return fields.map(function (fieldId, index) {
            var value = answers[fieldId] || '';
            var complete = fieldScore(fieldId) === 1;
            return evidence && evidence.freeText
              ? evidence.freeText('OC' + (index + 1), value, {
                  responseType: 'text',
                  correct: complete,
                  score: complete ? 1 : 0
                })
              : {
                  questionId: 'OC' + (index + 1),
                  response: value,
                  correct: complete,
                  score: complete ? 1 : 0,
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
