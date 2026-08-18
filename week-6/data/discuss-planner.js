/**
 * Week 6 Discuss response planner for Northbank monitoring.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week6DiscussPlanner = Object.freeze({
    activityId: 'week6-discuss-planner',
    activityName: 'Discuss Response Planner',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 2,
    total: 6,
    estimatedMinutes: 25,
    scenario:
      'Plan a balanced Discuss answer on how far Northbank Community Health Partnership should monitor employees after an insider copied patient contact details.',
    issuePrompt:
      'State the issue: what decision or tension must Northbank address?',
    columns: Object.freeze([
      Object.freeze({
        id: 'supporting',
        label: 'Supporting argument',
        description:
          'Reasons, evidence or duties supporting one side of the monitoring debate.',
        minLength: 30
      }),
      Object.freeze({
        id: 'competing',
        label: 'Competing consideration',
        description:
          'Credible counterarguments from another stakeholder or operational concern.',
        minLength: 30
      }),
      Object.freeze({
        id: 'concessionConclusion',
        label: 'Concession and justified conclusion',
        description:
          'Start with a clearly labelled concession, then state your balanced overall judgement.',
        minLength: 40,
        requiresConcessionLabel: true
      })
    ]),
    concessionLabel: 'Concession:',
    sentenceStarters: Object.freeze([
      'The issue is whether…',
      'One supported reason is…',
      'However, from the perspective of employees/customers…',
      'Concession: I accept that…',
      'Overall, Northbank should… because…'
    ])
  });
})(window);
