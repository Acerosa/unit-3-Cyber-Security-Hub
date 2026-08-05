/**
 * Shared TryHackMe guidance helpers for Week 2.
 * Renders guide panels, external links, checklists, notes and availability UI.
 */

(function (global) {
  'use strict';

  var data = global.Unit3Week2TryHackMeData || null;
  var progress = global.Unit3Week2Progress || null;

  function getData() {
    return data || global.Unit3Week2TryHackMeData || null;
  }

  function getResource(resourceId) {
    var pack = getData();
    if (!pack) return null;
    for (var i = 0; i < pack.resources.length; i++) {
      if (pack.resources[i].resourceId === resourceId) {
        return pack.resources[i];
      }
    }
    return null;
  }

  function getResourceByActivityId(activityId) {
    var pack = getData();
    if (!pack) return null;
    for (var i = 0; i < pack.resources.length; i++) {
      if (pack.resources[i].linkedActivityId === activityId) {
        return pack.resources[i];
      }
    }
    return null;
  }

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      /* localStorage may be unavailable */
    }
  }

  function trackExtra(activityId, patch) {
    if (!progress || !activityId) return;
    var state = progress.getActivityState(activityId) || {};
    var extra = Object.assign({}, state.extra || {}, patch || {});
    progress.updateActivity(activityId, { extra: extra });
  }

  function trackResourceOpened(resource) {
    if (!resource) return;
    writeJson(resource.resourceId + '-opened', {
      openedAt: new Date().toISOString(),
      url: resource.url
    });
    if (resource.linkedActivityId) {
      trackExtra(resource.linkedActivityId, {
        roomOpened: true,
        roomOpenedAt: new Date().toISOString()
      });
      if (progress) progress.markStarted(resource.linkedActivityId);
    }
  }

  function createExternalLink(href, label) {
    var a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'btn btn-primary w2-thm-external-link';
    a.textContent = label + ' (opens in a new tab)';
    var icon = document.createElement('span');
    icon.className = 'w2-external-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = ' ↗';
    a.appendChild(icon);
    return a;
  }

  function availabilityLabel(status) {
    if (status === 'available') return 'Access confirmed by tutor';
    if (status === 'unavailable') return 'Currently unavailable';
    return 'Tutor check required';
  }

  function renderAccessNotice(host) {
    if (!host) return;
    var pack = getData();
    if (!pack) return;
    var note = document.createElement('p');
    note.className = 'w2-callout w2-thm-access-notice';
    note.setAttribute('role', 'note');
    note.innerHTML = '<strong>Access:</strong> ' + pack.accessNotice;
    host.appendChild(note);
  }

  function renderSafetyBanner(host, notices) {
    if (!host || !notices || !notices.length) return;
    var banner = document.createElement('div');
    banner.className = 'w2-thm-safety';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Safety notice');
    var heading = document.createElement('h3');
    heading.textContent = 'Safety notice';
    banner.appendChild(heading);
    notices.forEach(function (text) {
      var p = document.createElement('p');
      p.textContent = text;
      banner.appendChild(p);
    });
    host.appendChild(banner);
  }

  function renderHowToUse(hostId) {
    var host = typeof hostId === 'string' ? document.getElementById(hostId) : hostId;
    var pack = getData();
    if (!host || !pack) return;

    host.textContent = '';
    var details = document.createElement('details');
    details.className = 'session-disclosure panel';
    details.id = 'w2-thm-how-to-use';

    var summary = document.createElement('summary');
    summary.className = 'session-disclosure__summary';
    summary.innerHTML =
      '<span class="session-disclosure__text">' +
      '<h2 class="session-disclosure__heading">How to use TryHackMe</h2>' +
      '<span class="session-disclosure__meta">Learner guide</span>' +
      '<span class="visually-hidden">. Show or hide the TryHackMe guide</span>' +
      '</span><span class="session-disclosure__icon" aria-hidden="true"></span>';
    details.appendChild(summary);

    var content = document.createElement('div');
    content.className = 'session-disclosure__content';

    var list = document.createElement('ol');
    list.className = 'section-list w2-thm-steps';
    pack.howToUseSteps.forEach(function (step) {
      var li = document.createElement('li');
      var h = document.createElement('strong');
      h.textContent = step.title;
      li.appendChild(h);
      var p = document.createElement('p');
      p.textContent = step.body;
      li.appendChild(p);
      list.appendChild(li);
    });
    content.appendChild(list);
    details.appendChild(content);
    host.appendChild(details);
  }

  function renderTroubleshooting(hostId) {
    var host = typeof hostId === 'string' ? document.getElementById(hostId) : hostId;
    var pack = getData();
    if (!host || !pack) return;
    host.textContent = '';

    var details = document.createElement('details');
    details.className = 'session-disclosure panel';
    details.id = 'w2-thm-troubleshooting';

    var summary = document.createElement('summary');
    summary.className = 'session-disclosure__summary';
    summary.innerHTML =
      '<span class="session-disclosure__text">' +
      '<h2 class="session-disclosure__heading">TryHackMe troubleshooting</h2>' +
      '<span class="session-disclosure__meta">Common issues</span>' +
      '<span class="visually-hidden">. Show or hide troubleshooting guidance</span>' +
      '</span><span class="session-disclosure__icon" aria-hidden="true"></span>';
    details.appendChild(summary);

    var content = document.createElement('div');
    content.className = 'session-disclosure__content';
    pack.troubleshooting.forEach(function (item) {
      var block = document.createElement('div');
      block.className = 'w2-thm-trouble-item';
      var h = document.createElement('h3');
      h.textContent = item.title;
      block.appendChild(h);
      var p = document.createElement('p');
      p.textContent = item.body;
      block.appendChild(p);
      content.appendChild(block);
    });
    details.appendChild(content);
    host.appendChild(details);
  }

  function renderTutorNotes(hostId) {
    var host = typeof hostId === 'string' ? document.getElementById(hostId) : hostId;
    var pack = getData();
    if (!host || !pack) return;
    host.textContent = '';

    var details = document.createElement('details');
    details.className = 'session-disclosure panel';
    details.id = 'w2-thm-tutor-notes';

    var summary = document.createElement('summary');
    summary.className = 'session-disclosure__summary';
    summary.innerHTML =
      '<span class="session-disclosure__text">' +
      '<h2 class="session-disclosure__heading">Tutor notes</h2>' +
      '<span class="session-disclosure__meta">Staff checklist</span>' +
      '<span class="visually-hidden">. Show or hide tutor notes</span>' +
      '</span><span class="session-disclosure__icon" aria-hidden="true"></span>';
    details.appendChild(summary);

    var content = document.createElement('div');
    content.className = 'session-disclosure__content';
    var p = document.createElement('p');
    p.className = 'panel-note';
    p.textContent =
      'These notes are for tutors. Do not publish classroom codes or private class-management details in this application.';
    content.appendChild(p);
    var ul = document.createElement('ul');
    ul.className = 'section-list';
    pack.tutorNotes.forEach(function (note) {
      var li = document.createElement('li');
      li.textContent = note;
      ul.appendChild(li);
    });
    content.appendChild(ul);
    details.appendChild(content);
    host.appendChild(details);
  }

  function renderPreparationChecklist(hostId, resourceId) {
    var host = typeof hostId === 'string' ? document.getElementById(hostId) : hostId;
    var pack = getData();
    if (!host || !pack) return;
    host.textContent = '';

    var storageKey = pack.checklistStorageKey + (resourceId ? ':' + resourceId : '');
    var saved = readJson(storageKey, {}) || {};

    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.setAttribute('aria-labelledby', 'w2-thm-checklist-heading');

    var heading = document.createElement('h2');
    heading.id = 'w2-thm-checklist-heading';
    heading.textContent = 'TryHackMe preparation checklist';
    panel.appendChild(heading);

    var status = document.createElement('p');
    status.className = 'panel-note';
    status.id = 'w2-thm-checklist-status';
    status.setAttribute('aria-live', 'polite');
    panel.appendChild(status);

    var list = document.createElement('ul');
    list.className = 'w2-thm-checklist';
    pack.preparationChecklist.forEach(function (item) {
      var li = document.createElement('li');
      var label = document.createElement('label');
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.id = 'w2-thm-check-' + item.id;
      input.checked = saved[item.id] === true;
      input.addEventListener('change', function () {
        saved[item.id] = input.checked;
        writeJson(storageKey, saved);
        updateChecklistStatus();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + item.label));
      li.appendChild(label);
      list.appendChild(li);
    });
    panel.appendChild(list);

    function updateChecklistStatus() {
      var remaining = pack.preparationChecklist.filter(function (item) {
        return saved[item.id] !== true;
      }).length;
      status.textContent =
        remaining === 0
          ? 'All preparation steps marked. You may still ask the tutor for help if needed.'
          : remaining +
            ' preparation step' +
            (remaining === 1 ? '' : 's') +
            ' still incomplete. You can still open the room if your tutor asks you to continue.';
    }

    updateChecklistStatus();
    host.appendChild(panel);
  }

  function withPathBase(path, pathBase) {
    if (!path) return path;
    if (path.charAt(0) === '#' || /^https?:\/\//i.test(path)) return path;
    return (pathBase || '') + path;
  }

  function trackResourceProgress(resourceId, patch) {
    if (!resourceId) return;
    var pack = getData();
    var key = (pack && pack.progressStorageKey) || 'unit3-week2-tryhackme-progress';
    var all = readJson(key, {}) || {};
    all[resourceId] = Object.assign({}, all[resourceId] || {}, patch || {}, {
      updatedAt: new Date().toISOString()
    });
    writeJson(key, all);
  }

  function getResourceProgress(resourceId) {
    var pack = getData();
    var key = (pack && pack.progressStorageKey) || 'unit3-week2-tryhackme-progress';
    var all = readJson(key, {}) || {};
    return all[resourceId] || {};
  }

  function renderResourceActions(host, resource, options) {
    if (!host || !resource) return;
    var opts = options || {};
    var pathBase = opts.pathBase || '';
    var actions = document.createElement('div');
    actions.className = 'w2-actions w2-thm-actions';

    var instructions = document.createElement('a');
    instructions.className = 'btn btn-secondary';
    if (resource.path) {
      instructions.href = withPathBase(resource.path, pathBase);
      instructions.textContent = 'View instructions';
    } else {
      instructions.href = '#w2-thm-how-to-use';
      instructions.textContent = 'View instructions';
    }
    actions.appendChild(instructions);

    if (resource.availabilityStatus === 'unavailable') {
      var disabled = document.createElement('button');
      disabled.type = 'button';
      disabled.className = 'btn btn-primary';
      disabled.disabled = true;
      disabled.setAttribute('aria-disabled', 'true');
      disabled.textContent = 'TryHackMe room unavailable';
      actions.appendChild(disabled);

      var fallback = document.createElement('p');
      fallback.className = 'w2-callout';
      fallback.setAttribute('role', 'status');
      var fallbackLink = document.createElement('a');
      fallbackLink.href = withPathBase(resource.fallbackPath, pathBase);
      fallbackLink.textContent = 'open fallback activity';
      fallback.appendChild(
        document.createTextNode(
          'This room is currently unavailable. Use the in-app fallback: '
        )
      );
      fallback.appendChild(fallbackLink);
      fallback.appendChild(document.createTextNode('.'));
      host.appendChild(fallback);
    } else {
      var open = createExternalLink(resource.url, 'Open TryHackMe room');
      open.addEventListener('click', function () {
        trackResourceOpened(resource);
        trackResourceProgress(resource.resourceId, {
          roomOpened: true,
          statusLabel: 'Room opened'
        });
      });
      actions.appendChild(open);
    }

    var status = document.createElement('p');
    status.className = 'panel-note w2-thm-progress-label';
    status.setAttribute('aria-live', 'polite');
    var progressState = getResourceProgress(resource.resourceId);
    status.textContent =
      'App state: ' +
      (progressState.statusLabel ||
        (resource.availabilityStatus === 'unavailable'
          ? 'Fallback required'
          : 'Not started in this browser'));
    host.appendChild(actions);
    host.appendChild(status);
  }

  function renderLessonNotes(hostId, resource) {
    var host = typeof hostId === 'string' ? document.getElementById(hostId) : hostId;
    if (!host || !resource || !resource.notePrompts) return;
    host.textContent = '';

    var saved = readJson(resource.notesStorageKey, { answers: [] }) || { answers: [] };
    if (!Array.isArray(saved.answers)) saved.answers = [];

    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.setAttribute('aria-labelledby', 'w2-thm-notes-heading');

    var heading = document.createElement('h2');
    heading.id = 'w2-thm-notes-heading';
    heading.textContent = 'Lesson notes';
    panel.appendChild(heading);

    var note = document.createElement('p');
    note.className = 'panel-note';
    note.textContent =
      'These notes are for learning only. They are stored in this browser, do not change the activity total, and are not TryHackMe answer strings.';
    panel.appendChild(note);

    var status = document.createElement('p');
    status.className = 'panel-note';
    status.setAttribute('aria-live', 'polite');
    panel.appendChild(status);

    resource.notePrompts.forEach(function (prompt, index) {
      var wrap = document.createElement('div');
      wrap.className = 'w2-reflection-field';
      var id = 'w2-thm-note-' + index;
      var label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = index + 1 + '. ' + prompt;
      wrap.appendChild(label);
      var textarea = document.createElement('textarea');
      textarea.id = id;
      textarea.rows = 3;
      textarea.value = typeof saved.answers[index] === 'string' ? saved.answers[index] : '';
      textarea.addEventListener('input', function () {
        saved.answers[index] = textarea.value;
        saved.updatedAt = new Date().toISOString();
        writeJson(resource.notesStorageKey, saved);
        status.textContent = 'Lesson notes saved in this browser.';
        trackResourceProgress(resource.resourceId, {
          notesStarted: true,
          statusLabel: 'Notes started'
        });
        if (resource.linkedActivityId) {
          trackExtra(resource.linkedActivityId, { notesStarted: true });
        }
      });
      wrap.appendChild(textarea);
      panel.appendChild(wrap);
    });

    var actions = document.createElement('div');
    actions.className = 'w2-actions';
    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-secondary';
    copyBtn.textContent = 'Copy notes';
    copyBtn.addEventListener('click', function () {
      var text = resource.notePrompts
        .map(function (prompt, index) {
          return (
            index +
            1 +
            '. ' +
            prompt +
            '\n' +
            (saved.answers[index] || '')
          );
        })
        .join('\n\n');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          status.textContent = 'Lesson notes copied.';
        });
      } else {
        status.textContent = 'Copy is not available in this browser. Select the text manually.';
      }
    });
    actions.appendChild(copyBtn);

    var printBtn = document.createElement('button');
    printBtn.type = 'button';
    printBtn.className = 'btn btn-secondary';
    printBtn.textContent = 'Print notes';
    printBtn.addEventListener('click', function () {
      global.print();
    });
    actions.appendChild(printBtn);
    panel.appendChild(actions);

    host.appendChild(panel);
  }

  function emptyTableRows(count) {
    var rows = [];
    for (var i = 0; i < count; i++) {
      rows.push({ malware: '', behaviour: '', delivery: '', symptom: '' });
    }
    return rows;
  }

  function renderMalwareTable(hostId, resource) {
    var host = typeof hostId === 'string' ? document.getElementById(hostId) : hostId;
    if (!host || !resource) return;
    host.textContent = '';

    var saved = readJson(resource.notesStorageKey, null);
    if (!saved || !Array.isArray(saved.rows)) {
      saved = { rows: emptyTableRows(resource.tableRowCount || 4) };
    }

    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.setAttribute('aria-labelledby', 'w2-thm-table-heading');

    var heading = document.createElement('h2');
    heading.id = 'w2-thm-table-heading';
    heading.textContent = 'Directed-study malware notes';
    panel.appendChild(heading);

    var note = document.createElement('p');
    note.className = 'panel-note';
    note.textContent =
      'Non-scored directed study. TryHackMe’s own completion record is the main evidence. Do not store TryHackMe flags or walkthrough answers here.';
    panel.appendChild(note);

    var status = document.createElement('p');
    status.className = 'panel-note';
    status.setAttribute('aria-live', 'polite');
    panel.appendChild(status);

    var wrap = document.createElement('div');
    wrap.className = 'w2-thm-table-wrap';
    var table = document.createElement('table');
    table.className = 'w2-thm-table';
    var thead = document.createElement('thead');
    var headRow = document.createElement('tr');
    (resource.tableColumns || []).forEach(function (col) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.textContent = col;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    var fields = ['malware', 'behaviour', 'delivery', 'symptom'];
    saved.rows.forEach(function (row, rowIndex) {
      var tr = document.createElement('tr');
      fields.forEach(function (field, fieldIndex) {
        var td = document.createElement('td');
        var input = document.createElement('input');
        input.type = 'text';
        input.value = row[field] || '';
        input.setAttribute(
          'aria-label',
          (resource.tableColumns[fieldIndex] || field) + ' for row ' + (rowIndex + 1)
        );
        input.addEventListener('input', function () {
          saved.rows[rowIndex][field] = input.value;
          saved.updatedAt = new Date().toISOString();
          writeJson(resource.notesStorageKey, saved);
          status.textContent = 'Directed-study notes saved in this browser.';
        });
        td.appendChild(input);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    panel.appendChild(wrap);

    var actions = document.createElement('div');
    actions.className = 'w2-actions';

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-secondary';
    copyBtn.textContent = 'Copy table';
    copyBtn.addEventListener('click', function () {
      var lines = [resource.tableColumns.join('\t')];
      saved.rows.forEach(function (row) {
        lines.push(
          [row.malware, row.behaviour, row.delivery, row.symptom].join('\t')
        );
      });
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lines.join('\n')).then(function () {
          status.textContent = 'Table copied.';
        });
      }
    });
    actions.appendChild(copyBtn);

    var printBtn = document.createElement('button');
    printBtn.type = 'button';
    printBtn.className = 'btn btn-secondary';
    printBtn.textContent = 'Print table';
    printBtn.addEventListener('click', function () {
      global.print();
    });
    actions.appendChild(printBtn);

    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-secondary';
    resetBtn.textContent = 'Reset table';
    resetBtn.addEventListener('click', function () {
      if (
        !global.confirm(
          'Reset the malware notes table? This cannot be undone.'
        )
      ) {
        return;
      }
      saved = { rows: emptyTableRows(resource.tableRowCount || 4) };
      writeJson(resource.notesStorageKey, saved);
      renderMalwareTable(host, resource);
    });
    actions.appendChild(resetBtn);

    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderResourceCard(resource, options) {
    var opts = options || {};
    var article = document.createElement('article');
    article.className = 'hub-card w2-thm-card';
    article.setAttribute(
      'aria-labelledby',
      'w2-thm-' + resource.roomId + '-heading'
    );

    var platform = document.createElement('p');
    platform.className = 'w2-thm-platform';
    platform.textContent = 'TryHackMe';
    article.appendChild(platform);

    var badge = document.createElement('span');
    badge.className =
      'status-label ' +
      (resource.deliveryMode === 'in-class'
        ? 'status-label-progress'
        : 'status-label-idle');
    badge.setAttribute('role', 'status');
    badge.textContent = resource.deliveryLabel;
    article.appendChild(badge);

    var heading = document.createElement('h3');
    heading.id = 'w2-thm-' + resource.roomId + '-heading';
    heading.textContent = resource.shortTitle;
    article.appendChild(heading);

    var purpose = document.createElement('p');
    purpose.textContent = resource.purpose;
    article.appendChild(purpose);

    var meta = document.createElement('ul');
    meta.className = 'activity-meta';
    [
      resource.timeLabel,
      'OCR: ' + resource.ocrFocus,
      'Access: ' + availabilityLabel(resource.availabilityStatus)
    ].forEach(function (text) {
      var li = document.createElement('li');
      li.textContent = text;
      meta.appendChild(li);
    });
    article.appendChild(meta);

    var actionsHost = document.createElement('div');
    renderResourceActions(actionsHost, resource, opts);
    article.appendChild(actionsHost);

    return article;
  }

  function renderLandingCards(hostId, options) {
    var host = document.getElementById(hostId);
    var pack = getData();
    if (!host || !pack) return;
    host.textContent = '';
    pack.resources.forEach(function (resource) {
      host.appendChild(renderResourceCard(resource, options));
    });
  }

  function renderLandingSection() {
    var accessHost = document.getElementById('w2-thm-access-host');
    if (accessHost) renderAccessNotice(accessHost);
    renderLandingCards('w2-thm-cards');
    renderHowToUse('w2-thm-guide-host');
    renderTroubleshooting('w2-thm-troubleshooting-host');
    renderTutorNotes('w2-thm-tutor-host');
  }

  global.Unit3Week2TryHackMe = {
    getResource: getResource,
    getResourceByActivityId: getResourceByActivityId,
    createExternalLink: createExternalLink,
    renderAccessNotice: renderAccessNotice,
    renderSafetyBanner: renderSafetyBanner,
    renderHowToUse: renderHowToUse,
    renderTroubleshooting: renderTroubleshooting,
    renderTutorNotes: renderTutorNotes,
    renderPreparationChecklist: renderPreparationChecklist,
    renderLessonNotes: renderLessonNotes,
    renderMalwareTable: renderMalwareTable,
    renderLandingCards: renderLandingCards,
    renderLandingSection: renderLandingSection,
    renderResourceActions: renderResourceActions,
    trackResourceOpened: trackResourceOpened,
    trackResourceProgress: trackResourceProgress,
    getResourceProgress: getResourceProgress,
    availabilityLabel: availabilityLabel
  };
})(window);
