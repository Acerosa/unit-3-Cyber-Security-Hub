/**
 * Week 4 activity pack.
 */

var WEEK4_PACK_OCR_PRACTICE = Object.freeze({
  "meta": {
    "activityId": "week4-ocr-question-practice",
    "activityName": "OCR-Style Question Practice",
    "weekNumber": 4,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Exam skills",
    "activityVersion": "1.0",
    "maximumScore": 20,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "ocr-practice",
    "introduction": "OCR-style practice (not official OCR material). Suggested time about 20 minutes. Approximately one minute per mark.",
    "completionMessage": "Review mark-scheme points after you finish. Objective items are auto-marked; extended analysis uses review mode."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Before you start",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "OCRREM",
          "blockType": "information",
          "heading": "Reminders",
          "content": "Read whether the question asks for motivation, target or method. Use one case consistently. Include explicit connections. Complete the final connection rather than leaving it implied. Allocate time according to the marks available.",
          "displayOrder": 1
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "OCR-style questions",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "OCR1",
          "questionType": "single-choice",
          "prompt": "Identify which of the following is an OCR attacker motivation.",
          "instruction": "Identify. Motivation = why. Do not choose a method.",
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
              "text": "Phishing"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Publicity"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Exfiltration"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Damage"
            }
          ],
          "commandWord": "Identify"
        },
        {
          "questionId": "OCR2",
          "questionType": "single-choice",
          "prompt": "Identify the target category when reception staff are sent deceptive emails.",
          "instruction": "Identify. Target = what was attacked.",
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
              "text": "People"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Equipment"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Fraud"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Thrill"
            }
          ],
          "commandWord": "Identify"
        },
        {
          "questionId": "OCR3",
          "questionType": "short-response",
          "prompt": "Explain the difference between fraud and income generation as attacker motivations.",
          "instruction": "Explain. Use the OCR distinction: fraud requires deception; income generation may not.",
          "marks": 2,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": [],
          "commandWord": "Explain"
        },
        {
          "questionId": "OCR4",
          "questionType": "short-response",
          "prompt": "Describe the four categories of target for cyber security threats and give one associated method for each.",
          "instruction": "Describe. Name people, organisations, equipment and information with the specified methods.",
          "marks": 4,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": [],
          "commandWord": "Describe"
        },
        {
          "questionId": "OCR5",
          "questionType": "short-response",
          "prompt": "Explain the difference between motivation, target and method, using one short Northbank-related example.",
          "instruction": "Explain. Keep why / what / how distinct. Sustain one example.",
          "marks": 4,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": [],
          "commandWord": "Explain"
        },
        {
          "questionId": "OCR6",
          "questionType": "extended-response",
          "prompt": "Northbank’s public website is defaced with a protest message about health funding. Clinical systems are not encrypted and no ransom is demanded. Analyse why this organisation was targeted, connecting attacker motivation, selected target and method used. Use evidence from the scenario.",
          "instruction": "Analyse. Sustain one case. State explicit connections. Complete the final connection. Do not invent unsupported Northbank details.",
          "marks": 8,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 40,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": [],
          "commandWord": "Analyse"
        }
      ]
    }
  ],
  "assessment": {
    "OCR1": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Publicity is a motivation. Phishing, exfiltration and damage are methods.",
      "markScheme": "1 mark for publicity (or another listed motivation if an equivalent option were offered).",
      "modelAnswer": "Publicity.",
      "commonMistakes": [
        "Choosing a method such as phishing"
      ]
    },
    "OCR2": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "People are targeted; phishing would be the method; fraud/thrill are motivations.",
      "markScheme": "1 mark for people.",
      "modelAnswer": "People.",
      "commonMistakes": [
        "Naming the method or motivation instead of the target"
      ]
    },
    "OCR3": {
      "autoMark": false,
      "scoringMode": "manual",
      "explanation": "Fraud gains money or advantage through deception. Income generation seeks financial gain and may involve no deception (for example a ransom demand).",
      "indicativeResponse": "Fraud requires deception to gain money or advantage. Income generation is about making money and does not always require deception.",
      "markScheme": "1 mark for fraud involving deception; 1 mark for income generation as financial gain that may not require deception.",
      "indicativeContent": "Fraud gains money or advantage through deception. Income generation seeks financial gain and may involve no deception (for example a ransom demand).",
      "commonMistakes": [
        "Treating the two motivations as identical"
      ]
    },
    "OCR4": {
      "autoMark": false,
      "scoringMode": "manual",
      "explanation": "People — social engineering/phishing; organisations — system compromise/supply-chain compromise; equipment — theft/damage; information — interception/exfiltration.",
      "indicativeResponse": "People can be targeted using social engineering or phishing. Organisations can be targeted through system compromise or supply-chain compromise. Equipment can be targeted by theft or damage. Information can be targeted by interception or exfiltration.",
      "markScheme": "1 mark per correct target with a valid associated method (max 4).",
      "indicativeContent": "People — social engineering/phishing; organisations — system compromise/supply-chain compromise; equipment — theft/damage; information — interception/exfiltration.",
      "commonMistakes": [
        "Listing attacker types instead of targets",
        "Using unsupported methods"
      ]
    },
    "OCR5": {
      "autoMark": false,
      "scoringMode": "manual",
      "explanation": "Motivation why; target what; method how; example must not answer motivation with a method.",
      "indicativeResponse": "Motivation is why the attacker acted, target is what was attacked, and method is how the attack was carried out. For example, if an attacker wants income generation (why), they may target Northbank’s organisation systems (what) using system compromise and a ransom demand (how).",
      "markScheme": "1 mark motivation=why; 1 mark target=what; 1 mark method=how; 1 mark for a consistent example that does not confuse the three.",
      "indicativeContent": "Motivation why; target what; method how; example must not answer motivation with a method.",
      "commonMistakes": [
        "Using phishing as a motivation",
        "Changing example halfway"
      ]
    },
    "OCR6": {
      "autoMark": false,
      "scoringMode": "manual",
      "explanation": "Publicity (wanting notice) → organisational public website → system compromise/defacement; connectives must be meaningful; thrill is weaker if message/cause is clear.",
      "indicativeResponse": "The most likely motivation is publicity because the attackers left a protest message intended to be noticed. As a result, Northbank’s public website was a logical organisational target, which means that system compromise of that site suited delivering a visible message without needing to encrypt clinical systems. Therefore the motivation made both the target and method a coherent choice based on exposure and visibility rather than a ransom-driven income generation motive.",
      "markScheme": "Up to 2 marks motivation with evidence; up to 2 marks target with evidence; up to 2 marks method with evidence; up to 2 marks for explicit analytical connections sustaining one case.",
      "indicativeContent": "Publicity (wanting notice) → organisational public website → system compromise/defacement; connectives must be meaningful; thrill is weaker if message/cause is clear.",
      "commonMistakes": [
        "Listing motivation, target and method with no connection",
        "Leaving the final connection implied",
        "Switching to a different example halfway",
        "Calling defacement a motivation"
      ]
    }
  },
  "tutorData": {
    "timingGuidance": "Use approximately one minute per mark where this helps you manage time.",
    "suggestedMinutes": 20
  }
});
