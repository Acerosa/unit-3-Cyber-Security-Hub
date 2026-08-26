(function () {
  'use strict';

  var data = window.Week4OcrPractice;
  var progress = window.Unit3Week4Progress;
  if (!data) return;

  function optionLabel(option) {
    var utils = window.Unit3ActivityUtils;
    if (utils && typeof utils.optionLabel === 'function') return utils.optionLabel(option);
    if (option && typeof option === 'object') {
      return String(option.text || option.optionId || option.label || option.id || '');
    }
    return option == null ? '' : String(option);
  }

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'ocr-practice';
  var host = document.getElementById('w4-activity-host');
  var answers = {};
  var selfMarks = {};
  var review = false;
  var startedAt = new Date().toISOString();
  var timerId = null;
  var remainingSeconds = data.suggestedMinutes * 60;

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

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    timerId = setInterval(function () {
      if (review) {
        stopTimer();
        return;
      }
      remainingSeconds = Math.max(0, remainingSeconds - 1);
      var el = document.getElementById('w4-timer-display');
      if (el) el.textContent = formatTime(remainingSeconds);
      if (remainingSeconds === 0) stopTimer();
    }, 1000);
  }

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for OCR free-text fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  function render() {
    if (!host) return;
    textFields.destroyAll();
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>OCR-style question practice (' +
      data.total +
      ' marks)</h2>' +
      '<p class="panel-note">' +
      data.timingGuidance +
      ' Suggested time: about ' +
      data.suggestedMinutes +
      ' minutes. Mark schemes stay hidden until you open review.</p>' +
      '<ul class="section-list">' +
      data.beforeReminders
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>';

    var timer = document.createElement('div');
    timer.className = 'w4-timer-bar';
    timer.setAttribute('role', 'status');
    timer.setAttribute('aria-live', 'polite');
    timer.innerHTML =
      '<span class="w4-timer-item"><strong>Timer:</strong> <span id="w4-timer-display">' +
      formatTime(remainingSeconds) +
      '</span></span>' +
      '<span class="w4-timer-item">Pause or ignore the timer if your tutor prefers untimed practice.</span>';
    panel.appendChild(timer);

    data.questions.forEach(function (q, index) {
      var block = document.createElement('section');
      block.className = 'w4-review-item';
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
        fieldset.className = 'w4-options';
        var legend = document.createElement('legend');
        legend.className = 'visually-hidden';
        legend.textContent = 'Choose an answer';
        fieldset.appendChild(legend);
        (q.options || []).forEach(function (opt) {
          var id = q.id + '-' + opt.id;
          var label = document.createElement('label');
          label.className = 'w4-option';
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
          label.appendChild(document.createTextNode(' ' + optionLabel(opt)));
          fieldset.appendChild(label);
        });
        block.appendChild(fieldset);
      } else {
        textFields.mount(block, {
          wrapClass: 'w4-reflection-field',
          id: 'ocr-' + q.id,
          prompt: 'Your response',
          minChars: 80,
          value: answers[q.id] || '',
          rows: 6,
          disabled: review,
          onChange: function (next) {
            answers[q.id] = next;
            save();
          }
        });
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
        scheme.className = 'w4-callout';
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
      actions.className = 'w4-actions';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary';
      btn.textContent = 'Finish and open mark-scheme review';
      btn.addEventListener('click', function () {
        review = true;
        stopTimer();
        var marks = totalSelfScore();
        if (progress) progress.markCompleted(ACTIVITY_ID, marks, data.total);
        render();
        window.Unit3Week4Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w4-submit-host',
          getScore: totalSelfScore,
          getTotal: function () {
            return data.total;
          },
          getCompletionTimeSeconds: function () {
            return Math.max(1, Math.round((Date.now() - Date.parse(startedAt)) / 1000));
          },
          getResponses: function () {
            var evidence = window.Unit3SupabaseEvidence;
            return data.questions.map(function (q) {
              var match = String(q.id || '').match(/ocr-(\d+)/i);
              var qid = match ? 'OCR' + match[1] : String(q.id || '').toUpperCase();
              var answer = answers[q.id];
              var marks = Number(selfMarks[q.id]);
              var score = Number.isFinite(marks)
                ? Math.max(0, Math.min(q.marks, marks))
                : 0;
              if (q.responseType === 'mcq') {
                var payload = { selectedOptionId: answer || null };
                if (evidence && evidence.structured) {
                  return evidence.structured(qid, payload, {
                    responseType: 'single-choice',
                    correct: answer === q.correctOptionId,
                    score: score
                  });
                }
                return {
                  questionId: qid,
                  response: payload,
                  responseType: 'single-choice',
                  correct: answer === q.correctOptionId,
                  score: score
                };
              }
              if (evidence && evidence.freeText) {
                return evidence.freeText(qid, answer || '', {
                  correct: score > 0,
                  score: score
                });
              }
              return {
                questionId: qid,
                response: answer || '',
                responseType: 'text',
                correct: score > 0,
                score: score
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
      startTimer();
    } else {
      var summary = document.createElement('p');
      summary.className = 'w4-formula';
      summary.setAttribute('aria-live', 'polite');
      summary.textContent =
        'Self-assessed total: ' + totalSelfScore() + ' / ' + data.total;
      panel.insertBefore(summary, panel.children[1]);
    }

    host.appendChild(panel);
  }

  render();
})();
