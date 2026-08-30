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

  /**
   * Submission contract 0.1.0 only accepts binary client marks:
   * correct => awarded_score === question max; incorrect => awarded_score === 0.
   * Partial local marks may be preserved inside response payloads.
   */
  function contractSafeMark(score, maxScore) {
    var max = Number(maxScore);
    if (!Number.isFinite(max) || max <= 0) max = 1;
    var awarded = Number(score);
    if (!Number.isFinite(awarded) || awarded <= 0) {
      return { correct: false, score: 0 };
    }
    if (awarded >= max) {
      return { correct: true, score: max };
    }
    return { correct: false, score: 0 };
  }

  function freeText(questionId, value, extras) {
    extras = extras || {};
    var text = value == null ? "" : String(value);
    var mark = contractSafeMark(
      typeof extras.score === "number" ? extras.score : extras.correct === true ? 1 : 0,
      extras.maxScore != null ? extras.maxScore : 1
    );
    if (extras.correct === false && !(typeof extras.score === "number")) {
      mark = { correct: false, score: 0 };
    }
    // Empty strings are rejected by api.submit_attempt; keep a structured blob.
    if (!String(text).trim()) {
      return structured(
        questionId,
        { text: "", answered: false },
        {
          responseType: extras.responseType || "text",
          correct: mark.correct,
          score: mark.score,
          maxScore: extras.maxScore != null ? extras.maxScore : 1
        }
      );
    }
    return Object.assign(
      {
        questionId: questionId,
        response: text,
        responseType: extras.responseType || "text",
        correct: mark.correct,
        score: mark.score
      },
      extras.fields || {}
    );
  }

  function structured(questionId, payload, extras) {
    extras = extras || {};
    var correct = Boolean(extras.correct);
    var score =
      typeof extras.score === "number" ? extras.score : correct ? 1 : 0;
    if (typeof extras.maxScore === "number") {
      var safe = contractSafeMark(score, extras.maxScore);
      correct = safe.correct;
      score = safe.score;
    } else if (!correct && score !== 0) {
      // Contract 0.1.0: incorrect client marks must be zero.
      score = 0;
    }
    return {
      questionId: questionId,
      response: payload,
      responseType: extras.responseType || "structured",
      correct: correct,
      score: score
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
    contractSafeMark: contractSafeMark,
    optionText: optionText,
    withTiming: withTiming
  });
})(window);
