/**
 * Week 4 activity pack.
 */

var WEEK4_PACK_ANSWER_IMPROVEMENT = Object.freeze({
  "meta": {
    "activityId": "week4-answer-improvement",
    "activityName": "Marking and Answer Improvement",
    "weekNumber": 4,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Self marking",
    "activityVersion": "1.0",
    "maximumScore": 6,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "self-marking",
    "introduction": "Mark and improve an extended response that lists facts without connecting motivation, target and method.",
    "completionMessage": "Keep your rewrite and improvement action for later retrieval."
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
          "heading": "Question",
          "content": {
            "marks": 8,
            "commandWord": "Analyse",
            "prompt": "Northbank clinic booking systems are encrypted and a cryptocurrency payment is demanded. No political message is published. Analyse why this organisation was targeted, connecting motivation, target and method with evidence from the scenario."
          },
          "displayOrder": 1
        },
        {
          "blockId": "AISAMPLE",
          "blockType": "information",
          "heading": "Sample response",
          "content": {
            "id": "sample-weak",
            "label": "Sample extended response to mark",
            "text": "The motivation could be income generation. The target could be organisations. The method could be system compromise. Booking systems were encrypted. A payment was demanded. Large hospitals are also attacked sometimes. Phishing might be involved."
          },
          "displayOrder": 2
        },
        {
          "blockId": "AISCHEME",
          "blockType": "information",
          "heading": "Mark-scheme points",
          "content": "A valid motivation was named; The target was identified; The method was identified; Evidence from the scenario was used; A connection was made between motivation, target and method; The final connection was explicit rather than implied; The response sustained one case (did not switch examples)",
          "displayOrder": 3
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Improvement tasks",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "AI1",
          "questionType": "reflection",
          "prompt": "Identify one descriptive statement in the sample response that lists facts without connection.",
          "instruction": "Dominant error to target: A list of separate facts about motivation and target with no sentence connecting them.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 15,
          "maximumCharacters": 1500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "AI2",
          "questionType": "reflection",
          "prompt": "State whether motivation, target and method are connected in the sample response.",
          "instruction": "Dominant error to target: A list of separate facts about motivation and target with no sentence connecting them.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 15,
          "maximumCharacters": 1500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "AI3",
          "questionType": "reflection",
          "prompt": "Rewrite one descriptive sentence so it analyses the connection (because / which means that / as a result / therefore — used meaningfully).",
          "instruction": "Dominant error to target: A list of separate facts about motivation and target with no sentence connecting them.",
          "marks": 2,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 15,
          "maximumCharacters": 1500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "AI4",
          "questionType": "reflection",
          "prompt": "Record one specific action you will take to improve your next extended response.",
          "instruction": "Dominant error to target: A list of separate facts about motivation and target with no sentence connecting them.",
          "marks": 2,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 15,
          "maximumCharacters": 1500,
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
      "explanation": "Guidance only — not a definitive OCR examination mark.",
      "indicativeResponse": "",
      "markScheme": []
    },
    "AI2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Guidance only — not a definitive OCR examination mark.",
      "indicativeResponse": "",
      "markScheme": []
    },
    "AI3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Guidance only — not a definitive OCR examination mark.",
      "indicativeResponse": "Income generation is the most likely motivation because a cryptocurrency payment is demanded without a political message, which means that Northbank’s organisational booking systems were a logical target for system compromise so that recovery pressure would support payment.",
      "markScheme": []
    },
    "AI4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Guidance only — not a definitive OCR examination mark.",
      "indicativeResponse": "",
      "markScheme": []
    }
  },
  "tutorData": {
    "dominantIssues": [
      "Motivation, target and method are listed separately with no connecting sentence.",
      "The final connection remains implied.",
      "The response switches towards large hospitals and phishing, leaving the main case incomplete."
    ],
    "modelImprovedSentence": "Income generation is the most likely motivation because a cryptocurrency payment is demanded without a political message, which means that Northbank’s organisational booking systems were a logical target for system compromise so that recovery pressure would support payment.",
    "commonError": "A list of separate facts about motivation and target with no sentence connecting them."
  }
});
