(function () {
  'use strict';

  var data = window.Week6LegislationRetrieval;
  if (!data || !window.Unit3Week6Quiz) return;
  var startedAt = Date.now();

  window.Unit3Week6Quiz.createQuiz({
    activityId: data.activityId,
    questions: data.questions.slice(),
    hostId: 'w6-activity-host',
    onComplete: function (result) {
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
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          return (result.answers || []).map(function (answer, index) {
            var question = data.questions[index];
            var questionId = 'LR' + (index + 1);
            if (evidence && evidence.structured) {
              return evidence.structured(
                questionId,
                {
                  chosenIndex: answer.chosenIndex,
                  selectedOption: question.options[answer.chosenIndex]
                },
                {
                  responseType: 'single-choice',
                  correct: Boolean(answer.correct),
                  score: answer.correct ? 1 : 0
                }
              );
            }
            return {
              questionId: questionId,
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
})();
