/**
 * Week 4 Northbank passive-exposure reflection.
 * Uses only Northbank facts already established in Weeks 2–3.
 */
(function (global) {
  'use strict';

  global.Week4NorthbankExposure = Object.freeze({
    activityId: 'week4-northbank-exposure',
    activityName: 'Northbank Passive-Exposure Reflection',
    activityVersion: '1.0',
    weekNumber: 4,
    sessionNumber: 1,
    total: 3,
    organisationName: 'Northbank Community Health Partnership',
    fictionalNotice:
      'Northbank is a fictional teaching organisation used across Unit 3. Do not treat it as a real health provider and do not perform passive reconnaissance against any real organisation.',
    establishedFacts: Object.freeze([
      'Northbank is a healthcare organisation with clinics.',
      'It has a patient appointment portal.',
      'It has a public website.',
      'Reception staff handle email and visitor-facing tasks.',
      'Finance processes invoices and payments.',
      'There is a server room and clinic computing equipment (including laptops).',
      'Remote access arrangements (such as RDP for home working) have been discussed in earlier weeks.',
      'There is a supplier / booking portal context in earlier week scenarios.',
      'Patient records and contact lists are sensitive information holdings discussed in earlier weeks.'
    ]),
    notAvailableGuidance:
      'If a detail is not available in the Northbank briefing or earlier week materials, write “not available in the briefing” rather than inventing systems, employees, suppliers, vulnerabilities or services.',
    conclusion:
      'Target selection may be driven by exposure and opportunity rather than by a personal grudge against the victim.',
    prompts: Object.freeze([
      Object.freeze({
        id: 'exposure-1',
        label: 'Exposure item 1',
        fields: Object.freeze([
          Object.freeze({
            id: 'item',
            label: 'What could a passive reconnaissance sweep expose about Northbank?',
            required: true
          }),
          Object.freeze({
            id: 'motivation',
            label: 'Which motivation could this exposed item serve?',
            required: true
          }),
          Object.freeze({
            id: 'whyAttractive',
            label: 'Why might that exposure make Northbank an attractive or opportunistic target?',
            required: true
          })
        ])
      }),
      Object.freeze({
        id: 'exposure-2',
        label: 'Exposure item 2',
        fields: Object.freeze([
          Object.freeze({
            id: 'item',
            label: 'What could a passive reconnaissance sweep expose about Northbank?',
            required: true
          }),
          Object.freeze({
            id: 'motivation',
            label: 'Which motivation could this exposed item serve?',
            required: true
          }),
          Object.freeze({
            id: 'whyAttractive',
            label: 'Why might that exposure make Northbank an attractive or opportunistic target?',
            required: true
          })
        ])
      }),
      Object.freeze({
        id: 'exposure-3',
        label: 'Exposure item 3',
        fields: Object.freeze([
          Object.freeze({
            id: 'item',
            label: 'What could a passive reconnaissance sweep expose about Northbank?',
            required: true
          }),
          Object.freeze({
            id: 'motivation',
            label: 'Which motivation could this exposed item serve?',
            required: true
          }),
          Object.freeze({
            id: 'whyAttractive',
            label: 'Why might that exposure make Northbank an attractive or opportunistic target?',
            required: true
          })
        ])
      })
    ]),
    session1Review: Object.freeze({
      title: 'Session 1 review',
      fields: Object.freeze([
        Object.freeze({
          id: 'mtmDifference',
          label: 'Difference between motivation, target and method'
        }),
        Object.freeze({
          id: 'opportunisticExample',
          label: 'One example of opportunistic target selection'
        }),
        Object.freeze({
          id: 'misconceptionCorrected',
          label: 'One misconception you corrected'
        }),
        Object.freeze({
          id: 'directedStudyTasks',
          label: 'Your directed independent study tasks'
        })
      ])
    }),
    motivationBank: Object.freeze([
      'Espionage',
      'Righting perceived wrongs',
      'Public good',
      'Publicity',
      'Thrill',
      'Fraud',
      'Score settling',
      'Income generation'
    ])
  });
})(window);
