/**
 * Week 2 Activity 9 — OCR-style question practice.
 * Tutor: edit questions, marks, timings and mark keys here.
 *
 * Scoring note (implemented in app.js): objective items are auto-marked;
 * the six-mark extended response awards up to 6 completion marks when the
 * learner writes a substantial draft (minimum 80 characters). Peer marking
 * in Activity 10 provides qualitative assessment — we do not keyword-mark prose.
 */
(function (global) {
  'use strict';

  global.Week2OcrPractice = Object.freeze({
    activityId: 'week2-ocr-question-practice',
    title: 'OCR-Style Question Practice',
    total: 20,
    suggestedMinutes: 35,
    extendedMinChars: 80,
    extendedDraftKey: 'ocrExtendedResponse',
    questions: Object.freeze([
      Object.freeze({
        id: 'ocr-q1',
        number: 1,
        commandWord: 'Define',
        marks: 2,
        suggestedMinutes: 3,
        type: 'mcq',
        prompt: 'Define the term threat in cyber security.',
        options: Object.freeze([
          'A weakness that could be exploited by an attacker',
          'A person, group or event that could harm systems, networks or data',
          'The outcome when an attack succeeds',
          'Software that removes viruses automatically'
        ]),
        correctIndex: 1
      }),
      Object.freeze({
        id: 'ocr-q2',
        number: 2,
        commandWord: 'Define',
        marks: 2,
        suggestedMinutes: 3,
        type: 'mcq',
        prompt: 'Define the term vulnerability in cyber security.',
        options: Object.freeze([
          'A control that blocks malicious traffic',
          'A weakness in technology, configuration or behaviour that a threat could exploit',
          'An encrypted backup stored off site',
          'A person who investigates incidents'
        ]),
        correctIndex: 1
      }),
      Object.freeze({
        id: 'ocr-q3',
        number: 3,
        commandWord: 'State',
        marks: 2,
        suggestedMinutes: 3,
        type: 'mcq',
        prompt: 'Which pair best describes common symptoms of ransomware?',
        options: Object.freeze([
          'Files become encrypted and users see a ransom demand',
          'The monitor brightness changes randomly',
          'Keyboard keys stick physically',
          'Paper documents fade in sunlight'
        ]),
        correctIndex: 0
      }),
      Object.freeze({
        id: 'ocr-q4',
        number: 4,
        commandWord: 'Identify',
        marks: 2,
        suggestedMinutes: 4,
        type: 'mcq',
        scenario:
          'At Northbank, a scammer sends fake invoice emails containing malicious attachments.',
        prompt: 'Identify the threat in this scenario.',
        options: Object.freeze([
          'Staff who open attachments without checking',
          'The scammer sending malicious invoice emails',
          'The email server hardware',
          'The incident log template'
        ]),
        correctIndex: 1,
        reversedIndex: 0,
        reversedExplanation:
          'You may have reversed threat and vulnerability. The scammer sending malicious emails is the threat. Opening attachments without checking is the vulnerability.'
      }),
      Object.freeze({
        id: 'ocr-q5',
        number: 5,
        commandWord: 'Identify',
        marks: 2,
        suggestedMinutes: 4,
        type: 'mcq',
        scenario:
          'At Northbank, a reception PC still runs an operating system that no longer receives security updates.',
        prompt: 'Identify the vulnerability in this scenario.',
        options: Object.freeze([
          'Malware designed to exploit outdated systems',
          'The unsupported operating system without security updates',
          'The reception desk furniture',
          'The organisation\'s logo on the website'
        ]),
        correctIndex: 1,
        reversedIndex: 0,
        reversedExplanation:
          'You may have reversed threat and vulnerability. Outdated software is the vulnerability. Malware exploiting it would be the threat.'
      }),
      Object.freeze({
        id: 'ocr-q6',
        number: 6,
        commandWord: 'Describe',
        marks: 2,
        suggestedMinutes: 4,
        type: 'mcq',
        prompt:
          'Which statement best applies threat and vulnerability knowledge to Northbank?',
        options: Object.freeze([
          'Northbank has no human vulnerabilities because staff are trained once',
          'Unpatched software at Northbank is a vulnerability that malware could exploit, disrupting patient services',
          'Threats only exist outside the organisation so internal systems are safe',
          'Vulnerabilities and threats are the same at Northbank'
        ]),
        correctIndex: 1
      }),
      Object.freeze({
        id: 'ocr-q7',
        number: 7,
        commandWord: 'State',
        marks: 2,
        suggestedMinutes: 3,
        type: 'mcq',
        scenario:
          'After ransomware encrypts Northbank appointment records, clinicians cannot access schedules for a full day.',
        prompt: 'Which CIA aim is mainly affected?',
        options: Object.freeze([
          'Confidentiality only',
          'Integrity only',
          'Availability',
          'None of the CIA aims'
        ]),
        correctIndex: 2
      }),
      Object.freeze({
        id: 'ocr-q8',
        number: 8,
        commandWord: 'Explain',
        marks: 6,
        suggestedMinutes: 12,
        type: 'extended',
        prompt:
          'Explain how a phishing attack could lead to a cyber security incident at Northbank Community Health Partnership. In your answer, refer to threats, vulnerabilities and the impact on confidentiality. [6 marks]'
      })
    ])
  });
})(window);
