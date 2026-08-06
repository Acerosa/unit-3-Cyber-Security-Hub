/**
 * Week 5 activity pack.
 */

var WEEK5_PACK_STAKEHOLDER_GRID = Object.freeze({
  "meta": {
    "activityId": "week5-stakeholder-grid",
    "activityName": "Stakeholder Impact Grid",
    "weekNumber": 5,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Scenario mapping",
    "activityVersion": "1.0",
    "maximumScore": 10,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "scenario-mapping",
    "introduction": "Complete a Northbank ransomware impact grid for every required stakeholder and all three impact categories.",
    "completionMessage": "Do not finish by filling only the financial-loss column."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Scenario and worked example",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "SGSC",
          "blockType": "scenario",
          "heading": "Northbank ransomware scenario",
          "content": "Ransomware encrypts Northbank booking and shared-drive systems for two working days. Some appointments are cancelled. Patient contact details may have been exposed. Emergency recovery spending begins. Local media report the outage. Patients ask whether records are safe. Partner clinics pause some referrals. Staff work from paper lists where possible.",
          "displayOrder": 1
        },
        {
          "blockId": "SGWE",
          "blockType": "worked-example",
          "heading": "Individuals row (worked example)",
          "content": "Loss: exposed contact details create confidentiality loss. Disruption: cancelled appointments disrupt access to planned care. Safety: delayed urgent review can increase clinical risk. Evidence: appointments cancelled; contact details may have been exposed; systems down two days. Timescale: immediate cancelled visits; longer-term confidence and possible identity harms.",
          "displayOrder": 2
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Stakeholder grid and reflection",
      "displayOrder": 2,
      "feedbackTiming": "none",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "SG1",
          "questionType": "extended-response",
          "prompt": "For Individuals (worked example available): record loss, disruption, safety (or justified none), supporting scenario evidence, and immediate or longer-term consequence.",
          "instruction": "Consider every category. You may state no defensible impact in a category if justified.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SG2",
          "questionType": "extended-response",
          "prompt": "For Northbank as the organisation: record loss, disruption, safety (or justified none), supporting scenario evidence, and immediate or longer-term consequence.",
          "instruction": "Consider every category. You may state no defensible impact in a category if justified.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SG3",
          "questionType": "extended-response",
          "prompt": "For Employees: record loss, disruption, safety (or justified none), supporting scenario evidence, and immediate or longer-term consequence.",
          "instruction": "Consider every category. You may state no defensible impact in a category if justified.",
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
          "questionId": "SG4",
          "questionType": "extended-response",
          "prompt": "For Customers or patients: record loss, disruption, safety (or justified none), supporting scenario evidence, and immediate or longer-term consequence.",
          "instruction": "Consider every category. You may state no defensible impact in a category if justified.",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SG5",
          "questionType": "extended-response",
          "prompt": "For Suppliers: record loss, disruption, safety (or justified none), supporting scenario evidence, and immediate or longer-term consequence.",
          "instruction": "Consider every category. You may state no defensible impact in a category if justified.",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SG6",
          "questionType": "extended-response",
          "prompt": "For Regulators: record loss, disruption, safety (or justified none), supporting scenario evidence, and immediate or longer-term consequence.",
          "instruction": "Consider every category. You may state no defensible impact in a category if justified.",
          "marks": 1,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SG7",
          "questionType": "extended-response",
          "prompt": "For The state: record loss, disruption, safety (or justified none), supporting scenario evidence, and immediate or longer-term consequence.",
          "instruction": "Consider every category. You may state no defensible impact in a category if justified.",
          "marks": 1,
          "required": true,
          "displayOrder": 7,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SG8",
          "questionType": "extended-response",
          "prompt": "Name two impacts you initially overlooked.",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 8,
          "minimumCharacters": 20,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "SG9",
          "questionType": "extended-response",
          "prompt": "Which stakeholder did you find hardest to analyse, and why?",
          "instruction": "Write a clear response using scenario evidence.",
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
          "questionId": "SG10",
          "questionType": "extended-response",
          "prompt": "Why does the same incident affect a patient differently from a regulator?",
          "instruction": "Write a clear response using scenario evidence.",
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
    "SG1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Grid response recorded. Open-ended stakeholder analysis is not exact-match auto-marked."
    },
    "SG2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Grid response recorded. Open-ended stakeholder analysis is not exact-match auto-marked."
    },
    "SG3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Grid response recorded. Open-ended stakeholder analysis is not exact-match auto-marked."
    },
    "SG4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Grid response recorded. Open-ended stakeholder analysis is not exact-match auto-marked."
    },
    "SG5": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Grid response recorded. Open-ended stakeholder analysis is not exact-match auto-marked."
    },
    "SG6": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Grid response recorded. Open-ended stakeholder analysis is not exact-match auto-marked."
    },
    "SG7": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Grid response recorded. Open-ended stakeholder analysis is not exact-match auto-marked."
    },
    "SG8": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Grid response recorded. Open-ended stakeholder analysis is not exact-match auto-marked."
    },
    "SG9": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Grid response recorded. Open-ended stakeholder analysis is not exact-match auto-marked."
    },
    "SG10": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Grid response recorded. Open-ended stakeholder analysis is not exact-match auto-marked."
    }
  },
  "tutorData": {
    "stakeholders": [
      "individuals",
      "organisation",
      "employees",
      "patients",
      "suppliers",
      "regulators",
      "state"
    ],
    "columns": [
      "loss",
      "disruption",
      "safety",
      "evidence",
      "timescale"
    ],
    "checklist": [
      "Loss considered",
      "Disruption considered",
      "Safety considered",
      "Scenario evidence recorded",
      "Immediate or longer-term consequence stated"
    ],
    "partlyCompletedOrganisationSeed": {
      "loss": "Emergency recovery spending and possible reputational loss.",
      "evidence": "Emergency recovery spending begins immediately; local media report the outage.",
      "timescale": "Immediate financial recovery cost."
    }
  }
});
