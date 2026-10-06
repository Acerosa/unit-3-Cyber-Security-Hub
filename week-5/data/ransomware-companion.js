/**
 * Week 5 spot-the-impact scenarios.
 * Learner pages use the catalogue package. This object stays for registry checks.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week5RansomwareCompanion = Object.freeze({
    activityId: 'week5-ransomware-companion',
    activityName: 'Spot the impact',
    activityVersion: '1.0',
    weekNumber: 5,
    sessionNumber: 1,
    total: 4,
    estimatedMinutes: 25,
    scenarios: Object.freeze([
      Object.freeze({
        id: 'college',
        text:
          "A college's student records system is encrypted by ransomware on Monday morning. Staff cannot access timetables, attendance records or student contact details for two days."
      }),
      Object.freeze({
        id: 'retailer',
        text:
          'Notes from an online retailer breach, recorded out of time order: customers posted complaints and the company brought in external specialists; customer names, addresses and payment information were stolen; customers became less willing to trust the retailer with payment details; the website was taken offline while the company investigated.'
      })
    ]),
    categories: Object.freeze(['Loss', 'Disruption', 'Safety', 'Not supported by the scenario'])
  });
})(window);
