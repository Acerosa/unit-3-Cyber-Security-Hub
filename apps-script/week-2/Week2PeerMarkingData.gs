/**
 * Week 2 peer marking and answer improvement pack.
 */

var WEEK2_PACK_PEER_MARKING = Object.freeze({
  meta: {
    activityId: 'week2-peer-marking-answer-improvement',
    activityName: 'Peer Marking and Answer Improvement',
    weekNumber: 2,
    sessionNumber: 2,
    sessionName: 'Session 2',
    activityType: 'Reflection',
    activityVersion: '1.0',
    maximumScore: 6,
    allowsPartner: true,
    enabled: true,
    componentId: 'peer-marking',
    introduction: 'Use the mark scheme and six-point checklist to review a six-mark answer, then improve it. Checklist points are formative review evidence, not a verified exam score.',
    completionMessage: 'Keep one specific improvement target for your next explain response.'
  },
  sections: [
    {
      sectionId: 'W2PM-INTRO',
      sectionType: 'learning',
      title: 'Peer and self-marking instructions',
      displayOrder: 1,
      feedbackTiming: 'none',
      contentBlocks: [
        {
          blockId: 'W2PM-B1',
          blockType: 'information',
          heading: 'Original question',
          content: 'Explain how a phishing attack could lead to a cyber security incident at Northbank Community Health Partnership. In your answer, refer to threats, vulnerabilities and the impact on confidentiality. [6 marks]',
          displayOrder: 1
        },
        {
          blockId: 'W2PM-B2',
          blockType: 'checklist',
          heading: 'Indicative mark scheme',
          content: 'Threat named clearly (e.g. phishing / social engineer sending deceptive email).\nVulnerability named (e.g. staff trust email without verifying sender).\nRelationship explained — threat exploits vulnerability.\nApplied to Northbank (reception, staff, systems or patient data).\nConsequence / incident described (e.g. credential theft, unauthorised access).\nConfidentiality impact explained with reason.',
          displayOrder: 2
        },
        {
          blockId: 'W2PM-B3',
          blockType: 'model-answer',
          heading: 'Model answer focus',
          content: 'A strong answer names a phishing threat, a human vulnerability, explains exploitation, applies the ideas to Northbank, describes a likely incident and addresses confidentiality.',
          displayOrder: 3
        },
        {
          blockId: 'W2PM-B4',
          blockType: 'tip',
          heading: 'Strength and improvement prompts',
          content: 'Strength prompt: What did the answer do well against the checklist?\nImprovement prompt: Which missing checklist point would raise the mark most?\nImproved-answer prompt: Rewrite the response so every checklist point is met.',
          displayOrder: 4
        }
      ],
      questions: []
    },
    {
      sectionId: 'W2PM-CHECKLIST',
      sectionType: 'assessment',
      title: 'Six-point checklist',
      displayOrder: 2,
      feedbackTiming: 'section',
      contentBlocks: [
        {
          blockId: 'W2PM-B5',
          blockType: 'warning',
          heading: 'Score type',
          content: 'Submit the checklist completion total separately from automatically marked quiz scores. Do not treat the peer-awarded mark as a verified examination score.',
          displayOrder: 1
        }
      ],
      questions: [
        {
          questionId: 'CHK-THREAT',
          questionType: 'self-assessment',
          prompt: 'Threat named? — The response identifies phishing or a social engineer as the threat.',
          instruction: 'Mark this checklist item if the reviewed answer meets the criterion.',
          marks: 1,
          required: true,
          displayOrder: 1,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'YES',
              displayOrder: 1,
              text: 'Yes — criterion met'
            },
            {
              optionId: 'NO',
              displayOrder: 2,
              text: 'No — needs improvement'
            }
          ]
        },
        {
          questionId: 'CHK-VULNERABILITY',
          questionType: 'self-assessment',
          prompt: 'Vulnerability named? — The response identifies a human or technical weakness (e.g. trusting emails).',
          instruction: 'Mark this checklist item if the reviewed answer meets the criterion.',
          marks: 1,
          required: true,
          displayOrder: 2,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'YES',
              displayOrder: 1,
              text: 'Yes — criterion met'
            },
            {
              optionId: 'NO',
              displayOrder: 2,
              text: 'No — needs improvement'
            }
          ]
        },
        {
          questionId: 'CHK-RELATIONSHIP',
          questionType: 'self-assessment',
          prompt: 'Relationship explained? — The response explains that the threat exploits the vulnerability.',
          instruction: 'Mark this checklist item if the reviewed answer meets the criterion.',
          marks: 1,
          required: true,
          displayOrder: 3,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'YES',
              displayOrder: 1,
              text: 'Yes — criterion met'
            },
            {
              optionId: 'NO',
              displayOrder: 2,
              text: 'No — needs improvement'
            }
          ]
        },
        {
          questionId: 'CHK-NORTHBANK',
          questionType: 'self-assessment',
          prompt: 'Applied to Northbank? — The response mentions Northbank staff, systems or data specifically.',
          instruction: 'Mark this checklist item if the reviewed answer meets the criterion.',
          marks: 1,
          required: true,
          displayOrder: 4,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'YES',
              displayOrder: 1,
              text: 'Yes — criterion met'
            },
            {
              optionId: 'NO',
              displayOrder: 2,
              text: 'No — needs improvement'
            }
          ]
        },
        {
          questionId: 'CHK-CONSEQUENCE',
          questionType: 'self-assessment',
          prompt: 'Consequence described? — The response describes a likely incident outcome (e.g. stolen credentials).',
          instruction: 'Mark this checklist item if the reviewed answer meets the criterion.',
          marks: 1,
          required: true,
          displayOrder: 5,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'YES',
              displayOrder: 1,
              text: 'Yes — criterion met'
            },
            {
              optionId: 'NO',
              displayOrder: 2,
              text: 'No — needs improvement'
            }
          ]
        },
        {
          questionId: 'CHK-COMMAND',
          questionType: 'self-assessment',
          prompt: 'Answered the command word? — The response explains how and why, not just lists terms.',
          instruction: 'Mark this checklist item if the reviewed answer meets the criterion.',
          marks: 1,
          required: true,
          displayOrder: 6,
          minimumCharacters: 0,
          maximumCharacters: 0,
          minimumSelections: 1,
          maximumSelections: 1,
          options: [
            {
              optionId: 'YES',
              displayOrder: 1,
              text: 'Yes — criterion met'
            },
            {
              optionId: 'NO',
              displayOrder: 2,
              text: 'No — needs improvement'
            }
          ]
        }
      ]
    },
    {
      sectionId: 'W2PM-IMPROVE',
      sectionType: 'assessment',
      title: 'Improve the answer',
      displayOrder: 3,
      feedbackTiming: 'section',
      contentBlocks: [],
      questions: [
        {
          questionId: 'W2PM-STRENGTH',
          questionType: 'reflection',
          prompt: 'WWW: What was done well?',
          instruction: 'Refer to the checklist.',
          marks: 0,
          required: true,
          displayOrder: 1,
          minimumCharacters: 20,
          maximumCharacters: 1200,
          minimumSelections: 0,
          maximumSelections: 0,
          options: []
        },
        {
          questionId: 'W2PM-IMPROVE',
          questionType: 'reflection',
          prompt: 'EBI: What should be improved?',
          instruction: 'Name the highest-value missing checklist point.',
          marks: 0,
          required: true,
          displayOrder: 2,
          minimumCharacters: 20,
          maximumCharacters: 1200,
          minimumSelections: 0,
          maximumSelections: 0,
          options: []
        },
        {
          questionId: 'W2PM-REWRITE',
          questionType: 'reflection',
          prompt: 'Write an improved version of the answer.',
          instruction: 'Aim to meet all six checklist points.',
          marks: 0,
          required: true,
          displayOrder: 3,
          minimumCharacters: 80,
          maximumCharacters: 4000,
          minimumSelections: 0,
          maximumSelections: 0,
          options: []
        }
      ]
    }
  ],
  assessment: {
    'CHK-THREAT': {
      autoMark: false,
      scoringMode: 'completion',
      scoreType: 'peer-checklist',
      explanation: 'The response identifies phishing or a social engineer as the threat.',
      note: 'Learner-awarded peer checklist points are not an objectively verified examination score.'
    },
    'CHK-VULNERABILITY': {
      autoMark: false,
      scoringMode: 'completion',
      scoreType: 'peer-checklist',
      explanation: 'The response identifies a human or technical weakness (e.g. trusting emails).',
      note: 'Learner-awarded peer checklist points are not an objectively verified examination score.'
    },
    'CHK-RELATIONSHIP': {
      autoMark: false,
      scoringMode: 'completion',
      scoreType: 'peer-checklist',
      explanation: 'The response explains that the threat exploits the vulnerability.',
      note: 'Learner-awarded peer checklist points are not an objectively verified examination score.'
    },
    'CHK-NORTHBANK': {
      autoMark: false,
      scoringMode: 'completion',
      scoreType: 'peer-checklist',
      explanation: 'The response mentions Northbank staff, systems or data specifically.',
      note: 'Learner-awarded peer checklist points are not an objectively verified examination score.'
    },
    'CHK-CONSEQUENCE': {
      autoMark: false,
      scoringMode: 'completion',
      scoreType: 'peer-checklist',
      explanation: 'The response describes a likely incident outcome (e.g. stolen credentials).',
      note: 'Learner-awarded peer checklist points are not an objectively verified examination score.'
    },
    'CHK-COMMAND': {
      autoMark: false,
      scoringMode: 'completion',
      scoreType: 'peer-checklist',
      explanation: 'The response explains how and why, not just lists terms.',
      note: 'Learner-awarded peer checklist points are not an objectively verified examination score.'
    },
    'W2PM-STRENGTH': {
      autoMark: false,
      scoringMode: 'completion',
      scoreType: 'peer-review-notes'
    },
    'W2PM-IMPROVE': {
      autoMark: false,
      scoringMode: 'completion',
      scoreType: 'peer-review-notes'
    },
    'W2PM-REWRITE': {
      autoMark: false,
      scoringMode: 'completion',
      scoreType: 'peer-review-notes'
    }
  },
  tutorData: {
    originalQuestion: {
      commandWord: 'Explain',
      marks: 6,
      text: 'Explain how a phishing attack could lead to a cyber security incident at Northbank Community Health Partnership. In your answer, refer to threats, vulnerabilities and the impact on confidentiality. [6 marks]'
    },
    markScheme: [
      'Threat named clearly (e.g. phishing / social engineer sending deceptive email).',
      'Vulnerability named (e.g. staff trust email without verifying sender).',
      'Relationship explained — threat exploits vulnerability.',
      'Applied to Northbank (reception, staff, systems or patient data).',
      'Consequence / incident described (e.g. credential theft, unauthorised access).',
      'Confidentiality impact explained with reason.'
    ],
    checklist: [
      {
        id: 'chk-threat',
        label: 'Threat named?',
        description: 'The response identifies phishing or a social engineer as the threat.'
      },
      {
        id: 'chk-vulnerability',
        label: 'Vulnerability named?',
        description: 'The response identifies a human or technical weakness (e.g. trusting emails).'
      },
      {
        id: 'chk-relationship',
        label: 'Relationship explained?',
        description: 'The response explains that the threat exploits the vulnerability.'
      },
      {
        id: 'chk-northbank',
        label: 'Applied to Northbank?',
        description: 'The response mentions Northbank staff, systems or data specifically.'
      },
      {
        id: 'chk-consequence',
        label: 'Consequence described?',
        description: 'The response describes a likely incident outcome (e.g. stolen credentials).'
      },
      {
        id: 'chk-command',
        label: 'Answered the command word?',
        description: 'The response explains how and why, not just lists terms.'
      }
    ],
    maxAwardedMarks: 6,
    tutorGuidance: 'Use checklist completion for formative evidence. Keep any peer-awarded numeric mark separate from objective quiz scores.'
  }
});
