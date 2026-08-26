(function () {
  'use strict';

  var ACTIVITY_ID = 'week2-vulnerabilities101-reflection';
  var TOTAL = 2;
  var DRAFT_KEY = 'vulnerabilities101';
  var progress = window.Unit3Week2Progress;
  var thm = window.Unit3Week2TryHackMe;
  var resource =
    thm && thm.getResourceByActivityId
      ? thm.getResourceByActivityId(ACTIVITY_ID)
      : null;
  var startedAt = new Date().toISOString();
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
      reflections.northbank =
        typeof draft.northbank === 'string' ? draft.northbank : '';
    }
  }

  if (thm && resource) {
    thm.trackResourceProgress(resource.resourceId, {
      instructionsViewed: true,
      statusLabel: 'Instructions viewed'
    });
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
    return Math.max(1, Math.round((Date.now() - Date.parse(startedAt)) / 1000));
  }

  function updateAppStateLabel() {
    var host = document.getElementById('w2-v101-app-state');
    if (!host || !thm || !resource) return;
    var state = thm.getResourceProgress(resource.resourceId) || {};
    var parts = [];
    if (state.instructionsViewed) parts.push('Instructions viewed');
    if (state.roomOpened) parts.push('Room opened');
    if (state.notesStarted) parts.push('Notes started');
    if (computeScore() === TOTAL) parts.push('Reflection complete');
    if (state.submissionRecorded) parts.push('Submission recorded');
    parts.push('TryHackMe completion checked by tutor');
    host.textContent = 'App state: ' + parts.join(' · ');
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
    updateAppStateLabel();
  }

  function maybeComplete() {
    var score = computeScore();
    if (score < TOTAL) {
      return;
    }
    if (progress) {
      progress.markCompleted(ACTIVITY_ID, score, TOTAL);
    }
    if (thm && resource) {
      thm.trackResourceProgress(resource.resourceId, {
        reflectionComplete: true,
        statusLabel: 'Reflection complete'
      });
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
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var pairs = [
            { id: 'W2V101-Q01', value: reflections.vulnerability },
            { id: 'W2V101-Q02', value: reflections.northbank }
          ];
          return pairs.map(function (pair) {
            var filled = Boolean(trim(pair.value));
            if (evidence && evidence.freeText) {
              return evidence.freeText(pair.id, pair.value, {
                correct: filled,
                score: filled ? 1 : 0
              });
            }
            return {
              questionId: pair.id,
              response: pair.value || '',
              responseType: 'text',
              correct: filled,
              score: filled ? 1 : 0
            };
          });
        },
        getStartedAt: function () {
          return new Date(startedAt).toISOString();
        },
        getCompletedAt: function () {
          return new Date().toISOString();
        },
        canSubmit: function () {
          return computeScore() === TOTAL;
        },
        onSubmitted: function () {
          if (thm && resource) {
            thm.trackResourceProgress(resource.resourceId, {
              submissionRecorded: true,
              statusLabel: 'Submission recorded'
            });
            updateAppStateLabel();
          }
        }
      });
    }
  }

  function renderGuidance() {
    if (!thm || !resource) return;

    var purpose = document.getElementById('w2-v101-purpose');
    if (purpose) purpose.textContent = resource.purpose;

    var meta = document.getElementById('w2-v101-meta');
    if (meta) {
      meta.textContent = '';
      [
        'Delivery: ' + resource.deliveryLabel,
        resource.timeLabel,
        'OCR: ' + resource.ocrFocus,
        'Access: ' + thm.availabilityLabel(resource.availabilityStatus),
        'Scored activity ID: ' + ACTIVITY_ID + ' (total ' + TOTAL + ')'
      ].forEach(function (text) {
        var li = document.createElement('li');
        li.textContent = text;
        meta.appendChild(li);
      });
    }

    var accessHost = document.getElementById('w2-v101-access-host');
    if (accessHost) thm.renderAccessNotice(accessHost);

    var central = document.getElementById('w2-v101-central-model');
    var data = window.Unit3Week2TryHackMeData;
    if (central && data) {
      central.textContent = data.centralModel;
    }

    thm.renderPreparationChecklist('w2-v101-checklist-host', resource.resourceId);
    thm.renderSafetyBanner(
      document.getElementById('w2-v101-safety-host'),
      resource.safetyNotices
    );

    var whileList = document.getElementById('w2-v101-while-list');
    if (whileList && resource.whileCompleting) {
      whileList.textContent = '';
      resource.whileCompleting.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        whileList.appendChild(li);
      });
    }

    var ocr = document.getElementById('w2-v101-ocr-guidance');
    if (ocr && resource.ocrGuidance) {
      ocr.innerHTML = '<strong>OCR guidance:</strong> ' + resource.ocrGuidance;
    }

    var actionsHost = document.getElementById('w2-v101-actions-host');
    if (actionsHost) {
      actionsHost.textContent = '';
      thm.renderResourceActions(actionsHost, resource, { pathBase: '../' });
    }

    thm.renderHowToUse('w2-thm-guide-host');
    thm.renderTroubleshooting('w2-thm-troubleshooting-host');
    thm.renderLessonNotes('w2-v101-notes-host', resource);
    updateAppStateLabel();
  }

  function render() {
    var host = document.getElementById('w2-reflection-host');
    if (!host) return;
    if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
      throw new Error('Unit3LearningText.createMounts is required for vulnerabilities101 fields');
    }
    if (!render._textFields) {
      render._textFields = window.Unit3LearningText.createMounts();
    }
    var textFields = render._textFields;
    textFields.destroyAll();
    host.textContent = '';

    var panel = document.createElement('section');
    panel.className = 'activity-panel';
    panel.setAttribute('aria-labelledby', 'reflection-heading');

    var heading = document.createElement('h2');
    heading.id = 'reflection-heading';
    heading.textContent = 'Scored reflection (2 marks)';
    panel.appendChild(heading);

    var note = document.createElement('p');
    note.className = 'panel-note';
    note.textContent =
      'These two prompts are the registered scored activity. Lesson notes above do not change the total of 2.';
    panel.appendChild(note);

    var status = document.createElement('div');
    status.id = 'w2-reflection-status';
    panel.appendChild(status);

    function addField(id, labelText, key, hint) {
      if (hint) {
        var hintP = document.createElement('p');
        hintP.className = 'panel-note';
        hintP.id = id + '-hint';
        hintP.textContent = hint;
        panel.appendChild(hintP);
      }
      textFields.mount(panel, {
        wrapClass: 'w2-reflection-field',
        id: id,
        prompt: labelText,
        minChars: 80,
        value: reflections[key],
        rows: 5,
        onChange: function (next) {
          reflections[key] = next;
          saveDraft();
          updateStatus(host);
          if (computeScore() === TOTAL) {
            maybeComplete();
          } else if (progress) {
            progress.markStarted(ACTIVITY_ID);
          }
        }
      });
    }

    addField(
      'reflection-vulnerability',
      'Reflection 1: Describe one vulnerability you explored in the TryHackMe room.',
      'vulnerability',
      'Name the vulnerability type, how it could be exploited, and which CIA aim(s) may be affected. Do not paste TryHackMe answer strings or flags.'
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

  renderGuidance();
  render();

  document.addEventListener(
    'input',
    function (event) {
      if (!event.target || !event.target.closest || !event.target.closest('#w2-v101-notes-host')) {
        return;
      }
      updateAppStateLabel();
    },
    true
  );
})();
