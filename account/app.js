/**
 * Unit 3 learner account page — sign in, register, and show link status.
 */
(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function setBusy(button, busy, label) {
    if (!button) return;
    button.disabled = Boolean(busy);
    if (label) button.textContent = label;
  }

  function renderStatus(state) {
    var host = $("account-status");
    if (!host) return;
    host.textContent = "";

    var list = document.createElement("ul");
    list.className = "unit3-account__checklist";

    function item(label, value, ok) {
      var li = document.createElement("li");
      li.className = ok ? "is-ok" : "is-blocked";
      li.textContent = label + ": " + value;
      list.appendChild(li);
    }

    if (!state || state.status === "idle" || state.status === "loading") {
      host.textContent = "Checking your session…";
      return;
    }

    if (state.status === "signed-out" || (!state.session && state.status !== "signed-in-unlinked")) {
      item("Auth session", "Signed out", false);
      item("Learner profile", "Not available", false);
      item("Enrolments", "None", false);
      item("Ready to submit", "No — sign in first", false);
      host.appendChild(list);
      if (state.error && state.error.learnerMessage) {
        var note = document.createElement("p");
        note.className = "unit3-account__error";
        note.textContent = state.error.learnerMessage;
        host.appendChild(note);
      }
      return;
    }

    item("Auth session", "Signed in", true);

    if (state.status === "authenticated" && state.profile) {
      item(
        "Learner profile",
        state.profile.displayName + " (" + state.profile.studentNumber + ")",
        true
      );
    } else {
      item("Learner profile", "Not linked yet", false);
    }

    var enrolments = state.enrolments || [];
    if (enrolments.length) {
      item(
        "Enrolments",
        enrolments
          .map(function (row) {
            return row.groupCode || "group";
          })
          .join(", "),
        true
      );
    } else {
      item("Enrolments", "None", false);
    }

    var ready =
      state.status === "authenticated" &&
      state.profile &&
      enrolments.length > 0;
    item(
      "Ready to submit",
      ready
        ? "Yes — open a Week 2–5 activity with ?backend=supabase"
        : "No — profile/enrolment linking still required",
      ready
    );

    host.appendChild(list);

    var actions = document.createElement("div");
    actions.className = "unit3-account__actions";
    var signOutBtn = document.createElement("button");
    signOutBtn.type = "button";
    signOutBtn.className = "btn btn-secondary";
    signOutBtn.textContent = "Sign out";
    signOutBtn.addEventListener("click", function () {
      window.SupabaseAuth.signOut();
    });
    actions.appendChild(signOutBtn);
    host.appendChild(actions);
  }

  function activateTab(targetId) {
    var tabs = document.querySelectorAll(".unit3-account__tab");
    tabs.forEach(function (tab) {
      var selected = tab.getAttribute("aria-controls") === targetId;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
    });
    ["panel-signin", "panel-register"].forEach(function (id) {
      var panel = $(id);
      if (!panel) return;
      panel.hidden = id !== targetId;
    });
  }

  function bindTabs() {
    $("tab-signin").addEventListener("click", function () {
      activateTab("panel-signin");
    });
    $("tab-register").addEventListener("click", function () {
      activateTab("panel-register");
    });
  }

  function bindSignIn() {
    var form = $("signin-form");
    var errorHost = $("signin-error");
    var submit = $("signin-submit");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      errorHost.textContent = "";
      var email = $("signin-email").value.trim();
      var password = $("signin-password").value;
      if (!email || !password) {
        errorHost.textContent = "Enter your email and password to sign in.";
        return;
      }
      setBusy(submit, true, "Signing in…");
      window.SupabaseAuth.signInWithPassword(email, password)
        .catch(function (error) {
          errorHost.textContent =
            (error && (error.learnerMessage || error.message)) ||
            "Sign-in failed. Check your credentials and try again.";
        })
        .then(function () {
          setBusy(submit, false, "Sign in");
        });
    });
  }

  function bindRegister() {
    var form = $("register-form");
    var errorHost = $("register-error");
    var submit = $("register-submit");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      errorHost.textContent = "";
      var email = $("register-email").value.trim();
      var password = $("register-password").value;
      var confirm = $("register-password-confirm").value;
      if (!email || !password) {
        errorHost.textContent = "Enter an email and password to create an account.";
        return;
      }
      if (password.length < 8) {
        errorHost.textContent = "Choose a password with at least 8 characters.";
        return;
      }
      if (password !== confirm) {
        errorHost.textContent = "Passwords do not match.";
        return;
      }
      setBusy(submit, true, "Creating account…");
      window.SupabaseAuth.signUpWithPassword(email, password)
        .then(function (result) {
          if (result && result.needsConfirmation) {
            errorHost.className = "unit3-account__note";
            errorHost.textContent =
              "Account created. Check your email to confirm it, then sign in.";
            activateTab("panel-signin");
            return;
          }
          errorHost.className = "unit3-account__note";
          errorHost.textContent =
            "Account created. If your learner profile is not linked yet, ask your tutor to complete linking.";
        })
        .catch(function (error) {
          errorHost.className = "unit3-account__error";
          errorHost.textContent =
            (error && (error.learnerMessage || error.message)) ||
            "Registration could not be completed.";
        })
        .then(function () {
          setBusy(submit, false, "Create account");
        });
    });
  }

  function boot() {
    if (!window.SupabaseAuth) {
      $("account-status").textContent =
        "The learner service is not available on this device.";
      return;
    }
    bindTabs();
    bindSignIn();
    bindRegister();
    window.SupabaseAuth.subscribe(renderStatus);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
