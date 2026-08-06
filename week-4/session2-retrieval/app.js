(function () {
  'use strict';
  var data = window.Week4Session2Retrieval;
  if (!data || !window.Unit3Week4Quiz) return;
  window.Unit3Week4Quiz.createQuiz({
    activityId: data.activityId,
    questions: data.questions.slice(),
    hostId: 'w4-activity-host',
    onComplete: function (result) {
      window.Unit3Week4Submit.renderSubmitPanel({
        activityId: data.activityId,
        hostId: 'w4-submit-host',
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
      var host = document.getElementById('w4-submit-host');
      if (host) {
        host.hidden = true;
        host.textContent = '';
      }
    }
  });
})();
