import { resolveActivityVersion } from "@learning-platform/core";
import type { ActivityDocument } from "@learning-platform/ui";
import { createCatalogueDraftStore, type CatalogueDraft } from "../catalogue/activity-draft";

type DraftPlatform = {
  auth?: { isSignedIn?: () => boolean };
  progress?: {
    createStore?: (options: {
      activityKey: string;
      activityVersion: string;
      storage?: Storage;
    }) => {
      hydrate?: () => Promise<CatalogueDraft | null>;
      save?: (state: unknown, options?: { immediate?: boolean }) => void;
    };
  };
};

export async function loadCatalogueDraft(
  activity: ActivityDocument,
  platform?: DraftPlatform
): Promise<CatalogueDraft | null> {
  const store = createCatalogueDraftStore(activity, platform as never);
  return await store?.hydrate?.() || null;
}

export async function loadCatalogueResponses(
  activity: ActivityDocument,
  platform?: DraftPlatform
): Promise<Record<string, unknown>> {
  const hydrated = await loadCatalogueDraft(activity, platform);
  return hydrated?.responses || {};
}

export function saveCatalogueResponses(
  activity: ActivityDocument,
  platform: DraftPlatform | undefined,
  responses: Record<string, unknown>,
  extra?: Record<string, unknown>
): void {
  const store = createCatalogueDraftStore(activity, platform as never);
  store?.save?.({
    responses,
    checked: {},
    results: {},
    ...extra
  }, { immediate: true });
}

export function activityVersion(activity: ActivityDocument): string {
  return resolveActivityVersion(activity);
}
