/**
 * Unit 3 shared Supabase submit runner.
 *
 * Every weekN-submit.js delegates to this runner when the backend mode is
 * SUPABASE. It provides a single, week-agnostic flow so we do not build
 * bespoke integrations for each of the 45+ scored activities.
 *
 * The runner:
 *   - resolves activity metadata from Unit3CourseContext
 *   - obtains a stable client_attempt_id from the shared adapter
 *   - calls api.submit_attempt via Unit3SupabaseAdapter.submit
 *   - updates the week progress store when submission succeeds
 *   - renders a learner-facing summary via Unit3LearnerDetails
 *   - surfaces failures directly to the learner (no silent fallback)
 */
(function () {
  "use strict";

  var inFlight = false;

  function modules() {
    return {
      course: window.Unit3CourseContext,
      learner: window.Unit3LearnerDetails,
      adapter: window.Unit3SupabaseAdapter,
      api: window.SupabaseLearningApi,
      auth: window.SupabaseAuth
    };
  }

  function isReady() {
    var m = modules();
    return Boolean(m.course && m.adapter && m.api);
  }

  function setMessage(hostId, message, type, utils) {
    var setter =
      utils && utils.setStatusMessage
        ? utils.setStatusMessage
        : function (id, msg, level) {
            var host = document.getElementById(id);
            if (!host) return;
            host.textContent = "";
            if (!msg) return;
            var p = document.createElement("p");
            p.className = "message message-" + (level || "info");
            p.textContent = msg;
            host.appendChild(p);
          };
    setter(hostId, message, type);
  }

  function learnerContextFields() {
    var m = modules();
    if (!m.auth || typeof m.auth.getLearnerContext !== "function") return {};
    var context = m.auth.getLearnerContext();
    if (!context) return {};
    var surname = "";
    if (context.displayName && context.firstName) {
      surname = String(context.displayName)
        .replace(context.firstName, "")
        .trim();
    }
    return {
      firstName: context.firstName || "",
      surname: surname,
      studentId: context.studentNumber || "",
      classGroup: context.groupCode || ""
    };
  }

  function submit(options) {
    var m = modules();
    var utils = window.Unit3ActivityUtils;
    var statusId = options.statusHostId || "unit3-submit-status";
    var summaryId = options.summaryHostId || null;
    var button = options.buttonId
      ? document.getElementById(options.buttonId)
      : null;

    if (inFlight) {
      setMessage(
        statusId,
        "Submission already in progress. Please wait.",
        "warning",
        utils
      );
      return Promise.reject(new Error("Submission already in progress."));
    }

    if (!isReady()) {
      setMessage(
        statusId,
        "The learner service is not available on this device. Contact your tutor.",
        "error",
        utils
      );
      return Promise.reject(new Error("Supabase modules not loaded."));
    }

    var activity = m.course.getActivity(options.activityId);
    if (!activity) {
      setMessage(
        statusId,
        "This activity is not registered. Contact your tutor.",
        "error",
        utils
      );
      return Promise.reject(new Error("Unknown activity."));
    }

    if (typeof options.getResponses !== "function") {
      setMessage(
        statusId,
        "This activity has not been migrated to Supabase yet. Ask your tutor to switch back to the rollback mode.",
        "error",
        utils
      );
      return Promise.reject(new Error("Activity not migrated."));
    }

    var responses;
    try {
      responses = options.getResponses();
    } catch (error) {
      setMessage(
        statusId,
        "The activity did not produce a valid response. Refresh the page and try again.",
        "error",
        utils
      );
      return Promise.reject(error);
    }
    if (!Array.isArray(responses) || !responses.length) {
      setMessage(
        statusId,
        "Complete the activity before submitting your result.",
        "warning",
        utils
      );
      return Promise.reject(new Error("Empty responses."));
    }

    if (button) {
      button.disabled = true;
      button.textContent = "Submitting…";
    }
    inFlight = true;
    setMessage(
      statusId,
      "Submitting your result to the learner service…",
      "info",
      utils
    );

    var attemptId = m.adapter.getOrCreateClientAttemptId(activity.activityId);
    return m.adapter
      .submit({
        activityId: activity.activityId,
        activityVersion: activity.activityVersion,
        clientAttemptId: attemptId,
        responses: responses,
        startedAt: options.getStartedAt ? options.getStartedAt() : null,
        completedAt: options.getCompletedAt
          ? options.getCompletedAt()
          : new Date().toISOString(),
        sourcePage: window.location
          ? window.location.pathname + window.location.search
          : null
      })
      .then(function (submission) {
        inFlight = false;
        if (options.progress && options.progress.markSubmitted) {
          options.progress.markSubmitted(activity.activityId);
        }
        if (summaryId && m.learner && m.learner.renderSubmissionSummary) {
          var ctx = learnerContextFields();
          m.learner.renderSubmissionSummary(summaryId, {
            firstName: ctx.firstName,
            surname: ctx.surname,
            studentId: ctx.studentId,
            classGroup: ctx.classGroup,
            activityName: activity.activityName,
            score: submission.score,
            maximumScore: submission.maxScore
          });
        }
        if (button) {
          button.disabled = false;
          button.textContent = "Start another attempt";
        }
        setMessage(
          statusId,
          submission.duplicate
            ? "This submission was already recorded (idempotent retry)."
            : "Submission recorded. Attempt " + submission.attemptNumber + ".",
          "success",
          utils
        );
        if (typeof options.onSubmitted === "function") {
          try {
            options.onSubmitted({
              recorded: true,
              duplicate: submission.duplicate,
              submission: submission
            });
          } catch (callbackErr) {
            console.error(
              "[Unit3SupabaseSubmitRunner] onSubmitted callback failed",
              callbackErr
            );
          }
        }
        return submission;
      })
      .catch(function (error) {
        inFlight = false;
        console.error(
          "[Unit3SupabaseSubmitRunner] Supabase submission failed",
          error
        );
        if (button) {
          button.disabled = false;
          button.textContent = options.submitLabel || "Submit formative result";
        }
        var detail =
          (error && (error.learnerMessage || error.message)) ||
          "Your result was not saved. Check your connection and try again.";
        setMessage(statusId, detail, "error", utils);
        if (typeof options.onError === "function") {
          try {
            options.onError(error);
          } catch (ignored) {
            /* noop */
          }
        }
        throw error;
      });
  }

  window.Unit3SupabaseSubmitRunner = Object.freeze({
    submit: submit,
    isReady: isReady,
    isInFlight: function () {
      return inFlight;
    }
  });
})();
