/**
 * Week 6 LO2 revision organiser across sections 2.1 to 2.6.
 */
(function (global) {
  'use strict';

  global.Week6RevisionOrganiser = Object.freeze({
    activityId: 'week6-revision-organiser',
    activityName: 'LO2 Revision Organiser',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 2,
    total: 6,
    estimatedMinutes: 30,
    diagnosticDraftKey: 'lo2-diagnostic',
    sections: Object.freeze([
      Object.freeze({
        id: '2-1',
        code: '2.1',
        title: 'Threats',
        fields: Object.freeze([
          Object.freeze({ id: 'secure', label: 'Topics I am secure on', minLength: 15 }),
          Object.freeze({ id: 'revision', label: 'Topics needing revision', minLength: 15 }),
          Object.freeze({ id: 'terminology', label: 'Key terminology', minLength: 10 }),
          Object.freeze({ id: 'misconception', label: 'One misconception to fix', minLength: 10 }),
          Object.freeze({ id: 'example', label: 'One Northbank or healthcare example', minLength: 15 }),
          Object.freeze({
            id: 'practiceQuestion',
            label: 'One OCR-style practice question I could answer',
            minLength: 15
          })
        ])
      }),
      Object.freeze({
        id: '2-2',
        code: '2.2',
        title: 'Vulnerabilities and types of attackers',
        fields: Object.freeze([
          Object.freeze({ id: 'secure', label: 'Topics I am secure on', minLength: 15 }),
          Object.freeze({ id: 'revision', label: 'Topics needing revision', minLength: 15 }),
          Object.freeze({ id: 'terminology', label: 'Key terminology', minLength: 10 }),
          Object.freeze({ id: 'misconception', label: 'One misconception to fix', minLength: 10 }),
          Object.freeze({ id: 'example', label: 'One Northbank or healthcare example', minLength: 15 }),
          Object.freeze({
            id: 'practiceQuestion',
            label: 'One OCR-style practice question I could answer',
            minLength: 15
          })
        ])
      }),
      Object.freeze({
        id: '2-3',
        code: '2.3',
        title: 'Motivations',
        fields: Object.freeze([
          Object.freeze({ id: 'secure', label: 'Topics I am secure on', minLength: 15 }),
          Object.freeze({ id: 'revision', label: 'Topics needing revision', minLength: 15 }),
          Object.freeze({ id: 'terminology', label: 'Key terminology', minLength: 10 }),
          Object.freeze({ id: 'misconception', label: 'One misconception to fix', minLength: 10 }),
          Object.freeze({ id: 'example', label: 'One Northbank or healthcare example', minLength: 15 }),
          Object.freeze({
            id: 'practiceQuestion',
            label: 'One OCR-style practice question I could answer',
            minLength: 15
          })
        ])
      }),
      Object.freeze({
        id: '2-4',
        code: '2.4',
        title: 'Targets',
        fields: Object.freeze([
          Object.freeze({ id: 'secure', label: 'Topics I am secure on', minLength: 15 }),
          Object.freeze({ id: 'revision', label: 'Topics needing revision', minLength: 15 }),
          Object.freeze({ id: 'terminology', label: 'Key terminology', minLength: 10 }),
          Object.freeze({ id: 'misconception', label: 'One misconception to fix', minLength: 10 }),
          Object.freeze({ id: 'example', label: 'One Northbank or healthcare example', minLength: 15 }),
          Object.freeze({
            id: 'practiceQuestion',
            label: 'One OCR-style practice question I could answer',
            minLength: 15
          })
        ])
      }),
      Object.freeze({
        id: '2-5',
        code: '2.5',
        title: 'Impacts',
        fields: Object.freeze([
          Object.freeze({ id: 'secure', label: 'Topics I am secure on', minLength: 15 }),
          Object.freeze({ id: 'revision', label: 'Topics needing revision', minLength: 15 }),
          Object.freeze({ id: 'terminology', label: 'Key terminology', minLength: 10 }),
          Object.freeze({ id: 'misconception', label: 'One misconception to fix', minLength: 10 }),
          Object.freeze({ id: 'example', label: 'One Northbank or healthcare example', minLength: 15 }),
          Object.freeze({
            id: 'practiceQuestion',
            label: 'One OCR-style practice question I could answer',
            minLength: 15
          })
        ])
      }),
      Object.freeze({
        id: '2-6',
        code: '2.6',
        title: 'Other considerations (ethical, legal, operational, government initiatives)',
        fields: Object.freeze([
          Object.freeze({ id: 'secure', label: 'Topics I am secure on', minLength: 15 }),
          Object.freeze({ id: 'revision', label: 'Topics needing revision', minLength: 15 }),
          Object.freeze({ id: 'terminology', label: 'Key terminology', minLength: 10 }),
          Object.freeze({ id: 'misconception', label: 'One misconception to fix', minLength: 10 }),
          Object.freeze({ id: 'example', label: 'One Northbank or healthcare example', minLength: 15 }),
          Object.freeze({
            id: 'practiceQuestion',
            label: 'One OCR-style practice question I could answer',
            minLength: 15
          })
        ])
      })
    ]),
    weakestFields: Object.freeze([
      Object.freeze({
        id: 'weakest1',
        label: 'Weakest LO2 topic 1 (from diagnostic if available)',
        minLength: 5
      }),
      Object.freeze({
        id: 'weakest2',
        label: 'Weakest LO2 topic 2 (from diagnostic if available)',
        minLength: 5
      })
    ]),
    priorityFields: Object.freeze([
      Object.freeze({
        id: 'priority1',
        label: 'Revision priority 1 for the next study session',
        minLength: 15
      }),
      Object.freeze({
        id: 'priority2',
        label: 'Revision priority 2 for the next study session',
        minLength: 15
      })
    ])
  });
})(window);
