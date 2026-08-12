(function () {
  'use strict';

  var data = window.Week6LegislationLearning;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var host = document.getElementById('w6-activity-host');
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
    var law = data.laws[cardIndex];
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<p class="panel-note" aria-live="polite">Legislation card ' +
      (cardIndex + 1) +
      ' of ' +
      data.laws.length +
      '</p>' +
      '<p class="w6-callout" role="note">' +
      escapeText(data.teachingNote) +
      '</p>';

    var card = document.createElement('article');
    card.className = 'w6-legislation-card w6-legal';
    card.innerHTML =
      '<h3><span class="w6-dimension-label w6-legal">Legal</span> ' +
      escapeText(law.formalName) +
      '</h3>' +
      '<p><strong>Purpose:</strong> ' +
      escapeText(law.purpose) +
      '</p>' +
      '<p><strong>Relevant duty or offence:</strong> ' +
      escapeText(law.dutyOffence) +
      '</p>' +
      '<p><strong>Northbank application:</strong> ' +
      escapeText(law.northbankApplication) +
      '</p>' +
      '<p class="w6-misconception"><strong>Misconception warning:</strong> ' +
      escapeText(law.misconception) +
      '</p>';
    panel.appendChild(card);

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'btn btn-secondary';
    prev.textContent = 'Previous card';
    prev.disabled = cardIndex === 0;
    prev.addEventListener('click', function () {
      cardIndex -= 1;
      render();
    });
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'btn btn-primary';
    next.textContent =
      cardIndex === data.laws.length - 1 ? 'Knowledge check (6 marks)' : 'Next card';
    next.addEventListener('click', function () {
      if (cardIndex === data.laws.length - 1) mode = 'check';
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
    if (!window.Unit3Week6Quiz) return;
    window.Unit3Week6Quiz.createQuiz({
      activityId: ACTIVITY_ID,
      questions: data.knowledgeCheck.slice(),
      hostId: 'w6-activity-host',
      onComplete: function (result) {
        window.Unit3Week6Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w6-submit-host',
          getScore: function () {
            return result.score;
          },
          getTotal: function () {
            return result.total;
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
            return evidence && evidence.fromQuizResult
              ? evidence.fromQuizResult(result, data.knowledgeCheck)
              : (result.answers || []).map(function (answer, index) {
                  return {
                    questionId: data.knowledgeCheck[index].id,
                    response: { chosenIndex: answer.chosenIndex },
                    correct: Boolean(answer.correct),
                    score: answer.correct ? 1 : 0,
                    responseType: 'single-choice'
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
      },
      onRetry: function () {
        var submit = document.getElementById('w6-submit-host');
        if (submit) {
          submit.hidden = true;
          submit.textContent = '';
        }
      }
    });
  }

  render();
})();
