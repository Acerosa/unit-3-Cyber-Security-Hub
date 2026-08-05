(function () {
  'use strict';

  var data = window.Week2Session2Retrieval;

  if (!data || !window.Unit3Week2Quiz) {
    return;
  }

  window.Unit3Week2Quiz.createQuiz({
    activityId: data.activityId,
    questions: data.questions.slice(),
    onComplete: function (result) {
      window.Unit3Week2Submit.renderSubmitPanel({
        activityId: data.activityId,
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
      var host = document.getElementById('w2-submit-host');
      if (host) {
        host.hidden = true;
        host.textContent = '';
      }
    }
  });
})();
