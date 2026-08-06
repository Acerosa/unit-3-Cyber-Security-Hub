/**
 * Week 5 activity pack.
 */

var WEEK5_PACK_IMPACTS_LEARNING = Object.freeze({
  "meta": {
    "activityId": "week5-impacts-learning",
    "activityName": "Impacts Learning: Loss, Disruption and Safety",
    "weekNumber": 5,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Guided learning",
    "activityVersion": "1.0",
    "maximumScore": 9,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "guided-learning",
    "introduction": "Learn loss, disruption and safety with Northbank examples. Do not treat every impact as financial loss.",
    "completionMessage": "Categories can overlap when a scenario supports more than one."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Loss, disruption and safety",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "DEF1",
          "blockType": "information",
          "heading": "Three impact categories",
          "content": "Loss: something of value is taken, damaged, corrupted, reduced or no longer trusted. Disruption: a service stops or becomes unreliable. Safety: people are placed at physical risk.",
          "displayOrder": 1
        },
        {
          "blockId": "DEF2",
          "blockType": "information",
          "heading": "Longer-term loss",
          "content": "Reputational loss and loss of customer confidence may continue after systems have been restored and immediate financial costs have been addressed.",
          "displayOrder": 2
        },
        {
          "blockId": "LOSS1",
          "blockType": "definition",
          "heading": "Loss of confidentiality",
          "content": "Information that should be restricted becomes known to unauthorised people. Example: Northbank patient contact details from a shared mailbox are emailed to the wrong external address. Distinction: Different from integrity: data may still be accurate but the wrong people can see it.",
          "displayOrder": 1
        },
        {
          "blockId": "LOSS2",
          "blockType": "definition",
          "heading": "Loss of integrity",
          "content": "Information is altered so it is no longer accurate or trustworthy. Example: Ransomware encrypts Northbank appointment records so staff cannot trust which visits remain scheduled. Distinction: Different from confidentiality: the issue is trustworthiness, not only who can see it.",
          "displayOrder": 2
        },
        {
          "blockId": "LOSS3",
          "blockType": "definition",
          "heading": "Loss of availability",
          "content": "Systems, data or services cannot be used when needed. Example: Northbank\u2019s booking system is offline after encryption. Distinction: Closely linked to disruption, but availability focuses on whether the asset can be used.",
          "displayOrder": 3
        },
        {
          "blockId": "LOSS4",
          "blockType": "definition",
          "heading": "Loss of data",
          "content": "Data is destroyed, permanently inaccessible, or no longer recoverable in a usable form. Example: Northbank cannot restore last week\u2019s referral letters after backups fail. Distinction: Wider than temporary unavailability.",
          "displayOrder": 4
        },
        {
          "blockId": "LOSS5",
          "blockType": "definition",
          "heading": "Financial loss",
          "content": "Money is spent, stolen or otherwise lost because of the incident. Example: Northbank pays emergency IT contractor fees and overtime. Distinction: Important, but not the only impact category.",
          "displayOrder": 5
        },
        {
          "blockId": "LOSS6",
          "blockType": "definition",
          "heading": "Loss of business",
          "content": "Customers, patients or partners take their activity elsewhere. Example: Local residents choose another clinic after repeated Northbank outages. Distinction: Related to, but not identical with, loss of customer confidence.",
          "displayOrder": 6
        },
        {
          "blockId": "LOSS7",
          "blockType": "definition",
          "heading": "Identity loss or identity theft",
          "content": "Personal identifying information is misused so someone can pretend to be another person. Example: Stolen Northbank patient identity details are used to open fraudulent accounts. Distinction: A form of loss for the individual.",
          "displayOrder": 7
        },
        {
          "blockId": "LOSS8",
          "blockType": "definition",
          "heading": "Reputational loss",
          "content": "Trust in the organisation\u2019s competence or trustworthiness is damaged. Example: Local news reports Northbank cancelled clinics after ransomware. Distinction: May continue after immediate financial recovery costs are paid.",
          "displayOrder": 8
        },
        {
          "blockId": "LOSS9",
          "blockType": "definition",
          "heading": "Loss of customer confidence",
          "content": "Patients, customers or partners become less willing to trust the organisation. Example: Patients ask whether Northbank can keep medical information safe. Distinction: May continue for months after systems are restored.",
          "displayOrder": 9
        },
        {
          "blockId": "DIS1",
          "blockType": "information",
          "heading": "Disruption contexts",
          "content": "Healthcare services, hospitals, transport networks, broadcasting, utilities, oil installations and traffic-control interference can all show disruption. Ask which service stopped, who depended on it, and how they were affected.",
          "displayOrder": 20
        },
        {
          "blockId": "SAF1",
          "blockType": "information",
          "heading": "Safety teaching point",
          "content": "A cyber security incident can cause physical harm or place people at physical risk. Safety is not optional when the scenario supports it. Classroom examples include delayed healthcare, identity theft harms, oil-installation disruption and traffic-control interference.",
          "displayOrder": 21
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
          "questionId": "K1",
          "questionType": "single-choice",
          "prompt": "Which option is a disruption impact rather than a pure financial-loss statement?",
          "instruction": "Choose the strongest answer using Week 5 impact terminology.",
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
              "text": "Northbank paid \u00a32,000 in overtime"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Clinic booking services were unavailable for two working days"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "An attacker wanted income generation"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "A student copied a mark scheme"
            }
          ]
        },
        {
          "questionId": "K2",
          "questionType": "single-choice",
          "prompt": "Which statement best shows a safety impact?",
          "instruction": "Choose the strongest answer using Week 5 impact terminology.",
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
              "text": "Northbank\u2019s logo looks outdated"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "A patient misses a time-critical review because records and booking systems are down"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "A supplier invoice is emailed a day late"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Staff discuss the incident in a team meeting"
            }
          ]
        },
        {
          "questionId": "K3",
          "questionType": "single-choice",
          "prompt": "Loss, disruption and safety are:",
          "instruction": "Choose the strongest answer using Week 5 impact terminology.",
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
              "text": "Always mutually exclusive labels"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Categories that can overlap when a scenario supports more than one"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Only used for state-level incidents"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Replacements for naming stakeholders"
            }
          ]
        },
        {
          "questionId": "K4",
          "questionType": "single-choice",
          "prompt": "Which pair is most likely to continue after immediate recovery spending?",
          "instruction": "Choose the strongest answer using Week 5 impact terminology.",
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
              "text": "Emergency call-out fee and same-day taxi receipt"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Reputational loss and loss of customer confidence"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "A one-hour reboot delay only"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "A single printed leaflet cost"
            }
          ]
        },
        {
          "questionId": "K5",
          "questionType": "single-choice",
          "prompt": "Identity theft after a healthcare breach primarily harms:",
          "instruction": "Choose the strongest answer using Week 5 impact terminology.",
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
              "text": "Only the broadcasting regulator"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Individuals whose personal details are misused"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Only oil installations"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Nobody if backups exist"
            }
          ]
        },
        {
          "questionId": "K6",
          "questionType": "single-choice",
          "prompt": "When classifying an impact you should first identify:",
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
              "text": "A famous unrelated breach from the news"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Which service stopped, who depended on it, and how they were affected"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "The LO4 incident-response stage name"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "A risk score from Week 7"
            }
          ]
        },
        {
          "questionId": "K7",
          "questionType": "single-choice",
          "prompt": "Traffic-control interference is included in Week 5 mainly to illustrate:",
          "instruction": "Choose the strongest answer using Week 5 impact terminology.",
          "marks": 1,
          "required": true,
          "displayOrder": 7,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "Only financial loss for advertisers"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Disruption of a depended-on service and possible safety consequences"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Motivation taxonomy from Week 4"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Legislation from Week 6"
            }
          ]
        },
        {
          "questionId": "K8",
          "questionType": "single-choice",
          "prompt": "A strong impact answer for Northbank should usually include:",
          "instruction": "Choose the strongest answer using Week 5 impact terminology.",
          "marks": 1,
          "required": true,
          "displayOrder": 8,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "Only a list of malware names"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Named stakeholder, consequence, scenario evidence and timescale where relevant"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Invented controls not present in the briefing"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Official OCR examination paper numbers"
            }
          ]
        },
        {
          "questionId": "K9",
          "questionType": "single-choice",
          "prompt": "Why is \u201cthe organisation suffered\u201d a weak examination phrase on its own?",
          "instruction": "Choose the strongest answer using Week 5 impact terminology.",
          "marks": 1,
          "required": true,
          "displayOrder": 9,
          "minimumCharacters": 0,
          "maximumCharacters": 0,
          "minimumSelections": 0,
          "maximumSelections": 1,
          "options": [
            {
              "optionId": "a",
              "displayOrder": 1,
              "text": "Because organisations never suffer impacts"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Because it fails to name the stakeholder and the specific consequence"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Because only states can be named"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Because financial loss is forbidden"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "K1": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Unavailable clinic booking is disruption of a depended-on service.",
      "feedbackCorrect": "Correct. Unavailable clinic booking is disruption of a depended-on service.",
      "feedbackIncorrect": "Unavailable clinic booking is disruption of a depended-on service.",
      "misconceptionFeedback": "Unavailable clinic booking is disruption of a depended-on service."
    },
    "K2": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Delayed time-critical care places a person at physical risk.",
      "feedbackCorrect": "Correct. Delayed time-critical care places a person at physical risk.",
      "feedbackIncorrect": "Delayed time-critical care places a person at physical risk.",
      "misconceptionFeedback": "Delayed time-critical care places a person at physical risk."
    },
    "K3": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "A cancelled appointment may be disruption for the organisation and safety for the patient.",
      "feedbackCorrect": "Correct. A cancelled appointment may be disruption for the organisation and safety for the patient.",
      "feedbackIncorrect": "A cancelled appointment may be disruption for the organisation and safety for the patient.",
      "misconceptionFeedback": "A cancelled appointment may be disruption for the organisation and safety for the patient."
    },
    "K4": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Reputation and confidence harms may continue for months.",
      "feedbackCorrect": "Correct. Reputation and confidence harms may continue for months.",
      "feedbackIncorrect": "Reputation and confidence harms may continue for months.",
      "misconceptionFeedback": "Reputation and confidence harms may continue for months."
    },
    "K5": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Identity theft is an individual loss impact.",
      "feedbackCorrect": "Correct. Identity theft is an individual loss impact.",
      "feedbackIncorrect": "Identity theft is an individual loss impact.",
      "misconceptionFeedback": "Identity theft is an individual loss impact."
    },
    "K6": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Ask which service stopped, who depended on it, and how they were affected.",
      "feedbackCorrect": "Correct. Ask which service stopped, who depended on it, and how they were affected.",
      "feedbackIncorrect": "Ask which service stopped, who depended on it, and how they were affected.",
      "misconceptionFeedback": "Ask which service stopped, who depended on it, and how they were affected."
    },
    "K7": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Transport and traffic-control contexts show disruption and can raise safety issues.",
      "feedbackCorrect": "Correct. Transport and traffic-control contexts show disruption and can raise safety issues.",
      "feedbackIncorrect": "Transport and traffic-control contexts show disruption and can raise safety issues.",
      "misconceptionFeedback": "Transport and traffic-control contexts show disruption and can raise safety issues."
    },
    "K8": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Analysis needs stakeholder, consequence, evidence and timescale thinking.",
      "feedbackCorrect": "Correct. Analysis needs stakeholder, consequence, evidence and timescale thinking.",
      "feedbackIncorrect": "Analysis needs stakeholder, consequence, evidence and timescale thinking.",
      "misconceptionFeedback": "Analysis needs stakeholder, consequence, evidence and timescale thinking."
    },
    "K9": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Name who is affected and what happened.",
      "feedbackCorrect": "Correct. Name who is affected and what happened.",
      "feedbackIncorrect": "Name who is affected and what happened.",
      "misconceptionFeedback": "Name who is affected and what happened."
    }
  },
  "tutorData": {
    "lossForms": [
      {
        "id": "confidentiality",
        "term": "Loss of confidentiality",
        "explanation": "Information that should be restricted becomes known to unauthorised people.",
        "example": "Northbank patient contact details from a shared mailbox are emailed to the wrong external address.",
        "distinction": "Different from integrity: data may still be accurate but the wrong people can see it.",
        "misconception": "Treating this impact as only a financial problem.",
        "correction": "Name the stakeholder and the specific consequence, then decide whether loss, disruption or safety best fits.",
        "quickCheck": null
      },
      {
        "id": "integrity",
        "term": "Loss of integrity",
        "explanation": "Information is altered so it is no longer accurate or trustworthy.",
        "example": "Ransomware encrypts Northbank appointment records so staff cannot trust which visits remain scheduled.",
        "distinction": "Different from confidentiality: the issue is trustworthiness, not only who can see it.",
        "misconception": "Treating this impact as only a financial problem.",
        "correction": "Name the stakeholder and the specific consequence, then decide whether loss, disruption or safety best fits.",
        "quickCheck": null
      },
      {
        "id": "availability",
        "term": "Loss of availability",
        "explanation": "Systems, data or services cannot be used when needed.",
        "example": "Northbank\u2019s booking system is offline after encryption.",
        "distinction": "Closely linked to disruption, but availability focuses on whether the asset can be used.",
        "misconception": "Treating this impact as only a financial problem.",
        "correction": "Name the stakeholder and the specific consequence, then decide whether loss, disruption or safety best fits.",
        "quickCheck": null
      },
      {
        "id": "data",
        "term": "Loss of data",
        "explanation": "Data is destroyed, permanently inaccessible, or no longer recoverable in a usable form.",
        "example": "Northbank cannot restore last week\u2019s referral letters after backups fail.",
        "distinction": "Wider than temporary unavailability.",
        "misconception": "Treating this impact as only a financial problem.",
        "correction": "Name the stakeholder and the specific consequence, then decide whether loss, disruption or safety best fits.",
        "quickCheck": null
      },
      {
        "id": "financial",
        "term": "Financial loss",
        "explanation": "Money is spent, stolen or otherwise lost because of the incident.",
        "example": "Northbank pays emergency IT contractor fees and overtime.",
        "distinction": "Important, but not the only impact category.",
        "misconception": "Treating this impact as only a financial problem.",
        "correction": "Name the stakeholder and the specific consequence, then decide whether loss, disruption or safety best fits.",
        "quickCheck": null
      },
      {
        "id": "business",
        "term": "Loss of business",
        "explanation": "Customers, patients or partners take their activity elsewhere.",
        "example": "Local residents choose another clinic after repeated Northbank outages.",
        "distinction": "Related to, but not identical with, loss of customer confidence.",
        "misconception": "Treating this impact as only a financial problem.",
        "correction": "Name the stakeholder and the specific consequence, then decide whether loss, disruption or safety best fits.",
        "quickCheck": null
      },
      {
        "id": "identity",
        "term": "Identity loss or identity theft",
        "explanation": "Personal identifying information is misused so someone can pretend to be another person.",
        "example": "Stolen Northbank patient identity details are used to open fraudulent accounts.",
        "distinction": "A form of loss for the individual.",
        "misconception": "Treating this impact as only a financial problem.",
        "correction": "Name the stakeholder and the specific consequence, then decide whether loss, disruption or safety best fits.",
        "quickCheck": null
      },
      {
        "id": "reputation",
        "term": "Reputational loss",
        "explanation": "Trust in the organisation\u2019s competence or trustworthiness is damaged.",
        "example": "Local news reports Northbank cancelled clinics after ransomware.",
        "distinction": "May continue after immediate financial recovery costs are paid.",
        "misconception": "Treating this impact as only a financial problem.",
        "correction": "Name the stakeholder and the specific consequence, then decide whether loss, disruption or safety best fits.",
        "quickCheck": null
      },
      {
        "id": "confidence",
        "term": "Loss of customer confidence",
        "explanation": "Patients, customers or partners become less willing to trust the organisation.",
        "example": "Patients ask whether Northbank can keep medical information safe.",
        "distinction": "May continue for months after systems are restored.",
        "misconception": "Treating this impact as only a financial problem.",
        "correction": "Name the stakeholder and the specific consequence, then decide whether loss, disruption or safety best fits.",
        "quickCheck": null
      }
    ],
    "disruptionExamples": [
      {
        "id": "healthcare-services",
        "serviceAffected": "Community healthcare booking and clinic coordination",
        "stakeholderAffected": "Patients and Northbank reception/clinical staff",
        "immediateConsequence": "Appointments cannot be confirmed and clinics run from incomplete paper lists.",
        "longerTermConsequence": "Referral delays and reduced confidence in local healthcare access.",
        "otherCategoriesMayApply": "Safety where urgent care is delayed; loss where availability or reputation is harmed."
      },
      {
        "id": "hospitals",
        "serviceAffected": "Hospital clinical systems and scheduling",
        "stakeholderAffected": "Hospital patients and clinical teams",
        "immediateConsequence": "Planned procedures and ward processes slow or stop when systems are unavailable.",
        "longerTermConsequence": "Backlogs of postponed care and continuing pressure on staff.",
        "otherCategoriesMayApply": "Safety where treatment is delayed; loss of availability and reputation."
      },
      {
        "id": "transport-networks",
        "serviceAffected": "Transport network operations",
        "stakeholderAffected": "Passengers, operators and dependent organisations",
        "immediateConsequence": "Journeys are delayed, cancelled or unreliable.",
        "longerTermConsequence": "Reduced public confidence in the network and costly service recovery.",
        "otherCategoriesMayApply": "Safety if unsafe conditions arise during disrupted control; financial and reputational loss."
      },
      {
        "id": "broadcasters",
        "serviceAffected": "Broadcast and news distribution",
        "stakeholderAffected": "Audiences, broadcasters and advertisers",
        "immediateConsequence": "Programmes or live updates cannot be transmitted as planned.",
        "longerTermConsequence": "Audience trust and commercial relationships may take time to restore.",
        "otherCategoriesMayApply": "Loss of reputation and business; rarely safety unless emergency messaging fails."
      },
      {
        "id": "utilities",
        "serviceAffected": "Utility monitoring or customer service systems",
        "stakeholderAffected": "Households, businesses and utility operators",
        "immediateConsequence": "Service requests, billing or monitoring become unreliable.",
        "longerTermConsequence": "Customer confidence falls and regulatory scrutiny may continue.",
        "otherCategoriesMayApply": "Safety if physical utility control is affected; financial and reputational loss."
      }
    ],
    "safetyExamples": [
      {
        "id": "cancelled-healthcare",
        "context": "Cancelled or delayed healthcare",
        "explanation": "When appointments or urgent reviews cannot go ahead, clinical risk for a patient may increase.",
        "northbankExample": "An urgent review is cancelled while Northbank records and booking systems remain unavailable.",
        "classroomNote": "Keep the focus on increased risk, not graphic harm."
      },
      {
        "id": "identity-theft",
        "context": "Identity theft",
        "explanation": "Misused personal data can place individuals at risk of fraud and related personal harm.",
        "northbankExample": "Exposed patient contact details are later used for fraudulent account opening.",
        "classroomNote": "Treat identity theft as a serious personal consequence without sensational detail."
      },
      {
        "id": "oil-installations",
        "context": "Attacks on oil installations",
        "explanation": "Interference with industrial systems can create physical hazard for workers and surrounding communities.",
        "northbankExample": "Used as a non-Northbank comparison to show that cyber incidents can have physical safety consequences.",
        "classroomNote": "Do not invent graphic accident details."
      },
      {
        "id": "traffic-control",
        "context": "Interference with traffic-control systems",
        "explanation": "Unreliable signalling or traffic control can increase the chance of collisions or unsafe road conditions.",
        "northbankExample": "Used as a comparison example of physical safety risk outside healthcare.",
        "classroomNote": "Keep the example focused on increased risk, not sensational crash scenes."
      }
    ],
    "impactCategories": [
      "Loss",
      "Disruption",
      "Safety"
    ]
  }
});
