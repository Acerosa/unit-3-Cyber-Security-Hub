/**
 * Week 7 Northbank risk register (10 marks) - critical activity data.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week7RiskRegister = Object.freeze({
    activityId: 'week7-northbank-risk-register',
    activityName: 'Northbank Risk Register',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 1,
    total: 10,
    estimatedMinutes: 45,
    organisation: 'Northbank Community Health Partnership',
    entryCount: 5,
    intro:
      'Convert Week 2 vulnerabilities into a Week 7 risk register. Score likelihood and impact with the hub guide, then justify Mitigate, Accept or Prioritise later decisions with cost-benefit and effectiveness thinking.',
    week2UnavailableNote:
      'No Week 2 vulnerability register was found in this browser. Enter five assets and related fields yourself. Do not invent previous learner answers from another device.',
    decisions: Object.freeze(['Mitigate', 'Accept', 'Prioritise later']),
    levels: Object.freeze(['Low', 'Medium', 'High']),
    scoringGuide: Object.freeze({
      title: 'Week 7 hub scoring guide',
      likelihood: Object.freeze({
        Low: 'Unlikely in normal Northbank operations in the near term.',
        Medium: 'Plausible given current practices, tooling or staff behaviour.',
        High: 'Likely without further control, or already nearly occurring.'
      }),
      impact: Object.freeze({
        Low: 'Limited disruption; little or no effect on patient care or confidential data.',
        Medium: 'Noticeable disruption, partial data exposure risk, or recovery effort required.',
        High: 'Serious harm to care continuity, confidentiality, regulatory standing or trust.'
      }),
      matrix: Object.freeze([
        Object.freeze({ likelihood: 'Low', impact: 'Low', risk: 'Low', numeric: '1' }),
        Object.freeze({ likelihood: 'Low', impact: 'Medium', risk: 'Low', numeric: '2' }),
        Object.freeze({ likelihood: 'Low', impact: 'High', risk: 'Medium', numeric: '3' }),
        Object.freeze({ likelihood: 'Medium', impact: 'Low', risk: 'Low', numeric: '2' }),
        Object.freeze({ likelihood: 'Medium', impact: 'Medium', risk: 'Medium', numeric: '4' }),
        Object.freeze({ likelihood: 'Medium', impact: 'High', risk: 'High', numeric: '6' }),
        Object.freeze({ likelihood: 'High', impact: 'Low', risk: 'Medium', numeric: '3' }),
        Object.freeze({ likelihood: 'High', impact: 'Medium', risk: 'High', numeric: '6' }),
        Object.freeze({ likelihood: 'High', impact: 'High', risk: 'High', numeric: '9' })
      ]),
      note:
        'Risk ratings use text labels (Low, Medium, High). Colour is optional and never the only indicator. Numeric helpers are for discussion only.'
    }),
    sampleRows: Object.freeze([
      Object.freeze({
        asset: 'Patient appointment system',
        threat: 'Credential-theft phishing against reception and clinical staff',
        vulnerability: 'Single-factor passwords with limited monitoring of unusual logins',
        likelihood: 'High',
        impact: 'High',
        riskScore: 'High',
        mitigation: 'Require multi-factor authentication for remote and privileged access',
        costConsequence: 'Staff setup time and occasional login friction during busy clinics',
        expectedBenefit: 'Fewer successful account takeovers affecting bookings and records access',
        decision: 'Mitigate',
        effectivenessMeasure:
          'Track successful phishing-driven password resets and MFA challenge failures over 90 days',
        justification:
          'High likelihood and High impact on care coordination justify mitigation before lower-rated risks.'
      }),
      Object.freeze({
        asset: 'Public health leaflet PDF on website',
        threat: 'Temporary broken link during a routine content update',
        vulnerability: 'Single-step publish process without a staging check',
        likelihood: 'Low',
        impact: 'Low',
        riskScore: 'Low',
        mitigation: 'Optional dual-person publish check (not funded this quarter)',
        costConsequence: 'Extra staff time on every leaflet update for low care impact',
        expectedBenefit: 'Slightly fewer public information delays',
        decision: 'Accept',
        effectivenessMeasure:
          'Quarterly review of public content downtime minutes; escalate if care advice pages are affected',
        justification:
          'Low impact on patient care; further control cost is disproportionate for Northbank’s size.'
      })
    ]),
    sentenceStarters: Object.freeze([
      'This asset matters because…',
      'The threat could… while the vulnerability is…',
      'Likelihood is… because…',
      'Impact is… because patient care / data…',
      'I choose Mitigate / Accept / Prioritise later because…',
      'Cost is acceptable / disproportionate because…',
      'I will judge effectiveness by measuring…'
    ]),
    addressFirstPrompt:
      'Which risk will you address first, and why? Link likelihood, impact and organisational context.',
    fields: Object.freeze([
      Object.freeze({ id: 'asset', label: 'Asset', rows: 1, required: true }),
      Object.freeze({ id: 'threat', label: 'Threat', rows: 2, required: true }),
      Object.freeze({ id: 'vulnerability', label: 'Vulnerability', rows: 2, required: true }),
      Object.freeze({ id: 'likelihood', label: 'Likelihood (Low / Medium / High)', type: 'select', required: true }),
      Object.freeze({ id: 'impact', label: 'Impact (Low / Medium / High)', type: 'select', required: true }),
      Object.freeze({ id: 'riskScore', label: 'Risk rating (auto from guide, editable)', type: 'select', required: true }),
      Object.freeze({ id: 'mitigation', label: 'Mitigation or treatment idea', rows: 2, required: true }),
      Object.freeze({ id: 'costConsequence', label: 'Cost or consequence of treatment / of accepting', rows: 2, required: true }),
      Object.freeze({ id: 'expectedBenefit', label: 'Expected benefit', rows: 2, required: true }),
      Object.freeze({ id: 'decision', label: 'Decision', type: 'decision', required: true }),
      Object.freeze({ id: 'effectivenessMeasure', label: 'Effectiveness measure', rows: 2, required: true }),
      Object.freeze({ id: 'justification', label: 'Justification', rows: 3, required: true })
    ]),
    validationMessages: Object.freeze({
      asset: 'Each entry needs a named asset.',
      threatVuln:
        'Threat and vulnerability text should not be identical. Keep the cause of harm separate from the weakness.',
      allHigh:
        'Warning: every entry is rated High. Check whether some risks are genuinely lower so prioritisation remains meaningful.',
      mitigationRelate: 'Mitigation should clearly relate to the named vulnerability or threat.',
      decisionReason: 'Each decision needs a justification.',
      effectivenessInstalled:
        'Effectiveness should not be only “installed”. Say what you will measure.',
      costMitigate: 'Mitigate decisions need a cost or consequence note.',
      addressFirst: 'Select which risk to address first and justify it.',
      acceptNeeded: 'Include at least one Accept decision with justification.',
      costBenefitOne: 'Complete cost and expected benefit for at least one mitigation.',
      effectivenessOne: 'Provide a measurable effectiveness statement for at least one entry.'
    })
  });
})(window);
