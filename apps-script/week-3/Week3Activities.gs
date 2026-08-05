/**
 * Week 3 activity registry used by submission validation.
 */

var WEEK_3_ACTIVITIES_CACHE_ = null;

/**
 * @return {Object}
 */
function getWeek3ActivitiesMap_() {
  if (WEEK_3_ACTIVITIES_CACHE_) {
    return WEEK_3_ACTIVITIES_CACHE_;
  }

  var mapped = {};
  getWeek3ManifestIds_().forEach(function (activityId) {
    var entry = getWeek3ManifestEntry_(activityId);
    mapped[activityId] = Object.freeze({
      week: entry.weekNumber,
      session: entry.sessionNumber,
      version: entry.activityVersion,
      total: entry.maximumScore,
      enabled: entry.enabled === true,
      activityType: entry.activityType,
      activityName: entry.activityName,
      componentId: entry.componentId
    });
  });

  WEEK_3_ACTIVITIES_CACHE_ = Object.freeze(mapped);
  return WEEK_3_ACTIVITIES_CACHE_;
}

/**
 * @param {string} activityId
 * @return {Object|null}
 */
function getWeek3Activity_(activityId) {
  var map = getWeek3ActivitiesMap_();
  if (!activityId || !Object.prototype.hasOwnProperty.call(map, activityId)) {
    return null;
  }
  return map[activityId];
}

/**
 * @param {string} activityId
 * @return {boolean}
 */
function isWeek3ActivityEnabled_(activityId) {
  var activity = getWeek3Activity_(activityId);
  return !!(activity && activity.enabled === true);
}

/**
 * @return {string[]}
 */
function getWeek3ActivityIds_() {
  return Object.keys(getWeek3ActivitiesMap_());
}
