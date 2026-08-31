(function () {
  'use strict';

  var data = window.Week5AnswerImprovement;
  var progress = window.Unit3Week5Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'answer-improvement';
  var host = document.getElementById('w5-activity-host');
  var startedAt = new Date().toISOString();
  var state = {
    criteria: {},
    missingSafety: '',
    stakeholder: '',
    evidence: '',
    timescale: '',
    improved: '',
    submittedAttempt: false
  };

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      state = Object.assign(state, draft.state || {});
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        state: state,
        savedAt: new Date().toISOString()
      });
    }
  }

  function computeScore() {
    var marks = 0;
    var selected = Object.keys(state.criteria).filter(function (key) {
      return state.criteria[key];
    }).length;
    if (selected >= 3) marks += 1;
    if (String(state.missingSafety || '').trim().length >= 20) marks += 1;
    if (String(state.stakeholder || '').trim().length >= 3) marks += 1;
    if (String(state.evidence || '').trim().length >= 15) marks += 1;
    if (String(state.timescale || '').trim().length >= 8) marks += 1;
    if (String(state.improved || '').trim().length >= 40) marks += 1;
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    var selected = Object.keys(state.criteria).filter(function (key) {
      return state.criteria[key];
    }).length;
    if (selected < 2) {
      messages.push('Mark the response against at least two mark-scheme points before continuing.');
    }
    if (String(state.missingSafety || '').trim().length < 20) {
      messages.push('Add a missing safety impact.');
    }
    if (String(state.stakeholder || '').trim().length < 3) {
      messages.push('Name the stakeholder affected.');
    }
    if (String(state.evidence || '').trim().length < 15) {
      messages.push('Add evidence or reasoning from the scenario.');
    }
    if (String(state.timescale || '').trim().length < 8) {
      messages.push('Add a timescale where relevant.');
    }
    if (String(state.improved || '').trim().length < 40) {
      messages.push('Write an improved analytical paragraph.');
    }
    return messages;
  }

  function field(parent, id, labelText, key, rows, minChars) {
    textFields.mount(parent, {
      wrapClass: 'w5-reflection-field',
      id: id,
      prompt: labelText,
      minChars: minChars,
      value: state[key] || '',
      rows: rows,
      onChange: function (next) {
        state[key] = next;
        save();
      }
    });
  }

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for answer-improvement fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  function render() {
    if (!host) return;
    textFields.destroyAll();
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>Marking and answer improvement</h2>' +
      '<p><strong>Question (' +
      data.question.marks +
      ' marks · ' +
      data.question.commandWord +
      '):</strong> ' +
      data.question.prompt +
      '</p>' +
      '<p class="w5-callout" role="note"><strong>Dominant Week 5 error:</strong> ' +
      data.commonError +
      '</p>');

    var sample = document.createElement('blockquote');
    sample.className = 'w5-scenario w5-weak-response';
    sample.textContent = data.sampleResponse.text;
    panel.appendChild(sample);

    var issues = document.createElement('ul');
    issues.className = 'section-list';
    data.dominantIssues.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item;
      issues.appendChild(li);
    });
    panel.appendChild(issues);

    var schemeHeading = document.createElement('h3');
    schemeHeading.textContent = 'Mark against the mark scheme';
    panel.appendChild(schemeHeading);
    data.markSchemePoints.forEach(function (criterion) {
      var label = document.createElement('label');
      label.className = 'w5-checkbox-label';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!state.criteria[criterion.id];
      input.addEventListener('change', function () {
        state.criteria[criterion.id] = input.checked;
        save();
      });
      label.appendChild(input);
      label.appendChild(
        document.createTextNode(
          ' ' + criterion.label + (criterion.marks ? ' (' + criterion.marks + ')' : '')
        )
      );
      panel.appendChild(label);
    });

    var improveHeading = document.createElement('h3');
    improveHeading.textContent = 'Improve the answer';
    panel.appendChild(improveHeading);
    var req = document.createElement('ul');
    req.className = 'section-list';
    data.improvementRequirements.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item;
      req.appendChild(li);
    });
    panel.appendChild(req);

    field(panel, 'missing-safety', 'Missing safety impact', 'missingSafety', 3, 20);
    field(panel, 'stakeholder', 'Stakeholder affected', 'stakeholder', 2, 3);
    field(panel, 'evidence', 'Evidence or reasoning', 'evidence', 3, 15);
    field(panel, 'timescale', 'Timescale', 'timescale', 2, 8);
    field(panel, 'improved', 'Improved analytical paragraph', 'improved', 6, 40);

    if (state.submittedAttempt) {
      var model = document.createElement('p');
      model.className = 'w5-callout';
      model.textContent = data.modelAfterSubmit;
      panel.appendChild(model);
    } else {
      var hold = document.createElement('p');
      hold.className = 'panel-note';
      hold.textContent =
        'A fuller improvement guidance note appears after you submit your attempt.';
      panel.appendChild(hold);
    }

    var actions = document.createElement('div');
    actions.className = 'w5-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete marking and improvement';
    btn.addEventListener('click', function () {
      var messages = validate();
      var status = document.getElementById('w5-improve-status');
      if (!status) {
        status = document.createElement('div');
        status.id = 'w5-improve-status';
        status.className = 'status-messages';
        status.setAttribute('aria-live', 'polite');
        panel.appendChild(status);
      }
      status.textContent = '';
      if (messages.length) {
        messages.forEach(function (msg) {
          var p = document.createElement('p');
          p.className = 'message message-warning';
          p.textContent = msg;
          status.appendChild(p);
        });
        return;
      }
      state.submittedAttempt = true;
      save();
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
      render();
      window.Unit3Week5Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w5-submit-host',
        getScore: function () {
          return score;
        },
        getTotal: function () {
          return data.total;
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - Date.parse(startedAt)) / 1000));
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          // m1..m6 criteria → AI1..AI6; fold writing fields into AI6 extras.
          var scheme = data.markSchemePoints || [];
          return scheme.map(function (criterion, index) {
            var qid = 'AI' + (index + 1);
            var checked = Boolean(state.criteria[criterion.id]);
            var payload = {
              criterionId: criterion.id,
              label: criterion.label,
              checked: checked
            };
            if (index === scheme.length - 1) {
              payload.missingSafety = state.missingSafety;
              payload.stakeholder = state.stakeholder;
              payload.evidence = state.evidence;
              payload.timescale = state.timescale;
              payload.improved = state.improved;
            }
            if (evidence && evidence.structured) {
              return evidence.structured(qid, payload, {
                correct: checked,
                score: checked ? 1 : 0
              });
            }
            return {
              questionId: qid,
              response: payload,
              responseType: 'structured',
              correct: checked,
              score: checked ? 1 : 0
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
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
