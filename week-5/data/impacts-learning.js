/**
 * Week 5 impacts learning — loss, disruption and safety.
 */
(function (global) {
  'use strict';

  global.Week5ImpactsLearning = Object.freeze({
    activityId: 'week5-impacts-learning',
    activityName: 'Impacts Learning: Loss, Disruption and Safety',
    activityVersion: '1.0',
    weekNumber: 5,
    sessionNumber: 1,
    total: 9,
    estimatedMinutes: 35,
    overviewNote:
      'Do not treat every cyber security impact as financial loss. A single incident can create loss, disruption and safety consequences together. Categories are not always mutually exclusive.',
    definitions: Object.freeze({
      loss:
        'Something of value is taken, damaged, corrupted, reduced or no longer trusted — including data, money, identity, reputation or confidence.',
      disruption:
        'A service, process or operation stops, slows or becomes unreliable for people who depend on it.',
      safety:
        'People are placed at physical risk, or physical harm becomes more likely, because of the cyber incident or its consequences.'
    }),
    lossForms: Object.freeze([
      Object.freeze({
        id: 'confidentiality',
        term: 'Loss of confidentiality',
        explanation:
          'Information that should be restricted becomes known to unauthorised people.',
        example:
          'Northbank patient contact details from a shared mailbox are emailed to the wrong external address.',
        distinction:
          'Different from integrity loss: the data may still be accurate, but the wrong people can see it.',
        check: Object.freeze({
          prompt: 'A staff member posts a screenshot of a patient booking list in a public group chat. Which loss is clearest?',
          options: Object.freeze([
            'Loss of confidentiality',
            'Loss of availability',
            'Safety only',
            'No impact'
          ]),
          correctIndex: 0,
          explanation:
            'Restricted patient information has been exposed. That is loss of confidentiality even if systems still work.'
        })
      }),
      Object.freeze({
        id: 'integrity',
        term: 'Loss of integrity',
        explanation:
          'Information is altered so it is no longer accurate or trustworthy.',
        example:
          'Ransomware encrypts Northbank appointment records so staff cannot trust which visits remain scheduled.',
        distinction:
          'Different from confidentiality: the issue is trustworthiness of the data, not only who can see it.',
        check: Object.freeze({
          prompt: 'An attacker changes dosage fields in a shared prescribing note template used by Northbank. This is primarily:',
          options: Object.freeze([
            'Loss of integrity',
            'Loss of business only',
            'Disruption of broadcasting',
            'Identity theft only'
          ]),
          correctIndex: 0,
          explanation:
            'Altering clinical information so it is no longer trustworthy is loss of integrity. It may also raise safety concerns later, but integrity is the direct data impact.'
        })
      }),
      Object.freeze({
        id: 'availability',
        term: 'Loss of availability',
        explanation:
          'Systems, data or services cannot be used when needed.',
        example:
          'Northbank’s booking system is offline after encryption, so staff cannot open today’s clinic list.',
        distinction:
          'Closely linked to disruption of services, but availability focuses on whether the asset can be used.',
        check: Object.freeze({
          prompt: 'Staff cannot open the encrypted shared drive containing clinic rotas. The clearest CIA-related loss is:',
          options: Object.freeze([
            'Loss of availability',
            'Identity theft',
            'Loss of customer confidence only',
            'Reputational loss only'
          ]),
          correctIndex: 0,
          explanation:
            'The information exists but cannot be used when needed — loss of availability.'
        })
      }),
      Object.freeze({
        id: 'data',
        term: 'Loss of data',
        explanation:
          'Data is destroyed, permanently inaccessible, or no longer recoverable in a usable form.',
        example:
          'Northbank cannot restore last week’s referral letters after backups fail during a ransomware event.',
        distinction:
          'Wider than confidentiality: the organisation may no longer have the data at all.',
        check: Object.freeze({
          prompt: 'Which statement best illustrates loss of data rather than temporary unavailability?',
          options: Object.freeze([
            'The system is down for ten minutes during a reboot',
            'Backups fail and referral letters cannot be restored',
            'A patient is late for an appointment',
            'A supplier invoice is paid on time'
          ]),
          correctIndex: 1,
          explanation:
            'If information cannot be restored, the organisation has lost data, not merely waited for a short outage.'
        })
      }),
      Object.freeze({
        id: 'financial',
        term: 'Financial loss',
        explanation:
          'Money is spent, stolen or otherwise lost because of the incident.',
        example:
          'Northbank pays emergency IT contractor fees and overtime to recover encrypted booking systems.',
        distinction:
          'Important, but not the only impact. Do not stop at money when a question asks for impacts.',
        check: Object.freeze({
          prompt: 'Paying overtime and recovery fees after ransomware is best described as:',
          options: Object.freeze([
            'Financial loss',
            'Safety impact only',
            'Motivation for attack',
            'No organisational impact'
          ]),
          correctIndex: 0,
          explanation:
            'Direct extra spending is financial loss. Strong answers also consider disruption and safety where relevant.'
        })
      }),
      Object.freeze({
        id: 'business',
        term: 'Loss of business',
        explanation:
          'Customers, patients or partners take their activity elsewhere, reducing future work or service use.',
        example:
          'Local residents choose another clinic for routine bookings after repeated Northbank outages.',
        distinction:
          'Related to, but not identical with, loss of customer confidence — business loss is the reduced activity itself.',
        check: Object.freeze({
          prompt: 'Patients start booking elsewhere after repeated Northbank outages. This illustrates:',
          options: Object.freeze([
            'Loss of business',
            'Loss of confidentiality only',
            'A transport-network impact',
            'An oil-installation safety case'
          ]),
          correctIndex: 0,
          explanation:
            'Activity moving away from the organisation is loss of business.'
        })
      }),
      Object.freeze({
        id: 'identity',
        term: 'Identity loss or identity theft',
        explanation:
          'Personal identifying information is misused so someone can pretend to be another person or take over their accounts.',
        example:
          'Stolen Northbank patient identity details are used to open fraudulent accounts in a patient’s name.',
        distinction:
          'A form of loss for the individual; it may also create longer-term financial and confidence harms.',
        check: Object.freeze({
          prompt: 'Stolen patient details are used to open fraudulent accounts. Which impact fits best?',
          options: Object.freeze([
            'Identity theft / identity loss',
            'Broadcasting disruption',
            'Utilities disruption only',
            'No individual impact'
          ]),
          correctIndex: 0,
          explanation:
            'Misuse of personal identity information is identity theft / identity loss for the individual.'
        })
      }),
      Object.freeze({
        id: 'reputation',
        term: 'Reputational loss',
        explanation:
          'Trust in the organisation’s competence or trustworthiness is damaged in public or professional opinion.',
        example:
          'Local news reports that Northbank cancelled clinics after ransomware, and GPs hesitate to refer patients.',
        distinction:
          'May continue after immediate financial recovery costs are paid.',
        check: Object.freeze({
          prompt: 'Why might reputational loss still matter after recovery fees are paid?',
          options: Object.freeze([
            'Because reputation always equals insurance payouts',
            'Because damaged trust can continue for months and affect future use of the service',
            'Because reputation is never an OCR impact',
            'Because only states experience reputational loss'
          ]),
          correctIndex: 1,
          explanation:
            'Reputational loss can continue after immediate financial costs are addressed and remains important even when hard to quantify.'
        })
      }),
      Object.freeze({
        id: 'confidence',
        term: 'Loss of customer confidence',
        explanation:
          'Patients, customers or partners become less willing to trust the organisation with their care, data or business.',
        example:
          'Patients ask reception whether Northbank can keep medical information safe after a publicised breach.',
        distinction:
          'Closely linked to reputational loss; confidence focuses on the stakeholder’s willingness to trust and continue using the service.',
        check: Object.freeze({
          prompt: 'Patients repeatedly ask whether Northbank can keep records safe after an incident. This best shows:',
          options: Object.freeze([
            'Loss of customer confidence',
            'Loss of availability of a traffic system',
            'A state-level utilities outage',
            'No longer-term consequence'
          ]),
          correctIndex: 0,
          explanation:
            'Reduced willingness to trust the organisation is loss of customer confidence and may continue after immediate recovery.'
        })
      })
    ]),
    disruptionContexts: Object.freeze([
      Object.freeze({
        id: 'healthcare',
        context: 'Healthcare services / hospitals',
        explanation:
          'Clinical or administrative services stop or become unreliable for patients and staff who depend on them.',
        example:
          'Northbank cannot run booked clinics while systems are offline, so appointments are cancelled.'
      }),
      Object.freeze({
        id: 'transport',
        context: 'Transport networks',
        explanation:
          'Travel services become delayed, cancelled or unsafe to rely on.',
        example:
          'A ransomware incident on a regional booking platform leaves passengers unable to confirm journeys.'
      }),
      Object.freeze({
        id: 'broadcasting',
        context: 'Broadcasting',
        explanation:
          'Media or public-information services cannot transmit as planned.',
        example:
          'A broadcaster cannot air scheduled public-service announcements during an outage.'
      }),
      Object.freeze({
        id: 'utilities',
        context: 'Utilities',
        explanation:
          'Essential utility services become unreliable for households or organisations.',
        example:
          'A cyber incident interrupts monitoring for a local utility, affecting service continuity.'
      }),
      Object.freeze({
        id: 'oil',
        context: 'Oil installations',
        explanation:
          'Industrial operations are interrupted, with possible wider supply and safety consequences.',
        example:
          'Control systems at an oil installation are taken offline, stopping normal operations.'
      }),
      Object.freeze({
        id: 'traffic',
        context: 'Traffic-control interference',
        explanation:
          'Traffic management becomes unreliable, affecting road users who depend on signals or control systems.',
        example:
          'Interference with traffic-control systems causes unpredictable signal behaviour on major routes.'
      })
    ]),
    safetyTeaching:
      'A cyber security incident can cause physical harm or place people at physical risk. Safety is not optional content when the scenario supports it.',
    safetyExamples: Object.freeze([
      'A cancelled urgent healthcare appointment leaves a patient without timely clinical review.',
      'Traffic-control interference increases the chance of collisions.',
      'Disrupted hospital systems delay access to care records needed for treatment decisions.'
    ]),
    knowledgeCheck: Object.freeze([
      Object.freeze({
        id: 'k1',
        prompt: 'Which option is a disruption impact rather than a pure financial-loss statement?',
        options: Object.freeze([
          'Northbank paid £2,000 in overtime',
          'Clinic booking services were unavailable for two working days',
          'An attacker wanted income generation',
          'A student copied a mark scheme'
        ]),
        correctIndex: 1,
        explanation:
          'Unavailable clinic booking is disruption of a depended-on service. Overtime is financial loss; income generation is motivation.'
      }),
      Object.freeze({
        id: 'k2',
        prompt: 'Which statement best shows a safety impact?',
        options: Object.freeze([
          'Northbank’s logo looks outdated on the website',
          'A patient misses a time-critical review because records and booking systems are down',
          'A supplier invoice is emailed a day late',
          'Staff discuss the incident in a team meeting'
        ]),
        correctIndex: 1,
        explanation:
          'Delayed time-critical care places a person at physical risk — a safety impact supported by the scenario.'
      }),
      Object.freeze({
        id: 'k3',
        prompt: 'Loss, disruption and safety are:',
        options: Object.freeze([
          'Always mutually exclusive labels',
          'Categories that can overlap when a scenario supports more than one',
          'Only used for state-level incidents',
          'Replacements for naming stakeholders'
        ]),
        correctIndex: 1,
        explanation:
          'A cancelled appointment may be disruption for the organisation and safety for the patient. Categories can combine when justified.'
      }),
      Object.freeze({
        id: 'k4',
        prompt: 'Which pair is most likely to continue after immediate recovery spending?',
        options: Object.freeze([
          'Emergency call-out fee and same-day taxi receipt',
          'Reputational loss and loss of customer confidence',
          'A one-hour reboot delay only',
          'A single printed leaflet cost'
        ]),
        correctIndex: 1,
        explanation:
          'Reputation and confidence harms may continue for months after immediate financial costs are addressed.'
      }),
      Object.freeze({
        id: 'k5',
        prompt: 'Identity theft after a healthcare breach primarily harms:',
        options: Object.freeze([
          'Only the broadcasting regulator',
          'Individuals whose personal details are misused',
          'Only oil installations',
          'Nobody if backups exist'
        ]),
        correctIndex: 1,
        explanation:
          'Identity theft is an individual loss impact, even when an organisation was the breached party.'
      }),
      Object.freeze({
        id: 'k6',
        prompt: 'When classifying an impact you should first identify:',
        options: Object.freeze([
          'A famous unrelated breach from the news',
          'Which service stopped, who depended on it, and how they were affected',
          'The LO4 incident-response stage name',
          'A risk score from Week 7'
        ]),
        correctIndex: 1,
        explanation:
          'Week 5 teaching asks which service stopped or became unreliable, who depended on it, and how they were affected.'
      }),
      Object.freeze({
        id: 'k7',
        prompt: 'Traffic-control interference is included in Week 5 mainly to illustrate:',
        options: Object.freeze([
          'Only financial loss for advertisers',
          'Disruption of a depended-on service and possible safety consequences',
          'Motivation taxonomy from Week 4',
          'Legislation from Week 6'
        ]),
        correctIndex: 1,
        explanation:
          'Transport and traffic-control contexts show disruption and can raise safety issues when people are placed at physical risk.'
      }),
      Object.freeze({
        id: 'k8',
        prompt: 'A strong impact answer for Northbank should usually include:',
        options: Object.freeze([
          'Only a list of malware names',
          'Named stakeholder, consequence, scenario evidence and timescale where relevant',
          'Invented controls not present in the briefing',
          'Official OCR examination paper numbers'
        ]),
        correctIndex: 1,
        explanation:
          'Analysis needs a named stakeholder, a specific consequence, evidence from the scenario and clear timescale thinking.'
      }),
      Object.freeze({
        id: 'k9',
        prompt: 'Why is “the organisation suffered” a weak examination phrase on its own?',
        options: Object.freeze([
          'Because organisations never suffer impacts',
          'Because it fails to name the stakeholder and the specific consequence',
          'Because only states can be named',
          'Because financial loss is forbidden'
        ]),
        correctIndex: 1,
        explanation:
          'Name who is affected and what happened. Vague organisational suffering without stakeholder or evidence earns limited credit.'
      })
    ])
  });
})(window);
