/**
 * Week 2 progress and draft storage.
 * Uses a separate root key from Week 1 so progress never overwrites.
 */

(function (global) {
  'use strict';

  var ROOT_KEY = 'unit3-week2-progress';
  var REGISTER_KEY = 'unit3-week2-northbank-vulnerability-register';

  var ACTIVITY_CATALOG = Object.freeze([
    Object.freeze({
      activityId: 'week2-session1-retrieval',
      number: 1,
      title: 'Session 1 Retrieval Quiz',
      description:
        'Recall Week 1 ideas: cyber security, the CIA triad, incident types and why data must be protected.',
      type: 'Retrieval quiz',
      estimatedMinutes: 15,
      session: 1,
      total: 10,
      path: 'session1-retrieval/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week2-threat-vulnerability-learning',
      number: 2,
      title: 'Threats and Vulnerabilities Learning',
      description:
        'Learn how a threat exploits a vulnerability to cause a cyber security incident, with Northbank examples.',
      type: 'Guided learning',
      estimatedMinutes: 20,
      session: 1,
      total: 6,
      path: 'threat-vulnerability-learning/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week2-malware-symptoms',
      number: 3,
      title: 'Malware Categories and Symptoms',
      description:
        'Match malware categories to what they do, how they spread, what users notice and which CIA aims may be affected.',
      type: 'Matching / knowledge check',
      estimatedMinutes: 20,
      session: 1,
      total: 10,
      path: 'malware-symptoms/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week2-threat-vulnerability-sort',
      number: 4,
      title: 'Threat or Vulnerability Sort',
      description:
        'Sort twelve scenario cards into threat or vulnerability, then pair selected vulnerabilities with threats.',
      type: 'Classification',
      estimatedMinutes: 20,
      session: 1,
      total: 12,
      path: 'threat-vulnerability-sort/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week2-vulnerabilities101-reflection',
      number: 5,
      title: 'TryHackMe: Vulnerabilities 101',
      description:
        'Complete the TryHackMe Vulnerabilities 101 room in class, then reflect on one vulnerability and how it could apply to Northbank.',
      type: 'In-class practical / reflection',
      estimatedMinutes: 35,
      session: 1,
      total: 2,
      path: 'vulnerabilities101/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week2-session2-retrieval',
      number: 6,
      title: 'Session 2 Retrieval Quiz',
      description:
        'Check your understanding of threats, vulnerabilities, malware symptoms and vulnerability categories.',
      type: 'Retrieval quiz',
      estimatedMinutes: 15,
      session: 2,
      total: 10,
      path: 'session2-retrieval/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week2-northbank-vulnerability-analysis',
      number: 7,
      title: 'Northbank Vulnerability Analysis',
      description:
        'Analyse five Northbank scenarios: identify the vulnerability, category, threat, likely incident and CIA impact.',
      type: 'Scenario analysis',
      estimatedMinutes: 25,
      session: 2,
      total: 5,
      path: 'northbank-analysis/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week2-six-mark-response-guide',
      number: 8,
      title: 'Six-Mark Response Guide',
      description:
        'Learn Point–Explanation–Contextual link for OCR explain questions, using a Northbank phishing model.',
      type: 'Exam skills',
      estimatedMinutes: 20,
      session: 2,
      total: 3,
      path: 'six-mark-guide/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week2-ocr-question-practice',
      number: 9,
      title: 'OCR-Style Question Practice',
      description:
        'Timed OCR-style questions on Week 2, including one extended six-mark response for peer marking.',
      type: 'Exam practice',
      estimatedMinutes: 35,
      session: 2,
      total: 20,
      path: 'ocr-practice/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week2-peer-marking-answer-improvement',
      number: 10,
      title: 'Peer Marking and Answer Improvement',
      description:
        'Mark your six-mark response against a checklist, note a strength and improvement, then rewrite your answer.',
      type: 'Peer / self-assessment',
      estimatedMinutes: 25,
      session: 2,
      total: 6,
      path: 'peer-marking/',
      scored: true
    }),
    Object.freeze({
      activityId: 'week2-northbank-vulnerability-register',
      number: 11,
      title: 'Northbank Vulnerability Register',
      description:
        'Build five structured register entries that can be extended later for Week 7 risk management.',
      type: 'Practical register',
      estimatedMinutes: 25,
      session: 2,
      total: 5,
      path: 'vulnerability-register/',
      scored: true
    })
  ]);

  function emptyRoot() {
    return {
      version: 1,
      lastVisitedActivityId: null,
      activities: {},
      drafts: {
        ocrExtendedResponse: '',
        peerMarking: null,
        vulnerabilities101: null
      }
    };
  }

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
      console.warn('[Week2Progress] Could not read ' + key, err);
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn('[Week2Progress] Could not write ' + key, err);
      return false;
    }
  }

  function getRoot() {
    var root = readJson(ROOT_KEY, null);
    if (!root || typeof root !== 'object') {
      root = emptyRoot();
      writeJson(ROOT_KEY, root);
    }
    if (!root.activities || typeof root.activities !== 'object') {
      root.activities = {};
    }
    if (!root.drafts || typeof root.drafts !== 'object') {
      root.drafts = emptyRoot().drafts;
    }
    return root;
  }

  function saveRoot(root) {
    return writeJson(ROOT_KEY, root);
  }

  function getCatalogEntry(activityId) {
    for (var i = 0; i < ACTIVITY_CATALOG.length; i += 1) {
      if (ACTIVITY_CATALOG[i].activityId === activityId) {
        return ACTIVITY_CATALOG[i];
      }
    }
    return null;
  }

  function getActivityState(activityId) {
    var root = getRoot();
    if (!root.activities[activityId]) {
      return emptyActivityState(activityId);
    }
    return root.activities[activityId];
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
    return getRoot().drafts[key];
  }

  function getRegister() {
    return readJson(REGISTER_KEY, null);
  }

  function saveRegister(register) {
    return writeJson(REGISTER_KEY, register);
  }

  function clearRegister() {
    try {
      localStorage.removeItem(REGISTER_KEY);
      return true;
    } catch (err) {
      console.warn('[Week2Progress] Could not clear register', err);
      return false;
    }
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

  function buttonLabel(status) {
    if (status === 'completed') return 'Review';
    if (status === 'in-progress') return 'Continue';
    return 'Start';
  }

  function statusLabel(status) {
    if (status === 'completed') return 'Completed';
    if (status === 'in-progress') return 'In progress';
    return 'Not started';
  }

  global.Unit3Week2Progress = {
    ROOT_KEY: ROOT_KEY,
    REGISTER_KEY: REGISTER_KEY,
    ACTIVITY_CATALOG: ACTIVITY_CATALOG,
    getRoot: getRoot,
    getCatalogEntry: getCatalogEntry,
    getActivityState: getActivityState,
    updateActivity: updateActivity,
    markStarted: markStarted,
    markCompleted: markCompleted,
    markSubmitted: markSubmitted,
    setDraft: setDraft,
    getDraft: getDraft,
    getRegister: getRegister,
    saveRegister: saveRegister,
    clearRegister: clearRegister,
    getCompletionSummary: getCompletionSummary,
    buttonLabel: buttonLabel,
    statusLabel: statusLabel
  };
})(window);
