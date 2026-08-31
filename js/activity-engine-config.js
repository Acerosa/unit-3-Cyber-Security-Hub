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
    WEEK4_API: 'week4-api',
    WEEK5_API: 'week5-api',
    WEEK6_API: 'week6-api',
    WEEK7_API: 'week7-api'
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
    // Week 5 Apps Script /exec URL - leave empty until the Week 5 API task configures it.
    week5ApiBaseUrl: '',
    // Week 6 Apps Script /exec URL - leave empty until the Week 6 API task configures it.
    week6ApiBaseUrl: '',
    // Week 7 Apps Script /exec URL - leave empty until the Week 7 API task configures it.
    week7ApiBaseUrl: '',
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
      // submitAttempt remains advertised for GAS health/rollback only.
      // Browser final submission uses authenticated api.submit_attempt.
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
    'week4-ethical-review': SUBMISSION_SERVICE.WEEK4_API,

    // Week 5 local activities submit through the Week 5 Apps Script API (URL deferred).
    'week5-session1-retrieval': SUBMISSION_SERVICE.WEEK5_API,
    'week5-vulnerability-patterns': SUBMISSION_SERVICE.WEEK5_API,
    'week5-threat-vulnerability-risk': SUBMISSION_SERVICE.WEEK5_API,
    'week5-impacts-learning': SUBMISSION_SERVICE.WEEK5_API,
    'week5-impact-classification': SUBMISSION_SERVICE.WEEK5_API,
    'week5-ransomware-companion': SUBMISSION_SERVICE.WEEK5_API,
    'week5-exercise-debrief': SUBMISSION_SERVICE.WEEK5_API,
    'week5-session2-retrieval': SUBMISSION_SERVICE.WEEK5_API,
    'week5-stakeholder-grid': SUBMISSION_SERVICE.WEEK5_API,
    'week5-impact-analysis': SUBMISSION_SERVICE.WEEK5_API,
    'week5-controls-matching': SUBMISSION_SERVICE.WEEK5_API,
    'week5-secure-rewrite': SUBMISSION_SERVICE.WEEK5_API,
    'week5-ocr-question-practice': SUBMISSION_SERVICE.WEEK5_API,
    'week5-answer-improvement': SUBMISSION_SERVICE.WEEK5_API,

    // Week 6 local activities submit through the Week 6 Apps Script API (URL deferred).
    'week6-lo2-diagnostic': SUBMISSION_SERVICE.WEEK6_API,
    'week6-ethical-learning': SUBMISSION_SERVICE.WEEK6_API,
    'week6-ethical-classification': SUBMISSION_SERVICE.WEEK6_API,
    'week6-legislation-learning': SUBMISSION_SERVICE.WEEK6_API,
    'week6-legislation-matching': SUBMISSION_SERVICE.WEEK6_API,
    'week6-operational-considerations': SUBMISSION_SERVICE.WEEK6_API,
    'week6-government-initiatives': SUBMISSION_SERVICE.WEEK6_API,
    'week6-ncsc-guidance': SUBMISSION_SERVICE.WEEK6_API,
    'week6-exercise-decision-record': SUBMISSION_SERVICE.WEEK6_API,
    'week6-session1-review': SUBMISSION_SERVICE.WEEK6_API,
    'week6-legislation-retrieval': SUBMISSION_SERVICE.WEEK6_API,
    'week6-employee-monitoring': SUBMISSION_SERVICE.WEEK6_API,
    'week6-stakeholder-debate': SUBMISSION_SERVICE.WEEK6_API,
    'week6-discuss-learning': SUBMISSION_SERVICE.WEEK6_API,
    'week6-discuss-planner': SUBMISSION_SERVICE.WEEK6_API,
    'week6-ocr-question-practice': SUBMISSION_SERVICE.WEEK6_API,
    'week6-answer-improvement': SUBMISSION_SERVICE.WEEK6_API,
    'week6-revision-organiser': SUBMISSION_SERVICE.WEEK6_API,

    // Week 7 local activities submit through the Week 7 Apps Script API (URL deferred).
    'week7-session1-retrieval': SUBMISSION_SERVICE.WEEK7_API,
    'week7-risk-management-learning': SUBMISSION_SERVICE.WEEK7_API,
    'week7-northbank-risk-register': SUBMISSION_SERVICE.WEEK7_API,
    'week7-testing-methods': SUBMISSION_SERVICE.WEEK7_API,
    'week7-sandbox-observation': SUBMISSION_SERVICE.WEEK7_API,
    'week7-detection-prevention': SUBMISSION_SERVICE.WEEK7_API,
    'week7-heightened-threat': SUBMISSION_SERVICE.WEEK7_API,
    'week7-session2-retrieval': SUBMISSION_SERVICE.WEEK7_API,
    'week7-testing-matching': SUBMISSION_SERVICE.WEEK7_API,
    'week7-recommendation-practice': SUBMISSION_SERVICE.WEEK7_API,
    'week7-ocr-question-practice': SUBMISSION_SERVICE.WEEK7_API,
    'week7-answer-improvement': SUBMISSION_SERVICE.WEEK7_API
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

  function usesWeek5Api(activityId) {
    return getSubmissionService(activityId) === SUBMISSION_SERVICE.WEEK5_API;
  }

  function usesWeek6Api(activityId) {
    return getSubmissionService(activityId) === SUBMISSION_SERVICE.WEEK6_API;
  }

  function usesWeek7Api(activityId) {
    return getSubmissionService(activityId) === SUBMISSION_SERVICE.WEEK7_API;
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

  function getWeek5ApiBaseUrl() {
    return ACTIVITY_ENGINE_CONFIG.week5ApiBaseUrl || '';
  }

  function getWeek6ApiBaseUrl() {
    return ACTIVITY_ENGINE_CONFIG.week6ApiBaseUrl || '';
  }

  function getWeek7ApiBaseUrl() {
    return ACTIVITY_ENGINE_CONFIG.week7ApiBaseUrl || '';
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
    usesWeek5Api: usesWeek5Api,
    usesWeek6Api: usesWeek6Api,
    usesWeek7Api: usesWeek7Api,
    getWeek2ApiBaseUrl: getWeek2ApiBaseUrl,
    getWeek3ApiBaseUrl: getWeek3ApiBaseUrl,
    getWeek4ApiBaseUrl: getWeek4ApiBaseUrl,
    getWeek5ApiBaseUrl: getWeek5ApiBaseUrl,
    getWeek6ApiBaseUrl: getWeek6ApiBaseUrl,
    getWeek7ApiBaseUrl: getWeek7ApiBaseUrl,
    resolveRecordType: resolveRecordType,
    isLiveSubmissionEnabled: isLiveSubmissionEnabled
  };
})(window);
