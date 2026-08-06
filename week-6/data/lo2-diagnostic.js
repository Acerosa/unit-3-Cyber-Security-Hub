/**
 * Week 6 LO2 diagnostic retrieval across sections 2.1 to 2.6.
 */
(function (global) {
  'use strict';

  global.Week6Lo2Diagnostic = Object.freeze({
    activityId: 'week6-lo2-diagnostic',
    activityName: 'LO2 Diagnostic Retrieval',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 1,
    total: 12,
    estimatedMinutes: 20,
    formativeNote:
      'This diagnostic is formative only. It helps you identify revision priorities. It is not an official grade.',
    topicLabels: Object.freeze({
      threats: 'Threats',
      vulnerabilities: 'Vulnerabilities',
      attackerTypes: 'Attacker types',
      motivations: 'Motivations',
      targets: 'Targets',
      methods: 'Methods',
      impacts: 'Impacts',
      ethical: 'Ethical considerations',
      legal: 'Legal considerations',
      operational: 'Operational considerations'
    }),
    questions: Object.freeze([
      Object.freeze({
        id: 'd1',
        topic: 'threats',
        prompt: 'Which option best describes a cyber security threat?',
        options: Object.freeze([
          'A weakness that makes harm more likely',
          'A potential cause of harm or damage to systems or data',
          'A law that organisations must follow',
          'The cost of running a security control'
        ]),
        correctIndex: 1,
        explanation:
          'A threat is a potential cause of harm. A vulnerability is a weakness that may be exploited.'
      }),
      Object.freeze({
        id: 'd2',
        topic: 'vulnerabilities',
        prompt: 'An unpatched server is best classified as:',
        options: Object.freeze([
          'A motivation',
          'A vulnerability',
          'An operational consideration only',
          'A government initiative'
        ]),
        correctIndex: 1,
        explanation:
          'An unpatched server is a weakness that could be exploited. Threats and vulnerabilities are linked but not the same.'
      }),
      Object.freeze({
        id: 'd3',
        topic: 'attackerTypes',
        prompt: 'Which attacker type is most associated with acting from inside an organisation?',
        options: Object.freeze([
          'Script kiddie',
          'Insider',
          'Hacktivist only',
          'Nation state only'
        ]),
        correctIndex: 1,
        explanation:
          'Insiders already have access or knowledge of internal systems. Other attacker types may also target organisations from outside.'
      }),
      Object.freeze({
        id: 'd4',
        topic: 'motivations',
        prompt: 'Seeking ransom payment after encrypting files is mainly an example of:',
        options: Object.freeze([
          'Operational downtime',
          'Financial motivation',
          'Responsible disclosure',
          'A legal duty under data protection legislation'
        ]),
        correctIndex: 1,
        explanation:
          'Income generation is a motivation (why someone acts). Impacts and legal duties are separate ideas.'
      }),
      Object.freeze({
        id: 'd5',
        topic: 'targets',
        prompt: 'Patient records at Northbank Community Health Partnership are mainly a target because they are:',
        options: Object.freeze([
          'Always public information',
          'Valuable and sensitive data held by the organisation',
          'Only an operational cost',
          'Defined by the Cyber Essentials Scheme'
        ]),
        correctIndex: 1,
        explanation:
          'Healthcare data is sensitive and valuable to attackers for fraud, resale or coercion.'
      }),
      Object.freeze({
        id: 'd6',
        topic: 'methods',
        prompt: 'Phishing emails used to trick staff into revealing credentials are an example of:',
        options: Object.freeze([
          'A method or attack technique',
          'An ethical hacking rule of engagement',
          'The United Kingdom Cyber Security Strategy',
          'Lost productivity'
        ]),
        correctIndex: 0,
        explanation:
          'Phishing is a social-engineering method attackers use to gain access or information.'
      }),
      Object.freeze({
        id: 'd7',
        topic: 'impacts',
        prompt: 'When clinic appointments are cancelled because systems fail, which impact category fits best?',
        options: Object.freeze([
          'Loss only',
          'Disruption',
          'Operational consideration only',
          'Government initiative'
        ]),
        correctIndex: 1,
        explanation:
          'Cancelled appointments describe disruption to a service. The same event may also create loss or safety impacts for other stakeholders.'
      }),
      Object.freeze({
        id: 'd8',
        topic: 'ethical',
        prompt: 'Reporting a vulnerability privately to a vendor before public release is called:',
        options: Object.freeze([
          'Insider trading',
          'Responsible disclosure',
          'Computer misuse',
          'Mandatory breach notification without context'
        ]),
        correctIndex: 1,
        explanation:
          'Responsible disclosure balances helping fix a flaw with avoiding unnecessary harm from publicising it too early.'
      }),
      Object.freeze({
        id: 'd9',
        topic: 'legal',
        prompt: 'Unauthorised access to a computer system without permission in the United Kingdom is mainly addressed by:',
        options: Object.freeze([
          'Cyber Streetwise only',
          'Computer Misuse Act 1990',
          '10 Steps to Cyber Security',
          'Operational downtime planning'
        ]),
        correctIndex: 1,
        explanation:
          'The Computer Misuse Act 1990 covers unauthorised access and related offences. Guidance documents are not statutes.'
      }),
      Object.freeze({
        id: 'd10',
        topic: 'legal',
        prompt: 'Handling personal data at Northbank must comply with:',
        options: Object.freeze([
          'Cyber Essentials Scheme only',
          'Current United Kingdom data protection legislation',
          'Ethical hacking rules of engagement only',
          'Lost productivity policies'
        ]),
        correctIndex: 1,
        explanation:
          'Organisations processing personal data must follow current United Kingdom data protection legislation, not guidance schemes alone.'
      }),
      Object.freeze({
        id: 'd11',
        topic: 'operational',
        prompt: 'Requiring very long complex passwords that staff cannot remember may increase:',
        options: Object.freeze([
          'Legal certainty only',
          'Workarounds and lost productivity',
          'Responsible disclosure',
          'Nation-state motivation'
        ]),
        correctIndex: 1,
        explanation:
          'Operational factors include usability and whether controls encourage staff to find unsafe shortcuts.'
      }),
      Object.freeze({
        id: 'd12',
        topic: 'operational',
        prompt: 'Which factor is an operational consideration when choosing a security control?',
        options: Object.freeze([
          'Whether the action is unethical',
          'Staff time needed to operate the control',
          'Whether hacktivists exist',
          'The name of a statute alone'
        ]),
        correctIndex: 1,
        explanation:
          'Operational considerations include cost, staff time, downtime, usability and productivity effects.'
      })
    ])
  });
})(window);
