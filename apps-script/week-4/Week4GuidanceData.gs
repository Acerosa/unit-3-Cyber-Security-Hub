/**
 * Week 4 non-scored guidance: TryHackMe, directed study, support and challenge.
 */

var WEEK4_GUIDANCE_DATA = Object.freeze({
  "weekTitle": "Motivations and Targets",
  "learningOutcomes": [
    "Identify and explain the range of motivations that drive cyber attackers.",
    "Describe the four categories of target: people, organisations, equipment, information.",
    "Explain the methods used during attacks on those categories.",
    "Analyse how attacker motivation influences the target selected and the method used."
  ],
  "examinationFocus": [
    "Answer with a motivation when motivation is asked",
    "Distinguish motivation from method",
    "Recognise analyse as requiring stated connections",
    "Use meaningful analytical connectives",
    "Sustain one case throughout an extended response",
    "Complete the final analytical connection",
    "Manage time on higher-tariff questions"
  ],
  "tryHackMe": {
    "accessNotice": "Room access and availability must be confirmed by the tutor before the lesson. Learners should not purchase a subscription to complete a college activity unless the college has explicitly authorised it.",
    "ethicalNotice": [
      "Use only the authorised TryHackMe environment and tutor-approved searches.",
      "Do not scan, probe, test or interact with unauthorised systems.",
      "Passive reconnaissance should remain read-only.",
      "Do not attempt to gain access to any system.",
      "Do not collect passwords, authentication tokens, secrets or personal data.",
      "Follow tutor instructions and college acceptable-use requirements.",
      "The college network must already have been confirmed as permitting the Shodan.io searches used in the room."
    ],
    "resources": [
      {
        "resourceId": "week4-passive-recon",
        "roomId": "passiverecon",
        "title": "TryHackMe Practical: Passive Reconnaissance",
        "shortTitle": "Passive Reconnaissance",
        "url": "https://tryhackme.com/room/passiverecon",
        "deliveryMode": "in-class",
        "deliveryLabel": "In-class practical — complete first",
        "scored": false,
        "path": "passive-recon/",
        "sequence": 1,
        "purpose": "Practise read-only lookups that reveal information without touching the target, then connect findings to possible attacker motivations.",
        "ocrFocus": "2.3 / 2.4 — how exposure can influence target selection",
        "timeLabel": "Approximately 30 to 45 minutes",
        "availabilityStatus": "tutor-check-required",
        "focusPoints": [
          "Complete Passive Reconnaissance before Shodan.io",
          "Record what each technique reveals without touching the target",
          "Connect each finding to a possible attacker motivation",
          "Treat rooms as examples of how an attacker may choose a target"
        ],
        "checklist": [
          "I completed Passive Reconnaissance before starting Shodan.io.",
          "I recorded techniques and principles rather than collecting sensitive findings.",
          "I linked at least one finding to a possible motivation (why).",
          "I stayed within authorised TryHackMe tasks only."
        ]
      },
      {
        "resourceId": "week4-shodan",
        "roomId": "shodan",
        "title": "TryHackMe Practical: Shodan.io",
        "shortTitle": "Shodan.io",
        "url": "https://tryhackme.com/room/shodan",
        "deliveryMode": "in-class",
        "deliveryLabel": "In-class practical — when ready",
        "scored": false,
        "path": "passive-recon/",
        "sequence": 2,
        "purpose": "Use tutor-approved Shodan searches in the authorised room to see how publicly visible services can make a target opportunistic.",
        "ocrFocus": "2.4 Targets — exposure and opportunity",
        "timeLabel": "Approximately 25 to 40 minutes",
        "availabilityStatus": "tutor-check-required",
        "pairedWorkingGuidance": "If Passive Reconnaissance felt slow, your tutor may allow paired working on Shodan.io. Paired work is optional and depends on classroom arrangements.",
        "focusPoints": [
          "Move to Shodan.io only when ready",
          "Use tutor-approved searches only",
          "Remain read-only; do not attempt access",
          "Link visible exposure to why a target might be chosen"
        ],
        "checklist": [
          "I used only tutor-approved Shodan searches in the authorised room.",
          "I did not probe or interact with unauthorised systems.",
          "I recorded what visibility could mean for target selection.",
          "I can explain that exposure may drive opportunity rather than a personal grudge."
        ]
      },
      {
        "resourceId": "week4-google-dorking",
        "roomId": "googledorking",
        "title": "TryHackMe Directed Study: Google Dorking",
        "shortTitle": "Google Dorking",
        "url": "https://tryhackme.com/room/googledorking",
        "deliveryMode": "directed-independent-study",
        "deliveryLabel": "Directed independent study",
        "scored": false,
        "path": "directed-study/",
        "purpose": "Record three search techniques that could reveal information an organisation did not intend to publish — without collecting sensitive findings.",
        "ocrFocus": "Passive exposure principles for Week 4 directed study",
        "timeLabel": "Allow up to 45 minutes depending on access",
        "availabilityStatus": "tutor-check-required",
        "safetyNotices": [
          "Authorised learning environments only.",
          "No probing or interaction with unauthorised targets.",
          "Do not search for personal data, passwords, secrets or authentication material.",
          "Use tutor-approved examples.",
          "Record techniques and principles rather than collecting sensitive findings."
        ]
      }
    ]
  },
  "directedStudy": {
    "resourceId": "week4-directed-study",
    "scored": false,
    "title": "Directed independent study",
    "cisco": {
      "platform": "Cisco Networking Academy",
      "course": "Introduction to Cybersecurity",
      "accessNote": "Use the Cisco access route already provided by your tutor or college classroom link. Direct public URLs are not hard-coded here.",
      "topics": [
        {
          "id": "1.5",
          "label": "Module 1, topic 1.5 Cyberwarfare"
        },
        {
          "id": "2.4",
          "label": "Module 2, topic 2.4 The Cybersecurity Landscape"
        }
      ],
      "tasks": [
        "Complete both topics, including the quizzes.",
        "Note how state motivation differs from criminal motivation.",
        "Keep short revision notes for Week 5 retrieval."
      ]
    },
    "tryhackmeRoomId": "googledorking",
    "tryhackmeTasks": [
      "Complete the Google Dorking room in the authorised TryHackMe environment.",
      "Record three search techniques that could reveal information an organisation did not intend to publish.",
      "Record techniques and principles rather than collecting sensitive findings."
    ],
    "safety": [
      "Authorised learning environments only.",
      "No probing or interaction with unauthorised targets.",
      "Do not search for personal data, passwords, secrets or authentication material.",
      "Use tutor-approved examples.",
      "Record techniques and principles rather than collecting sensitive findings."
    ],
    "writtenAnalysis": {
      "title": "Written analysis (approximately 400 words)",
      "instructions": [
        "Select a cyber attack reported in the last two years.",
        "Write approximately 400 words.",
        "Identify the attacker.",
        "Identify the motivation.",
        "Identify the target.",
        "Identify the methods used.",
        "Explain how the four connect.",
        "Reference the sources used."
      ],
      "planningFields": [
        "Incident title and approximate date",
        "Attacker (as reported)",
        "Motivation (why)",
        "Target (what)",
        "Methods (how)",
        "Connection explanation (how the four link)",
        "Source 1",
        "Source 2",
        "Limitations of the sources"
      ],
      "checklist": [
        "Motivation is not answered with a method",
        "Target category language is used where appropriate",
        "Connection is explicit",
        "One case is sustained",
        "Sources are referenced"
      ],
      "submissionNote": "The approximately 400-word analysis is collected in Week 5 and used as retrieval material. This page stores local planning notes only and does not auto-mark factual claims about the chosen incident."
    },
    "evidenceRequirements": [
      "Cisco topic completion and quiz completion are visible on the instructor dashboard.",
      "TryHackMe room completion is visible on the classroom dashboard.",
      "The approximately 400-word analysis is collected in Week 5 and used as retrieval material."
    ]
  },
  "supportChallenge": {
    "resourceId": "week4-support-challenge",
    "scored": false,
    "title": "Support, challenge and accessibility",
    "mappingSupport": {
      "title": "Mapping support",
      "points": [
        "Use the mapping grid with two worked rows before independent scenarios.",
        "Use the bank of motivation words rather than inventing unsupported labels.",
        "Keep column labels visible: motivation (why), target (what), method (how).",
        "Ask: why did they act, what was targeted, how was it done?"
      ]
    },
    "writingSupport": {
      "title": "Writing support",
      "frame": [
        "… because …",
        "… which means that …",
        "As a result …",
        "Therefore …"
      ],
      "note": "The frame supports analysis without replacing your thinking. The connection must still be logical."
    },
    "practicalSupport": {
      "title": "Practical support",
      "points": [
        "If Passive Reconnaissance felt slow, ask your tutor about paired working for Shodan.io.",
        "Paired work is not compulsory; classroom arrangements may differ."
      ]
    },
    "readability": {
      "title": "Readability and accessibility",
      "points": [
        "Follow concise instructions and visible section headings.",
        "Use progressive disclosure where panels are collapsed.",
        "Feedback is given in text, not by colour alone.",
        "Keyboard operation is supported; mapping is not drag-only.",
        "Choose a planning template that suits you: writing frame, table or mind map notes."
      ]
    },
    "responseFormats": [
      "Verbal explanation",
      "Slides",
      "Annotated diagram"
    ],
    "challenges": [
      {
        "id": "challenge-1",
        "title": "Challenge 1 — Health-sector threat ranking",
        "prompt": "Evaluate which motivation poses the most serious long-term threat to the health sector and justify the ranking."
      },
      {
        "id": "challenge-2",
        "title": "Challenge 2 — Commercially organised cyber crime",
        "prompt": "Explain how the balance of motivations has shifted as cyber crime has become commercially organised, using evidence rather than impression. You may need to research reputable sources. Do not treat unsupported historical claims as accepted answers."
      },
      {
        "id": "challenge-3",
        "title": "Challenge 3 — Fictional exposure report",
        "prompt": "Using passive-reconnaissance principles, create a short exposure report for a fictional organisation you design. Then state which motivation the findings would most attract. Keep the activity fictional and passive. Do not investigate a real organisation."
      }
    ]
  },
  "safety": {
    "authorisedEnvironmentsOnly": true,
    "noUnauthorisedScanning": true,
    "noCredentialCollection": true,
    "passiveReadOnly": true
  }
});
