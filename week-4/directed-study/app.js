(function () {
  'use strict';

  var data = window.Week4DirectedStudy;
  var thm = window.Unit3Week4TryHackMeData;
  var host = document.getElementById('w4-activity-host');
  if (!data || !host) return;

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for directed-study fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  var room = ((thm && thm.resources) || []).filter(function (item) {
    return item.roomId === data.tryhackmeRoomId;
  })[0];

  var key = 'unit3-week4-directed-study-notes';
  var values = {};
  try {
    values = JSON.parse(localStorage.getItem(key) || '{}') || {};
  } catch (err) {
    values = {};
  }

  function persist() {
    localStorage.setItem(key, JSON.stringify(values));
  }

  textFields.destroyAll();
  host.textContent = '';
  var panel = document.createElement('section');
  panel.className = 'panel';setAuthoredHtml(panel, '<h2>' +
    data.title +
    '</h2>' +
    '<div class="w4-thm-safety" role="note"><h3>Safety restrictions</h3><ul class="section-list">' +
    data.safety
      .map(function (item) {
        return '<li>' + item + '</li>';
      })
      .join('') +
    '</ul></div>' +
    '<h3>Cisco Networking Academy</h3>' +
    '<p><strong>Course:</strong> ' +
    data.cisco.course +
    '</p>' +
    '<p class="panel-note">' +
    data.cisco.accessNote +
    '</p>' +
    '<ul class="section-list">' +
    data.cisco.topics
      .map(function (topic) {
        return '<li>' + topic.label + '</li>';
      })
      .join('') +
    '</ul>' +
    '<ul class="section-list">' +
    data.cisco.tasks
      .map(function (task) {
        return '<li>' + task + '</li>';
      })
      .join('') +
    '</ul>');

  if (room) {
    var thmBlock = document.createElement('div');setAuthoredHtml(thmBlock, '<h3>TryHackMe: Google Dorking</h3>' +
      '<p>' +
      room.purpose +
      '</p>' +
      '<ul class="section-list">' +
      data.tryhackmeTasks
        .map(function (task) {
          return '<li>' + task + '</li>';
        })
        .join('') +
      '</ul>');
    var open = document.createElement('a');
    open.className = 'btn btn-primary';
    open.href = room.url;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.textContent = 'Open TryHackMe room (opens in a new tab)';
    thmBlock.appendChild(open);

    var techWrap = document.createElement('div');setAuthoredHtml(techWrap, '<h4>Three search techniques (local notes)</h4>');
    for (var i = 1; i <= 3; i += 1) {
      var id = 'dork-' + i;
      textFields.mount(techWrap, {
        wrapClass: 'w4-reflection-field',
        id: id,
        prompt: 'Technique ' + i,
        minChars: 80,
        value: values[id] || '',
        rows: 2,
        onChange: function (fieldId) {
          return function (next) {
            values[fieldId] = next;
            persist();
          };
        }(id)
      });
    }
    thmBlock.appendChild(techWrap);
    panel.appendChild(thmBlock);
  }

  var analysis = document.createElement('section');setAuthoredHtml(analysis, '<h3>' +
    data.writtenAnalysis.title +
    '</h3>' +
    '<ul class="section-list">' +
    data.writtenAnalysis.instructions
      .map(function (item) {
        return '<li>' + item + '</li>';
      })
      .join('') +
    '</ul>' +
    '<p class="panel-note">' +
    data.writtenAnalysis.submissionNote +
    '</p>');

  data.writtenAnalysis.planningFields.forEach(function (field, index) {
    var id = 'analysis-' + index;
    textFields.mount(analysis, {
      wrapClass: 'w4-reflection-field',
      id: id,
      prompt: field,
      minChars: 80,
      value: values[id] || '',
      rows: 2,
      onChange: function (fieldId) {
        return function (next) {
          values[fieldId] = next;
          persist();
        };
      }(id)
    });
  });

  var checklist = document.createElement('ul');
  checklist.className = 'w4-thm-checklist';
  data.writtenAnalysis.checklist.forEach(function (item, index) {
    var li = document.createElement('li');
    var label = document.createElement('label');
    var id = 'check-' + index;
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.checked = !!values[id];
    input.addEventListener('change', function () {
      values[id] = input.checked;
      persist();
    });
    label.setAttribute('for', id);
    label.appendChild(input);
    label.appendChild(document.createTextNode(' ' + item));
    li.appendChild(label);
    checklist.appendChild(li);
  });
  analysis.appendChild(checklist);
  panel.appendChild(analysis);

  var evidence = document.createElement('section');setAuthoredHtml(evidence, '<h3>Evidence requirements</h3><ul class="section-list">' +
    data.evidenceRequirements
      .map(function (item) {
        return '<li>' + item + '</li>';
      })
      .join('') +
    '</ul>');
  panel.appendChild(evidence);

  var actions = document.createElement('div');
  actions.className = 'w4-actions';
  var printBtn = document.createElement('button');
  printBtn.type = 'button';
  printBtn.className = 'btn btn-secondary';
  printBtn.textContent = 'Print planning notes';
  printBtn.addEventListener('click', function () {
    window.print();
  });
  actions.appendChild(printBtn);
  panel.appendChild(actions);
  host.appendChild(panel);
})();
