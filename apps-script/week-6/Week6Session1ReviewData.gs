/**
 * Week 6 activity pack.
 */

var WEEK6_PACK_SESSION1_REVIEW = Object.freeze({
  "meta": {
    "activityId": "week6-session1-review",
    "activityName": "Session 1 Review",
    "weekNumber": 6,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Retrieval quiz",
    "activityVersion": "1.0",
    "maximumScore": 3,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "quiz",
    "introduction": "Review Session 1 by distinguishing what the law required, what was ethically appropriate and what was operationally practical during the insider threat exercise and related activities.",
    "completionMessage": "Keep legal, ethical and operational dimensions separate in examination answers."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Session 1 review",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "SR1",
          "blockType": "information",
          "heading": "Review focus",
          "content": "Review Session 1 by distinguishing what the law required, what was ethically appropriate and what was operationally practical during the insider threat exercise and related activities.",
          "displayOrder": 1
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Review questions",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "R1",
          "questionType": "single-choice",
          "prompt": "Northbank must assess and respond to a personal data breach under current United Kingdom data protection legislation. This decision is best classified as:",
          "instruction": "Distinguish legal obligation, ethical choice and operational judgement.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "Legal obligation"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Ethical choice only"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Operational judgement only"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Neither legal nor operational"
            }
          ]
        },
        {
          "questionId": "R2",
          "questionType": "single-choice",
          "prompt": "Choosing to warn staff about monitoring in a transparent, proportionate way after an insider incident is mainly:",
          "instruction": "Distinguish legal obligation, ethical choice and operational judgement.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "An ethical and operational choice about trust and proportionality"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "A replacement for data protection legislation"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Unlawful in all circumstances"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Defined by Cyber Streetwise as a statute"
            }
          ]
        },
        {
          "questionId": "R3",
          "questionType": "single-choice",
          "prompt": "Delaying clinic access while Northbank resets compromised accounts reflects which dimension most directly?",
          "instruction": "Distinguish legal obligation, ethical choice and operational judgement.",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "Operational practicality and service impact"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Nation-state motivation"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Cyber Essentials certification status"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Responsible disclosure to a vendor"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "R1": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Statutory data protection duties create legal obligations. Ethics and operations may shape how Northbank meets them, but the duty itself is legal.",
      "feedbackCorrect": "Correct. Statutory data protection duties create legal obligations. Ethics and operations may shape how Northbank meets them, but the duty itself is legal.",
      "feedbackIncorrect": "Statutory data protection duties create legal obligations. Ethics and operations may shape how Northbank meets them, but the duty itself is legal.",
      "misconceptionFeedback": "Statutory data protection duties create legal obligations. Ethics and operations may shape how Northbank meets them, but the duty itself is legal."
    },
    "R2": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Transparent communication supports ethical practice and operational acceptance. It does not replace legal duties.",
      "feedbackCorrect": "Correct. Transparent communication supports ethical practice and operational acceptance. It does not replace legal duties.",
      "feedbackIncorrect": "Transparent communication supports ethical practice and operational acceptance. It does not replace legal duties.",
      "misconceptionFeedback": "Transparent communication supports ethical practice and operational acceptance. It does not replace legal duties."
    },
    "R3": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Service delay and staff workflow effects are operational considerations, even when the underlying trigger may involve legal or ethical issues.",
      "feedbackCorrect": "Correct. Service delay and staff workflow effects are operational considerations, even when the underlying trigger may involve legal or ethical issues.",
      "feedbackIncorrect": "Service delay and staff workflow effects are operational considerations, even when the underlying trigger may involve legal or ethical issues.",
      "misconceptionFeedback": "Service delay and staff workflow effects are operational considerations, even when the underlying trigger may involve legal or ethical issues."
    }
  },
  "tutorData": {}
});
