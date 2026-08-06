#!/usr/bin/env node
/**
 * Generate Week 6 Apps Script activity pack .gs files from /tmp/week-6/data/*.js
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const DATA_DIR = '/tmp/week-6/data';
const OUT_DIR = path.resolve('apps-script/week-6');

function loadGlobal(name, file) {
  const code = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const sandbox = { window: {}, global: {} };
  vm.runInNewContext(code, sandbox);
  return sandbox.window[name] || sandbox.global[name];
}

function gsString(s) {
  if (s == null) return '""';
  return JSON.stringify(String(s).replace(/\u2014/g, '-').replace(/—/g, '-'));
}

function gsJson(obj, indent = 2) {
  const raw = JSON.stringify(obj, null, indent);
  return raw.replace(/\u2014/g, '-').replace(/—/g, '-');
}

function writeGs(filename, globalName, pack) {
  const content =
    '/**\n * Week 6 activity pack.\n */\n\nvar ' +
    globalName +
    ' = Object.freeze(' +
    gsJson(pack) +
    ');\n';
  fs.writeFileSync(path.join(OUT_DIR, filename), content, 'utf8');
}

function mcqOptions(options, idPrefix) {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
  return options.map((text, i) => ({
    optionId: letters[i] || idPrefix + '_' + i,
    displayOrder: i + 1,
    text
  }));
}

function correctLetter(correctIndex) {
  return ['a', 'b', 'c', 'd', 'e', 'f'][correctIndex];
}

function buildAssessmentMcq(correctOptionId, explanation, acceptedOptionIds) {
  const fb = explanation || 'Review the teaching content and try again.';
  const a = {
    correctOptionId,
    autoMark: true,
    scoringMode: 'exact',
    explanation: fb,
    feedbackCorrect: 'Correct. ' + fb,
    feedbackIncorrect: fb,
    misconceptionFeedback: fb
  };
  if (acceptedOptionIds) a.acceptedOptionIds = acceptedOptionIds;
  return a;
}

function completionAssessment(explanation) {
  return { autoMark: false, scoringMode: 'completion', explanation: explanation || 'Response recorded.' };
}

function manualAssessment(explanation, markScheme) {
  const a = { autoMark: false, scoringMode: 'manual', explanation: explanation || 'Recorded for review.' };
  if (markScheme) a.markScheme = markScheme;
  return a;
}

function proseQuestion(id, prompt, instruction, marks, displayOrder, minChars, type) {
  return {
    questionId: id,
    questionType: type || 'short-response',
    prompt,
    instruction: instruction || 'Write a clear response using Northbank scenario evidence.',
    marks,
    required: true,
    displayOrder,
    minimumCharacters: minChars,
    maximumCharacters: 3000,
    minimumSelections: 0,
    maximumSelections: 0,
    options: []
  };
}

function mcqQuestion(id, prompt, instruction, marks, displayOrder, options, correctIndex, accepted) {
  const opts = mcqOptions(options);
  return {
    question: {
      questionId: id,
      questionType: 'single-choice',
      prompt,
      instruction: instruction || 'Choose the strongest answer.',
      marks,
      required: true,
      displayOrder,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options: opts
    },
    assessment: buildAssessmentMcq(
      correctLetter(correctIndex),
      '',
      accepted ? accepted.map((i) => correctLetter(i)) : undefined
    )
  };
}

