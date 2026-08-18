/**
 * Week 5 Session 2 retrieval quiz.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week5Session2Retrieval = Object.freeze({
    activityId: 'week5-session2-retrieval',
    activityName: 'Session 2 Retrieval Quiz',
    activityVersion: '1.0',
    weekNumber: 5,
    sessionNumber: 2,
    total: 12,
    estimatedMinutes: 15,
    questions: Object.freeze([
      Object.freeze({
        id: 's2q1',
        prompt: 'Which impact category best fits unrecovered destruction of referral letters?',
        options: Object.freeze(['Loss', 'Disruption only', 'Safety only', 'Motivation']),
        correctIndex: 0,
        explanation: 'Destroyed or unrecoverable information is a loss of data.'
      }),
      Object.freeze({
        id: 's2q2',
        prompt: 'Reception cannot confirm any clinic visits for two days. This is primarily:',
        options: Object.freeze(['Disruption', 'Identity theft', 'A motivation', 'Legislation']),
        correctIndex: 0,
        explanation: 'A depended-on service has become unreliable — disruption.'
      }),
      Object.freeze({
        id: 's2q3',
        prompt: 'A patient faces increased clinical risk because an urgent review is delayed. This is primarily:',
        options: Object.freeze(['Safety', 'Financial loss only', 'Broadcasting disruption', 'Publicity motivation']),
        correctIndex: 0,
        explanation: 'Physical or clinical risk to a person is a safety impact.'
      }),
      Object.freeze({
        id: 's2q4',
        prompt: 'Who is a stakeholder in a Northbank ransomware scenario?',
        options: Object.freeze([
          'Only the attacker group',
          'Patients, employees, suppliers, regulators and the organisation itself, among others',
          'Only the college tutor',
          'Only oil installations'
        ]),
        correctIndex: 1,
        explanation:
          'Different stakeholders can experience the same incident differently — individuals, the organisation, employees, patients, suppliers, regulators and the state.'
      }),
      Object.freeze({
        id: 's2q5',
        prompt: 'An immediate consequence is best described as one that:',
        options: Object.freeze([
          'Appears only in national legislation',
          'Occurs at or shortly after the incident',
          'Can never involve safety',
          'Is always financial'
        ]),
        correctIndex: 1,
        explanation: 'Immediate consequences occur at or shortly after the incident.'
      }),
      Object.freeze({
        id: 's2q6',
        prompt: 'Loss of customer confidence six months later is best described as:',
        options: Object.freeze([
          'An immediate availability outage only',
          'A longer-term consequence',
          'A Week 6 legal duty',
          'An NCSC staged prompt'
        ]),
        correctIndex: 1,
        explanation:
          'Confidence and reputational harms often continue for months and are longer-term consequences.'
      }),
      Object.freeze({
        id: 's2q7',
        prompt: 'Awkward example: “Northbank suffered.” Why is this weak?',
        options: Object.freeze([
          'It names every stakeholder clearly',
          'It does not name the stakeholder or the specific impact',
          'It covers loss, disruption and safety in detail',
          'It uses scenario evidence precisely'
        ]),
        correctIndex: 1,
        explanation: 'Name who was affected and what happened; avoid vague organisational suffering.'
      }),
      Object.freeze({
        id: 's2q8',
        prompt: 'Awkward example: listing “money, reputation, trust” with no explanation mainly fails because it:',
        options: Object.freeze([
          'Uses too many safety examples',
          'Lists impacts without analysis, evidence or stakeholder focus',
          'Mentions disruption too often',
          'Uses British English'
        ]),
        correctIndex: 1,
        explanation: 'Listing is not analysis. Connect stakeholder, consequence, evidence and timescale.'
      }),
      Object.freeze({
        id: 's2q9',
        prompt: 'A cancelled healthcare appointment may be disruption for the organisation and safety for the patient. This shows that:',
        options: Object.freeze([
          'Only one classification is ever allowed',
          'More than one classification may be defensible depending on the stakeholder',
          'Safety never applies in healthcare',
          'Financial loss is the only valid lens'
        ]),
        correctIndex: 1,
        explanation:
          'Ambiguous cases can have more than one defensible classification when stakeholder perspective is explained.'
      }),
      Object.freeze({
        id: 's2q10',
        prompt: 'Which evidence best supports a disruption claim for Northbank?',
        options: Object.freeze([
          '“Hospitals somewhere had ransomware once.”',
          '“The booking system could not confirm visits for two working days.”',
          '“Attackers like money.”',
          '“All organisations always lose reputation.”'
        ]),
        correctIndex: 1,
        explanation: 'Use scenario evidence about the service that stopped or became unreliable.'
      }),
      Object.freeze({
        id: 's2q11',
        prompt: 'Regulators are included in the stakeholder grid because:',
        options: Object.freeze([
          'They experience the incident in the same way as a patient',
          'They may face reporting, oversight or assurance consequences that differ from patient impacts',
          'They replace the need to discuss safety',
          'They are the only stakeholder that matters'
        ]),
        correctIndex: 1,
        explanation:
          'The same incident affects a patient differently from a regulator — both perspectives need analysis.'
      }),
      Object.freeze({
        id: 's2q12',
        prompt: 'Cyber security is a global problem affecting:',
        options: Object.freeze([
          'Individuals only',
          'Organisations only',
          'Individuals, organisations and states',
          'Only Northbank Community Health Partnership'
        ]),
        correctIndex: 2,
        explanation:
          'Week 5 learning outcomes require recognition that individuals, organisations and states can all be affected.'
      })
    ])
  });
})(window);
