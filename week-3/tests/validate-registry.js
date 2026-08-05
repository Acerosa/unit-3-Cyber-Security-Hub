/**
 * Week 3 registry and content consistency checks.
 */
(function (global) {
  'use strict';

  var EXPECTED = [
    { id: 'week3-session1-retrieval', total: 10, version: '1.0' },
    { id: 'week3-attacker-types-learning', total: 8, version: '1.0' },
    { id: 'week3-attacker-case-matching', total: 8, version: '1.0' },
    { id: 'week3-justified-identification', total: 12, version: '1.0' },
    { id: 'week3-session2-retrieval', total: 12, version: '1.0' },
    { id: 'week3-ocr-question-practice', total: 20, version: '1.0' },
    { id: 'week3-peer-marking', total: 6, version: '1.0' }
  ];

  function runWeek3RegistryTests() {
    var results = [];
    var course = global.Unit3CourseContext;
    var progress = global.Unit3Week3Progress;
    var routing = global.Unit3ActivityEngineConfig;
    var attackers = global.Unit3Week3AttackerTypes;
    var cases = global.Week3AttackerCaseMatching;

    function pass(name) {
      results.push({ name: name, ok: true });
    }
    function fail(name, detail) {
      results.push({ name: name, ok: false, detail: detail || '' });
    }

    if (!course || !progress) {
      fail('modules-loaded', 'Missing course context or Week 3 progress');
      return results;
    }
    pass('modules-loaded');

    if (EXPECTED.length !== progress.ACTIVITY_CATALOG.length) {
      fail('catalog-count', 'Expected ' + EXPECTED.length);
    } else pass('catalog-count');

    EXPECTED.forEach(function (item) {
      var reg = course.getActivity(item.id);
      if (!reg) {
        fail('registry-' + item.id, 'missing');
        return;
      }
      if (reg.maximumScore !== item.total) fail('total-' + item.id, String(reg.maximumScore));
      else pass('total-' + item.id);
      if (reg.activityVersion !== item.version) fail('version-' + item.id, reg.activityVersion);
      else pass('version-' + item.id);
      if (reg.weekNumber !== 3) fail('week-' + item.id, String(reg.weekNumber));
      else pass('week-' + item.id);
      if (routing && routing.getSubmissionService(item.id) !== routing.SUBMISSION_SERVICE.WEEK3_API) {
        fail('routing-' + item.id, routing.getSubmissionService(item.id));
      } else pass('routing-' + item.id);
    });

    if (progress.ROOT_KEY !== 'unit3-week3-progress') fail('root-key', progress.ROOT_KEY);
    else pass('root-key');

    if (!attackers || attackers.attackers.length !== 8) fail('attacker-count', 'expected 8');
    else pass('attacker-count');

    if (!cases || cases.cases.length !== 8) fail('case-count', 'expected 8');
    else {
      var best = {};
      cases.cases.forEach(function (item) {
        best[item.bestAnswer] = true;
      });
      if (Object.keys(best).length !== 8) fail('case-coverage', Object.keys(best).join(','));
      else pass('case-coverage');
      var alts = cases.cases.filter(function (item) {
        return item.plausibleAlternative;
      }).length;
      if (alts < 3) fail('case-alternatives', String(alts));
      else pass('case-alternatives');
    }

    if (routing && routing.getSubmissionService('week3-directed-study')) {
      fail('directed-not-scored', 'directed study must not be routed');
    } else pass('directed-not-scored');

    return results;
  }

  global.Unit3Week3Tests = {
    EXPECTED: EXPECTED,
    runWeek3RegistryTests: runWeek3RegistryTests
  };
})(window);
