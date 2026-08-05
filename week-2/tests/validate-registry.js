/**
 * Week 2 registry and catalog consistency checks.
 * Open via week-2/tests/index.html or run assertions in a browser console.
 */
(function (global) {
  'use strict';

  var EXPECTED = [
    { id: 'week2-session1-retrieval', total: 10, version: '1.0' },
    { id: 'week2-threat-vulnerability-learning', total: 6, version: '1.0' },
    { id: 'week2-malware-symptoms', total: 10, version: '1.0' },
    { id: 'week2-threat-vulnerability-sort', total: 12, version: '1.0' },
    { id: 'week2-vulnerabilities101-reflection', total: 2, version: '1.0' },
    { id: 'week2-session2-retrieval', total: 10, version: '1.0' },
    { id: 'week2-northbank-vulnerability-analysis', total: 5, version: '1.0' },
    { id: 'week2-six-mark-response-guide', total: 3, version: '1.0' },
    { id: 'week2-ocr-question-practice', total: 20, version: '1.0' },
    { id: 'week2-peer-marking-answer-improvement', total: 6, version: '1.0' },
    { id: 'week2-northbank-vulnerability-register', total: 5, version: '1.0' }
  ];

  function runWeek2RegistryTests() {
    var results = [];
    var course = global.Unit3CourseContext;
    var progress = global.Unit3Week2Progress;
    var routing = global.Unit3ActivityEngineConfig;

    function pass(name) {
      results.push({ name: name, ok: true });
    }
    function fail(name, detail) {
      results.push({ name: name, ok: false, detail: detail || '' });
    }

    if (!course || !course.getActivity) {
      fail('course-context-loaded', 'Unit3CourseContext missing');
      return results;
    }
    if (!progress || !progress.ACTIVITY_CATALOG) {
      fail('week2-progress-loaded', 'Unit3Week2Progress missing');
      return results;
    }

    pass('shared-modules-loaded');

    if (EXPECTED.length !== progress.ACTIVITY_CATALOG.length) {
      fail(
        'catalog-count',
        'Expected ' + EXPECTED.length + ' got ' + progress.ACTIVITY_CATALOG.length
      );
    } else {
      pass('catalog-count');
    }

    EXPECTED.forEach(function (item) {
      var reg = course.getActivity(item.id);
      if (!reg) {
        fail('registry-' + item.id, 'Missing from ACTIVITY_REGISTRY');
        return;
      }
      if (reg.maximumScore !== item.total) {
        fail(
          'total-' + item.id,
          'Expected ' + item.total + ' got ' + reg.maximumScore
        );
      } else {
        pass('total-' + item.id);
      }
      if (reg.activityVersion !== item.version) {
        fail(
          'version-' + item.id,
          'Expected ' + item.version + ' got ' + reg.activityVersion
        );
      } else {
        pass('version-' + item.id);
      }
      if (reg.weekNumber !== 2) {
        fail('week-' + item.id, 'weekNumber is not 2');
      } else {
        pass('week-' + item.id);
      }
      if (routing && routing.getSubmissionService) {
        var service = routing.getSubmissionService(item.id);
        var expected =
          routing.SUBMISSION_SERVICE.WEEK2_API ||
          routing.SUBMISSION_SERVICE.COLLECTOR_V3;
        if (service !== expected) {
          fail('routing-' + item.id, 'Expected ' + expected + ' got ' + service);
        } else {
          pass('routing-' + item.id);
        }
      }
    });

    if (progress.ROOT_KEY !== 'unit3-week2-progress') {
      fail('progress-root-key', progress.ROOT_KEY);
    } else {
      pass('progress-root-key');
    }
    if (progress.REGISTER_KEY !== 'unit3-week2-northbank-vulnerability-register') {
      fail('register-key', progress.REGISTER_KEY);
    } else {
      pass('register-key');
    }

    // Progress isolation smoke test
    var probeKey = 'unit3-week2-progress';
    var before = null;
    try {
      before = localStorage.getItem(probeKey);
      progress.markStarted('week2-session1-retrieval');
      var state = progress.getActivityState('week2-session1-retrieval');
      if (state.status === 'in-progress' || state.status === 'completed') {
        pass('progress-persists');
      } else {
        fail('progress-persists', state.status);
      }
      if (before == null) {
        localStorage.removeItem(probeKey);
      } else {
        localStorage.setItem(probeKey, before);
      }
    } catch (err) {
      fail('progress-persists', String(err));
    }

    return results;
  }

  global.Unit3Week2Tests = {
    EXPECTED: EXPECTED,
    runWeek2RegistryTests: runWeek2RegistryTests
  };
})(window);
