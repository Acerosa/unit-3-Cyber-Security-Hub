/**
 * Week 7 directed independent study (unscored).
 */
(function (global) {
  'use strict';

  global.Week7DirectedStudy = Object.freeze({
    resourceId: 'week7-directed-study',
    scored: false,
    title: 'Directed independent study (about 1 hour 45 minutes)',
    acknowledgementKey: 'week7-directed-study-ack',
    leavingHubNotice:
      'Some tasks open external platforms outside this Unit 3 Hub. The hub does not verify external completion. Do not paste proprietary room answers into shared spaces.',
    ciscoTask: Object.freeze({
      title: 'Cisco Networking Academy: Cyber Threat Management',
      instructions: Object.freeze([
        'Work through the risk-management and vulnerability-assessment material in Cisco Cyber Threat Management using the route your tutor provides (no invented deep link is hard-coded here).',
        'Record the stages of a vulnerability assessment.',
        'Explain how those stages map onto the risk-management process taught in class.'
      ]),
      recordFields: Object.freeze([
        'Stages of a vulnerability assessment',
        'How those stages map onto the classroom risk-management process'
      ])
    }),
    tryhackmeOpenvas: Object.freeze({
      room: 'OpenVAS',
      url: 'https://tryhackme.com/room/openvas',
      note:
        'Do not reproduce room content or answers here. Record your own findings after authorised access.',
      recordFields: Object.freeze([
        'What an automated vulnerability scanner reports',
        'What the scanner cannot determine',
        'Why that limitation creates a need for penetration testing'
      ])
    }),
    tryhackmeLogs: Object.freeze({
      room: 'Intro to Logs',
      url: 'https://tryhackme.com/room/introtologs',
      note:
        'Do not reproduce room content or answers here. Record your own findings after authorised access.',
      recordFields: Object.freeze([
        'What evidence a log provides',
        'What an alert alone does not provide',
        'How logs support investigation and monitoring'
      ])
    }),
    industryResearch: Object.freeze({
      title: 'Industry product research (for Week 8 retrieval)',
      prompt:
        'Research one intrusion detection or prevention product. Enter your own findings. Do not rely on hard-coded product claims in this hub. Summaries will be used during Week 8 retrieval.',
      fields: Object.freeze([
        Object.freeze({ id: 'productName', label: 'Product name' }),
        Object.freeze({ id: 'monitors', label: 'What it monitors' }),
        Object.freeze({
          id: 'detectionType',
          label: 'Anomaly-based, signature-based, or both'
        }),
        Object.freeze({ id: 'strength', label: 'One strength' }),
        Object.freeze({ id: 'limitation', label: 'One limitation' }),
        Object.freeze({ id: 'sources', label: 'Sources' })
      ])
    })
  });
})(window);
