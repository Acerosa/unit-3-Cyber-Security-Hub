/**
 * Week 6 activity pack.
 */

var WEEK6_PACK_LEGISLATION_MATCHING = Object.freeze({
  "meta": {
    "activityId": "week6-legislation-matching",
    "activityName": "Legislation Scenario Matching",
    "weekNumber": 6,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Classification",
    "activityVersion": "1.0",
    "maximumScore": 6,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "classification",
    "introduction": "Match each scenario to the correct legislation and duty pairing. Full credit requires both.",
    "completionMessage": "Do not invent section numbers or notification periods in examination answers."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Matching guidance",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "LMG",
          "blockType": "information",
          "heading": "How to match",
          "content": "Each option combines a statute with a duty or offence. Name both together in examination answers.",
          "displayOrder": 1
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Legislation matching",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "M1",
          "questionType": "single-choice",
          "prompt": "An attacker in another country uses stolen credentials to enter Northbank patient record system without permission.",
          "instruction": "Select the pairing of legislation and duty that best fits the scenario.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "cma__unauthorised-access",
              "displayOrder": 1,
              "text": "Computer Misuse Act 1990: Unauthorised access to computer material"
            },
            {
              "optionId": "cma__unauthorised-modification",
              "displayOrder": 2,
              "text": "Computer Misuse Act 1990: Unauthorised modification of computer material"
            },
            {
              "optionId": "cma__processing-without-security",
              "displayOrder": 3,
              "text": "Computer Misuse Act 1990: Processing personal data without appropriate security or lawful basis"
            },
            {
              "optionId": "cma__breach-handling",
              "displayOrder": 4,
              "text": "Computer Misuse Act 1990: Handling a personal data breach under current duties"
            }
          ]
        },
        {
          "questionId": "M2",
          "questionType": "single-choice",
          "prompt": "An insider exports thousands of patient details they are not permitted to use and shares them with a third party.",
          "instruction": "Select the pairing of legislation and duty that best fits the scenario.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "dp__processing-without-security",
              "displayOrder": 1,
              "text": "Current United Kingdom data protection legislation: Processing personal data without appropriate security or lawful basis"
            },
            {
              "optionId": "cma__unauthorised-access",
              "displayOrder": 2,
              "text": "Computer Misuse Act 1990: Unauthorised access to computer material"
            },
            {
              "optionId": "cma__unauthorised-modification",
              "displayOrder": 3,
              "text": "Computer Misuse Act 1990: Unauthorised modification of computer material"
            },
            {
              "optionId": "cma__processing-without-security",
              "displayOrder": 4,
              "text": "Computer Misuse Act 1990: Processing personal data without appropriate security or lawful basis"
            }
          ]
        },
        {
          "questionId": "M3",
          "questionType": "single-choice",
          "prompt": "A forum seller offers a ready-made phishing kit advertised for breaking into GP partnerships.",
          "instruction": "Select the pairing of legislation and duty that best fits the scenario.",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "pja__supplying-tools",
              "displayOrder": 1,
              "text": "Police and Justice Act 2006 amendments (supplying tools for misuse): Supplying tools knowing they are likely to be used for computer misuse"
            },
            {
              "optionId": "cma__unauthorised-access",
              "displayOrder": 2,
              "text": "Computer Misuse Act 1990: Unauthorised access to computer material"
            },
            {
              "optionId": "cma__unauthorised-modification",
              "displayOrder": 3,
              "text": "Computer Misuse Act 1990: Unauthorised modification of computer material"
            },
            {
              "optionId": "cma__processing-without-security",
              "displayOrder": 4,
              "text": "Computer Misuse Act 1990: Processing personal data without appropriate security or lawful basis"
            }
          ]
        },
        {
          "questionId": "M4",
          "questionType": "single-choice",
          "prompt": "Malware encrypts Northbank servers and deletes backups without authorisation.",
          "instruction": "Select the pairing of legislation and duty that best fits the scenario.",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "cma__unauthorised-modification",
              "displayOrder": 1,
              "text": "Computer Misuse Act 1990: Unauthorised modification of computer material"
            },
            {
              "optionId": "cma__unauthorised-access",
              "displayOrder": 2,
              "text": "Computer Misuse Act 1990: Unauthorised access to computer material"
            },
            {
              "optionId": "cma__processing-without-security",
              "displayOrder": 3,
              "text": "Computer Misuse Act 1990: Processing personal data without appropriate security or lawful basis"
            },
            {
              "optionId": "cma__breach-handling",
              "displayOrder": 4,
              "text": "Computer Misuse Act 1990: Handling a personal data breach under current duties"
            }
          ]
        },
        {
          "questionId": "M5",
          "questionType": "single-choice",
          "prompt": "After discovering an insider breach, Northbank must assess harm and respond under its data protection responsibilities.",
          "instruction": "Select the pairing of legislation and duty that best fits the scenario.",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "dp__breach-handling",
              "displayOrder": 1,
              "text": "Current United Kingdom data protection legislation: Handling a personal data breach under current duties"
            },
            {
              "optionId": "cma__unauthorised-access",
              "displayOrder": 2,
              "text": "Computer Misuse Act 1990: Unauthorised access to computer material"
            },
            {
              "optionId": "cma__unauthorised-modification",
              "displayOrder": 3,
              "text": "Computer Misuse Act 1990: Unauthorised modification of computer material"
            },
            {
              "optionId": "cma__processing-without-security",
              "displayOrder": 4,
              "text": "Computer Misuse Act 1990: Processing personal data without appropriate security or lawful basis"
            }
          ]
        },
        {
          "questionId": "M6",
          "questionType": "single-choice",
          "prompt": "A tutor explains the United Kingdom Cyber Security Strategy themes in class without accessing any system.",
          "instruction": "Select the pairing of legislation and duty that best fits the scenario.",
          "marks": 1,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "none__not-statute",
              "displayOrder": 1,
              "text": "Not primarily a criminal statute scenario: Not primarily a criminal statute scenario"
            },
            {
              "optionId": "cma__unauthorised-access",
              "displayOrder": 2,
              "text": "Computer Misuse Act 1990: Unauthorised access to computer material"
            },
            {
              "optionId": "cma__unauthorised-modification",
              "displayOrder": 3,
              "text": "Computer Misuse Act 1990: Unauthorised modification of computer material"
            },
            {
              "optionId": "cma__processing-without-security",
              "displayOrder": 4,
              "text": "Computer Misuse Act 1990: Processing personal data without appropriate security or lawful basis"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "M1": {
      "correctOptionId": "cma__unauthorised-access",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Unauthorised access to systems is a Computer Misuse Act 1990 concern. Personal data duties may also apply separately, but do not label this as data protection alone.",
      "feedbackCorrect": "Correct. Unauthorised access to systems is a Computer Misuse Act 1990 concern. Personal data duties may also apply separately, but do not label this as data protection alone.",
      "feedbackIncorrect": "Unauthorised access to systems is a Computer Misuse Act 1990 concern. Personal data duties may also apply separately, but do not label this as data protection alone.",
      "misconceptionFeedback": "Unauthorised access to systems is a Computer Misuse Act 1990 concern. Personal data duties may also apply separately, but do not label this as data protection alone."
    },
    "M2": {
      "correctOptionId": "dp__processing-without-security",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Misuse of personal data engages data protection duties. Computer Misuse Act 1990 may also apply to unauthorised access, but the core personal data duty is under current United Kingdom data protection legislation.",
      "feedbackCorrect": "Correct. Misuse of personal data engages data protection duties. Computer Misuse Act 1990 may also apply to unauthorised access, but the core personal data duty is under current United Kingdom data protection legislation.",
      "feedbackIncorrect": "Misuse of personal data engages data protection duties. Computer Misuse Act 1990 may also apply to unauthorised access, but the core personal data duty is under current United Kingdom data protection legislation.",
      "misconceptionFeedback": "Misuse of personal data engages data protection duties. Computer Misuse Act 1990 may also apply to unauthorised access, but the core personal data duty is under current United Kingdom data protection legislation."
    },
    "M3": {
      "correctOptionId": "pja__supplying-tools",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Supplying tools for misuse is not the same as the Computer Misuse Act 1990 access offence itself. Name the supply offence under the Police and Justice Act 2006 amendments.",
      "feedbackCorrect": "Correct. Supplying tools for misuse is not the same as the Computer Misuse Act 1990 access offence itself. Name the supply offence under the Police and Justice Act 2006 amendments.",
      "feedbackIncorrect": "Supplying tools for misuse is not the same as the Computer Misuse Act 1990 access offence itself. Name the supply offence under the Police and Justice Act 2006 amendments.",
      "misconceptionFeedback": "Supplying tools for misuse is not the same as the Computer Misuse Act 1990 access offence itself. Name the supply offence under the Police and Justice Act 2006 amendments."
    },
    "M4": {
      "correctOptionId": "cma__unauthorised-modification",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Encrypting or deleting data without permission may be unauthorised modification. Do not assume every incident is only a data protection matter.",
      "feedbackCorrect": "Correct. Encrypting or deleting data without permission may be unauthorised modification. Do not assume every incident is only a data protection matter.",
      "feedbackIncorrect": "Encrypting or deleting data without permission may be unauthorised modification. Do not assume every incident is only a data protection matter.",
      "misconceptionFeedback": "Encrypting or deleting data without permission may be unauthorised modification. Do not assume every incident is only a data protection matter."
    },
    "M5": {
      "correctOptionId": "dp__breach-handling",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Breaches involving personal data engage current United Kingdom data protection legislation. Do not invent notification periods or section numbers in answers.",
      "feedbackCorrect": "Correct. Breaches involving personal data engage current United Kingdom data protection legislation. Do not invent notification periods or section numbers in answers.",
      "feedbackIncorrect": "Breaches involving personal data engage current United Kingdom data protection legislation. Do not invent notification periods or section numbers in answers.",
      "misconceptionFeedback": "Breaches involving personal data engage current United Kingdom data protection legislation. Do not invent notification periods or section numbers in answers."
    },
    "M6": {
      "correctOptionId": "none__not-statute",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Government strategy is guidance, not a criminal statute. The CMA-for-data-protection misconception: strategy documents do not create criminal offences.",
      "feedbackCorrect": "Correct. Government strategy is guidance, not a criminal statute. The CMA-for-data-protection misconception: strategy documents do not create criminal offences.",
      "feedbackIncorrect": "Government strategy is guidance, not a criminal statute. The CMA-for-data-protection misconception: strategy documents do not create criminal offences.",
      "misconceptionFeedback": "Government strategy is guidance, not a criminal statute. The CMA-for-data-protection misconception: strategy documents do not create criminal offences."
    }
  },
  "tutorData": {
    "legislationOptions": [
      "Computer Misuse Act 1990",
      "Current United Kingdom data protection legislation",
      "Police and Justice Act 2006 amendments (supplying tools for misuse)",
      "Not primarily a criminal statute scenario"
    ],
    "dutyOptions": [
      "Unauthorised access to computer material",
      "Unauthorised modification of computer material",
      "Processing personal data without appropriate security or lawful basis",
      "Handling a personal data breach under current duties",
      "Supplying tools knowing they are likely to be used for computer misuse",
      "Not primarily a criminal statute scenario"
    ],
    "tutorReviewFlags": [
      "legal-plain-language-only"
    ]
  }
});
