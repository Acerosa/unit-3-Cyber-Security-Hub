(function () {
  'use strict';

  var data = window.Week7TestingMatching;
  var progress = window.Unit3Week7Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'testing-matching';
  var host = document.getElementById('w7-activity-host');
  var startedAt = Date.now();
  var responses = {};
  var reviewed = false;

  data.scenarios.forEach(function (scenario) {
    responses[scenario.id] = { measure: '', justification: '' };
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      responses = Object.assign(responses, draft.responses || {});
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        responses: responses,
        savedAt: new Date().toISOString()
      });
    }
  }

  function scenarioScore(scenario) {
    var row = responses[scenario.id] || {};
    var measure = row.measure;
    var justOk = String(row.justification || '').trim().length >= scenario.justificationMin;
    var measureScore = 0;
    if (measure === scenario.preferred) measureScore = 1;
    else if ((scenario.alternativeAnswers || []).indexOf(measure) !== -1) {
      measureScore = scenario.altFullCredit ? 1 : 0.5;
    }
    if (!justOk) measureScore = measureScore * 0.5;
    return measureScore;
  }

  function computeScore() {
    var raw = data.scenarios.reduce(function (sum, scenario) {
      return sum + scenarioScore(scenario);
    }, 0);
    return Math.min(data.total, Math.round(raw));
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>' + data.activityName + '</h2><p class="panel-note">' + data.intro + '</p>';

    data.scenarios.forEach(function (scenario, index) {
      var block = document.createElement('section');
      block.className = 'w7-review-item';
      block.innerHTML =
        '<h3>Scenario ' +
        (index + 1) +
        '</h3><p class="w7-scenario">' +
        scenario.text +
        '</p>';

      var selectWrap = document.createElement('div');
      selectWrap.className = 'w7-reflection-field';
      var selectId = scenario.id + '-measure';
      var selectLabel = document.createElement('label');
      selectLabel.setAttribute('for', selectId);
      selectLabel.textContent = 'Most suitable measure';
      selectWrap.appendChild(selectLabel);
      var select = document.createElement('select');
      select.id = selectId;
      select.disabled = reviewed;
      var blank = document.createElement('option');
      blank.value = '';
      blank.textContent = 'Select…';
      select.appendChild(blank);
      data.measureOptions.forEach(function (option) {
        var opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        if (responses[scenario.id].measure === option) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener('change', function () {
        responses[scenario.id].measure = select.value;
        save();
      });
      selectWrap.appendChild(select);
      block.appendChild(selectWrap);

      var justWrap = document.createElement('div');
      justWrap.className = 'w7-reflection-field';
      var justId = scenario.id + '-why';
      var justLabel = document.createElement('label');
      justLabel.setAttribute('for', justId);
      justLabel.textContent = 'Justification';
      justWrap.appendChild(justLabel);
      var area = document.createElement('textarea');
      area.id = justId;
      area.rows = 3;
      area.disabled = reviewed;
      area.value = responses[scenario.id].justification || '';
      area.addEventListener('input', function () {
        responses[scenario.id].justification = area.value;
        save();
      });
      justWrap.appendChild(area);
      block.appendChild(justWrap);

      if (reviewed) {
        var score = scenarioScore(scenario);
        var fb = document.createElement('div');
        fb.className =
          'message message-' + (score >= 1 ? 'success' : score > 0 ? 'warning' : 'error');
        var chosen = responses[scenario.id].measure;
        var text = '';
        if (chosen === scenario.preferred) {
          text = 'Preferred match. ' + scenario.preferredWhy;
        } else if ((scenario.alternativeAnswers || []).indexOf(chosen) !== -1) {
          text =
            'Defensible alternative. Preferred option (' +
            scenario.preferred +
            ') may be better because: ' +
            scenario.preferredWhy +
            ' Alternative is less effective here because: ' +
            scenario.alternativeWhy;
        } else {
          text =
            'Review needed. Preferred: ' +
            scenario.preferred +
            '. ' +
            scenario.preferredWhy;
        }
        fb.textContent = text;
        block.appendChild(fb);
      }

      panel.appendChild(block);
    });

    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    if (!reviewed) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary';
      btn.textContent = 'Check matches';
      btn.addEventListener('click', function () {
        var incomplete = data.scenarios.some(function (scenario) {
          var row = responses[scenario.id];
          return (
            !row.measure ||
            String(row.justification || '').trim().length < scenario.justificationMin
          );
        });
        if (incomplete) {
          var warn = document.createElement('p');
          warn.className = 'message message-warning';
          warn.setAttribute('aria-live', 'polite');
          warn.textContent =
            'Select a measure and write a justification for every scenario before checking.';
          panel.appendChild(warn);
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
            return data.scenarios.map(function (scenario, index) {
              var response = responses[scenario.id] || {};
              var score = scenarioScore(scenario);
              return evidence.structured(
                'M' + (index + 1),
                {
                  selectedMeasure: response.measure || null,
                  justification: response.justification || '',
                  localScore: score
                },
                {
                  responseType: 'single-choice',
                  maxScore: 1,
                  score: score
                }
              );
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
      });
      actions.appendChild(btn);
    } else {
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'btn btn-secondary';
      retry.textContent = 'Revise matches';
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
      var scoreP = document.createElement('p');
      scoreP.setAttribute('aria-live', 'polite');
      scoreP.textContent = 'Score: ' + computeScore() + ' / ' + data.total;
      panel.appendChild(scoreP);
    }
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
