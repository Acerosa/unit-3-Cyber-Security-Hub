/**
 * Week 6 ethical / unlawful classification activity.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week6EthicalClassification = Object.freeze({
    activityId: 'week6-ethical-classification',
    activityName: 'Ethical, Unlawful, Both or Neither',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 1,
    total: 8,
    estimatedMinutes: 25,
    categories: Object.freeze([
      'Unethical',
      'Unlawful',
      'Both unethical and unlawful',
      'Neither unethical nor unlawful'
    ]),
    instructions: Object.freeze([
      'Classify each scenario using the four categories.',
      'Ethics and law are related but not identical.',
      'Some scenarios need more facts before a firm legal conclusion.',
      'Feedback explains the ethical and legal dimensions separately.'
    ]),
    items: Object.freeze([
      Object.freeze({
        id: 'e1',
        statement:
          'A Northbank receptionist reads a celebrity patient record out of curiosity, with no clinical need and no permission.',
        accepted: Object.freeze(['Unethical', 'Both unethical and unlawful']),
        feedback:
          'Ethically, this breaches trust and confidentiality expectations. Legally, unauthorised access to personal data may engage current United Kingdom data protection legislation and possibly Computer Misuse Act 1990, depending on authorisation and intent. More facts may be needed for a firm legal conclusion.'
      }),
      Object.freeze({
        id: 'e2',
        statement:
          'An authorised penetration tester runs agreed tests only on systems listed in the signed scope during the agreed window.',
        accepted: Object.freeze(['Neither unethical nor unlawful']),
        feedback:
          'With permission, scope and rules of engagement, this is authorised security testing. It is not unethical hacking and is not unlawful in that context.'
      }),
      Object.freeze({
        id: 'e3',
        statement:
          'A student downloads a password-cracking tool from the internet to try on a friend home router without the friend knowledge.',
        accepted: Object.freeze(['Both unethical and unlawful']),
        feedback:
          'Ethically, this violates consent and privacy. Unauthorised access attempts may breach Computer Misuse Act 1990. Supplying or preparing tools for misuse may also engage Police and Justice Act 2006 amendments in some circumstances.'
      }),
      Object.freeze({
        id: 'e4',
        statement:
          'Northbank publishes a clear fair-processing notice explaining that access logs may be reviewed after a suspected insider breach.',
        accepted: Object.freeze(['Neither unethical nor unlawful']),
        feedback:
          'Transparent, proportionate monitoring communication supports ethical practice and aligns with data protection expectations. This is not inherently unethical or unlawful.'
      }),
      Object.freeze({
        id: 'e5',
        statement:
          'A manager secretly installs keylogging software on all staff machines indefinitely, including break rooms, with no security incident reason.',
        accepted: Object.freeze(['Unethical', 'Both unethical and unlawful']),
        feedback:
          'Ethically, this is disproportionate and invasive. Legally, covert excessive monitoring may engage data protection and employment law issues. More organisational context may be needed for a precise legal label.'
      }),
      Object.freeze({
        id: 'e6',
        statement:
          'A researcher publicly releases a Northbank exploit with no prior warning one hour after discovery.',
        accepted: Object.freeze(['Unethical']),
        feedback:
          'This fails responsible disclosure ethics and may harm patients and staff. Whether it is unlawful depends on what was accessed and how. Do not assume ethics and law always align without facts.'
      }),
      Object.freeze({
        id: 'e7',
        statement:
          'An employee uses their own credentials to export patient lists they are not permitted to access, then sells the data.',
        accepted: Object.freeze(['Both unethical and unlawful']),
        feedback:
          'Clearly unethical misuse of trust. Unauthorised access and misuse of personal data likely engages Computer Misuse Act 1990 and current United Kingdom data protection legislation.'
      }),
      Object.freeze({
        id: 'e8',
        statement:
          'Northbank requires staff to complete annual cyber security awareness training during paid working time.',
        accepted: Object.freeze(['Neither unethical nor unlawful']),
        feedback:
          'Training during paid time is a reasonable organisational expectation. It is not unethical and is not unlawful merely because staff must attend.'
      })
    ])
  });
})(window);
