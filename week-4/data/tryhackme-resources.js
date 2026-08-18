/**
 * Week 4 TryHackMe practical and directed-study room metadata.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Unit3Week4TryHackMeData = Object.freeze({
    accessNotice:
      'Room access and availability must be confirmed by the tutor before the lesson. Learners should not purchase a subscription to complete a college activity unless the college has explicitly authorised it.',
    ethicalNotice: Object.freeze([
      'Use only the authorised TryHackMe environment and tutor-approved searches.',
      'Do not scan, probe, test or interact with unauthorised systems.',
      'Passive reconnaissance should remain read-only.',
      'Do not attempt to gain access to any system.',
      'Do not collect passwords, authentication tokens, secrets or personal data.',
      'Follow tutor instructions and college acceptable-use requirements.',
      'The college network must already have been confirmed as permitting the Shodan.io searches used in the room.'
    ]),
    resources: Object.freeze([
      Object.freeze({
        resourceId: 'week4-passive-recon',
        roomId: 'passiverecon',
        title: 'TryHackMe Practical: Passive Reconnaissance',
        shortTitle: 'Passive Reconnaissance',
        url: 'https://tryhackme.com/room/passiverecon',
        deliveryMode: 'in-class',
        deliveryLabel: 'In-class practical — complete first',
        scored: false,
        path: 'passive-recon/',
        sequence: 1,
        purpose:
          'Practise read-only lookups that reveal information without touching the target, then connect findings to possible attacker motivations.',
        ocrFocus: '2.3 / 2.4 — how exposure can influence target selection',
        timeLabel: 'Approximately 30 to 45 minutes',
        availabilityStatus: 'tutor-check-required',
        focusPoints: Object.freeze([
          'Complete Passive Reconnaissance before Shodan.io',
          'Record what each technique reveals without touching the target',
          'Connect each finding to a possible attacker motivation',
          'Treat rooms as examples of how an attacker may choose a target'
        ]),
        checklist: Object.freeze([
          'I completed Passive Reconnaissance before starting Shodan.io.',
          'I recorded techniques and principles rather than collecting sensitive findings.',
          'I linked at least one finding to a possible motivation (why).',
          'I stayed within authorised TryHackMe tasks only.'
        ])
      }),
      Object.freeze({
        resourceId: 'week4-shodan',
        roomId: 'shodan',
        title: 'TryHackMe Practical: Shodan.io',
        shortTitle: 'Shodan.io',
        url: 'https://tryhackme.com/room/shodan',
        deliveryMode: 'in-class',
        deliveryLabel: 'In-class practical — when ready',
        scored: false,
        path: 'passive-recon/',
        sequence: 2,
        purpose:
          'Use tutor-approved Shodan searches in the authorised room to see how publicly visible services can make a target opportunistic.',
        ocrFocus: '2.4 Targets — exposure and opportunity',
        timeLabel: 'Approximately 25 to 40 minutes',
        availabilityStatus: 'tutor-check-required',
        pairedWorkingGuidance:
          'If Passive Reconnaissance felt slow, your tutor may allow paired working on Shodan.io. Paired work is optional and depends on classroom arrangements.',
        focusPoints: Object.freeze([
          'Move to Shodan.io only when ready',
          'Use tutor-approved searches only',
          'Remain read-only; do not attempt access',
          'Link visible exposure to why a target might be chosen'
        ]),
        checklist: Object.freeze([
          'I used only tutor-approved Shodan searches in the authorised room.',
          'I did not probe or interact with unauthorised systems.',
          'I recorded what visibility could mean for target selection.',
          'I can explain that exposure may drive opportunity rather than a personal grudge.'
        ])
      }),
      Object.freeze({
        resourceId: 'week4-google-dorking',
        roomId: 'googledorking',
        title: 'TryHackMe Directed Study: Google Dorking',
        shortTitle: 'Google Dorking',
        url: 'https://tryhackme.com/room/googledorking',
        deliveryMode: 'directed-independent-study',
        deliveryLabel: 'Directed independent study',
        scored: false,
        path: 'directed-study/',
        purpose:
          'Record three search techniques that could reveal information an organisation did not intend to publish — without collecting sensitive findings.',
        ocrFocus: 'Passive exposure principles for Week 4 directed study',
        timeLabel: 'Allow up to 45 minutes depending on access',
        availabilityStatus: 'tutor-check-required',
        safetyNotices: Object.freeze([
          'Authorised learning environments only.',
          'No probing or interaction with unauthorised targets.',
          'Do not search for personal data, passwords, secrets or authentication material.',
          'Use tutor-approved examples.',
          'Record techniques and principles rather than collecting sensitive findings.'
        ])
      })
    ])
  });
})(window);
