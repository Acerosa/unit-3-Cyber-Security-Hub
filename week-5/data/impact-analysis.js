/**
 * Week 5 analysing rather than listing impacts.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week5ImpactAnalysis = Object.freeze({
    activityId: 'week5-impact-analysis',
    activityName: 'Analysing Rather Than Listing Impacts',
    activityVersion: '1.1',
    weekNumber: 5,
    sessionNumber: 2,
    total: 6,
    estimatedMinutes: 25,
    teachingPoint:
      'Strong answers name a stakeholder, state a specific consequence, use scenario evidence, show timescale, and explain why the consequence follows.',
    scenario:
      'Ransomware encrypts Northbank booking systems for two working days. Urgent reviews are delayed. Patient contact details may have been exposed. Local media report the outage and patients ask whether records are safe.',
    weakResponse: Object.freeze({
      label: 'Weak response',
      text:
        'Northbank suffered. Impacts include money, reputation, trust, systems and patients. It was bad. Other hospitals had ransomware too so the same things happened.',
      problems: Object.freeze([
        'Lists several impacts without explanation',
        'Says the organisation suffered without naming a stakeholder clearly',
        'Mentions money without developing other categories',
        'Fails to use scenario evidence',
        'Ignores timescale',
        'Imports unrelated incidents'
      ])
    }),
    creditCriteria: Object.freeze([
      Object.freeze({ id: 'a1', label: 'Names a stakeholder' }),
      Object.freeze({ id: 'a2', label: 'States a specific consequence' }),
      Object.freeze({ id: 'a3', label: 'Uses evidence from this scenario' }),
      Object.freeze({ id: 'a4', label: 'Shows an immediate and a longer-term timescale' }),
      Object.freeze({ id: 'a5', label: 'Explains why the consequence follows' }),
      Object.freeze({ id: 'a6', label: 'Covers more than financial loss' })
    ]),
    writingTasks: Object.freeze([
      Object.freeze({
        id: 'immediate',
        label: 'Write one sentence explaining an immediate impact of the Northbank ransomware incident.'
      }),
      Object.freeze({
        id: 'sixMonths',
        label: 'Write one sentence explaining an impact that may still be felt six months later.'
      })
    ]),
    improvementPrompt:
      'Improve your weaker sentence by adding a missing stakeholder, evidence or timescale connection.'
  });
})(window);
