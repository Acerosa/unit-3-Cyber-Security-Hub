import {
  isCatalogueReactType,
  questionIdFor,
  type ActivityBlockDocument,
  type ActivityDocument,
  type ActivityResult,
  type ActivityScore
} from "@learning-platform/ui";
import type { ContentPackage, WeekPageModel } from "../curriculum/from-package";

export const CATALOGUE_WEEKS = [1, 2, 3, 4, 5, 6, 7];

export function isCatalogueWeek(week: number): boolean {
  return CATALOGUE_WEEKS.includes(week);
}

export const CATALOGUE_PROGRESS_SCRIPTS: Record<number, string[]> = {
  2: ["js/week2-progress.js", "js/core/backend-progress.js"],
  3: ["js/week3-progress.js", "js/core/backend-progress.js"],
  4: ["js/week4-progress.js", "js/core/backend-progress.js"],
  5: ["js/week5-progress.js", "js/core/backend-progress.js"],
  6: ["js/week6-progress.js", "js/core/backend-progress.js"],
  7: ["js/week7-progress.js", "js/core/backend-progress.js"]
};

/**
 * Existing activity folders — not new routes.
 * Keys are package activity ids; values are `week-N/<slug>/` folder names.
 */
export const WEEK_ACTIVITY_SLUGS: Record<number, Record<string, string>> = {
  1: {
    "u3-w01-baseline": "baseline",
    "u3-w01-cia": "cia",
    "u3-w01-incidents": "incidents",
    "u3-w01-glossary": "glossary",
    "u3-w01-retrieval": "retrieval-quiz",
    "u3-w01-command-words": "command-words",
    "u3-w01-ocr-practice": "ocr-practice",
    "u3-w01-peer-improvement": "peer-improvement"
  },
  2: {
    "week2-session1-retrieval": "session1-retrieval",
    "week2-threat-vulnerability-learning": "threat-vulnerability-learning",
    "week2-malware-symptoms": "malware-symptoms",
    "week2-threat-vulnerability-sort": "threat-vulnerability-sort",
    "week2-vulnerabilities101-reflection": "vulnerabilities101",
    "week2-session2-retrieval": "session2-retrieval",
    "week2-northbank-vulnerability-analysis": "northbank-analysis",
    "week2-six-mark-response-guide": "six-mark-guide",
    "week2-ocr-question-practice": "ocr-practice",
    "week2-peer-marking-answer-improvement": "peer-marking",
    "week2-northbank-vulnerability-register": "vulnerability-register"
  },
  3: {
    "week3-session1-retrieval": "session1-retrieval",
    "week3-attacker-types-learning": "attacker-types-learning",
    "week3-attacker-case-matching": "attacker-case-matching",
    "week3-justified-identification": "justified-identification",
    "week3-session2-retrieval": "session2-retrieval",
    "week3-ocr-question-practice": "ocr-practice",
    "week3-peer-marking": "peer-marking"
  },
  4: {
    "week4-session1-retrieval": "session1-retrieval",
    "week4-motivations-learning": "motivations-learning",
    "week4-targets-methods": "targets-methods",
    "week4-northbank-exposure": "northbank-exposure",
    "week4-session2-retrieval": "session2-retrieval",
    "week4-mtm-mapping": "mtm-mapping",
    "week4-analyse-practice": "analyse-practice",
    "week4-ocr-question-practice": "ocr-practice",
    "week4-answer-improvement": "answer-improvement",
    "week4-ethical-review": "ethical-review"
  },
  5: {
    "week5-session1-retrieval": "session1-retrieval",
    "week5-impacts-learning": "impacts-learning",
    "week5-impact-classification": "impact-classification",
    "week5-ransomware-companion": "ransomware-companion",
    "week5-exercise-debrief": "exercise-debrief",
    "week5-session2-retrieval": "session2-retrieval",
    "week5-stakeholder-grid": "stakeholder-grid",
    "week5-impact-analysis": "impact-analysis",
    "week5-ocr-question-practice": "ocr-practice",
    "week5-answer-improvement": "answer-improvement"
  },
  6: {
    "week6-lo2-diagnostic": "lo2-diagnostic",
    "week6-ethical-learning": "ethical-learning",
    "week6-ethical-classification": "ethical-classification",
    "week6-legislation-learning": "legislation-learning",
    "week6-legislation-matching": "legislation-matching",
    "week6-operational-considerations": "operational-considerations",
    "week6-government-initiatives": "government-initiatives",
    "week6-ncsc-guidance": "ncsc-guidance",
    "week6-exercise-decision-record": "exercise-decision-record",
    "week6-session1-review": "session1-review",
    "week6-legislation-retrieval": "legislation-retrieval",
    "week6-employee-monitoring": "employee-monitoring",
    "week6-stakeholder-debate": "stakeholder-debate",
    "week6-discuss-learning": "discuss-learning",
    "week6-discuss-planner": "discuss-planner",
    "week6-ocr-question-practice": "ocr-practice",
    "week6-answer-improvement": "answer-improvement",
    "week6-revision-organiser": "revision-organiser"
  },
  7: {
    "week7-session1-retrieval": "session1-retrieval",
    "week7-risk-management-learning": "risk-management-learning",
    "week7-northbank-risk-register": "risk-register",
    "week7-testing-methods": "testing-methods",
    "week7-sandbox-observation": "sandbox-observation",
    "week7-detection-prevention": "detection-prevention",
    "week7-heightened-threat": "heightened-threat",
    "week7-session2-retrieval": "session2-retrieval",
    "week7-testing-matching": "testing-matching",
    "week7-recommendation-practice": "recommendation-practice",
    "week7-ocr-question-practice": "ocr-practice",
    "week7-answer-improvement": "answer-improvement"
  }
};

