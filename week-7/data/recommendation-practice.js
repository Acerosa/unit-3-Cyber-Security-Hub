/**
 * Week 7 justified recommendation practice (6 marks).
 */
(function (global) {
  'use strict';

  global.Week7RecommendationPractice = Object.freeze({
    activityId: 'week7-recommendation-practice',
    activityName: 'Justified Recommendation Practice',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 2,
    total: 6,
    estimatedMinutes: 25,
    structureNote:
      'Full credit is not awarded for naming a measure alone. Build: (1) name the measure, (2) explain why it suits Northbank, (3) state how effectiveness is judged. Also compare an alternative and state cost or limitation.',
    scenario:
      'Northbank Community Health Partnership has a Medium-to-High risk that staff credentials for the appointment system could be stolen through phishing. Clinics are busy, budgets are limited, and managers want a recommendation they can justify to partners without claiming that installation alone proves success.',
    fields: Object.freeze([
      Object.freeze({
        id: 'measure',
        label: '1. Name the recommended measure',
        minChars: 4,
        feedbackKey: 'named'
      }),
      Object.freeze({
        id: 'whyOrg',
        label: '2. Why this suits Northbank (organisational context)',
        minChars: 40,
        feedbackKey: 'context'
      }),
      Object.freeze({
        id: 'effectiveness',
        label: '3. How effectiveness will be judged (measurable)',
        minChars: 30,
        feedbackKey: 'effectiveness'
      }),
      Object.freeze({
        id: 'registerRef',
        label: 'Risk register reference (entry or asset name)',
        minChars: 3,
        feedbackKey: 'named'
      }),
      Object.freeze({
        id: 'costLimitation',
        label: 'Cost or limitation',
        minChars: 25,
        feedbackKey: 'limitation'
      }),
      Object.freeze({
        id: 'alternative',
        label: 'Compare an alternative measure',
        minChars: 25,
        feedbackKey: 'comparison'
      }),
      Object.freeze({
        id: 'whyAltLess',
        label: 'Why the alternative is less effective here',
        minChars: 25,
        feedbackKey: 'comparison'
      })
    ]),
    feedbackLabels: Object.freeze({
      named: 'Named measure',
      context: 'Contextual reason for Northbank',
      effectiveness: 'Measurable effectiveness',
      limitation: 'Cost or limitation',
      comparison: 'Comparison with alternative'
    }),
    weakPatterns: Object.freeze([
      'Naming a product with no Northbank reason',
      'Effectiveness stated only as “installed”',
      'No alternative considered'
    ])
  });
})(window);
