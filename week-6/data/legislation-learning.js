/**
 * Week 6 United Kingdom legislation guided learning.
 */
(function (global) {
  'use strict';

  global.Week6LegislationLearning = Object.freeze({
    activityId: 'week6-legislation-learning',
    activityName: 'United Kingdom Legislation Learning',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 1,
    total: 6,
    estimatedMinutes: 30,
    teachingNote:
      'Examination answers must name the law and the relevant duty or offence. A bare statute name alone is insufficient. Keep legislation current: use official sources and tutor guidance rather than outdated summaries.',
    laws: Object.freeze([
      Object.freeze({
        id: 'cma',
        formalName: 'Computer Misuse Act 1990',
        purpose:
          'Creates criminal offences for unauthorised access to computer material, unauthorised access with intent, and unauthorised modification of computer material.',
        dutyOffence:
          'Relevant offences include unauthorised access to computer material and unauthorised acts with intent to impair operation of a computer.',
        northbankApplication:
          'If an insider accesses patient records without permission, or an external attacker breaks into Northbank systems, Computer Misuse Act 1990 offences may apply depending on authorisation and intent.',
        misconception:
          'Misconception: Computer Misuse Act 1990 is not the main statute for lawful processing of personal data. Data protection is addressed separately under current United Kingdom data protection legislation.'
      }),
      Object.freeze({
        id: 'dp',
        formalName: 'Current United Kingdom data protection legislation',
        purpose:
          'Sets duties for organisations that process personal data, including lawful basis, fairness, security and accountability expectations.',
        dutyOffence:
          'Relevant duties include processing personal data lawfully, securely and transparently, and handling personal data breaches appropriately under the current framework.',
        northbankApplication:
          'Northbank must protect patient personal data, limit access to what is necessary and respond properly if an insider causes a data breach affecting records.',
        misconception:
          'Misconception: do not invent section numbers, notification periods or penalty amounts in examination answers. Name the legislation and the relevant duty or offence in plain language.'
      }),
      Object.freeze({
        id: 'pja',
        formalName: 'Police and Justice Act 2006 amendments (supplying tools for misuse)',
        purpose:
          'Amended computer misuse law to address making, supplying or obtaining articles for use in computer misuse offences.',
        dutyOffence:
          'Relevant offence area: supplying or making available tools knowing they are likely to be used to commit unauthorised access or related misuse.',
        northbankApplication:
          'If someone distributes a bespoke credential-stealing kit aimed at Northbank staff, supply-of-tools offences may be relevant alongside direct misuse offences.',
        misconception:
          'Misconception: possessing security testing tools is not automatically illegal. Context, authorisation and intent matter, especially for legitimate security work.'
      })
    ]),
    knowledgeCheck: Object.freeze([
      Object.freeze({
        id: 'lk1',
        prompt: 'Which pairing is most accurate for examination answers?',
        options: Object.freeze([
          'Computer Misuse Act 1990: lawful basis for marketing emails',
          'Current United Kingdom data protection legislation: duties when processing personal data',
          'Cyber Essentials Scheme: criminal offence for hacking',
          'Cyber Streetwise: statute for unauthorised access'
        ]),
        correctIndex: 1,
        explanation:
          'Name legislation and the relevant duty or offence. Guidance schemes are not statutes.'
      }),
      Object.freeze({
        id: 'lk2',
        prompt: 'Unauthorised access to Northbank servers without permission is mainly linked to:',
        options: Object.freeze([
          'Cyber Streetwise',
          'Computer Misuse Act 1990',
          '10 Steps to Cyber Security',
          'Operational downtime'
        ]),
        correctIndex: 1,
        explanation:
          'Unauthorised access offences sit under Computer Misuse Act 1990, not guidance documents.'
      }),
      Object.freeze({
        id: 'lk3',
        prompt: 'Supplying a hacking tool knowing it will likely be used for unauthorised access relates to:',
        options: Object.freeze([
          'Police and Justice Act 2006 amendments (supplying tools for misuse)',
          'United Kingdom Cyber Security Strategy only',
          'Responsible disclosure only',
          'Lost productivity'
        ]),
        correctIndex: 0,
        explanation:
          'Tool supply offences were strengthened through Police and Justice Act 2006 amendments.'
      }),
      Object.freeze({
        id: 'lk4',
        prompt: 'A bare statute name in an examination answer is:',
        options: Object.freeze([
          'Always sufficient on its own',
          'Insufficient without naming the relevant duty or offence',
          'Better than explaining Northbank context',
          'Only needed for ethical questions'
        ]),
        correctIndex: 1,
        explanation:
          'Examiners expect the law plus the duty or offence, applied to the scenario where appropriate.'
      }),
      Object.freeze({
        id: 'lk5',
        prompt: 'After an insider data breach at Northbank, personal data duties mainly come from:',
        options: Object.freeze([
          'Computer Misuse Act 1990 alone',
          'Current United Kingdom data protection legislation',
          'Cyber Essentials Scheme',
          'Rules of engagement'
        ]),
        correctIndex: 1,
        explanation:
          'Personal data handling duties are under data protection legislation. Computer misuse may also apply to unauthorised access.'
      }),
      Object.freeze({
        id: 'lk6',
        prompt: 'Why must learners keep legislation current?',
        options: Object.freeze([
          'Because ethics never change',
          'Because law and guidance evolve and outdated names or duties lose marks',
          'Because operational costs are statutes',
          'Because NCSC exercises replace legislation'
        ]),
        correctIndex: 1,
        explanation:
          'Use current United Kingdom legislation names and accurate duties. Follow tutor and official sources.'
      })
    ])
  });
})(window);
