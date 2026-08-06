/**
 * Serves Week 5 activity content using the Week 1 Activity API contract.
 *
 * Public getActivity responses omit correct answers, mark schemes and tutor notes.
 */

var Week5ActivityDataService = (function () {
  var CONTENT_SCHEMA_VERSION = '1.0';
  var API_VERSION = '1.0';

  var PACK_LOOKUP = {
    WEEK5_PACK_SESSION1_RETRIEVAL: function () {
      return WEEK5_PACK_SESSION1_RETRIEVAL;
    },
    WEEK5_PACK_IMPACTS_LEARNING: function () {
      return WEEK5_PACK_IMPACTS_LEARNING;
    },
    WEEK5_PACK_IMPACT_CLASSIFICATION: function () {
      return WEEK5_PACK_IMPACT_CLASSIFICATION;
    },
    WEEK5_PACK_RANSOMWARE_COMPANION: function () {
      return WEEK5_PACK_RANSOMWARE_COMPANION;
    },
    WEEK5_PACK_EXERCISE_DEBRIEF: function () {
      return WEEK5_PACK_EXERCISE_DEBRIEF;
    },
    WEEK5_PACK_SESSION2_RETRIEVAL: function () {
      return WEEK5_PACK_SESSION2_RETRIEVAL;
    },
    WEEK5_PACK_STAKEHOLDER_GRID: function () {
      return WEEK5_PACK_STAKEHOLDER_GRID;
    },
    WEEK5_PACK_IMPACT_ANALYSIS: function () {
      return WEEK5_PACK_IMPACT_ANALYSIS;
    },
    WEEK5_PACK_OCR_PRACTICE: function () {
      return WEEK5_PACK_OCR_PRACTICE;
    },
    WEEK5_PACK_ANSWER_IMPROVEMENT: function () {
      return WEEK5_PACK_ANSWER_IMPROVEMENT;
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
          'Activity ID is not recognised for Week 5.'
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

    if (action === 'bootstrapSetup') {
      return bootstrapSetup_(requestId, params);
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
    if (action === 'submitAttempt') {
      return submitAttempt_(requestId, body);
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
        build: 'UNIT3-WEEK5-ACTIVITY-API-V1.0',
        contentSchemaVersion: CONTENT_SCHEMA_VERSION,
        resultsSchemaVersion: '3.0',
        apiEnabled: true,
        week: 5,
        service: 'Unit 3 Cyber Security Week 5 API',
        status: 'ok',
        acceptingSubmissions: areWeek5SubmissionsOpen_(),
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
    var activities = getWeek5ManifestIds_().map(function (id) {
      var entry = getWeek5ManifestEntry_(id);
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
      weekNumber: 5,
      activities: activities
    };
  }

  function getPackByActivityId_(activityId) {
    var entry = getWeek5ManifestEntry_(activityId);
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
        completionMessage: pack.meta.completionMessage || ''
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
    var attemptId = String(body.attemptId || '');
    var pack = getPackByActivityId_(activityId);

    if (!pack) {
      return errorEnvelope_(requestId, 'markSection', 'UNKNOWN_ACTIVITY', 'Activity ID is not recognised for Week 5.');
    }
    if (activityVersion && activityVersion !== pack.meta.activityVersion) {
      return errorEnvelope_(
        requestId,
        'markSection',
        'VERSION_MISMATCH',
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

    var missing = [];
    (section.questions || []).forEach(function (question) {
      if (question.required === false) {
        return;
      }
      if (!hasAnswer_(question, responseMap[question.questionId])) {
        missing.push(question.questionId);
      }
    });
    if (missing.length) {
      return errorEnvelope_(
        requestId,
        'markSection',
        'RESPONSE_REQUIRED',
        'A required question has not been answered.'
      );
    }

    var results = [];
    var score = 0;
    var maximumScore = 0;
    var questionsForReview = [];

    (section.questions || []).forEach(function (question) {
      var marks = Number(question.marks) || 0;
      maximumScore += marks;
      var assessment = (pack.assessment && pack.assessment[question.questionId]) || {};
      var value = responseMap[question.questionId];
      var item = markQuestion_(question, value, assessment);
      score += item.marksAwarded || 0;
      if (item.status === 'incorrect' || item.status === 'requires-review') {
        questionsForReview.push(question.questionId);
      }
      results.push(item);
    });

    return okEnvelope_(requestId, 'markSection', {
      activityId: activityId,
      activityVersion: pack.meta.activityVersion,
      attemptId: attemptId,
      sectionId: sectionId,
      score: score,
      maximumScore: maximumScore,
      questionsForReview: questionsForReview,
      results: results
    });
  }

  function markQuestion_(question, value, assessment) {
    var marks = Number(question.marks) || 0;
    var autoMark = assessment.autoMark === true;
    var scoringMode = assessment.scoringMode || (autoMark ? 'objective' : 'completion');
    var selectedValue = normaliseSelectedValue_(value);

    if (scoringMode === 'manual') {
      return {
        questionId: question.questionId,
        status: hasText_(value) ? 'completed' : 'requires-review',
        marksAwarded: 0,
        maximumMarks: marks,
        selectedValue: selectedValue,
        correctValue: '',
        feedback: 'This response has been recorded for tutor or peer review.',
        explanation: assessment.explanation || ''
      };
    }

    if (!autoMark || scoringMode === 'completion') {
      var completed = hasAnswer_(question, value);
      return {
        questionId: question.questionId,
        status: completed ? 'completed' : 'requires-review',
        marksAwarded: completed ? marks : 0,
        maximumMarks: marks,
        selectedValue: selectedValue,
        correctValue: '',
        feedback: completed
          ? 'Response recorded.'
          : 'A response is required for this item.',
        explanation: assessment.explanation || ''
      };
    }

    var correctOptionId = assessment.correctOptionId;
    var given = '';
    if (selectedValue != null && typeof selectedValue === 'object' && !Array.isArray(selectedValue)) {
      given = String(selectedValue.optionId || selectedValue.category || selectedValue.value || '');
    } else if (Array.isArray(selectedValue)) {
      given = selectedValue
        .map(function (item) {
          return String(item);
        })
        .filter(function (item, index, arr) {
          return item && arr.indexOf(item) === index;
        })
        .sort()
        .join('|');
    } else {
      given = selectedValue == null ? '' : String(selectedValue);
    }
    var accepted = Array.isArray(assessment.acceptedOptionIds)
      ? assessment.acceptedOptionIds
      : null;
    var isCorrect =
      given !== '' &&
      (given === correctOptionId || (accepted && accepted.indexOf(given) !== -1));
    if (!isCorrect && accepted && given.indexOf('|') !== -1) {
      var parts = given.split('|');
      isCorrect = parts.every(function (part) {
        return accepted.indexOf(part) !== -1;
      });
    }

    if (assessment.requiresEvidence === true && isCorrect) {
      return {
        questionId: question.questionId,
        status: 'requires-review',
        marksAwarded: 0,
        maximumMarks: marks,
        selectedValue: given,
        correctValue: correctOptionId || '',
        feedback:
          'A defensible classification was selected. Supporting evidence is still required for full credit.',
        explanation: assessment.explanation || ''
      };
    }

    return {
      questionId: question.questionId,
      status: isCorrect ? 'correct' : 'incorrect',
      marksAwarded: isCorrect ? marks : 0,
      maximumMarks: marks,
      selectedValue: given,
      correctValue: correctOptionId || '',
      feedback: isCorrect
        ? assessment.feedbackCorrect || 'Correct.'
        : assessment.misconceptionFeedback ||
          assessment.feedbackIncorrect ||
          'Review the explanation and try again next time.',
      explanation: assessment.explanation || ''
    };
  }

  /**
   * Activity API submitAttempt — records a completed attempt into the shared sheets.
   * Response shape matches the Week 1 engine expectations.
   */
  function submitAttempt_(requestId, body) {
    if (!areWeek5SubmissionsOpen_()) {
      return errorEnvelope_(
        requestId,
        'submitAttempt',
        'SUBMISSIONS_CLOSED',
        'Week 5 submissions are currently closed.'
      );
    }

    var activityId = String(body.activityId || '');
    var pack = getPackByActivityId_(activityId);
    if (!pack) {
      return errorEnvelope_(
        requestId,
        'submitAttempt',
        'UNKNOWN_ACTIVITY',
        'Activity ID is not recognised for Week 5.'
      );
    }

    var activityVersion = String(body.activityVersion || '');
    if (activityVersion && activityVersion !== pack.meta.activityVersion) {
      return errorEnvelope_(
        requestId,
        'submitAttempt',
        'VERSION_MISMATCH',
        'Activity version is not accepted.'
      );
    }

    var learner = body.learner || {};
    var score = toNumberOrNull_(body.score);
    if (score === null && Array.isArray(body.sectionScores)) {
      score = body.sectionScores.reduce(function (sum, item) {
        return sum + (Number(item && item.score) || 0);
      }, 0);
    }
    if (score === null && body.totalScore != null) {
      score = toNumberOrNull_(body.totalScore);
    }

    var submission = {
      learnerName:
        joinName_(learner.firstName, learner.surname) ||
        joinName_(body.firstName, body.surname) ||
        trimString_(body.learnerName),
      learnerId: trimString_(learner.studentId || body.studentId || body.learnerId),
      groupName: trimString_(learner.classGroup || body.groupName || body.classGroup),
      weekNumber: CONFIG.weekNumber,
      sessionNumber: pack.meta.sessionNumber,
      activityId: activityId,
      activityVersion: pack.meta.activityVersion,
      score: score,
      total: pack.meta.maximumScore,
      attemptNumber: toIntegerOrNull_(body.attemptNumber) || 1,
      completedAt: trimString_(body.completedAt || ''),
      serverTimestamp: null,
      submissionKey: '',
      status: 'PENDING',
      recordType: String(body.recordType || 'LIVE'),
      attemptId: String(body.attemptId || '')
    };

    var validation = SubmissionValidator.validate(submission);
    if (!validation.valid) {
      try {
        appendRejectedSubmission_(submission, validation.errors, JSON.stringify(body));
      } catch (logErr) {
        Logger.log('submitAttempt rejection log failed: ' + logErr);
      }
      return errorEnvelope_(
        requestId,
        'submitAttempt',
        validation.errors[0] ? validation.errors[0].code : 'INVALID_LEARNER',
        validation.errors[0] ? validation.errors[0].message : 'Submission not recorded.'
      );
    }

    var lock = LockService.getScriptLock();
    var lockAcquired = false;
    try {
      lockAcquired = lock.tryLock(30000);
      if (!lockAcquired) {
        return errorEnvelope_(requestId, 'submitAttempt', 'SERVER_ERROR', 'Could not acquire lock.');
      }

      var duplicate = DuplicateChecker.check(submission);
      submission.submissionKey = duplicate.submissionKey;
      if (duplicate.isDuplicate) {
        return okEnvelope_(requestId, 'submitAttempt', {
          recorded: false,
          duplicate: true,
          recordType: submission.recordType,
          activityId: activityId,
          attemptId: submission.attemptId,
          attemptNumber: submission.attemptNumber,
          score: submission.score,
          maximumScore: submission.total,
          percentage: calculatePercentageSafe_(submission.score, submission.total)
        });
      }

      submission.serverTimestamp = new Date();
      submission.status = 'RECORDED';
      appendSubmission_(submission);
      appendWeek5Result_(submission);

      return okEnvelope_(requestId, 'submitAttempt', {
        recorded: true,
        duplicate: false,
        recordType: submission.recordType,
        activityId: activityId,
        attemptId: submission.attemptId,
        attemptNumber: submission.attemptNumber,
        score: submission.score,
        maximumScore: submission.total,
        percentage: calculatePercentageSafe_(submission.score, submission.total)
      });
    } catch (err) {
      Logger.log('submitAttempt error: ' + err);
      return errorEnvelope_(
        requestId,
        'submitAttempt',
        'RESULTS_UNAVAILABLE',
        'Results could not be saved.'
      );
    } finally {
      if (lockAcquired) {
        lock.releaseLock();
      }
    }
  }

  function bootstrapSetup_(requestId, params) {
    var props = PropertiesService.getScriptProperties();
    if (props.getProperty('WEEK5_BOOTSTRAP_DONE') === 'true') {
      return errorEnvelope_(
        requestId,
        'bootstrapSetup',
        'BOOTSTRAP_DONE',
        'Week 5 bootstrap has already been completed.'
      );
    }
    if (String(params.confirm || '') !== 'Unit3-Week5-Bootstrap-Once') {
      return errorEnvelope_(
        requestId,
        'bootstrapSetup',
        'BOOTSTRAP_FORBIDDEN',
        'Bootstrap confirmation is missing or incorrect.'
      );
    }

    try {
      var summary = runWeek5DeploymentBootstrap();
      props.setProperty('WEEK5_BOOTSTRAP_DONE', 'true');
      return okEnvelope_(requestId, 'bootstrapSetup', summary);
    } catch (err) {
      Logger.log('bootstrapSetup failed: ' + err);
      return errorEnvelope_(
        requestId,
        'bootstrapSetup',
        'BOOTSTRAP_FAILED',
        'Bootstrap failed. Check the Apps Script logs.'
      );
    }
  }

  function hasAnswer_(question, value) {
    if (question.questionType === 'classification') {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Week 4 CIA-style classification object
        if (value.incidentType && value.ciaAim && String(value.evidence || '').trim()) {
          return true;
        }
        // Week 5 impact-category classification object
        if (value.optionId || value.category || value.value) {
          return true;
        }
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value != null && String(value).trim() !== '';
    }
    if (question.questionType === 'single-choice' || question.questionType === 'self-assessment') {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return !!(value.optionId || value.category || value.value);
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value != null && String(value).trim() !== '';
    }
    return hasText_(value);
  }

  function normaliseSelectedValue_(value) {
    if (value == null) {
      return '';
    }
    if (typeof value === 'object') {
      return value;
    }
    return String(value);
  }

  function joinName_(firstName, surname) {
    return [trimString_(firstName), trimString_(surname)]
      .filter(function (part) {
        return part !== '';
      })
      .join(' ');
  }

  function trimString_(value) {
    if (value === undefined || value === null) {
      return '';
    }
    return String(value).replace(/\s+/g, ' ').trim();
  }

  function toNumberOrNull_(value) {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    var parsed = Number(value);
    return isFinite(parsed) ? parsed : null;
  }

  function toIntegerOrNull_(value) {
    var parsed = toNumberOrNull_(value);
    if (parsed === null || Math.floor(parsed) !== parsed) {
      return null;
    }
    return parsed;
  }

  function calculatePercentageSafe_(score, total) {
    if (typeof score !== 'number' || typeof total !== 'number' || total <= 0) {
      return null;
    }
    return Math.round((score / total) * 1000) / 10;
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
      Logger.log('Week5ActivityDataService parse error: ' + err);
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
    buildPublicActivityPayload_: buildPublicActivityPayload_,
    markQuestion_: markQuestion_
  };
})();
