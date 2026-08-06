/**
 * Week 7 progress and draft storage.
 * Uses a separate root key from Weeks 1 to 6.
 */

(function (global) {
  'use strict';

  var ROOT_KEY = 'unit3-week7-progress';

  var ACTIVITY_CATALOG = Object.freeze([
    Object.freeze({
      activityId: 'week7-session1-retrieval',
      number: 1,
      title: 'Session 1 Retrieval and Prior Learning',
      description:
        'Recall Cyber Essentials, revisit the Week 2 vulnerability register, and activate the difference between threat and vulnerability.',
      type: 'Retrieval',
      estimatedMinutes: 15,
      session: 1,
      total: 6,
      path: 'session1-retrieval/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week7-risk-management-learning',
      number: 2,
      title: 'Cyber Security Risk Management Learning',
      description:
        'Work through the risk-management stages, including mitigate, accept and prioritise decisions with Northbank examples.',
      type: 'Guided learning',
      estimatedMinutes: 30,
      session: 1,
      total: 8,
      path: 'risk-management-learning/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week7-northbank-risk-register',
      number: 3,
      title: 'Northbank Risk Register',
      description:
        'Convert Week 2 vulnerabilities into a risk register with likelihood, impact, cost-benefit reasoning and justified decisions.',
      type: 'Structured register',
      estimatedMinutes: 45,
      session: 1,
      total: 10,
      path: 'risk-register/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week7-testing-methods',
      number: 4,
      title: 'Vulnerability Testing Methods',
      description:
        'Compare penetration testing, fuzzing, security functionality testing and sandboxing, including purpose and limitations.',
      type: 'Guided learning',
      estimatedMinutes: 30,
      session: 1,
      total: 8,
      path: 'testing-methods/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week7-sandbox-observation',
      number: 5,
      title: 'Safe Sandboxing Demonstration Record',
      description:
        'Record observations from the tutor-led sandboxed file-analysis demonstration. No files are executed in the hub.',
      type: 'Observation record',
      estimatedMinutes: 20,
      session: 1,
      total: 4,
      path: 'sandbox-observation/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week7-detection-prevention',
      number: 6,
      title: 'Detection and Prevention Comparison',
      description:
        'Compare intrusion detection and prevention, NIDS, HIDS, DIDS, anomaly-based and signature-based detection, and honeypots.',
      type: 'Guided learning',
      estimatedMinutes: 35,
      session: 1,
      total: 8,
      path: 'detection-prevention/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week7-heightened-threat',
      number: 7,
      title: 'NCSC Heightened Cyber Threat Decision Log',
      description:
        'Facilitated companion for NCSC Exercise in a Box: Heightened cyber threat. Link actions to the risk register.',
      type: 'Facilitated companion',
      estimatedMinutes: 40,
      session: 1,
      total: 5,
      path: 'heightened-threat/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week7-session2-retrieval',
      number: 8,
      title: 'Session 2 Retrieval Quiz',
      description:
        'Low-stakes retrieval on detection versus prevention, testing methods, risk terminology and NIDS versus HIDS.',
      type: 'Retrieval quiz',
      estimatedMinutes: 15,
      session: 2,
      total: 10,
      path: 'session2-retrieval/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week7-testing-matching',
      number: 9,
      title: 'Testing and Monitoring Matching',
      description:
        'Match testing or monitoring measures to situations, justify choices and consider defensible alternatives.',
      type: 'Matching',
      estimatedMinutes: 25,
      session: 2,
      total: 8,
      path: 'testing-matching/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week7-recommendation-practice',
      number: 10,
      title: 'Justified Recommendation Practice',
      description:
        'Build a three-part recommendation: name the measure, explain why it suits Northbank, and state how effectiveness is judged.',
      type: 'Exam skills',
      estimatedMinutes: 25,
      session: 2,
      total: 6,
      path: 'recommendation-practice/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week7-ocr-question-practice',
      number: 11,
      title: 'OCR-Style Timed Questions',
      description:
        'Timed OCR-style practice on risk management, testing methods, detection and prevention, and justified recommendations.',
      type: 'Exam skills',
      estimatedMinutes: 30,
      session: 2,
      total: 20,
      path: 'ocr-practice/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week7-answer-improvement',
      number: 12,
      title: 'Marking and Answer Improvement',
      description:
        'Improve a recommendation that lacks organisational context and a measurable effectiveness criterion.',
      type: 'Self marking',
      estimatedMinutes: 25,
      session: 2,
      total: 6,
      path: 'answer-improvement/',
      scored: true
    })
  ]);

  function emptyActivityState(activityId) {
    return {
      activityId: activityId,
      status: 'not-started',
      score: null,
      total: null,
      attempts: 0,
      submitted: false,
      lastUpdated: null,
      extra: {}
    };
  }

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function saveRoot(root) {
    try {
      localStorage.setItem(ROOT_KEY, JSON.stringify(root));
    } catch (err) {
      /* ignore */
    }
  }

  function getRoot() {
    var root = readJson(ROOT_KEY, null);
    if (!root || typeof root !== 'object') {
      root = { activities: {}, drafts: {}, lastVisitedActivityId: null };
    }
    if (!root.activities || typeof root.activities !== 'object') root.activities = {};
    if (!root.drafts || typeof root.drafts !== 'object') root.drafts = {};
    return root;
  }

  function getCatalogItem(activityId) {
    for (var i = 0; i < ACTIVITY_CATALOG.length; i += 1) {
      if (ACTIVITY_CATALOG[i].activityId === activityId) {
        return ACTIVITY_CATALOG[i];
      }
    }
    return null;
  }

  function getActivityState(activityId) {
    var root = getRoot();
    return root.activities[activityId] || emptyActivityState(activityId);
  }

  function updateActivity(activityId, patch) {
    var root = getRoot();
    var current = root.activities[activityId] || emptyActivityState(activityId);
    var next = Object.assign({}, current, patch || {}, {
      activityId: activityId,
      lastUpdated: new Date().toISOString()
    });
    root.activities[activityId] = next;
    root.lastVisitedActivityId = activityId;
    saveRoot(root);
    return next;
  }

  function markStarted(activityId) {
    var state = getActivityState(activityId);
    if (state.status === 'completed') {
      return updateActivity(activityId, { status: 'completed' });
    }
    return updateActivity(activityId, { status: 'in-progress' });
  }

  function markCompleted(activityId, score, total, extra) {
    var state = getActivityState(activityId);
    return updateActivity(activityId, {
      status: 'completed',
      score: typeof score === 'number' ? score : state.score,
      total: typeof total === 'number' ? total : state.total,
      attempts: (state.attempts || 0) + 1,
      extra: Object.assign({}, state.extra || {}, extra || {})
    });
  }

  function markSubmitted(activityId) {
    return updateActivity(activityId, { submitted: true });
  }

  function setDraft(key, value) {
    var root = getRoot();
    root.drafts[key] = value;
    saveRoot(root);
    return value;
  }

  function getDraft(key) {
    var root = getRoot();
    return root.drafts[key] || null;
  }

  function getCompletionSummary() {
    var completed = 0;
    var started = 0;
    ACTIVITY_CATALOG.forEach(function (item) {
      var state = getActivityState(item.activityId);
      if (state.status === 'completed') completed += 1;
      else if (state.status === 'in-progress') started += 1;
    });
    return {
      total: ACTIVITY_CATALOG.length,
      completed: completed,
      inProgress: started,
      notStarted: ACTIVITY_CATALOG.length - completed - started
    };
  }

  function statusLabel(status) {
    if (status === 'completed') return 'Completed';
    if (status === 'in-progress') return 'In progress';
    return 'Not started';
  }

  function buttonLabel(status) {
    if (status === 'completed') return 'Review';
    if (status === 'in-progress') return 'Continue';
    return 'Start';
  }

  /**
   * Load Week 2 Northbank vulnerability-register entries if present.
   * Does not invent learner answers when the register is empty.
   */
  function loadWeek2VulnerabilityRegister() {
    var key = 'unit3-week2-northbank-vulnerability-register';
    var stored = readJson(key, null);
    if (!stored) return { available: false, entries: [], source: 'none' };
    var entries = [];
    if (Array.isArray(stored)) {
      entries = stored;
    } else if (stored && Array.isArray(stored.entries)) {
      entries = stored.entries;
    } else if (stored && stored.register && Array.isArray(stored.register.entries)) {
      entries = stored.register.entries;
    }
    var usable = entries.filter(function (entry) {
      return entry && (entry.asset || entry.vulnerability || entry.threat);
    });
    return {
      available: usable.length > 0,
      entries: usable,
      source: usable.length > 0 ? 'week2-localStorage' : 'empty'
    };
  }

  global.Unit3Week7Progress = {
    ROOT_KEY: ROOT_KEY,
    ACTIVITY_CATALOG: ACTIVITY_CATALOG,
    getCatalogItem: getCatalogItem,
    getActivityState: getActivityState,
    updateActivity: updateActivity,
    markStarted: markStarted,
    markCompleted: markCompleted,
    markSubmitted: markSubmitted,
    setDraft: setDraft,
    getDraft: getDraft,
    getCompletionSummary: getCompletionSummary,
    statusLabel: statusLabel,
    buttonLabel: buttonLabel,
    loadWeek2VulnerabilityRegister: loadWeek2VulnerabilityRegister
  };
})(window);
