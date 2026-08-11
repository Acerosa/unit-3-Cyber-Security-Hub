/** Unit 3 learner account page — sign in and complete secure onboarding. */
(function () {
  "use strict";

  var registerStage = "account";
  var optionsInFlight = null;

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

  function optionLabel(option) {
    var group = option.groupName || option.groupCode;
    var course = option.courseTitle ? " — " + option.courseTitle : "";
    var year = option.academicYear ? " (" + option.academicYear + ")" : "";
    return option.yearGroup + " — " + group + course + year;
  }

  function populateOptions(options, selectedKey) {
    var select = $("register-option");
    select.textContent = "";
    var placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = options.length
      ? "Select your year and group"
      : "No registration choices are currently available";
    select.appendChild(placeholder);
    options.forEach(function (option) {
      var item = document.createElement("option");
      item.value = option.registrationKey;
      item.textContent = optionLabel(option);
      if (selectedKey === option.registrationKey) item.selected = true;
      select.appendChild(item);
    });
    select.disabled = options.length === 0;
  }

  function showAccountStep(existingAccount) {
    registerStage = existingAccount ? "profile" : "account";
    $("register-step").textContent = existingAccount
      ? "Step 1 of 2 — Complete your learner details"
      : "Step 1 of 2 — Account details";
    $("register-profile-fields").hidden = false;
    $("register-account-fields").hidden = Boolean(existingAccount);
    $("register-option-fields").hidden = true;
    ["register-first-name", "register-surname", "register-student-number"].forEach(function (id) {
      $(id).readOnly = false;
    });
    setBusy($("register-submit"), false, "Continue");
  }

  function showOptionStep() {
    var pending = restorePending();
    if (!pending) {
      showAccountStep(true);
      setMessage("Enter your learner details to finish setting up your account.", false);
      return Promise.resolve();
    }
    registerStage = "option";
    activateTab("panel-register");
    $("register-step").textContent = "Step 2 of 2 — Choose your year/group";
    $("register-profile-fields").hidden = false;
    $("register-account-fields").hidden = true;
    $("register-option-fields").hidden = false;
    ["register-first-name", "register-surname", "register-student-number"].forEach(function (id) {
      $(id).readOnly = true;
    });
    setBusy($("register-submit"), true, "Loading choices…");
    setMessage("", false);
    if (!optionsInFlight) {
      optionsInFlight = window.SupabaseOnboarding.getRegistrationOptions().finally(function () {
        optionsInFlight = null;
      });
    }
    return optionsInFlight.then(function (options) {
      populateOptions(options, pending.registrationKey);
      setBusy($("register-submit"), options.length === 0, "Complete registration");
      if (options.length) $("register-option").focus();
    }).catch(function (error) {
      setBusy($("register-submit"), false, "Try loading choices again");
      setMessage(error.learnerMessage, true);
    });
  }

  function bindTabs() {
    var tabs = [$("tab-signin"), $("tab-register")];
    $("tab-signin").addEventListener("click", function () { activateTab("panel-signin"); });
    $("tab-register").addEventListener("click", function () {
      activateTab("panel-register");
      var authState = window.SupabaseAuth.getState();
      if (authState.status === "signed-in-unlinked") {
        if (window.SupabaseOnboarding.getPending()) showOptionStep();
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
      return showOptionStep();
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
      if (result && result.needsConfirmation) {
        $("signin-email").value = email;
        activateTab("panel-signin");
        $("signin-error").className = "unit3-account__note";
        $("signin-error").setAttribute("role", "status");
        $("signin-error").textContent =
          "Account created. Check your email to confirm your account before signing in.";
        return;
      }
      return showOptionStep();
    });
  }

  function completeRegistration() {
    if ($("register-option").disabled) {
      return showOptionStep();
    }
    var pending = window.SupabaseOnboarding.getPending();
    var registrationKey = $("register-option").value;
    setInvalid("register-option", false);
    if (!pending) {
      showAccountStep(true);
      setMessage("Enter your learner details to continue.", true);
      return Promise.resolve();
    }
    if (!registrationKey) {
      setInvalid("register-option", true);
      setMessage("Choose your year and group.", true);
      $("register-option").focus();
      return Promise.resolve();
    }
    window.SupabaseOnboarding.savePending(Object.assign({}, pending, {
      registrationKey: registrationKey
    }));
    setBusy($("register-submit"), true, "Completing registration…");
    return window.SupabaseOnboarding.complete(pending, registrationKey).then(function () {
      setMessage("Registration complete. Your learner account is ready.", false);
      $("register-form").reset();
      showAccountStep(false);
    });
  }

  function bindRegister() {
    $("register-form").addEventListener("submit", function (event) {
      event.preventDefault();
      setMessage("", false);
      var action = registerStage === "option" ? completeRegistration() : beginRegistration();
      Promise.resolve(action).catch(function (error) {
        setMessage((error && error.learnerMessage) ||
          "Registration could not be completed. Try again.", true);
      }).finally(function () {
        if (registerStage !== "option") {
          setBusy($("register-submit"), false, "Continue");
        } else if (!$("register-option").disabled) {
          setBusy($("register-submit"), false, "Complete registration");
        }
      });
    });
  }

  function handleAuthState(state) {
    if (!state) return;
    if (state.status === "signed-in-unlinked") {
      activateTab("panel-register");
      if (window.SupabaseOnboarding.getPending()) showOptionStep();
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
