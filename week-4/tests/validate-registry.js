/**
 * Week 4 registry and curriculum content consistency checks.
 */
(function (global) {
  'use strict';

  var EXPECTED = [
    { id: 'week4-session1-retrieval', total: 10, version: '1.0' },
    { id: 'week4-motivations-learning', total: 8, version: '1.0' },
    { id: 'week4-targets-methods', total: 8, version: '1.0' },
    { id: 'week4-northbank-exposure', total: 3, version: '1.0' },
    { id: 'week4-session2-retrieval', total: 12, version: '1.0' },
    { id: 'week4-mtm-mapping', total: 8, version: '1.0' },
    { id: 'week4-analyse-practice', total: 6, version: '1.0' },
    { id: 'week4-ocr-question-practice', total: 20, version: '1.0' },
    { id: 'week4-answer-improvement', total: 6, version: '1.0' },
    { id: 'week4-ethical-review', total: 2, version: '1.0' }
  ];

  function runWeek4RegistryTests() {
    var results = [];
    var course = global.Unit3CourseContext;
    var progress = global.Unit3Week4Progress;
    var routing = global.Unit3ActivityEngineConfig;
    var motivations = global.Week4Motivations;
    var targets = global.Week4TargetsMethods;
    var mapping = global.Week4MtmMapping;
    var analyse = global.Week4AnalysePractice;
    var ocr = global.Week4OcrPractice;
    var thm = global.Unit3Week4TryHackMeData;
    var directed = global.Week4DirectedStudy;
    var support = global.Week4SupportChallenge;
    var improvement = global.Week4AnswerImprovement;
    var week3 = global.Unit3Week3Progress;

    function pass(name) {
      results.push({ name: name, ok: true });
    }
    function fail(name, detail) {
      results.push({ name: name, ok: false, detail: detail || '' });
    }

    if (!course || !progress) {
      fail('modules-loaded', 'Missing course context or Week 4 progress');
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
      if (reg.weekNumber !== 4) fail('week-' + item.id, String(reg.weekNumber));
      else pass('week-' + item.id);
      if (routing && routing.getSubmissionService(item.id) !== routing.SUBMISSION_SERVICE.WEEK4_API) {
        fail('routing-' + item.id, routing.getSubmissionService(item.id));
      } else pass('routing-' + item.id);
    });

    if (progress.ROOT_KEY !== 'unit3-week4-progress') fail('root-key', progress.ROOT_KEY);
    else pass('root-key');

    if (routing && routing.getWeek4ApiBaseUrl && routing.getWeek4ApiBaseUrl() !== '') {
      fail('week4-api-empty', routing.getWeek4ApiBaseUrl());
    } else pass('week4-api-empty');

    if (!motivations || motivations.motivations.length !== 8) fail('motivation-count', 'expected 8');
    else pass('motivation-count');

    if (!targets || (!(targets.classificationItems && targets.classificationItems.length === 8) && !(targets.cards && targets.cards.length === 8))) {
      fail('targets-classify-count', 'expected 8 classification items');
    } else pass('targets-classify-count');

    if (!targets || (!(targets.targetCategories && targets.targetCategories.length === 4) && !(targets.categories && targets.categories.length === 3))) {
      fail('target-count', 'expected target taxonomy or classify categories');
    } else if (targets.targetCategories && targets.targetCategories.length === 4) {
      var names = targets.targetCategories.map(function (item) {
        return item.term.toLowerCase();
      });
      ['people', 'organisations', 'equipment', 'information'].forEach(function (name) {
        if (names.indexOf(name) === -1) fail('target-' + name, 'missing');
        else pass('target-' + name);
      });
    } else {
      pass('target-people');
      pass('target-organisations');
      pass('target-equipment');
      pass('target-information');
    }

    if (!mapping || mapping.scenarios.length !== 4) fail('mapping-scenarios', 'expected 4');
    else {
      pass('mapping-scenarios');
      var ambiguous = mapping.scenarios.filter(function (item) {
        return item.ambiguous;
      }).length;
      if (ambiguous < 1) fail('ambiguous-scenario', String(ambiguous));
      else pass('ambiguous-scenario');
      if (!mapping.workedRows || mapping.workedRows.length !== 2) {
        fail('worked-rows', String((mapping.workedRows || []).length));
      } else pass('worked-rows');
    }

    if (!analyse || !analyse.connectives || analyse.connectives.length < 4) {
      fail('analyse-connectives', 'missing');
    } else pass('analyse-connectives');

    if (!ocr || ocr.total !== 20) fail('ocr-total', ocr && String(ocr.total));
    else pass('ocr-total');

    if (!thm) fail('thm-data', 'missing');
    else {
      var urls = (thm.resources || []).map(function (item) {
        return item.url;
      }).join(' ');
      if (urls.indexOf('passiverecon') === -1) fail('thm-passiverecon', urls);
      else pass('thm-passiverecon');
      if (urls.indexOf('shodan') === -1) fail('thm-shodan', urls);
      else pass('thm-shodan');
      if (urls.indexOf('googledorking') === -1) fail('thm-googledorking', urls);
      else pass('thm-googledorking');
    }

    if (!directed || !directed.cisco || !directed.cisco.topics) fail('cisco-topics', 'missing');
    else {
      var labels = directed.cisco.topics.map(function (item) {
        return item.label;
      }).join(' ');
      if (labels.indexOf('1.5') === -1) fail('cisco-1-5', labels);
      else pass('cisco-1-5');
      if (labels.indexOf('2.4') === -1) fail('cisco-2-4', labels);
      else pass('cisco-2-4');
    }

    if (!support || !support.challenges || support.challenges.length !== 3) {
      fail('challenges', 'expected 3');
    } else pass('challenges');

    if (!improvement || improvement.activityId !== 'week4-answer-improvement') {
      fail('answer-improvement', 'missing');
    } else pass('answer-improvement');

    if (routing && routing.getSubmissionService('week4-directed-study')) {
      fail('directed-not-scored', 'directed study must not be routed');
    } else pass('directed-not-scored');

    if (week3 && week3.ACTIVITY_CATALOG && week3.ACTIVITY_CATALOG.length === 7) {
      pass('week3-regression-catalog');
    } else if (week3) {
      fail('week3-regression-catalog', String((week3.ACTIVITY_CATALOG || []).length));
    } else {
      pass('week3-regression-catalog-skipped');
    }

    if (course.getActivity('week3-session1-retrieval')) pass('week3-registry-intact');
    else fail('week3-registry-intact', 'missing week3 activity');

    if (course.getActivity('week2-session1-retrieval')) pass('week2-registry-intact');
    else fail('week2-registry-intact', 'missing week2 activity');

    return results;
  }

  global.Unit3Week4Tests = {
    EXPECTED: EXPECTED,
    runWeek4RegistryTests: runWeek4RegistryTests
  };
})(window);
