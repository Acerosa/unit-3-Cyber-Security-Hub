/**
 * Week 4 activity data — Motivations and Targets (2.3 / 2.4).
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }
  global.Week4Motivations = Object.freeze({
  activityId: 'week4-motivations-learning',
  activityName: 'Motivations for Attack',
  activityVersion: '1.0',
  weekNumber: 4,
  sessionNumber: 1,
  total: 8,
  distinction: Object.freeze({
    motivation: 'Why the attacker acted',
    target: 'What was attacked',
    method: 'How the attack was carried out'
  }),
  misconceptions: Object.freeze([
    'Answering a motivation question with a method (for example saying the attacker was motivated by phishing)',
    'Treating fraud and income generation as identical',
    'Collapsing thrill and publicity into a single idea of showing off',
    'Assuming the target is always an organisation'
  ]),
  motivations: Object.freeze([
    Object.freeze({
      id: 'espionage',
      term: 'Espionage',
      definition: 'Gathering confidential information secretly for a state, competitor or other interested party.',
      explanation: 'The attacker wants information advantage, not necessarily publicity or immediate payment.',
      evidence: 'Quiet collection of sensitive data; focus on secrecy; interest in strategic or commercial intelligence.',
      testQuestion: 'Did the attacker want information that others did not intend to share, without drawing attention?'
    }),
    Object.freeze({
      id: 'righting-wrongs',
      term: 'Righting perceived wrongs',
      definition: 'Acting because the attacker believes an injustice needs to be corrected.',
      explanation: 'The driver is a grievance or sense of unfairness, whether or not others agree with that view.',
      evidence: 'Statements about injustice; targeting linked to a dispute; emphasis on making something “right”.',
      testQuestion: 'Was the attacker mainly trying to correct something they believed was unfair?'
    }),
    Object.freeze({
      id: 'public-good',
      term: 'Public good',
      definition: 'Claiming to act for the benefit of society, patients, citizens or the wider public.',
      explanation: 'A claimed public-good motive does not make the act lawful. Learners still separate motivation from legality.',
      evidence: 'Claims about protecting the public; disclosures framed as warnings; statements about patient or citizen benefit.',
      testQuestion: 'Did the attacker claim the main reason for acting was to benefit the public?'
    }),
    Object.freeze({
      id: 'publicity',
      term: 'Publicity',
      definition: 'Seeking attention, visibility or awareness for a message, group or cause.',
      explanation: 'Publicity is about being noticed. It is not the same as thrill-seeking for personal excitement.',
      evidence: 'Defacement messages; media contact; timing chosen for maximum visibility.',
      testQuestion: 'Did the attacker want the incident to be noticed?'
    }),
    Object.freeze({
      id: 'thrill',
      term: 'Thrill',
      definition: 'Acting mainly for excitement, challenge or personal enjoyment.',
      explanation: 'Thrill focuses on the experience of the attack, not necessarily on a public message.',
      evidence: 'Boasting in private channels; focus on difficulty of the challenge; little coherent public cause.',
      testQuestion: 'Was the main reason personal excitement or challenge rather than a public message or profit?'
    }),
    Object.freeze({
      id: 'fraud',
      term: 'Fraud',
      definition: 'Gaining money or advantage through deception.',
      explanation: 'Fraud requires deception. It is not identical to every form of income generation.',
      evidence: 'Fake invoices; spoofed identity; tricking staff into transferring funds or credentials.',
      testQuestion: 'Did the attacker use deception to obtain money or another advantage?'
    }),
    Object.freeze({
      id: 'score-settling',
      term: 'Score settling',
      definition: 'Acting to punish, retaliate or get even with a person or organisation.',
      explanation: 'The driver is revenge or retaliation linked to a prior conflict.',
      evidence: 'Prior dispute; personal targeting; messages about payback.',
      testQuestion: 'Was the attacker mainly trying to retaliate against someone or something?'
    }),
    Object.freeze({
      id: 'income-generation',
      term: 'Income generation',
      definition: 'Seeking financial gain, which may or may not involve deception.',
      explanation: 'Income generation does not always require deception. Ransomware payment demands can be income generation without the same deception pattern as invoice fraud.',
      evidence: 'Ransom demands; sale of stolen data; repeated monetisation patterns.',
      testQuestion: 'Was the primary aim to make money, whether or not deception was used?'
    })
  ]),
  knowledgeCheck: Object.freeze([
    Object.freeze({
      id: 'mot-kc1',
      prompt: 'Which statement is a motivation rather than a method?',
      options: Object.freeze([
        'The attacker used phishing emails',
        'The attacker wanted publicity for a protest message',
        'The attacker intercepted network traffic',
        'The attacker damaged clinic equipment'
      ]),
      correctIndex: 1,
      explanation: 'Wanting publicity describes why the attacker acted. Phishing, interception and damage describe how or what was attacked.'
    }),
    Object.freeze({
      id: 'mot-kc2',
      prompt: 'Why is fraud not identical to income generation?',
      options: Object.freeze([
        'Fraud never involves money',
        'Fraud requires deception; income generation may involve no deception',
        'Income generation is always illegal and fraud is not',
        'They are identical OCR motivations'
      ]),
      correctIndex: 1,
      explanation: 'Fraud involves deception. Income generation may involve no deception, for example a ransom demand that does not rely on tricking someone with a fake identity.'
    }),
    Object.freeze({
      id: 'mot-kc3',
      prompt: 'An attacker defaces a public website overnight so a protest message is widely seen. The best primary motivation is:',
      options: Object.freeze([
        'Thrill',
        'Publicity',
        'Espionage',
        'Phishing'
      ]),
      correctIndex: 1,
      explanation: 'Wanting the incident noticed supports publicity. Thrill is personal excitement; espionage seeks secrecy; phishing is a method, not a motivation.'
    }),
    Object.freeze({
      id: 'mot-kc4',
      prompt: 'An attacker quietly copies confidential partnership documents without seeking attention. The best primary motivation is:',
      options: Object.freeze([
        'Publicity',
        'Thrill',
        'Espionage',
        'Social engineering'
      ]),
      correctIndex: 2,
      explanation: 'Quiet collection of confidential information without publicity fits espionage. Social engineering is a method.'
    }),
    Object.freeze({
      id: 'mot-kc5',
      prompt: 'Clinic systems are encrypted and a cryptocurrency payment is demanded to restore access. The best primary motivation is:',
      options: Object.freeze([
        'Public good',
        'Income generation',
        'Publicity',
        'Exfiltration'
      ]),
      correctIndex: 1,
      explanation: 'A ransom demand shows income generation. Exfiltration is a method. Publicity is weaker if the main aim is payment rather than attention.'
    }),
    Object.freeze({
      id: 'mot-kc6',
      prompt: 'Which feedback best describes answering “phishing” to a motivation question?',
      options: Object.freeze([
        'This describes why the attacker acted',
        'This describes how the attack was carried out',
        'This describes what was attacked',
        'This is always an accepted motivation term'
      ]),
      correctIndex: 1,
      explanation: 'Phishing describes how the attacker acts. It is a method, not a motivation.'
    }),
    Object.freeze({
      id: 'mot-kc7',
      prompt: 'A former contractor damages equipment after a heated dispute with managers. The best primary motivation is:',
      options: Object.freeze([
        'Score settling',
        'Espionage',
        'Fraud',
        'Theft'
      ]),
      correctIndex: 0,
      explanation: 'Retaliation after a dispute fits score settling. Theft is a method against equipment.'
    }),
    Object.freeze({
      id: 'mot-kc8',
      prompt: 'Which statement is true?',
      options: Object.freeze([
        'More than one motivation may be defensible when the evidence supports it',
        'Only one motivation can ever be discussed in an OCR answer',
        'Motivation and method are interchangeable terms',
        'Targets are always organisations'
      ]),
      correctIndex: 0,
      explanation: 'Where evidence supports more than one motivation, more than one answer may be defensible. Learners must still explain the connection to target and method.'
    })
  ])
});
})(window);
