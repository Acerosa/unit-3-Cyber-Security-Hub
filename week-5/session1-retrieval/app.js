(function () {
  'use strict';

  var startedAt = new Date().toISOString();

  var data = window.Week5Session1Retrieval;
  if (!data || !window.Unit3Week5Quiz) return;

  var progress = window.Unit3Week5Progress;
  var harvest = { whoHarmed: '', whatLost: '', timescale: '' };
  var DRAFT_KEY = 'session1-harvest';

  if (progress) {
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      harvest = Object.assign(harvest, draft.harvest || {});
    }
  }

  function saveHarvest() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        harvest: harvest,
        savedAt: new Date().toISOString()
      });
    }
  }

  function renderHarvest(container) {
    var section = document.createElement('section');
    section.className = 'panel';
    section.setAttribute('aria-labelledby', 'w5-harvest-heading');
    section.innerHTML =
      '<h2 id="w5-harvest-heading">Homework harvest and consequence shift</h2>' +
      '<p class="panel-note">' +
      data.harvestPrompts.intro +
      '</p>' +
      '<p class="w5-callout" role="status">' +
      data.homeworkReminder +
      '</p>';

    data.harvestPrompts.fields.forEach(function (field) {
      var wrap = document.createElement('div');
      wrap.className = 'w5-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', 'harvest-' + field.id);
      label.textContent = field.label + (field.required ? ' (required)' : '');
      wrap.appendChild(label);
      var area = document.createElement('textarea');
      area.id = 'harvest-' + field.id;
      area.rows = 3;
      area.value = harvest[field.id] || '';
      area.addEventListener('input', function () {
        harvest[field.id] = area.value;
        saveHarvest();
      });
      wrap.appendChild(area);
      section.appendChild(wrap);
    });

    container.appendChild(section);
  }

  window.Unit3Week5Quiz.createQuiz({
    activityId: data.activityId,
    questions: data.questions.slice(),
    hostId: 'w5-activity-host',
    onComplete: function (result) {
      var host = document.getElementById('w5-activity-host');
      if (host) {
        var harvestHost = document.createElement('div');
        harvestHost.id = 'w5-harvest-host';
        host.appendChild(harvestHost);
        renderHarvest(harvestHost);
      }
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
        getReflection: function () {
          return [harvest.whoHarmed, harvest.whatLost, harvest.timescale]
            .filter(Boolean)
            .join(' | ');
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
      var submit = document.getElementById('w5-submit-host');
      if (submit) {
        submit.hidden = true;
        submit.textContent = '';
      }
      var existing = document.getElementById('w5-harvest-host');
      if (existing) existing.remove();
    }
  });
})();
