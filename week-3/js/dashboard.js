/**
 * Week 3 landing dashboard.
 */
(function () {
  'use strict';
  var progress = window.Unit3Week3Progress;
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
    var host = document.getElementById('w3-completion');
    if (!host) return;
    var summary = progress.getCompletionSummary();
    host.textContent = '';
    var strong = document.createElement('strong');
    strong.textContent = summary.completed + ' of ' + summary.total + ' activities completed';
    host.appendChild(strong);
    var detail = document.createElement('span');
    detail.textContent = summary.inProgress + ' in progress · ' + summary.notStarted + ' not started';
    host.appendChild(detail);
  }
  function renderCard(item) {
    var state = progress.getActivityState(item.activityId);
    var article = document.createElement('article');
    article.className = 'hub-card';
    article.setAttribute('aria-labelledby', 'w3-item-' + item.number + '-heading');
    var status = document.createElement('span');
    status.className = 'status-label ' + statusClass(state.status);
    status.setAttribute('role', 'status');
    status.appendChild(document.createTextNode(statusMarker(state.status) + ' ' + progress.statusLabel(state.status)));
    article.appendChild(status);
    var heading = document.createElement('h3');
    heading.id = 'w3-item-' + item.number + '-heading';
    heading.textContent = item.number + '. ' + item.title;
    article.appendChild(heading);
    var description = document.createElement('p');
    description.textContent = item.description;
    article.appendChild(description);
    var meta = document.createElement('ul');
    meta.className = 'activity-meta';
    meta.innerHTML = '<li>Type: ' + item.type + '</li><li>About ' + item.estimatedMinutes + ' minutes</li><li>Total: ' + item.total + '</li>';
    article.appendChild(meta);
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
  function renderThm() {
    var data = window.Unit3Week3TryHackMeData;
    var host = document.getElementById('w3-thm-cards');
    var access = document.getElementById('w3-thm-access');
    if (!data || !host) return;
    if (access) {
      access.innerHTML = '';
      var note = document.createElement('p');
      note.className = 'w3-callout';
      note.setAttribute('role', 'note');
      note.innerHTML = '<strong>Access:</strong> ' + data.accessNotice;
      access.appendChild(note);
      var vocab = document.createElement('p');
      vocab.className = 'panel-note';
      vocab.textContent = data.industryVocabularyNote;
      access.appendChild(vocab);
    }
    host.textContent = '';
    (data.resources || []).forEach(function (resource) {
      var article = document.createElement('article');
      article.className = 'hub-card';
      var platform = document.createElement('p');
      platform.className = 'w3-thm-platform';
      platform.textContent = 'TryHackMe';
      article.appendChild(platform);
      var badge = document.createElement('span');
      badge.className = 'status-label status-label-progress';
      badge.textContent = resource.deliveryLabel;
      article.appendChild(badge);
      var h = document.createElement('h3');
      h.textContent = resource.shortTitle;
      article.appendChild(h);
      var p = document.createElement('p');
      p.textContent = resource.purpose;
      article.appendChild(p);
      var actions = document.createElement('div');
      actions.className = 'w3-actions';
      var view = document.createElement('a');
      view.className = 'btn btn-secondary';
      view.href = resource.path;
      view.textContent = 'View instructions';
      actions.appendChild(view);
      var open = document.createElement('a');
      open.className = 'btn btn-primary';
      open.href = resource.url;
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
      open.textContent = 'Open TryHackMe room (opens in a new tab)';
      var icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = ' ↗';
      open.appendChild(icon);
      actions.appendChild(open);
      article.appendChild(actions);
      host.appendChild(article);
    });
  }
  renderCompletion();
  renderSession(1, 'w3-session-1-cards');
  renderSession(2, 'w3-session-2-cards');
  renderThm();
})();
