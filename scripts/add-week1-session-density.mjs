/**
 * Expand Week 1 Session 1 and Session 2 catalogue density.
 * Preserves existing u3-w01-* activities and rebuilds the bundled package.
 *
 * Run: node scripts/add-week1-session-density.mjs
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

function mcq(activityId, qid, prompt, options, correct, feedback, extra = {}) {
  return block(`${activityId}-q-${qid}`, "single-choice", {
    formative: true,
    retry: true,
    questionId: `${activityId}:${qid}`,
    sourceQuestionId: qid,
    prompt,
    options: options.map(([id, label]) => ({ id, label })),
    correctOptionId: correct,
    feedback: { correct: feedback, incorrect: feedback },
    sourceType: "single",
    ...extra
  });
}

function trueFalse(activityId, qid, prompt, correct, feedback) {
  return mcq(
    activityId,
    qid,
    prompt,
    [
      ["true", "True"],
      ["false", "False"]
    ],
    correct,
    feedback,
    { presentation: "true-false" }
  );
}

function optionCards(activityId, qid, prompt, options, correct, feedback) {
  return mcq(activityId, qid, prompt, options, correct, feedback, { presentation: "option-cards" });
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

function reflection(activityId, qid, prompt, guidance) {
  return block(`${activityId}-${qid}`, "reflection", {
    formative: true,
    questionId: `${activityId}:${qid}`,
    sourceQuestionId: qid,
    prompt,
    guidance
  });
}

function classification(activityId, qid, prompt, categories, items, feedback) {
  return block(`${activityId}-q-${qid}`, "classification", {
    formative: true,
    retry: true,
    questionId: `${activityId}:${qid}`,
    sourceQuestionId: qid,
    prompt,
    categories: categories.map((label) => ({ id: label, label })),
    items: items.map(([id, label, category]) => ({
      id,
      label,
      correctCategoryId: category
    })),
    feedback: { correct: feedback, incorrect: feedback }
  });
}

function dragDrop(activityId, qid, prompt, items, targets, correct, feedback) {
  return block(`${activityId}-q-${qid}`, "drag-drop", {
    formative: true,
    retry: true,
    questionId: `${activityId}:${qid}`,
    sourceQuestionId: qid,
    prompt,
    items: items.map(([id, label]) => ({ id, label })),
    targets: targets.map(([id, label]) => ({ id, label })),
    correct,
    feedback: { correct: feedback, incorrect: feedback }
  });
}

function fillGap(activityId, qid, prompt, gaps, options, feedback) {
  return block(`${activityId}-q-${qid}`, "fill-gap", {
    formative: true,
    retry: true,
    questionId: `${activityId}:${qid}`,
    sourceQuestionId: qid,
    prompt,
    gaps,
    options: options.map(([id, label]) => ({ id, label })),
    feedback: { correct: feedback, incorrect: feedback }
  });
}

function ordering(activityId, qid, prompt, items) {
  return block(`${activityId}-q-${qid}`, "ordering", {
    formative: true,
    questionId: `${activityId}:${qid}`,
    sourceQuestionId: qid,
    prompt,
    items: items.map(([id, label]) => ({ id, label }))
  });
}

function activity({ id, title, summary, activityType, group, questions, blocks }) {
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
      group,
      topics: [group],
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

const EXISTING_IDS = new Set([
  "u3-w01-baseline",
  "u3-w01-cia",
  "u3-w01-incidents",
  "u3-w01-glossary",
  "u3-w01-retrieval",
  "u3-w01-command-words",
  "u3-w01-ocr-practice",
  "u3-w01-peer-improvement"
]);

const SIX = [
  "Hacking",
  "Virus",
  "Denial of service (DoS)",
  "Phishing",
  "Identity theft",
  "Data interception and theft"
];

/** Catalogue projection requires drag-drop target IDs to match ^[A-Za-z0-9._:-]+$ */
const SIX_TARGETS = [
  ["hacking", "Hacking"],
  ["virus", "Virus"],
  ["denial-of-service", "Denial of service (DoS)"],
  ["phishing", "Phishing"],
  ["identity-theft", "Identity theft"],
  ["data-interception", "Data interception and theft"]
];

const SESSION_1_IDS = [
  "u3-w01-baseline",
  "u3-w01-misconceptions",
  "u3-w01-confidence",
  "u3-w01-definition-choice",
  "u3-w01-what-it-protects",
  "u3-w01-definition-gap",
  "u3-w01-cia",
  "u3-w01-cia-confidentiality",
  "u3-w01-cia-integrity",
  "u3-w01-cia-availability",
  "u3-w01-cia-distinguish",
  "u3-w01-cia-combined",
  "u3-w01-incident-definitions",
  "u3-w01-incident-match",
  "u3-w01-incidents",
  "u3-w01-incident-recognise",
  "u3-w01-incident-distinguish",
  "u3-w01-incident-evidence",
  "u3-w01-cia-incident-pair",
  "u3-w01-cia-incident-justify",
  "u3-w01-cia-incident-challenge",
  "u3-w01-northbank-cia",
  "u3-w01-northbank-incidents",
  "u3-w01-northbank-consequences",
  "u3-w01-thm-prep",
  "u3-w01-thm-retrieval",
  "u3-w01-glossary",
  "u3-w01-session1-review"
];

const SESSION_2_IDS = [
  "u3-w01-retrieval",
  "u3-w01-retrieval-cia",
  "u3-w01-retrieval-incidents",
  "u3-w01-retrieval-terms",
  "u3-w01-retrieval-tf",
  "u3-w01-personal-data",
  "u3-w01-organisational-data",
  "u3-w01-state-data",
  "u3-w01-who-is-harmed",
  "u3-w01-cia-threatened",
  "u3-w01-nb-data-holdings",
  "u3-w01-nb-stakeholders",
  "u3-w01-nb-consequences",
  "u3-w01-nb-importance",
  "u3-w01-command-words",
  "u3-w01-identify-vs-describe",
  "u3-w01-command-spot-weak",
  "u3-w01-command-improve",
  "u3-w01-marks-depth",
  "u3-w01-marks-earned",
  "u3-w01-marks-missing",
  "u3-w01-ocr-recognise",
  "u3-w01-ocr-evidence",
  "u3-w01-ocr-select-better",
  "u3-w01-ocr-practice",
  "u3-w01-weak-answer-spot",
  "u3-w01-peer-improvement",
  "u3-w01-improvement-action"
];

const SLUGS = {
  "u3-w01-baseline": "baseline",
  "u3-w01-misconceptions": "misconceptions",
  "u3-w01-confidence": "confidence",
  "u3-w01-definition-choice": "definition-choice",
  "u3-w01-what-it-protects": "what-it-protects",
  "u3-w01-definition-gap": "definition-gap",
  "u3-w01-cia": "cia",
  "u3-w01-cia-confidentiality": "cia-confidentiality",
  "u3-w01-cia-integrity": "cia-integrity",
  "u3-w01-cia-availability": "cia-availability",
  "u3-w01-cia-distinguish": "cia-distinguish",
  "u3-w01-cia-combined": "cia-combined",
  "u3-w01-incident-definitions": "incident-definitions",
  "u3-w01-incident-match": "incident-match",
  "u3-w01-incidents": "incidents",
  "u3-w01-incident-recognise": "incident-recognise",
  "u3-w01-incident-distinguish": "incident-distinguish",
  "u3-w01-incident-evidence": "incident-evidence",
  "u3-w01-cia-incident-pair": "cia-incident-pair",
  "u3-w01-cia-incident-justify": "cia-incident-justify",
  "u3-w01-cia-incident-challenge": "cia-incident-challenge",
  "u3-w01-northbank-cia": "northbank-cia",
  "u3-w01-northbank-incidents": "northbank-incidents",
  "u3-w01-northbank-consequences": "northbank-consequences",
  "u3-w01-thm-prep": "thm-prep",
  "u3-w01-thm-retrieval": "thm-retrieval",
  "u3-w01-glossary": "glossary",
  "u3-w01-session1-review": "session1-review",
  "u3-w01-retrieval": "retrieval-quiz",
  "u3-w01-retrieval-cia": "retrieval-cia",
  "u3-w01-retrieval-incidents": "retrieval-incidents",
  "u3-w01-retrieval-terms": "retrieval-terms",
  "u3-w01-retrieval-tf": "retrieval-tf",
  "u3-w01-personal-data": "personal-data",
  "u3-w01-organisational-data": "organisational-data",
  "u3-w01-state-data": "state-data",
  "u3-w01-who-is-harmed": "who-is-harmed",
  "u3-w01-cia-threatened": "cia-threatened",
  "u3-w01-nb-data-holdings": "nb-data-holdings",
  "u3-w01-nb-stakeholders": "nb-stakeholders",
  "u3-w01-nb-consequences": "nb-consequences",
  "u3-w01-nb-importance": "nb-importance",
  "u3-w01-command-words": "command-words",
  "u3-w01-identify-vs-describe": "identify-vs-describe",
  "u3-w01-command-spot-weak": "command-spot-weak",
  "u3-w01-command-improve": "command-improve",
  "u3-w01-marks-depth": "marks-depth",
  "u3-w01-marks-earned": "marks-earned",
  "u3-w01-marks-missing": "marks-missing",
  "u3-w01-ocr-recognise": "ocr-recognise",
  "u3-w01-ocr-evidence": "ocr-evidence",
  "u3-w01-ocr-select-better": "ocr-select-better",
  "u3-w01-ocr-practice": "ocr-practice",
  "u3-w01-weak-answer-spot": "weak-answer-spot",
  "u3-w01-peer-improvement": "peer-improvement",
  "u3-w01-improvement-action": "improvement-action"
};

