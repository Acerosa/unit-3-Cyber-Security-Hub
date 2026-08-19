/**
 * Reusable one-question-at-a-time quiz engine for Week 5 activities.
 */

(function (global) {
  'use strict';

  function optionLabel(option) {
    var utils = global.Unit3ActivityUtils;
    if (utils && typeof utils.optionLabel === 'function') return utils.optionLabel(option);
    if (option && typeof option === 'object') {
      return String(option.text || option.optionId || option.label || option.id || '');
    }
    return option == null ? '' : String(option);
  }

  function normalizeQuestion(raw) {
    var utils = global.Unit3ActivityUtils;
    var q =
      utils && typeof utils.normalizeMcqQuestion === 'function'
        ? utils.normalizeMcqQuestion(raw)
        : Object.assign({}, raw || {});
    if (!q.explanation && q.feedbackIncorrect) q.explanation = q.feedbackIncorrect;
    return q;
  }

  function createQuiz(config) {
    var questions = (config.questions || []).map(normalizeQuestion);
    var host = document.getElementById(config.hostId || 'w5-quiz-host');
    var progress = global.Unit3Week5Progress;
    var activityId = config.activityId;
    var index = 0;
    var answers = [];
    var startedAt = Date.now();
    var completed = false;
    var score = 0;

    if (progress) {
      progress.markStarted(activityId);
    }

    function current() {
      return questions[index];
    }

    function render() {
      if (!host) return;
      host.textContent = '';

      if (completed) {
        renderSummary();
        return;
      }

      var q = current();
      if (!q) {
        finish();
        return;
      }

      var panel = document.createElement('section');
      panel.className = 'activity-panel';
      panel.setAttribute('aria-labelledby', 'w5-q-heading');

      var progressText = document.createElement('p');
      progressText.className = 'panel-note';
      progressText.setAttribute('aria-live', 'polite');
      progressText.textContent =
        'Question ' + (index + 1) + ' of ' + questions.length;
      panel.appendChild(progressText);

      var heading = document.createElement('h2');
      heading.id = 'w5-q-heading';
      heading.textContent = q.prompt;
      panel.appendChild(heading);

      if (q.scenario) {
        var scenario = document.createElement('p');
        scenario.className = 'w5-scenario';
        scenario.textContent = q.scenario;
        panel.appendChild(scenario);
      }

      var fieldset = document.createElement('fieldset');
      fieldset.className = 'w5-options';
      var legend = document.createElement('legend');
      legend.className = 'visually-hidden';
      legend.textContent = 'Choose an answer';
      fieldset.appendChild(legend);

      (q.options || []).forEach(function (option, optionIndex) {
        var id = 'w5-option-' + index + '-' + optionIndex;
        var label = document.createElement('label');
        label.className = 'w5-option';
        label.setAttribute('for', id);
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'w5-answer';
        input.id = id;
        input.value = String(optionIndex);
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + optionLabel(option)));
        fieldset.appendChild(label);
      });
      panel.appendChild(fieldset);

      var feedback = document.createElement('div');
      feedback.id = 'w5-q-feedback';
      feedback.className = 'status-messages';
      feedback.setAttribute('aria-live', 'polite');
      panel.appendChild(feedback);

      var actions = document.createElement('div');
      actions.className = 'w5-actions';
      var checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.className = 'btn btn-primary';
      checkBtn.textContent = 'Check answer';
      var nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'btn btn-secondary';
      nextBtn.textContent = index === questions.length - 1 ? 'Finish quiz' : 'Next question';
      nextBtn.hidden = true;
      actions.appendChild(checkBtn);
      actions.appendChild(nextBtn);
      panel.appendChild(actions);

      host.appendChild(panel);

      var locked = false;
      checkBtn.addEventListener('click', function () {
        if (locked) return;
        var selected = host.querySelector('input[name="w5-answer"]:checked');
        if (!selected) {
          feedback.textContent = '';
          var warn = document.createElement('p');
          warn.className = 'message message-warning';
          warn.textContent = 'Select an answer before checking.';
          feedback.appendChild(warn);
          return;
        }
        locked = true;
        var chosen = Number(selected.value);
        var correct = chosen === q.correctIndex;
        answers[index] = {
          questionId: q.id,
          chosenIndex: chosen,
          correct: correct
        };
        host.querySelectorAll('input[name="w5-answer"]').forEach(function (input) {
          input.disabled = true;
        });
        feedback.textContent = '';
        var msg = document.createElement('p');
        msg.className = 'message message-' + (correct ? 'success' : 'error');
        var wrongText = q.explanation || '';
        if (
          !correct &&
          q.reversedIndex != null &&
          chosen === q.reversedIndex &&
          q.reversedExplanation
        ) {
          wrongText = q.reversedExplanation;
        }
        msg.textContent = correct
          ? 'Correct. ' + (q.explanation || '')
          : 'Not quite. ' + wrongText;
        feedback.appendChild(msg);
        checkBtn.hidden = true;
        nextBtn.hidden = false;
        nextBtn.focus();
      });

      nextBtn.addEventListener('click', function () {
        index += 1;
        if (index >= questions.length) {
          finish();
        } else {
          render();
        }
      });
    }

    function finish() {
      score = answers.reduce(function (sum, item) {
        return sum + (item && item.correct ? 1 : 0);
      }, 0);
      completed = true;
      if (progress) {
        progress.markCompleted(activityId, score, questions.length);
      }
      render();
      if (typeof config.onComplete === 'function') {
        config.onComplete({
          score: score,
          total: questions.length,
          answers: answers,
          incorrectIndexes: answers
            .map(function (item, i) {
              return item && !item.correct ? i + 1 : null;
            })
            .filter(function (n) {
              return n != null;
            }),
          completionTimeSeconds: Math.max(
            1,
            Math.round((Date.now() - startedAt) / 1000)
          )
        });
      }
    }

    function renderSummary() {
      var panel = document.createElement('section');
      panel.className = 'activity-panel';
      panel.setAttribute('aria-labelledby', 'w5-summary-heading');

      var heading = document.createElement('h2');
      heading.id = 'w5-summary-heading';
      heading.textContent = 'Quiz complete';
      panel.appendChild(heading);

      var scoreP = document.createElement('p');
      scoreP.setAttribute('aria-live', 'polite');
      scoreP.textContent = 'Your score: ' + score + ' out of ' + questions.length + '.';
      panel.appendChild(scoreP);

      var review = document.createElement('div');
      review.className = 'w5-review-list';
      var incorrect = answers.filter(function (item) {
        return item && !item.correct;
      });
      if (incorrect.length === 0) {
        var allCorrect = document.createElement('p');
        allCorrect.className = 'message message-success';
        allCorrect.textContent = 'You answered every question correctly.';
        review.appendChild(allCorrect);
      } else {
        var reviewHeading = document.createElement('h3');
        reviewHeading.textContent = 'Review incorrect answers';
        review.appendChild(reviewHeading);
        answers.forEach(function (item, i) {
          if (!item || item.correct) return;
          var q = questions[i];
          var block = document.createElement('article');
          block.className = 'w5-review-item';
          var title = document.createElement('h4');
          title.textContent = 'Question ' + (i + 1);
          block.appendChild(title);
          var prompt = document.createElement('p');
          prompt.textContent = q.prompt;
          block.appendChild(prompt);
          var yours = document.createElement('p');
          yours.textContent =
            'Your answer: ' + (optionLabel(q.options[item.chosenIndex]) || 'No answer');
          block.appendChild(yours);
          var right = document.createElement('p');
          right.textContent = 'Correct answer: ' + optionLabel(q.options[q.correctIndex]);
          block.appendChild(right);
          var why = document.createElement('p');
          why.textContent = q.explanation || '';
          block.appendChild(why);
          review.appendChild(block);
        });
      }
      panel.appendChild(review);

      var actions = document.createElement('div');
      actions.className = 'w5-actions';
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'btn btn-secondary';
      retry.textContent = 'Retry quiz';
      retry.addEventListener('click', function () {
        index = 0;
        answers = [];
        completed = false;
        score = 0;
        startedAt = Date.now();
        if (progress) {
          progress.markStarted(activityId);
        }
        render();
        if (typeof config.onRetry === 'function') {
          config.onRetry();
        }
      });
      actions.appendChild(retry);
      panel.appendChild(actions);
      host.appendChild(panel);
    }

    render();

    return {
      getScore: function () {
        return score;
      },
      getTotal: function () {
        return questions.length;
      },
      isComplete: function () {
        return completed;
      },
      getAnswers: function () {
        return answers.slice();
      },
      getCompletionTimeSeconds: function () {
        return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      }
    };
  }

  global.Unit3Week5Quiz = {
    createQuiz: createQuiz
  };
})(window);
