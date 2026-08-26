(function () {
  'use strict';

  var data = window.Week7HeightenedThreat;
  var progress = window.Unit3Week7Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'heightened-threat';
  var host = document.getElementById('w7-activity-host');
  var startedAt = Date.now();
  var state = {
    exerciseTitle: 'Heightened cyber threat',
    northbankContext: '',
    learnerRole: '',
    groupCode: '',
    groupNotes: '',
    entries: []
  };
  var editingIndex = null;

  function blankEntry() {
    return {
      riskRegisterRef: '',
      manualRef: '',
      proposedAction: '',
      riskAddressed: '',
      additionalMonitoring: '',
      costAccepted: '',
      benefitGained: '',
      stopDelayReduce: '',
      groupJustification: '',
      debriefNotes: ''
    };
  }

  function loadRegisterOptions() {
    var options = [];
    if (progress) {
      var draft = progress.getDraft('risk-register');
      if (draft && Array.isArray(draft.entries)) {
        draft.entries.forEach(function (entry, index) {
          if (entry && entry.asset) {
            options.push({
              value: 'RR' + (index + 1) + ': ' + entry.asset,
              label: 'RR' + (index + 1) + ': ' + entry.asset
            });
          }
        });
      }
    }
    options.push({ value: '__manual__', label: 'Manual reference (type below)' });
    return options;
  }

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion && draft.state) {
      state = Object.assign(state, draft.state);
      if (!Array.isArray(state.entries)) state.entries = [];
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

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for heightened-threat fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  function refValue(entry) {
    if (entry.riskRegisterRef === '__manual__') return String(entry.manualRef || '').trim();
    return String(entry.riskRegisterRef || '').trim();
  }

  function entryComplete(entry) {
    return (
      refValue(entry).length >= 3 &&
      String(entry.proposedAction || '').trim().length >= 8 &&
      String(entry.riskAddressed || '').trim().length >= 8 &&
      String(entry.groupJustification || '').trim().length >= 12
    );
  }

  function costBenefitComplete(entry) {
    return (
      entryComplete(entry) &&
      String(entry.costAccepted || '').trim().length >= 8 &&
      String(entry.benefitGained || '').trim().length >= 8
    );
  }

  function computeScore() {
    var complete = state.entries.filter(entryComplete).length;
    var withCb = state.entries.filter(costBenefitComplete).length;
    var score = 0;
    if (String(state.northbankContext || '').trim().length >= 20) score += 1;
    if (String(state.learnerRole || '').trim().length >= 3) score += 1;
    if (withCb >= data.minDecisionsWithCostBenefit) score += 2;
    else if (withCb >= 1) score += 1;
    if (
      complete >= 2 &&
      state.entries.some(function (entry) {
        return String(entry.debriefNotes || '').trim().length >= 12;
      })
    ) {
      score += 1;
    }
    return Math.min(data.total, score);
  }

  function field(parent, id, labelText, key, rows, minChars) {
    textFields.mount(parent, {
      wrapClass: 'w7-reflection-field',
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

  function renderEntryForm(parent, entry, onSave, onCancel) {
    var form = document.createElement('div');
    form.className = 'w7-decision-entry';
    var registerOptions = loadRegisterOptions();

    var entryMins = {
      proposedAction: 8,
      riskAddressed: 8,
      additionalMonitoring: 40,
      costAccepted: 8,
      benefitGained: 8,
      stopDelayReduce: 40,
      groupJustification: 12,
      debriefNotes: 12
    };

    data.entryFields.forEach(function (fieldDef) {
      var wrap = document.createElement('div');
      wrap.className = 'w7-reflection-field';
      var fieldId = 'ht-' + fieldDef.id;

      if (fieldDef.type === 'ref') {
        var label = document.createElement('label');
        label.setAttribute('for', fieldId);
        label.textContent = fieldDef.label;
        wrap.appendChild(label);
        var select = document.createElement('select');
        select.id = fieldId;
        var blank = document.createElement('option');
        blank.value = '';
        blank.textContent = 'Select risk register entry…';
        select.appendChild(blank);
        registerOptions.forEach(function (option) {
          var opt = document.createElement('option');
          opt.value = option.value;
          opt.textContent = option.label;
          if (entry.riskRegisterRef === option.value) opt.selected = true;
          select.appendChild(opt);
        });
        select.addEventListener('change', function () {
          entry.riskRegisterRef = select.value;
        });
        wrap.appendChild(select);
        textFields.mount(wrap, {
          id: fieldId + '-manual',
          prompt: 'Manual reference if needed',
          minChars: 20,
          value: entry.manualRef || '',
          rows: 1,
          onChange: function (next) {
            entry.manualRef = next;
            if (String(next || '').trim()) entry.riskRegisterRef = '__manual__';
          }
        });
      } else {
        textFields.mount(wrap, {
          id: fieldId,
          prompt: fieldDef.label,
          minChars: entryMins[fieldDef.id] || 40,
          value: entry[fieldDef.id] || '',
          rows: fieldDef.rows || 2,
          onChange: function (next) {
            entry[fieldDef.id] = next;
          }
        });
      }
      form.appendChild(wrap);
    });

    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    var saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-primary';
    saveBtn.textContent = 'Save decision';
    saveBtn.addEventListener('click', onSave);
    actions.appendChild(saveBtn);
    if (onCancel) {
      var cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn btn-secondary';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', onCancel);
      actions.appendChild(cancelBtn);
    }
    form.appendChild(actions);
    parent.appendChild(form);
  }

  function render() {
    if (!host) return;
    textFields.destroyAll();
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>' +
      data.activityName +
      '</h2>' +
      '<p><strong>Organisation:</strong> ' +
      data.organisation +
      '</p>' +
      '<p class="panel-note">' +
      data.intro +
      '</p>' +
      '<p><a class="btn btn-secondary" href="' +
      data.ncscUrl +
      '" target="_blank" rel="noopener noreferrer">Open NCSC Heightened cyber threat page <span aria-hidden="true">↗</span></a></p>' +
      '<p class="w7-callout" role="note">' +
      data.collaborationNote +
      '</p>';

    field(panel, 'exercise-title', 'Exercise title', 'exerciseTitle', 1, 20);
    field(
      panel,
      'northbank-context',
      'Northbank context for this facilitated session',
      'northbankContext',
      3,
      20
    );
    field(panel, 'learner-role', 'Your role in the group', 'learnerRole', 1, 3);
    field(panel, 'group-code', 'Local group code (shared verbally)', 'groupCode', 1, 20);
    field(panel, 'group-notes', 'Shared group notes paste area', 'groupNotes', 4, 40);

    state.entries.forEach(function (entry, index) {
      if (editingIndex === index) return;
      var block = document.createElement('article');
      block.className = 'w7-review-item';
      block.innerHTML =
        '<h3>Decision ' +
        (index + 1) +
        '</h3>' +
        '<p><strong>Register ref:</strong> ' +
        (refValue(entry) || 'Not set') +
        '</p>' +
        '<p><strong>Action:</strong> ' +
        (entry.proposedAction || '') +
        '</p>' +
        '<p><strong>Cost / benefit:</strong> ' +
        (entry.costAccepted || '-') +
        ' / ' +
        (entry.benefitGained || '-') +
        '</p>';
      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn btn-secondary';
      editBtn.textContent = 'Edit decision';
      editBtn.addEventListener('click', function () {
        editingIndex = index;
        render();
      });
      block.appendChild(editBtn);
      panel.appendChild(block);
    });

    if (editingIndex != null && state.entries[editingIndex]) {
      renderEntryForm(
        panel,
        state.entries[editingIndex],
        function () {
          save();
          editingIndex = null;
          render();
        },
        function () {
          editingIndex = null;
          render();
        }
      );
    } else {
      var addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn btn-secondary';
      addBtn.textContent = 'Add group decision';
      addBtn.addEventListener('click', function () {
        state.entries.push(blankEntry());
        editingIndex = state.entries.length - 1;
        render();
      });
      panel.appendChild(addBtn);
    }

    var status = document.createElement('div');
    status.className = 'status-messages';
    status.setAttribute('aria-live', 'polite');
    panel.appendChild(status);

    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    var completeBtn = document.createElement('button');
    completeBtn.type = 'button';
    completeBtn.className = 'btn btn-primary';
    completeBtn.textContent = 'Complete decision log';
    completeBtn.addEventListener('click', function () {
      save();
      status.textContent = '';
      var withCb = state.entries.filter(costBenefitComplete).length;
      if (withCb < data.minDecisionsWithCostBenefit) {
        var warn = document.createElement('p');
        warn.className = 'message message-warning';
        warn.textContent =
          'Record at least ' +
          data.minDecisionsWithCostBenefit +
          ' complete decisions that include cost accepted and benefit gained, each linked to a risk register reference.';
        status.appendChild(warn);
        return;
      }
      if (String(state.northbankContext || '').trim().length < 20) {
        var ctx = document.createElement('p');
        ctx.className = 'message message-warning';
        ctx.textContent = 'Add Northbank context for the facilitated session.';
        status.appendChild(ctx);
        return;
      }
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
      var done = document.createElement('p');
      done.className = 'message message-success';
      done.textContent = 'Decision log complete. Score: ' + score + ' / ' + data.total + '.';
      status.appendChild(done);
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
          var completeDecisions = state.entries.filter(costBenefitComplete);
          var debriefOk =
            state.entries.filter(entryComplete).length >= 2 &&
            state.entries.some(function (entry) {
              return String(entry.debriefNotes || '').trim().length >= 12;
            });
          return [
            evidence.freeText('HT1', state.northbankContext, {
              correct: String(state.northbankContext || '').trim().length >= 20,
              score: String(state.northbankContext || '').trim().length >= 20 ? 1 : 0
            }),
            evidence.structured(
              'HT2',
              {
                learnerRole: state.learnerRole,
                exerciseTitle: state.exerciseTitle,
                groupCode: state.groupCode,
                groupNotes: state.groupNotes
              },
              {
                correct: String(state.learnerRole || '').trim().length >= 3,
                score: String(state.learnerRole || '').trim().length >= 3 ? 1 : 0
              }
            ),
            evidence.structured('HT3', completeDecisions[0] || {}, {
              correct: Boolean(completeDecisions[0]),
              score: completeDecisions[0] ? 1 : 0
            }),
            evidence.structured('HT4', completeDecisions[1] || {}, {
              correct: Boolean(completeDecisions[1]),
              score: completeDecisions[1] ? 1 : 0
            }),
            evidence.structured('HT5', { decisions: state.entries }, {
              correct: debriefOk,
              score: debriefOk ? 1 : 0
            })
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
    actions.appendChild(completeBtn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
