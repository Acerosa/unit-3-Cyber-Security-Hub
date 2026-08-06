/**
 * Week 4 OCR-style timed examination practice (20 marks).
 */
(function (global) {
  'use strict';

  global.Week4OcrPractice = Object.freeze({
    activityId: 'week4-ocr-question-practice',
    activityName: 'OCR-Style Question Practice',
    activityVersion: '1.0',
    weekNumber: 4,
    sessionNumber: 2,
    total: 20,
    suggestedMinutes: 20,
    timingGuidance: 'Use approximately one minute per mark where this helps you manage time.',
    beforeReminders: Object.freeze([
      'Read whether the question asks for motivation, target or method.',
      'Use one case consistently.',
      'Include explicit connections.',
      'Complete the final connection rather than leaving it implied.',
      'Allocate time according to the marks available.'
    ]),
    questions: Object.freeze([
      Object.freeze({
        id: 'ocr-1',
        commandWord: 'Identify',
        marks: 1,
        suggestedMinutes: 1,
        responseType: 'mcq',
        prompt: 'Identify which of the following is an OCR attacker motivation.',
        guidance: 'Motivation = why. Do not choose a method.',
        options: Object.freeze([
          Object.freeze({ id: 'a', text: 'Phishing' }),
          Object.freeze({ id: 'b', text: 'Publicity' }),
          Object.freeze({ id: 'c', text: 'Exfiltration' }),
          Object.freeze({ id: 'd', text: 'Damage' })
        ]),
        correctOptionId: 'b',
        markScheme: '1 mark for publicity (or another listed motivation if an equivalent option were offered).',
        indicativeContent: 'Publicity is a motivation. Phishing, exfiltration and damage are methods.',
        modelAnswer: 'Publicity.',
        commonMistakes: Object.freeze(['Choosing a method such as phishing'])
      }),
      Object.freeze({
        id: 'ocr-2',
        commandWord: 'Identify',
        marks: 1,
        suggestedMinutes: 1,
        responseType: 'mcq',
        prompt: 'Identify the target category when reception staff are sent deceptive emails.',
        guidance: 'Target = what was attacked.',
        options: Object.freeze([
          Object.freeze({ id: 'a', text: 'People' }),
          Object.freeze({ id: 'b', text: 'Equipment' }),
          Object.freeze({ id: 'c', text: 'Fraud' }),
          Object.freeze({ id: 'd', text: 'Thrill' })
        ]),
        correctOptionId: 'a',
        markScheme: '1 mark for people.',
        indicativeContent: 'People are targeted; phishing would be the method; fraud/thrill are motivations.',
        modelAnswer: 'People.',
        commonMistakes: Object.freeze(['Naming the method or motivation instead of the target'])
      }),
      Object.freeze({
        id: 'ocr-3',
        commandWord: 'Explain',
        marks: 2,
        suggestedMinutes: 2,
        responseType: 'text',
        prompt: 'Explain the difference between fraud and income generation as attacker motivations.',
        guidance: 'Use the OCR distinction: fraud requires deception; income generation may not.',
        markScheme:
          '1 mark for fraud involving deception; 1 mark for income generation as financial gain that may not require deception.',
        indicativeContent:
          'Fraud gains money or advantage through deception. Income generation seeks financial gain and may involve no deception (for example a ransom demand).',
        modelAnswer:
          'Fraud requires deception to gain money or advantage. Income generation is about making money and does not always require deception.',
        commonMistakes: Object.freeze(['Treating the two motivations as identical'])
      }),
      Object.freeze({
        id: 'ocr-4',
        commandWord: 'Describe',
        marks: 4,
        suggestedMinutes: 4,
        responseType: 'text',
        prompt:
          'Describe the four categories of target for cyber security threats and give one associated method for each.',
        guidance: 'Name people, organisations, equipment and information with the specified methods.',
        markScheme:
          '1 mark per correct target with a valid associated method (max 4).',
        indicativeContent:
          'People — social engineering/phishing; organisations — system compromise/supply-chain compromise; equipment — theft/damage; information — interception/exfiltration.',
        modelAnswer:
          'People can be targeted using social engineering or phishing. Organisations can be targeted through system compromise or supply-chain compromise. Equipment can be targeted by theft or damage. Information can be targeted by interception or exfiltration.',
        commonMistakes: Object.freeze(['Listing attacker types instead of targets', 'Using unsupported methods'])
      }),
      Object.freeze({
        id: 'ocr-5',
        commandWord: 'Explain',
        marks: 4,
        suggestedMinutes: 4,
        responseType: 'text',
        prompt:
          'Explain the difference between motivation, target and method, using one short Northbank-related example.',
        guidance: 'Keep why / what / how distinct. Sustain one example.',
        markScheme:
          '1 mark motivation=why; 1 mark target=what; 1 mark method=how; 1 mark for a consistent example that does not confuse the three.',
        indicativeContent:
          'Motivation why; target what; method how; example must not answer motivation with a method.',
        modelAnswer:
          'Motivation is why the attacker acted, target is what was attacked, and method is how the attack was carried out. For example, if an attacker wants income generation (why), they may target Northbank’s organisation systems (what) using system compromise and a ransom demand (how).',
        commonMistakes: Object.freeze(['Using phishing as a motivation', 'Changing example halfway'])
      }),
      Object.freeze({
        id: 'ocr-6',
        commandWord: 'Analyse',
        marks: 8,
        suggestedMinutes: 8,
        responseType: 'text',
        prompt:
          'Northbank’s public website is defaced with a protest message about health funding. Clinical systems are not encrypted and no ransom is demanded. Analyse why this organisation was targeted, connecting attacker motivation, selected target and method used. Use evidence from the scenario.',
        guidance:
          'Sustain one case. State explicit connections. Complete the final connection. Do not invent unsupported Northbank details.',
        markScheme:
          'Up to 2 marks motivation with evidence; up to 2 marks target with evidence; up to 2 marks method with evidence; up to 2 marks for explicit analytical connections sustaining one case.',
        indicativeContent:
          'Publicity (wanting notice) → organisational public website → system compromise/defacement; connectives must be meaningful; thrill is weaker if message/cause is clear.',
        modelAnswer:
          'The most likely motivation is publicity because the attackers left a protest message intended to be noticed. As a result, Northbank’s public website was a logical organisational target, which means that system compromise of that site suited delivering a visible message without needing to encrypt clinical systems. Therefore the motivation made both the target and method a coherent choice based on exposure and visibility rather than a ransom-driven income generation motive.',
        commonMistakes: Object.freeze([
          'Listing motivation, target and method with no connection',
          'Leaving the final connection implied',
          'Switching to a different example halfway',
          'Calling defacement a motivation'
        ])
      })
    ])
  });
})(window);
