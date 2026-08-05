/**
 * Activity engine configuration and submission-service routing.
 *
 * Activity API activities use the generic engine route only.
 * Collector v3 remains available in js/submissions.js for any legacy callers.
 */

(function (global) {
  'use strict';

  var SUBMISSION_SERVICE = Object.freeze({
    COLLECTOR_V3: 'collector-v3',
    ACTIVITY_API: 'activity-api'
  });

  var ACTIVITY_ENGINE_CONFIG = Object.freeze({
    apiBaseUrl:
      'https://script.google.com/macros/s/AKfycbxXc8_4w2693bv7vyPmxrKFKb_EUGIiiZBefVMyLLPxHJfigxNb2GhhT11gTSNx2GpL/exec',
    apiVersion: '1.0',
    submissionMode: 'TEST',
    allowLiveSubmissions: false,
    requestTimeoutMs: 20000,
    stateStorage: 'session',
    showTechnicalErrors: false,
    requiredHealthActions: Object.freeze([
      'health',
      'getActivity',
      'markSection',
      'submitAttempt'
    ]),
    expectedBuildPrefix: 'UNIT3-ACTIVITY-API'
  });

  /**
   * Explicit activityId -> submission service map.
   * Do not infer the endpoint from page title or folder location.
   */
  var SUBMISSION_ROUTING = Object.freeze({
    // Generic engine (activities/activity.html?activityId=...)
    'U3-W01-BASELINE': SUBMISSION_SERVICE.ACTIVITY_API,
    'U3-W01-CIA': SUBMISSION_SERVICE.ACTIVITY_API,
    'U3-W01-INCIDENTS': SUBMISSION_SERVICE.ACTIVITY_API,
    'U3-W01-COMMAND-WORDS': SUBMISSION_SERVICE.ACTIVITY_API,
    'U3-W01-GLOSSARY': SUBMISSION_SERVICE.ACTIVITY_API,
    'U3-W01-RETRIEVAL': SUBMISSION_SERVICE.ACTIVITY_API,
    'U3-W01-OCR-PRACTICE': SUBMISSION_SERVICE.ACTIVITY_API,
    'U3-W01-PEER-IMPROVEMENT': SUBMISSION_SERVICE.ACTIVITY_API,

    // Week 2 local activities submit through Collector v3 (same spreadsheet workflow).
    'week2-session1-retrieval': SUBMISSION_SERVICE.COLLECTOR_V3,
    'week2-threat-vulnerability-learning': SUBMISSION_SERVICE.COLLECTOR_V3,
    'week2-malware-symptoms': SUBMISSION_SERVICE.COLLECTOR_V3,
    'week2-threat-vulnerability-sort': SUBMISSION_SERVICE.COLLECTOR_V3,
    'week2-vulnerabilities101-reflection': SUBMISSION_SERVICE.COLLECTOR_V3,
    'week2-session2-retrieval': SUBMISSION_SERVICE.COLLECTOR_V3,
    'week2-northbank-vulnerability-analysis': SUBMISSION_SERVICE.COLLECTOR_V3,
    'week2-six-mark-response-guide': SUBMISSION_SERVICE.COLLECTOR_V3,
    'week2-ocr-question-practice': SUBMISSION_SERVICE.COLLECTOR_V3,
    'week2-peer-marking-answer-improvement': SUBMISSION_SERVICE.COLLECTOR_V3,
    'week2-northbank-vulnerability-register': SUBMISSION_SERVICE.COLLECTOR_V3
  });

  function getSubmissionService(activityId) {
    return SUBMISSION_ROUTING[activityId] || null;
  }

  function usesActivityApi(activityId) {
    return getSubmissionService(activityId) === SUBMISSION_SERVICE.ACTIVITY_API;
  }

  function usesCollectorV3(activityId) {
    return getSubmissionService(activityId) === SUBMISSION_SERVICE.COLLECTOR_V3;
  }

  function resolveRecordType() {
    if (
      ACTIVITY_ENGINE_CONFIG.submissionMode === 'LIVE' &&
      ACTIVITY_ENGINE_CONFIG.allowLiveSubmissions === true
    ) {
      return 'LIVE';
    }
    return 'TEST';
  }

  function isLiveSubmissionEnabled() {
    return resolveRecordType() === 'LIVE';
  }

  global.Unit3ActivityEngineConfig = {
    ACTIVITY_ENGINE_CONFIG: ACTIVITY_ENGINE_CONFIG,
    SUBMISSION_SERVICE: SUBMISSION_SERVICE,
    SUBMISSION_ROUTING: SUBMISSION_ROUTING,
    getSubmissionService: getSubmissionService,
    usesActivityApi: usesActivityApi,
    usesCollectorV3: usesCollectorV3,
    resolveRecordType: resolveRecordType,
    isLiveSubmissionEnabled: isLiveSubmissionEnabled
  };
})(window);
