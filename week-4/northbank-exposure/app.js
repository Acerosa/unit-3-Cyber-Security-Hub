(function () {
  'use strict';

  var data = window.Week4NorthbankExposure;
  var progress = window.Unit3Week4Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'northbank-exposure';
  var host = document.getElementById('w4-activity-host');
  var startedAt = Date.now();
  var state = {
    exposures: {
      'exposure-1': { item: '', motivation: '', whyAttractive: '' },
      'exposure-2': { item: '', motivation: '', whyAttractive: '' },
      'exposure-3': { item: '', motivation: '', whyAttractive: '' }
    },
    review: {
      mtmDifference: '',
      opportunisticExample: '',
      misconceptionCorrected: '',
      directedStudyTasks: ''
    }
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

  function filled(text) {
    return String(text || '').trim().length >= 8;
  }

  function computeScore() {
    var marks = 0;
    data.prompts.forEach(function (prompt) {
      var row = state.exposures[prompt.id] || {};
      if (filled(row.item) && filled(row.motivation) && filled(row.whyAttractive)) {
        marks += 1;
      }
    });
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    data.prompts.forEach(function (prompt, index) {
      var row = state.exposures[prompt.id] || {};
      if (!filled(row.item) || !filled(row.motivation) || !filled(row.whyAttractive)) {
        messages.push(
          'Complete all three fields for exposure item ' + (index + 1) + ' before submitting.'
        );
      }
    });
    return messages;
  }

  function field(wrapParent, id, labelText, value, onInput, rows) {
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
    wrapParent.appendChild(wrap);
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Northbank passive-exposure reflection</h2>' +
      '<p class="w4-thm-safety" role="note"><strong>Do not investigate a real organisation.</strong> ' +
      data.fictionalNotice +
      '</p>' +
      '<p class="panel-note">' +
      data.notAvailableGuidance +
      '</p>' +
      '<h3>Established Northbank facts you may use</h3><ul class="section-list">' +
      data.establishedFacts
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>' +
      '<p class="w4-callout" role="note"><strong>Conclusion to reinforce:</strong> ' +
      data.conclusion +
      '</p>' +
      '<p class="panel-note">Motivation bank: ' +
      data.motivationBank.join('; ') +
      '.</p>';

    data.prompts.forEach(function (prompt, index) {
      var block = document.createElement('section');
      block.className = 'w4-review-item';
      block.innerHTML = '<h3>' + prompt.label + '</h3>';
      var row = state.exposures[prompt.id];
      prompt.fields.forEach(function (f) {
        field(
          block,
          prompt.id + '-' + f.id,
          f.label,
          row[f.id],
          function (value) {
            state.exposures[prompt.id][f.id] = value;
          },
          3
        );
      });
      panel.appendChild(block);
    });

    var review = document.createElement('section');
    review.className = 'w4-review-item';
    review.innerHTML = '<h3>' + data.session1Review.title + '</h3>';
    data.session1Review.fields.forEach(function (f) {
      field(
        review,
        'review-' + f.id,
        f.label,
        state.review[f.id],
        function (value) {
          state.review[f.id] = value;
        },
        3
      );
    });
    panel.appendChild(review);

    var feedback = document.createElement('div');
    feedback.id = 'w4-exposure-feedback';
    feedback.className = 'status-messages';
    feedback.setAttribute('aria-live', 'assertive');
    panel.appendChild(feedback);

    var actions = document.createElement('div');
    actions.className = 'w4-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Mark reflection complete';
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
        'Reflection complete. Local score based on completed exposure items: ' +
        marks +
        ' / ' +
        data.total +
        '. Analytical judgements are for teacher review, not automatic marking of a single correct answer.';
      feedback.appendChild(ok);
      window.Unit3Week4Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w4-submit-host',
        getScore: computeScore,
        getTotal: function () {
          return data.total;
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        },
        getReflection: function () {
          return data.conclusion;
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
