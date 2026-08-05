/**
 * OCR Unit 3 Week 3 — eight attacker types and Northbank insider roles.
 */
(function (global) {
  'use strict';

  var ATTACKERS = Object.freeze([
    Object.freeze({
      id: 'hacktivist',
      name: 'Hacktivist',
      definition:
        'An attacker who uses cyber methods to promote a political, social or ethical cause.',
      motivation: 'Publicity for a cause, protest or ideological pressure',
      skillLevel: 'Variable — from limited scripting to organised campaigns',
      likelyTargets: 'High-visibility organisations, websites and data that support a message',
      commonMethods: Object.freeze([
        'Website defacement',
        'Data leaks used for publicity',
        'Denial-of-service disruption',
        'Social media amplification'
      ]),
      evidence: Object.freeze([
        'A public statement linking the attack to a cause',
        'Messages left on defaced pages',
        'Timing linked to a protest or campaign'
      ]),
      confusedWith: 'cyber-terrorist',
      misconception:
        'Not every politically motivated attack is terrorism. Look for whether the aim is protest/publicity or creating fear to force political change through threats to essential services.',
      northbankExample:
        'A group defaces Northbank’s public website overnight and leaves a message about NHS funding, without encrypting clinical systems.'
    }),
    Object.freeze({
      id: 'cyber-criminal',
      name: 'Cyber-criminal',
      definition:
        'An attacker who uses cyber methods primarily for financial gain or other criminal profit.',
      motivation: 'Money, fraud, ransom or sale of stolen data',
      skillLevel: 'Often organised and purposeful; may use purchased tools',
      likelyTargets: 'Organisations holding valuable data, payment routes or critical systems',
      commonMethods: Object.freeze([
        'Ransomware',
        'Business email compromise',
        'Data theft for sale',
        'Banking or payment fraud'
      ]),
      evidence: Object.freeze([
        'Ransom demand or cryptocurrency payment request',
        'Focus on monetisable data or systems',
        'Organised, repeated targeting patterns'
      ]),
      confusedWith: 'script-kiddie',
      misconception:
        'A cyber-criminal is not defined by age. Evidence of organised profit-seeking matters more than stereotypes about who “looks like” a hacker.',
      northbankExample:
        'Systems are encrypted and a ransom note demands cryptocurrency to restore patient appointment access.'
    }),
    Object.freeze({
      id: 'insider',
      name: 'Insider',
      definition:
        'A person with legitimate access to systems or data who causes harm through malicious or negligent behaviour.',
      motivation:
        'May be malicious (revenge, profit) or negligent (carelessness, poor practice)',
      skillLevel: 'Does not need advanced hacking skill if access is already authorised',
      likelyTargets: 'Data and systems the person can already reach in their role',
      commonMethods: Object.freeze([
        'Exporting or copying data using authorised accounts',
        'Misusing privileged settings',
        'Ignoring policy (for example sharing passwords)',
        'Accidental disclosure'
      ]),
      evidence: Object.freeze([
        'Activity performed with a valid staff or contractor account',
        'Access that matches job permissions',
        'Difficulty distinguishing normal work from misuse without monitoring'
      ]),
      confusedWith: 'cyber-criminal',
      misconception:
        'Having legitimate access does not make someone suspicious. The risk is that authorised access can be misused or handled negligently, which can be hard to detect.',
      northbankExample:
        'A records officer with legitimate patient-record access exports a large spreadsheet of demographics outside approved procedures.'
    }),
    Object.freeze({
      id: 'script-kiddie',
      name: 'Script kiddie',
      definition:
        'An inexperienced attacker who uses ready-made tools or scripts written by others, often for status or curiosity.',
      motivation: 'Curiosity, bragging rights, experimentation or low-level disruption',
      skillLevel: 'Low — relies on public tools rather than developing sophisticated methods',
      likelyTargets: 'Poorly secured public-facing systems and easy targets',
      commonMethods: Object.freeze([
        'Downloaded exploit kits or scripts',
        'Simple website defacement',
        'Basic scanning with public tools'
      ]),
      evidence: Object.freeze([
        'Use of widely available tools with little customisation',
        'Limited follow-through beyond a visible prank or defacement',
        'No clear organised profit model'
      ]),
      confusedWith: 'cyber-criminal',
      misconception:
        'Do not identify a script kiddie by assumed age alone. Use evidence about skill, tools and purpose.',
      northbankExample:
        'Someone uses a free online tool to deface a clinic information page “for fun” and posts a screenshot to friends.'
    }),
    Object.freeze({
      id: 'vulnerability-broker',
      name: 'Vulnerability broker',
      definition:
        'A person or organisation that finds and trades or discloses software vulnerabilities, sometimes lawfully and sometimes unlawfully.',
      motivation:
        'Payment, reputation, research credit or influence over how a flaw is handled',
      skillLevel: 'Often technical enough to discover or verify vulnerabilities',
      likelyTargets: 'Software vendors, platforms and organisations that value disclosure',
      commonMethods: Object.freeze([
        'Responsible disclosure to a vendor',
        'Bug bounty programmes',
        'Sale on unlawful vulnerability markets'
      ]),
      evidence: Object.freeze([
        'Offer to disclose or sell details of a flaw',
        'Engagement with a bounty or disclosure process',
        'Focus on the vulnerability itself rather than immediate system takeover for ransom'
      ]),
      confusedWith: 'cyber-criminal',
      misconception:
        'A vulnerability broker is not automatically a criminal. Lawful disclosure and bug bounties exist; unlawful markets also exist. Use the scenario evidence.',
      northbankExample:
        'A researcher reports a booking-portal flaw to Northbank’s supplier through a disclosure channel and requests bounty payment.'
    }),
    Object.freeze({
      id: 'scammer',
      name: 'Scammer',
      definition:
        'An attacker who deceives people or organisations to obtain money, goods or other benefits through fraud.',
      motivation: 'Direct financial or material gain through deception',
      skillLevel: 'Social engineering skill may matter more than technical exploit skill',
      likelyTargets: 'Finance teams, individuals and processes that approve payments',
      commonMethods: Object.freeze([
        'False invoices',
        'Advance-fee fraud',
        'Impersonation to request payments',
        'Fake supplier details'
      ]),
      evidence: Object.freeze([
        'A deceptive request for payment or goods',
        'Changed bank details or fake invoices',
        'Primary aim is fraud rather than credential harvesting for later access'
      ]),
      confusedWith: 'phisher',
      misconception:
        'Scamming and phishing overlap, but a scammer’s immediate aim is often fraud or payment, while a phisher focuses on stealing credentials or sensitive data through deceptive messages.',
      northbankExample:
        'Finance receives a convincing fake invoice claiming to be from a medical supplies contractor.'
    }),
    Object.freeze({
      id: 'phisher',
      name: 'Phisher',
      definition:
        'An attacker who uses deceptive messages or websites to trick people into revealing credentials or sensitive information.',
      motivation: 'Steal login details or data that enable further compromise',
      skillLevel: 'Variable; success often depends on convincing social engineering',
      likelyTargets: 'Staff email accounts, Microsoft 365 sign-ins and patient-facing portals',
      commonMethods: Object.freeze([
        'Cloned login pages',
        'Urgent email or SMS lures',
        'Credential harvesting links',
        'Attachment bait leading to further compromise'
      ]),
      evidence: Object.freeze([
        'A fake sign-in page collecting usernames and passwords',
        'Messages designed to harvest credentials',
        'Links that mimic trusted brands or internal systems'
      ]),
      confusedWith: 'scammer',
      misconception:
        'Not every deceptive message is “just a scam invoice”. If the lure collects credentials, phisher is usually the stronger OCR label.',
      northbankExample:
        'Staff receive an email with a cloned Microsoft 365 sign-in page asking them to “re-authenticate”.'
    }),
    Object.freeze({
      id: 'cyber-terrorist',
      name: 'Cyber-terrorist',
      definition:
        'An attacker who uses cyber methods to create fear or coerce political change, often by threatening essential services or public safety.',
      motivation: 'Political coercion through fear, intimidation or severe disruption',
      skillLevel: 'May be organised and capable of targeting critical services',
      likelyTargets: 'Essential services, critical infrastructure and high-impact systems',
      commonMethods: Object.freeze([
        'Threats against essential services',
        'Disruptive attacks intended to intimidate',
        'Propaganda linked to political demands'
      ]),
      evidence: Object.freeze([
        'Threats aimed at creating fear in the population or government',
        'Targeting of essential services to force political change',
        'Explicit political coercion beyond protest publicity'
      ]),
      confusedWith: 'hacktivist',
      misconception:
        'Protest messaging alone does not prove cyber-terrorism. Look for fear, coercion and threats to essential services or public safety.',
      northbankExample:
        'A group threatens to disable regional emergency booking systems unless a political demand is met, intending to frighten the public.'
    })
  ]);

  var COMPARISONS = Object.freeze([
    Object.freeze({
      id: 'script-vs-criminal',
      left: 'script-kiddie',
      right: 'cyber-criminal',
      whyItMatters:
        'OCR answers should separate low-skill curiosity or status-seeking from organised profit-seeking. The same tool can appear in both, so use motivation and evidence.'
    }),
    Object.freeze({
      id: 'scammer-vs-phisher',
      left: 'scammer',
      right: 'phisher',
      whyItMatters:
        'Both use deception. Identify whether the immediate goal is fraudulent payment/goods or stealing credentials/data.'
    }),
    Object.freeze({
      id: 'insider-vs-external',
      left: 'insider',
      right: 'external-attacker',
      whyItMatters:
        'Insiders already have legitimate access, so misuse can look like normal work. External attackers usually need to gain access first.'
    }),
    Object.freeze({
      id: 'broker-vs-criminal',
      left: 'vulnerability-broker',
      right: 'cyber-criminal',
      whyItMatters:
        'Brokers focus on the vulnerability as an asset to disclose or trade. Cyber-criminals typically exploit systems for direct criminal profit such as ransom.'
    }),
    Object.freeze({
      id: 'hacktivist-vs-terrorist',
      left: 'hacktivist',
      right: 'cyber-terrorist',
      whyItMatters:
        'Hacktivism centres on protest and publicity for a cause. Cyber-terrorism centres on fear and coercion, often against essential services.'
    })
  ]);

  var NORTHBANK_ROLES = Object.freeze([
    Object.freeze({
      id: 'reception',
      role: 'Reception employee',
      legitimateAccess: 'Appointment diaries, basic patient contact details, waiting-room systems',
      reachableSystems: 'Reception PCs, booking screens, shared printers',
      misuseRisk: 'Looking up or sharing patient contact details without a work need',
      negligentRisk: 'Leaving a logged-in screen unlocked in a public area',
      detectionDifficulty:
        'Routine appointment checks can look similar to inappropriate lookups without audit review',
      leastPrivilegeControl: 'Role-based access limited to reception booking functions'
    }),
    Object.freeze({
      id: 'records',
      role: 'Records officer',
      legitimateAccess: 'Patient records needed for filing, retrieval and information requests',
      reachableSystems: 'Electronic patient record tools and records storage',
      misuseRisk: 'Exporting large sets of confidential records without authorisation',
      negligentRisk: 'Sending records to the wrong recipient',
      detectionDifficulty:
        'Authorised record access is expected, so unusual volume or destination needs monitoring',
      leastPrivilegeControl: 'Export permissions limited and logged; dual control for bulk extracts'
    }),
    Object.freeze({
      id: 'practice-manager',
      role: 'Practice manager',
      legitimateAccess: 'Staff rotas, some operational reports, policy and supplier contacts',
      reachableSystems: 'Management dashboards and shared drives',
      misuseRisk: 'Using management access to view staff or patient data beyond need',
      negligentRisk: 'Approving access requests without checking least privilege',
      detectionDifficulty: 'Broad managerial access can hide inappropriate viewing',
      leastPrivilegeControl: 'Separate operational admin rights from clinical record browsing'
    }),
    Object.freeze({
      id: 'visiting-professional',
      role: 'Visiting healthcare professional',
      legitimateAccess: 'Temporary access to records for patients under their care',
      reachableSystems: 'Clinic workstations and remote clinical access where approved',
      misuseRisk: 'Accessing patients not under their care',
      negligentRisk: 'Using a shared login or failing to sign out on ward devices',
      detectionDifficulty: 'Short visits create many brief sessions that need clear identity trails',
      leastPrivilegeControl: 'Time-limited accounts tied to named individuals and assigned patients'
    }),
    Object.freeze({
      id: 'finance',
      role: 'Finance officer',
      legitimateAccess: 'Invoices, supplier details and payment approval workflows',
      reachableSystems: 'Finance systems and email used for payment queries',
      misuseRisk: 'Changing supplier bank details for personal gain',
      negligentRisk: 'Paying a fraudulent invoice without verification',
      detectionDifficulty: 'Payment work is normal; verification gaps enable fraud',
      leastPrivilegeControl: 'Separation of duties for creating and approving payments'
    }),
    Object.freeze({
      id: 'it-contractor',
      role: 'Outsourced IT contractor',
      legitimateAccess: 'Admin rights needed to maintain systems under contract',
      reachableSystems: 'Servers, endpoints and identity systems in scope of the contract',
      misuseRisk: 'Using privileged access to steal data or create hidden accounts',
      negligentRisk: 'Leaving default credentials or overly broad permissions in place',
      detectionDifficulty: 'Privileged maintenance can resemble malicious admin activity',
      leastPrivilegeControl: 'Just-in-time privileged access with logging and contract scope limits'
    })
  ]);

  global.Unit3Week3AttackerTypes = Object.freeze({
    industryVocabularyNote:
      'White hat, grey hat and black hat are industry terms. They must not replace the eight OCR attacker types in examination answers unless a question asks about industry vocabulary.',
    attackers: ATTACKERS,
    comparisons: COMPARISONS,
    northbankRoles: NORTHBANK_ROLES,
    getById: function (id) {
      for (var i = 0; i < ATTACKERS.length; i++) {
        if (ATTACKERS[i].id === id) return ATTACKERS[i];
      }
      return null;
    }
  });
})(window);
