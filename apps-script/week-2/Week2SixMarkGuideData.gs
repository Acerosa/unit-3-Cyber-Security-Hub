/**
 * Week 2 six-mark response guidance pack.
 */

var WEEK2_PACK_SIX_MARK_GUIDE = Object.freeze({
  meta: {
    activityId: 'week2-six-mark-response-guide',
    activityName: 'Six-Mark Response Guide',
    weekNumber: 2,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Exam skills',
    activityVersion: '1.0',
    maximumScore: 3,
    allowsPartner: false,
    enabled: true,
    componentId: 'exam-guide',
    introduction: 'Learn how to build a six-mark explain response using point, explanation and contextual link, then complete three knowledge-check items.',
    completionMessage: 'Use the same structure in the OCR-style practice question that follows.'
  },
  sections: [
    {
      sectionId: 'W2PEC-INTRO',
      sectionType: 'learning',
      title: 'Building a six-mark response',
      displayOrder: 1,
      feedbackTiming: 'none',
      contentBlocks: [
        {
          blockId: 'W2PEC-B1',
          blockType: 'information',
          heading: 'Point · Explanation · Contextual link',
          content: 'Name the point, explain it, then link it to the Northbank context.',
          displayOrder: 1
        },
        {
          blockId: 'W2PEC-B2',
          blockType: 'information',
          heading: 'Model question',
          content: 'Explain how a phishing attack could lead to a cyber security incident at Northbank Community Health Partnership. In your answer, refer to threats, vulnerabilities and the impact on confidentiality. [6 marks]',
          displayOrder: 2
        },
        {
          blockId: 'W2PEC-B3',
          blockType: 'worked-example',
          heading: 'Weak response',
          content: 'Phishing is bad and staff should not click links. Northbank uses computers so they could get hacked.',
          displayOrder: 3
        },
        {
          blockId: 'W2PEC-B4',
          blockType: 'tip',
          heading: 'Why the weak response scores poorly',
          content: 'It lists ideas without explaining how the threat exploits the vulnerability or linking clearly to Northbank.',
          displayOrder: 4
        },
        {
          blockId: 'W2PEC-B5',
          blockType: 'model-answer',
          heading: 'Improved response',
          content: 'A phishing email is a threat because a social engineer attempts to deceive staff. At Northbank, a human vulnerability exists when reception staff trust a fake payroll email without verifying the sender. The phisher exploits this weakness to steal login credentials, causing unauthorised access to internal systems. This affects confidentiality because patient or staff data could be viewed by someone who is not authorised.',
          displayOrder: 5
        },
        {
          blockId: 'W2PEC-B6',
          blockType: 'checklist',
          heading: 'What good looks like',
          content: 'Name the threat.\nName the vulnerability.\nExplain exploitation.\nApply to Northbank.\nExplain a likely consequence.\nAvoid a disconnected list of facts.',
          displayOrder: 6
        }
      ],
      questions: []
    },
    {
      sectionId: 'W2PEC-ASSESSMENT',
      sectionType: 'assessment',
      title: 'Knowledge check',
      displayOrder: 2,
      feedbackTiming: 'section',
      contentBlocks: [],
      questions: [
        {
          questionId: 'PEC-Q1',
          questionType: 'single-choice',
          prompt: 'In a six-mark explain response, what should the Point (P) do first?',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 1,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'Describe Northbank\'s location and size'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'State a clear cyber security point that answers the command word'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'List every type of malware'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'Copy the question wording without adding detail'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 exam skills',
          difficulty: 'exam-skills'
        },
        {
          questionId: 'PEC-Q2',
          questionType: 'single-choice',
          prompt: 'What belongs in the Explanation (E) part of PEC?',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 2,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'A bullet list of unrelated acronyms'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'How or why the point is true — e.g. threat exploits vulnerability'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'Your personal opinion about the NHS'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'A request for the examiner to mark leniently'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 exam skills',
          difficulty: 'exam-skills'
        },
        {
          questionId: 'PEC-Q3',
          questionType: 'single-choice',
          prompt: 'Why is a contextual link essential for full marks at Northbank?',
          instruction: 'Select the best answer.',
          marks: 1,
          required: true,
          displayOrder: 3,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'A',
              displayOrder: 1,
              text: 'It replaces the need to define threats and vulnerabilities'
            },
            {
              optionId: 'B',
              displayOrder: 2,
              text: 'It shows you can apply general cyber security knowledge to the organisation in the question'
            },
            {
              optionId: 'C',
              displayOrder: 3,
              text: 'It is only needed for two-mark questions'
            },
            {
              optionId: 'D',
              displayOrder: 4,
              text: 'It means you can ignore the command word'
            }
          ],
          commandWord: 'Identify',
          specificationReference: 'LO2 exam skills',
          difficulty: 'exam-skills'
        }
      ]
    },
    {
      sectionId: 'W2PEC-REVIEW',
      sectionType: 'reflection',
      title: 'Review',
      displayOrder: 3,
      feedbackTiming: 'final',
      contentBlocks: [
        {
          blockId: 'W2PEC-REV-1',
          blockType: 'checklist',
          heading: 'Before you finish',
          content: 'Check any incorrect answers and note one term or idea to revisit.',
          displayOrder: 1
        }
      ],
      questions: []
    }
  ],
  assessment: {
    'PEC-Q1': {
      correctOptionId: 'B',
      explanation: 'Start with a direct point — name the threat, vulnerability, relationship or incident outcome.',
      misconceptionFeedback: 'Start with a direct point — name the threat, vulnerability, relationship or incident outcome.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'PEC-Q2': {
      correctOptionId: 'B',
      explanation: 'Explanation develops the point — define, describe the mechanism or show cause and effect.',
      misconceptionFeedback: 'Explanation develops the point — define, describe the mechanism or show cause and effect.',
      autoMark: true,
      scoringMode: 'objective'
    },
    'PEC-Q3': {
      correctOptionId: 'B',
      explanation: 'OCR expects application — link your point to Northbank staff, systems or data to show understanding in context.',
      misconceptionFeedback: 'OCR expects application — link your point to Northbank staff, systems or data to show understanding in context.',
      autoMark: true,
      scoringMode: 'objective'
    }
  },
  tutorData: {
    examQuestion: {
      commandWord: 'Explain',
      marks: 6,
      text: 'Explain how a phishing attack could lead to a cyber security incident at Northbank Community Health Partnership. In your answer, refer to threats, vulnerabilities and the impact on confidentiality. [6 marks]'
    },
    weakResponse: 'Phishing is bad and staff should not click links. Northbank uses computers so they could get hacked.',
    improvedResponse: 'A phishing email is a threat because a social engineer attempts to deceive staff. At Northbank, a human vulnerability exists when reception staff trust a fake payroll email without verifying the sender. The phisher exploits this weakness to steal login credentials, causing unauthorised access to internal systems. This affects confidentiality because patient or staff data could be viewed by someone who is not authorised.',
    modelAnswer: [
      {
        part: 'Point 1',
        text: 'Phishing is a threat — a social engineer sends a deceptive email attempting to obtain credentials.',
        annotation: 'P — names the threat clearly'
      },
      {
        part: 'Explanation 1',
        text: 'The threat exploits a human behaviour vulnerability when staff trust the message and click a link without checking the sender.',
        annotation: 'E — explains threat exploits vulnerability'
      },
      {
        part: 'Contextual link 1',
        text: 'At Northbank, reception staff who confirm login details via a fake payroll email give an attacker access to internal systems.',
        annotation: 'C — applied to Northbank'
      },
      {
        part: 'Point 2',
        text: 'The likely incident is credential theft leading to unauthorised access.',
        annotation: 'P — names the incident outcome'
      },
      {
        part: 'Explanation 2',
        text: 'Unauthorised access means someone without permission can view or obtain sensitive records.',
        annotation: 'E — explains confidentiality impact'
      },
      {
        part: 'Contextual link 2',
        text: 'This affects confidentiality at Northbank because patient appointment or contact details could be exposed.',
        annotation: 'C — Northbank-specific CIA impact'
      }
    ],
    sentenceStarters: [
      'A [threat type] is a threat because…',
      'The vulnerability at Northbank is… because…',
      'The threat exploits this vulnerability by…',
      'This could lead to [incident] which affects [CIA aim] because…',
      'At Northbank, this matters because…'
    ],
    structure: {
      title: 'Point – Explanation – Contextual link (PEC)',
      points: [
        {
          letter: 'P',
          name: 'Point',
          description: 'State a clear cyber security point that directly answers the command word — name the threat, vulnerability or relationship.'
        },
        {
          letter: 'E',
          name: 'Explanation',
          description: 'Explain how or why — describe the mechanism (threat exploits vulnerability) or define the term accurately.'
        },
        {
          letter: 'C',
          name: 'Contextual link',
          description: 'Apply your point to Northbank Community Health Partnership — use a realistic example from the scenario or organisation.'
        }
      ]
    }
  }
});
