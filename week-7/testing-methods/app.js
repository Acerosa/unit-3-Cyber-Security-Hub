(function () {
  'use strict';

  var data = window.Week7TestingMethods;
  var progress = window.Unit3Week7Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'testing-methods';
  var host = document.getElementById('w7-activity-host');
  var startedAt = Date.now();
  var mode = 'cards';
  var openId = data.methods[0].id;
  var reflections = {};

  data.methods.forEach(function (method) {
    reflections[method.id] = '';
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      reflections = Object.assign(reflections, draft.reflections || {});
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        reflections: reflections,
        savedAt: new Date().toISOString()
      });
    }
  }

  function renderCards() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>' +
      data.activityName +
      '</h2><p class="panel-note">' +
      data.intro +
      '</p>';

    data.methods.forEach(function (method) {
      var details = document.createElement('details');
      details.className = 'w7-def-card';
      details.open = openId === method.id;
      details.addEventListener('toggle', function () {
        if (details.open) openId = method.id;
      });
      var summary = document.createElement('summary');
      summary.textContent = method.name;
      details.appendChild(summary);

      var body = document.createElement('div');
      body.innerHTML =
        '<p><strong>Purpose:</strong> ' +
        method.purpose +
        '</p>' +
        '<p><strong>May reveal:</strong> ' +
        method.mayReveal +
        '</p>' +
        '<p><strong>May miss:</strong> ' +
        method.mayMiss +
        '</p>' +
        '<p><strong>Appropriate situation:</strong> ' +
        method.appropriate +
        '</p>' +
        '<p><strong>Limitation:</strong> ' +
        method.limitation +
        '</p>' +
        '<p class="w7-misconception"><strong>Watch:</strong> ' +
        method.misconception +
        '</p>';
      details.appendChild(body);

      var wrap = document.createElement('div');
      wrap.className = 'w7-reflection-field';
      var label = document.createElement('label');
      var fieldId = 'reflect-' + method.id;
      label.setAttribute('for', fieldId);
      label.textContent =
        'Optional reflection: when would this method help Northbank, and what would it not prove?';
      wrap.appendChild(label);
      var area = document.createElement('textarea');
      area.id = fieldId;
      area.rows = 3;
      area.value = reflections[method.id] || '';
      area.addEventListener('input', function () {
        reflections[method.id] = area.value;
        save();
      });
      wrap.appendChild(area);
      details.appendChild(wrap);
      panel.appendChild(details);
    });


    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Knowledge check (8 marks)';
    btn.addEventListener('click', function () {
      save();
      mode = 'check';
      renderCheck();
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderCheck() {
    if (!host || !window.Unit3Week7Quiz) return;
    host.textContent = '';
    window.Unit3Week7Quiz.createQuiz({
      activityId: ACTIVITY_ID,
      questions: data.knowledgeCheck.slice(),
      hostId: 'w7-activity-host',
      onComplete: function (result) {
        window.Unit3Week7Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w7-submit-host',
          getScore: function () {
            return result.score;
          },
          getTotal: function () {
            return data.total;
          },
          getQuestionsForReview: function () {
            return result.incorrectIndexes;
          },
          getCompletionTimeSeconds: function () {
            return (
              result.completionTimeSeconds ||
              Math.max(1, Math.round((Date.now() - startedAt) / 1000))
            );
          },
          canSubmit: function () {
            return true;
          }
        });
      },
      onRetry: function () {
        var submit = document.getElementById('w7-submit-host');
        if (submit) {
          submit.hidden = true;
          submit.textContent = '';
        }
      }
    });
  }

  if (mode === 'check') renderCheck();
  else renderCards();
})();
