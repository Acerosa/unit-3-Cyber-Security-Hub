/**
 * Week 5 Session 1 retrieval and homework harvest.
 */
(function (global) {
  'use strict';

  global.Week5Session1Retrieval = Object.freeze({
    activityId: 'week5-session1-retrieval',
    activityName: 'Session 1 Retrieval and Homework Harvest',
    activityVersion: '1.0',
    weekNumber: 5,
    sessionNumber: 1,
    total: 8,
    estimatedMinutes: 15,
    homeworkReminder:
      'Submit your Week 4 case study analysis if you have not already done so. Use the method your tutor has set — this hub does not provide a new file-upload system.',
    harvestPrompts: Object.freeze({
      intro:
        'Think of one cyber security incident you have studied (for example from Week 4). Move from cause and motivation to consequence.',
      fields: Object.freeze([
        Object.freeze({
          id: 'whoHarmed',
          label: 'Who was harmed?',
          required: true
        }),
        Object.freeze({
          id: 'whatLost',
          label: 'What did each party lose?',
          required: true
        }),
        Object.freeze({
          id: 'timescale',
          label: 'Was the harm immediate or longer term? Explain briefly.',
          required: true
        })
      ])
    }),
    questions: Object.freeze([
      Object.freeze({
        id: 's1q1',
        prompt: 'Week 4 focused mainly on why attackers act and what they target. Week 5 focuses on:',
        options: Object.freeze([
          'Risk scoring formulae',
          'The consequences and impacts of cyber security incidents',
          'Incident-response stage ordering',
          'Choosing security controls for LO4'
        ]),
        correctIndex: 1,
        explanation:
          'Week 5 moves from cause and motivation to consequence: loss, disruption and safety impacts.'
      }),
      Object.freeze({
        id: 's1q2',
        prompt: 'Which statement best describes a motivation rather than an impact?',
        options: Object.freeze([
          'Patients cannot book appointments for two days',
          'Income generation through ransom demands',
          'Northbank’s reputation is damaged for months',
          'A traffic-control system becomes unreliable'
        ]),
        correctIndex: 1,
        explanation:
          'Income generation is a motivation (why). The other options describe consequences for services or stakeholders.'
      }),
      Object.freeze({
        id: 's1q3',
        prompt: 'OCR teaching content 2.5 groups impacts under which three broad categories?',
        options: Object.freeze([
          'Confidentiality, integrity and availability only',
          'Loss, disruption and safety',
          'Prevention, detection and recovery',
          'People, organisations and equipment'
        ]),
        correctIndex: 1,
        explanation:
          'Learners must cover loss, disruption and safety — not treat every impact as financial loss alone.'
      }),
      Object.freeze({
        id: 's1q4',
        prompt: 'A single ransomware incident at Northbank is most likely to:',
        options: Object.freeze([
          'Create only one financial impact',
          'Create several different impacts for different stakeholders',
          'Affect only the IT support contractor',
          'Have consequences that end as soon as systems restart'
        ]),
        correctIndex: 1,
        explanation:
          'One incident can create several impacts, and different stakeholders experience the same incident differently.'
      }),
      Object.freeze({
        id: 's1q5',
        prompt: 'Which consequence is typically harder to quantify than an immediate recovery invoice?',
        options: Object.freeze([
          'Paying an emergency IT call-out fee',
          'Buying replacement hard drives',
          'Loss of customer confidence over several months',
          'Hiring temporary reception cover for one afternoon'
        ]),
        correctIndex: 2,
        explanation:
          'Reputational damage and loss of customer confidence may continue after immediate financial costs are addressed and can be hard to quantify.'
      }),
      Object.freeze({
        id: 's1q6',
        prompt: 'Why must impact claims be supported by scenario evidence?',
        options: Object.freeze([
          'So answers can ignore the organisation named in the question',
          'So learners can import facts from famous unrelated breaches',
          'So each claimed impact can be justified from the given case',
          'So only financial loss needs to be mentioned'
        ]),
        correctIndex: 2,
        explanation:
          'Examination answers should use evidence from the scenario provided, not invent or import unrelated incident facts.'
      }),
      Object.freeze({
        id: 's1q7',
        prompt: 'Cancelling a healthcare appointment after systems fail may be:',
        options: Object.freeze([
          'Only a financial loss for the patient',
          'Disruption for the organisation and potentially a safety impact for the patient',
          'Only a safety impact for the regulator',
          'Neither disruption nor safety'
        ]),
        correctIndex: 1,
        explanation:
          'The same event can be disruption for the healthcare organisation and also create a safety impact for the patient, depending on the stakeholder considered.'
      }),
      Object.freeze({
        id: 's1q8',
        prompt: 'Cyber security is treated as a global problem because incidents can affect:',
        options: Object.freeze([
          'Only large banks',
          'Individuals, organisations and states',
          'Only healthcare partnerships',
          'Only reputational loss'
        ]),
        correctIndex: 1,
        explanation:
          'Week 5 establishes that cyber security incidents can affect individuals, organisations and states.'
      })
    ])
  });
})(window);
