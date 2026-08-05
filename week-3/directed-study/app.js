(function () {
  'use strict';

  var data = window.Week3DirectedStudy;
  var thm = window.Unit3Week3TryHackMeData;
  var host = document.getElementById('w3-dis-host');
  if (!data || !host) return;

  var room = ((thm && thm.resources) || []).filter(function (item) {
    return item.roomId === 'hackermethodology';
  })[0];

  var key = 'unit3-week3-attacker-research-profile';
  var fields = data.researchTemplateFields || [];
  var values = {};
  try {
    values = JSON.parse(localStorage.getItem(key) || '{}') || {};
  } catch (err) {
    values = {};
  }

  host.textContent = '';
  var panel = document.createElement('section');
  panel.className = 'panel';
  panel.innerHTML =
    '<h2>' +
    data.title +
    '</h2>' +
    '<p class="w3-thm-safety" role="note">' +
    data.safety +
    '</p>' +
    '<h3>Cisco Networking Academy</h3>' +
    '<p><strong>Course:</strong> ' +
    data.cisco.course +
    '<br><strong>Topic:</strong> ' +
    data.cisco.topic +
    '</p><ul class="section-list">' +
    data.cisco.tasks
      .map(function (task) {
        return '<li>' + task + '</li>';
      })
      .join('') +
    '</ul>';

  if (room) {
    var thmBlock = document.createElement('div');
    thmBlock.innerHTML =
      '<h3>TryHackMe: The Hacker Methodology</h3>' +
      '<p>' +
      room.purpose +
      '</p>';
    var open = document.createElement('a');
    open.className = 'btn btn-primary';
    open.href = room.url;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.textContent = 'Open TryHackMe room (opens in a new tab)';
    thmBlock.appendChild(open);
    panel.appendChild(thmBlock);
  }

  var form = document.createElement('section');
  form.innerHTML =
    '<h3>Attacker research profile template</h3>' +
    '<p class="panel-note">Printable/local notes only. This directed-study resource is not a scored API submission.</p>';
  fields.forEach(function (field, index) {
    var id = 'research-' + index;
    var wrap = document.createElement('div');
    wrap.className = 'w3-reflection-field';
    var label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = field;
    wrap.appendChild(label);
    var area = document.createElement('textarea');
    area.id = id;
    area.rows = 2;
    area.value = values[field] || '';
    area.addEventListener('input', function () {
      values[field] = area.value;
      localStorage.setItem(key, JSON.stringify(values));
    });
    wrap.appendChild(area);
    form.appendChild(wrap);
  });
  var actions = document.createElement('div');
  actions.className = 'w3-actions';
  var printBtn = document.createElement('button');
  printBtn.type = 'button';
  printBtn.className = 'btn btn-secondary';
  printBtn.textContent = 'Print template';
  printBtn.addEventListener('click', function () {
    window.print();
  });
  actions.appendChild(printBtn);
  form.appendChild(actions);
  panel.appendChild(form);
  host.appendChild(panel);
})();