// --- LO2 Diagnostic ---
function buildLo2Diagnostic() {
  const src = loadGlobal('Week6Lo2Diagnostic', 'lo2-diagnostic.js');
  const topicToCode = {
    threats: '2.1',
    vulnerabilities: '2.2',
    attackerTypes: '2.2',
    motivations: '2.3',
    targets: '2.4',
    methods: '2.1',
    impacts: '2.5',
    ethical: '2.6',
    legal: '2.6',
    operational: '2.6'
  };
  const questions = [];
  const assessment = {};
  src.questions.forEach((q, i) => {
    const qid = 'D' + (i + 1);
    const opts = mcqOptions(q.options);
    const correct = correctLetter(q.correctIndex);
    questions.push({
      questionId: qid,
      questionType: 'single-choice',
      prompt: q.prompt,
      instruction: 'LO2 diagnostic retrieval across sections 2.1 to 2.6.',
      marks: 1,
      required: true,
      displayOrder: i + 1,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options: opts
    });
    const expl = q.explanation;
    assessment[qid] = {
      ...buildAssessmentMcq(correct, expl),
      topic: q.topic,
      teachingContentCode: topicToCode[q.topic] || '2.6'
    };
  });

  return {
    meta: {
      activityId: 'week6-lo2-diagnostic',
      activityName: 'LO2 Diagnostic Retrieval',
      weekNumber: 6,
      sessionNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Retrieval quiz',
      activityVersion: '1.0',
      maximumScore: 12,
      allowsPartner: false,
      enabled: true,
      componentId: 'quiz',
      introduction:
        'Formative diagnostic across LO2 sections 2.1 to 2.6. This helps identify revision priorities. It is not an official grade.',
      completionMessage: 'Use your results to prioritise LO2 revision before Session 2.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Diagnostic guidance',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [
          {
            blockId: 'DL1',
            blockType: 'information',
            heading: 'Formative only',
            content: src.formativeNote,
            displayOrder: 1
          }
        ],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'LO2 diagnostic questions',
        displayOrder: 2,
        feedbackTiming: 'section',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: {
      topicLabels: src.topicLabels,
      teachingContentCodes: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6']
    }
  };
}

// --- Ethical Learning ---
function buildEthicalLearning() {
  const src = loadGlobal('Week6EthicalLearning', 'ethical-learning.js');
  const contentBlocks = [
    {
      blockId: 'EOV',
      blockType: 'information',
      heading: 'Overview',
      content: src.overviewNote,
      displayOrder: 0
    }
  ];
  let order = 1;
  src.sections.forEach((sec) => {
    contentBlocks.push({
      blockId: 'EL_' + sec.id,
      blockType: 'information',
      heading: sec.title,
      content:
        sec.content +
        (sec.northbankExample ? ' Northbank example: ' + sec.northbankExample : '') +
        (sec.week3Link ? ' ' + sec.week3Link : ''),
      displayOrder: order++
    });
  });

  const questions = [];
  const assessment = {};
  let qOrder = 1;
  src.sections.forEach((sec) => {
    const qid = sec.check.id.replace(/-/g, '_').toUpperCase();
    const opts = mcqOptions(sec.check.options);
    const correct = correctLetter(sec.check.correctIndex);
    questions.push({
      questionId: qid,
      questionType: 'single-choice',
      prompt: sec.check.prompt,
      instruction: 'Ethical considerations learning check.',
      marks: 1,
      required: true,
      displayOrder: qOrder++,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options: opts
    });
    assessment[qid] = buildAssessmentMcq(correct, sec.check.explanation);
  });
  src.knowledgeCheck.forEach((kc) => {
    const qid = kc.id.toUpperCase();
    const opts = mcqOptions(kc.options);
    questions.push({
      questionId: qid,
      questionType: 'single-choice',
      prompt: kc.prompt,
      instruction: 'Ethical considerations knowledge check.',
      marks: 1,
      required: true,
      displayOrder: qOrder++,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options: opts
    });
    assessment[qid] = buildAssessmentMcq(correctLetter(kc.correctIndex), kc.explanation);
  });

  return {
    meta: {
      activityId: 'week6-ethical-learning',
      activityName: 'Ethical Considerations Learning',
      weekNumber: 6,
      sessionNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Guided learning',
      activityVersion: '1.0',
      maximumScore: 6,
      allowsPartner: false,
      enabled: true,
      componentId: 'guided-learning',
      introduction: src.overviewNote,
      completionMessage: 'Separate ethical judgement from legal duties and operational practicality.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Ethical considerations',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks,
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Knowledge check',
        displayOrder: 2,
        feedbackTiming: 'section',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: { sectionIds: src.sections.map((s) => s.id) }
  };
}

// --- Ethical Classification ---
function buildEthicalClassification() {
  const src = loadGlobal('Week6EthicalClassification', 'ethical-classification.js');
  const catMap = {
    Unethical: 'unethical',
    Unlawful: 'unlawful',
    'Both unethical and unlawful': 'both',
    'Neither unethical nor unlawful': 'neither'
  };
  const options = [
    { optionId: 'unethical', displayOrder: 1, text: 'Unethical' },
    { optionId: 'unlawful', displayOrder: 2, text: 'Unlawful' },
    { optionId: 'both', displayOrder: 3, text: 'Both unethical and unlawful' },
    { optionId: 'neither', displayOrder: 4, text: 'Neither unethical nor unlawful' }
  ];
  const questions = [];
  const assessment = {};
  src.items.forEach((item, i) => {
    const qid = 'E' + (i + 1);
    questions.push({
      questionId: qid,
      questionType: 'single-choice',
      prompt: item.statement,
      instruction: src.instructions.join(' '),
      marks: 1,
      required: true,
      displayOrder: i + 1,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options
    });
    const accepted = item.accepted.map((a) => catMap[a]).filter(Boolean);
    const primary = accepted[0] || 'neither';
    assessment[qid] = {
      correctOptionId: primary,
      acceptedOptionIds: accepted,
      autoMark: true,
      scoringMode: 'exact',
      explanation: item.feedback,
      feedbackCorrect: 'Correct. ' + item.feedback,
      feedbackIncorrect: item.feedback,
      misconceptionFeedback: item.feedback
    };
  });

  return {
    meta: {
      activityId: 'week6-ethical-classification',
      activityName: 'Ethical, Unlawful, Both or Neither',
      weekNumber: 6,
      sessionNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Classification',
      activityVersion: '1.0',
      maximumScore: 8,
      allowsPartner: false,
      enabled: true,
      componentId: 'classification',
      introduction: 'Classify scenarios as unethical, unlawful, both, or neither. Ethics and law are related but not identical.',
      completionMessage: 'Some scenarios need more facts before a firm legal conclusion.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Classification guidance',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [
          {
            blockId: 'ECG',
            blockType: 'information',
            heading: 'Instructions',
            content: src.instructions.join(' '),
            displayOrder: 1
          }
        ],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Classify the scenarios',
        displayOrder: 2,
        feedbackTiming: 'section',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: {
      categories: ['unethical', 'unlawful', 'both', 'neither'],
      tutorReviewFlags: ['legal-plain-language-only']
    }
  };
}

// --- Legislation Learning ---
function buildLegislationLearning() {
  const src = loadGlobal('Week6LegislationLearning', 'legislation-learning.js');
  const contentBlocks = [
    {
      blockId: 'LLN',
      blockType: 'information',
      heading: 'Examination note',
      content: src.teachingNote,
      displayOrder: 0
    }
  ];
  src.laws.forEach((law, i) => {
    contentBlocks.push({
      blockId: 'LL_' + law.id,
      blockType: 'definition',
      heading: law.formalName,
      content:
        'Purpose: ' +
        law.purpose +
        ' Duty or offence: ' +
        law.dutyOffence +
        ' Northbank: ' +
        law.northbankApplication +
        ' ' +
        law.misconception,
      displayOrder: i + 1
    });
  });

  const questions = [];
  const assessment = {};
  src.knowledgeCheck.forEach((kc, i) => {
    const qid = 'LK' + (i + 1);
    const opts = mcqOptions(kc.options);
    questions.push({
      questionId: qid,
      questionType: 'single-choice',
      prompt: kc.prompt,
      instruction: 'Name the legislation and the relevant duty or offence.',
      marks: 1,
      required: true,
      displayOrder: i + 1,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options: opts
    });
    assessment[qid] = buildAssessmentMcq(correctLetter(kc.correctIndex), kc.explanation);
  });

  return {
    meta: {
      activityId: 'week6-legislation-learning',
      activityName: 'United Kingdom Legislation Learning',
      weekNumber: 6,
      sessionNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Guided learning',
      activityVersion: '1.0',
      maximumScore: 6,
      allowsPartner: false,
      enabled: true,
      componentId: 'guided-learning',
      introduction: src.teachingNote,
      completionMessage: 'Keep legislation current. Name the law and the relevant duty or offence.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'United Kingdom legislation',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks,
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Legislation knowledge check',
        displayOrder: 2,
        feedbackTiming: 'section',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: {
      laws: src.laws.map((l) => l.formalName),
      tutorReviewFlags: ['legal-plain-language-only']
    }
  };
}

// --- Legislation Matching ---
function buildLegislationMatching() {
  const src = loadGlobal('Week6LegislationMatching', 'legislation-matching.js');

  function legSlug(leg) {
    if (leg.includes('Computer Misuse')) return 'cma';
    if (leg.includes('data protection')) return 'dp';
    if (leg.includes('Police and Justice')) return 'pja';
    return 'none';
  }
  function dutySlug(duty) {
    if (duty.includes('Unauthorised access')) return 'unauthorised-access';
    if (duty.includes('Unauthorised modification')) return 'unauthorised-modification';
    if (duty.includes('without appropriate security')) return 'processing-without-security';
    if (duty.includes('personal data breach')) return 'breach-handling';
    if (duty.includes('Supplying tools')) return 'supplying-tools';
    return 'not-statute';
  }
  function compoundId(leg, duty) {
    return legSlug(leg) + '__' + dutySlug(duty);
  }

  const allLegs = src.legislationOptions;
  const allDuties = src.dutyOptions;

  const questions = [];
  const assessment = {};

  src.scenarios.forEach((sc, i) => {
    const qid = 'M' + (i + 1);
    const correctId = compoundId(sc.legislation, sc.duty);
    const wrongOptions = new Set();

    // Plausible wrong compounds
    allLegs.forEach((leg) => {
      allDuties.forEach((duty) => {
        const id = compoundId(leg, duty);
        if (id !== correctId) wrongOptions.add(id);
      });
    });

    const wrongArr = Array.from(wrongOptions);
    // Pick 3 plausible wrong options
    const preferredWrong = wrongArr.filter((id) => {
      const [l] = id.split('__');
      const correctLeg = legSlug(sc.legislation);
      return l === correctLeg || l === 'dp' || l === 'cma';
    });
    const selectedWrong = preferredWrong.slice(0, 3);
    while (selectedWrong.length < 3 && wrongArr.length > selectedWrong.length) {
      const next = wrongArr[selectedWrong.length];
      if (!selectedWrong.includes(next)) selectedWrong.push(next);
    }

    function labelFor(id) {
      const [l, d] = id.split('__');
      const legLabels = {
        cma: 'Computer Misuse Act 1990',
        dp: 'Current United Kingdom data protection legislation',
        pja: 'Police and Justice Act 2006 amendments (supplying tools for misuse)',
        none: 'Not primarily a criminal statute scenario'
      };
      const dutyLabels = {
        'unauthorised-access': 'Unauthorised access to computer material',
        'unauthorised-modification': 'Unauthorised modification of computer material',
        'processing-without-security': 'Processing personal data without appropriate security or lawful basis',
        'breach-handling': 'Handling a personal data breach under current duties',
        'supplying-tools': 'Supplying tools knowing they are likely to be used for computer misuse',
        'not-statute': 'Not primarily a criminal statute scenario'
      };
      return legLabels[l] + ': ' + dutyLabels[d];
    }

    const optionIds = [correctId, ...selectedWrong.slice(0, 3)];
    const options = optionIds.map((oid, idx) => ({
      optionId: oid,
      displayOrder: idx + 1,
      text: labelFor(oid)
    }));

    questions.push({
      questionId: qid,
      questionType: 'single-choice',
      prompt: sc.text,
      instruction: 'Select the pairing of legislation and duty that best fits the scenario.',
      marks: 1,
      required: true,
      displayOrder: i + 1,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options
    });
    assessment[qid] = buildAssessmentMcq(correctId, sc.feedback);
  });

  return {
    meta: {
      activityId: 'week6-legislation-matching',
      activityName: 'Legislation Scenario Matching',
      weekNumber: 6,
      sessionNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Classification',
      activityVersion: '1.0',
      maximumScore: 6,
      allowsPartner: false,
      enabled: true,
      componentId: 'classification',
      introduction: 'Match each scenario to the correct legislation and duty pairing. Full credit requires both.',
      completionMessage: 'Do not invent section numbers or notification periods in examination answers.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Matching guidance',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [
          {
            blockId: 'LMG',
            blockType: 'information',
            heading: 'How to match',
            content:
              'Each option combines a statute with a duty or offence. Name both together in examination answers.',
            displayOrder: 1
          }
        ],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Legislation matching',
        displayOrder: 2,
        feedbackTiming: 'section',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: {
      legislationOptions: src.legislationOptions,
      dutyOptions: src.dutyOptions,
      tutorReviewFlags: ['legal-plain-language-only']
    }
  };
}

// --- Operational Considerations ---
function buildOperationalConsiderations() {
  const src = loadGlobal('Week6OperationalConsiderations', 'operational-considerations.js');
  const scoredFields = src.formFields.filter((f) => f.id !== 'measure');
  const questions = [];
  const assessment = {};
  scoredFields.forEach((field, i) => {
    const qid = 'OC' + (i + 1);
    questions.push(
      proseQuestion(qid, field.label + ' ' + src.measurePrompt, 'Operational considerations for Northbank.', 1, i + 1, 20)
    );
    assessment[qid] = completionAssessment('Operational response recorded for review.');
  });

  return {
    meta: {
      activityId: 'week6-operational-considerations',
      activityName: 'Operational Considerations',
      weekNumber: 6,
      sessionNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Scenario mapping',
      activityVersion: '1.0',
      maximumScore: 7,
      allowsPartner: false,
      enabled: true,
      componentId: 'scenario-mapping',
      introduction: src.intro,
      completionMessage: 'A control that is legally allowed may still fail if staff cannot use it effectively.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Operational factors',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [
          {
            blockId: 'OCP',
            blockType: 'scenario',
            heading: 'Northbank scenario',
            content: src.measurePrompt,
            displayOrder: 1
          },
          ...src.factors.map((f, i) => ({
            blockId: 'OCF_' + f.id,
            blockType: 'information',
            heading: f.label,
            content: f.description,
            displayOrder: i + 2
          }))
        ],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Operational analysis',
        displayOrder: 2,
        feedbackTiming: 'none',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: { factors: src.factors.map((f) => f.id) }
  };
}

// --- Government Initiatives ---
function buildGovernmentInitiatives() {
  const src = loadGlobal('Week6GovernmentInitiatives', 'government-initiatives.js');
  const contentBlocks = [
    {
      blockId: 'GIN',
      blockType: 'information',
      heading: 'Teaching note',
      content: src.teachingNote,
      displayOrder: 0
    },
    ...src.initiatives.map((init, i) => ({
      blockId: 'GI_' + init.id,
      blockType: 'definition',
      heading: init.name,
      content: init.purpose,
      displayOrder: i + 1
    }))
  ];
  const questions = [];
  const assessment = {};
  src.comparisonQuiz.forEach((q, i) => {
    const qid = 'GI' + (i + 1);
    const opts = mcqOptions(q.options);
    questions.push({
      questionId: qid,
      questionType: 'single-choice',
      prompt: q.prompt,
      instruction: 'Government initiatives are guidance or programmes, not criminal statutes.',
      marks: 1,
      required: true,
      displayOrder: i + 1,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options: opts
    });
    assessment[qid] = buildAssessmentMcq(correctLetter(q.correctIndex), q.explanation);
  });

  return {
    meta: {
      activityId: 'week6-government-initiatives',
      activityName: 'Government Cyber Security Initiatives',
      weekNumber: 6,
      sessionNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Guided learning',
      activityVersion: '1.0',
      maximumScore: 4,
      allowsPartner: false,
      enabled: true,
      componentId: 'guided-learning',
      introduction: src.teachingNote,
      completionMessage: 'Describe purpose in examination answers. Do not treat guidance as criminal legislation.'
    },
    sections: [
      { sectionId: 'LEARNING', sectionType: 'learning', title: 'Government initiatives', displayOrder: 1, feedbackTiming: 'none', contentBlocks, questions: [] },
      { sectionId: 'ASSESS', sectionType: 'assessment', title: 'Initiative comparison', displayOrder: 2, feedbackTiming: 'section', contentBlocks: [], questions }
    ],
    assessment,
    tutorData: { initiatives: src.initiatives.map((i) => i.name) }
  };
}

// --- NCSC Guidance ---
function buildNcscGuidance() {
  const src = loadGlobal('Week6NcscGuidance', 'ncsc-guidance.js');
  const questions = [];
  const assessment = {};
  src.checklist.forEach((item, i) => {
    const qid = 'NC' + (i + 1);
    questions.push({
      questionId: qid,
      questionType: 'short-response',
      prompt: item.label,
      instruction: 'Confirm after the tutor-facilitated NCSC Exercise in a Box session.',
      marks: 1,
      required: true,
      displayOrder: i + 1,
      minimumCharacters: 8,
      maximumCharacters: 500,
      minimumSelections: 0,
      maximumSelections: 0,
      options: []
    });
    assessment[qid] = completionAssessment('Checklist item recorded.');
  });

  return {
    meta: {
      activityId: 'week6-ncsc-guidance',
      activityName: 'NCSC Exercise in a Box Guidance',
      weekNumber: 6,
      sessionNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Reflection',
      activityVersion: '1.0',
      maximumScore: 4,
      allowsPartner: true,
      enabled: true,
      componentId: 'facilitated-companion',
      introduction: src.intro,
      completionMessage: src.completionNote
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Exercise guidance',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [
          {
            blockId: 'NCE',
            blockType: 'information',
            heading: src.exerciseTitle,
            content:
              'Organisation: ' +
              src.organisation +
              '. Official materials: https://www.ncsc.gov.uk/section/exercise-in-a-box/insider-threat-data-breach. Do not invent staged exercise prompts here.',
            displayOrder: 1
          },
          ...src.guidanceSections.map((g, i) => ({
            blockId: 'NCG' + (i + 1),
            blockType: 'information',
            heading: g.title,
            content: g.text,
            displayOrder: i + 2
          }))
        ],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Exercise checklist',
        displayOrder: 2,
        feedbackTiming: 'none',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: {
      organisation: src.organisation,
      exerciseTitle: src.exerciseTitle,
      ncscUrl: 'https://www.ncsc.gov.uk/section/exercise-in-a-box/insider-threat-data-breach',
      tutorReviewFlags: ['legal-plain-language-only']
    }
  };
}

// --- Exercise Decision Record ---
function buildExerciseDecisionRecord() {
  const src = loadGlobal('Week6ExerciseDecisionRecord', 'exercise-decision-record.js');
  const prompts = [
    { id: 'ED1', prompt: 'Decision 1 title and summary: what was decided or proposed?', min: 25 },
    { id: 'ED2', prompt: 'Decision 1: reason, stakeholder affected, and decision type.', min: 30 },
    { id: 'ED3', prompt: 'Decision 1: ethical, legal (name law and duty) and operational considerations.', min: 40 },
    { id: 'ED4', prompt: 'Decision 2 title and summary: what was decided or proposed?', min: 25 },
    { id: 'ED5', prompt: 'Decision 2: reason, evidence still needed, and reflection after debrief.', min: 30 }
  ];
  const questions = prompts.map((p, i) =>
    proseQuestion(p.id, p.prompt, src.intro, 1, i + 1, p.min, 'extended-response')
  );
  const assessment = {};
  prompts.forEach((p) => {
    assessment[p.id] = completionAssessment('Decision record entry recorded.');
  });

  return {
    meta: {
      activityId: 'week6-exercise-decision-record',
      activityName: 'Exercise Decision Record',
      weekNumber: 6,
      sessionNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Reflection',
      activityVersion: '1.0',
      maximumScore: 5,
      allowsPartner: true,
      enabled: true,
      componentId: 'reflection',
      introduction: src.intro,
      completionMessage: src.reviseNote
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Decision record guidance',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [
          {
            blockId: 'EDG',
            blockType: 'information',
            heading: src.exerciseTitle,
            content:
              src.organisation +
              '. Record what your group actually discussed. Decision types: ' +
              src.decisionTypes.join(', ') +
              '.',
            displayOrder: 1
          }
        ],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Record your decisions',
        displayOrder: 2,
        feedbackTiming: 'none',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: {
      entryFields: src.entryFields.map((f) => f.id),
      decisionTypes: src.decisionTypes,
      minDecisions: src.minDecisions,
      tutorReviewFlags: ['legal-plain-language-only']
    }
  };
}

// --- Session 1 Review ---
function buildSession1Review() {
  const src = loadGlobal('Week6Session1Review', 'session1-review.js');
  const questions = [];
  const assessment = {};
  src.questions.forEach((q, i) => {
    const qid = 'R' + (i + 1);
    const opts = mcqOptions(q.options);
    questions.push({
      questionId: qid,
      questionType: 'single-choice',
      prompt: q.prompt,
      instruction: 'Distinguish legal obligation, ethical choice and operational judgement.',
      marks: 1,
      required: true,
      displayOrder: i + 1,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options: opts
    });
    assessment[qid] = buildAssessmentMcq(correctLetter(q.correctIndex), q.explanation);
  });

  return {
    meta: {
      activityId: 'week6-session1-review',
      activityName: 'Session 1 Review',
      weekNumber: 6,
      sessionNumber: 1,
      sessionName: 'Session 1',
      activityType: 'Retrieval quiz',
      activityVersion: '1.0',
      maximumScore: 3,
      allowsPartner: false,
      enabled: true,
      componentId: 'quiz',
      introduction: src.intro,
      completionMessage: 'Keep legal, ethical and operational dimensions separate in examination answers.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Session 1 review',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [{ blockId: 'SR1', blockType: 'information', heading: 'Review focus', content: src.intro, displayOrder: 1 }],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Review questions',
        displayOrder: 2,
        feedbackTiming: 'section',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: {}
  };
}

// --- Legislation Retrieval ---
function buildLegislationRetrieval() {
  const src = loadGlobal('Week6LegislationRetrieval', 'legislation-retrieval.js');
  const questions = [];
  const assessment = {};
  src.questions.forEach((q, i) => {
    const qid = 'LR' + (i + 1);
    const opts = mcqOptions(q.options);
    questions.push({
      questionId: qid,
      questionType: 'single-choice',
      prompt: q.prompt,
      instruction: 'Session 2 legislation retrieval.',
      marks: 1,
      required: true,
      displayOrder: i + 1,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options: opts
    });
    assessment[qid] = buildAssessmentMcq(correctLetter(q.correctIndex), q.explanation);
  });

  return {
    meta: {
      activityId: 'week6-legislation-retrieval',
      activityName: 'Legislation Retrieval Quiz',
      weekNumber: 6,
      sessionNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Retrieval quiz',
      activityVersion: '1.0',
      maximumScore: 10,
      allowsPartner: false,
      enabled: true,
      componentId: 'quiz',
      introduction: 'Retrieve Week 6 legislation, ethics and operational ideas before debate and OCR practice.',
      completionMessage: 'Name statutes with duties or offences together in examination answers.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Retrieval focus',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [
          {
            blockId: 'LRL',
            blockType: 'information',
            heading: 'Legislation reminder',
            content:
              'Computer Misuse Act 1990; current United Kingdom data protection legislation; Police and Justice Act 2006 amendments (supplying tools for misuse).',
            displayOrder: 1
          }
        ],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Legislation retrieval questions',
        displayOrder: 2,
        feedbackTiming: 'section',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: { tutorReviewFlags: ['legal-plain-language-only'] }
  };
}

// --- Employee Monitoring ---
function buildEmployeeMonitoring() {
  const src = loadGlobal('Week6EmployeeMonitoring', 'employee-monitoring.js');
  const questions = [
    {
      questionId: 'EM0',
      questionType: 'single-choice',
      prompt: 'Select the stakeholder role you are preparing to represent in debate.',
      instruction: src.instructions,
      marks: 1,
      required: true,
      displayOrder: 1,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options: src.stakeholderRoles.map((r, i) => ({
        optionId: r.id,
        displayOrder: i + 1,
        text: r.label
      }))
    },
    ...src.fields.map((f, i) =>
      proseQuestion('EM' + (i + 1), f.label, src.instructions, 1, i + 2, f.minLength, 'extended-response')
    )
  ];
  const assessment = {
    EM0: completionAssessment('Stakeholder role recorded.'),
    ...Object.fromEntries(src.fields.map((f, i) => ['EM' + (i + 1), completionAssessment('Debate preparation recorded.')]))
  };

  return {
    meta: {
      activityId: 'week6-employee-monitoring',
      activityName: 'Northbank Employee Monitoring Scenario',
      weekNumber: 6,
      sessionNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Scenario mapping',
      activityVersion: '1.0',
      maximumScore: 6,
      allowsPartner: false,
      enabled: true,
      componentId: 'scenario-mapping',
      introduction: src.scenario,
      completionMessage: 'This prepares a stakeholder position for debate, not a final organisational decision.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Scenario and prompts',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [
          { blockId: 'EMS', blockType: 'scenario', heading: 'Northbank insider breach', content: src.scenario, displayOrder: 1 },
          ...src.promptGroups.map((g, i) => ({
            blockId: 'EMP_' + g.id,
            blockType: 'information',
            heading: g.label,
            content: g.questions.join(' '),
            displayOrder: i + 2
          })),
          {
            blockId: 'EMSS',
            blockType: 'information',
            heading: 'Sentence starters',
            content: src.sentenceStarters.join(' '),
            displayOrder: 10
          }
        ],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Stakeholder position',
        displayOrder: 2,
        feedbackTiming: 'none',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: {
      stakeholderRoles: src.stakeholderRoles.map((r) => r.id),
      sentenceStarters: src.sentenceStarters,
      tutorReviewFlags: ['legal-plain-language-only']
    }
  };
}

// --- Stakeholder Debate ---
function buildStakeholderDebate() {
  const src = loadGlobal('Week6StakeholderDebate', 'stakeholder-debate.js');
  const questions = [
    proseQuestion(
      'SD0',
      'Your participation role in the debate (speaker, recorder or evidence checker)',
      'Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.',
      1,
      1,
      3,
      'short-response'
    ),
    ...src.fields.map((f, i) =>
      proseQuestion(
        'SD' + (i + 1),
        f.label,
        'Prepare structured arguments for classroom debate. Completion checks field presence, not automatic quality scoring.',
        1,
        i + 2,
        f.minLength,
        i >= 6 ? 'extended-response' : 'short-response'
      )
    )
  ];
  const assessment = {};
  questions.forEach((q) => {
    assessment[q.questionId] = completionAssessment('Debate preparation recorded.');
  });

  return {
    meta: {
      activityId: 'week6-stakeholder-debate',
      activityName: 'Stakeholder Debate Preparation',
      weekNumber: 6,
      sessionNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Discussion',
      activityVersion: '1.0',
      maximumScore: 10,
      allowsPartner: true,
      enabled: true,
      componentId: 'discussion',
      introduction: src.scenario,
      completionMessage: 'Debate outcome is a classroom recommendation, not a hub organisational decision.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Debate structure',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [
          { blockId: 'SDS', blockType: 'scenario', heading: 'Debate scenario', content: src.scenario, displayOrder: 1 },
          {
            blockId: 'SDR',
            blockType: 'information',
            heading: 'Participation roles',
            content: src.participationRoles.map((r) => r.label + ': ' + r.description).join(' '),
            displayOrder: 2
          },
          {
            blockId: 'SDST',
            blockType: 'information',
            heading: 'Stakeholder roles',
            content: src.stakeholderRoles.join(', '),
            displayOrder: 3
          }
        ],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Debate preparation',
        displayOrder: 2,
        feedbackTiming: 'none',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: {
      participationRoles: src.participationRoles.map((r) => r.id),
      stakeholderRoles: src.stakeholderRoles,
      tutorReviewFlags: ['legal-plain-language-only']
    }
  };
}

// --- Discuss Learning ---
function buildDiscussLearning() {
  const src = loadGlobal('Week6DiscussLearning', 'discuss-learning.js');
  const contentBlocks = [
    { blockId: 'DLSC', blockType: 'scenario', heading: 'Northbank monitoring scenario', content: src.scenario, displayOrder: 1 },
    {
      blockId: 'DLST',
      blockType: 'information',
      heading: 'Balanced Discuss structure',
      content: src.structure.map((s) => s.label + ': ' + s.description).join(' '),
      displayOrder: 2
    },
    {
      blockId: 'DLWK',
      blockType: 'example',
      heading: src.weakResponse.label,
      content: src.weakResponse.text + ' Problems: ' + src.weakResponse.problems.join('; ') + '.',
      displayOrder: 3
    },
    {
      blockId: 'DLST2',
      blockType: 'worked-example',
      heading: src.strongResponse.label,
      content: src.strongResponse.text,
      displayOrder: 4
    }
  ];
  const questions = [];
  const assessment = {};
  src.knowledgeChecks.forEach((kc, i) => {
    const qid = 'DL' + (i + 1);
    const opts = mcqOptions(kc.options);
    questions.push({
      questionId: qid,
      questionType: 'single-choice',
      prompt: kc.prompt,
      instruction: 'Balanced Discuss response learning check.',
      marks: 1,
      required: true,
      displayOrder: i + 1,
      minimumCharacters: 0,
      maximumCharacters: 0,
      minimumSelections: 0,
      maximumSelections: 1,
      options: opts
    });
    assessment[qid] = buildAssessmentMcq(correctLetter(kc.correctIndex), kc.explanation);
  });

  return {
    meta: {
      activityId: 'week6-discuss-learning',
      activityName: 'Balanced Discuss Response Learning',
      weekNumber: 6,
      sessionNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Guided learning',
      activityVersion: '1.0',
      maximumScore: 5,
      allowsPartner: false,
      enabled: true,
      componentId: 'guided-learning',
      introduction: 'Learn how to structure a balanced Discuss answer with competing considerations and concessions.',
      completionMessage: 'Balance and structure earn credit, not word count alone.'
    },
    sections: [
      { sectionId: 'LEARNING', sectionType: 'learning', title: 'Discuss structure', displayOrder: 1, feedbackTiming: 'none', contentBlocks, questions: [] },
      { sectionId: 'ASSESS', sectionType: 'assessment', title: 'Knowledge check', displayOrder: 2, feedbackTiming: 'section', contentBlocks: [], questions }
    ],
    assessment,
    tutorData: { structure: src.structure.map((s) => s.id), strengths: src.strongResponse.strengths }
  };
}

// --- Discuss Planner ---
function buildDiscussPlanner() {
  const src = loadGlobal('Week6DiscussPlanner', 'discuss-planner.js');
  const prompts = [
    { id: 'DP1', label: src.issuePrompt, min: 20 },
    { id: 'DP2', label: src.columns[0].label + ': ' + src.columns[0].description, min: src.columns[0].minLength },
    { id: 'DP3', label: src.columns[1].label + ': ' + src.columns[1].description, min: src.columns[1].minLength },
    { id: 'DP4', label: 'Concession (' + src.concessionLabel + ')', min: 20 },
    { id: 'DP5', label: 'Justified conclusion', min: 20 },
    { id: 'DP6', label: 'Named stakeholder and scenario evidence used in your plan', min: 15 }
  ];
  const questions = prompts.map((p, i) =>
    proseQuestion(p.id, p.label, src.scenario, 1, i + 1, p.min, 'extended-response')
  );
  const assessment = {};
  prompts.forEach((p) => {
    assessment[p.id] = completionAssessment('Discuss planner entry recorded.');
  });

  return {
    meta: {
      activityId: 'week6-discuss-planner',
      activityName: 'Discuss Response Planner',
      weekNumber: 6,
      sessionNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Exam skills',
      activityVersion: '1.0',
      maximumScore: 6,
      allowsPartner: false,
      enabled: true,
      componentId: 'exam-skills',
      introduction: src.scenario,
      completionMessage: 'Use the planner before timed OCR-style Discuss questions.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Planner scaffolding',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [
          { blockId: 'DPSC', blockType: 'scenario', heading: 'Scenario', content: src.scenario, displayOrder: 1 },
          {
            blockId: 'DPSS',
            blockType: 'information',
            heading: 'Sentence starters',
            content: src.sentenceStarters.join(' '),
            displayOrder: 2
          }
        ],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Plan your Discuss answer',
        displayOrder: 2,
        feedbackTiming: 'none',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: { concessionLabel: src.concessionLabel, columns: src.columns.map((c) => c.id) }
  };
}

// --- OCR Practice ---
function buildOcrPractice() {
  const src = loadGlobal('Week6OcrPractice', 'ocr-practice.js');
  const contentBlocks = [
    {
      blockId: 'OCRSC',
      blockType: 'scenario',
      heading: 'Northbank scenario',
      content: src.northbankScenario,
      displayOrder: 1
    },
    {
      blockId: 'OCRR',
      blockType: 'information',
      heading: 'Reminders',
      content: src.beforeReminders.join(' '),
      displayOrder: 2
    },
    {
      blockId: 'OCRN',
      blockType: 'information',
      heading: 'Timing',
      content: src.timingGuidance + ' These are OCR-style practice questions, not official OCR examination questions.',
      displayOrder: 3
    }
  ];
  const questions = [];
  const assessment = {};
  let order = 1;
  src.questions.forEach((q) => {
    const qid = q.id.toUpperCase().replace(/-/g, '_');
    if (q.responseType === 'mcq') {
      questions.push({
        questionId: qid,
        questionType: 'single-choice',
        prompt: q.prompt,
        instruction: 'OCR-style practice - ' + q.commandWord + ' (' + q.marks + ' mark' + (q.marks > 1 ? 's' : '') + '). ' + (q.guidance || ''),
        marks: q.marks,
        required: true,
        displayOrder: order++,
        minimumCharacters: 0,
        maximumCharacters: 0,
        minimumSelections: 0,
        maximumSelections: 1,
        options: q.options.map((o, i) => ({ optionId: o.id, displayOrder: i + 1, text: o.text }))
      });
      assessment[qid] = {
        ...buildAssessmentMcq(q.correctOptionId, (q.markScheme || []).join(' ')),
        markScheme: q.markScheme
      };
    } else {
      questions.push({
        questionId: qid,
        questionType: 'extended-response',
        prompt: q.prompt,
        instruction: 'OCR-style practice - ' + q.commandWord + ' (' + q.marks + ' marks). ' + (q.guidance || ''),
        marks: q.marks,
        required: true,
        displayOrder: order++,
        minimumCharacters: q.marks >= 6 ? 80 : q.marks >= 4 ? 50 : q.marks >= 3 ? 40 : 20,
        maximumCharacters: 3000,
        minimumSelections: 0,
        maximumSelections: 0,
        options: []
      });
      assessment[qid] = manualAssessment(
        'OCR-style marking guidance (not an official OCR mark scheme).',
        q.markScheme
      );
    }
  });

  return {
    meta: {
      activityId: 'week6-ocr-question-practice',
      activityName: 'OCR-Style Timed Questions',
      weekNumber: 6,
      sessionNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Exam skills',
      activityVersion: '1.0',
      maximumScore: 20,
      allowsPartner: false,
      enabled: true,
      componentId: 'ocr-practice',
      introduction:
        'Timed OCR-style practice questions. These are not official OCR examination questions. Suggested time: about ' +
        src.suggestedMinutes +
        ' minutes.',
      completionMessage: 'Mark schemes and indicative content are for formative practice only.'
    },
    sections: [
      { sectionId: 'LEARNING', sectionType: 'learning', title: 'Before you begin', displayOrder: 1, feedbackTiming: 'none', contentBlocks, questions: [] },
      { sectionId: 'ASSESS', sectionType: 'assessment', title: 'OCR-style questions', displayOrder: 2, feedbackTiming: 'none', contentBlocks: [], questions }
    ],
    assessment,
    tutorData: {
      disclaimer: 'Formative OCR-style practice - not official OCR examination questions.',
      suggestedMinutes: src.suggestedMinutes
    }
  };
}

// --- Answer Improvement ---
function buildAnswerImprovement() {
  const src = loadGlobal('Week6AnswerImprovement', 'answer-improvement.js');
  const prompts = [
    { id: 'AI1', prompt: 'Identify the dominant weaknesses in the sample response.', min: 25 },
    { id: 'AI2', prompt: src.rewritePrompt, min: 30 },
    { id: 'AI3', prompt: 'Add a competing consideration from another stakeholder.', min: 25 },
    { id: 'AI4', prompt: 'Add a labelled concession before your conclusion.', min: 20 },
    { id: 'AI5', prompt: src.improvePrompt, min: 50 },
    { id: 'AI6', prompt: src.nextActionPrompt, min: 15 }
  ];
  const questions = prompts.map((p, i) =>
    proseQuestion(p.id, p.prompt, 'Self marking against Discuss criteria.', 1, i + 1, p.min, i >= 4 ? 'extended-response' : 'short-response')
  );
  const assessment = {};
  prompts.forEach((p) => {
    assessment[p.id] = completionAssessment('Self-assessment response recorded.');
  });

  return {
    meta: {
      activityId: 'week6-answer-improvement',
      activityName: 'Marking and Answer Improvement',
      weekNumber: 6,
      sessionNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Self marking',
      activityVersion: '1.0',
      maximumScore: 6,
      allowsPartner: false,
      enabled: true,
      componentId: 'self-marking',
      introduction: src.commonError,
      completionMessage: src.modelAfterSubmit
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'Sample response',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: [
          {
            blockId: 'AIQ',
            blockType: 'information',
            heading: src.question.commandWord + ' (' + src.question.marks + ' marks)',
            content: src.question.prompt,
            displayOrder: 1
          },
          {
            blockId: 'AIS',
            blockType: 'example',
            heading: 'Sample response',
            content: src.sampleResponse.text,
            displayOrder: 2
          },
          {
            blockId: 'AIE',
            blockType: 'information',
            heading: 'Dominant issues',
            content: src.dominantIssues.join(' '),
            displayOrder: 3
          }
        ],
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Mark and improve',
        displayOrder: 2,
        feedbackTiming: 'none',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: {
      commonError: src.commonError,
      markSchemePoints: src.markSchemePoints,
      modelAfterSubmit: src.modelAfterSubmit,
      tutorReviewFlags: ['legal-plain-language-only']
    }
  };
}

// --- Revision Organiser ---
function buildRevisionOrganiser() {
  const src = loadGlobal('Week6RevisionOrganiser', 'revision-organiser.js');
  const questions = src.sections.map((sec, i) =>
    proseQuestion(
      'RO' + (i + 1),
      sec.code + ' ' + sec.title + ': summarise secure topics, revision needs, key terminology, one misconception, one Northbank example and one practice question.',
      'LO2 revision organiser across sections 2.1 to 2.6.',
      1,
      i + 1,
      40,
      'extended-response'
    )
  );
  const assessment = {};
  src.sections.forEach((_, i) => {
    assessment['RO' + (i + 1)] = completionAssessment('Revision organiser entry recorded.');
  });

  return {
    meta: {
      activityId: 'week6-revision-organiser',
      activityName: 'LO2 Revision Organiser',
      weekNumber: 6,
      sessionNumber: 2,
      sessionName: 'Session 2',
      activityType: 'Reflection',
      activityVersion: '1.0',
      maximumScore: 6,
      allowsPartner: false,
      enabled: true,
      componentId: 'reflection',
      introduction: 'Organise LO2 revision priorities across sections 2.1 to 2.6 using diagnostic results where available.',
      completionMessage: 'Set revision priorities for your next study session.'
    },
    sections: [
      {
        sectionId: 'LEARNING',
        sectionType: 'learning',
        title: 'LO2 sections',
        displayOrder: 1,
        feedbackTiming: 'none',
        contentBlocks: src.sections.map((sec, i) => ({
          blockId: 'ROS_' + sec.id,
          blockType: 'information',
          heading: sec.code + ' ' + sec.title,
          content: sec.fields.map((f) => f.label).join('; '),
          displayOrder: i + 1
        })),
        questions: []
      },
      {
        sectionId: 'ASSESS',
        sectionType: 'assessment',
        title: 'Revision organiser',
        displayOrder: 2,
        feedbackTiming: 'none',
        contentBlocks: [],
        questions
      }
    ],
    assessment,
    tutorData: {
      diagnosticDraftKey: src.diagnosticDraftKey,
      sections: src.sections.map((s) => s.code),
      weakestFields: src.weakestFields,
      priorityFields: src.priorityFields
    }
  };
}

// --- Guidance ---
function buildGuidance() {
  const directed = loadGlobal('Week6DirectedStudy', 'directed-study.js');
  const support = loadGlobal('Week6SupportChallenge', 'support-challenge.js');

  return {
    weekNumber: 6,
    weekTitle: 'Ethical, Legal and Operational Considerations',
    loReference: 'LO2 - Understand the issues surrounding cyber security',
    teachingContent: '2.6 Other considerations (ethical, legal, operational, government initiatives)',
    organisation: 'Northbank Community Health Partnership',
    learningOutcomes: [
      'Explain ethical considerations including responsible disclosure, employee monitoring and ethical hacking boundaries.',
      'Name United Kingdom legislation and link each statute to a relevant duty or offence.',
      'Explain operational considerations including cost, staff time, downtime, usability and productivity.',
      'Describe United Kingdom government cyber security initiatives and distinguish guidance from legislation.',
      'Separate legal obligations, ethical choices and operational judgements in Northbank scenarios.',
      'Structure balanced Discuss answers with competing considerations and concessions.'
    ],
    examinationFocus: [
      'Name statutes with duties or offences together where law is required.',
      'Separate ethical, legal and operational points.',
      'Use Northbank scenario evidence. Do not import unrelated incidents.',
      'Discuss questions need a competing consideration, concession and justified conclusion.',
      'Do not invent DPA section numbers, notification periods or penalty amounts.',
      'Government initiatives are guidance, not criminal statutes.'
    ],
    session1Summary:
      'LO2 diagnostic, ethical and legislation learning, classification and matching, operational considerations, government initiatives, NCSC Exercise in a Box insider threat companion and decision record.',
    session2Summary:
      'Legislation retrieval, employee monitoring and stakeholder debate, Discuss learning and planner, OCR-style timed questions, answer improvement and LO2 revision organiser.',
    directedStudySummary:
      'Cisco governance and compliance; TryHackMe ISO 27001 and Legal Considerations in DFIR; NCSC Cyber Essentials and 10 Steps research.',
    platforms: {
      session1: {
        name: 'NCSC Exercise in a Box',
        exerciseTitle: 'Insider threat resulting in a data breach',
        url: 'https://www.ncsc.gov.uk/section/exercise-in-a-box/insider-threat-data-breach',
        overviewUrl: 'https://www.ncsc.gov.uk/section/exercise-in-a-box/overview',
        note: 'Tutor-facilitated. The API stores companion guidance only and does not reproduce staged NCSC prompts.'
      },
      directedStudy: {
        name: 'TryHackMe',
        rooms: [
          { room: 'ISO 27001', url: 'https://tryhackme.com/room/iso27001' },
          {
            room: 'Legal Considerations in DFIR',
            url: 'https://tryhackme.com/room/dfirprocesslegalconsiderations'
          }
        ],
        note: 'Do not store room answers or flags in this API.'
      }
    },
    tryHackMe: {
      rooms: [
        {
          room: 'ISO 27001',
          url: 'https://tryhackme.com/room/iso27001',
          recordFields: directed.tryhackmeIso.recordFields
        },
        {
          room: 'Legal Considerations in DFIR',
          url: 'https://tryhackme.com/room/dfirprocesslegalconsiderations',
          recordFields: directed.tryhackmeLegal.recordFields
        }
      ],
      restrictions: ['Do not store answers to TryHackMe rooms.', 'Do not reproduce room tasks or flags.']
    },
    directedStudy: {
      ciscoTask: directed.ciscoTask,
      tryhackmeIso: directed.tryhackmeIso,
      tryhackmeLegal: {
        ...directed.tryhackmeLegal,
        url: 'https://tryhackme.com/room/dfirprocesslegalconsiderations'
      },
      ncscResearch: directed.ncscResearch,
      lo2Checklist: directed.lo2Checklist,
      revisionPriorities: directed.revisionPriorities,
      leavingHubNotice: directed.leavingHubNotice
    },
    support: {
      legislationCards: support.legislationCards,
      roleCards: support.roleCards,
      sentenceStarters: support.sentenceStarters,
      workedExamples: support.workedExamples,
      stepByStep: support.stepByStep,
      accessibility: support.accessibility,
      note: 'Support scaffolds must not give away all answers.'
    },
    supportChallenge: {
      note: 'See support and challenges properties.',
      supportRef: 'support',
      challengesRef: 'challenges',
      recorderOption: support.recorderOption,
      plannerGrid: support.plannerGrid
    },
    challenges: support.challenges
  };
}

// --- Manifest ---
function buildManifest() {
  const entries = [
    ['week6-lo2-diagnostic', 'LO2 Diagnostic Retrieval', 1, 'Retrieval quiz', 12, false, 'quiz', 'WEEK6_PACK_LO2_DIAGNOSTIC'],
    ['week6-ethical-learning', 'Ethical Considerations Learning', 1, 'Guided learning', 6, false, 'guided-learning', 'WEEK6_PACK_ETHICAL_LEARNING'],
    ['week6-ethical-classification', 'Ethical, Unlawful, Both or Neither', 1, 'Classification', 8, false, 'classification', 'WEEK6_PACK_ETHICAL_CLASSIFICATION'],
    ['week6-legislation-learning', 'United Kingdom Legislation Learning', 1, 'Guided learning', 6, false, 'guided-learning', 'WEEK6_PACK_LEGISLATION_LEARNING'],
    ['week6-legislation-matching', 'Legislation Scenario Matching', 1, 'Classification', 6, false, 'classification', 'WEEK6_PACK_LEGISLATION_MATCHING'],
    ['week6-operational-considerations', 'Operational Considerations', 1, 'Scenario mapping', 7, false, 'scenario-mapping', 'WEEK6_PACK_OPERATIONAL_CONSIDERATIONS'],
    ['week6-government-initiatives', 'Government Cyber Security Initiatives', 1, 'Guided learning', 4, false, 'guided-learning', 'WEEK6_PACK_GOVERNMENT_INITIATIVES'],
    ['week6-ncsc-guidance', 'NCSC Exercise in a Box Guidance', 1, 'Reflection', 4, true, 'facilitated-companion', 'WEEK6_PACK_NCSC_GUIDANCE'],
    ['week6-exercise-decision-record', 'Exercise Decision Record', 1, 'Reflection', 5, true, 'reflection', 'WEEK6_PACK_EXERCISE_DECISION_RECORD'],
    ['week6-session1-review', 'Session 1 Review', 1, 'Retrieval quiz', 3, false, 'quiz', 'WEEK6_PACK_SESSION1_REVIEW'],
    ['week6-legislation-retrieval', 'Legislation Retrieval Quiz', 2, 'Retrieval quiz', 10, false, 'quiz', 'WEEK6_PACK_LEGISLATION_RETRIEVAL'],
    ['week6-employee-monitoring', 'Northbank Employee Monitoring Scenario', 2, 'Scenario mapping', 6, false, 'scenario-mapping', 'WEEK6_PACK_EMPLOYEE_MONITORING'],
    ['week6-stakeholder-debate', 'Stakeholder Debate Preparation', 2, 'Discussion', 10, true, 'discussion', 'WEEK6_PACK_STAKEHOLDER_DEBATE'],
    ['week6-discuss-learning', 'Balanced Discuss Response Learning', 2, 'Guided learning', 5, false, 'guided-learning', 'WEEK6_PACK_DISCUSS_LEARNING'],
    ['week6-discuss-planner', 'Discuss Response Planner', 2, 'Exam skills', 6, false, 'exam-skills', 'WEEK6_PACK_DISCUSS_PLANNER'],
    ['week6-ocr-question-practice', 'OCR-Style Timed Questions', 2, 'Exam skills', 20, false, 'ocr-practice', 'WEEK6_PACK_OCR_PRACTICE'],
    ['week6-answer-improvement', 'Marking and Answer Improvement', 2, 'Self marking', 6, false, 'self-marking', 'WEEK6_PACK_ANSWER_IMPROVEMENT'],
    ['week6-revision-organiser', 'LO2 Revision Organiser', 2, 'Reflection', 6, false, 'reflection', 'WEEK6_PACK_REVISION_ORGANISER']
  ];

  const manifest = {};
  entries.forEach(([id, name, session, type, score, partner, component, pack]) => {
    manifest[id] = {
      activityId: id,
      activityName: name,
      weekNumber: 6,
      sessionNumber: session,
      sessionName: 'Session ' + session,
      activityType: type,
      activityVersion: '1.0',
      maximumScore: score,
      enabled: true,
      allowsPartner: partner,
      componentId: component,
      packGlobal: pack
    };
  });

  return manifest;
}

function validateMarks(pack, name) {
  let marks = 0;
  (pack.sections || []).forEach((sec) => {
    if (sec.sectionType === 'assessment') {
      (sec.questions || []).forEach((q) => {
        marks += Number(q.marks) || 0;
      });
    }
  });
  const ok = marks === pack.meta.maximumScore;
  return { name, marks, expected: pack.meta.maximumScore, ok };
}

// Generate all packs
const packs = [
  ['Week6Lo2DiagnosticData.gs', 'WEEK6_PACK_LO2_DIAGNOSTIC', buildLo2Diagnostic()],
  ['Week6EthicalLearningData.gs', 'WEEK6_PACK_ETHICAL_LEARNING', buildEthicalLearning()],
  ['Week6EthicalClassificationData.gs', 'WEEK6_PACK_ETHICAL_CLASSIFICATION', buildEthicalClassification()],
  ['Week6LegislationLearningData.gs', 'WEEK6_PACK_LEGISLATION_LEARNING', buildLegislationLearning()],
  ['Week6LegislationMatchingData.gs', 'WEEK6_PACK_LEGISLATION_MATCHING', buildLegislationMatching()],
  ['Week6OperationalConsiderationsData.gs', 'WEEK6_PACK_OPERATIONAL_CONSIDERATIONS', buildOperationalConsiderations()],
  ['Week6GovernmentInitiativesData.gs', 'WEEK6_PACK_GOVERNMENT_INITIATIVES', buildGovernmentInitiatives()],
  ['Week6NcscGuidanceData.gs', 'WEEK6_PACK_NCSC_GUIDANCE', buildNcscGuidance()],
  ['Week6ExerciseDecisionRecordData.gs', 'WEEK6_PACK_EXERCISE_DECISION_RECORD', buildExerciseDecisionRecord()],
  ['Week6Session1ReviewData.gs', 'WEEK6_PACK_SESSION1_REVIEW', buildSession1Review()],
  ['Week6LegislationRetrievalData.gs', 'WEEK6_PACK_LEGISLATION_RETRIEVAL', buildLegislationRetrieval()],
  ['Week6EmployeeMonitoringData.gs', 'WEEK6_PACK_EMPLOYEE_MONITORING', buildEmployeeMonitoring()],
  ['Week6StakeholderDebateData.gs', 'WEEK6_PACK_STAKEHOLDER_DEBATE', buildStakeholderDebate()],
  ['Week6DiscussLearningData.gs', 'WEEK6_PACK_DISCUSS_LEARNING', buildDiscussLearning()],
  ['Week6DiscussPlannerData.gs', 'WEEK6_PACK_DISCUSS_PLANNER', buildDiscussPlanner()],
  ['Week6OcrPracticeData.gs', 'WEEK6_PACK_OCR_PRACTICE', buildOcrPractice()],
  ['Week6AnswerImprovementData.gs', 'WEEK6_PACK_ANSWER_IMPROVEMENT', buildAnswerImprovement()],
  ['Week6RevisionOrganiserData.gs', 'WEEK6_PACK_REVISION_ORGANISER', buildRevisionOrganiser()]
];

const markIssues = [];
packs.forEach(([file, globalName, pack]) => {
  writeGs(file, globalName, pack);
  const v = validateMarks(pack, globalName);
  if (!v.ok) markIssues.push(v);
});

writeGs('Week6GuidanceData.gs', 'WEEK6_GUIDANCE_DATA', buildGuidance());

// Write manifest
const manifest = buildManifest();
const manifestEntries = Object.entries(manifest)
  .map(([id, entry]) => {
    const props = Object.entries(entry)
      .map(([k, v]) => '    ' + k + ': ' + JSON.stringify(v))
      .join(',\n');
    return "  '" + id + "': Object.freeze({\n" + props + '\n  })';
  })
  .join(',\n');

const manifestContent = `/**
 * Week 6 activity manifest - source of truth for IDs, versions and totals.
 * Aligned with the Week 6 frontend activity catalogue.
 */

var WEEK_6_ACTIVITY_MANIFEST = Object.freeze({
${manifestEntries}
});

var WEEK_6_ACCEPTED_ACTIVITY_TYPES = Object.freeze([
  'Retrieval quiz',
  'Guided learning',
  'Classification',
  'Reflection',
  'Scenario mapping',
  'Exam skills',
  'Self marking',
  'Discussion'
]);

var WEEK_6_REQUIRED_STAKEHOLDER_ROLES = Object.freeze([
  'employees',
  'managers',
  'customers',
  'regulator',
  'shareholders'
]);

var WEEK_6_REQUIRED_LEGISLATION = Object.freeze([
  'Computer Misuse Act 1990',
  'Current United Kingdom data protection legislation',
  'Police and Justice Act 2006 amendments (supplying tools for misuse)'
]);

var WEEK_6_REQUIRED_GOVERNMENT_INITIATIVES = Object.freeze([
  'United Kingdom Cyber Security Strategy',
  'Cyber Essentials Scheme',
  '10 Steps to Cyber Security',
  'Cyber Streetwise'
]);

var WEEK_6_NCSC_EXERCISE = Object.freeze({
  title: 'Insider threat resulting in a data breach',
  url: 'https://www.ncsc.gov.uk/section/exercise-in-a-box/insider-threat-data-breach',
  organisation: 'Northbank Community Health Partnership'
});

/**
 * @return {string[]}
 */
function getWeek6ManifestIds_() {
  return Object.keys(WEEK_6_ACTIVITY_MANIFEST);
}

/**
 * @param {string} activityId
 * @return {Object|null}
 */
function getWeek6ManifestEntry_(activityId) {
  if (!activityId || !Object.prototype.hasOwnProperty.call(WEEK_6_ACTIVITY_MANIFEST, activityId)) {
    return null;
  }
  return WEEK_6_ACTIVITY_MANIFEST[activityId];
}
`;
fs.writeFileSync(path.join(OUT_DIR, 'Week6ActivityManifest.gs'), manifestContent, 'utf8');

console.log('Generated', packs.length + 1, 'pack files + manifest + guidance');
console.log('Files:', packs.map((p) => p[0]).concat(['Week6GuidanceData.gs', 'Week6ActivityManifest.gs']).join(', '));
if (markIssues.length) {
  console.log('MARK ISSUES:');
  markIssues.forEach((i) => console.log(' ', i.name, i.marks, '!=', i.expected));
} else {
  console.log('All mark totals match maximumScore.');
}

// Em dash check
const allFiles = [...packs.map((p) => p[0]), 'Week6GuidanceData.gs', 'Week6ActivityManifest.gs'];
allFiles.forEach((f) => {
  const c = fs.readFileSync(path.join(OUT_DIR, f), 'utf8');
  if (c.includes('\u2014') || c.includes('—')) {
    console.log('EM DASH FOUND in', f);
  }
});
