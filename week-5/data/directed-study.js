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
        'Optional. This room is not required to complete Week 5. Do not copy room answers into this page. If you use the room, record your own findings.',
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
      title: 'Optional comparison',
      requirements: Object.freeze([
        'This task is optional and is not part of the scored Week 5 activities.',
        'Compare how the same ransomware incident would affect Northbank and one other type of organisation.',
        'Name one impact that would differ, and say why.',
        'You can use the comparison in a later discussion if your tutor asks for it.'
      ])
    })
  });
})(window);
