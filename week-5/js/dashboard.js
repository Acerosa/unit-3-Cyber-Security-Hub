/**
 * Week 5 landing dashboard.
 */
(function () {
  'use strict';
  var progress = window.Unit3Week5Progress;
  if (!progress) return;

  function statusClass(status) {
    if (status === 'completed') return 'status-label-complete';
    if (status === 'in-progress') return 'status-label-progress';
    return 'status-label-idle';
  }
  function statusMarker(status) {
    if (status === 'completed') return '●';
    if (status === 'in-progress') return '◐';
    return '○';
  }
  function renderCompletion() {
    var host = document.getElementById('w5-completion');
    if (!host) return;
    var summary = progress.getCompletionSummary();
    host.textContent = '';
    var strong = document.createElement('strong');
    strong.textContent = summary.completed + ' of ' + summary.total + ' activities completed';
    host.appendChild(strong);
    var detail = document.createElement('span');
    detail.textContent =
      summary.inProgress + ' in progress · ' + summary.notStarted + ' not started';
    host.appendChild(detail);
  }
  function renderCard(item) {
    var state = progress.getActivityState(item.activityId);
    var article = document.createElement('article');
    article.className = 'hub-card';
    article.setAttribute('aria-labelledby', 'w5-item-' + item.number + '-heading');
    var status = document.createElement('span');
    status.className = 'status-label ' + statusClass(state.status);
    status.setAttribute('role', 'status');
    status.appendChild(
      document.createTextNode(statusMarker(state.status) + ' ' + progress.statusLabel(state.status))
    );
    article.appendChild(status);
    var heading = document.createElement('h3');
    heading.id = 'w5-item-' + item.number + '-heading';
    heading.textContent = item.number + '. ' + item.title;
    article.appendChild(heading);
    var description = document.createElement('p');
    description.textContent = item.description;
    article.appendChild(description);
    var meta = document.createElement('ul');
    meta.className = 'activity-meta';setAuthoredHtml(meta, '<li>Type: ' +
      item.type +
      '</li><li>About ' +
      item.estimatedMinutes +
      ' minutes</li><li>Total: ' +
      item.total +
      '</li>');
    article.appendChild(meta);
    if (state.status === 'completed' && state.score != null) {
      var score = document.createElement('p');
      score.className = 'activity-score';
      score.textContent =
        'Last score: ' + state.score + ' / ' + (state.total != null ? state.total : item.total);
      article.appendChild(score);
    }
    var link = document.createElement('a');
    link.className = 'card-link';
    link.href = item.path;
    link.textContent = progress.buttonLabel(state.status) + ' ' + item.title;
    article.appendChild(link);
    return article;
  }
  function renderSession(sessionNumber, hostId) {
    var host = document.getElementById(hostId);
    if (!host) return;
    host.textContent = '';
    progress.ACTIVITY_CATALOG.filter(function (item) {
      return item.session === sessionNumber;
    }).forEach(function (item) {
      host.appendChild(renderCard(item));
    });
  }
  function renderNcsc() {
    var host = document.getElementById('w5-ncsc-cards');
    if (!host) return;
    host.textContent = '';
    var article = document.createElement('article');
    article.className = 'hub-card w5-thm-card';
    var platform = document.createElement('p');
    platform.className = 'w5-thm-platform';
    platform.textContent = 'NCSC';
    article.appendChild(platform);
    var badge = document.createElement('span');
    badge.className = 'status-label status-label-progress';
    badge.textContent = 'Tutor-facilitated';
    article.appendChild(badge);
    var h = document.createElement('h3');
    h.textContent = 'Responding to a ransomware attack';
    article.appendChild(h);
    var p = document.createElement('p');
    p.textContent =
      'Use the companion workspace to prepare your Northbank role and record decisions. Do not invent exercise prompts; follow the tutor-facilitated NCSC materials.';
    article.appendChild(p);
    var actions = document.createElement('div');
    actions.className = 'w5-actions';
    var companion = document.createElement('a');
    companion.className = 'btn btn-secondary';
    companion.href = 'ransomware-companion/';
    companion.textContent = 'Open companion workspace';
    actions.appendChild(companion);
    var open = document.createElement('a');
    open.className = 'btn btn-primary w5-thm-external-link';
    open.href = 'https://www.ncsc.gov.uk/section/exercise-in-a-box/responding-ransomware-attack';
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.textContent = 'Open NCSC exercise page (opens in a new tab)';
    var icon = document.createElement('span');
    icon.className = 'w5-external-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = ' ↗';
    open.appendChild(icon);
    actions.appendChild(open);
    article.appendChild(actions);
    host.appendChild(article);
  }
  renderCompletion();
  renderSession(1, 'w5-session-1-cards');
  renderSession(2, 'w5-session-2-cards');
  window.addEventListener('unit3:backend-progress', function () {
    renderCompletion();
    renderSession(1, 'w5-session-1-cards');
    renderSession(2, 'w5-session-2-cards');
  });
  renderNcsc();
})();
