/**
 * Week 6 support provisions and optional challenge activities.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week6SupportChallenge = Object.freeze({
    resourceId: 'week6-support-challenge',
    scored: false,
    title: 'Support, challenge and accessibility',
    legislationCards: Object.freeze([
      Object.freeze({
        title: 'Computer Misuse Act 1990',
        summary:
          'Creates offences such as unauthorised access to computer material and related misuse. Relevant when an insider accesses records without authority.'
      }),
      Object.freeze({
        title: 'Current United Kingdom data protection legislation',
        summary:
          'Sets duties for handling personal data, including security, accountability and transparency. Relevant when patient contact details are copied or exposed.'
      }),
      Object.freeze({
        title: 'Police and Justice Act 2006 amendments',
        summary:
          'Addresses supplying tools for misuse under the Computer Misuse Act 1990. Relevant when considering hacking or testing tools without clear authorisation.'
      })
    ]),
    roleCards: Object.freeze([
      Object.freeze({
        role: 'Employees',
        prompts: Object.freeze([
          'What monitoring feels fair or excessive?',
          'How could trust affect day-to-day care?',
          'What transparency would you expect?'
        ])
      }),
      Object.freeze({
        role: 'Managers',
        prompts: Object.freeze([
          'What repeat insider risk must be reduced?',
          'What operational burden could monitoring create?',
          'How will you explain decisions to staff?'
        ])
      }),
      Object.freeze({
        role: 'Customers',
        prompts: Object.freeze([
          'What assurance do patients need about contact details?',
          'What ethical expectation exists beyond minimum law?',
          'Could monitoring affect service experience?'
        ])
      }),
      Object.freeze({
        role: 'The data protection regulator',
        prompts: Object.freeze([
          'Which legal duties were engaged by the breach?',
          'Was monitoring proportionate and transparent?',
          'What evidence would you expect in an explanation?'
        ])
      }),
      Object.freeze({
        role: 'Shareholders',
        prompts: Object.freeze([
          'What assurance reduces repeat misuse risk?',
          'What costs or downtime could monitoring create?',
          'How is reputational harm managed?'
        ])
      })
    ]),
    recorderOption:
      'Recorder role: capture main arguments, evidence, concessions and recommendations without debating every point yourself.',
    plannerGrid: Object.freeze({
      title: 'Three-column Discuss grid',
      columns: Object.freeze([
        'Supporting argument',
        'Competing consideration',
        'Concession and conclusion (label the concession clearly)'
      ])
    }),
    sentenceStarters: Object.freeze([
      'The issue is whether…',
      'One supported reason is…',
      'However, [stakeholder] might argue…',
      'Concession: I accept that…',
      'Overall, Northbank should… because…'
    ]),
    workedExamples: Object.freeze([
      Object.freeze({
        title: 'Statute linked to duty',
        text:
          'Under current United Kingdom data protection legislation, Northbank must protect patient contact details and explain how insider access is controlled.'
      }),
      Object.freeze({
        title: 'Ethical versus legal',
        text:
          'Enhanced monitoring may be lawful in some forms, but employees may still argue it is unfair if applied without transparency or proportionality.'
      })
    ]),
    stepByStep: Object.freeze([
      'State the Northbank monitoring issue in one sentence.',
      'Add one supported point with scenario evidence.',
      'Add one competing consideration from another stakeholder.',
      'Write a labelled concession.',
      'Conclude with a balanced judgement.'
    ]),
    accessibility: Object.freeze({
      title: 'Universal design and accessibility',
      points: Object.freeze([
        'Plain-language legislation cards and role cards are provided.',
        'Structured grids and sentence starters are optional scaffolding.',
        'Keyboard-accessible forms and visible focus states are required.',
        'Do not communicate information by colour alone.',
        'Reduced-motion preferences are respected in CSS where animations exist.'
      ])
    }),
    challenges: Object.freeze([
      Object.freeze({
        id: 'challenge-1',
        title: 'Optional extension 1: Legal compliance and ethical behaviour',
        prompt:
          'Argue whether legal compliance alone is sufficient for ethical behaviour in the Northbank insider case. Respond to one counterargument.'
      }),
      Object.freeze({
        id: 'challenge-2',
        title: 'Optional extension 2: Security versus usability',
        prompt:
          'Compare the most secure and least usable monitoring option for Northbank. Which trade-off would you defend?'
      }),
      Object.freeze({
        id: 'challenge-3',
        title: 'Optional extension 3: Cyber Essentials versus ISO 27001',
        prompt:
          'For Northbank Community Health Partnership’s size and purpose, compare Cyber Essentials with ISO 27001. Which is more realistic as a starting point and why?'
      })
    ])
  });
})(window);
