/**
 * Add Week 5 vulnerability-identification / defensive-response catalogue activities
 * and rebuild the bundled content package from split JSON files.
 *
 * Run: node scripts/add-week5-defensive-activities.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content/unit-3-cyber-security");

function block(id, type, content) {
  return {
    schema: "lp.content.block",
    schemaVersion: "0.1.0",
    id,
    version: "0.1.0",
    metadata: {},
    relationships: {},
    type,
    content
  };
}

function heading(id, text) {
  return block(id, "heading", { text, level: 2 });
}

function paragraph(id, text) {
  return block(id, "paragraph", { text });
}

function callout(id, text) {
  return block(id, "callout", { text });
}

function mcq(activityId, qid, prompt, options, correct, feedback) {
  return block(`${activityId}-q-${qid}`, "single-choice", {
    formative: true,
    retry: true,
    questionId: `${activityId}:${qid}`,
    sourceQuestionId: qid,
    prompt,
    options: options.map(([id, label]) => ({ id, label })),
    correctOptionId: correct,
    feedback: { correct: feedback, incorrect: feedback },
    sourceType: "single"
  });
}

function shortResponse(activityId, qid, prompt, minChars, guidance) {
  return block(`${activityId}-${qid}`, "short-response", {
    formative: true,
    questionId: `${activityId}:${qid}`,
    sourceQuestionId: qid,
    prompt,
    minChars,
    guidance
  });
}

function activity({ id, title, summary, activityType, questions, blocks }) {
  return {
    schema: "lp.content.activity",
    schemaVersion: "0.1.0",
    id,
    version: "1.0.0",
    metadata: {
      title,
      status: "available",
      summary,
      href: null,
      activityType,
      runtimeGlobal: null
    },
    relationships: {
      learningOutcomes: ["LO1"],
      assignment: "formative-practice",
      questions,
      assets: []
    },
    blocks
  };
}

const NEW_ACTIVITIES = [
  activity({
    id: "week5-vulnerability-patterns",
    title: "Recognising vulnerability patterns",
    summary: "Identify common weakness patterns in fictional Northbank examples and explain why they matter.",
    activityType: "Guided learning",
    questions: [
      "week5-vulnerability-patterns-q-p1",
      "week5-vulnerability-patterns-q-p2",
      "week5-vulnerability-patterns-q-p3",
      "week5-vulnerability-patterns-q-p4",
      "week5-vulnerability-patterns-q-p5",
      "week5-vulnerability-patterns-q-p6",
      "week5-vulnerability-patterns-q-p7",
      "week5-vulnerability-patterns-q-p8",
      "week5-vulnerability-patterns-checkpoint"
    ],
    blocks: [
      heading("week5-vulnerability-patterns-title", "Recognising vulnerability patterns"),
      paragraph(
        "week5-vulnerability-patterns-intro",
        "A vulnerability is a weakness in a system, process or configuration that could be used to cause harm. This activity uses simplified, fictional Northbank clinic examples so you can recognise the pattern, explain the possible impact, and name a defensive check. Do not use these ideas against real systems."
      ),
      callout(
        "week5-vulnerability-patterns-boundary",
        "Classroom boundary: every snippet is a deliberately weak training example. You are practising identification, detection and secure alternatives — not attacking live services or handling real patient data."
      ),
      mcq(
        "week5-vulnerability-patterns",
        "p1",
        "A training booking page still accepts the clinic’s original demo login of admin / admin. What vulnerability pattern is this?",
        [
          ["a", "Weak or default credentials"],
          ["b", "A threat actor’s motivation"],
          ["c", "A completed ransomware impact"],
          ["d", "A legal requirement to keep demo accounts"]
        ],
        "a",
        "Default or shared logins are a vulnerability: they make it too easy for the wrong person to authenticate. A threat is whoever might try; the risk is the chance and impact of that happening at Northbank."
      ),
      mcq(
        "week5-vulnerability-patterns",
        "p2",
        "A fictional records URL is /training/records/patient/1044. The app shows whichever training record matches the number, without checking that the signed-in clinician is allowed to see it. What is the main weakness?",
        [
          ["a", "Missing object-level access control"],
          ["b", "The clinic uses too many firewalls"],
          ["c", "Backups are encrypted"],
          ["d", "Staff completed phishing training"]
        ],
        "a",
        "If the app trusts an identifier in the URL and does not also check authorisation, one user may reach another patient’s training record. Detection: review whether every record lookup also checks ownership or role."
      ),
      mcq(
        "week5-vulnerability-patterns",
        "p3",
        "A Northbank training lookup is built as: query = \"SELECT * FROM training_patients WHERE surname = '\" + typedSurname + \"'\". What pattern should you flag?",
        [
          ["a", "Untrusted input concatenated into a query"],
          ["b", "Using a database at all"],
          ["c", "Encrypting backups overnight"],
          ["d", "Asking the learner to type a surname"]
        ],
        "a",
        "Joining untrusted text into a query string can change what the lookup does. Do not try this against real systems. Detection: look for string-built SQL. Remediation: use a parameterised query so the surname is data, not code."
      ),
      mcq(
        "week5-vulnerability-patterns",
        "p4",
        "A fictional training config contains CLINIC_DEMO_TOKEN = \"not-a-real-secret\" in a file that is copied into the learner hub. Why is this a vulnerability pattern?",
        [
          ["a", "Secrets in source or config can be reused if the file leaks"],
          ["b", "Tokens should always be printed on posters"],
          ["c", "Demo tokens cannot be misused even if copied"],
          ["d", "This is only a threat, not a weakness"]
        ],
        "a",
        "Hard-coded credentials are a weakness in how secrets are stored. If the file is copied, the token travels with it. Detection: search repos for token-like assignments. Fix: store secrets in a secret manager or environment the app reads at run time, and rotate anything that leaked."
      ),
      mcq(
        "week5-vulnerability-patterns",
        "p5",
        "Northbank’s training kiosk still runs last year’s unpatched booking component after a vendor published a fix. What is the vulnerability?",
        [
          ["a", "Unpatched or outdated software"],
          ["b", "Having a vendor at all"],
          ["c", "Publishing a fix too quickly"],
          ["d", "Asking reception staff to reboot weekly"]
        ],
        "a",
        "Known, unfixed weaknesses in software are vulnerabilities. A threat is anyone who tries to use that known gap. Impact at a clinic can include disrupted bookings or exposed records. Detection: inventory versions and compare them with vendor advisories."
      ),
      mcq(
        "week5-vulnerability-patterns",
        "p6",
        "A feedback box does comments.innerHTML = visitorMessage in a training page. What is the main client-side risk?",
        [
          ["a", "Untrusted text can be treated as HTML in the page"],
          ["b", "The page uses too much CSS"],
          ["c", "innerHTML always encrypts the message"],
          ["d", "Visitors cannot submit empty comments"]
        ],
        "a",
        "Putting untrusted strings into HTML can change the page for other users. Detection: look for innerHTML, document.write or unsafe templating with user text. Secure alternative: textContent or a library that encodes output."
      ),
      mcq(
        "week5-vulnerability-patterns",
        "p7",
        "A shared training folder is set so that anyone on the clinic Wi-Fi can read every file, including draft letters. What configuration weakness is this?",
        [
          ["a", "Excessive permissions / overly open sharing"],
          ["b", "Using folders instead of paper"],
          ["c", "Wi-Fi existing in the building"],
          ["d", "Encrypting the letters after they are posted"]
        ],
        "a",
        "Over-permissive shares are a configuration vulnerability: more people can read data than the job requires. Detection: review share permissions and group membership. Control: least privilege and separate staff / visitor networks."
      ),
      mcq(
        "week5-vulnerability-patterns",
        "p8",
        "Which check best detects several of these weaknesses before they reach live clinic systems?",
        [
          ["a", "A code and configuration review against a short secure-coding checklist"],
          ["b", "Hoping no one notices"],
          ["c", "Deleting log files each night so nothing is stored"],
          ["d", "Publishing admin passwords in the staff newsletter"]
        ],
        "a",
        "Reviews, dependency/version checks, and secret scanning are detection approaches. They do not replace patching, access control or input validation — they help you find those gaps while the example is still in training data."
      ),
      shortResponse(
        "week5-vulnerability-patterns",
        "checkpoint",
        "Pick one Northbank example from this activity. Name the vulnerability pattern, one possible impact for patients or staff, and one detection check a reviewer could use. Do not describe steps for attacking a real system.",
        120,
        "Name the pattern, the impact, and a detection check. Stay with the fictional clinic examples."
      )
    ]
  }),
  activity({
    id: "week5-threat-vulnerability-risk",
    title: "Vulnerability, threat and risk",
    summary: "Classify Northbank statements as vulnerability, threat or risk, then explain how they connect.",
    activityType: "Classification",
    questions: [
      "week5-threat-vulnerability-risk-classification",
      "week5-threat-vulnerability-risk-explain"
    ],
    blocks: [
      heading("week5-threat-vulnerability-risk-title", "Vulnerability, threat and risk"),
      paragraph(
        "week5-threat-vulnerability-risk-intro",
        "Keep the three terms separate. A vulnerability is a weakness. A threat is a potential cause of harm (a person, process or event). Risk is the combination of that threat using a vulnerability and the impact that would follow. Classify each statement, then explain one chain in your own words."
      ),
      block("week5-threat-vulnerability-risk-classification", "classification", {
        formative: true,
        retry: true,
        questionId: "week5-threat-vulnerability-risk",
        sourceQuestionId: "week5-threat-vulnerability-risk",
        prompt: "Classify each statement as a vulnerability, a threat, or a risk.",
        categories: [
          { id: "Vulnerability", label: "Vulnerability" },
          { id: "Threat", label: "Threat" },
          { id: "Risk", label: "Risk" }
        ],
        items: [
          {
            id: "t1",
            text: "The training booking app concatenates surnames into a SQL string.",
            correctCategoryId: "Vulnerability",
            explanation: "This is a weakness in how the app is written."
          },
          {
            id: "t2",
            text: "A criminal group that tries to steal clinic appointment data for fraud.",
            correctCategoryId: "Threat",
            explanation: "This names who might cause harm, not the weakness itself."
          },
          {
            id: "t3",
            text: "If the unpatched kiosk is reached, patients may miss reviews and Northbank’s reputation may be damaged.",
            correctCategoryId: "Risk",
            explanation: "This combines a weakness with possible impact — that is risk language."
          },
          {
            id: "t4",
            text: "The shared training folder allows any Wi-Fi guest to read draft letters.",
            correctCategoryId: "Vulnerability",
            explanation: "Over-open permissions are a configuration weakness."
          },
          {
            id: "t5",
            text: "Ransomware operators targeting health organisations this year.",
            correctCategoryId: "Threat",
            explanation: "A threat is a potential source of harm, even before a specific clinic is hit."
          },
          {
            id: "t6",
            text: "There is a realistic chance that default kiosk logins lead to cancelled appointments and clinical delay.",
            correctCategoryId: "Risk",
            explanation: "Likelihood plus impact is risk, not just the weak password itself."
          },
          {
            id: "t7",
            text: "No check that clinician A is allowed to open patient 1044’s training record.",
            correctCategoryId: "Vulnerability",
            explanation: "Missing authorisation is a vulnerability in the application."
          },
          {
            id: "t8",
            text: "A former contractor still has a live remote-access account they should not have.",
            correctCategoryId: "Vulnerability",
            explanation: "An account that was not removed is a control weakness. The person could also be discussed as a threat, but the statement describes leftover access, which is the vulnerability to classify here."
          }
        ],
        feedback: {
          correct: "Those statements match vulnerability, threat or risk.",
          incorrect: "Ask: is this a weakness, a source of harm, or the chance and impact together?"
        }
      }),
      shortResponse(
        "week5-threat-vulnerability-risk",
        "explain",
        "Write one chain for Northbank: name a vulnerability, a threat that might use it, and the risk (chance and impact) for patients or the organisation. Keep the example fictional.",
        120,
        "Use all three terms. Vulnerability = weakness. Threat = who/what might cause harm. Risk = likelihood and impact."
      )
    ]
  }),
  activity({
    id: "week5-controls-matching",
    title: "Choosing defensive controls",
    summary: "Match Northbank situations to an appropriate control and justify one recommendation.",
    activityType: "Classification",
    questions: [
      "week5-controls-matching-classification",
      "week5-controls-matching-justify"
    ],
    blocks: [
      heading("week5-controls-matching-title", "Choosing defensive controls"),
      paragraph(
        "week5-controls-matching-intro",
        "A control reduces risk by removing a weakness, limiting a threat, or reducing impact. Pick the control that best fits each fictional Northbank situation. Prefer the control that treats the root cause, not a single symptom."
      ),
      block("week5-controls-matching-classification", "classification", {
        formative: true,
        retry: true,
        questionId: "week5-controls-matching",
        sourceQuestionId: "week5-controls-matching",
        prompt: "Match each situation to the most appropriate defensive control.",
        categories: [
          { id: "Patching and updates", label: "Patching and updates" },
          { id: "Access control", label: "Access control / least privilege" },
          { id: "Input validation", label: "Input validation / safe queries" },
          { id: "Secrets hygiene", label: "Secrets and credential hygiene" },
          { id: "Detection", label: "Detection and monitoring" }
        ],
        items: [
          {
            id: "c1",
            text: "The kiosk still runs last year’s booking component after the vendor issued a fix.",
            correctCategoryId: "Patching and updates",
            explanation: "Apply the vendor fix and keep a version inventory. Patching treats the unpatched-software vulnerability."
          },
          {
            id: "c2",
            text: "The training app shows any patient record whose number appears in the URL.",
            correctCategoryId: "Access control",
            explanation: "Check that the signed-in user is allowed to see that record (object-level authorisation)."
          },
          {
            id: "c3",
            text: "Surnames are concatenated into a SQL string in a training lookup.",
            correctCategoryId: "Input validation",
            explanation: "Use parameterised queries and validate/encode untrusted input so it cannot change the query."
          },
          {
            id: "c4",
            text: "A demo token is written into a config file that is copied with the project.",
            correctCategoryId: "Secrets hygiene",
            explanation: "Remove the secret from source, store it in a proper secret store, and rotate the demo value."
          },
          {
            id: "c5",
            text: "Reception still uses the original admin / admin kiosk login.",
            correctCategoryId: "Secrets hygiene",
            explanation: "Unique credentials, no shared defaults, and MFA where the platform supports it. This is credential hygiene rather than a network monitor."
          },
          {
            id: "c6",
            text: "Wi-Fi guests can open the shared folder of draft clinic letters.",
            correctCategoryId: "Access control",
            explanation: "Tighten share permissions and separate guest and staff access (least privilege)."
          },
          {
            id: "c7",
            text: "Managers want an alert if many failed logins hit the kiosk overnight.",
            correctCategoryId: "Detection",
            explanation: "Logging and alerting detect suspected misuse. Detection does not replace patching or access control."
          },
          {
            id: "c8",
            text: "A reviewer is asked to find innerHTML assignments that use visitor-supplied text.",
            correctCategoryId: "Detection",
            explanation: "Code review and scanning are detection methods for unsafe output handling; the later fix is encoding or textContent."
          }
        ],
        feedback: {
          correct: "Those situations match the expected controls.",
          incorrect: "Ask whether the need is to patch, restrict access, handle input safely, protect secrets, or detect misuse."
        }
      }),
      shortResponse(
        "week5-controls-matching",
        "justify",
        "Choose one Northbank situation. Name the vulnerability, the control you would recommend, and how you would tell whether the control is working. Do not propose attacking a live system.",
        120,
        "Name the weakness, the control, and a simple effectiveness check (for example: the record lookup now denies other clinicians)."
      )
    ]
  }),
  activity({
    id: "week5-secure-rewrite",
    title: "Improving insecure implementations",
    summary: "Choose a secure alternative for each fictional Northbank snippet and explain one root-cause fix.",
    activityType: "Guided learning",
    questions: [
      "week5-secure-rewrite-q-r1",
      "week5-secure-rewrite-q-r2",
      "week5-secure-rewrite-q-r3",
      "week5-secure-rewrite-q-r4",
      "week5-secure-rewrite-q-r5",
      "week5-secure-rewrite-q-r6",
      "week5-secure-rewrite-explain"
    ],
    blocks: [
      heading("week5-secure-rewrite-title", "Improving insecure implementations"),
      paragraph(
        "week5-secure-rewrite-intro",
        "Each item shows a deliberately insecure training snippet, then asks you to choose a secure alternative. The goal is to fix the root cause (how data and access are handled), not to hide one example string. All data is fictional."
      ),
      callout(
        "week5-secure-rewrite-boundary",
        "These snippets are incomplete on purpose. They only need to show that the weakness exists. Do not extend them into working attacks, and do not copy them into production systems."
      ),
      mcq(
        "week5-secure-rewrite",
        "r1",
        "Insecure training lookup: query = \"SELECT * FROM training_patients WHERE surname = '\" + typedSurname + \"'\". Which rewrite is the secure alternative?",
        [
          ["a", "Keep concatenating, but convert the surname to uppercase first"],
          ["b", "Use a parameterised query so the surname is bound as data, not mixed into the SQL text"],
          ["c", "Hide the lookup behind a longer URL"],
          ["d", "Print the full query on the screen so staff can check it"]
        ],
        "b",
        "Parameter binding (or an equivalent ORM API) keeps untrusted text out of the SQL structure. Filtering a few characters is brittle and is not the root-cause fix."
      ),
      mcq(
        "week5-secure-rewrite",
        "r2",
        "Insecure training page: comments.innerHTML = visitorMessage. Which rewrite is appropriate?",
        [
          ["a", "comments.textContent = visitorMessage (or another encoding-safe output method)"],
          ["b", "comments.innerHTML = visitorMessage + visitorMessage"],
          ["c", "Disable CSS so scripts cannot run"],
          ["d", "Store the message twice in localStorage"]
        ],
        "a",
        "textContent (or auto-escaping templates) treats the message as text. Doubling innerHTML or relying on CSS does not fix unsafe HTML insertion."
      ),
      mcq(
        "week5-secure-rewrite",
        "r3",
        "Insecure training config: CLINIC_DEMO_TOKEN = \"not-a-real-secret\" committed next to the app. What should happen?",
        [
          ["a", "Leave it, because the value says it is not real"],
          ["b", "Remove it from the file, load secrets from a secret store or environment at run time, and rotate any value that was copied"],
          ["c", "Rename the variable to TOKEN2"],
          ["d", "Email the token to every staff member so they remember it"]
        ],
        "b",
        "Secrets must not travel with source copies. Rotate anything that was exposed, even in a demo, so the old value cannot be reused."
      ),
      mcq(
        "week5-secure-rewrite",
        "r4",
        "Insecure records route: return trainingRecord(idFromUrl) with no further check. What is the secure alternative?",
        [
          ["a", "Load the record only if the signed-in clinician is authorised for that patient or role"],
          ["b", "Use a longer patient number so it is harder to guess"],
          ["c", "Show a warning banner but still return any record"],
          ["d", "Cache every training record in the browser"]
        ],
        "a",
        "Object-level authorisation is the root-cause fix. Longer IDs (obscurity) do not replace an access check."
      ),
      mcq(
        "week5-secure-rewrite",
        "r5",
        "Insecure kiosk setup: a shared admin / admin login on the training terminal. What is the secure alternative?",
        [
          ["a", "Unique accounts, no default passwords, and MFA where the platform supports it"],
          ["b", "Write admin / admin on a sticky note under the keyboard"],
          ["c", "Use admin / admin but change the username to Admin"],
          ["d", "Disable the screen lock so staff save time"]
        ],
        "a",
        "Shared defaults are the weakness. Unique credentials and extra factors reduce the chance that one leaked password opens the kiosk."
      ),
      mcq(
        "week5-secure-rewrite",
        "r6",
        "Insecure share: Everyone (clinic Wi-Fi) = Read on the draft-letters folder. What is the secure alternative?",
        [
          ["a", "Restrict the share to the staff group that needs those files; keep guests off that folder"],
          ["b", "Add more files to the same open share so it is harder to find letters"],
          ["c", "Rename the folder to PRIVATE but leave Everyone = Read"],
          ["d", "Email all draft letters to a public mailing list instead"]
        ],
        "a",
        "Least privilege on the share is the configuration fix. Renaming or hiding files does not change who can open them."
      ),
      shortResponse(
        "week5-secure-rewrite",
        "explain",
        "Choose one insecure snippet. Explain the weakness, the possible impact for Northbank, the secure alternative you chose, and one way a reviewer could detect a regression. Do not include attack steps against a real system.",
        150,
        "Cover weakness, impact, fix, and detection. Fix the root cause, not one example string."
      )
    ]
  })
];

const NEW_IDS = NEW_ACTIVITIES.map((item) => item.id);

function writeJson(file, value) {
  writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

const activitiesPath = join(contentDir, "activities.json");
const sessionsPath = join(contentDir, "sessions.json");
const packagePath = join(contentDir, "package.json");

const activities = JSON.parse(readFileSync(activitiesPath, "utf8"));
const existing = new Set(activities.map((item) => item.id));
for (const item of NEW_ACTIVITIES) {
  if (existing.has(item.id)) {
    const index = activities.findIndex((row) => row.id === item.id);
    activities[index] = item;
  } else {
    const insertAt = activities.findIndex((row) => row.id === "week5-answer-improvement");
    activities.splice(insertAt + 1, 0, item);
    existing.add(item.id);
  }
}
writeJson(activitiesPath, activities);

const sessions = JSON.parse(readFileSync(sessionsPath, "utf8"));
for (const session of sessions) {
  if (session.id === "week-5-session-1") {
    session.relationships.activities = [
      "week5-session1-retrieval",
      "week5-vulnerability-patterns",
      "week5-threat-vulnerability-risk",
      "week5-impacts-learning",
      "week5-impact-classification",
      "week5-ransomware-companion",
      "week5-exercise-debrief"
    ];
  }
  if (session.id === "week-5-session-2") {
    session.relationships.activities = [
      "week5-session2-retrieval",
      "week5-stakeholder-grid",
      "week5-impact-analysis",
      "week5-controls-matching",
      "week5-secure-rewrite",
      "week5-ocr-question-practice",
      "week5-answer-improvement"
    ];
  }
}
writeJson(sessionsPath, sessions);

const pkg = {
  schema: "lp.content.package",
  schemaVersion: "0.1.0",
  id: "unit-3-cyber-security-content",
  version: "0.2.0",
  hub: JSON.parse(readFileSync(join(contentDir, "hub.json"), "utf8")),
  curriculum: JSON.parse(readFileSync(join(contentDir, "curriculum.json"), "utf8")),
  learningOutcomes: JSON.parse(readFileSync(join(contentDir, "learning-outcomes.json"), "utf8")),
  assignments: JSON.parse(readFileSync(join(contentDir, "assignments.json"), "utf8")),
  weeks: JSON.parse(readFileSync(join(contentDir, "weeks.json"), "utf8")),
  sessions,
  activities
};
writeJson(packagePath, pkg);

const shells = [
  {
    slug: "vulnerability-patterns",
    title: "Recognising vulnerability patterns | Week 5",
    description: "Identify common weakness patterns in fictional Northbank examples."
  },
  {
    slug: "threat-vulnerability-risk",
    title: "Vulnerability, threat and risk | Week 5",
    description: "Distinguish vulnerability, threat and risk using Northbank statements."
  },
  {
    slug: "controls-matching",
    title: "Choosing defensive controls | Week 5",
    description: "Match situations to defensive controls and justify a recommendation."
  },
  {
    slug: "secure-rewrite",
    title: "Improving insecure implementations | Week 5",
    description: "Choose secure alternatives for deliberately insecure training snippets."
  }
];

for (const shell of shells) {
  const dir = join(root, "week-5", shell.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "index.html"),
    `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${shell.description}">
  <meta name="theme-color" content="#0b1f33">
  <link rel="icon" href="data:,">
  <title>${shell.title}</title>
  <script src="../../js/core/theme-bootstrap.js?v=2"></script>
</head>
<body data-page="week-5-${shell.slug}" data-section="week-5" data-root="../.." data-view="activity" data-week="5" data-activity="${shell.slug}">
  <noscript><p>JavaScript is required for the Unit 3 Cyber Security Hub.</p></noscript>
  <div id="root"></div>
  <template id="unit3-page-body"></template>
  <script type="module" src="../../src/main.tsx"></script>
</body>
</html>
`
  );
}

console.log("added", NEW_IDS.join(", "));
console.log("activities", activities.length);
console.log("package activities", pkg.activities.length);
