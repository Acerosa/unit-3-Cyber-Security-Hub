/**
 * Week 7 registry and curriculum content consistency checks.
 */
(function (global) {
  'use strict';

  var EXPECTED = [
    { id: 'week7-session1-retrieval', total: 6, version: '1.0' },
    { id: 'week7-risk-management-learning', total: 8, version: '1.0' },
    { id: 'week7-northbank-risk-register', total: 10, version: '1.0' },
    { id: 'week7-testing-methods', total: 8, version: '1.0' },
    { id: 'week7-sandbox-observation', total: 4, version: '1.0' },
    { id: 'week7-detection-prevention', total: 8, version: '1.0' },
    { id: 'week7-heightened-threat', total: 5, version: '1.0' },
    { id: 'week7-session2-retrieval', total: 10, version: '1.0' },
    { id: 'week7-testing-matching', total: 8, version: '1.0' },
    { id: 'week7-recommendation-practice', total: 6, version: '1.0' },
    { id: 'week7-ocr-question-practice', total: 20, version: '1.0' },
    { id: 'week7-answer-improvement', total: 6, version: '1.0' }
  ];

  function runWeek7RegistryTests() {
    var results = [];
    var course = global.Unit3CourseContext;
    var progress = global.Unit3Week7Progress;
    var routing = global.Unit3ActivityEngineConfig;
    var week6 = global.Unit3Week6Progress;

    var session1 = global.Week7Session1Retrieval;
    var riskLearning = global.Week7RiskManagementLearning;
    var riskRegister = global.Week7RiskRegister;
    var testingMethods = global.Week7TestingMethods;
    var sandbox = global.Week7SandboxObservation;
    var detection = global.Week7DetectionPrevention;
    var heightened = global.Week7HeightenedThreat;
    var session2 = global.Week7Session2Retrieval;
    var matching = global.Week7TestingMatching;
    var recommendation = global.Week7RecommendationPractice;
    var ocr = global.Week7OcrPractice;
    var improvement = global.Week7AnswerImprovement;
    var directed = global.Week7DirectedStudy;
    var support = global.Week7SupportChallenge;

    function pass(name) {
      results.push({ name: name, ok: true });
    }
    function fail(name, detail) {
      results.push({ name: name, ok: false, detail: detail || '' });
    }

    if (!course || !progress) {
      fail('modules-loaded', 'Missing course context or Week 7 progress');
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
      if (reg.weekNumber !== 7) fail('week-' + item.id, String(reg.weekNumber));
      else pass('week-' + item.id);
      if (routing && routing.getSubmissionService(item.id) !== routing.SUBMISSION_SERVICE.WEEK7_API) {
        fail('routing-' + item.id, routing.getSubmissionService(item.id));
      } else pass('routing-' + item.id);
    });

    if (progress.ROOT_KEY !== 'unit3-week7-progress') fail('root-key', progress.ROOT_KEY);
    else pass('root-key');

    if (!routing || typeof routing.getWeek7ApiBaseUrl !== 'function') {
      fail('week7-api-helper', 'missing');
    } else if (routing.getWeek7ApiBaseUrl() !== '') {
      fail('week7-api-empty', routing.getWeek7ApiBaseUrl());
    } else pass('week7-api-empty');

    function assertNoEmDash(label, value) {
      var text = typeof value === 'string' ? value : JSON.stringify(value);
      if (text && text.indexOf('\u2014') !== -1) fail(label + '-emdash', 'contains em dash');
      else pass(label + '-emdash');
    }

    if (!session1 || !session1.questions || session1.questions.length < 4) {
      fail('session1-retrieval', 'expected MCQ questions');
    } else pass('session1-retrieval');

    if (
      !riskLearning ||
      !riskLearning.stages ||
      riskLearning.stages.length !== 8 ||
      !riskLearning.knowledgeCheck ||
      riskLearning.knowledgeCheck.length !== 8
    ) {
      fail('risk-learning-stages', 'expected 8 stages and 8 knowledge checks');
    } else pass('risk-learning-stages');

    if (riskLearning) {
      var acceptBlob = JSON.stringify(riskLearning.acceptWorkedExample || riskLearning.workedExamples || {});
      if (!/accept/i.test(acceptBlob)) fail('risk-accept-example', 'missing accept worked example');
      else pass('risk-accept-example');
      assertNoEmDash('risk-learning', riskLearning);
    }

    if (!riskRegister || !riskRegister.scoringGuide || !riskRegister.scoringGuide.matrix) {
      fail('risk-scoring-guide', 'missing');
    } else if (riskRegister.scoringGuide.matrix.length !== 9) {
      fail('risk-matrix-size', String(riskRegister.scoringGuide.matrix.length));
    } else pass('risk-scoring-guide');

    if (!riskRegister || !riskRegister.sampleRows || riskRegister.sampleRows.length < 2) {
      fail('risk-sample-rows', 'expected two worked rows');
    } else pass('risk-sample-rows');

    if (typeof progress.loadWeek2VulnerabilityRegister !== 'function') {
      fail('week2-register-loader', 'missing');
    } else pass('week2-register-loader');

    if (
      !testingMethods ||
      !testingMethods.methods ||
      testingMethods.methods.length !== 4
    ) {
      fail('testing-methods-count', 'expected 4');
    } else {
      var names = testingMethods.methods.map(function (m) {
        return m.name || m.title || '';
      }).join(' | ');
      if (
        names.indexOf('Penetration') === -1 ||
        names.indexOf('Fuzzing') === -1 ||
        names.indexOf('Security functionality') === -1 ||
        names.indexOf('Sandbox') === -1
      ) {
        fail('testing-methods-names', names);
      } else pass('testing-methods-names');
    }

    if (!sandbox || sandbox.executesFiles === true) {
      fail('sandbox-no-execution', 'must not execute files');
    } else pass('sandbox-no-execution');

    if (!detection) {
      fail('detection-data', 'missing');
    } else {
      var blob = JSON.stringify(detection);
      [
        'Intrusion detection',
        'Intrusion prevention',
        'NIDS',
        'HIDS',
        'DIDS',
        'Anomaly',
        'Signature',
        'Honeypot'
      ].forEach(function (term) {
        if (blob.indexOf(term) === -1) fail('detection-term-' + term, 'missing');
        else pass('detection-term-' + term);
      });
    }

    if (
      !heightened ||
      heightened.ncscUrl !==
        'https://www.ncsc.gov.uk/section/exercise-in-a-box/heightened-cyber-threat'
    ) {
      fail('heightened-ncsc-url', heightened && heightened.ncscUrl);
    } else pass('heightened-ncsc-url');

    if (heightened && /inject|stage \d|scenario card/i.test(JSON.stringify(heightened))) {
      fail('heightened-no-ncsc-prompts', 'possible invented NCSC prompts');
    } else pass('heightened-no-ncsc-prompts');

    if (!session2 || !session2.questions || session2.questions.length !== 10) {
      fail('session2-count', session2 && session2.questions && session2.questions.length);
    } else pass('session2-count');

    var matchRows = matching && (matching.scenarios || matching.classificationItems || matching.cards);
    if (!matchRows || matchRows.length !== 8) {
      fail('matching-count', matchRows && matchRows.length);
    } else {
      pass('matching-count');
      var altSource = matching.scenarios || [];
      var altCount = altSource.filter(function (s) {
        return s.alternativeAnswers && s.alternativeAnswers.length;
      }).length;
      // Remainder keeps alternativeAnswers; Content classify marks preferred only.
      if (altSource.length && altCount < 2) fail('matching-alternatives', String(altCount));
      else pass('matching-alternatives');
    }

    if (!recommendation || !recommendation.fields) {
      fail('recommendation-fields', 'missing');
    } else {
      var ids = recommendation.fields.map(function (f) {
        return f.id;
      }).join(',');
      if (
        ids.indexOf('measure') === -1 ||
        ids.indexOf('context') === -1 && ids.indexOf('suitability') === -1 ||
        ids.indexOf('effectiveness') === -1
      ) {
        // allow flexible field naming
        var blobRec = JSON.stringify(recommendation);
        if (
          blobRec.indexOf('effectiveness') === -1 ||
          blobRec.indexOf('suit') === -1
        ) {
          fail('recommendation-structure', ids);
        } else pass('recommendation-structure');
      } else pass('recommendation-structure');
    }

    if (!ocr || !ocr.questions) {
      fail('ocr-questions', 'missing');
    } else {
      var markSum = ocr.questions.reduce(function (sum, q) {
        return sum + (q.marks || 0);
      }, 0);
      if (markSum !== 20) fail('ocr-marks-sum', String(markSum));
      else pass('ocr-marks-sum');
      if (!/OCR-style|not official OCR/i.test(JSON.stringify(ocr))) {
        fail('ocr-disclaimer', 'missing OCR-style disclaimer');
      } else pass('ocr-disclaimer');
    }

    if (!improvement) fail('answer-improvement', 'missing');
    else pass('answer-improvement');

    if (!directed || directed.scored === true) fail('directed-unscored', 'should be unscored');
    else pass('directed-unscored');

    if (routing && routing.getSubmissionService('week7-directed-study')) {
      fail('directed-not-routed', routing.getSubmissionService('week7-directed-study'));
    } else pass('directed-not-routed');

    if (!support || !support.challenges || support.challenges.length !== 5) {
      fail('support-challenges', support && support.challenges && support.challenges.length);
    } else pass('support-challenges');

    if (week6 && week6.ACTIVITY_CATALOG && week6.ACTIVITY_CATALOG.length !== 18) {
      fail('week6-regression', String(week6.ACTIVITY_CATALOG.length));
    } else if (week6) pass('week6-regression');
    else pass('week6-regression-skipped');

    assertNoEmDash('ocr', ocr);
    assertNoEmDash('matching', matching);
    assertNoEmDash('risk-register', riskRegister);

    return results;
  }

  global.Unit3Week7Tests = {
    runWeek7RegistryTests: runWeek7RegistryTests
  };
})(window);
