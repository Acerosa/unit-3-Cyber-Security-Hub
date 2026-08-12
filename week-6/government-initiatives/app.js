(function () {
  'use strict';

  var data = window.Week6GovernmentInitiatives;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var mode = 'learn';

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
    if (mode === 'learn') renderLearn();
    else renderQuiz();
  }

  function renderLearn() {
    var panel = document.createElement('section');
    panel.className = 'panel';
    var heading = document.createElement('h2');
    heading.textContent = 'Government cyber security initiatives';
    panel.appendChild(heading);
    var note = document.createElement('p');
    note.className = 'panel-note';
    note.textContent = data.teachingNote;
    panel.appendChild(note);

    var grid = document.createElement('div');
    grid.className = 'w6-def-grid';
    data.initiatives.forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'w6-def-card';
      card.innerHTML =
        '<h3>' +
        escapeText(item.name) +
        '</h3><p><strong>Purpose:</strong> ' +
        escapeText(item.purpose) +
        '</p>';
      grid.appendChild(card);
    });
    panel.appendChild(grid);

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Comparison quiz (4 marks)';
    btn.addEventListener('click', function () {
      mode = 'quiz';
      render();
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderQuiz() {
    if (!window.Unit3Week6Quiz) return;
    window.Unit3Week6Quiz.createQuiz({
      activityId: ACTIVITY_ID,
      questions: data.comparisonQuiz.slice(),
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
              ? evidence.fromQuizResult(result, data.comparisonQuiz)
              : (result.answers || []).map(function (answer, index) {
                  return {
                    questionId: data.comparisonQuiz[index].id,
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
