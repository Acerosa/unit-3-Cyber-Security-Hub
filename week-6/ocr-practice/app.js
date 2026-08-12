(function () {
  'use strict';

  var data = window.Week6OcrPractice;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'ocr-practice';
  var host = document.getElementById('w6-activity-host');
  var answers = {};
  var selfMarks = {};
  var review = false;
  var startedAt = Date.now();
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
      var el = document.getElementById('w6-timer-display');
      if (el) el.textContent = formatTime(remainingSeconds);
      if (remainingSeconds === 0) stopTimer();
    }, 1000);
  }

  function schemeText(q) {
    return Array.isArray(q.markScheme) ? q.markScheme.join('; ') : String(q.markScheme || '');
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>OCR-style practice questions (' +
      data.total +
      ' marks)</h2>' +
      '<p class="panel-note">' +
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
      '<p class="w6-scenario">' +
      data.northbankScenario +
      '</p>';

    var timer = document.createElement('div');
    timer.className = 'w6-timer-bar';
    timer.setAttribute('role', 'status');
    timer.setAttribute('aria-live', 'polite');
    timer.innerHTML =
      '<span class="w6-timer-item"><strong>Timer:</strong> <span id="w6-timer-display">' +
      formatTime(remainingSeconds) +
      '</span></span>' +
      '<span class="w6-timer-item">Pause or ignore the timer if your tutor prefers untimed practice.</span>';
    panel.appendChild(timer);

    data.questions.forEach(function (q, index) {
      var block = document.createElement('section');
      block.className = 'w6-review-item';
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
        fieldset.className = 'w6-options';
        var legend = document.createElement('legend');
        legend.className = 'visually-hidden';
        legend.textContent = 'Choose an answer';
        fieldset.appendChild(legend);
        (q.options || []).forEach(function (opt) {
          var id = q.id + '-' + opt.id;
          var label = document.createElement('label');
          label.className = 'w6-option';
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
        area.rows = q.commandWord === 'Discuss' ? 10 : 6;
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
        scheme.className = 'w6-callout';
        scheme.innerHTML =
          '<p><strong>Mark scheme / guidance:</strong> ' +
          schemeText(q) +
          '</p>' +
          '<p class="panel-note">This is formative OCR-style guidance, not an official OCR mark scheme.</p>';
        block.appendChild(scheme);
      }
      panel.appendChild(block);
    });

    if (!review) {
      var actions = document.createElement('div');
      actions.className = 'w6-actions';
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
        window.Unit3Week6Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w6-submit-host',
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
              var score = Number(selfMarks[question.id]);
              score = Number.isFinite(score)
                ? Math.max(0, Math.min(question.marks, score))
                : 0;
              var questionId = 'OCR6_' + (index + 1);
              var payload =
                question.responseType === 'mcq'
                  ? {
                      selectedOptionId: answers[question.id] || null,
                      selectedOption: ((question.options || []).find(function (option) {
                        return option.id === answers[question.id];
                      }) || {}).text || null
                    }
                  : {
                      text: answers[question.id] || '',
                      selfAssessedMarks: score
                    };
              return evidence && evidence.structured
                ? evidence.structured(questionId, payload, {
                    responseType:
                      question.responseType === 'mcq'
                        ? 'single-choice'
                        : 'extended-response',
                    maxScore: question.marks,
                    score: score
                  })
                : {
                    questionId: questionId,
                    response: payload,
                    correct: score === question.marks,
                    score: score === question.marks ? question.marks : 0,
                    responseType:
                      question.responseType === 'mcq'
                        ? 'single-choice'
                        : 'extended-response'
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
      summary.className = 'w6-formula';
      summary.setAttribute('aria-live', 'polite');
      summary.textContent =
        'Self-assessed total: ' + totalSelfScore() + ' / ' + data.total;
      panel.insertBefore(summary, panel.children[1]);
    }

    host.appendChild(panel);
  }

  render();
})();
