/**
 * Week 4 progress and draft storage.
 * Uses a separate root key from Weeks 1, 2 and 3.
 */

(function (global) {
  'use strict';

  var ROOT_KEY = 'unit3-week4-progress';

  var ACTIVITY_CATALOG = Object.freeze([
    Object.freeze({
      activityId: 'week4-session1-retrieval',
      number: 1,
      title: 'Session 1 Retrieval and Homework Harvest',
      description:
        'Retrieve the eight Week 3 attacker types, then state what one attacker was trying to achieve and the evidence that supports that interpretation.',
      type: 'Retrieval quiz',
      estimatedMinutes: 20,
      session: 1,
      total: 10,
      path: 'session1-retrieval/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week4-motivations-learning',
      number: 2,
      title: 'Motivations for Attack',
      description:
        'Learn the eight OCR attacker motivations, check each with a test question, and separate why from how and what.',
      type: 'Guided learning',
      estimatedMinutes: 30,
      session: 1,
      total: 8,
      path: 'motivations-learning/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week4-targets-methods',
      number: 3,
      title: 'Targets and Methods',
      description:
        'Classify scenarios into motivation (why), target (what) and method (how) across people, organisations, equipment and information.',
      type: 'Classification',
      estimatedMinutes: 25,
      session: 1,
      total: 8,
      path: 'targets-methods/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week4-northbank-exposure',
      number: 4,
      title: 'Northbank Passive-Exposure Reflection',
      description:
        'Identify what a passive reconnaissance sweep could expose about Northbank and which motivations that exposure could serve.',
      type: 'Reflection',
      estimatedMinutes: 20,
      session: 1,
      total: 3,
      path: 'northbank-exposure/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week4-session2-retrieval',
      number: 5,
      title: 'Session 2 Retrieval Quiz',
      description:
        'Classify statements as motivation, target or method and correct cases where a method is mistaken for a motivation.',
      type: 'Retrieval quiz',
      estimatedMinutes: 15,
      session: 2,
      total: 12,
      path: 'session2-retrieval/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week4-mtm-mapping',
      number: 6,
      title: 'Motivation, Target and Method Mapping',
      description:
        'Complete a mapping grid for espionage, hacktivism, ransomware and high-profile defacement scenarios, including one ambiguous case.',
      type: 'Scenario mapping',
      estimatedMinutes: 30,
      session: 2,
      total: 8,
      path: 'mtm-mapping/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week4-analyse-practice',
      number: 7,
      title: 'From Describe to Analyse',
      description:
        'Use annotated model responses and planning templates to practise analysis connectives for a Northbank attractiveness question.',
      type: 'Exam skills',
      estimatedMinutes: 25,
      session: 2,
      total: 6,
      path: 'analyse-practice/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week4-ocr-question-practice',
      number: 8,
      title: 'OCR-Style Question Practice',
      description:
        'Timed OCR-style practice on motivations, targets, methods and an extended analysis question (20 marks).',
      type: 'Exam skills',
      estimatedMinutes: 20,
      session: 2,
      total: 20,
      path: 'ocr-practice/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week4-answer-improvement',
      number: 9,
      title: 'Marking and Answer Improvement',
      description:
        'Mark an extended response against the mark scheme, rewrite a descriptive sentence as analysis, and record one improvement action.',
      type: 'Self marking',
      estimatedMinutes: 25,
      session: 2,
      total: 6,
      path: 'answer-improvement/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week4-ethical-review',
      number: 10,
      title: 'Ethical Review Discussion',
      description:
        'Take a supported position on whether an attack claimed to serve the public good can be justified, without treating claimed motivation as a legal defence.',
      type: 'Discussion',
      estimatedMinutes: 15,
      session: 2,
      total: 2,
      path: 'ethical-review/',
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

  global.Unit3Week4Progress = {
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
    buttonLabel: buttonLabel
  };
})(window);
