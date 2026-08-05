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
    introduction: 'Complete the authorised TryHackMe Vulnerabilities 101 room during the lesson, then answer two short reflections. Opening the room alone does not complete the activity. Do not attempt unauthorised scanning or testing outside the approved environment.',
    completionMessage: 'Your reflections are recorded as supporting completion evidence. TryHackMe completion is checked by the tutor. A tutor may review the quality of your explanations.'
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
          content: 'Learn what vulnerabilities are, explore different vulnerability categories and see how vulnerability information is recorded and assessed in the cyber security industry. Then connect one idea to Northbank Community Health Partnership.',
          displayOrder: 1
        },
        {
          blockId: 'W2V101-B2',
          blockType: 'information',
          heading: 'Room details',
          content: 'Room title: TryHackMe Practical: Vulnerabilities 101\nExternal URL: https://tryhackme.com/room/vulnerabilities101\nDelivery: Complete during the lesson (Session 1)\nEstimated time: Approximately 25 to 35 minutes\nOCR focus: 2.2 Vulnerabilities that can be exploited\nAvailability: tutor-check-required unless the tutor updates status\nFallback activity: week2-northbank-vulnerability-analysis',
          displayOrder: 2
        },
        {
          blockId: 'W2V101-B3',
          blockType: 'warning',
          heading: 'Safety and authorisation',
          content: 'Only carry out practical actions inside the TryHackMe environment provided for the room. Do not scan, test, attack, download malware to or experiment on college systems, personal devices, websites or networks. Do not download or run suspicious or malicious files directly on a college or personal computer.\n\nRoom access and availability must be confirmed by the tutor before the lesson. Learners should not purchase a subscription to complete a college activity unless the college has explicitly authorised it.',
          displayOrder: 3
        },
        {
          blockId: 'W2V101-B4',
          blockType: 'tip',
          heading: 'OCR terminology reminder',
          content: 'A threat exploits a vulnerability to cause a cyber security incident. TryHackMe may introduce industry terminology and vulnerability-scoring systems that go beyond the OCR specification. Learn from this context, but use precise OCR terminology when answering Unit 3 examination questions.',
          displayOrder: 4
        },
        {
          blockId: 'W2V101-B4B',
          blockType: 'information',
          heading: 'While completing the room',
          content: 'Pay particular attention to: what makes something a vulnerability; different types or categories of vulnerability; how vulnerabilities are identified; how vulnerability databases are used; how severity or risk information is communicated; and the difference between discovering a weakness and exploiting it.\n\nRecord learning concepts in the Week 2 application. Do not copy TryHackMe answer strings, flags or walkthrough answers into the Unit 3 application.',
          displayOrder: 5
        },
        {
          blockId: 'W2V101-B4C',
          blockType: 'checklist',
          heading: 'Completion requirements',
          content: 'Complete the required TryHackMe tasks.\nReturn to the Week 2 application.\nComplete both reflection prompts.\nSubmit the two-point reflection activity.\nCheck that the submission response confirms it was recorded.\nOpening the TryHackMe link alone must not be treated as completion.',
          displayOrder: 6
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
    deliveryMode: 'in-class',
    estimatedTimeMinutes: 30,
    availabilityStatus: 'tutor-check-required',
    fallbackActivityId: 'week2-northbank-vulnerability-analysis',
    relatedDirectedStudyResourceId: 'week2-malware-introductory-directed-study',
    relatedDirectedStudyUrl: 'https://tryhackme.com/room/malmalintroductory',
    completionCriteria: [
      'TryHackMe room tasks completed (tutor checks platform evidence)',
      'Both reflection fields completed',
      'One vulnerability identified with explanation',
      'Northbank application explained',
      'Two-point reflection submission recorded'
    ],
    indicativeResponses: {
      'W2V101-Q01': 'Example: an unpatched service is a vulnerability because it is a weakness that an attacker can exploit to gain access or disrupt the system.',
      'W2V101-Q02': 'Example: if Northbank left a reception system unpatched, malware or an attacker could exploit that weakness and affect patient confidentiality or appointment availability.'
    }
  }
});
