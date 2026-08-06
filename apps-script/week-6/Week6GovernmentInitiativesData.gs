/**
 * Week 6 activity pack.
 */

var WEEK6_PACK_GOVERNMENT_INITIATIVES = Object.freeze({
  "meta": {
    "activityId": "week6-government-initiatives",
    "activityName": "Government Cyber Security Initiatives",
    "weekNumber": 6,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Guided learning",
    "activityVersion": "1.0",
    "maximumScore": 4,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "guided-learning",
    "introduction": "These initiatives are United Kingdom government guidance or programmes. Describe their purpose in examination answers. Do not invent unsupported claims about current certification status or funding.",
    "completionMessage": "Describe purpose in examination answers. Do not treat guidance as criminal legislation."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Government initiatives",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "GIN",
          "blockType": "information",
          "heading": "Teaching note",
          "content": "These initiatives are United Kingdom government guidance or programmes. Describe their purpose in examination answers. Do not invent unsupported claims about current certification status or funding.",
          "displayOrder": 0
        },
        {
          "blockId": "GI_strategy",
          "blockType": "definition",
          "heading": "United Kingdom Cyber Security Strategy",
          "content": "Sets national direction for improving cyber resilience across government, industry and society, prioritising threats and coordinated response.",
          "displayOrder": 1
        },
        {
          "blockId": "GI_essentials",
          "blockType": "definition",
          "heading": "Cyber Essentials Scheme",
          "content": "Provides a baseline set of technical controls and a certification route to help organisations reduce common internet-facing risks.",
          "displayOrder": 2
        },
        {
          "blockId": "GI_tenSteps",
          "blockType": "definition",
          "heading": "10 Steps to Cyber Security",
          "content": "Offers board-level and organisational guidance on essential security areas such as risk management, asset protection and incident response planning.",
          "displayOrder": 3
        },
        {
          "blockId": "GI_streetwise",
          "blockType": "definition",
          "heading": "Cyber Streetwise",
          "content": "A public awareness campaign helping individuals and small organisations adopt safer everyday online habits.",
          "displayOrder": 4
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Initiative comparison",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "GI1",
          "questionType": "single-choice",
          "prompt": "Which initiative is mainly aimed at baseline organisational controls and certification?",
          "instruction": "Government initiatives are guidance or programmes, not criminal statutes.",
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
              "text": "Cyber Essentials Scheme"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Cyber Streetwise"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Police and Justice Act 2006 amendments"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Computer Misuse Act 1990"
            }
          ]
        },
        {
          "questionId": "GI2",
          "questionType": "single-choice",
          "prompt": "Which initiative sets broad national direction rather than day-to-day staff habits alone?",
          "instruction": "Government initiatives are guidance or programmes, not criminal statutes.",
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
              "text": "United Kingdom Cyber Security Strategy"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Cyber Streetwise only"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Responsible disclosure"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Rules of engagement"
            }
          ]
        },
        {
          "questionId": "GI3",
          "questionType": "single-choice",
          "prompt": "10 Steps to Cyber Security is best described as:",
          "instruction": "Government initiatives are guidance or programmes, not criminal statutes.",
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
              "text": "Organisational guidance for leaders on essential security areas"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "A statute creating hacking offences"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "A Northbank patient record system"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Mandatory hardware key standard"
            }
          ]
        },
        {
          "questionId": "GI4",
          "questionType": "single-choice",
          "prompt": "Cyber Streetwise primarily supports:",
          "instruction": "Government initiatives are guidance or programmes, not criminal statutes.",
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
              "text": "Public and small organisation awareness of safer online behaviour"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Prosecution of computer misuse offences"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Penetration testing scope documents"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Insider decision recording during NCSC exercises"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "GI1": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Cyber Essentials Scheme focuses on baseline controls and certification. It is not criminal legislation.",
      "feedbackCorrect": "Correct. Cyber Essentials Scheme focuses on baseline controls and certification. It is not criminal legislation.",
      "feedbackIncorrect": "Cyber Essentials Scheme focuses on baseline controls and certification. It is not criminal legislation.",
      "misconceptionFeedback": "Cyber Essentials Scheme focuses on baseline controls and certification. It is not criminal legislation."
    },
    "GI2": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "The national strategy sets direction across society. Cyber Streetwise targets public awareness at a smaller scale.",
      "feedbackCorrect": "Correct. The national strategy sets direction across society. Cyber Streetwise targets public awareness at a smaller scale.",
      "feedbackIncorrect": "The national strategy sets direction across society. Cyber Streetwise targets public awareness at a smaller scale.",
      "misconceptionFeedback": "The national strategy sets direction across society. Cyber Streetwise targets public awareness at a smaller scale."
    },
    "GI3": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "10 Steps to Cyber Security is guidance for organisations, not a statute.",
      "feedbackCorrect": "Correct. 10 Steps to Cyber Security is guidance for organisations, not a statute.",
      "feedbackIncorrect": "10 Steps to Cyber Security is guidance for organisations, not a statute.",
      "misconceptionFeedback": "10 Steps to Cyber Security is guidance for organisations, not a statute."
    },
    "GI4": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Cyber Streetwise is an awareness campaign for everyday safer behaviour.",
      "feedbackCorrect": "Correct. Cyber Streetwise is an awareness campaign for everyday safer behaviour.",
      "feedbackIncorrect": "Cyber Streetwise is an awareness campaign for everyday safer behaviour.",
      "misconceptionFeedback": "Cyber Streetwise is an awareness campaign for everyday safer behaviour."
    }
  },
  "tutorData": {
    "initiatives": [
      "United Kingdom Cyber Security Strategy",
      "Cyber Essentials Scheme",
      "10 Steps to Cyber Security",
      "Cyber Streetwise"
    ]
  }
});
