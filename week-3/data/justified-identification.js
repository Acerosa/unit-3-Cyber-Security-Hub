/**
 * Auto-maintained Week 3 activity data.
 */
(function (global) {
  'use strict';
  global.Week3JustifiedIdentification = {
  "activityId": "week3-justified-identification",
  "activityName": "Justified Identification Practice",
  "activityVersion": "1.0",
  "weekNumber": 3,
  "sessionNumber": 1,
  "total": 12,
  "marksPerScenario": 3,
  "estimatedMinutes": 30,
  "answerStructure": "The attacker is most likely a [type] because [specific scenario evidence]. Although the attacker could be a [alternative type], this is less likely because [reason].",
  "scenarios": [
    {
      "id": "J1",
      "marks": 3,
      "scenario": "After being refused annual leave, a Northbank records officer uses their normal login to copy a large patient contact list to a personal USB stick.",
      "bestAttacker": "insider",
      "alternative": "cyber-criminal",
      "evidenceHints": [
        "authorised login",
        "USB copy of patient contacts",
        "workplace dispute"
      ],
      "sentenceStarters": [
        "The attacker is most likely an insider because",
        "Although the attacker could be a cyber-criminal,"
      ],
      "modelAnswer": "The attacker is most likely an insider because they used authorised records access to copy patient contacts after a workplace dispute. Although the attacker could be a cyber-criminal, this is less likely because the scenario emphasises misuse of legitimate access rather than an external intrusion for ransom or resale.",
      "successCriteria": [
        "Names insider",
        "Uses scenario evidence",
        "Rejects a plausible alternative with a reason"
      ],
      "keywordChecks": {
        "attackerTerms": [
          "insider"
        ],
        "evidenceTerms": [
          "authorised",
          "usb",
          "patient",
          "records",
          "leave"
        ],
        "alternativeTerms": [
          "cyber-criminal",
          "cyber criminal"
        ]
      }
    },
    {
      "id": "J2",
      "marks": 3,
      "scenario": "Staff receive an urgent email linking to a near-identical Microsoft 365 login page that captures usernames and passwords.",
      "bestAttacker": "phisher",
      "alternative": "scammer",
      "evidenceHints": [
        "cloned login page",
        "credential capture",
        "urgent email"
      ],
      "sentenceStarters": [
        "The attacker is most likely a phisher because",
        "Although the attacker could be a scammer,"
      ],
      "modelAnswer": "The attacker is most likely a phisher because the lure uses a cloned Microsoft 365 page to steal credentials. Although the attacker could be a scammer, this is less likely because the immediate goal shown is credential harvesting rather than tricking finance into paying an invoice.",
      "successCriteria": [
        "Names phisher",
        "Uses credential-harvesting evidence",
        "Explains why scammer is weaker"
      ],
      "keywordChecks": {
        "attackerTerms": [
          "phisher",
          "phishing"
        ],
        "evidenceTerms": [
          "microsoft",
          "login",
          "password",
          "credential"
        ],
        "alternativeTerms": [
          "scammer",
          "scam"
        ]
      }
    },
    {
      "id": "J3",
      "marks": 3,
      "scenario": "A group takes a public clinic webpage offline and posts that the action supports a campaign on healthcare funding. Emergency clinical systems remain untouched and no ransom is demanded.",
      "bestAttacker": "hacktivist",
      "alternative": "cyber-terrorist",
      "evidenceHints": [
        "cause statement",
        "publicity/protest",
        "no essential-service threat"
      ],
      "sentenceStarters": [
        "The attacker is most likely a hacktivist because",
        "Although the attacker could be a cyber-terrorist,"
      ],
      "modelAnswer": "The attacker is most likely a hacktivist because the disruption is linked to a social/political campaign message without threatening essential clinical services. Although the attacker could be a cyber-terrorist, this is less likely because there is no evidence of creating fear to coerce political change through essential-service threats.",
      "successCriteria": [
        "Names hacktivist",
        "Uses cause/publicity evidence",
        "Rejects cyber-terrorist with a reason"
      ],
      "keywordChecks": {
        "attackerTerms": [
          "hacktivist"
        ],
        "evidenceTerms": [
          "campaign",
          "funding",
          "public",
          "ransom"
        ],
        "alternativeTerms": [
          "cyber-terrorist",
          "cyber terrorist",
          "terrorist"
        ]
      }
    },
    {
      "id": "J4",
      "marks": 3,
      "scenario": "A researcher finds an input-validation flaw in Northbank’s supplier portal and asks to be paid through a disclosure programme before details are published.",
      "bestAttacker": "vulnerability-broker",
      "alternative": "cyber-criminal",
      "evidenceHints": [
        "reports a flaw",
        "disclosure/bounty payment",
        "not ransoming systems"
      ],
      "sentenceStarters": [
        "The attacker is most likely a vulnerability broker because",
        "Although the attacker could be a cyber-criminal,"
      ],
      "modelAnswer": "The attacker is most likely a vulnerability broker because they treat the software flaw as something to disclose for payment through a disclosure programme. Although the attacker could be a cyber-criminal, this is less likely because the scenario does not show encrypting systems or stealing data for direct criminal profit.",
      "successCriteria": [
        "Names vulnerability broker",
        "Uses disclosure evidence",
        "Rejects cyber-criminal carefully"
      ],
      "keywordChecks": {
        "attackerTerms": [
          "vulnerability broker",
          "broker"
        ],
        "evidenceTerms": [
          "flaw",
          "disclosure",
          "bounty",
          "portal"
        ],
        "alternativeTerms": [
          "cyber-criminal",
          "cyber criminal"
        ]
      }
    }
  ]
};
})(window);
