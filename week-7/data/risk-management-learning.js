/**
 * Week 7 cyber security risk management guided learning (8 marks).
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week7RiskManagementLearning = Object.freeze({
    activityId: 'week7-risk-management-learning',
    activityName: 'Cyber Security Risk Management Learning',
    activityVersion: '1.0',
    weekNumber: 7,
    sessionNumber: 1,
    total: 8,
    estimatedMinutes: 30,
    teachingNote:
      'Work through the risk-management stages in order. Treatments used in this unit are Mitigate, Accept (when cost is disproportionate) and Prioritise. Transfer and Avoid may appear as distractors in quizzes but are not required treatment options for the Northbank register.',
    stages: Object.freeze([
      Object.freeze({
        id: 'identify-assets',
        title: 'Identify assets',
        summary:
          'List what matters to the organisation: systems, data, people, premises and services that support care.',
        northbankExample:
          'Northbank identifies the patient appointment system, staff laptops, the shared clinical notes store and the public website as assets that support day-to-day care.',
        teachingPoint:
          'Without a clear asset list, later likelihood and impact judgements have no organisational anchor.'
      }),
      Object.freeze({
        id: 'identify-threats-vulns',
        title: 'Identify threats and vulnerabilities',
        summary:
          'For each asset, name plausible threats and the weaknesses that could be exploited. Keep the terms separate.',
        northbankExample:
          'Threat: phishing that steals staff credentials. Vulnerability: weak or reused passwords on the appointment system. Do not label phishing itself as the vulnerability.',
        teachingPoint:
          'Threat is the potential cause of harm; vulnerability is the weakness. Mixing them confuses the register.'
      }),
      Object.freeze({
        id: 'analyse-likelihood',
        title: 'Analyse likelihood',
        summary:
          'Judge how likely it is that a threat will successfully exploit the vulnerability in this organisation.',
        northbankExample:
          'If many staff reuse passwords and phishing emails are common, likelihood of credential theft against the appointment system may be High.',
        teachingPoint:
          'Likelihood is contextual. A theoretical attack that is hard to deliver may still be Low likelihood for Northbank.'
      }),
      Object.freeze({
        id: 'analyse-impact',
        title: 'Analyse impact',
        summary:
          'Judge the harm if the risk materialises: care disruption, confidentiality loss, financial cost, reputation and regulatory consequences.',
        northbankExample:
          'Unauthorised access to clinical notes could have High impact because patient confidentiality and care continuity are affected.',
        teachingPoint:
          'Impact is about consequence, not how impressive the attack sounds.'
      }),
      Object.freeze({
        id: 'determine-risk',
        title: 'Determine risk level or score',
        summary:
          'Combine likelihood and impact using the Week 7 hub scoring guide to produce a Low, Medium or High risk rating.',
        northbankExample:
          'High likelihood and High impact for stolen appointment-system credentials produces a High risk rating that should be addressed early.',
        teachingPoint:
          'The score supports prioritisation. It is not a substitute for a justified decision.'
      }),
      Object.freeze({
        id: 'decide-treatment',
        title: 'Decide treatment',
        summary:
          'Choose Mitigate, Accept or Prioritise later. Accept is valid when the cost of control is disproportionate to the risk.',
        northbankExample:
          'Northbank may Accept a Low-impact risk that the public leaflet PDF is briefly unavailable during a content update, because care systems are unaffected and mitigation spend would be disproportionate.',
        teachingPoint:
          'Accept is a reasoned decision, not ignoring the risk. Mitigate means reducing likelihood or impact. Prioritise later means the risk is recognised but other risks come first.'
      }),
      Object.freeze({
        id: 'cost-benefit',
        title: 'Consider cost and benefit',
        summary:
          'Compare the cost or consequence of a control with the expected benefit in risk reduction for an organisation of Northbank’s size.',
        northbankExample:
          'Mandatory multi-factor authentication for remote access to clinical systems has a staff-training cost but a clear benefit: fewer successful credential-theft incidents.',
        teachingPoint:
          'A perfect control that Northbank cannot afford or staff cannot use is a weak recommendation.'
      }),
      Object.freeze({
        id: 'review-effectiveness',
        title: 'Review effectiveness measure',
        summary:
          'State how you will know the treatment worked. Avoid empty claims such as “installed” with no evidence of reduced risk.',
        northbankExample:
          'Effectiveness for MFA might be measured by a fall in successful password-reset phishing incidents and successful login attempts without a second factor over three months.',
        teachingPoint:
          'Effectiveness should be observable. “We installed the tool” alone does not show risk reduction.'
      })
    ]),
    treatments: Object.freeze([
      Object.freeze({
        id: 'mitigate',
        name: 'Mitigate',
        meaning: 'Reduce likelihood and/or impact with a proportionate control.'
      }),
      Object.freeze({
        id: 'accept',
        name: 'Accept',
        meaning:
          'Consciously accept the risk when the cost of further control is disproportionate, usually for lower-rated risks.'
      }),
      Object.freeze({
        id: 'prioritise',
        name: 'Prioritise later',
        meaning:
          'Recognise the risk but schedule treatment after higher-priority risks, with a reason recorded.'
      })
    ]),
    acceptWorkedExample: Object.freeze({
      title: 'Worked accept example (Low impact)',
      text:
        'Asset: public health leaflet PDF on the website. Threat: temporary link breakage during a routine content update. Vulnerability: single file publish process without a staging check. Likelihood: Low to Medium. Impact: Low (public information delayed; no patient records affected). Decision: Accept. Justification: the care impact is minimal and paying for a complex publishing platform would be disproportionate for Northbank’s size.'
    }),
    knowledgeCheck: Object.freeze([
      Object.freeze({
        id: 'rm-1',
        prompt: 'Which stage comes first in the risk-management sequence used here?',
        options: Object.freeze([
          'Identify assets',
          'Decide treatment',
          'Review effectiveness measure',
          'Analyse impact before naming any asset'
        ]),
        correctIndex: 0,
        explanation: 'Start by identifying assets so later judgements are anchored to what matters.'
      }),
      Object.freeze({
        id: 'rm-2',
        prompt: 'Phishing emails targeting Northbank staff are best described as a:',
        options: Object.freeze([
          'Threat (potential cause of harm)',
          'Vulnerability (the weakness itself)',
          'Risk score without likelihood or impact',
          'Effectiveness measure'
        ]),
        correctIndex: 0,
        explanation:
          'Phishing is a threat. Weak passwords or missing MFA would be related vulnerabilities.'
      }),
      Object.freeze({
        id: 'rm-3',
        prompt: 'When is Accept an appropriate treatment in this unit?',
        options: Object.freeze([
          'When the cost of further control is disproportionate to a lower-rated risk',
          'Whenever a risk sounds technical',
          'Only when the organisation wants to ignore patient confidentiality',
          'Never; every risk must be fully mitigated'
        ]),
        correctIndex: 0,
        explanation:
          'Accept is a reasoned choice when further spend is disproportionate, typically for lower impact or lower overall risk.'
      }),
      Object.freeze({
        id: 'rm-4',
        prompt: 'Which Northbank example is a rational candidate for Accept?',
        options: Object.freeze([
          'Temporary unavailability of a public leaflet PDF with no effect on care systems',
          'High-likelihood exposure of clinical notes with no compensating control',
          'Confirmed ransomware on the appointment system',
          'Any risk labelled High on the register'
        ]),
        correctIndex: 0,
        explanation:
          'Low-impact information-only disruption can be accepted when mitigation cost is disproportionate.'
      }),
      Object.freeze({
        id: 'rm-5',
        prompt: '“We installed antivirus” alone is a weak effectiveness measure because:',
        options: Object.freeze([
          'It does not show whether risk actually reduced',
          'Antivirus can never be mentioned in cyber security',
          'Installation always proves High risk remains',
          'Effectiveness measures are illegal to record'
        ]),
        correctIndex: 0,
        explanation:
          'Effectiveness needs an observable indicator of reduced likelihood or impact, not only installation.'
      }),
      Object.freeze({
        id: 'rm-6',
        prompt: 'Prioritise later means:',
        options: Object.freeze([
          'The risk is recognised but higher-priority risks are treated first',
          'The risk does not exist',
          'The organisation transfers all legal duty to a supplier automatically',
          'Impact is ignored forever'
        ]),
        correctIndex: 0,
        explanation:
          'Prioritise later is an ordered decision with a recorded reason, not denial of the risk.'
      }),
      Object.freeze({
        id: 'rm-7',
        prompt: 'Cost-benefit consideration should:',
        options: Object.freeze([
          'Weigh control cost against expected risk reduction for Northbank’s size',
          'Always choose the most expensive product',
          'Ignore staff time entirely',
          'Replace likelihood and impact scoring'
        ]),
        correctIndex: 0,
        explanation:
          'Proportionate recommendations consider cost and benefit in the organisation’s context.'
      }),
      Object.freeze({
        id: 'rm-8',
        prompt: 'Which distractor treatment is not required as a Northbank register decision in this unit?',
        options: Object.freeze([
          'Transfer (as a required register option)',
          'Mitigate',
          'Accept',
          'Prioritise later'
        ]),
        correctIndex: 0,
        explanation:
          'This unit’s register decisions use Mitigate, Accept and Prioritise. Transfer may appear as a quiz distractor only.'
      })
    ])
  });
})(window);
