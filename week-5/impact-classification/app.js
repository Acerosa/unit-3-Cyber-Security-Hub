(function () {
  'use strict';

  var data = window.Week5ImpactClassification;
  var progress = window.Unit3Week5Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'impact-classification';
  var host = document.getElementById('w5-activity-host');
  var startedAt = Date.now();
  var responses = {};
  var reviewed = false;

  data.items.forEach(function (item) {
    responses[item.id] = { category: '', reason: '' };
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      responses = Object.assign(responses, draft.responses || {});
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        responses: responses,
        savedAt: new Date().toISOString()
      });
    }
  }

  function itemScore(item) {
    var row = responses[item.id] || {};
    if (!row.category) return 0;
    if (item.accepted.indexOf(row.category) === -1) return 0;
    if (item.reasonRequired && String(row.reason || '').trim().length < 12) return 0;
    return 1;
  }

  function computeScore() {
    return data.items.reduce(function (sum, item) {
      return sum + itemScore(item);
    }, 0);
  }

  function validate() {
    var messages = [];
    data.items.forEach(function (item, index) {
      var row = responses[item.id] || {};
      if (!row.category) {
        messages.push('Choose a category for statement ' + (index + 1) + '.');
      } else if (item.reasonRequired && String(row.reason || '').trim().length < 12) {
        messages.push(
          'Write a short reason for ambiguous statement ' +
            (index + 1) +
            ', naming the stakeholder perspective.'
        );
      }
    });
    return messages;
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Classify impacts</h2>' +
      '<ul class="section-list">' +
      data.instructions
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>' +
      '<p class="panel-note"><strong>Checklist:</strong> ' +
      data.checklist.join(' · ') +
      '</p>';

    data.items.forEach(function (item, index) {
      var block = document.createElement('section');
      block.className = 'w5-review-item';
      block.innerHTML =
        '<h3>' +
        (index + 1) +
        (item.teachingFocus ? ' (weekly-plan ambiguous example)' : '') +
        '</h3>' +
        '<p class="w5-scenario">' +
        item.statement +
        '</p>';

      var fieldset = document.createElement('fieldset');
      fieldset.className = 'w5-options';
      var legend = document.createElement('legend');
      legend.className = 'visually-hidden';
      legend.textContent = 'Impact category for statement ' + (index + 1);
      fieldset.appendChild(legend);
      data.categories.forEach(function (category, catIndex) {
        var id = item.id + '-' + catIndex;
        var label = document.createElement('label');
        label.className = 'w5-option';
        label.setAttribute('for', id);
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = item.id;
        input.id = id;
        input.value = category;
        input.disabled = reviewed;
        if (responses[item.id].category === category) input.checked = true;
        input.addEventListener('change', function () {
          responses[item.id].category = category;
          save();
          render();
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + category));
        fieldset.appendChild(label);
      });
      block.appendChild(fieldset);

      if (item.reasonRequired || item.ambiguous) {
        var wrap = document.createElement('div');
        wrap.className = 'w5-reflection-field';
        var label = document.createElement('label');
        label.setAttribute('for', item.id + '-reason');
        label.textContent =
          'Short reason (required for ambiguous examples) — name the stakeholder perspective';
        wrap.appendChild(label);
        var area = document.createElement('textarea');
        area.id = item.id + '-reason';
        area.rows = 3;
        area.disabled = reviewed;
        area.value = responses[item.id].reason || '';
        area.addEventListener('input', function () {
          responses[item.id].reason = area.value;
          save();
        });
        wrap.appendChild(area);
        block.appendChild(wrap);
      }

      if (reviewed) {
        var fb = document.createElement('p');
        fb.className =
          'message message-' + (itemScore(item) ? 'success' : 'error');
        fb.textContent =
          (itemScore(item) ? 'Accepted classification. ' : 'Review needed. ') +
          item.feedback;
        block.appendChild(fb);
      }

      panel.appendChild(block);
    });

    var actions = document.createElement('div');
    actions.className = 'w5-actions';
    if (!reviewed) {
      var reviewBtn = document.createElement('button');
      reviewBtn.type = 'button';
      reviewBtn.className = 'btn btn-primary';
      reviewBtn.textContent = 'Check classifications';
      reviewBtn.addEventListener('click', function () {
        var messages = validate();
        if (messages.length) {
          var warn = document.createElement('div');
          warn.className = 'status-messages';
          warn.innerHTML = messages
            .map(function (msg) {
              return '<p class="message message-warning">' + msg + '</p>';
            })
            .join('');
          panel.appendChild(warn);
          warn.querySelector('p').focus();
          return;
        }
        reviewed = true;
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
            return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
          },
          canSubmit: function () {
            return true;
          }
        });
      });
      actions.appendChild(reviewBtn);
    } else {
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'btn btn-secondary';
      retry.textContent = 'Revise answers';
      retry.addEventListener('click', function () {
        reviewed = false;
        var submit = document.getElementById('w5-submit-host');
        if (submit) {
          submit.hidden = true;
          submit.textContent = '';
        }
        render();
      });
      actions.appendChild(retry);
      var scoreP = document.createElement('p');
      scoreP.setAttribute('aria-live', 'polite');
      scoreP.textContent = 'Score: ' + computeScore() + ' / ' + data.total;
      panel.appendChild(scoreP);
    }
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
