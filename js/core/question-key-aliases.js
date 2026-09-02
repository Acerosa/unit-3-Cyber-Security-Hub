/**
 * Deterministic frontend → catalogue question-key aliases for Unit 3.
 *
 * The Apps Script data packs (imported into Supabase) use catalogue stable
 * keys such as W2OCR-Q01 / MOTKC1 / MAP1MOT. The static frontend data files
 * often use different local IDs (ocr-q1 / mot-kc1 / map-espionage-mot). This
 * module is the single boundary map — never scatter aliases across pages.
 *
 * Resolution order in Unit3ActivityKeyMap.normaliseQuestionKey(id, activityKey):
 *   1. explicit alias for (activityKey, frontendId)
 *   2. case-insensitive match against that activity's canonical keys
 *   3. fail closed for known local IDs that have no alias
 *   4. uppercase passthrough
 *
 * Hosted question IDs are never renamed here.
 */
(function () {
  "use strict";

  function freezeMap(obj) {
    var out = {};
    Object.keys(obj || {}).forEach(function (key) {
      out[key] = Object.freeze(Object.assign({}, obj[key]));
    });
    return Object.freeze(out);
  }

  var ALIASES = freezeMap({
    "week2-ocr-question-practice": {
      "ocr-q1": "W2OCR-Q01",
      "ocr-q2": "W2OCR-Q02",
      "ocr-q3": "W2OCR-Q03",
      "ocr-q4": "W2OCR-Q04",
      "ocr-q5": "W2OCR-Q05",
      "ocr-q6": "W2OCR-Q06",
      "ocr-q7": "W2OCR-Q07",
      "ocr-q8": "W2OCR-Q08"
    },
    "week2-malware-symptoms": {
      "mw-q1": "MW-Q1",
      "mw-q2": "MW-Q2",
      "mw-q3": "MW-Q3",
      "mw-q4": "MW-Q4",
      "mw-q5": "MW-Q5",
      "mw-q6": "MW-Q6",
      "mw-q7": "MW-Q7",
      "mw-q8": "MW-Q8",
      "mw-q9": "MW-Q9",
      "mw-q10": "MW-Q10"
    },
    "week2-vulnerabilities101-reflection": {
      "notes": "W2V101-Q01",
      "purpose": "W2V101-Q02",
      "w2v101-q01": "W2V101-Q01",
      "w2v101-q02": "W2V101-Q02"
    },
    "week2-northbank-vulnerability-register": {
      "entry-1": "W2REG-E1",
      "entry-2": "W2REG-E2",
      "entry-3": "W2REG-E3",
      "entry-4": "W2REG-E4",
      "entry-5": "W2REG-E5"
    },
    "week3-peer-marking": {
      "peer": "PEER1",
      "peer1": "PEER1",
      "state": "PEER1"
    },
    "week4-motivations-learning": {
      "mot-kc1": "MOTKC1",
      "mot-kc2": "MOTKC2",
      "mot-kc3": "MOTKC3",
      "mot-kc4": "MOTKC4",
      "mot-kc5": "MOTKC5",
      "mot-kc6": "MOTKC6",
      "mot-kc7": "MOTKC7",
      "mot-kc8": "MOTKC8"
    },
    "week4-mtm-mapping": {
      "map-espionage-mot": "MAP1MOT",
      "map-espionage-tgt": "MAP1TGT",
      "map-hacktivism-mot": "MAP2MOT",
      "map-hacktivism-tgt": "MAP2TGT",
      "map-ransomware-mot": "MAP3MOT",
      "map-ransomware-tgt": "MAP3TGT",
      "map-defacement-mot": "MAP4MOT",
      "map-defacement-tgt": "MAP4TGT"
    },
    "week4-ocr-question-practice": {
      "ocr-1": "OCR1",
      "ocr-2": "OCR2",
      "ocr-3": "OCR3",
      "ocr-4": "OCR4",
      "ocr-5": "OCR5",
      "ocr-6": "OCR6"
    },
    "week4-ethical-review": {
      "position": "ETH1",
      "reason": "ETH1",
      "legalnote": "ETH2",
      "legalNote": "ETH2"
    },
    "week4-analyse-practice": {
      "template": "AN1",
      "motivation": "AN2",
      "target": "AN3",
      "method": "AN4",
      "plan": "AN5",
      "checklist": "AN6"
    },
    "week4-answer-improvement": {
      "criteria": "AI1",
      "descriptivespot": "AI2",
      "rewrite": "AI3",
      "improvement": "AI4"
    },
    "week4-northbank-exposure": {
      "exposure-1": "NB1",
      "exposure-2": "NB2",
      "exposure-3": "NB3"
    },
    "week5-impacts-learning": {
      "k1": "K1",
      "k2": "K2",
      "k3": "K3",
      "k4": "K4",
      "k5": "K5",
      "k6": "K6",
      "k7": "K7",
      "k8": "K8",
      "k9": "K9"
    },
    "week5-ocr-question-practice": {
      "ocr-1": "OCR1",
      "ocr-2": "OCR2",
      "ocr-3": "OCR3",
      "ocr-4": "OCR4",
      "ocr-5": "OCR5",
      "ocr-6": "OCR6",
      "ocr-7": "OCR7",
      "ocr-8": "OCR8"
    },
    "week5-answer-improvement": {
      "m1": "AI1",
      "m2": "AI2",
      "m3": "AI3",
      "m4": "AI4",
      "m5": "AI5",
      "m6": "AI6"
    },
    "week5-exercise-debrief": {
      "impactreduced": "DB1",
      "stakeholderbenefit": "DB2",
      "timescale": "DB3",
      "negativeeffect": "DB4"
    },
    "week5-ransomware-companion": {
      "selectedrole": "RC1",
      "roledecision": "RC2",
      "decisions": "RC3",
      "facilitatedconfirmed": "RC4"
    },
    "week5-stakeholder-grid": {
      "individuals": "SG1",
      "organisation": "SG2",
      "employees": "SG3",
      "patients": "SG4",
      "customers": "SG4",
      "suppliers": "SG5",
      "partners": "SG6",
      "regulators": "SG7",
      "state": "SG8",
      "reflection": "SG9",
      "timescale-reflection": "SG10"
    },
    "week5-impact-analysis": {
      "a1": "IA1",
      "a2": "IA2",
      "a3": "IA3",
      "a4": "IA4",
      "a5": "IA5",
      "a6": "IA6"
    },
    "week6-legislation-retrieval": {
      "lrq1": "LR1",
      "lrq2": "LR2",
      "lrq3": "LR3",
      "lrq4": "LR4",
      "lrq5": "LR5",
      "lrq6": "LR6",
      "lrq7": "LR7",
      "lrq8": "LR8",
      "lrq9": "LR9",
      "lrq10": "LR10"
    },
    "week6-ocr-question-practice": {
      "ocr6-1": "OCR6_1",
      "ocr6-2": "OCR6_2",
      "ocr6-3": "OCR6_3",
      "ocr6-4": "OCR6_4",
      "ocr6-5": "OCR6_5",
      "ocr6-6": "OCR6_6",
      "ocr6-7": "OCR6_7"
    },
    "week7-session1-retrieval": {
      "s1r-1": "S1R1",
      "s1r-2": "S1R2",
      "s1r-3": "S1R3",
      "s1r-4": "S1R4",
      "s1r-5": "S1R5",
      "s1r-6": "S1R6"
    },
    "week7-session2-retrieval": {
      "s2-1": "S2R1",
      "s2-2": "S2R2",
      "s2-3": "S2R3",
      "s2-4": "S2R4",
      "s2-5": "S2R5",
      "s2-6": "S2R6",
      "s2-7": "S2R7",
      "s2-8": "S2R8",
      "s2-9": "S2R9",
      "s2-10": "S2R10"
    },
    "week7-risk-management-learning": {
      "rm-1": "RM1",
      "rm-2": "RM2",
      "rm-3": "RM3",
      "rm-4": "RM4",
      "rm-5": "RM5",
      "rm-6": "RM6",
      "rm-7": "RM7",
      "rm-8": "RM8"
    },
    "week7-testing-methods": {
      "tm-1": "TM1",
      "tm-2": "TM2",
      "tm-3": "TM3",
      "tm-4": "TM4",
      "tm-5": "TM5",
      "tm-6": "TM6",
      "tm-7": "TM7",
      "tm-8": "TM8"
    },
    "week7-detection-prevention": {
      "dp-1": "DP1",
      "dp-2": "DP2",
      "dp-3": "DP3",
      "dp-4": "DP4",
      "dp-5": "DP5",
      "dp-6": "DP6",
      "dp-7": "DP7",
      "dp-8": "DP8"
    },
    "week7-ocr-question-practice": {
      "ocr7-1": "OCR7_1",
      "ocr7-2": "OCR7_2",
      "ocr7-3": "OCR7_3",
      "ocr7-4": "OCR7_4",
      "ocr7-5": "OCR7_5",
      "ocr7-6": "OCR7_6",
      "ocr7-7": "OCR7_7",
      "ocr7-8": "OCR7_8",
      "ocr7-9": "OCR7_9"
    }
  });

  /*
   * Local IDs that must never silently uppercase into a non-catalogue key.
   * If a frontend ID matches the pattern and has no alias, mapping fails closed.
   */
  var CLOSED_FRONTEND = Object.freeze({
    "week2-ocr-question-practice": /^ocr-q\d+$/i,
    "week4-mtm-mapping":
      /^map-(espionage|hacktivism|ransomware|defacement)(?:-mot|-tgt)?$/i
  });

  /*
   * Week 1 live engine IDs are already catalogue keys (BAS-Q01, INC-Q01, …).
   * Unknown local IDs such as b-q1 must not be invented as B-Q1.
   */
  var REQUIRED_RESULT = Object.freeze({
    "u3-w01-baseline": /^BAS-Q\d{2}$/,
    "u3-w01-cia": /^CIA-Q\d{2}$/,
    "u3-w01-incidents": /^INC-Q\d{2}$/,
    "u3-w01-glossary": /^GLO-Q\d{2}$/,
    "u3-w01-retrieval": /^RET-Q\d{2}[A-Z]?$/,
    "u3-w01-command-words": /^Q\d{3}$/,
    "u3-w01-ocr-practice": /^OCR-Q/,
    "u3-w01-peer-improvement": /^PM-Q\d{2}$/
  });

  /*
   * Classification labels that Batch B stores as single-choice option letters.
   * Preserve the original category fields; also emit the hosted optionId.
   */
  var CATEGORY_OPTION_ALIASES = freezeMap({
    "week2-threat-vulnerability-sort": {
      threat: "A",
      vulnerability: "B"
    },
    "week3-attacker-case-matching": {
      hacktivist: "hacktivist",
      "cyber-criminal": "cyber-criminal",
      insider: "insider",
      "script-kiddie": "script-kiddie",
      "vulnerability-broker": "vulnerability-broker",
      scammer: "scammer",
      phisher: "phisher",
      "cyber-terrorist": "cyber-terrorist"
    },
    "week4-targets-methods": {
      motivation: "motivation",
      target: "target",
      method: "method"
    }
  });

  var LABEL_OPTION_ALIASES = freezeMap({
    "week4-mtm-mapping": {
      Espionage: "m0",
      "Righting perceived wrongs": "m1",
      "Public good": "m2",
      Publicity: "m3",
      Thrill: "m4",
      Fraud: "m5",
      "Score settling": "m6",
      "Income generation": "m7",
      People: "t0",
      Organisations: "t1",
      Equipment: "t2",
      Information: "t3"
    }
  });

  function activityName(activityKey) {
    return typeof activityKey === "string" ? activityKey.trim().toLowerCase() : "";
  }

  function tableFor(activityKey) {
    return ALIASES[activityName(activityKey)] || {};
  }

  function resolve(activityKey, questionId) {
    var raw = typeof questionId === "string" ? questionId.trim() : "";
    if (!raw) return "";
    var table = tableFor(activityKey);
    if (Object.prototype.hasOwnProperty.call(table, raw)) {
      return table[raw];
    }
    var lower = raw.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(table, lower)) {
      return table[lower];
    }
    var keys = Object.keys(table);
    var upper = raw.toUpperCase();
    var i;
    for (i = 0; i < keys.length; i += 1) {
      var canonical = table[keys[i]];
      if (typeof canonical === "string" && canonical.toUpperCase() === upper) {
        return canonical;
      }
    }
    return "";
  }

  function closedFrontendPattern(activityKey) {
    return CLOSED_FRONTEND[activityName(activityKey)] || null;
  }

  function requiredResultPattern(activityKey) {
    return REQUIRED_RESULT[activityName(activityKey)] || null;
  }

  function resolveLabelOption(activityKey, label) {
    var table = LABEL_OPTION_ALIASES[activityName(activityKey)] || {};
    var raw = typeof label === "string" ? label.trim() : "";
    if (!raw) return "";
    if (Object.prototype.hasOwnProperty.call(table, raw)) return table[raw];
    return "";
  }

  function resolveCategoryOption(activityKey, category) {
    var table = CATEGORY_OPTION_ALIASES[activityName(activityKey)] || {};
    var raw = typeof category === "string" ? category.trim() : "";
    if (!raw) return "";
    if (Object.prototype.hasOwnProperty.call(table, raw)) return table[raw];
    if (Object.prototype.hasOwnProperty.call(table, raw.toLowerCase())) {
      return table[raw.toLowerCase()];
    }
    return "";
  }

  window.Unit3QuestionKeyAliases = Object.freeze({
    ALIASES: ALIASES,
    CLOSED_FRONTEND: CLOSED_FRONTEND,
    REQUIRED_RESULT: REQUIRED_RESULT,
    CATEGORY_OPTION_ALIASES: CATEGORY_OPTION_ALIASES,
    LABEL_OPTION_ALIASES: LABEL_OPTION_ALIASES,
    tableFor: tableFor,
    resolve: resolve,
    closedFrontendPattern: closedFrontendPattern,
    requiredResultPattern: requiredResultPattern,
    resolveCategoryOption: resolveCategoryOption,
    resolveLabelOption: resolveLabelOption
  });
})();
