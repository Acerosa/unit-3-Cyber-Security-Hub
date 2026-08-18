/**
 * Auto-maintained Week 3 activity data.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }
  global.Week3PeerMarking = {
  "activityId": "week3-peer-marking",
  "activityName": "Peer Marking and Answer Improvement",
  "activityVersion": "1.0",
  "weekNumber": 3,
  "sessionNumber": 2,
  "total": 6,
  "allowsPartner": true,
  "question": {
    "prompt": "A cloned Microsoft 365 page is sent to Northbank staff to collect passwords. Identify the most likely attacker type and justify your answer using scenario evidence. Reject one alternative.",
    "marks": 4
  },
  "guidance": [
    "Name the attacker type.",
    "Quote or paraphrase scenario evidence.",
    "Explain why the evidence supports the identification.",
    "Where appropriate, explain why another plausible attacker type is less likely."
  ],
  "commonError": "Describing what the attacker did without explaining what the behaviour reveals about the attacker type.",
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
  ],
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
  "exemplar": "The attacker is most likely a phisher because the cloned Microsoft 365 sign-in page is designed to harvest credentials. Although a scammer also uses deception, that label is weaker here without payment-fraud evidence.",
  "selfScoreMax": 6
};
})(window);
