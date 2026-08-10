(function () {
  'use strict';

  var data = window.Week4MtmMapping;
  var progress = window.Unit3Week4Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'mtm-mapping';
  var host = document.getElementById('w4-activity-host');
  var startedAt = new Date().toISOString();
  var responses = {};
  var presentationFormat = data.presentationOptions[0];

  data.scenarios.forEach(function (scenario) {
    responses[scenario.id] = {
      motivation: '',
      target: '',
      method: '',
      evidence: '',
      connection: '',
      alternative: '',
      alternativeWhy: ''
    };
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      responses = Object.assign(responses, draft.responses || {});
      presentationFormat = draft.presentationFormat || presentationFormat;
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        responses: responses,
        presentationFormat: presentationFormat,
        savedAt: new Date().toISOString()
      });
    }
  }

  function scenarioComplete(id) {
    var row = responses[id] || {};
    return (
      String(row.motivation || '').trim() &&
      String(row.target || '').trim() &&
      String(row.method || '').trim() &&
      String(row.evidence || '').trim().length >= 8 &&
      String(row.connection || '').trim().length >= 20
    );
  }

  function computeScore() {
    var marks = 0;
    data.scenarios.forEach(function (scenario) {
      if (!scenarioComplete(scenario.id)) return;
      marks += 1;
      var row = responses[scenario.id];
      var motOk =
        scenario.acceptedMotivations.indexOf(row.motivation) !== -1 ||
        (scenario.ambiguous && String(row.alternative || '').trim());
      var targetOk = scenario.acceptedTargets.indexOf(row.target) !== -1;
      var methodOk = scenario.acceptedMethods.indexOf(row.method) !== -1;
      if (motOk && targetOk && methodOk) marks += 1;
    });
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    data.scenarios.forEach(function (scenario, index) {
      if (!scenarioComplete(scenario.id)) {
        messages.push(
          'Complete motivation, target, method, evidence and the connection for scenario ' +
            (index + 1) +
            ' before submitting.'
        );
      } else if (String(responses[scenario.id].connection || '').trim().length < 20) {
        messages.push('Explain the connection before submitting scenario ' + (index + 1) + '.');
      }
    });
    return messages;
  }

  function selectField(parent, id, labelText, options, value, onChange) {
    var wrap = document.createElement('div');
    wrap.className = 'w4-reflection-field';
    var label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    wrap.appendChild(label);
    var select = document.createElement('select');
    select.id = id;
    var blank = document.createElement('option');
    blank.value = '';
    blank.textContent = 'Select…';
    select.appendChild(blank);
    options.forEach(function (opt) {
      var option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      if (value === opt) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener('change', function () {
      onChange(select.value);
      save();
    });
    wrap.appendChild(select);
    parent.appendChild(wrap);
  }

  function textField(parent, id, labelText, value, onInput, rows) {
    var wrap = document.createElement('div');
    wrap.className = 'w4-reflection-field';
    var label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    wrap.appendChild(label);
    var area = document.createElement('textarea');
    area.id = id;
    area.rows = rows || 3;
    area.value = value || '';
    area.addEventListener('input', function () {
      onInput(area.value);
      save();
    });
    wrap.appendChild(area);
    parent.appendChild(wrap);
  }

  function renderScenarioForm(parent, scenario, index) {
    var block = document.createElement('section');
    block.className = 'w4-review-item';
    block.innerHTML =
      '<h3>' +
      (index + 1) +
      '. ' +
      scenario.title +
      ' (' +
      scenario.theme +
      ')</h3>' +
      '<p class="w4-scenario">' +
      scenario.scenario +
      '</p>' +
      '<p class="panel-note">' +
      scenario.hint +
      (scenario.ambiguousNote ? ' ' + scenario.ambiguousNote : '') +
      '</p>';
    var row = responses[scenario.id];
    selectField(
      block,
      scenario.id + '-motivation',
      data.columnLabels.motivation,
      data.motivationBank,
      row.motivation,
      function (value) {
        row.motivation = value;
      }
    );
    selectField(
      block,
      scenario.id + '-target',
      data.columnLabels.target,
      data.targetBank,
      row.target,
      function (value) {
        row.target = value;
      }
    );
    selectField(
      block,
      scenario.id + '-method',
      data.columnLabels.method,
      data.methodBank,
      row.method,
      function (value) {
        row.method = value;
      }
    );
    textField(
      block,
      scenario.id + '-evidence',
      data.columnLabels.evidence,
      row.evidence,
      function (value) {
        row.evidence = value;
      }
    );
    textField(
      block,
      scenario.id + '-connection',
      data.columnLabels.connection,
      row.connection,
      function (value) {
        row.connection = value;
      },
      4
    );
    selectField(
      block,
      scenario.id + '-alternative',
      data.columnLabels.alternative,
      data.motivationBank,
      row.alternative,
      function (value) {
        row.alternative = value;
      }
    );
    textField(
      block,
      scenario.id + '-alternativeWhy',
      data.columnLabels.alternativeWhy,
      row.alternativeWhy,
      function (value) {
        row.alternativeWhy = value;
      }
    );
    parent.appendChild(block);
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Motivation, target and method mapping</h2>' +
      '<p class="w4-formula" role="note">Why = motivation · What = target · How = method</p>' +
      '<p class="panel-note">Motivation bank: ' +
      data.motivationBank.join('; ') +
      '.</p>' +
      '<h3>Worked examples</h3>' +
      '<p class="panel-note">These rows model the difference between listing facts and explaining the connection.</p>';

    data.workedRows.forEach(function (row) {
      var worked = document.createElement('article');
      worked.className = 'w4-review-item w4-improved-response';
      worked.innerHTML =
        '<h4>' +
        row.theme +
        '</h4>' +
        '<p class="w4-scenario">' +
        row.scenario +
        '</p>' +
        '<ul class="section-list">' +
        '<li><strong>Motivation:</strong> ' +
        row.motivation +
        '</li>' +
        '<li><strong>Target:</strong> ' +
        row.target +
        '</li>' +
        '<li><strong>Method:</strong> ' +
        row.method +
        '</li>' +
        '<li><strong>Evidence:</strong> ' +
        row.evidence +
        '</li>' +
        '<li><strong>Connection:</strong> ' +
        row.connection +
        '</li>' +
        '<li><strong>Alternative:</strong> ' +
        row.alternative +
        ' — ' +
        row.alternativeWhy +
        '</li>' +
        '</ul>' +
        '<p class="w4-annotation">' +
        row.teachingNote +
        '</p>';
      panel.appendChild(worked);
    });

    var indep = document.createElement('h3');
    indep.textContent = 'Independent mapping scenarios';
    panel.appendChild(indep);
    data.scenarios.forEach(function (scenario, index) {
      renderScenarioForm(panel, scenario, index);
    });

    var present = document.createElement('section');
    present.className = 'w4-review-item';
    present.innerHTML =
      '<h3>Two-minute explanation preparation</h3>' +
      '<p class="panel-note">Prepare a short explanation covering motivation, target, method, why the target was logical, and why the method suited the target.</p>' +
      '<ul class="section-list">' +
      data.presentationChecklist
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>';
    var fieldset = document.createElement('fieldset');
    fieldset.className = 'w4-options';
    var legend = document.createElement('legend');
    legend.textContent = 'Choose a response format';
    fieldset.appendChild(legend);
    data.presentationOptions.forEach(function (option, index) {
      var id = 'present-' + index;
      var label = document.createElement('label');
      label.className = 'w4-option';
      label.setAttribute('for', id);
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'presentation';
      input.id = id;
      input.value = option;
      if (presentationFormat === option) input.checked = true;
      input.addEventListener('change', function () {
        presentationFormat = option;
        save();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + option));
      fieldset.appendChild(label);
    });
    present.appendChild(fieldset);
    panel.appendChild(present);

    var feedback = document.createElement('div');
    feedback.id = 'w4-map-feedback';
    feedback.className = 'status-messages';
    feedback.setAttribute('aria-live', 'assertive');
    panel.appendChild(feedback);

    var actions = document.createElement('div');
    actions.className = 'w4-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Mark mapping complete';
    btn.addEventListener('click', function () {
      var errors = validate();
      feedback.textContent = '';
      if (errors.length) {
        errors.slice(0, 3).forEach(function (message) {
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
        'Mapping complete. Local score: ' +
        marks +
        ' / ' +
        data.total +
        '. Ambiguous motivations are checked for a defended choice, not a single forced answer.';
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
          return 'Presentation format: ' + presentationFormat;
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var scenarioOrder = [
            'map-espionage',
            'map-hacktivism',
            'map-ransomware',
            'map-defacement'
          ];
          var out = [];
          scenarioOrder.forEach(function (scenarioId, index) {
            var n = index + 1;
            var row = responses[scenarioId] || {};
            var motPayload = {
              motivation: row.motivation || '',
              evidence: row.evidence || '',
              connection: row.connection || '',
              alternative: row.alternative || '',
              alternativeWhy: row.alternativeWhy || ''
            };
            var tgtPayload = {
              target: row.target || '',
              method: row.method || '',
              evidence: row.evidence || '',
              connection: row.connection || ''
            };
            var complete = scenarioComplete(scenarioId);
            if (evidence && evidence.structured) {
              out.push(
                evidence.structured('MAP' + n + 'MOT', motPayload, {
                  correct: complete,
                  score: complete ? 1 : 0
                })
              );
              out.push(
                evidence.structured('MAP' + n + 'TGT', tgtPayload, {
                  correct: complete,
                  score: complete ? 1 : 0
                })
              );
            } else {
              out.push({
                questionId: 'MAP' + n + 'MOT',
                response: motPayload,
                responseType: 'structured',
                correct: complete,
                score: complete ? 1 : 0
              });
              out.push({
                questionId: 'MAP' + n + 'TGT',
                response: tgtPayload,
                responseType: 'structured',
                correct: complete,
                score: complete ? 1 : 0
              });
            }
          });
          return out;
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
