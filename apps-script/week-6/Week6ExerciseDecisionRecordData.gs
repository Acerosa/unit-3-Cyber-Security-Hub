/**
 * Week 6 activity pack.
 */

var WEEK6_PACK_EXERCISE_DECISION_RECORD = Object.freeze({
  "meta": {
    "activityId": "week6-exercise-decision-record",
    "activityName": "Exercise Decision Record",
    "weekNumber": 6,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Reflection",
    "activityVersion": "1.0",
    "maximumScore": 5,
    "allowsPartner": true,
    "enabled": true,
    "componentId": "reflection",
    "introduction": "Record decisions made during the tutor-facilitated NCSC Exercise in a Box session. Do not invent exercise prompts or outcomes. Capture what your group actually discussed.",
    "completionMessage": "You may revise entries after the debrief. Update ethical, legal and operational notes as your tutor clarifies the scenario."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Decision record guidance",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "EDG",
          "blockType": "information",
          "heading": "Insider threat resulting in a data breach",
          "content": "Northbank Community Health Partnership. Record what your group actually discussed. Decision types: Legal obligation, Ethical choice, Operational judgement, Combination.",
          "displayOrder": 1
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Record your decisions",
      "displayOrder": 2,
      "feedbackTiming": "none",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "ED1",
          "questionType": "extended-response",
          "prompt": "Decision 1 title and summary: what was decided or proposed?",
          "instruction": "Record decisions made during the tutor-facilitated NCSC Exercise in a Box session. Do not invent exercise prompts or outcomes. Capture what your group actually discussed.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 25,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "ED2",
          "questionType": "extended-response",
          "prompt": "Decision 1: reason, stakeholder affected, and decision type.",
          "instruction": "Record decisions made during the tutor-facilitated NCSC Exercise in a Box session. Do not invent exercise prompts or outcomes. Capture what your group actually discussed.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 30,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "ED3",
          "questionType": "extended-response",
          "prompt": "Decision 1: ethical, legal (name law and duty) and operational considerations.",
          "instruction": "Record decisions made during the tutor-facilitated NCSC Exercise in a Box session. Do not invent exercise prompts or outcomes. Capture what your group actually discussed.",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "ED4",
          "questionType": "extended-response",
          "prompt": "Decision 2 title and summary: what was decided or proposed?",
          "instruction": "Record decisions made during the tutor-facilitated NCSC Exercise in a Box session. Do not invent exercise prompts or outcomes. Capture what your group actually discussed.",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 25,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "ED5",
          "questionType": "extended-response",
          "prompt": "Decision 2: reason, evidence still needed, and reflection after debrief.",
          "instruction": "Record decisions made during the tutor-facilitated NCSC Exercise in a Box session. Do not invent exercise prompts or outcomes. Capture what your group actually discussed.",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 30,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        }
      ]
    }
  ],
  "assessment": {
    "ED1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Decision record entry recorded."
    },
    "ED2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Decision record entry recorded."
    },
    "ED3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Decision record entry recorded."
    },
    "ED4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Decision record entry recorded."
    },
    "ED5": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Decision record entry recorded."
    }
  },
  "tutorData": {
    "entryFields": [
      "title",
      "decision",
      "reason",
      "stakeholder",
      "ethical",
      "legal",
      "operational",
      "type",
      "evidenceNeeded",
      "reflection"
    ],
    "decisionTypes": [
      "Legal obligation",
      "Ethical choice",
      "Operational judgement",
      "Combination"
    ],
    "minDecisions": 2,
    "tutorReviewFlags": [
      "legal-plain-language-only"
    ]
  }
});
