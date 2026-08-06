/**
 * Week 5 activity pack.
 */

var WEEK5_PACK_IMPACT_CLASSIFICATION = Object.freeze({
  "meta": {
    "activityId": "week5-impact-classification",
    "activityName": "Loss, Disruption and Safety Classification",
    "weekNumber": 5,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Classification",
    "activityVersion": "1.0",
    "maximumScore": 8,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "classification",
    "introduction": "Classify impact statements. Categories are not always mutually exclusive.",
    "completionMessage": "Ambiguous answers need a short stakeholder-based reason."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Classification guidance",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "CL1",
          "blockType": "information",
          "heading": "Categories",
          "content": "Classify as Loss, Disruption, Safety, or More than one category where justified. For ambiguous items, name the stakeholder perspective in your reason.",
          "displayOrder": 1
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Classify the statements",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "C1",
          "questionType": "single-choice",
          "prompt": "Northbank pays emergency contractor fees to rebuild encrypted servers.",
          "instruction": "Select a category. For ambiguous examples, also prepare a short reason naming the stakeholder.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "loss",
              "displayOrder": 1,
              "text": "Loss"
            },
            {
              "optionId": "disruption",
              "displayOrder": 2,
              "text": "Disruption"
            },
            {
              "optionId": "safety",
              "displayOrder": 3,
              "text": "Safety"
            },
            {
              "optionId": "multi",
              "displayOrder": 4,
              "text": "More than one category"
            }
          ]
        },
        {
          "questionId": "C2",
          "questionType": "single-choice",
          "prompt": "Clinic booking services are unavailable for two working days, so reception cannot confirm visits.",
          "instruction": "Select a category. For ambiguous examples, also prepare a short reason naming the stakeholder.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "loss",
              "displayOrder": 1,
              "text": "Loss"
            },
            {
              "optionId": "disruption",
              "displayOrder": 2,
              "text": "Disruption"
            },
            {
              "optionId": "safety",
              "displayOrder": 3,
              "text": "Safety"
            },
            {
              "optionId": "multi",
              "displayOrder": 4,
              "text": "More than one category"
            }
          ]
        },
        {
          "questionId": "C3",
          "questionType": "single-choice",
          "prompt": "A patient\u2019s urgent review is cancelled because Northbank cannot access records; the delay increases clinical risk for that patient.",
          "instruction": "Select a category. For ambiguous examples, also prepare a short reason naming the stakeholder.",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "loss",
              "displayOrder": 1,
              "text": "Loss"
            },
            {
              "optionId": "disruption",
              "displayOrder": 2,
              "text": "Disruption"
            },
            {
              "optionId": "safety",
              "displayOrder": 3,
              "text": "Safety"
            },
            {
              "optionId": "multi",
              "displayOrder": 4,
              "text": "More than one category"
            }
          ]
        },
        {
          "questionId": "C4",
          "questionType": "single-choice",
          "prompt": "Stolen patient identity details are later used to open fraudulent accounts.",
          "instruction": "Select a category. For ambiguous examples, also prepare a short reason naming the stakeholder.",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "loss",
              "displayOrder": 1,
              "text": "Loss"
            },
            {
              "optionId": "disruption",
              "displayOrder": 2,
              "text": "Disruption"
            },
            {
              "optionId": "safety",
              "displayOrder": 3,
              "text": "Safety"
            },
            {
              "optionId": "multi",
              "displayOrder": 4,
              "text": "More than one category"
            }
          ]
        },
        {
          "questionId": "C5",
          "questionType": "single-choice",
          "prompt": "Local news coverage leaves patients unsure whether Northbank can be trusted with medical information for months afterwards.",
          "instruction": "Select a category. For ambiguous examples, also prepare a short reason naming the stakeholder.",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "loss",
              "displayOrder": 1,
              "text": "Loss"
            },
            {
              "optionId": "disruption",
              "displayOrder": 2,
              "text": "Disruption"
            },
            {
              "optionId": "safety",
              "displayOrder": 3,
              "text": "Safety"
            },
            {
              "optionId": "multi",
              "displayOrder": 4,
              "text": "More than one category"
            }
          ]
        },
        {
          "questionId": "C6",
          "questionType": "single-choice",
          "prompt": "Interference with a traffic-control system causes unpredictable signal behaviour on major routes used by ambulances.",
          "instruction": "Select a category. For ambiguous examples, also prepare a short reason naming the stakeholder.",
          "marks": 1,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "loss",
              "displayOrder": 1,
              "text": "Loss"
            },
            {
              "optionId": "disruption",
              "displayOrder": 2,
              "text": "Disruption"
            },
            {
              "optionId": "safety",
              "displayOrder": 3,
              "text": "Safety"
            },
            {
              "optionId": "multi",
              "displayOrder": 4,
              "text": "More than one category"
            }
          ]
        },
        {
          "questionId": "C7",
          "questionType": "single-choice",
          "prompt": "A healthcare appointment is cancelled after systems fail.",
          "instruction": "Select a category. For ambiguous examples, also prepare a short reason naming the stakeholder.",
          "marks": 1,
          "required": true,
          "displayOrder": 7,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "loss",
              "displayOrder": 1,
              "text": "Loss"
            },
            {
              "optionId": "disruption",
              "displayOrder": 2,
              "text": "Disruption"
            },
            {
              "optionId": "safety",
              "displayOrder": 3,
              "text": "Safety"
            },
            {
              "optionId": "multi",
              "displayOrder": 4,
              "text": "More than one category"
            }
          ]
        },
        {
          "questionId": "C8",
          "questionType": "single-choice",
          "prompt": "An oil installation\u2019s control systems are taken offline and normal operations stop.",
          "instruction": "Select a category. For ambiguous examples, also prepare a short reason naming the stakeholder.",
          "marks": 1,
          "required": true,
          "displayOrder": 8,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "loss",
              "displayOrder": 1,
              "text": "Loss"
            },
            {
              "optionId": "disruption",
              "displayOrder": 2,
              "text": "Disruption"
            },
            {
              "optionId": "safety",
              "displayOrder": 3,
              "text": "Safety"
            },
            {
              "optionId": "multi",
              "displayOrder": 4,
              "text": "More than one category"
            }
          ]
        },
        {
          "questionId": "C2R",
          "questionType": "short-response",
          "prompt": "Short reason for C2 (required if ambiguous): name the stakeholder perspective.",
          "instruction": "Write a short justification where more than one category may be defensible.",
          "marks": 0,
          "required": true,
          "displayOrder": 102,
          "minimumCharacters": 12,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "C3R",
          "questionType": "short-response",
          "prompt": "Short reason for C3 (required if ambiguous): name the stakeholder perspective.",
          "instruction": "Write a short justification where more than one category may be defensible.",
          "marks": 0,
          "required": true,
          "displayOrder": 103,
          "minimumCharacters": 12,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "C6R",
          "questionType": "short-response",
          "prompt": "Short reason for C6 (required if ambiguous): name the stakeholder perspective.",
          "instruction": "Write a short justification where more than one category may be defensible.",
          "marks": 0,
          "required": true,
          "displayOrder": 106,
          "minimumCharacters": 12,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "C7R",
          "questionType": "short-response",
          "prompt": "Short reason for C7 (required if ambiguous): name the stakeholder perspective.",
          "instruction": "Write a short justification where more than one category may be defensible.",
          "marks": 0,
          "required": true,
          "displayOrder": 107,
          "minimumCharacters": 12,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "C8R",
          "questionType": "short-response",
          "prompt": "Short reason for C8 (required if ambiguous): name the stakeholder perspective.",
          "instruction": "Write a short justification where more than one category may be defensible.",
          "marks": 0,
          "required": true,
          "displayOrder": 108,
          "minimumCharacters": 12,
          "maximumCharacters": 2500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        }
      ]
    }
  ],
  "assessment": {
    "C1": {
      "correctOptionId": "loss",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Direct extra spending is financial loss.",
      "feedbackCorrect": "Correct. Direct extra spending is financial loss.",
      "feedbackIncorrect": "Direct extra spending is financial loss.",
      "misconceptionFeedback": "Direct extra spending is financial loss.",
      "acceptedOptionIds": [
        "loss"
      ]
    },
    "C2": {
      "correctOptionId": "disruption",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "This is disruption of a depended-on service. More than one category may be argued with availability loss if explained.",
      "feedbackCorrect": "Correct. This is disruption of a depended-on service. More than one category may be argued with availability loss if explained.",
      "feedbackIncorrect": "This is disruption of a depended-on service. More than one category may be argued with availability loss if explained.",
      "misconceptionFeedback": "This is disruption of a depended-on service. More than one category may be argued with availability loss if explained.",
      "acceptedOptionIds": [
        "disruption",
        "multi"
      ]
    },
    "C3": {
      "correctOptionId": "safety",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Physical or clinical risk is a safety impact; disruption for the organisation may also be justified.",
      "feedbackCorrect": "Correct. Physical or clinical risk is a safety impact; disruption for the organisation may also be justified.",
      "feedbackIncorrect": "Physical or clinical risk is a safety impact; disruption for the organisation may also be justified.",
      "misconceptionFeedback": "Physical or clinical risk is a safety impact; disruption for the organisation may also be justified.",
      "acceptedOptionIds": [
        "safety",
        "multi"
      ]
    },
    "C4": {
      "correctOptionId": "loss",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Identity theft is a loss impact for the individual.",
      "feedbackCorrect": "Correct. Identity theft is a loss impact for the individual.",
      "feedbackIncorrect": "Identity theft is a loss impact for the individual.",
      "misconceptionFeedback": "Identity theft is a loss impact for the individual.",
      "acceptedOptionIds": [
        "loss"
      ]
    },
    "C5": {
      "correctOptionId": "loss",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Reputational loss / loss of customer confidence is a longer-term loss impact.",
      "feedbackCorrect": "Correct. Reputational loss / loss of customer confidence is a longer-term loss impact.",
      "feedbackIncorrect": "Reputational loss / loss of customer confidence is a longer-term loss impact.",
      "misconceptionFeedback": "Reputational loss / loss of customer confidence is a longer-term loss impact.",
      "acceptedOptionIds": [
        "loss"
      ]
    },
    "C6": {
      "correctOptionId": "multi",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Unreliable service is disruption; physical risk is safety. More than one category is often strongest.",
      "feedbackCorrect": "Correct. Unreliable service is disruption; physical risk is safety. More than one category is often strongest.",
      "feedbackIncorrect": "Unreliable service is disruption; physical risk is safety. More than one category is often strongest.",
      "misconceptionFeedback": "Unreliable service is disruption; physical risk is safety. More than one category is often strongest.",
      "acceptedOptionIds": [
        "disruption",
        "safety",
        "multi"
      ]
    },
    "C7": {
      "correctOptionId": "multi",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Weekly-plan example: disruption for the organisation; possible safety for the patient; loss may also be defensible where a financial, data or confidence consequence is justified. Classification depends on the stakeholder being considered.",
      "feedbackCorrect": "Correct. Weekly-plan example: disruption for the organisation; possible safety for the patient; loss may also be defensible where a financial, data or confidence consequence is justified. Classification depends on the stakeholder being considered.",
      "feedbackIncorrect": "Weekly-plan example: disruption for the organisation; possible safety for the patient; loss may also be defensible where a financial, data or confidence consequence is justified. Classification depends on the stakeholder being considered.",
      "misconceptionFeedback": "Weekly-plan example: disruption for the organisation; possible safety for the patient; loss may also be defensible where a financial, data or confidence consequence is justified. Classification depends on the stakeholder being considered.",
      "acceptedOptionIds": [
        "disruption",
        "safety",
        "loss",
        "multi"
      ]
    },
    "C8": {
      "correctOptionId": "disruption",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Stopped operations are disruption. Safety may be argued only if scenario evidence shows physical risk.",
      "feedbackCorrect": "Correct. Stopped operations are disruption. Safety may be argued only if scenario evidence shows physical risk.",
      "feedbackIncorrect": "Stopped operations are disruption. Safety may be argued only if scenario evidence shows physical risk.",
      "misconceptionFeedback": "Stopped operations are disruption. Safety may be argued only if scenario evidence shows physical risk.",
      "acceptedOptionIds": [
        "disruption",
        "multi"
      ]
    },
    "C2R": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Reason recorded for review. Classification marking does not pretend free-text semantic judgement is definitive."
    },
    "C3R": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Reason recorded for review. Classification marking does not pretend free-text semantic judgement is definitive."
    },
    "C6R": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Reason recorded for review. Classification marking does not pretend free-text semantic judgement is definitive."
    },
    "C7R": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Reason recorded for review. Classification marking does not pretend free-text semantic judgement is definitive."
    },
    "C8R": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Reason recorded for review. Classification marking does not pretend free-text semantic judgement is definitive."
    }
  },
  "tutorData": {
    "cancelledAppointmentExample": "C7",
    "categories": [
      "Loss",
      "Disruption",
      "Safety",
      "More than one category"
    ]
  }
});
