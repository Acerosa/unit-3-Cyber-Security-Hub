/**
 * Week 5 activity pack.
 */

var WEEK5_PACK_EXERCISE_DEBRIEF = Object.freeze({
  "meta": {
    "activityId": "week5-exercise-debrief",
    "activityName": "Exercise Debrief",
    "weekNumber": 5,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Reflection",
    "activityVersion": "1.0",
    "maximumScore": 4,
    "allowsPartner": true,
    "enabled": true,
    "componentId": "reflection",
    "introduction": "Revisit recorded decisions. This debrief is about impacts and stakeholders, not formal incident-response stage teaching.",
    "completionMessage": "Cyber security is a global issue affecting individuals, organisations and states."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Debrief focus",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "DB1",
          "blockType": "information",
          "heading": "Global issue",
          "content": "Use your Northbank decisions to show how one incident can reach individuals, organisations and states.",
          "displayOrder": 1
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Debrief responses",
      "displayOrder": 2,
      "feedbackTiming": "none",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "DB1",
          "questionType": "extended-response",
          "prompt": "Which impact was each key decision intended to reduce?",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 20,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "DB2",
          "questionType": "extended-response",
          "prompt": "Which stakeholder benefited from each key decision?",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 20,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "DB3",
          "questionType": "extended-response",
          "prompt": "Was the intended effect immediate or longer term? Explain for at least one decision.",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 20,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "DB4",
          "questionType": "extended-response",
          "prompt": "Could another stakeholder have been negatively affected by the same decision? Explain. Also note whether the impact would differ for an individual, organisation or state.",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 20,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        }
      ]
    }
  ],
  "assessment": {
    "DB1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debrief response recorded for review."
    },
    "DB2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debrief response recorded for review."
    },
    "DB3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debrief response recorded for review."
    },
    "DB4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debrief response recorded for review."
    }
  },
  "tutorData": {
    "sentenceStarters": [
      "Immediately after the incident…",
      "This would affect the stakeholder because…",
      "Six months later…",
      "The scenario states that…, which means…",
      "This is a safety impact because…"
    ]
  }
});
