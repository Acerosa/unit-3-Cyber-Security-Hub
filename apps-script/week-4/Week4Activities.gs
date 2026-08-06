/**
 * Week 4 activity registry used by submission validation.
 */

var WEEK_4_ACTIVITIES_CACHE_ = null;

/**
 * @return {Object}
 */
function getWeek4ActivitiesMap_() {
  if (WEEK_4_ACTIVITIES_CACHE_) {
    return WEEK_4_ACTIVITIES_CACHE_;
  }

  var mapped = {};
  getWeek4ManifestIds_().forEach(function (activityId) {
    var entry = getWeek4ManifestEntry_(activityId);
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

  WEEK_4_ACTIVITIES_CACHE_ = Object.freeze(mapped);
  return WEEK_4_ACTIVITIES_CACHE_;
}

/**
 * @param {string} activityId
 * @return {Object|null}
 */
function getWeek4Activity_(activityId) {
  var map = getWeek4ActivitiesMap_();
  if (!activityId || !Object.prototype.hasOwnProperty.call(map, activityId)) {
    return null;
  }
  return map[activityId];
}

/**
 * @param {string} activityId
 * @return {boolean}
 */
function isWeek4ActivityEnabled_(activityId) {
  var activity = getWeek4Activity_(activityId);
  return !!(activity && activity.enabled === true);
}

/**
 * @return {string[]}
 */
function getWeek4ActivityIds_() {
  return Object.keys(getWeek4ActivitiesMap_());
}
