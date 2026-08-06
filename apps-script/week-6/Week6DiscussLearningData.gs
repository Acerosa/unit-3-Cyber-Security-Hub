/**
 * Week 6 activity pack.
 */

var WEEK6_PACK_DISCUSS_LEARNING = Object.freeze({
  "meta": {
    "activityId": "week6-discuss-learning",
    "activityName": "Balanced Discuss Response Learning",
    "weekNumber": 6,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Guided learning",
    "activityVersion": "1.0",
    "maximumScore": 5,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "guided-learning",
    "introduction": "Learn how to structure a balanced Discuss answer with competing considerations and concessions.",
    "completionMessage": "Balance and structure earn credit, not word count alone."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Discuss structure",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "DLSC",
          "blockType": "scenario",
          "heading": "Northbank monitoring scenario",
          "content": "Northbank Community Health Partnership must decide how far to monitor employees after an insider copied patient contact details. A Discuss question asks whether enhanced monitoring is justified.",
          "displayOrder": 1
        },
        {
          "blockId": "DLST",
          "blockType": "information",
          "heading": "Balanced Discuss structure",
          "content": "Issue: State the decision or tension clearly. Supported consideration: One reason or evidence supporting a position, linked to the scenario. Competing consideration: A credible counterpoint from another stakeholder or duty. Concession: A fair point accepted from the other side before concluding. Justified conclusion: A balanced judgement that follows from both sides, not a one-sided slogan.",
          "displayOrder": 2
        },
        {
          "blockId": "DLWK",
          "blockType": "example",
          "heading": "Weaker Discuss-style response",
          "content": "Northbank should monitor everyone all the time because insiders are dangerous and the law probably requires it. Monitoring is always ethical if it stops breaches. Any staff who object are hiding something. Problems: Does not state the issue as a balanced decision; Treats legal, ethical and operational points as one vague claim; No competing consideration or concession; Conclusion is one-sided and not justified from evidence.",
          "displayOrder": 3
        },
        {
          "blockId": "DLST2",
          "blockType": "worked-example",
          "heading": "Stronger balanced response",
          "content": "The issue is how far Northbank should monitor staff after an insider copied patient contact details. Enhanced log review may be supported because it could deter repeat misuse and show accountability to customers and the data protection regulator under current United Kingdom data protection legislation. However, employees may argue that continuous monitoring damages trust and adds operational burden if clinic staff fear excessive scrutiny during busy appointments. I accept that some targeted auditing of access to sensitive records is more proportionate than blanket surveillance. Overall, Northbank should favour targeted, transparent monitoring with clear rules rather than unlimited observation, because this balances security with ethical respect for staff and workable day-to-day care delivery.",
          "displayOrder": 4
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Knowledge check",
      "displayOrder": 2,
      "feedbackTiming": "section",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "DL1",
          "questionType": "single-choice",
          "prompt": "Which element is missing from the weaker response?",
          "instruction": "Balanced Discuss response learning check.",
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
              "text": "A competing consideration and concession"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "The word Northbank"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Any mention of employees"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "A longer conclusion only"
            }
          ]
        },
        {
          "questionId": "DL2",
          "questionType": "single-choice",
          "prompt": "Why is the stronger response better even though both mention monitoring?",
          "instruction": "Balanced Discuss response learning check.",
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
              "text": "It balances supported and competing points before a justified conclusion"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "It avoids naming any stakeholder"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "It claims legal compliance removes all ethical doubt"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "It is better only because it is longer"
            }
          ]
        },
        {
          "questionId": "DL3",
          "questionType": "single-choice",
          "prompt": "Where does the stronger response link statute to duty?",
          "instruction": "Balanced Discuss response learning check.",
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
              "text": "Accountability to customers and the data protection regulator under current United Kingdom data protection legislation"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Police and Justice Act 2006 amendments on marketing emails only"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Computer Misuse Act 1990 removing all privacy rights"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "It does not mention law at all"
            }
          ]
        },
        {
          "questionId": "DL4",
          "questionType": "single-choice",
          "prompt": "Which line best shows a concession?",
          "instruction": "Balanced Discuss response learning check.",
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
              "text": "I accept that some targeted auditing of access to sensitive records is more proportionate than blanket surveillance."
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Monitoring is always right and opponents are wrong."
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "The law is irrelevant to Northbank."
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Operational costs never matter."
            }
          ]
        },
        {
          "questionId": "DL5",
          "questionType": "single-choice",
          "prompt": "What should a justified conclusion do?",
          "instruction": "Balanced Discuss response learning check.",
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
              "text": "Follow from both sides of the argument and state a reasoned overall judgement"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Repeat the supported point only"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Introduce a new unrelated statute"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Ignore operational practicality entirely"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "DL1": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Balanced Discuss answers need a credible counterpoint and a concession, not just a longer one-sided paragraph.",
      "feedbackCorrect": "Correct. Balanced Discuss answers need a credible counterpoint and a concession, not just a longer one-sided paragraph.",
      "feedbackIncorrect": "Balanced Discuss answers need a credible counterpoint and a concession, not just a longer one-sided paragraph.",
      "misconceptionFeedback": "Balanced Discuss answers need a credible counterpoint and a concession, not just a longer one-sided paragraph."
    },
    "DL2": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Balance and structure earn credit, not word count alone.",
      "feedbackCorrect": "Correct. Balance and structure earn credit, not word count alone.",
      "feedbackIncorrect": "Balance and structure earn credit, not word count alone.",
      "misconceptionFeedback": "Balance and structure earn credit, not word count alone."
    },
    "DL3": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Name the statute and the relevant duty or expectation together.",
      "feedbackCorrect": "Correct. Name the statute and the relevant duty or expectation together.",
      "feedbackIncorrect": "Name the statute and the relevant duty or expectation together.",
      "misconceptionFeedback": "Name the statute and the relevant duty or expectation together."
    },
    "DL4": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "A concession fairly accepts a point from the other side.",
      "feedbackCorrect": "Correct. A concession fairly accepts a point from the other side.",
      "feedbackIncorrect": "A concession fairly accepts a point from the other side.",
      "misconceptionFeedback": "A concession fairly accepts a point from the other side."
    },
    "DL5": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "The conclusion should weigh the supported and competing considerations after the concession.",
      "feedbackCorrect": "Correct. The conclusion should weigh the supported and competing considerations after the concession.",
      "feedbackIncorrect": "The conclusion should weigh the supported and competing considerations after the concession.",
      "misconceptionFeedback": "The conclusion should weigh the supported and competing considerations after the concession."
    }
  },
  "tutorData": {
    "structure": [
      "issue",
      "supported",
      "competing",
      "concession",
      "conclusion"
    ],
    "strengths": [
      "States the issue clearly",
      "Develops a supported consideration with scenario and legal link",
      "Includes a competing stakeholder view",
      "Makes an explicit concession",
      "Concludes with a justified, balanced judgement rather than length alone"
    ]
  }
});
