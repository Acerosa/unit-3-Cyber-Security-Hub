/**
 * Week 5 exercise debrief after facilitated ransomware exercise.
 */
(function (global) {
  'use strict';

  global.Week5ExerciseDebrief = Object.freeze({
    activityId: 'week5-exercise-debrief',
    activityName: 'Exercise Debrief',
    activityVersion: '1.0',
    weekNumber: 5,
    sessionNumber: 1,
    total: 4,
    estimatedMinutes: 20,
    intro:
      'Revisit the decisions recorded in the companion workspace. This debrief is about impacts and stakeholders, not formal incident-response stage teaching.',
    globalIssueNote:
      'Cyber security is a global issue affecting individuals, organisations and states. Use your Northbank decisions to show how one incident can reach beyond a single IT team.',
    prompts: Object.freeze([
      Object.freeze({
        id: 'impactReduced',
        label: 'Which impact was each key decision intended to reduce?',
        rows: 4
      }),
      Object.freeze({
        id: 'stakeholderBenefit',
        label: 'Which stakeholder benefited from each key decision?',
        rows: 3
      }),
      Object.freeze({
        id: 'timescale',
        label: 'Was the intended effect immediate or longer term? Explain for at least one decision.',
        rows: 3
      }),
      Object.freeze({
        id: 'negativeEffect',
        label:
          'Could another stakeholder have been negatively affected by the same decision? Explain.',
        rows: 3
      }),
      Object.freeze({
        id: 'globalLink',
        label:
          'In two or three sentences, explain how this incident shows cyber security affecting individuals, organisations and states.',
        rows: 4
      })
    ]),
    sentenceStarters: Object.freeze([
      'Immediately after the incident…',
      'This would affect the stakeholder because…',
      'Six months later…',
      'The scenario states that…, which means…',
      'This is a safety impact because…'
    ])
  });
})(window);
