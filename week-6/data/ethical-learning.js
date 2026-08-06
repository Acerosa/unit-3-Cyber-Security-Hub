/**
 * Week 6 ethical considerations guided learning.
 */
(function (global) {
  'use strict';

  global.Week6EthicalLearning = Object.freeze({
    activityId: 'week6-ethical-learning',
    activityName: 'Ethical Considerations Learning',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 1,
    total: 6,
    estimatedMinutes: 30,
    overviewNote:
      'Ethical considerations ask what is right or fair, even when the law may not clearly forbid an action. Week 6 builds on earlier LO2 topics and connects to Week 3 penetration testing ideas: permission, scope and rules of engagement.',
    sections: Object.freeze([
      Object.freeze({
        id: 'disclosure',
        title: 'Responsible disclosure',
        content:
          'When someone discovers a vulnerability, responsible disclosure means reporting it to the organisation or vendor so it can be fixed before wider harm occurs. Publicly dumping exploit details without warning can put patients and staff at risk. Ethical researchers balance helping improve security with avoiding unnecessary damage.',
        northbankExample:
          'If a contractor finds that Northbank patient portal sessions expire too slowly, reporting through the agreed channel allows IT to patch before criminals exploit the flaw.',
        check: Object.freeze({
          id: 'disclosure-check',
          prompt: 'Which action best demonstrates responsible disclosure?',
          options: Object.freeze([
            'Posting exploit code on social media immediately',
            'Reporting the flaw through the organisation agreed channel and allowing reasonable time to fix',
            'Ignoring the flaw because it is not illegal',
            'Selling access to the vulnerability on a forum'
          ]),
          correctIndex: 1,
          explanation:
            'Responsible disclosure reports the issue through proper channels and allows time to remediate before public release.'
        })
      }),
      Object.freeze({
        id: 'monitoring',
        title: 'Employee monitoring',
        content:
          'Organisations may monitor staff activity to detect misuse or insider threats, but monitoring must be proportionate, transparent where required and respectful of privacy. After an insider data breach, Northbank may review access logs, but blanket surveillance without justification can damage trust and morale.',
        northbankExample:
          'Following an insider threat exercise, Northbank might increase logging on sensitive record access, but should explain why and limit monitoring to what is needed for investigation.',
        check: Object.freeze({
          id: 'monitoring-check',
          prompt: 'Which statement best reflects an ethical approach to employee monitoring?',
          options: Object.freeze([
            'Monitor everything secretly with no business reason',
            'Use proportionate monitoring with a clear purpose linked to security or misconduct concerns',
            'Never monitor staff under any circumstances',
            'Share monitored data publicly to deter misuse'
          ]),
          correctIndex: 1,
          explanation:
            'Ethical monitoring is proportionate, purpose-driven and respects privacy expectations.'
        })
      }),
      Object.freeze({
        id: 'auth',
        title: 'Ethical hacking and the authorisation boundary',
        content:
          'Ethical hacking tests defences with permission. From Week 3, penetration testing requires explicit permission, a defined scope (which systems may be tested) and rules of engagement (what techniques are allowed and when). Testing outside scope is not ethical hacking, even if the tester has good intentions.',
        northbankExample:
          'A contracted tester may probe Northbank external web services listed in the scope document, but must not attempt social engineering of patients unless the rules of engagement allow it.',
        week3Link:
          'Week 3 reminder: permission, scope and rules of engagement define where ethical testing ends and unauthorised activity begins.',
        check: Object.freeze({
          id: 'auth-check',
          prompt: 'A tester probes a system not listed in the signed scope document. This is best described as:',
          options: Object.freeze([
            'Ethical hacking because they are a professional',
            'Outside the authorisation boundary even if other systems were in scope',
            'Always lawful if no data is copied',
            'Operational downtime only'
          ]),
          correctIndex: 1,
          explanation:
            'Authorisation is limited to agreed scope. Testing other systems crosses the ethical and legal boundary without permission.'
        })
      }),
      Object.freeze({
        id: 'ethics-law',
        title: 'Ethics versus law',
        content:
          'Something can be lawful but still unethical, or unethical but still lawful in a grey area. Examination answers must not treat moral disapproval as if it were a statute. Name ethical reasons separately from legal duties.',
        northbankExample:
          'Reading a colleague unlocked screen to satisfy curiosity may breach Northbank policy and be unethical, but whether it is unlawful depends on authorisation and context. Do not assume every bad action is a named offence.',
        check: Object.freeze({
          id: 'ethics-law-check',
          prompt: 'Which examination habit is most appropriate?',
          options: Object.freeze([
            'Call every unethical action a Computer Misuse Act offence',
            'Separate ethical judgement from named legal duties and offences',
            'Ignore ethics because only law matters',
            'Use Cyber Streetwise as a statute name'
          ]),
          correctIndex: 1,
          explanation:
            'Distinguish ethical arguments from legal requirements. Name legislation and duties accurately when law applies.'
        })
      })
    ]),
    knowledgeCheck: Object.freeze([
      Object.freeze({
        id: 'ek1',
        prompt: 'Responsible disclosure mainly aims to:',
        options: Object.freeze([
          'Maximise publicity for the researcher',
          'Allow organisations to fix flaws before wider exploitation',
          'Replace data protection legislation',
          'Eliminate the need for penetration testing'
        ]),
        correctIndex: 1,
        explanation:
          'The goal is safer remediation, not publicity or replacing legal frameworks.'
      }),
      Object.freeze({
        id: 'ek2',
        prompt: 'Which Week 3 idea limits what an ethical tester may do?',
        options: Object.freeze([
          'Rules of engagement',
          'Lost productivity',
          'Cyber Essentials Scheme',
          'Safety impact only'
        ]),
        correctIndex: 0,
        explanation:
          'Rules of engagement, with permission and scope, define authorised testing boundaries.'
      })
    ])
  });
})(window);
