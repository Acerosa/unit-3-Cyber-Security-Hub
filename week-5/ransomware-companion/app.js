(function () {
  'use strict';

  var data = window.Week5RansomwareCompanion;
  var progress = window.Unit3Week5Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'ransomware-companion';
  var host = document.getElementById('w5-activity-host');
  var startedAt = Date.now();
  var state = {
    selectedRole: '',
    roleDecision: '',
    decisions: [
      { decision: '', reason: '', stakeholder: '', impactReduced: '', impactCategory: '' },
      { decision: '', reason: '', stakeholder: '', impactReduced: '', impactCategory: '' }
    ],
    facilitatedConfirmed: false
  };

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      state = Object.assign(state, draft.state || {});
      if (!state.decisions || !state.decisions.length) {
        state.decisions = [
          { decision: '', reason: '', stakeholder: '', impactReduced: '', impactCategory: '' },
          { decision: '', reason: '', stakeholder: '', impactReduced: '', impactCategory: '' }
        ];
      }
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        state: state,
        savedAt: new Date().toISOString()
      });
    }
  }

  function decisionComplete(row) {
    return (
      String(row.decision || '').trim().length >= 8 &&
      String(row.reason || '').trim().length >= 8 &&
      String(row.stakeholder || '').trim().length >= 3 &&
      String(row.impactReduced || '').trim().length >= 5 &&
      String(row.impactCategory || '').trim()
    );
  }

  function computeScore() {
    var marks = 0;
    if (state.selectedRole && String(state.roleDecision || '').trim().length >= 8) marks += 1;
    var completeDecisions = state.decisions.filter(decisionComplete).length;
    if (completeDecisions >= 1) marks += 1;
    if (completeDecisions >= 2) marks += 1;
    if (state.facilitatedConfirmed && completeDecisions >= 2) marks += 1;
    return Math.min(data.total, marks);
  }

  function validate() {
    var messages = [];
    if (!state.selectedRole) messages.push('Select your allocated Northbank role.');
    if (String(state.roleDecision || '').trim().length < 8) {
      messages.push('State one decision your role may be responsible for.');
    }
    if (state.decisions.filter(decisionComplete).length < data.decisionRecord.minDecisions) {
      messages.push(
        'Record at least ' +
          data.decisionRecord.minDecisions +
          ' reasoned decisions before completing.'
      );
    }
    if (!state.facilitatedConfirmed) {
      messages.push(
        'Confirm that you used the tutor-facilitated exercise discussion. Opening the NCSC page alone is not enough.'
      );
    }
    return messages;
  }

  function field(parent, id, labelText, value, onInput, rows) {
    var wrap = document.createElement('div');
    wrap.className = 'w5-reflection-field';
    var label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    wrap.appendChild(label);
    var area = document.createElement('textarea');
    area.id = id;
    area.rows = rows || 3;
    area.value = value || '';
    area.addEventListener('input', function () {
      onInput(area.value);
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
      '<h2>Introduction to NCSC Exercise in a Box</h2>' +
      '<p><strong>' +
      data.ncsc.productName +
      '</strong> is produced by the ' +
      data.ncsc.producer +
      '. ' +
      data.ncsc.purpose +
      '</p>' +
      '<p>Named Week 5 exercise: <strong>' +
      data.ncsc.namedExercise +
      '</strong>.</p>' +
      '<ul class="section-list">' +
      data.ncsc.classroomRules
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('') +
      '</ul>' +
      '<p class="panel-note">' +
      data.decisionRecord.completionNote +
      '</p>' +
      '<div class="w5-actions">' +
      '<a class="btn btn-secondary" href="' +
      data.ncsc.overviewUrl +
      '" target="_blank" rel="noopener noreferrer">NCSC Exercise in a Box overview <span aria-hidden="true">↗</span></a>' +
      '<a class="btn btn-secondary" href="' +
      data.ncsc.exerciseUrl +
      '" target="_blank" rel="noopener noreferrer">NCSC ransomware exercise page <span aria-hidden="true">↗</span></a>' +
      '</div>';

    var roleHeading = document.createElement('h2');
    roleHeading.textContent = 'Northbank role workspace';
    panel.appendChild(roleHeading);

    data.roles.forEach(function (role) {
      var card = document.createElement('section');
      card.className = 'w5-review-item';
      card.setAttribute('aria-labelledby', 'role-' + role.id);
      var h = document.createElement('h3');
      h.id = 'role-' + role.id;
      h.textContent = role.title;
      card.appendChild(h);
      var p = document.createElement('p');
      p.textContent = role.responsibility;
      card.appendChild(p);
      var prompts = document.createElement('ul');
      prompts.className = 'section-list';
      role.prompts.forEach(function (prompt) {
        var li = document.createElement('li');
        li.textContent = prompt;
        prompts.appendChild(li);
      });
      card.appendChild(prompts);
      var selectLabel = document.createElement('label');
      selectLabel.className = 'w5-checkbox-label';
      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'w5-role';
      radio.value = role.id;
      radio.checked = state.selectedRole === role.id;
      radio.addEventListener('change', function () {
        state.selectedRole = role.id;
        save();
      });
      selectLabel.appendChild(radio);
      selectLabel.appendChild(document.createTextNode(' Select this role'));
      card.appendChild(selectLabel);
      panel.appendChild(card);
    });

    field(
      panel,
      'role-decision',
      'One decision your selected role may be responsible for',
      state.roleDecision,
      function (value) {
        state.roleDecision = value;
      },
      3
    );

    var decHeading = document.createElement('h2');
    decHeading.textContent = 'Ransomware decision record';
    panel.appendChild(decHeading);
    var intro = document.createElement('p');
    intro.className = 'panel-note';
    intro.textContent = data.decisionRecord.intro;
    panel.appendChild(intro);

    state.decisions.forEach(function (row, index) {
      var block = document.createElement('section');
      block.className = 'w5-review-item';
      block.innerHTML = '<h3>Decision ' + (index + 1) + '</h3>';
      data.decisionRecord.fields.forEach(function (meta) {
        if (meta.id === 'impactCategory') {
          var wrap = document.createElement('div');
          wrap.className = 'w5-reflection-field';
          var label = document.createElement('label');
          label.setAttribute('for', 'dec-' + index + '-' + meta.id);
          label.textContent = meta.label;
          wrap.appendChild(label);
          var select = document.createElement('select');
          select.id = 'dec-' + index + '-' + meta.id;
          var blank = document.createElement('option');
          blank.value = '';
          blank.textContent = 'Select…';
          select.appendChild(blank);
          data.impactOptions.forEach(function (opt) {
            var option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            if (row.impactCategory === opt) option.selected = true;
            select.appendChild(option);
          });
          select.addEventListener('change', function () {
            row.impactCategory = select.value;
            save();
          });
          wrap.appendChild(select);
          block.appendChild(wrap);
        } else {
          field(
            block,
            'dec-' + index + '-' + meta.id,
            meta.label,
            row[meta.id],
            function (value) {
              row[meta.id] = value;
            },
            meta.rows
          );
        }
      });
      panel.appendChild(block);
    });

    var confirm = document.createElement('label');
    confirm.className = 'w5-checkbox-label';
    var box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = !!state.facilitatedConfirmed;
    box.addEventListener('change', function () {
      state.facilitatedConfirmed = box.checked;
      save();
    });
    confirm.appendChild(box);
    confirm.appendChild(
      document.createTextNode(
        ' I confirm these decisions were recorded as part of the tutor-facilitated Exercise in a Box discussion (not merely by opening this page).'
      )
    );
    panel.appendChild(confirm);

    var actions = document.createElement('div');
    actions.className = 'w5-actions';
    var completeBtn = document.createElement('button');
    completeBtn.type = 'button';
    completeBtn.className = 'btn btn-primary';
    completeBtn.textContent = 'Complete companion workspace';
    completeBtn.addEventListener('click', function () {
      var messages = validate();
      var status = document.getElementById('w5-companion-status');
      if (!status) {
        status = document.createElement('div');
        status.id = 'w5-companion-status';
        status.className = 'status-messages';
        status.setAttribute('aria-live', 'polite');
        panel.appendChild(status);
      }
      status.textContent = '';
      if (messages.length) {
        messages.forEach(function (msg) {
          var p = document.createElement('p');
          p.className = 'message message-warning';
          p.textContent = msg;
          status.appendChild(p);
        });
        return;
      }
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total, { companion: true });
      status.innerHTML =
        '<p class="message message-success">Companion workspace completed (' +
        score +
        ' / ' +
        data.total +
        '). Continue to the debrief after the facilitated exercise.</p>';
      window.Unit3Week5Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w5-submit-host',
        getScore: function () {
          return score;
        },
        getTotal: function () {
          return data.total;
        },
        getReflection: function () {
          return JSON.stringify({
            role: state.selectedRole,
            decisions: state.decisions
          });
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        },
        canSubmit: function () {
          return true;
        }
      });
    });
    actions.appendChild(completeBtn);
    var debriefLink = document.createElement('a');
    debriefLink.className = 'btn btn-secondary';
    debriefLink.href = '../exercise-debrief/';
    debriefLink.textContent = 'Open exercise debrief';
    actions.appendChild(debriefLink);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
