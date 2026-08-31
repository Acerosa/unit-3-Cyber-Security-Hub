(function () {
  'use strict';

  var data = window.Week6DiscussPlanner;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'discuss-planner';
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var state = { issue: '' };
  data.columns.forEach(function (col) {
    state[col.id] = '';
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      state = Object.assign(state, draft.state || {});
    }
  }

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for discuss-planner fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        state: state,
        savedAt: new Date().toISOString()
      });
    }
  }

  function hasConcessionLabel(text) {
    var value = String(text || '').trim();
    if (!value) return false;
    var label = String(data.concessionLabel || 'Concession:').toLowerCase();
    return value.toLowerCase().indexOf(label.replace(':', '')) !== -1 || value.indexOf('Concession') !== -1;
  }

  function computeScore() {
    var marks = 0;
    if (String(state.issue || '').trim().length >= 20) marks += 1;
    data.columns.forEach(function (col) {
      if (String(state[col.id] || '').trim().length >= col.minLength) marks += 1;
    });
    if (hasConcessionLabel(state.concessionConclusion || '')) marks += 1;
    var blob = (
      state.issue +
      ' ' +
      state.supporting +
      ' ' +
      state.competing +
      ' ' +
      state.concessionConclusion
    ).toLowerCase();
    if (blob.indexOf('northbank') !== -1) marks += 1;
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    if (String(state.issue || '').trim().length < 20) {
      messages.push('State the issue in at least one full sentence.');
    }
    data.columns.forEach(function (col) {
      var value = String(state[col.id] || '').trim();
      if (value.length < col.minLength) {
        messages.push('Complete: ' + col.label);
      } else if (col.requiresConcessionLabel && !hasConcessionLabel(value)) {
        messages.push(
          'The concession and conclusion field must include a clearly labelled concession (for example "' +
            data.concessionLabel +
            '").'
        );
      }
    });
    return messages;
  }

  function render() {
    if (!host) return;
    textFields.destroyAll();
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>Discuss response planner</h2>' +
      '<p class="w6-scenario">' +
      data.scenario +
      '</p>' +
      '<p class="panel-note"><strong>Optional starters:</strong> ' +
      data.sentenceStarters.join(' ') +
      '</p>' +
      '<p id="w6-planner-save-note" class="panel-note" aria-live="polite">Draft saved automatically in this browser.</p>');

    textFields.mount(panel, {
      wrapClass: 'w6-reflection-field',
      id: 'planner-issue',
      prompt: data.issuePrompt,
      minChars: 20,
      value: state.issue || '',
      rows: 3,
      onChange: function (next) {
        state.issue = next;
        save();
      }
    });

    var grid = document.createElement('div');
    grid.className = 'w6-plan-grid w6-two-col';
    data.columns.forEach(function (col) {
      var card = document.createElement('section');
      card.className = 'w6-review-item';
      var heading = document.createElement('h3');
      heading.textContent = col.label;
      card.appendChild(heading);
      var desc = document.createElement('p');
      desc.className = 'panel-note';
      desc.textContent = col.description;
      card.appendChild(desc);
      textFields.mount(card, {
        wrapClass: 'w6-reflection-field',
        id: 'planner-' + col.id,
        prompt: col.requiresConcessionLabel
          ? 'Your response (include "' + data.concessionLabel + '" before the conclusion)'
          : 'Your notes',
        minChars: col.minLength,
        value: state[col.id] || '',
        rows: 6,
        onChange: function (next) {
          state[col.id] = next;
          save();
        }
      });
      grid.appendChild(card);
    });
    panel.appendChild(grid);

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-secondary';
    resetBtn.textContent = 'Reset planner';
    resetBtn.addEventListener('click', function () {
      if (
        !window.confirm(
          'Reset all planner fields? Your saved draft in this browser will be cleared.'
        )
      ) {
        return;
      }
      state = { issue: '' };
      data.columns.forEach(function (col) {
        state[col.id] = '';
      });
      save();
      render();
    });
    actions.appendChild(resetBtn);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete planner';
    btn.addEventListener('click', function () {
      var messages = validate();
      var status = document.getElementById('w6-planner-status');
      if (!status) {
        status = document.createElement('div');
        status.id = 'w6-planner-status';
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
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);setAuthoredHtml(status, '<p class="message message-success">Planner completed (' +
        score +
        ' / ' +
        data.total +
        ').</p>');
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
          var items = [
            { id: 'DP1', value: state.issue, complete: String(state.issue || '').trim().length >= 20 },
            { id: 'DP2', value: state.supporting, complete: String(state.supporting || '').trim().length >= data.columns[0].minLength },
            { id: 'DP3', value: state.competing, complete: String(state.competing || '').trim().length >= data.columns[1].minLength },
            { id: 'DP4', value: state.concessionConclusion, complete: String(state.concessionConclusion || '').trim().length >= data.columns[2].minLength },
            { id: 'DP5', value: state.concessionConclusion, complete: hasConcessionLabel(state.concessionConclusion) },
            { id: 'DP6', value: state, complete: JSON.stringify(state).toLowerCase().indexOf('northbank') !== -1 }
          ];
          return items.map(function (item) {
            return evidence && evidence.structured
              ? evidence.structured(item.id, item.value, {
                  responseType: typeof item.value === 'string' ? 'text' : 'structured',
                  correct: item.complete,
                  score: item.complete ? 1 : 0
                })
              : {
                  questionId: item.id,
                  response: item.value,
                  correct: item.complete,
                  score: item.complete ? 1 : 0,
                  responseType: typeof item.value === 'string' ? 'text' : 'structured'
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
