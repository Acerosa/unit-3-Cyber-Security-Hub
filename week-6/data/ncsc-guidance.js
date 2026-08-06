/**
 * Week 6 NCSC Exercise in a Box classroom guidance.
 */
(function (global) {
  'use strict';

  global.Week6NcscGuidance = Object.freeze({
    activityId: 'week6-ncsc-guidance',
    activityName: 'NCSC Exercise in a Box Guidance',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 1,
    total: 4,
    estimatedMinutes: 15,
    organisation: 'Northbank Community Health Partnership',
    exerciseTitle: 'Insider threat resulting in a data breach',
    ncscOverviewUrl: 'https://www.ncsc.gov.uk/section/exercise-in-a-box/overview',
    intro:
      'This page is a tutor-facilitated classroom companion only. Follow your tutor and the official NCSC Exercise in a Box materials. Do not invent staged exercise prompts here.',
    completionNote:
      'Opening the NCSC website does not automatically complete this activity. Completion requires working through the facilitated exercise with your tutor and recording decisions in the companion decision record.',
    checklist: Object.freeze([
      Object.freeze({
        id: 'role',
        label: 'I am acting as a Northbank stakeholder role assigned by my tutor during the exercise.'
      }),
      Object.freeze({
        id: 'briefing',
        label: 'I used the tutor briefing and official NCSC materials rather than invented prompts.'
      }),
      Object.freeze({
        id: 'containment',
        label: 'I considered containment steps and who must be informed during the insider threat data breach scenario.'
      }),
      Object.freeze({
        id: 'dimensions',
        label: 'I separated legal obligations, ethical choices and operational practicality when discussing responses.'
      })
    ]),
    guidanceSections: Object.freeze([
      Object.freeze({
        title: 'Act as Northbank',
        text: 'Use the Northbank Community Health Partnership context. Patient trust and continuity of care should inform decisions.'
      }),
      Object.freeze({
        title: 'Use the briefing',
        text: 'Your tutor will provide the exercise briefing. Record only what was discussed in class, not invented incident timelines.'
      }),
      Object.freeze({
        title: 'Containment and notification',
        text: 'Consider how Northbank would contain an insider data breach, which roles decide next steps and which stakeholders may need informing under current United Kingdom data protection legislation.'
      }),
      Object.freeze({
        title: 'Legal versus ethical',
        text: 'Some actions may be legally required, others ethically desirable but not mandatory, and others operationally difficult. Keep these dimensions separate in discussion.'
      }),
      Object.freeze({
        title: 'Record the basis',
        text: 'After the exercise, capture decisions, reasons and evidence still needed in the Exercise Decision Record activity.'
      })
    ])
  });
})(window);
