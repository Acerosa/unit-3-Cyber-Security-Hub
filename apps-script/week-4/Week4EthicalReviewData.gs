/**
 * Week 4 activity pack.
 */

var WEEK4_PACK_ETHICAL_REVIEW = Object.freeze({
  "meta": {
    "activityId": "week4-ethical-review",
    "activityName": "Ethical Review Discussion",
    "weekNumber": 4,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Discussion",
    "activityVersion": "1.0",
    "maximumScore": 2,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "discussion",
    "introduction": "Discuss whether an attack claimed to serve the public good can be justified.",
    "completionMessage": "You stated a position, gave a reason, and acknowledged the legal-position point."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Boundaries",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "ETHB",
          "blockType": "information",
          "heading": "Discussion boundaries",
          "content": "This is an ethical-review discussion for Week 4. Do not expand into detailed legislation content from later weeks. Do not introduce detailed statutes or legal requirements here. Take a clear position (yes, no, or a carefully qualified view). Support the position with a reason rather than an assertion. Recognise that a claimed motivation does not change the legal position of the act. I argue that … because … Even if the claimed motivation is public good, … A claimed motivation does not change the legal position because …",
          "displayOrder": 1
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Ethical review responses",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "ETH1",
          "questionType": "reflection",
          "prompt": "Can an attack claimed to serve the public good be justified?\n\nState your position and give one reason.",
          "instruction": "There is no single correct opinion. Do not expand into detailed Week 6 legislation.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 40,
          "maximumCharacters": 1500,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "ETH2",
          "questionType": "self-assessment",
          "prompt": "Acknowledge whether a claimed public-good motivation changes the legal position of the act.",
          "instruction": "A claimed public-good motive does not make an unlawful act lawful.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 20,
          "maximumCharacters": 2000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": [
            {
              "optionId": "acknowledged",
              "displayOrder": 1,
              "text": "I acknowledge that claimed public-good motivation does not change the legal position"
            },
            {
              "optionId": "not-yet",
              "displayOrder": 2,
              "text": "Not yet acknowledged"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "ETH1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Completion records that a position and reason were provided.",
      "indicativeResponse": "",
      "markScheme": []
    },
    "ETH2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Learners must recognise that claimed motivation does not change legal position.",
      "indicativeResponse": "",
      "markScheme": []
    }
  },
  "tutorData": {
    "requirements": [
      "Take a clear position (yes, no, or a carefully qualified view).",
      "Support the position with a reason rather than an assertion.",
      "Recognise that a claimed motivation does not change the legal position of the act."
    ],
    "boundaries": [
      "This is an ethical-review discussion for Week 4.",
      "Do not expand into detailed legislation content from later weeks.",
      "Do not introduce detailed statutes or legal requirements here."
    ]
  }
});
