/**
 * Week 4 motivation, target and method mapping activity.
 */
(function (global) {
  'use strict';

  global.Week4MtmMapping = Object.freeze({
    activityId: 'week4-mtm-mapping',
    activityName: 'Motivation, Target and Method Mapping',
    activityVersion: '1.0',
    weekNumber: 4,
    sessionNumber: 2,
    total: 8,
    columnLabels: Object.freeze({
      motivation: 'Motivation (why)',
      target: 'Target (what)',
      method: 'Method (how)',
      evidence: 'Evidence from the scenario',
      connection: 'How the motivation made the target and method a logical choice',
      alternative: 'Optional alternative motivation',
      alternativeWhy: 'Why the alternative is weaker or equally defensible'
    }),
    motivationBank: Object.freeze([
      'Espionage',
      'Righting perceived wrongs',
      'Public good',
      'Publicity',
      'Thrill',
      'Fraud',
      'Score settling',
      'Income generation'
    ]),
    targetBank: Object.freeze(['People', 'Organisations', 'Equipment', 'Information']),
    methodBank: Object.freeze([
      'Social engineering',
      'Phishing',
      'System compromise',
      'Supply-chain compromise',
      'Theft',
      'Damage',
      'Interception',
      'Exfiltration'
    ]),
    presentationOptions: Object.freeze([
      'Verbal two-minute explanation',
      'Slide-based explanation',
      'Annotated diagram'
    ]),
    presentationChecklist: Object.freeze([
      'State the motivation (why)',
      'State the target (what)',
      'State the method (how)',
      'Explain why the motivation made that target logical',
      'Explain why the selected method suited the target'
    ]),
    workedRows: Object.freeze([
      Object.freeze({
        id: 'worked-1',
        theme: 'Espionage (worked example)',
        scenario:
          'Quiet collection of confidential partnership documents from a Northbank shared drive overnight. No public message is left and no ransom is demanded.',
        motivation: 'Espionage',
        target: 'Information',
        method: 'Exfiltration',
        evidence:
          'Quiet collection; confidential documents; no publicity or ransom demand.',
        connection:
          'Because the attacker wanted secret information advantage, information was a logical target, and exfiltration suited removing copies without seeking attention.',
        alternative: 'Thrill',
        alternativeWhy:
          'Thrill is weaker here because the evidence emphasises secrecy and useful documents rather than personal challenge or excitement.',
        teachingNote:
          'Notice the connection sentence links why → what → how. Listing the three facts alone would only describe, not analyse.'
      }),
      Object.freeze({
        id: 'worked-2',
        theme: 'High-profile defacement (worked example)',
        scenario:
          'Northbank’s public website is changed overnight to display a large protest message about NHS funding. Clinical systems are not encrypted.',
        motivation: 'Publicity',
        target: 'Organisations',
        method: 'System compromise',
        evidence:
          'Public protest message; high-visibility website; clinical systems left alone.',
        connection:
          'Because the attacker wanted the incident noticed, a public organisational website was a logical target, and system compromise of that site suited delivering a visible message.',
        alternative: 'Thrill',
        alternativeWhy:
          'Thrill could be discussed, but the protest message and funding theme make publicity the stronger primary motivation.',
        teachingNote:
          'Publicity seeks notice. Do not collapse this into thrill just because the attacker “showed off”.'
      })
    ]),
    scenarios: Object.freeze([
      Object.freeze({
        id: 'map-espionage',
        theme: 'Espionage',
        title: 'Quiet document collection',
        scenario:
          'An attacker copies confidential supplier-contract files from Northbank systems and leaves no public statement. The copies appear intended for another interested party.',
        acceptedMotivations: Object.freeze(['Espionage']),
        acceptedTargets: Object.freeze(['Information', 'Organisations']),
        acceptedMethods: Object.freeze(['Exfiltration', 'System compromise']),
        primaryMotivation: 'Espionage',
        primaryTarget: 'Information',
        primaryMethod: 'Exfiltration',
        ambiguous: false,
        hint: 'Look for secrecy and information advantage rather than publicity or payment.'
      }),
      Object.freeze({
        id: 'map-hacktivism',
        theme: 'Hacktivism',
        title: 'Cause-driven website message',
        scenario:
          'Northbank’s public site shows a message criticising local health funding. The attackers claim they acted so patients and citizens would notice the issue. Clinical systems are unaffected.',
        acceptedMotivations: Object.freeze(['Publicity', 'Public good', 'Righting perceived wrongs']),
        acceptedTargets: Object.freeze(['Organisations']),
        acceptedMethods: Object.freeze(['System compromise']),
        primaryMotivation: 'Publicity',
        primaryTarget: 'Organisations',
        primaryMethod: 'System compromise',
        ambiguous: true,
        ambiguousNote:
          'Publicity is strongly supported by wanting the incident noticed. Public good or righting perceived wrongs may also be defensible if you use the claim about patients and citizens — explain which evidence you rely on.',
        hint: 'At least two motivations can be defensible; explain the connection rather than only naming labels.'
      }),
      Object.freeze({
        id: 'map-ransomware',
        theme: 'Ransomware',
        title: 'Encrypted clinics and payment demand',
        scenario:
          'Clinic booking systems are encrypted and a cryptocurrency payment is demanded to restore access. No political message is published.',
        acceptedMotivations: Object.freeze(['Income generation']),
        acceptedTargets: Object.freeze(['Organisations', 'Information']),
        acceptedMethods: Object.freeze(['System compromise']),
        primaryMotivation: 'Income generation',
        primaryTarget: 'Organisations',
        primaryMethod: 'System compromise',
        ambiguous: false,
        hint: 'Payment demand without deception language points to income generation rather than fraud.'
      }),
      Object.freeze({
        id: 'map-defacement',
        theme: 'High-profile defacement',
        title: 'Visible protest banner',
        scenario:
          'A high-visibility banner is placed on Northbank’s homepage overnight so that anyone visiting the site sees a protest slogan. Staff later find the change came through a compromised web account.',
        acceptedMotivations: Object.freeze(['Publicity']),
        acceptedTargets: Object.freeze(['Organisations']),
        acceptedMethods: Object.freeze(['System compromise']),
        primaryMotivation: 'Publicity',
        primaryTarget: 'Organisations',
        primaryMethod: 'System compromise',
        ambiguous: false,
        hint: 'Wanting visitors to see a slogan supports publicity as why.'
      })
    ])
  });
})(window);
