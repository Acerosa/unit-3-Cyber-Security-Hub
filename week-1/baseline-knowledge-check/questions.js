/**
 * Week 1 Baseline Knowledge Check question data.
 *
 * Correct answers are stored in this public static file and may be inspected
 * by a technically knowledgeable learner. This diagnostic is low stakes and
 * must not be treated as a secure assessment or used for formal grading.
 *
 * Do not display correct answers in the normal learner interface.
 */

const BASELINE_QUIZ = {
  activityVersion: '1.0',
  totalMarks: 10,
  questions: [
    {
      id: 'q1',
      number: 1,
      type: 'single-choice',
      category: 'Password security',
      prompt: 'Which password is the strongest?',
      options: [
        { id: 'A', text: 'password123' },
        { id: 'B', text: 'Summer2026' },
        { id: 'C', text: 'River!Glass7-Planet' },
        { id: 'D', text: 'ricardo2005' }
      ],
      correctOption: 'C'
    },
    {
      id: 'q2',
      number: 2,
      type: 'single-choice',
      category: 'Phishing',
      prompt: 'What is phishing?',
      options: [
        { id: 'A', text: 'Physically stealing a computer' },
        { id: 'B', text: 'Sending a fraudulent message to obtain information' },
        { id: 'C', text: 'Installing updates on a computer' },
        { id: 'D', text: 'Encrypting a backup' }
      ],
      correctOption: 'B'
    },
    {
      id: 'q3',
      number: 3,
      type: 'single-choice',
      category: 'Suspicious emails',
      prompt:
        'You receive an unexpected email asking you to reset your college password. What should you do first?',
      options: [
        { id: 'A', text: 'Click the link immediately' },
        { id: 'B', text: 'Reply with your password' },
        { id: 'C', text: 'Check the sender and report the message if it is suspicious' },
        { id: 'D', text: 'Forward it to other learners' }
      ],
      correctOption: 'C'
    },
    {
      id: 'q4',
      number: 4,
      type: 'single-choice',
      category: 'Malware',
      prompt: 'Which statement best describes malware?',
      options: [
        { id: 'A', text: 'Software designed to damage, disrupt or gain unauthorised access' },
        { id: 'B', text: 'Any software that runs slowly' },
        { id: 'C', text: 'A secure method of storing passwords' },
        { id: 'D', text: 'A type of computer hardware' }
      ],
      correctOption: 'A'
    },
    {
      id: 'q5',
      number: 5,
      type: 'single-choice',
      category: 'Personal data',
      prompt: 'Which of the following is an example of personal data?',
      options: [
        { id: 'A', text: 'A blank spreadsheet' },
        { id: 'B', text: 'A person’s name and home address' },
        { id: 'C', text: 'A generic company logo' },
        { id: 'D', text: 'A public weather forecast' }
      ],
      correctOption: 'B'
    },
    {
      id: 'q6',
      number: 6,
      type: 'single-choice',
      category: 'Reasons for protecting information',
      prompt: 'Why should an organisation protect personal data?',
      options: [
        { id: 'A', text: 'To make computers run faster' },
        { id: 'B', text: 'To prevent harm, misuse and unauthorised disclosure' },
        { id: 'C', text: 'To avoid using passwords' },
        { id: 'D', text: 'To make all information public' }
      ],
      correctOption: 'B'
    },
    {
      id: 'q7',
      number: 7,
      type: 'single-choice',
      category: 'Integrity',
      prompt:
        'A learner changes another learner’s saved work without permission. What has been affected most directly?',
      options: [
        { id: 'A', text: 'Confidentiality' },
        { id: 'B', text: 'Integrity' },
        { id: 'C', text: 'Availability' },
        { id: 'D', text: 'Portability' }
      ],
      correctOption: 'B'
    },
    {
      id: 'q8',
      number: 8,
      type: 'single-choice',
      category: 'Availability',
      prompt:
        'A college system is offline and staff cannot access student records. What has been affected most directly?',
      options: [
        { id: 'A', text: 'Confidentiality' },
        { id: 'B', text: 'Integrity' },
        { id: 'C', text: 'Availability' },
        { id: 'D', text: 'Ownership' }
      ],
      correctOption: 'C'
    },
    {
      id: 'q9',
      number: 9,
      type: 'single-choice',
      category: 'Confidentiality',
      prompt:
        'A patient’s medical record is viewed by someone without permission. What has been affected most directly?',
      options: [
        { id: 'A', text: 'Confidentiality' },
        { id: 'B', text: 'Integrity' },
        { id: 'C', text: 'Availability' },
        { id: 'D', text: 'Performance' }
      ],
      correctOption: 'A'
    },
    {
      id: 'q10',
      number: 10,
      type: 'single-choice',
      category: 'Multi-factor authentication',
      prompt: 'Which action is most likely to reduce the risk of an account being compromised?',
      options: [
        { id: 'A', text: 'Sharing a password with a trusted friend' },
        { id: 'B', text: 'Using the same password everywhere' },
        { id: 'C', text: 'Enabling multi-factor authentication' },
        { id: 'D', text: 'Writing the password on the computer' }
      ],
      correctOption: 'C'
    },
    {
      id: 'q11',
      number: 11,
      type: 'confidence',
      scored: false,
      prompt: 'How confident are you about cyber security?',
      options: [
        { id: '1', text: 'I know very little' },
        { id: '2', text: 'I know a small amount' },
        { id: '3', text: 'I have some knowledge' },
        { id: '4', text: 'I feel fairly confident' },
        { id: '5', text: 'I am very confident' }
      ]
    },
    {
      id: 'q12',
      number: 12,
      type: 'prior-knowledge',
      scored: false,
      prompt: 'Name one cyber security incident, threat or issue you have heard about.',
      maxLength: 400
    }
  ]
};
