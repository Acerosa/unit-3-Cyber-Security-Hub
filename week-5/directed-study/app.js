(function () {
  'use strict';

  var data = window.Week5DirectedStudy;
  var progress = window.Unit3Week5Progress;
  if (!data) return;

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for directed-study fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  var host = document.getElementById('w5-activity-host');
  var DRAFT_KEY = 'directed-study';
  var state = {
    taken: '',
    investigators: '',
    category: '',
    evidence: '',
    source: '',
    mostAffected: '',
    justification: '',
    challengeDecision: '',
    challengeWhy: '',
    acknowledged: false
  };

  if (progress) {
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === '1.0') {
      state = Object.assign(state, draft.state || {});
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: '1.0',
        state: state,
        savedAt: new Date().toISOString()
      });
    }
  }

  function field(parent, id, labelText, key, rows) {
    textFields.mount(parent, {
      wrapClass: 'w5-reflection-field',
      id: id,
      prompt: labelText,
      minChars: 80,
      value: state[key] || '',
      rows: rows,
      onChange: function (next) {
        state[key] = next;
        save();
      }
    });
  }

  function render() {
    if (!host) return;
    textFields.destroyAll();
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>' +
      data.title +
      '</h2>' +
      '<h3>TryHackMe: ' +
      data.tryhackme.room +
      '</h3>' +
      '<p class="panel-note">' +
      data.tryhackme.note +
      '</p>' +
      '<p><a class="btn btn-primary" href="' +
      data.tryhackme.url +
      '" target="_blank" rel="noopener noreferrer">Open Juicy Details on TryHackMe <span aria-hidden="true">↗</span></a></p>' +
      '<p>Record:</p><ul class="section-list">' +
      data.tryhackme.recordFields
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>');

    field(panel, 'taken', 'What was taken in the breach', 'taken', 3);
    field(panel, 'investigators', 'How investigators established what had happened', 'investigators', 3);
    field(panel, 'category', 'Which of the three impact categories applies', 'category', 2);
    field(panel, 'evidence', 'Evidence supporting the classification', 'evidence', 3);

    var real = document.createElement('section');
    real.className = 'w5-review-item';setAuthoredHtml(real, '<h3>' +
      data.realIncidentGrid.title +
      '</h3><ul class="section-list">' +
      data.realIncidentGrid.requirements
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>');
    field(real, 'source', 'Source / reference for the real incident', 'source', 2);
    field(real, 'mostAffected', 'Stakeholder most seriously affected', 'mostAffected', 2);
    field(real, 'justification', 'Justification', 'justification', 4);
    panel.appendChild(real);

    var challenge = document.createElement('section');
    challenge.className = 'w5-review-item';setAuthoredHtml(challenge, '<h3>' +
      data.decisionChallenge.title +
      '</h3><ul class="section-list">' +
      data.decisionChallenge.requirements
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>');
    field(challenge, 'challenge-decision', 'Decision you would now challenge', 'challengeDecision', 2);
    field(challenge, 'challenge-why', 'Two sentences explaining why', 'challengeWhy', 3);
    panel.appendChild(challenge);

    var ack = document.createElement('label');
    ack.className = 'w5-checkbox-label';
    var box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = !!state.acknowledged;
    box.addEventListener('change', function () {
      state.acknowledged = box.checked;
      save();
      if (box.checked && progress) {
        // Directed study is not a scored catalog activity; store acknowledgement only.
        progress.setDraft(data.acknowledgementKey, {
          acknowledged: true,
          at: new Date().toISOString()
        });
      }
    });
    ack.appendChild(box);
    ack.appendChild(
      document.createTextNode(
        ' I acknowledge the Week 5 directed-study tasks and understand they prepare discussion for Week 6.'
      )
    );
    panel.appendChild(ack);

    var status = document.createElement('p');
    status.className = 'panel-note';
    status.setAttribute('aria-live', 'polite');
    status.textContent = state.acknowledged
      ? 'Directed-study acknowledgement saved in this browser.'
      : 'Tick the acknowledgement when you have reviewed the tasks.';
    panel.appendChild(status);

    host.appendChild(panel);
  }

  render();
})();
