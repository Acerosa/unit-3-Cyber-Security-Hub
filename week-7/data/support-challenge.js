/**
 * Week 7 support and optional challenge resources (unscored).
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week7SupportChallenge = Object.freeze({
    resourceId: 'week7-support-challenge',
    scored: false,
    title: 'Support scaffolds and optional challenges',
    intro:
      'Use these scaffolds if you need structure for the risk register and testing choices. Optional challenges are labelled clearly and are not required for Week 7 completion.',
    viewModeHints: Object.freeze([
      'Structured form view: best while filling one register entry at a time with labels.',
      'Table view: best for comparing likelihood, impact and decisions across five assets.',
      'Sentence starters are optional; turn them off when you can write independently.'
    ]),
    scoringGuideReminder:
      'Use the Week 7 hub scoring guide: qualitative Low / Medium / High for likelihood and impact, then map combinations to a Low / Medium / High risk rating with text labels (not colour-only).',
    workedRows: Object.freeze([
      Object.freeze({
        title: 'Worked row A (Mitigate)',
        text:
          'Asset: appointment system. Threat: phishing credential theft. Vulnerability: single-factor remote logins. Likelihood High, Impact High → High risk. Decision: Mitigate with MFA. Cost: staff setup time. Benefit: fewer account takeovers. Effectiveness: track phishing-driven resets over 90 days.'
      }),
      Object.freeze({
        title: 'Worked row B (Accept)',
        text:
          'Asset: public leaflet PDF. Threat: temporary broken link in an update. Vulnerability: single-step publish. Likelihood Low, Impact Low → Low risk. Decision: Accept. Cost of dual control is disproportionate; care systems unaffected.'
      })
    ]),
    promptCards: Object.freeze([
      Object.freeze({
        title: 'Penetration testing',
        prompt: 'Authorised simulated attack within scope - not the same as a scan alone.'
      }),
      Object.freeze({
        title: 'Fuzzing',
        prompt: 'Unexpected, invalid or unusual input to find fragile handling.'
      }),
      Object.freeze({
        title: 'Security functionality testing',
        prompt: 'Does the control behave as specified for Northbank roles?'
      }),
      Object.freeze({
        title: 'Sandboxing',
        prompt: 'Observe untrusted files in isolation; do not execute samples on clinical PCs.'
      }),
      Object.freeze({
        title: 'NIDS / HIDS / DIDS',
        prompt: 'Network traffic, host activity, or coordinated multi-site detection.'
      }),
      Object.freeze({
        title: 'Anomaly / signature / honeypot',
        prompt: 'Baseline deviation, known patterns, or decoy attraction.'
      })
    ]),
    sentenceStarters: Object.freeze([
      'This asset matters because…',
      'The threat could… while the vulnerability is…',
      'I choose Mitigate / Accept / Prioritise later because…',
      'Cost is acceptable / disproportionate because…',
      'I will judge effectiveness by measuring…',
      'An alternative would be… but it is less effective here because…'
    ]),
    partialRegisterSupport: Object.freeze([
      'Load Week 2 entries when available; otherwise enter five assets yourself.',
      'Keep threat text different from vulnerability text.',
      'Include at least one Accept decision with a Low-impact justification.',
      'Address-first choice needs likelihood, impact and organisational reason.',
      'Avoid effectiveness answers that only say “installed”.'
    ]),
    challenges: Object.freeze([
      Object.freeze({
        id: 'ch1',
        title: 'Optional challenge 1: Cost versus risk reduction',
        prompt:
          'For Northbank’s size, argue when a control’s cost outweighs the risk reduction it buys. Use one register-style example.'
      }),
      Object.freeze({
        id: 'ch2',
        title: 'Optional challenge 2: Honeypot despite staff time',
        prompt:
          'Explain why Northbank might still deploy a honeypot even though monitoring it costs staff time.'
      }),
      Object.freeze({
        id: 'ch3',
        title: 'Optional challenge 3: When a honeypot stops being worthwhile',
        prompt:
          'State a condition under which a honeypot would stop being worthwhile for Northbank.'
      }),
      Object.freeze({
        id: 'ch4',
        title: 'Optional challenge 4: First testing method under budget',
        prompt:
          'Given a limited budget, which of the four testing methods would you commission first for Northbank, and why?'
      }),
      Object.freeze({
        id: 'ch5',
        title: 'Optional challenge 5: Defend your ordering',
        prompt:
          'Defend your testing-method ordering against a peer who argues for a different first choice.'
      })
    ])
  });
})(window);
