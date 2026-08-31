(function () {
  'use strict';

  var data = window.Week4SupportChallenge;
  var host = document.getElementById('w4-activity-host');
  if (!data || !host) return;

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for support-challenge fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  var key = 'unit3-week4-challenge-notes';
  var values = {};
  try {
    values = JSON.parse(localStorage.getItem(key) || '{}') || {};
  } catch (err) {
    values = {};
  }

  textFields.destroyAll();
  host.textContent = '';
  var panel = document.createElement('section');
  panel.className = 'panel';setAuthoredHtml(panel, '<h2>' + data.title + '</h2>');

  function addSupportBlock(block) {
    var section = document.createElement('section');
    section.className = 'w4-review-item';setAuthoredHtml(section, '<h3>' + block.title + '</h3>');
    if (block.points) {
      var list = document.createElement('ul');
      list.className = 'section-list';
      block.points.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      section.appendChild(list);
    }
    if (block.frame) {
      var frame = document.createElement('p');
      frame.className = 'w4-callout';
      frame.textContent = block.frame.join(' ');
      section.appendChild(frame);
    }
    if (block.note) {
      var note = document.createElement('p');
      note.className = 'panel-note';
      note.textContent = block.note;
      section.appendChild(note);
    }
    panel.appendChild(section);
  }

  addSupportBlock(data.mappingSupport);
  addSupportBlock(data.writingSupport);
  addSupportBlock(data.practicalSupport);
  addSupportBlock(data.readability);

  var formats = document.createElement('section');
  formats.className = 'w4-review-item';setAuthoredHtml(formats, '<h3>Multiple ways to respond</h3><ul class="section-list">' +
    data.responseFormats
      .map(function (item) {
        return '<li>' + item + '</li>';
      })
      .join('') +
    '</ul>');
  panel.appendChild(formats);

  var challenges = document.createElement('section');setAuthoredHtml(challenges, '<h3>Challenge activities</h3>');
  data.challenges.forEach(function (challenge) {
    var block = document.createElement('article');
    block.className = 'w4-review-item';setAuthoredHtml(block, '<h4>' + challenge.title + '</h4><p>' + challenge.prompt + '</p>');
    textFields.mount(block, {
      wrapClass: 'w4-reflection-field',
      id: challenge.id,
      prompt: 'Local notes (optional)',
      minChars: 80,
      value: values[challenge.id] || '',
      rows: 5,
      onChange: function (next) {
        values[challenge.id] = next;
        localStorage.setItem(key, JSON.stringify(values));
      }
    });
    challenges.appendChild(block);
  });
  panel.appendChild(challenges);
  host.appendChild(panel);
})();
