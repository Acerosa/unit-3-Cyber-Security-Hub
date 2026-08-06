/**
 * Week 6 activity pack.
 */

var WEEK6_PACK_LEGISLATION_RETRIEVAL = Object.freeze({
  "meta": {
    "activityId": "week6-legislation-retrieval",
    "activityName": "Legislation Retrieval Quiz",
    "weekNumber": 6,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Retrieval quiz",
    "activityVersion": "1.0",
    "maximumScore": 10,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "quiz",
    "introduction": "Retrieve Week 6 legislation, ethics and operational ideas before debate and OCR practice.",
    "completionMessage": "Name statutes with duties or offences together in examination answers."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Retrieval focus",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "LRL",
          "blockType": "information",
          "heading": "Legislation reminder",
          "content": "Computer Misuse Act 1990; current United Kingdom data protection legislation; Police and Justice Act 2006 amendments (supplying tools for misuse).",
          "displayOrder": 1
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Legislation retrieval questions",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "LR1",
          "questionType": "single-choice",
          "prompt": "Which United Kingdom statute creates the main unauthorised access offence for computer systems?",
          "instruction": "Session 2 legislation retrieval.",
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
              "text": "Computer Misuse Act 1990"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Current United Kingdom data protection legislation only"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Police and Justice Act 2006 only"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Cyber Essentials certification scheme"
            }
          ]
        },
        {
          "questionId": "LR2",
          "questionType": "single-choice",
          "prompt": "Northbank must explain why patient contact details were accessed without a proper purpose. Which legislation is most directly relevant to that duty?",
          "instruction": "Session 2 legislation retrieval.",
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
              "text": "Current United Kingdom data protection legislation"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Computer Misuse Act 1990 only, with no data protection role"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Police and Justice Act 2006 amendments only"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Ethical codes with no legal force"
            }
          ]
        },
        {
          "questionId": "LR3",
          "questionType": "single-choice",
          "prompt": "A supplier offers Northbank a ready-made credential-testing tool marketed for \"checking weak passwords\" without clear authorisation rules. Which amendment area is most relevant?",
          "instruction": "Session 2 legislation retrieval.",
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
              "text": "Police and Justice Act 2006 amendments on supplying tools for misuse"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Current United Kingdom data protection legislation only"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Computer Misuse Act 1990 section on patient confidentiality"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Operational downtime guidance only"
            }
          ]
        },
        {
          "questionId": "LR4",
          "questionType": "single-choice",
          "prompt": "Which pairing best links statute to duty for an insider who accesses records they are not authorised to view?",
          "instruction": "Session 2 legislation retrieval.",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "Computer Misuse Act 1990: unauthorised access to computer material"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Current United Kingdom data protection legislation: only marketing consent"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Police and Justice Act 2006: only physical break-ins"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Ethics policy: criminal prosecution without further detail"
            }
          ]
        },
        {
          "questionId": "LR5",
          "questionType": "single-choice",
          "prompt": "Which pairing best links statute to duty when Northbank fails to protect personal data by inadequate access controls after an insider breach?",
          "instruction": "Session 2 legislation retrieval.",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "Current United Kingdom data protection legislation: appropriate security and accountability for personal data"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Computer Misuse Act 1990: only external hackers"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Police and Justice Act 2006: only copyright infringement"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Operational policy: replaces all legal duties"
            }
          ]
        },
        {
          "questionId": "LR6",
          "questionType": "single-choice",
          "prompt": "An action may be unethical but still lawful, or unlawful but argued as well-intentioned. Which statement is most accurate?",
          "instruction": "Session 2 legislation retrieval.",
          "marks": 1,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "Ethics and law are related but not identical; legal compliance does not automatically mean an action is ethical"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "If something is legal it is always ethical in a healthcare setting"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Ethical behaviour never needs to consider operational practicality"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Only the Computer Misuse Act 1990 defines ethics for Northbank"
            }
          ]
        },
        {
          "questionId": "LR7",
          "questionType": "single-choice",
          "prompt": "Northbank considers continuous keystroke monitoring for all staff after an insider data breach. Which operational consideration is most relevant?",
          "instruction": "Session 2 legislation retrieval.",
          "marks": 1,
          "required": true,
          "displayOrder": 7,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "Staff time, usability, trust and lost productivity if controls are disproportionate"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Only the colour of the monitoring dashboard"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Whether the attacker used ransomware encryption"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Replacing all legislation with a single policy sentence"
            }
          ]
        },
        {
          "questionId": "LR8",
          "questionType": "single-choice",
          "prompt": "Why should Northbank not rely on the Computer Misuse Act 1990 alone when deciding how to handle exposed patient contact details?",
          "instruction": "Session 2 legislation retrieval.",
          "marks": 1,
          "required": true,
          "displayOrder": 8,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "Data protection duties also apply to how personal data is processed, secured and explained to individuals"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "The Computer Misuse Act 1990 removes all data protection duties"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Patient contact details are never personal data"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Operational cost always overrides both statutes"
            }
          ]
        },
        {
          "questionId": "LR9",
          "questionType": "single-choice",
          "prompt": "Which answer best distinguishes a legal duty from an ethical expectation for employee monitoring?",
          "instruction": "Session 2 legislation retrieval.",
          "marks": 1,
          "required": true,
          "displayOrder": 9,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "Law sets minimum requirements that can be enforced; ethics asks whether monitoring is fair, proportionate and respectful even where law allows it"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Ethics and law are identical, so proportionality never matters"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Legal duties apply only to external attackers"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Ethical expectations replace the need to name any statute"
            }
          ]
        },
        {
          "questionId": "LR10",
          "questionType": "single-choice",
          "prompt": "A learner writes: \"Northbank should monitor everyone heavily because hackers exist.\" What is the main weakness?",
          "instruction": "Session 2 legislation retrieval.",
          "marks": 1,
          "required": true,
          "displayOrder": 10,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "It jumps to an operational choice without linking statute, duty, ethics or stakeholder impact"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "It names the Computer Misuse Act 1990 too precisely"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "It includes too much evidence from the insider breach scenario"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "It balances competing considerations before concluding"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "LR1": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Unauthorised access to computer material is primarily addressed under the Computer Misuse Act 1990.",
      "feedbackCorrect": "Correct. Unauthorised access to computer material is primarily addressed under the Computer Misuse Act 1990.",
      "feedbackIncorrect": "Unauthorised access to computer material is primarily addressed under the Computer Misuse Act 1990.",
      "misconceptionFeedback": "Unauthorised access to computer material is primarily addressed under the Computer Misuse Act 1990."
    },
    "LR2": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Processing personal data must comply with current United Kingdom data protection legislation, including lawful purpose and security expectations.",
      "feedbackCorrect": "Correct. Processing personal data must comply with current United Kingdom data protection legislation, including lawful purpose and security expectations.",
      "feedbackIncorrect": "Processing personal data must comply with current United Kingdom data protection legislation, including lawful purpose and security expectations.",
      "misconceptionFeedback": "Processing personal data must comply with current United Kingdom data protection legislation, including lawful purpose and security expectations."
    },
    "LR3": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "The Police and Justice Act 2006 amendments address making, supplying or obtaining articles for use in Computer Misuse Act offences.",
      "feedbackCorrect": "Correct. The Police and Justice Act 2006 amendments address making, supplying or obtaining articles for use in Computer Misuse Act offences.",
      "feedbackIncorrect": "The Police and Justice Act 2006 amendments address making, supplying or obtaining articles for use in Computer Misuse Act offences.",
      "misconceptionFeedback": "The Police and Justice Act 2006 amendments address making, supplying or obtaining articles for use in Computer Misuse Act offences."
    },
    "LR4": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Name the statute and the relevant duty or offence together. Unauthorised access fits the Computer Misuse Act 1990.",
      "feedbackCorrect": "Correct. Name the statute and the relevant duty or offence together. Unauthorised access fits the Computer Misuse Act 1990.",
      "feedbackIncorrect": "Name the statute and the relevant duty or offence together. Unauthorised access fits the Computer Misuse Act 1990.",
      "misconceptionFeedback": "Name the statute and the relevant duty or offence together. Unauthorised access fits the Computer Misuse Act 1990."
    },
    "LR5": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Security of personal data and accountability sit under current United Kingdom data protection legislation.",
      "feedbackCorrect": "Correct. Security of personal data and accountability sit under current United Kingdom data protection legislation.",
      "feedbackIncorrect": "Security of personal data and accountability sit under current United Kingdom data protection legislation.",
      "misconceptionFeedback": "Security of personal data and accountability sit under current United Kingdom data protection legislation."
    },
    "LR6": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Week 6 requires you to separate moral judgement from legal requirements and from operational constraints.",
      "feedbackCorrect": "Correct. Week 6 requires you to separate moral judgement from legal requirements and from operational constraints.",
      "feedbackIncorrect": "Week 6 requires you to separate moral judgement from legal requirements and from operational constraints.",
      "misconceptionFeedback": "Week 6 requires you to separate moral judgement from legal requirements and from operational constraints."
    },
    "LR7": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Operational considerations include cost, staff time, downtime, usability and productivity trade-offs.",
      "feedbackCorrect": "Correct. Operational considerations include cost, staff time, downtime, usability and productivity trade-offs.",
      "feedbackIncorrect": "Operational considerations include cost, staff time, downtime, usability and productivity trade-offs.",
      "misconceptionFeedback": "Operational considerations include cost, staff time, downtime, usability and productivity trade-offs."
    },
    "LR8": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Different statutes address different duties. Personal data handling also falls under current United Kingdom data protection legislation.",
      "feedbackCorrect": "Correct. Different statutes address different duties. Personal data handling also falls under current United Kingdom data protection legislation.",
      "feedbackIncorrect": "Different statutes address different duties. Personal data handling also falls under current United Kingdom data protection legislation.",
      "misconceptionFeedback": "Different statutes address different duties. Personal data handling also falls under current United Kingdom data protection legislation."
    },
    "LR9": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Strong Week 6 answers name legal duties separately from ethical judgement and operational practicality.",
      "feedbackCorrect": "Correct. Strong Week 6 answers name legal duties separately from ethical judgement and operational practicality.",
      "feedbackIncorrect": "Strong Week 6 answers name legal duties separately from ethical judgement and operational practicality.",
      "misconceptionFeedback": "Strong Week 6 answers name legal duties separately from ethical judgement and operational practicality."
    },
    "LR10": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Exam-style answers need statute linked to duty, ethical proportionality and operational trade-offs, not vague fear-based conclusions.",
      "feedbackCorrect": "Correct. Exam-style answers need statute linked to duty, ethical proportionality and operational trade-offs, not vague fear-based conclusions.",
      "feedbackIncorrect": "Exam-style answers need statute linked to duty, ethical proportionality and operational trade-offs, not vague fear-based conclusions.",
      "misconceptionFeedback": "Exam-style answers need statute linked to duty, ethical proportionality and operational trade-offs, not vague fear-based conclusions."
    }
  },
  "tutorData": {
    "tutorReviewFlags": [
      "legal-plain-language-only"
    ]
  }
});
