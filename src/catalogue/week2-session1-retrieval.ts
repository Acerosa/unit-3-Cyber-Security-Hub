import {
  isCatalogueReactType,
  questionIdFor,
  type ActivityBlockDocument,
  type ActivityDocument,
  type ActivityResult
} from "@learning-platform/ui";

export const PILOT_PAGE = "week-2-session1-retrieval";
export const PILOT_ACTIVITY_ID = "week2-session1-retrieval";
export const PILOT_SKIP_SCRIPTS = [
  "js/week2-quiz.js",
  "week-2/data/retrieval-session-1.js",
  "week-2/session1-retrieval/app.js"
];

type PublishedPackage = {
  activities?: ActivityDocument[];
};

export function isCataloguePilotPage(page?: string): boolean {
  return page === PILOT_PAGE;
}

export function scriptsForActivityPage(page: string | undefined, scripts: string[]): string[] {
  if (!isCataloguePilotPage(page)) return scripts;
  return scripts.filter((src) => !PILOT_SKIP_SCRIPTS.includes(src));
}

export function publishedActivity(pkg: unknown, activityId: string): ActivityDocument | null {
  const activities = (pkg as PublishedPackage | null)?.activities;
  if (!Array.isArray(activities)) return null;
  const activity = activities.find((item) => item.id === activityId);
  if (!activity) return null;
  const title = activity.metadata?.title;
  return {
    ...activity,
    metadata: {
      ...activity.metadata,
      title: undefined,
      summary: undefined
    },
    blocks: (activity.blocks || []).filter((block) => {
      if (String(block.id).endsWith("source-remainder")) return false;
      const text = String((block.content as { text?: string } | undefined)?.text || "");
      return !(block.type === "heading" && title && text === title);
    })
  };
}

export function scorableBlocks(activity: ActivityDocument | null | undefined): ActivityBlockDocument[] {
  return (activity?.blocks || []).filter((block) => isCatalogueReactType(block.type));
}

export function evidenceQuestionId(block: ActivityBlockDocument): string {
  const content = block.content as { sourceQuestionId?: string; questionId?: string } | undefined;
  if (content?.sourceQuestionId) return content.sourceQuestionId;
  const questionId = String(content?.questionId || "");
  if (questionId.includes(":")) return questionId.split(":").pop() || block.id;
  return questionId || block.id;
}

function selectedOptionId(result: ActivityResult | undefined): string {
  const responses = result?.responses;
  if (responses && typeof responses === "object" && !Array.isArray(responses) && "optionId" in responses) {
    const optionId = (responses as { optionId?: string | null }).optionId;
    return optionId == null ? "" : String(optionId);
  }
  return "";
}

export function toSubmitResponses(
  blocks: ActivityBlockDocument[],
  results: Record<string, ActivityResult>
) {
  return blocks.map((block) => {
    const result = results[questionIdFor(block)];
    const optionId = selectedOptionId(result);
    const options = block.content?.options || [];
    const chosenIndex = options.findIndex((option) => option.id === optionId);
    const selected = chosenIndex >= 0 ? options[chosenIndex] : null;
    return {
      questionId: evidenceQuestionId(block),
      response: {
        chosenIndex: chosenIndex >= 0 ? chosenIndex : null,
        selectedOption: selected
          ? { id: selected.id, label: selected.label, optionId: selected.id, text: selected.label }
          : null
      },
      correct: Boolean(result?.correct),
      score: result?.correct ? 1 : 0,
      responseType: "single-choice"
    };
  });
}

export function incorrectQuestionNumbers(
  blocks: ActivityBlockDocument[],
  results: Record<string, ActivityResult>
): number[] {
  return blocks
    .map((block, index) => (results[questionIdFor(block)]?.correct ? null : index + 1))
    .filter((value): value is number => value != null);
}
