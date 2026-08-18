/**
 * Week 4 Session 2 retrieval — classify motivation, target or method.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week4Session2Retrieval = Object.freeze({
    activityId: 'week4-session2-retrieval',
    activityName: 'Session 2 Retrieval Quiz',
    activityVersion: '1.0',
    weekNumber: 4,
    sessionNumber: 2,
    total: 12,
    estimatedMinutes: 15,
    distinction: Object.freeze({
      motivation: 'Why the attacker acted',
      target: 'What was attacked',
      method: 'How the attack was carried out'
    }),
    questions: Object.freeze([
      Object.freeze({
        id: 's2q1',
        prompt: 'Classify this statement: “The attacker wanted publicity for a protest message.”',
        options: Object.freeze(['Motivation', 'Target', 'Method']),
        correctIndex: 0,
        explanation:
          'Wanting publicity describes why the attacker acted. Motivation = why.'
      }),
      Object.freeze({
        id: 's2q2',
        prompt: 'Classify this statement: “Reception staff were sent phishing emails.”',
        options: Object.freeze(['Motivation', 'Target', 'Method']),
        correctIndex: 2,
        explanation:
          'Phishing describes how the attacker acts. It is a method, not a motivation. People are the target category.'
      }),
      Object.freeze({
        id: 's2q3',
        prompt: 'Classify this statement: “Patient appointment records were copied out of the system.”',
        options: Object.freeze(['Motivation', 'Target', 'Method']),
        correctIndex: 2,
        explanation:
          'Exfiltration describes how information was taken. Information is the target; exfiltration is the method.'
      }),
      Object.freeze({
        id: 's2q4',
        prompt: 'Classify this statement: “The main thing attacked was the organisation’s booking systems.”',
        options: Object.freeze(['Motivation', 'Target', 'Method']),
        correctIndex: 1,
        explanation:
          'Organisations (and their systems) are what was attacked. Target = what.'
      }),
      Object.freeze({
        id: 's2q5',
        prompt: 'Classify this statement: “A clinic laptop was stolen from an unlocked room.”',
        options: Object.freeze(['Motivation', 'Target', 'Method']),
        correctIndex: 2,
        explanation:
          'Theft is a method used against equipment. Equipment is the target category.'
      }),
      Object.freeze({
        id: 's2q6',
        prompt: 'Classify this statement: “The attacker aimed to generate income through a ransom demand.”',
        options: Object.freeze(['Motivation', 'Target', 'Method']),
        correctIndex: 0,
        explanation:
          'Income generation is why the attacker acted. Do not treat ransomware alone as the motivation label.'
      }),
      Object.freeze({
        id: 's2q7',
        prompt: 'Classify this statement: “A trusted supplier portal was compromised to reach Northbank systems.”',
        options: Object.freeze(['Motivation', 'Target', 'Method']),
        correctIndex: 2,
        explanation:
          'Supply-chain compromise is a method. The organisation is the target category.'
      }),
      Object.freeze({
        id: 's2q8',
        prompt: 'Why is “phishing” not a valid answer to a motivation question?',
        options: Object.freeze([
          'Because phishing is never used against people',
          'Because phishing describes how the attacker acts, not why',
          'Because phishing is always the same as fraud',
          'Because OCR does not recognise phishing'
        ]),
        correctIndex: 1,
        explanation:
          'Phishing is a method because it describes how the attacker acts. It is not the reason the attacker chose to act.'
      }),
      Object.freeze({
        id: 's2q9',
        prompt: 'Fraud differs from income generation because:',
        options: Object.freeze([
          'Fraud never involves money',
          'Fraud requires deception; income generation may involve no deception',
          'They are identical OCR motivations',
          'Income generation is only about publicity'
        ]),
        correctIndex: 1,
        explanation:
          'Fraud requires deception. Income generation does not always require deception.'
      }),
      Object.freeze({
        id: 's2q10',
        prompt: 'Publicity and thrill should not be collapsed into one idea because:',
        options: Object.freeze([
          'Both always involve ransomware',
          'Publicity seeks notice for a message; thrill focuses on personal excitement or challenge',
          'OCR only allows one motivation ever',
          'Thrill is a method and publicity is a target'
        ]),
        correctIndex: 1,
        explanation:
          'Publicity is about being noticed. Thrill is about personal excitement or challenge.'
      }),
      Object.freeze({
        id: 's2q11',
        prompt: 'Which list correctly names the four OCR target categories for Week 4?',
        options: Object.freeze([
          'People, organisations, equipment and information',
          'Malware, phishing, ransomware and firewalls',
          'Hacktivists, insiders, criminals and script kiddies',
          'Only large hospital trusts'
        ]),
        correctIndex: 0,
        explanation:
          'Targets are people, organisations, equipment and information — not attacker types or methods.'
      }),
      Object.freeze({
        id: 's2q12',
        prompt: 'Analyse as a command word requires learners to:',
        options: Object.freeze([
          'List separate facts without linking them',
          'State a meaningful connection or consequence between facts',
          'Insert connective words with no logical link',
          'Change examples halfway through to show breadth'
        ]),
        correctIndex: 1,
        explanation:
          'Analysis states a connection or consequence. Connectives help only when the link is logically meaningful.'
      })
    ])
  });
})(window);
