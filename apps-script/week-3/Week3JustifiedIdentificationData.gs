/**
 * Week 3 activity pack.
 */

var WEEK3_PACK_JUSTIFIED_IDENTIFICATION = Object.freeze({
  "meta": {
    "activityId": "week3-justified-identification",
    "activityName": "Justified Identification Practice",
    "weekNumber": 3,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Exam skills",
    "activityVersion": "1.0",
    "maximumScore": 12,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "justified-writing",
    "introduction": "Write justified attacker identifications.",
    "completionMessage": "Compare your answers with the model responses in review."
  },
  "sections": [
    {
      "sectionId": "JUST_ASSESS",
      "sectionType": "assessment",
      "title": "Scenarios",
      "displayOrder": 1,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "J1",
          "questionType": "reflection",
          "prompt": "After being refused annual leave, a Northbank records officer uses their normal login to copy a large patient contact list to a personal USB stick. Write a justified identification.",
          "instruction": "The attacker is most likely a [type] because [specific scenario evidence]. Although the attacker could be a [alternative type], this is less likely because [reason].",
          "marks": 3,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 40,
          "maximumCharacters": 1200,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "J2",
          "questionType": "reflection",
          "prompt": "Staff receive an urgent email linking to a near-identical Microsoft 365 login page that captures usernames and passwords. Write a justified identification.",
          "instruction": "The attacker is most likely a [type] because [specific scenario evidence]. Although the attacker could be a [alternative type], this is less likely because [reason].",
          "marks": 3,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 40,
          "maximumCharacters": 1200,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "J3",
          "questionType": "reflection",
          "prompt": "A group takes a public clinic webpage offline and posts that the action supports a campaign on healthcare funding. Emergency clinical systems remain untouched and no ransom is demanded. Write a justified identification.",
          "instruction": "The attacker is most likely a [type] because [specific scenario evidence]. Although the attacker could be a [alternative type], this is less likely because [reason].",
          "marks": 3,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 40,
          "maximumCharacters": 1200,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "J4",
          "questionType": "reflection",
          "prompt": "A researcher finds an input-validation flaw in Northbank’s supplier portal and asks to be paid through a disclosure programme before details are published. Write a justified identification.",
          "instruction": "The attacker is most likely a [type] because [specific scenario evidence]. Although the attacker could be a [alternative type], this is less likely because [reason].",
          "marks": 3,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 40,
          "maximumCharacters": 1200,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        }
      ]
    }
  ],
  "assessment": {
    "J1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "The attacker is most likely an insider because they used authorised records access to copy patient contacts after a workplace dispute. Although the attacker could be a cyber-criminal, this is less likely because the scenario emphasises misuse of legitimate access rather than an external intrusion for ransom or resale.",
      "indicativeResponse": "The attacker is most likely an insider because they used authorised records access to copy patient contacts after a workplace dispute. Although the attacker could be a cyber-criminal, this is less likely because the scenario emphasises misuse of legitimate access rather than an external intrusion for ransom or resale."
    },
    "J2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "The attacker is most likely a phisher because the lure uses a cloned Microsoft 365 page to steal credentials. Although the attacker could be a scammer, this is less likely because the immediate goal shown is credential harvesting rather than tricking finance into paying an invoice.",
      "indicativeResponse": "The attacker is most likely a phisher because the lure uses a cloned Microsoft 365 page to steal credentials. Although the attacker could be a scammer, this is less likely because the immediate goal shown is credential harvesting rather than tricking finance into paying an invoice."
    },
    "J3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "The attacker is most likely a hacktivist because the disruption is linked to a social/political campaign message without threatening essential clinical services. Although the attacker could be a cyber-terrorist, this is less likely because there is no evidence of creating fear to coerce political change through essential-service threats.",
      "indicativeResponse": "The attacker is most likely a hacktivist because the disruption is linked to a social/political campaign message without threatening essential clinical services. Although the attacker could be a cyber-terrorist, this is less likely because there is no evidence of creating fear to coerce political change through essential-service threats."
    },
    "J4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "The attacker is most likely a vulnerability broker because they treat the software flaw as something to disclose for payment through a disclosure programme. Although the attacker could be a cyber-criminal, this is less likely because the scenario does not show encrypting systems or stealing data for direct criminal profit.",
      "indicativeResponse": "The attacker is most likely a vulnerability broker because they treat the software flaw as something to disclose for payment through a disclosure programme. Although the attacker could be a cyber-criminal, this is less likely because the scenario does not show encrypting systems or stealing data for direct criminal profit."
    }
  },
  "tutorData": {
    "answerStructure": "The attacker is most likely a [type] because [specific scenario evidence]. Although the attacker could be a [alternative type], this is less likely because [reason]."
  }
});
