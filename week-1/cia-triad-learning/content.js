/**
 * CIA Triad Learning content and scored question bank.
 * Correct answers are public static data and may be inspected.
 * This is formative guided learning, not a secure assessment.
 */

var CIA_TRIAD_CONTENT = Object.freeze({
  aims: Object.freeze([
    Object.freeze({
      id: 'confidentiality',
      name: 'Confidentiality',
      summary: 'Only authorised people or systems can view or access the information.',
      definition:
        'Information can only be viewed or accessed by authorised people or systems.',
      northbankExample:
        'Patient records should only be viewed by staff who need them for their work.',
      whatCouldGoWrong: 'An unauthorised visitor reads a patient record.'
    }),
    Object.freeze({
      id: 'integrity',
      name: 'Integrity',
      summary: 'Information stays accurate, complete and unchanged without permission.',
      definition:
        'Information remains accurate, complete and is not changed without permission.',
      northbankExample:
        'Prescription, appointment and billing data must remain correct.',
      whatCouldGoWrong: 'A medication dose is changed without permission.'
    }),
    Object.freeze({
      id: 'availability',
      name: 'Availability',
      summary: 'Authorised users can reach information and systems when they need them.',
      definition:
        'Information and systems can be accessed by authorised users when needed.',
      northbankExample:
        'The booking and patient-record systems must work when staff and patients need them.',
      whatCouldGoWrong: 'The appointment system is offline during clinic hours.'
    })
  ]),

  guidedExamples: Object.freeze([
    Object.freeze({
      id: 'guide-confidentiality',
      aim: 'Confidentiality',
      scenario:
        'A receptionist opens the medical record of a patient they are not authorised to support.',
      evidence: 'opens the medical record of a patient they are not authorised to support',
      explanation:
        'The main aim affected is Confidentiality. The evidence is that an authorised system user views a record without authorisation for that patient. Integrity is not the main answer because the record is not described as changed. Availability is not the main answer because the system still works.',
      whyOthers:
        'Integrity would matter if the record was altered. Availability would matter if staff could not open the system when needed.'
    }),
    Object.freeze({
      id: 'guide-integrity',
      aim: 'Integrity',
      scenario:
        'A patient allergy is changed from “penicillin” to “none” without permission.',
      evidence: 'allergy is changed from “penicillin” to “none” without permission',
      explanation:
        'The main aim affected is Integrity. The evidence is an unauthorised change to clinical data that must remain accurate. Confidentiality is not the main answer because the scenario does not describe unauthorised viewing or disclosure. Availability is not the main answer because access to the system is not blocked.',
      whyOthers:
        'Confidentiality would matter if someone without permission read or shared the allergy details. Availability would matter if staff could not open the record when needed.'
    }),
    Object.freeze({
      id: 'guide-availability',
      aim: 'Availability',
      scenario:
        'Doctors cannot open patient records because the server is unavailable.',
      evidence: 'cannot open patient records because the server is unavailable',
      explanation:
        'The main aim affected is Availability. The evidence is that authorised users cannot access records when needed. Confidentiality is not the main answer because the scenario does not describe disclosure. Integrity is not the main answer because the scenario does not describe incorrect or altered data.',
      whyOthers:
        'Confidentiality would matter if records were read without permission. Integrity would matter if record contents were changed incorrectly.'
    })
  ]),

  definitionQuestions: Object.freeze([
    Object.freeze({
      number: 1,
      prompt: 'Select the definition of confidentiality.',
      correctId: 'conf-def',
      options: Object.freeze([
        Object.freeze({
          id: 'conf-def',
          text: 'Information can only be accessed or viewed by authorised people or systems.'
        }),
        Object.freeze({
          id: 'conf-d1',
          text: 'Information remains accurate, complete and is not changed without permission.'
        }),
        Object.freeze({
          id: 'conf-d2',
          text: 'Information and systems can be accessed by authorised users when needed.'
        }),
        Object.freeze({
          id: 'conf-d3',
          text: 'Cyber security only means keeping patient information secret from everyone.'
        })
      ])
    }),
    Object.freeze({
      number: 2,
      prompt: 'Select the definition of integrity.',
      correctId: 'int-def',
      options: Object.freeze([
        Object.freeze({
          id: 'int-def',
          text: 'Information remains accurate, complete and is not changed without permission.'
        }),
        Object.freeze({
          id: 'int-d1',
          text: 'Information can only be accessed or viewed by authorised people or systems.'
        }),
        Object.freeze({
          id: 'int-d2',
          text: 'Information and systems can be accessed by authorised users when needed.'
        }),
        Object.freeze({
          id: 'int-d3',
          text: 'Staff must always print records so paper copies remain available.'
        })
      ])
    }),
    Object.freeze({
      number: 3,
      prompt: 'Select the definition of availability.',
      correctId: 'avail-def',
      options: Object.freeze([
        Object.freeze({
          id: 'avail-def',
          text: 'Information and systems can be accessed by authorised users when needed.'
        }),
        Object.freeze({
          id: 'avail-d1',
          text: 'Information can only be accessed or viewed by authorised people or systems.'
        }),
        Object.freeze({
          id: 'avail-d2',
          text: 'Information remains accurate, complete and is not changed without permission.'
        }),
        Object.freeze({
          id: 'avail-d3',
          text: 'Only managers may change passwords used by clinical systems.'
        })
      ])
    })
  ]),

  scenarioQuestions: Object.freeze([
    Object.freeze({
      number: 4,
      prompt: 'A person without permission reads a Northbank patient record.',
      correct: 'Confidentiality',
      evidence: 'without permission reads a Northbank patient record',
      explanation:
        'Confidentiality is affected because an unauthorised person views patient information. Integrity would require unauthorised change. Availability would require blocked access for authorised users.'
    }),
    Object.freeze({
      number: 5,
      prompt: 'A patient medication dose is changed without authorisation.',
      correct: 'Integrity',
      evidence: 'medication dose is changed without authorisation',
      explanation:
        'Integrity is affected because clinical data is altered without permission. Confidentiality would require unauthorised viewing or disclosure. Availability would require the system being unusable when needed.'
    }),
    Object.freeze({
      number: 6,
      prompt:
        'The Northbank appointment system cannot be accessed during working hours.',
      correct: 'Availability',
      evidence: 'cannot be accessed during working hours',
      explanation:
        'Availability is affected because authorised staff cannot use the booking system when needed. Confidentiality would require disclosure. Integrity would require incorrect or altered appointment data.'
    }),
    Object.freeze({
      number: 7,
      prompt:
        'Patient contact details are emailed to an external organisation that is not authorised to receive them.',
      correct: 'Confidentiality',
      evidence:
        'emailed to an external organisation that is not authorised to receive them',
      explanation:
        'Confidentiality is affected because patient details are disclosed to an unauthorised recipient. Integrity would require the details being changed incorrectly. Availability would require staff being unable to access the system.'
    }),
    Object.freeze({
      number: 8,
      prompt: 'A software fault changes the totals in Northbank’s billing records.',
      correct: 'Integrity',
      evidence: 'changes the totals in Northbank’s billing records',
      explanation:
        'Integrity is affected because billing totals become incorrect. Confidentiality would require unauthorised disclosure. Availability would require the billing system being unavailable.'
    }),
    Object.freeze({
      number: 9,
      prompt:
        'Staff cannot open the clinical records system after ransomware encrypts the files.',
      correct: 'Availability',
      evidence: 'cannot open the clinical records system after ransomware encrypts the files',
      explanation:
        'Availability is affected because authorised staff cannot open records when needed. Confidentiality may also be threatened in some ransomware cases, but the main evidence here is loss of access. Integrity would focus on unauthorised alteration of record content rather than encrypted unavailability.'
    })
  ]),

  multiAimQuestions: Object.freeze([
    Object.freeze({
      number: 10,
      prompt:
        'An attacker reads patient prescription records and changes the recorded dosage.',
      correctAims: Object.freeze(['Confidentiality', 'Integrity']),
      explanations: Object.freeze({
        Confidentiality: 'The attacker reads prescription records without authorisation.',
        Integrity: 'The recorded dosage is changed without permission.'
      }),
      teachingPoint:
        'One incident can compromise more than one CIA aim. Here, unauthorised reading affects Confidentiality and the changed dosage affects Integrity. Availability is not selected because the scenario does not say authorised staff cannot access the system.'
    }),
    Object.freeze({
      number: 11,
      prompt:
        'Malware corrupts appointment records and prevents staff from opening the system.',
      correctAims: Object.freeze(['Integrity', 'Availability']),
      explanations: Object.freeze({
        Integrity: 'Appointment records are corrupted, so the data is no longer accurate or complete.',
        Availability: 'Staff cannot open the system when they need it.'
      }),
      teachingPoint:
        'One incident can compromise more than one CIA aim. Corruption affects Integrity and blocked access affects Availability. Confidentiality is not selected because the scenario does not describe unauthorised viewing or disclosure.'
    }),
    Object.freeze({
      number: 12,
      prompt:
        'An unencrypted laptop containing Northbank patient data is stolen. It contains the only current copy of those records.',
      correctAims: Object.freeze(['Confidentiality', 'Availability']),
      explanations: Object.freeze({
        Confidentiality:
          'Unencrypted patient data on a stolen laptop may be viewed by an unauthorised person.',
        Availability:
          'The only current copy is gone, so authorised staff may no longer access those records when needed.'
      }),
      teachingPoint:
        'One incident can compromise more than one CIA aim. Theft of readable data affects Confidentiality and loss of the only copy affects Availability. Integrity is not selected because the scenario does not describe the records being altered.'
    })
  ]),

  aimChoices: Object.freeze(['Confidentiality', 'Integrity', 'Availability'])
});
