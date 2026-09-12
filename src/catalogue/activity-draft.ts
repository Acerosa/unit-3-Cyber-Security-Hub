import { evidence, resolveActivityVersion } from "@learning-platform/core";
import {
  isCatalogueReactType,
  questionIdFor,
  type ActivityBlockDocument,
  type ActivityDocument
} from "@learning-platform/ui";
import {
  canonicaliseFormativeResponsePayload,
  ensureFormativeMapper,
  resolveFormativeRpcQuestionId
} from "../formative-contract";

export type CatalogueCheckedResult = {
  correct: boolean | null;
  canRetry?: boolean;
  status?: "correct" | "incorrect" | "review" | "recorded" | "error";
  score?: { correct: number; total: number };
};

export type CatalogueDraft = {
  responses: Record<string, unknown>;
  checked: Record<string, boolean>;
  results: Record<string, CatalogueCheckedResult>;
  startedAt?: string;
  completed?: boolean;
  submission?: { status?: string };
};

type ProgressStore = {
  save: (state: unknown, options?: { immediate?: boolean; remote?: boolean }) => unknown;
  hydrate?: (local?: unknown) => Promise<CatalogueDraft | null>;
  clear?: (options?: { local?: boolean }) => unknown;
  subscribe?: (listener: (state: CatalogueDraft) => void) => () => void;
};

type HubPlatformLike = {
  auth?: { isSignedIn?: () => boolean };
  progress?: {
    createStore?: (options: {
      activityKey: string;
      activityVersion: string;
      storage?: Storage;
    }) => ProgressStore;
  };
  submission?: {
    submit?: (payload: {
      activityKey: string;
      activityVersion: string;
      responses: unknown[];
      sourcePage?: string;
      startedAt?: string;
      completedAt?: string;
    }) => Promise<unknown>;
  };
};

function signedIn(platform?: HubPlatformLike): boolean {
  return Boolean(platform?.auth && typeof platform.auth.isSignedIn === "function" && platform.auth.isSignedIn());
}

export function requiredCatalogueBlocks(activity: ActivityDocument | null | undefined): ActivityBlockDocument[] {
  return (activity?.blocks || []).filter((block) => isCatalogueReactType(block.type));
}

export function emptyCatalogueDraft(): CatalogueDraft {
  return { responses: {}, checked: {}, results: {}, completed: false };
}

const RESULT_STATUS = new Set(["correct", "incorrect", "review", "recorded", "error"]);

export function learnerSafeCheckedResult(value: unknown): CatalogueCheckedResult | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const src = value as Record<string, unknown>;
  const result: CatalogueCheckedResult = {
    correct: src.correct === true ? true : src.correct === false ? false : null
  };
  if (typeof src.canRetry === "boolean") result.canRetry = src.canRetry;
  if (typeof src.status === "string" && RESULT_STATUS.has(src.status)) {
    result.status = src.status as CatalogueCheckedResult["status"];
  }
  if (src.score && typeof src.score === "object" && !Array.isArray(src.score)) {
    const score = src.score as { correct?: unknown; total?: unknown };
    const correct = Number(score.correct);
    const total = Number(score.total);
    if (Number.isFinite(correct) && Number.isFinite(total) && total >= 0) {
      result.score = { correct, total };
    }
  }
  return result;
}

export function learnerSafeCheckedResults(value: unknown): Record<string, CatalogueCheckedResult> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const next: Record<string, CatalogueCheckedResult> = {};
  for (const [questionId, item] of Object.entries(value as Record<string, unknown>)) {
    const safe = learnerSafeCheckedResult(item);
    if (safe) next[questionId] = safe;
  }
  return next;
}

export function createCatalogueDraftStore(
  activity: ActivityDocument,
  platform?: HubPlatformLike
): ProgressStore | null {
  if (!platform?.progress || typeof platform.progress.createStore !== "function") return null;
  if (!signedIn(platform)) return null;
  try {
    return platform.progress.createStore({
      activityKey: activity.id,
      activityVersion: resolveActivityVersion(activity),
      storage: typeof window !== "undefined" ? window.localStorage : undefined
    });
  } catch {
    return null;
  }
}

