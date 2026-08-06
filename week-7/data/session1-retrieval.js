/**
 * Week 7 Session 1 retrieval and prior learning (6 marks).
 */
(function (global) {
  'use strict';

  global.Week7Session1Retrieval = Object.freeze({
    activityId: 'week7-session1-retrieval',
    activityName: 'Session 1 Retrieval and Prior Learning',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 1,
    total: 6,
    estimatedMinutes: 15,
    intro:
      'Recall Cyber Essentials from Week 6, separate threat from vulnerability, and think about how Northbank should prioritise funding. Risk is not the same as threat, and threat is not the same as vulnerability.',
    misconceptions: Object.freeze([
      'Risk is not the same as threat. Risk combines likelihood and impact for a vulnerability exploited by a threat.',
      'Threat is not the same as vulnerability. A threat is a potential cause of harm; a vulnerability is a weakness that can be exploited.'
    ]),
    questions: Object.freeze([
      Object.freeze({
        id: 's1r-1',
        prompt: 'What is the main purpose of Cyber Essentials?',
        options: Object.freeze([
          'A government assurance scheme that helps organisations implement basic technical controls against common cyber attacks',
          'A United Kingdom criminal statute that creates hacking offences',
          'An NCSC exercise pack that replaces risk assessment',
          'A penetration testing methodology required by law for all NHS partners'
        ]),
        correctIndex: 0,
        explanation:
          'Cyber Essentials is a government-backed assurance scheme focused on basic technical controls. It is not a criminal statute.',
        reversedIndex: 1,
        reversedExplanation:
          'Cyber Essentials is not criminal law. The Computer Misuse Act 1990 creates hacking-related offences; Cyber Essentials is an assurance scheme.'
      }),
      Object.freeze({
        id: 's1r-2',
        prompt: 'Which statement correctly separates threat and vulnerability?',
        options: Object.freeze([
          'A threat is a potential cause of harm; a vulnerability is a weakness that could be exploited',
          'A threat and a vulnerability are the same thing described in different words',
          'A vulnerability is always an external attacker; a threat is always a software bug',
          'Risk, threat and vulnerability all mean the chance that an attack will succeed'
        ]),
        correctIndex: 0,
        explanation:
          'Threats are potential causes of harm. Vulnerabilities are weaknesses. Risk then weighs likelihood and impact if a threat exploits a vulnerability.',
        reversedIndex: 1,
        reversedExplanation:
          'Threat and vulnerability are not interchangeable. Mixing them is a common examination misconception.'
      }),
      Object.freeze({
        id: 's1r-3',
        prompt: 'Which statement about risk is most accurate?',
        options: Object.freeze([
          'Risk is an assessment of likelihood and impact if a threat exploits a vulnerability',
          'Risk is another word for an attacker',
          'Risk only means the financial cost of buying a firewall',
          'Risk is identical to listing every possible threat name'
        ]),
        correctIndex: 0,
        explanation:
          'Risk combines likelihood and impact. Naming a threat alone is not a full risk assessment.',
        reversedIndex: 1,
        reversedExplanation:
          'An attacker or threat actor is not the same as risk. Risk is the assessed likelihood and impact.'
      }),
      Object.freeze({
        id: 's1r-4',
        prompt:
          'Northbank has limited funding. Which vulnerability should usually be considered for funding first?',
        options: Object.freeze([
          'A high-likelihood, high-impact weakness affecting patient appointment and clinical records systems',
          'A purely cosmetic interface issue on a public leaflet PDF with no data exposure',
          'Any vulnerability that is easiest to describe in one sentence, regardless of impact',
          'Only vulnerabilities that have already caused a confirmed breach elsewhere in the country'
        ]),
        correctIndex: 0,
        explanation:
          'Prioritise where likelihood and impact are both high, especially for systems that hold or affect patient care data.',
        reversedIndex: 3,
        reversedExplanation:
          'Waiting until a breach has already happened elsewhere is not a sound prioritisation rule. Likelihood and impact should drive funding choices.'
      })
    ]),
    reflections: Object.freeze([
      Object.freeze({
        id: 'fund-reason',
        label:
          'In your own words, explain briefly why the vulnerability you would fund first deserves priority at Northbank.',
        minChars: 40,
        marks: 1,
        starter:
          'I would fund this first because the likelihood and impact are… and patient care could be affected if…'
      }),
      Object.freeze({
        id: 'threat-vuln',
        label:
          'Give one Northbank example that shows the difference between a threat and a vulnerability (do not treat them as the same term).',
        minChars: 40,
        marks: 1,
        starter:
          'Threat: … could try to… Vulnerability: … is weak because…'
      })
    ])
  });
})(window);
