/**
 * Week 2 Activity 10 — Peer marking mark scheme and checklist.
 * Tutor: edit question text, mark scheme and checklist items here.
 */
(function (global) {
  'use strict';

  global.Week2PeerMarking = Object.freeze({
    activityId: 'week2-peer-marking-answer-improvement',
    title: 'Peer Marking and Answer Improvement',
    total: 6,
    ocrPracticePath: '../ocr-practice/',
    extendedDraftKey: 'ocrExtendedResponse',
    peerDraftKey: 'peerMarking',
    question: Object.freeze({
      commandWord: 'Explain',
      marks: 6,
      text:
        'Explain how a phishing attack could lead to a cyber security incident at Northbank Community Health Partnership. In your answer, refer to threats, vulnerabilities and the impact on confidentiality. [6 marks]'
    }),
    markScheme: Object.freeze([
      'Threat named clearly (e.g. phishing / social engineer sending deceptive email).',
      'Vulnerability named (e.g. staff trust email without verifying sender).',
      'Relationship explained — threat exploits vulnerability.',
      'Applied to Northbank (reception, staff, systems or patient data).',
      'Consequence / incident described (e.g. credential theft, unauthorised access).',
      'Confidentiality impact explained with reason.'
    ]),
    checklist: Object.freeze([
      Object.freeze({
        id: 'chk-threat',
        label: 'Threat named?',
        description: 'The response identifies phishing or a social engineer as the threat.'
      }),
      Object.freeze({
        id: 'chk-vulnerability',
        label: 'Vulnerability named?',
        description: 'The response identifies a human or technical weakness (e.g. trusting emails).'
      }),
      Object.freeze({
        id: 'chk-relationship',
        label: 'Relationship explained?',
        description: 'The response explains that the threat exploits the vulnerability.'
      }),
      Object.freeze({
        id: 'chk-northbank',
        label: 'Applied to Northbank?',
        description: 'The response mentions Northbank staff, systems or data specifically.'
      }),
      Object.freeze({
        id: 'chk-consequence',
        label: 'Consequence described?',
        description: 'The response describes a likely incident outcome (e.g. stolen credentials).'
      }),
      Object.freeze({
        id: 'chk-command',
        label: 'Answered the command word?',
        description: 'The response explains how and why, not just lists terms.'
      })
    ]),
    maxAwardedMarks: 6
  });
})(window);
