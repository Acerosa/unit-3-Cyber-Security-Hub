(function () {
  'use strict';

  var data = window.Week2NorthbankAnalysis;
  var progress = window.Unit3Week2Progress;

  if (!data) {
    return;
  }

  var answers = {};
  var checked = false;
  var score = 0;
  var startedAt = Date.now();
  var completionTimeSeconds = 60;

  data.scenarios.forEach(function (scenario) {
    answers[scenario.id] = {
      vulnerability: '',
      category: '',
      threat: '',
      likelyIncident: '',
      ciaAims: [],
      justification: ''
    };
  });

  if (progress) {
    progress.markStarted(data.activityId);
  }

  function normalise(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function matchesAny(input, acceptableList) {
    var norm = normalise(input);
    if (!norm) return false;
    for (var i = 0; i < acceptableList.length; i += 1) {
      var accept = normalise(acceptableList[i]);
      if (norm.indexOf(accept) !== -1 || accept.indexOf(norm) !== -1) {
        return true;
      }
    }
    return false;
  }

  function ciaMatches(selected, expected) {
    if (!selected || !selected.length || selected.length !== expected.length) {
      return false;
    }
    var sortedSelected = selected.slice().sort();
    var sortedExpected = expected.slice().sort();
    for (var i = 0; i < sortedExpected.length; i += 1) {
      if (sortedSelected[i] !== sortedExpected[i]) {
        return false;
      }
    }
    return true;
  }

  function scenarioCorrect(scenario, response) {
    var expected = scenario.answers;
    return (
      matchesAny(response.vulnerability, expected.vulnerability) &&
      response.category === expected.category &&
      matchesAny(response.threat, expected.threat) &&
      matchesAny(response.likelyIncident, expected.likelyIncident) &&
      ciaMatches(response.ciaAims, expected.ciaAims) &&
      normalise(response.justification).length >= 20
    );
  }

  function computeScore() {
    var total = 0;
    data.scenarios.forEach(function (scenario) {
      if (scenarioCorrect(scenario, answers[scenario.id])) {
        total += 1;
      }
    });
    return total;
  }

  function incorrectIndexes() {
    var indexes = [];
    data.scenarios.forEach(function (scenario, i) {
      if (!scenarioCorrect(scenario, answers[scenario.id])) {
        indexes.push(i + 1);
      }
    });
    return indexes;
  }

  function render() {
    var host = document.getElementById('w2-analysis-host');
    if (!host) return;
    host.textContent = '';

    data.scenarios.forEach(function (scenario, index) {
      var panel = document.createElement('section');
      panel.className = 'panel w2-scenario-panel';
      panel.setAttribute('aria-labelledby', 'scenario-' + scenario.id);

      var heading = document.createElement('h2');
      heading.id = 'scenario-' + scenario.id;
      heading.textContent = 'Scenario ' + (index + 1) + ': ' + scenario.title;
      panel.appendChild(heading);

      var scenarioText = document.createElement('p');
      scenarioText.className = 'w2-scenario';
      scenarioText.textContent = scenario.text;
      panel.appendChild(scenarioText);

      var form = document.createElement('div');
      form.className = 'w2-analysis-form';

      function addTextField(label, key, hint) {
        var group = document.createElement('div');
        group.className = 'form-group';
        var lbl = document.createElement('label');
        var inputId = scenario.id + '-' + key;
        lbl.setAttribute('for', inputId);
        lbl.textContent = label;
        group.appendChild(lbl);
        var input = document.createElement('input');
        input.type = 'text';
        input.id = inputId;
        input.className = 'form-control';
        input.value = answers[scenario.id][key];
        input.disabled = checked;
        input.addEventListener('input', function (event) {
          answers[scenario.id][key] = event.target.value;
        });
        group.appendChild(input);
        if (hint) {
          var note = document.createElement('p');
          note.className = 'panel-note';
          note.textContent = hint;
          group.appendChild(note);
        }
        form.appendChild(group);
      }

      function addSelect(label, key, options) {
        var group = document.createElement('div');
        group.className = 'form-group';
        var lbl = document.createElement('label');
        var selectId = scenario.id + '-' + key;
        lbl.setAttribute('for', selectId);
        lbl.textContent = label;
        group.appendChild(lbl);
        var select = document.createElement('select');
        select.id = selectId;
        select.className = 'form-control';
        select.disabled = checked;
        var blank = document.createElement('option');
        blank.value = '';
        blank.textContent = 'Select…';
        select.appendChild(blank);
        options.forEach(function (opt) {
          var option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          if (answers[scenario.id][key] === opt) {
            option.selected = true;
          }
          select.appendChild(option);
        });
        select.addEventListener('change', function (event) {
          answers[scenario.id][key] = event.target.value;
        });
        group.appendChild(select);
        form.appendChild(group);
      }

      addTextField('Vulnerability (name the weakness)', 'vulnerability');
      addSelect('Category', 'category', data.categories);
      addTextField('Threat (who or what could exploit it)', 'threat');
      addTextField('Likely incident (harmful outcome)', 'likelyIncident');

      var ciaGroup = document.createElement('fieldset');
      ciaGroup.className = 'w2-cia-fieldset';
      var ciaLegend = document.createElement('legend');
      ciaLegend.textContent = 'CIA aim(s) affected (select all that apply)';
      ciaGroup.appendChild(ciaLegend);
      data.ciaOptions.forEach(function (cia) {
        var ciaId = scenario.id + '-cia-' + cia;
        var label = document.createElement('label');
        label.className = 'w2-checkbox-label';
        label.setAttribute('for', ciaId);
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = ciaId;
        checkbox.value = cia;
        checkbox.disabled = checked;
        checkbox.checked = answers[scenario.id].ciaAims.indexOf(cia) !== -1;
        checkbox.addEventListener('change', function (event) {
          var list = answers[scenario.id].ciaAims;
          if (event.target.checked) {
            if (list.indexOf(cia) === -1) list.push(cia);
          } else {
            answers[scenario.id].ciaAims = list.filter(function (item) {
              return item !== cia;
            });
          }
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + cia));
        ciaGroup.appendChild(label);
      });
      form.appendChild(ciaGroup);

      addTextField(
        'Short justification',
        'justification',
        'Explain the chain: threat exploits vulnerability, then incident, then CIA impact.'
      );

      panel.appendChild(form);

      if (checked) {
        var response = answers[scenario.id];
        var correct = scenarioCorrect(scenario, response);
        var feedback = document.createElement('div');
        feedback.className = 'status-messages';
        feedback.setAttribute('aria-live', 'polite');
        var msg = document.createElement('p');
        msg.className = 'message message-' + (correct ? 'success' : 'error');
        msg.textContent = correct
          ? 'Fully correct — 1 mark.'
          : 'Not fully correct. Review the model chain below.';
        feedback.appendChild(msg);

        if (!correct) {
          var model = document.createElement('div');
          model.className = 'w2-callout';
          var exp = scenario.answers;
          var modelP1 = document.createElement('p');
          modelP1.innerHTML = '<strong>Vulnerability:</strong> ' + exp.vulnerability[0];
          model.appendChild(modelP1);
          var modelP2 = document.createElement('p');
          modelP2.innerHTML = '<strong>Category:</strong> ' + exp.category;
          model.appendChild(modelP2);
          var modelP3 = document.createElement('p');
          modelP3.innerHTML = '<strong>Threat:</strong> ' + exp.threat[0];
          model.appendChild(modelP3);
          var modelP4 = document.createElement('p');
          modelP4.innerHTML = '<strong>Likely incident:</strong> ' + exp.likelyIncident[0];
          model.appendChild(modelP4);
          var modelP5 = document.createElement('p');
          modelP5.innerHTML = '<strong>CIA aims:</strong> ' + exp.ciaAims.join(', ');
          model.appendChild(modelP5);
          var modelP6 = document.createElement('p');
          modelP6.innerHTML = '<strong>Justification:</strong> ' + exp.justification;
          model.appendChild(modelP6);
          feedback.appendChild(model);
        }
        panel.appendChild(feedback);
      }

      host.appendChild(panel);
    });

    var scorePanel = document.createElement('section');
    scorePanel.className = 'panel';
    scorePanel.setAttribute('aria-labelledby', 'score-heading');

    var scoreHeading = document.createElement('h2');
    scoreHeading.id = 'score-heading';
    scoreHeading.textContent = checked ? 'Your score' : 'Check your answers';
    scorePanel.appendChild(scoreHeading);

    if (checked) {
      var scoreText = document.createElement('p');
      scoreText.setAttribute('aria-live', 'polite');
      scoreText.textContent = 'Score: ' + score + ' out of ' + data.total + '.';
      scorePanel.appendChild(scoreText);
    }

    var actions = document.createElement('div');
    actions.className = 'w2-actions';

    if (!checked) {
      var checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.className = 'btn btn-primary';
      checkBtn.textContent = 'Check answers';
      checkBtn.addEventListener('click', function () {
        score = computeScore();
        checked = true;
        completionTimeSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        if (progress) {
          progress.markCompleted(data.activityId, score, data.total);
        }
        render();
        window.Unit3Week2Submit.renderSubmitPanel({
          activityId: data.activityId,
          getScore: function () {
            return score;
          },
          getTotal: function () {
            return data.total;
          },
          getQuestionsForReview: function () {
            return incorrectIndexes();
          },
          getCompletionTimeSeconds: function () {
            return completionTimeSeconds;
          },
          canSubmit: function () {
            return checked;
          }
        });
      });
      actions.appendChild(checkBtn);
    } else {
      var retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'btn btn-secondary';
      retryBtn.textContent = 'Try again';
      retryBtn.addEventListener('click', function () {
        if (
          !window.confirm(
            'Reset your answers and score? You will need to check again before submitting.'
          )
        ) {
          return;
        }
        checked = false;
        score = 0;
        startedAt = Date.now();
        data.scenarios.forEach(function (scenario) {
          answers[scenario.id] = {
            vulnerability: '',
            category: '',
            threat: '',
            likelyIncident: '',
            ciaAims: [],
            justification: ''
          };
        });
        if (progress) {
          progress.markStarted(data.activityId);
        }
        var submitHost = document.getElementById('w2-submit-host');
        if (submitHost) {
          submitHost.hidden = true;
          submitHost.textContent = '';
        }
        render();
      });
      actions.appendChild(retryBtn);
    }

    scorePanel.appendChild(actions);
    host.appendChild(scorePanel);
  }

  render();
})();
