/**
 * Week 7 detection and prevention comparison (8 marks).
 */
(function (global) {
  'use strict';

  global.Week7DetectionPrevention = Object.freeze({
    activityId: 'week7-detection-prevention',
    activityName: 'Detection and Prevention Comparison',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 1,
    total: 8,
    estimatedMinutes: 35,
    intro:
      'Detection alerts; prevention acts. Learn NIDS, HIDS, DIDS, anomaly-based and signature-based detection, and honeypots in a Northbank context.',
    concepts: Object.freeze([
      Object.freeze({
        id: 'ids',
        name: 'Intrusion detection',
        summary: 'Monitors activity and raises alerts when suspicious behaviour is found. It does not by itself block the activity.'
      }),
      Object.freeze({
        id: 'ips',
        name: 'Intrusion prevention',
        summary: 'Monitors activity and can take automated action to block or disrupt suspicious traffic or behaviour.'
      }),
      Object.freeze({
        id: 'nids',
        name: 'NIDS (Network-based IDS)',
        summary: 'Watches network traffic for suspicious patterns across links and segments.'
      }),
      Object.freeze({
        id: 'hids',
        name: 'HIDS (Host-based IDS)',
        summary: 'Watches activity on a specific host, such as logs, file integrity or process behaviour.'
      }),
      Object.freeze({
        id: 'dids',
        name: 'DIDS (Distributed IDS)',
        summary: 'Coordinates detection across multiple sensors or sites so analysts see a wider picture.'
      }),
      Object.freeze({
        id: 'signature',
        name: 'Signature-based detection',
        summary: 'Matches activity against known attack patterns or signatures.'
      }),
      Object.freeze({
        id: 'anomaly',
        name: 'Anomaly-based detection',
        summary: 'Flags activity that differs from an established normal baseline.'
      }),
      Object.freeze({
        id: 'honeypot',
        name: 'Honeypot',
        summary: 'A decoy system or service designed to attract attackers and reveal methods without exposing real assets.'
      })
    ]),
    novelAttackScenario:
      'A new phishing kit uses previously unseen command-and-control domains and slightly altered email templates that do not match any signature in Northbank’s current detection set. Signature-based tools may miss the first wave until signatures are updated, while anomaly-based monitoring might notice unusual outbound connections from a reception PC after a staff member opens the message.',
    comparisonFields: Object.freeze([
      Object.freeze({ id: 'canDetect', label: 'What it can detect well' }),
      Object.freeze({ id: 'mayMiss', label: 'What it may miss' }),
      Object.freeze({ id: 'advantage', label: 'Main advantage' }),
      Object.freeze({ id: 'limitation', label: 'Main limitation' }),
      Object.freeze({ id: 'scenario', label: 'Suitable Northbank scenario' })
    ]),
    comparisonTargets: Object.freeze(['anomaly', 'signature']),
    knowledgeCheck: Object.freeze([
      Object.freeze({
        id: 'dp-1',
        prompt: 'Intrusion detection mainly:',
        options: Object.freeze([
          'Alerts on suspicious activity',
          'Always blocks every packet automatically',
          'Replaces the need for any firewall',
          'Is identical to a honeypot'
        ]),
        correctIndex: 0,
        explanation: 'Detection alerts; prevention is what acts to block.'
      }),
      Object.freeze({
        id: 'dp-2',
        prompt: 'Intrusion prevention mainly:',
        options: Object.freeze([
          'Can act to block or disrupt suspicious activity',
          'Only stores leaflets as PDFs',
          'Never generates alerts',
          'Means accepting every High risk'
        ]),
        correctIndex: 0,
        explanation: 'Prevention systems can take automated protective action.'
      }),
      Object.freeze({
        id: 'dp-3',
        prompt: 'NIDS focuses on:',
        options: Object.freeze([
          'Network traffic',
          'Only one host’s local files',
          'Paper visitor badges',
          'Staff appraisal scores'
        ]),
        correctIndex: 0,
        explanation: 'NIDS is network-based.'
      }),
      Object.freeze({
        id: 'dp-4',
        prompt: 'HIDS focuses on:',
        options: Object.freeze([
          'Activity on a specific host',
          'Only internet backbone links worldwide',
          'Public relations wording',
          'Transferring risk by renaming it'
        ]),
        correctIndex: 0,
        explanation: 'HIDS is host-based.'
      }),
      Object.freeze({
        id: 'dp-5',
        prompt: 'DIDS is best described as:',
        options: Object.freeze([
          'Coordinated detection across multiple sensors or sites',
          'A single unused password',
          'Only signature matching on one laptop',
          'A type of fuzzing input'
        ]),
        correctIndex: 0,
        explanation: 'Distributed IDS coordinates multiple detection points.'
      }),
      Object.freeze({
        id: 'dp-6',
        prompt: 'Signature-based detection is strongest against:',
        options: Object.freeze([
          'Known patterns already in the signature set',
          'Brand-new techniques with no matching signature',
          'Every possible future attack forever',
          'Only printer paper jams'
        ]),
        correctIndex: 0,
        explanation: 'Signatures match known patterns and may miss novel attacks.'
      }),
      Object.freeze({
        id: 'dp-7',
        prompt: 'Anomaly-based detection flags activity that:',
        options: Object.freeze([
          'Differs from an established baseline',
          'Exactly matches one old virus name only',
          'Is always harmless by definition',
          'Cannot be reviewed by analysts'
        ]),
        correctIndex: 0,
        explanation: 'Anomaly detection looks for deviation from normal.'
      }),
      Object.freeze({
        id: 'dp-8',
        prompt: 'A honeypot is:',
        options: Object.freeze([
          'A decoy designed to attract and reveal attacker methods',
          'The live clinical notes database',
          'Another word for NIDS only',
          'A legal statute'
        ]),
        correctIndex: 0,
        explanation: 'Honeypots are decoys, not production care systems.'
      })
    ])
  });
})(window);
