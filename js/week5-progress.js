/**
 * Week 5 progress and draft storage.
 * Uses a separate root key from Weeks 1 to 4.
 */

(function (global) {
  'use strict';

  var ROOT_KEY = 'unit3-week5-progress';

  var ACTIVITY_CATALOG = Object.freeze([
    Object.freeze({
      activityId: 'week5-session1-retrieval',
      number: 1,
      title: 'Session 1 Retrieval and Homework Harvest',
      description:
        'Shift from Week 4 cause and motivation to Week 5 consequence: who was harmed, what was lost, and whether the harm was immediate or longer term.',
      type: 'Retrieval quiz',
      estimatedMinutes: 15,
      session: 1,
      total: 8,
      path: 'session1-retrieval/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-vulnerability-patterns',
      number: 2,
      title: 'Recognising vulnerability patterns',
      description:
        'Identify common weakness patterns in fictional Northbank examples, explain possible impact, and name a detection check.',
      type: 'Guided learning',
      estimatedMinutes: 25,
      session: 1,
      total: 8,
      path: 'vulnerability-patterns/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-threat-vulnerability-risk',
      number: 3,
      title: 'Vulnerability, threat and risk',
      description:
        'Classify statements as vulnerability, threat or risk, then write one Northbank chain that uses all three terms.',
      type: 'Classification',
      estimatedMinutes: 20,
      session: 1,
      total: 8,
      path: 'threat-vulnerability-risk/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-impacts-learning',
      number: 4,
      title: 'Impacts Learning: Loss, Disruption and Safety',
      description:
        'Learn the OCR impact categories with Northbank examples, learner checks and feedback that separates similar impact types.',
      type: 'Guided learning',
      estimatedMinutes: 35,
      session: 1,
      total: 9,
      path: 'impacts-learning/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-impact-classification',
      number: 5,
      title: 'Loss, Disruption and Safety Classification',
      description:
        'Classify short impact statements, including ambiguous healthcare examples where more than one category may be justified.',
      type: 'Classification',
      estimatedMinutes: 25,
      session: 1,
      total: 8,
      path: 'impact-classification/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-ransomware-companion',
      number: 6,
      title: 'Northbank Ransomware Exercise Companion',
      description:
        'Prepare for the tutor-facilitated NCSC Exercise in a Box ransomware exercise with role cards and a structured decision record.',
      type: 'Facilitated companion',
      estimatedMinutes: 40,
      session: 1,
      total: 4,
      path: 'ransomware-companion/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-exercise-debrief',
      number: 7,
      title: 'Exercise Debrief',
      description:
        'Revisit recorded decisions to identify intended impact reduction, stakeholders, timescale and possible negative effects on others.',
      type: 'Reflection',
      estimatedMinutes: 20,
      session: 1,
      total: 4,
      path: 'exercise-debrief/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-session2-retrieval',
      number: 8,
      title: 'Session 2 Retrieval Quiz',
      description:
        'Rapid retrieval on loss, disruption, safety, stakeholders and immediate versus longer-term consequences.',
      type: 'Retrieval quiz',
      estimatedMinutes: 15,
      session: 2,
      total: 12,
      path: 'session2-retrieval/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-stakeholder-grid',
      number: 9,
      title: 'Stakeholder Impact Grid',
      description:
        'Complete a Northbank ransomware impact grid covering every required stakeholder and all three impact categories with scenario evidence.',
      type: 'Scenario analysis',
      estimatedMinutes: 35,
      session: 2,
      total: 10,
      path: 'stakeholder-grid/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-impact-analysis',
      number: 10,
      title: 'Analysing Rather Than Listing Impacts',
      description:
        'Compare weak and stronger analytical responses, then write immediate and six-month impact sentences for Northbank.',
      type: 'Exam skills',
      estimatedMinutes: 25,
      session: 2,
      total: 6,
      path: 'impact-analysis/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-controls-matching',
      number: 11,
      title: 'Choosing defensive controls',
      description:
        'Match Northbank situations to patching, access control, input handling, secrets hygiene or detection, then justify one recommendation.',
      type: 'Classification',
      estimatedMinutes: 25,
      session: 2,
      total: 8,
      path: 'controls-matching/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-secure-rewrite',
      number: 12,
      title: 'Improving insecure implementations',
      description:
        'Choose a secure alternative for each deliberately insecure training snippet and explain one root-cause fix.',
      type: 'Guided learning',
      estimatedMinutes: 25,
      session: 2,
      total: 6,
      path: 'secure-rewrite/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-ocr-question-practice',
      number: 13,
      title: 'OCR-Style Impact Questions',
      description:
        'Timed OCR-style practice on loss, disruption, safety, stakeholders and an extended analysis question (20 marks).',
      type: 'Exam skills',
      estimatedMinutes: 20,
      session: 2,
      total: 20,
      path: 'ocr-practice/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week5-answer-improvement',
      number: 14,
      title: 'Marking and Answer Improvement',
      description:
        'Mark a response that over-emphasises financial loss, then improve it with safety, stakeholder, evidence and timescale detail.',
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

  global.Unit3Week5Progress = {
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
