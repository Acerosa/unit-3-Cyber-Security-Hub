/**
 * Week 7 vulnerability testing methods guided learning (8 marks).
 */
(function (global) {
  'use strict';

  global.Week7TestingMethods = Object.freeze({
    activityId: 'week7-testing-methods',
    activityName: 'Vulnerability Testing Methods',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 1,
    total: 8,
    estimatedMinutes: 30,
    intro:
      'Compare four authorised testing methods. Penetration testing is not the same as automated vulnerability scanning.',
    methods: Object.freeze([
      Object.freeze({
        id: 'pentest',
        name: 'Penetration testing',
        purpose:
          'An authorised simulated attack that tries to exploit weaknesses the way an attacker might, within an agreed scope.',
        mayReveal:
          'Chained weaknesses, weak access control, and realistic attack paths that scanners alone may not prove.',
        mayMiss:
          'Issues outside the agreed scope, zero-day flaws unknown to the tester, or social-engineering paths excluded from the rules of engagement.',
        appropriate:
          'When Northbank needs assurance that critical care systems can withstand a skilled, authorised attempt after controls are in place.',
        limitation:
          'Time-boxed and scoped; a clean report does not prove the organisation is permanently secure. It is not the same as running an automated vulnerability scan.',
        misconception:
          'Penetration testing is not just automated vulnerability scanning. Scanning finds known issues; a pentest attempts exploitation under authorisation.'
      }),
      Object.freeze({
        id: 'fuzzing',
        name: 'Fuzzing',
        purpose:
          'Send unexpected, invalid or unusual input to software to see whether it crashes, corrupts data or behaves unsafely.',
        mayReveal:
          'Input-handling bugs, crashes and edge-case failures in applications or parsers.',
        mayMiss:
          'Logic flaws that need valid business workflows, misconfigurations, or human-process weaknesses.',
        appropriate:
          'When testing how Northbank-facing forms, upload handlers or APIs cope with malformed input before wider release.',
        limitation:
          'Fuzzing does not replace architectural review or access-control testing; crashes need triage to become actionable fixes.',
        misconception:
          'Fuzzing is about unusual input behaviour, not a full simulated attacker campaign.'
      }),
      Object.freeze({
        id: 'sft',
        name: 'Security functionality testing',
        purpose:
          'Check that a security control behaves as specified: authentication, authorisation, logging, encryption or similar controls.',
        mayReveal:
          'Controls that are misconfigured, incomplete, or do not enforce the intended policy.',
        mayMiss:
          'Novel attack techniques or weaknesses in components that were never specified as security functions under test.',
        appropriate:
          'After Northbank deploys MFA or role-based access, to confirm the control works as designed for staff roles.',
        limitation:
          'Passing functional checks does not prove there are no other vulnerabilities elsewhere in the estate.',
        misconception:
          'Security functionality testing checks specified control behaviour; it is not a full penetration test.'
      }),
      Object.freeze({
        id: 'sandbox',
        name: 'Sandboxing',
        purpose:
          'Run untrusted code or files in isolation so behaviour can be observed without exposing the live network or endpoints.',
        mayReveal:
          'Suspicious network calls, file changes or process behaviour from an untrusted attachment or installer.',
        mayMiss:
          'Malware that detects sandboxes and stays quiet, or threats that only trigger on production systems.',
        appropriate:
          'When Northbank staff receive an unexpected attachment and need a safe, tutor-led way to observe behaviour before any live use.',
        limitation:
          'Isolation reduces risk but does not prove a file is safe for unrestricted use on clinical devices.',
        misconception:
          'Sandboxing is observation in isolation, not permission to execute unknown malware on personal or clinical devices.'
      })
    ]),
    knowledgeCheck: Object.freeze([
      Object.freeze({
        id: 'tm-1',
        prompt: 'Penetration testing is best described as:',
        options: Object.freeze([
          'An authorised simulated attack within an agreed scope',
          'Any automated vulnerability scan run overnight',
          'Unrestricted hacking without permission',
          'Only checking that a password field accepts input'
        ]),
        correctIndex: 0,
        explanation:
          'Pentesting is authorised and scoped. It is not identical to automated scanning.',
        reversedIndex: 1,
        reversedExplanation:
          'Automated scanning can find known issues but is not the same as an authorised simulated attack.'
      }),
      Object.freeze({
        id: 'tm-2',
        prompt: 'Fuzzing mainly uses:',
        options: Object.freeze([
          'Unexpected, invalid or unusual input',
          'Only perfectly valid clinical workflows',
          'Physical lock picking',
          'Public relations statements'
        ]),
        correctIndex: 0,
        explanation: 'Fuzzing stresses software with unexpected or invalid input.'
      }),
      Object.freeze({
        id: 'tm-3',
        prompt: 'Security functionality testing checks that:',
        options: Object.freeze([
          'A control behaves as specified',
          'Every possible zero-day is impossible',
          'Staff morale is high',
          'The organisation has transferred all risk'
        ]),
        correctIndex: 0,
        explanation: 'SFT verifies specified security control behaviour.'
      }),
      Object.freeze({
        id: 'tm-4',
        prompt: 'Sandboxing is appropriate when:',
        options: Object.freeze([
          'Untrusted code or files need isolation for observation',
          'You want to email malware to patients for realism',
          'You need to replace penetration testing forever',
          'You only want to rename a vulnerability as a threat'
        ]),
        correctIndex: 0,
        explanation: 'Sandboxing isolates untrusted content for safer observation.'
      }),
      Object.freeze({
        id: 'tm-5',
        prompt: 'A clean vulnerability scan alone proves:',
        options: Object.freeze([
          'Known signature issues may be absent, but not that a pentest-style attack path is impossible',
          'Northbank can never be breached',
          'Fuzzing is unnecessary forever',
          'Sandboxing is illegal'
        ]),
        correctIndex: 0,
        explanation:
          'Scanning and penetration testing answer related but different questions.'
      }),
      Object.freeze({
        id: 'tm-6',
        prompt: 'Which method is most focused on whether MFA enforces the intended policy?',
        options: Object.freeze([
          'Security functionality testing',
          'Fuzzing alone',
          'Sandboxing a PDF',
          'Accepting the risk without testing'
        ]),
        correctIndex: 0,
        explanation: 'SFT checks that the control behaves as specified.'
      }),
      Object.freeze({
        id: 'tm-7',
        prompt: 'A limitation of sandboxing is that:',
        options: Object.freeze([
          'Some malicious samples detect sandboxes and stay quiet',
          'Isolation always makes every file safe for clinical PCs',
          'It replaces the need for any access control',
          'It is identical to penetration testing'
        ]),
        correctIndex: 0,
        explanation: 'Sandbox evasion and environment differences limit what can be concluded.'
      }),
      Object.freeze({
        id: 'tm-8',
        prompt: 'Which pairing is correct?',
        options: Object.freeze([
          'Fuzzing → unusual input; Pentest → authorised simulated attack',
          'Fuzzing → authorised simulated attack; Pentest → only PDF isolation',
          'SFT → untrusted file isolation; Sandboxing → password policy wording only',
          'All four methods are identical'
        ]),
        correctIndex: 0,
        explanation: 'Keep purpose distinctions clear for examination answers.'
      })
    ])
  });
})(window);
