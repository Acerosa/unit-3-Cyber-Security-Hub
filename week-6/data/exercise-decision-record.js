/**
 * Week 6 NCSC exercise decision record companion.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week6ExerciseDecisionRecord = Object.freeze({
    activityId: 'week6-exercise-decision-record',
    activityName: 'Exercise Decision Record',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 1,
    total: 5,
    estimatedMinutes: 35,
    organisation: 'Northbank Community Health Partnership',
    exerciseTitle: 'Insider threat resulting in a data breach',
    intro:
      'Record decisions made during the tutor-facilitated NCSC Exercise in a Box session. Do not invent exercise prompts or outcomes. Capture what your group actually discussed.',
    reviseNote:
      'You may revise entries after the debrief. Update ethical, legal and operational notes as your tutor clarifies the scenario.',
    decisionTypes: Object.freeze([
      'Legal obligation',
      'Ethical choice',
      'Operational judgement',
      'Combination'
    ]),
    minDecisions: 2,
    entryFields: Object.freeze([
      Object.freeze({ id: 'title', label: 'Decision title (short)', rows: 1 }),
      Object.freeze({ id: 'decision', label: 'Decision taken or proposed', rows: 2 }),
      Object.freeze({ id: 'reason', label: 'Reason for the decision', rows: 2 }),
      Object.freeze({ id: 'stakeholder', label: 'Stakeholder affected or responsible', rows: 1 }),
      Object.freeze({ id: 'ethical', label: 'Ethical consideration', rows: 2 }),
      Object.freeze({ id: 'legal', label: 'Legal consideration (name law and duty where relevant)', rows: 2 }),
      Object.freeze({ id: 'operational', label: 'Operational consideration', rows: 2 }),
      Object.freeze({ id: 'type', label: 'Decision type', type: 'select' }),
      Object.freeze({ id: 'evidenceNeeded', label: 'Evidence still needed', rows: 2 }),
      Object.freeze({ id: 'reflection', label: 'Reflection after debrief (optional until debrief)', rows: 2 })
    ])
  });
})(window);
