/**
 * Week 7 sandbox observation record (4 marks).
 */
(function (global) {
  'use strict';

  global.Week7SandboxObservation = Object.freeze({
    activityId: 'week7-sandbox-observation',
    activityName: 'Safe Sandboxing Demonstration Record',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 1,
    total: 4,
    estimatedMinutes: 20,
    executesFiles: false,
    safetyNotice:
      'This hub does not upload, execute or analyse malware. There is no file upload and no malware analysis service. Record only what you observe in the tutor-led demonstration.',
    demoNotes: Object.freeze([
      'Your tutor will demonstrate placing an untrusted sample into an isolated environment.',
      'Watch for process, file or network behaviour that appears without running anything on your own device.',
      'Discuss what the demonstration can and cannot prove about safety on clinical systems.'
    ]),
    fields: Object.freeze([
      Object.freeze({
        id: 'whatPlaced',
        label: 'What was placed in the sandbox (as described by the tutor)?',
        minChars: 20,
        marks: 0.5
      }),
      Object.freeze({
        id: 'whyIsolation',
        label: 'Why was isolation used?',
        minChars: 25,
        marks: 0.5
      }),
      Object.freeze({
        id: 'behaviourObserved',
        label: 'What behaviour was observed?',
        minChars: 25,
        marks: 1
      }),
      Object.freeze({
        id: 'analysisRevealed',
        label: 'What did the analysis reveal (or suggest)?',
        minChars: 25,
        marks: 0.5
      }),
      Object.freeze({
        id: 'couldNotProve',
        label: 'What could the sandbox demonstration not prove?',
        minChars: 25,
        marks: 0.5
      }),
      Object.freeze({
        id: 'whyUnsafeDirect',
        label: 'Why would it be unsafe to open the sample directly on a clinical or personal device?',
        minChars: 30,
        marks: 1
      })
    ]),
    completionNote:
      'Score is based on field completeness. Empty or one-word answers do not earn marks.'
  });
})(window);
