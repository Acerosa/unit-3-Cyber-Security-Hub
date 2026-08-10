(function () {

  'use strict';

  var startedAt = new Date().toISOString();



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


        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          if (evidence && evidence.fromQuizResult) {
            return evidence.fromQuizResult(result, data.questions);
          }
          return (result.answers || []).map(function (answer, index) {
            var question = (data.questions)[index] || {};
            return {
              questionId: question.id || answer.questionId,
              response: { chosenIndex: answer.chosenIndex },
              correct: Boolean(answer.correct),
              score: answer.correct ? 1 : 0,
              responseType: 'single-choice'
            };
          });
        },
        getStartedAt: function () { return startedAt; },
        getCompletedAt: function () { return new Date().toISOString(); },
        canSubmit: function () {

          return true;

        }

      });

    },

    onRetry: function () {
      startedAt = new Date().toISOString();

      var host = document.getElementById('w2-submit-host');

      if (host) {

        host.hidden = true;

        host.textContent = '';

      }

    }

  });

})();
