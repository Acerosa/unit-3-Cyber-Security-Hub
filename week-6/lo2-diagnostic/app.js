(function () {
  'use strict';

  var data = window.Week6Lo2Diagnostic;
  var progress = window.Unit3Week6Progress;
  if (!data || !window.Unit3Week6Quiz) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'lo2-diagnostic';
  var startedAt = Date.now();
  var revisionPriorities = { topic1: '', topic2: '', notes: '' };

  if (progress) {
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      revisionPriorities = Object.assign(revisionPriorities, draft.revisionPriorities || {});
    }
  }

  function savePriorities() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        revisionPriorities: revisionPriorities,
        savedAt: new Date().toISOString()
      });
    }
  }

  function computeWeakestTopics(answers) {
    var wrongCounts = {};
    answers.forEach(function (answer, index) {
      if (!answer || answer.correct) return;
      var q = data.questions[index];
      if (!q || !q.topic) return;
      wrongCounts[q.topic] = (wrongCounts[q.topic] || 0) + 1;
    });
    var ranked = Object.keys(wrongCounts)
      .map(function (topic) {
        return { topic: topic, count: wrongCounts[topic] };
      })
      .sort(function (a, b) {
        return b.count - a.count;
      });
    if (ranked.length >= 2) {
      return [ranked[0].topic, ranked[1].topic];
    }
    if (ranked.length === 1) {
      var fallback = Object.keys(data.topicLabels).find(function (topic) {
        return topic !== ranked[0].topic;
      });
      return [ranked[0].topic, fallback || ''];
    }
    return ['ethical', 'legal'];
  }

  function renderPriorityPanel(host, suggested) {
    host.textContent = '';
    var section = document.createElement('section');
    section.className = 'panel';
    section.setAttribute('aria-labelledby', 'w6-priority-heading');
    section.innerHTML =
      '<h2 id="w6-priority-heading">Revision priorities</h2>' +
      '<p class="panel-note">' +
      data.formativeNote +
      '</p>' +
      '<p class="w6-callout" role="status">Based on incorrect answers, suggested weakest topics: ' +
      '<strong>' +
      (data.topicLabels[suggested[0]] || suggested[0]) +
      '</strong> and <strong>' +
      (data.topicLabels[suggested[1]] || suggested[1]) +
      '</strong>. You may adjust these before saving.</p>';

    ['topic1', 'topic2'].forEach(function (fieldId, index) {
      var wrap = document.createElement('div');
      wrap.className = 'w6-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', fieldId);
      label.textContent = 'Revision priority ' + (index + 1);
      wrap.appendChild(label);
      var select = document.createElement('select');
      select.id = fieldId;
      Object.keys(data.topicLabels).forEach(function (topicKey) {
        var opt = document.createElement('option');
        opt.value = topicKey;
        opt.textContent = data.topicLabels[topicKey];
        if (
          revisionPriorities[fieldId] === topicKey ||
          (!revisionPriorities[fieldId] && suggested[index] === topicKey)
        ) {
          opt.selected = true;
          revisionPriorities[fieldId] = topicKey;
        }
        select.appendChild(opt);
      });
      select.addEventListener('change', function () {
        revisionPriorities[fieldId] = select.value;
        savePriorities();
      });
      wrap.appendChild(select);
      section.appendChild(wrap);
    });

    var notesWrap = document.createElement('div');
    notesWrap.className = 'w6-reflection-field';
    var notesLabel = document.createElement('label');
    notesLabel.setAttribute('for', 'priority-notes');
    notesLabel.textContent = 'Optional note: what will you revise first?';
    notesWrap.appendChild(notesLabel);
    var notes = document.createElement('textarea');
    notes.id = 'priority-notes';
    notes.rows = 3;
    notes.value = revisionPriorities.notes || '';
    notes.addEventListener('input', function () {
      revisionPriorities.notes = notes.value;
      savePriorities();
    });
    notesWrap.appendChild(notes);
    section.appendChild(notesWrap);

    var saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-secondary';
    saveBtn.textContent = 'Save revision priorities';
    saveBtn.addEventListener('click', function () {
      savePriorities();
      saveBtn.textContent = 'Priorities saved in this browser';
    });
    section.appendChild(saveBtn);
    host.appendChild(section);
  }

  window.Unit3Week6Quiz.createQuiz({
    activityId: ACTIVITY_ID,
    questions: data.questions.slice(),
    hostId: 'w6-activity-host',
    onComplete: function (result) {
      var suggested = computeWeakestTopics(result.answers || []);
      revisionPriorities.topic1 = revisionPriorities.topic1 || suggested[0];
      revisionPriorities.topic2 = revisionPriorities.topic2 || suggested[1];
      savePriorities();

      var host = document.getElementById('w6-activity-host');
      if (host) {
        var priorityHost = document.createElement('div');
        priorityHost.id = 'w6-priority-host';
        host.appendChild(priorityHost);
        renderPriorityPanel(priorityHost, suggested);
      }

      window.Unit3Week6Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w6-submit-host',
        getScore: function () {
          return result.score;
        },
        getTotal: function () {
          return result.total;
        },
        getQuestionsForReview: function () {
          return result.incorrectIndexes;
        },
        getReflection: function () {
          return (
            (data.topicLabels[revisionPriorities.topic1] || revisionPriorities.topic1) +
            ' | ' +
            (data.topicLabels[revisionPriorities.topic2] || revisionPriorities.topic2) +
            (revisionPriorities.notes ? ' | ' + revisionPriorities.notes : '')
          );
        },
        getCompletionTimeSeconds: function () {
          return result.completionTimeSeconds;
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          return evidence && evidence.fromQuizResult
            ? evidence.fromQuizResult(result, data.questions)
            : (result.answers || []).map(function (answer, index) {
                return {
                  questionId: data.questions[index].id,
                  response: { chosenIndex: answer.chosenIndex },
                  correct: Boolean(answer.correct),
                  score: answer.correct ? 1 : 0,
                  responseType: 'single-choice'
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
          return Boolean(revisionPriorities.topic1 && revisionPriorities.topic2);
        }
      });
    },
    onRetry: function () {
      var submit = document.getElementById('w6-submit-host');
      if (submit) {
        submit.hidden = true;
        submit.textContent = '';
      }
      var existing = document.getElementById('w6-priority-host');
      if (existing) existing.remove();
    }
  });
})();
