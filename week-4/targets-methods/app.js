(function () {
  'use strict';

  var data = window.Week4TargetsMethods;
  var progress = window.Unit3Week4Progress;
  if (!data) return;

  var cards = data.classificationItems.slice();
  var placements = {};
  var selectedId = null;
  var finished = false;
  var score = 0;
  var startedAt = Date.now();
  var completionTimeSeconds = 60;

  cards.forEach(function (card) {
    placements[card.id] = 'pool';
  });

  if (progress) progress.markStarted(data.activityId);

  function moveCard(cardId, column) {
    if (finished) return;
    placements[cardId] = column;
    selectedId = cardId;
    render();
  }

  function allClassified() {
    return cards.every(function (card) {
      return data.categories.indexOf(placements[card.id]) !== -1;
    });
  }

  function computeScore() {
    var correct = 0;
    cards.forEach(function (card) {
      if (placements[card.id] === card.correctCategory) correct += 1;
    });
    return correct;
  }

  function incorrectIndexes() {
    var indexes = [];
    cards.forEach(function (card, i) {
      if (placements[card.id] !== card.correctCategory) indexes.push(i + 1);
    });
    return indexes;
  }

  function finish() {
    if (!allClassified()) {
      var feedback = document.getElementById('w4-sort-feedback');
      if (feedback) {
        feedback.textContent = '';
        var warn = document.createElement('p');
        warn.className = 'message message-warning';
        warn.textContent =
          'Classify every statement as motivation, target or method before checking.';
        feedback.appendChild(warn);
        feedback.focus();
      }
      return;
    }
    score = computeScore();
    finished = true;
    completionTimeSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    if (progress) progress.markCompleted(data.activityId, score, data.total);
    render();
    window.Unit3Week4Submit.renderSubmitPanel({
      activityId: data.activityId,
      hostId: 'w4-submit-host',
      getScore: function () {
        return score;
      },
      getTotal: function () {
        return data.total;
      },
      getQuestionsForReview: incorrectIndexes,
      getCompletionTimeSeconds: function () {
        return completionTimeSeconds;
      },
      canSubmit: function () {
        return finished;
      }
    });
  }

  function setupDrag(cardEl, cardId) {
    cardEl.draggable = !finished;
    if (finished) return;
    cardEl.addEventListener('dragstart', function (event) {
      event.dataTransfer.setData('text/plain', cardId);
      cardEl.classList.add('w4-sort-card-dragging');
    });
    cardEl.addEventListener('dragend', function () {
      cardEl.classList.remove('w4-sort-card-dragging');
    });
  }

  function setupDropZone(columnEl, column) {
    columnEl.addEventListener('dragover', function (event) {
      if (finished) return;
      event.preventDefault();
      columnEl.classList.add('w4-sort-column-active');
    });
    columnEl.addEventListener('dragleave', function () {
      columnEl.classList.remove('w4-sort-column-active');
    });
    columnEl.addEventListener('drop', function (event) {
      if (finished) return;
      event.preventDefault();
      columnEl.classList.remove('w4-sort-column-active');
      var cardId = event.dataTransfer.getData('text/plain');
      if (cardId) moveCard(cardId, column);
    });
  }

  function renderCard(card, container) {
    var cardEl = document.createElement('button');
    cardEl.type = 'button';
    cardEl.className = 'w4-sort-card';
    cardEl.textContent = card.statement;
    cardEl.setAttribute('aria-pressed', selectedId === card.id ? 'true' : 'false');
    if (selectedId === card.id) cardEl.classList.add('w4-sort-card-selected');
    cardEl.addEventListener('click', function () {
      if (finished) return;
      selectedId = card.id;
      render();
    });
    setupDrag(cardEl, card.id);
    if (finished) {
      var mark = document.createElement('span');
      mark.className =
        'message message-' +
        (placements[card.id] === card.correctCategory ? 'success' : 'error');
      mark.textContent =
        placements[card.id] === card.correctCategory
          ? ' Correct classification. ' + card.explanation
          : ' Expected ' + card.correctCategory + '. ' + card.explanation;
      cardEl.appendChild(document.createElement('br'));
      cardEl.appendChild(mark);
    }
    container.appendChild(cardEl);
  }

  function renderColumn(title, column, board) {
    var col = document.createElement('div');
    col.className = 'w4-sort-column';
    col.setAttribute('aria-label', title);
    var h = document.createElement('h3');
    h.textContent = title;
    col.appendChild(h);
    setupDropZone(col, column);
    cards
      .filter(function (card) {
        return placements[card.id] === column;
      })
      .forEach(function (card) {
        renderCard(card, col);
      });
    board.appendChild(col);
  }

  function render() {
    var host = document.getElementById('w4-activity-host');
    if (!host) return;
    host.textContent = '';
    var panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML =
      '<h2>Targets and methods</h2>' +
      '<p class="w4-formula" role="note">Why = motivation · What = target · How = method</p>' +
      '<div class="w4-def-grid">' +
      data.targetCategories
        .map(function (cat) {
          return (
            '<article class="w4-def-card"><h3>' +
            cat.term +
            '</h3><p>' +
            cat.explanation +
            '</p><p><strong>Methods:</strong> ' +
            cat.methods.join('; ') +
            '</p></article>'
          );
        })
        .join('') +
      '</div>' +
      '<p class="panel-note">Select a statement, then choose Motivation, Target or Method. Drag and drop is optional; keyboard and buttons are fully supported.</p>';

    var board = document.createElement('div');
    board.className = 'w4-sort-board';
    renderColumn('Unclassified', 'pool', board);
    renderColumn('Motivation (why)', 'motivation', board);
    renderColumn('Target (what)', 'target', board);
    renderColumn('Method (how)', 'method', board);
    panel.appendChild(board);

    if (selectedId && !finished) {
      var moveBar = document.createElement('div');
      moveBar.className = 'w4-actions';
      moveBar.setAttribute('role', 'group');
      moveBar.setAttribute('aria-label', 'Move selected statement');
      ['motivation', 'target', 'method', 'pool'].forEach(function (column) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-secondary';
        btn.textContent =
          column === 'pool'
            ? 'Return to unclassified'
            : 'Move to ' + column;
        btn.addEventListener('click', function () {
          moveCard(selectedId, column);
        });
        moveBar.appendChild(btn);
      });
      panel.appendChild(moveBar);
    }

    var feedback = document.createElement('div');
    feedback.id = 'w4-sort-feedback';
    feedback.className = 'status-messages';
    feedback.setAttribute('aria-live', 'polite');
    feedback.tabIndex = -1;
    if (finished) {
      var summary = document.createElement('p');
      summary.className = 'message message-success';
      summary.textContent = 'Your score: ' + score + ' out of ' + data.total + '.';
      feedback.appendChild(summary);
    }
    panel.appendChild(feedback);

    if (!finished) {
      var actions = document.createElement('div');
      actions.className = 'w4-actions';
      var check = document.createElement('button');
      check.type = 'button';
      check.className = 'btn btn-primary';
      check.textContent = 'Check classifications';
      check.addEventListener('click', finish);
      actions.appendChild(check);
      panel.appendChild(actions);
    }

    host.appendChild(panel);
  }

  render();
})();
