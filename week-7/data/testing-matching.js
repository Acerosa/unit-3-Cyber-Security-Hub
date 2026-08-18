/**
 * Week 7 testing and monitoring matching (8 marks).
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week7TestingMatching = Object.freeze({
    activityId: 'week7-testing-matching',
    activityName: 'Testing and Monitoring Matching',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 2,
    total: 8,
    estimatedMinutes: 25,
    intro:
      'Match each Northbank situation to the most suitable testing or monitoring measure. Use the accessible select lists (not drag-and-drop only). Justify every choice. Some scenarios allow a defensible alternative.',
    measureOptions: Object.freeze([
      'Penetration testing',
      'Fuzzing',
      'Security functionality testing',
      'Sandboxing',
      'NIDS',
      'HIDS',
      'DIDS',
      'Anomaly-based detection',
      'Signature-based detection',
      'Honeypot'
    ]),
    scenarios: Object.freeze([
      Object.freeze({
        id: 'm1',
        text:
          'Northbank wants an authorised attempt to chain weaknesses in the remote-access path to clinical systems after MFA is deployed.',
        preferred: 'Penetration testing',
        alternativeAnswers: Object.freeze([]),
        altFullCredit: false,
        justificationMin: 25,
        preferredWhy:
          'An authorised simulated attack best tests realistic exploitation paths after controls are in place.',
        alternativeWhy: ''
      }),
      Object.freeze({
        id: 'm2',
        text:
          'Developers changed an online referral form and need to see how it behaves with malformed and unexpected input.',
        preferred: 'Fuzzing',
        alternativeAnswers: Object.freeze([]),
        altFullCredit: false,
        justificationMin: 25,
        preferredWhy: 'Fuzzing targets unexpected, invalid or unusual input handling.',
        alternativeWhy: ''
      }),
      Object.freeze({
        id: 'm3',
        text:
          'Managers need evidence that the new role-based access rules block reception staff from clinical admin functions as specified.',
        preferred: 'Security functionality testing',
        alternativeAnswers: Object.freeze(['Penetration testing']),
        altFullCredit: false,
        justificationMin: 25,
        preferredWhy:
          'Security functionality testing directly checks that the control behaves as specified.',
        alternativeWhy:
          'A pentest might discover related access issues, but it is broader and less focused on proving the specified control behaviour.'
      }),
      Object.freeze({
        id: 'm4',
        text:
          'An unexpected email attachment arrives. The tutor will demonstrate observing it without running it on a clinical PC.',
        preferred: 'Sandboxing',
        alternativeAnswers: Object.freeze([]),
        altFullCredit: false,
        justificationMin: 25,
        preferredWhy: 'Sandboxing isolates untrusted files for safer observation.',
        alternativeWhy: ''
      }),
      Object.freeze({
        id: 'm5',
        text:
          'Analysts want visibility of suspicious traffic patterns moving across Northbank’s internal network segments.',
        preferred: 'NIDS',
        alternativeAnswers: Object.freeze(['DIDS']),
        altFullCredit: false,
        justificationMin: 25,
        preferredWhy: 'NIDS is placed to watch network traffic.',
        alternativeWhy:
          'DIDS can help if multiple sites must be coordinated, but the core need described is network traffic visibility, which NIDS addresses directly.'
      }),
      Object.freeze({
        id: 'm6',
        text:
          'A critical server that stores appointment data needs monitoring of local file integrity and unusual process activity on that host.',
        preferred: 'HIDS',
        alternativeAnswers: Object.freeze([]),
        altFullCredit: false,
        justificationMin: 25,
        preferredWhy: 'HIDS watches activity on a specific host.',
        alternativeWhy: ''
      }),
      Object.freeze({
        id: 'm7',
        text:
          'After hours, a reception PC starts making unusual outbound connections that do not match Northbank’s normal clinic baseline, and no known malware name has been matched yet.',
        preferred: 'Anomaly-based detection',
        alternativeAnswers: Object.freeze(['NIDS', 'HIDS']),
        altFullCredit: false,
        justificationMin: 25,
        preferredWhy:
          'Anomaly-based detection is suited to behaviour that differs from baseline, including novel activity without a known signature.',
        alternativeWhy:
          'NIDS or HIDS may surface the traffic or host events, but the key requirement is recognising deviation from normal rather than matching a known pattern.'
      }),
      Object.freeze({
        id: 'm8',
        text:
          'Northbank’s tools hold up-to-date indicators for a widely known ransomware family, and managers want alerts when those exact known patterns appear.',
        preferred: 'Signature-based detection',
        alternativeAnswers: Object.freeze(['Honeypot', 'NIDS']),
        altFullCredit: false,
        justificationMin: 25,
        preferredWhy:
          'Signature-based detection matches known attack patterns already in the signature set.',
        alternativeWhy:
          'A honeypot or NIDS can support monitoring, but they are less direct answers when the requirement is matching known signatures.'
      })
    ])
  });
})(window);
