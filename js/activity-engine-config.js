/**
 * Activity engine configuration and submission-service routing.
 *
 * Activity API activities use the generic engine route only.
 * Week 2 local activities submit JSON to the Week 2 Apps Script /exec URL.
 * Collector v3 remains available in js/submissions.js for any legacy callers.
 */

(function (global) {
  'use strict';

  var SUBMISSION_SERVICE = Object.freeze({
    COLLECTOR_V3: 'collector-v3',
    ACTIVITY_API: 'activity-api',
    WEEK2_API: 'week2-api',
    WEEK3_API: 'week3-api',
    WEEK4_API: 'week4-api'
  });

  var ACTIVITY_ENGINE_CONFIG = Object.freeze({
    apiBaseUrl:
      'https://script.google.com/macros/s/AKfycbxXc8_4w2693bv7vyPmxrKFKb_EUGIiiZBefVMyLLPxHJfigxNb2GhhT11gTSNx2GpL/exec',
    week2ApiBaseUrl:
      'https://script.google.com/macros/s/AKfycbzwsxquK34pzICjP0prAL9RBLmi_Bo8qgntJcYCn7QXSxEFQeK5mRbK5QnsUy2Bi3U9pA/exec',
    week3ApiBaseUrl:
      'https://script.google.com/macros/s/AKfycbzWuaLiIzLmqBFXD1EeIht17a8dmeAPrcmLXUugtu9eYFsnyLPJl7zrS-FDnMUuAStt/exec',
    week4ApiBaseUrl:
      'https://script.google.com/macros/s/AKfycbzS3PKvfOcSV-1iDnzjLFXj4R1djZKk91igbcQM6jQ134zZvp37GO-cCC44KB-wPBgL/exec',
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

    // Week 2 local activities submit through the Week 2 Apps Script API.
    'week2-session1-retrieval': SUBMISSION_SERVICE.WEEK2_API,
    'week2-threat-vulnerability-learning': SUBMISSION_SERVICE.WEEK2_API,
    'week2-malware-symptoms': SUBMISSION_SERVICE.WEEK2_API,
    'week2-threat-vulnerability-sort': SUBMISSION_SERVICE.WEEK2_API,
    'week2-vulnerabilities101-reflection': SUBMISSION_SERVICE.WEEK2_API,
    'week2-session2-retrieval': SUBMISSION_SERVICE.WEEK2_API,
    'week2-northbank-vulnerability-analysis': SUBMISSION_SERVICE.WEEK2_API,
    'week2-six-mark-response-guide': SUBMISSION_SERVICE.WEEK2_API,
    'week2-ocr-question-practice': SUBMISSION_SERVICE.WEEK2_API,
    'week2-peer-marking-answer-improvement': SUBMISSION_SERVICE.WEEK2_API,
    'week2-northbank-vulnerability-register': SUBMISSION_SERVICE.WEEK2_API,

    // Week 3 local activities submit through the Week 3 Apps Script API.
    'week3-session1-retrieval': SUBMISSION_SERVICE.WEEK3_API,
    'week3-attacker-types-learning': SUBMISSION_SERVICE.WEEK3_API,
    'week3-attacker-case-matching': SUBMISSION_SERVICE.WEEK3_API,
    'week3-justified-identification': SUBMISSION_SERVICE.WEEK3_API,
    'week3-session2-retrieval': SUBMISSION_SERVICE.WEEK3_API,
    'week3-ocr-question-practice': SUBMISSION_SERVICE.WEEK3_API,
    'week3-peer-marking': SUBMISSION_SERVICE.WEEK3_API,

    // Week 4 local activities submit through the Week 4 Apps Script API (URL deferred).
    'week4-session1-retrieval': SUBMISSION_SERVICE.WEEK4_API,
    'week4-motivations-learning': SUBMISSION_SERVICE.WEEK4_API,
    'week4-targets-methods': SUBMISSION_SERVICE.WEEK4_API,
    'week4-northbank-exposure': SUBMISSION_SERVICE.WEEK4_API,
    'week4-session2-retrieval': SUBMISSION_SERVICE.WEEK4_API,
    'week4-mtm-mapping': SUBMISSION_SERVICE.WEEK4_API,
    'week4-analyse-practice': SUBMISSION_SERVICE.WEEK4_API,
    'week4-ocr-question-practice': SUBMISSION_SERVICE.WEEK4_API,
    'week4-answer-improvement': SUBMISSION_SERVICE.WEEK4_API,
    'week4-ethical-review': SUBMISSION_SERVICE.WEEK4_API
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

  function usesWeek2Api(activityId) {
    return getSubmissionService(activityId) === SUBMISSION_SERVICE.WEEK2_API;
  }

  function usesWeek3Api(activityId) {
    return getSubmissionService(activityId) === SUBMISSION_SERVICE.WEEK3_API;
  }

  function usesWeek4Api(activityId) {
    return getSubmissionService(activityId) === SUBMISSION_SERVICE.WEEK4_API;
  }

  function getWeek2ApiBaseUrl() {
    return ACTIVITY_ENGINE_CONFIG.week2ApiBaseUrl || '';
  }

  function getWeek3ApiBaseUrl() {
    return ACTIVITY_ENGINE_CONFIG.week3ApiBaseUrl || '';
  }

  function getWeek4ApiBaseUrl() {
    return ACTIVITY_ENGINE_CONFIG.week4ApiBaseUrl || '';
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
    usesWeek2Api: usesWeek2Api,
    usesWeek3Api: usesWeek3Api,
    usesWeek4Api: usesWeek4Api,
    getWeek2ApiBaseUrl: getWeek2ApiBaseUrl,
    getWeek3ApiBaseUrl: getWeek3ApiBaseUrl,
    getWeek4ApiBaseUrl: getWeek4ApiBaseUrl,
    resolveRecordType: resolveRecordType,
    isLiveSubmissionEnabled: isLiveSubmissionEnabled
  };
})(window);
