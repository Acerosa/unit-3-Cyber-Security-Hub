/**
 * Serves Week 2 activity content using the Week 1 Activity API contract.
 *
 * Public getActivity responses omit correct answers, mark schemes and tutor notes.
 */

var Week2ActivityDataService = (function () {
  var CONTENT_SCHEMA_VERSION = '1.0';
  var API_VERSION = '1.0';

  var PACK_LOOKUP = {
    WEEK2_PACK_SESSION1_RETRIEVAL: function () {
      return WEEK2_PACK_SESSION1_RETRIEVAL;
    },
    WEEK2_PACK_THREAT_VULN_LEARNING: function () {
      return WEEK2_PACK_THREAT_VULN_LEARNING;
    },
    WEEK2_PACK_MALWARE_SYMPTOMS: function () {
      return WEEK2_PACK_MALWARE_SYMPTOMS;
    },
    WEEK2_PACK_THREAT_VULN_SORT: function () {
      return WEEK2_PACK_THREAT_VULN_SORT;
    },
    WEEK2_PACK_VULNERABILITIES_101: function () {
      return WEEK2_PACK_VULNERABILITIES_101;
    },
    WEEK2_PACK_SESSION2_RETRIEVAL: function () {
      return WEEK2_PACK_SESSION2_RETRIEVAL;
    },
    WEEK2_PACK_NORTHBANK_ANALYSIS: function () {
      return WEEK2_PACK_NORTHBANK_ANALYSIS;
    },
    WEEK2_PACK_SIX_MARK_GUIDE: function () {
      return WEEK2_PACK_SIX_MARK_GUIDE;
    },
    WEEK2_PACK_OCR_PRACTICE: function () {
      return WEEK2_PACK_OCR_PRACTICE;
    },
    WEEK2_PACK_PEER_MARKING: function () {
      return WEEK2_PACK_PEER_MARKING;
    },
    WEEK2_PACK_VULNERABILITY_REGISTER: function () {
      return WEEK2_PACK_VULNERABILITY_REGISTER;
    }
  };

  function handleGet(e) {
    var params = (e && e.parameter) || {};
    var action = String(params.action || 'health');
    var requestId = String(params.requestId || Utilities.getUuid());

    if (action === 'health' || action === '') {
      return healthEnvelope_(requestId);
    }
    if (action === 'manifest') {
      return okEnvelope_(requestId, action, buildManifestPayload_());
    }
    if (action === 'getActivity' || action === 'activity') {
      var activityId = String(params.activityId || '');
      var pack = getPackByActivityId_(activityId);
      if (!pack) {
        return errorEnvelope_(
          requestId,
          action,
          'UNKNOWN_ACTIVITY',
          'Activity ID is not recognised for Week 2.'
        );
      }
      if (pack.meta.enabled === false) {
        return errorEnvelope_(
          requestId,
          action,
          'ACTIVITY_DISABLED',
          'This activity is not currently available.'
        );
      }
      return okEnvelope_(requestId, 'getActivity', buildPublicActivityPayload_(pack));
    }

    return errorEnvelope_(
      requestId,
      action,
      'INVALID_ACTION',
      'Unsupported content action.'
    );
  }

  function handlePost(e) {
    var parsed = parseJsonBody_(e);
    if (!parsed.ok) {
      return errorEnvelope_(
        Utilities.getUuid(),
        'markSection',
        parsed.code,
        parsed.message
      );
    }
    var body = parsed.body;
    var requestId = String(body.requestId || Utilities.getUuid());
    var action = String(body.action || '');

    if (action === 'markSection') {
      return markSection_(requestId, body);
    }

    return null;
  }

  function healthEnvelope_(requestId) {
    return ResponseFactory.apiEnvelope({
      ok: true,
      apiVersion: API_VERSION,
      action: 'health',
      requestId: requestId,
      timestamp: new Date().toISOString(),
      data: {
        build: 'UNIT3-WEEK2-ACTIVITY-API-V1.0',
        contentSchemaVersion: CONTENT_SCHEMA_VERSION,
        resultsSchemaVersion: '3.0',
        apiEnabled: true,
        week: 2,
        service: 'Unit 3 Cyber Security Week 2 API',
        status: 'ok',
        acceptingSubmissions: areWeek2SubmissionsOpen_(),
        supportedActions: ['health', 'manifest', 'getActivity', 'markSection', 'submitAttempt'],
        implementedActions: ['health', 'manifest', 'getActivity', 'markSection', 'submitAttempt'],
        supportedQuestionTypes: [
          'single-choice',
          'classification',
          'short-response',
          'extended-response',
          'reflection',
          'self-assessment'
        ],
        resultsConnected: true
      }
    });
  }

  function buildManifestPayload_() {
    var activities = getWeek2ManifestIds_().map(function (id) {
      var entry = getWeek2ManifestEntry_(id);
      return {
        activityId: entry.activityId,
        activityName: entry.activityName,
        weekNumber: entry.weekNumber,
        sessionNumber: entry.sessionNumber,
        sessionName: entry.sessionName,
        activityType: entry.activityType,
        activityVersion: entry.activityVersion,
        maximumScore: entry.maximumScore,
        enabled: entry.enabled === true,
        allowsPartner: entry.allowsPartner === true,
        componentId: entry.componentId
      };
    });
    return {
      contentSchemaVersion: CONTENT_SCHEMA_VERSION,
      weekNumber: 2,
      activities: activities
    };
  }

  function getPackByActivityId_(activityId) {
    var entry = getWeek2ManifestEntry_(activityId);
    if (!entry) {
      return null;
    }
    var loader = PACK_LOOKUP[entry.packGlobal];
    if (!loader) {
      Logger.log('Missing pack loader for ' + entry.packGlobal);
      return null;
    }
    return loader();
  }

  function buildPublicActivityPayload_(pack) {
    return {
      contentSchemaVersion: CONTENT_SCHEMA_VERSION,
      activity: {
        activityId: pack.meta.activityId,
        activityName: pack.meta.activityName,
        weekNumber: pack.meta.weekNumber,
        sessionName: pack.meta.sessionName,
        activityType: pack.meta.activityType,
        activityVersion: pack.meta.activityVersion,
        maximumScore: pack.meta.maximumScore,
        allowsPartner: pack.meta.allowsPartner === true,
        introduction: pack.meta.introduction || '',
        completionMessage: pack.meta.completionMessage || '',
        componentId: pack.meta.componentId || ''
      },
      sections: (pack.sections || []).map(function (section) {
        return {
          sectionId: section.sectionId,
          sectionType: section.sectionType,
          title: section.title,
          displayOrder: section.displayOrder,
          feedbackTiming: section.feedbackTiming || 'none',
          contentBlocks: (section.contentBlocks || []).map(function (block) {
            return {
              blockId: block.blockId,
              blockType: block.blockType,
              heading: block.heading || '',
              content: block.content || '',
              displayOrder: block.displayOrder || 0
            };
          }),
          questions: (section.questions || []).map(function (question) {
            return sanitisePublicQuestion_(question);
          })
        };
      })
    };
  }

  function sanitisePublicQuestion_(question) {
    return {
      questionId: question.questionId,
      questionType: question.questionType,
      prompt: question.prompt,
      instruction: question.instruction || '',
      marks: question.marks,
      required: question.required !== false,
      displayOrder: question.displayOrder || 0,
      minimumCharacters: question.minimumCharacters || 0,
      maximumCharacters: question.maximumCharacters || 0,
      minimumSelections: question.minimumSelections || 0,
      maximumSelections: question.maximumSelections || 0,
      commandWord: question.commandWord || '',
      options: (question.options || []).map(function (option) {
        return {
          optionId: option.optionId,
          displayOrder: option.displayOrder || 0,
          text: option.text
        };
      })
    };
  }

  function markSection_(requestId, body) {
    var activityId = String(body.activityId || '');
    var sectionId = String(body.sectionId || '');
    var activityVersion = String(body.activityVersion || '');
    var pack = getPackByActivityId_(activityId);

    if (!pack) {
      return errorEnvelope_(requestId, 'markSection', 'UNKNOWN_ACTIVITY', 'Activity ID is not recognised for Week 2.');
    }
    if (activityVersion && activityVersion !== pack.meta.activityVersion) {
      return errorEnvelope_(
        requestId,
        'markSection',
        'VERSION_NOT_ACCEPTED',
        'Activity version is not accepted.'
      );
    }

    var section = findSection_(pack, sectionId);
    if (!section) {
      return errorEnvelope_(requestId, 'markSection', 'UNKNOWN_SECTION', 'Section ID is not recognised.');
    }

    var responses = Array.isArray(body.responses) ? body.responses : [];
    var responseMap = {};
    responses.forEach(function (item) {
      if (item && item.questionId) {
        responseMap[String(item.questionId)] = item.value;
      }
    });

    var results = [];
    var score = 0;
    var maximumScore = 0;

    (section.questions || []).forEach(function (question) {
      var marks = Number(question.marks) || 0;
      maximumScore += marks;
      var assessment = (pack.assessment && pack.assessment[question.questionId]) || {};
      var value = responseMap[question.questionId];
      var item = markQuestion_(question, value, assessment);
      score += item.marksAwarded || 0;
      results.push(item);
    });

    return okEnvelope_(requestId, 'markSection', {
      activityId: activityId,
      sectionId: sectionId,
      score: score,
      maximumScore: maximumScore,
      results: results
    });
  }

  function markQuestion_(question, value, assessment) {
    var marks = Number(question.marks) || 0;
    var autoMark = assessment.autoMark === true;
    var scoringMode = assessment.scoringMode || (autoMark ? 'objective' : 'completion');

    if (scoringMode === 'manual') {
      return {
        questionId: question.questionId,
        status: hasText_(value) ? 'completed' : 'requires-review',
        marksAwarded: 0,
        maximumMarks: marks,
        feedback: 'This response has been recorded for tutor or peer review.',
        explanation: assessment.explanation || '',
        correctValue: ''
      };
    }

    if (!autoMark || scoringMode === 'completion') {
      var completed = hasText_(value) || value === 'YES' || value === true;
      return {
        questionId: question.questionId,
        status: completed ? 'completed' : 'requires-review',
        marksAwarded: completed ? marks : 0,
        maximumMarks: marks,
        feedback: completed
          ? 'Response recorded.'
          : 'A response is required for this item.',
        explanation: assessment.explanation || '',
        correctValue: ''
      };
    }

    var correctOptionId = assessment.correctOptionId;
    var given = value == null ? '' : String(value);
    var isCorrect = given !== '' && given === correctOptionId;
    return {
      questionId: question.questionId,
      status: isCorrect ? 'correct' : 'incorrect',
      marksAwarded: isCorrect ? marks : 0,
      maximumMarks: marks,
      feedback: isCorrect
        ? 'Correct.'
        : assessment.misconceptionFeedback || 'Review the explanation and try again next time.',
      explanation: assessment.explanation || '',
      correctValue: revealOptionText_(question, correctOptionId)
    };
  }

  function revealOptionText_(question, optionId) {
    var options = question.options || [];
    for (var i = 0; i < options.length; i++) {
      if (options[i].optionId === optionId) {
        return options[i].text;
      }
    }
    return optionId || '';
  }

  function findSection_(pack, sectionId) {
    var sections = pack.sections || [];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].sectionId === sectionId) {
        return sections[i];
      }
    }
    return null;
  }

  function hasText_(value) {
    if (value == null) {
      return false;
    }
    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }
    return String(value).replace(/\s+/g, ' ').trim().length > 0;
  }

  function parseJsonBody_(e) {
    if (!e || !e.postData || !e.postData.contents) {
      return { ok: false, code: 'MISSING_BODY', message: 'Request body is missing.' };
    }
    try {
      var body = JSON.parse(e.postData.contents);
      if (!body || typeof body !== 'object') {
        return { ok: false, code: 'INVALID_JSON', message: 'Request body must be a JSON object.' };
      }
      return { ok: true, body: body };
    } catch (err) {
      Logger.log('Week2ActivityDataService parse error: ' + err);
      return { ok: false, code: 'MALFORMED_JSON', message: 'Request body is not valid JSON.' };
    }
  }

  function okEnvelope_(requestId, action, data) {
    return ResponseFactory.apiEnvelope({
      ok: true,
      apiVersion: API_VERSION,
      action: action,
      requestId: requestId,
      timestamp: new Date().toISOString(),
      data: data
    });
  }

  function errorEnvelope_(requestId, action, code, message) {
    return ResponseFactory.apiEnvelope({
      ok: false,
      apiVersion: API_VERSION,
      action: action,
      requestId: requestId,
      timestamp: new Date().toISOString(),
      error: {
        code: code,
        message: message
      }
    });
  }

  /**
   * Tutor-only access for seed/self-checks — never expose via learner GET.
   */
  function getTutorPack_(activityId) {
    return getPackByActivityId_(activityId);
  }

  return {
    handleGet: handleGet,
    handlePost: handlePost,
    getPackByActivityId_: getPackByActivityId_,
    getTutorPack_: getTutorPack_,
    buildPublicActivityPayload_: buildPublicActivityPayload_
  };
})();
