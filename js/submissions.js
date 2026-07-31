/**
 * Planned shared submission helpers for formative activities.
 *
 * Current state:
 * - Incident Classification posts its own payload from
 *   week-1/incident-classification/app.js
 * - Field names and the Google Apps Script collector URL must not be
 *   generalised or changed from this file during the hub foundation work
 *
 * Future activities may call small helpers from this module once a second
 * collector schema is agreed. Until then, keep this file lightly implemented.
 */

window.Unit3Submissions = window.Unit3Submissions || {
  /**
   * Placeholder for a future shared submit helper.
   * Do not route the Incident Classification collector through this yet.
   */
  note: 'Use activity-local submission until additional activities share a schema.'
};