export type CatalogueSequenceItem = {
  id: string;
  title: string;
  slug: string;
};

export function slugForCatalogueActivity(week: number, activityId: string): string {
  return WEEK_ACTIVITY_SLUGS[week]?.[activityId] || activityId.replace(new RegExp(`^week${week}-`), "");
}

export function catalogueActivityIdFromSlug(week: number, slug: string | undefined): string | null {
  if (!slug) return null;
  const match = Object.entries(WEEK_ACTIVITY_SLUGS[week] || {}).find(([, value]) => value === slug);
  if (match) return match[0];
  if (week === 1 && /^u3-w01-/i.test(slug)) return slug.toLowerCase();
  return `week${week}-${slug}`;
}

/** Resolve package activity id from Week 1 Apps Script / query ids (U3-W01-*). */
export function catalogueActivityIdFromLegacyId(activityId: string | undefined): string | null {
  if (!activityId) return null;
  const normalised = activityId.trim().toLowerCase().replace(/_/g, "-");
  if (WEEK_ACTIVITY_SLUGS[1]?.[normalised]) return normalised;
  return null;
}

export function catalogueSequence(model: WeekPageModel | null, week: number): CatalogueSequenceItem[] {
  if (!model) return [];
  return model.sessions.flatMap((session) =>
    session.activities.map((item) => ({
      id: item.id,
      title: item.title,
      slug: slugForCatalogueActivity(week, item.id)
    }))
  );
}

export function neighboursInSequence(sequence: CatalogueSequenceItem[], activityId: string | null) {
  const index = sequence.findIndex((item) => item.id === activityId);
  return {
    previous: index > 0 ? sequence[index - 1] : null,
    next: index >= 0 && index < sequence.length - 1 ? sequence[index + 1] : null
  };
}

/** TryHackMe / external room: keep the practical shell and add catalogue reflection. */
export const WEEK_HYBRID_ACTIVITY_IDS: Record<number, string[]> = {
  2: ["week2-vulnerabilities101-reflection"]
};

/**
 * Practical engines the package only stubs — keep the existing activity UI.
 * Expand carefully per week; OCR shells, peer-marking, multi-field registers.
 */
export const WEEK_HOST_ACTIVITY_IDS: Record<number, string[]> = {
  2: [
    "week2-northbank-vulnerability-analysis",
    "week2-ocr-question-practice",
    "week2-peer-marking-answer-improvement",
    "week2-northbank-vulnerability-register"
  ],
  3: ["week3-ocr-question-practice", "week3-peer-marking"],
  4: [
    "week4-ocr-question-practice",
    "week4-answer-improvement",
    "week4-mtm-mapping",
    "week4-northbank-exposure",
    "week4-analyse-practice"
  ],
  5: [
    "week5-ocr-question-practice",
    "week5-answer-improvement",
    "week5-ransomware-companion",
    "week5-stakeholder-grid",
    "week5-impact-analysis"
  ],
  6: [
    "week6-ocr-question-practice",
    "week6-answer-improvement",
    "week6-discuss-planner",
    "week6-stakeholder-debate",
    "week6-revision-organiser",
    "week6-exercise-decision-record",
    "week6-legislation-matching",
    "week6-government-initiatives",
    "week6-ncsc-guidance",
    "week6-discuss-learning"
  ],
  7: [
    "week7-ocr-question-practice",
    "week7-answer-improvement",
    "week7-northbank-risk-register",
    "week7-heightened-threat"
  ]
};

