(function () {
  'use strict';

  var data = window.Week7Session2Retrieval;
  if (!data || !window.Unit3Week7Quiz) return;

  var startedAt = Date.now();

  window.Unit3Week7Quiz.createQuiz({
    activityId: data.activityId,
    questions: data.questions.slice(),
    hostId: 'w7-activity-host',
    onComplete: function (result) {
      var host = document.getElementById('w7-activity-host');
      if (host) {
        var note = document.createElement('section');
        note.className = 'panel';
        note.innerHTML =
          '<h3>Insecure wording to avoid</h3><ul class="section-list">' +
          data.insecureTermsSummary
            .map(function (item) {
              return '<li>' + item + '</li>';
            })
            .join('') +
          '</ul><h3>Revisit Week 7 sections</h3><ul class="section-list">' +
          data.completionLinks
            .map(function (link) {
              return (
                '<li><a href="' + link.path + '">' + link.label + '</a></li>'
              );
            })
            .join('') +
          '</ul>';
        host.appendChild(note);
      }
      window.Unit3Week7Submit.renderSubmitPanel({
        activityId: data.activityId,
        hostId: 'w7-submit-host',
        getScore: function () {
          return result.score;
        },
        getTotal: function () {
          return data.total;
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
          var questions = data.questions.map(function (question, index) {
            return Object.assign({}, question, { id: 'S2R' + (index + 1) });
          });
          return evidence.fromQuizResult(result, questions);
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
      var submit = document.getElementById('w7-submit-host');
      if (submit) {
        submit.hidden = true;
        submit.textContent = '';
      }
    }
  });
})();
