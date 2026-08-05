/**
 * Week 2 activity manifest — shared metadata source of truth.
 *
 * Totals and versions here must match WEEK_2_ACTIVITIES and each activity pack.
 */

var WEEK_2_ACTIVITY_MANIFEST = Object.freeze({
  'week2-session1-retrieval': Object.freeze({
    activityId: 'week2-session1-retrieval',
    activityName: 'Session 1 Retrieval Quiz',
    weekNumber: 2,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Retrieval quiz',
    activityVersion: '1.0',
    maximumScore: 10,
    enabled: true,
    allowsPartner: false,
    componentId: 'quiz',
    packGlobal: 'WEEK2_PACK_SESSION1_RETRIEVAL'
  }),
  'week2-threat-vulnerability-learning': Object.freeze({
    activityId: 'week2-threat-vulnerability-learning',
    activityName: 'Threats and Vulnerabilities Learning',
    weekNumber: 2,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Guided learning',
    activityVersion: '1.0',
    maximumScore: 6,
    enabled: true,
    allowsPartner: false,
    componentId: 'guided-learning',
    packGlobal: 'WEEK2_PACK_THREAT_VULN_LEARNING'
  }),
  'week2-malware-symptoms': Object.freeze({
    activityId: 'week2-malware-symptoms',
    activityName: 'Malware Categories and Symptoms',
    weekNumber: 2,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Knowledge check',
    activityVersion: '1.0',
    maximumScore: 10,
    enabled: true,
    allowsPartner: false,
    componentId: 'matching',
    packGlobal: 'WEEK2_PACK_MALWARE_SYMPTOMS'
  }),
  'week2-threat-vulnerability-sort': Object.freeze({
    activityId: 'week2-threat-vulnerability-sort',
    activityName: 'Threat or Vulnerability Sort',
    weekNumber: 2,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Practical classification',
    activityVersion: '1.0',
    maximumScore: 12,
    enabled: true,
    allowsPartner: false,
    componentId: 'classification',
    packGlobal: 'WEEK2_PACK_THREAT_VULN_SORT'
  }),
  'week2-vulnerabilities101-reflection': Object.freeze({
    activityId: 'week2-vulnerabilities101-reflection',
    activityName: 'TryHackMe: Vulnerabilities 101',
    weekNumber: 2,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Reflection',
    activityVersion: '1.0',
    maximumScore: 2,
    enabled: true,
    allowsPartner: false,
    componentId: 'external-room-reflection',
    packGlobal: 'WEEK2_PACK_VULNERABILITIES_101'
  }),
  'week2-session2-retrieval': Object.freeze({
    activityId: 'week2-session2-retrieval',
    activityName: 'Session 2 Retrieval Quiz',
    weekNumber: 2,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Retrieval quiz',
    activityVersion: '1.0',
    maximumScore: 10,
    enabled: true,
    allowsPartner: false,
    componentId: 'quiz',
    packGlobal: 'WEEK2_PACK_SESSION2_RETRIEVAL'
  }),
  'week2-northbank-vulnerability-analysis': Object.freeze({
    activityId: 'week2-northbank-vulnerability-analysis',
    activityName: 'Northbank Vulnerability Analysis',
    weekNumber: 2,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Scenario analysis',
    activityVersion: '1.0',
    maximumScore: 5,
    enabled: true,
    allowsPartner: false,
    componentId: 'scenario-analysis',
    packGlobal: 'WEEK2_PACK_NORTHBANK_ANALYSIS'
  }),
  'week2-six-mark-response-guide': Object.freeze({
    activityId: 'week2-six-mark-response-guide',
    activityName: 'Six-Mark Response Guide',
    weekNumber: 2,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Exam skills',
    activityVersion: '1.0',
    maximumScore: 3,
    enabled: true,
    allowsPartner: false,
    componentId: 'exam-guide',
    packGlobal: 'WEEK2_PACK_SIX_MARK_GUIDE'
  }),
  'week2-ocr-question-practice': Object.freeze({
    activityId: 'week2-ocr-question-practice',
    activityName: 'OCR-Style Question Practice',
    weekNumber: 2,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Exam skills',
    activityVersion: '1.0',
    maximumScore: 20,
    enabled: true,
    allowsPartner: false,
    componentId: 'ocr-question-practice',
    packGlobal: 'WEEK2_PACK_OCR_PRACTICE'
  }),
  'week2-peer-marking-answer-improvement': Object.freeze({
    activityId: 'week2-peer-marking-answer-improvement',
    activityName: 'Peer Marking and Answer Improvement',
    weekNumber: 2,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Reflection',
    activityVersion: '1.0',
    maximumScore: 6,
    enabled: true,
    allowsPartner: true,
    componentId: 'peer-marking',
    packGlobal: 'WEEK2_PACK_PEER_MARKING'
  }),
  'week2-northbank-vulnerability-register': Object.freeze({
    activityId: 'week2-northbank-vulnerability-register',
    activityName: 'Northbank Vulnerability Register',
    weekNumber: 2,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Scenario analysis',
    activityVersion: '1.0',
    maximumScore: 5,
    enabled: true,
    allowsPartner: false,
    componentId: 'structured-register',
    packGlobal: 'WEEK2_PACK_VULNERABILITY_REGISTER'
  })
});

/** Accepted activity-type values aligned with Week 1 / course-context usage. */
var WEEK_2_ACCEPTED_ACTIVITY_TYPES = Object.freeze([
  'Retrieval quiz',
  'Guided learning',
  'Knowledge check',
  'Practical classification',
  'Reflection',
  'Scenario analysis',
  'Exam skills'
]);

/**
 * @param {string} activityId
 * @return {Object|null}
 */
function getWeek2ManifestEntry_(activityId) {
  if (!activityId || !Object.prototype.hasOwnProperty.call(WEEK_2_ACTIVITY_MANIFEST, activityId)) {
    return null;
  }
  return WEEK_2_ACTIVITY_MANIFEST[activityId];
}

/**
 * @return {string[]}
 */
function getWeek2ManifestIds_() {
  return Object.keys(WEEK_2_ACTIVITY_MANIFEST);
}
