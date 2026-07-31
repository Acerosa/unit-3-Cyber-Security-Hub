/**
 * Shared formative submission helpers for Unit 3 activities.
 *
 * Preserves the existing Google Apps Script collector contract:
 * attemptId, classGroup, pairCode, learner1, learner2, score, totalCards,
 * incorrectCards, hardestCard, justification, completionTime,
 * activityVersion, sourcePage
 *
 * The incident classifier keeps its own COLLECTOR_URL and may continue to
 * submit locally. New activities can reuse submitViaForm safely.
 */

(function (global) {
  'use strict';

  /** Existing Apps Script web app URL ending in /exec */
  var COLLECTOR_URL =
    'https://script.google.com/macros/s/AKfycbz3y931cm-BEu_t_fAo8Eit3tzxxMD_dj4mKIFbjo5U_ySu2jfsUn0Lzp0fS3HRsoyE/exec';

  function isConfigured(url) {
    return Boolean(
      url &&
        url.indexOf('PASTE_THE_FULL_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE') === -1 &&
        /\/exec\/?$/.test(url)
    );
  }

  /**
   * Submit via a dynamically created HTML form (POST, target=_blank).
   * @param {Record<string, string>} payload
   * @param {string} [collectorUrl]
   * @returns {boolean}
   */
  function submitViaForm(payload, collectorUrl) {
    var url = collectorUrl || COLLECTOR_URL;
    if (!isConfigured(url)) {
      return false;
    }

    var form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = '_blank';
    form.acceptCharset = 'UTF-8';
    form.style.display = 'none';

    Object.keys(payload).forEach(function (name) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = payload[name] == null ? '' : String(payload[name]);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    return true;
  }

  global.Unit3Submissions = {
    COLLECTOR_URL: COLLECTOR_URL,
    isConfigured: isConfigured,
    submitViaForm: submitViaForm
  };
})(window);