const TITLES = {
  "u3-w01-misconceptions": "Spotting Week 1 misconceptions",
  "u3-w01-confidence": "Confidence before teaching",
  "u3-w01-definition-choice": "What cyber security means",
  "u3-w01-what-it-protects": "What cyber security protects",
  "u3-w01-definition-gap": "Complete the cyber security definition",
  "u3-w01-cia-confidentiality": "Confidentiality in practice",
  "u3-w01-cia-integrity": "Integrity in practice",
  "u3-w01-cia-availability": "Availability in practice",
  "u3-w01-cia-distinguish": "Distinguishing CIA aims",
  "u3-w01-cia-combined": "When more than one CIA aim is affected",
  "u3-w01-incident-definitions": "Six incident types: definitions",
  "u3-w01-incident-match": "Match the incident type",
  "u3-w01-incident-recognise": "Recognise the incident from the scenario",
  "u3-w01-incident-distinguish": "Tell similar incidents apart",
  "u3-w01-incident-evidence": "Evidence for a classification",
  "u3-w01-cia-incident-pair": "Incident type and CIA aim",
  "u3-w01-cia-incident-justify": "Justify a paired classification",
  "u3-w01-cia-incident-challenge": "Challenge: more than one CIA aim",
  "u3-w01-northbank-cia": "Northbank and the CIA triad",
  "u3-w01-northbank-incidents": "Northbank incident recognition",
  "u3-w01-northbank-consequences": "Consequences for Northbank",
  "u3-w01-thm-prep": "TryHackMe: Principles of Security preparation",
  "u3-w01-thm-retrieval": "After Principles of Security",
  "u3-w01-session1-review": "Session 1 review and directed study",
  "u3-w01-retrieval-cia": "Retrieval: CIA aims",
  "u3-w01-retrieval-incidents": "Retrieval: six incident types",
  "u3-w01-retrieval-terms": "Retrieval: precise terminology",
  "u3-w01-retrieval-tf": "Retrieval: true or false",
  "u3-w01-personal-data": "Why personal data must be protected",
  "u3-w01-organisational-data": "Why organisational data must be protected",
  "u3-w01-state-data": "Why state data must be protected",
  "u3-w01-who-is-harmed": "Who is harmed when protection fails",
  "u3-w01-cia-threatened": "Which CIA aim is threatened",
  "u3-w01-nb-data-holdings": "Northbank data holdings",
  "u3-w01-nb-stakeholders": "Northbank stakeholders",
  "u3-w01-nb-consequences": "Northbank protection consequences",
  "u3-w01-nb-importance": "Why Northbank must protect information",
  "u3-w01-identify-vs-describe": "Identify, describe or explain",
  "u3-w01-command-spot-weak": "Answers that miss the command word",
  "u3-w01-command-improve": "Improve a command-word answer",
  "u3-w01-marks-depth": "How marks signal depth",
  "u3-w01-marks-earned": "Where marks were earned",
  "u3-w01-marks-missing": "What is missing for the marks",
  "u3-w01-ocr-recognise": "Recognise a credit-worthy answer",
  "u3-w01-ocr-evidence": "Select the evidence the question needs",
  "u3-w01-ocr-select-better": "Choose the stronger written answer",
  "u3-w01-weak-answer-spot": "Spot missing marks in a weak response",
  "u3-w01-improvement-action": "Record one improvement action"
};

function qids(activityId, ...suffixes) {
  return suffixes.map((suffix) =>
    suffix.startsWith(activityId) ? suffix : `${activityId}-q-${suffix}`
  );
}

