/**
 * Week 2 TryHackMe practical resources and learner guidance.
 * Tutor: confirm room access before each lesson; update availabilityStatus as needed.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  var ACCESS_NOTICE =
    'Room access and availability must be confirmed by the tutor before the lesson. Learners should not purchase a subscription to complete a college activity unless the college has explicitly authorised it.';

  var CENTRAL_MODEL =
    'A threat exploits a vulnerability to cause a cyber security incident.';

  var HOW_TO_USE_STEPS = Object.freeze([
    Object.freeze({
      title: 'Sign in',
      body:
        'Sign in using the account approved by your tutor. Check that you are using the correct TryHackMe account so that your progress is recorded against the correct learner. Where the class uses a TryHackMe classroom or assignment, make sure you have joined the tutor’s classroom or accepted the assigned room before beginning.'
    }),
    Object.freeze({
      title: 'Open the room',
      body:
        'Select Open TryHackMe room. The room will open in a new tab. Keep the Unit 3 Week 2 application open so that you can return to record your notes and reflection.'
    }),
    Object.freeze({
      title: 'Work through tasks in order',
      body:
        'A TryHackMe room is divided into tasks. Read each task carefully and complete it before moving to the next one. Some tasks contain teaching material, some contain questions and some may include a practical environment.'
    }),
    Object.freeze({
      title: 'Read before answering',
      body:
        'Do not skip directly to the questions. The explanation provided in each task contains the knowledge needed to answer accurately.'
    }),
    Object.freeze({
      title: 'Use the AttackBox only when required',
      body:
        'Some rooms may ask you to start an AttackBox or another virtual machine. The AttackBox is a controlled browser-based computer containing cyber security tools. Only start a machine when the room instructions or tutor tell you to do so. Wait for the machine to finish loading before continuing.'
    }),
    Object.freeze({
      title: 'Complete work only in the authorised environment',
      body:
        'Only carry out practical actions inside the TryHackMe environment provided for the room. Do not scan, test, attack, download malware to or experiment on college systems, personal devices, websites or networks. Do not download or run suspicious or malicious files directly on a college or personal computer. Use only the controlled environment specifically provided by TryHackMe and follow the tutor’s instructions.'
    }),
    Object.freeze({
      title: 'Record learning, not TryHackMe answers',
      body:
        'Record the concepts you learned in the Week 2 application. Do not copy TryHackMe answer strings, flags or walkthrough answers into the Unit 3 application.'
    }),
    Object.freeze({
      title: 'Confirm completion',
      body:
        'At the end of the room, check that TryHackMe shows your tasks or room as complete. Return to the Week 2 application and complete the required reflection or notes.'
    }),
    Object.freeze({
      title: 'Ask for help appropriately',
      body:
        'If you cannot access the room, cannot start the environment or do not understand an instruction, stop and ask the tutor. Do not attempt to bypass account, network or platform restrictions.'
    })
  ]);

  var TROUBLESHOOTING = Object.freeze([
    Object.freeze({
      title: 'The room asks me to sign in',
      body:
        'Sign in using the account approved by the tutor. Check that you have not opened TryHackMe using a different personal account.'
    }),
    Object.freeze({
      title: 'I cannot access the room',
      body:
        'Return to the Week 2 page and tell the tutor. Do not purchase access or create another account unless instructed.'
    }),
    Object.freeze({
      title: 'The AttackBox is not loading',
      body:
        'Wait for the loading process to finish. If it remains unavailable, stop the environment if the platform permits, refresh the room once and then ask the tutor. Do not restart the environment repeatedly in quick succession.'
    }),
    Object.freeze({
      title: 'The task asks for a machine',
      body:
        'Start only the machine named in the task instructions. Do not connect to an unrelated IP address or system.'
    }),
    Object.freeze({
      title: 'My progress is not showing',
      body:
        'Check that you are signed in to the correct account and that the task answer was submitted successfully in TryHackMe.'
    }),
    Object.freeze({
      title: 'I do not understand a question',
      body:
        'Re-read the current task and review the glossary. Ask the tutor for a hint rather than searching for a copied walkthrough answer.'
    }),
    Object.freeze({
      title: 'The room appears to require payment',
      body:
        'Stop and tell the tutor. Do not enter payment details. The tutor will confirm whether an alternative activity is required.'
    })
  ]);

  var PREPARATION_CHECKLIST = Object.freeze([
    Object.freeze({
      id: 'signed-in',
      label: 'I am signed in to the correct TryHackMe account.'
    }),
    Object.freeze({
      id: 'classroom',
      label: 'I have joined the tutor’s classroom or assignment where required.'
    }),
    Object.freeze({
      id: 'purpose',
      label: 'I have read the activity purpose.'
    }),
    Object.freeze({
      id: 'notes',
      label: 'I know which notes I need to collect.'
    }),
    Object.freeze({
      id: 'safety',
      label:
        'I understand that practical actions must stay inside the authorised TryHackMe environment.'
    })
  ]);

  var TUTOR_NOTES = Object.freeze([
    'Confirm both room URLs before the lesson.',
    'Confirm learner accounts can access TryHackMe.',
    'Confirm any classroom or assignment has been issued.',
    'Test the room from a learner account.',
    'Confirm whether the room requires an AttackBox or attached machine.',
    'Confirm the college network permits required access.',
    'Prepare an in-app fallback activity.',
    'Do not tell learners to purchase individual access.',
    'Use the TryHackMe dashboard as evidence where available.',
    'Use the existing Week 2 reflection submission as supporting evidence for Vulnerabilities 101.',
    'Remind learners that OCR terminology takes priority in examination answers.'
  ]);

  global.Unit3Week2TryHackMeData = Object.freeze({
    accessNotice: ACCESS_NOTICE,
    centralModel: CENTRAL_MODEL,
    howToUseSteps: HOW_TO_USE_STEPS,
    troubleshooting: TROUBLESHOOTING,
    preparationChecklist: PREPARATION_CHECKLIST,
    tutorNotes: TUTOR_NOTES,
    checklistStorageKey: 'unit3-week2-tryhackme-preparation-checklist',
    progressStorageKey: 'unit3-week2-tryhackme-progress',
    resources: Object.freeze([
      Object.freeze({
        resourceId: 'week2-vulnerabilities101-practical',
        roomId: 'vulnerabilities101',
        linkedActivityId: 'week2-vulnerabilities101-reflection',
        resourceType: 'external-practical',
        provider: 'TryHackMe',
        title: 'TryHackMe Practical: Vulnerabilities 101',
        shortTitle: 'Vulnerabilities 101',
        url: 'https://tryhackme.com/room/vulnerabilities101',
        deliveryMode: 'in-class',
        deliveryLabel: 'In-class practical',
        scored: true,
        weekNumber: 2,
        sessionNumber: 1,
        estimatedMinutes: 30,
        timeLabel: 'Approximately 25 to 35 minutes',
        ocrFocus: '2.2 Vulnerabilities that can be exploited',
        purpose:
          'Learn what vulnerabilities are, explore different vulnerability categories and see how vulnerability information is recorded and assessed in the cyber security industry.',
        availabilityStatus: 'tutor-check-required',
        checkedAt: '',
        fallbackActivityId: 'week2-northbank-vulnerability-analysis',
        fallbackPath: 'northbank-analysis/',
        path: 'vulnerabilities101/',
        notesStorageKey: 'unit3-week2-vulnerabilities101-notes',
        notePrompts: Object.freeze([
          'Name one vulnerability introduced in the room.',
          'Explain why it is a weakness.',
          'Name a threat that could exploit it.',
          'Describe the incident that could result.',
          'Identify the confidentiality, integrity or availability aim that could be affected.',
          'Explain how a similar vulnerability could apply to Northbank.'
        ]),
        whileCompleting: Object.freeze([
          'What makes something a vulnerability',
          'Different types or categories of vulnerability',
          'How vulnerabilities are identified',
          'How vulnerability databases are used',
          'How severity or risk information is communicated',
          'The difference between discovering a weakness and exploiting it'
        ]),
        ocrGuidance:
          'TryHackMe may introduce industry terminology and vulnerability-scoring systems that go beyond the OCR specification. Learn from this context, but use precise OCR terminology when answering Unit 3 examination questions.',
        safetyNotices: Object.freeze([
          'Only carry out practical actions inside the TryHackMe environment provided for the room. Do not scan, test, attack, download malware to or experiment on college systems, personal devices, websites or networks.',
          'Do not download or run suspicious or malicious files directly on a college or personal computer.'
        ])
      }),
      Object.freeze({
        resourceId: 'week2-malware-introductory-directed-study',
        roomId: 'malmalintroductory',
        linkedActivityId: null,
        resourceType: 'external-practical',
        provider: 'TryHackMe',
        title: 'TryHackMe Directed Study: MAL: Malware Introductory',
        shortTitle: 'MAL: Malware Introductory',
        url: 'https://tryhackme.com/room/malmalintroductory',
        deliveryMode: 'directed-independent-study',
        deliveryLabel: 'Directed independent study',
        scored: false,
        weekNumber: 2,
        sessionNumber: null,
        estimatedMinutes: 45,
        timeLabel: 'Allow up to 45 minutes, depending on learner progress and room access.',
        ocrFocus:
          'Threats to cyber security, malware categories, delivery methods and observable symptoms',
        purpose:
          'Explore introductory malware-analysis concepts and recognise how the behaviour of malware helps analysts classify it.',
        learningPurpose:
          'This room provides an introduction to malware analysis and helps you connect malware behaviour with malware classification.',
        availabilityStatus: 'tutor-check-required',
        checkedAt: '',
        fallbackActivityId: 'week2-malware-symptoms',
        fallbackPath: 'malware-symptoms/',
        notesStorageKey: 'unit3-week2-malware-introductory-notes',
        path: 'malware-introductory/',
        notePrompts: Object.freeze([
          'Malware category or example',
          'What the malware attempts to do',
          'How the malware might be delivered',
          'What a user might notice',
          'What an organisation might notice',
          'Which CIA aim or aims could be affected',
          'One limitation of identifying malware from symptoms alone'
        ]),
        tableColumns: Object.freeze([
          'Malware or technique',
          'Behaviour',
          'Possible delivery',
          'Observable symptom'
        ]),
        tableRowCount: 4,
        safetyNotices: Object.freeze([
          'Do not download, open or execute malware samples on your own computer. Complete only the safe tasks and controlled practical steps provided in the TryHackMe room.'
        ])
      })
    ])
  });
})(window);
