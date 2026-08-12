(function () {
  'use strict';

  var data = window.Week6ExerciseDecisionRecord;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'exercise-decision-record';
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var entries = [];
  var editingIndex = null;

  function blankEntry() {
    return {
      title: '',
      decision: '',
      reason: '',
      stakeholder: '',
      ethical: '',
      legal: '',
      operational: '',
      type: '',
      evidenceNeeded: '',
      reflection: ''
    };
  }

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion && draft.entries) {
      entries = draft.entries.slice();
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        entries: entries,
        savedAt: new Date().toISOString()
      });
    }
  }

  function entryComplete(entry) {
    return (
      String(entry.title || '').trim().length >= 3 &&
      String(entry.decision || '').trim().length >= 8 &&
      String(entry.reason || '').trim().length >= 8 &&
      String(entry.stakeholder || '').trim().length >= 3 &&
      String(entry.ethical || '').trim().length >= 8 &&
      String(entry.legal || '').trim().length >= 8 &&
      String(entry.operational || '').trim().length >= 8 &&
      String(entry.type || '').trim() &&
      String(entry.evidenceNeeded || '').trim().length >= 8
    );
  }

  function computeScore() {
    var complete = entries.filter(entryComplete).length;
    var marks = Math.min(4, complete >= 2 ? 4 : complete >= 1 ? 2 : 0);
    var hasReflection = entries.some(function (entry) {
      return String(entry.reflection || '').trim().length >= 12;
    });
    if (hasReflection && complete >= 2) marks = Math.min(data.total, marks + 1);
    return Math.min(data.total, marks);
  }

  function renderForm(parent, entry, onSave, onCancel) {
    var form = document.createElement('div');
    form.className = 'w6-decision-entry';

    data.entryFields.forEach(function (field) {
      var wrap = document.createElement('div');
      wrap.className = 'w6-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', 'field-' + field.id);
      label.textContent = field.label;
      wrap.appendChild(label);

      if (field.type === 'select') {
        var select = document.createElement('select');
        select.id = 'field-' + field.id;
        var blank = document.createElement('option');
        blank.value = '';
        blank.textContent = 'Select decision type…';
        select.appendChild(blank);
        data.decisionTypes.forEach(function (type) {
          var opt = document.createElement('option');
          opt.value = type;
          opt.textContent = type;
          if (entry.type === type) opt.selected = true;
          select.appendChild(opt);
        });
        select.addEventListener('change', function () {
          entry.type = select.value;
        });
        wrap.appendChild(select);
      } else {
        var area = document.createElement('textarea');
        area.id = 'field-' + field.id;
        area.rows = field.rows || 2;
        area.value = entry[field.id] || '';
        area.addEventListener('input', function () {
          entry[field.id] = area.value;
        });
        wrap.appendChild(area);
      }
      form.appendChild(wrap);
    });

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-primary';
    saveBtn.textContent = 'Save entry';
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
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Exercise decision record</h2>' +
      '<p><strong>Organisation:</strong> ' +
      data.organisation +
      '</p>' +
      '<p><strong>Exercise:</strong> <em>' +
      data.exerciseTitle +
      '</em></p>' +
      '<p class="panel-note">' +
      data.intro +
      '</p>' +
      '<p class="w6-callout" role="note">' +
      data.reviseNote +
      '</p>';

    entries.forEach(function (entry, index) {
      if (editingIndex === index) return;
      var block = document.createElement('article');
      block.className = 'w6-review-item';
      block.innerHTML =
        '<h3>' +
        (entry.title || 'Untitled decision') +
        '</h3>' +
        '<p><strong>Decision:</strong> ' +
        (entry.decision || '') +
        '</p>' +
        '<p><span class="w6-dimension-label w6-ethical">Ethical</span> ' +
        (entry.ethical || '') +
        '</p>' +
        '<p><span class="w6-dimension-label w6-legal">Legal</span> ' +
        (entry.legal || '') +
        '</p>' +
        '<p><span class="w6-dimension-label w6-operational">Operational</span> ' +
        (entry.operational || '') +
        '</p>' +
        '<p><strong>Type:</strong> ' +
        (entry.type || 'Not set') +
        '</p>';

      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn btn-secondary';
      editBtn.textContent = 'Edit entry';
      editBtn.addEventListener('click', function () {
        editingIndex = index;
        render();
      });
      block.appendChild(editBtn);
      panel.appendChild(block);
    });

    if (editingIndex != null && entries[editingIndex]) {
      renderForm(
        panel,
        entries[editingIndex],
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
      addBtn.textContent = 'Add decision entry';
      addBtn.addEventListener('click', function () {
        entries.push(blankEntry());
        editingIndex = entries.length - 1;
        render();
      });
      panel.appendChild(addBtn);
    }

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var completeBtn = document.createElement('button');
    completeBtn.type = 'button';
    completeBtn.className = 'btn btn-primary';
    completeBtn.textContent = 'Complete decision record';
    completeBtn.addEventListener('click', function () {
      var completeCount = entries.filter(entryComplete).length;
      if (completeCount < data.minDecisions) {
        var warn = document.createElement('p');
        warn.className = 'message message-warning';
        warn.textContent =
          'Record at least ' +
          data.minDecisions +
          ' complete decision entries with ethical, legal and operational notes.';
        panel.appendChild(warn);
        return;
      }
      save();
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
      var status = document.createElement('p');
      status.className = 'message message-success';
      status.setAttribute('aria-live', 'polite');
      status.textContent = 'Decision record completed (' + score + ' / ' + data.total + ').';
      panel.appendChild(status);
      window.Unit3Week6Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w6-submit-host',
        getScore: function () {
          return score;
        },
        getTotal: function () {
          return data.total;
        },
        getReflection: function () {
          return JSON.stringify(entries);
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var completeEntries = entries.filter(entryComplete);
          var hasReflection = entries.some(function (entry) {
            return String(entry.reflection || '').trim().length >= 12;
          });
          var items = [
            { id: 'ED1', value: completeEntries[0] || null, complete: completeEntries.length >= 1 },
            { id: 'ED2', value: completeEntries[0] || null, complete: completeEntries.length >= 1 },
            { id: 'ED3', value: completeEntries[1] || null, complete: completeEntries.length >= 2 },
            { id: 'ED4', value: completeEntries[1] || null, complete: completeEntries.length >= 2 },
            { id: 'ED5', value: entries.map(function (entry) { return entry.reflection || ''; }), complete: hasReflection && completeEntries.length >= 2 }
          ];
          return items.map(function (item) {
            return evidence && evidence.structured
              ? evidence.structured(item.id, item.value, {
                  responseType: 'structured',
                  correct: item.complete,
                  score: item.complete ? 1 : 0
                })
              : {
                  questionId: item.id,
                  response: item.value,
                  correct: item.complete,
                  score: item.complete ? 1 : 0,
                  responseType: 'structured'
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
    actions.appendChild(completeBtn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
