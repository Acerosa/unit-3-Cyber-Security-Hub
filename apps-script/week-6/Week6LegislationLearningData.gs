/**
 * Week 6 activity pack.
 */

var WEEK6_PACK_LEGISLATION_LEARNING = Object.freeze({
  "meta": {
    "activityId": "week6-legislation-learning",
    "activityName": "United Kingdom Legislation Learning",
    "weekNumber": 6,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Guided learning",
    "activityVersion": "1.0",
    "maximumScore": 6,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "guided-learning",
    "introduction": "Examination answers must name the law and the relevant duty or offence. A bare statute name alone is insufficient. Keep legislation current: use official sources and tutor guidance rather than outdated summaries.",
    "completionMessage": "Keep legislation current. Name the law and the relevant duty or offence."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "United Kingdom legislation",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "LLN",
          "blockType": "information",
          "heading": "Examination note",
          "content": "Examination answers must name the law and the relevant duty or offence. A bare statute name alone is insufficient. Keep legislation current: use official sources and tutor guidance rather than outdated summaries.",
          "displayOrder": 0
        },
        {
          "blockId": "LL_cma",
          "blockType": "definition",
          "heading": "Computer Misuse Act 1990",
          "content": "Purpose: Creates criminal offences for unauthorised access to computer material, unauthorised access with intent, and unauthorised modification of computer material. Duty or offence: Relevant offences include unauthorised access to computer material and unauthorised acts with intent to impair operation of a computer. Northbank: If an insider accesses patient records without permission, or an external attacker breaks into Northbank systems, Computer Misuse Act 1990 offences may apply depending on authorisation and intent. Misconception: Computer Misuse Act 1990 is not the main statute for lawful processing of personal data. Data protection is addressed separately under current United Kingdom data protection legislation.",
          "displayOrder": 1
        },
        {
          "blockId": "LL_dp",
          "blockType": "definition",
          "heading": "Current United Kingdom data protection legislation",
          "content": "Purpose: Sets duties for organisations that process personal data, including lawful basis, fairness, security and accountability expectations. Duty or offence: Relevant duties include processing personal data lawfully, securely and transparently, and handling personal data breaches appropriately under the current framework. Northbank: Northbank must protect patient personal data, limit access to what is necessary and respond properly if an insider causes a data breach affecting records. Misconception: do not invent section numbers, notification periods or penalty amounts in examination answers. Name the legislation and the relevant duty or offence in plain language.",
          "displayOrder": 2
        },
        {
          "blockId": "LL_pja",
          "blockType": "definition",
          "heading": "Police and Justice Act 2006 amendments (supplying tools for misuse)",
          "content": "Purpose: Amended computer misuse law to address making, supplying or obtaining articles for use in computer misuse offences. Duty or offence: Relevant offence area: supplying or making available tools knowing they are likely to be used to commit unauthorised access or related misuse. Northbank: If someone distributes a bespoke credential-stealing kit aimed at Northbank staff, supply-of-tools offences may be relevant alongside direct misuse offences. Misconception: possessing security testing tools is not automatically illegal. Context, authorisation and intent matter, especially for legitimate security work.",
          "displayOrder": 3
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Legislation knowledge check",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "LK1",
          "questionType": "single-choice",
          "prompt": "Which pairing is most accurate for examination answers?",
          "instruction": "Name the legislation and the relevant duty or offence.",
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
              "text": "Computer Misuse Act 1990: lawful basis for marketing emails"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Current United Kingdom data protection legislation: duties when processing personal data"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Cyber Essentials Scheme: criminal offence for hacking"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Cyber Streetwise: statute for unauthorised access"
            }
          ]
        },
        {
          "questionId": "LK2",
          "questionType": "single-choice",
          "prompt": "Unauthorised access to Northbank servers without permission is mainly linked to:",
          "instruction": "Name the legislation and the relevant duty or offence.",
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
              "text": "Cyber Streetwise"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Computer Misuse Act 1990"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "10 Steps to Cyber Security"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Operational downtime"
            }
          ]
        },
        {
          "questionId": "LK3",
          "questionType": "single-choice",
          "prompt": "Supplying a hacking tool knowing it will likely be used for unauthorised access relates to:",
          "instruction": "Name the legislation and the relevant duty or offence.",
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
              "text": "Police and Justice Act 2006 amendments (supplying tools for misuse)"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "United Kingdom Cyber Security Strategy only"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Responsible disclosure only"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Lost productivity"
            }
          ]
        },
        {
          "questionId": "LK4",
          "questionType": "single-choice",
          "prompt": "A bare statute name in an examination answer is:",
          "instruction": "Name the legislation and the relevant duty or offence.",
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
              "text": "Always sufficient on its own"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Insufficient without naming the relevant duty or offence"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Better than explaining Northbank context"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Only needed for ethical questions"
            }
          ]
        },
        {
          "questionId": "LK5",
          "questionType": "single-choice",
          "prompt": "After an insider data breach at Northbank, personal data duties mainly come from:",
          "instruction": "Name the legislation and the relevant duty or offence.",
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
              "text": "Computer Misuse Act 1990 alone"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Current United Kingdom data protection legislation"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Cyber Essentials Scheme"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Rules of engagement"
            }
          ]
        },
        {
          "questionId": "LK6",
          "questionType": "single-choice",
          "prompt": "Why must learners keep legislation current?",
          "instruction": "Name the legislation and the relevant duty or offence.",
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
              "text": "Because ethics never change"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Because law and guidance evolve and outdated names or duties lose marks"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Because operational costs are statutes"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Because NCSC exercises replace legislation"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "LK1": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Name legislation and the relevant duty or offence. Guidance schemes are not statutes.",
      "feedbackCorrect": "Correct. Name legislation and the relevant duty or offence. Guidance schemes are not statutes.",
      "feedbackIncorrect": "Name legislation and the relevant duty or offence. Guidance schemes are not statutes.",
      "misconceptionFeedback": "Name legislation and the relevant duty or offence. Guidance schemes are not statutes."
    },
    "LK2": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Unauthorised access offences sit under Computer Misuse Act 1990, not guidance documents.",
      "feedbackCorrect": "Correct. Unauthorised access offences sit under Computer Misuse Act 1990, not guidance documents.",
      "feedbackIncorrect": "Unauthorised access offences sit under Computer Misuse Act 1990, not guidance documents.",
      "misconceptionFeedback": "Unauthorised access offences sit under Computer Misuse Act 1990, not guidance documents."
    },
    "LK3": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Tool supply offences were strengthened through Police and Justice Act 2006 amendments.",
      "feedbackCorrect": "Correct. Tool supply offences were strengthened through Police and Justice Act 2006 amendments.",
      "feedbackIncorrect": "Tool supply offences were strengthened through Police and Justice Act 2006 amendments.",
      "misconceptionFeedback": "Tool supply offences were strengthened through Police and Justice Act 2006 amendments."
    },
    "LK4": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Examiners expect the law plus the duty or offence, applied to the scenario where appropriate.",
      "feedbackCorrect": "Correct. Examiners expect the law plus the duty or offence, applied to the scenario where appropriate.",
      "feedbackIncorrect": "Examiners expect the law plus the duty or offence, applied to the scenario where appropriate.",
      "misconceptionFeedback": "Examiners expect the law plus the duty or offence, applied to the scenario where appropriate."
    },
    "LK5": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Personal data handling duties are under data protection legislation. Computer misuse may also apply to unauthorised access.",
      "feedbackCorrect": "Correct. Personal data handling duties are under data protection legislation. Computer misuse may also apply to unauthorised access.",
      "feedbackIncorrect": "Personal data handling duties are under data protection legislation. Computer misuse may also apply to unauthorised access.",
      "misconceptionFeedback": "Personal data handling duties are under data protection legislation. Computer misuse may also apply to unauthorised access."
    },
    "LK6": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Use current United Kingdom legislation names and accurate duties. Follow tutor and official sources.",
      "feedbackCorrect": "Correct. Use current United Kingdom legislation names and accurate duties. Follow tutor and official sources.",
      "feedbackIncorrect": "Use current United Kingdom legislation names and accurate duties. Follow tutor and official sources.",
      "misconceptionFeedback": "Use current United Kingdom legislation names and accurate duties. Follow tutor and official sources."
    }
  },
  "tutorData": {
    "laws": [
      "Computer Misuse Act 1990",
      "Current United Kingdom data protection legislation",
      "Police and Justice Act 2006 amendments (supplying tools for misuse)"
    ],
    "tutorReviewFlags": [
      "legal-plain-language-only"
    ]
  }
});
