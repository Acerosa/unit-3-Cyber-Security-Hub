/**
 * Week 6 balanced Discuss response learning.
 */
(function (global) {
  'use strict';

  global.Week6DiscussLearning = Object.freeze({
    activityId: 'week6-discuss-learning',
    activityName: 'Balanced Discuss Response Learning',
    activityVersion: '1.0',
    weekNumber: 6,
    sessionNumber: 2,
    total: 5,
    estimatedMinutes: 25,
    structure: Object.freeze([
      Object.freeze({ id: 'issue', label: 'Issue', description: 'State the decision or tension clearly.' }),
      Object.freeze({
        id: 'supported',
        label: 'Supported consideration',
        description: 'One reason or evidence supporting a position, linked to the scenario.'
      }),
      Object.freeze({
        id: 'competing',
        label: 'Competing consideration',
        description: 'A credible counterpoint from another stakeholder or duty.'
      }),
      Object.freeze({
        id: 'concession',
        label: 'Concession',
        description: 'A fair point accepted from the other side before concluding.'
      }),
      Object.freeze({
        id: 'conclusion',
        label: 'Justified conclusion',
        description: 'A balanced judgement that follows from both sides, not a one-sided slogan.'
      })
    ]),
    scenario:
      'Northbank Community Health Partnership must decide how far to monitor employees after an insider copied patient contact details. A Discuss question asks whether enhanced monitoring is justified.',
    weakResponse: Object.freeze({
      label: 'Weaker Discuss-style response',
      text:
        'Northbank should monitor everyone all the time because insiders are dangerous and the law probably requires it. Monitoring is always ethical if it stops breaches. Any staff who object are hiding something.',
      problems: Object.freeze([
        'Does not state the issue as a balanced decision',
        'Treats legal, ethical and operational points as one vague claim',
        'No competing consideration or concession',
        'Conclusion is one-sided and not justified from evidence'
      ])
    }),
    strongResponse: Object.freeze({
      label: 'Stronger balanced response',
      text:
        'The issue is how far Northbank should monitor staff after an insider copied patient contact details. Enhanced log review may be supported because it could deter repeat misuse and show accountability to customers and the data protection regulator under current United Kingdom data protection legislation. However, employees may argue that continuous monitoring damages trust and adds operational burden if clinic staff fear excessive scrutiny during busy appointments. I accept that some targeted auditing of access to sensitive records is more proportionate than blanket surveillance. Overall, Northbank should favour targeted, transparent monitoring with clear rules rather than unlimited observation, because this balances security with ethical respect for staff and workable day-to-day care delivery.',
      strengths: Object.freeze([
        'States the issue clearly',
        'Develops a supported consideration with scenario and legal link',
        'Includes a competing stakeholder view',
        'Makes an explicit concession',
        'Concludes with a justified, balanced judgement rather than length alone'
      ])
    }),
    knowledgeChecks: Object.freeze([
      Object.freeze({
        id: 'kc1',
        prompt: 'Which element is missing from the weaker response?',
        options: Object.freeze([
          'A competing consideration and concession',
          'The word Northbank',
          'Any mention of employees',
          'A longer conclusion only'
        ]),
        correctIndex: 0,
        explanation:
          'Balanced Discuss answers need a credible counterpoint and a concession, not just a longer one-sided paragraph.'
      }),
      Object.freeze({
        id: 'kc2',
        prompt: 'Why is the stronger response better even though both mention monitoring?',
        options: Object.freeze([
          'It balances supported and competing points before a justified conclusion',
          'It avoids naming any stakeholder',
          'It claims legal compliance removes all ethical doubt',
          'It is better only because it is longer'
        ]),
        correctIndex: 0,
        explanation: 'Balance and structure earn credit, not word count alone.'
      }),
      Object.freeze({
        id: 'kc3',
        prompt: 'Where does the stronger response link statute to duty?',
        options: Object.freeze([
          'Accountability to customers and the data protection regulator under current United Kingdom data protection legislation',
          'Police and Justice Act 2006 amendments on marketing emails only',
          'Computer Misuse Act 1990 removing all privacy rights',
          'It does not mention law at all'
        ]),
        correctIndex: 0,
        explanation: 'Name the statute and the relevant duty or expectation together.'
      }),
      Object.freeze({
        id: 'kc4',
        prompt: 'Which line best shows a concession?',
        options: Object.freeze([
          'I accept that some targeted auditing of access to sensitive records is more proportionate than blanket surveillance.',
          'Monitoring is always right and opponents are wrong.',
          'The law is irrelevant to Northbank.',
          'Operational costs never matter.'
        ]),
        correctIndex: 0,
        explanation: 'A concession fairly accepts a point from the other side.'
      }),
      Object.freeze({
        id: 'kc5',
        prompt: 'What should a justified conclusion do?',
        options: Object.freeze([
          'Follow from both sides of the argument and state a reasoned overall judgement',
          'Repeat the supported point only',
          'Introduce a new unrelated statute',
          'Ignore operational practicality entirely'
        ]),
        correctIndex: 0,
        explanation:
          'The conclusion should weigh the supported and competing considerations after the concession.'
      })
    ])
  });
})(window);
