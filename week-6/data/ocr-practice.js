/**
 * Week 6 OCR-style timed examination practice (20 marks).
 * Formative OCR-style practice - not official OCR examination questions.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week6OcrPractice = Object.freeze({
    activityId: 'week6-ocr-question-practice',
    activityName: 'OCR-Style Timed Questions',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 2,
    total: 20,
    suggestedMinutes: 25,
    timingGuidance:
      'Use approximately one minute per mark where this helps you manage time. These are OCR-style practice questions, not official OCR examination questions.',
    beforeReminders: Object.freeze([
      'Name statutes with duties or offences together where law is required.',
      'Separate ethical, legal and operational points.',
      'Use Northbank scenario evidence - do not import unrelated incidents.',
      'Discuss questions need a competing consideration, concession and justified conclusion.',
      'Mark schemes stay hidden until you submit.'
    ]),
    northbankScenario:
      'Northbank Community Health Partnership discovers that a member of staff copied patient contact details to a personal device before leaving. Managers consider enhanced log review, mailbox auditing and workstation monitoring. Patients ask what is being done to protect their data. The data protection regulator expects a clear explanation. Staff worry about trust and extra workload. Shareholders want assurance that repeat insider misuse is unlikely without harming care delivery.',
    questions: Object.freeze([
      Object.freeze({
        id: 'ocr6-1',
        commandWord: 'Identify',
        marks: 1,
        suggestedMinutes: 1,
        responseType: 'mcq',
        prompt:
          'Identify which United Kingdom statute is most directly associated with unauthorised access to computer material.',
        guidance: 'Choose the core cyber offence statute from Week 6.',
        options: Object.freeze([
          Object.freeze({ id: 'a', text: 'Computer Misuse Act 1990' }),
          Object.freeze({ id: 'b', text: 'Current United Kingdom data protection legislation only' }),
          Object.freeze({ id: 'c', text: 'Police and Justice Act 2006 amendments only' }),
          Object.freeze({ id: 'd', text: 'Cyber Essentials' })
        ]),
        correctOptionId: 'a',
        markScheme: Object.freeze(['Computer Misuse Act 1990.'])
      }),
      Object.freeze({
        id: 'ocr6-2',
        commandWord: 'Identify',
        marks: 1,
        suggestedMinutes: 1,
        responseType: 'mcq',
        prompt:
          'Identify which legislation is most directly relevant to securing patient contact details after an insider breach.',
        guidance: 'Think about personal data duties.',
        options: Object.freeze([
          Object.freeze({ id: 'a', text: 'Current United Kingdom data protection legislation' }),
          Object.freeze({ id: 'b', text: 'Computer Misuse Act 1990 only' }),
          Object.freeze({ id: 'c', text: 'Police and Justice Act 2006 amendments only' }),
          Object.freeze({ id: 'd', text: 'No legislation applies to contact details' })
        ]),
        correctOptionId: 'a',
        markScheme: Object.freeze(['Current United Kingdom data protection legislation.'])
      }),
      Object.freeze({
        id: 'ocr6-3',
        commandWord: 'Describe',
        marks: 2,
        suggestedMinutes: 2,
        responseType: 'text',
        prompt:
          'Describe one ethical concern employees might raise about enhanced monitoring at Northbank.',
        guidance: 'Name employees as stakeholders and use scenario evidence.',
        markScheme: Object.freeze([
          'Names employees as stakeholders',
          'Describes an ethical concern such as trust, proportionality or dignity with scenario support'
        ])
      }),
      Object.freeze({
        id: 'ocr6-4',
        commandWord: 'Describe',
        marks: 2,
        suggestedMinutes: 2,
        responseType: 'text',
        prompt:
          'Describe one operational consideration Northbank must weigh before expanding monitoring.',
        guidance: 'Consider staff time, usability or productivity.',
        markScheme: Object.freeze([
          'Names an operational factor (cost, staff time, usability, downtime or productivity)',
          'Links it to Northbank care delivery or the insider breach context'
        ])
      }),
      Object.freeze({
        id: 'ocr6-5',
        commandWord: 'Explain',
        marks: 3,
        suggestedMinutes: 3,
        responseType: 'text',
        prompt:
          'Explain why the insider copying patient contact details may engage both the Computer Misuse Act 1990 and current United Kingdom data protection legislation.',
        guidance: 'Link each statute to a relevant duty or offence.',
        markScheme: Object.freeze([
          'Computer Misuse Act 1990 linked to unauthorised access or misuse of computer material',
          'Current United Kingdom data protection legislation linked to personal data security or accountability',
          'Clear explanation that the same incident can raise more than one legal duty'
        ])
      }),
      Object.freeze({
        id: 'ocr6-6',
        commandWord: 'Explain',
        marks: 4,
        suggestedMinutes: 4,
        responseType: 'text',
        prompt:
          'Explain why legal compliance alone may not settle whether enhanced employee monitoring is ethical at Northbank.',
        guidance: 'Separate law from ethics using the scenario.',
        markScheme: Object.freeze([
          'Explains that law sets minimum requirements',
          'Explains ethical expectations such as fairness or proportionality',
          'Uses Northbank insider breach context',
          'Shows that lawful monitoring could still feel excessive or damaging to trust'
        ])
      }),
      Object.freeze({
        id: 'ocr6-7',
        commandWord: 'Discuss',
        marks: 7,
        suggestedMinutes: 7,
        responseType: 'text',
        prompt:
          'Discuss how far Northbank Community Health Partnership should monitor employees after the insider data breach.',
        guidance:
          'Include ethical, legal and operational points, a competing consideration, a concession and a justified conclusion. Do not treat Discuss as a one-sided essay.',
        markScheme: Object.freeze([
          'States the issue clearly',
          'Develops supported considerations with scenario evidence',
          'Includes legal points with statute linked to duty where relevant',
          'Includes ethical and operational points',
          'Presents a competing consideration from another stakeholder',
          'Includes an explicit concession',
          'Reaches a justified, balanced conclusion'
        ])
      })
    ])
  });
})(window);
