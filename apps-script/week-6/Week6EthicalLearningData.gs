/**
 * Week 6 activity pack.
 */

var WEEK6_PACK_ETHICAL_LEARNING = Object.freeze({
  "meta": {
    "activityId": "week6-ethical-learning",
    "activityName": "Ethical Considerations Learning",
    "weekNumber": 6,
    "sessionNumber": 1,
    "sessionName": "Session 1",
    "activityType": "Guided learning",
    "activityVersion": "1.0",
    "maximumScore": 6,
    "allowsPartner": false,
    "enabled": true,
    "componentId": "guided-learning",
    "introduction": "Ethical considerations ask what is right or fair, even when the law may not clearly forbid an action. Week 6 builds on earlier LO2 topics and connects to Week 3 penetration testing ideas: permission, scope and rules of engagement.",
    "completionMessage": "Separate ethical judgement from legal duties and operational practicality."
  },
  "sections": [
    {
      "sectionId": "LEARNING",
      "sectionType": "learning",
      "title": "Ethical considerations",
      "displayOrder": 1,
      "feedbackTiming": "none",
      "contentBlocks": [
        {
          "blockId": "EOV",
          "blockType": "information",
          "heading": "Overview",
          "content": "Ethical considerations ask what is right or fair, even when the law may not clearly forbid an action. Week 6 builds on earlier LO2 topics and connects to Week 3 penetration testing ideas: permission, scope and rules of engagement.",
          "displayOrder": 0
        },
        {
          "blockId": "EL_disclosure",
          "blockType": "information",
          "heading": "Responsible disclosure",
          "content": "When someone discovers a vulnerability, responsible disclosure means reporting it to the organisation or vendor so it can be fixed before wider harm occurs. Publicly dumping exploit details without warning can put patients and staff at risk. Ethical researchers balance helping improve security with avoiding unnecessary damage. Northbank example: If a contractor finds that Northbank patient portal sessions expire too slowly, reporting through the agreed channel allows IT to patch before criminals exploit the flaw.",
          "displayOrder": 1
        },
        {
          "blockId": "EL_monitoring",
          "blockType": "information",
          "heading": "Employee monitoring",
          "content": "Organisations may monitor staff activity to detect misuse or insider threats, but monitoring must be proportionate, transparent where required and respectful of privacy. After an insider data breach, Northbank may review access logs, but blanket surveillance without justification can damage trust and morale. Northbank example: Following an insider threat exercise, Northbank might increase logging on sensitive record access, but should explain why and limit monitoring to what is needed for investigation.",
          "displayOrder": 2
        },
        {
          "blockId": "EL_auth",
          "blockType": "information",
          "heading": "Ethical hacking and the authorisation boundary",
          "content": "Ethical hacking tests defences with permission. From Week 3, penetration testing requires explicit permission, a defined scope (which systems may be tested) and rules of engagement (what techniques are allowed and when). Testing outside scope is not ethical hacking, even if the tester has good intentions. Northbank example: A contracted tester may probe Northbank external web services listed in the scope document, but must not attempt social engineering of patients unless the rules of engagement allow it. Week 3 reminder: permission, scope and rules of engagement define where ethical testing ends and unauthorised activity begins.",
          "displayOrder": 3
        },
        {
          "blockId": "EL_ethics-law",
          "blockType": "information",
          "heading": "Ethics versus law",
          "content": "Something can be lawful but still unethical, or unethical but still lawful in a grey area. Examination answers must not treat moral disapproval as if it were a statute. Name ethical reasons separately from legal duties. Northbank example: Reading a colleague unlocked screen to satisfy curiosity may breach Northbank policy and be unethical, but whether it is unlawful depends on authorisation and context. Do not assume every bad action is a named offence.",
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
          "questionId": "DISCLOSURE_CHECK",
          "questionType": "single-choice",
          "prompt": "Which action best demonstrates responsible disclosure?",
          "instruction": "Ethical considerations learning check.",
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
              "text": "Posting exploit code on social media immediately"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Reporting the flaw through the organisation agreed channel and allowing reasonable time to fix"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Ignoring the flaw because it is not illegal"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Selling access to the vulnerability on a forum"
            }
          ]
        },
        {
          "questionId": "MONITORING_CHECK",
          "questionType": "single-choice",
          "prompt": "Which statement best reflects an ethical approach to employee monitoring?",
          "instruction": "Ethical considerations learning check.",
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
              "text": "Monitor everything secretly with no business reason"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Use proportionate monitoring with a clear purpose linked to security or misconduct concerns"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Never monitor staff under any circumstances"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Share monitored data publicly to deter misuse"
            }
          ]
        },
        {
          "questionId": "AUTH_CHECK",
          "questionType": "single-choice",
          "prompt": "A tester probes a system not listed in the signed scope document. This is best described as:",
          "instruction": "Ethical considerations learning check.",
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
              "text": "Ethical hacking because they are a professional"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Outside the authorisation boundary even if other systems were in scope"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Always lawful if no data is copied"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Operational downtime only"
            }
          ]
        },
        {
          "questionId": "ETHICS_LAW_CHECK",
          "questionType": "single-choice",
          "prompt": "Which examination habit is most appropriate?",
          "instruction": "Ethical considerations learning check.",
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
              "text": "Call every unethical action a Computer Misuse Act offence"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Separate ethical judgement from named legal duties and offences"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Ignore ethics because only law matters"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Use Cyber Streetwise as a statute name"
            }
          ]
        },
        {
          "questionId": "EK1",
          "questionType": "single-choice",
          "prompt": "Responsible disclosure mainly aims to:",
          "instruction": "Ethical considerations knowledge check.",
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
              "text": "Maximise publicity for the researcher"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Allow organisations to fix flaws before wider exploitation"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Replace data protection legislation"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Eliminate the need for penetration testing"
            }
          ]
        },
        {
          "questionId": "EK2",
          "questionType": "single-choice",
          "prompt": "Which Week 3 idea limits what an ethical tester may do?",
          "instruction": "Ethical considerations knowledge check.",
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
              "text": "Rules of engagement"
            },
            {
              "optionId": "b",
              "displayOrder": 2,
              "text": "Lost productivity"
            },
            {
              "optionId": "c",
              "displayOrder": 3,
              "text": "Cyber Essentials Scheme"
            },
            {
              "optionId": "d",
              "displayOrder": 4,
              "text": "Safety impact only"
            }
          ]
        }
      ]
    }
  ],
  "assessment": {
    "DISCLOSURE_CHECK": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Responsible disclosure reports the issue through proper channels and allows time to remediate before public release.",
      "feedbackCorrect": "Correct. Responsible disclosure reports the issue through proper channels and allows time to remediate before public release.",
      "feedbackIncorrect": "Responsible disclosure reports the issue through proper channels and allows time to remediate before public release.",
      "misconceptionFeedback": "Responsible disclosure reports the issue through proper channels and allows time to remediate before public release."
    },
    "MONITORING_CHECK": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Ethical monitoring is proportionate, purpose-driven and respects privacy expectations.",
      "feedbackCorrect": "Correct. Ethical monitoring is proportionate, purpose-driven and respects privacy expectations.",
      "feedbackIncorrect": "Ethical monitoring is proportionate, purpose-driven and respects privacy expectations.",
      "misconceptionFeedback": "Ethical monitoring is proportionate, purpose-driven and respects privacy expectations."
    },
    "AUTH_CHECK": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Authorisation is limited to agreed scope. Testing other systems crosses the ethical and legal boundary without permission.",
      "feedbackCorrect": "Correct. Authorisation is limited to agreed scope. Testing other systems crosses the ethical and legal boundary without permission.",
      "feedbackIncorrect": "Authorisation is limited to agreed scope. Testing other systems crosses the ethical and legal boundary without permission.",
      "misconceptionFeedback": "Authorisation is limited to agreed scope. Testing other systems crosses the ethical and legal boundary without permission."
    },
    "ETHICS_LAW_CHECK": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Distinguish ethical arguments from legal requirements. Name legislation and duties accurately when law applies.",
      "feedbackCorrect": "Correct. Distinguish ethical arguments from legal requirements. Name legislation and duties accurately when law applies.",
      "feedbackIncorrect": "Distinguish ethical arguments from legal requirements. Name legislation and duties accurately when law applies.",
      "misconceptionFeedback": "Distinguish ethical arguments from legal requirements. Name legislation and duties accurately when law applies."
    },
    "EK1": {
      "correctOptionId": "b",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "The goal is safer remediation, not publicity or replacing legal frameworks.",
      "feedbackCorrect": "Correct. The goal is safer remediation, not publicity or replacing legal frameworks.",
      "feedbackIncorrect": "The goal is safer remediation, not publicity or replacing legal frameworks.",
      "misconceptionFeedback": "The goal is safer remediation, not publicity or replacing legal frameworks."
    },
    "EK2": {
      "correctOptionId": "a",
      "autoMark": true,
      "scoringMode": "exact",
      "explanation": "Rules of engagement, with permission and scope, define authorised testing boundaries.",
      "feedbackCorrect": "Correct. Rules of engagement, with permission and scope, define authorised testing boundaries.",
      "feedbackIncorrect": "Rules of engagement, with permission and scope, define authorised testing boundaries.",
      "misconceptionFeedback": "Rules of engagement, with permission and scope, define authorised testing boundaries."
    }
  },
  "tutorData": {
    "sectionIds": [
      "disclosure",
      "monitoring",
      "auth",
      "ethics-law"
    ]
  }
});
