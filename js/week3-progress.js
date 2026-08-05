/**
 * Week 3 progress and draft storage.
 * Uses a separate root key from Weeks 1 and 2.
 */

(function (global) {
  'use strict';

  var ROOT_KEY = 'unit3-week3-progress';

  var ACTIVITY_CATALOG = Object.freeze([
    Object.freeze({
      activityId: 'week3-session1-retrieval',
      number: 1,
      title: 'Session 1 Retrieval Quiz',
      description:
        'Check Week 2 threat and vulnerability knowledge and introduce types of attacker.',
      type: 'Retrieval quiz',
      estimatedMinutes: 15,
      session: 1,
      total: 10,
      path: 'session1-retrieval/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week3-attacker-types-learning',
      number: 2,
      title: 'Attacker Types Learning',
      description:
        'Explore the eight OCR attacker types, compare similar types and complete an eight-question knowledge check.',
      type: 'Guided learning',
      estimatedMinutes: 30,
      session: 1,
      total: 8,
      path: 'attacker-types-learning/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week3-attacker-case-matching',
      number: 3,
      title: 'Attacker Case Study Matching',
      description:
        'Match eight anonymised Northbank-related cases to the most likely OCR attacker type using scenario evidence.',
      type: 'Scenario matching',
      estimatedMinutes: 25,
      session: 1,
      total: 8,
      path: 'attacker-case-matching/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week3-justified-identification',
      number: 4,
      title: 'Justified Identification Practice',
      description:
        'Write justified attacker identifications that use evidence and reject a plausible alternative.',
      type: 'Exam skills',
      estimatedMinutes: 30,
      session: 1,
      total: 12,
      path: 'justified-identification/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week3-session2-retrieval',
      number: 5,
      title: 'Session 2 Retrieval Quiz',
      description:
        'Practise distinctions between attacker types, including insider threat and evidence versus stereotype.',
      type: 'Retrieval quiz',
      estimatedMinutes: 20,
      session: 2,
      total: 12,
      path: 'session2-retrieval/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week3-ocr-question-practice',
      number: 6,
      title: 'OCR-Style Question Practice',
      description:
        'Apply identify, describe, explain and justify command words to Week 3 attacker scenarios (20 marks).',
      type: 'Exam skills',
      estimatedMinutes: 20,
      session: 2,
      total: 20,
      path: 'ocr-practice/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week3-peer-marking',
      number: 7,
      title: 'Peer Marking and Answer Improvement',
      description:
        'Mark anonymised sample answers and rewrite a weak sentence using evidence-based attacker identification.',
      type: 'Peer marking',
      estimatedMinutes: 25,
      session: 2,
      total: 6,
      path: 'peer-marking/',
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

  global.Unit3Week3Progress = {
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
