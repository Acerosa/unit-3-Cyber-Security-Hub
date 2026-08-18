/**
 * Week 4 directed independent study.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week4DirectedStudy = Object.freeze({
    resourceId: 'week4-directed-study',
    scored: false,
    title: 'Directed independent study',
    cisco: Object.freeze({
      platform: 'Cisco Networking Academy',
      course: 'Introduction to Cybersecurity',
      accessNote:
        'Use the Cisco access route already provided by your tutor or college classroom link. Direct public URLs are not hard-coded here.',
      topics: Object.freeze([
        Object.freeze({
          id: '1.5',
          label: 'Module 1, topic 1.5 Cyberwarfare'
        }),
        Object.freeze({
          id: '2.4',
          label: 'Module 2, topic 2.4 The Cybersecurity Landscape'
        })
      ]),
      tasks: Object.freeze([
        'Complete both topics, including the quizzes.',
        'Note how state motivation differs from criminal motivation.',
        'Keep short revision notes for Week 5 retrieval.'
      ])
    }),
    tryhackmeRoomId: 'googledorking',
    tryhackmeTasks: Object.freeze([
      'Complete the Google Dorking room in the authorised TryHackMe environment.',
      'Record three search techniques that could reveal information an organisation did not intend to publish.',
      'Record techniques and principles rather than collecting sensitive findings.'
    ]),
    safety: Object.freeze([
      'Authorised learning environments only.',
      'No probing or interaction with unauthorised targets.',
      'Do not search for personal data, passwords, secrets or authentication material.',
      'Use tutor-approved examples.',
      'Record techniques and principles rather than collecting sensitive findings.'
    ]),
    writtenAnalysis: Object.freeze({
      title: 'Written analysis (approximately 400 words)',
      instructions: Object.freeze([
        'Select a cyber attack reported in the last two years.',
        'Write approximately 400 words.',
        'Identify the attacker.',
        'Identify the motivation.',
        'Identify the target.',
        'Identify the methods used.',
        'Explain how the four connect.',
        'Reference the sources used.'
      ]),
      planningFields: Object.freeze([
        'Incident title and approximate date',
        'Attacker (as reported)',
        'Motivation (why)',
        'Target (what)',
        'Methods (how)',
        'Connection explanation (how the four link)',
        'Source 1',
        'Source 2',
        'Limitations of the sources'
      ]),
      checklist: Object.freeze([
        'Motivation is not answered with a method',
        'Target category language is used where appropriate',
        'Connection is explicit',
        'One case is sustained',
        'Sources are referenced'
      ]),
      submissionNote:
        'The approximately 400-word analysis is collected in Week 5 and used as retrieval material. This page stores local planning notes only and does not auto-mark factual claims about the chosen incident.'
    }),
    evidenceRequirements: Object.freeze([
      'Cisco topic completion and quiz completion are visible on the instructor dashboard.',
      'TryHackMe room completion is visible on the classroom dashboard.',
      'The approximately 400-word analysis is collected in Week 5 and used as retrieval material.'
    ])
  });
})(window);
