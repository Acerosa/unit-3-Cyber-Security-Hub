import { resolveActivityVersion } from "@learning-platform/core";
import { questionIdFor, type ActivityDocument } from "@learning-platform/ui";
import { requiredCatalogueBlocks, type CatalogueDraft } from "./activity-draft";

export type HistoricalCompatibility = {
  compatible: boolean;
  reason?: string;
  extraKeys?: string[];
  missingCurrentIds?: string[];
};

export type HistoricalRecovery = {
  kind: "none" | "current" | "compatible" | "incompatible";
  state: CatalogueDraft | null;
  currentVersion: string;
  sourceVersion?: string;
  reason?: string;
  extraKeys?: string[];
};

type ProgressStoreLike = {
  hydrate?: (local?: unknown) => Promise<CatalogueDraft | null | undefined>;
  save?: (state: unknown, options?: { remote?: boolean }) => unknown;
  destroy?: () => void;
};

type HubPlatformLike = {
  progress?: {
    createStore?: (options: {
      activityKey: string;
      activityVersion: string;
      storage?: Storage;
    }) => ProgressStoreLike | null;
  };
};

function asDraft(value: unknown): CatalogueDraft | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const src = value as CatalogueDraft;
  return {
    responses: src.responses && typeof src.responses === "object" ? src.responses : {},
    checked: src.checked && typeof src.checked === "object" ? src.checked : {},
    results: src.results && typeof src.results === "object" ? src.results : {},
    startedAt: src.startedAt,
    completed: false,
    submission: src.submission
  };
}

export function catalogueDraftHasWork(draft: CatalogueDraft | null | undefined): boolean {
  if (!draft) return false;
  if (draft.responses && Object.keys(draft.responses).length > 0) return true;
  if (draft.checked && Object.keys(draft.checked).length > 0) return true;
  return false;
}

export function currentCatalogueQuestionIds(activity: ActivityDocument): string[] {
  return requiredCatalogueBlocks(activity)
    .map((block) => String(questionIdFor(block) || "").trim())
    .filter(Boolean);
}

export function historicalResponseKeys(state: CatalogueDraft | null | undefined): string[] {
  const keys = new Set<string>();
  Object.keys(state?.responses || {}).forEach((key) => keys.add(key));
  Object.keys(state?.checked || {}).forEach((key) => keys.add(key));
  return [...keys];
}

/**
 * Historical state is compatible only when every stored response/checked key
 * exists on the current activity. Extra keys (baseline 1.2.0 10-question bank
 * vs 1.3.0 6-question bank) must not be silently dropped.
 */
export function assessHistoricalCompatibility(
  activity: ActivityDocument,
  historical: CatalogueDraft | null | undefined
): HistoricalCompatibility {
  const current = new Set(currentCatalogueQuestionIds(activity));
  const keys = historicalResponseKeys(historical);
  if (!keys.length) {
    return { compatible: false, reason: "empty" };
  }
  if (!current.size) {
    return { compatible: false, reason: "current-structure-unknown", extraKeys: keys };
  }
  const extraKeys = keys.filter((key) => !current.has(key));
  if (extraKeys.length) {
    return {
      compatible: false,
      reason: "structure-mismatch",
      extraKeys
    };
  }
  return { compatible: true };
}

export function historicalCandidateVersions(
  activityKey: string,
  currentVersion: string
): string[] {
  const map = typeof window !== "undefined" ? window.Unit3ActivityKeyMap : undefined;
  if (map && typeof map.knownHistoricalVersionsFor === "function") {
    return map.knownHistoricalVersionsFor(activityKey, currentVersion);
  }
  const current = String(currentVersion || "").trim();
  return ["1.0.0", "1.1.0", "1.2.0", "1.3.0"].filter((version) => version !== current);
}

export const INCOMPATIBLE_RECOVERY_COPY =
  "We found earlier work for this activity that does not match the current questions. Your original answers are still saved. Ask your tutor if you need them restored.";

export const COMPATIBLE_RECOVERY_COPY =
  "Loaded earlier answers from a previous version of this activity. They stay on that version until you edit or check a question.";

export async function recoverCatalogueState(options: {
  activity: ActivityDocument;
  platform?: HubPlatformLike;
  currentState?: CatalogueDraft | null;
}): Promise<HistoricalRecovery> {
  const currentVersion = resolveActivityVersion(options.activity);
  const current = asDraft(options.currentState);
  if (catalogueDraftHasWork(current)) {
    return { kind: "current", state: current, currentVersion };
  }

  const createStore = options.platform?.progress?.createStore;
  if (typeof createStore !== "function" || !currentVersion) {
    return { kind: "none", state: current, currentVersion };
  }

  const candidates = historicalCandidateVersions(options.activity.id, currentVersion);
  for (const sourceVersion of candidates) {
    let store: ProgressStoreLike | null = null;
    try {
      store = createStore({
        activityKey: options.activity.id,
        activityVersion: sourceVersion,
        storage: typeof window !== "undefined" ? window.localStorage : undefined
      });
      const resolved = asDraft(store?.hydrate ? await store.hydrate() : null);
      if (!catalogueDraftHasWork(resolved)) continue;
      const compatibility = assessHistoricalCompatibility(options.activity, resolved);
      if (compatibility.compatible) {
        return {
          kind: "compatible",
          state: resolved,
          currentVersion,
          sourceVersion,
          reason: COMPATIBLE_RECOVERY_COPY
        };
      }
      return {
        kind: "incompatible",
        state: resolved,
        currentVersion,
        sourceVersion,
        reason: INCOMPATIBLE_RECOVERY_COPY,
        extraKeys: compatibility.extraKeys
      };
    } catch {
      /* Probe the next known same-key version. Never write on failure. */
    } finally {
      try { store?.destroy?.(); } catch { /* ignore */ }
    }
  }

  return { kind: "none", state: current, currentVersion };
}
