/**
 * Week 2 landing dashboard — renders activity cards from progress catalog.
 */

(function () {
  'use strict';

  var progress = window.Unit3Week2Progress;
  if (!progress) {
    return;
  }

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
    var host = document.getElementById('w2-completion');
    if (!host) return;
    var summary = progress.getCompletionSummary();
    host.textContent = '';
    var strong = document.createElement('strong');
    strong.textContent =
      summary.completed + ' of ' + summary.total + ' activities completed';
    host.appendChild(strong);
    var detail = document.createElement('span');
    detail.textContent =
      summary.inProgress +
      ' in progress · ' +
      summary.notStarted +
      ' not started';
    host.appendChild(detail);
  }

  function renderCard(item) {
    var state = progress.getActivityState(item.activityId);
    var article = document.createElement('article');
    article.className = 'hub-card';
    article.setAttribute('aria-labelledby', 'w2-item-' + item.number + '-heading');

    var status = document.createElement('span');
    status.className = 'status-label ' + statusClass(state.status);
    status.setAttribute('role', 'status');
    var marker = document.createElement('span');
    marker.setAttribute('aria-hidden', 'true');
    marker.textContent = statusMarker(state.status) + ' ';
    status.appendChild(marker);
    status.appendChild(document.createTextNode(progress.statusLabel(state.status)));
    article.appendChild(status);

    var heading = document.createElement('h3');
    heading.id = 'w2-item-' + item.number + '-heading';
    heading.textContent = item.number + '. ' + item.title;
    article.appendChild(heading);

    var description = document.createElement('p');
    description.textContent = item.description;
    article.appendChild(description);

    var meta = document.createElement('ul');
    meta.className = 'activity-meta';
    meta.innerHTML =
      '<li>Type: ' +
      item.type +
      '</li><li>About ' +
      item.estimatedMinutes +
      ' minutes</li>';
    article.appendChild(meta);

    if (state.status === 'completed' && typeof state.score === 'number') {
      var score = document.createElement('p');
      score.className = 'activity-score';
      score.textContent =
        'Score: ' + state.score + ' / ' + (state.total != null ? state.total : item.total);
      article.appendChild(score);
    }

    var link = document.createElement('a');
    link.className = 'card-link';
    link.href = item.path;
    link.textContent =
      progress.buttonLabel(state.status) + ' ' + item.title;
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

  renderCompletion();
  renderSession(1, 'w2-session-1-cards');
  renderSession(2, 'w2-session-2-cards');
  window.addEventListener('unit3:backend-progress', function () {
    renderCompletion();
    renderSession(1, 'w2-session-1-cards');
    renderSession(2, 'w2-session-2-cards');
  });

  if (window.Unit3Week2TryHackMe && window.Unit3Week2TryHackMe.renderLandingSection) {
    window.Unit3Week2TryHackMe.renderLandingSection();
  }
})();
