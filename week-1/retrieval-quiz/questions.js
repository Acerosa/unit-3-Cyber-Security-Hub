/**
 * Week 1 Session 2 Retrieval Quiz question data.
 *
 * Answers are stored in this static file because the activity is low-stakes
 * formative retrieval practice. A public GitHub Pages site can be inspected,
 * so this quiz must not be treated as a secure assessment.
 *
 * Numbered questions: 1, 2(a), 2(b), 2(c), 3, 4, 5, 6, 7, 8, 9, 10
 * Total marks: 15
 */

const INCIDENT_TYPE_OPTIONS = [
  'Unauthorised access',
  'Information disclosure',
  'Modification of data',
  'Inaccessible data',
  'Destruction',
  'Theft'
];

const CIA_OPTIONS = ['Confidentiality', 'Integrity', 'Availability'];

const RETRIEVAL_QUIZ = {
  activityVersion: '1.0',
  totalMarks: 15,
  objectiveMarks: 13,
  writtenMarks: 2,
  durationSeconds: 600,
  warningSeconds: 120,
  questions: [
    {
      id: 'q1',
      number: '1',
      reportNumber: 1,
      type: 'multi-select',
      marks: 3,
      prompt: 'State the three aims of cyber security.',
      instruction: 'Select exactly three options.',
      options: [
        'Confidentiality',
        'Integrity',
        'Availability',
        'Authentication',
        'Encryption',
        'Accountability'
      ],
      correctAnswers: ['Confidentiality', 'Integrity', 'Availability'],
      maxSelections: 3,
      explanation:
        'The three aims of cyber security are confidentiality, integrity and availability.'
    },
    {
      id: 'q2a',
      number: '2(a)',
      reportNumber: 2,
      type: 'cia-radio',
      marks: 1,
      groupHeading: '2. Identify the main CIA aim affected in each scenario.',
      groupMarks: 3,
      prompt: 'Clinic staff cannot open the appointment system during working hours.',
      options: CIA_OPTIONS.slice(),
      correctAnswer: 'Availability',
      explanation:
        'Staff cannot use the system when needed, so availability is the main aim affected.'
    },
    {
      id: 'q2b',
      number: '2(b)',
      reportNumber: 2,
      type: 'cia-radio',
      marks: 1,
      prompt: 'A patient medication dose is changed without permission.',
      options: CIA_OPTIONS.slice(),
      correctAnswer: 'Integrity',
      explanation:
        'The information was changed without permission, so integrity is affected.'
    },
    {
      id: 'q2c',
      number: '2(c)',
      reportNumber: 2,
      type: 'cia-radio',
      marks: 1,
      prompt: 'A stranger reads private patient records.',
      options: CIA_OPTIONS.slice(),
      correctAnswer: 'Confidentiality',
      explanation:
        'Private records were viewed by someone who should not see them, so confidentiality is affected.'
    },
    {
      id: 'q3',
      number: '3',
      reportNumber: 3,
      type: 'incident-radio',
      marks: 1,
      prompt:
        'A former temporary worker uses an account that was not disabled to open the patient database.',
      questionText: 'Identify the cyber security incident type.',
      options: INCIDENT_TYPE_OPTIONS.slice(),
      correctAnswer: 'Unauthorised access',
      explanation:
        'Someone used an account without permission to open the patient database.'
    },
    {
      id: 'q4',
      number: '4',
      reportNumber: 4,
      type: 'incident-radio',
      marks: 1,
      prompt:
        'A receptionist emails patient telephone numbers to an external supplier that has no permission to receive them.',
      questionText: 'Identify the cyber security incident type.',
      options: INCIDENT_TYPE_OPTIONS.slice(),
      correctAnswer: 'Information disclosure',
      explanation:
        'Patient telephone numbers were sent to a supplier who was not permitted to receive them.'
    },
    {
      id: 'q5',
      number: '5',
      reportNumber: 5,
      type: 'incident-radio',
      marks: 1,
      prompt: 'An attacker changes a patient allergy status in the clinical system.',
      questionText: 'Identify the cyber security incident type.',
      options: INCIDENT_TYPE_OPTIONS.slice(),
      correctAnswer: 'Modification of data',
      explanation:
        'Patient allergy information was changed without permission.'
    },
    {
      id: 'q6',
      number: '6',
      reportNumber: 6,
      type: 'incident-radio',
      marks: 1,
      prompt:
        'The online appointment system is overwhelmed and legitimate users cannot open it.',
      questionText: 'Identify the cyber security incident type.',
      options: INCIDENT_TYPE_OPTIONS.slice(),
      correctAnswer: 'Inaccessible data',
      explanation:
        'Authorised users cannot access the appointment system when they need it.'
    },
    {
      id: 'q7',
      number: '7',
      reportNumber: 7,
      type: 'incident-radio',
      marks: 1,
      prompt:
        'A staff member permanently deletes referral records and no backup exists.',
      questionText: 'Identify the cyber security incident type.',
      options: INCIDENT_TYPE_OPTIONS.slice(),
      correctAnswer: 'Destruction',
      explanation:
        'Referral records were permanently deleted with no backup available.'
    },
    {
      id: 'q8',
      number: '8',
      reportNumber: 8,
      type: 'incident-radio',
      marks: 1,
      prompt:
        'A laptop containing unencrypted patient records is taken from a staff member’s car.',
      questionText: 'Identify the cyber security incident type.',
      options: INCIDENT_TYPE_OPTIONS.slice(),
      correctAnswer: 'Theft',
      explanation:
        'A device containing patient records was taken without permission.'
    },
    {
      id: 'q9',
      number: '9',
      reportNumber: 9,
      type: 'written',
      marks: 2,
      prompt: 'Explain the difference between confidentiality and integrity.',
      maxLength: 500,
      markingGuidance: [
        'Confidentiality concerns whether information is available only to authorised people or systems.',
        'Integrity concerns whether information remains accurate, complete and unchanged without permission.'
      ],
      modelAnswer:
        'Confidentiality means information is accessible only to authorised people or systems. Integrity means information remains accurate, complete and is not changed without permission.',
      selfMarkLabels: [
        'My answer correctly explains confidentiality.',
        'My answer correctly explains integrity.'
      ]
    },
    {
      id: 'q10',
      number: '10',
      reportNumber: 10,
      type: 'evidence',
      marks: 1,
      relatedScenarioId: 'q4',
      relatedScenarioText:
        'A receptionist emails patient telephone numbers to an external supplier that has no permission to receive them.',
      prompt:
        'Select the exact evidence that proves information disclosure occurred in Question 4.',
      options: [
        '“emails patient telephone numbers to an external supplier that has no permission to receive them”',
        '“A receptionist opens the patient appointment diary at the start of the day”',
        '“The supplier confirms receipt of an invoice for stationery”',
        '“Patient telephone numbers are stored in the clinic database for authorised staff”'
      ],
      correctAnswer:
        '“emails patient telephone numbers to an external supplier that has no permission to receive them”',
      explanation:
        'The evidence must show that information was sent to someone who was not permitted to receive it.'
    }
  ]
};