const NEW_ACTIVITIES = [
  activity({
    id: "u3-w01-misconceptions",
    title: TITLES["u3-w01-misconceptions"],
    summary: "Check common Week 1 misconceptions before the main teaching sequence.",
    activityType: "Diagnostic",
    group: "Diagnostic and misconceptions",
    questions: qids("u3-w01-misconceptions", "m1", "m2", "m3"),
    blocks: [
      heading("u3-w01-misconceptions-title", TITLES["u3-w01-misconceptions"]),
      paragraph(
        "u3-w01-misconceptions-intro",
        "Decide whether each statement is true or false. Use specification language, not everyday guesses."
      ),
      trueFalse(
        "u3-w01-misconceptions",
        "m1",
        "Cyber security is only about installing antivirus software.",
        "false",
        "Cyber security protects information systems, networks and data. Antivirus can be one control, but it is not the whole meaning."
      ),
      trueFalse(
        "u3-w01-misconceptions",
        "m2",
        "Confidentiality, integrity and availability are the three cyber security aims used in this unit.",
        "true",
        "Week 1 uses the CIA triad: confidentiality, integrity and availability."
      ),
      trueFalse(
        "u3-w01-misconceptions",
        "m3",
        "A phishing message is the same incident type as a virus.",
        "false",
        "Phishing is a specification incident type that uses deception. A virus is malware that infects systems. Keep the names separate."
      )
    ]
  }),
  activity({
    id: "u3-w01-confidence",
    title: TITLES["u3-w01-confidence"],
    summary: "Record how confident you feel about Week 1 terms before teaching.",
    activityType: "Self-assessment",
    group: "Diagnostic and misconceptions",
    questions: ["u3-w01-confidence-note"],
    blocks: [
      heading("u3-w01-confidence-title", TITLES["u3-w01-confidence"]),
      paragraph(
        "u3-w01-confidence-intro",
        "This is a diagnostic note, not a grade. Name the Week 1 ideas you already feel sure about and those you want to watch during the lesson."
      ),
      reflection(
        "u3-w01-confidence",
        "note",
        "In your own words, list: one CIA aim you can already explain; one incident type you are less sure about; and one question you want this week to answer. Use the terms confidentiality, integrity, availability where you can.",
        "Saved. Revisit this note at the end of Session 1."
      )
    ]
  }),
  activity({
    id: "u3-w01-definition-choice",
    title: TITLES["u3-w01-definition-choice"],
    summary: "Choose the definition that matches Unit 3 cyber security.",
    activityType: "Knowledge check",
    group: "Meaning of cyber security",
    questions: qids("u3-w01-definition-choice", "d1", "d2"),
    blocks: [
      heading("u3-w01-definition-choice-title", TITLES["u3-w01-definition-choice"]),
      paragraph(
        "u3-w01-definition-choice-intro",
        "Cyber security aims to protect information. Pick the statement that uses that idea accurately."
      ),
      optionCards(
        "u3-w01-definition-choice",
        "d1",
        "Which statement best defines cyber security for this unit?",
        [
          ["a", "Protecting information systems, networks and data from unauthorised access, damage or disruption"],
          ["b", "Making clinic websites look modern"],
          ["c", "Printing every patient letter so nothing is stored digitally"],
          ["d", "Only blocking social media on staff phones"]
        ],
        "a",
        "The unit definition is about protecting systems, networks and data — not appearance, paper-only working or one control."
      ),
      optionCards(
        "u3-w01-definition-choice",
        "d2",
        "What is the purpose of cyber security aims such as confidentiality?",
        [
          ["a", "To protect information so the right people can use it safely and it stays trustworthy"],
          ["b", "To make every system slower so attackers lose interest"],
          ["c", "To replace staff training"],
          ["d", "To guarantee that no incident can ever happen"]
        ],
        "a",
        "CIA aims describe how information should be protected. They do not promise that incidents are impossible."
      )
    ]
  }),
  activity({
    id: "u3-w01-what-it-protects",
    title: TITLES["u3-w01-what-it-protects"],
    summary: "Sort what cyber security primarily protects from what it does not.",
    activityType: "Classification",
    group: "Meaning of cyber security",
    questions: qids("u3-w01-what-it-protects", "sort"),
    blocks: [
      heading("u3-w01-what-it-protects-title", TITLES["u3-w01-what-it-protects"]),
      paragraph(
        "u3-w01-what-it-protects-intro",
        "Cyber security protects information. Sort each item according to whether it is a primary protection target in this unit."
      ),
      classification(
        "u3-w01-what-it-protects",
        "sort",
        "Does cyber security primarily protect this?",
        ["Primarily protects", "Not the primary target"],
        [
          ["systems", "Information systems", "Primarily protects"],
          ["networks", "Networks", "Primarily protects"],
          ["data", "Data, including patient records", "Primarily protects"],
          ["paint", "The colour of a clinic waiting-room wall", "Not the primary target"],
          ["menus", "Printed cafeteria menus with no personal data", "Not the primary target"]
        ],
        "Cyber security is about information systems, networks and data. Everyday objects with no information role are not the unit’s primary target."
      )
    ]
  }),
  activity({
    id: "u3-w01-definition-gap",
    title: TITLES["u3-w01-definition-gap"],
    summary: "Complete a specification-style definition of cyber security.",
    activityType: "Phrase completion",
    group: "Meaning of cyber security",
    questions: qids("u3-w01-definition-gap", "g1", "g2"),
    blocks: [
      heading("u3-w01-definition-gap-title", TITLES["u3-w01-definition-gap"]),
      paragraph(
        "u3-w01-definition-gap-intro",
        "Complete each sentence with the missing specification term."
      ),
      fillGap(
        "u3-w01-definition-gap",
        "g1",
        "Cyber security aims to protect {blank} from unauthorised access, damage or disruption.",
        [{ id: "blank", label: "missing term", correctOptionId: "information" }],
        [
          ["information", "information"],
          ["furniture", "furniture"],
          ["weather", "weather"]
        ],
        "The teaching content is that cyber security aims to protect information."
      ),
      fillGap(
        "u3-w01-definition-gap",
        "g2",
        "Unauthorised viewing of records mainly threatens {blank}.",
        [{ id: "blank", label: "CIA aim", correctOptionId: "confidentiality" }],
        [
          ["confidentiality", "confidentiality"],
          ["availability", "availability"],
          ["integrity", "integrity"]
        ],
        "Unauthorised viewing is a confidentiality issue."
      )
    ]
  }),
  activity({
    id: "u3-w01-cia-confidentiality",
    title: TITLES["u3-w01-cia-confidentiality"],
    summary: "Recognise confidentiality: information is viewed only by those authorised to see it.",
    activityType: "Knowledge check",
    group: "CIA triad",
    questions: qids("u3-w01-cia-confidentiality", "c1", "c2"),
    blocks: [
      heading("u3-w01-cia-confidentiality-title", TITLES["u3-w01-cia-confidentiality"]),
      paragraph(
        "u3-w01-cia-confidentiality-intro",
        "Confidentiality means information is not disclosed to anyone who is not authorised to see it. Patient records at Northbank are a typical example."
      ),
      mcq(
        "u3-w01-cia-confidentiality",
        "c1",
        "Which situation is mainly a confidentiality problem?",
        [
          ["a", "A receptionist reads a patient record with no clinical need"],
          ["b", "The booking website is offline so appointments cannot be made"],
          ["c", "A clinic letter is saved with the wrong clinic date"],
          ["d", "A printer runs out of paper in reception"]
        ],
        "a",
        "Unauthorised viewing of a patient record is confidentiality. Downtime is availability; a wrong date is integrity."
      ),
      mcq(
        "u3-w01-cia-confidentiality",
        "c2",
        "Which wording best describes confidentiality?",
        [
          ["a", "Only authorised people can view the information"],
          ["b", "The information can be used whenever staff need it"],
          ["c", "The information has not been changed in an unauthorised way"],
          ["d", "The information is stored on paper"]
        ],
        "a",
        "Confidentiality is about authorised viewing. Availability is about being able to use the information; integrity is about it remaining accurate and unaltered without authorisation."
      )
    ]
  }),
  activity({
    id: "u3-w01-cia-integrity",
    title: TITLES["u3-w01-cia-integrity"],
    summary: "Recognise integrity: information remains accurate and is not changed without authorisation.",
    activityType: "Knowledge check",
    group: "CIA triad",
    questions: qids("u3-w01-cia-integrity", "i1", "i2"),
    blocks: [
      heading("u3-w01-cia-integrity-title", TITLES["u3-w01-cia-integrity"]),
      paragraph(
        "u3-w01-cia-integrity-intro",
        "Integrity means information is complete, accurate and has not been altered without authorisation."
      ),
      mcq(
        "u3-w01-cia-integrity",
        "i1",
        "Which situation is mainly an integrity problem?",
        [
          ["a", "Someone changes a clinic appointment time without permission"],
          ["b", "Staff cannot open the booking system at 9am"],
          ["c", "A visitor photographs a patient list on a screen"],
          ["d", "The clinic Wi-Fi password is written on a poster"]
        ],
        "a",
        "Unauthorised change to an appointment record is integrity. Being unable to open the system is availability; photographing a list is confidentiality."
      ),
      mcq(
        "u3-w01-cia-integrity",
        "i2",
        "Which wording best describes integrity?",
        [
          ["a", "Information remains accurate and is not altered without authorisation"],
          ["b", "Information is hidden from every member of staff"],
          ["c", "Systems are always faster than paper"],
          ["d", "Backups are stored in another country"]
        ],
        "a",
        "Integrity is about authorised, accurate information — not hiding data from all staff or where backups are stored."
      )
    ]
  }),
  activity({
    id: "u3-w01-cia-availability",
    title: TITLES["u3-w01-cia-availability"],
    summary: "Recognise availability: authorised people can use systems and data when they need them.",
    activityType: "Knowledge check",
    group: "CIA triad",
    questions: qids("u3-w01-cia-availability", "a1", "a2"),
    blocks: [
      heading("u3-w01-cia-availability-title", TITLES["u3-w01-cia-availability"]),
      paragraph(
        "u3-w01-cia-availability-intro",
        "Availability means authorised users can access systems and information when they need to. Northbank’s booking website is a typical example."
      ),
      mcq(
        "u3-w01-cia-availability",
        "a1",
        "Which situation is mainly an availability problem?",
        [
          ["a", "Attackers flood the booking website so patients cannot book"],
          ["b", "A staff member emails a patient contact list to a personal account"],
          ["c", "A dosage field in a record is overwritten with the wrong number"],
          ["d", "A policy document uses everyday language instead of specification terms"]
        ],
        "a",
        "A flood that stops booking is availability (and matches denial of service). Sending a contact list is confidentiality; a wrong dosage is integrity."
      ),
      mcq(
        "u3-w01-cia-availability",
        "a2",
        "Which wording best describes availability?",
        [
          ["a", "Authorised people can use the system or data when they need it"],
          ["b", "Nobody except the attacker can see the data"],
          ["c", "The data has been secretly changed"],
          ["d", "The organisation has printed a poster about passwords"]
        ],
        "a",
        "Availability is about authorised use at the time of need."
      )
    ]
  }),
  activity({
    id: "u3-w01-cia-distinguish",
    title: TITLES["u3-w01-cia-distinguish"],
    summary: "Sort short cases into confidentiality, integrity or availability.",
    activityType: "Classification",
    group: "CIA triad",
    questions: qids("u3-w01-cia-distinguish", "sort"),
    blocks: [
      heading("u3-w01-cia-distinguish-title", TITLES["u3-w01-cia-distinguish"]),
      paragraph(
        "u3-w01-cia-distinguish-intro",
        "Similar-looking problems can affect different CIA aims. Classify each case."
      ),
      classification(
        "u3-w01-cia-distinguish",
        "sort",
        "Which CIA aim is mainly affected?",
        ["Confidentiality", "Integrity", "Availability"],
        [
          ["view", "A visitor reads patient names on an unlocked screen", "Confidentiality"],
          ["edit", "An appointment note is changed to the wrong clinic", "Integrity"],
          ["down", "The booking website will not load for a morning", "Availability"],
          ["copy", "Staff copy a patient contact list without a work need", "Confidentiality"],
          ["flood", "The booking service is flooded with fake requests", "Availability"]
        ],
        "Viewing or copying without authorisation is confidentiality. Unauthorised change is integrity. Not being able to use the service is availability."
      )
    ]
  }),
  activity({
    id: "u3-w01-cia-combined",
    title: TITLES["u3-w01-cia-combined"],
    summary: "Spot when one incident can affect more than one CIA aim.",
    activityType: "Knowledge check",
    group: "CIA triad",
    questions: qids("u3-w01-cia-combined", "x1", "x2"),
    blocks: [
      heading("u3-w01-cia-combined-title", TITLES["u3-w01-cia-combined"]),
      paragraph(
        "u3-w01-cia-combined-intro",
        "One incident can threaten more than one aim. Name the aims that are clearly affected."
      ),
      mcq(
        "u3-w01-cia-combined",
        "x1",
        "Ransomware encrypts clinic files so staff cannot open them, and a ransom note is left on screen. Which aims are clearly affected?",
        [
          ["a", "Integrity and availability of the files"],
          ["b", "Only the colour of the desktop wallpaper"],
          ["c", "Confidentiality of a public waiting-room poster"],
          ["d", "None of the CIA aims"]
        ],
        "a",
        "Encrypting files changes them without authorisation (integrity) and stops staff using them (availability)."
      ),
      mcq(
        "u3-w01-cia-combined",
        "x2",
        "A stolen clinic laptop still contains a patient contact list. Which aim is the first concern?",
        [
          ["a", "Confidentiality of the contact list"],
          ["b", "The laptop’s battery life"],
          ["c", "Whether the clinic logo looks professional"],
          ["d", "Availability of the cafeteria till"]
        ],
        "a",
        "The contact list on a stolen device is a confidentiality concern. Other CIA aims may also be discussed later, but the list being readable by someone unauthorised is the first specification point."
      )
    ]
  }),
  activity({
    id: "u3-w01-incident-definitions",
    title: TITLES["u3-w01-incident-definitions"],
    summary: "Match each of the six specification incident types to its meaning.",
    activityType: "Knowledge check",
    group: "Six incident types",
    questions: qids("u3-w01-incident-definitions", "t1", "t2", "t3"),
    blocks: [
      heading("u3-w01-incident-definitions-title", TITLES["u3-w01-incident-definitions"]),
      paragraph(
        "u3-w01-incident-definitions-intro",
        "The specification names six incident types: hacking, virus, denial of service (DoS), phishing, identity theft, and data interception and theft. Use those names — do not substitute looser everyday labels."
      ),
      callout(
        "u3-w01-incident-definitions-note",
        "Keyword bank: hacking · virus · denial of service (DoS) · phishing · identity theft · data interception and theft"
      ),
      mcq(
        "u3-w01-incident-definitions",
        "t1",
        "Which incident type is unauthorised access to a system or account?",
        [
          ["a", "Hacking"],
          ["b", "Denial of service (DoS)"],
          ["c", "Virus"],
          ["d", "Phishing"]
        ],
        "a",
        "Hacking is unauthorised access. DoS stops a service; a virus infects; phishing deceives a person."
      ),
      mcq(
        "u3-w01-incident-definitions",
        "t2",
        "Which incident type uses a deceptive message to trick a person into giving information or access?",
        [
          ["a", "Phishing"],
          ["b", "Virus"],
          ["c", "Denial of service (DoS)"],
          ["d", "Data interception and theft"]
        ],
        "a",
        "Phishing is deception aimed at a person. A virus is malware; DoS floods a service; interception captures data in transit."
      ),
      mcq(
        "u3-w01-incident-definitions",
        "t3",
        "Which incident type captures or steals data as it is transmitted or stored?",
        [
          ["a", "Data interception and theft"],
          ["b", "Denial of service (DoS)"],
          ["c", "Virus"],
          ["d", "Hacking"]
        ],
        "a",
        "Data interception and theft is about capturing or stealing the data itself. Hacking is unauthorised access; DoS is disruption; a virus is malware."
      )
    ]
  }),
  activity({
    id: "u3-w01-incident-match",
    title: TITLES["u3-w01-incident-match"],
    summary: "Place each short description on the matching specification incident type.",
    activityType: "Drag and drop",
    group: "Six incident types",
    questions: qids("u3-w01-incident-match", "map"),
    blocks: [
      heading("u3-w01-incident-match-title", TITLES["u3-w01-incident-match"]),
      paragraph(
        "u3-w01-incident-match-intro",
        "Drag each description onto the specification incident type it names."
      ),
      dragDrop(
        "u3-w01-incident-match",
        "map",
        "Match each description to an incident type.",
        [
          ["hack", "Unauthorised access to a system"],
          ["virus", "Malware that infects files or systems"],
          ["dos", "Flooding a service so legitimate users cannot use it"],
          ["phish", "A deceptive message that tricks a person"],
          ["id", "Misuse of someone’s identity details"],
          ["intercept", "Capturing or stealing data in transit or storage"]
        ],
        SIX_TARGETS,
        {
          hack: "hacking",
          virus: "virus",
          dos: "denial-of-service",
          phish: "phishing",
          id: "identity-theft",
          intercept: "data-interception"
        },
        "Each description matches one specification incident type."
      )
    ]
  }),
  activity({
    id: "u3-w01-incident-recognise",
    title: TITLES["u3-w01-incident-recognise"],
    summary: "Name the specification incident type from a short scenario.",
    activityType: "Knowledge check",
    group: "Six incident types",
    questions: qids("u3-w01-incident-recognise", "r1", "r2", "r3"),
    blocks: [
      heading("u3-w01-incident-recognise-title", TITLES["u3-w01-incident-recognise"]),
      paragraph(
        "u3-w01-incident-recognise-intro",
        "Read the evidence in the scenario, then name the incident type. Do not invent extra facts."
      ),
      mcq(
        "u3-w01-incident-recognise",
        "r1",
        "Staff open an email attachment. Clinic files will not open and a payment demand appears. Which incident type is this?",
        [
          ["a", "Virus"],
          ["b", "Phishing"],
          ["c", "Denial of service (DoS)"],
          ["d", "Identity theft"]
        ],
        "a",
        "Malware that infects files is a virus incident. The payment demand describes ransomware behaviour, which is still malware/virus in this unit’s incident list — not phishing by itself."
      ),
      mcq(
        "u3-w01-incident-recognise",
        "r2",
        "A message claiming to be from IT asks reception to confirm a password on a fake login page. Which incident type is this?",
        [
          ["a", "Phishing"],
          ["b", "Denial of service (DoS)"],
          ["c", "Virus"],
          ["d", "Hacking"]
        ],
        "a",
        "A deceptive message asking for a password is phishing. Hacking would be the unauthorised access that might follow if the password is used."
      ),
      mcq(
        "u3-w01-incident-recognise",
        "r3",
        "Attackers flood Northbank’s booking website so patients cannot book. Which incident type is this?",
        [
          ["a", "Denial of service (DoS)"],
          ["b", "Phishing"],
          ["c", "Identity theft"],
          ["d", "Virus"]
        ],
        "a",
        "Flooding a service so legitimate users cannot use it is denial of service."
      )
    ]
  }),
  activity({
    id: "u3-w01-incident-distinguish",
    title: TITLES["u3-w01-incident-distinguish"],
    summary: "Separate incident types that learners often mix up.",
    activityType: "Knowledge check",
    group: "Six incident types",
    questions: qids("u3-w01-incident-distinguish", "s1", "s2"),
    blocks: [
      heading("u3-w01-incident-distinguish-title", TITLES["u3-w01-incident-distinguish"]),
      paragraph(
        "u3-w01-incident-distinguish-intro",
        "Phishing is not the same as hacking. Identity theft is not the same as data interception. Choose the precise type."
      ),
      mcq(
        "u3-w01-incident-distinguish",
        "s1",
        "Someone uses stolen credentials to open a staff mailbox. Which incident type is this mainly?",
        [
          ["a", "Hacking"],
          ["b", "Phishing"],
          ["c", "Denial of service (DoS)"],
          ["d", "Virus"]
        ],
        "a",
        "Using stolen credentials to open a mailbox is unauthorised access — hacking. Phishing would be the deceptive message that obtained the credentials, if that was what the scenario described."
      ),
      mcq(
        "u3-w01-incident-distinguish",
        "s2",
        "Criminals open a credit account using a patient’s name and date of birth copied from a list. Which incident type is this mainly?",
        [
          ["a", "Identity theft"],
          ["b", "Denial of service (DoS)"],
          ["c", "Virus"],
          ["d", "Hacking"]
        ],
        "a",
        "Misuse of identity details is identity theft. The copying of the list could also be data theft, but the question asks what happens when those details are used as someone else’s identity."
      )
    ]
  }),
  activity({
    id: "u3-w01-incident-evidence",
    title: TITLES["u3-w01-incident-evidence"],
    summary: "Choose the evidence that justifies an incident classification.",
    activityType: "Knowledge check",
    group: "Six incident types",
    questions: qids("u3-w01-incident-evidence", "e1", "e2"),
    blocks: [
      heading("u3-w01-incident-evidence-title", TITLES["u3-w01-incident-evidence"]),
      paragraph(
        "u3-w01-incident-evidence-intro",
        "A classification is only as strong as the evidence in the scenario. Pick the phrase that actually justifies the type."
      ),
      mcq(
        "u3-w01-incident-evidence",
        "e1",
        "You classify a case as phishing. Which evidence best supports that?",
        [
          ["a", "The message pretends to be from IT and asks staff to enter a password on a fake page"],
          ["b", "The booking website is slow on Monday mornings"],
          ["c", "A laptop charger is missing from a drawer"],
          ["d", "The clinic uses email"]
        ],
        "a",
        "Phishing needs evidence of deception aimed at a person. Using email, or a slow website, is not enough."
      ),
      mcq(
        "u3-w01-incident-evidence",
        "e2",
        "You classify a case as denial of service. Which evidence best supports that?",
        [
          ["a", "Legitimate patients cannot use the booking site because it is flooded with fake requests"],
          ["b", "A staff member opened one attachment"],
          ["c", "A password was typed on a fake page"],
          ["d", "A contact list was emailed to a personal account"]
        ],
        "a",
        "DoS evidence is that the service cannot be used by legitimate users because of flood or disruption — not deception or data copying."
      )
    ]
  }),
  activity({
    id: "u3-w01-cia-incident-pair",
    title: TITLES["u3-w01-cia-incident-pair"],
    summary: "For each scenario, name the incident type and the CIA aim mainly compromised.",
    activityType: "Knowledge check",
    group: "CIA and incident reasoning",
    questions: qids("u3-w01-cia-incident-pair", "p1", "p2", "p3"),
    blocks: [
      heading("u3-w01-cia-incident-pair-title", TITLES["u3-w01-cia-incident-pair"]),
      paragraph(
        "u3-w01-cia-incident-pair-intro",
        "Each question asks for a pair: incident type and CIA aim. Use specification names."
      ),
      mcq(
        "u3-w01-cia-incident-pair",
        "p1",
        "A fake payroll email harvests a reception password. Which pair is best?",
        [
          ["a", "Phishing; confidentiality"],
          ["b", "Denial of service (DoS); availability"],
          ["c", "Virus; integrity"],
          ["d", "Hacking; availability"]
        ],
        "a",
        "The deceptive email is phishing. The password, if used, exposes accounts and data — confidentiality."
      ),
      mcq(
        "u3-w01-cia-incident-pair",
        "p2",
        "The booking website is flooded and patients cannot book. Which pair is best?",
        [
          ["a", "Denial of service (DoS); availability"],
          ["b", "Phishing; confidentiality"],
          ["c", "Identity theft; integrity"],
          ["d", "Virus; confidentiality"]
        ],
        "a",
        "Flooding the service is DoS. Patients cannot use booking — availability."
      ),
      mcq(
        "u3-w01-cia-incident-pair",
        "p3",
        "Malware changes clinic files so they will not open. Which pair is best?",
        [
          ["a", "Virus; integrity and availability"],
          ["b", "Phishing; confidentiality only"],
          ["c", "Identity theft; confidentiality only"],
          ["d", "Denial of service (DoS); confidentiality"]
        ],
        "a",
        "Infecting and altering files is a virus incident. Files that will not open have lost integrity and availability."
      )
    ]
  }),
  activity({
    id: "u3-w01-cia-incident-justify",
    title: TITLES["u3-w01-cia-incident-justify"],
    summary: "Write a short justification that names the incident type, CIA aim and evidence.",
    activityType: "Justified identification",
    group: "CIA and incident reasoning",
    questions: qids("u3-w01-cia-incident-justify", "j1"),
    blocks: [
      heading("u3-w01-cia-incident-justify-title", TITLES["u3-w01-cia-incident-justify"]),
      paragraph(
        "u3-w01-cia-incident-justify-intro",
        "Sentence starters: The incident type is… because… The CIA aim mainly affected is… because the evidence shows…"
      ),
      callout(
        "u3-w01-cia-incident-justify-scenario",
        "Scenario: A courier asks reception to ‘hold the door’ and then photographs a patient list on an unlocked screen in the staff room."
      ),
      mcq(
        "u3-w01-cia-incident-justify",
        "j1",
        "Which incident type best fits this evidence?",
        [
          ["a", "Data interception and theft"],
          ["b", "Denial of service (DoS)"],
          ["c", "Virus"],
          ["d", "Phishing"]
        ],
        "a",
        "Photographing the list is taking data. That is data theft. It is not a flood, malware or a deceptive email."
      ),
      shortResponse(
        "u3-w01-cia-incident-justify",
        "justify",
        "Justify your classification. Name the incident type, the CIA aim mainly compromised, and the evidence in the scenario. Do not add facts that are not there.",
        80,
        "Name type, aim and evidence. Keep to the scenario."
      )
    ]
  }),
  activity({
    id: "u3-w01-cia-incident-challenge",
    title: TITLES["u3-w01-cia-incident-challenge"],
    summary: "Optional challenge: explain how one incident can breach more than one CIA aim.",
    activityType: "Challenge",
    group: "CIA and incident reasoning",
    questions: ["u3-w01-cia-incident-challenge-rank", "u3-w01-cia-incident-challenge-explain"],
    blocks: [
      heading("u3-w01-cia-incident-challenge-title", TITLES["u3-w01-cia-incident-challenge"]),
      paragraph(
        "u3-w01-cia-incident-challenge-intro",
        "This challenge does not block the rest of the session. Arrange the incident types from most to least disruptive for a clinic booking service, then defend the ranking. There is no single official order."
      ),
      ordering("u3-w01-cia-incident-challenge", "rank", "Drag the six incident types into the order you would defend for disruption to booking.", SIX.map((label) => [label, label])),
      shortResponse(
        "u3-w01-cia-incident-challenge",
        "explain",
        "Defend your top-ranked type. Explain how that incident could affect more than one CIA aim at Northbank. Use specification terms.",
        100,
        "Name more than one CIA aim and link each to evidence a clinic would notice."
      )
    ]
  }),
  activity({
    id: "u3-w01-northbank-cia",
    title: TITLES["u3-w01-northbank-cia"],
    summary: "Apply confidentiality, integrity and availability to Northbank Community Health Partnership.",
    activityType: "Scenario analysis",
    group: "Northbank application",
    questions: qids("u3-w01-northbank-cia", "n1", "n2"),
    blocks: [
      heading("u3-w01-northbank-cia-title", TITLES["u3-w01-northbank-cia"]),
      paragraph(
        "u3-w01-northbank-cia-intro",
        "Northbank Community Health Partnership is a fictional health organisation used in this unit. It holds patient records, runs clinic booking systems and has reception staff. Do not invent extra buildings or systems."
      ),
      mcq(
        "u3-w01-northbank-cia",
        "n1",
        "Patient records at Northbank must not be read without a work need. Which CIA aim is that?",
        [
          ["a", "Confidentiality"],
          ["b", "Availability"],
          ["c", "Integrity"],
          ["d", "Usability"]
        ],
        "a",
        "Restricting viewing of patient records is confidentiality."
      ),
      mcq(
        "u3-w01-northbank-cia",
        "n2",
        "Reception must be able to open the booking system at the start of clinic. Which CIA aim is that?",
        [
          ["a", "Availability"],
          ["b", "Confidentiality"],
          ["c", "Integrity"],
          ["d", "Privacy branding"]
        ],
        "a",
        "Being able to use the booking system when needed is availability."
      )
    ]
  }),
  activity({
    id: "u3-w01-northbank-incidents",
    title: TITLES["u3-w01-northbank-incidents"],
    summary: "Classify Northbank scenarios using specification incident types.",
    activityType: "Classification",
    group: "Northbank application",
    questions: qids("u3-w01-northbank-incidents", "sort"),
    blocks: [
      heading("u3-w01-northbank-incidents-title", TITLES["u3-w01-northbank-incidents"]),
      paragraph(
        "u3-w01-northbank-incidents-intro",
        "Use only Northbank facts already taught: patient records, booking website, reception, staff room, clinic files and patient contact lists."
      ),
      classification(
        "u3-w01-northbank-incidents",
        "sort",
        "Classify each Northbank scenario.",
        SIX,
        [
          ["nb1", "An attachment encrypts clinic files", "Virus"],
          ["nb2", "A fake IT email asks for a reception password", "Phishing"],
          ["nb3", "The booking website is flooded and will not load", "Denial of service (DoS)"],
          ["nb4", "Someone logs into a staff mailbox without permission", "Hacking"]
        ],
        "Match the evidence: malware on files; deceptive email; flooded service; unauthorised access."
      )
    ]
  }),
  activity({
    id: "u3-w01-northbank-consequences",
    title: TITLES["u3-w01-northbank-consequences"],
    summary: "Link a Northbank incident to who is affected and why protection matters.",
    activityType: "Scenario analysis",
    group: "Northbank application",
    questions: qids("u3-w01-northbank-consequences", "q1"),
    blocks: [
      heading("u3-w01-northbank-consequences-title", TITLES["u3-w01-northbank-consequences"]),
      paragraph(
        "u3-w01-northbank-consequences-intro",
        "Protection is not only a technical idea. Patients, staff and the organisation can be harmed."
      ),
      mcq(
        "u3-w01-northbank-consequences",
        "q1",
        "If patient contact lists are copied without authorisation, who is most directly harmed?",
        [
          ["a", "Patients whose details were copied, and Northbank’s duty to protect them"],
          ["b", "Only a nearby café’s Wi-Fi customers"],
          ["c", "Only the printer manufacturer"],
          ["d", "Nobody, because contact lists are never personal data"]
        ],
        "a",
        "Contact lists are personal data. Patients and the organisation that holds the list are affected."
      ),
      shortResponse(
        "u3-w01-northbank-consequences",
        "write",
        "In two sentences, explain why Northbank must protect patient records. Name one CIA aim and one group who would be harmed if protection failed.",
        70,
        "Name an aim (confidentiality, integrity or availability) and who is harmed."
      )
    ]
  }),
  activity({
    id: "u3-w01-thm-prep",
    title: TITLES["u3-w01-thm-prep"],
    summary: "Prepare terminology for TryHackMe Principles of Security. Opening the room does not complete this activity.",
    activityType: "Practical preparation",
    group: "Practical consolidation",
    questions: qids("u3-w01-thm-prep", "p1", "p2"),
    blocks: [
      heading("u3-w01-thm-prep-title", TITLES["u3-w01-thm-prep"]),
      paragraph(
        "u3-w01-thm-prep-intro",
        "Session 1 includes TryHackMe Principles of Security. This hub does not recreate the room. Use these checks before you go in. Opening TryHackMe does not mark this activity complete."
      ),
      callout(
        "u3-w01-thm-prep-note",
        "Follow your tutor’s access instructions. Do not treat a room completion badge as Unit 3 evidence unless your tutor says so."
      ),
      mcq(
        "u3-w01-thm-prep",
        "p1",
        "Which three aims should you expect Principles of Security to use?",
        [
          ["a", "Confidentiality, integrity and availability"],
          ["b", "Speed, colour and font"],
          ["c", "Hacking, phishing and DoS only"],
          ["d", "Cisco module titles 1.1 to 1.3"]
        ],
        "a",
        "The room is preparation for CIA language already used in this session. Cisco Module 1 is directed study, not the TryHackMe room."
      ),
      mcq(
        "u3-w01-thm-prep",
        "p2",
        "What should you do if a room task is unclear?",
        [
          ["a", "Ask your tutor and keep using specification terms in your notes"],
          ["b", "Skip the rest of Week 1"],
          ["c", "Invent a new incident type name"],
          ["d", "Paste the room contents into this hub"]
        ],
        "a",
        "The hub must not copy the room. Ask your tutor and keep Unit 3 terminology accurate."
      )
    ]
  }),
  activity({
    id: "u3-w01-thm-retrieval",
    title: TITLES["u3-w01-thm-retrieval"],
    summary: "Retrieve CIA terminology after the Principles of Security practical.",
    activityType: "Retrieval",
    group: "Practical consolidation",
    questions: qids("u3-w01-thm-retrieval", "r1", "r2"),
    blocks: [
      heading("u3-w01-thm-retrieval-title", TITLES["u3-w01-thm-retrieval"]),
      paragraph(
        "u3-w01-thm-retrieval-intro",
        "After the room, check that you can still use Unit 3 names. Do not paste room walkthroughs here."
      ),
      mcq(
        "u3-w01-thm-retrieval",
        "r1",
        "If a principle is about stopping unauthorised viewing, which CIA aim is that?",
        [
          ["a", "Confidentiality"],
          ["b", "Availability"],
          ["c", "Integrity"],
          ["d", "Usability"]
        ],
        "a",
        "Unauthorised viewing maps to confidentiality."
      ),
      shortResponse(
        "u3-w01-thm-retrieval",
        "note",
        "Write one sentence linking a Principles of Security idea to Northbank. Name one CIA aim. Do not copy room text.",
        40,
        "One CIA aim plus a Northbank information example (records, booking, reception)."
      )
    ]
  }),
  activity({
    id: "u3-w01-session1-review",
    title: TITLES["u3-w01-session1-review"],
    summary: "Consolidate Session 1 and prepare directed independent study.",
    activityType: "Reflection",
    group: "Practical consolidation",
    questions: ["u3-w01-session1-review-note"],
    blocks: [
      heading("u3-w01-session1-review-title", TITLES["u3-w01-session1-review"]),
      paragraph(
        "u3-w01-session1-review-intro",
        "Directed independent study this week includes Cisco Introduction to Cybersecurity Module 1 topics 1.1–1.3, reading the Northbank briefing, listing three data holdings Northbank would least want to lose, and a half-page summary of one recent incident (incident type, aim compromised, who was affected, source). Those tasks are not all completed inside this activity."
      ),
      callout(
        "u3-w01-session1-review-cisco",
        "Cisco 1.1 The World of Cybersecurity, 1.2 Organizational Data and 1.3 What Was Taken stay on the Cisco platform. This hub does not embed that content."
      ),
      reflection(
        "u3-w01-session1-review",
        "note",
        "List: one CIA aim you can now explain; one of the six incident types you will revise; and the first directed-study task you will complete (Cisco 1.1–1.3, Northbank briefing, three data holdings, or the incident summary). Use specification terms.",
        "Saved. Bring this list to Session 2 retrieval."
      )
    ]
  }),
  activity({
    id: "u3-w01-retrieval-cia",
    title: TITLES["u3-w01-retrieval-cia"],
    summary: "Retrieve confidentiality, integrity and availability with a different format from the Session 2 quiz.",
    activityType: "Retrieval quiz",
    group: "Retrieval",
    questions: qids("u3-w01-retrieval-cia", "c1", "c2"),
    blocks: [
      heading("u3-w01-retrieval-cia-title", TITLES["u3-w01-retrieval-cia"]),
      paragraph("u3-w01-retrieval-cia-intro", "Warm up with CIA only. Keep the three aims distinct."),
      optionCards(
        "u3-w01-retrieval-cia",
        "c1",
        "Which aim is mainly about authorised viewing?",
        [
          ["a", "Confidentiality"],
          ["b", "Integrity"],
          ["c", "Availability"]
        ],
        "a",
        "Authorised viewing is confidentiality."
      ),
      optionCards(
        "u3-w01-retrieval-cia",
        "c2",
        "Which aim is mainly about authorised people being able to use a system when they need it?",
        [
          ["a", "Availability"],
          ["b", "Confidentiality"],
          ["c", "Integrity"]
        ],
        "a",
        "Use when needed is availability."
      )
    ]
  }),
  activity({
    id: "u3-w01-retrieval-incidents",
    title: TITLES["u3-w01-retrieval-incidents"],
    summary: "Retrieve the six specification incident types.",
    activityType: "Classification",
    group: "Retrieval",
    questions: qids("u3-w01-retrieval-incidents", "sort"),
    blocks: [
      heading("u3-w01-retrieval-incidents-title", TITLES["u3-w01-retrieval-incidents"]),
      classification(
        "u3-w01-retrieval-incidents",
        "sort",
        "Match each clue to an incident type.",
        SIX,
        [
          ["h", "Unauthorised access to a mailbox", "Hacking"],
          ["v", "Malware infects clinic files", "Virus"],
          ["d", "Booking site flooded", "Denial of service (DoS)"],
          ["p", "Fake IT email asks for a password", "Phishing"],
          ["i", "A credit account opened in a patient’s name", "Identity theft"],
          ["t", "Data captured as it is sent across a network", "Data interception and theft"]
        ],
        "Use the six specification names, not everyday substitutes."
      )
    ]
  }),
  activity({
    id: "u3-w01-retrieval-terms",
    title: TITLES["u3-w01-retrieval-terms"],
    summary: "Choose precise terminology instead of loose everyday language.",
    activityType: "Knowledge check",
    group: "Retrieval",
    questions: qids("u3-w01-retrieval-terms", "t1", "t2"),
    blocks: [
      heading("u3-w01-retrieval-terms-title", TITLES["u3-w01-retrieval-terms"]),
      paragraph(
        "u3-w01-retrieval-terms-intro",
        "Examination answers lose marks for vague words such as ‘hacked’ used for every incident."
      ),
      mcq(
        "u3-w01-retrieval-terms",
        "t1",
        "A learner writes: ‘The website got hacked so nobody could book.’ Which specification type is more accurate if the site was flooded?",
        [
          ["a", "Denial of service (DoS)"],
          ["b", "Phishing"],
          ["c", "Identity theft"],
          ["d", "Virus"]
        ],
        "a",
        "Flooding so nobody can book is DoS. ‘Hacked’ is too loose here."
      ),
      mcq(
        "u3-w01-retrieval-terms",
        "t2",
        "Which sentence uses specification language?",
        [
          ["a", "Confidentiality was compromised because an unauthorised person viewed patient records."],
          ["b", "The computers went a bit weird."],
          ["c", "Someone did a cyber."],
          ["d", "IT stuff happened."]
        ],
        "a",
        "Name the aim and the evidence. Avoid empty everyday phrases."
      )
    ]
  }),
  activity({
    id: "u3-w01-retrieval-tf",
    title: TITLES["u3-w01-retrieval-tf"],
    summary: "True or false retrieval on CIA, incidents and why data is protected.",
    activityType: "Retrieval quiz",
    group: "Retrieval",
    questions: qids("u3-w01-retrieval-tf", "t1", "t2", "t3"),
    blocks: [
      heading("u3-w01-retrieval-tf-title", TITLES["u3-w01-retrieval-tf"]),
      trueFalse(
        "u3-w01-retrieval-tf",
        "t1",
        "Integrity is mainly about keeping systems online.",
        "false",
        "Keeping systems usable is availability. Integrity is about information remaining accurate and unaltered without authorisation."
      ),
      trueFalse(
        "u3-w01-retrieval-tf",
        "t2",
        "Phishing is one of the six specification incident types.",
        "true",
        "Phishing is named in the specification list."
      ),
      trueFalse(
        "u3-w01-retrieval-tf",
        "t3",
        "Only state secrets need protection; personal clinic data does not.",
        "false",
        "Personal, organisational and state data all need protection. Patient records are personal data."
      )
    ]
  }),
  activity({
    id: "u3-w01-personal-data",
    title: TITLES["u3-w01-personal-data"],
    summary: "Explain why personal data must be protected.",
    activityType: "Knowledge check",
    group: "Why data must be protected",
    questions: qids("u3-w01-personal-data", "p1"),
    blocks: [
      heading("u3-w01-personal-data-title", TITLES["u3-w01-personal-data"]),
      paragraph(
        "u3-w01-personal-data-intro",
        "Personal data identifies a living person, such as a name with a health record or contact details."
      ),
      mcq(
        "u3-w01-personal-data",
        "p1",
        "Why must personal data be protected?",
        [
          ["a", "Because unauthorised use can harm the person and break trust"],
          ["b", "Because personal data is never stored digitally"],
          ["c", "Because only governments hold personal data"],
          ["d", "Because availability does not apply to people"]
        ],
        "a",
        "Personal data needs protection because people can be harmed and organisations lose trust if it is misused."
      ),
      shortResponse(
        "u3-w01-personal-data",
        "write",
        "Give one personal-data example from a health setting and name the CIA aim most clearly threatened if it is disclosed.",
        50,
        "Example plus confidentiality (typical for disclosure)."
      )
    ]
  }),
  activity({
    id: "u3-w01-organisational-data",
    title: TITLES["u3-w01-organisational-data"],
    summary: "Explain why organisational data must be protected.",
    activityType: "Knowledge check",
    group: "Why data must be protected",
    questions: qids("u3-w01-organisational-data", "o1"),
    blocks: [
      heading("u3-w01-organisational-data-title", TITLES["u3-w01-organisational-data"]),
      paragraph(
        "u3-w01-organisational-data-intro",
        "Organisational data includes information the organisation needs in order to operate, such as booking records, staff rotas or finance files."
      ),
      mcq(
        "u3-w01-organisational-data",
        "o1",
        "Which example is organisational data in the Northbank setting?",
        [
          ["a", "Clinic booking records needed to run appointments"],
          ["b", "A national defence plan"],
          ["c", "A patient’s childhood nickname used only at home"],
          ["d", "The weather forecast"]
        ],
        "a",
        "Booking records belong to how Northbank runs. National defence is state data. A home nickname is not a Northbank holding."
      )
    ]
  }),
  activity({
    id: "u3-w01-state-data",
    title: TITLES["u3-w01-state-data"],
    summary: "Explain why state data must be protected, including national security examples.",
    activityType: "Knowledge check",
    group: "Why data must be protected",
    questions: qids("u3-w01-state-data", "s1"),
    blocks: [
      heading("u3-w01-state-data-title", TITLES["u3-w01-state-data"]),
      paragraph(
        "u3-w01-state-data-intro",
        "State data is information held for government or national functions. A health partnership is not the state, but learners must still recognise why state data needs protection."
      ),
      mcq(
        "u3-w01-state-data",
        "s1",
        "Why must state data be protected?",
        [
          ["a", "Because compromise can harm national security and public services"],
          ["b", "Because state data is the same as a clinic poster"],
          ["c", "Because only phishing can affect the state"],
          ["d", "Because CIA aims do not apply outside health"]
        ],
        "a",
        "State data needs protection because public services and national security can be harmed. CIA aims still apply."
      )
    ]
  }),
  activity({
    id: "u3-w01-who-is-harmed",
    title: TITLES["u3-w01-who-is-harmed"],
    summary: "Identify who is harmed when protection fails.",
    activityType: "Classification",
    group: "Why data must be protected",
    questions: qids("u3-w01-who-is-harmed", "sort"),
    blocks: [
      heading("u3-w01-who-is-harmed-title", TITLES["u3-w01-who-is-harmed"]),
      classification(
        "u3-w01-who-is-harmed",
        "sort",
        "Who is most directly harmed?",
        ["Person", "Organisation", "State"],
        [
          ["p", "A patient’s contact details are published", "Person"],
          ["o", "Northbank cannot run clinics because booking is down", "Organisation"],
          ["s", "A government service is disrupted by a cyber incident", "State"]
        ],
        "Match the stakeholder to the harm described. One incident can affect more than one group in real life; classify the main harm in each statement."
      )
    ]
  }),
  activity({
    id: "u3-w01-cia-threatened",
    title: TITLES["u3-w01-cia-threatened"],
    summary: "Link protection failures to the CIA aim that is threatened.",
    activityType: "Knowledge check",
    group: "Why data must be protected",
    questions: qids("u3-w01-cia-threatened", "h1", "h2"),
    blocks: [
      heading("u3-w01-cia-threatened-title", TITLES["u3-w01-cia-threatened"]),
      mcq(
        "u3-w01-cia-threatened",
        "h1",
        "A finance file is changed so invoice amounts are wrong. Which aim is threatened?",
        [
          ["a", "Integrity"],
          ["b", "Confidentiality"],
          ["c", "Availability"],
          ["d", "Branding"]
        ],
        "a",
        "Unauthorised or incorrect change is integrity. Finance files are organisational data."
      ),
      mcq(
        "u3-w01-cia-threatened",
        "h2",
        "Health records are disclosed to people who should not see them. Which aim is threatened?",
        [
          ["a", "Confidentiality"],
          ["b", "Availability"],
          ["c", "Integrity"],
          ["d", "Typography"]
        ],
        "a",
        "Disclosure of health records is confidentiality. This is a personal-data example."
      )
    ]
  }),
  activity({
    id: "u3-w01-nb-data-holdings",
    title: TITLES["u3-w01-nb-data-holdings"],
    summary: "Classify Northbank holdings using only established facts.",
    activityType: "Classification",
    group: "Northbank application",
    questions: qids("u3-w01-nb-data-holdings", "sort"),
    blocks: [
      heading("u3-w01-nb-data-holdings-title", TITLES["u3-w01-nb-data-holdings"]),
      paragraph(
        "u3-w01-nb-data-holdings-intro",
        "Use the Northbank briefing facts already taught. Do not invent a data centre or extra clinics."
      ),
      classification(
        "u3-w01-nb-data-holdings",
        "sort",
        "What kind of data is this holding?",
        ["Personal", "Organisational"],
        [
          ["records", "Patient records", "Personal"],
          ["contacts", "Patient contact lists", "Personal"],
          ["booking", "Clinic booking records", "Organisational"],
          ["files", "Clinic files used to run the service", "Organisational"]
        ],
        "Records and contact lists identify people. Booking and clinic files are needed to operate the organisation, though they may also contain personal data — classify the main teaching point given in the label."
      )
    ]
  }),
  activity({
    id: "u3-w01-nb-stakeholders",
    title: TITLES["u3-w01-nb-stakeholders"],
    summary: "Name who is affected in a Northbank incident.",
    activityType: "Knowledge check",
    group: "Northbank application",
    questions: qids("u3-w01-nb-stakeholders", "s1"),
    blocks: [
      heading("u3-w01-nb-stakeholders-title", TITLES["u3-w01-nb-stakeholders"]),
      mcq(
        "u3-w01-nb-stakeholders",
        "s1",
        "Booking is unavailable for a morning. Who is affected?",
        [
          ["a", "Patients who cannot book, and staff who cannot run the clinic list"],
          ["b", "Only a neighbouring supermarket"],
          ["c", "Only the national census office"],
          ["d", "Nobody, because availability is optional"]
        ],
        "a",
        "Patients and Northbank staff are the stakeholders established in Week 1."
      )
    ]
  }),
  activity({
    id: "u3-w01-nb-consequences",
    title: TITLES["u3-w01-nb-consequences"],
    summary: "Connect a Northbank incident to CIA and consequence.",
    activityType: "Knowledge check",
    group: "Northbank application",
    questions: qids("u3-w01-nb-consequences", "c1"),
    blocks: [
      heading("u3-w01-nb-consequences-title", TITLES["u3-w01-nb-consequences"]),
      mcq(
        "u3-w01-nb-consequences",
        "c1",
        "A stolen clinic laptop still holds a patient contact list. What is the main consequence to explain?",
        [
          ["a", "Unauthorised people may view personal data, harming confidentiality and patient trust"],
          ["b", "The laptop colour no longer matches the brand"],
          ["c", "The cafeteria till is encrypted"],
          ["d", "State secrets are automatically published"]
        ],
        "a",
        "The established holding is a patient contact list. That is personal data and confidentiality."
      )
    ]
  }),
  activity({
    id: "u3-w01-nb-importance",
    title: TITLES["u3-w01-nb-importance"],
    summary: "Explain why protection matters for Northbank using a structured prompt.",
    activityType: "Short response",
    group: "Northbank application",
    questions: ["u3-w01-nb-importance-write"],
    blocks: [
      heading("u3-w01-nb-importance-title", TITLES["u3-w01-nb-importance"]),
      paragraph(
        "u3-w01-nb-importance-intro",
        "Sentence starters: Northbank must protect… because… The CIA aim is… The people affected are…"
      ),
      shortResponse(
        "u3-w01-nb-importance",
        "write",
        "Explain why Northbank must protect patient records. Name the data type (personal), one CIA aim, and who is harmed if protection fails.",
        80,
        "Personal data, a named CIA aim, and patients or the organisation."
      )
    ]
  }),
  activity({
    id: "u3-w01-identify-vs-describe",
    title: TITLES["u3-w01-identify-vs-describe"],
    summary: "Distinguish OCR command words identify, describe and explain.",
    activityType: "Exam skills",
    group: "OCR command words",
    questions: qids("u3-w01-identify-vs-describe", "c1", "c2"),
    blocks: [
      heading("u3-w01-identify-vs-describe-title", TITLES["u3-w01-identify-vs-describe"]),
      paragraph(
        "u3-w01-identify-vs-describe-intro",
        "Identify names. Describe says what it is like. Explain says how or why, with a reason."
      ),
      mcq(
        "u3-w01-identify-vs-describe",
        "c1",
        "A question says ‘Identify one CIA aim.’ What depth is enough?",
        [
          ["a", "Name the aim, for example confidentiality"],
          ["b", "Write a full paragraph with three worked Northbank stories"],
          ["c", "Ignore the command word and discuss malware"],
          ["d", "Give no answer because identify is not used in Unit 3"]
        ],
        "a",
        "Identify asks you to name. Extra stories may not earn more marks if the question only asks to identify."
      ),
      mcq(
        "u3-w01-identify-vs-describe",
        "c2",
        "A question says ‘Explain why availability matters for a booking system.’ What must the answer include?",
        [
          ["a", "A reason: how or why booking being usable matters"],
          ["b", "Only the word availability"],
          ["c", "A drawing of a server"],
          ["d", "A list of six incident types with no reason"]
        ],
        "a",
        "Explain needs a reason — how or why."
      )
    ]
  }),
  activity({
    id: "u3-w01-command-spot-weak",
    title: TITLES["u3-w01-command-spot-weak"],
    summary: "Spot answers that do not meet the command word.",
    activityType: "Error spotting",
    group: "OCR command words",
    questions: qids("u3-w01-command-spot-weak", "w1", "w2"),
    blocks: [
      heading("u3-w01-command-spot-weak-title", TITLES["u3-w01-command-spot-weak"]),
      mcq(
        "u3-w01-command-spot-weak",
        "w1",
        "Command word: identify. Learner answer: ‘Cyber security is important because lots of things can go wrong and people should be careful.’ What is the main problem?",
        [
          ["a", "It does not name a specific required item"],
          ["b", "It is too short to be English"],
          ["c", "It uses the word confidentiality too many times"],
          ["d", "It names six incident types"]
        ],
        "a",
        "Identify needs a named item. A vague paragraph does not identify."
      ),
      mcq(
        "u3-w01-command-spot-weak",
        "w2",
        "Command word: explain. Learner answer: ‘Confidentiality.’ What is the main problem?",
        [
          ["a", "It identifies but does not explain how or why"],
          ["b", "Confidentiality is not a Unit 3 term"],
          ["c", "The answer is too technical"],
          ["d", "It lists too many incident types"]
        ],
        "a",
        "A single term can identify. Explain needs a reason."
      )
    ]
  }),
  activity({
    id: "u3-w01-command-improve",
    title: TITLES["u3-w01-command-improve"],
    summary: "Choose an improved answer that matches the command word.",
    activityType: "Answer improvement",
    group: "OCR command words",
    questions: qids("u3-w01-command-improve", "i1"),
    blocks: [
      heading("u3-w01-command-improve-title", TITLES["u3-w01-command-improve"]),
      mcq(
        "u3-w01-command-improve",
        "i1",
        "Question: Explain why confidentiality matters for patient records. Which improved answer meets the command word?",
        [
          ["a", "Confidentiality matters because only authorised people should view patient records; if records are disclosed, patients can be harmed and trust is lost."],
          ["b", "Confidentiality."],
          ["c", "There are six incident types."],
          ["d", "Booking websites should be fast."]
        ],
        "a",
        "Explain needs a named aim and a reason linked to patient records."
      )
    ]
  }),
  activity({
    id: "u3-w01-marks-depth",
    title: TITLES["u3-w01-marks-depth"],
    summary: "Match 1, 2 and 4 mark questions to the depth they need.",
    activityType: "Exam skills",
    group: "Mark allocation",
    questions: qids("u3-w01-marks-depth", "m1", "m2"),
    blocks: [
      heading("u3-w01-marks-depth-title", TITLES["u3-w01-marks-depth"]),
      paragraph(
        "u3-w01-marks-depth-intro",
        "Mark allocation signals depth. One mark often matches identify. More marks usually need description or explanation with reasons."
      ),
      mcq(
        "u3-w01-marks-depth",
        "m1",
        "Which response depth best matches a 1-mark identify question?",
        [
          ["a", "Name the required term"],
          ["b", "Write a half-page with three worked examples"],
          ["c", "Ignore the question and discuss Cisco"],
          ["d", "List every CIA aim and every incident type"]
        ],
        "a",
        "One mark for identify is earned by naming. Extra pages may waste time."
      ),
      mcq(
        "u3-w01-marks-depth",
        "m2",
        "A 4-mark explain question usually needs:",
        [
          ["a", "Linked reasons or developed points, not a single word"],
          ["b", "Only a tick"],
          ["c", "A screenshot of TryHackMe"],
          ["d", "The same one-word answer as a 1-mark identify"]
        ],
        "a",
        "More marks need more developed explanation."
      )
    ]
  }),
  activity({
    id: "u3-w01-marks-earned",
    title: TITLES["u3-w01-marks-earned"],
    summary: "Decide where marks were earned in a short sample answer.",
    activityType: "Exam skills",
    group: "Mark allocation",
    questions: qids("u3-w01-marks-earned", "e1"),
    blocks: [
      heading("u3-w01-marks-earned-title", TITLES["u3-w01-marks-earned"]),
      paragraph(
        "u3-w01-marks-earned-intro",
        "Question (2 marks): Describe confidentiality. Sample: ‘Confidentiality means only authorised people can view information, for example patient records.’"
      ),
      mcq(
        "u3-w01-marks-earned",
        "e1",
        "Where were marks earned?",
        [
          ["a", "The term is named and what it means is stated with a suitable example"],
          ["b", "Only because the word patient appears"],
          ["c", "Only because the answer is long"],
          ["d", "No marks, because describe is not used in Unit 3"]
        ],
        "a",
        "Describe needs what the term means. A clear meaning plus an example is the right depth for a short describe."
      )
    ]
  }),
  activity({
    id: "u3-w01-marks-missing",
    title: TITLES["u3-w01-marks-missing"],
    summary: "Identify what is missing for the remaining marks.",
    activityType: "Exam skills",
    group: "Mark allocation",
    questions: qids("u3-w01-marks-missing", "m1"),
    blocks: [
      heading("u3-w01-marks-missing-title", TITLES["u3-w01-marks-missing"]),
      paragraph(
        "u3-w01-marks-missing-intro",
        "Question (4 marks): Explain why Northbank must protect patient records. Sample: ‘Patient records are important.’"
      ),
      mcq(
        "u3-w01-marks-missing",
        "m1",
        "What is missing for the marks?",
        [
          ["a", "A CIA aim, a reason, and who is harmed"],
          ["b", "A list of Cisco module codes"],
          ["c", "A TryHackMe room ID"],
          ["d", "The colour of the Northbank logo"]
        ],
        "a",
        "Explain at this mark depth needs reasons: the aim, why records matter, and consequence for people or the organisation."
      )
    ]
  }),
  activity({
    id: "u3-w01-ocr-recognise",
    title: TITLES["u3-w01-ocr-recognise"],
    summary: "Recognise a correct-style answer before writing independently.",
    activityType: "Exam skills",
    group: "OCR-style practice",
    questions: qids("u3-w01-ocr-recognise", "r1"),
    blocks: [
      heading("u3-w01-ocr-recognise-title", TITLES["u3-w01-ocr-recognise"]),
      paragraph(
        "u3-w01-ocr-recognise-intro",
        "These are OCR-style practice questions, not live examination questions."
      ),
      mcq(
        "u3-w01-ocr-recognise",
        "r1",
        "Identify one type of cyber security incident. Which answer would earn the identify mark?",
        [
          ["a", "Phishing"],
          ["b", "Computers can be annoying"],
          ["c", "Everything is cyber"],
          ["d", "Northbank has a booking website"]
        ],
        "a",
        "Identify is earned by naming a specification incident type."
      )
    ]
  }),
  activity({
    id: "u3-w01-ocr-evidence",
    title: TITLES["u3-w01-ocr-evidence"],
    summary: "Select the evidence a describe or explain question needs.",
    activityType: "Exam skills",
    group: "OCR-style practice",
    questions: qids("u3-w01-ocr-evidence", "e1"),
    blocks: [
      heading("u3-w01-ocr-evidence-title", TITLES["u3-w01-ocr-evidence"]),
      mcq(
        "u3-w01-ocr-evidence",
        "e1",
        "Question: Describe phishing. Which evidence belongs in the answer?",
        [
          ["a", "It is a deceptive message that tricks a person into giving information or access"],
          ["b", "It is the same as denial of service"],
          ["c", "It is a CIA aim"],
          ["d", "It is a Cisco module name"]
        ],
        "a",
        "Describe phishing by saying what it is: deception aimed at a person."
      )
    ]
  }),
  activity({
    id: "u3-w01-ocr-select-better",
    title: TITLES["u3-w01-ocr-select-better"],
    summary: "Select an improved answer before writing independently.",
    activityType: "Exam skills",
    group: "OCR-style practice",
    questions: qids("u3-w01-ocr-select-better", "b1"),
    blocks: [
      heading("u3-w01-ocr-select-better-title", TITLES["u3-w01-ocr-select-better"]),
      mcq(
        "u3-w01-ocr-select-better",
        "b1",
        "Explain how a phishing incident could affect confidentiality at Northbank. Which answer is stronger?",
        [
          ["a", "A deceptive email could trick reception into giving a password, so an unauthorised person could view patient or staff information, compromising confidentiality."],
          ["b", "Phishing is bad."],
          ["c", "Availability is when systems work."],
          ["d", "There are six types."]
        ],
        "a",
        "The stronger answer names phishing, the mechanism, Northbank, and confidentiality."
      )
    ]
  }),
  activity({
    id: "u3-w01-weak-answer-spot",
    title: TITLES["u3-w01-weak-answer-spot"],
    summary: "Find missing marks in a weak sample before peer marking.",
    activityType: "Peer marking",
    group: "Peer marking and improvement",
    questions: qids("u3-w01-weak-answer-spot", "w1"),
    blocks: [
      heading("u3-w01-weak-answer-spot-title", TITLES["u3-w01-weak-answer-spot"]),
      paragraph(
        "u3-w01-weak-answer-spot-intro",
        "Question (6 marks): Explain how a phishing attack could lead to a cyber security incident at Northbank. Refer to confidentiality. Weak sample: ‘Emails can be dangerous and Northbank should be careful.’"
      ),
      mcq(
        "u3-w01-weak-answer-spot",
        "w1",
        "Which marks are missing?",
        [
          ["a", "Incident type named as phishing, a mechanism, Northbank application, and confidentiality with a reason"],
          ["b", "A drawing"],
          ["c", "A Cisco screenshot"],
          ["d", "The word availability used six times"]
        ],
        "a",
        "The weak sample never names phishing, never explains the mechanism, and never uses confidentiality with a reason."
      )
    ]
  }),
  activity({
    id: "u3-w01-improvement-action",
    title: TITLES["u3-w01-improvement-action"],
    summary: "Record one specific improvement action after peer marking.",
    activityType: "Reflection",
    group: "Peer marking and improvement",
    questions: ["u3-w01-improvement-action-note"],
    blocks: [
      heading("u3-w01-improvement-action-title", TITLES["u3-w01-improvement-action"]),
      paragraph(
        "u3-w01-improvement-action-intro",
        "After the existing Peer Marking and Answer Improvement activity, write one action you will use on the next OCR-style question."
      ),
      reflection(
        "u3-w01-improvement-action",
        "note",
        "Write one specific improvement action. Example stems: I will name the command word first… I will include a CIA aim and a reason… I will apply the point to Northbank by…",
        "Saved. Use this on the next written question."
      )
    ]
  })
];

