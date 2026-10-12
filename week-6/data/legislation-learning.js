/**
 * Week 6 United Kingdom legislation guided learning.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

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
          'Creates criminal offences for unauthorised access to computer material; unauthorised access with intent to commit or facilitate further offences; and unauthorised acts intended to impair, or reckless as to impairing, computer operations. Older summaries used "unauthorised modification of computer material"; that is not the current section 3 wording.',
        dutyOffence:
          'Relevant offences include unauthorised access to computer material; unauthorised access with intent to commit or facilitate further offences; and unauthorised acts intended to impair, or reckless as to impairing, computer operations.',
        northbankApplication:
          'If an insider accesses patient records without permission, or an external attacker breaks into Northbank systems, Computer Misuse Act 1990 offences may apply depending on authorisation and intent.',
        misconception:
          'Misconception: Computer Misuse Act 1990 is not the main statute for lawful processing of personal data. Data protection is addressed separately under current United Kingdom data protection legislation.'
      }),
      Object.freeze({
        id: 'dp',
        formalName: 'Current United Kingdom data protection legislation',
        purpose:
          'Current United Kingdom data protection legislation includes the UK GDPR, the Data Protection Act 2018, and relevant amendments made by the Data (Use and Access) Act 2025. These instruments set duties for organisations that process personal data; the 2025 Act amends, rather than replaces, the UK GDPR and the Data Protection Act 2018.',
        dutyOffence:
          'Relevant cyber security duties include lawful processing, security of personal data, accountability, transparency, and appropriate responses to personal data breaches. Do not invent notification periods, section numbers or penalty amounts.',
        northbankApplication:
          'Northbank must protect patient personal data, limit access to what is necessary and respond properly if an insider causes a data breach affecting records.',
        misconception:
          'Misconception: do not invent section numbers, notification periods or penalty amounts in examination answers. Name the legislation and the relevant duty or offence in plain language.'
      }),
      Object.freeze({
        id: 'pja',
        formalName: 'Police and Justice Act 2006 amendments (supplying tools for misuse)',
        purpose:
          'The Police and Justice Act 2006 amended the Computer Misuse Act 1990. It inserted the offence of making, supplying or obtaining articles for use in computer misuse offences.',
        dutyOffence:
          'Relevant offence area: making, supplying, offering to supply or obtaining an article intending it to be used, or believing it is likely to be used, to commit unauthorised access or related Computer Misuse Act offences.',
        northbankApplication:
          'If someone distributes a bespoke credential-stealing kit aimed at Northbank staff, the Computer Misuse Act supply-of-articles offence, inserted by the Police and Justice Act 2006, may be relevant alongside direct misuse offences.',
        misconception:
          'Misconception: possessing legitimate security testing tools is not automatically unlawful. Authorised testing with permission, scope and rules of engagement is different from making or supplying articles for criminal misuse. Context, authorisation and intent matter.'
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
          'Name legislation and the relevant duty or offence. Guidance schemes are not statutes. Current United Kingdom data protection legislation includes the UK GDPR and the Data Protection Act 2018, as amended.'
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
          'The Police and Justice Act 2006 amended the Computer Misuse Act 1990 to address making, supplying or obtaining articles for use in computer misuse offences. Possessing legitimate authorised security testing tools is not automatically unlawful.'
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
          'Personal data handling duties sit under current United Kingdom data protection legislation (UK GDPR and the Data Protection Act 2018, as amended). Computer Misuse Act 1990 offences may also apply to unauthorised access, depending on authorisation and intent.'
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
