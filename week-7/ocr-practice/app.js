(function () {
  'use strict';

  var data = window.Week7OcrPractice;
  var progress = window.Unit3Week7Progress;
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
  var host = document.getElementById('w7-activity-host');
  var answers = {};
  var selfMarks = {};
  var review = false;
  var untimed = false;
  var startedAt = Date.now();
  var timerId = null;
  var remainingSeconds = data.suggestedMinutes * 60;

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      answers = draft.answers || {};
      selfMarks = draft.selfMarks || {};
      untimed = !!draft.untimed;
      if (typeof draft.remainingSeconds === 'number') {
        remainingSeconds = draft.remainingSeconds;
      }
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        answers: answers,
        selfMarks: selfMarks,
        untimed: untimed,
        remainingSeconds: remainingSeconds,
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
    if (untimed || review) return;
    timerId = setInterval(function () {
      if (review || untimed) {
        stopTimer();
        return;
      }
      remainingSeconds = Math.max(0, remainingSeconds - 1);
      save();
      var el = document.getElementById('w7-timer-display');
      if (el) el.textContent = formatTime(remainingSeconds);
      if (remainingSeconds === 0) stopTimer();
    }, 1000);
  }

  function schemeText(q) {
    return Array.isArray(q.markScheme) ? q.markScheme.join('; ') : String(q.markScheme || '');
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
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>OCR-style practice questions (' +
      data.total +
      ' marks)</h2>' +
      '<p class="message message-warning" role="note"><strong>Not official OCR exam questions.</strong> ' +
      data.timingGuidance +
      ' Suggested time: about ' +
      data.suggestedMinutes +
      ' minutes. Mark schemes stay hidden until you submit.</p>' +
      '<ul class="section-list">' +
      data.beforeReminders
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>' +
      '<p class="w7-scenario">' +
      data.northbankScenario +
      '</p>');

    var timer = document.createElement('div');
    timer.className = 'w7-timer-bar';
    timer.setAttribute('role', 'status');
    timer.setAttribute('aria-live', 'polite');setAuthoredHtml(timer, '<span class="w7-timer-item"><strong>Timer:</strong> <span id="w7-timer-display">' +
      (untimed ? 'Untimed mode' : formatTime(remainingSeconds)) +
      '</span></span>');
    panel.appendChild(timer);

    var modeLabel = document.createElement('label');
    modeLabel.className = 'w7-checkbox-label';
    var modeBox = document.createElement('input');
    modeBox.type = 'checkbox';
    modeBox.checked = untimed;
    modeBox.disabled = review;
    modeBox.addEventListener('change', function () {
      untimed = modeBox.checked;
      save();
      if (untimed) stopTimer();
      else startTimer();
      var el = document.getElementById('w7-timer-display');
      if (el) el.textContent = untimed ? 'Untimed mode' : formatTime(remainingSeconds);
    });
    modeLabel.appendChild(modeBox);
    modeLabel.appendChild(
      document.createTextNode(' Untimed accessible mode (ignore or pause the timer)')
    );
    panel.appendChild(modeLabel);

    data.questions.forEach(function (q, index) {
      var block = document.createElement('section');
      block.className = 'w7-review-item';setAuthoredHtml(block, '<h3>' +
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
        '</p>');

      if (q.responseType === 'mcq') {
        var fieldset = document.createElement('fieldset');
        fieldset.className = 'w7-options';
        var legend = document.createElement('legend');
        legend.className = 'visually-hidden';
        legend.textContent = 'Choose an answer';
        fieldset.appendChild(legend);
        (q.options || []).forEach(function (opt) {
          var id = q.id + '-' + opt.id;
          var label = document.createElement('label');
          label.className = 'w7-option';
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
          wrapClass: 'w7-reflection-field',
          id: 'ocr-' + q.id,
          prompt: 'Your response',
          minChars: 80,
          value: answers[q.id] || '',
          rows: q.commandWord === 'Discuss' || q.commandWord === 'Compare' ? 8 : 5,
          disabled: review,
          onChange: function (next) {
            answers[q.id] = next;
            save();
          }
        });
        var markLabel = document.createElement('label');
        markLabel.setAttribute('for', 'self-' + q.id);
        markLabel.textContent = 'Self-assessed marks (0-' + q.marks + ')';
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
        scheme.className = 'w7-callout';setAuthoredHtml(scheme, '<p><strong>Mark scheme / guidance:</strong> ' +
          schemeText(q) +
          '</p>' +
          '<p class="panel-note">This is formative OCR-style guidance, not an official OCR mark scheme.</p>');
        block.appendChild(scheme);
      }
      panel.appendChild(block);
    });

    if (!review) {
      var actions = document.createElement('div');
      actions.className = 'w7-actions';
      var saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = 'btn btn-secondary';
      saveBtn.textContent = 'Save answers';
      saveBtn.addEventListener('click', function () {
        save();
        var note = document.createElement('p');
        note.className = 'message message-success';
        note.setAttribute('aria-live', 'polite');
        note.textContent = 'Answers saved in this browser.';
        actions.appendChild(note);
      });
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary';
      btn.textContent = 'Finish and open mark-scheme review';
      btn.addEventListener('click', function () {
        review = true;
        stopTimer();
        save();
        var marks = totalSelfScore();
        if (progress) progress.markCompleted(ACTIVITY_ID, marks, data.total);
        render();
        window.Unit3Week7Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w7-submit-host',
          getScore: totalSelfScore,
          getTotal: function () {
            return data.total;
          },
          getCompletionTimeSeconds: function () {
            return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
          },
          getResponses: function () {
            var evidence = window.Unit3SupabaseEvidence;
            return data.questions.map(function (question, index) {
              var questionId = 'OCR7_' + (index + 1);
              var answer = answers[question.id];
              var marks = Number(selfMarks[question.id]);
              var score = Number.isFinite(marks)
                ? Math.max(0, Math.min(question.marks, marks))
                : 0;
              if (question.responseType === 'mcq') {
                return evidence.structured(
                  questionId,
                  {
                    selectedOptionId: answer || null,
                    selfAssessedMarks: score
                  },
                  {
                    responseType: 'single-choice',
                    maxScore: question.marks,
                    score:
                      answer === question.correctOptionId ? question.marks : 0
                  }
                );
              }
              return evidence.structured(
                questionId,
                {
                  text: answer || '',
                  answered: Boolean(String(answer || '').trim()),
                  selfAssessedMarks: score
                },
                {
                  responseType: 'extended-response',
                  maxScore: question.marks,
                  score: score
                }
              );
            });
          },
          getStartedAt: function () {
            return new Date(startedAt).toISOString();
          },
          getCompletedAt: function () {
            return new Date().toISOString();
          },
          canSubmit: function () {
            return data.questions.every(function (question) {
              var answer = answers[question.id];
              if (question.responseType === 'mcq') {
                return Boolean(answer);
              }
              return Boolean(String(answer || '').trim());
            });
          },
          onSubmitFailed: function () {
            save();
          }
        });
      });
      actions.appendChild(saveBtn);
      actions.appendChild(btn);
      panel.appendChild(actions);
      startTimer();
    } else {
      var summary = document.createElement('p');
      summary.className = 'w7-formula';
      summary.setAttribute('aria-live', 'polite');
      summary.textContent =
        'Self-assessed total: ' + totalSelfScore() + ' / ' + data.total;
      panel.insertBefore(summary, panel.children[1]);
    }

    host.appendChild(panel);
  }

  render();
})();
