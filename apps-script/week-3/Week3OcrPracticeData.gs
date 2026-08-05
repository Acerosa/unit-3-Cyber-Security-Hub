/**
 * Week 3 activity pack.
 */

var WEEK3_PACK_OCR_PRACTICE = Object.freeze({
  "meta": {
    "activityId": "week3-ocr-question-practice",
    "activityName": "OCR-Style Question Practice",
    "weekNumber": 3,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Exam skills",
    "activityVersion": "1.0",
    "maximumScore": 20,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "ocr-practice",
    "introduction": "OCR-style practice for attacker types.",
    "completionMessage": "Review mark schemes carefully."
  },
  "sections": [
    {
      "sectionId": "OCR",
      "sectionType": "assessment",
      "title": "Questions",
      "displayOrder": 1,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "O1",
          "questionType": "single-choice",
          "prompt": "Identify the OCR attacker type that uses deceptive messages or sites to steal credentials.",
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
              "text": "Hacktivist"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "O2",
          "questionType": "single-choice",
          "prompt": "Identify the attacker type that already has legitimate access to systems or data.",
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
              "text": "Insider"
            },
            {
              "optionId": "B",
              "displayOrder": 2,
              "text": "Cyber-terrorist"
            },
            {
              "optionId": "C",
              "displayOrder": 3,
              "text": "Vulnerability broker"
            },
            {
              "optionId": "D",
              "displayOrder": 4,
              "text": "Phisher"
            }
          ],
          "commandWord": "Identify",
          "specificationReference": "LO2 / 2.2 Types of attackers",
          "difficulty": "foundation"
        },
        {
          "questionId": "O3",
          "questionType": "extended-response",
          "prompt": "Describe what is meant by an insider threat in a healthcare organisation such as Northbank.",
          "instruction": "Include malicious and negligent possibilities.",
          "marks": 4,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 40,
          "maximumCharacters": 2000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": [],
          "commandWord": "Describe"
        },
        {
          "questionId": "O4",
          "questionType": "extended-response",
          "prompt": "Explain why insider activity can be difficult to detect.",
          "instruction": "Link detection difficulty to legitimate access.",
          "marks": 4,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 40,
          "maximumCharacters": 2000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": [],
          "commandWord": "Explain"
        },
        {
          "questionId": "O5",
          "questionType": "extended-response",
          "prompt": "A fake invoice is emailed to Northbank finance requesting urgent payment to new bank details. Justify the most likely OCR attacker type and reject one alternative.",
          "instruction": "Use the taught answer structure.",
          "marks": 4,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 40,
          "maximumCharacters": 2000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": [],
          "commandWord": "Justify"
        },
        {
          "questionId": "O6",
          "questionType": "extended-response",
          "prompt": "Northbank’s public site is defaced with a message about a social cause; clinical systems are unaffected. A second scenario threatens to disable emergency booking unless a political demand is met. Explain how you would classify each attacker type using evidence.",
          "instruction": "Compare hacktivist and cyber-terrorist with evidence.",
          "marks": 6,
          "required": true,
          "displayOrder": 6,
          "minimumCharacters": 40,
          "maximumCharacters": 2000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": [],
          "commandWord": "Explain"
        }
      ]
    }
  ],
  "assessment": {
    "O1": {
      "correctOptionId": "B",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "1 mark for phisher."
    },
    "O2": {
      "correctOptionId": "A",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "1 mark for insider."
    },
    "O3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Up to 4 marks: legitimate access (1); malicious misuse (1); negligent harm (1); healthcare/data context (1).",
      "indicativeResponse": "An insider threat involves someone with legitimate access to Northbank systems or data who causes harm. This may be malicious, such as exporting records for personal reasons, or negligent, such as leaving a logged-in screen unlocked. Because the access is authorised, the activity can be harder to spot than an external break-in.",
      "commonMistakes": [
        "Only describing external hackers",
        "Saying access itself makes a person guilty"
      ]
    },
    "O4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Up to 4: authorised actions resemble normal work (2); monitoring/least privilege needed (1); example (1).",
      "indicativeResponse": "Insider activity can be difficult to detect because the person uses credentials and permissions they are allowed to have, so actions may look like ordinary work. For example, a records officer opening patient files can be legitimate or abusive depending on need. Organisations therefore need monitoring, least privilege and clear procedures rather than assuming access equals trust without checks.",
      "commonMistakes": [
        "Saying logs never exist",
        "Stereotyping job roles as untrustworthy"
      ]
    },
    "O5": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Type (1); evidence (1); alternative (1); why weaker (1).",
      "indicativeResponse": "The attacker is most likely a scammer because the email seeks payment through a false invoice and changed bank details. Although the attacker could be a phisher, this is less likely because the scenario does not show a credential-harvesting page; the immediate aim is fraudulent payment.",
      "commonMistakes": [
        "Calling it cyber-terrorist",
        "Using white hat/black hat labels"
      ]
    },
    "O6": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Hacktivist classification with evidence (2); cyber-terrorist with evidence (2); clear distinction (2).",
      "indicativeResponse": "The defacement with a social-cause message and no impact on essential clinical systems is most likely hacktivist activity focused on protest and publicity. The threat to disable emergency booking to force political change is more likely cyber-terrorist activity because it aims to create fear and coerce through essential services. The difference is purpose and impact, not merely that both are political.",
      "commonMistakes": [
        "Treating both as identical",
        "Relying on stereotypes about protesters"
      ]
    }
  },
  "tutorData": {
    "suggestedMinutes": 20
  }
});
