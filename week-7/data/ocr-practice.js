/**
 * Week 7 OCR-style timed examination practice (20 marks).
 * Formative OCR-style practice - not official OCR examination questions.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week7OcrPractice = Object.freeze({
    activityId: 'week7-ocr-question-practice',
    activityName: 'OCR-Style Timed Questions',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 2,
    total: 20,
    suggestedMinutes: 25,
    timingGuidance:
      'Use approximately one minute per mark where this helps you manage time. These are OCR-style practice questions, not official OCR examination questions.',
    beforeReminders: Object.freeze([
      'Separate risk, threat and vulnerability.',
      'Name testing methods with purpose and limitation where asked.',
      'Detection alerts; prevention acts.',
      'Recommendations need organisational context and measurable effectiveness, not “installed” alone.',
      'Mark schemes stay hidden until you submit.'
    ]),
    northbankScenario:
      'Northbank Community Health Partnership runs community clinics with a shared appointment system, staff laptops and a public website. Partners expect proportionate cyber security. Budget is limited. Staff report phishing attempts. Managers are building a risk register and choosing testing and monitoring measures that they can justify.',
    questions: Object.freeze([
      Object.freeze({
        id: 'ocr7-1',
        commandWord: 'Identify',
        marks: 1,
        suggestedMinutes: 1,
        responseType: 'mcq',
        prompt: 'Identify the first stage in the risk-management sequence used in this unit.',
        guidance: 'Think about what must be listed before likelihood and impact.',
        options: Object.freeze([
          Object.freeze({ id: 'a', text: 'Identify assets' }),
          Object.freeze({ id: 'b', text: 'Review effectiveness measure' }),
          Object.freeze({ id: 'c', text: 'Decide treatment with no asset list' }),
          Object.freeze({ id: 'd', text: 'Install software without analysis' })
        ]),
        correctOptionId: 'a',
        markScheme: Object.freeze(['Identify assets.'])
      }),
      Object.freeze({
        id: 'ocr7-2',
        commandWord: 'Identify',
        marks: 1,
        suggestedMinutes: 1,
        responseType: 'mcq',
        prompt: 'Identify which statement correctly separates threat and vulnerability.',
        guidance: 'Threat is the potential cause of harm; vulnerability is the weakness.',
        options: Object.freeze([
          Object.freeze({
            id: 'a',
            text: 'Threat is a potential cause of harm; vulnerability is a weakness that could be exploited'
          }),
          Object.freeze({ id: 'b', text: 'Threat and vulnerability mean the same thing' }),
          Object.freeze({ id: 'c', text: 'Vulnerability is always an external attacker' }),
          Object.freeze({ id: 'd', text: 'Risk is only another word for threat' })
        ]),
        correctOptionId: 'a',
        markScheme: Object.freeze([
          'Threat = potential cause of harm; vulnerability = weakness.'
        ])
      }),
      Object.freeze({
        id: 'ocr7-3',
        commandWord: 'Describe',
        marks: 2,
        suggestedMinutes: 2,
        responseType: 'text',
        prompt:
          'Describe what penetration testing is and state one limitation for Northbank.',
        guidance: 'Authorised simulated attack; not identical to automated scanning.',
        markScheme: Object.freeze([
          'Describes authorised simulated attack / attempt to exploit within scope',
          'States a limitation such as scope, time-box, or that a clean test does not prove permanent security'
        ])
      }),
      Object.freeze({
        id: 'ocr7-4',
        commandWord: 'Describe',
        marks: 2,
        suggestedMinutes: 2,
        responseType: 'text',
        prompt: 'Describe the purpose of fuzzing.',
        guidance: 'Focus on unexpected, invalid or unusual input.',
        markScheme: Object.freeze([
          'Mentions unexpected / invalid / unusual input',
          'Links to finding crashes, faults or unsafe handling'
        ])
      }),
      Object.freeze({
        id: 'ocr7-5',
        commandWord: 'Explain',
        marks: 2,
        suggestedMinutes: 2,
        responseType: 'text',
        prompt:
          'Explain the purpose of security functionality testing using a Northbank control example.',
        guidance: 'Control behaves as specified.',
        markScheme: Object.freeze([
          'States that SFT checks a control behaves as specified',
          'Uses a Northbank example such as MFA or role-based access'
        ])
      }),
      Object.freeze({
        id: 'ocr7-6',
        commandWord: 'Explain',
        marks: 2,
        suggestedMinutes: 2,
        responseType: 'text',
        prompt: 'Explain why sandboxing may be used before opening an untrusted file.',
        guidance: 'Isolation; what it cannot fully prove.',
        markScheme: Object.freeze([
          'Explains isolation of untrusted code/files',
          'Notes safer observation / reduced exposure to live systems'
        ])
      }),
      Object.freeze({
        id: 'ocr7-7',
        commandWord: 'Compare',
        marks: 4,
        suggestedMinutes: 4,
        responseType: 'text',
        prompt:
          'Compare intrusion detection with intrusion prevention for Northbank.',
        guidance: 'Alerts versus acts; give a short organisational point for each.',
        markScheme: Object.freeze([
          'Detection alerts on suspicious activity',
          'Prevention can block or disrupt suspicious activity',
          'Clear comparison point (difference stated)',
          'Northbank context or consequence mentioned'
        ])
      }),
      Object.freeze({
        id: 'ocr7-8',
        commandWord: 'Discuss',
        marks: 3,
        suggestedMinutes: 3,
        responseType: 'text',
        prompt:
          'Discuss whether Northbank should Accept a Low-impact risk that a public leaflet PDF is briefly unavailable during updates.',
        guidance: 'Cost disproportionate; care impact low; Accept is reasoned, not ignoring risk.',
        markScheme: Object.freeze([
          'Recognises Low impact / limited care effect',
          'Considers disproportionate cost of further control',
          'Reaches a justified view on Accept or not'
        ])
      }),
      Object.freeze({
        id: 'ocr7-9',
        commandWord: 'Justify',
        marks: 3,
        suggestedMinutes: 3,
        responseType: 'text',
        prompt:
          'Justify one monitoring or testing recommendation for Northbank’s appointment-system phishing risk. Include how you would judge effectiveness.',
        guidance: 'Name measure + organisational reason + measurable effectiveness.',
        markScheme: Object.freeze([
          'Names a suitable measure',
          'Links recommendation to Northbank / phishing / appointment context',
          'States a measurable effectiveness idea (not only “installed”)'
        ])
      })
    ])
  });
})(window);
