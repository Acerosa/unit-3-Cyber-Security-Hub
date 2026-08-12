/**
 * Unit 3 compatibility facade over learning-platform-core Auth and learner
 * context. Core owns session persistence, restoration, profile and enrolments.
 */
(function () {
  "use strict";

  var platform = window.LearningPlatform && window.LearningPlatform.platform;
  var auth = platform && platform.auth;
  var learner = platform && platform.learner;
  var listeners = [];
  var lastError = null;
  var initialised = false;

  if (!auth || !learner) {
    throw new Error("LEARNING_PLATFORM_AUTH_UNAVAILABLE");
  }

  function context() {
    return learner.getContext();
  }

  function mappedStatus() {
    var authState = auth.getState();
    var learnerState = learner.getState();
    if (authState.status === "error" || learnerState.status === "error") {
      return "error";
    }
    if (
      authState.status === "loading" ||
      authState.status === "signing-in" ||
      learnerState.status === "loading"
    ) {
      return "loading";
    }
    if (!auth.isSignedIn()) return "signed-out";
    if (learnerState.status === "onboarding-required") {
      return "signed-in-unlinked";
    }
    return learnerState.status === "authenticated"
      ? "authenticated"
      : "loading";
  }

  function profileFromContext(value) {
    if (!value) return null;
    return {
      studentNumber: value.studentNumber,
      firstName: value.firstName,
      surname: value.surname,
      displayName: value.displayName,
      contactEmail: value.contactEmail
    };
  }

  function getState() {
    var learnerState = learner.getState();
    var authState = auth.getState();
    var value = context();
    return {
      status: mappedStatus(),
      session: auth.getSession(),
      profile: profileFromContext(value),
      enrolments: value && Array.isArray(value.enrolments)
        ? value.enrolments.slice()
        : [],
      error: learnerState.error || authState.error || lastError
    };
  }

  function notify() {
    var state = getState();
    listeners.slice().forEach(function (listener) {
      listener(state);
    });
  }

  function bind() {
    if (initialised) return;
    initialised = true;
    auth.subscribe(notify);
    learner.subscribe(notify);
  }

  function initialise() {
    bind();
    return window.LearningPlatform.ready.then(function () {
      notify();
      return context();
    });
  }

  function refreshContext() {
    return learner.refresh().then(function () {
      notify();
      return context();
    });
  }

  function signInWithPassword(email, password) {
    lastError = null;
    return auth.signIn(email, password)
      .then(refreshContext)
      .then(getState)
      .catch(function (error) {
        lastError = error;
        notify();
        throw error;
      });
  }

  function signUpWithPassword(email, password) {
    lastError = null;
    return auth.signUp(email, password).then(function (result) {
      if (!result.needsConfirmation && auth.isSignedIn()) {
        return refreshContext().then(function () {
          return result;
        });
      }
      notify();
      return result;
    }).catch(function (error) {
      lastError = error;
      notify();
      throw error;
    });
  }

  function signOut() {
    platform.onboarding.clearPending();
    return auth.signOut().then(function (result) {
      lastError = null;
      notify();
      return result;
    });
  }

  function subscribe(listener) {
    if (typeof listener !== "function") return function () {};
    bind();
    listeners.push(listener);
    listener(getState());
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
    restoreProfile: function () {
      return initialise().then(function () {
        return profileFromContext(context());
      });
    },
    getProfile: function () {
      return platform.profile.getProfile();
    },
    getEnrolments: function () {
      return platform.enrolment.getEnrolments();
    },
    refreshContext: refreshContext,
    getLearnerContext: context,
    getState: getState,
    subscribe: subscribe,
    signOut: signOut,
    hasSession: function () {
      return auth.isSignedIn();
    },
    isAuthenticated: function () {
      return mappedStatus() === "authenticated";
    },
    isSignedIn: function () {
      return auth.isSignedIn();
    }
  });
})();