export function persistCatalogueDraft(
  store: ProgressStore | null,
  draft: CatalogueDraft,
  options?: { immediate?: boolean; remote?: boolean }
): CatalogueDraft {
  const payload: CatalogueDraft = {
    ...draft,
    results: learnerSafeCheckedResults(draft.results),
    completed: false
  };
  if (payload.submission?.status === "submitted" && options?.remote !== false) {
    return payload;
  }
  store?.save(payload, options);
  return payload;
}

function evidenceFor(block: ActivityBlockDocument, response: unknown): unknown[] {
  const questionId = questionIdFor(block);
  const type = String(block.type || "").toLowerCase();
  if (response == null || response === "") return [];
  try {
    if (type === "single-choice" || type === "option-cards") {
      const optionId = typeof response === "string"
        ? response
        : response && typeof response === "object" && "optionId" in response
          ? String((response as { optionId?: string }).optionId || "")
          : "";
      return optionId ? [evidence.singleChoice(questionId, optionId)] : [];
    }
    if (type === "short-response") {
      const text = String(response).trim();
      return text ? [evidence.written(questionId, text)] : [];
    }
    if (type === "reflection") {
      const text = String(response).trim();
      return text ? [evidence.reflection(questionId, text)] : [];
    }
    if (type === "classification" && response && typeof response === "object") {
      return Object.entries(response as Record<string, string>).map(([itemId, categoryId]) => (
        evidence.classification(`${questionId}:${itemId}`, String(categoryId), itemId)
      ));
    }
    if ((type === "sequence" || type === "ordering") && Array.isArray(response)) {
      return [evidence.ordering(questionId, response.map(String))];
    }
    if ((type === "drag-drop" || type === "phrase-completion") && response && typeof response === "object") {
      return Object.entries(response as Record<string, string>).map(([itemId, targetId]) => (
        evidence.matching(`${questionId}:${itemId}`, [{ left: itemId, right: String(targetId) }])
      ));
    }
  } catch {
    return [];
  }
  return [];
}

export function catalogueEvidence(activity: ActivityDocument, draft: CatalogueDraft): unknown[] {
  const list: unknown[] = [];
  requiredCatalogueBlocks(activity).forEach((block) => {
    list.push(...evidenceFor(block, draft.responses[questionIdFor(block)]));
  });
  return list;
}

type EvidenceItem = {
  questionKey?: string;
  evidenceType?: string;
  value?: unknown;
};

function isEvidenceItem(value: unknown): value is EvidenceItem {
  return Boolean(value && typeof value === "object" && "questionKey" in (value as object) && "evidenceType" in (value as object));
}

export async function canonicaliseCatalogueEvidence(
  activityKey: string,
  responses: unknown[]
): Promise<unknown[]> {
  const mapper = await ensureFormativeMapper();
  return responses.map((item) => {
    if (!isEvidenceItem(item)) return item;
    return {
      ...item,
      questionKey: resolveFormativeRpcQuestionId(mapper, activityKey, String(item.questionKey || "")),
      value: canonicaliseFormativeResponsePayload(
        mapper,
        activityKey,
        String(item.evidenceType || ""),
        item.value
      )
    };
  });
}

export function allCatalogueQuestionsChecked(activity: ActivityDocument, draft: CatalogueDraft): boolean {
  const blocks = requiredCatalogueBlocks(activity);
  return blocks.length > 0 && blocks.every((block) => Boolean(draft.checked[questionIdFor(block)]));
}

export async function submitCatalogueDraft(
  activity: ActivityDocument,
  draft: CatalogueDraft,
  platform?: HubPlatformLike
): Promise<{ status: "submitted" | "local"; failed?: boolean; reason?: string }> {
  const responses = await canonicaliseCatalogueEvidence(
    activity.id,
    catalogueEvidence(activity, draft)
  );
  if (!platform?.submission || typeof platform.submission.submit !== "function") {
    return { status: "local", failed: true, reason: "This activity could not be submitted from this page." };
  }
  if (!responses.length) {
    return { status: "local", failed: true, reason: "Check every question before finishing the activity." };
  }
  try {
    await platform.submission.submit({
      activityKey: activity.id,
      activityVersion: resolveActivityVersion(activity),
      responses: responses as never[],
      sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
      startedAt: draft.startedAt,
      completedAt: new Date().toISOString()
    });
    return { status: "submitted", reason: "Saved to your learning record." };
  } catch {
    return {
      status: "local",
      failed: true,
      reason: "Your work is still saved on this device. It has not been sent to your learning record yet."
    };
  }
}
