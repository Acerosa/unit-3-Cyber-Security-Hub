/**
 * Week 6 activity pack.
 */

var WEEK6_GUIDANCE_DATA = Object.freeze({
  "weekNumber": 6,
  "weekTitle": "Ethical, Legal and Operational Considerations",
  "loReference": "LO2 - Understand the issues surrounding cyber security",
  "teachingContent": "2.6 Other considerations (ethical, legal, operational, government initiatives)",
  "organisation": "Northbank Community Health Partnership",
  "learningOutcomes": [
    "Explain ethical considerations including responsible disclosure, employee monitoring and ethical hacking boundaries.",
    "Name United Kingdom legislation and link each statute to a relevant duty or offence.",
    "Explain operational considerations including cost, staff time, downtime, usability and productivity.",
    "Describe United Kingdom government cyber security initiatives and distinguish guidance from legislation.",
    "Separate legal obligations, ethical choices and operational judgements in Northbank scenarios.",
    "Structure balanced Discuss answers with competing considerations and concessions."
  ],
  "examinationFocus": [
    "Name statutes with duties or offences together where law is required.",
    "Separate ethical, legal and operational points.",
    "Use Northbank scenario evidence. Do not import unrelated incidents.",
    "Discuss questions need a competing consideration, concession and justified conclusion.",
    "Do not invent DPA section numbers, notification periods or penalty amounts.",
    "Government initiatives are guidance, not criminal statutes."
  ],
  "session1Summary": "LO2 diagnostic, ethical and legislation learning, classification and matching, operational considerations, government initiatives, NCSC Exercise in a Box insider threat companion and decision record.",
  "session2Summary": "Legislation retrieval, employee monitoring and stakeholder debate, Discuss learning and planner, OCR-style timed questions, answer improvement and LO2 revision organiser.",
  "directedStudySummary": "Cisco governance and compliance; TryHackMe ISO 27001 and Legal Considerations in DFIR; NCSC Cyber Essentials and 10 Steps research.",
  "platforms": {
    "session1": {
      "name": "NCSC Exercise in a Box",
      "exerciseTitle": "Insider threat resulting in a data breach",
      "url": "https://www.ncsc.gov.uk/section/exercise-in-a-box/insider-threat-data-breach",
      "overviewUrl": "https://www.ncsc.gov.uk/section/exercise-in-a-box/overview",
      "note": "Tutor-facilitated. The API stores companion guidance only and does not reproduce staged NCSC prompts."
    },
    "directedStudy": {
      "name": "TryHackMe",
      "rooms": [
        {
          "room": "ISO 27001",
          "url": "https://tryhackme.com/room/iso27001"
        },
        {
          "room": "Legal Considerations in DFIR",
          "url": "https://tryhackme.com/room/dfirprocesslegalconsiderations"
        }
      ],
      "note": "Do not store room answers or flags in this API."
    }
  },
  "tryHackMe": {
    "rooms": [
      {
        "room": "ISO 27001",
        "url": "https://tryhackme.com/room/iso27001",
        "recordFields": [
          "One control or concept from the room",
          "How ISO 27001 as a management standard differs from a legal duty under current United Kingdom data protection legislation"
        ]
      },
      {
        "room": "Legal Considerations in DFIR",
        "url": "https://tryhackme.com/room/dfirprocesslegalconsiderations",
        "recordFields": [
          "Two investigator constraints that could affect how Northbank handles digital evidence or internal inquiries"
        ]
      }
    ],
    "restrictions": [
      "Do not store answers to TryHackMe rooms.",
      "Do not reproduce room tasks or flags."
    ]
  },
  "directedStudy": {
    "ciscoTask": {
      "title": "Cisco Cyber Threat Management: governance and compliance",
      "instructions": [
        "Review the Cisco Cyber Threat Management material on governance and compliance assigned by your tutor.",
        "Record the difference between a compliance framework and legislation.",
        "Give one Northbank example where both could apply after the insider breach."
      ]
    },
    "tryhackmeIso": {
      "room": "ISO 27001",
      "url": "https://tryhackme.com/room/iso27001",
      "note": "Do not reproduce room content or answers here. Record your own findings after authorised access.",
      "recordFields": [
        "One control or concept from the room",
        "How ISO 27001 as a management standard differs from a legal duty under current United Kingdom data protection legislation"
      ]
    },
    "tryhackmeLegal": {
      "room": "Legal Considerations in DFIR",
      "url": "https://tryhackme.com/room/dfirprocesslegalconsiderations",
      "note": "Do not reproduce room content or answers here. Record your own findings after authorised access.",
      "recordFields": [
        "Two investigator constraints that could affect how Northbank handles digital evidence or internal inquiries"
      ]
    },
    "ncscResearch": {
      "title": "Cyber Essentials and 10 Steps to Cyber Security",
      "links": [
        {
          "label": "Cyber Essentials overview (NCSC)",
          "url": "https://www.ncsc.gov.uk/cyberessentials/overview"
        },
        {
          "label": "10 Steps to Cyber Security (NCSC)",
          "url": "https://www.ncsc.gov.uk/collection/10-steps"
        }
      ],
      "summaryPrompt": "Write a one-page summary comparing what Cyber Essentials and the 10 Steps offer Northbank-sized community healthcare."
    },
    "lo2Checklist": [
      "2.1 Threats: I can explain relevant threat types for Northbank.",
      "2.2 Vulnerabilities and attackers: I can link vulnerabilities to insider and external attackers.",
      "2.3 Motivations: I can explain why an insider or external attacker might act.",
      "2.4 Targets: I can identify what Northbank assets or data may be targeted.",
      "2.5 Impacts: I can analyse loss, disruption and safety for stakeholders.",
      "2.6 Other considerations: I can separate ethical, legal and operational points and name required statutes."
    ],
    "revisionPriorities": [
      "Revision priority 1 after this directed study",
      "Revision priority 2 after this directed study"
    ],
    "leavingHubNotice": "Some tasks open external sites or college materials outside this Unit 3 Hub. The hub does not verify external completion."
  },
  "support": {
    "legislationCards": [
      {
        "title": "Computer Misuse Act 1990",
        "summary": "Creates offences such as unauthorised access to computer material and related misuse. Relevant when an insider accesses records without authority."
      },
      {
        "title": "Current United Kingdom data protection legislation",
        "summary": "Sets duties for handling personal data, including security, accountability and transparency. Relevant when patient contact details are copied or exposed."
      },
      {
        "title": "Police and Justice Act 2006 amendments",
        "summary": "Addresses supplying tools for misuse under the Computer Misuse Act 1990. Relevant when considering hacking or testing tools without clear authorisation."
      }
    ],
    "roleCards": [
      {
        "role": "Employees",
        "prompts": [
          "What monitoring feels fair or excessive?",
          "How could trust affect day-to-day care?",
          "What transparency would you expect?"
        ]
      },
      {
        "role": "Managers",
        "prompts": [
          "What repeat insider risk must be reduced?",
          "What operational burden could monitoring create?",
          "How will you explain decisions to staff?"
        ]
      },
      {
        "role": "Customers",
        "prompts": [
          "What assurance do patients need about contact details?",
          "What ethical expectation exists beyond minimum law?",
          "Could monitoring affect service experience?"
        ]
      },
      {
        "role": "The data protection regulator",
        "prompts": [
          "Which legal duties were engaged by the breach?",
          "Was monitoring proportionate and transparent?",
          "What evidence would you expect in an explanation?"
        ]
      },
      {
        "role": "Shareholders",
        "prompts": [
          "What assurance reduces repeat misuse risk?",
          "What costs or downtime could monitoring create?",
          "How is reputational harm managed?"
        ]
      }
    ],
    "sentenceStarters": [
      "The issue is whether…",
      "One supported reason is…",
      "However, [stakeholder] might argue…",
      "Concession: I accept that…",
      "Overall, Northbank should… because…"
    ],
    "workedExamples": [
      {
        "title": "Statute linked to duty",
        "text": "Under current United Kingdom data protection legislation, Northbank must protect patient contact details and explain how insider access is controlled."
      },
      {
        "title": "Ethical versus legal",
        "text": "Enhanced monitoring may be lawful in some forms, but employees may still argue it is unfair if applied without transparency or proportionality."
      }
    ],
    "stepByStep": [
      "State the Northbank monitoring issue in one sentence.",
      "Add one supported point with scenario evidence.",
      "Add one competing consideration from another stakeholder.",
      "Write a labelled concession.",
      "Conclude with a balanced judgement."
    ],
    "accessibility": {
      "title": "Universal design and accessibility",
      "points": [
        "Plain-language legislation cards and role cards are provided.",
        "Structured grids and sentence starters are optional scaffolding.",
        "Keyboard-accessible forms and visible focus states are required.",
        "Do not communicate information by colour alone.",
        "Reduced-motion preferences are respected in CSS where animations exist."
      ]
    },
    "note": "Support scaffolds must not give away all answers."
  },
  "supportChallenge": {
    "note": "See support and challenges properties.",
    "supportRef": "support",
    "challengesRef": "challenges",
    "recorderOption": "Recorder role: capture main arguments, evidence, concessions and recommendations without debating every point yourself.",
    "plannerGrid": {
      "title": "Three-column Discuss grid",
      "columns": [
        "Supporting argument",
        "Competing consideration",
        "Concession and conclusion (label the concession clearly)"
      ]
    }
  },
  "challenges": [
    {
      "id": "challenge-1",
      "title": "Optional extension 1: Legal compliance and ethical behaviour",
      "prompt": "Argue whether legal compliance alone is sufficient for ethical behaviour in the Northbank insider case. Respond to one counterargument."
    },
    {
      "id": "challenge-2",
      "title": "Optional extension 2: Security versus usability",
      "prompt": "Compare the most secure and least usable monitoring option for Northbank. Which trade-off would you defend?"
    },
    {
      "id": "challenge-3",
      "title": "Optional extension 3: Cyber Essentials versus ISO 27001",
      "prompt": "For Northbank Community Health Partnership’s size and purpose, compare Cyber Essentials with ISO 27001. Which is more realistic as a starting point and why?"
    }
  ]
});
