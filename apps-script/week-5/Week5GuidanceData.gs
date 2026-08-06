/**
 * Week 5 non-scored guidance: overview, NCSC, TryHackMe, directed study, support and challenge.
 */

var WEEK5_GUIDANCE_DATA = Object.freeze({
  weekNumber: 5,
  weekTitle: 'Impacts of Cyber Security Incidents',
  loReference: 'LO2 — Understand the issues surrounding cyber security',
  teachingContent: '2.5 Impacts of cyber security incidents',
  organisation: 'Northbank Community Health Partnership',
  learningOutcomes: Object.freeze([
    'Explain why cyber security is a global problem affecting individuals, organisations and states.',
    'Identify and describe impacts relating to loss, disruption and safety.',
    'Explain how a single incident affects different stakeholders in different ways.',
    'Analyse the impacts of a cyber security incident using evidence from a scenario.'
  ]),
  examinationFocus: Object.freeze([
    'Cover loss, disruption and safety when a question asks for impacts.',
    'Name the stakeholder affected.',
    'Distinguish immediate from longer-term consequences.',
    'Use evidence from the scenario to support each claimed impact.',
    'Do not import facts from an unrelated cyber security incident.',
    'Analyse consequences rather than listing impact words.'
  ]),
  session1Summary:
    'Retrieve Week 4 ideas, learn impact categories, classify statements, then use the Northbank ransomware Exercise in a Box companion workspace.',
  session2Summary:
    'Retrieval quiz, stakeholder impact grid, analytical writing practice, OCR-style questions and answer improvement.',
  directedStudySummary:
    'TryHackMe Juicy Details; real-incident stakeholder grid; Northbank decision challenge ready for Week 6.',
  platforms: Object.freeze({
    session1: Object.freeze({
      name: 'NCSC Exercise in a Box',
      exerciseTitle: 'Responding to a ransomware attack',
      url: 'https://www.ncsc.gov.uk/section/exercise-in-a-box/responding-ransomware-attack',
      overviewUrl: 'https://www.ncsc.gov.uk/section/exercise-in-a-box/overview',
      note: 'Tutor-facilitated. The API stores companion guidance only and does not reproduce staged NCSC prompts.'
    }),
    directedStudy: Object.freeze({
      name: 'TryHackMe',
      room: 'Juicy Details',
      url: 'https://tryhackme.com/room/juicydetails',
      note: 'Do not store room answers or flags in this API.'
    })
  }),
  tryHackMe: Object.freeze({
    room: 'Juicy Details',
    url: 'https://tryhackme.com/room/juicydetails',
    recordFields: Object.freeze([
      'What was taken in the breach',
      'How investigators established what happened',
      'Which impact category or categories apply',
      'Evidence supporting the classification'
    ]),
    restrictions: Object.freeze([
      'Do not store answers to the TryHackMe room.',
      'Do not reproduce room tasks or flags.'
    ])
  }),
  directedStudy: Object.freeze({
    realIncidentGrid: Object.freeze([
      'Select a real cyber security incident and record the source.',
      'Analyse at least four stakeholder groups.',
      'Cover loss, disruption and safety.',
      'Identify the stakeholder most seriously affected and justify that conclusion.'
    ]),
    decisionChallenge: Object.freeze([
      'Review the Northbank ransomware decisions.',
      'Select one decision you would challenge.',
      'Write two sentences explaining why.',
      'Prepare to defend the position during Week 6.'
    ])
  }),
  support: Object.freeze({
    definitions: Object.freeze({
      loss: 'Something of value is taken, damaged, corrupted, reduced or no longer trusted.',
      disruption: 'A service, process or operation stops, slows or becomes unreliable for people who depend on it.',
      safety: 'People are placed at physical risk, or physical harm becomes more likely, because of the cyber incident.'
    }),
    sentenceStarters: Object.freeze([
      'Immediately after the incident…',
      'This would affect the stakeholder because…',
      'Six months later…',
      'The scenario states that…, which means…',
      'This is a safety impact because…'
    ]),
    checklist: Object.freeze([
      'Have I considered loss?',
      'Have I considered disruption?',
      'Have I considered safety?',
      'Have I named whose perspective I am using?'
    ]),
    note: 'Support scaffolds must not give away all answers.'
  }),
  supportChallenge: Object.freeze({
    note: 'See support and challenges properties.',
    supportRef: 'support',
    challengesRef: 'challenges'
  }),
  challenges: Object.freeze([
    Object.freeze({
      id: 'challenge-1',
      title: 'Challenge 1 — Ranking impacts for Northbank',
      prompt:
        'Rank financial, reputational and safety impacts by how damaging each would be to Northbank specifically. Justify your ranking and respond to one counterargument.'
    }),
    Object.freeze({
      id: 'challenge-2',
      title: 'Challenge 2 — Organisation comparison',
      prompt:
        'Compare how the same ransomware incident would affect Northbank Community Health Partnership and a national infrastructure provider. Explain why size and organisational purpose change the impact.'
    }),
    Object.freeze({
      id: 'challenge-3',
      title: 'Challenge 3 — Reasoned cost estimate',
      prompt:
        'Create a reasoned classroom cost estimate under recovery, regulatory consequences, lost trade or lost service, and insurance. State which estimate is hardest to defend. These are reasoned approximations, not verified Northbank financial figures.'
    })
  ])
});
