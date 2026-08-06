/**
 * Week 5 activity pack.
 */

var WEEK5_PACK_ANSWER_IMPROVEMENT = Object.freeze({
  "meta": {
    "activityId": "week5-answer-improvement",
    "activityName": "Marking and Answer Improvement",
    "weekNumber": 5,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Self marking",
    "activityVersion": "1.0",
    "maximumScore": 6,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "self-marking",
    "introduction": "Mark a response that over-emphasises financial loss, then improve it with safety, stakeholder, evidence and timescale detail.",
    "completionMessage": "Dominant Week 5 error: covering loss thoroughly while ignoring disruption and safety."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Sample response",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "AIQ",
          "blockType": "information",
          "heading": "Question (Analyse, 6 marks)",
          "content": "Analyse the impacts of a ransomware incident on Northbank Community Health Partnership and its patients.",
          "displayOrder": 1
        },
        {
          "blockId": "AIS",
          "blockType": "example",
          "heading": "Sample response",
          "content": "Northbank would lose money because it must pay for recovery and overtime. It might also lose reputation if people hear about the attack. Patients might worry. Money is the main impact.",
          "displayOrder": 2
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Mark and improve",
      "displayOrder": 2,
      "feedbackTiming": "none",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "AI1",
          "questionType": "short-response",
          "prompt": "Against the practice marking criteria, which points does the sample already meet, and which are missing? Check loss, disruption and safety coverage.",
          "instruction": "Write a clear response using scenario evidence.",
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
          "questionId": "AI2",
          "questionType": "short-response",
          "prompt": "Add a missing safety impact and name the stakeholder affected.",
          "instruction": "Write a clear response using scenario evidence.",
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
          "questionId": "AI3",
          "questionType": "short-response",
          "prompt": "Add evidence or reasoning from the scenario.",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 15,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "AI4",
          "questionType": "short-response",
          "prompt": "Add a timescale where relevant (immediate and/or longer term).",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 8,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "AI5",
          "questionType": "extended-response",
          "prompt": "Improve one weak analytical connection so the answer analyses rather than lists.",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 30,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "AI6",
          "questionType": "extended-response",
          "prompt": "Write the improved analytical paragraph.",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        }
      ]
    }
  ],
  "assessment": {
    "AI1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Self-assessment response recorded."
    },
    "AI2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Self-assessment response recorded."
    },
    "AI3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Self-assessment response recorded."
    },
    "AI4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Self-assessment response recorded."
    },
    "AI5": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Self-assessment response recorded."
    },
    "AI6": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Self-assessment response recorded."
    }
  },
  "tutorData": {
    "commonError": "Covering loss thoroughly — especially financial loss — while ignoring disruption and safety.",
    "markSchemePoints": [
      "Names organisation and/or patient stakeholders",
      "Develops a loss impact with evidence",
      "Develops a disruption impact with evidence",
      "Develops a safety impact with evidence",
      "Makes analytical connections rather than a list",
      "Includes immediate and longer-term consequences"
    ],
    "improvementChecklist": [
      "Missing safety impact added",
      "Stakeholder named",
      "Evidence or reasoning added",
      "Timescale added",
      "Weak connection improved"
    ]
  }
});
