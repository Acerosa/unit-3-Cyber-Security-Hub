(function () {
  "use strict";

  window.APP_CONFIG = Object.freeze({
    hubId: "unit-3-cyber-security",
    hubVersion: "0.2.0",
    siteName: "Unit 3 Cyber Security Hub",
    shortName: "Cyber Security Hub",
    coreVersion: "0.2.0",
    learnerApiContractVersion: "0.1.0",
    submissionContractVersion: "0.1.0",
    navigation: Object.freeze([
      { id: "home", label: "Home", path: "" },
      { id: "week-1", label: "Week 1", path: "week-1/" },
      { id: "week-2", label: "Week 2", path: "week-2/" },
      { id: "week-3", label: "Week 3", path: "week-3/" },
      { id: "week-4", label: "Week 4", path: "week-4/" },
      { id: "week-5", label: "Week 5", path: "week-5/" },
      { id: "week-6", label: "Week 6", path: "week-6/" },
      { id: "week-7", label: "Week 7", path: "week-7/" },
      { id: "resources", label: "Resources", path: "resources/" },
      { id: "help", label: "Help", path: "help/" },
      { id: "account", label: "Account", path: "account/" }
    ]),
    features: Object.freeze({
      authentication: true,
      onboarding: true,
      progress: true
    }),
    theme: Object.freeze({
      primary: "#0b1f33",
      accent: "#0d7a8c"
    })
  });
})();
