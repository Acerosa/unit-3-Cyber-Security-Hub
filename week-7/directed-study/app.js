(function () {
  'use strict';

  var data = window.Week7DirectedStudy;
  var progress = window.Unit3Week7Progress;
  if (!data) return;

  var host = document.getElementById('w7-activity-host');
  var DRAFT_KEY = 'directed-study';
  var state = {
    cisco: ['', ''],
    openvas: ['', '', ''],
    logs: ['', '', ''],
    product: {
      productName: '',
      monitors: '',
      detectionType: '',
      strength: '',
      limitation: '',
      sources: ''
    },
    acknowledged: false
  };

  if (progress) {
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.state) {
      state = Object.assign(state, draft.state);
      state.cisco = state.cisco || ['', ''];
      state.openvas = state.openvas || ['', '', ''];
      state.logs = state.logs || ['', '', ''];
      state.product = Object.assign(
        {
          productName: '',
          monitors: '',
          detectionType: '',
          strength: '',
          limitation: '',
          sources: ''
        },
        state.product || {}
      );
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

  function textField(parent, id, labelText, getter, setter, rows) {
    var wrap = document.createElement('div');
    wrap.className = 'w7-reflection-field';
    var label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    wrap.appendChild(label);
    var area = document.createElement('textarea');
    area.id = id;
    area.rows = rows || 3;
    area.value = getter() || '';
    area.addEventListener('input', function () {
      setter(area.value);
      save();
    });
    wrap.appendChild(area);
    parent.appendChild(wrap);
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>' +
      data.title +
      '</h2>' +
      '<p class="w7-callout" role="note">' +
      data.leavingHubNotice +
      '</p>';

    var cisco = document.createElement('section');
    cisco.className = 'w7-review-item w7-platform-section';
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
    data.ciscoTask.recordFields.forEach(function (labelText, index) {
      textField(
        cisco,
        'cisco-' + index,
        labelText,
        function () {
          return state.cisco[index];
        },
        function (value) {
          state.cisco[index] = value;
        },
        3
      );
    });
    panel.appendChild(cisco);

    var openvas = document.createElement('section');
    openvas.className = 'w7-review-item w7-platform-section';
    openvas.innerHTML =
      '<h3>TryHackMe: ' +
      data.tryhackmeOpenvas.room +
      '</h3>' +
      '<p class="panel-note">' +
      data.tryhackmeOpenvas.note +
      '</p>' +
      '<p><a class="btn btn-primary" href="' +
      data.tryhackmeOpenvas.url +
      '" target="_blank" rel="noopener noreferrer">Open ' +
      data.tryhackmeOpenvas.room +
      ' on TryHackMe <span aria-hidden="true">↗</span></a></p>';
    data.tryhackmeOpenvas.recordFields.forEach(function (labelText, index) {
      textField(
        openvas,
        'ov-' + index,
        labelText,
        function () {
          return state.openvas[index];
        },
        function (value) {
          state.openvas[index] = value;
        },
        3
      );
    });
    panel.appendChild(openvas);

    var logs = document.createElement('section');
    logs.className = 'w7-review-item w7-platform-section';
    logs.innerHTML =
      '<h3>TryHackMe: ' +
      data.tryhackmeLogs.room +
      '</h3>' +
      '<p class="panel-note">' +
      data.tryhackmeLogs.note +
      '</p>' +
      '<p><a class="btn btn-primary" href="' +
      data.tryhackmeLogs.url +
      '" target="_blank" rel="noopener noreferrer">Open ' +
      data.tryhackmeLogs.room +
      ' on TryHackMe <span aria-hidden="true">↗</span></a></p>';
    data.tryhackmeLogs.recordFields.forEach(function (labelText, index) {
      textField(
        logs,
        'logs-' + index,
        labelText,
        function () {
          return state.logs[index];
        },
        function (value) {
          state.logs[index] = value;
        },
        3
      );
    });
    panel.appendChild(logs);

    var research = document.createElement('section');
    research.className = 'w7-review-item w7-platform-section';
    research.innerHTML =
      '<h3>' +
      data.industryResearch.title +
      '</h3><p class="panel-note">' +
      data.industryResearch.prompt +
      '</p>';
    data.industryResearch.fields.forEach(function (fieldDef) {
      textField(
        research,
        'prod-' + fieldDef.id,
        fieldDef.label,
        function () {
          return state.product[fieldDef.id];
        },
        function (value) {
          state.product[fieldDef.id] = value;
        },
        fieldDef.id === 'sources' ? 2 : 3
      );
    });
    panel.appendChild(research);

    var ackWrap = document.createElement('div');
    ackWrap.className = 'w7-reflection-field';
    var ackLabel = document.createElement('label');
    var ack = document.createElement('input');
    ack.type = 'checkbox';
    ack.id = 'w7-directed-ack';
    ack.checked = !!state.acknowledged;
    ack.addEventListener('change', function () {
      state.acknowledged = ack.checked;
      save();
      status.textContent = state.acknowledged
        ? 'Acknowledgement saved in this browser. Directed study is unscored.'
        : 'Tick the box when you have planned or completed the tasks.';
    });
    ackLabel.appendChild(ack);
    ackLabel.appendChild(
      document.createTextNode(
        ' I acknowledge the directed-study tasks (Cisco, OpenVAS, Intro to Logs and product research).'
      )
    );
    ackWrap.appendChild(ackLabel);
    panel.appendChild(ackWrap);

    var status = document.createElement('p');
    status.className = 'panel-note';
    status.setAttribute('aria-live', 'polite');
    status.textContent = state.acknowledged
      ? 'Acknowledgement saved in this browser. Directed study is unscored.'
      : 'Tick the box when you have planned or completed the tasks.';
    panel.appendChild(status);

    host.appendChild(panel);
  }

  render();
})();
