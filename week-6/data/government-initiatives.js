/**
 * Week 6 government cyber security initiatives learning.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week6GovernmentInitiatives = Object.freeze({
    activityId: 'week6-government-initiatives',
    activityName: 'Government Cyber Security Initiatives',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 1,
    total: 4,
    estimatedMinutes: 20,
    teachingNote:
      'These initiatives are United Kingdom government guidance or programmes. Describe their purpose in examination answers. Do not invent unsupported claims about current certification status or funding.',
    initiatives: Object.freeze([
      Object.freeze({
        id: 'strategy',
        name: 'United Kingdom Cyber Security Strategy',
        purpose:
          'Sets national direction for improving cyber resilience across government, industry and society, prioritising threats and coordinated response.'
      }),
      Object.freeze({
        id: 'essentials',
        name: 'Cyber Essentials Scheme',
        purpose:
          'Provides a baseline set of technical controls and a certification route to help organisations reduce common internet-facing risks.'
      }),
      Object.freeze({
        id: 'tenSteps',
        name: '10 Steps to Cyber Security',
        purpose:
          'Offers board-level and organisational guidance on essential security areas such as risk management, asset protection and incident response planning.'
      }),
      Object.freeze({
        id: 'streetwise',
        name: 'Cyber Streetwise',
        purpose:
          'A public awareness campaign helping individuals and small organisations adopt safer everyday online habits.'
      })
    ]),
    comparisonQuiz: Object.freeze([
      Object.freeze({
        id: 'gi1',
        prompt: 'Which initiative is mainly aimed at baseline organisational controls and certification?',
        options: Object.freeze([
          'Cyber Essentials Scheme',
          'Cyber Streetwise',
          'Police and Justice Act 2006 amendments',
          'Computer Misuse Act 1990'
        ]),
        correctIndex: 0,
        explanation:
          'Cyber Essentials Scheme focuses on baseline controls and certification. It is not criminal legislation.'
      }),
      Object.freeze({
        id: 'gi2',
        prompt: 'Which initiative sets broad national direction rather than day-to-day staff habits alone?',
        options: Object.freeze([
          'United Kingdom Cyber Security Strategy',
          'Cyber Streetwise only',
          'Responsible disclosure',
          'Rules of engagement'
        ]),
        correctIndex: 0,
        explanation:
          'The national strategy sets direction across society. Cyber Streetwise targets public awareness at a smaller scale.'
      }),
      Object.freeze({
        id: 'gi3',
        prompt: '10 Steps to Cyber Security is best described as:',
        options: Object.freeze([
          'Organisational guidance for leaders on essential security areas',
          'A statute creating hacking offences',
          'A Northbank patient record system',
          'Mandatory hardware key standard'
        ]),
        correctIndex: 0,
        explanation:
          '10 Steps to Cyber Security is guidance for organisations, not a statute.'
      }),
      Object.freeze({
        id: 'gi4',
        prompt: 'Cyber Streetwise primarily supports:',
        options: Object.freeze([
          'Public and small organisation awareness of safer online behaviour',
          'Prosecution of computer misuse offences',
          'Penetration testing scope documents',
          'Insider decision recording during NCSC exercises'
        ]),
        correctIndex: 0,
        explanation:
          'Cyber Streetwise is an awareness campaign for everyday safer behaviour.'
      })
    ])
  });
})(window);
