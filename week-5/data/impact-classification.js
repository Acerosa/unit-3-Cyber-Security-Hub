/**
 * Week 5 loss / disruption / safety classification activity.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week5ImpactClassification = Object.freeze({
    activityId: 'week5-impact-classification',
    activityName: 'Loss, Disruption and Safety Classification',
    activityVersion: '1.0',
    weekNumber: 5,
    sessionNumber: 1,
    total: 8,
    estimatedMinutes: 25,
    categories: Object.freeze(['Loss', 'Disruption', 'Safety', 'More than one category']),
    instructions: Object.freeze([
      'Classify each short impact statement.',
      'Choose More than one category where a justified combination fits.',
      'For ambiguous examples, write a short reason naming the stakeholder perspective you used.',
      'Categories are not always mutually exclusive.'
    ]),
    checklist: Object.freeze([
      'Have I considered loss?',
      'Have I considered disruption?',
      'Have I considered safety?',
      'Have I named whose perspective I am using?'
    ]),
    items: Object.freeze([
      Object.freeze({
        id: 'c1',
        statement:
          'Northbank pays emergency contractor fees to rebuild encrypted servers.',
        accepted: Object.freeze(['Loss']),
        ambiguous: false,
        feedback:
          'Direct extra spending is financial loss. It does not, by itself, describe a stopped service or physical risk.'
      }),
      Object.freeze({
        id: 'c2',
        statement:
          'Clinic booking services are unavailable for two working days, so reception cannot confirm visits.',
        accepted: Object.freeze(['Disruption', 'More than one category']),
        ambiguous: true,
        reasonRequired: true,
        feedback:
          'This is clearly disruption of a depended-on service. Some learners may also argue loss of availability; if you chose more than one category, your reason should identify the service and who depended on it.'
      }),
      Object.freeze({
        id: 'c3',
        statement:
          'A patient’s urgent review is cancelled because Northbank cannot access records; the delay increases clinical risk for that patient.',
        accepted: Object.freeze(['Safety', 'More than one category']),
        ambiguous: true,
        reasonRequired: true,
        feedback:
          'Physical or clinical risk to the patient is a safety impact. It may also be disruption for the organisation. More than one category is defensible when both perspectives are explained.'
      }),
      Object.freeze({
        id: 'c4',
        statement:
          'Stolen patient identity details are later used to open fraudulent accounts.',
        accepted: Object.freeze(['Loss']),
        ambiguous: false,
        feedback:
          'Identity theft is a loss impact for the individual. Focus on what the person lost or had misused.'
      }),
      Object.freeze({
        id: 'c5',
        statement:
          'Local news coverage leaves patients unsure whether Northbank can be trusted with medical information for months afterwards.',
        accepted: Object.freeze(['Loss']),
        ambiguous: false,
        feedback:
          'This is reputational loss / loss of customer confidence. It may be hard to quantify but remains an important longer-term loss impact.'
      }),
      Object.freeze({
        id: 'c6',
        statement:
          'Interference with a traffic-control system causes unpredictable signal behaviour on major routes used by ambulances.',
        accepted: Object.freeze(['Disruption', 'Safety', 'More than one category']),
        ambiguous: true,
        reasonRequired: true,
        feedback:
          'The service becomes unreliable (disruption) and people may be placed at physical risk (safety). More than one category is often the strongest justified choice.'
      }),
      Object.freeze({
        id: 'c7',
        statement:
          'A healthcare appointment is cancelled after systems fail.',
        accepted: Object.freeze(['Disruption', 'Safety', 'More than one category']),
        ambiguous: true,
        reasonRequired: true,
        teachingFocus: true,
        feedback:
          'Weekly-plan example: cancellation may be disruption for the healthcare organisation and may also create a safety impact for the patient. The defensible answer depends on the stakeholder considered — explain your reasoning.'
      }),
      Object.freeze({
        id: 'c8',
        statement:
          'An oil installation’s control systems are taken offline and normal operations stop.',
        accepted: Object.freeze(['Disruption', 'More than one category']),
        ambiguous: true,
        reasonRequired: true,
        feedback:
          'Stopped operations are disruption. Safety may also be argued if the scenario evidence shows people placed at physical risk; do not invent hazards that are not stated.'
      })
    ])
  });
})(window);
