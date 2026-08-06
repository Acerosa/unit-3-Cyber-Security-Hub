/**
 * Week 6 activity pack.
 */

var WEEK6_PACK_EMPLOYEE_MONITORING = Object.freeze({
  "meta": {
    "activityId": "week6-employee-monitoring",
    "activityName": "Northbank Employee Monitoring Scenario",
    "weekNumber": 6,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Scenario mapping",
    "activityVersion": "1.0",
    "maximumScore": 6,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "scenario-mapping",
    "introduction": "Northbank Community Health Partnership discovers that a member of staff copied patient contact details to a personal device before leaving the organisation. The breach is contained, but senior managers ask how far Northbank should monitor employees to prevent repeat insider misuse. Options discussed include enhanced log review, mailbox auditing, workstation monitoring and clearer acceptable-use rules. No decision is made in this activity: you prepare one stakeholder position for debate.",
    "completionMessage": "This prepares a stakeholder position for debate, not a final organisational decision."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Scenario and prompts",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "EMS",
          "blockType": "scenario",
          "heading": "Northbank insider breach",
          "content": "Northbank Community Health Partnership discovers that a member of staff copied patient contact details to a personal device before leaving the organisation. The breach is contained, but senior managers ask how far Northbank should monitor employees to prevent repeat insider misuse. Options discussed include enhanced log review, mailbox auditing, workstation monitoring and clearer acceptable-use rules. No decision is made in this activity: you prepare one stakeholder position for debate.",
          "displayOrder": 1
        },
        {
          "blockId": "EMP_ethical",
          "blockType": "information",
          "heading": "Ethical prompts",
          "content": "Is the proposed monitoring fair and proportionate for this stakeholder? What trust or dignity concerns arise?",
          "displayOrder": 2
        },
        {
          "blockId": "EMP_legal",
          "blockType": "information",
          "heading": "Legal prompts",
          "content": "Which statute and duty are most relevant (Computer Misuse Act 1990, current United Kingdom data protection legislation, or Police and Justice Act 2006 amendments where tools are supplied)? What lawful basis or transparency might employees and customers expect?",
          "displayOrder": 3
        },
        {
          "blockId": "EMP_operational",
          "blockType": "information",
          "heading": "Operational prompts",
          "content": "What staff time, usability or productivity effects could monitoring create? Could monitoring reduce repeat insider risk without harming day-to-day care delivery?",
          "displayOrder": 4
        },
        {
          "blockId": "EMSS",
          "blockType": "information",
          "heading": "Sentence starters",
          "content": "From the perspective of [stakeholder]… The scenario shows that… Under current United Kingdom data protection legislation… Ethically, the concern is… Operationally, Northbank would need to…",
          "displayOrder": 10
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Stakeholder position",
      "displayOrder": 2,
      "feedbackTiming": "none",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "EM0",
          "questionType": "single-choice",
          "prompt": "Select the stakeholder role you are preparing to represent in debate.",
          "instruction": "Select one stakeholder role and prepare a position for classroom debate. Use the ethical, legal and operational prompts. Do not treat your answer as the final organisational decision.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "employees",
              "displayOrder": 1,
              "text": "Employees"
            },
            {
              "optionId": "managers",
              "displayOrder": 2,
              "text": "Managers"
            },
            {
              "optionId": "customers",
              "displayOrder": 3,
              "text": "Customers"
            },
            {
              "optionId": "regulator",
              "displayOrder": 4,
              "text": "The data protection regulator"
            },
            {
              "optionId": "shareholders",
              "displayOrder": 5,
              "text": "Shareholders"
            }
          ]
        },
        {
          "questionId": "EM1",
          "questionType": "extended-response",
          "prompt": "Main argument from your stakeholder role",
          "instruction": "Select one stakeholder role and prepare a position for classroom debate. Use the ethical, legal and operational prompts. Do not treat your answer as the final organisational decision.",
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
          "questionId": "EM2",
          "questionType": "extended-response",
          "prompt": "Evidence from the Northbank insider breach scenario",
          "instruction": "Select one stakeholder role and prepare a position for classroom debate. Use the ethical, legal and operational prompts. Do not treat your answer as the final organisational decision.",
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
          "questionId": "EM3",
          "questionType": "extended-response",
          "prompt": "Strongest opposing argument another stakeholder might raise",
          "instruction": "Select one stakeholder role and prepare a position for classroom debate. Use the ethical, legal and operational prompts. Do not treat your answer as the final organisational decision.",
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
          "questionId": "EM4",
          "questionType": "extended-response",
          "prompt": "Hardest opposing point for your role to answer",
          "instruction": "Select one stakeholder role and prepare a position for classroom debate. Use the ethical, legal and operational prompts. Do not treat your answer as the final organisational decision.",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 15,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "EM5",
          "questionType": "extended-response",
          "prompt": "Recommendation your role would advance in debate (not the final Northbank decision)",
          "instruction": "Select one stakeholder role and prepare a position for classroom debate. Use the ethical, legal and operational prompts. Do not treat your answer as the final organisational decision.",
          "marks": 1,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 25,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        }
      ]
    }
  ],
  "assessment": {
    "EM0": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Stakeholder role recorded."
    },
    "EM1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "EM2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "EM3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "EM4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    },
    "EM5": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Debate preparation recorded."
    }
  },
  "tutorData": {
    "stakeholderRoles": [
      "employees",
      "managers",
      "customers",
      "regulator",
      "shareholders"
    ],
    "sentenceStarters": [
      "From the perspective of [stakeholder]…",
      "The scenario shows that…",
      "Under current United Kingdom data protection legislation…",
      "Ethically, the concern is…",
      "Operationally, Northbank would need to…"
    ],
    "tutorReviewFlags": [
      "legal-plain-language-only"
    ]
  }
});
