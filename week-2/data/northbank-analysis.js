/**
 * Week 2 Activity 7 — Northbank Vulnerability Analysis scenarios and mark scheme.
 * Tutor: edit scenarios and acceptable answers here.
 */
(function (global) {
  'use strict';

  var CATEGORIES = Object.freeze([
    'Software',
    'Hardware',
    'Configuration',
    'Human behaviour'
  ]);

  var CIA_OPTIONS = Object.freeze([
    'Confidentiality',
    'Integrity',
    'Availability'
  ]);

  global.Week2NorthbankAnalysis = Object.freeze({
    activityId: 'week2-northbank-vulnerability-analysis',
    title: 'Northbank Vulnerability Analysis',
    total: 5,
    categories: CATEGORIES,
    ciaOptions: CIA_OPTIONS,
    feedbackChain:
      'Threat → exploits vulnerability → causes incident → produces impact on CIA aims.',
    scenarios: Object.freeze([
      Object.freeze({
        id: 'nba-1',
        title: 'Unpatched patient portal',
        text:
          'Northbank\'s patient appointment portal runs software that has not been updated for six months. A vendor patch fixing a serious flaw was released but never installed.',
        answers: Object.freeze({
          vulnerability: Object.freeze(['unpatched software', 'missing patch', 'out-of-date software', 'outdated software', 'not updated', 'unpatched portal']),
          category: 'Software',
          threat: Object.freeze(['malware', 'ransomware', 'attacker', 'cyber criminal', 'hacker', 'exploit']),
          likelyIncident: Object.freeze(['unauthorised access', 'data breach', 'malware infection', 'system compromise', 'ransomware', 'encryption']),
          ciaAims: Object.freeze(['Confidentiality', 'Availability']),
          justification:
            'Unpatched software is a software vulnerability. Malware or an attacker can exploit the known flaw, leading to compromise of patient data (confidentiality) or disrupted access (availability).'
        })
      }),
      Object.freeze({
        id: 'nba-2',
        title: 'Unlocked server room',
        text:
          'A cleaner props open the server room door overnight so they can move equipment. No one notices until the morning.',
        answers: Object.freeze({
          vulnerability: Object.freeze(['unlocked door', 'door propped open', 'physical access', 'unsecured server room', 'open server room']),
          category: 'Hardware',
          threat: Object.freeze(['malicious insider', 'insider', 'intruder', 'thief', 'unauthorised person', 'attacker']),
          likelyIncident: Object.freeze(['unauthorised access', 'theft', 'tampering', 'hardware theft', 'data theft', 'physical access']),
          ciaAims: Object.freeze(['Confidentiality', 'Integrity']),
          justification:
            'Physical access to hardware without protection is a hardware vulnerability. An insider or intruder could access or tamper with equipment, affecting confidentiality and integrity of stored data.'
        })
      }),
      Object.freeze({
        id: 'nba-3',
        title: 'Overly permissive firewall',
        text:
          'Northbank\'s firewall allows remote desktop (RDP) connections from any IP address on the internet. IT staff set this up for home working but never restricted it.',
        answers: Object.freeze({
          vulnerability: Object.freeze(['firewall rule', 'misconfigured firewall', 'open rdp', 'permissive rule', 'misconfiguration', 'unnecessary inbound']),
          category: 'Configuration',
          threat: Object.freeze(['brute force', 'attacker', 'cyber criminal', 'hacker', 'automated attack', 'credential stuffing']),
          likelyIncident: Object.freeze(['unauthorised login', 'unauthorised access', 'account compromise', 'remote access', 'system compromise']),
          ciaAims: Object.freeze(['Confidentiality']),
          justification:
            'Allowing unnecessary inbound RDP is a configuration vulnerability. Attackers can attempt brute-force logins, gaining unauthorised access and threatening confidentiality of patient records.'
        })
      }),
      Object.freeze({
        id: 'nba-4',
        title: 'Phishing email at reception',
        text:
          'Reception staff receive an email claiming to be from payroll, asking them to click a link and confirm login details. Several staff members do so without checking the sender.',
        answers: Object.freeze({
          vulnerability: Object.freeze(['trust phishing', 'click link', 'no verification', 'human error', 'trust email', 'staff trust', 'phishing susceptibility']),
          category: 'Human behaviour',
          threat: Object.freeze(['phisher', 'phishing', 'social engineer', 'scammer', 'attacker', 'fake email']),
          likelyIncident: Object.freeze(['credential theft', 'stolen credentials', 'account compromise', 'unauthorised access', 'login stolen']),
          ciaAims: Object.freeze(['Confidentiality']),
          justification:
            'Trusting a fake email without verification is a human behaviour vulnerability. The phisher exploits this to steal credentials, leading to unauthorised access and loss of confidentiality.'
        })
      }),
      Object.freeze({
        id: 'nba-5',
        title: 'Shared admin password',
        text:
          'The reception PC uses a single shared administrator password that every shift worker knows. It has not been changed in over a year.',
        answers: Object.freeze({
          vulnerability: Object.freeze(['shared password', 'weak password', 'shared admin', 'known password', 'password not changed']),
          category: 'Human behaviour',
          threat: Object.freeze(['malicious insider', 'insider', 'former employee', 'attacker', 'unauthorised user']),
          likelyIncident: Object.freeze(['unauthorised changes', 'unauthorised access', 'data alteration', 'account misuse', 'integrity breach']),
          ciaAims: Object.freeze(['Integrity', 'Confidentiality']),
          justification:
            'A shared, unchanged admin password is a human/process vulnerability. Anyone with the password — including a malicious insider — could alter records (integrity) or access sensitive data (confidentiality).'
        })
      })
    ])
  });
})(window);
