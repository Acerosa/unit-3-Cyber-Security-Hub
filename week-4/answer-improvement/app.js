(function () {
  'use strict';

  var data = window.Week4AnswerImprovement;
  var progress = window.Unit3Week4Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'answer-improvement';
  var host = document.getElementById('w4-activity-host');
  var startedAt = new Date().toISOString();
  var state = {
    criteria: {},
    descriptiveSpot: '',
    rewrite: '',
    improvement: '',
    awarded: 0
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
    if ((state.descriptiveSpot || '').trim().length >= 10) marks += 1;
    if ((state.rewrite || '').trim().length >= 20) marks += 2;
    if ((state.improvement || '').trim().length >= 10) marks += 1;
    var rewrite = String(state.rewrite || '').toLowerCase();
    if (
      rewrite.indexOf('because') !== -1 ||
      rewrite.indexOf('which means that') !== -1 ||
      rewrite.indexOf('as a result') !== -1 ||
      rewrite.indexOf('therefore') !== -1
    ) {
      marks += 1;
    }
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    var selected = Object.keys(state.criteria).filter(function (key) {
      return state.criteria[key];
    }).length;
    if (selected < 2) {
      messages.push('Mark the response against at least two mark-scheme points before submitting.');
    }
    if ((state.descriptiveSpot || '').trim().length < 10) {
      messages.push('Identify where the response is descriptive rather than analytical.');
    }
    if ((state.rewrite || '').trim().length < 20) {
      messages.push('Rewrite one descriptive sentence as an analytical sentence.');
    }
    if ((state.improvement || '').trim().length < 10) {
      messages.push('Add a specific improvement action.');
    }
    return messages;
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Marking and answer improvement</h2>' +
      '<p><strong>Question (' +
      data.question.marks +
      ' marks · ' +
      data.question.commandWord +
      '):</strong> ' +
      data.question.prompt +
      '</p>' +
      '<p class="w4-callout" role="note"><strong>Dominant error to target:</strong> ' +
      data.commonError +
      '</p>';

    var sample = document.createElement('blockquote');
    sample.className = 'w4-scenario w4-weak-response';
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
      label.className = 'w4-checkbox-label';
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

    function field(id, labelText, key, rows) {
      var wrap = document.createElement('div');
      wrap.className = 'w4-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = labelText;
      wrap.appendChild(label);
      var area = document.createElement('textarea');
      area.id = id;
      area.rows = rows;
      area.value = state[key] || '';
      area.addEventListener('input', function () {
        state[key] = area.value;
        save();
      });
      wrap.appendChild(area);
      panel.appendChild(wrap);
    }

    field(
      'descriptive-spot',
      'Where is the response descriptive rather than analytical?',
      'descriptiveSpot',
      3
    );
    field('rewrite', data.rewritePrompt, 'rewrite', 4);
    field('improvement', data.improvementActionPrompt, 'improvement', 3);

    var exemplar = document.createElement('details');
    exemplar.className = 'session-disclosure';
    exemplar.innerHTML =
      '<summary class="session-disclosure__summary"><span class="session-disclosure__text"><h3 class="session-disclosure__heading">Model improved sentence and response</h3></span><span class="session-disclosure__icon" aria-hidden="true"></span></summary>' +
      '<div class="session-disclosure__content">' +
      '<p><strong>Improved sentence:</strong> ' +
      data.modelImprovedSentence +
      '</p>' +
      '<p><strong>Model response:</strong> ' +
      data.modelResponse +
      '</p></div>';
    panel.appendChild(exemplar);

    var feedback = document.createElement('div');
    feedback.id = 'w4-improve-feedback';
    feedback.className = 'status-messages';
    feedback.setAttribute('aria-live', 'assertive');
    panel.appendChild(feedback);

    var actions = document.createElement('div');
    actions.className = 'w4-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Mark activity complete';
    btn.addEventListener('click', function () {
      var errors = validate();
      feedback.textContent = '';
      if (errors.length) {
        errors.forEach(function (message) {
          var p = document.createElement('p');
          p.className = 'message message-warning';
          p.textContent = message;
          feedback.appendChild(p);
        });
        return;
      }
      var marks = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, marks, data.total);
      var ok = document.createElement('p');
      ok.className = 'message message-success';
      ok.textContent = 'Self-review complete. Local score: ' + marks + ' / ' + data.total + '.';
      feedback.appendChild(ok);
      window.Unit3Week4Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w4-submit-host',
        getScore: computeScore,
        getTotal: function () {
          return data.total;
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - Date.parse(startedAt)) / 1000));
        },
        getReflection: function () {
          return state.improvement || '';
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var pairs = [
            { id: 'AI1', value: state.criteria, type: 'structured' },
            { id: 'AI2', value: state.descriptiveSpot, type: 'text' },
            { id: 'AI3', value: state.rewrite, type: 'text' },
            { id: 'AI4', value: state.improvement, type: 'text' }
          ];
          return pairs.map(function (pair) {
            if (pair.type === 'structured') {
              if (evidence && evidence.structured) {
                return evidence.structured(pair.id, pair.value || {}, {
                  correct: Object.keys(pair.value || {}).some(function (k) {
                    return pair.value[k];
                  }),
                  score: 1
                });
              }
              return {
                questionId: pair.id,
                response: pair.value || {},
                responseType: 'structured',
                correct: true,
                score: 1
              };
            }
            var filled = String(pair.value || '').trim().length > 0;
            if (evidence && evidence.freeText) {
              return evidence.freeText(pair.id, pair.value || '', {
                correct: filled,
                score: filled ? 1 : 0
              });
            }
            return {
              questionId: pair.id,
              response: pair.value || '',
              responseType: 'text',
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
          return validate().length === 0;
        }
      });
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
