/**
 * Week 4 activity data — Motivations and Targets (2.3 / 2.4).
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }
  global.Week4Session1Retrieval = Object.freeze({
  activityId: 'week4-session1-retrieval',
  activityName: 'Session 1 Retrieval and Homework Harvest',
  activityVersion: '1.0',
  weekNumber: 4,
  sessionNumber: 1,
  total: 10,
  estimatedMinutes: 20,
  attackerTypes: Object.freeze([
    'Hacktivist',
    'Cyber-criminal',
    'Insider',
    'Script kiddie',
    'Scammers / fraudsters',
    'Phishers',
    'Cyber-terrorist',
    'Vulnerability broker'
  ]),
  researchProfileKey: 'unit3-week3-attacker-research-profile',
  questions: Object.freeze([
    Object.freeze({
      id: 's1q1',
      prompt: 'Which OCR attacker type typically promotes a political, social or ethical cause?',
      options: Object.freeze(['Hacktivist', 'Script kiddie', 'Vulnerability broker', 'Cyber-criminal']),
      correctIndex: 0,
      explanation: 'A hacktivist uses cyber methods to promote a cause. Do not confuse this with cyber-terrorism.'
    }),
    Object.freeze({
      id: 's1q2',
      prompt: 'Which attacker type is defined mainly by financial gain or criminal profit?',
      options: Object.freeze(['Hacktivist', 'Cyber-criminal', 'Script kiddie', 'Cyber-terrorist']),
      correctIndex: 1,
      explanation: 'Cyber-criminals are characterised by profit-seeking activity.'
    }),
    Object.freeze({
      id: 's1q3',
      prompt: 'An insider is best described as:',
      options: Object.freeze([
        'Anyone who uses phishing',
        'A person with legitimate access who causes harm through malicious or negligent behaviour',
        'Only an external criminal group',
        'A person who always seeks publicity'
      ]),
      correctIndex: 1,
      explanation: 'Legitimate access is the key feature of an insider threat.'
    }),
    Object.freeze({
      id: 's1q4',
      prompt: 'A script kiddie is most accurately associated with:',
      options: Object.freeze([
        'Advanced custom exploit development only',
        'Limited skill and use of ready-made tools',
        'State-sponsored espionage',
        'Authorised penetration testing'
      ]),
      correctIndex: 1,
      explanation: 'Script kiddies typically rely on existing tools rather than advanced custom capability.'
    }),
    Object.freeze({
      id: 's1q5',
      prompt: 'Phishers are primarily associated with which method family?',
      options: Object.freeze([
        'Physical damage to equipment',
        'Deceptive messages designed to obtain credentials or sensitive action',
        'Quiet espionage without human contact',
        'Supply-chain hardware theft'
      ]),
      correctIndex: 1,
      explanation: 'Phishing uses deceptive messages. Remember: phishing is a method, not a motivation.'
    }),
    Object.freeze({
      id: 's1q6',
      prompt: 'Week 4 asks you to move from who the attacker is to:',
      options: Object.freeze([
        'Only listing more attacker types',
        'What the attacker wanted (motivation)',
        'Writing legislation essays',
        'Scanning unauthorised networks'
      ]),
      correctIndex: 1,
      explanation: 'Week 4 focuses on motivation (why), then target and method.'
    }),
    Object.freeze({
      id: 's1q7',
      prompt: 'Which answer is a method rather than a motivation?',
      options: Object.freeze(['Publicity', 'Fraud', 'Phishing', 'Thrill']),
      correctIndex: 2,
      explanation: 'Phishing describes how an attack is carried out. The others are motivations.'
    }),
    Object.freeze({
      id: 's1q8',
      prompt: 'A vulnerability broker typically:',
      options: Object.freeze([
        'Defaces websites for protest messages',
        'Finds and trades or reports vulnerabilities, often for payment',
        'Always works only for public good with no payment',
        'Is identical to a cyber-terrorist'
      ]),
      correctIndex: 1,
      explanation: 'Vulnerability brokers deal in vulnerability information, often linked to payment or disclosure routes.'
    }),
    Object.freeze({
      id: 's1q9',
      prompt: 'Motivation means:',
      options: Object.freeze(['Why the attacker acted', 'What was attacked', 'How the attack was carried out', 'Which tool was used']),
      correctIndex: 0,
      explanation: 'Motivation = why. Target = what. Method = how.'
    }),
    Object.freeze({
      id: 's1q10',
      prompt: 'Targets for cyber security threats include:',
      options: Object.freeze([
        'Only large hospital trusts',
        'People, organisations, equipment and information',
        'Only passwords',
        'Only malware families'
      ]),
      correctIndex: 1,
      explanation: 'OCR Week 4 target categories are people, organisations, equipment and information.'
    })
  ]),
  harvestPrompts: Object.freeze({
    intro: 'Select or review one Week 3 attacker research profile. If your saved profile is not available in this browser, use your written Week 3 profile notes. Do not invent a learner profile.',
    fields: Object.freeze([
      Object.freeze({ id: 'attackerType', label: 'Attacker type', required: true }),
      Object.freeze({ id: 'tryingToAchieve', label: 'What was the attacker trying to achieve?', required: true }),
      Object.freeze({ id: 'evidence', label: 'Evidence that supports that interpretation', required: true })
    ]),
    placeholderNotice: 'No Week 3 attacker research profile was found in this browser. Use your Week 3 directed-study profile notes to complete the harvest fields.'
  })
});
})(window);
