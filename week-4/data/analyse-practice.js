/**
 * Week 4 analyse command-word practice and annotated model response.
 */
(function (global) {
  'use strict';

  global.Week4AnalysePractice = Object.freeze({
    activityId: 'week4-analyse-practice',
    activityName: 'From Describe to Analyse',
    activityVersion: '1.0',
    weekNumber: 4,
    sessionNumber: 2,
    total: 6,
    commandWords: Object.freeze({
      describe:
        'Present the main features of something. Separate facts can be enough when the command word is describe.',
      analyse:
        'Examine in detail and state a connection or consequence. Analysis is more than listing motivation, target and method as separate facts.'
    }),
    connectives: Object.freeze(['because', 'which means that', 'as a result', 'therefore']),
    connectiveWarning:
      'Inserting these words does not automatically create analysis. The connection must be logically meaningful.',
    planningQuestion:
      'Why might a small health partnership be a more attractive target than a large hospital trust?',
    planningGuidance:
      'Use only existing Northbank information. If a detail is not in the briefing, stay appropriately general rather than inventing operational facts about either organisation. Sustain one case throughout.',
    planningTemplates: Object.freeze([
      Object.freeze({ id: 'frame', label: 'Writing frame' }),
      Object.freeze({ id: 'table', label: 'Planning table' }),
      Object.freeze({ id: 'mindmap', label: 'Mind map notes' })
    ]),
    writingFrame: Object.freeze([
      'Plausible motivation (why): …',
      'Relevant target (what): …',
      'Appropriate method (how): …',
      'Connection: … because … which means that … As a result … Therefore …'
    ]),
    weakResponse: Object.freeze({
      label: 'Weak (descriptive) response',
      text:
        'A small health partnership might be targeted. The motivation could be income generation. The target could be organisations. The method could be system compromise. Large trusts are bigger.',
      problem:
        'This lists separate facts about motivation, target and method with no sentence connecting them, and it switches comparison focus without sustaining one analytical thread.'
    }),
    improvedResponse: Object.freeze({
      label: 'Improved (analytical) response',
      text:
        'Income generation could motivate an attacker to choose a small health partnership such as Northbank because limited specialist cyber capacity may make recovery slower after system compromise of booking systems, which means that a ransom demand is more likely to succeed. As a result, the organisation becomes an opportunistic target. Therefore the motivation makes the organisational target and encryption-style method a logical combination, rather than a personal grudge against that specific partnership.',
      annotations: Object.freeze([
        'Names a motivation (income generation).',
        'Keeps one case (small health partnership / Northbank) throughout.',
        'Connects organisation characteristics to attacker choice.',
        'Links motivation → target → method with meaningful connectives.',
        'Completes the final connection rather than leaving it implied.'
      ])
    }),
    checklist: Object.freeze([
      'Identify a plausible motivation',
      'Identify the relevant target',
      'Identify an appropriate method',
      'Connect organisation characteristics to the attacker’s choice',
      'Sustain the same case throughout',
      'Complete the final connection explicitly'
    ])
  });
})(window);
