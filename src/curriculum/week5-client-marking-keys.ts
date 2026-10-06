/**
 * Question keys mark_formative_response receives for Week 5 catalogue blocks.
 * Classification checks send the item id, not the parent block alias.
 * Other checks send the source question id after the Unit 3 alias table.
 * This must stay aligned with js/core/question-key-aliases.js and
 * resolveFormativeRpcQuestionId.
 */

export type Week5MarkingMode =
  | "single-choice"
  | "classification"
  | "ordering-exact"
  | "completion"
  | "requires_review";

export type Week5PackageQuestion = {
  activityId: string;
  blockId: string;
  stableKey: string;
  mode: Week5MarkingMode;
  correctOptionId?: string;
  correctCategoryId?: string;
  correctOrder?: string[];
  hasAuthoredFeedback: boolean;
};

type AliasTable = Record<string, string>;

const WEEK5_ALIASES: Record<string, AliasTable> = {
  "week5-impacts-learning": {
    k1: "K1",
    k2: "K2",
    k3: "K3",
    k4: "K4",
    k5: "K5",
    k6: "K6",
    k7: "K7",
    k8: "K8",
    k9: "K9"
  },
  "week5-ocr-question-practice": {
    "ocr-1": "OCR1",
    "ocr-2": "OCR2",
    "ocr-3": "OCR3",
    "ocr-4": "OCR4",
    "ocr-5": "OCR5",
    "ocr-6": "OCR6",
    "ocr-7": "OCR7",
    "ocr-8": "OCR8"
  },
  "week5-exercise-debrief": {
    timescale: "DB1",
    "impact-chain": "DB2",
    "follow-on": "DB3"
  },
  "week5-ransomware-companion": {
    spot: "RC1",
    "spot-justify": "RC2",
    chain: "RC3",
    "chain-link": "RC4"
  }
};

export const WEEK5_REVISED_ACTIVITY_IDS = [
  "week5-exercise-debrief",
  "week5-impact-classification",
  "week5-impacts-learning",
  "week5-ocr-question-practice",
  "week5-ransomware-companion",
  "week5-secure-rewrite",
  "week5-session1-retrieval",
  "week5-session2-retrieval",
  "week5-threat-vulnerability-risk",
  "week5-vulnerability-patterns"
] as const;

const SCORED_TYPES = new Set([
  "single-choice",
  "classification",
  "ordering",
  "sequence",
  "short-response"
]);

type BlockContent = {
  questionId?: string;
  sourceQuestionId?: string;
  correctOptionId?: string;
  correctOrder?: string[];
  feedback?: unknown;
  options?: unknown[];
  items?: Array<{
    id?: string;
    correctCategoryId?: string;
    explanation?: string;
    feedback?: unknown;
  }>;
};

type ActivityBlock = {
  id?: string;
  type?: string;
  content?: BlockContent;
};

export type Week5ActivitySource = {
  id?: string;
  version?: string;
  blocks?: ActivityBlock[];
};

export function normaliseWeek5QuestionKey(activityId: string, questionId: string): string {
  const raw = String(questionId || "").trim();
  if (!raw) return "";
  const table = WEEK5_ALIASES[activityId] || {};
  if (Object.prototype.hasOwnProperty.call(table, raw)) return table[raw];
  const lower = raw.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(table, lower)) return table[lower];
  const upper = raw.toUpperCase();
  for (const canonical of Object.values(table)) {
    if (canonical.toUpperCase() === upper) return canonical;
  }
  return upper;
}

function sourceId(block: ActivityBlock): string {
  const content = block.content || {};
  const source = String(content.sourceQuestionId || "").trim();
  if (source) return source;
  const hosted = String(content.questionId || block.id || "").trim();
  const colon = hosted.indexOf(":");
  return colon >= 0 ? hosted.slice(colon + 1) : hosted;
}

export function collectWeek5PackageQuestions(
  activities: readonly Week5ActivitySource[]
): Week5PackageQuestion[] {
  const questions: Week5PackageQuestion[] = [];
  for (const activity of activities) {
    const activityId = String(activity.id || "");
    if (!WEEK5_REVISED_ACTIVITY_IDS.includes(activityId as (typeof WEEK5_REVISED_ACTIVITY_IDS)[number])) {
      continue;
    }
    for (const block of activity.blocks || []) {
      const type = String(block.type || "");
      if (!SCORED_TYPES.has(type)) continue;
      const content = block.content || {};
      const blockId = String(block.id || "");
      if (type === "classification") {
        for (const item of content.items || []) {
          const itemId = String(item.id || "").trim();
          questions.push({
            activityId,
            blockId,
            stableKey: normaliseWeek5QuestionKey(activityId, itemId),
            mode: item.correctCategoryId ? "classification" : "completion",
            correctCategoryId: item.correctCategoryId || undefined,
            hasAuthoredFeedback: Boolean(item.explanation || item.feedback || content.feedback)
          });
        }
        continue;
      }
      const stableKey = normaliseWeek5QuestionKey(activityId, sourceId(block));
      if (type === "ordering" || type === "sequence") {
        questions.push({
          activityId,
          blockId,
          stableKey,
          mode: Array.isArray(content.correctOrder) && content.correctOrder.length > 0
            ? "ordering-exact"
            : "completion",
          correctOrder: content.correctOrder,
          hasAuthoredFeedback: Boolean(content.feedback)
        });
        continue;
      }
      if (type === "single-choice") {
        const optionCount = Array.isArray(content.options) ? content.options.length : 0;
        const correctOptionId = String(content.correctOptionId || "").trim();
        if (optionCount > 0 && correctOptionId) {
          questions.push({
            activityId,
            blockId,
            stableKey,
            mode: "single-choice",
            correctOptionId,
            hasAuthoredFeedback: Boolean(content.feedback)
          });
        } else {
          questions.push({
            activityId,
            blockId,
            stableKey,
            mode: "requires_review",
            hasAuthoredFeedback: Boolean(content.feedback)
          });
        }
        continue;
      }
      questions.push({
        activityId,
        blockId,
        stableKey,
        mode: "completion",
        hasAuthoredFeedback: Boolean(content.feedback)
      });
    }
  }
  return questions;
}

export type ServerMarkingRegistration = {
  activityId: string;
  serverVersion: string;
  stableKey: string;
  mode: Week5MarkingMode;
  correctOptionId?: string;
  correctCategoryId?: string;
  correctOrder?: string[];
};

export function missingServerMarkingKeys(
  packageQuestions: readonly Week5PackageQuestion[],
  registry: readonly ServerMarkingRegistration[]
): string[] {
  const missing: string[] = [];
  for (const question of packageQuestions) {
    const registered = registry.find((row) =>
      row.activityId === question.activityId && row.stableKey === question.stableKey
    );
    if (!registered) {
      missing.push(`${question.activityId} ${question.stableKey}`);
      continue;
    }
    if (registered.mode !== question.mode) {
      missing.push(`${question.activityId} ${question.stableKey} mode ${question.mode}`);
      continue;
    }
    if (
      question.mode === "single-choice"
      && registered.correctOptionId !== question.correctOptionId
    ) {
      missing.push(`${question.activityId} ${question.stableKey} answer`);
    }
    if (
      question.mode === "classification"
      && registered.correctCategoryId !== question.correctCategoryId
    ) {
      missing.push(`${question.activityId} ${question.stableKey} answer`);
    }
    if (
      question.mode === "ordering-exact"
      && JSON.stringify(registered.correctOrder || []) !== JSON.stringify(question.correctOrder || [])
    ) {
      missing.push(`${question.activityId} ${question.stableKey} answer`);
    }
  }
  return missing;
}
