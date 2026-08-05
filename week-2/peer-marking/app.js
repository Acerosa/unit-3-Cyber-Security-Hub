(function () {
  'use strict';

  var data = window.Week2PeerMarking;
  var progress = window.Unit3Week2Progress;

  if (!data) {
    return;
  }

  var startedAt = Date.now();
  var phase = 'read-answer';
  var markSchemeRevealed = false;
  var checklistState = {};
  var awardedMarks = null;
  var strength = '';
  var improvement = '';
  var improvedAnswer = '';
  var workflowComplete = false;

  data.checklist.forEach(function (item) {
    checklistState[item.id] = false;
  });

  if (progress) {
    progress.markStarted(data.activityId);
    var saved = progress.getDraft(data.peerDraftKey);
    if (saved && typeof saved === 'object') {
      markSchemeRevealed = Boolean(saved.markSchemeRevealed);
      awardedMarks = typeof saved.awardedMarks === 'number' ? saved.awardedMarks : null;
      strength = saved.strength || '';
      improvement = saved.improvement || '';
      improvedAnswer = saved.improvedAnswer || '';
      workflowComplete = Boolean(saved.workflowComplete);
      if (saved.checklist && typeof saved.checklist === 'object') {
        data.checklist.forEach(function (item) {
          checklistState[item.id] = Boolean(saved.checklist[item.id]);
        });
      }
      if (markSchemeRevealed) {
        phase = saved.phase || 'marking';
      }
    }
  }

  function originalAnswer() {
    if (!progress) return '';
    var draft = progress.getDraft(data.extendedDraftKey);
    return typeof draft === 'string' ? draft : '';
  }

  function checklistCompletedCount() {
    var count = 0;
    data.checklist.forEach(function (item) {
      if (checklistState[item.id]) count += 1;
    });
    return count;
  }

  function savePeerDraft() {
    if (!progress) return;
    progress.setDraft(data.peerDraftKey, {
      markSchemeRevealed: markSchemeRevealed,
      phase: phase,
      checklist: Object.assign({}, checklistState),
      awardedMarks: awardedMarks,
      strength: strength,
      improvement: improvement,
      improvedAnswer: improvedAnswer,
      workflowComplete: workflowComplete
    });
  }

  function canProceedToSubmit() {
    return (
      workflowComplete &&
      awardedMarks != null &&
      strength.trim().length >= 10 &&
      improvement.trim().length >= 10 &&
      improvedAnswer.trim().length >= 20
    );
  }

  function render() {
    var host = document.getElementById('w2-peer-host');
    if (!host) return;
    host.textContent = '';

    var original = originalAnswer();

    if (!original.trim()) {
      var missing = document.createElement('section');
      missing.className = 'panel';
      var missingHeading = document.createElement('h2');
      missingHeading.textContent = 'No saved response found';
      missing.appendChild(missingHeading);
      var missingP = document.createElement('p');
      missingP.textContent =
        'Complete the six-mark question in OCR-Style Question Practice first. Your response will be saved automatically.';
      missing.appendChild(missingP);
      var linkP = document.createElement('p');
      var link = document.createElement('a');
      link.href = data.ocrPracticePath;
      link.className = 'btn btn-primary';
      link.textContent = 'Go to OCR practice';
      linkP.appendChild(link);
      missing.appendChild(linkP);
      host.appendChild(missing);
      return;
    }

    var qSection = document.createElement('section');
    qSection.className = 'panel';
    qSection.setAttribute('aria-labelledby', 'peer-q-heading');
    var qHeading = document.createElement('h2');
    qHeading.id = 'peer-q-heading';
    qHeading.textContent = 'Question (' + data.question.marks + ' marks)';
    qSection.appendChild(qHeading);
    var qMeta = document.createElement('p');
    qMeta.className = 'panel-note';
    qMeta.textContent = 'Command word: ' + data.question.commandWord;
    qSection.appendChild(qMeta);
    var qText = document.createElement('p');
    qText.className = 'w2-scenario';
    qText.textContent = data.question.text;
    qSection.appendChild(qText);
    host.appendChild(qSection);

    var origSection = document.createElement('section');
    origSection.className = 'panel';
    origSection.setAttribute('aria-labelledby', 'orig-heading');
    var origHeading = document.createElement('h2');
    origHeading.id = 'orig-heading';
    origHeading.textContent = 'Your original answer';
    origSection.appendChild(origHeading);
    var origBlock = document.createElement('div');
    origBlock.className = 'w2-callout';
    origBlock.textContent = original;
    origSection.appendChild(origBlock);

    if (phase === 'read-answer') {
      var readNote = document.createElement('p');
      readNote.className = 'panel-note';
      readNote.textContent =
        'Read your answer carefully before revealing the mark scheme.';
      origSection.appendChild(readNote);
      var revealBtn = document.createElement('button');
      revealBtn.type = 'button';
      revealBtn.className = 'btn btn-primary';
      revealBtn.textContent = 'I have finished reading my answer';
      revealBtn.addEventListener('click', function () {
        markSchemeRevealed = true;
        phase = 'marking';
        savePeerDraft();
        render();
      });
      origSection.appendChild(revealBtn);
    }
    host.appendChild(origSection);

    if (!markSchemeRevealed) {
      return;
    }

    var schemeSection = document.createElement('section');
    schemeSection.className = 'panel';
    schemeSection.setAttribute('aria-labelledby', 'scheme-heading');
    var schemeHeading = document.createElement('h2');
    schemeHeading.id = 'scheme-heading';
    schemeHeading.textContent = 'Mark scheme';
    schemeSection.appendChild(schemeHeading);
    var schemeList = document.createElement('ol');
    schemeList.className = 'section-list';
    data.markScheme.forEach(function (point) {
      var li = document.createElement('li');
      li.textContent = point;
      schemeList.appendChild(li);
    });
    schemeSection.appendChild(schemeList);
    host.appendChild(schemeSection);

    var checkSection = document.createElement('section');
    checkSection.className = 'panel';
    checkSection.setAttribute('aria-labelledby', 'check-heading');
    var checkHeading = document.createElement('h2');
    checkHeading.id = 'check-heading';
    checkHeading.textContent = 'Marking checklist';
    checkSection.appendChild(checkHeading);
    var checkNote = document.createElement('p');
    checkNote.className = 'panel-note';
    checkNote.textContent =
      'Tick each criterion your answer meets. Submit score uses checklist items completed out of 6.';
    checkSection.appendChild(checkNote);

    data.checklist.forEach(function (item) {
      var itemId = 'peer-chk-' + item.id;
      var label = document.createElement('label');
      label.className = 'w2-checkbox-label w2-checklist-item';
      label.setAttribute('for', itemId);
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = itemId;
      checkbox.checked = checklistState[item.id];
      checkbox.addEventListener('change', function (event) {
        checklistState[item.id] = event.target.checked;
        savePeerDraft();
        updateChecklistCount();
      });
      label.appendChild(checkbox);
      var textWrap = document.createElement('span');
      var strong = document.createElement('strong');
      strong.textContent = item.label + ' ';
      textWrap.appendChild(strong);
      textWrap.appendChild(document.createTextNode('— ' + item.description));
      label.appendChild(textWrap);
      checkSection.appendChild(label);
    });

    var countP = document.createElement('p');
    countP.id = 'checklist-count';
    countP.className = 'panel-note';
    countP.setAttribute('aria-live', 'polite');
    countP.textContent =
      'Checklist: ' + checklistCompletedCount() + ' out of ' + data.total + ' completed.';
    checkSection.appendChild(countP);
    host.appendChild(checkSection);

    var awardSection = document.createElement('section');
    awardSection.className = 'panel';
    awardSection.setAttribute('aria-labelledby', 'award-heading');
    var awardHeading = document.createElement('h2');
    awardHeading.id = 'award-heading';
    awardHeading.textContent = 'Award marks';
    awardSection.appendChild(awardHeading);
    var awardNote = document.createElement('p');
    awardNote.className = 'panel-note';
    awardNote.textContent =
      'Award a mark out of 6 for your original answer (self or peer assessment).';
    awardSection.appendChild(awardNote);

    var awardGroup = document.createElement('div');
    awardGroup.className = 'form-group';
    var awardLabel = document.createElement('label');
    awardLabel.setAttribute('for', 'awarded-marks');
    awardLabel.textContent = 'Marks awarded (0–6)';
    awardGroup.appendChild(awardLabel);
    var awardSelect = document.createElement('select');
    awardSelect.id = 'awarded-marks';
    awardSelect.className = 'form-control';
    var blankOpt = document.createElement('option');
    blankOpt.value = '';
    blankOpt.textContent = 'Select marks…';
    awardSelect.appendChild(blankOpt);
    for (var m = 0; m <= data.maxAwardedMarks; m += 1) {
      var opt = document.createElement('option');
      opt.value = String(m);
      opt.textContent = String(m);
      if (awardedMarks === m) opt.selected = true;
      awardSelect.appendChild(opt);
    }
    awardSelect.addEventListener('change', function (event) {
      awardedMarks = event.target.value === '' ? null : Number(event.target.value);
      savePeerDraft();
    });
    awardGroup.appendChild(awardSelect);
    awardSection.appendChild(awardGroup);
    host.appendChild(awardSection);

    var reflectSection = document.createElement('section');
    reflectSection.className = 'panel';
    reflectSection.setAttribute('aria-labelledby', 'reflect-heading');
    var reflectHeading = document.createElement('h2');
    reflectHeading.id = 'reflect-heading';
    reflectHeading.textContent = 'Strength and improvement';
    reflectSection.appendChild(reflectHeading);

    function addTextarea(labelText, id, value, onInput) {
      var group = document.createElement('div');
      group.className = 'form-group';
      var lbl = document.createElement('label');
      lbl.setAttribute('for', id);
      lbl.textContent = labelText;
      group.appendChild(lbl);
      var area = document.createElement('textarea');
      area.id = id;
      area.className = 'form-control';
      area.rows = 3;
      area.value = value;
      area.addEventListener('input', function (event) {
        onInput(event.target.value);
        savePeerDraft();
      });
      group.appendChild(area);
      reflectSection.appendChild(group);
    }

    addTextarea('One strength in your original answer', 'peer-strength', strength, function (v) {
      strength = v;
    });
    addTextarea('One improvement needed', 'peer-improvement', improvement, function (v) {
      improvement = v;
    });
    host.appendChild(reflectSection);

    var rewriteSection = document.createElement('section');
    rewriteSection.className = 'panel';
    rewriteSection.setAttribute('aria-labelledby', 'rewrite-heading');
    var rewriteHeading = document.createElement('h2');
    rewriteHeading.id = 'rewrite-heading';
    rewriteHeading.textContent = 'Rewrite your answer';
    rewriteSection.appendChild(rewriteHeading);
    var rewriteGroup = document.createElement('div');
    rewriteGroup.className = 'form-group';
    var rewriteLabel = document.createElement('label');
    rewriteLabel.setAttribute('for', 'peer-improved-answer');
    rewriteLabel.textContent = 'Improved response';
    rewriteGroup.appendChild(rewriteLabel);
    var rewriteArea = document.createElement('textarea');
    rewriteArea.id = 'peer-improved-answer';
    rewriteArea.className = 'form-control';
    rewriteArea.rows = 8;
    rewriteArea.value = improvedAnswer;
    rewriteArea.addEventListener('input', function (event) {
      improvedAnswer = event.target.value;
      savePeerDraft();
      renderCompare();
    });
    rewriteGroup.appendChild(rewriteArea);
    rewriteSection.appendChild(rewriteGroup);

    var compareHost = document.createElement('div');
    compareHost.id = 'peer-compare-host';
    rewriteSection.appendChild(compareHost);
    host.appendChild(rewriteSection);

    function renderCompare() {
      var compareEl = document.getElementById('peer-compare-host');
      if (!compareEl) return;
      compareEl.textContent = '';
      if (!improvedAnswer.trim()) return;

      var compareHeading = document.createElement('h3');
      compareHeading.textContent = 'Side-by-side comparison';
      compareEl.appendChild(compareHeading);

      var twoCol = document.createElement('div');
      twoCol.className = 'w2-two-col';

      var origCol = document.createElement('article');
      origCol.className = 'w2-callout';
      var origTitle = document.createElement('h4');
      origTitle.textContent = 'Original';
      origCol.appendChild(origTitle);
      var origP = document.createElement('p');
      origP.textContent = original;
      origCol.appendChild(origP);

      var impCol = document.createElement('article');
      impCol.className = 'w2-callout w2-improved-response';
      var impTitle = document.createElement('h4');
      impTitle.textContent = 'Improved';
      impCol.appendChild(impTitle);
      var impP = document.createElement('p');
      impP.textContent = improvedAnswer;
      impCol.appendChild(impP);

      twoCol.appendChild(origCol);
      twoCol.appendChild(impCol);
      compareEl.appendChild(twoCol);
    }

    renderCompare();

    var completeSection = document.createElement('section');
    completeSection.className = 'panel';
    var completeBtn = document.createElement('button');
    completeBtn.type = 'button';
    completeBtn.className = 'btn btn-primary';
    completeBtn.textContent = workflowComplete ? 'Update completion' : 'Complete peer marking';
    completeBtn.addEventListener('click', function () {
      if (awardedMarks == null) {
        window.alert('Select marks awarded (0–6) before completing.');
        return;
      }
      if (strength.trim().length < 10) {
        window.alert('Write at least one strength (minimum 10 characters).');
        return;
      }
      if (improvement.trim().length < 10) {
        window.alert('Write at least one improvement (minimum 10 characters).');
        return;
      }
      if (improvedAnswer.trim().length < 20) {
        window.alert('Write an improved answer (minimum 20 characters).');
        return;
      }
      workflowComplete = true;
      savePeerDraft();
      if (progress) {
        progress.markCompleted(data.activityId, checklistCompletedCount(), data.total);
      }
      render();
      showSubmitPanel();
    });
    if (workflowComplete) {
      var doneMsg = document.createElement('p');
      doneMsg.className = 'message message-success';
      doneMsg.setAttribute('aria-live', 'polite');
      doneMsg.textContent =
        'Peer marking complete. Checklist score: ' +
        checklistCompletedCount() +
        ' out of ' +
        data.total +
        '. You awarded ' +
        awardedMarks +
        ' out of 6 for your original answer.';
      completeSection.appendChild(doneMsg);
    }

    completeSection.appendChild(completeBtn);
    host.appendChild(completeSection);

    if (workflowComplete && canProceedToSubmit()) {
      showSubmitPanel();
    }
  }

  function showSubmitPanel() {
    window.Unit3Week2Submit.renderSubmitPanel({
      activityId: data.activityId,
      getScore: function () {
        return checklistCompletedCount();
      },
      getTotal: function () {
        return data.total;
      },
      getQuestionsForReview: function () {
        var missing = [];
        data.checklist.forEach(function (item, i) {
          if (!checklistState[item.id]) missing.push(i + 1);
        });
        return missing;
      },
      getReflection: function () {
        return (
          'Awarded ' +
          awardedMarks +
          '/6. Strength: ' +
          strength.trim().slice(0, 120) +
          '. Improvement: ' +
          improvement.trim().slice(0, 120) +
          '.'
        );
      },
      getCompletionTimeSeconds: function () {
        return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      },
      canSubmit: function () {
        return canProceedToSubmit();
      }
    });
  }

  function updateChecklistCount() {
    var countP = document.getElementById('checklist-count');
    if (countP) {
      countP.textContent =
        'Checklist: ' + checklistCompletedCount() + ' out of ' + data.total + ' completed.';
    }
  }

  render();
})();
