/**
 * Activity engine configuration and submission-service routing.
 *
 * Existing Collector Week 1 activity pages continue to use js/submissions.js.
 * Baseline and OCR Command-Word Guide use the Activity API only through the
 * generic engine route.
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
    // Generic engine pilots (activities/activity.html?activityId=...)
    'U3-W01-BASELINE': SUBMISSION_SERVICE.ACTIVITY_API,
    'U3-W01-COMMAND-WORDS': SUBMISSION_SERVICE.ACTIVITY_API,
    // Existing dedicated Week 1 pages continue to post via js/submissions.js
    'U3-W01-CIA': SUBMISSION_SERVICE.COLLECTOR_V3,
    'U3-W01-INCIDENTS': SUBMISSION_SERVICE.COLLECTOR_V3,
    'U3-W01-GLOSSARY': SUBMISSION_SERVICE.COLLECTOR_V3,
    'U3-W01-RETRIEVAL': SUBMISSION_SERVICE.COLLECTOR_V3
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
