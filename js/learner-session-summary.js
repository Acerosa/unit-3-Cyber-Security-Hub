/** Persistent learner identity summary for the shared site header. */
(function () {
  "use strict";

  if (window.Unit3LearnerSessionSummary) return;

  var currentScript = document.currentScript;
  var scriptUrl = currentScript && currentScript.src ? currentScript.src : "";
  var jsRoot = scriptUrl.replace(/learner-session-summary\.js(?:\?.*)?$/i, "");
  var host = null;
  var lastSignature = "";

  function accountHref() {
    var path = window.location && window.location.pathname
      ? window.location.pathname
      : "";
    if (/\/account\/?(?:index\.html)?$/i.test(path)) return "./";
    if (/\/week-\d+\/[^/]+\//i.test(path)) return "../../account/";
    if (/\/(?:week-\d+|help|resources|tests)\//i.test(path)) return "../account/";
    return "account/";
  }

  function ensureHost() {
    if (host && host.isConnected) return host;
    var header = document.querySelector(".site-header .header-bar");
    if (!header) return null;
    host = document.getElementById("unit3-learner-session-summary");
    if (!host) {
      host = document.createElement("aside");
      host.id = "unit3-learner-session-summary";
      host.className = "unit3-session-summary";
      host.setAttribute("aria-label", "Signed-in learner");
      host.setAttribute("aria-live", "polite");
      host.hidden = true;
      header.appendChild(host);
    }
    return host;
  }

  function clear() {
    var target = ensureHost();
    lastSignature = "";
    if (!target) return;
    target.textContent = "";
    target.hidden = true;
  }

  function render(state) {
    var target = ensureHost();
    if (!target || !state) return;
    if (state.status === "loading" && lastSignature) return;
    if (state.status !== "authenticated") {
      clear();
      return;
    }
    var context = window.SupabaseAuth.getLearnerContext();
    if (!context) {
      clear();
      return;
    }
    var name = context.fullName || context.displayName || context.firstName;
    var yearGroup = context.yearGroup || context.academicYear || "";
    var email = context.contactEmail || "";
    var signature = [name, yearGroup, email].join("\u001f");
    if (signature === lastSignature) return;
    lastSignature = signature;
    target.textContent = "";
    var details = document.createElement("a");
    details.className = "unit3-session-summary__details";
    details.href = accountHref();
    var strong = document.createElement("strong");
    strong.textContent = name;
    details.appendChild(strong);
    if (yearGroup) {
      var year = document.createElement("span");
      year.textContent = yearGroup;
      details.appendChild(year);
    }
    if (email) {
      var address = document.createElement("span");
      address.textContent = email;
      details.appendChild(address);
    }
    var signOut = document.createElement("button");
    signOut.type = "button";
    signOut.className = "unit3-session-summary__signout";
    signOut.textContent = "Sign out";
    signOut.addEventListener("click", function () {
      signOut.disabled = true;
      window.SupabaseAuth.signOut().catch(function () {
        signOut.disabled = false;
      });
    });
    target.appendChild(details);
    target.appendChild(signOut);
    target.hidden = false;
  }

  function ensureStyle() {
    var href = jsRoot + "../css/supabase-auth.css";
    if (Array.from(document.styleSheets).some(function (sheet) {
      return sheet.href === href;
    })) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function ensureDependencies() {
    if (!window.SupabaseAuth || !window.LearningPlatform) {
      return Promise.reject(new Error("Shared learning platform is unavailable."));
    }
    return window.LearningPlatform.ready;
  }

  function mount() {
    ensureHost();
    ensureStyle();
    return ensureDependencies().then(function () {
      window.SupabaseAuth.subscribe(render);
    }).catch(function () {
      clear();
    });
  }

  window.Unit3LearnerSessionSummary = Object.freeze({
    mount: mount,
    render: render,
    clear: clear
  });

  mount();
})();
