/**
 * Week 2 TryHackMe Vulnerabilities 101 reflection pack.
 */

var WEEK2_PACK_VULNERABILITIES_101 = Object.freeze({
  meta: {
    activityId: 'week2-vulnerabilities101-reflection',
    activityName: 'TryHackMe: Vulnerabilities 101',
    weekNumber: 2,
    sessionNumber: 1,
    sessionName: 'Session 1',
    activityType: 'Reflection',
    activityVersion: '1.0',
    maximumScore: 2,
    allowsPartner: false,
    enabled: true,
    componentId: 'external-room-reflection',
    introduction: 'Complete the authorised TryHackMe Vulnerabilities 101 room, then answer two short reflections. Do not attempt unauthorised scanning or testing outside the approved environment.',
    completionMessage: 'Your reflections are recorded as completion evidence. A tutor may review the quality of your explanations.'
  },
  sections: [
    {
      sectionId: 'W2V101-INTRO',
      sectionType: 'learning',
      title: 'Room instructions',
      displayOrder: 1,
      feedbackTiming: 'none',
      contentBlocks: [
        {
          blockId: 'W2V101-B1',
          blockType: 'information',
          heading: 'Purpose',
          content: 'Use the TryHackMe Vulnerabilities 101 room to see practical examples of weaknesses, then connect the ideas to Northbank Community Health Partnership.',
          displayOrder: 1
        },
        {
          blockId: 'W2V101-B2',
          blockType: 'information',
          heading: 'Room details',
          content: 'Room title: Vulnerabilities 101\nExternal URL: https://tryhackme.com/room/vulnerabilities101\nEstimated time: 45–60 minutes',
          displayOrder: 2
        },
        {
          blockId: 'W2V101-B3',
          blockType: 'warning',
          heading: 'Safety and authorisation',
          content: 'Only use systems and rooms you are authorised to access. Do not scan, exploit or test Northbank systems or any real organisation without written permission.',
          displayOrder: 3
        },
        {
          blockId: 'W2V101-B4',
          blockType: 'tip',
          heading: 'OCR terminology reminder',
          content: 'In your reflections, use the course terms threat, vulnerability, incident and impact accurately.',
          displayOrder: 4
        }
      ],
      questions: []
    },
    {
      sectionId: 'W2V101-REFLECTIONS',
      sectionType: 'assessment',
      title: 'Reflection prompts',
      displayOrder: 2,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2V101-B5',
          blockType: 'checklist',
          heading: 'Completion criteria',
          content: 'Complete both reflections with enough detail to show understanding.\nName at least one vulnerability.\nLink one idea to Northbank.',
          displayOrder: 1
        }
      ],
      questions: [
        {
          questionId: 'W2V101-Q01',
          questionType: 'reflection',
          prompt: 'Identify one vulnerability introduced in the room and explain what makes it a weakness.',
          instruction: 'Write in full sentences. Do not only paste a definition.',
          marks: 1,
          required: true,
          displayOrder: 1,
          minimumCharacters: 40,
          maximumCharacters: 1200,
          minimumSelections: 0,
          maximumSelections: 0,
          options: []
        },
        {
          questionId: 'W2V101-Q02',
          questionType: 'reflection',
          prompt: 'Explain how a similar vulnerability could affect Northbank.',
          instruction: 'Refer to a Northbank asset, process, staff role or patient-data risk.',
          marks: 1,
          required: true,
          displayOrder: 2,
          minimumCharacters: 40,
          maximumCharacters: 1200,
          minimumSelections: 0,
          maximumSelections: 0,
          options: []
        }
      ]
    }
  ],
  assessment: {
    'W2V101-Q01': {
      autoMark: false,
      scoringMode: 'completion',
      explanation: 'A complete response names a vulnerability from the room and explains why it is a weakness.',
      indicativeResponse: 'Example: an unpatched service is a vulnerability because it is a weakness that an attacker can exploit to gain access or disrupt the system.'
    },
    'W2V101-Q02': {
      autoMark: false,
      scoringMode: 'completion',
      explanation: 'A complete response links a similar weakness to a Northbank asset, process or person.',
      indicativeResponse: 'Example: if Northbank left a reception system unpatched, malware or an attacker could exploit that weakness and affect patient confidentiality or appointment availability.'
    }
  },
  tutorData: {
    roomTitle: 'Vulnerabilities 101',
    externalUrl: 'https://tryhackme.com/room/vulnerabilities101',
    estimatedTimeMinutes: 60,
    completionCriteria: [
      'Both reflection fields completed',
      'One vulnerability identified with explanation',
      'Northbank application explained'
    ],
    indicativeResponses: {
      'W2V101-Q01': 'Example: an unpatched service is a vulnerability because it is a weakness that an attacker can exploit to gain access or disrupt the system.',
      'W2V101-Q02': 'Example: if Northbank left a reception system unpatched, malware or an attacker could exploit that weakness and affect patient confidentiality or appointment availability.'
    }
  }
});
