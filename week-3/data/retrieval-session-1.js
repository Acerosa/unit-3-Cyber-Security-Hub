/**
 * Auto-maintained Week 3 activity data.
 */
(function (global) {
  'use strict';
  if (typeof globalThis !== "undefined" && globalThis.__lpPublishedCurriculum) {
    return;
  }
  global.Week3Session1Retrieval = {
  "activityId": "week3-session1-retrieval",
  "activityName": "Session 1 Retrieval Quiz",
  "activityVersion": "1.0",
  "weekNumber": 3,
  "sessionNumber": 1,
  "total": 10,
  "estimatedMinutes": 15,
  "questions": [
    {
      "id": "S1Q1",
      "prompt": "Which statement best describes the relationship between a threat and a vulnerability?",
      "options": [
        {
          "id": "A",
          "text": "A threat is a weakness; a vulnerability exploits it"
        },
        {
          "id": "B",
          "text": "A threat exploits a vulnerability to cause a cyber security incident"
        },
        {
          "id": "C",
          "text": "A vulnerability is always a person; a threat is always malware"
        },
        {
          "id": "D",
          "text": "Threats and vulnerabilities are the same thing"
        }
      ],
      "correctOptionId": "B",
      "explanation": "A threat exploits a vulnerability to cause an incident.",
      "feedbackIncorrect": "Keep threat (source of harm) separate from vulnerability (weakness).",
      "glossaryReminder": "Threat · Vulnerability · Incident"
    },
    {
      "id": "S1Q2",
      "prompt": "An unpatched remote-access service on a Northbank clinic PC is best described as:",
      "options": [
        {
          "id": "A",
          "text": "A threat actor"
        },
        {
          "id": "B",
          "text": "A hardware vulnerability"
        },
        {
          "id": "C",
          "text": "A software vulnerability"
        },
        {
          "id": "D",
          "text": "A cyber-terrorist"
        }
      ],
      "correctOptionId": "C",
      "explanation": "Missing patches are a software vulnerability.",
      "feedbackIncorrect": "The weakness is in the software state, not the attacker.",
      "glossaryReminder": "Software vulnerability"
    },
    {
      "id": "S1Q3",
      "prompt": "A clinic laptop with no disk encryption is primarily an example of:",
      "options": [
        {
          "id": "A",
          "text": "A hardware vulnerability"
        },
        {
          "id": "B",
          "text": "A phishing campaign"
        },
        {
          "id": "C",
          "text": "An insider threat by definition"
        },
        {
          "id": "D",
          "text": "A vulnerability broker"
        }
      ],
      "correctOptionId": "A",
      "explanation": "Lack of encryption on a device is commonly treated as a hardware/device protection weakness in OCR-style classification when the physical device can expose data.",
      "feedbackIncorrect": "Focus on the weakness of the device protection, not who might use it.",
      "glossaryReminder": "Hardware vulnerability · Confidentiality"
    },
    {
      "id": "S1Q4",
      "prompt": "Leaving a default administrator password unchanged is best classified as:",
      "options": [
        {
          "id": "A",
          "text": "A human vulnerability only"
        },
        {
          "id": "B",
          "text": "A configuration vulnerability"
        },
        {
          "id": "C",
          "text": "A cyber-criminal"
        },
        {
          "id": "D",
          "text": "A malware category"
        }
      ],
      "correctOptionId": "B",
      "explanation": "Weak or default settings are configuration vulnerabilities.",
      "feedbackIncorrect": "Configuration weaknesses are about how a system is set up.",
      "glossaryReminder": "Configuration vulnerability"
    },
    {
      "id": "S1Q5",
      "prompt": "A staff member who reuses a simple password for clinical systems demonstrates:",
      "options": [
        {
          "id": "A",
          "text": "A hardware vulnerability"
        },
        {
          "id": "B",
          "text": "A human vulnerability"
        },
        {
          "id": "C",
          "text": "A vulnerability broker"
        },
        {
          "id": "D",
          "text": "A denial-of-service attack"
        }
      ],
      "correctOptionId": "B",
      "explanation": "Unsafe user behaviour is a human vulnerability.",
      "feedbackIncorrect": "Human vulnerabilities concern people and practice.",
      "glossaryReminder": "Human vulnerability"
    },
    {
      "id": "S1Q6",
      "prompt": "Ransomware that encrypts files and demands payment is best described as:",
      "options": [
        {
          "id": "A",
          "text": "A social engineering method only"
        },
        {
          "id": "B",
          "text": "A malware category used as a threat"
        },
        {
          "id": "C",
          "text": "A configuration vulnerability"
        },
        {
          "id": "D",
          "text": "Authorised penetration testing"
        }
      ],
      "correctOptionId": "B",
      "explanation": "Ransomware is malware and can be the threat that exploits weaknesses.",
      "feedbackIncorrect": "Malware is malicious software; the vulnerability is what allows it in or to spread.",
      "glossaryReminder": "Malware · Ransomware"
    },
    {
      "id": "S1Q7",
      "prompt": "Which pairing correctly matches a threat to a vulnerability?",
      "options": [
        {
          "id": "A",
          "text": "Phishing email exploiting unpatched VPN software to steal credentials"
        },
        {
          "id": "B",
          "text": "Firewall rule exploiting a receptionist"
        },
        {
          "id": "C",
          "text": "Encryption exploiting a ransom note"
        },
        {
          "id": "D",
          "text": "A patch exploiting malware"
        }
      ],
      "correctOptionId": "A",
      "explanation": "The phishing/exploit path is the threat action against a weakness (unpatched VPN).",
      "feedbackIncorrect": "Name the weakness and what could exploit it.",
      "glossaryReminder": "Threat–vulnerability pairing"
    },
    {
      "id": "S1Q8",
      "prompt": "Who may choose to exploit a vulnerability at Northbank?",
      "options": [
        {
          "id": "A",
          "text": "Only teenagers"
        },
        {
          "id": "B",
          "text": "Only people outside the organisation"
        },
        {
          "id": "C",
          "text": "External attackers or people with legitimate access, depending on the scenario"
        },
        {
          "id": "D",
          "text": "Only vulnerability brokers"
        }
      ],
      "correctOptionId": "C",
      "explanation": "Attackers can be external or insiders; evidence decides.",
      "feedbackIncorrect": "Do not assume every attacker is external.",
      "glossaryReminder": "Insider · External attacker"
    },
    {
      "id": "S1Q9",
      "prompt": "True or false: Every politically motivated cyber attack must be labelled cyber-terrorism in OCR answers.",
      "options": [
        {
          "id": "A",
          "text": "True"
        },
        {
          "id": "B",
          "text": "False"
        }
      ],
      "correctOptionId": "B",
      "explanation": "Hacktivism and cyber-terrorism differ; use evidence about fear, coercion and essential services.",
      "feedbackIncorrect": "Protest publicity alone is not enough for cyber-terrorist.",
      "glossaryReminder": "Hacktivist · Cyber-terrorist"
    },
    {
      "id": "S1Q10",
      "prompt": "Which OCR attacker type best fits someone who uses a cloned Microsoft 365 page to steal staff passwords?",
      "options": [
        {
          "id": "A",
          "text": "Scammer"
        },
        {
          "id": "B",
          "text": "Phisher"
        },
        {
          "id": "C",
          "text": "Script kiddie"
        },
        {
          "id": "D",
          "text": "Vulnerability broker"
        }
      ],
      "correctOptionId": "B",
      "explanation": "Credential harvesting via deceptive login pages indicates a phisher.",
      "feedbackIncorrect": "If the lure collects credentials, phisher is usually stronger than scammer.",
      "glossaryReminder": "Phisher"
    }
  ]
};
})(window);
