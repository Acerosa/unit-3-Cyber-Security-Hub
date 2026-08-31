(function () {
  'use strict';

  var data = window.Week7RiskRegister;
  var progress = window.Unit3Week7Progress;
  if (!data) return;

  function optionLabel(option) {
    var utils = window.Unit3ActivityUtils;
    if (utils && typeof utils.optionLabel === 'function') return utils.optionLabel(option);
    if (option && typeof option === 'object') {
      return String(option.text || option.optionId || option.label || option.id || '');
    }
    return option == null ? '' : String(option);
  }

  var ACTIVITY_ID = data.activityId;
  var DRAFT_KEY = 'risk-register';
  var host = document.getElementById('w7-activity-host');
  var startedAt = Date.now();
  var viewMode = 'form';
  var showStarters = false;
  var showSamples = true;
  var activeIndex = 0;
  var entries = [];
  var decisionsMeta = {
    addressFirstIndex: '',
    addressFirstJustification: '',
    notes: ''
  };

  if (!window.Unit3LearningText || typeof window.Unit3LearningText.createMounts !== 'function') {
    throw new Error('Unit3LearningText.createMounts is required for risk-register fields');
  }
  var textFields = window.Unit3LearningText.createMounts();

  var TEXT_FIELD_MINS = {
    asset: 2,
    threat: 4,
    vulnerability: 4,
    mitigation: 8,
    costConsequence: 8,
    expectedBenefit: 8,
    effectivenessMeasure: 8,
    justification: 12
  };

  function blankEntry() {
    return {
      asset: '',
      threat: '',
      vulnerability: '',
      likelihood: '',
      impact: '',
      riskScore: '',
      mitigation: '',
      costConsequence: '',
      expectedBenefit: '',
      decision: '',
      effectivenessMeasure: '',
      justification: ''
    };
  }

  function lookupRisk(likelihood, impact) {
    for (var i = 0; i < data.scoringGuide.matrix.length; i += 1) {
      var row = data.scoringGuide.matrix[i];
      if (row.likelihood === likelihood && row.impact === impact) return row.risk;
    }
    return '';
  }

  function riskClass(level) {
    if (level === 'High') return 'w7-risk-high';
    if (level === 'Medium') return 'w7-risk-medium';
    if (level === 'Low') return 'w7-risk-low';
    return '';
  }

  function seedEntries() {
    var week2 =
      progress && typeof progress.loadWeek2VulnerabilityRegister === 'function'
        ? progress.loadWeek2VulnerabilityRegister()
        : { available: false, entries: [] };
    var seeded = [];
    var i;
    for (i = 0; i < data.entryCount; i += 1) {
      seeded.push(blankEntry());
    }
    if (week2.available) {
      week2.entries.slice(0, data.entryCount).forEach(function (src, index) {
        seeded[index].asset = src.asset || src.assetName || '';
        seeded[index].threat = src.threat || '';
        seeded[index].vulnerability = src.vulnerability || src.weakness || '';
      });
    }
    return { entries: seeded, week2Available: week2.available };
  }

  var seed = seedEntries();
  entries = seed.entries;
  var week2Available = seed.week2Available;

  if (progress) {
    progress.markStarted(ACTIVITY_ID);
    var draft = progress.getDraft(DRAFT_KEY);
    if (draft && draft.activityVersion === data.activityVersion) {
      if (Array.isArray(draft.entries) && draft.entries.length) {
        entries = draft.entries.map(function (row) {
          return Object.assign(blankEntry(), row);
        });
        while (entries.length < data.entryCount) entries.push(blankEntry());
        entries = entries.slice(0, data.entryCount);
      }
      if (draft.decisionsMeta) {
        decisionsMeta = Object.assign(decisionsMeta, draft.decisionsMeta);
      }
      if (draft.viewMode === 'table' || draft.viewMode === 'form') viewMode = draft.viewMode;
      showStarters = !!draft.showStarters;
    }
  }

  function save() {
    if (progress) {
      progress.setDraft(DRAFT_KEY, {
        activityVersion: data.activityVersion,
        entries: entries,
        decisionsMeta: decisionsMeta,
        viewMode: viewMode,
        showStarters: showStarters,
        savedAt: new Date().toISOString()
      });
    }
  }

  function normalize(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  function entryComplete(entry) {
    return (
      normalize(entry.asset).length >= 2 &&
      normalize(entry.threat).length >= 4 &&
      normalize(entry.vulnerability).length >= 4 &&
      data.levels.indexOf(entry.likelihood) !== -1 &&
      data.levels.indexOf(entry.impact) !== -1 &&
      data.levels.indexOf(entry.riskScore) !== -1 &&
      normalize(entry.mitigation).length >= 8 &&
      normalize(entry.costConsequence).length >= 8 &&
      normalize(entry.expectedBenefit).length >= 8 &&
      data.decisions.indexOf(entry.decision) !== -1 &&
      normalize(entry.effectivenessMeasure).length >= 8 &&
      normalize(entry.justification).length >= 12
    );
  }

  function validate() {
    var messages = [];
    var warnings = [];
    var completeCount = 0;
    var acceptCount = 0;
    var allHigh = entries.length > 0;
    var costBenefitOk = false;
    var effectivenessOk = false;

    entries.forEach(function (entry, index) {
      var label = 'Entry ' + (index + 1);
      if (!normalize(entry.asset)) {
        messages.push(label + ': ' + data.validationMessages.asset);
      }
      if (
        normalize(entry.threat) &&
        normalize(entry.vulnerability) &&
        normalize(entry.threat) === normalize(entry.vulnerability)
      ) {
        messages.push(label + ': ' + data.validationMessages.threatVuln);
      }
      if (entry.likelihood !== 'High' || entry.impact !== 'High' || entry.riskScore !== 'High') {
        allHigh = false;
      }
      if (entry.decision === 'Accept' && normalize(entry.justification).length >= 12) {
        acceptCount += 1;
      }
      if (entry.decision === 'Mitigate' && !normalize(entry.costConsequence)) {
        messages.push(label + ': ' + data.validationMessages.costMitigate);
      }
      if (
        normalize(entry.mitigation) &&
        normalize(entry.vulnerability) &&
        normalize(entry.mitigation).indexOf(normalize(entry.vulnerability).slice(0, 12)) === -1 &&
        normalize(entry.mitigation).length < 12
      ) {
        warnings.push(label + ': ' + data.validationMessages.mitigationRelate);
      }
      if (!normalize(entry.justification) && entry.decision) {
        messages.push(label + ': ' + data.validationMessages.decisionReason);
      }
      var eff = normalize(entry.effectivenessMeasure);
      if (eff === 'installed' || eff === 'we installed it' || eff === 'installed antivirus') {
        messages.push(label + ': ' + data.validationMessages.effectivenessInstalled);
      }
      if (
        entry.decision === 'Mitigate' &&
        normalize(entry.costConsequence).length >= 8 &&
        normalize(entry.expectedBenefit).length >= 8
      ) {
        costBenefitOk = true;
      }
      if (eff.length >= 12 && eff.indexOf('install') === -1) {
        effectivenessOk = true;
      } else if (eff.length >= 20) {
        effectivenessOk = true;
      }
      if (entryComplete(entry)) completeCount += 1;
    });

    if (allHigh) warnings.push(data.validationMessages.allHigh);
    if (
      decisionsMeta.addressFirstIndex === '' ||
      normalize(decisionsMeta.addressFirstJustification).length < 20
    ) {
      messages.push(data.validationMessages.addressFirst);
    }
    if (acceptCount < 1) messages.push(data.validationMessages.acceptNeeded);
    if (!costBenefitOk) messages.push(data.validationMessages.costBenefitOne);
    if (!effectivenessOk) messages.push(data.validationMessages.effectivenessOne);
    if (completeCount < data.entryCount) {
      messages.push(
        'Complete all ' +
          data.entryCount +
          ' register entries (' +
          completeCount +
          ' complete so far).'
      );
    }

    return { messages: messages, warnings: warnings, completeCount: completeCount };
  }

  function computeScore() {
    var completeCount = entries.filter(entryComplete).length;
    var score = Math.min(5, completeCount);
    var v = validate();
    if (
      decisionsMeta.addressFirstIndex !== '' &&
      normalize(decisionsMeta.addressFirstJustification).length >= 20
    ) {
      score += 1;
    }
    if (
      entries.some(function (entry) {
        return entry.decision === 'Accept' && normalize(entry.justification).length >= 12;
      })
    ) {
      score += 1;
    }
    if (
      entries.some(function (entry) {
        return (
          entry.decision === 'Mitigate' &&
          normalize(entry.costConsequence).length >= 8 &&
          normalize(entry.expectedBenefit).length >= 8
        );
      })
    ) {
      score += 1;
    }
    if (
      entries.some(function (entry) {
        var eff = normalize(entry.effectivenessMeasure);
        return eff.length >= 12 && eff !== 'installed';
      })
    ) {
      score += 1;
    }
    if (v.messages.length === 0) score += 1;
    return Math.min(data.total, score);
  }

  function renderSelect(parent, id, labelText, options, value, onChange) {
    var wrap = document.createElement('div');
    wrap.className = 'w7-reflection-field';
    var label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    wrap.appendChild(label);
    var select = document.createElement('select');
    select.id = id;
    var blank = document.createElement('option');
    blank.value = '';
    blank.textContent = 'Select…';
    select.appendChild(blank);
    options.forEach(function (option) {
      var opt = document.createElement('option');
      var label = optionLabel(option);
      opt.value = typeof option === 'object' && option ? label : option;
      opt.textContent = label;
      if (value === option || value === label) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', function () {
      onChange(select.value);
      save();
      render();
    });
    wrap.appendChild(select);
    parent.appendChild(wrap);
  }

  function renderTextField(parent, id, labelText, value, rows, onInput, minChars) {
    textFields.mount(parent, {
      wrapClass: 'w7-reflection-field',
      id: id,
      prompt: labelText,
      minChars: minChars,
      value: value || '',
      rows: rows || 2,
      onChange: function (next) {
        onInput(next);
        save();
      }
    });
  }

  function renderScoringGuide(parent) {
    var guide = document.createElement('section');
    guide.className = 'w7-review-item';setAuthoredHtml(guide, '<h3>' + data.scoringGuide.title + '</h3>');
    var lik = document.createElement('p');setAuthoredHtml(lik, '<strong>Likelihood:</strong> Low - ' +
      data.scoringGuide.likelihood.Low +
      ' Medium - ' +
      data.scoringGuide.likelihood.Medium +
      ' High - ' +
      data.scoringGuide.likelihood.High);
    guide.appendChild(lik);
    var imp = document.createElement('p');setAuthoredHtml(imp, '<strong>Impact:</strong> Low - ' +
      data.scoringGuide.impact.Low +
      ' Medium - ' +
      data.scoringGuide.impact.Medium +
      ' High - ' +
      data.scoringGuide.impact.High);
    guide.appendChild(imp);

    var wrap = document.createElement('div');
    wrap.className = 'w7-thm-table-wrap';
    var table = document.createElement('table');
    table.className = 'w7-matrix';setAuthoredHtml(table, '<caption>Likelihood × Impact to risk rating (text labels)</caption>' +
      '<thead><tr><th scope="col">Likelihood</th><th scope="col">Impact</th><th scope="col">Risk rating</th><th scope="col">Numeric helper</th></tr></thead>');
    var tbody = document.createElement('tbody');
    data.scoringGuide.matrix.forEach(function (row) {
      var tr = document.createElement('tr');setAuthoredHtml(tr, '<td>' +
        row.likelihood +
        '</td><td>' +
        row.impact +
        '</td><td><span class="' +
        riskClass(row.risk) +
        '">' +
        row.risk +
        ' risk</span></td><td>' +
        row.numeric +
        '</td>');
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    guide.appendChild(wrap);
    var note = document.createElement('p');
    note.className = 'panel-note';
    note.textContent = data.scoringGuide.note;
    guide.appendChild(note);
    parent.appendChild(guide);
  }

  function renderEntryForm(parent, entry, index) {
    var block = document.createElement('section');
    block.className = 'w7-review-item';setAuthoredHtml(block, '<h3>Register entry ' +
      (index + 1) +
      ' of ' +
      data.entryCount +
      '</h3>' +
      (entry.riskScore
        ? '<p><span class="' +
          riskClass(entry.riskScore) +
          '">Risk rating: ' +
          entry.riskScore +
          '</span></p>'
        : ''));

    data.fields.forEach(function (field) {
      if (field.type === 'select' || field.type === 'decision') {
        var options = field.type === 'decision' ? data.decisions : data.levels;
        renderSelect(
          block,
          field.id + '-' + index,
          field.label,
          options,
          entry[field.id],
          function (value) {
            entry[field.id] = value;
            if (field.id === 'likelihood' || field.id === 'impact') {
              var auto = lookupRisk(entry.likelihood, entry.impact);
              if (auto) entry.riskScore = auto;
            }
          }
        );
      } else {
        renderTextField(
          block,
          field.id + '-' + index,
          field.label,
          entry[field.id],
          field.rows,
          function (value) {
            entry[field.id] = value;
          },
          TEXT_FIELD_MINS[field.id] || 8
        );
      }
    });
    parent.appendChild(block);
  }

  function renderTable(parent) {
    var wrap = document.createElement('div');
    wrap.className = 'w7-thm-table-wrap';
    var table = document.createElement('table');
    table.className = 'w7-thm-table';
    table.setAttribute('role', 'table');
    var headers = [
      'Asset',
      'Threat',
      'Vulnerability',
      'Likelihood',
      'Impact',
      'Risk',
      'Decision',
      'Justification'
    ];
    var thead = document.createElement('thead');
    var hr = document.createElement('tr');
    headers.forEach(function (h) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.textContent = h;
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');
    entries.forEach(function (entry, index) {
      var tr = document.createElement('tr');
      [
        entry.asset,
        entry.threat,
        entry.vulnerability,
        entry.likelihood,
        entry.impact,
        entry.riskScore,
        entry.decision,
        entry.justification
      ].forEach(function (cell, cellIndex) {
        var td = document.createElement('td');
        if (cellIndex === 5 && cell) {setAuthoredHtml(td, '<span class="' + riskClass(cell) + '">' + cell + ' risk</span>');
        } else {
          td.textContent = cell || '-';
        }
        tr.appendChild(td);
      });
      tr.tabIndex = 0;
      tr.addEventListener('click', function () {
        activeIndex = index;
        viewMode = 'form';
        save();
        render();
      });
      tr.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activeIndex = index;
          viewMode = 'form';
          save();
          render();
        }
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    parent.appendChild(wrap);
    var hint = document.createElement('p');
    hint.className = 'panel-note';
    hint.textContent = 'Select a row to edit it in the structured form view.';
    parent.appendChild(hint);
  }

  function render() {
    if (!host) return;
    textFields.destroyAll();
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';setAuthoredHtml(panel, '<h2>' +
      data.activityName +
      '</h2>' +
      '<p><strong>Organisation:</strong> ' +
      data.organisation +
      '</p>' +
      '<p class="panel-note">' +
      data.intro +
      '</p>');

    if (!week2Available) {
      var miss = document.createElement('p');
      miss.className = 'message message-warning';
      miss.textContent = data.week2UnavailableNote;
      panel.appendChild(miss);
    } else {
      var ok = document.createElement('p');
      ok.className = 'message message-success';
      ok.textContent =
        'Week 2 vulnerability register entries were loaded where available. Complete likelihood, impact and decisions here.';
      panel.appendChild(ok);
    }

    renderScoringGuide(panel);

    var toggles = document.createElement('div');
    toggles.className = 'w7-view-toggle';
    toggles.setAttribute('role', 'group');
    toggles.setAttribute('aria-label', 'View and support options');

    function toggleBtn(label, pressed, onClick) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary';
      btn.textContent = label;
      btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
      btn.addEventListener('click', onClick);
      toggles.appendChild(btn);
    }

    toggleBtn('Structured form view', viewMode === 'form', function () {
      viewMode = 'form';
      save();
      render();
    });
    toggleBtn('Table view', viewMode === 'table', function () {
      viewMode = 'table';
      save();
      render();
    });
    toggleBtn(
      showStarters ? 'Hide sentence starters' : 'Show sentence starters',
      showStarters,
      function () {
        showStarters = !showStarters;
        save();
        render();
      }
    );
    toggleBtn(
      showSamples ? 'Hide worked samples' : 'Show worked samples',
      showSamples,
      function () {
        showSamples = !showSamples;
        render();
      }
    );
    panel.appendChild(toggles);

    if (showStarters) {
      var starters = document.createElement('aside');
      starters.className = 'w7-support-toggle';setAuthoredHtml(starters, '<strong>Optional sentence starters</strong><ul class="section-list">' +
        data.sentenceStarters
          .map(function (item) {
            return '<li>' + item + '</li>';
          })
          .join('') +
        '</ul>');
      panel.appendChild(starters);
    }

    if (showSamples) {
      var samples = document.createElement('section');
      samples.className = 'w7-review-item';setAuthoredHtml(samples, '<h3>Partially completed sample rows (worked examples)</h3>');
      data.sampleRows.forEach(function (row, index) {
        var ex = document.createElement('article');
        ex.className = 'w7-def-card';setAuthoredHtml(ex, '<h4>Sample ' +
          (index + 1) +
          ': ' +
          row.asset +
          '</h4>' +
          '<p><strong>Threat:</strong> ' +
          row.threat +
          '</p>' +
          '<p><strong>Vulnerability:</strong> ' +
          row.vulnerability +
          '</p>' +
          '<p><span class="' +
          riskClass(row.riskScore) +
          '">Risk rating: ' +
          row.riskScore +
          '</span> (Likelihood ' +
          row.likelihood +
          ', Impact ' +
          row.impact +
          ')</p>' +
          '<p><strong>Decision:</strong> ' +
          row.decision +
          ' - ' +
          row.justification +
          '</p>');
        samples.appendChild(ex);
      });
      panel.appendChild(samples);
    }

    if (viewMode === 'table') {
      renderTable(panel);
    } else {
      var nav = document.createElement('div');
      nav.className = 'w7-actions';
      var prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'btn btn-secondary';
      prev.textContent = 'Previous entry';
      prev.disabled = activeIndex === 0;
      prev.addEventListener('click', function () {
        activeIndex -= 1;
        render();
      });
      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'btn btn-secondary';
      next.textContent = 'Next entry';
      next.disabled = activeIndex >= entries.length - 1;
      next.addEventListener('click', function () {
        activeIndex += 1;
        render();
      });
      nav.appendChild(prev);
      nav.appendChild(next);
      panel.appendChild(nav);
      renderEntryForm(panel, entries[activeIndex], activeIndex);
    }

    var meta = document.createElement('section');
    meta.className = 'w7-review-item';setAuthoredHtml(meta, '<h3>Required register decisions</h3>');
    (function renderAddressFirst() {
      var wrap = document.createElement('div');
      wrap.className = 'w7-reflection-field';
      var label = document.createElement('label');
      label.setAttribute('for', 'address-first');
      label.textContent = 'Address first (select entry)';
      wrap.appendChild(label);
      var select = document.createElement('select');
      select.id = 'address-first';
      var blank = document.createElement('option');
      blank.value = '';
      blank.textContent = 'Select…';
      select.appendChild(blank);
      entries.forEach(function (entry, index) {
        var opt = document.createElement('option');
        opt.value = String(index);
        opt.textContent = String(index + 1) + '. ' + (entry.asset || 'Untitled asset');
        if (String(decisionsMeta.addressFirstIndex) === String(index)) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener('change', function () {
        decisionsMeta.addressFirstIndex = select.value;
        save();
      });
      wrap.appendChild(select);
      meta.appendChild(wrap);
    })();
    renderTextField(
      meta,
      'address-first-why',
      data.addressFirstPrompt,
      decisionsMeta.addressFirstJustification,
      3,
      function (value) {
        decisionsMeta.addressFirstJustification = value;
      },
      20
    );
    renderTextField(
      meta,
      'register-notes',
      'Optional notes for your group or tutor',
      decisionsMeta.notes,
      2,
      function (value) {
        decisionsMeta.notes = value;
      },
      20
    );
    panel.appendChild(meta);

    var status = document.createElement('div');
    status.id = 'w7-register-status';
    status.className = 'w7-validation';
    status.setAttribute('aria-live', 'polite');
    panel.appendChild(status);

    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    var saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-secondary';
    saveBtn.textContent = 'Save draft';
    saveBtn.addEventListener('click', function () {
      save();
      status.textContent = '';
      var p = document.createElement('p');
      p.className = 'message message-success';
      p.textContent = 'Draft saved in this browser.';
      status.appendChild(p);
    });
    var completeBtn = document.createElement('button');
    completeBtn.type = 'button';
    completeBtn.className = 'btn btn-primary';
    completeBtn.textContent = 'Complete risk register';
    completeBtn.addEventListener('click', function () {
      save();
      var result = validate();
      status.textContent = '';
      result.warnings.forEach(function (msg) {
        var w = document.createElement('p');
        w.className = 'message message-warning';
        w.textContent = msg;
        status.appendChild(w);
      });
      if (result.messages.length) {
        result.messages.forEach(function (msg) {
          var m = document.createElement('p');
          m.className = 'message message-warning';
          m.textContent = msg;
          status.appendChild(m);
        });
        return;
      }
      var score = computeScore();
      if (progress) progress.markCompleted(ACTIVITY_ID, score, data.total);
      var done = document.createElement('p');
      done.className = 'message message-success';
      done.textContent = 'Risk register complete. Score: ' + score + ' / ' + data.total + '.';
      status.appendChild(done);
      window.Unit3Week7Submit.renderSubmitPanel({
        activityId: ACTIVITY_ID,
        hostId: 'w7-submit-host',
        getScore: function () {
          return score;
        },
        getTotal: function () {
          return data.total;
        },
        getCompletionTimeSeconds: function () {
          return Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        },
        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          var validation = validate();
          var result = entries.map(function (entry, index) {
            return evidence.structured('RR' + (index + 1), entry, {
              correct: entryComplete(entry),
              score: entryComplete(entry) ? 1 : 0
            });
          });
          var addressFirstOk =
            decisionsMeta.addressFirstIndex !== '' &&
            normalize(decisionsMeta.addressFirstJustification).length >= 20;
          var acceptOk = entries.some(function (entry) {
            return entry.decision === 'Accept' && normalize(entry.justification).length >= 12;
          });
          var costBenefitOk = entries.some(function (entry) {
            return (
              entry.decision === 'Mitigate' &&
              normalize(entry.costConsequence).length >= 8 &&
              normalize(entry.expectedBenefit).length >= 8
            );
          });
          var effectivenessOk = entries.some(function (entry) {
            var value = normalize(entry.effectivenessMeasure);
            return value.length >= 12 && value !== 'installed';
          });
          [
            {
              id: 'RR6',
              payload: {
                addressFirstIndex: decisionsMeta.addressFirstIndex,
                justification: decisionsMeta.addressFirstJustification
              },
              correct: addressFirstOk
            },
            { id: 'RR7', payload: { entries: entries }, correct: acceptOk },
            { id: 'RR8', payload: { entries: entries }, correct: costBenefitOk },
            { id: 'RR9', payload: { entries: entries }, correct: effectivenessOk },
            {
              id: 'RR10',
              payload: { validationMessages: validation.messages, notes: decisionsMeta.notes },
              correct: validation.messages.length === 0
            }
          ].forEach(function (item) {
            result.push(
              evidence.structured(item.id, item.payload, {
                correct: item.correct,
                score: item.correct ? 1 : 0
              })
            );
          });
          return result;
        },
        getStartedAt: function () {
          return new Date(startedAt).toISOString();
        },
        getCompletedAt: function () {
          return new Date().toISOString();
        },
        canSubmit: function () {
          return true;
        }
      });
    });
    actions.appendChild(saveBtn);
    actions.appendChild(completeBtn);
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  render();
})();
