(function () {
  'use strict';

  var data = window.Week5ImpactAnalysis;
  var progress = window.Unit3Week5Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'impact-analysis';
  var host = document.getElementById('w5-activity-host');
  var startedAt = new Date().toISOString();
  var state = {
    annotations: {},
    immediate: '',
    sixMonths: '',
    improvement: '',
    revealedStrong: false
  };

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      state = Object.assign(state, draft.state || {});
    }
  }

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for impact-analysis fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  var WRITING_MIN = 30;

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        state: state,
        savedAt: new Date().toISOString()
      });
    }
  }

  function computeScore() {
    var marks = 0;
    var selected = Object.keys(state.annotations).filter(function (key) {
      return state.annotations[key];
    }).length;
    if (selected >= 3) marks += 2;
    if (String(state.immediate || '').trim().length >= WRITING_MIN) marks += 1;
    if (String(state.sixMonths || '').trim().length >= WRITING_MIN) marks += 1;
    if (String(state.improvement || '').trim().length >= WRITING_MIN) marks += 1;
    var combined = (state.immediate + ' ' + state.sixMonths).toLowerCase();
    if (
      combined.indexOf('because') !== -1 ||
      combined.indexOf('which means') !== -1 ||
      combined.indexOf('scenario') !== -1
    ) {
      marks += 1;
    }
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    var selected = Object.keys(state.annotations).filter(function (key) {
      return state.annotations[key];
    }).length;
    if (!state.revealedStrong) {
      messages.push('Reveal the stronger response and annotate where it earns credit before submitting.');
    }
    if (selected < 3) {
      messages.push('Identify at least three places where the stronger response earns additional credit.');
    }
    if (String(state.immediate || '').trim().length < WRITING_MIN) {
      messages.push('Write a full immediate-impact sentence.');
    }
    if (String(state.sixMonths || '').trim().length < WRITING_MIN) {
      messages.push('Write a full six-month impact sentence.');
    }
    if (String(state.improvement || '').trim().length < WRITING_MIN) {
      messages.push('Complete the answer-improvement sentence.');
    }
    return messages;
  }

  function render() {
    if (!host) return;
    textFields.destroyAll();
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Analysing rather than listing impacts</h2>' +
      '<p class="panel-note">' +
      data.teachingPoint +
      '</p>' +
      '<p class="w5-scenario">' +
      data.scenario +
      '</p>';

    var weak = document.createElement('blockquote');
    weak.className = 'w5-scenario w5-weak-response';
    weak.innerHTML =
      '<strong>' +
      data.weakResponse.label +
      ':</strong> ' +
      data.weakResponse.text +
      '<ul class="section-list">' +
      data.weakResponse.problems
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>';
    panel.appendChild(weak);

    if (!state.revealedStrong) {
      var reveal = document.createElement('button');
      reveal.type = 'button';
      reveal.className = 'btn btn-secondary';
      reveal.textContent = 'Reveal stronger analytical response';
      reveal.addEventListener('click', function () {
        state.revealedStrong = true;
        save();
        render();
      });
      panel.appendChild(reveal);
      var hideNote = document.createElement('p');
      hideNote.className = 'panel-note';
      hideNote.textContent =
        'Study the weak response first. The stronger response stays hidden until you choose to reveal it.';
      panel.appendChild(hideNote);
    } else {
      var strong = document.createElement('blockquote');
      strong.className = 'w5-scenario w5-improved-response';
      strong.innerHTML =
        '<strong>' + data.strongResponse.label + ':</strong> ' + data.strongResponse.text;
      panel.appendChild(strong);

      var annHeading = document.createElement('h3');
      annHeading.textContent = 'Annotation: where does the stronger response earn credit?';
      panel.appendChild(annHeading);
      data.strongResponse.creditAnnotations.forEach(function (item) {
        var label = document.createElement('label');
        label.className = 'w5-checkbox-label';
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!state.annotations[item.id];
        input.addEventListener('change', function () {
          state.annotations[item.id] = input.checked;
          save();
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + item.label));
        panel.appendChild(label);
      });
    }

    data.writingTasks.forEach(function (task) {
      textFields.mount(panel, {
        wrapClass: 'w5-reflection-field',
        id: task.id,
        prompt: task.label + ' (starter: ' + task.starter + ')',
        minChars: WRITING_MIN,
        value: state[task.id] || '',
        rows: 3,
        onChange: function (next) {
          state[task.id] = next;
          save();
        }
      });
    });

    textFields.mount(panel, {
      wrapClass: 'w5-reflection-field',
      id: 'improvement',
      prompt: data.improvementPrompt,
      minChars: WRITING_MIN,
      value: state.improvement || '',
      rows: 3,
      onChange: function (next) {
        state.improvement = next;
        save();
      }
    });

    var actions = document.createElement('div');
    actions.className = 'w5-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Complete analysis practice';
    btn.addEventListener('click', function () {
      var messages = validate();
      var status = document.getElementById('w5-analysis-status');
      if (!status) {
        status = document.createElement('div');
        status.id = 'w5-analysis-status';
        status.className = 'status-messages';
        status.setAttribute('aria-live', 'polite');
        panel.appendChild(status);
      }
      status.textContent = '';
      if (messages.length) {
        messages.forEach(function (msg) {
          var p = document.createElement('p');
          p.className = 'message message-warning';
          p.textContent = msg;
          status.appendChild(p);
        });
        return;
      }
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
      status.innerHTML =
        '<p class="message message-success">Analysis practice completed (' +
        score +
        ' / ' +
        data.total +
        '). Structured feedback: stronger credit comes from named stakeholders, scenario evidence, timescale and connections — not lists.</p>';
      window.Unit3Week5Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w5-submit-host',
        getScore: function () {
          return score;
        },
        getTotal: function () {
          return data.total;
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - Date.parse(startedAt)) / 1000));
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var annotations =
            (data.strongResponse && data.strongResponse.creditAnnotations) || [];
          return annotations.map(function (item, index) {
            var qid = 'IA' + (index + 1);
            var checked = Boolean(state.annotations[item.id]);
            var payload = {
              annotationId: item.id,
              label: item.label,
              checked: checked
            };
            if (index === annotations.length - 1) {
              payload.immediate = state.immediate;
              payload.sixMonths = state.sixMonths;
              payload.improvement = state.improvement;
            }
            if (evidence && evidence.structured) {
              return evidence.structured(qid, payload, {
                correct: checked,
                score: checked ? 1 : 0
              });
            }
            return {
              questionId: qid,
              response: payload,
              responseType: 'structured',
              correct: checked,
              score: checked ? 1 : 0
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
    host.appendChild(panel);
  }

  render();
})();
