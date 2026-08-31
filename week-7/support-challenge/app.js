(function () {
  'use strict';

  var data = window.Week7SupportChallenge;
  var progress = window.Unit3Week7Progress;
  if (!data) return;

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for support-challenge fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  var host = document.getElementById('w7-activity-host');
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
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>' + data.title + '</h2><p class="panel-note">' + data.intro + '</p>');

    var hints = document.createElement('section');
    hints.className = 'w7-review-item';setAuthoredHtml(hints, '<h3>View mode hints</h3><ul class="section-list">');
    data.viewModeHints.forEach(function (item) {setAuthoredHtml(hints, (hints.innerHTML || "") + ('<li>' + item + '</li>'));
    });setAuthoredHtml(hints, (hints.innerHTML || "") + ('</ul>'));
    panel.appendChild(hints);

    var guide = document.createElement('p');
    guide.className = 'w7-callout';
    guide.setAttribute('role', 'note');
    guide.textContent = data.scoringGuideReminder;
    panel.appendChild(guide);

    var partial = document.createElement('section');
    partial.className = 'w7-review-item';setAuthoredHtml(partial, '<h3>Partially completed risk register support</h3><ul class="section-list">' +
      data.partialRegisterSupport
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>');
    panel.appendChild(partial);

    var worked = document.createElement('section');
    worked.className = 'w7-review-item';setAuthoredHtml(worked, '<h3>Two worked rows</h3>');
    data.workedRows.forEach(function (row) {
      var block = document.createElement('blockquote');
      block.className = 'w7-scenario';setAuthoredHtml(block, '<strong>' + row.title + ':</strong> ' + row.text);
      worked.appendChild(block);
    });
    panel.appendChild(worked);

    var cardsHeading = document.createElement('h3');
    cardsHeading.textContent = 'Prompt cards for testing and monitoring measures';
    panel.appendChild(cardsHeading);
    var grid = document.createElement('div');
    grid.className = 'w7-def-grid';
    data.promptCards.forEach(function (card) {
      var article = document.createElement('article');
      article.className = 'w7-def-card';setAuthoredHtml(article, '<h4>' + card.title + '</h4><p>' + card.prompt + '</p>');
      grid.appendChild(article);
    });
    panel.appendChild(grid);

    var starters = document.createElement('aside');
    starters.className = 'w7-support-toggle';setAuthoredHtml(starters, '<strong>Sentence starters from the brief</strong><ul class="section-list">' +
      data.sentenceStarters
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>');
    panel.appendChild(starters);

    var challengeHeading = document.createElement('h3');
    challengeHeading.textContent = 'Optional extension challenges';
    panel.appendChild(challengeHeading);
    var optionalNote = document.createElement('p');
    optionalNote.className = 'panel-note';
    optionalNote.textContent =
      'These challenges are optional extensions. They are not required for Week 7 completion.';
    panel.appendChild(optionalNote);

    data.challenges.forEach(function (item) {
      var block = document.createElement('section');
      block.className = 'w7-review-item';setAuthoredHtml(block, '<h4>' + item.title + '</h4><p>' + item.prompt + '</p>');
      textFields.mount(block, {
        wrapClass: 'w7-reflection-field',
        id: item.id,
        prompt: 'Your optional challenge response',
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
