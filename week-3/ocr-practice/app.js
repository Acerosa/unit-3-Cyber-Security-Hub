(function () {
  'use strict';

  var data = window.Week3OcrPractice;
  var progress = window.Unit3Week3Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'ocr-practice';
  var host = document.getElementById('w3-ocr-host');
  var answers = {};
  var selfMarks = {};
  var review = false;
  var startedAt = Date.now();

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      answers = draft.answers || {};
      selfMarks = draft.selfMarks || {};
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        answers: answers,
        selfMarks: selfMarks,
        savedAt: new Date().toISOString()
      });
    }
  }

  function totalSelfScore() {
    var sum = 0;
    data.questions.forEach(function (q) {
      var value = Number(selfMarks[q.id]);
      if (Number.isFinite(value)) sum += Math.max(0, Math.min(q.marks, value));
    });
    return sum;
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>OCR-style question practice (' +
      data.total +
      ' marks)</h2>' +
      '<p class="panel-note">Suggested time: about ' +
      data.suggestedMinutes +
      ' minutes. Mark schemes stay hidden until you open review.</p>';

    data.questions.forEach(function (q, index) {
      var block = document.createElement('section');
      block.className = 'w3-review-item';
      block.innerHTML =
        '<h3>' +
        (index + 1) +
        '. ' +
        q.commandWord +
        ' (' +
        q.marks +
        ' marks · ~' +
        q.suggestedMinutes +
        ' min)</h3>' +
        '<p>' +
        q.prompt +
        '</p>' +
        '<p class="panel-note">' +
        q.guidance +
        '</p>';

      if (q.responseType === 'mcq') {
        var fieldset = document.createElement('fieldset');
        fieldset.className = 'w3-options';
        var legend = document.createElement('legend');
        legend.className = 'visually-hidden';
        legend.textContent = 'Choose an answer';
        fieldset.appendChild(legend);
        (q.options || []).forEach(function (opt, optIndex) {
          var id = q.id + '-' + optIndex;
          var label = document.createElement('label');
          label.className = 'w3-option';
          label.setAttribute('for', id);
          var input = document.createElement('input');
          input.type = 'radio';
          input.name = q.id;
          input.id = id;
          input.value = opt.id;
          input.disabled = review;
          if (answers[q.id] === opt.id) input.checked = true;
          input.addEventListener('change', function () {
            answers[q.id] = opt.id;
            if (opt.id === q.correctOptionId) selfMarks[q.id] = q.marks;
            else selfMarks[q.id] = 0;
            save();
          });
          label.appendChild(input);
          label.appendChild(document.createTextNode(' ' + opt.text));
          fieldset.appendChild(label);
        });
        block.appendChild(fieldset);
      } else {
        var areaId = 'ocr-' + q.id;
        var label = document.createElement('label');
        label.setAttribute('for', areaId);
        label.textContent = 'Your response';
        block.appendChild(label);
        var area = document.createElement('textarea');
        area.id = areaId;
        area.rows = 6;
        area.disabled = review;
        area.value = answers[q.id] || '';
        area.addEventListener('input', function () {
          answers[q.id] = area.value;
          save();
        });
        block.appendChild(area);
        var markLabel = document.createElement('label');
        markLabel.setAttribute('for', 'self-' + q.id);
        markLabel.textContent = 'Self-assessed marks (0–' + q.marks + ')';
        block.appendChild(markLabel);
        var markInput = document.createElement('input');
        markInput.type = 'number';
        markInput.id = 'self-' + q.id;
        markInput.min = '0';
        markInput.max = String(q.marks);
        markInput.value = selfMarks[q.id] != null ? selfMarks[q.id] : '';
        markInput.disabled = review;
        markInput.addEventListener('input', function () {
          selfMarks[q.id] = Number(markInput.value);
          save();
        });
        block.appendChild(markInput);
      }

      if (review) {
        var scheme = document.createElement('div');
        scheme.className = 'w3-callout';
        scheme.innerHTML =
          '<p><strong>Mark scheme:</strong> ' +
          q.markScheme +
          '</p>' +
          '<p><strong>Indicative content:</strong> ' +
          q.indicativeContent +
          '</p>' +
          '<p><strong>Model answer:</strong> ' +
          q.modelAnswer +
          '</p>' +
          '<p><strong>Common mistakes:</strong> ' +
          (q.commonMistakes || []).join('; ') +
          '</p>';
        block.appendChild(scheme);
      }
      panel.appendChild(block);
    });

    if (!review) {
      var actions = document.createElement('div');
      actions.className = 'w3-actions';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary';
      btn.textContent = 'Finish and open mark-scheme review';
      btn.addEventListener('click', function () {
        review = true;
        var marks = totalSelfScore();
        if (progress) progress.markCompleted(ACTIVITY_ID, marks, data.total);
        render();
        window.Unit3Week3Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w3-submit-host',
          getScore: totalSelfScore,
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
      actions.appendChild(btn);
      panel.appendChild(actions);
    } else {
      var summary = document.createElement('p');
      summary.className = 'w3-formula';
      summary.textContent =
        'Self-assessed total: ' + totalSelfScore() + ' / ' + data.total;
      panel.insertBefore(summary, panel.children[1]);
    }

    host.appendChild(panel);
  }

  render();
})();
