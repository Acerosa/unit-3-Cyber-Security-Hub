/**
 * Week 7 Session 2 retrieval quiz (10 marks).
 */
(function (global) {
  'use strict';

  global.Week7Session2Retrieval = Object.freeze({
    activityId: 'week7-session2-retrieval',
    activityName: 'Session 2 Retrieval Quiz',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 2,
    total: 10,
    estimatedMinutes: 15,
    intro:
      'Low-stakes retrieval on detection versus prevention, testing methods, risk terminology and monitoring placements.',
    completionLinks: Object.freeze([
      Object.freeze({ label: 'Risk management learning', path: '../risk-management-learning/' }),
      Object.freeze({ label: 'Northbank risk register', path: '../risk-register/' }),
      Object.freeze({ label: 'Testing methods', path: '../testing-methods/' }),
      Object.freeze({ label: 'Detection and prevention', path: '../detection-prevention/' })
    ]),
    insecureTermsSummary: Object.freeze([
      'Do not treat risk, threat and vulnerability as synonyms.',
      'Do not treat penetration testing as identical to automated vulnerability scanning.',
      'Do not claim “installed” alone proves effectiveness.',
      'Detection alerts; prevention acts.'
    ]),
    questions: Object.freeze([
      Object.freeze({
        id: 's2-1',
        prompt: 'Detection versus prevention: which statement is accurate?',
        options: Object.freeze([
          'Detection alerts on suspicious activity; prevention can act to block or disrupt it',
          'Detection always blocks traffic; prevention only writes reports',
          'They are identical terms with no practical difference',
          'Prevention means accepting every High risk without controls'
        ]),
        correctIndex: 0,
        explanation: 'Keep the alert-versus-act distinction clear.'
      }),
      Object.freeze({
        id: 's2-2',
        prompt: 'Anomaly-based detection mainly looks for activity that:',
        options: Object.freeze([
          'Differs from an established baseline',
          'Exactly matches one known malware hash only',
          'Is approved in a staff handbook paragraph',
          'Cannot generate false positives ever'
        ]),
        correctIndex: 0,
        explanation: 'Anomaly detection compares behaviour with a normal baseline.'
      }),
      Object.freeze({
        id: 's2-3',
        prompt: 'Signature-based detection may miss a novel attack because:',
        options: Object.freeze([
          'There may be no matching known pattern yet',
          'Signatures always include every future attack',
          'Novel attacks cannot use the network',
          'Honeypots delete all signatures daily'
        ]),
        correctIndex: 0,
        explanation: 'New techniques can arrive before signatures are updated.'
      }),
      Object.freeze({
        id: 's2-4',
        prompt: 'NIDS versus HIDS: which pairing is correct?',
        options: Object.freeze([
          'NIDS watches network traffic; HIDS watches a specific host',
          'NIDS watches one laptop only; HIDS watches only internet backbones',
          'Both only mean honeypots',
          'HIDS is a criminal statute'
        ]),
        correctIndex: 0,
        explanation: 'Network versus host placement is the core distinction.'
      }),
      Object.freeze({
        id: 's2-5',
        prompt: 'Risk versus threat: which is correct?',
        options: Object.freeze([
          'Risk assesses likelihood and impact; a threat is a potential cause of harm',
          'Risk and threat are always the same word',
          'Threat is the numeric score only',
          'Risk means any software update'
        ]),
        correctIndex: 0,
        explanation: 'Risk is not a synonym for threat.'
      }),
      Object.freeze({
        id: 's2-6',
        prompt: 'Penetration testing versus vulnerability scanning:',
        options: Object.freeze([
          'A pentest is an authorised simulated attack; scanning mainly finds known issues without full exploitation',
          'They are legally identical in every case',
          'Scanning always includes physical break-in',
          'Pentesting never needs authorisation'
        ]),
        correctIndex: 0,
        explanation: 'Do not collapse pentest into automated scanning.'
      }),
      Object.freeze({
        id: 's2-7',
        prompt: 'The main purpose of fuzzing is to:',
        options: Object.freeze([
          'Test software with unexpected, invalid or unusual input',
          'Replace all staff training',
          'Accept Low risks automatically',
          'Coordinate DIDS sensors only'
        ]),
        correctIndex: 0,
        explanation: 'Fuzzing stresses input handling with unusual data.'
      }),
      Object.freeze({
        id: 's2-8',
        prompt: 'Sandboxing is used to:',
        options: Object.freeze([
          'Observe untrusted code or files in isolation',
          'Publish patient records to the public website',
          'Prove a file is permanently safe on every clinical PC',
          'Rename vulnerabilities as threats'
        ]),
        correctIndex: 0,
        explanation: 'Sandboxing isolates untrusted content for safer observation.'
      }),
      Object.freeze({
        id: 's2-9',
        prompt: 'A honeypot is best described as:',
        options: Object.freeze([
          'A decoy that can reveal attacker methods',
          'The live appointment database',
          'Another name for impact scoring',
          'Automated fuzzing of clinical forms only'
        ]),
        correctIndex: 0,
        explanation: 'Honeypots are decoys, not production care systems.'
      }),
      Object.freeze({
        id: 's2-10',
        prompt: 'DIDS mainly:',
        options: Object.freeze([
          'Coordinates detection across multiple sensors or sites',
          'Means a single unused firewall rule',
          'Is identical to Accept on the risk register',
          'Replaces the need for any host logging'
        ]),
        correctIndex: 0,
        explanation: 'Distributed IDS aggregates and coordinates detection points.'
      })
    ])
  });
})(window);
