/**
 * Week 2 activity registry.
 *
 * Expected totals and versions are defined here only. Validation must read
 * from this registry and must not accept unknown activity IDs.
 */

var WEEK_2_ACTIVITIES = Object.freeze({
  'week2-session1-retrieval': Object.freeze({
    week: 2,
    session: 1,
    version: '1.0',
    total: 10,
    enabled: true
  }),
  'week2-threat-vulnerability-learning': Object.freeze({
    week: 2,
    session: 1,
    version: '1.0',
    total: 6,
    enabled: true
  }),
  'week2-malware-symptoms': Object.freeze({
    week: 2,
    session: 1,
    version: '1.0',
    total: 10,
    enabled: true
  }),
  'week2-threat-vulnerability-sort': Object.freeze({
    week: 2,
    session: 1,
    version: '1.0',
    total: 12,
    enabled: true
  }),
  'week2-vulnerabilities101-reflection': Object.freeze({
    week: 2,
    session: 1,
    version: '1.0',
    total: 2,
    enabled: true
  }),
  'week2-session2-retrieval': Object.freeze({
    week: 2,
    session: 2,
    version: '1.0',
    total: 10,
    enabled: true
  }),
  'week2-northbank-vulnerability-analysis': Object.freeze({
    week: 2,
    session: 2,
    version: '1.0',
    total: 5,
    enabled: true
  }),
  'week2-six-mark-response-guide': Object.freeze({
    week: 2,
    session: 2,
    version: '1.0',
    total: 3,
    enabled: true
  }),
  'week2-ocr-question-practice': Object.freeze({
    week: 2,
    session: 2,
    version: '1.0',
    total: 20,
    enabled: true
  }),
  'week2-peer-marking-answer-improvement': Object.freeze({
    week: 2,
    session: 2,
    version: '1.0',
    total: 6,
    enabled: true
  }),
  'week2-northbank-vulnerability-register': Object.freeze({
    week: 2,
    session: 2,
    version: '1.0',
    total: 5,
    enabled: true
  })
});

/**
 * @param {string} activityId
 * @return {Object|null}
 */
function getWeek2Activity_(activityId) {
  if (!activityId || !Object.prototype.hasOwnProperty.call(WEEK_2_ACTIVITIES, activityId)) {
    return null;
  }
  return WEEK_2_ACTIVITIES[activityId];
}

/**
 * @param {string} activityId
 * @return {boolean}
 */
function isWeek2ActivityEnabled_(activityId) {
  var activity = getWeek2Activity_(activityId);
  return !!(activity && activity.enabled === true);
}

/**
 * @return {string[]}
 */
function getWeek2ActivityIds_() {
  return Object.keys(WEEK_2_ACTIVITIES);
}
