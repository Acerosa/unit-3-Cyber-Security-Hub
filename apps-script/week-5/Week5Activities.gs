/**
 * Week 5 activity registry used by submission validation.
 */

var WEEK_5_ACTIVITIES_CACHE_ = null;

/**
 * @return {Object}
 */
function getWeek5ActivitiesMap_() {
  if (WEEK_5_ACTIVITIES_CACHE_) {
    return WEEK_5_ACTIVITIES_CACHE_;
  }

  var mapped = {};
  getWeek5ManifestIds_().forEach(function (activityId) {
    var entry = getWeek5ManifestEntry_(activityId);
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

  WEEK_5_ACTIVITIES_CACHE_ = Object.freeze(mapped);
  return WEEK_5_ACTIVITIES_CACHE_;
}

/**
 * @param {string} activityId
 * @return {Object|null}
 */
function getWeek5Activity_(activityId) {
  var map = getWeek5ActivitiesMap_();
  if (!activityId || !Object.prototype.hasOwnProperty.call(map, activityId)) {
    return null;
  }
  return map[activityId];
}

/**
 * @param {string} activityId
 * @return {boolean}
 */
function isWeek5ActivityEnabled_(activityId) {
  var activity = getWeek5Activity_(activityId);
  return !!(activity && activity.enabled === true);
}

/**
 * @return {string[]}
 */
function getWeek5ActivityIds_() {
  return Object.keys(getWeek5ActivitiesMap_());
}
