(function () {
  'use strict';

  var data = window.Week4Session1Retrieval;
  if (!data || !window.Unit3Week4Quiz) return;

  var progress = window.Unit3Week4Progress;
  var harvestHost = null;
  var harvest = { attackerType: '', tryingToAchieve: '', evidence: '' };
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

  function loadProfileNotice() {
    var notice = data.harvestPrompts.placeholderNotice;
    try {
      var raw = localStorage.getItem(data.researchProfileKey);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length) {
          return 'A Week 3 attacker research profile was found in this browser. Review it, then complete the harvest fields below. Do not invent details that are not in your profile.';
        }
      }
    } catch (err) {
      /* ignore */
    }
    return notice;
  }

  function renderHarvest(container) {
    var section = document.createElement('section');
    section.className = 'panel';
    section.setAttribute('aria-labelledby', 'w4-harvest-heading');
    section.innerHTML =
      '<h2 id="w4-harvest-heading">Homework harvest</h2>' +
      '<p class="panel-note">' +
      data.harvestPrompts.intro +
      '</p>' +
      '<p class="w4-callout" role="status">' +
      loadProfileNotice() +
      '</p>' +
      '<p class="panel-note">Attacker types from Week 3: ' +
      data.attackerTypes.join('; ') +
      '.</p>';

    data.harvestPrompts.fields.forEach(function (field) {
      var wrap = document.createElement('div');
      wrap.className = 'w4-reflection-field';
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

  window.Unit3Week4Quiz.createQuiz({
    activityId: data.activityId,
    questions: data.questions.slice(),
    hostId: 'w4-activity-host',
    onComplete: function (result) {
      var host = document.getElementById('w4-activity-host');
      if (host) {
        harvestHost = document.createElement('div');
        harvestHost.id = 'w4-harvest-host';
        host.appendChild(harvestHost);
        renderHarvest(harvestHost);
      }
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
        getReflection: function () {
          return [
            harvest.attackerType,
            harvest.tryingToAchieve,
            harvest.evidence
          ]
            .filter(Boolean)
            .join(' | ');
        },
        canSubmit: function () {
          return true;
        }
      });
    },
    onRetry: function () {
      var submit = document.getElementById('w4-submit-host');
      if (submit) {
        submit.hidden = true;
        submit.textContent = '';
      }
      var existing = document.getElementById('w4-harvest-host');
      if (existing) existing.remove();
    }
  });
})();
