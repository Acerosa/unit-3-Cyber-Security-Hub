(function () {
  'use strict';

  var data = window.Week5Session2Retrieval;
  if (!data || !window.Unit3Week5Quiz) return;

  window.Unit3Week5Quiz.createQuiz({
    activityId: data.activityId,
    questions: data.questions.slice(),
    hostId: 'w5-activity-host',
    onComplete: function (result) {
      window.Unit3Week5Submit.renderSubmitPanel({
        activityId: data.activityId,
        hostId: 'w5-submit-host',
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
      var submit = document.getElementById('w5-submit-host');
      if (submit) {
        submit.hidden = true;
        submit.textContent = '';
      }
    }
  });
})();
