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
    immediate: '',
    sixMonths: '',
    improvement: ''
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

  function combinedWriting() {
    return [state.immediate, state.sixMonths, state.improvement].join(' ');
  }

  function meetsCriterion(id) {
    var text = combinedWriting().toLowerCase();
    if (id === 'a1') {
      return /patient|staff|northbank|regulator|clinic|individual/.test(text);
    }
    if (id === 'a2') {
      return /delay|cancel|expos|unavailable|encrypt|review|record|confidence|reputation/.test(text);
    }
    if (id === 'a3') {
      return /two|working day|contact|media|urgent|booking|shared/.test(text);
    }
    if (id === 'a4') {
      return String(state.immediate || '').trim().length >= WRITING_MIN &&
        String(state.sixMonths || '').trim().length >= WRITING_MIN;
    }
    if (id === 'a5') {
      return /because|so that|which means|as a result/.test(text);
    }
    if (id === 'a6') {
      return /safety|clinical|confidential|confidence|reputation|disruption/.test(text);
    }
    return false;
  }

  function computeScore() {
    var marks = (data.creditCriteria || []).filter(function (item) {
      return meetsCriterion(item.id);
    }).length;
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
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
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>Analysing rather than listing impacts</h2>' +
      '<p class="panel-note">' +
      data.teachingPoint +
      '</p>' +
      '<p class="w5-scenario">' +
      data.scenario +
      '</p>');

    var weak = document.createElement('blockquote');
    weak.className = 'w5-scenario w5-weak-response';setAuthoredHtml(weak, '<strong>' +
      data.weakResponse.label +
      ':</strong> ' +
      data.weakResponse.text +
      '<ul class="section-list">' +
      data.weakResponse.problems
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>');
    panel.appendChild(weak);

    data.writingTasks.forEach(function (task) {
      textFields.mount(panel, {
        wrapClass: 'w5-reflection-field',
        id: task.id,
        prompt: task.label,
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
      var criteria = (data.creditCriteria || []).map(function (item) {
        return '<li>' + (meetsCriterion(item.id) ? 'Met: ' : 'Still missing: ') + item.label + '</li>';
      }).join('');
      setAuthoredHtml(status, '<p class="message message-success">Analysis practice completed (' +
        score +
        ' / ' +
        data.total +
        ').</p><p>A stronger answer includes:</p><ul class="section-list">' +
        criteria +
        '</ul>');
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
          var criteria = data.creditCriteria || [];
          return criteria.map(function (item, index) {
            var qid = 'IA' + (index + 1);
            var checked = meetsCriterion(item.id);
            var payload = {
              criterionId: item.id,
              label: item.label,
              met: checked
            };
            if (index === criteria.length - 1) {
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
