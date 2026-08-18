/**
 * Week 6 stakeholder debate preparation.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week6StakeholderDebate = Object.freeze({
    activityId: 'week6-stakeholder-debate',
    activityName: 'Stakeholder Debate Preparation',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 2,
    total: 10,
    estimatedMinutes: 35,
    scenario:
      'Northbank Community Health Partnership is debating how far to monitor staff after an insider copied patient contact details. Your group prepares structured arguments for a classroom debate. Completion checks field presence, not automatic quality scoring.',
    participationRoles: Object.freeze([
      Object.freeze({
        id: 'speaker',
        label: 'Speaker',
        description: 'Presents the opening position and responds to challenges.'
      }),
      Object.freeze({
        id: 'recorder',
        label: 'Recorder',
        description: 'Captures arguments, evidence and concessions accurately.'
      }),
      Object.freeze({
        id: 'evidence-checker',
        label: 'Evidence checker',
        description: 'Checks that claims link to the scenario and named legislation where relevant.'
      })
    ]),
    stakeholderRoles: Object.freeze([
      'Employees',
      'Managers',
      'Customers',
      'The data protection regulator',
      'Shareholders'
    ]),
    fields: Object.freeze([
      Object.freeze({ id: 'role', label: 'Stakeholder role you are representing', minLength: 3 }),
      Object.freeze({ id: 'opening', label: 'Opening position', minLength: 20 }),
      Object.freeze({
        id: 'ethical',
        label: 'Ethical argument (what ought to be done)',
        minLength: 20
      }),
      Object.freeze({
        id: 'legal',
        label: 'Legal argument (name legislation and the relevant duty or offence where you can)',
        minLength: 20
      }),
      Object.freeze({
        id: 'operational',
        label: 'Operational argument (cost, staff time, usability or productivity)',
        minLength: 20
      }),
      Object.freeze({
        id: 'opposing',
        label: 'Opposing argument you expect from another stakeholder',
        minLength: 15
      }),
      Object.freeze({ id: 'response', label: 'Response to the opposing argument', minLength: 15 }),
      Object.freeze({
        id: 'concession',
        label: 'Concession: one fair point from the other side',
        minLength: 12
      }),
      Object.freeze({
        id: 'recommendation',
        label: 'Final recommendation your role would advance (debate outcome, not hub decision)',
        minLength: 20
      })
    ])
  });
})(window);
