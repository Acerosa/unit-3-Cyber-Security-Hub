(function () {
  'use strict';

  var data = window.Week4AnalysePractice;
  var progress = window.Unit3Week4Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'analyse-practice';
  var host = document.getElementById('w4-activity-host');
  var startedAt = new Date().toISOString();
  var state = {
    template: 'frame',
    motivation: '',
    target: '',
    method: '',
    plan: '',
    checklist: {}
  };

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      state = Object.assign(state, draft.state || {});
    }
  }

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for analyse-practice fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  var SHORT_MIN = 40;
  var PLAN_MIN = 40;

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
    if (String(state.motivation || '').trim()) marks += 1;
    if (String(state.target || '').trim()) marks += 1;
    if (String(state.method || '').trim()) marks += 1;
    if (String(state.plan || '').trim().length >= PLAN_MIN) marks += 1;
    var checked = Object.keys(state.checklist).filter(function (key) {
      return state.checklist[key];
    }).length;
    if (checked >= 3) marks += 1;
    var plan = String(state.plan || '').toLowerCase();
    var hasConnective = data.connectives.some(function (word) {
      return plan.indexOf(word) !== -1;
    });
    if (hasConnective && plan.length >= PLAN_MIN) marks += 1;
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    if (!String(state.motivation || '').trim()) {
      messages.push('Identify a plausible motivation before submitting.');
    }
    if (!String(state.target || '').trim()) {
      messages.push('Identify the relevant target before submitting.');
    }
    if (!String(state.method || '').trim()) {
      messages.push('Identify an appropriate method before submitting.');
    }
    if (String(state.plan || '').trim().length < PLAN_MIN) {
      messages.push('Complete the final connection in the analysis plan before submitting.');
    }
    return messages;
  }

  function render() {
    if (!host) return;
    textFields.destroyAll();
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>From describe to analyse</h2>' +
      '<div class="w4-two-col">' +
      '<article class="w4-def-card"><h3>Describe</h3><p>' +
      data.commandWords.describe +
      '</p></article>' +
      '<article class="w4-def-card"><h3>Analyse</h3><p>' +
      data.commandWords.analyse +
      '</p></article>' +
      '</div>' +
      '<p class="panel-note">Analytical connectives: ' +
      data.connectives.join('; ') +
      '. ' +
      data.connectiveWarning +
      '</p>');

    var weak = document.createElement('blockquote');
    weak.className = 'w4-scenario w4-weak-response';setAuthoredHtml(weak, '<strong>' +
      data.weakResponse.label +
      ':</strong> ' +
      data.weakResponse.text +
      '<br><em class="w4-annotation">' +
      data.weakResponse.problem +
      '</em>');
    panel.appendChild(weak);

    var improved = document.createElement('blockquote');
    improved.className = 'w4-scenario w4-improved-response';setAuthoredHtml(improved, '<strong>' +
      data.improvedResponse.label +
      ':</strong> ' +
      data.improvedResponse.text +
      '<ul class="section-list">' +
      data.improvedResponse.annotations
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>');
    panel.appendChild(improved);

    var planBox = document.createElement('section');
    planBox.className = 'w4-review-item';setAuthoredHtml(planBox, '<h3>Planning task</h3>' +
      '<p><strong>' +
      data.planningQuestion +
      '</strong></p>' +
      '<p class="panel-note">' +
      data.planningGuidance +
      '</p>');

    var templates = document.createElement('fieldset');
    templates.className = 'w4-options';
    var legend = document.createElement('legend');
    legend.textContent = 'Choose a planning template';
    templates.appendChild(legend);
    data.planningTemplates.forEach(function (item) {
      var id = 'template-' + item.id;
      var label = document.createElement('label');
      label.className = 'w4-option';
      label.setAttribute('for', id);
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'template';
      input.id = id;
      input.value = item.id;
      if (state.template === item.id) input.checked = true;
      input.addEventListener('change', function () {
        state.template = item.id;
        save();
        render();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + item.label));
      templates.appendChild(label);
    });
    planBox.appendChild(templates);

    if (state.template === 'frame') {
      var frame = document.createElement('p');
      frame.className = 'w4-callout';
      frame.textContent = data.writingFrame.join(' ');
      planBox.appendChild(frame);
    } else if (state.template === 'table') {
      var tableNote = document.createElement('p');
      tableNote.className = 'panel-note';
      tableNote.textContent =
        'Use the fields below as table rows: motivation, target, method, then a connection cell.';
      planBox.appendChild(tableNote);
    } else {
      var mind = document.createElement('p');
      mind.className = 'panel-note';
      mind.textContent =
        'Use the plan box for mind-map style notes: centre the organisation case, then branch motivation, target, method and connections.';
      planBox.appendChild(mind);
    }

    function mountAnswer(id, labelText, key, rows, minChars) {
      textFields.mount(planBox, {
        wrapClass: 'w4-reflection-field',
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

    mountAnswer('analyse-motivation', 'Plausible motivation (why)', 'motivation', 2, SHORT_MIN);
    mountAnswer('analyse-target', 'Relevant target (what)', 'target', 2, SHORT_MIN);
    mountAnswer('analyse-method', 'Appropriate method (how)', 'method', 2, SHORT_MIN);
    mountAnswer('analyse-plan', 'Analysis plan / response draft', 'plan', 8, PLAN_MIN);

    data.checklist.forEach(function (item, index) {
      var label = document.createElement('label');
      label.className = 'w4-checkbox-label';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!state.checklist['c' + index];
      input.addEventListener('change', function () {
        state.checklist['c' + index] = input.checked;
        save();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + item));
      planBox.appendChild(label);
    });

    panel.appendChild(planBox);

    var feedback = document.createElement('div');
    feedback.id = 'w4-analyse-feedback';
    feedback.className = 'status-messages';
    feedback.setAttribute('aria-live', 'assertive');
    panel.appendChild(feedback);

    var actions = document.createElement('div');
    actions.className = 'w4-actions';
    var printBtn = document.createElement('button');
    printBtn.type = 'button';
    printBtn.className = 'btn btn-secondary';
    printBtn.textContent = 'Print planning page';
    printBtn.addEventListener('click', function () {
      window.print();
    });
    actions.appendChild(printBtn);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Mark planning complete';
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
      ok.textContent =
        'Planning complete. Local checklist score: ' + marks + ' / ' + data.total + '.';
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
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var pairs = [
            { id: 'AN1', value: state.template },
            { id: 'AN2', value: state.motivation },
            { id: 'AN3', value: state.target },
            { id: 'AN4', value: state.method },
            { id: 'AN5', value: state.plan },
            { id: 'AN6', value: state.checklist, structured: true }
          ];
          return pairs.map(function (pair) {
            if (pair.structured) {
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
