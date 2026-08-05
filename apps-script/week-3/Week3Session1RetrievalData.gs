/**
 * Week 3 activity pack.
 */

var WEEK3_PACK_SESSION1_RETRIEVAL = Object.freeze({
  "meta": {
    "activityId": "week3-session1-retrieval",
    "activityName": "Session 1 Retrieval Quiz",
    "weekNumber": 3,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Retrieval quiz",
    "activityVersion": "1.0",
    "maximumScore": 10,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "quiz",
    "introduction": "Retrieve Week 2 knowledge and introduce attacker types.",
    "completionMessage": "Review incorrect answers before Session 1 teaching."
  },
  "sections": [
    {
      "sectionId": "WEEK3_SESSION1_RETRIEVAL_INTRO",
      "sectionType": "learning",
      "title": "Instructions",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "INTRO1",
          "blockType": "information",
          "heading": "Purpose",
          "content": "Session 1 retrieval for Week 3.",
          "displayOrder": 1
        }
      ],
      "questions": []
    },
    {
      "sectionId": "WEEK3_SESSION1_RETRIEVAL_ASSESS",
      "sectionType": "assessment",
      "title": "Assessment",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "S1Q1",
          "questionType": "single-choice",
          "prompt": "Which statement best describes the relationship between a threat and a vulnerability?",
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
              "text": "A threat is a weakness; a vulnerability exploits it"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "A threat exploits a vulnerability to cause a cyber security incident"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "A vulnerability is always a person; a threat is always malware"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Threats and vulnerabilities are the same thing"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S1Q2",
          "questionType": "single-choice",
          "prompt": "An unpatched remote-access service on a Northbank clinic PC is best described as:",
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
              "text": "A threat actor"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "A hardware vulnerability"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "A software vulnerability"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "A cyber-terrorist"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S1Q3",
          "questionType": "single-choice",
          "prompt": "A clinic laptop with no disk encryption is primarily an example of:",
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
              "text": "A hardware vulnerability"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "A phishing campaign"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "An insider threat by definition"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "A vulnerability broker"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S1Q4",
          "questionType": "single-choice",
          "prompt": "Leaving a default administrator password unchanged is best classified as:",
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
              "text": "A human vulnerability only"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "A configuration vulnerability"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "A cyber-criminal"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "A malware category"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S1Q5",
          "questionType": "single-choice",
          "prompt": "A staff member who reuses a simple password for clinical systems demonstrates:",
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
              "text": "A hardware vulnerability"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "A human vulnerability"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "A vulnerability broker"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "A denial-of-service attack"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S1Q6",
          "questionType": "single-choice",
          "prompt": "Ransomware that encrypts files and demands payment is best described as:",
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
              "text": "A social engineering method only"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "A malware category used as a threat"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "A configuration vulnerability"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Authorised penetration testing"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S1Q7",
          "questionType": "single-choice",
          "prompt": "Which pairing correctly matches a threat to a vulnerability?",
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
              "text": "Phishing email exploiting unpatched VPN software to steal credentials"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "Firewall rule exploiting a receptionist"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "Encryption exploiting a ransom note"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "A patch exploiting malware"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S1Q8",
          "questionType": "single-choice",
          "prompt": "Who may choose to exploit a vulnerability at Northbank?",
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
              "text": "Only teenagers"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "Only people outside the organisation"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "External attackers or people with legitimate access, depending on the scenario"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Only vulnerability brokers"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S1Q9",
          "questionType": "single-choice",
          "prompt": "True or false: Every politically motivated cyber attack must be labelled cyber-terrorism in OCR answers.",
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
              "text": "True"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "False"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "S1Q10",
          "questionType": "single-choice",
          "prompt": "Which OCR attacker type best fits someone who uses a cloned Microsoft 365 page to steal staff passwords?",
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
              "text": "Script kiddie"
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
        }
      ]
    }
  ],
  "assessment": {
    "S1Q1": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "A threat exploits a vulnerability to cause an incident.",
      "feedbackIncorrect": "Keep threat (source of harm) separate from vulnerability (weakness)."
    },
    "S1Q2": {
      "correctOptionId": "C",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Missing patches are a software vulnerability.",
      "feedbackIncorrect": "The weakness is in the software state, not the attacker."
    },
    "S1Q3": {
      "correctOptionId": "A",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Lack of encryption on a device is commonly treated as a hardware/device protection weakness in OCR-style classification when the physical device can expose data.",
      "feedbackIncorrect": "Focus on the weakness of the device protection, not who might use it."
    },
    "S1Q4": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Weak or default settings are configuration vulnerabilities.",
      "feedbackIncorrect": "Configuration weaknesses are about how a system is set up."
    },
    "S1Q5": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Unsafe user behaviour is a human vulnerability.",
      "feedbackIncorrect": "Human vulnerabilities concern people and practice."
    },
    "S1Q6": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Ransomware is malware and can be the threat that exploits weaknesses.",
      "feedbackIncorrect": "Malware is malicious software; the vulnerability is what allows it in or to spread."
    },
    "S1Q7": {
      "correctOptionId": "A",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "The phishing/exploit path is the threat action against a weakness (unpatched VPN).",
      "feedbackIncorrect": "Name the weakness and what could exploit it."
    },
    "S1Q8": {
      "correctOptionId": "C",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Attackers can be external or insiders; evidence decides.",
      "feedbackIncorrect": "Do not assume every attacker is external."
    },
    "S1Q9": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Hacktivism and cyber-terrorism differ; use evidence about fear, coercion and essential services.",
      "feedbackIncorrect": "Protest publicity alone is not enough for cyber-terrorist."
    },
    "S1Q10": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Credential harvesting via deceptive login pages indicates a phisher.",
      "feedbackIncorrect": "If the lure collects credentials, phisher is usually stronger than scammer."
    }
  },
  "tutorData": {
    "notes": [
      "Use OCR attacker vocabulary.",
      "Prioritise scenario evidence over stereotypes."
    ]
  }
});
