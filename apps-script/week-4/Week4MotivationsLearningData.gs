/**
 * Week 4 activity pack.
 */

var WEEK4_PACK_MOTIVATIONS_LEARNING = Object.freeze({
  "meta": {
    "activityId": "week4-motivations-learning",
    "activityName": "Motivations for Attack",
    "weekNumber": 4,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Guided learning",
    "activityVersion": "1.0",
    "maximumScore": 8,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "guided-learning",
    "introduction": "Learn the eight OCR attacker motivations. Motivation = why. Do not confuse motivations with methods.",
    "completionMessage": "You can distinguish fraud from income generation and publicity from thrill."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Eight motivations",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "MOTDIST",
          "blockType": "information",
          "heading": "Why, what and how",
          "content": "Motivation = why. Target = what. Method = how. Misconceptions: answering with a method; treating fraud and income generation as identical; collapsing thrill and publicity; assuming the target is always an organisation.",
          "displayOrder": 0
        },
        {
          "blockId": "MOT1",
          "blockType": "information",
          "heading": "Espionage",
          "content": "Definition: Gathering confidential information secretly for a state, competitor or other interested party.\n\nExplanation: The attacker wants information advantage, not necessarily publicity or immediate payment.\n\nEvidence: Quiet collection of sensitive data; focus on secrecy; interest in strategic or commercial intelligence.\n\nTest question: Did the attacker want information that others did not intend to share, without drawing attention?\n\nMisconception: Assuming espionage always seeks publicity\n\nCorrective feedback: Keep motivation (why) separate from method (how).",
          "displayOrder": 1
        },
        {
          "blockId": "MOT2",
          "blockType": "information",
          "heading": "Righting perceived wrongs",
          "content": "Definition: Acting because the attacker believes an injustice needs to be corrected.\n\nExplanation: The driver is a grievance or sense of unfairness, whether or not others agree with that view.\n\nEvidence: Statements about injustice; targeting linked to a dispute; emphasis on making something “right”.\n\nTest question: Was the attacker mainly trying to correct something they believed was unfair?\n\nMisconception: Treating any protest as cyber-terrorism\n\nCorrective feedback: Keep motivation (why) separate from method (how).",
          "displayOrder": 2
        },
        {
          "blockId": "MOT3",
          "blockType": "information",
          "heading": "Public good",
          "content": "Definition: Claiming to act for the benefit of society, patients, citizens or the wider public.\n\nExplanation: A claimed public-good motive does not make the act lawful. Learners still separate motivation from legality.\n\nEvidence: Claims about protecting the public; disclosures framed as warnings; statements about patient or citizen benefit.\n\nTest question: Did the attacker claim the main reason for acting was to benefit the public?\n\nMisconception: Assuming a claimed public-good motive makes the act lawful\n\nCorrective feedback: Keep motivation (why) separate from method (how).",
          "displayOrder": 3
        },
        {
          "blockId": "MOT4",
          "blockType": "information",
          "heading": "Publicity",
          "content": "Definition: Seeking attention, visibility or awareness for a message, group or cause.\n\nExplanation: Publicity is about being noticed. It is not the same as thrill-seeking for personal excitement.\n\nEvidence: Defacement messages; media contact; timing chosen for maximum visibility.\n\nTest question: Did the attacker want the incident to be noticed?\n\nMisconception: Collapsing publicity into thrill\n\nCorrective feedback: Keep motivation (why) separate from method (how).",
          "displayOrder": 4
        },
        {
          "blockId": "MOT5",
          "blockType": "information",
          "heading": "Thrill",
          "content": "Definition: Acting mainly for excitement, challenge or personal enjoyment.\n\nExplanation: Thrill focuses on the experience of the attack, not necessarily on a public message.\n\nEvidence: Boasting in private channels; focus on difficulty of the challenge; little coherent public cause.\n\nTest question: Was the main reason personal excitement or challenge rather than a public message or profit?\n\nMisconception: Collapsing thrill into publicity\n\nCorrective feedback: Keep motivation (why) separate from method (how).",
          "displayOrder": 5
        },
        {
          "blockId": "MOT6",
          "blockType": "information",
          "heading": "Fraud",
          "content": "Definition: Gaining money or advantage through deception.\n\nExplanation: Fraud requires deception. It is not identical to every form of income generation.\n\nEvidence: Fake invoices; spoofed identity; tricking staff into transferring funds or credentials.\n\nTest question: Did the attacker use deception to obtain money or another advantage?\n\nMisconception: Treating fraud as identical to income generation\n\nCorrective feedback: Keep motivation (why) separate from method (how).",
          "displayOrder": 6
        },
        {
          "blockId": "MOT7",
          "blockType": "information",
          "heading": "Score settling",
          "content": "Definition: Acting to punish, retaliate or get even with a person or organisation.\n\nExplanation: The driver is revenge or retaliation linked to a prior conflict.\n\nEvidence: Prior dispute; personal targeting; messages about payback.\n\nTest question: Was the attacker mainly trying to retaliate against someone or something?\n\nMisconception: Assuming revenge is always personal rather than organisational\n\nCorrective feedback: Keep motivation (why) separate from method (how).",
          "displayOrder": 7
        },
        {
          "blockId": "MOT8",
          "blockType": "information",
          "heading": "Income generation",
          "content": "Definition: Seeking financial gain, which may or may not involve deception.\n\nExplanation: Income generation does not always require deception. Ransomware payment demands can be income generation without the same deception pattern as invoice fraud.\n\nEvidence: Ransom demands; sale of stolen data; repeated monetisation patterns.\n\nTest question: Was the primary aim to make money, whether or not deception was used?\n\nMisconception: Assuming all income generation requires deception\n\nCorrective feedback: Keep motivation (why) separate from method (how).",
          "displayOrder": 8
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Motivation knowledge check",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "MOTKC1",
          "questionType": "single-choice",
          "prompt": "Which statement is a motivation rather than a method?",
          "instruction": "Choose the strongest answer using Week 4 terminology.",
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
              "text": "The attacker used phishing emails"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "The attacker wanted publicity for a protest message"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "The attacker intercepted network traffic"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "The attacker damaged clinic equipment"
            }
          ]
        },
        {
          "questionId": "MOTKC2",
          "questionType": "single-choice",
          "prompt": "Why is fraud not identical to income generation?",
          "instruction": "Choose the strongest answer using Week 4 terminology.",
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
              "text": "Fraud never involves money"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Fraud requires deception; income generation may involve no deception"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Income generation is always illegal and fraud is not"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "They are identical OCR motivations"
            }
          ]
        },
        {
          "questionId": "MOTKC3",
          "questionType": "single-choice",
          "prompt": "An attacker defaces a public website overnight so a protest message is widely seen. The best primary motivation is:",
          "instruction": "Choose the strongest answer using Week 4 terminology.",
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
              "text": "Thrill"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Publicity"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Espionage"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Phishing"
            }
          ]
        },
        {
          "questionId": "MOTKC4",
          "questionType": "single-choice",
          "prompt": "An attacker quietly copies confidential partnership documents without seeking attention. The best primary motivation is:",
          "instruction": "Choose the strongest answer using Week 4 terminology.",
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
              "text": "Publicity"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Thrill"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Espionage"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Social engineering"
            }
          ]
        },
        {
          "questionId": "MOTKC5",
          "questionType": "single-choice",
          "prompt": "Clinic systems are encrypted and a cryptocurrency payment is demanded to restore access. The best primary motivation is:",
          "instruction": "Choose the strongest answer using Week 4 terminology.",
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
              "text": "Public good"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Income generation"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Publicity"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Exfiltration"
            }
          ]
        },
        {
          "questionId": "MOTKC6",
          "questionType": "single-choice",
          "prompt": "Which feedback best describes answering “phishing” to a motivation question?",
          "instruction": "Choose the strongest answer using Week 4 terminology.",
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
              "text": "This describes why the attacker acted"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "This describes how the attack was carried out"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "This describes what was attacked"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "This is always an accepted motivation term"
            }
          ]
        },
        {
          "questionId": "MOTKC7",
          "questionType": "single-choice",
          "prompt": "A former contractor damages equipment after a heated dispute with managers. The best primary motivation is:",
          "instruction": "Choose the strongest answer using Week 4 terminology.",
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
              "text": "Score settling"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Espionage"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Fraud"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Theft"
            }
          ]
        },
        {
          "questionId": "MOTKC8",
          "questionType": "single-choice",
          "prompt": "Which statement is true?",
          "instruction": "Choose the strongest answer using Week 4 terminology.",
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
              "text": "More than one motivation may be defensible when the evidence supports it"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Only one motivation can ever be discussed in an OCR answer"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Motivation and method are interchangeable terms"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Targets are always organisations"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "MOTKC1": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Wanting publicity describes why the attacker acted. Phishing, interception and damage describe how or what was attacked.",
      "feedbackIncorrect": "Review motivation (why), target (what) and method (how), then try again."
    },
    "MOTKC2": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Fraud involves deception. Income generation may involve no deception, for example a ransom demand that does not rely on tricking someone with a fake identity.",
      "feedbackIncorrect": "Review motivation (why), target (what) and method (how), then try again."
    },
    "MOTKC3": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Wanting the incident noticed supports publicity. Thrill is personal excitement; espionage seeks secrecy; phishing is a method, not a motivation.",
      "feedbackIncorrect": "Review motivation (why), target (what) and method (how), then try again."
    },
    "MOTKC4": {
      "correctOptionId": "c",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Quiet collection of confidential information without publicity fits espionage. Social engineering is a method.",
      "feedbackIncorrect": "Review motivation (why), target (what) and method (how), then try again."
    },
    "MOTKC5": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "A ransom demand shows income generation. Exfiltration is a method. Publicity is weaker if the main aim is payment rather than attention.",
      "feedbackIncorrect": "Review motivation (why), target (what) and method (how), then try again."
    },
    "MOTKC6": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Phishing describes how the attacker acts. It is a method, not a motivation.",
      "feedbackIncorrect": "Review motivation (why), target (what) and method (how), then try again."
    },
    "MOTKC7": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Retaliation after a dispute fits score settling. Theft is a method against equipment.",
      "feedbackIncorrect": "Review motivation (why), target (what) and method (how), then try again."
    },
    "MOTKC8": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Where evidence supports more than one motivation, more than one answer may be defensible. Learners must still explain the connection to target and method.",
      "feedbackIncorrect": "Review motivation (why), target (what) and method (how), then try again."
    }
  },
  "tutorData": {
    "motivations": [
      {
        "id": "espionage",
        "term": "Espionage",
        "definition": "Gathering confidential information secretly for a state, competitor or other interested party.",
        "explanation": "The attacker wants information advantage, not necessarily publicity or immediate payment.",
        "evidence": "Quiet collection of sensitive data; focus on secrecy; interest in strategic or commercial intelligence.",
        "testQuestion": "Did the attacker want information that others did not intend to share, without drawing attention?"
      },
      {
        "id": "righting-wrongs",
        "term": "Righting perceived wrongs",
        "definition": "Acting because the attacker believes an injustice needs to be corrected.",
        "explanation": "The driver is a grievance or sense of unfairness, whether or not others agree with that view.",
        "evidence": "Statements about injustice; targeting linked to a dispute; emphasis on making something “right”.",
        "testQuestion": "Was the attacker mainly trying to correct something they believed was unfair?"
      },
      {
        "id": "public-good",
        "term": "Public good",
        "definition": "Claiming to act for the benefit of society, patients, citizens or the wider public.",
        "explanation": "A claimed public-good motive does not make the act lawful. Learners still separate motivation from legality.",
        "evidence": "Claims about protecting the public; disclosures framed as warnings; statements about patient or citizen benefit.",
        "testQuestion": "Did the attacker claim the main reason for acting was to benefit the public?"
      },
      {
        "id": "publicity",
        "term": "Publicity",
        "definition": "Seeking attention, visibility or awareness for a message, group or cause.",
        "explanation": "Publicity is about being noticed. It is not the same as thrill-seeking for personal excitement.",
        "evidence": "Defacement messages; media contact; timing chosen for maximum visibility.",
        "testQuestion": "Did the attacker want the incident to be noticed?"
      },
      {
        "id": "thrill",
        "term": "Thrill",
        "definition": "Acting mainly for excitement, challenge or personal enjoyment.",
        "explanation": "Thrill focuses on the experience of the attack, not necessarily on a public message.",
        "evidence": "Boasting in private channels; focus on difficulty of the challenge; little coherent public cause.",
        "testQuestion": "Was the main reason personal excitement or challenge rather than a public message or profit?"
      },
      {
        "id": "fraud",
        "term": "Fraud",
        "definition": "Gaining money or advantage through deception.",
        "explanation": "Fraud requires deception. It is not identical to every form of income generation.",
        "evidence": "Fake invoices; spoofed identity; tricking staff into transferring funds or credentials.",
        "testQuestion": "Did the attacker use deception to obtain money or another advantage?"
      },
      {
        "id": "score-settling",
        "term": "Score settling",
        "definition": "Acting to punish, retaliate or get even with a person or organisation.",
        "explanation": "The driver is revenge or retaliation linked to a prior conflict.",
        "evidence": "Prior dispute; personal targeting; messages about payback.",
        "testQuestion": "Was the attacker mainly trying to retaliate against someone or something?"
      },
      {
        "id": "income-generation",
        "term": "Income generation",
        "definition": "Seeking financial gain, which may or may not involve deception.",
        "explanation": "Income generation does not always require deception. Ransomware payment demands can be income generation without the same deception pattern as invoice fraud.",
        "evidence": "Ransom demands; sale of stolen data; repeated monetisation patterns.",
        "testQuestion": "Was the primary aim to make money, whether or not deception was used?"
      }
    ],
    "misconceptions": [
      "Answering a motivation question with a method (for example saying the attacker was motivated by phishing)",
      "Treating fraud and income generation as identical",
      "Collapsing thrill and publicity into a single idea of showing off",
      "Assuming the target is always an organisation"
    ],
    "distinction": {
      "motivation": "Why the attacker acted",
      "target": "What was attacked",
      "method": "How the attack was carried out"
    }
  }
});
