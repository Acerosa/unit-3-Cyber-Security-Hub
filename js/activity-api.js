/**
 * Activity API client for the generic learner activity engine.
 * Uses the permanent script.google.com /exec URL only.
 */

(function (global) {
  'use strict';

  var configModule = global.Unit3ActivityEngineConfig || {};
  var DEFAULT_TIMEOUT = 20000;

  var ERROR_MESSAGES = Object.freeze({
    API_DISABLED: 'The activity service is temporarily unavailable. Try again later or contact your tutor.',
    ACTIVITY_NOT_FOUND: 'This activity could not be found. Check the link and try again.',
    ACTIVITY_UNPUBLISHED: 'This activity is not available yet.',
    VERSION_MISMATCH: 'This activity version is out of date. Refresh the page and try again.',
    RESPONSE_REQUIRED: 'Answer every required question in this section before checking.',
    INVALID_RESPONSE: 'One or more answers could not be accepted. Check your selections and try again.',
    SUBMISSIONS_CLOSED: 'Submissions are closed for this activity.',
    INVALID_LEARNER: 'Check your Student ID, name and class group, then try again.',
    ATTEMPT_CONFLICT: 'This attempt has already been submitted with different answers. Start another attempt if your tutor asks you to.',
    RESULTS_UNAVAILABLE: 'Results could not be saved. Try again or contact your tutor.',
    NETWORK_ERROR: 'The network request failed. Check your connection and try again.',
    REQUEST_TIMEOUT: 'The request timed out. Try again in a moment.',
    INVALID_ACTION: 'The activity service rejected this request.',
    UNKNOWN: 'Something went wrong. Try again or contact your tutor.'
  });

  function getConfig() {
    return configModule.ACTIVITY_ENGINE_CONFIG || {};
  }

  function createRequestId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return (
      'req-' +
      Date.now().toString(36) +
      '-' +
      Math.random().toString(36).slice(2, 10)
    );
  }

  function learnerMessage(code, fallback) {
    var showTechnical = getConfig().showTechnicalErrors === true;
    var mapped = ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN;
    if (showTechnical && fallback && fallback !== mapped) {
      return mapped + ' (' + fallback + ')';
    }
    return mapped;
  }

  function parseEnvelope(text) {
    var raw = String(text || '').trim();
    if (!raw) {
      throw makeError('NETWORK_ERROR', 'Empty response from the activity service.');
    }
    try {
      return JSON.parse(raw);
    } catch (err) {
      throw makeError('NETWORK_ERROR', 'The activity service returned an unexpected response.');
    }
  }

  function makeError(code, detail) {
    var error = new Error(learnerMessage(code, detail));
    error.code = code;
    error.detail = detail || '';
    error.learnerMessage = error.message;
    return error;
  }

  function withTimeout(promise, timeoutMs) {
    var ms = timeoutMs || getConfig().requestTimeoutMs || DEFAULT_TIMEOUT;
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () {
        reject(makeError('REQUEST_TIMEOUT'));
      }, ms);
      promise.then(
        function (value) {
          clearTimeout(timer);
          resolve(value);
        },
        function (err) {
          clearTimeout(timer);
          reject(err);
        }
      );
    });
  }

  function buildQuery(params) {
    return Object.keys(params)
      .filter(function (key) {
        return params[key] !== undefined && params[key] !== null && params[key] !== '';
      })
      .map(function (key) {
        return (
          encodeURIComponent(key) + '=' + encodeURIComponent(String(params[key]))
        );
      })
      .join('&');
  }

  function request(method, params, bodyObject) {
    var cfg = getConfig();
    var baseUrl = cfg.apiBaseUrl;
    if (!baseUrl || baseUrl.indexOf('/exec') === -1) {
      return Promise.reject(
        makeError('NETWORK_ERROR', 'The activity service is not available.')
      );
    }
    if (baseUrl.indexOf('script.googleusercontent.com') !== -1) {
      return Promise.reject(
        makeError('NETWORK_ERROR', 'Use the permanent script.google.com /exec URL.')
      );
    }

    var requestId = (bodyObject && bodyObject.requestId) || createRequestId();
    var url = baseUrl;
    var init = {
      method: method,
      cache: 'no-store',
      redirect: 'follow',
      credentials: 'omit'
    };

    if (method === 'GET') {
      var query = buildQuery(
        Object.assign(
          {
            apiVersion: cfg.apiVersion || '1.0',
            requestId: requestId
          },
          params || {}
        )
      );
      url = baseUrl + (baseUrl.indexOf('?') === -1 ? '?' : '&') + query;
    } else {
      var payload = Object.assign(
        {
          apiVersion: cfg.apiVersion || '1.0',
          requestId: requestId
        },
        bodyObject || {}
      );
      init.headers = {
        'Content-Type': 'text/plain;charset=utf-8'
      };
      init.body = JSON.stringify(payload);
    }

    return withTimeout(
      fetch(url, init).then(function (response) {
        return response.text().then(function (text) {
          var envelope = parseEnvelope(text);
          if (!envelope.ok) {
            var code =
              (envelope.error && envelope.error.code) || 'UNKNOWN';
            var detail =
              (envelope.error && envelope.error.message) || response.statusText;
            throw makeError(code, detail);
          }
          return envelope;
        });
      }),
      cfg.requestTimeoutMs
    ).catch(function (err) {
      if (err && err.code) throw err;
      if (err && err.name === 'AbortError') throw makeError('REQUEST_TIMEOUT');
      throw makeError('NETWORK_ERROR', err && err.message ? err.message : '');
    });
  }

  function health() {
    return request('GET', { action: 'health' }).then(function (envelope) {
      return envelope.data || {};
    });
  }

  function getActivity(activityId) {
    return request('GET', {
      action: 'getActivity',
      activityId: activityId
    }).then(function (envelope) {
      return envelope.data || {};
    });
  }

  function markSection(payload) {
    return request(
      'POST',
      null,
      Object.assign({ action: 'markSection' }, payload || {})
    ).then(function (envelope) {
      return envelope.data || {};
    });
  }

  function submitAttempt(payload) {
    return request(
      'POST',
      null,
      Object.assign({ action: 'submitAttempt' }, payload || {})
    ).then(function (envelope) {
      return envelope.data || {};
    });
  }

  function validateHealthData(data) {
    var cfg = getConfig();
    var required = cfg.requiredHealthActions || [];
    var implemented = data.implementedActions || data.supportedActions || [];
    var missing = required.filter(function (action) {
      return implemented.indexOf(action) === -1;
    });
    if (data.apiEnabled === false) {
      throw makeError('API_DISABLED');
    }
    if (missing.length) {
      throw makeError(
        'INVALID_ACTION',
        'Missing API actions: ' + missing.join(', ')
      );
    }
    if (data.resultsConnected !== true) {
      throw makeError('RESULTS_UNAVAILABLE');
    }
    return data;
  }

  global.Unit3ActivityApi = {
    createRequestId: createRequestId,
    learnerMessage: learnerMessage,
    health: health,
    getActivity: getActivity,
    markSection: markSection,
    submitAttempt: submitAttempt,
    validateHealthData: validateHealthData
  };
})(window);
