/**
 * Week 6 Session 1 review activity.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week6Session1Review = Object.freeze({
    activityId: 'week6-session1-review',
    activityName: 'Session 1 Review',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 1,
    total: 3,
    estimatedMinutes: 15,
    intro:
      'Review Session 1 by distinguishing what the law required, what was ethically appropriate and what was operationally practical during the insider threat exercise and related activities.',
    questions: Object.freeze([
      Object.freeze({
        id: 'r1',
        prompt:
          'Northbank must assess and respond to a personal data breach under current United Kingdom data protection legislation. This decision is best classified as:',
        options: Object.freeze([
          'Legal obligation',
          'Ethical choice only',
          'Operational judgement only',
          'Neither legal nor operational'
        ]),
        correctIndex: 0,
        explanation:
          'Statutory data protection duties create legal obligations. Ethics and operations may shape how Northbank meets them, but the duty itself is legal.'
      }),
      Object.freeze({
        id: 'r2',
        prompt:
          'Choosing to warn staff about monitoring in a transparent, proportionate way after an insider incident is mainly:',
        options: Object.freeze([
          'An ethical and operational choice about trust and proportionality',
          'A replacement for data protection legislation',
          'Unlawful in all circumstances',
          'Defined by Cyber Streetwise as a statute'
        ]),
        correctIndex: 0,
        explanation:
          'Transparent communication supports ethical practice and operational acceptance. It does not replace legal duties.'
      }),
      Object.freeze({
        id: 'r3',
        prompt:
          'Delaying clinic access while Northbank resets compromised accounts reflects which dimension most directly?',
        options: Object.freeze([
          'Operational practicality and service impact',
          'Nation-state motivation',
          'Cyber Essentials certification status',
          'Responsible disclosure to a vendor'
        ]),
        correctIndex: 0,
        explanation:
          'Service delay and staff workflow effects are operational considerations, even when the underlying trigger may involve legal or ethical issues.'
      })
    ])
  });
})(window);
