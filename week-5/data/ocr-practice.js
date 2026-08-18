/**
 * Week 5 OCR-style timed examination practice (20 marks).
 * Formative OCR-style practice — not official OCR examination questions.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week5OcrPractice = Object.freeze({
    activityId: 'week5-ocr-question-practice',
    activityName: 'OCR-Style Impact Questions',
    activityVersion: '1.0',
    weekNumber: 5,
    sessionNumber: 2,
    total: 20,
    suggestedMinutes: 20,
    timingGuidance:
      'Use approximately one minute per mark where this helps you manage time. These are OCR-style practice questions, not official OCR examination questions.',
    beforeReminders: Object.freeze([
      'Cover loss, disruption and safety when impacts are requested.',
      'Name the stakeholder affected.',
      'Distinguish immediate and longer-term consequences.',
      'Use scenario evidence — do not import unrelated incidents.',
      'Mark schemes stay hidden until you open review.'
    ]),
    northbankScenario:
      'Northbank Community Health Partnership suffers a ransomware incident. Booking systems and a shared drive are encrypted for two working days. Some appointments are cancelled, including an urgent review. Patient contact details may have been exposed from a shared mailbox. Recovery spending begins immediately. Local media report the outage and patients ask whether records remain safe. A partner clinic pauses some referrals while it seeks assurance.',
    questions: Object.freeze([
      Object.freeze({
        id: 'ocr-1',
        commandWord: 'Identify',
        marks: 1,
        suggestedMinutes: 1,
        responseType: 'mcq',
        prompt:
          'Identify which impact category best matches unrecovered destruction of referral letters.',
        guidance: 'Choose the broad Week 5 category.',
        options: Object.freeze([
          Object.freeze({ id: 'a', text: 'Loss' }),
          Object.freeze({ id: 'b', text: 'Disruption only' }),
          Object.freeze({ id: 'c', text: 'Safety only' }),
          Object.freeze({ id: 'd', text: 'Motivation' })
        ]),
        correctOptionId: 'a',
        markScheme: Object.freeze(['Loss (of data).'])
      }),
      Object.freeze({
        id: 'ocr-2',
        commandWord: 'Identify',
        marks: 1,
        suggestedMinutes: 1,
        responseType: 'mcq',
        prompt:
          'Identify which impact category best matches clinic booking services being unavailable for two working days.',
        guidance: 'Focus on the service becoming unreliable.',
        options: Object.freeze([
          Object.freeze({ id: 'a', text: 'Disruption' }),
          Object.freeze({ id: 'b', text: 'Identity theft' }),
          Object.freeze({ id: 'c', text: 'Publicity motivation' }),
          Object.freeze({ id: 'd', text: 'Legislation' })
        ]),
        correctOptionId: 'a',
        markScheme: Object.freeze(['Disruption.'])
      }),
      Object.freeze({
        id: 'ocr-3',
        commandWord: 'Identify',
        marks: 1,
        suggestedMinutes: 1,
        responseType: 'mcq',
        prompt:
          'Identify which impact category best matches increased clinical risk from a delayed urgent review.',
        guidance: 'Think about physical / clinical risk to a person.',
        options: Object.freeze([
          Object.freeze({ id: 'a', text: 'Safety' }),
          Object.freeze({ id: 'b', text: 'Financial loss only' }),
          Object.freeze({ id: 'c', text: 'Broadcasting disruption' }),
          Object.freeze({ id: 'd', text: 'No impact' })
        ]),
        correctOptionId: 'a',
        markScheme: Object.freeze(['Safety.'])
      }),
      Object.freeze({
        id: 'ocr-4',
        commandWord: 'Describe',
        marks: 2,
        suggestedMinutes: 2,
        responseType: 'text',
        prompt:
          'Describe one loss impact of the Northbank ransomware incident for an individual patient.',
        guidance: 'Name the patient as stakeholder and use scenario evidence.',
        markScheme: Object.freeze([
          'Names individual/patient stakeholder',
          'Describes a loss (e.g. confidentiality / identity / confidence) with scenario support'
        ])
      }),
      Object.freeze({
        id: 'ocr-5',
        commandWord: 'Describe',
        marks: 2,
        suggestedMinutes: 2,
        responseType: 'text',
        prompt:
          'Describe one disruption impact for Northbank Community Health Partnership.',
        guidance: 'State which service stopped or became unreliable.',
        markScheme: Object.freeze([
          'Names organisation/service',
          'Describes disruption with scenario evidence (booking/shared drive unavailable; cancelled appointments)'
        ])
      }),
      Object.freeze({
        id: 'ocr-6',
        commandWord: 'Explain',
        marks: 3,
        suggestedMinutes: 3,
        responseType: 'text',
        prompt:
          'Explain how the same Northbank ransomware incident can affect a patient differently from a regulator.',
        guidance: 'Compare stakeholder perspectives; do not write only about money.',
        markScheme: Object.freeze([
          'Patient perspective linked to care access, confidentiality or safety',
          'Regulator perspective linked to oversight, reporting or assurance',
          'Clear contrast showing different experiences of the same incident'
        ])
      }),
      Object.freeze({
        id: 'ocr-7',
        commandWord: 'Explain',
        marks: 4,
        suggestedMinutes: 4,
        responseType: 'text',
        prompt:
          'Explain one immediate consequence and one longer-term consequence of the Northbank incident.',
        guidance: 'Use scenario evidence for both timescales.',
        markScheme: Object.freeze([
          'Immediate consequence with evidence',
          'Longer-term consequence with evidence',
          'Named stakeholder(s)',
          'Clear distinction between timescales'
        ])
      }),
      Object.freeze({
        id: 'ocr-8',
        commandWord: 'Analyse',
        marks: 6,
        suggestedMinutes: 6,
        responseType: 'text',
        prompt:
          'Analyse the impacts of the Northbank ransomware incident on the organisation and its patients.',
        guidance:
          'Do not produce a list. Cover more than one impact category, name stakeholders, use scenario evidence, make clear connections, and include immediate and longer-term consequences.',
        markScheme: Object.freeze([
          'Covers more than one of loss, disruption and safety',
          'Names organisation and patient stakeholders',
          'Uses scenario evidence',
          'Makes explicit analytical connections',
          'Includes immediate consequence',
          'Includes longer-term consequence'
        ])
      })
    ])
  });
})(window);
