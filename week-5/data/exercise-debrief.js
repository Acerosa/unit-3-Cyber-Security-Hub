/**
 * Week 5 immediate and longer-term consequences.
 * Learner pages use the catalogue package. This object stays for registry checks.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week5ExerciseDebrief = Object.freeze({
    activityId: 'week5-exercise-debrief',
    activityName: 'Immediate and longer-term consequences',
    activityVersion: '1.0',
    weekNumber: 5,
    sessionNumber: 1,
    total: 6,
    estimatedMinutes: 20,
    intro:
      'Some consequences happen at once. Others appear later. A consequence can reasonably fit both, depending on the scenario.',
    categories: Object.freeze(['Immediate', 'Longer term', 'Could be either']),
    ambiguousItemId: 't5'
  });
})(window);
