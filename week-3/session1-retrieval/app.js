(function () {
  'use strict';
  var data = window.Week3Session1Retrieval;
  if (!data || !window.Unit3Week3Quiz) return;
  window.Unit3Week3Quiz.createQuiz({
    activityId: data.activityId,
    questions: data.questions.slice(),
    hostId: 'w3-quiz-host',
    onComplete: function (result) {
      window.Unit3Week3Submit.renderSubmitPanel({
        activityId: data.activityId,
        hostId: 'w3-submit-host',
        getScore: function () { return result.score; },
        getTotal: function () { return result.total; },
        getQuestionsForReview: function () { return result.incorrectIndexes; },
        getCompletionTimeSeconds: function () { return result.completionTimeSeconds; },
        canSubmit: function () { return true; }
      });
    },
    onRetry: function () {
      var host = document.getElementById('w3-submit-host');
      if (host) { host.hidden = true; host.textContent = ''; }
    }
  });
})();
