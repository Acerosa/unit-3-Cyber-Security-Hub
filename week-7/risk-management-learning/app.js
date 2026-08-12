(function () {
  'use strict';

  var data = window.Week7RiskManagementLearning;
  var progress = window.Unit3Week7Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var host = document.getElementById('w7-activity-host');
  var startedAt = Date.now();
  var mode = 'cards';
  var cardIndex = 0;

  if (progress) progress.markStarted(ACTIVITY_ID);

  function escapeText(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    if (mode === 'cards') renderCards();
    else renderCheck();
  }

  function renderCards() {
    var stage = data.stages[cardIndex];
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<p class="panel-note" aria-live="polite">Risk-management stage ' +
      (cardIndex + 1) +
      ' of ' +
      data.stages.length +
      '</p>' +
      '<p class="w7-callout" role="note">' +
      escapeText(data.teachingNote) +
      '</p>';

    var card = document.createElement('article');
    card.className = 'w7-def-card';
    card.innerHTML =
      '<h2>' +
      escapeText(stage.title) +
      '</h2>' +
      '<p><strong>What you do:</strong> ' +
      escapeText(stage.summary) +
      '</p>' +
      '<p><strong>Northbank example:</strong> ' +
      escapeText(stage.northbankExample) +
      '</p>' +
      '<p class="panel-note">' +
      escapeText(stage.teachingPoint) +
      '</p>';
    panel.appendChild(card);

    if (cardIndex === data.stages.length - 1 || stage.id === 'decide-treatment') {
      var accept = document.createElement('aside');
      accept.className = 'w7-callout';
      accept.setAttribute('role', 'note');
      accept.innerHTML =
        '<strong>' +
        escapeText(data.acceptWorkedExample.title) +
        ':</strong> ' +
        escapeText(data.acceptWorkedExample.text);
      panel.appendChild(accept);
    }

    var treatments = document.createElement('div');
    treatments.className = 'w7-def-grid';
    data.treatments.forEach(function (item) {
      var t = document.createElement('article');
      t.className = 'w7-def-card';
      t.innerHTML =
        '<h3>' + escapeText(item.name) + '</h3><p>' + escapeText(item.meaning) + '</p>';
      treatments.appendChild(t);
    });
    panel.appendChild(treatments);

    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'btn btn-secondary';
    prev.textContent = 'Previous stage';
    prev.disabled = cardIndex === 0;
    prev.addEventListener('click', function () {
      cardIndex -= 1;
      render();
    });
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'btn btn-primary';
    next.textContent =
      cardIndex === data.stages.length - 1
        ? 'Knowledge check (8 marks)'
        : 'Next stage';
    next.addEventListener('click', function () {
      if (cardIndex === data.stages.length - 1) mode = 'check';
      else cardIndex += 1;
      render();
    });
    actions.appendChild(prev);
    actions.appendChild(next);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderCheck() {
    host.textContent = '';
    if (!window.Unit3Week7Quiz) return;
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
          getResponses: function () {
            var evidence = window.Unit3SupabaseEvidence;
            var questions = data.knowledgeCheck.map(function (question, index) {
              return Object.assign({}, question, { id: 'RM' + (index + 1) });
            });
            return evidence.fromQuizResult(result, questions);
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

  render();
})();
