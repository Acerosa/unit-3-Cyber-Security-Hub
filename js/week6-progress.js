/**
 * Week 6 progress and draft storage.
 * Uses a separate root key from Weeks 1 to 5.
 */

(function (global) {
  'use strict';

  var ROOT_KEY = 'unit3-week6-progress';

  var ACTIVITY_CATALOG = Object.freeze([
    Object.freeze({
      activityId: 'week6-lo2-diagnostic',
      number: 1,
      title: 'LO2 Diagnostic Retrieval',
      description:
        'Formative diagnostic across LO2 sections 2.1 to 2.6. Identify two weakest topics as revision priorities.',
      type: 'Diagnostic quiz',
      estimatedMinutes: 20,
      session: 1,
      total: 12,
      path: 'lo2-diagnostic/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-ethical-learning',
      number: 2,
      title: 'Ethical Considerations Learning',
      description:
        'Responsible disclosure, employee monitoring, ethical hacking and the boundary with authorisation.',
      type: 'Guided learning',
      estimatedMinutes: 30,
      session: 1,
      total: 6,
      path: 'ethical-learning/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-ethical-classification',
      number: 3,
      title: 'Ethical, Unlawful, Both or Neither',
      description:
        'Classify actions as unethical, unlawful, both or neither, with feedback that separates ethics from law.',
      type: 'Classification',
      estimatedMinutes: 25,
      session: 1,
      total: 8,
      path: 'ethical-classification/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-legislation-learning',
      number: 4,
      title: 'United Kingdom Legislation Learning',
      description:
        'Computer Misuse Act 1990, current UK data protection legislation and Police and Justice Act 2006 amendments.',
      type: 'Guided learning',
      estimatedMinutes: 30,
      session: 1,
      total: 6,
      path: 'legislation-learning/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-legislation-matching',
      number: 5,
      title: 'Legislation Scenario Matching',
      description:
        'Match six situations to the relevant legislation and the relevant duty or offence.',
      type: 'Matching',
      estimatedMinutes: 25,
      session: 1,
      total: 6,
      path: 'legislation-matching/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-operational-considerations',
      number: 6,
      title: 'Operational Considerations',
      description:
        'Cost, staff time, downtime, usability and lost productivity trade-offs for Northbank security measures.',
      type: 'Scenario analysis',
      estimatedMinutes: 30,
      session: 1,
      total: 7,
      path: 'operational-considerations/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-government-initiatives',
      number: 7,
      title: 'Government Cyber Security Initiatives',
      description:
        'United Kingdom Cyber Security Strategy, Cyber Essentials, 10 Steps to Cyber Security and Cyber Streetwise.',
      type: 'Guided learning',
      estimatedMinutes: 20,
      session: 1,
      total: 4,
      path: 'government-initiatives/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-ncsc-guidance',
      number: 8,
      title: 'NCSC Exercise in a Box Guidance',
      description:
        'Classroom guidance for the tutor-facilitated insider threat exercise. Companion only; not auto-marked.',
      type: 'Facilitated companion',
      estimatedMinutes: 15,
      session: 1,
      total: 4,
      path: 'ncsc-guidance/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-exercise-decision-record',
      number: 9,
      title: 'Exercise Decision Record',
      description:
        'Record containment and notification decisions during the tutor-facilitated exercise, with ethical, legal and operational notes.',
      type: 'Facilitated companion',
      estimatedMinutes: 35,
      session: 1,
      total: 5,
      path: 'exercise-decision-record/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-session1-review',
      number: 10,
      title: 'Session 1 Review',
      description:
        'Distinguish what the law required, what was ethically appropriate and what was operationally practical.',
      type: 'Reflection',
      estimatedMinutes: 15,
      session: 1,
      total: 3,
      path: 'session1-review/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-legislation-retrieval',
      number: 11,
      title: 'Legislation Retrieval Quiz',
      description:
        'Retrieve statute names with duties or offences, and distinguish law from ethics and operational considerations.',
      type: 'Retrieval quiz',
      estimatedMinutes: 15,
      session: 2,
      total: 10,
      path: 'legislation-retrieval/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-employee-monitoring',
      number: 12,
      title: 'Northbank Employee Monitoring Scenario',
      description:
        'Prepare a stakeholder position on how far Northbank should monitor staff after an insider data breach.',
      type: 'Scenario analysis',
      estimatedMinutes: 30,
      session: 2,
      total: 6,
      path: 'employee-monitoring/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-stakeholder-debate',
      number: 13,
      title: 'Stakeholder Debate Preparation',
      description:
        'Structure a debate as speaker, recorder or evidence checker with ethical, legal and operational arguments.',
      type: 'Debate preparation',
      estimatedMinutes: 35,
      session: 2,
      total: 10,
      path: 'stakeholder-debate/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-discuss-learning',
      number: 14,
      title: 'Balanced Discuss Response Learning',
      description:
        'Learn the OCR Discuss structure: issue, supported point, competing consideration, concession and conclusion.',
      type: 'Exam skills',
      estimatedMinutes: 25,
      session: 2,
      total: 5,
      path: 'discuss-learning/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-discuss-planner',
      number: 15,
      title: 'Discuss Response Planner',
      description:
        'Plan a balanced Northbank monitoring response with a clearly labelled concession and justified conclusion.',
      type: 'Exam skills',
      estimatedMinutes: 25,
      session: 2,
      total: 6,
      path: 'discuss-planner/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-ocr-question-practice',
      number: 16,
      title: 'OCR-Style Timed Questions',
      description:
        'Timed OCR-style practice on ethical, legal and operational considerations, including an extended Discuss question.',
      type: 'Exam skills',
      estimatedMinutes: 25,
      session: 2,
      total: 20,
      path: 'ocr-practice/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-answer-improvement',
      number: 17,
      title: 'Marking and Answer Improvement',
      description:
        'Compare a response with the mark scheme, fix moral-for-legal slips and improve balance and conclusion.',
      type: 'Self marking',
      estimatedMinutes: 25,
      session: 2,
      total: 6,
      path: 'answer-improvement/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week6-revision-organiser',
      number: 18,
      title: 'LO2 Revision Organiser',
      description:
        'Organise revision across LO2 sections 2.1 to 2.6, including the two weakest topics from the diagnostic.',
      type: 'Revision',
      estimatedMinutes: 30,
      session: 2,
      total: 6,
      path: 'revision-organiser/',
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

  global.Unit3Week6Progress = {
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
