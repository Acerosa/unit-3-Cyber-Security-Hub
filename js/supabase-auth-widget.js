/**
 * Unit 3 Supabase Auth widget.
 *
 * Renders a compact sign-in/sign-out block above the activity content on
 * Supabase-enabled pages. Only appears when the backend mode is SUPABASE.
 * Preserves the surrounding page markup, accessibility semantics and
 * keyboard behaviour. The widget never surfaces raw error internals.
 */
(function () {
  "use strict";

  var HOST_ID = "unit3-supabase-auth-widget";
  var mounted = false;
  var lastState = null;

  function mode() {
    return window.Unit3BackendMode && window.Unit3BackendMode.getMode
      ? window.Unit3BackendMode.getMode()
      : "APPS_SCRIPT";
  }

  function ensureHost() {
    var host = document.getElementById(HOST_ID);
    if (host) return host;
    host = document.createElement("aside");
    host.id = HOST_ID;
    host.className = "unit3-auth-widget";
    host.setAttribute("aria-label", "Learner sign-in");
    host.setAttribute("data-academic-integrity", "exclude");
    var main = document.getElementById("main-content");
    if (main && main.firstChild) {
      main.insertBefore(host, main.firstChild);
    } else if (document.body) {
      document.body.insertBefore(host, document.body.firstChild);
    }
    return host;
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value == null || value === false) return;
        if (key === "className") {
          node.className = value;
        } else if (key === "textContent") {
          node.textContent = value;
        } else if (key === "htmlFor") {
          node.htmlFor = value;
        } else {
          node.setAttribute(key, value === true ? "" : String(value));
        }
      });
    }
    (children || []).forEach(function (child) {
      if (child == null) return;
      node.appendChild(
        typeof child === "string" ? document.createTextNode(child) : child
      );
    });
    return node;
  }

  function renderSignInForm(host, state) {
    host.textContent = "";
    var title = el("h2", {
      className: "unit3-auth-widget__heading",
      textContent: "Sign in to record your work"
    });
    host.appendChild(title);
    var note = el("p", {
      className: "unit3-auth-widget__note",
      textContent:
      "Sign in with your college email address to save your progress and submit your work."
    });
    host.appendChild(note);

    var tabs = el("div", { className: "unit3-auth-widget__tabs", role: "tablist", "aria-label": "Account forms" }, [
      el("button", { type: "button", className: "unit3-auth-widget__tab is-active", role: "tab", "aria-selected": "true", id: "unit3-auth-signin-tab", textContent: "Sign in" }),
      el("button", { type: "button", className: "unit3-auth-widget__tab", role: "tab", "aria-selected": "false", id: "unit3-auth-register-tab", textContent: "Register" })
    ]);
    host.appendChild(tabs);

    var form = el("form", {
      className: "unit3-auth-widget__form",
      novalidate: true,
      "aria-labelledby": "unit3-auth-widget-heading"
    });
    title.id = "unit3-auth-widget-heading";

    var emailField = el("div", { className: "field" }, [
      el("label", {
        htmlFor: "unit3-auth-email",
        textContent: "Email"
      }),
      el("input", {
        type: "email",
        id: "unit3-auth-email",
        name: "email",
        autocomplete: "email",
        required: true,
        "aria-required": "true"
      })
    ]);
    var passwordField = el("div", { className: "field" }, [
      el("label", {
        htmlFor: "unit3-auth-password",
        textContent: "Password"
      }),
      el("input", {
        type: "password",
        id: "unit3-auth-password",
        name: "password",
        autocomplete: "current-password",
        required: true,
        "aria-required": "true"
      })
    ]);
    var actions = el("div", { className: "unit3-auth-widget__actions" }, [
      el("button", {
        type: "submit",
        className: "btn btn-primary",
        textContent: state.status === "loading" ? "Signing in…" : "Sign in"
      })
    ]);
    var errors = el("p", {
      className: "unit3-auth-widget__error",
      role: "alert",
      "aria-live": "assertive"
    });
    if (state.status === "error" && state.error) {
      errors.textContent =
        state.error.learnerMessage ||
        "Sign-in failed. Check your credentials and try again.";
    }
    form.appendChild(emailField);
    form.appendChild(passwordField);
    form.appendChild(errors);
    form.appendChild(actions);
    form.setAttribute("aria-labelledby", "unit3-auth-signin-tab");
    host.appendChild(form);

    var registerPanel = el("div", {
      className: "unit3-auth-widget__register",
      role: "tabpanel",
      "aria-labelledby": "unit3-auth-register-tab"
    }, [
      el("h3", {
        className: "unit3-auth-widget__heading",
        textContent: "Create learner account"
      }),
      el("p", {
        className: "unit3-auth-widget__note",
        textContent:
          "Enter your learner and account details in the secure registration form."
      }),
      el("a", {
        className: "btn btn-primary",
        href: resolveAccountHref(),
        textContent: "Open registration form"
      })
    ]);
    registerPanel.hidden = true;
    host.appendChild(registerPanel);

    function setTab(register) {
      form.hidden = register;
      registerPanel.hidden = !register;
      tabs.querySelector("#unit3-auth-signin-tab").classList.toggle("is-active", !register);
      tabs.querySelector("#unit3-auth-register-tab").classList.toggle("is-active", register);
      tabs.querySelector("#unit3-auth-signin-tab").setAttribute("aria-selected", String(!register));
      tabs.querySelector("#unit3-auth-register-tab").setAttribute("aria-selected", String(register));
      tabs.querySelector("#unit3-auth-signin-tab").tabIndex = register ? -1 : 0;
      tabs.querySelector("#unit3-auth-register-tab").tabIndex = register ? 0 : -1;
    }
    tabs.querySelector("#unit3-auth-signin-tab").addEventListener("click", function () { setTab(false); });
    tabs.querySelector("#unit3-auth-register-tab").addEventListener("click", function () { setTab(true); });
    Array.from(tabs.querySelectorAll('[role="tab"]')).forEach(function (tab, index, allTabs) {
      tab.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        var next = event.key === "ArrowRight"
          ? (index + 1) % allTabs.length
          : (index + allTabs.length - 1) % allTabs.length;
        allTabs[next].click();
        allTabs[next].focus();
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      errors.textContent = "";
      var emailInput = form.querySelector("#unit3-auth-email");
      var passwordInput = form.querySelector("#unit3-auth-password");
      var submitBtn = form.querySelector('button[type="submit"]');
      var email = emailInput ? emailInput.value.trim() : "";
      var password = passwordInput ? passwordInput.value : "";
      if (!email || !password) {
        errors.textContent = "Enter your email and password to sign in.";
        return;
      }
      var auth = window.SupabaseAuth;
      if (!auth) {
        errors.textContent =
          "The learner service is not available on this device.";
        return;
      }
      if (emailInput) emailInput.disabled = true;
      if (passwordInput) passwordInput.disabled = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Signing in…";
      }
      auth.signInWithPassword(email, password).catch(function (error) {
        if (emailInput) emailInput.disabled = false;
        if (passwordInput) passwordInput.disabled = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Sign in";
        }
        errors.textContent =
          (error && (error.learnerMessage || error.message)) ||
          "Sign-in failed. Check your credentials and try again.";
      });
    });

  }

  function renderSignedIn(host, state) {
    host.textContent = "";
    var context = null;
    var auth = window.SupabaseAuth;
    if (auth && typeof auth.getLearnerContext === "function") {
      context = auth.getLearnerContext();
    }
    var unlinked = state.status === "signed-in-unlinked";
    var displayName =
      (context && (context.displayName || context.firstName)) ||
      (unlinked ? "Signed in (profile not linked)" : "Signed-in learner");
    var groupCode = (context && context.groupCode) || "";
    var block = el("div", { className: "unit3-auth-widget__signed-in" }, [
      el("h2", {
        className: "unit3-auth-widget__heading",
        textContent: "Signed in as " + displayName
      }),
      groupCode
        ? el("p", {
            className: "unit3-auth-widget__note",
            textContent: "Group: " + groupCode
          })
        : null,
      unlinked
        ? el("p", {
            className: "unit3-auth-widget__error",
            role: "status",
            textContent:
              "Finish setting up your learner details before submitting work."
          })
        : null,
      unlinked
        ? el("p", { className: "unit3-auth-widget__note" }, [
            el("a", {
              href: resolveAccountHref(),
              textContent: "Complete learner registration"
            })
          ])
        : null,
      el("p", { className: "unit3-auth-widget__note" }, [
        el("a", {
          href: resolveAccountHref(),
          textContent: "Manage account"
        })
      ]),
      el("button", {
        type: "button",
        className: "btn btn-secondary",
        id: "unit3-auth-signout",
        textContent: "Sign out"
      })
    ]);
    host.appendChild(block);
    var button = block.querySelector("#unit3-auth-signout");
    if (button) {
      button.addEventListener("click", function () {
        if (window.SupabaseAuth) window.SupabaseAuth.signOut();
      });
    }
  }

  function resolveAccountHref() {
    try {
      var path = window.location && window.location.pathname
        ? window.location.pathname
        : "";
      var depth = (path.match(/\//g) || []).length;
      // week-N/activity/ pages sit two levels below root
      if (/\/week-\d+\//i.test(path)) return "../../account/";
      if (/\/(help|resources|account|tests)\//i.test(path)) return "../account/";
      return "account/";
    } catch (error) {
      return "account/";
    }
  }

  function renderLoading(host) {
    host.textContent = "";
    host.appendChild(
      el("p", {
        className: "unit3-auth-widget__note",
        role: "status",
        "aria-live": "polite",
        textContent: "Checking your learner session…"
      })
    );
  }

  function render(state) {
    if (mode() !== "SUPABASE") {
      var existing = document.getElementById(HOST_ID);
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }
      return;
    }
    var host = ensureHost();
    lastState = state;
    if (state.status === "authenticated" || state.status === "signed-in-unlinked") {
      renderSignedIn(host, state);
      return;
    }
    if (state.status === "loading") {
      renderLoading(host);
      return;
    }
    renderSignInForm(host, state);
  }

  function mount() {
    if (mounted) return;
    mounted = true;
    var auth = window.SupabaseAuth;
    if (!auth || typeof auth.subscribe !== "function") return;
    auth.subscribe(render);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  window.Unit3SupabaseAuthWidget = Object.freeze({
    mount: mount,
    render: function () {
      return render(lastState || { status: "idle" });
    },
    HOST_ID: HOST_ID
  });
})();
