/**
 * Week 4 activity pack.
 */

var WEEK4_PACK_TARGETS_METHODS = Object.freeze({
  "meta": {
    "activityId": "week4-targets-methods",
    "activityName": "Targets and Methods",
    "weekNumber": 4,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Classification",
    "activityVersion": "1.0",
    "maximumScore": 8,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "classification",
    "introduction": "Classify statements as motivation, target or method using OCR Week 4 categories only.",
    "completionMessage": "People, organisations, equipment and information are the only target categories."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Targets and methods",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "TMINTRO",
          "blockType": "information",
          "heading": "Four target categories",
          "content": "People → social engineering, phishing. Organisations → system compromise, supply-chain compromise. Equipment → theft, damage. Information → interception, exfiltration.",
          "displayOrder": 0
        },
        {
          "blockId": "TGT1",
          "blockType": "information",
          "heading": "people",
          "content": "Target category: undefined. Methods: Social engineering; Phishing. People are targeted when the attacker manipulates human trust or behaviour.",
          "displayOrder": 1
        },
        {
          "blockId": "TGT2",
          "blockType": "information",
          "heading": "organisations",
          "content": "Target category: undefined. Methods: System compromise; Supply-chain compromise. Organisations are targeted when systems, processes or trusted suppliers are compromised.",
          "displayOrder": 2
        },
        {
          "blockId": "TGT3",
          "blockType": "information",
          "heading": "equipment",
          "content": "Target category: undefined. Methods: Theft; Damage. Equipment is targeted when devices or hardware are stolen or physically harmed.",
          "displayOrder": 3
        },
        {
          "blockId": "TGT4",
          "blockType": "information",
          "heading": "information",
          "content": "Target category: undefined. Methods: Interception; Exfiltration. Information is targeted when data is intercepted in transit or taken from systems.",
          "displayOrder": 4
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Classification check",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "TM1",
          "questionType": "single-choice",
          "prompt": "The attacker wanted to raise awareness of a protest message.",
          "instruction": "Classify as motivation (why), target (what) or method (how).",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "motivation",
              "displayOrder": 1,
              "text": "Motivation"
            },
            {
              "optionId": "target",
              "displayOrder": 2,
              "text": "Target"
            },
            {
              "optionId": "method",
              "displayOrder": 3,
              "text": "Method"
            }
          ]
        },
        {
          "questionId": "TM2",
          "questionType": "single-choice",
          "prompt": "Reception staff were targeted with fake payroll emails.",
          "instruction": "Classify as motivation (why), target (what) or method (how).",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "motivation",
              "displayOrder": 1,
              "text": "Motivation"
            },
            {
              "optionId": "target",
              "displayOrder": 2,
              "text": "Target"
            },
            {
              "optionId": "method",
              "displayOrder": 3,
              "text": "Method"
            }
          ]
        },
        {
          "questionId": "TM3",
          "questionType": "single-choice",
          "prompt": "The attacker used phishing to collect login details.",
          "instruction": "Classify as motivation (why), target (what) or method (how).",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "motivation",
              "displayOrder": 1,
              "text": "Motivation"
            },
            {
              "optionId": "target",
              "displayOrder": 2,
              "text": "Target"
            },
            {
              "optionId": "method",
              "displayOrder": 3,
              "text": "Method"
            }
          ]
        },
        {
          "questionId": "TM4",
          "questionType": "single-choice",
          "prompt": "A clinic laptop was stolen from an unlocked room.",
          "instruction": "Classify as motivation (why), target (what) or method (how).",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "motivation",
              "displayOrder": 1,
              "text": "Motivation"
            },
            {
              "optionId": "target",
              "displayOrder": 2,
              "text": "Target"
            },
            {
              "optionId": "method",
              "displayOrder": 3,
              "text": "Method"
            }
          ]
        },
        {
          "questionId": "TM5",
          "questionType": "single-choice",
          "prompt": "Patient appointment records were copied out of the system.",
          "instruction": "Classify as motivation (why), target (what) or method (how).",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "motivation",
              "displayOrder": 1,
              "text": "Motivation"
            },
            {
              "optionId": "target",
              "displayOrder": 2,
              "text": "Target"
            },
            {
              "optionId": "method",
              "displayOrder": 3,
              "text": "Method"
            }
          ]
        },
        {
          "questionId": "TM6",
          "questionType": "single-choice",
          "prompt": "The attacker aimed to generate income through a ransom demand.",
          "instruction": "Classify as motivation (why), target (what) or method (how).",
          "marks": 1,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "motivation",
              "displayOrder": 1,
              "text": "Motivation"
            },
            {
              "optionId": "target",
              "displayOrder": 2,
              "text": "Target"
            },
            {
              "optionId": "method",
              "displayOrder": 3,
              "text": "Method"
            }
          ]
        },
        {
          "questionId": "TM7",
          "questionType": "single-choice",
          "prompt": "A trusted supplier portal was compromised to reach Northbank systems.",
          "instruction": "Classify as motivation (why), target (what) or method (how).",
          "marks": 1,
          "required": true,
          "displayOrder": 7,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "motivation",
              "displayOrder": 1,
              "text": "Motivation"
            },
            {
              "optionId": "target",
              "displayOrder": 2,
              "text": "Target"
            },
            {
              "optionId": "method",
              "displayOrder": 3,
              "text": "Method"
            }
          ]
        },
        {
          "questionId": "TM8",
          "questionType": "single-choice",
          "prompt": "The main thing attacked was the organisation’s booking systems.",
          "instruction": "Classify as motivation (why), target (what) or method (how).",
          "marks": 1,
          "required": true,
          "displayOrder": 8,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "motivation",
              "displayOrder": 1,
              "text": "Motivation"
            },
            {
              "optionId": "target",
              "displayOrder": 2,
              "text": "Target"
            },
            {
              "optionId": "method",
              "displayOrder": 3,
              "text": "Method"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "TM1": {
      "correctOptionId": "motivation",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "This describes why the attacker acted (publicity)."
    },
    "TM2": {
      "correctOptionId": "target",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "People are the target category. Phishing would be the method."
    },
    "TM3": {
      "correctOptionId": "method",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Phishing describes how the attack was carried out."
    },
    "TM4": {
      "correctOptionId": "method",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Theft is a method used against equipment. The equipment is the target."
    },
    "TM5": {
      "correctOptionId": "method",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Exfiltration describes how information was taken. Information is the target."
    },
    "TM6": {
      "correctOptionId": "motivation",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Income generation is why the attacker acted. Ransomware language alone is not the motivation label."
    },
    "TM7": {
      "correctOptionId": "method",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Supply-chain compromise is a method used against an organisation target."
    },
    "TM8": {
      "correctOptionId": "target",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Organisations (and their systems) are what was targeted."
    }
  },
  "tutorData": {
    "targetCategories": [
      {
        "id": "people",
        "term": "People",
        "methods": [
          "Social engineering",
          "Phishing"
        ],
        "explanation": "People are targeted when the attacker manipulates human trust or behaviour."
      },
      {
        "id": "organisations",
        "term": "Organisations",
        "methods": [
          "System compromise",
          "Supply-chain compromise"
        ],
        "explanation": "Organisations are targeted when systems, processes or trusted suppliers are compromised."
      },
      {
        "id": "equipment",
        "term": "Equipment",
        "methods": [
          "Theft",
          "Damage"
        ],
        "explanation": "Equipment is targeted when devices or hardware are stolen or physically harmed."
      },
      {
        "id": "information",
        "term": "Information",
        "methods": [
          "Interception",
          "Exfiltration"
        ],
        "explanation": "Information is targeted when data is intercepted in transit or taken from systems."
      }
    ],
    "whyWhatHow": {
      "why": "Motivation — why the attacker acted",
      "what": "Target — what was attacked",
      "how": "Method — how the attack was conducted"
    }
  }
});
