/**
 * Week 2 Activity 8 — Six-Mark Response Guide content.
 * Tutor: edit model answers, weak/improved examples and knowledge-check questions here.
 */
(function (global) {
  'use strict';

  global.Week2SixMarkGuide = Object.freeze({
    activityId: 'week2-six-mark-response-guide',
    title: 'Six-Mark Response Guide',
    total: 3,
    structure: Object.freeze({
      title: 'Point – Explanation – Contextual link (PEC)',
      points: Object.freeze([
        Object.freeze({
          letter: 'P',
          name: 'Point',
          description:
            'State a clear cyber security point that directly answers the command word — name the threat, vulnerability or relationship.'
        }),
        Object.freeze({
          letter: 'E',
          name: 'Explanation',
          description:
            'Explain how or why — describe the mechanism (threat exploits vulnerability) or define the term accurately.'
        }),
        Object.freeze({
          letter: 'C',
          name: 'Contextual link',
          description:
            'Apply your point to Northbank Community Health Partnership — use a realistic example from the scenario or organisation.'
        })
      ])
    }),
    examQuestion: Object.freeze({
      commandWord: 'Explain',
      marks: 6,
      text:
        'Explain how a phishing attack could lead to a cyber security incident at Northbank Community Health Partnership. In your answer, refer to threats, vulnerabilities and the impact on confidentiality. [6 marks]'
    }),
    weakResponse:
      'Phishing is bad and staff should not click links. Northbank uses computers so they could get hacked.',
    improvedResponse:
      'A phishing email is a threat because a social engineer attempts to deceive staff. At Northbank, a human vulnerability exists when reception staff trust a fake payroll email without verifying the sender. The phisher exploits this weakness to steal login credentials, causing unauthorised access to internal systems. This affects confidentiality because patient or staff data could be viewed by someone who is not authorised.',
    modelAnswer: Object.freeze([
      Object.freeze({
        part: 'Point 1',
        text:
          'Phishing is a threat — a social engineer sends a deceptive email attempting to obtain credentials.',
        annotation: 'P — names the threat clearly'
      }),
      Object.freeze({
        part: 'Explanation 1',
        text:
          'The threat exploits a human behaviour vulnerability when staff trust the message and click a link without checking the sender.',
        annotation: 'E — explains threat exploits vulnerability'
      }),
      Object.freeze({
        part: 'Contextual link 1',
        text:
          'At Northbank, reception staff who confirm login details via a fake payroll email give an attacker access to internal systems.',
        annotation: 'C — applied to Northbank'
      }),
      Object.freeze({
        part: 'Point 2',
        text:
          'The likely incident is credential theft leading to unauthorised access.',
        annotation: 'P — names the incident outcome'
      }),
      Object.freeze({
        part: 'Explanation 2',
        text:
          'Unauthorised access means someone without permission can view or obtain sensitive records.',
        annotation: 'E — explains confidentiality impact'
      }),
      Object.freeze({
        part: 'Contextual link 2',
        text:
          'This affects confidentiality at Northbank because patient appointment or contact details could be exposed.',
        annotation: 'C — Northbank-specific CIA impact'
      })
    ]),
    sentenceStarters: Object.freeze([
      'A [threat type] is a threat because…',
      'The vulnerability at Northbank is… because…',
      'The threat exploits this vulnerability by…',
      'This could lead to [incident] which affects [CIA aim] because…',
      'At Northbank, this matters because…'
    ]),
    questions: Object.freeze([
      Object.freeze({
        id: 'pec-q1',
        prompt: 'In a six-mark explain response, what should the Point (P) do first?',
        options: Object.freeze([
          'Describe Northbank\'s location and size',
          'State a clear cyber security point that answers the command word',
          'List every type of malware',
          'Copy the question wording without adding detail'
        ]),
        correctIndex: 1,
        explanation:
          'Start with a direct point — name the threat, vulnerability, relationship or incident outcome.'
      }),
      Object.freeze({
        id: 'pec-q2',
        prompt: 'What belongs in the Explanation (E) part of PEC?',
        options: Object.freeze([
          'A bullet list of unrelated acronyms',
          'How or why the point is true — e.g. threat exploits vulnerability',
          'Your personal opinion about the NHS',
          'A request for the examiner to mark leniently'
        ]),
        correctIndex: 1,
        explanation:
          'Explanation develops the point — define, describe the mechanism or show cause and effect.'
      }),
      Object.freeze({
        id: 'pec-q3',
        prompt: 'Why is a contextual link essential for full marks at Northbank?',
        options: Object.freeze([
          'It replaces the need to define threats and vulnerabilities',
          'It shows you can apply general cyber security knowledge to the organisation in the question',
          'It is only needed for two-mark questions',
          'It means you can ignore the command word'
        ]),
        correctIndex: 1,
        explanation:
          'OCR expects application — link your point to Northbank staff, systems or data to show understanding in context.'
      })
    ])
  });
})(window);
