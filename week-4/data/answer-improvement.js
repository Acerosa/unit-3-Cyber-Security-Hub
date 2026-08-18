/**
 * Week 4 marking and answer-improvement (self-review, not peer marking).
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week4AnswerImprovement = Object.freeze({
    activityId: 'week4-answer-improvement',
    activityName: 'Marking and Answer Improvement',
    activityVersion: '1.0',
    weekNumber: 4,
    sessionNumber: 2,
    total: 6,
    commonError:
      'A list of separate facts about motivation and target with no sentence connecting them.',
    question: Object.freeze({
      marks: 8,
      commandWord: 'Analyse',
      prompt:
        'Northbank clinic booking systems are encrypted and a cryptocurrency payment is demanded. No political message is published. Analyse why this organisation was targeted, connecting motivation, target and method with evidence from the scenario.'
    }),
    markSchemePoints: Object.freeze([
      Object.freeze({ id: 'motivation', label: 'A valid motivation was named', marks: 1 }),
      Object.freeze({ id: 'target', label: 'The target was identified', marks: 1 }),
      Object.freeze({ id: 'method', label: 'The method was identified', marks: 1 }),
      Object.freeze({ id: 'evidence', label: 'Evidence from the scenario was used', marks: 1 }),
      Object.freeze({ id: 'connection', label: 'A connection was made between motivation, target and method', marks: 2 }),
      Object.freeze({ id: 'final', label: 'The final connection was explicit rather than implied', marks: 1 }),
      Object.freeze({ id: 'sustained', label: 'The response sustained one case (did not switch examples)', marks: 1 })
    ]),
    sampleResponse: Object.freeze({
      id: 'sample-weak',
      label: 'Sample extended response to mark',
      text:
        'The motivation could be income generation. The target could be organisations. The method could be system compromise. Booking systems were encrypted. A payment was demanded. Large hospitals are also attacked sometimes. Phishing might be involved.'
    }),
    dominantIssues: Object.freeze([
      'Motivation, target and method are listed separately with no connecting sentence.',
      'The final connection remains implied.',
      'The response switches towards large hospitals and phishing, leaving the main case incomplete.'
    ]),
    modelImprovedSentence:
      'Income generation is the most likely motivation because a cryptocurrency payment is demanded without a political message, which means that Northbank’s organisational booking systems were a logical target for system compromise so that recovery pressure would support payment.',
    modelResponse:
      'Income generation is the most likely motivation because a cryptocurrency payment is demanded and no political message is published. As a result, Northbank’s organisational booking systems were a logical target. Therefore system compromise that encrypts those systems suits the motivation by creating pressure to pay, completing the connection between why, what and how without switching to a different example.',
    rewritePrompt:
      'Rewrite one descriptive sentence from the sample as an analytical sentence using a meaningful connective (because / which means that / as a result / therefore).',
    improvementActionPrompt:
      'Record one specific improvement action for your next analyse response.'
  });
})(window);
