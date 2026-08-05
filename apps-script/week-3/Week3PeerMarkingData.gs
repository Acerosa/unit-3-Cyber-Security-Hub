/**
 * Week 3 activity pack.
 */

var WEEK3_PACK_PEER_MARKING = Object.freeze({
  "meta": {
    "activityId": "week3-peer-marking",
    "activityName": "Peer Marking and Answer Improvement",
    "weekNumber": 3,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Reflection",
    "activityVersion": "1.0",
    "maximumScore": 6,
    "allowsPartner": true,
    "enabled": true,
    "componentId": "peer-marking",
    "introduction": "Mark anonymised samples and improve a weak sentence.",
    "completionMessage": "Compare your rewrite with the exemplar."
  },
  "sections": [
    {
      "sectionId": "PEER",
      "sectionType": "assessment",
      "title": "Peer marking tasks",
      "displayOrder": 1,
      "feedbackTiming": "section",
      "contentBlocks": [
        {
          "blockId": "P1",
          "blockType": "information",
          "heading": "Question",
          "content": "A cloned Microsoft 365 page is sent to Northbank staff to collect passwords. Identify the most likely attacker type and justify your answer using scenario evidence. Reject one alternative.",
          "displayOrder": 1
        }
      ],
      "questions": [
        {
          "questionId": "PEER1",
          "questionType": "reflection",
          "prompt": "Record awarded criteria, one strength, one improvement and your rewritten sentence.",
          "instruction": "Do not include another learner’s real name.",
          "marks": 6,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 40,
          "maximumCharacters": 2000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        }
      ]
    }
  ],
  "assessment": {
    "PEER1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "The attacker is most likely a phisher because the cloned Microsoft 365 sign-in page is designed to harvest credentials. Although a scammer also uses deception, that label is weaker here without payment-fraud evidence."
    }
  },
  "tutorData": {
    "samples": [
      {
        "id": "weak",
        "label": "Weak response",
        "text": "It is probably a young hacker because young people are good with computers and like breaking things.",
        "issues": [
          "Stereotype",
          "No OCR type precision",
          "No evidence link"
        ]
      },
      {
        "id": "mid",
        "label": "Mid-level response",
        "text": "This is a phisher because there is a cloned Microsoft 365 page.",
        "issues": [
          "Names type and evidence but does not explain or reject alternative"
        ]
      },
      {
        "id": "strong",
        "label": "Strong response",
        "text": "The attacker is most likely a phisher because a cloned Microsoft 365 page is used to collect staff passwords. Although the attacker could be a scammer, this is less likely because the immediate aim shown is credential theft rather than tricking finance into paying an invoice."
      }
    ],
    "criteria": [
      {
        "id": "c1",
        "label": "Names a precise OCR attacker type",
        "marks": 1
      },
      {
        "id": "c2",
        "label": "Uses scenario evidence (not stereotypes)",
        "marks": 1
      },
      {
        "id": "c3",
        "label": "Explains what the evidence shows about the type",
        "marks": 1
      },
      {
        "id": "c4",
        "label": "Rejects a plausible alternative with a reason",
        "marks": 1
      }
    ]
  }
});
