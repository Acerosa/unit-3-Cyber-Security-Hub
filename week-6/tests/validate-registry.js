/**
 * Week 6 registry and curriculum content consistency checks.
 */
(function (global) {
  'use strict';

  var EXPECTED = [
    { id: 'week6-lo2-diagnostic', total: 12, version: '1.0' },
    { id: 'week6-ethical-learning', total: 6, version: '1.0' },
    { id: 'week6-ethical-classification', total: 8, version: '1.0' },
    { id: 'week6-legislation-learning', total: 6, version: '1.0' },
    { id: 'week6-legislation-matching', total: 6, version: '1.0' },
    { id: 'week6-operational-considerations', total: 7, version: '1.0' },
    { id: 'week6-government-initiatives', total: 4, version: '1.0' },
    { id: 'week6-ncsc-guidance', total: 4, version: '1.0' },
    { id: 'week6-exercise-decision-record', total: 5, version: '1.0' },
    { id: 'week6-session1-review', total: 3, version: '1.0' },
    { id: 'week6-legislation-retrieval', total: 10, version: '1.0' },
    { id: 'week6-employee-monitoring', total: 6, version: '1.0' },
    { id: 'week6-stakeholder-debate', total: 10, version: '1.0' },
    { id: 'week6-discuss-learning', total: 5, version: '1.0' },
    { id: 'week6-discuss-planner', total: 6, version: '1.0' },
    { id: 'week6-ocr-question-practice', total: 20, version: '1.0' },
    { id: 'week6-answer-improvement', total: 6, version: '1.0' },
    { id: 'week6-revision-organiser', total: 6, version: '1.0' }
  ];

  function runWeek6RegistryTests() {
    var results = [];
    var course = global.Unit3CourseContext;
    var progress = global.Unit3Week6Progress;
    var routing = global.Unit3ActivityEngineConfig;
    var week5 = global.Unit3Week5Progress;

    var diagnostic = global.Week6Lo2Diagnostic;
    var ethicalLearning = global.Week6EthicalLearning;
    var classification = global.Week6EthicalClassification;
    var legislationLearning = global.Week6LegislationLearning;
    var matching = global.Week6LegislationMatching;
    var operational = global.Week6OperationalConsiderations;
    var initiatives = global.Week6GovernmentInitiatives;
    var ncsc = global.Week6NcscGuidance;
    var decisionRecord = global.Week6ExerciseDecisionRecord;
    var session1Review = global.Week6Session1Review;
    var legislationRetrieval = global.Week6LegislationRetrieval;
    var monitoring = global.Week6EmployeeMonitoring;
    var debate = global.Week6StakeholderDebate;
    var discussLearning = global.Week6DiscussLearning;
    var discussPlanner = global.Week6DiscussPlanner;
    var ocr = global.Week6OcrPractice;
    var improvement = global.Week6AnswerImprovement;
    var revision = global.Week6RevisionOrganiser;
    var directed = global.Week6DirectedStudy;
    var support = global.Week6SupportChallenge;

    function pass(name) {
      results.push({ name: name, ok: true });
    }
    function fail(name, detail) {
      results.push({ name: name, ok: false, detail: detail || '' });
    }

    if (!course || !progress) {
      fail('modules-loaded', 'Missing course context or Week 6 progress');
      return results;
    }
    pass('modules-loaded');

    if (EXPECTED.length !== progress.ACTIVITY_CATALOG.length) {
      fail('catalog-count', 'Expected ' + EXPECTED.length + ' got ' + progress.ACTIVITY_CATALOG.length);
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
      if (reg.weekNumber !== 6) fail('week-' + item.id, String(reg.weekNumber));
      else pass('week-' + item.id);
      if (routing && routing.getSubmissionService(item.id) !== routing.SUBMISSION_SERVICE.WEEK6_API) {
        fail('routing-' + item.id, routing.getSubmissionService(item.id));
      } else pass('routing-' + item.id);
    });

    if (progress.ROOT_KEY !== 'unit3-week6-progress') fail('root-key', progress.ROOT_KEY);
    else pass('root-key');

    if (!routing || typeof routing.getWeek6ApiBaseUrl !== 'function') {
      fail('week6-api-helper', 'missing');
    } else if (routing.getWeek6ApiBaseUrl() !== '') {
      fail('week6-api-empty', routing.getWeek6ApiBaseUrl());
    } else pass('week6-api-empty');

    if (!diagnostic || !diagnostic.questions || diagnostic.questions.length !== 12) {
      fail('diagnostic-count', 'expected 12');
    } else {
      pass('diagnostic-count');
      var withTopic = diagnostic.questions.filter(function (q) {
        return q.topic;
      }).length;
      if (withTopic !== 12) fail('diagnostic-topics', String(withTopic));
      else pass('diagnostic-topics');
    }

    if (!classification || !classification.categories) fail('classification-categories', 'missing');
    else {
      var cats = classification.categories.join('|').toLowerCase();
      ['unethical', 'unlawful', 'both', 'neither'].forEach(function (name) {
        if (cats.indexOf(name) === -1) fail('category-' + name, cats);
        else pass('category-' + name);
      });
      if (!classification.items || classification.items.length !== 8) {
        fail('classification-count', 'expected 8');
      } else pass('classification-count');
    }

    if (!legislationLearning) fail('legislation-learning', 'missing');
    else {
      var lawBlob = JSON.stringify(legislationLearning);
      if (lawBlob.indexOf('Computer Misuse Act 1990') === -1) fail('cma-present', 'missing');
      else pass('cma-present');
      if (lawBlob.indexOf('current United Kingdom data protection legislation') === -1) {
        fail('dp-wording', 'missing required phrase');
      } else pass('dp-wording');
      if (lawBlob.indexOf('Police and Justice Act 2006') === -1) fail('pja-present', 'missing');
      else pass('pja-present');
      if (/Data Protection Act 2018|UK GDPR|72 hour|notification period of/i.test(lawBlob)) {
        fail('invented-legal-detail', 'unsupported statute detail');
      } else pass('no-invented-legal-detail');
    }

    if (!matching || !matching.scenarios || matching.scenarios.length !== 6) {
      fail('matching-count', 'expected 6');
    } else {
      pass('matching-count');
      var needsDuty = matching.scenarios.every(function (item) {
        return item.legislation && item.duty;
      });
      if (!needsDuty) fail('matching-duty-required', 'legislation without duty/offence');
      else pass('matching-duty-required');
    }

    if (!operational) fail('operational', 'missing');
    else {
      var opBlob = JSON.stringify(operational).toLowerCase();
      ['financial cost', 'staff time', 'downtime', 'usability', 'productivity'].forEach(function (term) {
        if (opBlob.indexOf(term) === -1) fail('operational-' + term, 'missing');
        else pass('operational-' + term);
      });
    }

    if (!initiatives) fail('initiatives', 'missing');
    else {
      var initBlob = JSON.stringify(initiatives);
      [
        'United Kingdom Cyber Security Strategy',
        'Cyber Essentials',
        '10 Steps to Cyber Security',
        'Cyber Streetwise'
      ].forEach(function (name) {
        if (initBlob.indexOf(name) === -1) fail('initiative-' + name, 'missing');
        else pass('initiative-' + name);
      });
    }

    if (!ncsc) fail('ncsc-guidance', 'missing');
    else {
      var ncscBlob = JSON.stringify(ncsc);
      if (ncscBlob.indexOf('Insider threat resulting in a data breach') === -1) {
        fail('ncsc-exercise-title', 'missing');
      } else pass('ncsc-exercise-title');
      if (/inject\s+\d|stage\s+1:|what would you do next\?/i.test(ncscBlob)) {
        fail('invented-ncsc-prompts', 'possible staged prompt content');
      } else pass('no-invented-ncsc-prompts');
      if (ncscBlob.indexOf('ncsc.gov.uk') === -1) fail('ncsc-link', 'missing');
      else pass('ncsc-link');
    }

    if (!decisionRecord || !decisionRecord.entryFields) fail('decision-record', 'missing');
    else pass('decision-record');

    if (!session1Review) fail('session1-review', 'missing');
    else pass('session1-review');

    if (!legislationRetrieval || !legislationRetrieval.questions || legislationRetrieval.questions.length !== 10) {
      fail('legislation-retrieval-count', 'expected 10');
    } else pass('legislation-retrieval-count');

    if (!monitoring || !monitoring.stakeholderRoles) fail('monitoring-stakeholders', 'missing');
    else {
      var labels = monitoring.stakeholderRoles
        .map(function (item) {
          return String(item.label || item.id || item).toLowerCase();
        })
        .join('|');
      ['employee', 'manager', 'customer', 'regulator', 'shareholder'].forEach(function (name) {
        if (labels.indexOf(name) === -1) fail('stakeholder-' + name, labels);
        else pass('stakeholder-' + name);
      });
    }

    if (!debate || !debate.fields) fail('debate-fields', 'missing');
    else {
      var fieldIds = debate.fields.map(function (f) {
        return f.id;
      });
      ['ethical', 'legal', 'operational', 'concession', 'recommendation'].forEach(function (id) {
        if (fieldIds.indexOf(id) === -1) fail('debate-field-' + id, fieldIds.join('|'));
        else pass('debate-field-' + id);
      });
      if (!debate.participationRoles || debate.participationRoles.length !== 3) {
        fail('debate-participation-roles', 'expected 3');
      } else pass('debate-participation-roles');
    }

    if (!discussLearning || !discussLearning.weakResponse || !discussLearning.strongResponse) {
      fail('discuss-comparison', 'missing');
    } else pass('discuss-comparison');

    if (!discussPlanner || !discussPlanner.columns) fail('discuss-planner', 'missing');
    else {
      var sectionBlob = JSON.stringify(discussPlanner.columns).toLowerCase();
      if (sectionBlob.indexOf('concession') === -1 && String(discussPlanner.concessionLabel || '').toLowerCase().indexOf('concession') === -1) {
        fail('planner-concession', 'missing');
      } else pass('planner-concession');
    }

    if (!ocr || ocr.total !== 20) fail('ocr-total', ocr && String(ocr.total));
    else pass('ocr-total');
    var ocrBlob = JSON.stringify(ocr || {}).toLowerCase();
    if (ocrBlob.indexOf('ocr-style') === -1 && ocrBlob.indexOf('not official') === -1) {
      fail('ocr-style-label', 'missing non-official disclaimer');
    } else pass('ocr-style-label');
    if (ocrBlob.indexOf('discuss') === -1) fail('ocr-discuss-question', 'missing');
    else pass('ocr-discuss-question');

    if (!improvement) fail('answer-improvement', 'missing');
    else pass('answer-improvement');

    if (!revision || !revision.sections) fail('revision-organiser', 'missing');
    else {
      var codes = revision.sections
        .map(function (s) {
          return String(s.code || s.id || '');
        })
        .join('|');
      ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6'].forEach(function (code) {
        if (codes.indexOf(code) === -1) fail('revision-' + code, codes);
        else pass('revision-' + code);
      });
    }

    if (!directed) fail('directed-study', 'missing');
    else pass('directed-study');

    if (!support || !support.challenges || support.challenges.length !== 3) {
      fail('challenges', 'expected 3');
    } else pass('challenges');

    if (routing && routing.getSubmissionService('week6-directed-study')) {
      fail('directed-not-scored', 'directed study must not be routed');
    } else pass('directed-not-scored');

    if (week5 && week5.ACTIVITY_CATALOG && week5.ACTIVITY_CATALOG.length === 10) {
      pass('week5-regression-catalog');
    } else if (week5) {
      fail('week5-regression-catalog', String((week5.ACTIVITY_CATALOG || []).length));
    } else {
      fail('week5-regression-catalog', 'Week 5 progress module missing');
    }

    var allWeek6 = [
      diagnostic,
      ethicalLearning,
      classification,
      legislationLearning,
      matching,
      operational,
      initiatives,
      ncsc,
      decisionRecord,
      session1Review,
      legislationRetrieval,
      monitoring,
      debate,
      discussLearning,
      discussPlanner,
      ocr,
      improvement,
      revision,
      directed,
      support
    ];
    var emDash = allWeek6.some(function (item) {
      return item && JSON.stringify(item).indexOf('\u2014') !== -1;
    });
    if (emDash) fail('no-em-dashes', 'em dash found in Week 6 data');
    else pass('no-em-dashes');

    return results;
  }

  global.Unit3Week6Tests = {
    runWeek6RegistryTests: runWeek6RegistryTests
  };
})(typeof window !== 'undefined' ? window : global);
