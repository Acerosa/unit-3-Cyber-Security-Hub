/**
 * Week 5 registry and curriculum content consistency checks.
 */
(function (global) {
  'use strict';

  var EXPECTED = [
    { id: 'week5-session1-retrieval', total: 8, version: '1.0' },
    { id: 'week5-vulnerability-patterns', total: 8, version: '1.0' },
    { id: 'week5-threat-vulnerability-risk', total: 8, version: '1.0' },
    { id: 'week5-impacts-learning', total: 9, version: '1.0' },
    { id: 'week5-impact-classification', total: 8, version: '1.0' },
    { id: 'week5-ransomware-companion', total: 4, version: '1.0' },
    { id: 'week5-exercise-debrief', total: 4, version: '1.0' },
    { id: 'week5-session2-retrieval', total: 12, version: '1.0' },
    { id: 'week5-stakeholder-grid', total: 10, version: '1.0' },
    { id: 'week5-impact-analysis', total: 6, version: '1.0' },
    { id: 'week5-controls-matching', total: 8, version: '1.0' },
    { id: 'week5-secure-rewrite', total: 6, version: '1.0' },
    { id: 'week5-ocr-question-practice', total: 20, version: '1.0' },
    { id: 'week5-answer-improvement', total: 6, version: '1.0' }
  ];

  function runWeek5RegistryTests() {
    var results = [];
    var course = global.Unit3CourseContext;
    var progress = global.Unit3Week5Progress;
    var routing = global.Unit3ActivityEngineConfig;
    var week4 = global.Unit3Week4Progress;
    var impacts = global.Week5ImpactsLearning;
    var classification = global.Week5ImpactClassification;
    var companion = global.Week5RansomwareCompanion;
    var grid = global.Week5StakeholderGrid;
    var analysis = global.Week5ImpactAnalysis;
    var ocr = global.Week5OcrPractice;
    var improvement = global.Week5AnswerImprovement;
    var directed = global.Week5DirectedStudy;
    var support = global.Week5SupportChallenge;
    var retrieval1 = global.Week5Session1Retrieval;
    var retrieval2 = global.Week5Session2Retrieval;

    function pass(name) {
      results.push({ name: name, ok: true });
    }
    function fail(name, detail) {
      results.push({ name: name, ok: false, detail: detail || '' });
    }

    if (!course || !progress) {
      fail('modules-loaded', 'Missing course context or Week 5 progress');
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
      if (reg.weekNumber !== 5) fail('week-' + item.id, String(reg.weekNumber));
      else pass('week-' + item.id);
      if (routing && routing.getSubmissionService(item.id) !== routing.SUBMISSION_SERVICE.WEEK5_API) {
        fail('routing-' + item.id, routing.getSubmissionService(item.id));
      } else pass('routing-' + item.id);
    });

    if (progress.ROOT_KEY !== 'unit3-week5-progress') fail('root-key', progress.ROOT_KEY);
    else pass('root-key');

    if (!routing || typeof routing.getWeek5ApiBaseUrl !== 'function') {
      fail('week5-api-helper', 'missing');
    } else if (routing.getWeek5ApiBaseUrl() !== '') {
      fail('week5-api-empty', routing.getWeek5ApiBaseUrl());
    } else pass('week5-api-empty');

    if (!impacts || !impacts.lossForms || impacts.lossForms.length !== 9) {
      fail('loss-forms', 'expected 9');
    } else pass('loss-forms');

    if (!impacts.definitions || !impacts.definitions.safety) fail('safety-definition', 'missing');
    else pass('safety-definition');

    var classifyRows = classification && (classification.items || classification.classificationItems || classification.cards);
    if (!classification || !classifyRows || classifyRows.length !== 8) fail('classification-count', 'expected 8');
    else {
      pass('classification-count');
      var cats = (classification.categories || []).map(function (item) {
        return typeof item === 'string' ? item : (item.label || item.id || '');
      }).join('|');
      ['Loss', 'Disruption', 'Safety', 'More than one category'].forEach(function (name) {
        if (cats.indexOf(name) === -1) fail('category-' + name, cats);
        else pass('category-' + name);
      });
      var ambiguousSource = classification.items || classifyRows;
      var ambiguous = ambiguousSource.filter(function (item) {
        return item.ambiguous;
      }).length;
      if (ambiguous < 1) fail('ambiguous-items', String(ambiguous));
      else pass('ambiguous-items');
      var appointment = classifyRows.some(function (item) {
        var text = item.statement || item.text || '';
        return /healthcare appointment is cancelled|cancelled healthcare appointment/i.test(text);
      });
      if (!appointment) fail('cancelled-appointment-example', 'missing');
      else pass('cancelled-appointment-example');
    }

    if (!companion) fail('companion-data', 'missing');
    else {
      pass('companion-data');
      if (companion.roles.length !== 4) fail('role-count', String(companion.roles.length));
      else pass('role-count');
      var roleNames = companion.roles.map(function (role) {
        return role.title.toLowerCase();
      }).join('|');
      ['practice manager', 'it support contractor', 'records officer', 'communications lead'].forEach(
        function (name) {
          if (roleNames.indexOf(name) === -1) fail('role-' + name, roleNames);
          else pass('role-' + name);
        }
      );
      var blob = JSON.stringify(companion);
      if (/inject\s+\d|stage\s+1:|what would you do next\?/i.test(blob)) {
        fail('invented-ncsc-prompts', 'possible staged prompt content');
      } else pass('no-invented-ncsc-prompts');
      if (blob.indexOf('ncsc.gov.uk') === -1) fail('ncsc-link', 'missing');
      else pass('ncsc-link');
    }

    if (!grid) fail('grid-data', 'missing');
    else {
      var labels = grid.stakeholders.map(function (item) {
        return item.label.toLowerCase();
      });
      [
        'individuals',
        'northbank as the organisation',
        'employees',
        'customers or patients',
        'suppliers',
        'regulators',
        'the state'
      ].forEach(function (name) {
        if (labels.indexOf(name) === -1) fail('stakeholder-' + name, labels.join('|'));
        else pass('stakeholder-' + name);
      });
      var cols = grid.columns.map(function (item) {
        return item.id;
      });
      ['loss', 'disruption', 'safety', 'evidence', 'timescale'].forEach(function (name) {
        if (cols.indexOf(name) === -1) fail('column-' + name, cols.join('|'));
        else pass('column-' + name);
      });
      var worked = grid.stakeholders.filter(function (item) {
        return item.workedExample;
      });
      if (worked.length !== 1 || worked[0].id !== 'individuals') {
        fail('worked-individuals-row', String(worked.length));
      } else pass('worked-individuals-row');
    }

    if (!analysis || !analysis.strongResponse || !analysis.weakResponse) {
      fail('analysis-responses', 'missing');
    } else {
      pass('analysis-responses');
      if (!analysis.writingTasks || analysis.writingTasks.length !== 2) {
        fail('timescale-writing-tasks', 'expected 2');
      } else pass('timescale-writing-tasks');
    }

    if (!ocr || ocr.total !== 20) fail('ocr-total', ocr && String(ocr.total));
    else pass('ocr-total');
    if (!ocr || String(ocr.timingGuidance || '').indexOf('not official OCR') === -1) {
      fail('ocr-style-label', 'missing non-official disclaimer');
    } else pass('ocr-style-label');

    if (!improvement || improvement.activityId !== 'week5-answer-improvement') {
      fail('answer-improvement', 'missing');
    } else {
      pass('answer-improvement');
      if (String(improvement.commonError || '').toLowerCase().indexOf('safety') === -1) {
        fail('dominant-error-safety', improvement.commonError);
      } else pass('dominant-error-safety');
    }

    if (!directed || !directed.tryhackme || directed.tryhackme.url.indexOf('juicydetails') === -1) {
      fail('thm-juicy-details', 'missing');
    } else pass('thm-juicy-details');

    if (!support || !support.challenges || support.challenges.length !== 3) {
      fail('challenges', 'expected 3');
    } else pass('challenges');

    if (!retrieval1 || retrieval1.questions.length !== 8) fail('retrieval1-count', 'expected 8');
    else pass('retrieval1-count');
    if (!retrieval2 || retrieval2.questions.length !== 12) fail('retrieval2-count', 'expected 12');
    else pass('retrieval2-count');

    if (routing && routing.getSubmissionService('week5-directed-study')) {
      fail('directed-not-scored', 'directed study must not be routed');
    } else pass('directed-not-scored');

    if (week4 && week4.ACTIVITY_CATALOG && week4.ACTIVITY_CATALOG.length === 10) {
      pass('week4-regression-catalog');
    } else if (week4) {
      fail('week4-regression-catalog', String((week4.ACTIVITY_CATALOG || []).length));
    } else {
      fail('week4-regression-catalog', 'Week 4 progress module missing');
    }

    // LO2 / outcomes content presence in impacts learning
    var outcomesBlob = JSON.stringify(impacts) + JSON.stringify(retrieval1);
    if (outcomesBlob.toLowerCase().indexOf('global') === -1) fail('global-problem', 'missing');
    else pass('global-problem');

    return results;
  }

  global.Unit3Week5Tests = {
    runWeek5RegistryTests: runWeek5RegistryTests
  };
})(window);
