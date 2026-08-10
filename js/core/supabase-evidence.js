/**
 * Shared Unit 3 evidence builders for Supabase submissions.
 *
 * Activity pages call these helpers from getResponses() so every week
 * produces the same heterogeneous response shape expected by the
 * shared submission adapter.
 */
(function (global) {
  "use strict";

  function optionText(question, chosenIndex) {
    if (!question || !Array.isArray(question.options)) return null;
    var option = question.options[chosenIndex];
    if (option == null) return null;
    if (typeof option === "string") return option;
    if (typeof option === "object") {
      return option.text || option.label || option.id || null;
    }
    return String(option);
  }

  function fromQuizResult(result, questions, options) {
    options = options || {};
    var list = Array.isArray(questions) ? questions : [];
    return (result && Array.isArray(result.answers) ? result.answers : []).map(
      function (answer, index) {
        var question = list[index] || {};
        var questionId =
          question.id || answer.questionId || "q" + String(index + 1);
        var chosen =
          typeof answer.chosenIndex === "number" ? answer.chosenIndex : null;
        return {
          questionId: questionId,
          response: {
            chosenIndex: chosen,
            selectedOption: optionText(question, chosen),
            selectedOptionId:
              question.options &&
              question.options[chosen] &&
              typeof question.options[chosen] === "object"
                ? question.options[chosen].id || null
                : null
          },
          correct: Boolean(answer.correct),
          score: answer.correct ? options.markPerQuestion || 1 : 0,
          responseType: options.responseType || "single-choice"
        };
      }
    );
  }

  function freeText(questionId, value, extras) {
    extras = extras || {};
    return Object.assign(
      {
        questionId: questionId,
        response: value == null ? "" : value,
        responseType: extras.responseType || "text",
        correct: extras.correct !== false,
        score: typeof extras.score === "number" ? extras.score : 1
      },
      extras.fields || {}
    );
  }

  function structured(questionId, payload, extras) {
    extras = extras || {};
    return {
      questionId: questionId,
      response: payload,
      responseType: extras.responseType || "structured",
      correct: Boolean(extras.correct),
      score: typeof extras.score === "number" ? extras.score : extras.correct ? 1 : 0
    };
  }

  function classification(questionId, category, extras) {
    extras = extras || {};
    return structured(
      questionId,
      Object.assign({ category: category }, extras.payload || {}),
      {
        responseType: "classification",
        correct: extras.correct,
        score: extras.score
      }
    );
  }

  /**
   * Attach started/completed getters and getResponses onto a weekN
   * renderSubmitPanel options object without disturbing Apps Script fields.
   */
  function withTiming(options, startedAtRef) {
    var started =
      startedAtRef && startedAtRef.value
        ? startedAtRef.value
        : new Date().toISOString();
    if (startedAtRef) startedAtRef.value = started;
    options.getStartedAt = function () {
      return startedAtRef ? startedAtRef.value : started;
    };
    options.getCompletedAt = function () {
      return new Date().toISOString();
    };
    return options;
  }

  global.Unit3SupabaseEvidence = Object.freeze({
    fromQuizResult: fromQuizResult,
    freeText: freeText,
    structured: structured,
    classification: classification,
    optionText: optionText,
    withTiming: withTiming
  });
})(window);
