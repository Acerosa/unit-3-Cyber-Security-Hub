/**
 * Compatibility facade for legacy Unit 3 callers.
 *
 * learning-platform-core owns the Supabase client and Auth session. This file
 * deliberately contains no REST fallback and no token persistence.
 */
(function () {
  "use strict";

  var platform = window.LearningPlatform && window.LearningPlatform.platform;

  if (!platform || !platform.client || !platform.auth) {
    throw new Error("LEARNING_PLATFORM_CLIENT_UNAVAILABLE");
  }

  function configured() {
    return Boolean(platform.client && typeof platform.client.schema === "function");
  }

  function session() {
    return platform.auth.getSession();
  }

  window.SupabaseClient = Object.freeze({
    isConfigured: configured,
    hasSdk: configured,
    getClient: function () {
      return platform.client;
    },
    getSession: session,
    getSessionAsync: function () {
      return Promise.resolve(session());
    },
    hasSession: function () {
      return platform.auth.isSignedIn();
    },
    clearSession: function () {
      return platform.auth.signOut();
    },
    signInWithPassword: function (email, password) {
      return platform.auth.signIn(email, password).then(function () {
        return session();
      });
    },
    signUpWithPassword: function (email, password) {
      return platform.auth.signUp(email, password);
    },
    signOut: function () {
      return platform.auth.signOut();
    },
    onAuthStateChange: function (listener) {
      return platform.auth.subscribe(function (state) {
        if (typeof listener !== "function") return;
        listener(state.status, state.session || null);
      });
    }
  });
})();
