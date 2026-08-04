/**
 * Optional enhancement for reusable session disclosures.
 * Native details/summary work without this script.
 * When present, opens a collapsed disclosure if the URL fragment
 * targets an element inside it.
 */

(function () {
  'use strict';

  function openDisclosureForTarget(target) {
    if (!target || !target.closest) return;
    var details = target.closest('details.session-disclosure');
    if (details && !details.open) {
      details.open = true;
    }
  }

  function handleHash() {
    var id = window.location.hash ? window.location.hash.slice(1) : '';
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    openDisclosureForTarget(target);
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    handleHash();
    window.addEventListener('hashchange', handleHash);
  });
})();
