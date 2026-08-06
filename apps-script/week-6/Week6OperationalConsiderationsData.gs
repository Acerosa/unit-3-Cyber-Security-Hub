/**
 * Week 6 activity pack.
 */

var WEEK6_PACK_OPERATIONAL_CONSIDERATIONS = Object.freeze({
  "meta": {
    "activityId": "week6-operational-considerations",
    "activityName": "Operational Considerations",
    "weekNumber": 6,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Scenario mapping",
    "activityVersion": "1.0",
    "maximumScore": 7,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "scenario-mapping",
    "introduction": "Operational considerations ask whether a security control is practical to run day to day. A control that is legally allowed and ethically desirable may still fail if staff cannot use it effectively.",
    "completionMessage": "A control that is legally allowed may still fail if staff cannot use it effectively."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Operational factors",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "OCP",
          "blockType": "scenario",
          "heading": "Northbank scenario",
          "content": "Northbank is considering mandatory hardware security keys for all remote access to patient systems after an insider threat exercise.",
          "displayOrder": 1
        },
        {
          "blockId": "OCF_financial",
          "blockType": "information",
          "heading": "Financial cost",
          "content": "Direct spending on licences, hardware, consultants and ongoing subscriptions.",
          "displayOrder": 2
        },
        {
          "blockId": "OCF_staffTime",
          "blockType": "information",
          "heading": "Staff time",
          "content": "Hours spent configuring, monitoring, approving access and responding to alerts.",
          "displayOrder": 3
        },
        {
          "blockId": "OCF_downtime",
          "blockType": "information",
          "heading": "System downtime",
          "content": "Planned or unplanned outages while patching, testing or recovering systems.",
          "displayOrder": 4
        },
        {
          "blockId": "OCF_usability",
          "blockType": "information",
          "heading": "Usability",
          "content": "Whether staff can follow the control without excessive friction or confusion.",
          "displayOrder": 5
        },
        {
          "blockId": "OCF_productivity",
          "blockType": "information",
          "heading": "Lost productivity",
          "content": "Work slowed or deferred because security steps add delay or complexity.",
          "displayOrder": 6
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Operational analysis",
      "displayOrder": 2,
      "feedbackTiming": "none",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "OC1",
          "questionType": "short-response",
          "prompt": "Financial cost: what would Northbank pay or save? Northbank is considering mandatory hardware security keys for all remote access to patient systems after an insider threat exercise.",
          "instruction": "Operational considerations for Northbank.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 20,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "OC2",
          "questionType": "short-response",
          "prompt": "Staff time: who spends time and on what? Northbank is considering mandatory hardware security keys for all remote access to patient systems after an insider threat exercise.",
          "instruction": "Operational considerations for Northbank.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 20,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "OC3",
          "questionType": "short-response",
          "prompt": "System downtime: when might services be unavailable? Northbank is considering mandatory hardware security keys for all remote access to patient systems after an insider threat exercise.",
          "instruction": "Operational considerations for Northbank.",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 20,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "OC4",
          "questionType": "short-response",
          "prompt": "Usability: how easy is the control for clinic and remote staff? Northbank is considering mandatory hardware security keys for all remote access to patient systems after an insider threat exercise.",
          "instruction": "Operational considerations for Northbank.",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 20,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "OC5",
          "questionType": "short-response",
          "prompt": "Lost productivity: where might work slow down? Northbank is considering mandatory hardware security keys for all remote access to patient systems after an insider threat exercise.",
          "instruction": "Operational considerations for Northbank.",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 20,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "OC6",
          "questionType": "short-response",
          "prompt": "Which operational cost most encourages unsafe workarounds? Northbank is considering mandatory hardware security keys for all remote access to patient systems after an insider threat exercise.",
          "instruction": "Operational considerations for Northbank.",
          "marks": 1,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 20,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "OC7",
          "questionType": "short-response",
          "prompt": "Is the measure proportionate for Northbank? Justify briefly. Northbank is considering mandatory hardware security keys for all remote access to patient systems after an insider threat exercise.",
          "instruction": "Operational considerations for Northbank.",
          "marks": 1,
          "required": true,
          "displayOrder": 7,
          "minimumCharacters": 20,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        }
      ]
    }
  ],
  "assessment": {
    "OC1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Operational response recorded for review."
    },
    "OC2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Operational response recorded for review."
    },
    "OC3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Operational response recorded for review."
    },
    "OC4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Operational response recorded for review."
    },
    "OC5": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Operational response recorded for review."
    },
    "OC6": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Operational response recorded for review."
    },
    "OC7": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Operational response recorded for review."
    }
  },
  "tutorData": {
    "factors": [
      "financial",
      "staffTime",
      "downtime",
      "usability",
      "productivity"
    ]
  }
});
