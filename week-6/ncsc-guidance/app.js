(function () {
  'use strict';

  var data = window.Week6NcscGuidance;
  var progress = window.Unit3Week6Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'ncsc-guidance';
  var host = document.getElementById('w6-activity-host');
  var startedAt = Date.now();
  var checked = {};

  data.checklist.forEach(function (item) {
    checked[item.id] = false;
  });

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      checked = Object.assign(checked, draft.checked || {});
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        checked: checked,
        savedAt: new Date().toISOString()
      });
    }
  }

  function computeScore() {
    return data.checklist.reduce(function (sum, item) {
      return sum + (checked[item.id] ? 1 : 0);
    }, 0);
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>NCSC Exercise in a Box guidance</h2>' +
      '<p><strong>Organisation:</strong> ' +
      data.organisation +
      '</p>' +
      '<p><strong>Exercise:</strong> <em>' +
      data.exerciseTitle +
      '</em></p>' +
      '<p class="panel-note">' +
      data.intro +
      '</p>' +
      '<p class="w6-callout" role="note">' +
      data.completionNote +
      '</p>';

    var list = document.createElement('ul');
    list.className = 'section-list';
    data.guidanceSections.forEach(function (section) {
      var li = document.createElement('li');
      li.innerHTML = '<strong>' + section.title + ':</strong> ' + section.text;
      list.appendChild(li);
    });
    panel.appendChild(list);

    var linkWrap = document.createElement('p');
    linkWrap.className = 'w6-actions';
    var link = document.createElement('a');
    link.className = 'btn btn-secondary w6-thm-external-link';
    link.href = data.ncscOverviewUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Open NCSC Exercise in a Box overview (opens in a new tab)';
    var icon = document.createElement('span');
    icon.className = 'w6-external-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = ' ↗';
    link.appendChild(icon);
    linkWrap.appendChild(link);
    panel.appendChild(linkWrap);

    var checklistHeading = document.createElement('h3');
    checklistHeading.textContent = 'Facilitated exercise checklist';
    panel.appendChild(checklistHeading);

    var checklist = document.createElement('ul');
    checklist.className = 'w6-ncsc-checklist';
    data.checklist.forEach(function (item) {
      var li = document.createElement('li');
      var label = document.createElement('label');
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.id = 'check-' + item.id;
      input.checked = Boolean(checked[item.id]);
      input.addEventListener('change', function () {
        checked[item.id] = input.checked;
        save();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + item.label));
      li.appendChild(label);
      checklist.appendChild(li);
    });
    panel.appendChild(checklist);

    var actions = document.createElement('div');
    actions.className = 'w6-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary';
    btn.textContent = 'Save checklist progress';
    btn.addEventListener('click', function () {
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
      var status = document.createElement('p');
      status.className = 'message message-' + (score === data.total ? 'success' : 'info');
      status.setAttribute('aria-live', 'polite');
      status.textContent =
        'Checklist saved: ' +
        score +
        ' / ' +
        data.total +
        '. Continue to the Exercise Decision Record during or after the facilitated session.';
      panel.appendChild(status);
      window.Unit3Week6Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w6-submit-host',
        getScore: function () {
          return score;
        },
        getTotal: function () {
          return data.total;
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        },
        canSubmit: function () {
          return score === data.total;
        }
      });
    });
    actions.appendChild(btn);
    var companion = document.createElement('a');
    companion.className = 'btn btn-secondary';
    companion.href = '../exercise-decision-record/';
    companion.textContent = 'Open Exercise Decision Record';
    actions.appendChild(companion);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
