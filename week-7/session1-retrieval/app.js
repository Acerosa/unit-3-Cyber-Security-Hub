(function () {
  'use strict';

  var data = window.Week7Session1Retrieval;
  var progress = window.Unit3Week7Progress;
  if (!data || !window.Unit3Week7Quiz) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'session1-retrieval';
  var host = document.getElementById('w7-activity-host');
  var startedAt = Date.now();
  var quizScore = 0;
  var quizResult = null;
  var mode = 'quiz';
  var reflections = {};
  var completed = false;

  data.reflections.forEach(function (item) {
    reflections[item.id] = '';
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      reflections = Object.assign(reflections, draft.reflections || {});
      if (typeof draft.quizScore === 'number') quizScore = draft.quizScore;
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        reflections: reflections,
        quizScore: quizScore,
        savedAt: new Date().toISOString()
      });
    }
  }

  function reflectionMarks() {
    var marks = 0;
    data.reflections.forEach(function (item) {
      if (String(reflections[item.id] || '').trim().length >= item.minChars) {
        marks += item.marks;
      }
    });
    return marks;
  }

  function totalScore() {
    return Math.min(data.total, quizScore + reflectionMarks());
  }

  function clearSubmit() {
    var submit = document.getElementById('w7-submit-host');
    if (submit) {
      submit.hidden = true;
      submit.textContent = '';
    }
  }

  function openSubmit(score, quizResult) {
    window.Unit3Week7Submit.renderSubmitPanel({
      activityId: ACTIVITY_ID,
      hostId: 'w7-submit-host',
      getScore: function () {
        return score;
      },
      getTotal: function () {
        return data.total;
      },
      getCompletionTimeSeconds: function () {
        return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      },
      getResponses: function () {
        var evidence = window.Unit3SupabaseEvidence;
        var quizQuestions = data.questions.map(function (question, index) {
          return Object.assign({}, question, { id: 'S1R' + (index + 1) });
        });
        var quizResponses = evidence.fromQuizResult(quizResult, quizQuestions);
        return quizResponses.concat(
          data.reflections.map(function (item, index) {
            return evidence.freeText('S1R' + (index + 5), reflections[item.id], {
              correct: String(reflections[item.id] || '').trim().length >= item.minChars,
              score:
                String(reflections[item.id] || '').trim().length >= item.minChars
                  ? item.marks
                  : 0
            });
          })
        );
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
  }

  function renderReflections() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Short written retrieval</h2>' +
      '<p class="panel-note">MCQ score so far: ' +
      quizScore +
      ' / 4. Complete both reflections for the remaining marks. Written answers are scored by completeness, not against a model answer.</p>';

    var mis = document.createElement('div');
    mis.className = 'w7-misconception';
    mis.setAttribute('role', 'note');
    mis.innerHTML =
      '<strong>Keep these distinctions clear:</strong><ul class="section-list">' +
      data.misconceptions
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>';
    panel.appendChild(mis);

    data.reflections.forEach(function (item) {
      var wrap = document.createElement('div');
      wrap.className = 'w7-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', item.id);
      label.textContent = item.label;
      wrap.appendChild(label);
      var starter = document.createElement('p');
      starter.className = 'panel-note';
      starter.textContent = 'Optional starter: ' + item.starter;
      wrap.appendChild(starter);
      var area = document.createElement('textarea');
      area.id = item.id;
      area.rows = 4;
      area.value = reflections[item.id] || '';
      area.addEventListener('input', function () {
        reflections[item.id] = area.value;
        save();
      });
      wrap.appendChild(area);
      panel.appendChild(wrap);
    });

    var status = document.createElement('div');
    status.id = 'w7-s1r-status';
    status.className = 'status-messages';
    status.setAttribute('aria-live', 'polite');
    panel.appendChild(status);

    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete retrieval';
    btn.addEventListener('click', function () {
      status.textContent = '';
      var missing = data.reflections.filter(function (item) {
        return String(reflections[item.id] || '').trim().length < item.minChars;
      });
      if (missing.length) {
        var warn = document.createElement('p');
        warn.className = 'message message-warning';
        warn.textContent =
          'Add a fuller answer for each reflection (about ' +
          missing[0].minChars +
          ' characters or more).';
        status.appendChild(warn);
        return;
      }
      save();
      completed = true;
      var score = totalScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
      var done = document.createElement('p');
      done.className = 'message message-success';
      done.textContent = 'Retrieval complete. Score: ' + score + ' / ' + data.total + '.';
      status.appendChild(done);
      openSubmit(score, quizResult);
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function startQuiz() {
    if (!host) return;
    host.textContent = '';
    var intro = document.createElement('section');
    intro.className = 'panel';
    intro.innerHTML =
      '<h2>' +
      data.activityName +
      '</h2><p class="panel-note">' +
      data.intro +
      '</p>';
    host.appendChild(intro);

    var quizHost = document.createElement('div');
    quizHost.id = 'w7-quiz-host';
    host.appendChild(quizHost);

    window.Unit3Week7Quiz.createQuiz({
      activityId: ACTIVITY_ID,
      questions: data.questions.slice(),
      hostId: 'w7-quiz-host',
      onComplete: function (result) {
        quizResult = result;
        quizScore = result.score;
        save();
        mode = 'reflect';
        renderReflections();
      },
      onRetry: function () {
        clearSubmit();
        quizScore = 0;
        save();
      }
    });
  }

  if (mode === 'reflect' && completed) {
    renderReflections();
  } else {
    startQuiz();
  }
})();
