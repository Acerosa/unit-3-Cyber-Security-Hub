(function () {
  'use strict';

  var data = window.Week6DirectedStudy;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for directed-study fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  var host = document.getElementById('w6-activity-host');
  var DRAFT_KEY = 'directed-study';
  var state = {
    ciscoFramework: '',
    ciscoExample: '',
    isoConcept: '',
    isoStandard: '',
    legalConstraints: '',
    ncscSummary: '',
    lo2Checks: {},
    priority1: '',
    priority2: '',
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
      wrapClass: 'w6-reflection-field',
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
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>' +
      data.title +
      '</h2>' +
      '<p class="w6-callout" role="note">' +
      data.leavingHubNotice +
      '</p>';

    var cisco = document.createElement('section');
    cisco.className = 'w6-review-item';
    cisco.innerHTML =
      '<h3>' +
      data.ciscoTask.title +
      '</h3><ul class="section-list">' +
      data.ciscoTask.instructions
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>';
    field(
      cisco,
      'cisco-framework',
      'Compliance framework versus legislation',
      'ciscoFramework',
      3
    );
    field(cisco, 'cisco-example', 'Northbank example where both could apply', 'ciscoExample', 3);
    panel.appendChild(cisco);

    var iso = document.createElement('section');
    iso.className = 'w6-review-item w6-thm-section';
    iso.innerHTML =
      '<h3>TryHackMe: ' +
      data.tryhackmeIso.room +
      '</h3>' +
      '<p class="panel-note">' +
      data.tryhackmeIso.note +
      '</p>' +
      '<p><a class="btn btn-primary" href="' +
      data.tryhackmeIso.url +
      '" target="_blank" rel="noopener noreferrer">Open ' +
      data.tryhackmeIso.room +
      ' on TryHackMe <span aria-hidden="true">↗</span></a></p>' +
      '<ul class="section-list">' +
      data.tryhackmeIso.recordFields
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>';
    field(iso, 'iso-concept', data.tryhackmeIso.recordFields[0], 'isoConcept', 3);
    field(iso, 'iso-standard', data.tryhackmeIso.recordFields[1], 'isoStandard', 3);
    panel.appendChild(iso);

    var legal = document.createElement('section');
    legal.className = 'w6-review-item w6-thm-section';
    legal.innerHTML =
      '<h3>TryHackMe: ' +
      data.tryhackmeLegal.room +
      '</h3>' +
      '<p class="panel-note">' +
      data.tryhackmeLegal.note +
      '</p>' +
      '<p><a class="btn btn-primary" href="' +
      data.tryhackmeLegal.url +
      '" target="_blank" rel="noopener noreferrer">Open ' +
      data.tryhackmeLegal.room +
      ' on TryHackMe <span aria-hidden="true">↗</span></a></p>' +
      '<ul class="section-list">' +
      data.tryhackmeLegal.recordFields
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>';
    field(legal, 'legal-constraints', data.tryhackmeLegal.recordFields[0], 'legalConstraints', 4);
    panel.appendChild(legal);

    var ncsc = document.createElement('section');
    ncsc.className = 'w6-review-item';
    ncsc.innerHTML = '<h3>' + data.ncscResearch.title + '</h3>';
    data.ncscResearch.links.forEach(function (link) {
      var p = document.createElement('p');
      var a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = link.label + ' ↗';
      p.appendChild(a);
      ncsc.appendChild(p);
    });
    field(ncsc, 'ncsc-summary', data.ncscResearch.summaryPrompt, 'ncscSummary', 6);
    panel.appendChild(ncsc);

    var lo2 = document.createElement('section');
    lo2.className = 'w6-review-item';
    lo2.innerHTML = '<h3>LO2 checklist self-assessment</h3>';
    data.lo2Checklist.forEach(function (item, index) {
      var label = document.createElement('label');
      label.className = 'w6-checkbox-label';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!state.lo2Checks['lo2-' + index];
      input.addEventListener('change', function () {
        state.lo2Checks['lo2-' + index] = input.checked;
        save();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + item));
      lo2.appendChild(label);
    });
    panel.appendChild(lo2);

    var priorities = document.createElement('section');
    priorities.className = 'w6-review-item';
    priorities.innerHTML = '<h3>Two revision priorities</h3>';
    field(priorities, 'priority-1', data.revisionPriorities[0], 'priority1', 2);
    field(priorities, 'priority-2', data.revisionPriorities[1], 'priority2', 2);
    panel.appendChild(priorities);

    var ack = document.createElement('label');
    ack.className = 'w6-checkbox-label';
    var box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = !!state.acknowledged;
    box.addEventListener('change', function () {
      state.acknowledged = box.checked;
      save();
      if (box.checked && progress) {
        progress.setDraft(data.acknowledgementKey, {
          acknowledged: true,
          at: new Date().toISOString()
        });
      }
    });
    ack.appendChild(box);
    ack.appendChild(
      document.createTextNode(
        ' I acknowledge the Week 6 directed-study tasks. External completion is not verified by this hub.'
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
