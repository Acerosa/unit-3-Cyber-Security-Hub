(function () {
  'use strict';

  var data = window.Week5ExerciseDebrief;
  var progress = window.Unit3Week5Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'exercise-debrief';
  var host = document.getElementById('w5-activity-host');
  var startedAt = new Date().toISOString();
  var answers = {};

  data.prompts.forEach(function (prompt) {
    answers[prompt.id] = '';
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      answers = Object.assign(answers, draft.answers || {});
    }
    var companion = progress.getDraft('ransomware-companion');
    if (companion && companion.state && companion.state.decisions) {
      answers._companionSnapshot = companion.state.decisions;
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

  function computeScore() {
    var marks = 0;
    ['impactReduced', 'stakeholderBenefit', 'timescale', 'negativeEffect'].forEach(function (id) {
      if (String(answers[id] || '').trim().length >= 20) marks += 1;
    });
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    data.prompts.forEach(function (prompt) {
      if (String(answers[prompt.id] || '').trim().length < 20) {
        messages.push('Complete: ' + prompt.label);
      }
    });
    return messages;
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Exercise debrief</h2>' +
      '<p class="panel-note">' +
      data.intro +
      '</p>' +
      '<p class="w5-callout" role="note">' +
      data.globalIssueNote +
      '</p>' +
      '<p class="panel-note"><strong>Optional sentence starters:</strong> ' +
      data.sentenceStarters.join(' ') +
      '</p>';

    if (answers._companionSnapshot && answers._companionSnapshot.length) {
      var snap = document.createElement('section');
      snap.className = 'w5-review-item';
      snap.innerHTML = '<h3>Decisions from your companion record</h3>';
      answers._companionSnapshot.forEach(function (row, index) {
        if (!row || !row.decision) return;
        var p = document.createElement('p');
        p.textContent =
          index +
          1 +
          '. ' +
          row.decision +
          ' → intended to reduce: ' +
          (row.impactReduced || '—') +
          ' (' +
          (row.impactCategory || '—') +
          ')';
        snap.appendChild(p);
      });
      panel.appendChild(snap);
    } else {
      var missing = document.createElement('p');
      missing.className = 'message message-warning';
      missing.textContent =
        'No companion decision record was found in this browser yet. You can still complete the debrief from notes taken during the facilitated exercise.';
      panel.appendChild(missing);
    }

    data.prompts.forEach(function (prompt) {
      var wrap = document.createElement('div');
      wrap.className = 'w5-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', prompt.id);
      label.textContent = prompt.label;
      wrap.appendChild(label);
      var area = document.createElement('textarea');
      area.id = prompt.id;
      area.rows = prompt.rows;
      area.value = answers[prompt.id] || '';
      area.addEventListener('input', function () {
        answers[prompt.id] = area.value;
        save();
      });
      wrap.appendChild(area);
      panel.appendChild(wrap);
    });

    var actions = document.createElement('div');
    actions.className = 'w5-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete debrief';
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
        '<p class="message message-success">Debrief completed (' +
        score +
        ' / ' +
        data.total +
        ').</p>';
      panel.appendChild(status);
      window.Unit3Week5Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w5-submit-host',
        getScore: function () {
          return score;
        },
        getTotal: function () {
          return data.total;
        },
        getReflection: function () {
          return JSON.stringify(answers);
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - Date.parse(startedAt)) / 1000));
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var map = [
            { id: 'DB1', key: 'impactReduced' },
            { id: 'DB2', key: 'stakeholderBenefit' },
            { id: 'DB3', key: 'timescale' },
            { id: 'DB4', key: 'negativeEffect' }
          ];
          return map.map(function (item) {
            var value = answers[item.key] || '';
            if (item.id === 'DB4' && answers.globalLink) {
              value = {
                negativeEffect: answers.negativeEffect || '',
                globalLink: answers.globalLink || ''
              };
              if (evidence && evidence.structured) {
                return evidence.structured(item.id, value, {
                  correct: String(answers.negativeEffect || '').trim().length >= 20,
                  score: 1
                });
              }
              return {
                questionId: item.id,
                response: value,
                responseType: 'structured',
                correct: true,
                score: 1
              };
            }
            if (evidence && evidence.freeText) {
              return evidence.freeText(item.id, value, {
                correct: String(value || '').trim().length >= 20,
                score: 1
              });
            }
            return {
              questionId: item.id,
              response: value,
              responseType: 'text',
              correct: true,
              score: 1
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
