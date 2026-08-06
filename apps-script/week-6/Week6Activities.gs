/**
 * Week 6 activity registry used by submission validation.
 */

var WEEK_6_ACTIVITIES_CACHE_ = null;

/**
 * @return {Object}
 */
function getWeek6ActivitiesMap_() {
  if (WEEK_6_ACTIVITIES_CACHE_) {
    return WEEK_6_ACTIVITIES_CACHE_;
  }

  var mapped = {};
  getWeek6ManifestIds_().forEach(function (activityId) {
    var entry = getWeek6ManifestEntry_(activityId);
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

  WEEK_6_ACTIVITIES_CACHE_ = Object.freeze(mapped);
  return WEEK_6_ACTIVITIES_CACHE_;
}

/**
 * @param {string} activityId
 * @return {Object|null}
 */
function getWeek6Activity_(activityId) {
  var map = getWeek6ActivitiesMap_();
  if (!activityId || !Object.prototype.hasOwnProperty.call(map, activityId)) {
    return null;
  }
  return map[activityId];
}

/**
 * @param {string} activityId
 * @return {boolean}
 */
function isWeek6ActivityEnabled_(activityId) {
  var activity = getWeek6Activity_(activityId);
  return !!(activity && activity.enabled === true);
}

/**
 * @return {string[]}
 */
function getWeek6ActivityIds_() {
  return Object.keys(getWeek6ActivitiesMap_());
}
