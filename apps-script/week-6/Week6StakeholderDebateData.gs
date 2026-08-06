/**
 * Week 6 activity pack.
 */

var WEEK6_PACK_STAKEHOLDER_DEBATE = Object.freeze({
  "meta": {
    "activityId": "week6-stakeholder-debate",
    "activityName": "Stakeholder Debate Preparation",
    "weekNumber": 6,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Discussion",
    "activityVersion": "1.0",
    "maximumScore": 10,
    "allowsPartner": true,
    "enabled": true,
    "componentId": "discussion",
    "introduction": "Northbank Community Health Partnership is debating how far to monitor staff after an insider copied patient contact details. Your group prepares structured arguments for a classroom debate. Completion checks field presence, not automatic quality scoring.",
    "completionMessage": "Debate outcome is a classroom recommendation, not a hub organisational decision."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Debate structure",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "SDS",
          "blockType": "scenario",
          "heading": "Debate scenario",
          "content": "Northbank Community Health Partnership is debating how far to monitor staff after an insider copied patient contact details. Your group prepares structured arguments for a classroom debate. Completion checks field presence, not automatic quality scoring.",
          "displayOrder": 1
        },
        {
          "blockId": "SDR",
          "blockType": "information",
          "heading": "Participation roles",
          "content": "Speaker: Presents the opening position and responds to challenges. Recorder: Captures arguments, evidence and concessions accurately. Evidence checker: Checks that claims link to the scenario and named legislation where relevant.",
          "displayOrder": 2
        },
        {
          "blockId": "SDST",
          "blockType": "information",
          "heading": "Stakeholder roles",
          "content": "Employees, Managers, Customers, The data protection regulator, Shareholders",
          "displayOrder": 3
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Debate preparation",
      "displayOrder": 2,
      "feedbackTiming": "none",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "SD0",
          "questionType": "short-response",
          "prompt": "Your participation role in the debate (speaker, recorder or evidence checker)",
          "instruction": "Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 3,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SD1",
          "questionType": "short-response",
          "prompt": "Stakeholder role you are representing",
          "instruction": "Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 3,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SD2",
          "questionType": "short-response",
          "prompt": "Opening position",
          "instruction": "Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.",
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
          "questionId": "SD3",
          "questionType": "short-response",
          "prompt": "Ethical argument (what ought to be done)",
          "instruction": "Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.",
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
          "questionId": "SD4",
          "questionType": "short-response",
          "prompt": "Legal argument (name legislation and the relevant duty or offence where you can)",
          "instruction": "Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.",
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
          "questionId": "SD5",
          "questionType": "short-response",
          "prompt": "Operational argument (cost, staff time, usability or productivity)",
          "instruction": "Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.",
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
          "questionId": "SD6",
          "questionType": "short-response",
          "prompt": "Opposing argument you expect from another stakeholder",
          "instruction": "Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.",
          "marks": 1,
          "required": true,
          "displayOrder": 7,
          "minimumCharacters": 15,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SD7",
          "questionType": "extended-response",
          "prompt": "Response to the opposing argument",
          "instruction": "Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.",
          "marks": 1,
          "required": true,
          "displayOrder": 8,
          "minimumCharacters": 15,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SD8",
          "questionType": "extended-response",
          "prompt": "Concession: one fair point from the other side",
          "instruction": "Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.",
          "marks": 1,
          "required": true,
          "displayOrder": 9,
          "minimumCharacters": 12,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SD9",
          "questionType": "extended-response",
          "prompt": "Final recommendation your role would advance (debate outcome, not hub decision)",
          "instruction": "Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.",
          "marks": 1,
          "required": true,
          "displayOrder": 10,
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
    "SD0": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "SD1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "SD2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "SD3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "SD4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "SD5": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "SD6": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "SD7": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "SD8": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "SD9": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    }
  },
  "tutorData": {
    "participationRoles": [
      "speaker",
      "recorder",
      "evidence-checker"
    ],
    "stakeholderRoles": [
      "Employees",
      "Managers",
      "Customers",
      "The data protection regulator",
      "Shareholders"
    ],
    "tutorReviewFlags": [
      "legal-plain-language-only"
    ]
  }
});
