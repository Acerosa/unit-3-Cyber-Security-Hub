(function () {
  'use strict';

  var data = window.Week2Session1Retrieval;
  var quizApi = null;
  var resultMeta = null;
  var startedAt = new Date().toISOString();

  if (!data || !window.Unit3Week2Quiz) {
    return;
  }

  quizApi = window.Unit3Week2Quiz.createQuiz({
    activityId: data.activityId,
    questions: data.questions.slice(),
    onComplete: function (result) {
      resultMeta = result;
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
        // Supabase-only: per-question response evidence for api.submit_attempt.
        // The RPC computes the authoritative score; awarded_score is only a
        // hint kept alongside the heterogeneous evidence blob.
        getResponses: function () {
          return (result.answers || []).map(function (answer, index) {
            var question = data.questions[index] || {};
            return {
              questionId: question.id || answer.questionId,
              response: {
                chosenIndex: answer.chosenIndex,
                selectedOption:
                  typeof answer.chosenIndex === 'number' && question.options
                    ? question.options[answer.chosenIndex]
                    : null
              },
              correct: Boolean(answer.correct),
              score: answer.correct ? 1 : 0,
              responseType: 'single-choice'
            };
          });
        },
        getStartedAt: function () {
          return startedAt;
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
      resultMeta = null;
      startedAt = new Date().toISOString();
      var host = document.getElementById('w2-submit-host');
      if (host) {
        host.hidden = true;
        host.textContent = '';
      }
    }
  });
})();
