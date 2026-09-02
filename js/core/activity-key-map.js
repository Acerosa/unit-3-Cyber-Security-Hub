/**
 * Deterministic Unit 3 activity/version/question key normalisation.
 *
 * The legacy frontend uses:
 *   - upper-case activity IDs for Week 1 (U3-W01-BASELINE etc.)
 *   - lower-case activity IDs for Weeks 2–7
 *   - mixed local question IDs (ocr-q1, s1-q1, map-espionage-mot)
 *   - activity version "1.0"
 *
 * The Unit 3 Supabase catalogue stores:
 *   - lower-case activity stable keys (u3-w01-baseline etc.)
 *   - catalogue question stable keys (W2OCR-Q01, S1-Q1, MAP1MOT)
 *   - Batch B versions (1.2.0 Week 1 + Week 2 OCR; 1.0.0 four Week 5
 *     activities; 1.2.0 week6-legislation-matching; 1.1.0 everything
 *     else in Weeks 2–7)
 *
 * This module is the single source of truth for:
 *   1. question ID aliasing
 *   2. option ID normalisation
 *   3. category ID normalisation
 *   4. text passthrough
 *   5. multi-field response preservation
 *
 * Never scatter this logic across week scripts. Never rename hosted IDs.
 */
(function () {
  "use strict";

  var WEEK5_MARKING_V1 = Object.freeze({
    "week5-vulnerability-patterns": true,
    "week5-threat-vulnerability-risk": true,
    "week5-controls-matching": true,
    "week5-secure-rewrite": true
  });

  /*
   * Catalogue classification blocks whose hosted marking specs are single-choice.
   * Do not use this for genuine classification activities (correctCategoryId).
   */
  var FORMATIVE_CLASSIFICATION_OPTION_ACTIVITIES = Object.freeze({
    "week2-threat-vulnerability-sort": true,
    "week3-attacker-case-matching": true,
    "week4-targets-methods": true
  });

  var FORBIDDEN_EVIDENCE_FIELDS = Object.freeze([
    "awarded_score",
    "awardedScore",
    "is_correct",
    "isCorrect"
  ]);

  var FORBIDDEN_FIELDS = Object.freeze([
    "studentId",
    "student_id",
    "learnerId",
    "learner_id",
    "enrolmentId",
    "enrolment_id",
    "assignmentId",
    "assignment_id",
    "attemptNumber",
    "attempt_number",
    "maximumScore",
    "max_score",
    "authoritativeScore",
    "serverTimestamp",
    "server_timestamp"
  ]);

  function config() {
    return window.SUPABASE_CONFIG || {};
  }

  function trim(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function aliases() {
    return window.Unit3QuestionKeyAliases || {};
  }

  function normaliseActivityKey(activityId) {
    var raw = trim(activityId);
    if (!raw) return "";
    return raw.toLowerCase();
  }

  function catalogueVersionFor(activityId) {
    var key = normaliseActivityKey(activityId);
    if (!key) return "";
    var overrides = config().activityCatalogueVersions || {};
    if (
      Object.prototype.hasOwnProperty.call(overrides, key) &&
      typeof overrides[key] === "string" &&
      overrides[key].trim()
    ) {
      return overrides[key].trim();
    }
    if (key.indexOf("u3-w01-") === 0) return "1.2.0";
    if (key === "week2-ocr-question-practice") return "1.2.0";
    if (key === "week6-legislation-matching") return "1.2.0";
    if (WEEK5_MARKING_V1[key]) return "1.0.0";
    if (/^week[2-7]-/.test(key)) return "1.1.0";
    return "";
  }

  function normaliseActivityVersion(version, activityKey) {
    var latest = catalogueVersionFor(activityKey);
    if (latest) return latest;
    var raw = trim(version);
    if (!raw) return "";
    var versionAliases = config().activityVersionAliases || {};
    if (
      Object.prototype.hasOwnProperty.call(versionAliases, raw) &&
      typeof versionAliases[raw] === "string" &&
      versionAliases[raw].trim()
    ) {
      return versionAliases[raw].trim();
    }
    return raw;
  }

  function optionLetterCase(activityKey) {
    var key = normaliseActivityKey(activityKey);
    if (key.indexOf("u3-w01-") === 0) return "upper";
    if (key === "week2-ocr-question-practice") return "lower";
    if (key.indexOf("week2-") === 0 || key.indexOf("week3-") === 0) {
      return "upper";
    }
    return "lower";
  }

  function isOptionLetter(value) {
    return typeof value === "string" && /^[a-d]$/i.test(value.trim());
  }

  function applyLetterCase(letter, activityKey) {
    var raw = trim(letter);
    if (!isOptionLetter(raw)) return raw;
    return optionLetterCase(activityKey) === "upper"
      ? raw.toUpperCase()
      : raw.toLowerCase();
  }

  function letterFromIndex(index, activityKey) {
    if (typeof index !== "number" || !isFinite(index)) return "";
    if (Math.floor(index) !== index || index < 0 || index > 25) return "";
    return applyLetterCase(String.fromCharCode(97 + index), activityKey);
  }

  function optionIdFromOptions(options, index, activityKey) {
    if (!Array.isArray(options) || typeof index !== "number") return "";
    if (index < 0 || index >= options.length) return "";
    var option = options[index];
    if (option && typeof option === "object") {
      var id = option.optionId || option.id || option.option_id;
      if (id != null && String(id).trim()) {
        return applyLetterCase(String(id).trim(), activityKey);
      }
    }
    return letterFromIndex(index, activityKey);
  }

  function normaliseOptionId(value, activityKey, extras) {
    extras = extras || {};
    var raw = value == null ? "" : String(value).trim();
    if (raw) return applyLetterCase(raw, activityKey);
    if (typeof extras.chosenIndex === "number") {
      var fromOptions = optionIdFromOptions(
        extras.options,
        extras.chosenIndex,
        activityKey
      );
      if (fromOptions) return fromOptions;
      return letterFromIndex(extras.chosenIndex, activityKey);
    }
    return "";
  }

  function normaliseCategoryId(value, activityKey) {
    var raw = value == null ? "" : String(value).trim();
    if (!raw) return "";
    var mapped = aliases().resolveCategoryOption
      ? aliases().resolveCategoryOption(activityKey, raw)
      : "";
    return mapped || raw;
  }

  function unknownQuestionError(questionId, activityKey) {
    return new Error(
      "UNKNOWN_QUESTION: " +
        trim(questionId) +
        " is not mapped for " +
        (normaliseActivityKey(activityKey) || "unknown-activity") +
        "."
    );
  }

  function normaliseQuestionKey(questionId, activityKey) {
    var raw = trim(questionId);
    if (!raw) return "";
    var table = aliases();
    var aliased =
      table && typeof table.resolve === "function"
        ? table.resolve(typeof activityKey === "string" ? activityKey : "", raw)
        : "";
    if (aliased) return aliased;

    var closed =
      table && typeof table.closedFrontendPattern === "function"
        ? table.closedFrontendPattern(activityKey)
        : null;
    if (closed && closed.test(raw)) {
      throw unknownQuestionError(raw, activityKey);
    }

    var upper = raw.toUpperCase();
    var required =
      table && typeof table.requiredResultPattern === "function"
        ? table.requiredResultPattern(activityKey)
        : null;
    if (required && !required.test(upper)) {
      throw unknownQuestionError(raw, activityKey);
    }
    return upper;
  }

  function copyWithoutMarkFields(evidence) {
    var out = {};
    Object.keys(evidence).forEach(function (key) {
      if (FORBIDDEN_EVIDENCE_FIELDS.indexOf(key) === -1) {
        out[key] = evidence[key];
      }
    });
    return out;
  }

  function chosenIndexOf(evidence, raw) {
    if (evidence && typeof evidence === "object" && !Array.isArray(evidence)) {
      if (typeof evidence.chosenIndex === "number") return evidence.chosenIndex;
      if (typeof evidence.chosen_index === "number") return evidence.chosen_index;
    }
    if (raw && typeof raw.chosenIndex === "number") return raw.chosenIndex;
    if (raw && typeof raw.chosen_index === "number") return raw.chosen_index;
    return null;
  }

  function optionsOf(evidence, raw) {
    if (evidence && Array.isArray(evidence.options)) return evidence.options;
    if (raw && Array.isArray(raw.options)) return raw.options;
    return null;
  }

  function isMultiFieldStructured(evidence) {
    if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
      return false;
    }
    return Boolean(
      evidence.incidentType ||
        evidence.ciaAim ||
        evidence.legislation ||
        evidence.duty ||
        evidence.motivation ||
        evidence.target ||
        evidence.bestAnswer
    );
  }

  function assertClassificationShape(evidence, responseType) {
    if (responseType !== "classification") return;
    if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
      throw new Error(
        "MALFORMED_CLASSIFICATION: classification response must be an object."
      );
    }
    var hasIdentity = Boolean(
      trim(String(evidence.categoryId || "")) ||
        trim(String(evidence.category || "")) ||
        trim(String(evidence.category_id || "")) ||
        trim(String(evidence.optionId || "")) ||
        isMultiFieldStructured(evidence)
    );
    if (!hasIdentity) {
      throw new Error(
        "MALFORMED_CLASSIFICATION: classification response is missing category or item identity."
      );
    }
  }

  function normaliseResponsePayload(evidence, activityKey, raw) {
    var responseType =
      (raw && (raw.responseType || raw.response_type)) ||
      (evidence && typeof evidence === "object" && !Array.isArray(evidence)
        ? evidence.responseType
        : "");
    if (responseType === "classification") {
      assertClassificationShape(evidence, responseType);
    }
    if (evidence === undefined || evidence === null) return evidence;
    if (typeof evidence !== "object" || Array.isArray(evidence)) return evidence;

    var out = copyWithoutMarkFields(evidence);
    var optionId = normaliseOptionId(
      out.optionId ||
        out.selectedOptionId ||
        out.option_id ||
        out.selected_option_id,
      activityKey,
      {
        chosenIndex: chosenIndexOf(out, raw),
        options: optionsOf(out, raw)
      }
    );
    var categorySource =
      out.categoryId || out.category || out.category_id || "";
    var mappedOptionFromCategory = aliases().resolveCategoryOption
      ? aliases().resolveCategoryOption(activityKey, categorySource)
      : "";
    if (mappedOptionFromCategory && !optionId) {
      optionId = mappedOptionFromCategory;
    }
    if (!optionId && aliases().resolveLabelOption) {
      optionId =
        aliases().resolveLabelOption(activityKey, out.motivation) ||
        aliases().resolveLabelOption(activityKey, out.target);
    }
    if (optionId) out.optionId = optionId;
    if (out.selectedOptionId && isOptionLetter(String(out.selectedOptionId))) {
      out.selectedOptionId = applyLetterCase(String(out.selectedOptionId), activityKey);
    }

    if (categorySource && !isMultiFieldStructured(out)) {
      out.categoryId = String(categorySource);
    }

    return out;
  }

  function isFormativeClassificationOptionActivity(activityKey) {
    return Boolean(FORMATIVE_CLASSIFICATION_OPTION_ACTIVITIES[normaliseActivityKey(activityKey)]);
  }

  /**
   * Activity-scoped classification → hosted single-choice optionId.
   * Returns null when the activity is not allowlisted or the category has no alias.
   */
  function normaliseFormativeClassificationResponse(activityKey, responseType, payload) {
    if (String(responseType || "").trim().toLowerCase() !== "classification") return null;
    if (!isFormativeClassificationOptionActivity(activityKey)) return null;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
    var categorySource = payload.categoryId || payload.category || payload.category_id || "";
    var mapped = aliases().resolveCategoryOption
      ? aliases().resolveCategoryOption(activityKey, categorySource)
      : "";
    if (!mapped) return null;
    return {
      response_type: "single-choice",
      response_payload: { optionId: mapped }
    };
  }

  function assertNoLearnerIdentity(payload) {
    if (!payload || typeof payload !== "object") return;
    for (var i = 0; i < FORBIDDEN_FIELDS.length; i += 1) {
      var key = FORBIDDEN_FIELDS[i];
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        throw new Error(
          "Unit 3 Supabase payload must not include " + key + "."
        );
      }
    }
  }

  window.Unit3ActivityKeyMap = Object.freeze({
    normaliseActivityKey: normaliseActivityKey,
    normaliseQuestionKey: normaliseQuestionKey,
    normaliseActivityVersion: normaliseActivityVersion,
    catalogueVersionFor: catalogueVersionFor,
    optionLetterCase: optionLetterCase,
    normaliseOptionId: normaliseOptionId,
    normaliseCategoryId: normaliseCategoryId,
    normaliseResponsePayload: normaliseResponsePayload,
    isFormativeClassificationOptionActivity: isFormativeClassificationOptionActivity,
    normaliseFormativeClassificationResponse: normaliseFormativeClassificationResponse,
    assertNoLearnerIdentity: assertNoLearnerIdentity,
    FORBIDDEN_FIELDS: FORBIDDEN_FIELDS,
    WEEK5_MARKING_V1: WEEK5_MARKING_V1
  });
})();
