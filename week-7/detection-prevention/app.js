(function () {
  'use strict';

  var data = window.Week7DetectionPrevention;
  var progress = window.Unit3Week7Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'detection-prevention';
  var host = document.getElementById('w7-activity-host');
  var startedAt = Date.now();
  var mode = 'learn';
  var comparison = {
    anomaly: {},
    signature: {}
  };

  data.comparisonFields.forEach(function (field) {
    comparison.anomaly[field.id] = '';
    comparison.signature[field.id] = '';
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion && draft.comparison) {
      comparison.anomaly = Object.assign(comparison.anomaly, draft.comparison.anomaly || {});
      comparison.signature = Object.assign(
        comparison.signature,
        draft.comparison.signature || {}
      );
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        comparison: comparison,
        savedAt: new Date().toISOString()
      });
    }
  }

  function comparisonComplete() {
    return data.comparisonTargets.every(function (target) {
      return data.comparisonFields.every(function (field) {
        return String(comparison[target][field.id] || '').trim().length >= 12;
      });
    });
  }

  function renderLearn() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>' + data.activityName + '</h2><p class="panel-note">' + data.intro + '</p>';

    var grid = document.createElement('div');
    grid.className = 'w7-def-grid';
    data.concepts.forEach(function (concept) {
      var card = document.createElement('article');
      card.className = 'w7-def-card';
      card.innerHTML = '<h3>' + concept.name + '</h3><p>' + concept.summary + '</p>';
      grid.appendChild(card);
    });
    panel.appendChild(grid);

    var novel = document.createElement('aside');
    novel.className = 'w7-callout';
    novel.setAttribute('role', 'note');
    novel.innerHTML =
      '<strong>Novel attack scenario (signature may miss):</strong> ' + data.novelAttackScenario;
    panel.appendChild(novel);

    var form = document.createElement('section');
    form.className = 'w7-review-item';
    form.innerHTML =
      '<h3>Anomaly versus signature comparison</h3>' +
      '<p class="panel-note">Complete both columns before the knowledge check. Use the novel attack scenario where it helps.</p>';

    data.comparisonTargets.forEach(function (target) {
      var block = document.createElement('section');
      block.className = 'w7-def-card';
      block.innerHTML =
        '<h4>' + (target === 'anomaly' ? 'Anomaly-based' : 'Signature-based') + '</h4>';
      data.comparisonFields.forEach(function (field) {
        var wrap = document.createElement('div');
        wrap.className = 'w7-reflection-field';
        var id = target + '-' + field.id;
        var label = document.createElement('label');
        label.setAttribute('for', id);
        label.textContent = field.label;
        wrap.appendChild(label);
        var area = document.createElement('textarea');
        area.id = id;
        area.rows = 2;
        area.value = comparison[target][field.id] || '';
        area.addEventListener('input', function () {
          comparison[target][field.id] = area.value;
          save();
        });
        wrap.appendChild(area);
        block.appendChild(wrap);
      });
      form.appendChild(block);
    });
    panel.appendChild(form);

    var status = document.createElement('div');
    status.className = 'status-messages';
    status.setAttribute('aria-live', 'polite');
    panel.appendChild(status);

    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Knowledge check (8 marks)';
    btn.addEventListener('click', function () {
      save();
      if (!comparisonComplete()) {
        status.textContent = '';
        var warn = document.createElement('p');
        warn.className = 'message message-warning';
        warn.textContent =
          'Complete every anomaly and signature comparison field (about a sentence each) before the quiz.';
        status.appendChild(warn);
        return;
      }
      mode = 'check';
      renderCheck();
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderCheck() {
    if (!host || !window.Unit3Week7Quiz) return;
    host.textContent = '';
    window.Unit3Week7Quiz.createQuiz({
      activityId: ACTIVITY_ID,
      questions: data.knowledgeCheck.slice(),
      hostId: 'w7-activity-host',
      onComplete: function (result) {
        window.Unit3Week7Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
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
            var questions = data.knowledgeCheck.map(function (question, index) {
              return Object.assign({}, question, { id: 'DP' + (index + 1) });
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
  }

  if (mode === 'check') renderCheck();
  else renderLearn();
})();
