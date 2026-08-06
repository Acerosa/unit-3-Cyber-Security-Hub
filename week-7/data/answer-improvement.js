/**
 * Week 7 marking and answer improvement (6 marks).
 */
(function (global) {
  'use strict';

  global.Week7AnswerImprovement = Object.freeze({
    activityId: 'week7-answer-improvement',
    activityName: 'Marking and Answer Improvement',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 2,
    total: 6,
    estimatedMinutes: 25,
    commonError:
      'Recommending a measure without organisational context, and treating effectiveness as “we installed it”.',
    question: Object.freeze({
      commandWord: 'Justify',
      marks: 6,
      prompt:
        'Justify one testing or monitoring recommendation for Northbank Community Health Partnership after phishing against the appointment system. Explain why it suits the organisation and how effectiveness would be judged.'
    }),
    sampleResponse: Object.freeze({
      text:
        'Northbank should use a firewall. It is ethical and stops hackers. Effectiveness is that it is installed. Therefore the risk is gone.'
    }),
    dominantIssues: Object.freeze([
      'Names a measure with almost no Northbank organisational context',
      'Does not link the recommendation to the phishing / appointment-system risk',
      'Effectiveness is only “installed”',
      'No limitation or cost considered',
      'No comparison with an alternative'
    ]),
    markSchemePoints: Object.freeze([
      Object.freeze({ id: 'c1', label: 'Names a suitable testing or monitoring measure' }),
      Object.freeze({ id: 'c2', label: 'Uses Northbank / phishing / appointment context' }),
      Object.freeze({ id: 'c3', label: 'States a measurable effectiveness criterion' }),
      Object.freeze({ id: 'c4', label: 'States a cost or limitation' }),
      Object.freeze({ id: 'c5', label: 'Compares an alternative and why it is less suitable' })
    ]),
    workflowPrompts: Object.freeze({
      measure: 'Identify the measure you would recommend instead (or refine the weak one).',
      evidence:
        'Highlight contextual evidence from Northbank that supports your recommendation.',
      justification: 'Add a clear justification linking measure to organisational need.',
      effectiveness:
        'Add a measurable effectiveness statement (not only that something was installed).',
      limitation: 'State one limitation or cost.',
      improved: 'Write your improved full answer.'
    }),
    nextActionPrompt:
      'One next-exam action you will take when a Justify recommendation question appears.',
    modelAfterSubmit:
      'Stronger answers name a proportionate measure such as MFA with security functionality testing or targeted awareness plus monitoring, link it to Northbank’s phishing exposure on the appointment system, define effectiveness using reduced successful credential theft or MFA challenge metrics, and admit staff-time cost while explaining why a vague “install a firewall” claim is weaker.'
  });
})(window);
