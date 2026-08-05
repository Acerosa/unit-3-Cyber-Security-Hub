/**
 * Week 3 activity pack.
 */

var WEEK3_PACK_SESSION2_RETRIEVAL = Object.freeze({
  "meta": {
    "activityId": "week3-session2-retrieval",
    "activityName": "Session 2 Retrieval Quiz",
    "weekNumber": 3,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Retrieval quiz",
    "activityVersion": "1.0",
    "maximumScore": 12,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "quiz",
    "introduction": "Practise attacker-type distinctions.",
    "completionMessage": "Review explanations for any incorrect items."
  },
  "sections": [
    {
      "sectionId": "WEEK3_SESSION2_RETRIEVAL_INTRO",
      "sectionType": "learning",
      "title": "Instructions",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "INTRO1",
          "blockType": "information",
          "heading": "Purpose",
          "content": "Session 2 retrieval for Week 3.",
          "displayOrder": 1
        }
      ],
      "questions": []
    },
    {
      "sectionId": "WEEK3_SESSION2_RETRIEVAL_ASSESS",
      "sectionType": "assessment",
      "title": "Assessment",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "S2Q1",
          "questionType": "single-choice",
          "prompt": "Which definition best matches a script kiddie?",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "An organised attacker seeking ransom profit"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "An inexperienced attacker using ready-made tools"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "A staff member with legitimate access"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "A researcher selling only lawful bounties"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S2Q2",
          "questionType": "single-choice",
          "prompt": "A finance team is tricked into paying a false invoice. Most likely attacker type?",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "Phisher"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "Scammer"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "Cyber-terrorist"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Vulnerability broker"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S2Q3",
          "questionType": "single-choice",
          "prompt": "Why can insider misuse be difficult to detect?",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "Insiders never leave logs"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "Legitimate access can look like normal work"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "Insiders cannot access data"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Insiders are always external contractors"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S2Q4",
          "questionType": "single-choice",
          "prompt": "A researcher discloses a flaw through a vendor bug bounty. Best label?",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "Cyber-criminal by default"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "Vulnerability broker (lawful disclosure context)"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "Hacktivist"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Script kiddie"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S2Q5",
          "questionType": "single-choice",
          "prompt": "Which distinction is most accurate?",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "Hacktivist seeks protest/publicity; cyber-terrorist seeks fear/coercion, often via essential services"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "They are identical OCR terms"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "Hacktivists always target hospitals; cyber-terrorists never do"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Cyber-terrorists only send invoices"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S2Q6",
          "questionType": "single-choice",
          "prompt": "Which is scenario evidence rather than a stereotype?",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "The attacker must be young"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "The attacker used a staff account during working hours to export records"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "The attacker lives abroad"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "The attacker likes gaming"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S2Q7",
          "questionType": "single-choice",
          "prompt": "Authorised penetration testing differs from malicious attacking mainly because of:",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 7,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "The tools used"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "Permission, scope and rules of engagement"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "Whether Python is used"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Whether the tester is employed full-time"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S2Q8",
          "questionType": "single-choice",
          "prompt": "Organised ransomware for cryptocurrency most strongly indicates:",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 8,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "Script kiddie"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "Cyber-criminal"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "Scammer only"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Insider by definition"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S2Q9",
          "questionType": "single-choice",
          "prompt": "A cloned login page harvesting passwords is stronger evidence for:",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 9,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "Scammer"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "Phisher"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "Vulnerability broker"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Cyber-terrorist"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S2Q10",
          "questionType": "single-choice",
          "prompt": "An outsourced IT contractor uses approved admin rights to maintain servers. This alone means:",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 10,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "They are an insider threat incident"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "They have legitimate access that must be controlled with least privilege"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "They are a cyber-terrorist"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "They are a script kiddie"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S2Q11",
          "questionType": "single-choice",
          "prompt": "White hat / grey hat / black hat terms in OCR answers should:",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 11,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "Replace the eight OCR attacker types"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "Only be used if the question asks about industry vocabulary; otherwise use OCR types"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "Always be preferred"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Be used instead of “insider”"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S2Q12",
          "questionType": "single-choice",
          "prompt": "Best reason a vulnerability broker case is less likely cyber-criminal:",
          "instruction": "Select the best answer.",
          "marks": 1,
          "required": true,
          "displayOrder": 12,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 1,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "A",
              "displayOrder": 1,
              "text": "Brokers are never paid"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "The scenario focuses on disclosing/trading a flaw rather than ransoming systems for profit"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "Brokers are always staff"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Cyber-criminals never use vulnerabilities"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        }
      ]
    }
  ],
  "assessment": {
    "S2Q1": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Script kiddies rely on tools written by others.",
      "feedbackIncorrect": "Do not use age stereotypes."
    },
    "S2Q2": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Immediate fraudulent payment points to a scammer.",
      "feedbackIncorrect": "Credential theft would lean towards phisher."
    },
    "S2Q3": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Authorised activity may resemble misuse without careful monitoring.",
      "feedbackIncorrect": "Least privilege and auditing help."
    },
    "S2Q4": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Bug bounty/disclosure evidence supports vulnerability broker, not automatic criminality.",
      "feedbackIncorrect": "Brokers are not always criminals."
    },
    "S2Q5": {
      "correctOptionId": "A",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Use motivation and impact evidence.",
      "feedbackIncorrect": "Avoid stereotypes."
    },
    "S2Q6": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Account use and export behaviour are scenario evidence.",
      "feedbackIncorrect": "Reject age/location stereotypes."
    },
    "S2Q7": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Authorisation and agreed rules define lawful testing.",
      "feedbackIncorrect": "Tools alone do not decide."
    },
    "S2Q8": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Profit-seeking ransomware is classic cyber-criminal evidence.",
      "feedbackIncorrect": "Script kiddie lacks organised profit focus."
    },
    "S2Q9": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Credential harvesting indicates phisher.",
      "feedbackIncorrect": "False invoices without credential theft lean scammer."
    },
    "S2Q10": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Legitimate access is not itself misconduct.",
      "feedbackIncorrect": "Focus on risk and controls."
    },
    "S2Q11": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "OCR types remain the examination vocabulary.",
      "feedbackIncorrect": "Industry hats are supplementary."
    },
    "S2Q12": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Purpose and method evidence separate the labels.",
      "feedbackIncorrect": "Unlawful markets can still be criminal — use the given evidence."
    }
  },
  "tutorData": {
    "notes": [
      "Use OCR attacker vocabulary.",
      "Prioritise scenario evidence over stereotypes."
    ]
  }
});
