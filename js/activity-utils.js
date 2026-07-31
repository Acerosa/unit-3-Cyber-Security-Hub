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

  function getOrCreateAttemptId(storageKey) {
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

  function clearAttemptId(storageKey) {
    try {
      sessionStorage.removeItem(storageKey);
    } catch (err) {
      /* sessionStorage may be unavailable */
    }
  }

  global.Unit3ActivityUtils = {
    el: el,
    setStatusMessage: setStatusMessage,
    createAttemptId: createAttemptId,
    getOrCreateAttemptId: getOrCreateAttemptId,
    clearAttemptId: clearAttemptId
  };
})(window);
