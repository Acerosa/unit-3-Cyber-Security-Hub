export const APP_CONFIG = Object.freeze({
  hubId: "unit-3-cyber-security",
  hubVersion: "0.2.0",
  siteName: "Unit 3 Cyber Security Hub",
  shortName: "Cyber Security Hub",
  qualification: "OCR Level 3 IT",
  coreVersion: "0.2.0",
  learnerApiContractVersion: "0.1.0",
  submissionContractVersion: "0.1.0",
  navigation: Object.freeze([
    Object.freeze({ id: "home", label: "Home", path: "" }),
    Object.freeze({ id: "week-1", label: "Week 1", path: "week-1/" }),
    Object.freeze({ id: "week-2", label: "Week 2", path: "week-2/" }),
    Object.freeze({ id: "week-3", label: "Week 3", path: "week-3/" }),
    Object.freeze({ id: "week-4", label: "Week 4", path: "week-4/" }),
    Object.freeze({ id: "week-5", label: "Week 5", path: "week-5/" }),
    Object.freeze({ id: "week-6", label: "Week 6", path: "week-6/" }),
    Object.freeze({ id: "week-7", label: "Week 7", path: "week-7/" }),
    Object.freeze({ id: "resources", label: "Resources", path: "resources/" }),
    Object.freeze({ id: "help", label: "Help", path: "help/" }),
    Object.freeze({ id: "account", label: "Account", path: "account/" })
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

export type AppConfig = typeof APP_CONFIG;
export type NavigationItem = (typeof APP_CONFIG.navigation)[number];
