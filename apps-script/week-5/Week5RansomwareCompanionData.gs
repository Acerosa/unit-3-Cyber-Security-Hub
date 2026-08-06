/**
 * Week 5 activity pack.
 */

var WEEK5_PACK_RANSOMWARE_COMPANION = Object.freeze({
  "meta": {
    "activityId": "week5-ransomware-companion",
    "activityName": "Northbank Ransomware Exercise Companion",
    "weekNumber": 5,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Reflection",
    "activityVersion": "1.0",
    "maximumScore": 4,
    "allowsPartner": true,
    "enabled": true,
    "componentId": "facilitated-companion",
    "introduction": "Companion workspace for the tutor-facilitated NCSC Exercise in a Box ransomware exercise. This API does not reproduce staged NCSC prompts.",
    "completionMessage": "Opening the NCSC page alone does not complete this activity."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "NCSC Exercise in a Box introduction",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "NCSC1",
          "blockType": "information",
          "heading": "Exercise in a Box",
          "content": "Exercise in a Box is produced by the National Cyber Security Centre and is designed for organisations to test their readiness. Named Week 5 exercise: Responding to a ransomware attack.",
          "displayOrder": 1
        },
        {
          "blockId": "NCSC2",
          "blockType": "information",
          "heading": "Official URL",
          "content": "https://www.ncsc.gov.uk/section/exercise-in-a-box/responding-ransomware-attack",
          "displayOrder": 2
        },
        {
          "blockId": "NCSC3",
          "blockType": "information",
          "heading": "Classroom rules",
          "content": "Role-play Northbank Community Health Partnership. Answer from your allocated role. Base decisions on the Northbank briefing. Do not invent controls, staff, systems or capabilities. Staged prompts remain on official NCSC materials and are tutor-facilitated.",
          "displayOrder": 3
        },
        {
          "blockId": "ROLE1",
          "blockType": "information",
          "heading": "Role cards",
          "content": "Roles: Practice manager; IT support contractor; Records officer; Communications lead. Each role has three prompt questions. Do not invent systems or controls.",
          "displayOrder": 4
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Role preparation and decision record",
      "displayOrder": 2,
      "feedbackTiming": "none",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "RC1",
          "questionType": "single-choice",
          "prompt": "Select your allocated Northbank role:",
          "instruction": "Select the role assigned by your tutor.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "practice-manager",
              "displayOrder": 1,
              "text": "Practice manager"
            },
            {
              "optionId": "it-support",
              "displayOrder": 2,
              "text": "IT support contractor"
            },
            {
              "optionId": "records-officer",
              "displayOrder": 3,
              "text": "Records officer"
            },
            {
              "optionId": "communications-lead",
              "displayOrder": 4,
              "text": "Communications lead"
            }
          ]
        },
        {
          "questionId": "RC2",
          "questionType": "short-response",
          "prompt": "State one decision this role may be responsible for during a ransomware incident (do not invent systems absent from the briefing).",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 8,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "RC3",
          "questionType": "extended-response",
          "prompt": "Decision record 1: decision, reason, stakeholder/service protected, impact category (loss/disruption/safety/multiple), and immediate or longer-term focus.",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 40,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "RC4",
          "questionType": "extended-response",
          "prompt": "Decision record 2: decision, reason, stakeholder/service protected, impact category, timescale, and any trade-off or disadvantage.",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 40,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "RC5",
          "questionType": "short-response",
          "prompt": "Confirm that these decisions were recorded as part of the tutor-facilitated Exercise in a Box discussion (write YES and a short confirmation).",
          "instruction": "Opening the NCSC page alone is not enough.",
          "marks": 0,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 3,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        }
      ]
    }
  ],
  "assessment": {
    "RC1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Role selection recorded."
    },
    "RC2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Role decision recorded. Not auto-marked as universally correct."
    },
    "RC3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Decision 1 stored without fake automatic OCR marks."
    },
    "RC4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Decision 2 stored without fake automatic OCR marks."
    },
    "RC5": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Facilitated confirmation recorded."
    }
  },
  "tutorData": {
    "ncsc": {
      "title": "Responding to a ransomware attack",
      "url": "https://www.ncsc.gov.uk/section/exercise-in-a-box/responding-ransomware-attack",
      "overviewUrl": "https://www.ncsc.gov.uk/section/exercise-in-a-box/overview"
    },
    "roles": [
      {
        "id": "practice-manager",
        "title": "Practice manager",
        "responsibility": "Overall service continuity and prioritisation for Northbank Community Health Partnership.",
        "prompts": [
          "Which patient-facing services must be prioritised if systems stay down?",
          "Who needs clear instruction first: reception, clinicians or partners?",
          "Which impact are you trying to reduce for patients and for the organisation?"
        ]
      },
      {
        "id": "it-support",
        "title": "IT support contractor",
        "responsibility": "Technical advice on protecting remaining systems and restoring safe access within briefing capabilities — without inventing advanced tooling.",
        "prompts": [
          "What must be protected first: data integrity, remaining available systems, or recovery paths?",
          "What information do other roles need before they decide?",
          "Which loss or disruption impacts could worsen if systems are brought back too quickly?"
        ]
      },
      {
        "id": "records-officer",
        "title": "Records officer",
        "responsibility": "Care and confidentiality of patient and organisational records.",
        "prompts": [
          "Which records are needed for safe care today?",
          "How do you prevent further loss of confidentiality while services continue manually?",
          "What evidence would show integrity problems in records?"
        ]
      },
      {
        "id": "communications-lead",
        "title": "Communications lead",
        "responsibility": "Internal and external messaging so patients, staff and partners receive accurate information.",
        "prompts": [
          "Which stakeholders need information first?",
          "How do you reduce reputational loss without claiming facts you do not have?",
          "What message would protect patient safety without creating panic?"
        ]
      }
    ],
    "impactCategories": [
      "Loss",
      "Disruption",
      "Safety",
      "Multiple categories"
    ],
    "note": "Do not copy or invent NCSC staged prompts."
  }
});
