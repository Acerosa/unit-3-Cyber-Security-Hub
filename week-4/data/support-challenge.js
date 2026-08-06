/**
 * Week 4 support provisions and challenge activities.
 */
(function (global) {
  'use strict';

  global.Week4SupportChallenge = Object.freeze({
    resourceId: 'week4-support-challenge',
    scored: false,
    title: 'Support, challenge and accessibility',
    mappingSupport: Object.freeze({
      title: 'Mapping support',
      points: Object.freeze([
        'Use the mapping grid with two worked rows before independent scenarios.',
        'Use the bank of motivation words rather than inventing unsupported labels.',
        'Keep column labels visible: motivation (why), target (what), method (how).',
        'Ask: why did they act, what was targeted, how was it done?'
      ])
    }),
    writingSupport: Object.freeze({
      title: 'Writing support',
      frame: Object.freeze([
        '… because …',
        '… which means that …',
        'As a result …',
        'Therefore …'
      ]),
      note: 'The frame supports analysis without replacing your thinking. The connection must still be logical.'
    }),
    practicalSupport: Object.freeze({
      title: 'Practical support',
      points: Object.freeze([
        'If Passive Reconnaissance felt slow, ask your tutor about paired working for Shodan.io.',
        'Paired work is not compulsory; classroom arrangements may differ.'
      ])
    }),
    readability: Object.freeze({
      title: 'Readability and accessibility',
      points: Object.freeze([
        'Follow concise instructions and visible section headings.',
        'Use progressive disclosure where panels are collapsed.',
        'Feedback is given in text, not by colour alone.',
        'Keyboard operation is supported; mapping is not drag-only.',
        'Choose a planning template that suits you: writing frame, table or mind map notes.'
      ])
    }),
    responseFormats: Object.freeze([
      'Verbal explanation',
      'Slides',
      'Annotated diagram'
    ]),
    challenges: Object.freeze([
      Object.freeze({
        id: 'challenge-1',
        title: 'Challenge 1 — Health-sector threat ranking',
        prompt:
          'Evaluate which motivation poses the most serious long-term threat to the health sector and justify the ranking.'
      }),
      Object.freeze({
        id: 'challenge-2',
        title: 'Challenge 2 — Commercially organised cyber crime',
        prompt:
          'Explain how the balance of motivations has shifted as cyber crime has become commercially organised, using evidence rather than impression. You may need to research reputable sources. Do not treat unsupported historical claims as accepted answers.'
      }),
      Object.freeze({
        id: 'challenge-3',
        title: 'Challenge 3 — Fictional exposure report',
        prompt:
          'Using passive-reconnaissance principles, create a short exposure report for a fictional organisation you design. Then state which motivation the findings would most attract. Keep the activity fictional and passive. Do not investigate a real organisation.'
      })
    ])
  });
})(window);
