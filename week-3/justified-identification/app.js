(function () {
  'use strict';

  var data = window.Week3JustifiedIdentification;
  var progress = window.Unit3Week3Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'justified-identification';
  var host = document.getElementById('w3-justified-host');
  var answers = {};
  var checks = {};
  var startedAt = new Date().toISOString();
  var submittedLocal = false;

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      answers = draft.answers || {};
      checks = draft.checks || {};
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        answers: answers,
        checks: checks,
        savedAt: new Date().toISOString()
      });
    }
  }

  function includesAny(text, terms) {
    var lower = (text || '').toLowerCase();
    return (terms || []).some(function (term) {
      return lower.indexOf(String(term).toLowerCase()) !== -1;
    });
  }

  function guidanceFor(scenario, text) {
    return {
      hasAttacker: includesAny(text, scenario.keywordChecks.attackerTerms),
      hasEvidence: includesAny(text, scenario.keywordChecks.evidenceTerms),
      hasAlternative: includesAny(text, scenario.keywordChecks.alternativeTerms)
    };
  }

  function autoScore() {
    var total = 0;
    data.scenarios.forEach(function (scenario) {
      var text = answers[scenario.id] || '';
      var g = guidanceFor(scenario, text);
      var self = checks[scenario.id] || {};
      var marks = 0;
      if (g.hasAttacker || self.criterion1) marks += 1;
      if (g.hasEvidence || self.criterion2) marks += 1;
      if ((g.hasAlternative || self.criterion3) && text.trim().length > 40) marks += 1;
      total += Math.min(3, marks);
    });
    return total;
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Justified identification practice</h2>' +
      '<p class="w3-formula" role="note">' +
      data.answerStructure +
      '</p>' +
      '<p class="panel-note">Automated checks are guidance only. They are not a full assessment of writing quality.</p>';

    data.scenarios.forEach(function (scenario, index) {
      var block = document.createElement('section');
      block.className = 'w3-review-item';
      block.innerHTML =
        '<h3>Scenario ' +
        (index + 1) +
        ' (' +
        scenario.marks +
        ' marks)</h3>' +
        '<p class="w3-scenario">' +
        scenario.scenario +
        '</p>' +
        '<p><strong>Planning:</strong> Best type: ' +
        scenario.bestAttacker +
        ' · Alternative: ' +
        scenario.alternative +
        '</p>' +
        '<p class="panel-note">Evidence hints: ' +
        scenario.evidenceHints.join('; ') +
        '</p>' +
        '<p class="panel-note">Sentence starters: ' +
        scenario.sentenceStarters.join(' ') +
        '</p>';

      var areaId = 'answer-' + scenario.id;
      var label = document.createElement('label');
      label.setAttribute('for', areaId);
      label.textContent = 'Your justified answer';
      block.appendChild(label);
      var area = document.createElement('textarea');
      area.id = areaId;
      area.rows = 6;
      area.value = answers[scenario.id] || '';
      area.addEventListener('input', function () {
        answers[scenario.id] = area.value;
        save();
        updateGuidance(scenario, block);
      });
      block.appendChild(area);

      var guide = document.createElement('div');
      guide.className = 'panel-note';
      guide.id = 'guide-' + scenario.id;
      guide.setAttribute('aria-live', 'polite');
      block.appendChild(guide);

      scenario.successCriteria.forEach(function (criterion, cIndex) {
        var key = 'criterion' + (cIndex + 1);
        var wrap = document.createElement('label');
        wrap.className = 'w3-checkbox-label';
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!(checks[scenario.id] && checks[scenario.id][key]);
        input.addEventListener('change', function () {
          checks[scenario.id] = checks[scenario.id] || {};
          checks[scenario.id][key] = input.checked;
          save();
        });
        wrap.appendChild(input);
        wrap.appendChild(document.createTextNode(' Self-check: ' + criterion));
        block.appendChild(wrap);
      });

      if (submittedLocal) {
        var model = document.createElement('details');
        model.className = 'session-disclosure';
        model.innerHTML =
          '<summary class="session-disclosure__summary"><span class="session-disclosure__text"><h4 class="session-disclosure__heading">Model answer and feedback</h4></span><span class="session-disclosure__icon" aria-hidden="true"></span></summary>' +
          '<div class="session-disclosure__content"><p>' +
          scenario.modelAnswer +
          '</p></div>';
        block.appendChild(model);
      }

      panel.appendChild(block);
      updateGuidance(scenario, block);
    });

    var actions = document.createElement('div');
    actions.className = 'w3-actions';
    var finish = document.createElement('button');
    finish.type = 'button';
    finish.className = 'btn btn-primary';
    finish.textContent = 'Complete practice and show submit';
    finish.addEventListener('click', function () {
      submittedLocal = true;
      var marks = autoScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, marks, data.total);
      render();
      window.Unit3Week3Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w3-submit-host',
        getScore: autoScore,
        getTotal: function () {
          return data.total;
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - Date.parse(startedAt)) / 1000));
        },
        getReflection: function () {
          return 'Justified identification self-guided score ' + autoScore() + '/' + data.total;
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          return data.scenarios.map(function (scenario) {
            var qid = String(scenario.id || '').toUpperCase();
            var text = answers[scenario.id] || '';
            var payload = {
              text: text,
              checks: checks[scenario.id] || {}
            };
            var filled = text.trim().length > 0;
            if (evidence && evidence.structured) {
              return evidence.structured(qid, payload, {
                correct: filled,
                score: filled ? 1 : 0
              });
            }
            return {
              questionId: qid,
              response: payload,
              responseType: 'structured',
              correct: filled,
              score: filled ? 1 : 0
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
    actions.appendChild(finish);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function updateGuidance(scenario, block) {
    var guide = block.querySelector('#guide-' + scenario.id);
    if (!guide) return;
    var g = guidanceFor(scenario, answers[scenario.id] || '');
    guide.textContent =
      'Guidance: attacker type ' +
      (g.hasAttacker ? 'detected' : 'not detected') +
      '; evidence terms ' +
      (g.hasEvidence ? 'detected' : 'not detected') +
      '; alternative ' +
      (g.hasAlternative ? 'detected' : 'not detected') +
      '.';
  }

  render();
})();
