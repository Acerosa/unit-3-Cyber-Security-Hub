/**
 * Week 6 Session 2 legislation retrieval quiz.
 */
(function (global) {
  'use strict';

  global.Week6LegislationRetrieval = Object.freeze({
    activityId: 'week6-legislation-retrieval',
    activityName: 'Legislation Retrieval Quiz',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 2,
    total: 10,
    estimatedMinutes: 15,
    questions: Object.freeze([
      Object.freeze({
        id: 'lrq1',
        prompt:
          'Which United Kingdom statute creates the main unauthorised access offence for computer systems?',
        options: Object.freeze([
          'Computer Misuse Act 1990',
          'Current United Kingdom data protection legislation only',
          'Police and Justice Act 2006 only',
          'Cyber Essentials certification scheme'
        ]),
        correctIndex: 0,
        explanation:
          'Unauthorised access to computer material is primarily addressed under the Computer Misuse Act 1990.'
      }),
      Object.freeze({
        id: 'lrq2',
        prompt:
          'Northbank must explain why patient contact details were accessed without a proper purpose. Which legislation is most directly relevant to that duty?',
        options: Object.freeze([
          'Current United Kingdom data protection legislation',
          'Computer Misuse Act 1990 only, with no data protection role',
          'Police and Justice Act 2006 amendments only',
          'Ethical codes with no legal force'
        ]),
        correctIndex: 0,
        explanation:
          'Processing personal data must comply with current United Kingdom data protection legislation, including lawful purpose and security expectations.'
      }),
      Object.freeze({
        id: 'lrq3',
        prompt:
          'A supplier offers Northbank a ready-made credential-testing tool marketed for "checking weak passwords" without clear authorisation rules. Which amendment area is most relevant?',
        options: Object.freeze([
          'Police and Justice Act 2006 amendments on supplying tools for misuse',
          'Current United Kingdom data protection legislation only',
          'Computer Misuse Act 1990 section on patient confidentiality',
          'Operational downtime guidance only'
        ]),
        correctIndex: 0,
        explanation:
          'The Police and Justice Act 2006 amendments address making, supplying or obtaining articles for use in Computer Misuse Act offences.'
      }),
      Object.freeze({
        id: 'lrq4',
        prompt:
          'Which pairing best links statute to duty for an insider who accesses records they are not authorised to view?',
        options: Object.freeze([
          'Computer Misuse Act 1990: unauthorised access to computer material',
          'Current United Kingdom data protection legislation: only marketing consent',
          'Police and Justice Act 2006: only physical break-ins',
          'Ethics policy: criminal prosecution without further detail'
        ]),
        correctIndex: 0,
        explanation:
          'Name the statute and the relevant duty or offence together. Unauthorised access fits the Computer Misuse Act 1990.'
      }),
      Object.freeze({
        id: 'lrq5',
        prompt:
          'Which pairing best links statute to duty when Northbank fails to protect personal data by inadequate access controls after an insider breach?',
        options: Object.freeze([
          'Current United Kingdom data protection legislation: appropriate security and accountability for personal data',
          'Computer Misuse Act 1990: only external hackers',
          'Police and Justice Act 2006: only copyright infringement',
          'Operational policy: replaces all legal duties'
        ]),
        correctIndex: 0,
        explanation:
          'Security of personal data and accountability sit under current United Kingdom data protection legislation.'
      }),
      Object.freeze({
        id: 'lrq6',
        prompt:
          'An action may be unethical but still lawful, or unlawful but argued as well-intentioned. Which statement is most accurate?',
        options: Object.freeze([
          'Ethics and law are related but not identical; legal compliance does not automatically mean an action is ethical',
          'If something is legal it is always ethical in a healthcare setting',
          'Ethical behaviour never needs to consider operational practicality',
          'Only the Computer Misuse Act 1990 defines ethics for Northbank'
        ]),
        correctIndex: 0,
        explanation:
          'Week 6 requires you to separate moral judgement from legal requirements and from operational constraints.'
      }),
      Object.freeze({
        id: 'lrq7',
        prompt:
          'Northbank considers continuous keystroke monitoring for all staff after an insider data breach. Which operational consideration is most relevant?',
        options: Object.freeze([
          'Staff time, usability, trust and lost productivity if controls are disproportionate',
          'Only the colour of the monitoring dashboard',
          'Whether the attacker used ransomware encryption',
          'Replacing all legislation with a single policy sentence'
        ]),
        correctIndex: 0,
        explanation:
          'Operational considerations include cost, staff time, downtime, usability and productivity trade-offs.'
      }),
      Object.freeze({
        id: 'lrq8',
        prompt:
          'Why should Northbank not rely on the Computer Misuse Act 1990 alone when deciding how to handle exposed patient contact details?',
        options: Object.freeze([
          'Data protection duties also apply to how personal data is processed, secured and explained to individuals',
          'The Computer Misuse Act 1990 removes all data protection duties',
          'Patient contact details are never personal data',
          'Operational cost always overrides both statutes'
        ]),
        correctIndex: 0,
        explanation:
          'Different statutes address different duties. Personal data handling also falls under current United Kingdom data protection legislation.'
      }),
      Object.freeze({
        id: 'lrq9',
        prompt:
          'Which answer best distinguishes a legal duty from an ethical expectation for employee monitoring?',
        options: Object.freeze([
          'Law sets minimum requirements that can be enforced; ethics asks whether monitoring is fair, proportionate and respectful even where law allows it',
          'Ethics and law are identical, so proportionality never matters',
          'Legal duties apply only to external attackers',
          'Ethical expectations replace the need to name any statute'
        ]),
        correctIndex: 0,
        explanation:
          'Strong Week 6 answers name legal duties separately from ethical judgement and operational practicality.'
      }),
      Object.freeze({
        id: 'lrq10',
        prompt:
          'A learner writes: "Northbank should monitor everyone heavily because hackers exist." What is the main weakness?',
        options: Object.freeze([
          'It jumps to an operational choice without linking statute, duty, ethics or stakeholder impact',
          'It names the Computer Misuse Act 1990 too precisely',
          'It includes too much evidence from the insider breach scenario',
          'It balances competing considerations before concluding'
        ]),
        correctIndex: 0,
        explanation:
          'Exam-style answers need statute linked to duty, ethical proportionality and operational trade-offs, not vague fear-based conclusions.'
      })
    ])
  });
})(window);
