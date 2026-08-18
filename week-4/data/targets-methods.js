/**
 * Week 4 activity data — Motivations and Targets (2.3 / 2.4).
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }
  global.Week4TargetsMethods = Object.freeze({
  activityId: 'week4-targets-methods',
  activityName: 'Targets and Methods',
  activityVersion: '1.0',
  weekNumber: 4,
  sessionNumber: 1,
  total: 8,
  whyWhatHow: Object.freeze({
    why: 'Motivation — why the attacker acted',
    what: 'Target — what was attacked',
    how: 'Method — how the attack was conducted'
  }),
  targetCategories: Object.freeze([
    Object.freeze({
      id: 'people',
      term: 'People',
      methods: Object.freeze(['Social engineering', 'Phishing']),
      explanation: 'People are targeted when the attacker manipulates human trust or behaviour.'
    }),
    Object.freeze({
      id: 'organisations',
      term: 'Organisations',
      methods: Object.freeze(['System compromise', 'Supply-chain compromise']),
      explanation: 'Organisations are targeted when systems, processes or trusted suppliers are compromised.'
    }),
    Object.freeze({
      id: 'equipment',
      term: 'Equipment',
      methods: Object.freeze(['Theft', 'Damage']),
      explanation: 'Equipment is targeted when devices or hardware are stolen or physically harmed.'
    }),
    Object.freeze({
      id: 'information',
      term: 'Information',
      methods: Object.freeze(['Interception', 'Exfiltration']),
      explanation: 'Information is targeted when data is intercepted in transit or taken from systems.'
    })
  ]),
  classificationItems: Object.freeze([
    Object.freeze({
      id: 'tm1',
      statement: 'The attacker wanted to raise awareness of a protest message.',
      correctCategory: 'motivation',
      explanation: 'This describes why the attacker acted (publicity).'
    }),
    Object.freeze({
      id: 'tm2',
      statement: 'Reception staff were targeted with fake payroll emails.',
      correctCategory: 'target',
      explanation: 'People are the target category. Phishing would be the method.'
    }),
    Object.freeze({
      id: 'tm3',
      statement: 'The attacker used phishing to collect login details.',
      correctCategory: 'method',
      explanation: 'Phishing describes how the attack was carried out.'
    }),
    Object.freeze({
      id: 'tm4',
      statement: 'A clinic laptop was stolen from an unlocked room.',
      correctCategory: 'method',
      explanation: 'Theft is a method used against equipment. The equipment is the target.'
    }),
    Object.freeze({
      id: 'tm5',
      statement: 'Patient appointment records were copied out of the system.',
      correctCategory: 'method',
      explanation: 'Exfiltration describes how information was taken. Information is the target.'
    }),
    Object.freeze({
      id: 'tm6',
      statement: 'The attacker aimed to generate income through a ransom demand.',
      correctCategory: 'motivation',
      explanation: 'Income generation is why the attacker acted. Ransomware language alone is not the motivation label.'
    }),
    Object.freeze({
      id: 'tm7',
      statement: 'A trusted supplier portal was compromised to reach Northbank systems.',
      correctCategory: 'method',
      explanation: 'Supply-chain compromise is a method used against an organisation target.'
    }),
    Object.freeze({
      id: 'tm8',
      statement: 'The main thing attacked was the organisation’s booking systems.',
      correctCategory: 'target',
      explanation: 'Organisations (and their systems) are what was targeted.'
    })
  ]),
  categories: Object.freeze(['motivation', 'target', 'method'])
});
})(window);
