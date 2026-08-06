(function () {
  'use strict';

  var data = window.Week4Motivations;
  var progress = window.Unit3Week4Progress;
  if (!data) return;

  var ACTIVITY_ID = data.activityId;
  var mode = 'overview';
  var profileIndex = 0;
  var host = document.getElementById('w4-activity-host');
  var startedAt = Date.now();

  if (progress) progress.markStarted(ACTIVITY_ID);

  function escapeText(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function navButton(label, nextMode, opts) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary';
    btn.textContent = label;
    btn.addEventListener('click', function () {
      mode = nextMode;
      if (opts && typeof opts.index === 'number') profileIndex = opts.index;
      render();
      host.focus();
    });
    return btn;
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    if (mode === 'overview') renderOverview();
    else if (mode === 'profile') renderProfile();
    else if (mode === 'check') renderCheck();
  }

  function renderOverview() {
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Motivations for attack</h2>' +
      '<p class="w4-formula" role="note">Motivation = why · Target = what · Method = how</p>' +
      '<p class="panel-note">A method such as phishing or ransomware is not a motivation. Fraud requires deception; income generation may involve no deception. Publicity and thrill are separate ideas.</p>' +
      '<h3>Common misconceptions to avoid</h3><ul class="section-list">' +
      data.misconceptions
        .map(function (item) {
          return '<li>' + escapeText(item) + '</li>';
        })
        .join('') +
      '</ul>';
    var list = document.createElement('ul');
    list.className = 'section-list';
    data.motivations.forEach(function (item, index) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary';
      btn.textContent = item.term;
      btn.addEventListener('click', function () {
        mode = 'profile';
        profileIndex = index;
        render();
      });
      li.appendChild(btn);
      li.appendChild(document.createTextNode(' — ' + item.definition));
      list.appendChild(li);
    });
    panel.appendChild(list);
    var actions = document.createElement('div');
    actions.className = 'w4-actions';
    actions.appendChild(navButton('Open first motivation', 'profile', { index: 0 }));
    actions.appendChild(navButton('Knowledge check (8 marks)', 'check'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderProfile() {
    var item = data.motivations[profileIndex];
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<p class="panel-note" aria-live="polite">Motivation ' +
      (profileIndex + 1) +
      ' of ' +
      data.motivations.length +
      '</p>' +
      '<h2>' +
      escapeText(item.term) +
      '</h2>' +
      '<ul class="section-list">' +
      '<li><strong>Definition:</strong> ' +
      escapeText(item.definition) +
      '</li>' +
      '<li><strong>Explanation:</strong> ' +
      escapeText(item.explanation) +
      '</li>' +
      '<li><strong>Evidence that would support this motivation:</strong> ' +
      escapeText(item.evidence) +
      '</li>' +
      '<li><strong>Test question:</strong> ' +
      escapeText(item.testQuestion) +
      '</li></ul>';
    var actions = document.createElement('div');
    actions.className = 'w4-actions';
    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'btn btn-secondary';
    prev.textContent = 'Previous';
    prev.disabled = profileIndex === 0;
    prev.addEventListener('click', function () {
      profileIndex -= 1;
      render();
    });
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'btn btn-primary';
    next.textContent =
      profileIndex === data.motivations.length - 1 ? 'Go to knowledge check' : 'Next';
    next.addEventListener('click', function () {
      if (profileIndex === data.motivations.length - 1) mode = 'check';
      else profileIndex += 1;
      render();
    });
    actions.appendChild(prev);
    actions.appendChild(next);
    actions.appendChild(navButton('Overview', 'overview'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderCheck() {
    host.textContent = '';
    if (!window.Unit3Week4Quiz) return;
    window.Unit3Week4Quiz.createQuiz({
      activityId: ACTIVITY_ID,
      questions: data.knowledgeCheck.slice(),
      hostId: 'w4-activity-host',
      onComplete: function (result) {
        window.Unit3Week4Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w4-submit-host',
          getScore: function () {
            return result.score;
          },
          getTotal: function () {
            return result.total;
          },
          getQuestionsForReview: function () {
            return result.incorrectIndexes;
          },
          getCompletionTimeSeconds: function () {
            return result.completionTimeSeconds || Math.max(1, Math.round((Date.now() - startedAt) / 1000));
          },
          canSubmit: function () {
            return true;
          }
        });
      },
      onRetry: function () {
        var submit = document.getElementById('w4-submit-host');
        if (submit) {
          submit.hidden = true;
          submit.textContent = '';
        }
      }
    });
  }

  render();
})();
