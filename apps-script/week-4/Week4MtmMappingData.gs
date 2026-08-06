/**
 * Week 4 activity pack.
 */

var WEEK4_PACK_MTM_MAPPING = Object.freeze({
  "meta": {
    "activityId": "week4-mtm-mapping",
    "activityName": "Motivation, Target and Method Mapping",
    "weekNumber": 4,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Scenario mapping",
    "activityVersion": "1.0",
    "maximumScore": 8,
    "allowsPartner": true,
    "enabled": true,
    "componentId": "scenario-mapping",
    "introduction": "Map motivation, target and method for OCR-style practice scenarios. Sustain evidence-based connections.",
    "completionMessage": "Present why, what and how with an explicit connection."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Worked mapping examples",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "MTMBANK",
          "blockType": "information",
          "heading": "Motivation word bank",
          "content": "Espionage; Righting perceived wrongs; Public good; Publicity; Thrill; Fraud; Score settling; Income generation",
          "displayOrder": 1
        },
        {
          "blockId": "MTMTARGETS",
          "blockType": "information",
          "heading": "Target and method banks",
          "content": "Targets: People, Organisations, Equipment, Information. Methods: Social engineering, Phishing, System compromise, Supply-chain compromise, Theft, Damage, Interception, Exfiltration",
          "displayOrder": 2
        },
        {
          "blockId": "MTMW1",
          "blockType": "information",
          "heading": "Worked example: Espionage (worked example)",
          "content": "Scenario: Quiet collection of confidential partnership documents from a Northbank shared drive overnight. No public message is left and no ransom is demanded.\n\nMotivation: Espionage\n\nTarget: Information\n\nMethod: Exfiltration\n\nEvidence: Quiet collection; confidential documents; no publicity or ransom demand.\n\nConnection: Because the attacker wanted secret information advantage, information was a logical target, and exfiltration suited removing copies without seeking attention.\n\nAlternative: Thrill — Thrill is weaker here because the evidence emphasises secrecy and useful documents rather than personal challenge or excitement.\n\nNotice the connection sentence links why → what → how. Listing the three facts alone would only describe, not analyse.",
          "displayOrder": 3
        },
        {
          "blockId": "MTMW2",
          "blockType": "information",
          "heading": "Worked example: High-profile defacement (worked example)",
          "content": "Scenario: Northbank’s public website is changed overnight to display a large protest message about NHS funding. Clinical systems are not encrypted.\n\nMotivation: Publicity\n\nTarget: Organisations\n\nMethod: System compromise\n\nEvidence: Public protest message; high-visibility website; clinical systems left alone.\n\nConnection: Because the attacker wanted the incident noticed, a public organisational website was a logical target, and system compromise of that site suited delivering a visible message.\n\nAlternative: Thrill — Thrill could be discussed, but the protest message and funding theme make publicity the stronger primary motivation.\n\nPublicity seeks notice. Do not collapse this into thrill just because the attacker “showed off”.",
          "displayOrder": 4
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Independent mapping scenarios",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "MAP1MOT",
          "questionType": "single-choice",
          "prompt": "[Espionage — Quiet document collection] An attacker copies confidential supplier-contract files from Northbank systems and leaves no public statement. The copies appear intended for another interested party.\n\nSelect the strongest motivation (why).",
          "instruction": "OCR-style practice scenario — not an official OCR question. Hint: Look for secrecy and information advantage rather than publicity or payment.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "m0",
              "displayOrder": 1,
              "text": "Espionage"
            },
            {
              "optionId": "m1",
              "displayOrder": 2,
              "text": "Righting perceived wrongs"
            },
            {
              "optionId": "m2",
              "displayOrder": 3,
              "text": "Public good"
            },
            {
              "optionId": "m3",
              "displayOrder": 4,
              "text": "Publicity"
            },
            {
              "optionId": "m4",
              "displayOrder": 5,
              "text": "Thrill"
            },
            {
              "optionId": "m5",
              "displayOrder": 6,
              "text": "Fraud"
            },
            {
              "optionId": "m6",
              "displayOrder": 7,
              "text": "Score settling"
            },
            {
              "optionId": "m7",
              "displayOrder": 8,
              "text": "Income generation"
            }
          ]
        },
        {
          "questionId": "MAP1TGT",
          "questionType": "single-choice",
          "prompt": "[Espionage] Select the target category (what).",
          "instruction": "Accepted methods in the model answer include: Exfiltration, System compromise.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "t0",
              "displayOrder": 1,
              "text": "People"
            },
            {
              "optionId": "t1",
              "displayOrder": 2,
              "text": "Organisations"
            },
            {
              "optionId": "t2",
              "displayOrder": 3,
              "text": "Equipment"
            },
            {
              "optionId": "t3",
              "displayOrder": 4,
              "text": "Information"
            }
          ]
        },
        {
          "questionId": "MAP2MOT",
          "questionType": "single-choice",
          "prompt": "[Hacktivism — Cause-driven website message] Northbank’s public site shows a message criticising local health funding. The attackers claim they acted so patients and citizens would notice the issue. Clinical systems are unaffected.\n\nSelect the strongest motivation (why).",
          "instruction": "Ambiguous scenario: more than one motivation may be defensible. Select the strongest primary motivation. Full credit still requires evidence in review.",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "m0",
              "displayOrder": 1,
              "text": "Espionage"
            },
            {
              "optionId": "m1",
              "displayOrder": 2,
              "text": "Righting perceived wrongs"
            },
            {
              "optionId": "m2",
              "displayOrder": 3,
              "text": "Public good"
            },
            {
              "optionId": "m3",
              "displayOrder": 4,
              "text": "Publicity"
            },
            {
              "optionId": "m4",
              "displayOrder": 5,
              "text": "Thrill"
            },
            {
              "optionId": "m5",
              "displayOrder": 6,
              "text": "Fraud"
            },
            {
              "optionId": "m6",
              "displayOrder": 7,
              "text": "Score settling"
            },
            {
              "optionId": "m7",
              "displayOrder": 8,
              "text": "Income generation"
            }
          ]
        },
        {
          "questionId": "MAP2TGT",
          "questionType": "single-choice",
          "prompt": "[Hacktivism] Select the target category (what).",
          "instruction": "Accepted methods in the model answer include: System compromise.",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "t0",
              "displayOrder": 1,
              "text": "People"
            },
            {
              "optionId": "t1",
              "displayOrder": 2,
              "text": "Organisations"
            },
            {
              "optionId": "t2",
              "displayOrder": 3,
              "text": "Equipment"
            },
            {
              "optionId": "t3",
              "displayOrder": 4,
              "text": "Information"
            }
          ]
        },
        {
          "questionId": "MAP3MOT",
          "questionType": "single-choice",
          "prompt": "[Ransomware — Encrypted clinics and payment demand] Clinic booking systems are encrypted and a cryptocurrency payment is demanded to restore access. No political message is published.\n\nSelect the strongest motivation (why).",
          "instruction": "OCR-style practice scenario — not an official OCR question. Hint: Payment demand without deception language points to income generation rather than fraud.",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "m0",
              "displayOrder": 1,
              "text": "Espionage"
            },
            {
              "optionId": "m1",
              "displayOrder": 2,
              "text": "Righting perceived wrongs"
            },
            {
              "optionId": "m2",
              "displayOrder": 3,
              "text": "Public good"
            },
            {
              "optionId": "m3",
              "displayOrder": 4,
              "text": "Publicity"
            },
            {
              "optionId": "m4",
              "displayOrder": 5,
              "text": "Thrill"
            },
            {
              "optionId": "m5",
              "displayOrder": 6,
              "text": "Fraud"
            },
            {
              "optionId": "m6",
              "displayOrder": 7,
              "text": "Score settling"
            },
            {
              "optionId": "m7",
              "displayOrder": 8,
              "text": "Income generation"
            }
          ]
        },
        {
          "questionId": "MAP3TGT",
          "questionType": "single-choice",
          "prompt": "[Ransomware] Select the target category (what).",
          "instruction": "Accepted methods in the model answer include: System compromise.",
          "marks": 1,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "t0",
              "displayOrder": 1,
              "text": "People"
            },
            {
              "optionId": "t1",
              "displayOrder": 2,
              "text": "Organisations"
            },
            {
              "optionId": "t2",
              "displayOrder": 3,
              "text": "Equipment"
            },
            {
              "optionId": "t3",
              "displayOrder": 4,
              "text": "Information"
            }
          ]
        },
        {
          "questionId": "MAP4MOT",
          "questionType": "single-choice",
          "prompt": "[High-profile defacement — Visible protest banner] A high-visibility banner is placed on Northbank’s homepage overnight so that anyone visiting the site sees a protest slogan. Staff later find the change came through a compromised web account.\n\nSelect the strongest motivation (why).",
          "instruction": "OCR-style practice scenario — not an official OCR question. Hint: Wanting visitors to see a slogan supports publicity as why.",
          "marks": 1,
          "required": true,
          "displayOrder": 7,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "m0",
              "displayOrder": 1,
              "text": "Espionage"
            },
            {
              "optionId": "m1",
              "displayOrder": 2,
              "text": "Righting perceived wrongs"
            },
            {
              "optionId": "m2",
              "displayOrder": 3,
              "text": "Public good"
            },
            {
              "optionId": "m3",
              "displayOrder": 4,
              "text": "Publicity"
            },
            {
              "optionId": "m4",
              "displayOrder": 5,
              "text": "Thrill"
            },
            {
              "optionId": "m5",
              "displayOrder": 6,
              "text": "Fraud"
            },
            {
              "optionId": "m6",
              "displayOrder": 7,
              "text": "Score settling"
            },
            {
              "optionId": "m7",
              "displayOrder": 8,
              "text": "Income generation"
            }
          ]
        },
        {
          "questionId": "MAP4TGT",
          "questionType": "single-choice",
          "prompt": "[High-profile defacement] Select the target category (what).",
          "instruction": "Accepted methods in the model answer include: System compromise.",
          "marks": 1,
          "required": true,
          "displayOrder": 8,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "t0",
              "displayOrder": 1,
              "text": "People"
            },
            {
              "optionId": "t1",
              "displayOrder": 2,
              "text": "Organisations"
            },
            {
              "optionId": "t2",
              "displayOrder": 3,
              "text": "Equipment"
            },
            {
              "optionId": "t3",
              "displayOrder": 4,
              "text": "Information"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "MAP1MOT": {
      "correctOptionId": "m0",
      "acceptedOptionIds": [
        "m0"
      ],
      "autoMark": true,
      "scoringMode": "exact",
      "requiresEvidence": false,
      "explanation": "Primary method: Exfiltration. Accepted motivations: Espionage. Look for secrecy and information advantage rather than publicity or payment."
    },
    "MAP1TGT": {
      "correctOptionId": "t3",
      "acceptedOptionIds": [
        "t1",
        "t3"
      ],
      "autoMark": true,
      "scoringMode": "rubric",
      "explanation": "Primary target: Information. Accepted targets: Information, Organisations. Method model points: Exfiltration, System compromise"
    },
    "MAP2MOT": {
      "correctOptionId": "m3",
      "acceptedOptionIds": [
        "m1",
        "m2",
        "m3"
      ],
      "autoMark": false,
      "scoringMode": "rubric",
      "requiresEvidence": true,
      "explanation": "Primary method: System compromise. Accepted motivations: Publicity, Public good, Righting perceived wrongs. At least two motivations can be defensible; explain the connection rather than only naming labels."
    },
    "MAP2TGT": {
      "correctOptionId": "t1",
      "acceptedOptionIds": [
        "t1"
      ],
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Primary target: Organisations. Accepted targets: Organisations. Method model points: System compromise"
    },
    "MAP3MOT": {
      "correctOptionId": "m7",
      "acceptedOptionIds": [
        "m7"
      ],
      "autoMark": true,
      "scoringMode": "exact",
      "requiresEvidence": false,
      "explanation": "Primary method: System compromise. Accepted motivations: Income generation. Payment demand without deception language points to income generation rather than fraud."
    },
    "MAP3TGT": {
      "correctOptionId": "t1",
      "acceptedOptionIds": [
        "t1",
        "t3"
      ],
      "autoMark": true,
      "scoringMode": "rubric",
      "explanation": "Primary target: Organisations. Accepted targets: Organisations, Information. Method model points: System compromise"
    },
    "MAP4MOT": {
      "correctOptionId": "m3",
      "acceptedOptionIds": [
        "m3"
      ],
      "autoMark": true,
      "scoringMode": "exact",
      "requiresEvidence": false,
      "explanation": "Primary method: System compromise. Accepted motivations: Publicity. Wanting visitors to see a slogan supports publicity as why."
    },
    "MAP4TGT": {
      "correctOptionId": "t1",
      "acceptedOptionIds": [
        "t1"
      ],
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Primary target: Organisations. Accepted targets: Organisations. Method model points: System compromise"
    }
  },
  "tutorData": {
    "workedRows": [
      {
        "id": "worked-1",
        "theme": "Espionage (worked example)",
        "scenario": "Quiet collection of confidential partnership documents from a Northbank shared drive overnight. No public message is left and no ransom is demanded.",
        "motivation": "Espionage",
        "target": "Information",
        "method": "Exfiltration",
        "evidence": "Quiet collection; confidential documents; no publicity or ransom demand.",
        "connection": "Because the attacker wanted secret information advantage, information was a logical target, and exfiltration suited removing copies without seeking attention.",
        "alternative": "Thrill",
        "alternativeWhy": "Thrill is weaker here because the evidence emphasises secrecy and useful documents rather than personal challenge or excitement.",
        "teachingNote": "Notice the connection sentence links why → what → how. Listing the three facts alone would only describe, not analyse."
      },
      {
        "id": "worked-2",
        "theme": "High-profile defacement (worked example)",
        "scenario": "Northbank’s public website is changed overnight to display a large protest message about NHS funding. Clinical systems are not encrypted.",
        "motivation": "Publicity",
        "target": "Organisations",
        "method": "System compromise",
        "evidence": "Public protest message; high-visibility website; clinical systems left alone.",
        "connection": "Because the attacker wanted the incident noticed, a public organisational website was a logical target, and system compromise of that site suited delivering a visible message.",
        "alternative": "Thrill",
        "alternativeWhy": "Thrill could be discussed, but the protest message and funding theme make publicity the stronger primary motivation.",
        "teachingNote": "Publicity seeks notice. Do not collapse this into thrill just because the attacker “showed off”."
      }
    ],
    "scenarios": [
      {
        "id": "map-espionage",
        "theme": "Espionage",
        "title": "Quiet document collection",
        "scenario": "An attacker copies confidential supplier-contract files from Northbank systems and leaves no public statement. The copies appear intended for another interested party.",
        "acceptedMotivations": [
          "Espionage"
        ],
        "acceptedTargets": [
          "Information",
          "Organisations"
        ],
        "acceptedMethods": [
          "Exfiltration",
          "System compromise"
        ],
        "primaryMotivation": "Espionage",
        "primaryTarget": "Information",
        "primaryMethod": "Exfiltration",
        "ambiguous": false,
        "hint": "Look for secrecy and information advantage rather than publicity or payment."
      },
      {
        "id": "map-hacktivism",
        "theme": "Hacktivism",
        "title": "Cause-driven website message",
        "scenario": "Northbank’s public site shows a message criticising local health funding. The attackers claim they acted so patients and citizens would notice the issue. Clinical systems are unaffected.",
        "acceptedMotivations": [
          "Publicity",
          "Public good",
          "Righting perceived wrongs"
        ],
        "acceptedTargets": [
          "Organisations"
        ],
        "acceptedMethods": [
          "System compromise"
        ],
        "primaryMotivation": "Publicity",
        "primaryTarget": "Organisations",
        "primaryMethod": "System compromise",
        "ambiguous": true,
        "ambiguousNote": "Publicity is strongly supported by wanting the incident noticed. Public good or righting perceived wrongs may also be defensible if you use the claim about patients and citizens — explain which evidence you rely on.",
        "hint": "At least two motivations can be defensible; explain the connection rather than only naming labels."
      },
      {
        "id": "map-ransomware",
        "theme": "Ransomware",
        "title": "Encrypted clinics and payment demand",
        "scenario": "Clinic booking systems are encrypted and a cryptocurrency payment is demanded to restore access. No political message is published.",
        "acceptedMotivations": [
          "Income generation"
        ],
        "acceptedTargets": [
          "Organisations",
          "Information"
        ],
        "acceptedMethods": [
          "System compromise"
        ],
        "primaryMotivation": "Income generation",
        "primaryTarget": "Organisations",
        "primaryMethod": "System compromise",
        "ambiguous": false,
        "hint": "Payment demand without deception language points to income generation rather than fraud."
      },
      {
        "id": "map-defacement",
        "theme": "High-profile defacement",
        "title": "Visible protest banner",
        "scenario": "A high-visibility banner is placed on Northbank’s homepage overnight so that anyone visiting the site sees a protest slogan. Staff later find the change came through a compromised web account.",
        "acceptedMotivations": [
          "Publicity"
        ],
        "acceptedTargets": [
          "Organisations"
        ],
        "acceptedMethods": [
          "System compromise"
        ],
        "primaryMotivation": "Publicity",
        "primaryTarget": "Organisations",
        "primaryMethod": "System compromise",
        "ambiguous": false,
        "hint": "Wanting visitors to see a slogan supports publicity as why."
      }
    ],
    "presentationChecklist": [
      "State the motivation (why)",
      "State the target (what)",
      "State the method (how)",
      "Explain why the motivation made that target logical",
      "Explain why the selected method suited the target"
    ],
    "presentationOptions": [
      "Verbal two-minute explanation",
      "Slide-based explanation",
      "Annotated diagram"
    ]
  }
});
