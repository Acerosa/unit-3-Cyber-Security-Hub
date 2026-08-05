/**
 * Auto-maintained Week 3 activity data.
 */
(function (global) {
  'use strict';
  global.Week3OcrPractice = {
  "activityId": "week3-ocr-question-practice",
  "activityName": "OCR-Style Question Practice",
  "activityVersion": "1.0",
  "weekNumber": 3,
  "sessionNumber": 2,
  "total": 20,
  "suggestedMinutes": 20,
  "questions": [
    {
      "id": "O1",
      "commandWord": "Identify",
      "prompt": "Identify the OCR attacker type that uses deceptive messages or sites to steal credentials.",
      "marks": 1,
      "suggestedMinutes": 1,
      "guidance": "One precise OCR term.",
      "responseType": "mcq",
      "options": [
        {
          "id": "A",
          "text": "Scammer"
        },
        {
          "id": "B",
          "text": "Phisher"
        },
        {
          "id": "C",
          "text": "Script kiddie"
        },
        {
          "id": "D",
          "text": "Hacktivist"
        }
      ],
      "correctOptionId": "B",
      "markScheme": "1 mark for phisher.",
      "indicativeContent": "Phisher.",
      "modelAnswer": "Phisher",
      "commonMistakes": [
        "Writing scammer when credentials are the goal",
        "Using black hat instead of OCR type"
      ]
    },
    {
      "id": "O2",
      "commandWord": "Identify",
      "prompt": "Identify the attacker type that already has legitimate access to systems or data.",
      "marks": 1,
      "suggestedMinutes": 1,
      "guidance": "Use OCR vocabulary.",
      "responseType": "mcq",
      "options": [
        {
          "id": "A",
          "text": "Insider"
        },
        {
          "id": "B",
          "text": "Cyber-terrorist"
        },
        {
          "id": "C",
          "text": "Vulnerability broker"
        },
        {
          "id": "D",
          "text": "Phisher"
        }
      ],
      "correctOptionId": "A",
      "markScheme": "1 mark for insider.",
      "indicativeContent": "Insider.",
      "modelAnswer": "Insider",
      "commonMistakes": [
        "Assuming insider always means malicious intent"
      ]
    },
    {
      "id": "O3",
      "commandWord": "Describe",
      "prompt": "Describe what is meant by an insider threat in a healthcare organisation such as Northbank.",
      "marks": 4,
      "suggestedMinutes": 4,
      "guidance": "Include malicious and negligent possibilities.",
      "responseType": "extended",
      "markScheme": "Up to 4 marks: legitimate access (1); malicious misuse (1); negligent harm (1); healthcare/data context (1).",
      "indicativeContent": "Person with authorised access; may act maliciously or negligently; can affect patient confidentiality/availability.",
      "modelAnswer": "An insider threat involves someone with legitimate access to Northbank systems or data who causes harm. This may be malicious, such as exporting records for personal reasons, or negligent, such as leaving a logged-in screen unlocked. Because the access is authorised, the activity can be harder to spot than an external break-in.",
      "commonMistakes": [
        "Only describing external hackers",
        "Saying access itself makes a person guilty"
      ]
    },
    {
      "id": "O4",
      "commandWord": "Explain",
      "prompt": "Explain why insider activity can be difficult to detect.",
      "marks": 4,
      "suggestedMinutes": 4,
      "guidance": "Link detection difficulty to legitimate access.",
      "responseType": "extended",
      "markScheme": "Up to 4: authorised actions resemble normal work (2); monitoring/least privilege needed (1); example (1).",
      "indicativeContent": "Valid accounts; normal job patterns; need for audit and least privilege.",
      "modelAnswer": "Insider activity can be difficult to detect because the person uses credentials and permissions they are allowed to have, so actions may look like ordinary work. For example, a records officer opening patient files can be legitimate or abusive depending on need. Organisations therefore need monitoring, least privilege and clear procedures rather than assuming access equals trust without checks.",
      "commonMistakes": [
        "Saying logs never exist",
        "Stereotyping job roles as untrustworthy"
      ]
    },
    {
      "id": "O5",
      "commandWord": "Justify",
      "prompt": "A fake invoice is emailed to Northbank finance requesting urgent payment to new bank details. Justify the most likely OCR attacker type and reject one alternative.",
      "marks": 4,
      "suggestedMinutes": 5,
      "guidance": "Use the taught answer structure.",
      "responseType": "extended",
      "markScheme": "Type (1); evidence (1); alternative (1); why weaker (1).",
      "indicativeContent": "Scammer; payment fraud; phisher weaker without credential harvest.",
      "modelAnswer": "The attacker is most likely a scammer because the email seeks payment through a false invoice and changed bank details. Although the attacker could be a phisher, this is less likely because the scenario does not show a credential-harvesting page; the immediate aim is fraudulent payment.",
      "commonMistakes": [
        "Calling it cyber-terrorist",
        "Using white hat/black hat labels"
      ]
    },
    {
      "id": "O6",
      "commandWord": "Explain",
      "prompt": "Northbank’s public site is defaced with a message about a social cause; clinical systems are unaffected. A second scenario threatens to disable emergency booking unless a political demand is met. Explain how you would classify each attacker type using evidence.",
      "marks": 6,
      "suggestedMinutes": 6,
      "guidance": "Compare hacktivist and cyber-terrorist with evidence.",
      "responseType": "extended",
      "markScheme": "Hacktivist classification with evidence (2); cyber-terrorist with evidence (2); clear distinction (2).",
      "indicativeContent": "Protest/publicity vs fear/coercion/essential services.",
      "modelAnswer": "The defacement with a social-cause message and no impact on essential clinical systems is most likely hacktivist activity focused on protest and publicity. The threat to disable emergency booking to force political change is more likely cyber-terrorist activity because it aims to create fear and coerce through essential services. The difference is purpose and impact, not merely that both are political.",
      "commonMistakes": [
        "Treating both as identical",
        "Relying on stereotypes about protesters"
      ]
    }
  ]
};
})(window);
