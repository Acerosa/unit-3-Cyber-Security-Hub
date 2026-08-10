/**
 * Deterministic frontend → catalogue question-key aliases for Unit 3.
 *
 * The Apps Script data packs (imported into Supabase) use catalogue stable
 * keys such as W2OCR-Q01 / MOTKC1 / MAP1MOT. The static frontend data files
 * often use different local IDs (ocr-q1 / mot-kc1 / map-espionage). This
 * module is the single boundary map — never scatter aliases across pages.
 *
 * Resolution order in Unit3ActivityKeyMap.normaliseQuestionKey(id, activityKey):
 *   1. explicit alias for (activityKey, frontendId)
 *   2. uppercase
 *   3. uppercase with hyphens removed
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
      "ocr-q7": "W2OCR-Q07"
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
      "map-espionage": "MAP1",
      "map-hacktivism": "MAP2",
      "map-ransomware": "MAP3",
      "map-defacement": "MAP4"
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
    }
  });

  window.Unit3QuestionKeyAliases = Object.freeze({
    ALIASES: ALIASES,
    resolve: function (activityKey, questionId) {
      var activity =
        typeof activityKey === "string" ? activityKey.trim().toLowerCase() : "";
      var raw = typeof questionId === "string" ? questionId.trim() : "";
      if (!raw) return "";
      var table = ALIASES[activity] || {};
      if (Object.prototype.hasOwnProperty.call(table, raw)) {
        return table[raw];
      }
      var lower = raw.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(table, lower)) {
        return table[lower];
      }
      return "";
    }
  });
})();
