/**
 * Auto-maintained Week 3 activity data.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }
  global.Week3AttackerCaseMatching = {
  "activityId": "week3-attacker-case-matching",
  "activityName": "Attacker Case Study Matching",
  "activityVersion": "1.0",
  "weekNumber": 3,
  "sessionNumber": 1,
  "total": 8,
  "estimatedMinutes": 25,
  "attackerOptions": [
    {
      "id": "hacktivist",
      "name": "Hacktivist"
    },
    {
      "id": "cyber-criminal",
      "name": "Cyber-criminal"
    },
    {
      "id": "insider",
      "name": "Insider"
    },
    {
      "id": "script-kiddie",
      "name": "Script kiddie"
    },
    {
      "id": "vulnerability-broker",
      "name": "Vulnerability broker"
    },
    {
      "id": "scammer",
      "name": "Scammer"
    },
    {
      "id": "phisher",
      "name": "Phisher"
    },
    {
      "id": "cyber-terrorist",
      "name": "Cyber-terrorist"
    }
  ],
  "cases": [
    {
      "id": "C1",
      "title": "Records export",
      "scenario": "A disgruntled records employee exports confidential patient data using their authorised access after a dispute about rotas.",
      "bestAnswer": "insider",
      "plausibleAlternative": "cyber-criminal",
      "evidencePoints": [
        "Authorised staff account",
        "Export of confidential patient data",
        "Workplace grievance context"
      ],
      "whyBest": "Legitimate access used to take data strongly indicates an insider.",
      "whyAlternativeWeaker": "A cyber-criminal label needs clearer external profit tradecraft; here the access path is internal and authorised.",
      "stereotypeWarning": "Do not use personal characteristics; use access and behaviour evidence."
    },
    {
      "id": "C2",
      "title": "Public tool defacement",
      "scenario": "An inexperienced attacker downloads a public tool and defaces a clinic information page to impress friends, with no ransom demand.",
      "bestAnswer": "script-kiddie",
      "plausibleAlternative": "hacktivist",
      "evidencePoints": [
        "Ready-made public tool",
        "Low sophistication defacement",
        "Status-seeking among friends"
      ],
      "whyBest": "Reliance on a public tool for a prank/status defacement fits a script kiddie.",
      "whyAlternativeWeaker": "Hacktivism needs clearer cause-driven protest messaging; impressing friends is not political activism.",
      "stereotypeWarning": "Do not assume age; use tool and purpose evidence."
    },
    {
      "id": "C3",
      "title": "Ransomware demand",
      "scenario": "An organised group encrypts a health organisation’s systems and demands cryptocurrency for restoration.",
      "bestAnswer": "cyber-criminal",
      "plausibleAlternative": null,
      "evidencePoints": [
        "Encryption of systems",
        "Cryptocurrency ransom",
        "Organised profit motive"
      ],
      "whyBest": "Ransom for money is core cyber-criminal evidence.",
      "whyAlternativeWeaker": "",
      "stereotypeWarning": "Organisation size alone is not proof; the ransom evidence is."
    },
    {
      "id": "C4",
      "title": "Cause statement",
      "scenario": "A politically motivated group disrupts an organisation’s public website and publishes a statement supporting a social cause, without threatening emergency care.",
      "bestAnswer": "hacktivist",
      "plausibleAlternative": "cyber-terrorist",
      "evidencePoints": [
        "Political/social cause statement",
        "Publicity-focused disruption",
        "No threat to essential clinical services"
      ],
      "whyBest": "Cause-driven publicity/protest fits hacktivist.",
      "whyAlternativeWeaker": "Cyber-terrorism needs fear/coercion against essential services or public safety; that evidence is missing.",
      "stereotypeWarning": "Political language alone does not equal terrorism."
    },
    {
      "id": "C5",
      "title": "Flaw offered",
      "scenario": "A researcher discovers a software flaw in a supplier portal and offers the vulnerability through a disclosure programme / vulnerability market for payment.",
      "bestAnswer": "vulnerability-broker",
      "plausibleAlternative": "cyber-criminal",
      "evidencePoints": [
        "Discovery of a flaw",
        "Offer via disclosure or vulnerability market",
        "Focus on the vulnerability as the item of value"
      ],
      "whyBest": "Trading/disclosing the vulnerability itself indicates a vulnerability broker.",
      "whyAlternativeWeaker": "Cyber-criminal usually implies direct exploitation for crime such as ransom; here the focus is the flaw transaction. Lawful bounty and unlawful markets both still map primarily to broker unless wider crime is shown.",
      "stereotypeWarning": "Do not label every broker a criminal automatically."
    },
    {
      "id": "C6",
      "title": "False invoice",
      "scenario": "Someone sends a false invoice to an organisation’s finance team to obtain a payment to attacker-controlled bank details.",
      "bestAnswer": "scammer",
      "plausibleAlternative": "phisher",
      "evidencePoints": [
        "False invoice",
        "Payment fraud goal",
        "Finance process targeted"
      ],
      "whyBest": "Direct payment deception is scammer evidence.",
      "whyAlternativeWeaker": "No credential-harvesting page is described; the immediate goal is money via fraud.",
      "stereotypeWarning": "Channel (email) alone does not decide phisher vs scammer."
    },
    {
      "id": "C7",
      "title": "Cloned sign-in",
      "scenario": "A cloned Microsoft 365 sign-in page is emailed to employees to collect their credentials.",
      "bestAnswer": "phisher",
      "plausibleAlternative": "scammer",
      "evidencePoints": [
        "Cloned login page",
        "Credential collection",
        "Employee-targeted lure"
      ],
      "whyBest": "Harvesting credentials via a fake login is phishing.",
      "whyAlternativeWeaker": "A scammer may seek payment, but credential harvesting is the clearer goal here.",
      "stereotypeWarning": "Brand logos in the lure are evidence of deception, not of the brand attacking you."
    },
    {
      "id": "C8",
      "title": "Essential services threat",
      "scenario": "A group threatens essential booking and emergency-related services to create fear and force political change.",
      "bestAnswer": "cyber-terrorist",
      "plausibleAlternative": "hacktivist",
      "evidencePoints": [
        "Threats to essential services",
        "Intent to create fear",
        "Political coercion"
      ],
      "whyBest": "Fear and coercion against essential services support cyber-terrorist.",
      "whyAlternativeWeaker": "Hacktivism centres on protest/publicity; the coercion/fear aim is stronger here.",
      "stereotypeWarning": "Do not decide from nationality stereotypes; use the threat evidence."
    }
  ]
};
})(window);
