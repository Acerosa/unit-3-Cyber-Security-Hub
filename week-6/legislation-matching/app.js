(function () {
  'use strict';

  var data = window.Week6LegislationMatching;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  function optionLabel(option) {
    var utils = window.Unit3ActivityUtils;
    if (utils && typeof utils.optionLabel === 'function') return utils.optionLabel(option);
    if (option && typeof option === 'object') {
      return String(option.text || option.optionId || option.label || option.id || '');
    }
    return option == null ? '' : String(option);
  }

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'legislation-matching';
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var responses = {};
  var reviewed = false;

  data.scenarios.forEach(function (scenario) {
    responses[scenario.id] = { legislation: '', duty: '' };
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
    var legOk = row.legislation === scenario.legislation;
    var dutyOk = row.duty === scenario.duty;
    if (legOk && dutyOk) return 1;
    if (legOk) return 0.5;
    return 0;
  }

  function computeScore() {
    var raw = data.scenarios.reduce(function (sum, scenario) {
      return sum + scenarioScore(scenario);
    }, 0);
    return Math.min(data.total, Math.round(raw));
  }

  function renderSelect(parent, id, labelText, options, value, onChange) {
    var wrap = document.createElement('div');
    wrap.className = 'w6-reflection-field';
    var label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    wrap.appendChild(label);
    var select = document.createElement('select');
    select.id = id;
    select.disabled = reviewed;
    var blank = document.createElement('option');
    blank.value = '';
    blank.textContent = 'Select…';
    select.appendChild(blank);
    options.forEach(function (option) {
      var opt = document.createElement('option');
      var label = optionLabel(option);
      opt.value = typeof option === 'object' && option ? label : option;
      opt.textContent = label;
      if (value === option) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', function () {
      onChange(select.value);
      save();
    });
    wrap.appendChild(select);
    parent.appendChild(wrap);
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>Match legislation and duty or offence</h2>' +
      '<p class="panel-note">Select both the most relevant legislation and the relevant duty or offence. ' +
      'Feedback corrects the common misconception of using Computer Misuse Act 1990 for every data protection scenario.</p>');

    data.scenarios.forEach(function (scenario, index) {
      var block = document.createElement('section');
      block.className = 'w6-review-item w6-legal';setAuthoredHtml(block, '<h3>Scenario ' +
        (index + 1) +
        '</h3><p class="w6-scenario">' +
        scenario.text +
        '</p>');

      renderSelect(
        block,
        scenario.id + '-leg',
        'Legislation',
        data.legislationOptions.concat(['Not primarily a criminal statute scenario']),
        responses[scenario.id].legislation,
        function (value) {
          responses[scenario.id].legislation = value;
        }
      );
      renderSelect(
        block,
        scenario.id + '-duty',
        'Duty or offence',
        data.dutyOptions,
        responses[scenario.id].duty,
        function (value) {
          responses[scenario.id].duty = value;
        }
      );

      if (reviewed) {
        var score = scenarioScore(scenario);
        var fb = document.createElement('p');
        fb.className = 'message message-' + (score >= 1 ? 'success' : score > 0 ? 'warning' : 'error');
        fb.textContent =
          (score >= 1
            ? 'Correct pairing. '
            : score > 0
              ? 'Legislation correct but duty needs review. '
              : 'Review needed. ') + scenario.feedback;
        block.appendChild(fb);
      }

      panel.appendChild(block);
    });

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    if (!reviewed) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary';
      btn.textContent = 'Check matches';
      btn.addEventListener('click', function () {
        var incomplete = data.scenarios.some(function (scenario) {
          var row = responses[scenario.id];
          return !row.legislation || !row.duty;
        });
        if (incomplete) {
          var warn = document.createElement('p');
          warn.className = 'message message-warning';
          warn.textContent = 'Complete legislation and duty selections for every scenario.';
          panel.appendChild(warn);
          return;
        }
        reviewed = true;
        var score = computeScore();
        if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
        render();
        window.Unit3Week6Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w6-submit-host',
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
            return data.scenarios.map(function (scenario) {
              var row = responses[scenario.id] || {};
              var rawScore = scenarioScore(scenario);
              var payload = {
                legislation: row.legislation || '',
                duty: row.duty || ''
              };
              return evidence && evidence.structured
                ? evidence.structured(scenario.id, Object.assign({}, payload, {
                    localScore: rawScore
                  }), {
                    responseType: 'matching',
                    maxScore: 1,
                    score: rawScore
                  })
                : {
                    questionId: scenario.id,
                    response: Object.assign({}, payload, { localScore: rawScore }),
                    correct: rawScore >= 1,
                    score: rawScore >= 1 ? 1 : 0,
                    responseType: 'matching'
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
      });
      actions.appendChild(btn);
    } else {
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'btn btn-secondary';
      retry.textContent = 'Revise matches';
      retry.addEventListener('click', function () {
        reviewed = false;
        var submit = document.getElementById('w6-submit-host');
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
