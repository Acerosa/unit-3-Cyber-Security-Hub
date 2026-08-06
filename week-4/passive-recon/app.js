(function () {
  'use strict';

  var data = window.Unit3Week4TryHackMeData;
  var host = document.getElementById('w4-activity-host');
  if (!data || !host) return;

  var rooms = (data.resources || []).filter(function (item) {
    return item.deliveryMode === 'in-class';
  });

  host.textContent = '';
  var panel = document.createElement('section');
  panel.className = 'panel';
  panel.innerHTML =
    '<h2>Passive reconnaissance practical guidance</h2>' +
    '<p class="panel-note">' +
    data.accessNotice +
    '</p>' +
    '<div class="w4-thm-safety" role="note"><h3>Ethical and safety notice</h3><ul class="section-list">' +
    data.ethicalNotice
      .map(function (item) {
        return '<li>' + item + '</li>';
      })
      .join('') +
    '</ul></div>' +
    '<p class="w4-callout" role="note"><strong>Important:</strong> This website does not scan or probe systems. Use TryHackMe links and reflection fields only.</p>' +
    '<ol class="w4-thm-steps">' +
    '<li><strong>Complete Passive Reconnaissance first.</strong></li>' +
    '<li><strong>Move to Shodan.io when ready.</strong></li>' +
    '<li>Record what each technique reveals without touching the target.</li>' +
    '<li>Connect each lookup or finding to a possible attacker motivation (why).</li>' +
    '<li>Treat the rooms as examples of how an attacker may choose a target.</li>' +
    '</ol>';

  rooms.forEach(function (room) {
    var block = document.createElement('article');
    block.className = 'w4-review-item';
    block.innerHTML =
      '<h3>' +
      room.title +
      '</h3>' +
      '<p>' +
      room.purpose +
      '</p>' +
      '<p class="panel-note">' +
      room.timeLabel +
      ' · ' +
      room.ocrFocus +
      '</p>' +
      '<ul class="section-list">' +
      (room.focusPoints || [])
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>';
    if (room.pairedWorkingGuidance) {
      var pair = document.createElement('p');
      pair.className = 'w4-callout';
      pair.setAttribute('role', 'note');
      pair.textContent = room.pairedWorkingGuidance;
      block.appendChild(pair);
    }
    var open = document.createElement('a');
    open.className = 'btn btn-primary';
    open.href = room.url;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.textContent = 'Open ' + room.shortTitle + ' (opens in a new tab)';
    block.appendChild(open);
    var list = document.createElement('ul');
    list.className = 'w4-thm-checklist';
    (room.checklist || []).forEach(function (item, index) {
      var li = document.createElement('li');
      var label = document.createElement('label');
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.id = room.roomId + '-check-' + index;
      label.setAttribute('for', input.id);
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + item));
      li.appendChild(label);
      list.appendChild(li);
    });
    block.appendChild(list);
    panel.appendChild(block);
  });

  var reflection = document.createElement('section');
  reflection.innerHTML = '<h3>Reflection notes (local only)</h3>';
  ['Technique / finding', 'What it revealed (read-only)', 'Possible motivation (why)'].forEach(
    function (labelText, index) {
      var wrap = document.createElement('div');
      wrap.className = 'w4-reflection-field';
      var label = document.createElement('label');
      var id = 'thm-note-' + index;
      label.setAttribute('for', id);
      label.textContent = labelText;
      wrap.appendChild(label);
      var area = document.createElement('textarea');
      area.id = id;
      area.rows = 3;
      wrap.appendChild(area);
      reflection.appendChild(wrap);
    }
  );
  panel.appendChild(reflection);
  host.appendChild(panel);
})();