export type CataloguePlayerMode = "catalogue" | "hybrid" | "host";

function optionCount(block: ActivityBlockDocument): number {
  return ((block.content && block.content.options) || []).length;
}

export function isScorableReactBlock(block: ActivityBlockDocument): boolean {
  const type = String(block.type || "").toLowerCase();
  if (type === "classification") return true;
  if (type === "single-choice" || type === "option-cards") return optionCount(block) > 0;
  return false;
}

function activityHasCatalogueReactBlock(activity: ActivityDocument | null): boolean {
  return Boolean(
    activity
    && (activity.blocks || []).some((block) => isCatalogueReactType(block.type))
  );
}

export function cataloguePlayerMode(week: number, activityId: string | null, activity: ActivityDocument | null): CataloguePlayerMode {
  if (!activityId) return "host";
  if ((WEEK_HYBRID_ACTIVITY_IDS[week] || []).includes(activityId)) return "hybrid";
  if ((WEEK_HOST_ACTIVITY_IDS[week] || []).includes(activityId)) return "host";
  // Catalogue for MCQ/classification/text — including text-only Week 1 reflections.
  if (activityHasCatalogueReactBlock(activity)) return "catalogue";
  return "host";
}

export function activityUsesCataloguePlayer(activity: ActivityDocument | null): boolean {
  return activityHasCatalogueReactBlock(activity);
}

export function catalogueReflectionActivity(activity: ActivityDocument): ActivityDocument {
  return {
    ...activity,
    blocks: (activity.blocks || []).filter((block) => {
      const type = String(block.type || "").toLowerCase();
      return type === "reflection" || type === "short-response";
    })
  };
}

export function catalogueActivity(pkg: ContentPackage, activityId: string): ActivityDocument | null {
  const activity = (pkg.activities || []).find((item) => item.id === activityId) as ActivityDocument | undefined;
  if (!activity) return null;
  const title = activity.metadata?.title;
  return {
    ...activity,
    blocks: (activity.blocks || []).flatMap((block) => {
      if (String(block.id).endsWith("source-remainder")) return [];
      const text = String((block.content as { text?: string } | undefined)?.text || "");
      if (block.type === "heading" && title && text === title) return [];
      const type = String(block.type || "").toLowerCase();
      if ((type === "single-choice" || type === "option-cards") && optionCount(block) === 0) {
        const prompt = String((block.content as { prompt?: string } | undefined)?.prompt || text);
        return [{
          ...block,
          type: "short-response",
          content: { ...(block.content || {}), prompt, text: prompt }
        }];
      }
      return [block];
    })
  };
}

export function blockScorableTotal(block: ActivityBlockDocument): number {
  if (!isScorableReactBlock(block)) return 0;
  const type = String(block.type || "").toLowerCase();
  if (type === "classification") return ((block.content && block.content.items) || []).length;
  return 1;
}

export function scorableBlocks(activity: ActivityDocument | null | undefined): ActivityBlockDocument[] {
  return (activity?.blocks || []).filter((block) => isCatalogueReactType(block.type) && isScorableReactBlock(block));
}

export function sumScores(scores: Record<string, ActivityScore>): ActivityScore {
  return Object.values(scores).reduce(
    (total, score) => ({
      correct: total.correct + score.correct,
      total: total.total + score.total
    }),
    { correct: 0, total: 0 }
  );
}

export function activityScoreFromResults(
  blocks: ActivityBlockDocument[],
  results: Record<string, ActivityResult>
): ActivityScore {
  return blocks.reduce(
    (total, block) => {
      const result = results[questionIdFor(block)];
      return {
        correct: total.correct + (result?.score?.correct || 0),
        total: total.total + blockScorableTotal(block)
      };
    },
    { correct: 0, total: 0 }
  );
}
