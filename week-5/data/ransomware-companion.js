/**
 * Week 5 NCSC Exercise in a Box companion — roles and decision record.
 * Does not reproduce or invent staged NCSC exercise prompts.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week5RansomwareCompanion = Object.freeze({
    activityId: 'week5-ransomware-companion',
    activityName: 'Northbank Ransomware Exercise Companion',
    activityVersion: '1.0',
    weekNumber: 5,
    sessionNumber: 1,
    total: 4,
    estimatedMinutes: 40,
    ncsc: Object.freeze({
      producer: 'National Cyber Security Centre (NCSC)',
      productName: 'Exercise in a Box',
      purpose:
        'Exercise in a Box is designed for organisations to test their readiness through structured discussion exercises.',
      namedExercise: 'Responding to a ransomware attack',
      overviewUrl: 'https://www.ncsc.gov.uk/section/exercise-in-a-box/overview',
      exerciseUrl:
        'https://www.ncsc.gov.uk/section/exercise-in-a-box/responding-ransomware-attack',
      classroomRules: Object.freeze([
        'The class will role-play Northbank Community Health Partnership.',
        'Answer from your allocated organisational role, not from personal opinion alone.',
        'Base decisions on the Northbank briefing and established posture.',
        'Do not invent controls, staff, systems or capabilities that are not present in the briefing.',
        'Staged exercise prompts remain on the official NCSC materials and are tutor-facilitated.',
        'This hub is a companion workspace before, during and after the facilitated exercise — it does not replace the NCSC exercise content.'
      ])
    }),
    roles: Object.freeze([
      Object.freeze({
        id: 'practice-manager',
        title: 'Practice manager',
        responsibility:
          'Overall service continuity and prioritisation for Northbank Community Health Partnership, including decisions that affect clinics, patients and staff working arrangements.',
        decisionPrompt:
          'State one decision this role may be responsible for during a ransomware incident (do not invent systems or staff that are not in the Northbank briefing).',
        prompts: Object.freeze([
          'Which patient-facing services must be prioritised if systems stay down?',
          'Who needs clear instruction first: reception, clinicians or partners?',
          'Which impact are you trying to reduce for patients and for the organisation?'
        ])
      }),
      Object.freeze({
        id: 'it-support',
        title: 'IT support contractor',
        responsibility:
          'Technical containment and recovery advice for Northbank systems within the capabilities described in the briefing — without inventing advanced tooling that is not present.',
        decisionPrompt:
          'State one decision this role may be responsible for during a ransomware incident, staying within briefing capabilities.',
        prompts: Object.freeze([
          'What must be protected first: data integrity, remaining available systems, or recovery paths?',
          'What information do other roles need from you before they decide?',
          'Which loss or disruption impacts could worsen if systems are brought back too quickly?'
        ])
      }),
      Object.freeze({
        id: 'records-officer',
        title: 'Records officer',
        responsibility:
          'Care and confidentiality of patient and organisational records, including what can still be accessed, shared or trusted during the incident.',
        decisionPrompt:
          'State one decision this role may be responsible for during a ransomware incident relating to records or information trust.',
        prompts: Object.freeze([
          'Which records are needed for safe care today?',
          'How do you prevent further loss of confidentiality while services continue manually?',
          'What evidence would show integrity problems in records?'
        ])
      }),
      Object.freeze({
        id: 'communications-lead',
        title: 'Communications lead',
        responsibility:
          'Internal and external messaging for Northbank so patients, staff and partners receive accurate information without inventing capabilities or making unsupported promises.',
        decisionPrompt:
          'State one decision this role may be responsible for during a ransomware incident about what is communicated and to whom.',
        prompts: Object.freeze([
          'Which stakeholders need information first?',
          'How do you reduce reputational loss without claiming facts you do not have?',
          'What message would protect patient safety without creating panic?'
        ])
      })
    ]),
    decisionRecord: Object.freeze({
      intro:
        'Use this record during the tutor-facilitated exercise. There is no single correct answer bank here — record reasoned group decisions. Do not invent NCSC prompts.',
      fields: Object.freeze([
        Object.freeze({ id: 'decision', label: 'Decision made', rows: 3 }),
        Object.freeze({ id: 'reason', label: 'Reason for the decision', rows: 3 }),
        Object.freeze({
          id: 'stakeholder',
          label: 'Stakeholder or service being protected',
          rows: 2
        }),
        Object.freeze({
          id: 'impactReduced',
          label: 'Impact the decision is intended to reduce',
          rows: 2
        }),
        Object.freeze({
          id: 'impactCategory',
          label: 'Impact category (loss, disruption, safety, or justified combination)',
          rows: 2
        })
      ]),
      minDecisions: 2,
      completionNote:
        'Opening the NCSC page alone does not complete this activity. Completion requires role preparation and at least two reasoned decision records, plus confirmation that the facilitated exercise discussion was used.'
    }),
    impactOptions: Object.freeze([
      'Loss',
      'Disruption',
      'Safety',
      'Loss and disruption',
      'Disruption and safety',
      'Loss and safety',
      'Loss, disruption and safety'
    ])
  });
})(window);
