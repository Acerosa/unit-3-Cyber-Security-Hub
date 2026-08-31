/**
 * Week 4 landing dashboard.
 */
(function () {
  'use strict';
  var progress = window.Unit3Week4Progress;
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
    var host = document.getElementById('w4-completion');
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
    article.setAttribute('aria-labelledby', 'w4-item-' + item.number + '-heading');
    var status = document.createElement('span');
    status.className = 'status-label ' + statusClass(state.status);
    status.setAttribute('role', 'status');
    status.appendChild(
      document.createTextNode(statusMarker(state.status) + ' ' + progress.statusLabel(state.status))
    );
    article.appendChild(status);
    var heading = document.createElement('h3');
    heading.id = 'w4-item-' + item.number + '-heading';
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
      score.textContent = 'Last score: ' + state.score + ' / ' + (state.total != null ? state.total : item.total);
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
  function renderThm() {
    var data = window.Unit3Week4TryHackMeData;
    var host = document.getElementById('w4-thm-cards');
    var access = document.getElementById('w4-thm-access');
    if (!data || !host) return;
    if (access) {setAuthoredHtml(access, '');
      var note = document.createElement('p');
      note.className = 'w4-callout';
      note.setAttribute('role', 'note');setAuthoredHtml(note, '<strong>Access:</strong> ' + data.accessNotice);
      access.appendChild(note);
      var safety = document.createElement('div');
      safety.className = 'w4-thm-safety';
      safety.setAttribute('role', 'note');setAuthoredHtml(safety, '<h3>Ethical and safety notice</h3><ul class="section-list">' +
        (data.ethicalNotice || [])
          .map(function (item) {
            return '<li>' + item + '</li>';
          })
          .join('') +
        '</ul>');
      access.appendChild(safety);
    }
    host.textContent = '';
    (data.resources || [])
      .filter(function (resource) {
        return resource.deliveryMode === 'in-class';
      })
      .forEach(function (resource) {
        var article = document.createElement('article');
        article.className = 'hub-card w4-thm-card';
        var platform = document.createElement('p');
        platform.className = 'w4-thm-platform';
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
        actions.className = 'w4-actions';
        var view = document.createElement('a');
        view.className = 'btn btn-secondary';
        view.href = resource.path;
        view.textContent = 'View instructions';
        actions.appendChild(view);
        var open = document.createElement('a');
        open.className = 'btn btn-primary w4-thm-external-link';
        open.href = resource.url;
        open.target = '_blank';
        open.rel = 'noopener noreferrer';
        open.textContent = 'Open TryHackMe room (opens in a new tab)';
        var icon = document.createElement('span');
        icon.className = 'w4-external-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = ' ↗';
        open.appendChild(icon);
        actions.appendChild(open);
        article.appendChild(actions);
        host.appendChild(article);
      });
  }
  renderCompletion();
  renderSession(1, 'w4-session-1-cards');
  renderSession(2, 'w4-session-2-cards');
  window.addEventListener('unit3:backend-progress', function () {
    renderCompletion();
    renderSession(1, 'w4-session-1-cards');
    renderSession(2, 'w4-session-2-cards');
  });
  renderThm();
})();
