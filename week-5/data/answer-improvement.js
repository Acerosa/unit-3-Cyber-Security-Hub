/**
 * Week 5 marking and answer improvement.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week5AnswerImprovement = Object.freeze({
    activityId: 'week5-answer-improvement',
    activityName: 'Marking and Answer Improvement',
    activityVersion: '1.0',
    weekNumber: 5,
    sessionNumber: 2,
    total: 6,
    estimatedMinutes: 25,
    commonError:
      'Covering loss thoroughly — especially financial loss — while ignoring disruption and safety.',
    question: Object.freeze({
      commandWord: 'Analyse',
      marks: 6,
      prompt:
        'Analyse the impacts of a ransomware incident on Northbank Community Health Partnership and its patients.'
    }),
    sampleResponse: Object.freeze({
      text:
        'Northbank would lose money because it must pay for recovery and overtime. It might also lose reputation if people hear about the attack. Patients might worry. Money is the main impact.'
    }),
    dominantIssues: Object.freeze([
      'Financial loss is developed, but disruption of booking services is ignored',
      'Safety for patients with delayed urgent care is ignored',
      'Stakeholder naming is thin',
      'Scenario evidence is limited',
      'Timescale is not developed beyond immediate spending'
    ]),
    markSchemePoints: Object.freeze([
      Object.freeze({ id: 'm1', label: 'Names organisation and/or patient stakeholders', marks: '1' }),
      Object.freeze({ id: 'm2', label: 'Develops a loss impact with evidence', marks: '1' }),
      Object.freeze({ id: 'm3', label: 'Develops a disruption impact with evidence', marks: '1' }),
      Object.freeze({ id: 'm4', label: 'Develops a safety impact with evidence', marks: '1' }),
      Object.freeze({ id: 'm5', label: 'Makes analytical connections rather than a list', marks: '1' }),
      Object.freeze({ id: 'm6', label: 'Includes immediate and longer-term consequences', marks: '1' })
    ]),
    improvementRequirements: Object.freeze([
      'Add a missing safety impact',
      'Name the stakeholder affected',
      'Add evidence or reasoning from the scenario',
      'Add a timescale where relevant'
    ]),
    modelAfterSubmit:
      'Improved responses should add a patient safety impact (for example delayed urgent review), name the stakeholder, cite scenario evidence, and show whether the consequence is immediate or longer term. Do not rely on financial loss alone.'
  });
})(window);
