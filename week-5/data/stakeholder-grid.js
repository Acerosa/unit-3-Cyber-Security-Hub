/**
 * Week 5 Northbank stakeholder impact grid.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week5StakeholderGrid = Object.freeze({
    activityId: 'week5-stakeholder-grid',
    activityName: 'Stakeholder Impact Grid',
    activityVersion: '1.1',
    weekNumber: 5,
    sessionNumber: 2,
    total: 10,
    estimatedMinutes: 35,
    scenario:
      'Ransomware encrypts Northbank Community Health Partnership booking and shared-drive systems. Clinic lists cannot be opened for two working days. Some appointments are cancelled. Patient contact details may have been exposed from a shared mailbox. Emergency recovery spending begins immediately. Local media report the outage. Patients ask whether records are safe. Partner clinics pause some referrals while assurance is sought. Staff work from paper lists where possible.',
    instructionsVisible:
      'Complete every stakeholder row. Cover loss, disruption and safety. Do not finish by filling only financial loss. Keep these instructions visible while you work.',
    checklist: Object.freeze([
      'Loss considered for this stakeholder',
      'Disruption considered for this stakeholder',
      'Safety considered for this stakeholder',
      'Scenario evidence recorded',
      'Immediate or longer-term consequence stated'
    ]),
    columns: Object.freeze([
      Object.freeze({ id: 'loss', label: 'Loss' }),
      Object.freeze({ id: 'disruption', label: 'Disruption' }),
      Object.freeze({ id: 'safety', label: 'Safety' }),
      Object.freeze({ id: 'evidence', label: 'Supporting scenario evidence' }),
      Object.freeze({ id: 'timescale', label: 'Immediate or longer-term consequence' })
    ]),
    stakeholders: Object.freeze([
      Object.freeze({ id: 'individuals', label: 'Individuals', workedExample: false }),
      Object.freeze({ id: 'organisation', label: 'Northbank as the organisation', workedExample: false }),
      Object.freeze({ id: 'employees', label: 'Employees', workedExample: false }),
      Object.freeze({ id: 'patients', label: 'Customers or patients', workedExample: false }),
      Object.freeze({ id: 'suppliers', label: 'Suppliers', workedExample: false }),
      Object.freeze({ id: 'regulators', label: 'Regulators', workedExample: false }),
      Object.freeze({ id: 'state', label: 'The state', workedExample: false })
    ]),
    partlyCompletedSeed: Object.freeze({}),
    reflection: Object.freeze({
      overlooked:
        'Name two impacts you initially overlooked when you first thought about the incident.',
      hardest:
        'Which stakeholder did you find hardest to analyse, and why?',
      compare:
        'Why does the same incident affect a patient differently from a regulator?'
    }),
    sentenceStarters: Object.freeze([])
  });
})(window);
