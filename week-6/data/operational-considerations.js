/**
 * Week 6 operational considerations activity.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week6OperationalConsiderations = Object.freeze({
    activityId: 'week6-operational-considerations',
    activityName: 'Operational Considerations',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 1,
    total: 7,
    estimatedMinutes: 30,
    intro:
      'Operational considerations ask whether a security control is practical to run day to day. A control that is legally allowed and ethically desirable may still fail if staff cannot use it effectively.',
    factors: Object.freeze([
      Object.freeze({
        id: 'financial',
        label: 'Financial cost',
        description: 'Direct spending on licences, hardware, consultants and ongoing subscriptions.'
      }),
      Object.freeze({
        id: 'staffTime',
        label: 'Staff time',
        description: 'Hours spent configuring, monitoring, approving access and responding to alerts.'
      }),
      Object.freeze({
        id: 'downtime',
        label: 'System downtime',
        description: 'Planned or unplanned outages while patching, testing or recovering systems.'
      }),
      Object.freeze({
        id: 'usability',
        label: 'Usability',
        description: 'Whether staff can follow the control without excessive friction or confusion.'
      }),
      Object.freeze({
        id: 'productivity',
        label: 'Lost productivity',
        description: 'Work slowed or deferred because security steps add delay or complexity.'
      })
    ]),
    measurePrompt:
      'Northbank is considering mandatory hardware security keys for all remote access to patient systems after an insider threat exercise.',
    formFields: Object.freeze([
      Object.freeze({
        id: 'measure',
        label: 'Security measure being considered',
        required: true,
        rows: 2
      }),
      Object.freeze({
        id: 'financial',
        label: 'Financial cost: what would Northbank pay or save?',
        required: true,
        rows: 2
      }),
      Object.freeze({
        id: 'staffTime',
        label: 'Staff time: who spends time and on what?',
        required: true,
        rows: 2
      }),
      Object.freeze({
        id: 'downtime',
        label: 'System downtime: when might services be unavailable?',
        required: true,
        rows: 2
      }),
      Object.freeze({
        id: 'usability',
        label: 'Usability: how easy is the control for clinic and remote staff?',
        required: true,
        rows: 2
      }),
      Object.freeze({
        id: 'productivity',
        label: 'Lost productivity: where might work slow down?',
        required: true,
        rows: 2
      }),
      Object.freeze({
        id: 'workaround',
        label: 'Which operational cost most encourages unsafe workarounds?',
        required: true,
        rows: 2
      }),
      Object.freeze({
        id: 'proportionate',
        label: 'Is the measure proportionate for Northbank? Justify briefly.',
        required: true,
        rows: 3
      })
    ])
  });
})(window);
