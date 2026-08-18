/**
 * Week 6 marking and answer improvement.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week6AnswerImprovement = Object.freeze({
    activityId: 'week6-answer-improvement',
    activityName: 'Marking and Answer Improvement',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 2,
    total: 6,
    estimatedMinutes: 25,
    commonError:
      'Treating ethical language as if it were the same as legal duty, or naming a statute without the relevant duty or offence.',
    question: Object.freeze({
      commandWord: 'Discuss',
      marks: 7,
      prompt:
        'Discuss how far Northbank Community Health Partnership should monitor employees after an insider copied patient contact details.'
    }),
    sampleResponse: Object.freeze({
      text:
        'Monitoring is ethical because staff should be honest. The Computer Misuse Act 1990 means Northbank can do whatever monitoring it wants. Customers might worry but monitoring fixes everything. Therefore Northbank should monitor all staff heavily.'
    }),
    dominantIssues: Object.freeze([
      'Uses moral language without separating ethics from law',
      'Names the Computer Misuse Act 1990 without linking a specific duty or offence',
      'No competing consideration from employees or other stakeholders',
      'No concession before the conclusion',
      'Conclusion is one-sided and not justified from the argument'
    ]),
    markSchemePoints: Object.freeze([
      Object.freeze({ id: 'c1', label: 'Responds to the command word (Discuss: balanced argument)' }),
      Object.freeze({ id: 'c2', label: 'Names statute and duty together where law is used' }),
      Object.freeze({ id: 'c3', label: 'Separates moral judgement from legal requirement' }),
      Object.freeze({ id: 'c4', label: 'Includes a competing consideration' }),
      Object.freeze({ id: 'c5', label: 'Includes a justified conclusion after weighing both sides' })
    ]),
    rewritePrompt:
      'Rewrite the weakest sentence so it separates ethical and legal points and links any statute to a duty or offence.',
    improvePrompt:
      'Improve the full response: add a competing consideration, a labelled concession and a balanced conclusion using Northbank scenario evidence.',
    nextActionPrompt:
      'One next-exam action you will take when you see a Discuss question on ethical, legal and operational considerations.',
    modelAfterSubmit:
      'Stronger answers state the issue, link current United Kingdom data protection legislation to security and accountability, treat the Computer Misuse Act 1990 as relevant to unauthorised access, accept that employees may raise proportionality concerns, and conclude with targeted transparent monitoring rather than unlimited surveillance.'
  });
})(window);
