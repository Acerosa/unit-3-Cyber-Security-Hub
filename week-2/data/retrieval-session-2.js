/**
 * Week 2 Session 2 retrieval quiz — threats, vulnerabilities and malware.
 * Tutor: edit prompts, options, correctIndex and explanations here.
 */
(function (global) {
  'use strict';

  global.Week2Session2Retrieval = Object.freeze({
    activityId: 'week2-session2-retrieval',
    title: 'Session 2 Retrieval Quiz',
    total: 10,
    questions: Object.freeze([
      Object.freeze({
        id: 's2-q1',
        prompt: 'Which statement best defines a threat in cyber security?',
        options: Object.freeze([
          'A weakness in a system that could be exploited',
          'A person, group or event that could harm systems, networks or data',
          'The harmful outcome after an attack succeeds',
          'A control that reduces risk'
        ]),
        correctIndex: 1,
        explanation:
          'A threat is the potential source of harm — who or what might attack or cause damage.'
      }),
      Object.freeze({
        id: 's2-q2',
        prompt: 'Which statement best defines a vulnerability?',
        options: Object.freeze([
          'A ransomware operator attempting to encrypt files',
          'A weakness in technology, configuration or behaviour that a threat could exploit',
          'A successful login using stolen credentials',
          'An antivirus product scanning email attachments'
        ]),
        correctIndex: 1,
        explanation:
          'A vulnerability is a flaw or weakness — unpatched software, misconfiguration or human error.'
      }),
      Object.freeze({
        id: 's2-q3',
        prompt: 'What is the correct relationship between threats and vulnerabilities?',
        options: Object.freeze([
          'A vulnerability automatically creates a threat',
          'Threats and vulnerabilities mean the same thing in OCR exams',
          'A threat exploits a vulnerability to cause a cyber security incident',
          'An incident happens only when hardware fails'
        ]),
        correctIndex: 2,
        explanation:
          'Both must be present: a threat exploits a vulnerability, which leads to an incident affecting CIA aims.'
      }),
      Object.freeze({
        id: 's2-q4',
        prompt: 'Which symptom is most commonly associated with ransomware?',
        options: Object.freeze([
          'Files become encrypted and a ransom note appears',
          'The mouse pointer moves without user input only',
          'The printer runs out of toner',
          'Email signatures change automatically'
        ]),
        correctIndex: 0,
        explanation:
          'Ransomware typically encrypts files and demands payment. Users often cannot open affected documents.'
      }),
      Object.freeze({
        id: 's2-q5',
        prompt: 'Out-of-date web server software with a known security flaw is best classified as…',
        options: Object.freeze([
          'A software vulnerability',
          'A hardware vulnerability',
          'A configuration vulnerability',
          'A human behaviour vulnerability'
        ]),
        correctIndex: 0,
        explanation:
          'Unpatched or outdated application code is a software vulnerability — a weakness in the program itself.'
      }),
      Object.freeze({
        id: 's2-q6',
        prompt: 'An unlocked server room cabinet left overnight is best classified as…',
        options: Object.freeze([
          'A software vulnerability',
          'A hardware vulnerability',
          'A configuration vulnerability',
          'A human behaviour vulnerability'
        ]),
        correctIndex: 1,
        explanation:
          'Physical access to hardware without proper protection is a hardware (physical) vulnerability.'
      }),
      Object.freeze({
        id: 's2-q7',
        prompt: 'A firewall rule that allows unnecessary inbound traffic is best classified as…',
        options: Object.freeze([
          'A software vulnerability',
          'A hardware vulnerability',
          'A configuration vulnerability',
          'A human behaviour vulnerability'
        ]),
        correctIndex: 2,
        explanation:
          'Misconfigured security settings — such as overly permissive firewall rules — are configuration vulnerabilities.'
      }),
      Object.freeze({
        id: 's2-q8',
        prompt: 'Staff who trust phishing emails without checking the sender are an example of…',
        options: Object.freeze([
          'A software vulnerability',
          'A hardware vulnerability',
          'A configuration vulnerability',
          'A human behaviour vulnerability'
        ]),
        correctIndex: 3,
        explanation:
          'Untrained or careless behaviour is a human vulnerability that social engineers exploit.'
      }),
      Object.freeze({
        id: 's2-q9',
        scenario:
          'At Northbank, a caller pretends to be from IT support and asks reception for a remote-access code.',
        prompt: 'In this scenario, what is the threat?',
        options: Object.freeze([
          'Reception staff who do not verify unexpected support calls',
          'The social engineer pretending to be IT support',
          'The remote-access system itself',
          'The incident report form'
        ]),
        correctIndex: 1,
        reversedIndex: 0,
        reversedExplanation:
          'You may have reversed threat and vulnerability. The caller pretending to be IT support is the threat — the actor attempting harm. Staff who fail to verify callers is the vulnerability.',
        explanation:
          'The social engineer is the threat. Failing to verify the caller is the human vulnerability.'
      }),
      Object.freeze({
        id: 's2-q10',
        scenario:
          'At Northbank, appointment software has not been updated despite a vendor security patch being available for three months.',
        prompt: 'In this scenario, what is the vulnerability?',
        options: Object.freeze([
          'Malware designed to exploit the known flaw',
          'The missing software patch leaving a known weakness',
          'Patient records stored on the server',
          'The cyber security incident response team'
        ]),
        correctIndex: 1,
        reversedIndex: 0,
        reversedExplanation:
          'You may have reversed threat and vulnerability. The unpatched software is the vulnerability — the weakness. Malware or an attacker exploiting that flaw would be the threat.',
        explanation:
          'Unpatched software is the vulnerability. Malware or an attacker targeting the flaw would be the threat.'
      })
    ])
  });
})(window);
