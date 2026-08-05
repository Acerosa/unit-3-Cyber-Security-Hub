/**
 * Week 2 Session 1 retrieval activity pack (Activity API content schema).
 */

var WEEK2_PACK_SESSION1_RETRIEVAL = Object.freeze({
  meta: {
    activityId: 'week2-session1-retrieval',
    activityName: 'Session 1 Retrieval Quiz',
    weekNumber: 2,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Retrieval quiz',
    activityVersion: '1.0',
    maximumScore: 10,
    allowsPartner: false,
    enabled: true,
    componentId: 'quiz',
    introduction: 'Retrieve Week 1 knowledge about cyber security, the CIA triad and common incident types. Answer independently before checking feedback.',
    completionMessage: 'Review any incorrect answers and note one CIA aim or incident type to revise.'
  },
  sections: [
    {
      sectionId: 'W2S1-INTRO',
      sectionType: 'learning',
      title: 'Before you begin',
      displayOrder: 1,
      feedbackTiming: 'none',
      contentBlocks: [
        {
          blockId: 'W2S1-INTRO-1',
          blockType: 'information',
          heading: 'Retrieval focus',
          content: 'This quiz checks what you remember from Week 1 before you apply threats and vulnerabilities in Week 2.',
          displayOrder: 1
        },
        {
          blockId: 'W2S1-INTRO-2',
          blockType: 'warning',
          heading: 'Teacher-created formative activity',
          content: 'This is formative classroom evidence, not a secure examination.',
          displayOrder: 2
        }
      ],
      questions: []
    },
    {
      sectionId: 'W2S1-ASSESSMENT',
      sectionType: 'assessment',
      title: 'Week 1 retrieval questions',
      displayOrder: 2,
      feedbackTiming: 'section',
      contentBlocks: [],
      questions: [
        {
          questionId: 'S1-Q1',
          questionType: 'single-choice',
          prompt: 'Which statement best describes cyber security?',
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
              text: 'Installing every software update on the same day it is released'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'Protecting systems, networks and data from unauthorised access, damage or disruption'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Blocking all external email to remove phishing risk'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'Using social media policies to control staff behaviour'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO1 recall / Week 1 foundations',
          difficulty: 'foundation'
        },
        {
          questionId: 'S1-Q2',
          questionType: 'single-choice',
          prompt: 'What does confidentiality mean in the CIA triad?',
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
              text: 'Information is available whenever authorised users need it'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'Information can only be accessed by people who are authorised to see it'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Information is never changed once it has been saved'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'Information is backed up to an off-site location'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO1 recall / Week 1 foundations',
          difficulty: 'foundation'
        },
        {
          questionId: 'S1-Q3',
          questionType: 'single-choice',
          prompt: 'What does integrity mean in the CIA triad?',
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
              text: 'Information is accurate and has not been altered without authorisation'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'Information is encrypted while it travels across a network'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Information is deleted after a set retention period'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'Information is shared only inside the organisation'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO1 recall / Week 1 foundations',
          difficulty: 'foundation'
        },
        {
          questionId: 'S1-Q4',
          questionType: 'single-choice',
          prompt: 'What does availability mean in the CIA triad?',
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
              text: 'Information is hidden from everyone except senior managers'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'Authorised users can access systems and information when they need them'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Information is copied to paper records for legal reasons'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'Information is never stored on portable devices'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO1 recall / Week 1 foundations',
          difficulty: 'foundation'
        },
        {
          questionId: 'S1-Q5',
          questionType: 'single-choice',
          prompt: 'Which of the following is a type of cyber security incident?',
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
              text: 'A planned staff training day'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'Unauthorised access to patient records'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Ordering new networked printers'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'Updating a meeting room booking'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO1 recall / Week 1 foundations',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S1-Q6',
          questionType: 'single-choice',
          prompt: 'Why must personal data be protected?',
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
              text: 'Because personal data is never useful to an attacker'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'Because loss or misuse can harm individuals and may breach data protection law'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Because personal data is always encrypted automatically'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'Because personal data only exists on paper forms'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO1 recall / Week 1 foundations',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S1-Q7',
          questionType: 'single-choice',
          prompt: 'Why must organisational data be protected?',
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
              text: 'Organisational data has no commercial or operational value'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'Loss or alteration can disrupt services, damage reputation and create financial cost'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Organisational data is always publicly available'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'Only personal data can be involved in an incident'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO1 recall / Week 1 foundations',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S1-Q8',
          questionType: 'single-choice',
          prompt: 'Why must state information be protected?',
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
              text: 'State information is only used for marketing campaigns'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'Compromise can affect national security, critical services or public safety'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'State information is never connected to digital systems'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'State information is less sensitive than social media posts'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO1 recall / Week 1 foundations',
          difficulty: 'intermediate'
        },
        {
          questionId: 'S1-Q9',
          questionType: 'single-choice',
          prompt: 'At Northbank, which CIA aim is mainly affected if appointment records become unreadable after ransomware?',
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
              text: 'Confidentiality only'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'Integrity only'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Availability'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'None of the CIA aims'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO1 recall / Week 1 foundations',
          difficulty: 'applied'
        },
        {
          questionId: 'S1-Q10',
          questionType: 'single-choice',
          prompt: 'Which statement is true about cyber security incidents?',
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
              text: 'They only happen when malware is involved'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'They can involve people, processes or technology and may affect one or more CIA aims'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'They always destroy data permanently'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'They only matter if personal data is stolen'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO1 recall / Week 1 foundations',
          difficulty: 'applied'
        }
      ]
    },
    {
      sectionId: 'W2S1-REVIEW',
      sectionType: 'reflection',
      title: 'Review',
      displayOrder: 3,
      feedbackTiming: 'final',
      contentBlocks: [
        {
          blockId: 'W2S1-REV-1',
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
    'S1-Q1': {
      correctOptionId: 'B',
      explanation: 'Cyber security is the protection of systems, networks and data from threats that could affect confidentiality, integrity or availability.',
      misconceptionFeedback: 'Cyber security is the protection of systems, networks and data from threats that could affect confidentiality, integrity or availability.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S1-Q2': {
      correctOptionId: 'B',
      explanation: 'Confidentiality means only authorised people can view or obtain the information.',
      misconceptionFeedback: 'Confidentiality means only authorised people can view or obtain the information.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S1-Q3': {
      correctOptionId: 'A',
      explanation: 'Integrity means information remains complete, accurate and trustworthy.',
      misconceptionFeedback: 'Integrity means information remains complete, accurate and trustworthy.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S1-Q4': {
      correctOptionId: 'B',
      explanation: 'Availability means authorised users can access systems and data when required.',
      misconceptionFeedback: 'Availability means authorised users can access systems and data when required.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S1-Q5': {
      correctOptionId: 'B',
      explanation: 'Unauthorised access is a cyber security incident because it threatens confidentiality of sensitive data.',
      misconceptionFeedback: 'Unauthorised access is a cyber security incident because it threatens confidentiality of sensitive data.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S1-Q6': {
      correctOptionId: 'B',
      explanation: 'Personal data must be protected to reduce harm to individuals and to meet legal and ethical duties.',
      misconceptionFeedback: 'Personal data must be protected to reduce harm to individuals and to meet legal and ethical duties.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S1-Q7': {
      correctOptionId: 'B',
      explanation: 'Organisational data supports services and decision-making; compromise can halt operations and damage trust.',
      misconceptionFeedback: 'Organisational data supports services and decision-making; compromise can halt operations and damage trust.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S1-Q8': {
      correctOptionId: 'B',
      explanation: 'State and critical public-sector information can affect security and public safety if exposed or disrupted.',
      misconceptionFeedback: 'State and critical public-sector information can affect security and public safety if exposed or disrupted.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S1-Q9': {
      correctOptionId: 'C',
      explanation: 'If staff cannot open records when needed, availability is affected. Confidentiality may also be at risk in some ransomware cases, but the clearest evidence here is loss of access.',
      misconceptionFeedback: 'If staff cannot open records when needed, availability is affected. Confidentiality may also be at risk in some ransomware cases, but the clearest evidence here is loss of access.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'S1-Q10': {
      correctOptionId: 'B',
      explanation: 'Incidents can arise from many causes and may affect confidentiality, integrity, availability or a combination.',
      misconceptionFeedback: 'Incidents can arise from many causes and may affect confidentiality, integrity, availability or a combination.',
      autoMark: true,
      scoringMode: 'objective'
    }
  },
  tutorData: {
    purpose: 'Retrieve Week 1 foundations before LO2 teaching.',
    marking: 'Objective single-choice; 1 mark each.'
  }
});
