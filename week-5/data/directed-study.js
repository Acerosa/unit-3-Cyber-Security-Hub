/**
 * Week 5 directed independent study guidance.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week5DirectedStudy = Object.freeze({
    resourceId: 'week5-directed-study',
    scored: false,
    title: 'Directed independent study',
    acknowledgementKey: 'week5-directed-study-ack',
    tryhackme: Object.freeze({
      room: 'Juicy Details',
      url: 'https://tryhackme.com/room/juicydetails',
      note:
        'Do not reproduce room content or answers here. Record your own findings after authorised access.',
      recordFields: Object.freeze([
        'What was taken in the breach',
        'How investigators established what had happened',
        'Which of the three impact categories applies',
        'The evidence supporting the classification'
      ])
    }),
    realIncidentGrid: Object.freeze({
      title: 'Real-incident stakeholder impact grid',
      requirements: Object.freeze([
        'Select a real cyber security incident and record your source.',
        'Cover loss, disruption and safety.',
        'Analyse at least four stakeholder groups.',
        'Add a paragraph naming the stakeholder most seriously affected.',
        'Justify why that stakeholder was most seriously affected.'
      ])
    }),
    decisionChallenge: Object.freeze({
      title: 'Northbank decision challenge',
      requirements: Object.freeze([
        'Review the decisions recorded during the ransomware exercise.',
        'Select one decision you would now challenge.',
        'Write two sentences explaining why.',
        'Prepare to defend the position in Week 6.'
      ])
    })
  });
})(window);
