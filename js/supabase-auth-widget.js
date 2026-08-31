/**
 * Compact activity-page account control backed by Core's account dialog.
 */
(function () {
  "use strict";

  var HOST_ID = "unit3-supabase-auth-widget";
  var dialog = null;
  var mounted = false;

  function mode() {
    var backend = window.Unit3BackendMode;
    if (backend && typeof backend.getSubmissionProvider === "function") {
      return backend.getSubmissionProvider();
    }
    return backend && backend.getMode ? backend.getMode() : "SUPABASE";
  }

  function ensureHost() {
    var host = document.getElementById(HOST_ID);
    if (host) return host;
    host = document.createElement("aside");
    host.id = HOST_ID;
    host.className = "unit3-auth-widget";
    host.setAttribute("aria-label", "Learner account");
    host.setAttribute("data-academic-integrity", "exclude");
    var main = document.getElementById("main-content");
    if (main) main.insertBefore(host, main.firstChild);
    return host;
  }

  function accountDialog() {
    if (dialog) return dialog;
    var core = window.LearningPlatformCore;
    var platform = window.LearningPlatform && window.LearningPlatform.platform;
    if (!core || !platform || typeof core.createAccountDialog !== "function") {
      return null;
    }
    dialog = core.createAccountDialog({
      authService: platform.auth,
      learnerContext: platform.learner,
      onboardingService: platform.onboarding
    });
    document.body.appendChild(dialog.element);
    return dialog;
  }

  function button(label, action) {
    var control = document.createElement("button");
    control.type = "button";
    control.className = "btn btn-primary";
    control.textContent = label;
    control.addEventListener("click", action);
    return control;
  }

  function render(state) {
    if (mode() !== "SUPABASE") {
      var old = document.getElementById(HOST_ID);
      if (old) old.remove();
      return;
    }
    var host = ensureHost();
    if (!host) return;
    host.textContent = "";
    var context = window.SupabaseAuth.getLearnerContext();
    var heading = document.createElement("h2");
    heading.className = "unit3-auth-widget__heading";

    if (state.status === "authenticated" && context) {
      heading.textContent = "Signed in as " +
        (context.displayName || context.fullName || context.firstName);
      host.appendChild(heading);
      if (context.groupCode) {
        var group = document.createElement("p");
        group.className = "unit3-auth-widget__note";
        group.textContent = "Group: " + context.groupCode;
        host.appendChild(group);
      }
      host.appendChild(button("Sign out", function () {
        window.SupabaseAuth.signOut();
      }));
      return;
    }

    if (state.status === "loading") {
      heading.textContent = "Checking your learner session…";
      heading.setAttribute("aria-live", "polite");
      host.appendChild(heading);
      return;
    }

    heading.textContent = state.status === "signed-in-unlinked"
      ? "Complete your learner account"
      : "Sign in to record your work";
    host.appendChild(heading);
    var note = document.createElement("p");
    note.className = "unit3-auth-widget__note";
    note.textContent = state.status === "signed-in-unlinked"
      ? "Choose your course group before submitting work."
      : "Core securely restores your account and learner profile.";
    host.appendChild(note);
    host.appendChild(button(
      state.status === "signed-in-unlinked" ? "Complete account" : "Sign in or register",
      function (event) {
        var account = accountDialog();
        if (account) account.open(event.currentTarget);
      }
    ));
  }

  function mount() {
    if (mounted) return;
    mounted = true;
    accountDialog();
    window.SupabaseAuth.subscribe(render);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  window.Unit3SupabaseAuthWidget = Object.freeze({
    mount: mount,
    render: function () {
      render(window.SupabaseAuth.getState());
    },
    usesCoreAccountDialog: function () {
      return true;
    },
    HOST_ID: HOST_ID
  });
})();
