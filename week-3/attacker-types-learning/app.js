(function () {
  'use strict';

  var types = window.Unit3Week3AttackerTypes;
  var data = window.Week3AttackerTypesLearning;
  var progress = window.Unit3Week3Progress;
  if (!types || !data) return;

  var ACTIVITY_ID = data.activityId;
  var mode = 'overview';
  var profileIndex = 0;
  var host = document.getElementById('w3-learning-host');
  var startedAt = Date.now();

  if (progress) progress.markStarted(ACTIVITY_ID);

  function escapeText(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function render() {
    if (!host) return;
    host.textContent = '';
    if (mode === 'overview') renderOverview();
    else if (mode === 'profile') renderProfile();
    else if (mode === 'compare') renderCompare();
    else if (mode === 'roles') renderRoles();
    else if (mode === 'glossary') renderGlossary();
    else if (mode === 'check') renderCheck();
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

  function renderOverview() {
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Overview: eight OCR attacker types</h2>' +
      '<p class="panel-note">' +
      escapeText(types.industryVocabularyNote) +
      '</p>';
    var list = document.createElement('ul');
    list.className = 'section-list';
    types.attackers.forEach(function (attacker, index) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary';
      btn.textContent = attacker.name;
      btn.addEventListener('click', function () {
        mode = 'profile';
        profileIndex = index;
        render();
      });
      li.appendChild(btn);
      li.appendChild(document.createTextNode(' — ' + attacker.definition));
      list.appendChild(li);
    });
    panel.appendChild(list);
    var actions = document.createElement('div');
    actions.className = 'w3-actions';
    actions.appendChild(navButton('Open first profile', 'profile', { index: 0 }));
    actions.appendChild(navButton('Comparison view', 'compare'));
    actions.appendChild(navButton('Northbank insider roles', 'roles'));
    actions.appendChild(navButton('Key terms', 'glossary'));
    actions.appendChild(navButton('Knowledge check (8 marks)', 'check'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderProfile() {
    var attacker = types.attackers[profileIndex];
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<p class="panel-note" aria-live="polite">Profile ' +
      (profileIndex + 1) +
      ' of ' +
      types.attackers.length +
      '</p>' +
      '<h2>' +
      escapeText(attacker.name) +
      '</h2>' +
      '<p>' +
      escapeText(attacker.definition) +
      '</p>' +
      '<ul class="section-list">' +
      '<li><strong>Motivation:</strong> ' +
      escapeText(attacker.motivation) +
      '</li>' +
      '<li><strong>Typical skill level:</strong> ' +
      escapeText(attacker.skillLevel) +
      '</li>' +
      '<li><strong>Likely targets:</strong> ' +
      escapeText(attacker.likelyTargets) +
      '</li>' +
      '<li><strong>Common methods:</strong> ' +
      escapeText(attacker.commonMethods.join('; ')) +
      '</li>' +
      '<li><strong>Useful evidence:</strong> ' +
      escapeText(attacker.evidence.join('; ')) +
      '</li>' +
      '<li><strong>Often confused with:</strong> ' +
      escapeText(attacker.confusedWith) +
      '</li>' +
      '<li><strong>Misconception:</strong> ' +
      escapeText(attacker.misconception) +
      '</li>' +
      '<li><strong>Northbank example:</strong> ' +
      escapeText(attacker.northbankExample) +
      '</li></ul>';
    var actions = document.createElement('div');
    actions.className = 'w3-actions';
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
      profileIndex === types.attackers.length - 1
        ? 'Finish profiles'
        : 'Next';
    next.addEventListener('click', function () {
      if (profileIndex === types.attackers.length - 1) mode = 'compare';
      else profileIndex += 1;
      render();
    });
    actions.appendChild(prev);
    actions.appendChild(next);
    actions.appendChild(navButton('Overview', 'overview'));
    actions.appendChild(navButton('Knowledge check', 'check'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderCompare() {
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML = '<h2>Comparison view</h2><p class="panel-note">These distinctions matter in OCR answers because command words expect precise attacker types supported by scenario evidence.</p>';
    types.comparisons.forEach(function (item) {
      var block = document.createElement('div');
      block.className = 'w3-review-item';
      var left = types.getById(item.left);
      var right =
        item.right === 'external-attacker'
          ? { name: 'External attacker' }
          : types.getById(item.right);
      block.innerHTML =
        '<h3>' +
        escapeText((left && left.name) || item.left) +
        ' versus ' +
        escapeText((right && right.name) || item.right) +
        '</h3><p>' +
        escapeText(item.whyItMatters) +
        '</p>';
      panel.appendChild(block);
    });
    var actions = document.createElement('div');
    actions.className = 'w3-actions';
    actions.appendChild(navButton('Northbank insider roles', 'roles'));
    actions.appendChild(navButton('Knowledge check', 'check'));
    actions.appendChild(navButton('Overview', 'overview'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderRoles() {
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Northbank insider threat analysis</h2>' +
      '<p class="w3-callout" role="note"><strong>Important:</strong> Holding legitimate access does not make a person suspicious. Focus on risk, permissions and least privilege.</p>';
    types.northbankRoles.forEach(function (role) {
      var details = document.createElement('details');
      details.className = 'session-disclosure';
      details.innerHTML =
        '<summary class="session-disclosure__summary"><span class="session-disclosure__text"><h3 class="session-disclosure__heading">' +
        escapeText(role.role) +
        '</h3></span><span class="session-disclosure__icon" aria-hidden="true"></span></summary>' +
        '<div class="session-disclosure__content"><ul class="section-list">' +
        '<li><strong>Legitimate access:</strong> ' +
        escapeText(role.legitimateAccess) +
        '</li>' +
        '<li><strong>Systems within reach:</strong> ' +
        escapeText(role.reachableSystems) +
        '</li>' +
        '<li><strong>Misuse risk:</strong> ' +
        escapeText(role.misuseRisk) +
        '</li>' +
        '<li><strong>Negligent risk:</strong> ' +
        escapeText(role.negligentRisk) +
        '</li>' +
        '<li><strong>Detection difficulty:</strong> ' +
        escapeText(role.detectionDifficulty) +
        '</li>' +
        '<li><strong>Least-privilege control:</strong> ' +
        escapeText(role.leastPrivilegeControl) +
        '</li></ul></div>';
      panel.appendChild(details);
    });
    var actions = document.createElement('div');
    actions.className = 'w3-actions';
    actions.appendChild(navButton('Knowledge check', 'check'));
    actions.appendChild(navButton('Overview', 'overview'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderGlossary() {
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Key terms</h2><ul class="section-list">' +
      '<li><strong>Attacker type</strong> — OCR category such as phisher or insider.</li>' +
      '<li><strong>Motivation</strong> — why the attacker acts.</li>' +
      '<li><strong>Capability</strong> — skill and resources available.</li>' +
      '<li><strong>Target</strong> — who or what is attacked.</li>' +
      '<li><strong>Method</strong> — how the attack is carried out.</li>' +
      '<li><strong>Evidence</strong> — scenario details that support a classification.</li>' +
      '<li><strong>Authorisation</strong> — permission to test or access.</li>' +
      '<li><strong>Legitimate access</strong> — access granted for a job role.</li>' +
      '</ul>';
    var actions = document.createElement('div');
    actions.className = 'w3-actions';
    actions.appendChild(navButton('Overview', 'overview'));
    actions.appendChild(navButton('Knowledge check', 'check'));
    panel.appendChild(actions);
    host.appendChild(panel);
  }

  function renderCheck() {
    host.textContent = '';
    if (!window.Unit3Week3Quiz) {
      host.textContent = 'Quiz engine failed to load.';
      return;
    }
    window.Unit3Week3Quiz.createQuiz({
      activityId: ACTIVITY_ID,
      questions: data.knowledgeCheck.slice(),
      hostId: 'w3-learning-host',
      onComplete: function (result) {
        window.Unit3Week3Submit.renderSubmitPanel({
          activityId: ACTIVITY_ID,
          hostId: 'w3-submit-host',
          getScore: function () {
            return result.score;
          },
          getTotal: function () {
            return data.total;
          },
          getCompletionTimeSeconds: function () {
            return (
              result.completionTimeSeconds ||
              Math.max(1, Math.round((Date.now() - startedAt) / 1000))
            );
          },
          canSubmit: function () {
            return true;
          }
        });
      }
    });
  }

  render();
})();
