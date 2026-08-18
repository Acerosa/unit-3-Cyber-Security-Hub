/**
 * Week 7 NCSC Heightened cyber threat decision log companion (5 marks).
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week7HeightenedThreat = Object.freeze({
    activityId: 'week7-heightened-threat',
    activityName: 'NCSC Heightened Cyber Threat Decision Log',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 1,
    total: 5,
    estimatedMinutes: 40,
    organisation: 'Northbank Community Health Partnership',
    ncscUrl: 'https://www.ncsc.gov.uk/section/exercise-in-a-box/heightened-cyber-threat',
    intro:
      'Use this page as a facilitated companion while your tutor runs NCSC Exercise in a Box: Heightened cyber threat. Do not invent exercise prompts. Record the decisions your group actually makes and link each action to a risk register entry.',
    collaborationNote:
      'If your group uses different devices, share a short group code and paste agreed notes here so you do not need one shared browser session.',
    minDecisionsWithCostBenefit: 2,
    entryFields: Object.freeze([
      Object.freeze({ id: 'riskRegisterRef', label: 'Risk register reference', type: 'ref' }),
      Object.freeze({ id: 'proposedAction', label: 'Proposed action', rows: 2 }),
      Object.freeze({ id: 'riskAddressed', label: 'Risk addressed (what reduces?)', rows: 2 }),
      Object.freeze({
        id: 'additionalMonitoring',
        label: 'Additional monitoring (if any)',
        rows: 2
      }),
      Object.freeze({ id: 'costAccepted', label: 'Cost accepted', rows: 2 }),
      Object.freeze({ id: 'benefitGained', label: 'Benefit gained', rows: 2 }),
      Object.freeze({
        id: 'stopDelayReduce',
        label: 'Stop, delay or reduce? (and why)',
        rows: 2
      }),
      Object.freeze({ id: 'groupJustification', label: 'Group justification', rows: 3 }),
      Object.freeze({ id: 'debriefNotes', label: 'Debrief notes', rows: 2 })
    ])
  });
})(window);
