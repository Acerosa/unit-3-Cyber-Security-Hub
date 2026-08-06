(function () {
  'use strict';

  var data = window.Week7SandboxObservation;
  var progress = window.Unit3Week7Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'sandbox-observation';
  var host = document.getElementById('w7-activity-host');
  var startedAt = Date.now();
  var answers = {};

  data.fields.forEach(function (field) {
    answers[field.id] = '';
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

  function computeScore() {
    var score = 0;
    data.fields.forEach(function (field) {
      if (String(answers[field.id] || '').trim().length >= field.minChars) {
        score += field.marks;
      }
    });
    return Math.min(data.total, Math.round(score));
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>' +
      data.activityName +
      '</h2>' +
      '<p class="message message-warning" role="alert">' +
      data.safetyNotice +
      '</p>';

    if (data.demoNotes && data.demoNotes.length) {
      var notes = document.createElement('aside');
      notes.className = 'w7-callout';
      notes.setAttribute('role', 'note');
      notes.innerHTML =
        '<strong>Tutor-led demo prompts</strong><ul class="section-list">' +
        data.demoNotes
          .map(function (item) {
            return '<li>' + item + '</li>';
          })
          .join('') +
        '</ul>';
      panel.appendChild(notes);
    }

    data.fields.forEach(function (field) {
      var wrap = document.createElement('div');
      wrap.className = 'w7-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.textContent = field.label;
      wrap.appendChild(label);
      var area = document.createElement('textarea');
      area.id = field.id;
      area.rows = 3;
      area.value = answers[field.id] || '';
      area.addEventListener('input', function () {
        answers[field.id] = area.value;
        save();
      });
      wrap.appendChild(area);
      panel.appendChild(wrap);
    });

    var status = document.createElement('div');
    status.id = 'w7-sandbox-status';
    status.className = 'status-messages';
    status.setAttribute('aria-live', 'polite');
    panel.appendChild(status);

    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete observation record';
    btn.addEventListener('click', function () {
      save();
      status.textContent = '';
      var incomplete = data.fields.filter(function (field) {
        return String(answers[field.id] || '').trim().length < field.minChars;
      });
      if (incomplete.length) {
        var warn = document.createElement('p');
        warn.className = 'message message-warning';
        warn.textContent =
          'Complete every field with enough detail. Still short: ' + incomplete[0].label;
        status.appendChild(warn);
        return;
      }
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
      var done = document.createElement('p');
      done.className = 'message message-success';
      done.textContent =
        data.completionNote + ' Score: ' + score + ' / ' + data.total + '.';
      status.appendChild(done);
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
