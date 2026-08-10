(function () {
  'use strict';

  var data = window.Week2OcrPractice;
  var progress = window.Unit3Week2Progress;

  if (!data) {
    return;
  }

  /*
   * Scoring: objective MCQ items (Q1–7) are auto-marked (2 marks each = 14 max).
   * The six-mark extended response (Q8) awards up to 6 completion marks when
   * the learner writes a substantial draft (>= extendedMinChars). We do not
   * keyword-mark prose — Activity 10 peer marking handles qualitative review.
   */
  var EXTENDED_MIN_CHARS = data.extendedMinChars || 80;

  var index = 0;
  var answers = {};
  var marked = {};
  var finished = false;
  var startedAt = new Date().toISOString();
  var elapsedSeconds = 0;
  var timerId = null;
  var extendedText = '';

  if (progress) {
    progress.markStarted(data.activityId);
    var savedDraft = progress.getDraft(data.extendedDraftKey);
    if (typeof savedDraft === 'string') {
      extendedText = savedDraft;
    }
  }

  data.questions.forEach(function (q) {
    if (q.type === 'mcq') {
      answers[q.id] = null;
      marked[q.id] = false;
    }
  });

  function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function currentQuestion() {
    return data.questions[index];
  }

  function objectiveScore() {
    var total = 0;
    data.questions.forEach(function (q) {
      if (q.type !== 'mcq') return;
      if (answers[q.id] === q.correctIndex) {
        total += q.marks;
      }
    });
    return total;
  }

  function extendedScore() {
    var text = extendedText.trim();
    if (text.length >= EXTENDED_MIN_CHARS) {
      var extQ = data.questions.filter(function (q) {
        return q.type === 'extended';
      })[0];
      return extQ ? extQ.marks : 0;
    }
    return 0;
  }

  function totalScore() {
    return objectiveScore() + extendedScore();
  }

  function totalMarksAvailable() {
    return data.total;
  }

  function incorrectIndexes() {
    var indexes = [];
    data.questions.forEach(function (q, i) {
      if (q.type === 'mcq' && answers[q.id] !== q.correctIndex) {
        indexes.push(i + 1);
      }
      if (q.type === 'extended' && extendedText.trim().length < EXTENDED_MIN_CHARS) {
        indexes.push(i + 1);
      }
    });
    return indexes;
  }

  function saveExtendedDraft(text) {
    extendedText = text;
    if (progress) {
      progress.setDraft(data.extendedDraftKey, text);
    }
  }

  function tickTimer() {
    elapsedSeconds = Math.floor((Date.now() - Date.parse(startedAt)) / 1000);
    var display = document.getElementById('w2-elapsed-display');
    var sr = document.getElementById('w2-elapsed-sr');
    if (display) {
      display.textContent = formatTime(elapsedSeconds);
    }
    if (sr) {
      sr.textContent = 'Elapsed time: ' + formatTime(elapsedSeconds);
    }
  }

  function startTimer() {
    if (timerId) return;
    startedAt = Date.now();
    timerId = setInterval(tickTimer, 1000);
    tickTimer();
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    elapsedSeconds = Math.max(1, Math.floor((Date.now() - Date.parse(startedAt)) / 1000));
  }

  function finishActivity() {
    finished = true;
    stopTimer();
    saveExtendedDraft(extendedText);
    if (progress) {
      progress.markCompleted(data.activityId, totalScore(), data.total);
    }
    render();
    window.Unit3Week2Submit.renderSubmitPanel({
      activityId: data.activityId,
      getScore: function () {
        return totalScore();
      },
      getTotal: function () {
        return data.total;
      },
      getQuestionsForReview: function () {
        return incorrectIndexes();
      },
      getCompletionTimeSeconds: function () {
        return elapsedSeconds;
      },
      getResponses: function () {
        var evidence = window.Unit3SupabaseEvidence;
        var out = [];
        data.questions.forEach(function (q) {
          if (q.type !== 'mcq') return;
          // Catalogue W2OCR-Q07 is the extended item; skip the 7th MCQ (ocr-q7).
          var match = String(q.id || '').match(/^ocr-q(\d+)$/i);
          var n = match ? Number(match[1]) : 0;
          if (!n || n > 6) return;
          var qid = 'W2OCR-Q0' + n;
          var chosen = answers[q.id];
          var correct = chosen === q.correctIndex;
          var payload = {
            chosenIndex: chosen,
            selectedOption:
              typeof chosen === 'number' && q.options ? q.options[chosen] : null
          };
          if (evidence && evidence.structured) {
            out.push(
              evidence.structured(qid, payload, {
                responseType: 'single-choice',
                correct: correct,
                score: correct ? q.marks || 1 : 0
              })
            );
          } else {
            out.push({
              questionId: qid,
              response: payload,
              correct: correct,
              score: correct ? q.marks || 1 : 0,
              responseType: 'single-choice'
            });
          }
        });
        var extScore = extendedScore();
        if (evidence && evidence.freeText) {
          out.push(
            evidence.freeText('W2OCR-Q07', extendedText, {
              responseType: 'text',
              correct: extScore > 0,
              score: extScore,
              fields: {}
            })
          );
        } else {
          out.push({
            questionId: 'W2OCR-Q07',
            response: extendedText,
            responseType: 'text',
            correct: extScore > 0,
            score: extScore
          });
        }
        return out;
      },
      getStartedAt: function () {
        return new Date(startedAt).toISOString();
      },
      getCompletedAt: function () {
        return new Date().toISOString();
      },
      canSubmit: function () {
        return finished;
      }
    });
  }

  function renderTimerBar(q) {
    var bar = document.createElement('div');
    bar.className = 'w2-timer-bar';
    bar.setAttribute('role', 'status');

    var elapsedLabel = document.createElement('span');
    elapsedLabel.className = 'w2-timer-item';
    elapsedLabel.innerHTML =
      '<strong>Elapsed:</strong> <span id="w2-elapsed-display">0:00</span>';
    bar.appendChild(elapsedLabel);

    var sr = document.createElement('span');
    sr.id = 'w2-elapsed-sr';
    sr.className = 'visually-hidden';
    sr.setAttribute('aria-live', 'polite');
    bar.appendChild(sr);

    var marksLabel = document.createElement('span');
    marksLabel.className = 'w2-timer-item';
    marksLabel.innerHTML =
      '<strong>Overall marks:</strong> ' + totalMarksAvailable();
    bar.appendChild(marksLabel);

    if (q) {
      var qMeta = document.createElement('span');
      qMeta.className = 'w2-timer-item';
      qMeta.textContent =
        'Question ' +
        q.number +
        ' · ' +
        q.commandWord +
        ' · ' +
        q.marks +
        ' mark' +
        (q.marks === 1 ? '' : 's') +
        ' · ~' +
        q.suggestedMinutes +
        ' min';
      bar.appendChild(qMeta);
    }

    var scoreSoFar = document.createElement('span');
    scoreSoFar.className = 'w2-timer-item';
    scoreSoFar.id = 'w2-score-so-far';
    scoreSoFar.innerHTML =
      '<strong>Score so far:</strong> ' +
      (finished ? totalScore() : objectiveScore() + (extendedText.trim().length >= EXTENDED_MIN_CHARS ? extendedScore() : 0)) +
      ' / ' +
      data.total;
    bar.appendChild(scoreSoFar);

    return bar;
  }

  function renderMcq(q, panel) {
    if (q.scenario) {
      var scenario = document.createElement('p');
      scenario.className = 'w2-scenario';
      scenario.textContent = q.scenario;
      panel.appendChild(scenario);
    }

    var prompt = document.createElement('h2');
    prompt.id = 'ocr-q-heading';
    prompt.textContent = q.prompt;
    panel.appendChild(prompt);

    var fieldset = document.createElement('fieldset');
    fieldset.className = 'w2-options';
    fieldset.disabled = finished || marked[q.id];
    var legend = document.createElement('legend');
    legend.className = 'visually-hidden';
    legend.textContent = 'Choose an answer';
    fieldset.appendChild(legend);

    q.options.forEach(function (option, optionIndex) {
      var id = 'ocr-opt-' + q.id + '-' + optionIndex;
      var label = document.createElement('label');
      label.className = 'w2-option';
      label.setAttribute('for', id);
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'ocr-answer-' + q.id;
      input.id = id;
      input.value = String(optionIndex);
      if (answers[q.id] === optionIndex) {
        input.checked = true;
      }
      if (finished || marked[q.id]) {
        input.disabled = true;
      }
      input.addEventListener('change', function () {
        answers[q.id] = optionIndex;
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + option));
      fieldset.appendChild(label);
    });
    panel.appendChild(fieldset);

    var feedbackHost = document.createElement('div');
    feedbackHost.id = 'ocr-feedback';
    feedbackHost.className = 'status-messages';
    feedbackHost.setAttribute('aria-live', 'polite');
    panel.appendChild(feedbackHost);

    if (marked[q.id] || finished) {
      var correct = answers[q.id] === q.correctIndex;
      var msg = document.createElement('p');
      var wrongText = q.explanation || '';
      if (
        !correct &&
        q.reversedIndex != null &&
        answers[q.id] === q.reversedIndex &&
        q.reversedExplanation
      ) {
        wrongText = q.reversedExplanation;
      }
      msg.className = 'message message-' + (correct ? 'success' : 'error');
      msg.textContent = correct
        ? 'Correct — ' + q.marks + ' mark' + (q.marks === 1 ? '' : 's') + '.'
        : 'Not correct — 0 marks. ' + wrongText;
      feedbackHost.appendChild(msg);
    }
  }

  function renderExtended(q, panel) {
    var prompt = document.createElement('h2');
    prompt.id = 'ocr-q-heading';
    prompt.textContent = q.prompt;
    panel.appendChild(prompt);

    var note = document.createElement('p');
    note.className = 'panel-note';
    note.textContent =
      'Write a full response. It will be saved for peer marking. You receive up to ' +
      q.marks +
      ' marks for a substantial attempt (at least ' +
      EXTENDED_MIN_CHARS +
      ' characters). Prose is not keyword-marked here.';
    panel.appendChild(note);

    var group = document.createElement('div');
    group.className = 'form-group';
    var lbl = document.createElement('label');
    lbl.setAttribute('for', 'ocr-extended-response');
    lbl.textContent = 'Your response';
    group.appendChild(lbl);
    var textarea = document.createElement('textarea');
    textarea.id = 'ocr-extended-response';
    textarea.className = 'form-control';
    textarea.rows = 10;
    textarea.value = extendedText;
    textarea.disabled = finished;
    textarea.addEventListener('input', function (event) {
      saveExtendedDraft(event.target.value);
      var counter = document.getElementById('ocr-char-count');
      if (counter) {
        counter.textContent =
          event.target.value.trim().length + ' characters (minimum ' + EXTENDED_MIN_CHARS + ')';
      }
    });
    group.appendChild(textarea);
    var counter = document.createElement('p');
    counter.id = 'ocr-char-count';
    counter.className = 'panel-note';
    counter.textContent =
      extendedText.trim().length + ' characters (minimum ' + EXTENDED_MIN_CHARS + ')';
    group.appendChild(counter);
    panel.appendChild(group);

    if (finished) {
      var extScore = extendedScore();
      var fb = document.createElement('p');
      fb.className = 'message message-' + (extScore > 0 ? 'success' : 'warning');
      fb.textContent =
        extScore > 0
          ? 'Substantial response recorded — ' + extScore + ' completion marks.'
          : 'Response too short for completion marks. Write at least ' + EXTENDED_MIN_CHARS + ' characters.';
      panel.appendChild(fb);
    }
  }

  function render() {
    var host = document.getElementById('w2-ocr-host');
    if (!host) return;
    host.textContent = '';

    if (finished) {
      var summary = document.createElement('section');
      summary.className = 'panel activity-panel';
      summary.setAttribute('aria-labelledby', 'ocr-summary-heading');
      summary.appendChild(renderTimerBar(null));

      var sumHeading = document.createElement('h2');
      sumHeading.id = 'ocr-summary-heading';
      sumHeading.textContent = 'Practice complete';
      summary.appendChild(sumHeading);

      var scoreP = document.createElement('p');
      scoreP.setAttribute('aria-live', 'polite');
      scoreP.textContent =
        'Final score: ' +
        totalScore() +
        ' out of ' +
        data.total +
        ' (objective: ' +
        objectiveScore() +
        ', extended completion: ' +
        extendedScore() +
        ').';
      summary.appendChild(scoreP);

      var draftNote = document.createElement('p');
      draftNote.className = 'panel-note';
      draftNote.textContent =
        'Your six-mark response has been saved. Continue to Peer Marking and Answer Improvement to review it.';
      summary.appendChild(draftNote);

      var peerLink = document.createElement('p');
      var link = document.createElement('a');
      link.href = '../peer-marking/';
      link.className = 'btn btn-secondary';
      link.textContent = 'Go to peer marking';
      peerLink.appendChild(link);
      summary.appendChild(peerLink);

      host.appendChild(summary);
      return;
    }

    startTimer();

    var q = currentQuestion();
    var panel = document.createElement('section');
    panel.className = 'panel activity-panel';
    panel.setAttribute('aria-labelledby', 'ocr-q-heading');
    panel.appendChild(renderTimerBar(q));

    if (q.type === 'mcq') {
      renderMcq(q, panel);
    } else {
      renderExtended(q, panel);
    }

    var actions = document.createElement('div');
    actions.className = 'w2-actions';

    if (q.type === 'mcq' && !marked[q.id]) {
      var checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.className = 'btn btn-primary';
      checkBtn.textContent = 'Check answer';
      checkBtn.addEventListener('click', function () {
        if (answers[q.id] == null) {
          var warn = document.createElement('p');
          warn.className = 'message message-warning';
          warn.textContent = 'Select an answer before checking.';
          var fb = panel.querySelector('#ocr-feedback');
          if (fb) {
            fb.textContent = '';
            fb.appendChild(warn);
          }
          return;
        }
        marked[q.id] = true;
        render();
      });
      actions.appendChild(checkBtn);
    }

    if (index > 0) {
      var prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'btn btn-secondary';
      prevBtn.textContent = 'Previous question';
      prevBtn.addEventListener('click', function () {
        index -= 1;
        render();
      });
      actions.appendChild(prevBtn);
    }

    var isLast = index >= data.questions.length - 1;
    var canAdvance =
      q.type === 'extended' ||
      marked[q.id] ||
      (q.type === 'mcq' && answers[q.id] != null);

    if (!isLast && canAdvance) {
      var nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'btn btn-primary';
      nextBtn.textContent = 'Next question';
      nextBtn.addEventListener('click', function () {
        index += 1;
        render();
      });
      actions.appendChild(nextBtn);
    }

    if (isLast) {
      var finishBtn = document.createElement('button');
      finishBtn.type = 'button';
      finishBtn.className = 'btn btn-primary';
      finishBtn.textContent = 'Finish practice';
      finishBtn.addEventListener('click', function () {
        if (q.type === 'extended') {
          saveExtendedDraft(
            (document.getElementById('ocr-extended-response') || {}).value || extendedText
          );
        }
        finishActivity();
      });
      actions.appendChild(finishBtn);
    }

    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
