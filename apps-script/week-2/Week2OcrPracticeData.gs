/**
 * Week 2 OCR-style question practice pack.
 *
 * Objective items may be auto-marked. The six-mark prose item is manual only.
 */

var WEEK2_PACK_OCR_PRACTICE = Object.freeze({
  meta: {
    activityId: 'week2-ocr-question-practice',
    activityName: 'OCR-Style Question Practice',
    weekNumber: 2,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Exam skills',
    activityVersion: '1.0',
    maximumScore: 20,
    allowsPartner: false,
    enabled: true,
    componentId: 'ocr-question-practice',
    introduction:
      'Complete a 20-mark OCR-style question set on threats, vulnerabilities, malware symptoms and Northbank application.',
    completionMessage:
      'Use feedback on objective items and the peer-marking mark scheme for the six-mark explain response.'
  },
  sections: [
    {
      sectionId: 'W2OCR-INTRO',
      sectionType: 'learning',
      title: 'OCR-style practice instructions',
      displayOrder: 1,
      feedbackTiming: 'none',
      contentBlocks: [
        {
          blockId: 'W2OCR-B1',
          blockType: 'information',
          heading: 'Timing and command words',
          content:
            'Suggested time: 40 minutes. Read each command word carefully. Use exact course terminology for threat, vulnerability, incident and impact.',
          displayOrder: 1
        },
        {
          blockId: 'W2OCR-B2',
          blockType: 'warning',
          heading: 'Automatic marking limits',
          content:
            'Objective items may be marked automatically. The six-mark explain answer is not automatically scored as an examination mark.',
          displayOrder: 2
        }
      ],
      questions: []
    },
    {
      sectionId: 'W2OCR-Q1',
      sectionType: 'assessment',
      title: 'Question 1: Define a threat',
      displayOrder: 2,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2OCR-Q1-TIP',
          blockType: 'tip',
          heading: 'Command word: Define',
          content: 'Give a clear meaning. 1 mark.',
          displayOrder: 1
        }
      ],
      questions: [
        {
          questionId: 'W2OCR-Q01',
          questionType: 'single-choice',
          prompt: 'Define a cyber security threat.',
          instruction: 'Select the best definition.',
          marks: 1,
          required: true,
          displayOrder: 1,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          commandWord: 'Define',
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A weakness in a system, process or behaviour that can be exploited'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'An actor, event or circumstance capable of causing harm to systems, networks or data'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'The consequence that occurs after an incident has been contained'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'A control that completely removes every cyber security risk'
            }
          ]
        }
      ]
    },
    {
      sectionId: 'W2OCR-Q2',
      sectionType: 'assessment',
      title: 'Question 2: Define a vulnerability',
      displayOrder: 3,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2OCR-Q2-TIP',
          blockType: 'tip',
          heading: 'Command word: Define',
          content: 'Give a clear meaning. 1 mark.',
          displayOrder: 1
        }
      ],
      questions: [
        {
          questionId: 'W2OCR-Q02',
          questionType: 'single-choice',
          prompt: 'Define a vulnerability.',
          instruction: 'Select the best definition.',
          marks: 1,
          required: true,
          displayOrder: 1,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          commandWord: 'Define',
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A weakness that can be exploited by a threat'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'A person who deliberately attacks an organisation'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'An incident report completed after a breach'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'A backup copy of patient records'
            }
          ]
        }
      ]
    },
    {
      sectionId: 'W2OCR-Q3',
      sectionType: 'assessment',
      title: 'Question 3: Identify vulnerabilities',
      displayOrder: 4,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2OCR-Q3-SC',
          blockType: 'information',
          heading: 'Scenario',
          content:
            'At Northbank, a reception PC runs an unsupported operating system. Staff also share one login for the booking system.',
          displayOrder: 1
        }
      ],
      questions: [
        {
          questionId: 'W2OCR-Q03',
          questionType: 'single-choice',
          prompt: 'Identify two vulnerabilities in the scenario.',
          instruction: 'Select the option that names two weaknesses.',
          marks: 2,
          required: true,
          displayOrder: 1,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          commandWord: 'Identify',
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'Unsupported operating system; shared reception login'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'Ransomware operator; malicious insider'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Encrypted backup; multi-factor authentication'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'Patient appointment; staff rota'
            }
          ]
        }
      ]
    },
    {
      sectionId: 'W2OCR-Q4',
      sectionType: 'assessment',
      title: 'Question 4: Describe malware symptoms',
      displayOrder: 5,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2OCR-Q4-TIP',
          blockType: 'tip',
          heading: 'Command word: Describe',
          content: 'Give observable symptoms a user or organisation might notice. 4 marks.',
          displayOrder: 1
        }
      ],
      questions: [
        {
          questionId: 'W2OCR-Q04',
          questionType: 'single-choice',
          prompt:
            'Describe two symptoms that might indicate a malware infection.',
          instruction: 'Choose the best pair of observable symptoms.',
          marks: 4,
          required: true,
          displayOrder: 1,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          commandWord: 'Describe',
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'Files become unreadable with a ransom note; unusual outbound network traffic'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'A firewall rule is documented; a patch is approved by IT'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Staff complete training; passwords are changed on schedule'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'A visitor signs in at reception; a meeting room is booked'
            }
          ]
        }
      ]
    },
    {
      sectionId: 'W2OCR-Q5',
      sectionType: 'assessment',
      title: 'Question 5: Explain the difference',
      displayOrder: 6,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2OCR-Q5-TIP',
          blockType: 'tip',
          heading: 'Command word: Explain',
          content: 'Show the difference clearly. 3 marks.',
          displayOrder: 1
        }
      ],
      questions: [
        {
          questionId: 'W2OCR-Q05',
          questionType: 'single-choice',
          prompt: 'Explain the difference between a threat and a vulnerability.',
          instruction: 'Select the most accurate explanation.',
          marks: 3,
          required: true,
          displayOrder: 1,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          commandWord: 'Explain',
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A threat is capable of causing harm; a vulnerability is a weakness that can be exploited. An incident occurs when a threat exploits a vulnerability.'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'A threat and a vulnerability are different words for the same idea.'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'A vulnerability attacks the organisation; a threat is the resulting downtime.'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'A threat is always software; a vulnerability is always a person.'
            }
          ]
        }
      ]
    },
    {
      sectionId: 'W2OCR-Q6',
      sectionType: 'assessment',
      title: 'Question 6: Analyse a Northbank scenario',
      displayOrder: 7,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2OCR-Q6-SC',
          blockType: 'information',
          heading: 'Scenario',
          content:
            'A Northbank nurse receives an email that appears to come from IT, asking her to sign in to “renew mailbox access”. She clicks the link and enters her password on a fake page.',
          displayOrder: 1
        }
      ],
      questions: [
        {
          questionId: 'W2OCR-Q06',
          questionType: 'single-choice',
          prompt:
            'Analyse the scenario and explain how a named threat could exploit a vulnerability.',
          instruction: 'Select the best analysis.',
          marks: 3,
          required: true,
          displayOrder: 1,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          commandWord: 'Analyse',
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A phishing threat exploits the human vulnerability of trusting an unverified login link, allowing credentials to be stolen.'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'The fake page is a vulnerability and the nurse is the threat.'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'The incident is the email itself; no vulnerability is present.'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'Unsupported software is the only possible vulnerability in this scenario.'
            }
          ]
        }
      ]
    },
    {
      sectionId: 'W2OCR-Q7',
      sectionType: 'assessment',
      title: 'Question 7: Six-mark explain',
      displayOrder: 8,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2OCR-Q7-TIP',
          blockType: 'tip',
          heading: 'Command word: Explain [6 marks]',
          content:
            'Name the threat and vulnerability, explain exploitation, apply the answer to Northbank, and describe possible consequences. This item is not auto-marked.',
          displayOrder: 1
        }
      ],
      questions: [
        {
          questionId: 'W2OCR-Q07',
          questionType: 'extended-response',
          prompt:
            'Explain how a phishing threat could exploit a human vulnerability at Northbank Community Health Partnership and describe the possible consequences.',
          instruction:
            'Write a structured explain response. Automatic examination scoring is not permitted for this item.',
          marks: 6,
          required: true,
          displayOrder: 1,
          minimumCharacters: 120,
          maximumCharacters: 4000,
          minimumSelections: 0,
          maximumSelections: 0,
          commandWord: 'Explain',
          options: []
        }
      ]
    },
    {
      sectionId: 'W2OCR-REVIEW',
      sectionType: 'reflection',
      title: 'Review your examination practice',
      displayOrder: 9,
      feedbackTiming: 'final',
      contentBlocks: [
        {
          blockId: 'W2OCR-REV-1',
          blockType: 'checklist',
          heading: 'Before peer marking',
          content:
            'Check objective feedback.\nKeep your six-mark draft for the peer-marking activity.\nNote one improvement target.',
          displayOrder: 1
        }
      ],
      questions: []
    }
  ],
  assessment: {
    'W2OCR-Q01': {
      correctOptionId: 'B',
      explanation:
        'A threat is an actor, event or circumstance capable of causing harm.',
      misconceptionFeedback:
        'A weakness is a vulnerability, not a threat.',
      autoMark: true,
      scoringMode: 'objective',
      indicativeContent: 'Threat = potential cause of harm.',
      markScheme: ['Clear definition of threat as capability/source of harm'],
      commonErrors: ['Defining a vulnerability instead'],
      examinerGuidance: 'Award for accurate definition; wording may vary.',
      suggestedTimeMinutes: 2,
      specificationReference: 'LO2 2.1'
    },
    'W2OCR-Q02': {
      correctOptionId: 'A',
      explanation: 'A vulnerability is a weakness that can be exploited by a threat.',
      misconceptionFeedback: 'An attacker is a threat, not a vulnerability.',
      autoMark: true,
      scoringMode: 'objective',
      indicativeContent: 'Vulnerability = exploitable weakness.',
      markScheme: ['Clear definition of vulnerability as weakness'],
      commonErrors: ['Defining a threat actor instead'],
      examinerGuidance: 'Accept equivalent accurate wording.',
      suggestedTimeMinutes: 2,
      specificationReference: 'LO2 2.2'
    },
    'W2OCR-Q03': {
      correctOptionId: 'A',
      explanation:
        'Unsupported software and a shared login are both weaknesses — vulnerabilities.',
      misconceptionFeedback:
        'Ransomware operators and malicious insiders are threats, not vulnerabilities.',
      autoMark: true,
      scoringMode: 'objective',
      indicativeContent: 'Two vulnerabilities from the scenario.',
      markScheme: ['Unsupported OS', 'Shared login'],
      commonErrors: ['Listing threats instead of weaknesses'],
      examinerGuidance: 'Both vulnerabilities required for full marks.',
      suggestedTimeMinutes: 3,
      specificationReference: 'LO2 2.2'
    },
    'W2OCR-Q04': {
      correctOptionId: 'A',
      explanation:
        'Observable symptoms include unreadable files with a ransom note and unusual network traffic.',
      misconceptionFeedback:
        'Controls and routine admin tasks are not infection symptoms.',
      autoMark: true,
      scoringMode: 'objective',
      indicativeContent: 'Two realistic observable symptoms.',
      markScheme: ['Symptom 1 described', 'Symptom 2 described'],
      commonErrors: ['Naming malware without describing what users notice'],
      examinerGuidance: 'Reward observable impact language.',
      suggestedTimeMinutes: 5,
      specificationReference: 'LO2 malware symptoms'
    },
    'W2OCR-Q05': {
      correctOptionId: 'A',
      explanation:
        'Threats cause potential harm; vulnerabilities are weaknesses; incidents happen when exploitation succeeds.',
      misconceptionFeedback:
        'Do not reverse the terms or treat them as interchangeable.',
      autoMark: true,
      scoringMode: 'objective',
      indicativeContent: 'Clear contrast plus relationship to incidents.',
      markScheme: ['Threat defined/contrasted', 'Vulnerability defined/contrasted', 'Link to exploitation/incident'],
      commonErrors: ['Saying they are the same'],
      examinerGuidance: 'Look for a clear relational explanation.',
      suggestedTimeMinutes: 4,
      specificationReference: 'LO2 2.1 / 2.2'
    },
    'W2OCR-Q06': {
      correctOptionId: 'A',
      explanation:
        'Phishing is the threat; trusting an unverified link is the human vulnerability; credential theft is the exploitation path.',
      misconceptionFeedback:
        'Do not label the nurse as the threat or deny that a vulnerability exists.',
      autoMark: true,
      scoringMode: 'objective',
      indicativeContent: 'Named threat + vulnerability + exploitation.',
      markScheme: ['Threat named', 'Vulnerability named', 'Exploitation explained'],
      commonErrors: ['Reversing threat and vulnerability'],
      examinerGuidance: 'Require the exploitation link.',
      suggestedTimeMinutes: 5,
      specificationReference: 'LO2 applied Northbank'
    },
    'W2OCR-Q07': {
      autoMark: false,
      scoringMode: 'manual',
      explanation:
        'Tutor or peer review uses the indicative mark scheme. Automatic marking is not permitted.',
      indicativeContent:
        'Phishing threat; human vulnerability; exploitation path; Northbank application; likely incident; consequences for confidentiality/operations.',
      markScheme: [
        'Relevant threat identified',
        'Relevant vulnerability identified',
        'Relationship explained',
        'Applied to Northbank',
        'Likely incident or consequence explained',
        'Meets the command word Explain'
      ],
      commonErrors: [
        'List of terms with no explanation',
        'No Northbank context',
        'Threat and vulnerability reversed'
      ],
      examinerGuidance: 'Do not auto-score the six-mark prose answer.',
      suggestedTimeMinutes: 12,
      specificationReference: 'LO2 exam skills'
    }
  },
  tutorData: {
    totalMarks: 20,
    objectiveMarks: 14,
    manualMarks: 6,
    note: 'Peer marking reuses the six-mark checklist for W2OCR-Q07.'
  }
});
