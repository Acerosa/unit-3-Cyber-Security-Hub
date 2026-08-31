(function () {
  'use strict';

  var data = window.Week3PeerMarking;
  var progress = window.Unit3Week3Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'peer-marking';
  var host = document.getElementById('w3-peer-host');
  var state = {
    sampleId: 'weak',
    criteria: {},
    awarded: 0,
    strength: '',
    improvement: '',
    rewrite: ''
  };
  var startedAt = new Date().toISOString();

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      state = Object.assign(state, draft.state || {});
    }
  }

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
    if (state.awarded >= 0) marks += 1;
    if ((state.strength || '').trim()) marks += 1;
    if ((state.improvement || '').trim()) marks += 1;
    if ((state.rewrite || '').trim().length > 20) marks += 1;
    var selected = Object.keys(state.criteria).filter(function (key) {
      return state.criteria[key];
    }).length;
    if (selected >= 2) marks += 1;
    if ((state.rewrite || '').toLowerCase().indexOf('because') !== -1) marks += 1;
    return Math.min(data.total, marks);
  }

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for peer-marking fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  function render() {
    if (!host) return;
    textFields.destroyAll();
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>Peer marking and answer improvement</h2>' +
      '<p><strong>Question (' +
      data.question.marks +
      ' marks):</strong> ' +
      data.question.prompt +
      '</p>' +
      '<p class="w3-callout" role="note"><strong>Common error:</strong> ' +
      data.commonError +
      '</p>' +
      '<ul class="section-list">' +
      data.guidance.map(function (item) {
        return '<li>' + item + '</li>';
      }).join('') +
      '</ul>' +
      '<p class="panel-note">Do not collect another learner’s name or identifiable work. Use the anonymised samples only.</p>');

    var sampleField = document.createElement('fieldset');
    sampleField.className = 'w3-options';
    var legend = document.createElement('legend');
    legend.textContent = 'Choose a sample response to mark';
    sampleField.appendChild(legend);
    data.samples.forEach(function (sample) {
      var id = 'sample-' + sample.id;
      var label = document.createElement('label');
      label.className = 'w3-option';
      label.setAttribute('for', id);
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'sample';
      input.id = id;
      input.value = sample.id;
      if (state.sampleId === sample.id) input.checked = true;
      input.addEventListener('change', function () {
        state.sampleId = sample.id;
        save();
        render();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + sample.label));
      sampleField.appendChild(label);
    });
    panel.appendChild(sampleField);

    var sample = data.samples.filter(function (item) {
      return item.id === state.sampleId;
    })[0];
    var sampleBox = document.createElement('blockquote');
    sampleBox.className = 'w3-scenario';
    sampleBox.textContent = sample.text;
    panel.appendChild(sampleBox);

    data.criteria.forEach(function (criterion) {
      var label = document.createElement('label');
      label.className = 'w3-checkbox-label';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!state.criteria[criterion.id];
      input.addEventListener('change', function () {
        state.criteria[criterion.id] = input.checked;
        save();
      });
      label.appendChild(input);
      label.appendChild(
        document.createTextNode(' ' + criterion.label + ' (' + criterion.marks + ')')
      );
      panel.appendChild(label);
    });

    function field(id, labelText, key, rows) {
      if (!rows) {
        var wrap = document.createElement('div');
        wrap.className = 'w3-reflection-field';
        var label = document.createElement('label');
        label.setAttribute('for', id);
        label.textContent = labelText;
        wrap.appendChild(label);
        var area = document.createElement('input');
        area.type = 'number';
        area.min = '0';
        area.max = String(data.question.marks);
        area.id = id;
        area.value = state[key] != null ? state[key] : '';
        area.addEventListener('input', function () {
          state[key] = Number(area.value);
          save();
        });
        wrap.appendChild(area);
        panel.appendChild(wrap);
        return;
      }
      var minChars = key === 'rewrite' ? 20 : 30;
      textFields.mount(panel, {
        wrapClass: 'w3-reflection-field',
        id: id,
        prompt: labelText,
        minChars: minChars,
        value: state[key] != null ? String(state[key]) : '',
        rows: rows,
        onChange: function (next) {
          state[key] = next;
          save();
        }
      });
    }

    field('awarded-mark', 'Awarded mark for the sample (0–4)', 'awarded');
    field('strength', 'One strength', 'strength', 3);
    field('improvement', 'One improvement', 'improvement', 3);
    field('rewrite', 'Rewrite the weakest sentence', 'rewrite', 4);

    var exemplar = document.createElement('details');
    exemplar.className = 'session-disclosure';setAuthoredHtml(exemplar, '<summary class="session-disclosure__summary"><span class="session-disclosure__text"><h3 class="session-disclosure__heading">Compare with exemplar</h3></span><span class="session-disclosure__icon" aria-hidden="true"></span></summary>' +
      '<div class="session-disclosure__content"><p>' +
      data.exemplar +
      '</p></div>');
    panel.appendChild(exemplar);

    var actions = document.createElement('div');
    actions.className = 'w3-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Mark activity complete and submit';
    btn.addEventListener('click', function () {
      var marks = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, marks, data.total);
      window.Unit3Week3Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w3-submit-host',
        getScore: computeScore,
        getTotal: function () {
          return data.total;
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - Date.parse(startedAt)) / 1000));
        },
        getReflection: function () {
          return (
            'Peer marking sample=' +
            state.sampleId +
            '; strength/improvement/rewrite completed.'
          );
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var payload = {
            sampleId: state.sampleId,
            criteria: state.criteria,
            awarded: state.awarded,
            strength: state.strength,
            improvement: state.improvement,
            rewrite: state.rewrite
          };
          if (evidence && evidence.structured) {
            return [
              evidence.structured('PEER1', payload, {
                correct: computeScore() >= 3,
                score: computeScore()
              })
            ];
          }
          return [
            {
              questionId: 'PEER1',
              response: payload,
              responseType: 'structured',
              correct: computeScore() >= 3,
              score: computeScore()
            }
          ];
        },
        getStartedAt: function () {
          return new Date(startedAt).toISOString();
        },
        getCompletedAt: function () {
          return new Date().toISOString();
        },
        canSubmit: function () {
          return computeScore() >= 3;
        }
      });
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
