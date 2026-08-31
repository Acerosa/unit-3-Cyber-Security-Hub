(function () {
  'use strict';

  var data = window.Week6SupportChallenge;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for support-challenge fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  var host = document.getElementById('w6-activity-host');
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
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>' + data.title + '</h2>');

    var legHeading = document.createElement('h3');
    legHeading.textContent = 'Plain-language legislation cards';
    panel.appendChild(legHeading);
    var legGrid = document.createElement('div');
    legGrid.className = 'w6-two-col';
    data.legislationCards.forEach(function (card) {
      var article = document.createElement('article');
      article.className = 'w6-def-card';setAuthoredHtml(article, '<h4>' + card.title + '</h4><p>' + card.summary + '</p>');
      legGrid.appendChild(article);
    });
    panel.appendChild(legGrid);

    var rolesHeading = document.createElement('h3');
    rolesHeading.textContent = 'Stakeholder role cards';
    panel.appendChild(rolesHeading);
    data.roleCards.forEach(function (card) {
      var block = document.createElement('section');
      block.className = 'w6-review-item';setAuthoredHtml(block, '<h4>' + card.role + '</h4><ul class="section-list">');
      card.prompts.forEach(function (prompt) {setAuthoredHtml(block, (block.innerHTML || "") + ('<li>' + prompt + '</li>'));
      });setAuthoredHtml(block, (block.innerHTML || "") + ('</ul>'));
      panel.appendChild(block);
    });

    var recorder = document.createElement('p');
    recorder.className = 'panel-note';
    recorder.textContent = data.recorderOption;
    panel.appendChild(recorder);

    var grid = document.createElement('section');
    grid.className = 'w6-review-item';setAuthoredHtml(grid, '<h3>' +
      data.plannerGrid.title +
      '</h3><ul class="section-list">' +
      data.plannerGrid.columns
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>');
    panel.appendChild(grid);

    var starters = document.createElement('p');
    starters.className = 'panel-note';setAuthoredHtml(starters, '<strong>Sentence starters:</strong> ' + data.sentenceStarters.join(' '));
    panel.appendChild(starters);

    var examplesHeading = document.createElement('h3');
    examplesHeading.textContent = 'Worked examples';
    panel.appendChild(examplesHeading);
    data.workedExamples.forEach(function (item) {
      var ex = document.createElement('blockquote');
      ex.className = 'w6-scenario';setAuthoredHtml(ex, '<strong>' + item.title + ':</strong> ' + item.text);
      panel.appendChild(ex);
    });

    var stepsHeading = document.createElement('h3');
    stepsHeading.textContent = 'Step-by-step Discuss approach';
    panel.appendChild(stepsHeading);
    var steps = document.createElement('ol');
    steps.className = 'section-list';
    data.stepByStep.forEach(function (step) {
      var li = document.createElement('li');
      li.textContent = step;
      steps.appendChild(li);
    });
    panel.appendChild(steps);

    var accessHeading = document.createElement('h3');
    accessHeading.textContent = data.accessibility.title;
    panel.appendChild(accessHeading);
    var access = document.createElement('ul');
    access.className = 'section-list';
    data.accessibility.points.forEach(function (point) {
      var li = document.createElement('li');
      li.textContent = point;
      access.appendChild(li);
    });
    panel.appendChild(access);

    var challengeHeading = document.createElement('h3');
    challengeHeading.textContent = 'Optional extension challenges';
    panel.appendChild(challengeHeading);
    var optionalNote = document.createElement('p');
    optionalNote.className = 'panel-note';
    optionalNote.textContent =
      'These challenges are optional extensions. They are not required for Week 6 completion.';
    panel.appendChild(optionalNote);

    data.challenges.forEach(function (item) {
      var block = document.createElement('section');
      block.className = 'w6-review-item';setAuthoredHtml(block, '<h4>' + item.title + '</h4><p>' + item.prompt + '</p>');
      textFields.mount(block, {
        wrapClass: 'w6-reflection-field',
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
