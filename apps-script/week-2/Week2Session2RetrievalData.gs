/**
 * Week 2 Session 2 retrieval activity pack.
 */

var WEEK2_PACK_SESSION2_RETRIEVAL = Object.freeze({
  meta: {
    activityId: 'week2-session2-retrieval',
    activityName: 'Session 2 Retrieval Quiz',
    weekNumber: 2,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Retrieval quiz',
    activityVersion: '1.0',
    maximumScore: 10,
    allowsPartner: false,
    enabled: true,
    componentId: 'quiz',
    introduction: 'Retrieve Week 2 ideas about threats, vulnerabilities, incidents and malware symptoms, including a Northbank application.',
    completionMessage: 'If you reversed a threat and a vulnerability, re-read the central model before the Northbank analysis.'
  },
  sections: [
    {
      sectionId: 'W2S2-INTRO',
      sectionType: 'learning',
      title: 'Before you begin',
      displayOrder: 1,
      feedbackTiming: 'none',
      contentBlocks: [
        {
          blockId: 'W2S2-INTRO-1',
          blockType: 'information',
          heading: 'Retrieval focus',
          content: 'Check definitions first, then applied Northbank thinking. Watch for questions that reverse threat and vulnerability.',
          displayOrder: 1
        }
      ],
      questions: []
    },
    {
      sectionId: 'W2S2-ASSESSMENT',
      sectionType: 'assessment',
      title: 'Week 2 retrieval questions',
      displayOrder: 2,
      feedbackTiming: 'section',
      contentBlocks: [],
      questions: [
        {
          questionId: 'S2-Q1',
          questionType: 'single-choice',
          prompt: 'Which statement best defines a threat in cyber security?',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 1,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A weakness in a system that could be exploited'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'A person, group or event that could harm systems, networks or data'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'The harmful outcome after an attack succeeds'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'A control that reduces risk'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 2.1 / 2.2',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S2-Q2',
          questionType: 'single-choice',
          prompt: 'Which statement best defines a vulnerability?',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 2,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A ransomware operator attempting to encrypt files'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'A weakness in technology, configuration or behaviour that a threat could exploit'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'A successful login using stolen credentials'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'An antivirus product scanning email attachments'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 2.1 / 2.2',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S2-Q3',
          questionType: 'single-choice',
          prompt: 'What is the correct relationship between threats and vulnerabilities?',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 3,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A vulnerability automatically creates a threat'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'Threats and vulnerabilities mean the same thing in OCR exams'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'A threat exploits a vulnerability to cause a cyber security incident'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'An incident happens only when hardware fails'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 2.1 / 2.2',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S2-Q4',
          questionType: 'single-choice',
          prompt: 'Which symptom is most commonly associated with ransomware?',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 4,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'Files become encrypted and a ransom note appears'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'The mouse pointer moves without user input only'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'The printer runs out of toner'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'Email signatures change automatically'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 2.1 / 2.2',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S2-Q5',
          questionType: 'single-choice',
          prompt: 'Out-of-date web server software with a known security flaw is best classified as…',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 5,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A software vulnerability'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'A hardware vulnerability'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'A configuration vulnerability'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'A human behaviour vulnerability'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 2.1 / 2.2',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S2-Q6',
          questionType: 'single-choice',
          prompt: 'An unlocked server room cabinet left overnight is best classified as…',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 6,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A software vulnerability'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'A hardware vulnerability'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'A configuration vulnerability'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'A human behaviour vulnerability'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 2.1 / 2.2',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S2-Q7',
          questionType: 'single-choice',
          prompt: 'A firewall rule that allows unnecessary inbound traffic is best classified as…',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 7,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A software vulnerability'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'A hardware vulnerability'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'A configuration vulnerability'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'A human behaviour vulnerability'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 2.1 / 2.2',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S2-Q8',
          questionType: 'single-choice',
          prompt: 'Staff who trust phishing emails without checking the sender are an example of…',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 8,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A software vulnerability'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'A hardware vulnerability'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'A configuration vulnerability'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'A human behaviour vulnerability'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 2.1 / 2.2',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S2-Q9',
          questionType: 'single-choice',
          prompt: 'In this scenario, what is the threat?',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 9,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'Reception staff who do not verify unexpected support calls'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'The social engineer pretending to be IT support'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'The remote-access system itself'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'The incident report form'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 2.1 / 2.2',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S2-Q10',
          questionType: 'single-choice',
          prompt: 'In this scenario, what is the vulnerability?',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 10,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'Malware designed to exploit the known flaw'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'The missing software patch leaving a known weakness'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Patient records stored on the server'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'The cyber security incident response team'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 2.1 / 2.2',
          difficulty: 'intermediate'
        }
      ]
    },
    {
      sectionId: 'W2S2-REVIEW',
      sectionType: 'reflection',
      title: 'Review',
      displayOrder: 3,
      feedbackTiming: 'final',
      contentBlocks: [
        {
          blockId: 'W2S2-REV-1',
          blockType: 'checklist',
          heading: 'Before you finish',
          content: 'Check any incorrect answers and note one term or idea to revisit.',
          displayOrder: 1
        }
      ],
      questions: []
    }
  ],
  assessment: {
    'S2-Q1': {
      correctOptionId: 'B',
      explanation: 'A threat is the potential source of harm — who or what might attack or cause damage.',
      misconceptionFeedback: 'A threat is the potential source of harm — who or what might attack or cause damage.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S2-Q2': {
      correctOptionId: 'B',
      explanation: 'A vulnerability is a flaw or weakness — unpatched software, misconfiguration or human error.',
      misconceptionFeedback: 'A vulnerability is a flaw or weakness — unpatched software, misconfiguration or human error.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S2-Q3': {
      correctOptionId: 'C',
      explanation: 'Both must be present: a threat exploits a vulnerability, which leads to an incident affecting CIA aims.',
      misconceptionFeedback: 'Both must be present: a threat exploits a vulnerability, which leads to an incident affecting CIA aims.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S2-Q4': {
      correctOptionId: 'A',
      explanation: 'Ransomware typically encrypts files and demands payment. Users often cannot open affected documents.',
      misconceptionFeedback: 'Ransomware typically encrypts files and demands payment. Users often cannot open affected documents.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S2-Q5': {
      correctOptionId: 'A',
      explanation: 'Unpatched or outdated application code is a software vulnerability — a weakness in the program itself.',
      misconceptionFeedback: 'Unpatched or outdated application code is a software vulnerability — a weakness in the program itself.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S2-Q6': {
      correctOptionId: 'B',
      explanation: 'Physical access to hardware without proper protection is a hardware (physical) vulnerability.',
      misconceptionFeedback: 'Physical access to hardware without proper protection is a hardware (physical) vulnerability.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S2-Q7': {
      correctOptionId: 'C',
      explanation: 'Misconfigured security settings — such as overly permissive firewall rules — are configuration vulnerabilities.',
      misconceptionFeedback: 'Misconfigured security settings — such as overly permissive firewall rules — are configuration vulnerabilities.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S2-Q8': {
      correctOptionId: 'D',
      explanation: 'Untrained or careless behaviour is a human vulnerability that social engineers exploit.',
      misconceptionFeedback: 'Untrained or careless behaviour is a human vulnerability that social engineers exploit.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S2-Q9': {
      correctOptionId: 'B',
      explanation: 'The social engineer is the threat. Failing to verify the caller is the human vulnerability.',
      misconceptionFeedback: 'The social engineer is the threat. Failing to verify the caller is the human vulnerability.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S2-Q10': {
      correctOptionId: 'B',
      explanation: 'Unpatched software is the vulnerability. Malware or an attacker targeting the flaw would be the threat.',
      misconceptionFeedback: 'Unpatched software is the vulnerability. Malware or an attacker targeting the flaw would be the threat.',
      autoMark: true,
      scoringMode: 'objective'
    }
  },
  tutorData: {
    purpose: 'Retrieve LO2 terminology before scenario analysis.'
  }
});
