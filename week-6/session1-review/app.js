(function () {
  'use strict';

  var data = window.Week6Session1Review;
  if (!data || !window.Unit3Week6Quiz) return;

  var startedAt = Date.now();

  window.Unit3Week6Quiz.createQuiz({
    activityId: data.activityId,
    questions: data.questions.slice(),
    hostId: 'w6-activity-host',
    onComplete: function (result) {
      var host = document.getElementById('w6-activity-host');
      if (host) {
        var note = document.createElement('p');
        note.className = 'w6-callout panel-note';
        note.textContent = data.intro;
        host.appendChild(note);
      }
      window.Unit3Week6Submit.renderSubmitPanel({
        activityId: data.activityId,
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
          return result.completionTimeSeconds;
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
})();
