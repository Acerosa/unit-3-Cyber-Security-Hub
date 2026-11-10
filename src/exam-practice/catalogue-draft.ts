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

type ConfirmedStore = {
  save?: (state: unknown, options?: { immediate?: boolean }) => void;
  flush?: () => Promise<unknown>;
  isDirty?: () => boolean;
};

export type CatalogueSaveConfirmation = "saved" | "rejected" | "failed" | "superseded";

type SaveQueue = {
  inflight: boolean;
  latest: {
    responses: Record<string, unknown>;
    extra?: Record<string, unknown>;
    resolve: (result: CatalogueSaveConfirmation) => void;
  } | null;
};

const saveQueues = new Map<string, SaveQueue>();

function responseRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as { state?: { responses?: unknown }; responses?: unknown };
  const responses = row.state?.responses ?? row.responses;
  if (!responses || typeof responses !== "object" || Array.isArray(responses)) return null;
  return responses as Record<string, unknown>;
}

async function pushCatalogueResponses(
  activity: ActivityDocument,
  platform: DraftPlatform | undefined,
  responses: Record<string, unknown>,
  extra?: Record<string, unknown>
): Promise<CatalogueSaveConfirmation> {
  const store = createCatalogueDraftStore(activity, platform as never) as ConfirmedStore | null;
  if (!store?.save || !store.flush) return "failed";
  const payload = { responses, checked: {}, results: {}, ...extra };
  store.save(payload);
  let result: unknown;
  try {
    result = await store.flush();
  } catch {
    return "failed";
  }
  const row = result && typeof result === "object" ? result as { activityKey?: string } : null;
  if (!row?.activityKey) return store.isDirty?.() ? "failed" : "saved";
  const remote = responseRecord(result);
  if (remote && !sameResponses(remote, responses)) return "rejected";
  return "saved";
}

async function drainSaveQueue(
  activity: ActivityDocument,
  platform: DraftPlatform | undefined,
  queue: SaveQueue
): Promise<void> {
  if (queue.inflight) return;
  queue.inflight = true;
  try {
    while (queue.latest) {
      const job = queue.latest;
      queue.latest = null;
      const result = await pushCatalogueResponses(activity, platform, job.responses, job.extra);
      if (queue.latest) job.resolve("superseded");
      else job.resolve(result);
    }
  } finally {
    queue.inflight = false;
    if (queue.latest) void drainSaveQueue(activity, platform, queue);
  }
}

export function confirmCatalogueResponses(
  activity: ActivityDocument,
  platform: DraftPlatform | undefined,
  responses: Record<string, unknown>,
  extra?: Record<string, unknown>
): Promise<CatalogueSaveConfirmation> {
  const queue = saveQueues.get(activity.id) || { inflight: false, latest: null };
  saveQueues.set(activity.id, queue);
  return new Promise((resolve) => {
    if (queue.latest) queue.latest.resolve("superseded");
    queue.latest = { responses, extra, resolve };
    void drainSaveQueue(activity, platform, queue);
  });
}

function sameResponses(remote: Record<string, unknown>, sent: Record<string, unknown>): boolean {
  const keys = new Set([...Object.keys(remote), ...Object.keys(sent)]);
  for (const key of keys) {
    if (stable(remote[key]) !== stable(sent[key])) return false;
  }
  return true;
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value as Record<string, unknown>).sort().map((key) => `${key}:${stable((value as Record<string, unknown>)[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function saveCatalogueResponses(
  activity: ActivityDocument,
  platform: DraftPlatform | undefined,
  responses: Record<string, unknown>,
  extra?: Record<string, unknown>
): void {
  void confirmCatalogueResponses(activity, platform, responses, extra);
}

export function activityVersion(activity: ActivityDocument): string {
  return resolveActivityVersion(activity);
}
