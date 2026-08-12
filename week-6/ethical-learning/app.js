(function () {
  'use strict';

  var data = window.Week6EthicalLearning;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var mode = 'overview';
  var sectionIndex = 0;
  var sectionChecks = {};
  var finalScore = 0;

  if (progress) progress.markStarted(ACTIVITY_ID);

  function escapeText(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function navButton(label, nextMode, opts) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary';
    btn.textContent = label;
    btn.addEventListener('click', function () {
      mode = nextMode;
      if (opts && typeof opts.index === 'number') sectionIndex = opts.index;
      render();
      if (host) host.focus();
    });
    return btn;
  }

  function sectionCheckScore(section) {
    var check = section.check;
    if (!check) return 0;
    if (sectionChecks[check.id] === check.correctIndex) return 1;
    return 0;
  }

  function renderSectionCheck(section, panel) {
    var check = section.check;
    if (!check) return;
    var fieldset = document.createElement('fieldset');
    fieldset.className = 'w6-options';
    var legend = document.createElement('legend');
    legend.textContent = check.prompt;
    fieldset.appendChild(legend);
    check.options.forEach(function (option, optionIndex) {
      var id = check.id + '-opt-' + optionIndex;
      var label = document.createElement('label');
      label.className = 'w6-option w6-ethical';
      label.setAttribute('for', id);
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = check.id;
      input.id = id;
      input.value = String(optionIndex);
      if (sectionChecks[check.id] === optionIndex) input.checked = true;
      input.addEventListener('change', function () {
        sectionChecks[check.id] = optionIndex;
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' Ethical: ' + option));
      fieldset.appendChild(label);
    });
    panel.appendChild(fieldset);

    var feedback = document.createElement('div');
    feedback.className = 'status-messages';
    feedback.setAttribute('aria-live', 'polite');
    panel.appendChild(feedback);

    var checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'btn btn-primary';
    checkBtn.textContent = 'Check this section';
    checkBtn.addEventListener('click', function () {
      if (sectionChecks[check.id] == null) {
        feedback.innerHTML =
          '<p class="message message-warning">Select an answer before checking.</p>';
        return;
      }
      var correct = sectionChecks[check.id] === check.correctIndex;
      feedback.innerHTML =
        '<p class="message message-' +
        (correct ? 'success' : 'error') +
        '">' +
        (correct ? 'Correct. ' : 'Not quite. ') +
        escapeText(check.explanation) +
        '</p>';
    });
    panel.appendChild(checkBtn);
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    if (mode === 'overview') renderOverview();
    else if (mode === 'section') renderSection();
    else if (mode === 'final') renderFinalCheck();
  }

  function renderOverview() {
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Ethical considerations in cyber security</h2>' +
      '<p class="panel-note">' +
      escapeText(data.overviewNote) +
      '</p>' +
      '<ul class="section-list">' +
      data.sections
        .map(function (section) {
          return '<li><strong>' + escapeText(section.title) + '</strong></li>';
        })
        .join('') +
      '</ul>';
    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    actions.appendChild(navButton('Start with responsible disclosure', 'section', { index: 0 }));
    actions.appendChild(navButton('Go to final knowledge check', 'final'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderSection() {
    var section = data.sections[sectionIndex];
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<p class="panel-note" aria-live="polite">Section ' +
      (sectionIndex + 1) +
      ' of ' +
      data.sections.length +
      '</p>' +
      '<h2><span class="w6-dimension-label w6-ethical">Ethical</span> ' +
      escapeText(section.title) +
      '</h2>' +
      '<p>' +
      escapeText(section.content) +
      '</p>' +
      '<p class="w6-scenario"><strong>Northbank example:</strong> ' +
      escapeText(section.northbankExample) +
      '</p>' +
      (section.week3Link
        ? '<p class="w6-callout" role="note">' + escapeText(section.week3Link) + '</p>'
        : '');

    renderSectionCheck(section, panel);

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'btn btn-secondary';
    prev.textContent = 'Previous section';
    prev.disabled = sectionIndex === 0;
    prev.addEventListener('click', function () {
      sectionIndex -= 1;
      render();
    });
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'btn btn-primary';
    next.textContent =
      sectionIndex === data.sections.length - 1 ? 'Final knowledge check' : 'Next section';
    next.addEventListener('click', function () {
      if (sectionIndex === data.sections.length - 1) mode = 'final';
      else sectionIndex += 1;
      render();
    });
    actions.appendChild(prev);
    actions.appendChild(next);
    actions.appendChild(navButton('Overview', 'overview'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderFinalCheck() {
    host.textContent = '';
    if (!window.Unit3Week6Quiz) return;
    window.Unit3Week6Quiz.createQuiz({
      activityId: ACTIVITY_ID,
      questions: data.knowledgeCheck.slice(),
      hostId: 'w6-activity-host',
      onComplete: function (result) {
        var sectionMarks = data.sections.reduce(function (sum, section) {
          return sum + sectionCheckScore(section);
        }, 0);
        finalScore = Math.min(data.total, sectionMarks + result.score);
        if (progress) progress.markCompleted(ACTIVITY_ID, finalScore, data.total);

        var scoreNote = document.createElement('p');
        scoreNote.className = 'w6-callout';
        scoreNote.setAttribute('aria-live', 'polite');
        scoreNote.textContent =
          'Combined score: ' +
          finalScore +
          ' / ' +
          data.total +
          ' (section checks plus final quiz). Complete all section checks for full marks.';
        host.appendChild(scoreNote);

        window.Unit3Week6Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w6-submit-host',
          getScore: function () {
            return finalScore;
          },
          getTotal: function () {
            return data.total;
          },
          getQuestionsForReview: function () {
            return result.incorrectIndexes;
          },
          getCompletionTimeSeconds: function () {
            return (
              result.completionTimeSeconds ||
              Math.max(1, Math.round((Date.now() - startedAt) / 1000))
            );
          },
          getResponses: function () {
            var evidence = window.Unit3SupabaseEvidence;
            var responses = data.sections.map(function (section) {
              var check = section.check;
              var chosenIndex = sectionChecks[check.id];
              var correct = chosenIndex === check.correctIndex;
              var questionId = String(check.id).toUpperCase().replace(/-/g, '_');
              var payload = {
                chosenIndex: chosenIndex == null ? null : chosenIndex,
                selectedOption: chosenIndex == null ? null : check.options[chosenIndex]
              };
              return evidence && evidence.structured
                ? evidence.structured(questionId, payload, {
                    responseType: 'single-choice',
                    correct: correct,
                    score: correct ? 1 : 0
                  })
                : {
                    questionId: questionId,
                    response: payload,
                    correct: correct,
                    score: correct ? 1 : 0,
                    responseType: 'single-choice'
                  };
            });
            var finalResponses =
              evidence && evidence.fromQuizResult
                ? evidence.fromQuizResult(result, data.knowledgeCheck)
                : (result.answers || []).map(function (answer, index) {
                    return {
                      questionId: data.knowledgeCheck[index].id,
                      response: { chosenIndex: answer.chosenIndex },
                      correct: Boolean(answer.correct),
                      score: answer.correct ? 1 : 0,
                      responseType: 'single-choice'
                    };
                  });
            return responses.concat(finalResponses);
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
      },
      onRetry: function () {
        var submit = document.getElementById('w6-submit-host');
        if (submit) {
          submit.hidden = true;
          submit.textContent = '';
        }
      }
    });
  }

  render();
})();
