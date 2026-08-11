/**
 * Secure learner onboarding client.
 *
 * Keeps temporary learner details in sessionStorage only when an Auth signup
 * must cross an email-confirmation/sign-in boundary. Passwords, tokens and
 * completed profile data are never stored here. All authoritative writes go
 * through api.complete_learner_onboarding, which derives identity from
 * auth.uid().
 */
(function () {
  "use strict";

  var PENDING_KEY = "ocr.unit3CyberSecurity.pendingOnboarding.v1";

  var MESSAGES = Object.freeze({
    INVALID_FIRST_NAME: "Enter your first name.",
    INVALID_SURNAME: "Enter your surname.",
    INVALID_STUDENT_NUMBER: "Enter your Student ID.",
    INVALID_REGISTRATION_OPTION:
      "Choose an available year and group.",
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

  function clean(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function validProfile(details) {
    details = details || {};
    var firstName = clean(details.firstName);
    var surname = clean(details.surname);
    var studentNumber = clean(details.studentNumber);
    if (!firstName || firstName.length > 100) {
      return { ok: false, code: "INVALID_FIRST_NAME" };
    }
    if (!surname || surname.length > 100) {
      return { ok: false, code: "INVALID_SURNAME" };
    }
    if (!studentNumber || studentNumber.length > 100) {
      return { ok: false, code: "INVALID_STUDENT_NUMBER" };
    }
    return {
      ok: true,
      value: {
        firstName: firstName,
        surname: surname,
        studentNumber: studentNumber
      }
    };
  }

  function safePending(details) {
    var checked = validProfile(details);
    if (!checked.ok) return null;
    var pending = checked.value;
    var registrationKey = clean(details && details.registrationKey);
    if (registrationKey) pending.registrationKey = registrationKey;
    return pending;
  }

  function validAccount(details) {
    details = details || {};
    var email = clean(details.email);
    var password = typeof details.password === "string" ? details.password : "";
    var confirmPassword = typeof details.confirmPassword === "string"
      ? details.confirmPassword
      : "";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return { ok: false, code: "INVALID_EMAIL" };
    }
    if (password.length < 8) {
      return { ok: false, code: "WEAK_PASSWORD" };
    }
    if (password !== confirmPassword) {
      return { ok: false, code: "PASSWORD_MISMATCH" };
    }
    return { ok: true, value: { email: email, password: password } };
  }

  function savePending(details) {
    var pending = safePending(details);
    if (!pending) {
      throw onboardingError("REGISTRATION_FAILED");
    }
    try {
      window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    } catch (error) {
      /* In-memory form state remains available for immediate-session signup. */
    }
    return Object.assign({}, pending);
  }

  function getPending() {
    var raw;
    try {
      raw = window.sessionStorage.getItem(PENDING_KEY);
    } catch (error) {
      return null;
    }
    if (!raw) return null;
    try {
      return safePending(JSON.parse(raw));
    } catch (error) {
      clearPending();
      return null;
    }
  }

  function clearPending() {
    try {
      window.sessionStorage.removeItem(PENDING_KEY);
    } catch (error) {
      /* sessionStorage unavailable */
    }
  }

  function onboardingError(code, technicalMessage) {
    var error = new Error(technicalMessage || MESSAGES[code] || MESSAGES.REGISTRATION_FAILED);
    error.name = "SupabaseOnboardingError";
    error.code = code || "REGISTRATION_FAILED";
    error.learnerMessage = MESSAGES[error.code] || MESSAGES.REGISTRATION_FAILED;
    return error;
  }

  function mappedError(error) {
    if (error && error.name === "SupabaseOnboardingError") return error;
    var sourceCode = error && error.code ? String(error.code) : "";
    var sourceMessage = error && error.message ? String(error.message) : "";
    var controlled = Object.keys(MESSAGES).find(function (code) {
      return sourceCode === code || sourceMessage.indexOf(code) !== -1;
    });
    if (controlled) return onboardingError(controlled, sourceMessage);
    if (sourceCode === "NETWORK_ERROR" || (error && error.status === 0)) {
      return onboardingError("NETWORK_ERROR", sourceMessage);
    }
    return onboardingError("REGISTRATION_FAILED", sourceMessage);
  }

  function isSignedIn() {
    var auth = window.SupabaseAuth;
    return Boolean(
      auth &&
        typeof auth.isSignedIn === "function" &&
        auth.isSignedIn()
    );
  }

  function safeOptions(payload) {
    if (!Array.isArray(payload)) throw onboardingError("REGISTRATION_FAILED");
    return payload
      .filter(function (row) {
        return (
          row &&
          typeof row.registration_option === "string" &&
          clean(row.registration_option) &&
          typeof row.year_group === "string" &&
          clean(row.year_group)
        );
      })
      .map(function (row) {
        return Object.freeze({
          registrationKey: clean(row.registration_option),
          academicYear: clean(row.academic_year),
          yearGroup: clean(row.year_group),
          courseKey: clean(row.course_key),
          courseTitle: clean(row.course_title),
          groupCode: clean(row.group_code),
          groupName: clean(row.group_name)
        });
      });
  }

  function getRegistrationOptions() {
    var learning = window.SupabaseLearningApi;
    if (!isSignedIn()) {
      return Promise.reject(onboardingError("AUTH_REQUIRED"));
    }
    if (!learning || typeof learning.getRegistrationOptions !== "function") {
      return Promise.reject(onboardingError("REGISTRATION_FAILED"));
    }
    return learning
      .getRegistrationOptions()
      .then(safeOptions)
      .catch(function (error) {
        throw mappedError(error);
      });
  }

  function complete(details, registrationKey) {
    var checked = validProfile(details);
    var learning = window.SupabaseLearningApi;
    var key = clean(registrationKey);
    if (!checked.ok) {
      return Promise.reject(onboardingError(checked.code));
    }
    if (!key) {
      return Promise.reject(onboardingError("INVALID_REGISTRATION_OPTION"));
    }
    if (!isSignedIn()) {
      return Promise.reject(onboardingError("AUTH_REQUIRED"));
    }
    if (!learning || typeof learning.completeLearnerOnboarding !== "function") {
      return Promise.reject(onboardingError("REGISTRATION_FAILED"));
    }
    return learning
      .completeLearnerOnboarding({
          p_first_name: checked.value.firstName,
          p_surname: checked.value.surname,
          p_student_number: checked.value.studentNumber,
          p_registration_option: key
      })
      .then(function (payload) {
        var row = Array.isArray(payload) ? payload[0] : payload;
        if (!row || typeof row.student_number !== "string") {
          throw onboardingError("REGISTRATION_FAILED");
        }
        clearPending();
        var auth = window.SupabaseAuth;
        if (auth && typeof auth.refreshContext === "function") {
          return auth.refreshContext().then(function () {
            return row;
          });
        }
        return row;
      })
      .catch(function (error) {
        throw mappedError(error);
      });
  }

  window.SupabaseOnboarding = Object.freeze({
    PENDING_KEY: PENDING_KEY,
    MESSAGES: MESSAGES,
    validateProfile: validProfile,
    validateAccount: validAccount,
    savePending: savePending,
    getPending: getPending,
    clearPending: clearPending,
    getRegistrationOptions: getRegistrationOptions,
    complete: complete,
    mapError: mappedError
  });
})();
