/**
 * Week 5 support provisions and challenge activities.
 */
(function (global) {
  'use strict';

  global.Week5SupportChallenge = Object.freeze({
    resourceId: 'week5-support-challenge',
    scored: false,
    title: 'Support, challenge and accessibility',
    definitions: Object.freeze({
      loss:
        'Something of value is taken, damaged, corrupted, reduced or no longer trusted.',
      disruption:
        'A service, process or operation stops, slows or becomes unreliable for people who depend on it.',
      safety:
        'People are placed at physical risk, or physical harm becomes more likely, because of the cyber incident.'
    }),
    gridSupport: Object.freeze({
      title: 'Grid and classification support',
      points: Object.freeze([
        'Use the partly completed stakeholder grid and the worked individuals row.',
        'Keep the loss / disruption / safety checklist visible.',
        'Role cards include three prompt questions each.',
        'Classification is keyboard-accessible — not drag-and-drop only.'
      ])
    }),
    writingSupport: Object.freeze({
      title: 'Analytical sentence starters (optional scaffolding)',
      frame: Object.freeze([
        'Immediately after the incident…',
        'This would affect the stakeholder because…',
        'Six months later…',
        'The scenario states that…, which means…',
        'This is a safety impact because…'
      ]),
      note: 'These starters are scaffolding, not mandatory phrasing.'
    }),
    accessibility: Object.freeze({
      title: 'Universal design and accessibility',
      points: Object.freeze([
        'Concise written explanations, visual grids and structured analysis are all supported.',
        'Reasoning can be recorded in writing or in the structured grid.',
        'Full keyboard operation and visible focus states are required.',
        'Do not communicate information by colour alone.',
        'Instructions remain visible beside complex grids.',
        'Errors explain how to improve.',
        'Reduced-motion preferences are respected in CSS where animations exist.'
      ])
    }),
    challenges: Object.freeze([
      Object.freeze({
        id: 'challenge-1',
        title: 'Challenge 1 — Ranking impacts for Northbank',
        prompt:
          'Rank financial, reputational and safety impacts by how damaging each would be to Northbank Community Health Partnership specifically. Justify your ranking and respond to one counterargument.'
      }),
      Object.freeze({
        id: 'challenge-2',
        title: 'Challenge 2 — Organisation comparison',
        prompt:
          'Compare how the same ransomware incident would affect Northbank Community Health Partnership and a national infrastructure provider. Explain why the organisation’s size and purpose change the impact.'
      }),
      Object.freeze({
        id: 'challenge-3',
        title: 'Challenge 3 — Reasoned cost estimate',
        prompt:
          'Create a reasoned classroom cost estimate for the Northbank incident under recovery, regulatory consequences, lost trade or lost service, and insurance. State which estimate is hardest to defend and why. These are reasoned approximations, not factual Northbank figures.'
      })
    ])
  });
})(window);
