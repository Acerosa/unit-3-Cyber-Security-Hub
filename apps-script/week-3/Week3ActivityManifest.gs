/**
 * Week 3 activity manifest — source of truth for IDs, versions and totals.
 */

var WEEK_3_ACTIVITY_MANIFEST = Object.freeze({
  'week3-session1-retrieval': Object.freeze({
    activityId: 'week3-session1-retrieval',
    activityName: 'Session 1 Retrieval Quiz',
    weekNumber: 3,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Retrieval quiz',
    activityVersion: '1.0',
    maximumScore: 10,
    enabled: true,
    allowsPartner: false,
    componentId: 'quiz',
    packGlobal: 'WEEK3_PACK_SESSION1_RETRIEVAL'
  }),
  'week3-attacker-types-learning': Object.freeze({
    activityId: 'week3-attacker-types-learning',
    activityName: 'Attacker Types Learning',
    weekNumber: 3,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Guided learning',
    activityVersion: '1.0',
    maximumScore: 8,
    enabled: true,
    allowsPartner: false,
    componentId: 'guided-learning',
    packGlobal: 'WEEK3_PACK_ATTACKER_TYPES_LEARNING'
  }),
  'week3-attacker-case-matching': Object.freeze({
    activityId: 'week3-attacker-case-matching',
    activityName: 'Attacker Case Study Matching',
    weekNumber: 3,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Scenario matching',
    activityVersion: '1.0',
    maximumScore: 8,
    enabled: true,
    allowsPartner: false,
    componentId: 'case-matching',
    packGlobal: 'WEEK3_PACK_ATTACKER_CASE_MATCHING'
  }),
  'week3-justified-identification': Object.freeze({
    activityId: 'week3-justified-identification',
    activityName: 'Justified Identification Practice',
    weekNumber: 3,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Exam skills',
    activityVersion: '1.0',
    maximumScore: 12,
    enabled: true,
    allowsPartner: false,
    componentId: 'justified-writing',
    packGlobal: 'WEEK3_PACK_JUSTIFIED_IDENTIFICATION'
  }),
  'week3-session2-retrieval': Object.freeze({
    activityId: 'week3-session2-retrieval',
    activityName: 'Session 2 Retrieval Quiz',
    weekNumber: 3,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Retrieval quiz',
    activityVersion: '1.0',
    maximumScore: 12,
    enabled: true,
    allowsPartner: false,
    componentId: 'quiz',
    packGlobal: 'WEEK3_PACK_SESSION2_RETRIEVAL'
  }),
  'week3-ocr-question-practice': Object.freeze({
    activityId: 'week3-ocr-question-practice',
    activityName: 'OCR-Style Question Practice',
    weekNumber: 3,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Exam skills',
    activityVersion: '1.0',
    maximumScore: 20,
    enabled: true,
    allowsPartner: false,
    componentId: 'ocr-practice',
    packGlobal: 'WEEK3_PACK_OCR_PRACTICE'
  }),
  'week3-peer-marking': Object.freeze({
    activityId: 'week3-peer-marking',
    activityName: 'Peer Marking and Answer Improvement',
    weekNumber: 3,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Reflection',
    activityVersion: '1.0',
    maximumScore: 6,
    enabled: true,
    allowsPartner: true,
    componentId: 'peer-marking',
    packGlobal: 'WEEK3_PACK_PEER_MARKING'
  })
});

var WEEK_3_ACCEPTED_ACTIVITY_TYPES = Object.freeze([
  'Retrieval quiz',
  'Guided learning',
  'Scenario matching',
  'Exam skills',
  'Reflection'
]);

/**
 * @return {string[]}
 */
function getWeek3ManifestIds_() {
  return Object.keys(WEEK_3_ACTIVITY_MANIFEST);
}

/**
 * @param {string} activityId
 * @return {Object|null}
 */
function getWeek3ManifestEntry_(activityId) {
  if (!activityId || !Object.prototype.hasOwnProperty.call(WEEK_3_ACTIVITY_MANIFEST, activityId)) {
    return null;
  }
  return WEEK_3_ACTIVITY_MANIFEST[activityId];
}
