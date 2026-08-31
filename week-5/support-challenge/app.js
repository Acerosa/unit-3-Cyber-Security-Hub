(function () {
  'use strict';

  var data = window.Week5SupportChallenge;
  var progress = window.Unit3Week5Progress;
  if (!data) return;

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for support-challenge fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  var host = document.getElementById('w5-activity-host');
  var DRAFT_KEY = 'support-challenge';
  var responses = {};

  data.challenges.forEach(function (item) {
    responses[item.id] = '';
  });

  if (progress) {
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === '1.0') {
      responses = Object.assign(responses, draft.responses || {});
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: '1.0',
        responses: responses,
        savedAt: new Date().toISOString()
      });
    }
  }

  function render() {
    if (!host) return;
    textFields.destroyAll();
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>' +
      data.title +
      '</h2>' +
      '<h3>Clear definitions</h3>' +
      '<div class="w5-two-col">' +
      '<article class="w5-def-card"><h4>Loss</h4><p>' +
      data.definitions.loss +
      '</p></article>' +
      '<article class="w5-def-card"><h4>Disruption</h4><p>' +
      data.definitions.disruption +
      '</p></article>' +
      '<article class="w5-def-card"><h4>Safety</h4><p>' +
      data.definitions.safety +
      '</p></article>' +
      '</div>' +
      '<h3>' +
      data.gridSupport.title +
      '</h3><ul class="section-list">' +
      data.gridSupport.points
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>' +
      '<h3>' +
      data.writingSupport.title +
      '</h3><ul class="section-list">' +
      data.writingSupport.frame
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul><p class="panel-note">' +
      data.writingSupport.note +
      '</p>' +
      '<h3>' +
      data.accessibility.title +
      '</h3><ul class="section-list">' +
      data.accessibility.points
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>');

    var challengeHeading = document.createElement('h3');
    challengeHeading.textContent = 'Optional challenge tasks';
    panel.appendChild(challengeHeading);

    data.challenges.forEach(function (item) {
      var block = document.createElement('section');
      block.className = 'w5-review-item';setAuthoredHtml(block, '<h4>' + item.title + '</h4><p>' + item.prompt + '</p>');
      textFields.mount(block, {
        wrapClass: 'w5-reflection-field',
        id: item.id,
        prompt: 'Your challenge response (optional)',
        minChars: 80,
        value: responses[item.id] || '',
        rows: 5,
        onChange: function (next) {
          responses[item.id] = next;
          save();
        }
      });
      panel.appendChild(block);
    });

    host.appendChild(panel);
  }

  render();
})();
