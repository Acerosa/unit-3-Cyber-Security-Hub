/** Unit 3 learner account page — sign in and complete secure onboarding. */
(function () {
  "use strict";

  var registerStage = "account";

  function $(id) { return document.getElementById(id); }

  function setBusy(button, busy, label) {
    if (!button) return;
    button.disabled = Boolean(busy);
    if (label) button.textContent = label;
  }

  function setMessage(text, isError) {
    var host = $("register-error");
    host.className = isError ? "unit3-account__error" : "unit3-account__note";
    host.setAttribute("role", isError ? "alert" : "status");
    host.textContent = text || "";
  }

  function setInvalid(id, invalid) {
    var input = $(id);
    if (input) input.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  function activateTab(targetId) {
    document.querySelectorAll(".unit3-account__tab").forEach(function (tab) {
      var selected = tab.getAttribute("aria-controls") === targetId;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });
    ["panel-signin", "panel-register"].forEach(function (id) {
      var panel = $(id);
      if (panel) panel.hidden = id !== targetId;
    });
  }

  function profileFromForm() {
    return {
      firstName: $("register-first-name").value.trim(),
      surname: $("register-surname").value.trim(),
      studentNumber: $("register-student-number").value.trim()
    };
  }

  function restorePending() {
    var pending = window.SupabaseOnboarding.getPending();
    if (!pending) return null;
    $("register-first-name").value = pending.firstName;
    $("register-surname").value = pending.surname;
    $("register-student-number").value = pending.studentNumber;
    return pending;
  }

  function validateProfile() {
    var checked = window.SupabaseOnboarding.validateProfile(profileFromForm());
    ["register-first-name", "register-surname", "register-student-number"].forEach(function (id) {
      setInvalid(id, false);
    });
    if (checked.ok) return checked.value;
    var fieldByCode = {
      INVALID_FIRST_NAME: "register-first-name",
      INVALID_SURNAME: "register-surname",
      INVALID_STUDENT_NUMBER: "register-student-number"
    };
    var field = fieldByCode[checked.code];
    setInvalid(field, true);
    setMessage(window.SupabaseOnboarding.MESSAGES[checked.code], true);
    if ($(field)) $(field).focus();
    return null;
  }

  function showAccountStep(existingAccount) {
    registerStage = existingAccount ? "profile" : "account";
    $("register-step").textContent = existingAccount
      ? "Complete your learner details"
      : "Step 1 of 2 — Account details";
    $("register-profile-fields").hidden = false;
    $("register-account-fields").hidden = Boolean(existingAccount);
    $("register-class-fields").hidden = true;
    ["register-first-name", "register-surname", "register-student-number"].forEach(function (id) {
      $(id).readOnly = false;
    });
    setBusy($("register-submit"), false, "Continue");
  }

  function showClassKeyStep() {
    var pending = restorePending();
    if (!pending) {
      showAccountStep(true);
      setMessage("Enter your learner details to finish setting up your account.", false);
      return Promise.resolve();
    }
    registerStage = "class";
    activateTab("panel-register");
    $("register-step").textContent = "Step 2 of 2 — Join your class";
    $("register-profile-fields").hidden = false;
    $("register-account-fields").hidden = true;
    $("register-class-fields").hidden = false;
    ["register-first-name", "register-surname", "register-student-number"].forEach(function (id) {
      $(id).readOnly = true;
    });
    setBusy($("register-submit"), false, "Join class");
    if ($("register-class-key")) $("register-class-key").focus();
    return Promise.resolve();
  }

  function bindTabs() {
    var tabs = [$("tab-signin"), $("tab-register")];
    $("tab-signin").addEventListener("click", function () { activateTab("panel-signin"); });
    $("tab-register").addEventListener("click", function () {
      activateTab("panel-register");
      var authState = window.SupabaseAuth.getState();
      if (authState.status === "signed-in-unlinked") {
        if (window.SupabaseOnboarding.getPending()) showClassKeyStep();
        else showAccountStep(true);
      }
    });
    tabs.forEach(function (tab, index) {
      tab.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        var next = event.key === "ArrowRight"
          ? (index + 1) % tabs.length
          : (index + tabs.length - 1) % tabs.length;
        tabs[next].click();
        tabs[next].focus();
      });
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
          errorHost.textContent = (error && error.learnerMessage) ||
            "Sign-in failed. Check your credentials and try again.";
        })
        .finally(function () {
          $("signin-password").value = "";
          setBusy(submit, false, "Sign in");
        });
    });
  }

  function beginRegistration() {
    var profile = validateProfile();
    if (!profile) return Promise.resolve();
    window.SupabaseOnboarding.savePending(profile);
    if (registerStage === "profile" || window.SupabaseAuth.isSignedIn()) {
      return showClassKeyStep();
    }
    var email = $("register-email").value.trim();
    var password = $("register-password").value;
    var confirm = $("register-password-confirm").value;
    ["register-email", "register-password", "register-password-confirm"].forEach(function (id) {
      setInvalid(id, false);
    });
    var account = window.SupabaseOnboarding.validateAccount({
      email: email,
      password: password,
      confirmPassword: confirm
    });
    if (!account.ok) {
      var accountField = {
        INVALID_EMAIL: "register-email",
        WEAK_PASSWORD: "register-password",
        PASSWORD_MISMATCH: "register-password-confirm"
      }[account.code];
      setInvalid(accountField, true);
      setMessage(window.SupabaseOnboarding.MESSAGES[account.code], true);
      $(accountField).focus();
      return Promise.resolve();
    }
    setBusy($("register-submit"), true, "Creating account…");
    return window.SupabaseAuth.signUpWithPassword(
      account.value.email,
      account.value.password
    ).then(function (result) {
      $("register-password").value = "";
      $("register-password-confirm").value = "";
      if (result && result.existingAccount) {
        $("signin-email").value = email;
        activateTab("panel-signin");
        $("signin-error").className = "unit3-account__note";
        $("signin-error").setAttribute("role", "status");
        $("signin-error").textContent =
          "An account with this email already exists. Sign in with your existing email and password.";
        return;
      }
      if (result && result.needsConfirmation) {
        $("signin-email").value = email;
        activateTab("panel-signin");
        $("signin-error").className = "unit3-account__note";
        $("signin-error").setAttribute("role", "status");
        $("signin-error").textContent =
          "If this is a new email address, check your inbox to confirm the account, then return here and sign in.";
        return;
      }
      return showClassKeyStep();
    });
  }

  function completeRegistration() {
    var pending = window.SupabaseOnboarding.getPending();
    var classKey = ($("register-class-key") && $("register-class-key").value || "").trim();
    setInvalid("register-class-key", false);
    if (!pending) {
      showAccountStep(true);
      setMessage("Enter your learner details to continue.", true);
      return Promise.resolve();
    }
    if (!classKey) {
      setInvalid("register-class-key", true);
      setMessage("Enter the class registration key from your tutor.", true);
      $("register-class-key").focus();
      return Promise.resolve();
    }
    setBusy($("register-submit"), true, "Joining class…");
    return Promise.resolve(window.SupabaseOnboarding.complete(pending)).then(function () {
      if (typeof window.SupabaseOnboarding.joinClass !== "function") {
        throw Object.assign(new Error("Join class is unavailable."), {
          learnerMessage: "Join class is unavailable right now. Try again shortly."
        });
      }
      return window.SupabaseOnboarding.joinClass(classKey);
    }).then(function () {
      setMessage("You have joined your class.", false);
      $("register-form").reset();
      showAccountStep(false);
    });
  }

  function bindRegister() {
    $("register-form").addEventListener("submit", function (event) {
      event.preventDefault();
      setMessage("", false);
      var action = registerStage === "class" ? completeRegistration() : beginRegistration();
      Promise.resolve(action).catch(function (error) {
        setMessage((error && error.learnerMessage) ||
          "Registration could not be completed. Try again.", true);
      }).finally(function () {
        if (registerStage !== "class") {
          setBusy($("register-submit"), false, "Continue");
        } else {
          setBusy($("register-submit"), false, "Join class");
        }
      });
    });
  }

  function handleAuthState(state) {
    if (!state) return;
    if (state.status === "signed-in-unlinked") {
      activateTab("panel-register");
      if (window.SupabaseOnboarding.getPending()) showClassKeyStep();
      else showAccountStep(true);
    }
    if (state.status === "authenticated") setMessage("", false);
  }

  function boot() {
    if (!window.SupabaseAuth || !window.SupabaseOnboarding) return;
    bindTabs();
    bindSignIn();
    bindRegister();
    restorePending();
    window.SupabaseAuth.subscribe(handleAuthState);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
