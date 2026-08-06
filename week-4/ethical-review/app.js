(function () {
  'use strict';

  var data = window.Week4EthicalReview;
  var progress = window.Unit3Week4Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'ethical-review';
  var host = document.getElementById('w4-activity-host');
  var startedAt = Date.now();
  var state = { position: '', reason: '', legalNote: '' };

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
    if (String(state.position || '').trim().length >= 3) marks += 1;
    if (String(state.reason || '').trim().length >= 20) marks += 1;
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    if (!String(state.position || '').trim()) {
      messages.push('Take a position before submitting.');
    }
    if (String(state.reason || '').trim().length < 20) {
      messages.push('Support the position with a reason rather than an assertion.');
    }
    if (String(state.legalNote || '').toLowerCase().indexOf('legal') === -1) {
      messages.push(
        'Acknowledge that a claimed motivation does not change the legal position of the act.'
      );
    }
    return messages;
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Ethical review discussion</h2>' +
      '<p><strong>' +
      data.prompt +
      '</strong></p>' +
      '<ul class="section-list">' +
      data.requirements
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>' +
      '<p class="panel-note">' +
      data.boundaries.join(' ') +
      '</p>' +
      '<p class="panel-note">Sentence starters: ' +
      data.sentenceStarters.join(' ') +
      '</p>';

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

    field('ethical-position', 'Your position', 'position', 2);
    field('ethical-reason', 'Reason supporting your position', 'reason', 4);
    field(
      'ethical-legal',
      'How a claimed motivation relates to the legal position of the act',
      'legalNote',
      3
    );

    var feedback = document.createElement('div');
    feedback.id = 'w4-ethical-feedback';
    feedback.className = 'status-messages';
    feedback.setAttribute('aria-live', 'assertive');
    panel.appendChild(feedback);

    var actions = document.createElement('div');
    actions.className = 'w4-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Mark discussion notes complete';
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
        'Discussion notes complete. Local completion score: ' +
        marks +
        ' / ' +
        data.total +
        '. Positions are not auto-marked as right or wrong.';
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
          return state.position + ' | ' + state.reason;
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
