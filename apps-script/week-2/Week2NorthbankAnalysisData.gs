/**
 * Week 2 Northbank vulnerability analysis pack.
 */

var WEEK2_PACK_NORTHBANK_ANALYSIS = Object.freeze({
  meta: {
    activityId: 'week2-northbank-vulnerability-analysis',
    activityName: 'Northbank Vulnerability Analysis',
    weekNumber: 2,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Scenario analysis',
    activityVersion: '1.0',
    maximumScore: 5,
    allowsPartner: false,
    enabled: true,
    componentId: 'scenario-analysis',
    introduction: 'Analyse five Northbank scenarios using the threat–vulnerability–incident model and CIA aims.',
    completionMessage: 'Compare your justifications with the feedback and refine any reversed threat/vulnerability pairs.'
  },
  sections: [
    {
      sectionId: 'W2NBA-INTRO',
      sectionType: 'learning',
      title: 'Northbank vulnerability analysis',
      displayOrder: 1,
      feedbackTiming: 'none',
      contentBlocks: [
        {
          blockId: 'W2NBA-B1',
          blockType: 'information',
          heading: 'What to identify',
          content: 'For each scenario identify: asset or system, vulnerability, vulnerability category, threat, likely incident, CIA aim(s) affected, and a short justification.',
          displayOrder: 1
        },
        {
          blockId: 'W2NBA-B2',
          blockType: 'checklist',
          heading: 'Vulnerability categories',
          content: 'Software\nHardware\nConfiguration\nHuman behaviour',
          displayOrder: 2
        }
      ],
      questions: []
    },
    {
      sectionId: 'W2NBA-SC-1',
      sectionType: 'assessment',
      title: 'Unpatched patient portal',
      displayOrder: 2,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2NBA-SCB-1',
          blockType: 'information',
          heading: 'Scenario',
          content: 'Northbank\'s patient appointment portal runs software that has not been updated for six months. A vendor patch fixing a serious flaw was released but never installed.',
          displayOrder: 1
        },
        {
          blockId: 'W2NBA-TIP-1',
          blockType: 'tip',
          heading: 'Answer structure',
          content: 'State the vulnerability and category, name the threat, describe the likely incident, tick the CIA aims, then justify the chain in two or three sentences.',
          displayOrder: 2
        }
      ],
      questions: [
        {
          questionId: 'NBA-1',
          questionType: 'extended-response',
          prompt: 'Analyse this Northbank scenario. Identify the asset, vulnerability, category, threat, likely incident, CIA aims affected and a short justification.',
          instruction: 'Use the course vulnerability categories: Software; Hardware; Configuration; Human behaviour.',
          marks: 1,
          required: true,
          displayOrder: 1,
          minimumCharacters: 60,
          maximumCharacters: 2000,
          minimumSelections: 0,
          maximumSelections: 0,
          options: []
        }
      ]
    },
    {
      sectionId: 'W2NBA-SC-2',
      sectionType: 'assessment',
      title: 'Unlocked server room',
      displayOrder: 3,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2NBA-SCB-2',
          blockType: 'information',
          heading: 'Scenario',
          content: 'A cleaner props open the server room door overnight so they can move equipment. No one notices until the morning.',
          displayOrder: 1
        },
        {
          blockId: 'W2NBA-TIP-2',
          blockType: 'tip',
          heading: 'Answer structure',
          content: 'State the vulnerability and category, name the threat, describe the likely incident, tick the CIA aims, then justify the chain in two or three sentences.',
          displayOrder: 2
        }
      ],
      questions: [
        {
          questionId: 'NBA-2',
          questionType: 'extended-response',
          prompt: 'Analyse this Northbank scenario. Identify the asset, vulnerability, category, threat, likely incident, CIA aims affected and a short justification.',
          instruction: 'Use the course vulnerability categories: Software; Hardware; Configuration; Human behaviour.',
          marks: 1,
          required: true,
          displayOrder: 1,
          minimumCharacters: 60,
          maximumCharacters: 2000,
          minimumSelections: 0,
          maximumSelections: 0,
          options: []
        }
      ]
    },
    {
      sectionId: 'W2NBA-SC-3',
      sectionType: 'assessment',
      title: 'Overly permissive firewall',
      displayOrder: 4,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2NBA-SCB-3',
          blockType: 'information',
          heading: 'Scenario',
          content: 'Northbank\'s firewall allows remote desktop (RDP) connections from any IP address on the internet. IT staff set this up for home working but never restricted it.',
          displayOrder: 1
        },
        {
          blockId: 'W2NBA-TIP-3',
          blockType: 'tip',
          heading: 'Answer structure',
          content: 'State the vulnerability and category, name the threat, describe the likely incident, tick the CIA aims, then justify the chain in two or three sentences.',
          displayOrder: 2
        }
      ],
      questions: [
        {
          questionId: 'NBA-3',
          questionType: 'extended-response',
          prompt: 'Analyse this Northbank scenario. Identify the asset, vulnerability, category, threat, likely incident, CIA aims affected and a short justification.',
          instruction: 'Use the course vulnerability categories: Software; Hardware; Configuration; Human behaviour.',
          marks: 1,
          required: true,
          displayOrder: 1,
          minimumCharacters: 60,
          maximumCharacters: 2000,
          minimumSelections: 0,
          maximumSelections: 0,
          options: []
        }
      ]
    },
    {
      sectionId: 'W2NBA-SC-4',
      sectionType: 'assessment',
      title: 'Phishing email at reception',
      displayOrder: 5,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2NBA-SCB-4',
          blockType: 'information',
          heading: 'Scenario',
          content: 'Reception staff receive an email claiming to be from payroll, asking them to click a link and confirm login details. Several staff members do so without checking the sender.',
          displayOrder: 1
        },
        {
          blockId: 'W2NBA-TIP-4',
          blockType: 'tip',
          heading: 'Answer structure',
          content: 'State the vulnerability and category, name the threat, describe the likely incident, tick the CIA aims, then justify the chain in two or three sentences.',
          displayOrder: 2
        }
      ],
      questions: [
        {
          questionId: 'NBA-4',
          questionType: 'extended-response',
          prompt: 'Analyse this Northbank scenario. Identify the asset, vulnerability, category, threat, likely incident, CIA aims affected and a short justification.',
          instruction: 'Use the course vulnerability categories: Software; Hardware; Configuration; Human behaviour.',
          marks: 1,
          required: true,
          displayOrder: 1,
          minimumCharacters: 60,
          maximumCharacters: 2000,
          minimumSelections: 0,
          maximumSelections: 0,
          options: []
        }
      ]
    },
    {
      sectionId: 'W2NBA-SC-5',
      sectionType: 'assessment',
      title: 'Shared admin password',
      displayOrder: 6,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2NBA-SCB-5',
          blockType: 'information',
          heading: 'Scenario',
          content: 'The reception PC uses a single shared administrator password that every shift worker knows. It has not been changed in over a year.',
          displayOrder: 1
        },
        {
          blockId: 'W2NBA-TIP-5',
          blockType: 'tip',
          heading: 'Answer structure',
          content: 'State the vulnerability and category, name the threat, describe the likely incident, tick the CIA aims, then justify the chain in two or three sentences.',
          displayOrder: 2
        }
      ],
      questions: [
        {
          questionId: 'NBA-5',
          questionType: 'extended-response',
          prompt: 'Analyse this Northbank scenario. Identify the asset, vulnerability, category, threat, likely incident, CIA aims affected and a short justification.',
          instruction: 'Use the course vulnerability categories: Software; Hardware; Configuration; Human behaviour.',
          marks: 1,
          required: true,
          displayOrder: 1,
          minimumCharacters: 60,
          maximumCharacters: 2000,
          minimumSelections: 0,
          maximumSelections: 0,
          options: []
        }
      ]
    }
  ],
  assessment: {
    'NBA-1': {
      autoMark: false,
      scoringMode: 'completion',
      acceptedAnswers: {
        vulnerability: [
          'unpatched software',
          'missing patch',
          'out-of-date software',
          'outdated software',
          'not updated',
          'unpatched portal'
        ],
        category: 'Software',
        threat: [
          'malware',
          'ransomware',
          'attacker',
          'cyber criminal',
          'hacker',
          'exploit'
        ],
        likelyIncident: [
          'unauthorised access',
          'data breach',
          'malware infection',
          'system compromise',
          'ransomware',
          'encryption'
        ],
        ciaAims: [
          'Confidentiality',
          'Availability'
        ],
        justification: 'Unpatched software is a software vulnerability. Malware or an attacker can exploit the known flaw, leading to compromise of patient data (confidentiality) or disrupted access (availability).'
      },
      explanation: 'Compare your chain with the accepted answer data.',
      commonErrors: [],
      tutorNotes: '',
      oneMarkCompletionRule: 'Award 1 completion mark when a structured response is provided for the scenario.'
    },
    'NBA-2': {
      autoMark: false,
      scoringMode: 'completion',
      acceptedAnswers: {
        vulnerability: [
          'unlocked door',
          'door propped open',
          'physical access',
          'unsecured server room',
          'open server room'
        ],
        category: 'Hardware',
        threat: [
          'malicious insider',
          'insider',
          'intruder',
          'thief',
          'unauthorised person',
          'attacker'
        ],
        likelyIncident: [
          'unauthorised access',
          'theft',
          'tampering',
          'hardware theft',
          'data theft',
          'physical access'
        ],
        ciaAims: [
          'Confidentiality',
          'Integrity'
        ],
        justification: 'Physical access to hardware without protection is a hardware vulnerability. An insider or intruder could access or tamper with equipment, affecting confidentiality and integrity of stored data.'
      },
      explanation: 'Compare your chain with the accepted answer data.',
      commonErrors: [],
      tutorNotes: '',
      oneMarkCompletionRule: 'Award 1 completion mark when a structured response is provided for the scenario.'
    },
    'NBA-3': {
      autoMark: false,
      scoringMode: 'completion',
      acceptedAnswers: {
        vulnerability: [
          'firewall rule',
          'misconfigured firewall',
          'open rdp',
          'permissive rule',
          'misconfiguration',
          'unnecessary inbound'
        ],
        category: 'Configuration',
        threat: [
          'brute force',
          'attacker',
          'cyber criminal',
          'hacker',
          'automated attack',
          'credential stuffing'
        ],
        likelyIncident: [
          'unauthorised login',
          'unauthorised access',
          'account compromise',
          'remote access',
          'system compromise'
        ],
        ciaAims: [
          'Confidentiality'
        ],
        justification: 'Allowing unnecessary inbound RDP is a configuration vulnerability. Attackers can attempt brute-force logins, gaining unauthorised access and threatening confidentiality of patient records.'
      },
      explanation: 'Compare your chain with the accepted answer data.',
      commonErrors: [],
      tutorNotes: '',
      oneMarkCompletionRule: 'Award 1 completion mark when a structured response is provided for the scenario.'
    },
    'NBA-4': {
      autoMark: false,
      scoringMode: 'completion',
      acceptedAnswers: {
        vulnerability: [
          'trust phishing',
          'click link',
          'no verification',
          'human error',
          'trust email',
          'staff trust',
          'phishing susceptibility'
        ],
        category: 'Human behaviour',
        threat: [
          'phisher',
          'phishing',
          'social engineer',
          'scammer',
          'attacker',
          'fake email'
        ],
        likelyIncident: [
          'credential theft',
          'stolen credentials',
          'account compromise',
          'unauthorised access',
          'login stolen'
        ],
        ciaAims: [
          'Confidentiality'
        ],
        justification: 'Trusting a fake email without verification is a human behaviour vulnerability. The phisher exploits this to steal credentials, leading to unauthorised access and loss of confidentiality.'
      },
      explanation: 'Compare your chain with the accepted answer data.',
      commonErrors: [],
      tutorNotes: '',
      oneMarkCompletionRule: 'Award 1 completion mark when a structured response is provided for the scenario.'
    },
    'NBA-5': {
      autoMark: false,
      scoringMode: 'completion',
      acceptedAnswers: {
        vulnerability: [
          'shared password',
          'weak password',
          'shared admin',
          'known password',
          'password not changed'
        ],
        category: 'Human behaviour',
        threat: [
          'malicious insider',
          'insider',
          'former employee',
          'attacker',
          'unauthorised user'
        ],
        likelyIncident: [
          'unauthorised changes',
          'unauthorised access',
          'data alteration',
          'account misuse',
          'integrity breach'
        ],
        ciaAims: [
          'Integrity',
          'Confidentiality'
        ],
        justification: 'A shared, unchanged admin password is a human/process vulnerability. Anyone with the password — including a malicious insider — could alter records (integrity) or access sensitive data (confidentiality).'
      },
      explanation: 'Compare your chain with the accepted answer data.',
      commonErrors: [],
      tutorNotes: '',
      oneMarkCompletionRule: 'Award 1 completion mark when a structured response is provided for the scenario.'
    }
  },
  tutorData: {
    categories: [
      'Software',
      'Hardware',
      'Configuration',
      'Human behaviour'
    ],
    ciaOptions: [
      'Confidentiality',
      'Integrity',
      'Availability'
    ],
    scenarios: [
      {
        id: 'nba-1',
        title: 'Unpatched patient portal',
        text: 'Northbank\'s patient appointment portal runs software that has not been updated for six months. A vendor patch fixing a serious flaw was released but never installed.',
        answers: {
          vulnerability: [
            'unpatched software',
            'missing patch',
            'out-of-date software',
            'outdated software',
            'not updated',
            'unpatched portal'
          ],
          category: 'Software',
          threat: [
            'malware',
            'ransomware',
            'attacker',
            'cyber criminal',
            'hacker',
            'exploit'
          ],
          likelyIncident: [
            'unauthorised access',
            'data breach',
            'malware infection',
            'system compromise',
            'ransomware',
            'encryption'
          ],
          ciaAims: [
            'Confidentiality',
            'Availability'
          ],
          justification: 'Unpatched software is a software vulnerability. Malware or an attacker can exploit the known flaw, leading to compromise of patient data (confidentiality) or disrupted access (availability).'
        }
      },
      {
        id: 'nba-2',
        title: 'Unlocked server room',
        text: 'A cleaner props open the server room door overnight so they can move equipment. No one notices until the morning.',
        answers: {
          vulnerability: [
            'unlocked door',
            'door propped open',
            'physical access',
            'unsecured server room',
            'open server room'
          ],
          category: 'Hardware',
          threat: [
            'malicious insider',
            'insider',
            'intruder',
            'thief',
            'unauthorised person',
            'attacker'
          ],
          likelyIncident: [
            'unauthorised access',
            'theft',
            'tampering',
            'hardware theft',
            'data theft',
            'physical access'
          ],
          ciaAims: [
            'Confidentiality',
            'Integrity'
          ],
          justification: 'Physical access to hardware without protection is a hardware vulnerability. An insider or intruder could access or tamper with equipment, affecting confidentiality and integrity of stored data.'
        }
      },
      {
        id: 'nba-3',
        title: 'Overly permissive firewall',
        text: 'Northbank\'s firewall allows remote desktop (RDP) connections from any IP address on the internet. IT staff set this up for home working but never restricted it.',
        answers: {
          vulnerability: [
            'firewall rule',
            'misconfigured firewall',
            'open rdp',
            'permissive rule',
            'misconfiguration',
            'unnecessary inbound'
          ],
          category: 'Configuration',
          threat: [
            'brute force',
            'attacker',
            'cyber criminal',
            'hacker',
            'automated attack',
            'credential stuffing'
          ],
          likelyIncident: [
            'unauthorised login',
            'unauthorised access',
            'account compromise',
            'remote access',
            'system compromise'
          ],
          ciaAims: [
            'Confidentiality'
          ],
          justification: 'Allowing unnecessary inbound RDP is a configuration vulnerability. Attackers can attempt brute-force logins, gaining unauthorised access and threatening confidentiality of patient records.'
        }
      },
      {
        id: 'nba-4',
        title: 'Phishing email at reception',
        text: 'Reception staff receive an email claiming to be from payroll, asking them to click a link and confirm login details. Several staff members do so without checking the sender.',
        answers: {
          vulnerability: [
            'trust phishing',
            'click link',
            'no verification',
            'human error',
            'trust email',
            'staff trust',
            'phishing susceptibility'
          ],
          category: 'Human behaviour',
          threat: [
            'phisher',
            'phishing',
            'social engineer',
            'scammer',
            'attacker',
            'fake email'
          ],
          likelyIncident: [
            'credential theft',
            'stolen credentials',
            'account compromise',
            'unauthorised access',
            'login stolen'
          ],
          ciaAims: [
            'Confidentiality'
          ],
          justification: 'Trusting a fake email without verification is a human behaviour vulnerability. The phisher exploits this to steal credentials, leading to unauthorised access and loss of confidentiality.'
        }
      },
      {
        id: 'nba-5',
        title: 'Shared admin password',
        text: 'The reception PC uses a single shared administrator password that every shift worker knows. It has not been changed in over a year.',
        answers: {
          vulnerability: [
            'shared password',
            'weak password',
            'shared admin',
            'known password',
            'password not changed'
          ],
          category: 'Human behaviour',
          threat: [
            'malicious insider',
            'insider',
            'former employee',
            'attacker',
            'unauthorised user'
          ],
          likelyIncident: [
            'unauthorised changes',
            'unauthorised access',
            'data alteration',
            'account misuse',
            'integrity breach'
          ],
          ciaAims: [
            'Integrity',
            'Confidentiality'
          ],
          justification: 'A shared, unchanged admin password is a human/process vulnerability. Anyone with the password — including a malicious insider — could alter records (integrity) or access sensitive data (confidentiality).'
        }
      }
    ],
    frontendNote: 'Existing Week 2 page uses a structured multi-field form. Activity API engine currently renders each scenario as an extended-response completion item; the dedicated scenario-analysis component remains the preferred learner UI.'
  }
});
