/**
 * Shared Collector v3 submission helpers for Unit 3 activities.
 *
 * Sends schema 3.0 payloads to the existing Google Apps Script /exec endpoint.
 * Attempt numbers are calculated by the collector, not the browser.
 */

(function (global) {
  'use strict';

  var COLLECTOR_URL =
    'https://script.google.com/macros/s/AKfycbwiweqkdfL7SZvJbxBWST_iBgC89_cqsDdNjUfjZZOlyXYSxajec3wAYXiKh93TX5Isuw/exec';

  var COMPLETED_SUFFIX = '-completed';

  function isConfigured(url) {
    return Boolean(
      url &&
        url.indexOf('PASTE_THE_FULL_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE') === -1 &&
        /\/exec\/?$/.test(url)
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

  function getCompletedKey(storageKey) {
    return storageKey + COMPLETED_SUFFIX;
  }

  function isAttemptCompleted(storageKey) {
    try {
      return sessionStorage.getItem(getCompletedKey(storageKey)) === 'true';
    } catch (err) {
      return false;
    }
  }

  function markAttemptCompleted(storageKey) {
    try {
      sessionStorage.setItem(getCompletedKey(storageKey), 'true');
    } catch (err) {
      /* sessionStorage may be unavailable */
    }
  }

  function clearAttemptState(storageKey) {
    try {
      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(getCompletedKey(storageKey));
    } catch (err) {
      /* sessionStorage may be unavailable */
    }
  }

  function getOrCreateAttemptId(storageKey) {
    try {
      if (isAttemptCompleted(storageKey)) {
        return sessionStorage.getItem(storageKey) || createAttemptId();
      }
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

  function beginAttempt(storageKey) {
    clearAttemptState(storageKey);
    var created = createAttemptId();
    try {
      sessionStorage.setItem(storageKey, created);
    } catch (err) {
      /* sessionStorage may be unavailable */
    }
    return created;
  }

  function startNewAttempt(storageKey) {
    clearAttemptState(storageKey);
    return getOrCreateAttemptId(storageKey);
  }

  function formatQuestionsForReview(values) {
    if (!values) return '';
    if (Array.isArray(values)) {
      return values
        .filter(function (n) {
          return Number.isInteger(n);
        })
        .join(',');
    }
    return String(values);
  }

  function buildSchema3Payload(input) {
    var course = input.courseContext || {};
    var activity = input.activity || {};
    var learner = input.learner || {};
    var recordType = input.recordType || 'LIVE';

    return {
      schemaVersion: '3.0',
      recordType: recordType,
      attemptId: input.attemptId,
      academicYear: course.academicYear || '',
      yearGroup: course.yearGroup || '',
      qualificationLevel: course.qualificationLevel || '',
      programme: course.programme || '',
      unitId: course.unitId || '',
      unitName: course.unitName || '',
      unitCode: course.unitCode || '',
      classGroup: learner.classGroup || '',
      studentId: learner.studentId || '',
      firstName: learner.firstName || '',
      surname: learner.surname || '',
      partnerStudentId: learner.partnerStudentId || '',
      partnerFirstName: learner.partnerFirstName || '',
      partnerSurname: learner.partnerSurname || '',
      activityId: activity.activityId || '',
      activityName: activity.activityName || '',
      weekNumber: String(activity.weekNumber || ''),
      sessionName: activity.sessionName || '',
      activityType: activity.activityType || '',
      activityVersion: activity.activityVersion || '1.0',
      score: String(input.score),
      maximumScore: String(activity.maximumScore || input.maximumScore || ''),
      questionsForReview: formatQuestionsForReview(input.questionsForReview),
      mostDifficultItem:
        input.mostDifficultItem == null || input.mostDifficultItem === ''
          ? ''
          : String(input.mostDifficultItem),
      reflection: input.reflection == null ? '' : String(input.reflection),
      completionTimeSeconds: String(
        Math.max(1, Math.min(7200, Number(input.completionTimeSeconds) || 1))
      ),
      sourcePage: input.sourcePage || (global.location ? global.location.href : '')
    };
  }

  function validateSchema3Payload(payload, activity) {
    var errors = [];
    if (payload.schemaVersion !== '3.0') errors.push('schemaVersion must be 3.0.');
    if (payload.recordType !== 'LIVE' && payload.recordType !== 'TEST') {
      errors.push('recordType must be LIVE or TEST.');
    }
    if (!payload.attemptId) errors.push('attemptId is required.');
    if (!payload.studentId) errors.push('studentId is required.');
    if (!payload.firstName) errors.push('firstName is required.');
    if (!payload.surname) errors.push('surname is required.');
    if (!payload.classGroup) errors.push('classGroup is required.');
    if (!payload.activityId) errors.push('activityId is required.');
    var max = Number(payload.maximumScore);
    var score = Number(payload.score);
    if (!Number.isInteger(max) || max < 1) errors.push('maximumScore is invalid.');
    if (!Number.isInteger(score) || score < 0 || score > max) {
      errors.push('score must be between 0 and maximumScore.');
    }
    if (activity && activity.allowsPartner && payload.partnerStudentId) {
      if (payload.partnerStudentId === payload.studentId) {
        errors.push('partnerStudentId must differ from studentId.');
      }
    }
    return { valid: errors.length === 0, errors: errors };
  }

  function parseCollectorResponse(html) {
    var text = String(html || '');
    if (/Results received|Submission accepted/i.test(text)) {
      return { success: true, type: 'LIVE', message: 'Results received' };
    }
    if (/Test result received/i.test(text)) {
      return { success: true, type: 'TEST', message: 'Test result received' };
    }
    if (/Duplicate submission|Duplicate attempt/i.test(text)) {
      return { success: false, type: 'DUPLICATE', message: 'Duplicate submission' };
    }
    if (/Submissions are closed/i.test(text)) {
      return { success: false, type: 'CLOSED', message: 'Submissions are closed' };
    }
    if (/Submission not recorded/i.test(text)) {
      var detail = extractUserHtmlMessage(text);
      return {
        success: false,
        type: 'REJECTED',
        message: detail || 'Submission not recorded'
      };
    }
    return { success: false, type: 'UNKNOWN', message: 'Unexpected collector response' };
  }

  function extractUserHtmlMessage(html) {
    var match = html.match(/goog\.script\.init\("((?:\\x[0-9a-fA-F]{2}|\\.|[^"\\])+)"\)/);
    if (!match) return '';
    var decoded = match[1].replace(/\\x([0-9a-fA-F]{2})/g, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });
    var userIdx = decoded.indexOf('userHtml');
    if (userIdx === -1) return '';
    var chunk = decoded
      .substring(userIdx)
      .replace(/\\"/g, '"')
      .replace(/\\n/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return chunk.replace(/^userHtml"\s*:\s*"/, '').slice(0, 260);
  }

  function flattenPayload(payload) {
    var flat = {};
    Object.keys(payload).forEach(function (key) {
      flat[key] = payload[key] == null ? '' : String(payload[key]);
    });
    return flat;
  }

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
    var flat = flattenPayload(payload);
    Object.keys(flat).forEach(function (name) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = flat[name];
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    return true;
  }

  function submitSchema3(input, collectorUrl) {
    var payload = buildSchema3Payload(input);
    var validation = validateSchema3Payload(payload, input.activity);
    if (!validation.valid) {
      return { started: false, errors: validation.errors };
    }
    var started = submitViaForm(payload, collectorUrl);
    return { started: started, payload: payload, errors: started ? [] : ['Submission could not be started.'] };
  }

  global.Unit3Submissions = {
    COLLECTOR_URL: COLLECTOR_URL,
    isConfigured: isConfigured,
    createAttemptId: createAttemptId,
    getOrCreateAttemptId: getOrCreateAttemptId,
    beginAttempt: beginAttempt,
    startNewAttempt: startNewAttempt,
    markAttemptCompleted: markAttemptCompleted,
    clearAttemptState: clearAttemptState,
    isAttemptCompleted: isAttemptCompleted,
    buildSchema3Payload: buildSchema3Payload,
    validateSchema3Payload: validateSchema3Payload,
    parseCollectorResponse: parseCollectorResponse,
    submitViaForm: submitViaForm,
    submitSchema3: submitSchema3,
    formatQuestionsForReview: formatQuestionsForReview
  };
})(window);
