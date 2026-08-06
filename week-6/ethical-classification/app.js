(function () {
  'use strict';

  var data = window.Week6EthicalClassification;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'ethical-classification';
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var responses = {};
  var reviewed = false;

  data.items.forEach(function (item) {
    responses[item.id] = '';
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
    var choice = responses[item.id];
    if (!choice) return 0;
    return item.accepted.indexOf(choice) !== -1 ? 1 : 0;
  }

  function computeScore() {
    return data.items.reduce(function (sum, item) {
      return sum + itemScore(item);
    }, 0);
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Classify ethical and legal dimensions</h2>' +
      '<ul class="section-list">' +
      data.instructions
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>';

    data.items.forEach(function (item, index) {
      var block = document.createElement('section');
      block.className = 'w6-review-item';
      block.innerHTML =
        '<h3>Scenario ' + (index + 1) + '</h3>' +
        '<p class="w6-scenario">' +
        item.statement +
        '</p>';

      var fieldset = document.createElement('fieldset');
      fieldset.className = 'w6-options';
      var legend = document.createElement('legend');
      legend.className = 'visually-hidden';
      legend.textContent = 'Classification for scenario ' + (index + 1);
      fieldset.appendChild(legend);

      data.categories.forEach(function (category, catIndex) {
        var id = item.id + '-' + catIndex;
        var label = document.createElement('label');
        label.className = 'w6-option';
        label.setAttribute('for', id);
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = item.id;
        input.id = id;
        input.value = category;
        input.disabled = reviewed;
        if (responses[item.id] === category) input.checked = true;
        input.addEventListener('change', function () {
          responses[item.id] = category;
          save();
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + category));
        fieldset.appendChild(label);
      });
      block.appendChild(fieldset);

      if (reviewed) {
        var fb = document.createElement('p');
        fb.className = 'message message-' + (itemScore(item) ? 'success' : 'error');
        fb.textContent =
          (itemScore(item) ? 'Accepted classification. ' : 'Review needed. ') + item.feedback;
        block.appendChild(fb);
      }

      panel.appendChild(block);
    });

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    if (!reviewed) {
      var reviewBtn = document.createElement('button');
      reviewBtn.type = 'button';
      reviewBtn.className = 'btn btn-primary';
      reviewBtn.textContent = 'Check classifications';
      reviewBtn.addEventListener('click', function () {
        var missing = data.items.filter(function (item) {
          return !responses[item.id];
        });
        if (missing.length) {
          var warn = document.createElement('div');
          warn.className = 'status-messages';
          warn.innerHTML =
            '<p class="message message-warning">Choose a category for every scenario before checking.</p>';
          panel.appendChild(warn);
          return;
        }
        reviewed = true;
        var score = computeScore();
        if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
        render();
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
        var submit = document.getElementById('w6-submit-host');
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
