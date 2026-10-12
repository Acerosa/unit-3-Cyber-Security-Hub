/**
 * Overlay Week 6 host data objects onto content package remainder JSON
 * and matching catalogue blocks, then rebuild package.json from split files.
 *
 * Run: node scripts/sync-week6-package-from-data.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content/unit-3-cyber-security");

const WEEK6_SOURCES = [
  ["lo2-diagnostic.js", "Week6Lo2Diagnostic"],
  ["ethical-learning.js", "Week6EthicalLearning"],
  ["ethical-classification.js", "Week6EthicalClassification"],
  ["legislation-learning.js", "Week6LegislationLearning"],
  ["legislation-matching.js", "Week6LegislationMatching"],
  ["operational-considerations.js", "Week6OperationalConsiderations"],
  ["government-initiatives.js", "Week6GovernmentInitiatives"],
  ["ncsc-guidance.js", "Week6NcscGuidance"],
  ["exercise-decision-record.js", "Week6ExerciseDecisionRecord"],
  ["session1-review.js", "Week6Session1Review"],
  ["legislation-retrieval.js", "Week6LegislationRetrieval"],
  ["employee-monitoring.js", "Week6EmployeeMonitoring"],
  ["stakeholder-debate.js", "Week6StakeholderDebate"],
  ["discuss-learning.js", "Week6DiscussLearning"],
  ["discuss-planner.js", "Week6DiscussPlanner"],
  ["ocr-practice.js", "Week6OcrPractice"],
  ["answer-improvement.js", "Week6AnswerImprovement"],
  ["revision-organiser.js", "Week6RevisionOrganiser"],
  ["directed-study.js", "Week6DirectedStudy"],
  ["support-challenge.js", "Week6SupportChallenge"]
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadWeek6Data() {
  const context = vm.createContext({ window: {}, globalThis: {} });
  for (const [file] of WEEK6_SOURCES) {
    const source = readFileSync(join(root, "week-6/data", file), "utf8");
    vm.runInContext(source, context, { filename: file });
  }
  const byActivityId = new Map();
  for (const [, globalName] of WEEK6_SOURCES) {
    const data = clone(context.window[globalName] || context[globalName]);
    if (data?.activityId || data?.resourceId) {
      byActivityId.set(data.activityId || data.resourceId, data);
    }
  }
  return byActivityId;
}

function overlayRemainder(existing, data) {
  const next = clone(existing);
  for (const key of Object.keys(next)) {
    if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
      next[key] = clone(data[key]);
    }
  }
  return next;
}

function questionLists(data) {
  return []
    .concat(data.questions || [])
    .concat(data.knowledgeCheck || [])
    .concat(data.knowledgeChecks || [])
    .concat(data.comparisonQuiz || [])
    .concat((data.sections || []).flatMap((section) => (section.check ? [section.check] : [])));
}

function optionLabel(option, index) {
  if (typeof option === "string") return option;
  return option.text || option.label || String.fromCharCode(97 + index);
}

function updateBlocks(activity, data) {
  const questions = questionLists(data);
  const questionsById = new Map(questions.map((item) => [item.id, item]));
  const classificationItems = new Map((data.items || []).map((item) => [item.id, item]));
  const sectionTitles = new Map((data.sections || []).map((item) => [item.id, item.title]));

  for (const block of activity.blocks || []) {
    const content = block.content || {};
    if (block.id === `${activity.id}-source-remainder`) {
      const match = String(content.text || "").match(/```json\n([\s\S]*?)\n```/);
      if (!match) continue;
      const remainder = overlayRemainder(JSON.parse(match[1]), data);
      content.text = "```json\n" + JSON.stringify(remainder, null, 2) + "\n```";
      continue;
    }
    if (block.type === "heading" && content.level === 3) {
      const sectionId = String(block.id || "").replace(`${activity.id}-`, "").replace(/-h$/, "");
      if (sectionTitles.has(sectionId)) content.text = sectionTitles.get(sectionId);
      continue;
    }
    if (block.type === "classification" && Array.isArray(content.items)) {
      for (const item of content.items) {
        const source = classificationItems.get(item.id);
        if (!source) continue;
        item.text = source.statement || source.text || item.text;
        item.explanation = source.feedback || source.explanation || item.explanation;
      }
      continue;
    }
    const sourceId = content.sourceQuestionId;
    const source = questionsById.get(sourceId);
    if (!source) continue;
    if (source.prompt) content.prompt = source.prompt;
    if (Array.isArray(source.options) && Array.isArray(content.options) && content.options.length) {
      content.options = source.options.map((option, index) => ({
        id: content.options[index]?.id || String.fromCharCode(97 + index),
        label: optionLabel(option, index)
      }));
    }
    if (source.explanation) {
      content.feedback = {
        correct: source.explanation,
        incorrect: source.explanation
      };
    }
  }
}

const dataById = loadWeek6Data();
const activitiesPath = join(contentDir, "activities.json");
const activities = JSON.parse(readFileSync(activitiesPath, "utf8"));
let updated = 0;
for (const activity of activities) {
  if (!String(activity.id).startsWith("week6-")) continue;
  const data = dataById.get(activity.id);
  if (!data) continue;
  updateBlocks(activity, data);
  updated += 1;
}
writeFileSync(activitiesPath, JSON.stringify(activities, null, 2) + "\n");

const sessions = JSON.parse(readFileSync(join(contentDir, "sessions.json"), "utf8"));
const pkg = {
  schema: "lp.content.package",
  schemaVersion: "0.1.0",
  id: "unit-3-cyber-security-content",
  version: JSON.parse(readFileSync(join(contentDir, "package.json"), "utf8")).version,
  hub: JSON.parse(readFileSync(join(contentDir, "hub.json"), "utf8")),
  curriculum: JSON.parse(readFileSync(join(contentDir, "curriculum.json"), "utf8")),
  learningOutcomes: JSON.parse(readFileSync(join(contentDir, "learning-outcomes.json"), "utf8")),
  assignments: JSON.parse(readFileSync(join(contentDir, "assignments.json"), "utf8")),
  weeks: JSON.parse(readFileSync(join(contentDir, "weeks.json"), "utf8")),
  sessions,
  activities
};
writeFileSync(join(contentDir, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
console.log("synced Week 6 activities", updated);
