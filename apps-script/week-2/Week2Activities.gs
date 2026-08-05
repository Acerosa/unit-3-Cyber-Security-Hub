/**
 * Week 2 activity registry used by submission validation.
 *
 * Totals, versions and enabled flags are derived from WEEK_2_ACTIVITY_MANIFEST
 * so content packs, validators and seeds cannot drift apart.
 */

var WEEK_2_ACTIVITIES_CACHE_ = null;

/**
 * @return {Object}
 */
function getWeek2ActivitiesMap_() {
  if (WEEK_2_ACTIVITIES_CACHE_) {
    return WEEK_2_ACTIVITIES_CACHE_;
  }

  var mapped = {};
  getWeek2ManifestIds_().forEach(function (activityId) {
    var entry = getWeek2ManifestEntry_(activityId);
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

  WEEK_2_ACTIVITIES_CACHE_ = Object.freeze(mapped);
  return WEEK_2_ACTIVITIES_CACHE_;
}

/**
 * @param {string} activityId
 * @return {Object|null}
 */
function getWeek2Activity_(activityId) {
  var map = getWeek2ActivitiesMap_();
  if (!activityId || !Object.prototype.hasOwnProperty.call(map, activityId)) {
    return null;
  }
  return map[activityId];
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
  return Object.keys(getWeek2ActivitiesMap_());
}
