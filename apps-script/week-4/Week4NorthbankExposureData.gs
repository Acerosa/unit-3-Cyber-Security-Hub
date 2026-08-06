/**
 * Week 4 activity pack.
 */

var WEEK4_PACK_NORTHBANK_EXPOSURE = Object.freeze({
  "meta": {
    "activityId": "week4-northbank-exposure",
    "activityName": "Northbank Passive-Exposure Reflection",
    "weekNumber": 4,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Reflection",
    "activityVersion": "1.0",
    "maximumScore": 3,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "reflection",
    "introduction": "Reflect on what passive reconnaissance might expose about Northbank Community Health Partnership using only the established briefing.",
    "completionMessage": "Record three exposures, link each to a possible motivation, and note what cannot be established."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Northbank briefing boundaries",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "NBINTRO",
          "blockType": "information",
          "heading": "Northbank Community Health Partnership",
          "content": "Northbank is a fictional teaching organisation used across Unit 3. Do not treat it as a real health provider and do not perform passive reconnaissance against any real organisation. Established facts: Northbank is a healthcare organisation with clinics.; It has a patient appointment portal.; It has a public website.; Reception staff handle email and visitor-facing tasks.; Finance processes invoices and payments.; There is a server room and clinic computing equipment (including laptops).; Remote access arrangements (such as RDP for home working) have been discussed in earlier weeks.; There is a supplier / booking portal context in earlier week scenarios.; Patient records and contact lists are sensitive information holdings discussed in earlier weeks. Not available: If a detail is not available in the Northbank briefing or earlier week materials, write “not available in the briefing” rather than inventing systems, employees, suppliers, vulnerabilities or services.",
          "displayOrder": 1
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Passive-exposure reflection",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "NB1",
          "questionType": "reflection",
          "prompt": "Exposure item 1",
          "instruction": "Use only established Northbank facts. Do not investigate a real organisation.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 30,
          "maximumCharacters": 1200,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "NB2",
          "questionType": "reflection",
          "prompt": "Exposure item 2",
          "instruction": "Use only established Northbank facts. Do not investigate a real organisation.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 30,
          "maximumCharacters": 1200,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "NB3",
          "questionType": "reflection",
          "prompt": "Exposure item 3",
          "instruction": "Use only established Northbank facts. Do not investigate a real organisation.",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 30,
          "maximumCharacters": 1200,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        }
      ]
    }
  ],
  "assessment": {
    "NB1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Self-assessment and teacher review. Target selection may be driven by exposure and opportunity.",
      "indicativeResponse": "",
      "markScheme": []
    },
    "NB2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Self-assessment and teacher review. Target selection may be driven by exposure and opportunity.",
      "indicativeResponse": "",
      "markScheme": []
    },
    "NB3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Self-assessment and teacher review. Target selection may be driven by exposure and opportunity.",
      "indicativeResponse": "",
      "markScheme": []
    }
  },
  "tutorData": {
    "establishedFacts": [
      "Northbank is a healthcare organisation with clinics.",
      "It has a patient appointment portal.",
      "It has a public website.",
      "Reception staff handle email and visitor-facing tasks.",
      "Finance processes invoices and payments.",
      "There is a server room and clinic computing equipment (including laptops).",
      "Remote access arrangements (such as RDP for home working) have been discussed in earlier weeks.",
      "There is a supplier / booking portal context in earlier week scenarios.",
      "Patient records and contact lists are sensitive information holdings discussed in earlier weeks."
    ],
    "motivationBank": [
      "Espionage",
      "Righting perceived wrongs",
      "Public good",
      "Publicity",
      "Thrill",
      "Fraud",
      "Score settling",
      "Income generation"
    ],
    "conclusion": "Target selection may be driven by exposure and opportunity rather than by a personal grudge against the victim."
  }
});
