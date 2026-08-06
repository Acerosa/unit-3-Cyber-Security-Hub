/**
 * Week 5 activity manifest — source of truth for IDs, versions and totals.
 * Aligned with the Week 5 frontend activity catalogue.
 */

var WEEK_5_ACTIVITY_MANIFEST = Object.freeze({
  'week5-session1-retrieval': Object.freeze({
    activityId: 'week5-session1-retrieval',
    activityName: 'Session 1 Retrieval and Homework Harvest',
    weekNumber: 5,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Retrieval quiz',
    activityVersion: '1.0',
    maximumScore: 8,
    enabled: true,
    allowsPartner: false,
    componentId: 'quiz',
    packGlobal: 'WEEK5_PACK_SESSION1_RETRIEVAL'
  }),
  'week5-impacts-learning': Object.freeze({
    activityId: 'week5-impacts-learning',
    activityName: 'Impacts Learning: Loss, Disruption and Safety',
    weekNumber: 5,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Guided learning',
    activityVersion: '1.0',
    maximumScore: 9,
    enabled: true,
    allowsPartner: false,
    componentId: 'guided-learning',
    packGlobal: 'WEEK5_PACK_IMPACTS_LEARNING'
  }),
  'week5-impact-classification': Object.freeze({
    activityId: 'week5-impact-classification',
    activityName: 'Loss, Disruption and Safety Classification',
    weekNumber: 5,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Classification',
    activityVersion: '1.0',
    maximumScore: 8,
    enabled: true,
    allowsPartner: false,
    componentId: 'classification',
    packGlobal: 'WEEK5_PACK_IMPACT_CLASSIFICATION'
  }),
  'week5-ransomware-companion': Object.freeze({
    activityId: 'week5-ransomware-companion',
    activityName: 'Northbank Ransomware Exercise Companion',
    weekNumber: 5,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Reflection',
    activityVersion: '1.0',
    maximumScore: 4,
    enabled: true,
    allowsPartner: true,
    componentId: 'facilitated-companion',
    packGlobal: 'WEEK5_PACK_RANSOMWARE_COMPANION'
  }),
  'week5-exercise-debrief': Object.freeze({
    activityId: 'week5-exercise-debrief',
    activityName: 'Exercise Debrief',
    weekNumber: 5,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Reflection',
    activityVersion: '1.0',
    maximumScore: 4,
    enabled: true,
    allowsPartner: true,
    componentId: 'reflection',
    packGlobal: 'WEEK5_PACK_EXERCISE_DEBRIEF'
  }),
  'week5-session2-retrieval': Object.freeze({
    activityId: 'week5-session2-retrieval',
    activityName: 'Session 2 Retrieval Quiz',
    weekNumber: 5,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Retrieval quiz',
    activityVersion: '1.0',
    maximumScore: 12,
    enabled: true,
    allowsPartner: false,
    componentId: 'quiz',
    packGlobal: 'WEEK5_PACK_SESSION2_RETRIEVAL'
  }),
  'week5-stakeholder-grid': Object.freeze({
    activityId: 'week5-stakeholder-grid',
    activityName: 'Stakeholder Impact Grid',
    weekNumber: 5,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Scenario mapping',
    activityVersion: '1.0',
    maximumScore: 10,
    enabled: true,
    allowsPartner: false,
    componentId: 'scenario-mapping',
    packGlobal: 'WEEK5_PACK_STAKEHOLDER_GRID'
  }),
  'week5-impact-analysis': Object.freeze({
    activityId: 'week5-impact-analysis',
    activityName: 'Analysing Rather Than Listing Impacts',
    weekNumber: 5,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Exam skills',
    activityVersion: '1.0',
    maximumScore: 6,
    enabled: true,
    allowsPartner: false,
    componentId: 'exam-skills',
    packGlobal: 'WEEK5_PACK_IMPACT_ANALYSIS'
  }),
  'week5-ocr-question-practice': Object.freeze({
    activityId: 'week5-ocr-question-practice',
    activityName: 'OCR-Style Impact Questions',
    weekNumber: 5,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Exam skills',
    activityVersion: '1.0',
    maximumScore: 20,
    enabled: true,
    allowsPartner: false,
    componentId: 'ocr-practice',
    packGlobal: 'WEEK5_PACK_OCR_PRACTICE'
  }),
  'week5-answer-improvement': Object.freeze({
    activityId: 'week5-answer-improvement',
    activityName: 'Marking and Answer Improvement',
    weekNumber: 5,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Self marking',
    activityVersion: '1.0',
    maximumScore: 6,
    enabled: true,
    allowsPartner: false,
    componentId: 'self-marking',
    packGlobal: 'WEEK5_PACK_ANSWER_IMPROVEMENT'
  })
});

var WEEK_5_ACCEPTED_ACTIVITY_TYPES = Object.freeze([
  'Retrieval quiz',
  'Guided learning',
  'Classification',
  'Reflection',
  'Scenario mapping',
  'Exam skills',
  'Self marking',
  'Discussion'
]);

var WEEK_5_REQUIRED_IMPACT_CATEGORIES = Object.freeze(['loss', 'disruption', 'safety']);

var WEEK_5_REQUIRED_STAKEHOLDERS = Object.freeze([
  'individuals',
  'organisation',
  'employees',
  'patients',
  'suppliers',
  'regulators',
  'state'
]);

var WEEK_5_REQUIRED_ROLES = Object.freeze([
  'practice-manager',
  'it-support',
  'records-officer',
  'communications-lead'
]);

/**
 * @return {string[]}
 */
function getWeek5ManifestIds_() {
  return Object.keys(WEEK_5_ACTIVITY_MANIFEST);
}

/**
 * @param {string} activityId
 * @return {Object|null}
 */
function getWeek5ManifestEntry_(activityId) {
  if (!activityId || !Object.prototype.hasOwnProperty.call(WEEK_5_ACTIVITY_MANIFEST, activityId)) {
    return null;
  }
  return WEEK_5_ACTIVITY_MANIFEST[activityId];
}
