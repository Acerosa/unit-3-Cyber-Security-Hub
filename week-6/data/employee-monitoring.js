/**
 * Week 6 Northbank employee monitoring scenario preparation.
 */
(function (global) {
  'use strict';

  global.Week6EmployeeMonitoring = Object.freeze({
    activityId: 'week6-employee-monitoring',
    activityName: 'Northbank Employee Monitoring Scenario',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 2,
    total: 6,
    estimatedMinutes: 30,
    scenario:
      'Northbank Community Health Partnership discovers that a member of staff copied patient contact details to a personal device before leaving the organisation. The breach is contained, but senior managers ask how far Northbank should monitor employees to prevent repeat insider misuse. Options discussed include enhanced log review, mailbox auditing, workstation monitoring and clearer acceptable-use rules. No decision is made in this activity: you prepare one stakeholder position for debate.',
    instructions:
      'Select one stakeholder role and prepare a position for classroom debate. Use the ethical, legal and operational prompts. Do not treat your answer as the final organisational decision.',
    stakeholderRoles: Object.freeze([
      Object.freeze({ id: 'employees', label: 'Employees' }),
      Object.freeze({ id: 'managers', label: 'Managers' }),
      Object.freeze({ id: 'customers', label: 'Customers' }),
      Object.freeze({ id: 'regulator', label: 'The data protection regulator' }),
      Object.freeze({ id: 'shareholders', label: 'Shareholders' })
    ]),
    promptGroups: Object.freeze([
      Object.freeze({
        id: 'ethical',
        label: 'Ethical prompts',
        questions: Object.freeze([
          'Is the proposed monitoring fair and proportionate for this stakeholder?',
          'What trust or dignity concerns arise?'
        ])
      }),
      Object.freeze({
        id: 'legal',
        label: 'Legal prompts',
        questions: Object.freeze([
          'Which statute and duty are most relevant (Computer Misuse Act 1990, current United Kingdom data protection legislation, or Police and Justice Act 2006 amendments where tools are supplied)?',
          'What lawful basis or transparency might employees and customers expect?'
        ])
      }),
      Object.freeze({
        id: 'operational',
        label: 'Operational prompts',
        questions: Object.freeze([
          'What staff time, usability or productivity effects could monitoring create?',
          'Could monitoring reduce repeat insider risk without harming day-to-day care delivery?'
        ])
      })
    ]),
    fields: Object.freeze([
      Object.freeze({
        id: 'mainArgument',
        label: 'Main argument from your stakeholder role',
        minLength: 30
      }),
      Object.freeze({
        id: 'evidence',
        label: 'Evidence from the Northbank insider breach scenario',
        minLength: 20
      }),
      Object.freeze({
        id: 'opposingArgument',
        label: 'Strongest opposing argument another stakeholder might raise',
        minLength: 20
      }),
      Object.freeze({
        id: 'hardestOpposing',
        label: 'Hardest opposing point for your role to answer',
        minLength: 15
      }),
      Object.freeze({
        id: 'recommendation',
        label: 'Recommendation your role would advance in debate (not the final Northbank decision)',
        minLength: 25
      })
    ]),
    sentenceStarters: Object.freeze([
      'From the perspective of [stakeholder]…',
      'The scenario shows that…',
      'Under current United Kingdom data protection legislation…',
      'Ethically, the concern is…',
      'Operationally, Northbank would need to…'
    ])
  });
})(window);
