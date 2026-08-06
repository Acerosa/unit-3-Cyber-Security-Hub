/**
 * Week 4 activity manifest — source of truth for IDs, versions and totals.
 */

var WEEK_4_ACTIVITY_MANIFEST = Object.freeze({
  'week4-session1-retrieval': Object.freeze({
    activityId: 'week4-session1-retrieval',
    activityName: 'Session 1 Retrieval and Homework Harvest',
    weekNumber: 4,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Retrieval quiz',
    activityVersion: '1.0',
    maximumScore: 10,
    enabled: true,
    allowsPartner: false,
    componentId: 'quiz',
    packGlobal: 'WEEK4_PACK_SESSION1_RETRIEVAL'
  }),
  'week4-motivations-learning': Object.freeze({
    activityId: 'week4-motivations-learning',
    activityName: 'Motivations for Attack',
    weekNumber: 4,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Guided learning',
    activityVersion: '1.0',
    maximumScore: 8,
    enabled: true,
    allowsPartner: false,
    componentId: 'guided-learning',
    packGlobal: 'WEEK4_PACK_MOTIVATIONS_LEARNING'
  }),
  'week4-targets-methods': Object.freeze({
    activityId: 'week4-targets-methods',
    activityName: 'Targets and Methods',
    weekNumber: 4,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Classification',
    activityVersion: '1.0',
    maximumScore: 8,
    enabled: true,
    allowsPartner: false,
    componentId: 'classification',
    packGlobal: 'WEEK4_PACK_TARGETS_METHODS'
  }),
  'week4-northbank-exposure': Object.freeze({
    activityId: 'week4-northbank-exposure',
    activityName: 'Northbank Passive-Exposure Reflection',
    weekNumber: 4,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Reflection',
    activityVersion: '1.0',
    maximumScore: 3,
    enabled: true,
    allowsPartner: false,
    componentId: 'reflection',
    packGlobal: 'WEEK4_PACK_NORTHBANK_EXPOSURE'
  }),
  'week4-session2-retrieval': Object.freeze({
    activityId: 'week4-session2-retrieval',
    activityName: 'Session 2 Retrieval Quiz',
    weekNumber: 4,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Retrieval quiz',
    activityVersion: '1.0',
    maximumScore: 12,
    enabled: true,
    allowsPartner: false,
    componentId: 'quiz',
    packGlobal: 'WEEK4_PACK_SESSION2_RETRIEVAL'
  }),
  'week4-mtm-mapping': Object.freeze({
    activityId: 'week4-mtm-mapping',
    activityName: 'Motivation, Target and Method Mapping',
    weekNumber: 4,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Scenario mapping',
    activityVersion: '1.0',
    maximumScore: 8,
    enabled: true,
    allowsPartner: true,
    componentId: 'scenario-mapping',
    packGlobal: 'WEEK4_PACK_MTM_MAPPING'
  }),
  'week4-analyse-practice': Object.freeze({
    activityId: 'week4-analyse-practice',
    activityName: 'From Describe to Analyse',
    weekNumber: 4,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Exam skills',
    activityVersion: '1.0',
    maximumScore: 6,
    enabled: true,
    allowsPartner: false,
    componentId: 'exam-skills',
    packGlobal: 'WEEK4_PACK_ANALYSE_PRACTICE'
  }),
  'week4-ocr-question-practice': Object.freeze({
    activityId: 'week4-ocr-question-practice',
    activityName: 'OCR-Style Question Practice',
    weekNumber: 4,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Exam skills',
    activityVersion: '1.0',
    maximumScore: 20,
    enabled: true,
    allowsPartner: false,
    componentId: 'ocr-practice',
    packGlobal: 'WEEK4_PACK_OCR_PRACTICE'
  }),
  'week4-answer-improvement': Object.freeze({
    activityId: 'week4-answer-improvement',
    activityName: 'Marking and Answer Improvement',
    weekNumber: 4,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Self marking',
    activityVersion: '1.0',
    maximumScore: 6,
    enabled: true,
    allowsPartner: false,
    componentId: 'self-marking',
    packGlobal: 'WEEK4_PACK_ANSWER_IMPROVEMENT'
  }),
  'week4-ethical-review': Object.freeze({
    activityId: 'week4-ethical-review',
    activityName: 'Ethical Review Discussion',
    weekNumber: 4,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Discussion',
    activityVersion: '1.0',
    maximumScore: 2,
    enabled: true,
    allowsPartner: false,
    componentId: 'discussion',
    packGlobal: 'WEEK4_PACK_ETHICAL_REVIEW'
  })
});

var WEEK_4_ACCEPTED_ACTIVITY_TYPES = Object.freeze([
  'Retrieval quiz',
  'Guided learning',
  'Classification',
  'Reflection',
  'Scenario mapping',
  'Exam skills',
  'Self marking',
  'Discussion'
]);

var WEEK_4_REQUIRED_MOTIVATIONS = Object.freeze([
  'espionage',
  'righting-wrongs',
  'public-good',
  'publicity',
  'thrill',
  'fraud',
  'score-settling',
  'income-generation'
]);

var WEEK_4_REQUIRED_TARGETS = Object.freeze([
  'people',
  'organisations',
  'equipment',
  'information'
]);

var WEEK_4_REQUIRED_METHODS = Object.freeze([
  'social engineering',
  'phishing',
  'system compromise',
  'supply-chain compromise',
  'theft',
  'damage',
  'interception',
  'exfiltration'
]);

/**
 * @return {string[]}
 */
function getWeek4ManifestIds_() {
  return Object.keys(WEEK_4_ACTIVITY_MANIFEST);
}

/**
 * @param {string} activityId
 * @return {Object|null}
 */
function getWeek4ManifestEntry_(activityId) {
  if (!activityId || !Object.prototype.hasOwnProperty.call(WEEK_4_ACTIVITY_MANIFEST, activityId)) {
    return null;
  }
  return WEEK_4_ACTIVITY_MANIFEST[activityId];
}
