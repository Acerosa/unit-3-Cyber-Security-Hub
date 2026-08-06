/**
 * Week 6 legislation scenario matching activity.
 */
(function (global) {
  'use strict';

  global.Week6LegislationMatching = Object.freeze({
    activityId: 'week6-legislation-matching',
    activityName: 'Legislation Scenario Matching',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 1,
    total: 6,
    estimatedMinutes: 25,
    legislationOptions: Object.freeze([
      'Computer Misuse Act 1990',
      'Current United Kingdom data protection legislation',
      'Police and Justice Act 2006 amendments (supplying tools for misuse)',
      'Not primarily a criminal statute scenario'
    ]),
    dutyOptions: Object.freeze([
      'Unauthorised access to computer material',
      'Unauthorised modification of computer material',
      'Processing personal data without appropriate security or lawful basis',
      'Handling a personal data breach under current duties',
      'Supplying tools knowing they are likely to be used for computer misuse',
      'Not primarily a criminal statute scenario'
    ]),
    scenarios: Object.freeze([
      Object.freeze({
        id: 'm1',
        text: 'An attacker in another country uses stolen credentials to enter Northbank patient record system without permission.',
        legislation: 'Computer Misuse Act 1990',
        duty: 'Unauthorised access to computer material',
        feedback:
          'Unauthorised access to systems is a Computer Misuse Act 1990 concern. Personal data duties may also apply separately, but do not label this as data protection alone.'
      }),
      Object.freeze({
        id: 'm2',
        text: 'An insider exports thousands of patient details they are not permitted to use and shares them with a third party.',
        legislation: 'Current United Kingdom data protection legislation',
        duty: 'Processing personal data without appropriate security or lawful basis',
        feedback:
          'Misuse of personal data engages data protection duties. Computer Misuse Act 1990 may also apply to unauthorised access, but the core personal data duty is under current United Kingdom data protection legislation.'
      }),
      Object.freeze({
        id: 'm3',
        text: 'A forum seller offers a ready-made phishing kit advertised for breaking into GP partnerships.',
        legislation: 'Police and Justice Act 2006 amendments (supplying tools for misuse)',
        duty: 'Supplying tools knowing they are likely to be used for computer misuse',
        feedback:
          'Supplying tools for misuse is not the same as the Computer Misuse Act 1990 access offence itself. Name the supply offence under the Police and Justice Act 2006 amendments.'
      }),
      Object.freeze({
        id: 'm4',
        text: 'Malware encrypts Northbank servers and deletes backups without authorisation.',
        legislation: 'Computer Misuse Act 1990',
        duty: 'Unauthorised modification of computer material',
        feedback:
          'Encrypting or deleting data without permission may be unauthorised modification. Do not assume every incident is only a data protection matter.'
      }),
      Object.freeze({
        id: 'm5',
        text: 'After discovering an insider breach, Northbank must assess harm and respond under its data protection responsibilities.',
        legislation: 'Current United Kingdom data protection legislation',
        duty: 'Handling a personal data breach under current duties',
        feedback:
          'Breaches involving personal data engage current United Kingdom data protection legislation. Do not invent notification periods or section numbers in answers.'
      }),
      Object.freeze({
        id: 'm6',
        text: 'A tutor explains the United Kingdom Cyber Security Strategy themes in class without accessing any system.',
        legislation: 'Not primarily a criminal statute scenario',
        duty: 'Not primarily a criminal statute scenario',
        feedback:
          'Government strategy is guidance, not a criminal statute. The CMA-for-data-protection misconception: strategy documents do not create criminal offences.'
      })
    ])
  });
})(window);
