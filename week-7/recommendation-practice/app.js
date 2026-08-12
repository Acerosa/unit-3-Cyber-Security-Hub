(function () {
  'use strict';

  var data = window.Week7RecommendationPractice;
  var progress = window.Unit3Week7Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'recommendation-practice';
  var host = document.getElementById('w7-activity-host');
  var startedAt = Date.now();
  var answers = {};
  var reviewed = false;

  data.fields.forEach(function (field) {
    answers[field.id] = '';
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      answers = Object.assign(answers, draft.answers || {});
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        answers: answers,
        savedAt: new Date().toISOString()
      });
    }
  }

  function fieldOk(field) {
    return String(answers[field.id] || '').trim().length >= field.minChars;
  }

  function feedbackFlags() {
    var flags = {
      named: false,
      context: false,
      effectiveness: false,
      limitation: false,
      comparison: false
    };
    data.fields.forEach(function (field) {
      if (fieldOk(field)) flags[field.feedbackKey] = true;
    });
    var eff = String(answers.effectiveness || '').trim().toLowerCase();
    if (eff === 'installed' || eff === 'we installed it') flags.effectiveness = false;
    return flags;
  }

  function computeScore() {
    var flags = feedbackFlags();
    var score = 0;
    if (flags.named) score += 1;
    if (flags.context) score += 1;
    if (flags.effectiveness) score += 1;
    if (flags.limitation) score += 1;
    if (flags.comparison) score += 1;
    if (flags.named && flags.context && flags.effectiveness) score += 1;
    return Math.min(data.total, score);
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>' +
      data.activityName +
      '</h2>' +
      '<p class="panel-note">' +
      data.structureNote +
      '</p>' +
      '<p class="w7-scenario">' +
      data.scenario +
      '</p>' +
      '<p class="w7-misconception"><strong>Weak patterns:</strong> ' +
      data.weakPatterns.join(' · ') +
      '</p>';

    data.fields.forEach(function (field) {
      var wrap = document.createElement('div');
      wrap.className = 'w7-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.textContent = field.label;
      wrap.appendChild(label);
      var area = document.createElement('textarea');
      area.id = field.id;
      area.rows = 3;
      area.disabled = reviewed;
      area.value = answers[field.id] || '';
      area.addEventListener('input', function () {
        answers[field.id] = area.value;
        save();
      });
      wrap.appendChild(area);
      panel.appendChild(wrap);
    });

    var status = document.createElement('div');
    status.className = 'status-messages';
    status.setAttribute('aria-live', 'polite');
    panel.appendChild(status);

    if (reviewed) {
      var flags = feedbackFlags();
      var list = document.createElement('ul');
      list.className = 'section-list';
      Object.keys(data.feedbackLabels).forEach(function (key) {
        var li = document.createElement('li');
        li.textContent =
          data.feedbackLabels[key] + ': ' + (flags[key] ? 'Present' : 'Missing or too thin');
        list.appendChild(li);
      });
      var fb = document.createElement('div');
      fb.className = 'w7-callout';
      fb.innerHTML =
        '<strong>Feedback dimensions</strong> (naming alone is not full credit)';
      fb.appendChild(list);
      panel.appendChild(fb);
      var scoreP = document.createElement('p');
      scoreP.textContent = 'Score: ' + computeScore() + ' / ' + data.total;
      panel.appendChild(scoreP);
    }

    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    if (!reviewed) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary';
      btn.textContent = 'Complete recommendation';
      btn.addEventListener('click', function () {
        save();
        status.textContent = '';
        var missing = data.fields.filter(function (field) {
          return !fieldOk(field);
        });
        var eff = String(answers.effectiveness || '').trim().toLowerCase();
        if (missing.length || eff === 'installed' || eff === 'we installed it') {
          var warn = document.createElement('p');
          warn.className = 'message message-warning';
          warn.textContent =
            'Complete every part with organisational context and a measurable effectiveness statement (not only “installed”).';
          status.appendChild(warn);
          return;
        }
        reviewed = true;
        var score = computeScore();
        if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
        render();
        window.Unit3Week7Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w7-submit-host',
          getScore: function () {
            return score;
          },
          getTotal: function () {
            return data.total;
          },
          getCompletionTimeSeconds: function () {
            return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
          },
          getResponses: function () {
            var evidence = window.Unit3SupabaseEvidence;
            var flags = feedbackFlags();
            return [
              evidence.structured(
                'REC1',
                { measure: answers.measure, registerRef: answers.registerRef },
                { correct: flags.named, score: flags.named ? 1 : 0 }
              ),
              evidence.freeText('REC2', answers.whyOrg, {
                correct: flags.context,
                score: flags.context ? 1 : 0
              }),
              evidence.freeText('REC3', answers.effectiveness, {
                correct: flags.effectiveness,
                score: flags.effectiveness ? 1 : 0
              }),
              evidence.freeText('REC4', answers.costLimitation, {
                correct: flags.limitation,
                score: flags.limitation ? 1 : 0
              }),
              evidence.structured(
                'REC5',
                { alternative: answers.alternative, whyLessSuitable: answers.whyAltLess },
                { correct: flags.comparison, score: flags.comparison ? 1 : 0 }
              ),
              evidence.structured(
                'REC6',
                {
                  measure: answers.measure,
                  organisationalReason: answers.whyOrg,
                  effectiveness: answers.effectiveness
                },
                {
                  correct: flags.named && flags.context && flags.effectiveness,
                  score: flags.named && flags.context && flags.effectiveness ? 1 : 0
                }
              )
            ];
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
      });
      actions.appendChild(btn);
    } else {
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'btn btn-secondary';
      retry.textContent = 'Revise recommendation';
      retry.addEventListener('click', function () {
        reviewed = false;
        var submit = document.getElementById('w7-submit-host');
        if (submit) {
          submit.hidden = true;
          submit.textContent = '';
        }
        render();
      });
      actions.appendChild(retry);
    }
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
