(function () {
  'use strict';

  var data = window.Week5StakeholderGrid;
  var progress = window.Unit3Week5Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'stakeholder-grid';
  var host = document.getElementById('w5-activity-host');
  var startedAt = new Date().toISOString();
  var rows = {};
  var reflection = { overlooked: '', hardest: '', compare: '' };

  data.stakeholders.forEach(function (stakeholder) {
    rows[stakeholder.id] = {
      loss: '',
      disruption: '',
      safety: '',
      evidence: '',
      timescale: ''
    };
    if (stakeholder.workedExample && stakeholder.worked) {
      rows[stakeholder.id] = Object.assign({}, stakeholder.worked);
    }
  });
  Object.keys(data.partlyCompletedSeed || {}).forEach(function (key) {
    rows[key] = Object.assign(rows[key] || {}, data.partlyCompletedSeed[key]);
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      rows = Object.assign(rows, draft.rows || {});
      reflection = Object.assign(reflection, draft.reflection || {});
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        rows: rows,
        reflection: reflection,
        savedAt: new Date().toISOString()
      });
    }
  }

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for stakeholder-grid fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  function rowComplete(id, requireSafety) {
    var row = rows[id] || {};
    var base =
      String(row.loss || '').trim().length >= 8 &&
      String(row.disruption || '').trim().length >= 8 &&
      String(row.evidence || '').trim().length >= 8 &&
      String(row.timescale || '').trim().length >= 8;
    if (!requireSafety) return base;
    return base && String(row.safety || '').trim().length >= 8;
  }

  function financialOnlyTrap() {
    // Completion must not depend on loss alone across the grid.
    var disruptionFilled = 0;
    var safetyFilled = 0;
    data.stakeholders.forEach(function (stakeholder) {
      if (String((rows[stakeholder.id] || {}).disruption || '').trim().length >= 8) {
        disruptionFilled += 1;
      }
      if (String((rows[stakeholder.id] || {}).safety || '').trim().length >= 8) {
        safetyFilled += 1;
      }
    });
    return disruptionFilled < 4 || safetyFilled < 3;
  }

  function computeScore() {
    var marks = 0;
    data.stakeholders.forEach(function (stakeholder) {
      if (rowComplete(stakeholder.id, true)) marks += 1;
    });
    if (
      String(reflection.overlooked || '').trim().length >= 20 &&
      String(reflection.hardest || '').trim().length >= 12 &&
      String(reflection.compare || '').trim().length >= 20
    ) {
      marks += 3;
    }
    return Math.min(data.total, marks);
  }

  function missingSummary() {
    var missing = [];
    data.stakeholders.forEach(function (stakeholder) {
      var row = rows[stakeholder.id] || {};
      data.columns.forEach(function (col) {
        if (String(row[col.id] || '').trim().length < 8) {
          missing.push(stakeholder.label + ' → ' + col.label);
        }
      });
    });
    return missing;
  }

  function validate() {
    var messages = [];
    var missing = missingSummary();
    if (missing.length) {
      messages.push(
        'Complete every cell. Still missing: ' + missing.slice(0, 6).join('; ') +
          (missing.length > 6 ? '…' : '')
      );
    }
    if (financialOnlyTrap()) {
      messages.push(
        'Do not complete the task using only financial-loss style answers. Strengthen disruption and safety across stakeholders.'
      );
    }
    if (String(reflection.overlooked || '').trim().length < 20) {
      messages.push('Complete the reflection: two impacts initially overlooked.');
    }
    if (String(reflection.hardest || '').trim().length < 12) {
      messages.push('Complete the reflection: hardest stakeholder to analyse.');
    }
    if (String(reflection.compare || '').trim().length < 20) {
      messages.push('Complete the reflection: patient versus regulator.');
    }
    return messages;
  }

  function textCell(parent, id, label, value, onInput, readOnly, minChars) {
    textFields.mount(parent, {
      wrapClass: 'w5-reflection-field',
      id: id,
      prompt: label,
      minChars: minChars,
      value: value || '',
      rows: 3,
      disabled: !!readOnly,
      onChange: function (next) {
        onInput(next);
        save();
        updateCompletion();
      }
    });
  }

  function updateCompletion() {
    var el = document.getElementById('w5-grid-completion');
    if (!el) return;
    var missing = missingSummary();
    el.textContent =
      missing.length === 0
        ? 'All grid cells have content. Complete the reflection stage next.'
        : missing.length + ' cells still need content. Instructions remain visible above.';
  }

  function render() {
    if (!host) return;
    textFields.destroyAll();
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>Stakeholder impact grid</h2>' +
      '<p class="w5-scenario">' +
      data.scenario +
      '</p>' +
      '<p class="w5-callout" role="note" id="w5-grid-instructions">' +
      data.instructionsVisible +
      '</p>' +
      '<p class="panel-note"><strong>Checklist:</strong> ' +
      data.checklist.join(' · ') +
      '</p>' +
      '<p class="panel-note"><strong>Optional starters:</strong> ' +
      data.sentenceStarters.join(' ') +
      '</p>' +
      '<p id="w5-grid-completion" class="panel-note" aria-live="polite"></p>');

    data.stakeholders.forEach(function (stakeholder) {
      var block = document.createElement('section');
      block.className = 'w5-review-item';
      block.setAttribute('aria-labelledby', 'stake-' + stakeholder.id);
      var h = document.createElement('h3');
      h.id = 'stake-' + stakeholder.id;
      h.textContent =
        stakeholder.label + (stakeholder.workedExample ? ' (worked example)' : '');
      block.appendChild(h);
      if (stakeholder.workedExample) {
        var note = document.createElement('p');
        note.className = 'panel-note';
        note.textContent =
          'This individuals row is provided as a worked example. You may refine it, but every other stakeholder still needs full coverage.';
        block.appendChild(note);
      }
      data.columns.forEach(function (col) {
        textCell(
          block,
          stakeholder.id + '-' + col.id,
          col.label,
          rows[stakeholder.id][col.id],
          function (value) {
            rows[stakeholder.id][col.id] = value;
          },
          false,
          8
        );
      });
      panel.appendChild(block);
    });

    var ref = document.createElement('section');
    ref.className = 'w5-review-item';setAuthoredHtml(ref, '<h3>Comparison and reflection</h3>');
    textCell(
      ref,
      'ref-overlooked',
      data.reflection.overlooked,
      reflection.overlooked,
      function (value) {
        reflection.overlooked = value;
      },
      false,
      20
    );
    textCell(
      ref,
      'ref-hardest',
      data.reflection.hardest,
      reflection.hardest,
      function (value) {
        reflection.hardest = value;
      },
      false,
      12
    );
    textCell(
      ref,
      'ref-compare',
      data.reflection.compare,
      reflection.compare,
      function (value) {
        reflection.compare = value;
      },
      false,
      20
    );
    panel.appendChild(ref);

    var actions = document.createElement('div');
    actions.className = 'w5-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete stakeholder grid';
    btn.addEventListener('click', function () {
      var messages = validate();
      var status = document.getElementById('w5-grid-status');
      if (!status) {
        status = document.createElement('div');
        status.id = 'w5-grid-status';
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
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);setAuthoredHtml(status, '<p class="message message-success">Grid completed (' +
        score +
        ' / ' +
        data.total +
        ').</p>');
      window.Unit3Week5Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w5-submit-host',
        getScore: function () {
          return score;
        },
        getTotal: function () {
          return data.total;
        },
        getReflection: function () {
          return JSON.stringify(reflection);
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - Date.parse(startedAt)) / 1000));
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var out = [];
          data.stakeholders.forEach(function (stakeholder, index) {
            var qid = 'SG' + (index + 1);
            var row = Object.assign(
              { stakeholderId: stakeholder.id, label: stakeholder.label },
              rows[stakeholder.id] || {}
            );
            if (evidence && evidence.structured) {
              out.push(
                evidence.structured(qid, row, {
                  correct: Boolean(String(row.loss || '').trim()),
                  score: 1
                })
              );
            } else {
              out.push({
                questionId: qid,
                response: row,
                responseType: 'structured',
                correct: true,
                score: 1
              });
            }
          });
          // Catalogue: SG8/SG9/SG10 are the three reflection prompts.
          var reflections = [
            { id: 'SG8', value: reflection.overlooked },
            { id: 'SG9', value: reflection.hardest },
            { id: 'SG10', value: reflection.compare }
          ];
          reflections.forEach(function (item) {
            if (evidence && evidence.freeText) {
              out.push(
                evidence.freeText(item.id, item.value || '', {
                  correct: String(item.value || '').trim().length > 0,
                  score: 1
                })
              );
            } else {
              out.push({
                questionId: item.id,
                response: item.value || '',
                responseType: 'text',
                correct: true,
                score: 1
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
          return true;
        }
      });
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
    host.appendChild(panel);
    updateCompletion();
  }

  render();
})();
