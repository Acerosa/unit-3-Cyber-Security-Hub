/**
 * Week 5 activity pack.
 */

var WEEK5_PACK_IMPACT_ANALYSIS = Object.freeze({
  "meta": {
    "activityId": "week5-impact-analysis",
    "activityName": "Analysing Rather Than Listing Impacts",
    "weekNumber": 5,
    "sessionNumber": 2,
    "sessionName": "Session 2",
    "activityType": "Exam skills",
    "activityVersion": "1.0",
    "maximumScore": 6,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "exam-skills",
    "introduction": "Compare weak and stronger analytical responses, then write immediate and six-month impact sentences.",
    "completionMessage": "Strong answers name stakeholders, use evidence, show timescale and explain connections."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Weak and strong comparison",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "WEAK",
          "blockType": "example",
          "heading": "Weak response",
          "content": "Northbank suffered. Impacts include money, reputation, trust, systems and patients. It was bad. Other hospitals had ransomware too so the same things happened.",
          "displayOrder": 1
        },
        {
          "blockId": "WEAKP",
          "blockType": "information",
          "heading": "Why this is weak",
          "content": "Lists impacts without explanation; vague organisation reference; money focus; little scenario evidence; ignores timescale; imports unrelated incidents; weak on disruption and safety.",
          "displayOrder": 2
        },
        {
          "blockId": "STRONG",
          "blockType": "example",
          "heading": "Stronger analytical response",
          "content": "Patients at Northbank face an immediate safety-related consequence because urgent reviews are delayed while booking systems remain encrypted for two working days, which means time-critical care may be postponed. The scenario also states that patient contact details may have been exposed, so individuals can suffer longer-term loss of confidentiality and confidence. Six months later, reputational damage may continue even after recovery fees are paid, because local media reporting leaves patients asking whether records are safe.",
          "displayOrder": 3
        }
      ],
      "questions": []
    },
    {
      "sectionId": "ASSESS",
      "sectionType": "assessment",
      "title": "Annotation and writing",
      "displayOrder": 2,
      "feedbackTiming": "none",
      "contentBlocks": [],
      "questions": [
        {
          "questionId": "IA1",
          "questionType": "short-response",
          "prompt": "Identify where the stronger response names a stakeholder and uses scenario evidence.",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 1,
          "minimumCharacters": 20,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "IA2",
          "questionType": "short-response",
          "prompt": "Identify where timescale is made explicit and where analysis replaces listing.",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 2,
          "minimumCharacters": 20,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "IA3",
          "questionType": "short-response",
          "prompt": "Write one sentence explaining an immediate impact of the Northbank ransomware incident.",
          "instruction": "Starter optional: Immediately after the incident…",
          "marks": 1,
          "required": true,
          "displayOrder": 3,
          "minimumCharacters": 30,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "IA4",
          "questionType": "short-response",
          "prompt": "Write one sentence explaining an impact that may still be felt six months later.",
          "instruction": "Starter optional: Six months later…",
          "marks": 1,
          "required": true,
          "displayOrder": 4,
          "minimumCharacters": 30,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "IA5",
          "questionType": "extended-response",
          "prompt": "Improve your weaker sentence by adding a missing stakeholder, evidence or timescale connection.",
          "instruction": "Write a clear response using scenario evidence.",
          "marks": 1,
          "required": true,
          "displayOrder": 5,
          "minimumCharacters": 30,
          "maximumCharacters": 3000,
          "minimumSelections": 0,
          "maximumSelections": 0,
          "options": []
        },
        {
          "questionId": "IA6",
          "questionType": "single-choice",
          "prompt": "Which assessment criteria should a strong sentence usually meet?",
          "instruction": "Choose the strongest answer using Week 5 impact terminology.",
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
              "text": "Names a stakeholder, states a consequence, uses scenario evidence, includes timescale and explains the connection"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Lists as many impact words as possible with no explanation"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Imports facts from an unrelated famous breach"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Mentions only financial loss"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "IA1": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Annotation recorded for self-assessment."
    },
    "IA2": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Annotation recorded for self-assessment."
    },
    "IA3": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Immediate impact sentence recorded for criterion-based self-assessment."
    },
    "IA4": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Longer-term impact sentence recorded for criterion-based self-assessment."
    },
    "IA5": {
      "autoMark": false,
      "scoringMode": "completion",
      "explanation": "Improvement recorded."
    },
    "IA6": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Strong sentences name stakeholder, consequence, evidence, timescale and connection.",
      "feedbackCorrect": "Correct. Strong sentences name stakeholder, consequence, evidence, timescale and connection.",
      "feedbackIncorrect": "Strong sentences name stakeholder, consequence, evidence, timescale and connection.",
      "misconceptionFeedback": "Strong sentences name stakeholder, consequence, evidence, timescale and connection."
    }
  },
  "tutorData": {
    "criteria": [
      "Names a stakeholder",
      "States a consequence",
      "Uses scenario evidence",
      "Includes a timescale",
      "Explains the connection",
      "Uses an appropriate impact category"
    ],
    "sentenceStarters": [
      "Immediately after the incident…",
      "This would affect the stakeholder because…",
      "Six months later…",
      "The scenario states that…, which means…",
      "This is a safety impact because…"
    ],
    "creditAnnotations": [
      "Names a stakeholder",
      "States a specific consequence",
      "Uses scenario evidence",
      "Shows immediate and longer-term timescales",
      "Connects evidence to why the consequence follows",
      "Covers more than financial loss"
    ]
  }
});
