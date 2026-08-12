/**
 * Compatibility facade over learning-platform-core onboarding.
 */
(function () {
  "use strict";

  var platform = window.LearningPlatform && window.LearningPlatform.platform;
  var onboarding = platform && platform.onboarding;

  if (!onboarding) {
    throw new Error("LEARNING_PLATFORM_ONBOARDING_UNAVAILABLE");
  }

  var MESSAGES = Object.freeze({
    INVALID_FIRST_NAME: "Enter your first name.",
    INVALID_SURNAME: "Enter your surname.",
    INVALID_STUDENT_NUMBER: "Enter your Student ID.",
    INVALID_REGISTRATION_OPTION: "Choose an available year and group.",
    INVALID_EMAIL: "Enter a valid college email address.",
    WEAK_PASSWORD: "Choose a password with at least 8 characters.",
    PASSWORD_MISMATCH: "Passwords do not match.",
    GROUP_INACTIVE:
      "That group is no longer accepting registrations. Choose another option.",
    ACADEMIC_YEAR_INACTIVE:
      "That academic year is no longer accepting registrations.",
    STUDENT_NUMBER_ALREADY_LINKED:
      "That Student ID is already linked to another account. Contact your tutor.",
    AUTH_ACCOUNT_ALREADY_LINKED:
      "This account is already linked to a different learner profile.",
    ONBOARDING_CONFLICT:
      "These details do not match the learner record. Contact your tutor.",
    AUTH_REQUIRED: "Sign in before completing learner registration.",
    NETWORK_ERROR:
      "The learner service could not be reached. Check your connection and try again.",
    REGISTRATION_FAILED:
      "Learner registration could not be completed. Try again or contact your tutor."
  });

  window.SupabaseOnboarding = Object.freeze({
    PENDING_KEY: onboarding.pendingKey,
    MESSAGES: MESSAGES,
    validateProfile: onboarding.validateProfile,
    validateAccount: onboarding.validateAccount,
    savePending: onboarding.savePending,
    getPending: onboarding.getPending,
    clearPending: onboarding.clearPending,
    getRegistrationOptions: onboarding.getRegistrationOptions,
    complete: onboarding.complete,
    mapError: function (error) {
      return error;
    }
  });
})();
