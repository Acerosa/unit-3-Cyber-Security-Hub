(function () {
  'use strict';

  var data = window.Week3AttackerCaseMatching;
  var progress = window.Unit3Week3Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'attacker-case-matching';
  var host = document.getElementById('w3-case-host');
  var responses = {};
  var reviewed = false;
  var startedAt = new Date().toISOString();

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.responses) responses = draft.responses;
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        responses: responses,
        activityVersion: data.activityVersion,
        savedAt: new Date().toISOString()
      });
    }
  }

  function score() {
    var marks = 0;
    data.cases.forEach(function (item) {
      var answer = responses[item.id] || {};
      if (answer.bestAnswer === item.bestAnswer) marks += 1;
    });
    return marks;
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Case study matching</h2>' +
      '<p class="panel-note">Select the most likely OCR attacker type using scenario evidence. Keyboard controls are provided — drag and drop is not required.</p>';

    data.cases.forEach(function (item, index) {
      var block = document.createElement('fieldset');
      block.className = 'w3-pair-fieldset';
      var legend = document.createElement('legend');
      legend.textContent = index + 1 + '. ' + item.title;
      block.appendChild(legend);
      var scenario = document.createElement('p');
      scenario.className = 'w3-scenario';
      scenario.textContent = item.scenario;
      block.appendChild(scenario);

      var current = responses[item.id] || {
        bestAnswer: '',
        alternative: '',
        evidence: '',
        confidence: 'medium'
      };

      function addSelect(labelText, key, includeBlankAlternative) {
        var wrap = document.createElement('div');
        wrap.className = 'w3-reflection-field';
        var id = item.id + '-' + key;
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
        data.attackerOptions.forEach(function (opt) {
          var option = document.createElement('option');
          option.value = opt.id;
          option.textContent = opt.name;
          select.appendChild(option);
        });
        if (includeBlankAlternative) {
          /* already has blank */
        }
        select.value = current[key] || '';
        select.addEventListener('change', function () {
          current[key] = select.value;
          responses[item.id] = current;
          save();
        });
        wrap.appendChild(select);
        block.appendChild(wrap);
      }

      addSelect('Most likely attacker type', 'bestAnswer');
      addSelect('Plausible alternative (optional)', 'alternative');

      var evidenceWrap = document.createElement('div');
      evidenceWrap.className = 'w3-reflection-field';
      var evidenceId = item.id + '-evidence';
      var evidenceLabel = document.createElement('label');
      evidenceLabel.setAttribute('for', evidenceId);
      evidenceLabel.textContent = 'Evidence from the scenario';
      evidenceWrap.appendChild(evidenceLabel);
      var evidence = document.createElement('textarea');
      evidence.id = evidenceId;
      evidence.rows = 3;
      evidence.disabled = reviewed;
      evidence.value = current.evidence || '';
      evidence.addEventListener('input', function () {
        current.evidence = evidence.value;
        responses[item.id] = current;
        save();
      });
      evidenceWrap.appendChild(evidence);
      block.appendChild(evidenceWrap);

      var confWrap = document.createElement('div');
      confWrap.className = 'w3-reflection-field';
      var confId = item.id + '-confidence';
      var confLabel = document.createElement('label');
      confLabel.setAttribute('for', confId);
      confLabel.textContent = 'Confidence';
      confWrap.appendChild(confLabel);
      var conf = document.createElement('select');
      conf.id = confId;
      conf.disabled = reviewed;
      ['low', 'medium', 'high'].forEach(function (level) {
        var option = document.createElement('option');
        option.value = level;
        option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        conf.appendChild(option);
      });
      conf.value = current.confidence || 'medium';
      conf.addEventListener('change', function () {
        current.confidence = conf.value;
        responses[item.id] = current;
        save();
      });
      confWrap.appendChild(conf);
      block.appendChild(confWrap);

      if (reviewed) {
        var feedback = document.createElement('div');
        feedback.className = 'w3-review-item';
        var answer = responses[item.id] || {};
        var correct = answer.bestAnswer === item.bestAnswer;
        feedback.innerHTML =
          '<p><strong>' +
          (correct ? 'Mark awarded' : 'Not awarded') +
          '.</strong> Best answer: ' +
          item.bestAnswer +
          '</p>' +
          '<p>' +
          item.whyBest +
          '</p>' +
          (item.whyAlternativeWeaker
            ? '<p>' + item.whyAlternativeWeaker + '</p>'
            : '') +
          '<p class="panel-note">' +
          item.stereotypeWarning +
          '</p>' +
          '<p class="panel-note">Evidence points tutors look for: ' +
          item.evidencePoints.join('; ') +
          '</p>';
        block.appendChild(feedback);
      }

      panel.appendChild(block);
    });

    if (!reviewed) {
      var actions = document.createElement('div');
      actions.className = 'w3-actions';
      var submit = document.createElement('button');
      submit.type = 'button';
      submit.className = 'btn btn-primary';
      submit.textContent = 'Submit answers for feedback';
      submit.addEventListener('click', function () {
        var missing = data.cases.some(function (item) {
          return !(responses[item.id] && responses[item.id].bestAnswer);
        });
        if (missing) {
          window.alert('Select a most likely attacker type for every case before submitting.');
          return;
        }
        reviewed = true;
        var marks = score();
        if (progress) progress.markCompleted(ACTIVITY_ID, marks, data.total);
        render();
        if (window.Unit3Week3Submit) {
          window.Unit3Week3Submit.renderSubmitPanel({
            activityId: ACTIVITY_ID,
            hostId: 'w3-submit-host',
            getScore: function () {
              return score();
            },
            getTotal: function () {
              return data.total;
            },
            getCompletionTimeSeconds: function () {
              return Math.max(1, Math.round((Date.now() - Date.parse(startedAt)) / 1000));
            },
            getReflection: function () {
              return 'Case matching score ' + score() + '/' + data.total;
            },
            getResponses: function () {
              var evidence = window.Unit3SupabaseEvidence;
              return data.cases.map(function (item) {
                var qid = String(item.id || '').toUpperCase();
                var answer = responses[item.id] || {};
                var correct = answer.bestAnswer === item.bestAnswer;
                if (evidence && evidence.structured) {
                  return evidence.structured(qid, answer, {
                    correct: correct,
                    score: correct ? 1 : 0
                  });
                }
                return {
                  questionId: qid,
                  response: answer,
                  responseType: 'structured',
                  correct: correct,
                  score: correct ? 1 : 0
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
        }
      });
      actions.appendChild(submit);
      panel.appendChild(actions);
    } else {
      var summary = document.createElement('p');
      summary.className = 'w3-formula';
      summary.textContent = 'Score: ' + score() + ' / ' + data.total;
      panel.insertBefore(summary, panel.firstChild.nextSibling);
    }

    host.appendChild(panel);
  }

  render();
})();
