/**
 * Small reusable helpers for hub activities.
 */

(function (global) {
  'use strict';

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (key === 'className') {
          node.className = value;
        } else if (key === 'textContent') {
          node.textContent = value;
        } else if (key === 'htmlFor') {
          node.htmlFor = value;
        } else if (value !== null && value !== undefined && value !== false) {
          node.setAttribute(key, value === true ? '' : String(value));
        }
      });
    }
    if (children) {
      children.forEach(function (child) {
        if (child === null || child === undefined) {
          return;
        }
        if (typeof child === 'string') {
          node.appendChild(document.createTextNode(child));
        } else {
          node.appendChild(child);
        }
      });
    }
    return node;
  }

  function setStatusMessage(containerId, message, type) {
    var host = document.getElementById(containerId);
    if (!host) {
      return;
    }
    host.textContent = '';
    if (!message) {
      return;
    }
    host.appendChild(
      el('p', {
        className: 'message message-' + (type || 'info'),
        textContent: message
      })
    );
  }

  function createAttemptId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return (
      'attempt-' +
      Date.now().toString(36) +
      '-' +
      Math.random().toString(36).slice(2, 10)
    );
  }

  function clearAttemptId(storageKey) {
    if (global.Unit3Submissions && global.Unit3Submissions.clearAttemptState) {
      global.Unit3Submissions.clearAttemptState(storageKey);
      return;
    }
    try {
      sessionStorage.removeItem(storageKey);
    } catch (err) {
      /* sessionStorage may be unavailable */
    }
  }

  function optionLabel(option) {
    if (option == null) return '';
    if (typeof option === 'string' || typeof option === 'number') return String(option);
    if (typeof option !== 'object') return '';
    var text = option.text != null ? option.text : option.label != null ? option.label : option.name;
    if (text != null && String(text) !== '[object Object]') return String(text);
    var id = option.optionId != null ? option.optionId : option.id;
    return id != null ? String(id) : '';
  }

  function optionId(option, index) {
    if (option && typeof option === 'object') {
      var id = option.optionId != null ? option.optionId : option.id;
      if (id != null && String(id)) return String(id);
    }
    return String((index || 0) + 1);
  }

  function normalizeOption(option, index) {
    var id = optionId(option, index);
    var text = optionLabel(option) || id;
    return {
      optionId: id,
      text: text,
      id: id,
      label: text
    };
  }

  function normalizeMcqQuestion(raw) {
    var source = raw || {};
    var options = (source.options || []).map(function (option, index) {
      return normalizeOption(option, index);
    });
    var correctIndex = typeof source.correctIndex === 'number' ? source.correctIndex : -1;
    if (correctIndex < 0 && source.correctOptionId != null) {
      var wanted = String(source.correctOptionId);
      correctIndex = -1;
      options.forEach(function (option, i) {
        if (correctIndex < 0 && (option.optionId === wanted || option.id === wanted)) {
          correctIndex = i;
        }
      });
    }
    if (typeof correctIndex !== 'number' || isNaN(correctIndex)) {
      correctIndex = -1;
    }
    var explanation =
      source.explanation ||
      (source.feedback && source.feedback.correct) ||
      source.feedbackIncorrect;
    var next = Object.assign({}, source);
    next.options = options;
    next.correctIndex = correctIndex;
    if (explanation) next.explanation = explanation;
    return next;
  }

  function getOrCreateAttemptId(storageKey) {
    if (global.Unit3Submissions && global.Unit3Submissions.getOrCreateAttemptId) {
      return global.Unit3Submissions.getOrCreateAttemptId(storageKey);
    }
    try {
      var existing = sessionStorage.getItem(storageKey);
      if (existing) {
        return existing;
      }
      var created = createAttemptId();
      sessionStorage.setItem(storageKey, created);
      return created;
    } catch (err) {
      return createAttemptId();
    }
  }

  global.Unit3ActivityUtils = {
    el: el,
    setStatusMessage: setStatusMessage,
    optionLabel: optionLabel,
    optionId: optionId,
    normalizeOption: normalizeOption,
    normalizeMcqQuestion: normalizeMcqQuestion,
    createAttemptId: createAttemptId,
    getOrCreateAttemptId: getOrCreateAttemptId,
    clearAttemptId: clearAttemptId
  };
})(window);
