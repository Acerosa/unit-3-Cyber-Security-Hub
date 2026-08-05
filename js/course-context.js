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
      attemptStorageKey: 'unit3-glossary-attempt-id'
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
      itemMaximum: 10,
      allowsPartner: false,
      attemptStorageKey: 'unit3-session2-retrieval-attempt-id'
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
