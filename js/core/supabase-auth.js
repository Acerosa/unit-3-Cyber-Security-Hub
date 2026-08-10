/**
 * Unit 3 Supabase Auth wrapper.
 *
 * Sign-in, session restoration, sign-out, and learner context loading.
 * The browser never supplies a student, group, assignment, score or attempt
 * identity for authorization. Identity is derived server-side from
 * auth.uid() and exposed through api.my_profile and api.my_enrolments.
 */
(function () {
  "use strict";

  var client = window.SupabaseClient;
  var state = {
    status: "idle",
    session: null,
    profile: null,
    enrolments: [],
    error: null
  };
  var listeners = [];
  var initialised = false;
  var restoreInFlight = null;

  function AuthError(code, message) {
    this.name = "SupabaseAuthError";
    this.code = code || "AUTHENTICATION_FAILED";
    this.message =
      message || "Your Supabase sign-in could not be completed.";
    this.learnerMessage = learnerMessageFor(this.code, this.message);
  }

  AuthError.prototype = Object.create(Error.prototype);
  AuthError.prototype.constructor = AuthError;

  function learnerMessageFor(code, fallback) {
    var messages = {
      AUTHENTICATION_FAILED:
        "Sign-in failed. Check your email and password and try again.",
      INVALID_AUTH_CREDENTIALS:
        "Enter a valid email address and password.",
      REGISTRATION_FAILED:
        "Registration could not be completed. Try a different email or try again later.",
      EMAIL_EXISTS:
        "An account with this email already exists. Sign in instead.",
      WEAK_PASSWORD:
        "Choose a password with at least 8 characters.",
      STUDENT_IDENTITY_NOT_FOUND:
        "You are signed in, but your learner profile is not linked yet. Ask your tutor to link your account before submitting work.",
      CONFIRMATION_REQUIRED:
        "Check your email to confirm the account, then sign in.",
      NETWORK_ERROR:
        "The learner service could not be reached. Check your connection and try again."
    };
    return messages[code] || fallback || messages.AUTHENTICATION_FAILED;
  }

  function toAuthError(error) {
    if (error && error.name === "SupabaseAuthError") return error;
    var code =
      (error && error.code) ||
      (error && error.status === 0 ? "NETWORK_ERROR" : "AUTHENTICATION_FAILED");
    var message = (error && error.message) || "";
    if (/already registered|already been registered|User already registered/i.test(message)) {
      code = "EMAIL_EXISTS";
    } else if (/password/i.test(message) && /weak|least|characters/i.test(message)) {
      code = "WEAK_PASSWORD";
    }
    return new AuthError(code, message);
  }

  function notify() {
    var snapshot = getState();
    listeners.slice().forEach(function (listener) {
      listener(snapshot);
    });
  }

  function getState() {
    return {
      status: state.status,
      session: state.session,
      profile: state.profile,
      enrolments: state.enrolments.slice(),
      error: state.error
    };
  }

  function safeProfile(payload) {
    var row = Array.isArray(payload) ? payload[0] : null;
    if (
      !row ||
      typeof row.student_number !== "string" ||
      !row.student_number.trim() ||
      typeof row.first_name !== "string" ||
      !row.first_name.trim() ||
      typeof row.display_name !== "string" ||
      !row.display_name.trim()
    ) {
      throw new AuthError(
        "STUDENT_IDENTITY_NOT_FOUND",
        "Your learner profile is not available."
      );
    }
    return {
      studentNumber: row.student_number.trim(),
      firstName: row.first_name.trim(),
      displayName: row.display_name.trim()
    };
  }

  function safeEnrolments(payload) {
    if (!Array.isArray(payload)) {
      throw new AuthError(
        "INVALID_RESPONSE",
        "Your enrolment information could not be read."
      );
    }
    return payload
      .filter(function (row) {
        return (
          row &&
          typeof row.group_code === "string" &&
          row.group_code.trim()
        );
      })
      .map(function (row) {
        return {
          enrolmentId: row.enrolment_id,
          groupCode: row.group_code.trim(),
          groupName:
            typeof row.group_name === "string" ? row.group_name.trim() : "",
          academicYear:
            typeof row.academic_year === "string"
              ? row.academic_year.trim()
              : "",
          courseTitle:
            typeof row.course_title === "string"
              ? row.course_title.trim()
              : "",
          joinedOn: row.joined_on || null,
          leftOn: row.left_on || null,
          status: row.status || ""
        };
      });
  }

  function getProfile() {
    return client
      .request(
        "/rest/v1/my_profile?select=student_number,first_name,display_name&limit=1",
        { schema: "api" }
      )
      .then(safeProfile);
  }

  function getEnrolments() {
    return client
      .request("/rest/v1/my_enrolments?select=*&order=joined_on.asc", {
        schema: "api"
      })
      .then(safeEnrolments);
  }

  function contextFrom(profile, enrolments) {
    var active =
      enrolments.filter(function (enrolment) {
        return enrolment.status === "active";
      })[0] ||
      enrolments[0] ||
      null;
    return Object.freeze({
      studentId: profile.studentNumber,
      studentNumber: profile.studentNumber,
      firstName: profile.firstName,
      displayName: profile.displayName,
      group: active ? active.groupCode : "",
      groupCode: active ? active.groupCode : "",
      groupName: active ? active.groupName : "",
      enrolments: enrolments.slice()
    });
  }

  function loadContext(session) {
    if (!session) {
      state.status = "signed-out";
      state.session = null;
      state.profile = null;
      state.enrolments = [];
      state.error = null;
      notify();
      return Promise.resolve(null);
    }

    state.status = "loading";
    state.session = session;
    state.error = null;
    notify();
    return Promise.all([
      getProfile().catch(function (error) {
        if (error && error.code === "STUDENT_IDENTITY_NOT_FOUND") {
          return null;
        }
        throw error;
      }),
      getEnrolments().catch(function () {
        return [];
      })
    ])
      .then(function (values) {
        var profile = values[0];
        var enrolments = values[1] || [];
        state.profile = profile;
        state.enrolments = enrolments;
        if (!profile) {
          state.status = "signed-in-unlinked";
          state.error = new AuthError(
            "STUDENT_IDENTITY_NOT_FOUND",
            "Your learner profile is not available."
          );
          notify();
          return null;
        }
        state.status = "authenticated";
        state.error = null;
        notify();
        return contextFrom(profile, enrolments);
      })
      .catch(function (error) {
        state.status = "error";
        state.profile = null;
        state.enrolments = [];
        state.error = toAuthError(error);
        notify();
        throw state.error;
      });
  }

  function initialise() {
    if (initialised) {
      return restoreInFlight || Promise.resolve(state.profile);
    }
    initialised = true;
    if (client && client.onAuthStateChange) {
      client.onAuthStateChange(function (event, session) {
        if (event === "SIGNED_OUT") {
          loadContext(null);
          return;
        }
        if (session && event !== "INITIAL_SESSION") {
          loadContext(session).catch(function () {});
        }
      });
    }
    restoreInFlight = client
      .getSessionAsync()
      .then(function (session) {
        return loadContext(session);
      })
      .catch(function (error) {
        state.status = "error";
        state.error = error;
        notify();
        throw error;
      })
      .finally(function () {
        restoreInFlight = null;
      });
    return restoreInFlight;
  }

  function signInWithPassword(email, password) {
    state.status = "loading";
    state.error = null;
    notify();
    return client
      .signInWithPassword(email, password)
      .then(function (session) {
        return loadContext(session).then(function () {
          return getState();
        });
      })
      .catch(function (error) {
        var mapped = toAuthError(error);
        state.status = "error";
        state.error = mapped;
        notify();
        client.clearSession();
        throw mapped;
      });
  }

  function signUpWithPassword(email, password) {
    state.status = "loading";
    state.error = null;
    notify();
    if (!client || typeof client.signUpWithPassword !== "function") {
      var missing = new AuthError(
        "CONFIGURATION_ERROR",
        "Registration is not available on this device."
      );
      state.status = "error";
      state.error = missing;
      notify();
      return Promise.reject(missing);
    }
    return client
      .signUpWithPassword(email, password)
      .then(function (result) {
        if (result && result.session) {
          return loadContext(result.session).then(function () {
            return {
              state: getState(),
              needsConfirmation: false
            };
          });
        }
        state.status = "signed-out";
        state.session = null;
        state.profile = null;
        state.enrolments = [];
        state.error = new AuthError(
          "CONFIRMATION_REQUIRED",
          "Check your email to confirm the account, then sign in."
        );
        notify();
        return {
          state: getState(),
          needsConfirmation: true
        };
      })
      .catch(function (error) {
        var mapped = toAuthError(error);
        state.status = "error";
        state.error = mapped;
        notify();
        throw mapped;
      });
  }

  function restoreProfile() {
    return initialise()
      .then(function () {
        return state.profile;
      })
      .catch(function (error) {
        if (
          error &&
          (error.code === "AUTHENTICATION_REQUIRED" ||
            error.code === "STUDENT_IDENTITY_NOT_FOUND")
        ) {
          return null;
        }
        throw error;
      });
  }

  function signOut() {
    return client.signOut().then(function () {
      return loadContext(null);
    });
  }

  function subscribe(listener) {
    if (typeof listener !== "function") {
      return function () {};
    }
    listeners.push(listener);
    listener(getState());
    initialise().catch(function () {});
    return function () {
      listeners = listeners.filter(function (candidate) {
        return candidate !== listener;
      });
    };
  }

  window.SupabaseAuth = Object.freeze({
    initialise: initialise,
    signInWithPassword: signInWithPassword,
    signUpWithPassword: signUpWithPassword,
    restoreProfile: restoreProfile,
    getProfile: getProfile,
    getEnrolments: getEnrolments,
    getLearnerContext: function () {
      return state.profile
        ? contextFrom(state.profile, state.enrolments)
        : null;
    },
    getState: getState,
    subscribe: subscribe,
    signOut: signOut,
    hasSession: function () {
      return Boolean(
        state.session || (client && client.hasSession && client.hasSession())
      );
    },
    isAuthenticated: function () {
      return state.status === "authenticated";
    },
    isSignedIn: function () {
      return (
        state.status === "authenticated" ||
        state.status === "signed-in-unlinked" ||
        Boolean(state.session)
      );
    },
    Error: AuthError
  });
})();
