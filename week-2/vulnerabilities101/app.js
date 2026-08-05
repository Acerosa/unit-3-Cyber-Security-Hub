(function () {
  'use strict';

  var ACTIVITY_ID = 'week2-vulnerabilities101-reflection';
  var TOTAL = 2;
  var DRAFT_KEY = 'vulnerabilities101';
  var progress = window.Unit3Week2Progress;
  var startedAt = Date.now();
  var submitShown = false;

  var reflections = {
    vulnerability: '',
    northbank: ''
  };

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && typeof draft === 'object') {
      reflections.vulnerability =
        typeof draft.vulnerability === 'string' ? draft.vulnerability : '';
      reflections.northbank = typeof draft.northbank === 'string' ? draft.northbank : '';
    }
  }

  function trim(value) {
    return (value || '').trim();
  }

  function computeScore() {
    var score = 0;
    if (trim(reflections.vulnerability)) score += 1;
    if (trim(reflections.northbank)) score += 1;
    return score;
  }

  function saveDraft() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        vulnerability: reflections.vulnerability,
        northbank: reflections.northbank,
        savedAt: new Date().toISOString()
      });
    }
  }

  function getReflectionSummary() {
    var parts = [];
    if (trim(reflections.vulnerability)) {
      parts.push(
        'Vulnerability from TryHackMe: ' + trim(reflections.vulnerability).slice(0, 500)
      );
    }
    if (trim(reflections.northbank)) {
      parts.push(
        'Northbank application: ' + trim(reflections.northbank).slice(0, 500)
      );
    }
    return parts.join(' | ');
  }

  function getCompletionTimeSeconds() {
    return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
  }

  function updateStatus(host) {
    var status = host.querySelector('#w2-reflection-status');
    if (!status) return;
    status.textContent = '';
    var score = computeScore();
    var p = document.createElement('p');
    p.className = 'panel-note';
    p.setAttribute('aria-live', 'polite');
    p.textContent =
      'Progress: ' +
      score +
      ' of ' +
      TOTAL +
      ' reflections completed. Draft saved in this browser.';
    status.appendChild(p);
  }

  function maybeComplete() {
    var score = computeScore();
    if (score < TOTAL) {
      return;
    }
    if (progress) {
      progress.markCompleted(ACTIVITY_ID, score, TOTAL);
    }
    if (!submitShown && window.Unit3Week2Submit) {
      submitShown = true;
      window.Unit3Week2Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        getScore: function () {
          return computeScore();
        },
        getTotal: function () {
          return TOTAL;
        },
        getReflection: getReflectionSummary,
        getCompletionTimeSeconds: getCompletionTimeSeconds,
        canSubmit: function () {
          return computeScore() === TOTAL;
        }
      });
    }
  }

  function render() {
    var host = document.getElementById('w2-reflection-host');
    if (!host) return;
    host.textContent = '';

    var panel = document.createElement('section');
    panel.className = 'activity-panel';
    panel.setAttribute('aria-labelledby', 'reflection-heading');

    var heading = document.createElement('h2');
    heading.id = 'reflection-heading';
    heading.textContent = 'Reflection';
    panel.appendChild(heading);

    var status = document.createElement('div');
    status.id = 'w2-reflection-status';
    panel.appendChild(status);

    function addField(id, labelText, key, hint) {
      var wrap = document.createElement('div');
      wrap.className = 'w2-reflection-field';

      var label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = labelText;
      wrap.appendChild(label);

      if (hint) {
        var hintP = document.createElement('p');
        hintP.className = 'panel-note';
        hintP.id = id + '-hint';
        hintP.textContent = hint;
        wrap.appendChild(hintP);
      }

      var textarea = document.createElement('textarea');
      textarea.id = id;
      textarea.rows = 5;
      textarea.value = reflections[key];
      textarea.setAttribute('aria-describedby', hint ? id + '-hint' : undefined);
      textarea.addEventListener('input', function () {
        reflections[key] = textarea.value;
        saveDraft();
        updateStatus(host);
        if (computeScore() === TOTAL) {
          maybeComplete();
        } else if (progress) {
          progress.markStarted(ACTIVITY_ID);
        }
      });
      wrap.appendChild(textarea);
      panel.appendChild(wrap);
    }

    addField(
      'reflection-vulnerability',
      'Reflection 1: Describe one vulnerability you explored in the TryHackMe room.',
      'vulnerability',
      'Name the vulnerability type, how it could be exploited, and which CIA aim(s) may be affected.'
    );

    addField(
      'reflection-northbank',
      'Reflection 2: How could a similar vulnerability apply at Northbank?',
      'northbank',
      'Use a specific Northbank scenario (for example patient records, reception PCs or remote access).'
    );

    var actions = document.createElement('div');
    actions.className = 'w2-actions';

    var completeBtn = document.createElement('button');
    completeBtn.type = 'button';
    completeBtn.className = 'btn btn-primary';
    completeBtn.textContent = 'Mark complete and show submit';
    completeBtn.addEventListener('click', function () {
      saveDraft();
      var score = computeScore();
      if (score < TOTAL) {
        var warn = host.querySelector('#w2-reflection-warn');
        if (!warn) {
          warn = document.createElement('div');
          warn.id = 'w2-reflection-warn';
          warn.className = 'status-messages';
          warn.setAttribute('aria-live', 'assertive');
          panel.insertBefore(warn, actions);
        }
        warn.textContent = '';
        var msg = document.createElement('p');
        msg.className = 'message message-warning';
        msg.textContent = 'Complete both reflection fields before marking complete.';
        warn.appendChild(msg);
        return;
      }
      maybeComplete();
      updateStatus(host);
    });
    actions.appendChild(completeBtn);

    panel.appendChild(actions);
    host.appendChild(panel);
    updateStatus(host);

    if (computeScore() === TOTAL) {
      maybeComplete();
    }
  }

  render();
})();
