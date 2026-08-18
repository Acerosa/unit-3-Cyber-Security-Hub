/**
 * Week 2 Session 1 retrieval quiz — Week 1 recall.
 * Tutor: edit prompts, options, correctIndex and explanations here.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }

  global.Week2Session1Retrieval = Object.freeze({
    activityId: 'week2-session1-retrieval',
    title: 'Session 1 Retrieval Quiz',
    total: 10,
    questions: Object.freeze([
      Object.freeze({
        id: 's1-q1',
        prompt: 'Which statement best describes cyber security?',
        options: Object.freeze([
          'Installing every software update on the same day it is released',
          'Protecting systems, networks and data from unauthorised access, damage or disruption',
          'Blocking all external email to remove phishing risk',
          'Using social media policies to control staff behaviour'
        ]),
        correctIndex: 1,
        explanation:
          'Cyber security is the protection of systems, networks and data from threats that could affect confidentiality, integrity or availability.'
      }),
      Object.freeze({
        id: 's1-q2',
        prompt: 'What does confidentiality mean in the CIA triad?',
        options: Object.freeze([
          'Information is available whenever authorised users need it',
          'Information can only be accessed by people who are authorised to see it',
          'Information is never changed once it has been saved',
          'Information is backed up to an off-site location'
        ]),
        correctIndex: 1,
        explanation:
          'Confidentiality means only authorised people can view or obtain the information.'
      }),
      Object.freeze({
        id: 's1-q3',
        prompt: 'What does integrity mean in the CIA triad?',
        options: Object.freeze([
          'Information is accurate and has not been altered without authorisation',
          'Information is encrypted while it travels across a network',
          'Information is deleted after a set retention period',
          'Information is shared only inside the organisation'
        ]),
        correctIndex: 0,
        explanation:
          'Integrity means information remains complete, accurate and trustworthy.'
      }),
      Object.freeze({
        id: 's1-q4',
        prompt: 'What does availability mean in the CIA triad?',
        options: Object.freeze([
          'Information is hidden from everyone except senior managers',
          'Authorised users can access systems and information when they need them',
          'Information is copied to paper records for legal reasons',
          'Information is never stored on portable devices'
        ]),
        correctIndex: 1,
        explanation:
          'Availability means authorised users can access systems and data when required.'
      }),
      Object.freeze({
        id: 's1-q5',
        prompt: 'Which of the following is a type of cyber security incident?',
        options: Object.freeze([
          'A planned staff training day',
          'Unauthorised access to patient records',
          'Ordering new networked printers',
          'Updating a meeting room booking'
        ]),
        correctIndex: 1,
        explanation:
          'Unauthorised access is a cyber security incident because it threatens confidentiality of sensitive data.'
      }),
      Object.freeze({
        id: 's1-q6',
        prompt: 'Why must personal data be protected?',
        options: Object.freeze([
          'Because personal data is never useful to an attacker',
          'Because loss or misuse can harm individuals and may breach data protection law',
          'Because personal data is always encrypted automatically',
          'Because personal data only exists on paper forms'
        ]),
        correctIndex: 1,
        explanation:
          'Personal data must be protected to reduce harm to individuals and to meet legal and ethical duties.'
      }),
      Object.freeze({
        id: 's1-q7',
        prompt: 'Why must organisational data be protected?',
        options: Object.freeze([
          'Organisational data has no commercial or operational value',
          'Loss or alteration can disrupt services, damage reputation and create financial cost',
          'Organisational data is always publicly available',
          'Only personal data can be involved in an incident'
        ]),
        correctIndex: 1,
        explanation:
          'Organisational data supports services and decision-making; compromise can halt operations and damage trust.'
      }),
      Object.freeze({
        id: 's1-q8',
        prompt: 'Why must state information be protected?',
        options: Object.freeze([
          'State information is only used for marketing campaigns',
          'Compromise can affect national security, critical services or public safety',
          'State information is never connected to digital systems',
          'State information is less sensitive than social media posts'
        ]),
        correctIndex: 1,
        explanation:
          'State and critical public-sector information can affect security and public safety if exposed or disrupted.'
      }),
      Object.freeze({
        id: 's1-q9',
        prompt: 'At Northbank, which CIA aim is mainly affected if appointment records become unreadable after ransomware?',
        options: Object.freeze([
          'Confidentiality only',
          'Integrity only',
          'Availability',
          'None of the CIA aims'
        ]),
        correctIndex: 2,
        explanation:
          'If staff cannot open records when needed, availability is affected. Confidentiality may also be at risk in some ransomware cases, but the clearest evidence here is loss of access.'
      }),
      Object.freeze({
        id: 's1-q10',
        prompt: 'Which statement is true about cyber security incidents?',
        options: Object.freeze([
          'They only happen when malware is involved',
          'They can involve people, processes or technology and may affect one or more CIA aims',
          'They always destroy data permanently',
          'They only matter if personal data is stolen'
        ]),
        correctIndex: 1,
        explanation:
          'Incidents can arise from many causes and may affect confidentiality, integrity, availability or a combination.'
      })
    ])
  });
})(window);
