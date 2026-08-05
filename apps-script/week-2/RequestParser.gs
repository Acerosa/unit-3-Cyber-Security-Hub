/**
 * Parses inbound Week 2 submission requests into one normalised object.
 *
 * Supports the simplified Week 2 JSON contract and Collector schema 3.0
 * aliases used by the existing frontend (classGroup, firstName/surname,
 * studentId, maximumScore). Aliases are normalised — they are not stored
 * as duplicate internal properties.
 */

var RequestParser = (function () {
  /**
   * @param {Object} e Apps Script event object
   * @return {{ok: boolean, submission?: Object, errors?: Object[], rawPayload?: string}}
   */
  function parse(e) {
    if (!e) {
      return fail_('request', 'MISSING_REQUEST', 'Request event is missing.');
    }

    var source = extractSource_(e);
    if (!source.ok) {
      return source;
    }

    var data = source.data;
    var rawPayload = source.rawPayload;

    var learnerName = firstNonEmpty_(
      data.learnerName,
      joinName_(data.firstName, data.surname)
    );
    var learnerId = firstNonEmpty_(data.learnerId, data.studentId);
    var groupName = firstNonEmpty_(data.groupName, data.classGroup);
    var activityId = trimString_(data.activityId);
    var activityVersion = trimString_(data.activityVersion) || CONFIG.activityVersion;

    var weekNumber = toIntegerOrNull_(firstDefined_(data.weekNumber, data.week));
    var sessionNumber = resolveSessionNumber_(data, activityId);
    var score = toNumberOrNull_(data.score);
    var total = toNumberOrNull_(firstDefined_(data.total, data.maximumScore));
    var attemptNumber = resolveAttemptNumber_(data);
    var completedAt = trimString_(
      firstNonEmpty_(data.completedAt, data.clientCompletedAt, '')
    );

    var submission = {
      learnerName: learnerName,
      learnerId: learnerId,
      groupName: groupName,
      weekNumber: weekNumber,
      sessionNumber: sessionNumber,
      activityId: activityId,
      activityVersion: activityVersion,
      score: score,
      total: total,
      attemptNumber: attemptNumber,
      completedAt: completedAt,
      // Official timestamp is set by the service at write time.
      serverTimestamp: null,
      submissionKey: '',
      status: 'PENDING'
    };

    return {
      ok: true,
      submission: submission,
      rawPayload: summarisePayload_(rawPayload)
    };
  }

  /**
   * @param {Object} e
   * @return {{ok: boolean, data?: Object, rawPayload?: string, errors?: Object[]}}
   */
  function extractSource_(e) {
    if (e.postData && typeof e.postData.contents === 'string' && e.postData.contents !== '') {
      var contents = e.postData.contents;
      var type = (e.postData.type || '').toLowerCase();

      if (type.indexOf('application/x-www-form-urlencoded') !== -1) {
        return {
          ok: true,
          data: e.parameter || {},
          rawPayload: contents
        };
      }

      try {
        var parsed = JSON.parse(contents);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          return fail_('body', 'INVALID_JSON', 'Request body must be a JSON object.');
        }
        return {
          ok: true,
          data: parsed,
          rawPayload: contents
        };
      } catch (err) {
        Logger.log('RequestParser JSON parse error: ' + err);
        return fail_('body', 'MALFORMED_JSON', 'Request body is not valid JSON.');
      }
    }

    if (e.parameter && Object.keys(e.parameter).length > 0) {
      return {
        ok: true,
        data: e.parameter,
        rawPayload: JSON.stringify(e.parameter)
      };
    }

    return fail_('body', 'MISSING_BODY', 'Request body is missing.');
  }

  function resolveSessionNumber_(data, activityId) {
    var direct = toIntegerOrNull_(
      firstDefined_(data.sessionNumber, data.session)
    );
    if (direct !== null) {
      return direct;
    }

    var sessionName = trimString_(data.sessionName);
    if (sessionName) {
      var match = sessionName.match(/(\d+)/);
      if (match) {
        return toIntegerOrNull_(match[1]);
      }
    }

    var activity = getWeek2Activity_(activityId);
    if (activity && typeof activity.session === 'number') {
      return activity.session;
    }

    return null;
  }

  function resolveAttemptNumber_(data) {
    var attempt = toIntegerOrNull_(data.attemptNumber);
    if (attempt !== null) {
      return attempt;
    }
    // Schema 3.0 sends attemptId (UUID). Treat a first submission as attempt 1
    // unless an explicit attempt number is provided.
    if (trimString_(data.attemptId)) {
      return 1;
    }
    return 1;
  }

  function joinName_(firstName, surname) {
    var parts = [trimString_(firstName), trimString_(surname)].filter(function (part) {
      return part !== '';
    });
    return parts.join(' ');
  }

  function firstNonEmpty_() {
    for (var i = 0; i < arguments.length; i++) {
      var value = trimString_(arguments[i]);
      if (value !== '') {
        return value;
      }
    }
    return '';
  }

  function firstDefined_() {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] !== undefined && arguments[i] !== null && arguments[i] !== '') {
        return arguments[i];
      }
    }
    return undefined;
  }

  function trimString_(value) {
    if (value === undefined || value === null) {
      return '';
    }
    return String(value).replace(/\s+/g, ' ').trim();
  }

  function toIntegerOrNull_(value) {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    if (typeof value === 'number' && isFinite(value) && Math.floor(value) === value) {
      return value;
    }
    var text = String(value).trim();
    if (!/^-?\d+$/.test(text)) {
      return null;
    }
    var parsed = parseInt(text, 10);
    return isNaN(parsed) ? null : parsed;
  }

  function toNumberOrNull_(value) {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    if (typeof value === 'number' && isFinite(value)) {
      return value;
    }
    var text = String(value).trim();
    if (!/^-?\d+(\.\d+)?$/.test(text)) {
      return null;
    }
    var parsed = Number(text);
    return isFinite(parsed) ? parsed : null;
  }

  /**
   * Keeps a short, non-sensitive summary for the errors worksheet.
   */
  function summarisePayload_(rawPayload) {
    var text = String(rawPayload || '');
    if (text.length > 500) {
      return text.substring(0, 500) + '…';
    }
    return text;
  }

  function fail_(field, code, message) {
    return {
      ok: false,
      errors: [
        {
          field: field,
          code: code,
          message: message
        }
      ],
      rawPayload: ''
    };
  }

  return {
    parse: parse
  };
})();
