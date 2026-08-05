/**
 * Soft academic-integrity guidance for learning responses.
 * Reminds learners to write in their own words; does not block paste.
 * Excludes learner-details and other opted-out fields.
 */
(function (global) {
  'use strict';

  var NOTICE_ID = 'unit3-academic-integrity-notice';
  var LIVE_ID = 'unit3-academic-integrity-live';
  var FIELD_HINT_CLASS = 'ai-integrity-field-hint';
  var MARK_ATTR = 'data-ai-integrity-enhanced';

  var PAGE_MESSAGE =
    'Write your answers and notes in your own words. Do not paste flags, answer keys, walkthrough answers or copied solution text into this application. Tutors may review responses.';

  var FIELD_MESSAGE =
    'Use your own words. Do not paste flags or copied answers. Tutors may check this response.';

  var PASTE_MESSAGE =
    'Reminder: write in your own words. Do not paste flags or copied answers. Tutors may review what you submit.';

  var pasteTimer = null;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function bodyOptedOut() {
    var body = document.body;
    return (
      !body ||
      body.getAttribute('data-academic-integrity') === 'off' ||
      body.classList.contains('ai-integrity-off')
    );
  }

  function isExcluded(node) {
    if (!node || !node.closest) return true;
    if (node.disabled || node.readOnly) return true;
    if (node.getAttribute('data-academic-integrity') === 'exclude') return true;
    if (
      node.closest(
        '[data-academic-integrity="exclude"], #learner-details-form, .learner-details-form, #ld-partner-block, .partner-details-block'
      )
    ) {
      return true;
    }
    return false;
  }

  function isLearningTextarea(node) {
    return (
      node &&
      node.tagName === 'TEXTAREA' &&
      !isExcluded(node)
    );
  }

  function isLearningTextInput(node) {
    if (!node || node.tagName !== 'INPUT' || isExcluded(node)) return false;
    var type = (node.getAttribute('type') || 'text').toLowerCase();
    if (type !== 'text' && type !== 'search') return false;
    if (type === 'search') return false;
    var maxLength = node.getAttribute('maxlength');
    var className = ' ' + (node.className || '') + ' ';
    if (
      /response|reflection|evidence|extended|justification|rewrite|notes/i.test(
        className + ' ' + (node.id || '') + ' ' + (node.name || '')
      )
    ) {
      return true;
    }
    if (maxLength && Number(maxLength) >= 80) return true;
    return false;
  }

  function isNotesTableInput(node) {
    if (!node || node.tagName !== 'INPUT' || isExcluded(node)) return false;
    var type = (node.getAttribute('type') || 'text').toLowerCase();
    if (type !== 'text') return false;
    return Boolean(
      node.closest(
        '.w2-thm-table, #w2-mal-table-host, .w2-register-table, .w2-register-scroll'
      )
    );
  }

  function considerNode(node, fields) {
    if (!node || node.nodeType !== 1) return;
    if (isLearningTextarea(node) || isLearningTextInput(node) || isNotesTableInput(node)) {
      fields.push(node);
    }
  }

  function collectLearningFields(root) {
    var scope = root || document;
    var fields = [];
    considerNode(scope, fields);
    if (scope.querySelectorAll) {
      scope.querySelectorAll('textarea, input').forEach(function (node) {
        considerNode(node, fields);
      });
    }
    return fields;
  }

  function ensureLiveRegion() {
    var live = document.getElementById(LIVE_ID);
    if (live) return live;
    live = document.createElement('div');
    live.id = LIVE_ID;
    live.className = 'visually-hidden';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    document.body.appendChild(live);
    return live;
  }

  function announcePasteReminder() {
    var live = ensureLiveRegion();
    live.textContent = '';
    global.clearTimeout(pasteTimer);
    pasteTimer = global.setTimeout(function () {
      live.textContent = PASTE_MESSAGE;
    }, 10);
  }

  function insertPageNotice() {
    if (document.getElementById(NOTICE_ID)) return;

    var main = document.getElementById('main-content') || document.querySelector('main');
    if (!main) return;

    var notice = document.createElement('aside');
    notice.id = NOTICE_ID;
    notice.className = 'ai-integrity-notice panel';
    notice.setAttribute('role', 'note');
    notice.setAttribute('aria-labelledby', 'ai-integrity-notice-heading');

    var heading = document.createElement('h2');
    heading.id = 'ai-integrity-notice-heading';
    heading.className = 'ai-integrity-notice__heading';
    heading.textContent = 'Write in your own words';
    notice.appendChild(heading);

    var p = document.createElement('p');
    p.textContent = PAGE_MESSAGE;
    notice.appendChild(p);

    var tutor = document.createElement('p');
    tutor.className = 'panel-note';
    tutor.textContent =
      'Tutors may check responses for pasted flags, answer keys or copied walkthrough text.';
    notice.appendChild(tutor);

    main.insertBefore(notice, main.firstChild);
  }

  function enhanceField(field) {
    if (!field || field.getAttribute(MARK_ATTR) === 'true') return;
    field.setAttribute(MARK_ATTR, 'true');

    // Field-level hints only on textareas to avoid cluttering compact tables.
    if (field.tagName === 'TEXTAREA') {
      var hintId = field.id
        ? field.id + '-ai-integrity-hint'
        : 'ai-integrity-hint-' + Math.random().toString(36).slice(2, 9);
      var existing = document.getElementById(hintId);
      if (!existing) {
        var hint = document.createElement('p');
        hint.id = hintId;
        hint.className = FIELD_HINT_CLASS + ' panel-note';
        hint.textContent = FIELD_MESSAGE;
        if (field.parentNode) {
          field.parentNode.insertBefore(hint, field.nextSibling);
        }
        var describedBy = field.getAttribute('aria-describedby');
        field.setAttribute(
          'aria-describedby',
          describedBy ? describedBy + ' ' + hintId : hintId
        );
      }
    }

    field.addEventListener('paste', function () {
      announcePasteReminder();
    });
  }

  var enhanceTimer = null;

  function enhance(root) {
    if (bodyOptedOut()) return;
    var fields = collectLearningFields(root);
    if (!fields.length) return;
    insertPageNotice();
    fields.forEach(enhanceField);
  }

  function scheduleEnhance() {
    global.clearTimeout(enhanceTimer);
    enhanceTimer = global.setTimeout(function () {
      enhance(document);
    }, 50);
  }

  function observeDynamicFields() {
    if (!global.MutationObserver || !document.body) return;
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var nodes = mutations[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var node = nodes[j];
          if (node.nodeType !== 1) continue;
          if (
            (node.matches && node.matches('textarea, input')) ||
            (node.querySelector && node.querySelector('textarea, input'))
          ) {
            scheduleEnhance();
            return;
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  ready(function () {
    enhance(document);
    observeDynamicFields();
  });

  global.Unit3AcademicIntegrity = {
    enhance: enhance,
    PAGE_MESSAGE: PAGE_MESSAGE,
    FIELD_MESSAGE: FIELD_MESSAGE,
    PASTE_MESSAGE: PASTE_MESSAGE
  };
})(window);
