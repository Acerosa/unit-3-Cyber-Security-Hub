/**
 * Week 6 directed independent study guidance.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week6DirectedStudy = Object.freeze({
    resourceId: 'week6-directed-study',
    scored: false,
    title: 'Directed independent study',
    acknowledgementKey: 'week6-directed-study-ack',
    leavingHubNotice:
      'Some tasks open external sites or college materials outside this Unit 3 Hub. The hub does not verify external completion.',
    ciscoTask: Object.freeze({
      title: 'Cisco Cyber Threat Management: governance and compliance',
      instructions: Object.freeze([
        'Review the Cisco Cyber Threat Management material on governance and compliance assigned by your tutor.',
        'Record the difference between a compliance framework and legislation.',
        'Give one Northbank example where both could apply after the insider breach.'
      ])
    }),
    tryhackmeIso: Object.freeze({
      room: 'ISO 27001',
      url: 'https://tryhackme.com/room/iso27001',
      note:
        'Do not reproduce room content or answers here. Record your own findings after authorised access.',
      recordFields: Object.freeze([
        'One control or concept from the room',
        'How ISO 27001 as a management standard differs from a legal duty under current United Kingdom data protection legislation'
      ])
    }),
    tryhackmeLegal: Object.freeze({
      room: 'Legal Considerations in DFIR',
      url: 'https://tryhackme.com/room/legalconsiderationsindfir',
      note:
        'Do not reproduce room content or answers here. Record your own findings after authorised access.',
      recordFields: Object.freeze([
        'Two investigator constraints that could affect how Northbank handles digital evidence or internal inquiries'
      ])
    }),
    ncscResearch: Object.freeze({
      title: 'Cyber Essentials and 10 Steps to Cyber Security',
      links: Object.freeze([
        Object.freeze({
          label: 'Cyber Essentials overview (NCSC)',
          url: 'https://www.ncsc.gov.uk/cyberessentials/overview'
        }),
        Object.freeze({
          label: '10 Steps to Cyber Security (NCSC)',
          url: 'https://www.ncsc.gov.uk/collection/10-steps'
        })
      ]),
      summaryPrompt:
        'Write a one-page summary comparing what Cyber Essentials and the 10 Steps offer Northbank-sized community healthcare.'
    }),
    lo2Checklist: Object.freeze([
      '2.1 Threats: I can explain relevant threat types for Northbank.',
      '2.2 Vulnerabilities and attackers: I can link vulnerabilities to insider and external attackers.',
      '2.3 Motivations: I can explain why an insider or external attacker might act.',
      '2.4 Targets: I can identify what Northbank assets or data may be targeted.',
      '2.5 Impacts: I can analyse loss, disruption and safety for stakeholders.',
      '2.6 Other considerations: I can separate ethical, legal and operational points and name required statutes.'
    ]),
    revisionPriorities: Object.freeze([
      'Revision priority 1 after this directed study',
      'Revision priority 2 after this directed study'
    ])
  });
})(window);