function writeJson(file, value) {
  writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

for (const item of NEW_ACTIVITIES) {
  // Learner packages have no package.questions documents. T Level keeps this
  // array empty so learner-safe validation does not report MISSING_REFERENCE.
  item.relationships.questions = [];
}

const activitiesPath = join(contentDir, "activities.json");
const sessionsPath = join(contentDir, "sessions.json");
const packagePath = join(contentDir, "package.json");

const activities = JSON.parse(readFileSync(activitiesPath, "utf8"));
const byId = new Map(activities.map((item) => [item.id, item]));

for (const item of NEW_ACTIVITIES) {
  if (EXISTING_IDS.has(item.id)) {
    throw new Error(`refusing to overwrite existing activity ${item.id}`);
  }
  byId.set(item.id, item);
}

const week1Existing = activities.filter((item) => String(item.id).startsWith("u3-w01-"));
const others = activities.filter((item) => !String(item.id).startsWith("u3-w01-"));
const orderedWeek1 = [...SESSION_1_IDS, ...SESSION_2_IDS].map((id) => {
  const item = byId.get(id);
  if (!item) throw new Error(`missing activity ${id}`);
  return item;
});
const nextActivities = [...orderedWeek1, ...others];
writeJson(activitiesPath, nextActivities);

const sessions = JSON.parse(readFileSync(sessionsPath, "utf8"));
for (const session of sessions) {
  if (session.id === "week-1-session-1") session.relationships.activities = SESSION_1_IDS.slice();
  if (session.id === "week-1-session-2") session.relationships.activities = SESSION_2_IDS.slice();
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
  activities: nextActivities
};
writeJson(packagePath, pkg);

for (const [id, slug] of Object.entries(SLUGS)) {
  if (EXISTING_IDS.has(id)) continue;
  const dir = join(root, "week-1", slug);
  mkdirSync(dir, { recursive: true });
  const title = TITLES[id] || id;
  writeFileSync(
    join(dir, "index.html"),
    `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${title}">
  <meta name="theme-color" content="#0b1f33">
  <link rel="icon" href="data:,">
  <title>${title} | Week 1</title>
  <script src="../../js/core/theme-bootstrap.js?v=2"></script>
</head>
<body data-page="week-1-${slug}" data-section="week-1" data-root="../.." data-view="activity" data-week="1" data-activity="${slug}">
  <noscript><p>JavaScript is required for the Unit 3 Cyber Security Hub.</p></noscript>
  <div id="root"></div>
  <template id="unit3-page-body"></template>
  <script type="module" src="../../src/main.tsx"></script>
</body>
</html>
`
  );
}

console.log("week1 existing preserved", week1Existing.map((item) => item.id).join(", "));
console.log("session1", SESSION_1_IDS.length);
console.log("session2", SESSION_2_IDS.length);
console.log("new activities", NEW_ACTIVITIES.length);
console.log("package activities", pkg.activities.length);
