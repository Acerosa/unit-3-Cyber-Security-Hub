/**
 * Shared Unit 3 course context and activity metadata for Collector v3.
 * Values are fixed and must not be editable by learners.
 */

(function (global) {
  'use strict';

  var COURSE_CONTEXT = Object.freeze({
    academicYear: '2026/27',
    yearGroup: 'Year 1',
    qualificationLevel: 'Level 3',
    programme: 'OCR Level 3 IT',
    unitId: 'U3',
    unitName: 'Cyber Security',
    unitCode: 'Y/507/5001',
    unitDisplayName: 'Unit 3 Cyber Security',
    // Add confirmed college class-group codes here when available, e.g. ['IT-L3-A', 'IT-L3-B']
    classGroups: []
  });

  var ACTIVITY_REGISTRY = Object.freeze({
    'U3-W01-BASELINE': Object.freeze({
      activityId: 'U3-W01-BASELINE',
      activityName: 'Baseline Knowledge Check',
      weekNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Diagnostic',
      activityVersion: '1.0',
      maximumScore: 10,
      itemMinimum: 1,
      itemMaximum: 10,
      allowsPartner: false,
      attemptStorageKey: 'unit3-activity-api-state:U3-W01-BASELINE'
    }),
    'U3-W01-CIA': Object.freeze({
      activityId: 'U3-W01-CIA',
      activityName: 'CIA Triad Learning',
      weekNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Guided learning',
      activityVersion: '1.0',
      maximumScore: 15,
      itemMinimum: 1,
      itemMaximum: 12,
      allowsPartner: false,
      attemptStorageKey: 'unit3-activity-api-state:U3-W01-CIA'
    }),
    'U3-W01-INCIDENTS': Object.freeze({
      activityId: 'U3-W01-INCIDENTS',
      activityName: 'Incident Classification',
      weekNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Practical classification',
      activityVersion: '1.0',
      maximumScore: 12,
      itemMinimum: 1,
      itemMaximum: 12,
      allowsPartner: true,
      attemptStorageKey: 'unit3-activity-api-state:U3-W01-INCIDENTS'
    }),
    'U3-W01-GLOSSARY': Object.freeze({
      activityId: 'U3-W01-GLOSSARY',
      activityName: 'Cyber Security Glossary',
      weekNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Knowledge check',
      activityVersion: '1.0',
      maximumScore: 12,
      itemMinimum: 1,
      itemMaximum: 12,
      allowsPartner: false,
      attemptStorageKey: 'unit3-activity-api-state:U3-W01-GLOSSARY'
    }),
    'U3-W01-RETRIEVAL': Object.freeze({
      activityId: 'U3-W01-RETRIEVAL',
      activityName: 'Session 2 Retrieval Quiz',
      weekNumber: 1,
      sessionName: 'Session 2',
      activityType: 'Retrieval quiz',
      activityVersion: '1.0',
      maximumScore: 15,
      itemMinimum: 1,
      itemMaximum: 12,
      allowsPartner: false,
      attemptStorageKey: 'unit3-activity-api-state:U3-W01-RETRIEVAL'
    }),
    'U3-W01-COMMAND-WORDS': Object.freeze({
      activityId: 'U3-W01-COMMAND-WORDS',
      activityName: 'OCR Command-Word Guide',
      weekNumber: 1,
      sessionName: 'Session 2',
      activityType: 'Exam skills',
      activityVersion: '1.0',
      maximumScore: 12,
      itemMinimum: 1,
      itemMaximum: 6,
      allowsPartner: false,
      attemptStorageKey: 'unit3-activity-api-state:U3-W01-COMMAND-WORDS'
    }),
    'U3-W01-OCR-PRACTICE': Object.freeze({
      activityId: 'U3-W01-OCR-PRACTICE',
      activityName: 'OCR-Style Question Practice',
      weekNumber: 1,
      sessionName: 'Session 2',
      activityType: 'Exam skills',
      activityVersion: '1.0',
      maximumScore: 20,
      itemMinimum: 1,
      itemMaximum: 11,
      allowsPartner: false,
      attemptStorageKey: 'unit3-activity-api-state:U3-W01-OCR-PRACTICE'
    }),
    'U3-W01-PEER-IMPROVEMENT': Object.freeze({
      activityId: 'U3-W01-PEER-IMPROVEMENT',
      activityName: 'Peer Marking and Answer Improvement',
      weekNumber: 1,
      sessionName: 'Session 2',
      activityType: 'Reflection',
      activityVersion: '1.0',
      maximumScore: 7,
      itemMinimum: 1,
      itemMaximum: 7,
      allowsPartner: true,
      attemptStorageKey: 'unit3-activity-api-state:U3-W01-PEER-IMPROVEMENT'
    }),

    /* Week 2 — Collector v3 local activities */
    'week2-session1-retrieval': Object.freeze({
      activityId: 'week2-session1-retrieval',
      activityName: 'Session 1 Retrieval Quiz',
      weekNumber: 2,
      sessionName: 'Session 1',
      activityType: 'Retrieval quiz',
      activityVersion: '1.0',
      maximumScore: 10,
      itemMinimum: 1,
      itemMaximum: 10,
      allowsPartner: false,
      attemptStorageKey: 'unit3-week2-attempt:week2-session1-retrieval'
    }),
    'week2-threat-vulnerability-learning': Object.freeze({
      activityId: 'week2-threat-vulnerability-learning',
      activityName: 'Threats and Vulnerabilities Learning',
      weekNumber: 2,
      sessionName: 'Session 1',
      activityType: 'Guided learning',
      activityVersion: '1.0',
      maximumScore: 6,
      itemMinimum: 1,
      itemMaximum: 6,
      allowsPartner: false,
      attemptStorageKey: 'unit3-week2-attempt:week2-threat-vulnerability-learning'
    }),
    'week2-malware-symptoms': Object.freeze({
      activityId: 'week2-malware-symptoms',
      activityName: 'Malware Categories and Symptoms',
      weekNumber: 2,
      sessionName: 'Session 1',
      activityType: 'Knowledge check',
      activityVersion: '1.0',
      maximumScore: 10,
      itemMinimum: 1,
      itemMaximum: 10,
      allowsPartner: false,
      attemptStorageKey: 'unit3-week2-attempt:week2-malware-symptoms'
    }),
    'week2-threat-vulnerability-sort': Object.freeze({
      activityId: 'week2-threat-vulnerability-sort',
      activityName: 'Threat or Vulnerability Sort',
      weekNumber: 2,
      sessionName: 'Session 1',
      activityType: 'Classification',
      activityVersion: '1.0',
      maximumScore: 12,
      itemMinimum: 1,
      itemMaximum: 12,
      allowsPartner: false,
      attemptStorageKey: 'unit3-week2-attempt:week2-threat-vulnerability-sort'
    }),
    'week2-vulnerabilities101-reflection': Object.freeze({
      activityId: 'week2-vulnerabilities101-reflection',
      activityName: 'TryHackMe: Vulnerabilities 101',
      weekNumber: 2,
      sessionName: 'Session 1',
      activityType: 'Reflection',
      activityVersion: '1.0',
      maximumScore: 2,
      itemMinimum: 1,
      itemMaximum: 2,
      allowsPartner: false,
      attemptStorageKey: 'unit3-week2-attempt:week2-vulnerabilities101-reflection'
    }),
    'week2-session2-retrieval': Object.freeze({
      activityId: 'week2-session2-retrieval',
      activityName: 'Session 2 Retrieval Quiz',
      weekNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Retrieval quiz',
      activityVersion: '1.0',
      maximumScore: 10,
      itemMinimum: 1,
      itemMaximum: 10,
      allowsPartner: false,
      attemptStorageKey: 'unit3-week2-attempt:week2-session2-retrieval'
    }),
    'week2-northbank-vulnerability-analysis': Object.freeze({
      activityId: 'week2-northbank-vulnerability-analysis',
      activityName: 'Northbank Vulnerability Analysis',
      weekNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Scenario analysis',
      activityVersion: '1.0',
      maximumScore: 5,
      itemMinimum: 1,
      itemMaximum: 5,
      allowsPartner: false,
      attemptStorageKey: 'unit3-week2-attempt:week2-northbank-vulnerability-analysis'
    }),
    'week2-six-mark-response-guide': Object.freeze({
      activityId: 'week2-six-mark-response-guide',
      activityName: 'Six-Mark Response Guide',
      weekNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Exam skills',
      activityVersion: '1.0',
      maximumScore: 3,
      itemMinimum: 1,
      itemMaximum: 3,
      allowsPartner: false,
      attemptStorageKey: 'unit3-week2-attempt:week2-six-mark-response-guide'
    }),
    'week2-ocr-question-practice': Object.freeze({
      activityId: 'week2-ocr-question-practice',
      activityName: 'OCR-Style Question Practice',
      weekNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Exam skills',
      activityVersion: '1.0',
      maximumScore: 20,
      itemMinimum: 1,
      itemMaximum: 20,
      allowsPartner: false,
      attemptStorageKey: 'unit3-week2-attempt:week2-ocr-question-practice'
    }),
    'week2-peer-marking-answer-improvement': Object.freeze({
      activityId: 'week2-peer-marking-answer-improvement',
      activityName: 'Peer Marking and Answer Improvement',
      weekNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Reflection',
      activityVersion: '1.0',
      maximumScore: 6,
      itemMinimum: 1,
      itemMaximum: 6,
      allowsPartner: true,
      attemptStorageKey: 'unit3-week2-attempt:week2-peer-marking-answer-improvement'
    }),
    'week2-northbank-vulnerability-register': Object.freeze({
      activityId: 'week2-northbank-vulnerability-register',
      activityName: 'Northbank Vulnerability Register',
      weekNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Practical register',
      activityVersion: '1.0',
      maximumScore: 5,
      itemMinimum: 1,
      itemMaximum: 5,
      allowsPartner: false,
      attemptStorageKey: 'unit3-week2-attempt:week2-northbank-vulnerability-register'
    })
  });

  function getActivity(activityId) {
    return ACTIVITY_REGISTRY[activityId] || null;
  }

  global.Unit3CourseContext = {
    COURSE_CONTEXT: COURSE_CONTEXT,
    ACTIVITY_REGISTRY: ACTIVITY_REGISTRY,
    getActivity: getActivity
  };
})(window);
