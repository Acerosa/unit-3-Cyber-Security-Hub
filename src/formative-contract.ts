/**
 * Unit 3 formative marking contract normalisation.
 * Bridges catalogue React blocks to hosted Supabase stable keys.
 */
import type { ActivityBlockDocument } from "@learning-platform/ui";

type KeyMap = {
  catalogueVersionFor: (activityKey: string) => string;
  normaliseQuestionKey: (questionId: string, activityKey: string) => string;
  normaliseActivityVersion: (version: string, activityKey: string) => string;
};

declare global {
  interface Window {
    Unit3ActivityKeyMap?: KeyMap;
  }
}

let mapperPromise: Promise<KeyMap> | null = null;

async function loadMapper(): Promise<KeyMap> {
  if (typeof window !== "undefined" && window.Unit3ActivityKeyMap) {
    return window.Unit3ActivityKeyMap;
  }
  await import("../js/core/question-key-aliases.js");
  await import("../js/core/activity-key-map.js");
  if (!window.Unit3ActivityKeyMap) {
    throw new Error("Unit3ActivityKeyMap failed to initialise");
  }
  return window.Unit3ActivityKeyMap;
}

export function ensureFormativeMapper(): Promise<KeyMap> {
  if (!mapperPromise) mapperPromise = loadMapper();
  return mapperPromise;
}

export function localQuestionId(block: ActivityBlockDocument): string {
  const content = block.content || {};
  const hosted = String(content.questionId || block.id || "").trim();
  const source = String((content as { sourceQuestionId?: string }).sourceQuestionId || "").trim();
  if (source) return source;
  const colon = hosted.indexOf(":");
  if (colon >= 0) return hosted.slice(colon + 1);
  return hosted;
}

export function resolveFormativeActivityVersion(
  mapper: KeyMap,
  activityKey: string,
  packageVersion: string
): string {
  return mapper.catalogueVersionFor(activityKey)
    || mapper.normaliseActivityVersion(packageVersion, activityKey)
    || packageVersion;
}

export function resolveFormativeQuestionId(
  mapper: KeyMap,
  activityKey: string,
  block: ActivityBlockDocument
): string {
  return mapper.normaliseQuestionKey(localQuestionId(block), activityKey);
}

export function patchBlockForFormativeMarking(
  mapper: KeyMap,
  activityKey: string,
  block: ActivityBlockDocument
): ActivityBlockDocument {
  const canonical = resolveFormativeQuestionId(mapper, activityKey, block);
  if (!canonical || canonical === String(block.content?.questionId || "").trim()) {
    return block;
  }
  return {
    ...block,
    content: {
      ...block.content,
      questionId: canonical
    }
  };
}

export function resolveFormativeRpcQuestionId(
  mapper: KeyMap,
  activityKey: string,
  questionId: string
): string {
  const raw = String(questionId || "").trim();
  if (!raw) return raw;
  const colon = raw.lastIndexOf(":");
  if (colon >= 0) {
    const suffix = raw.slice(colon + 1);
    if (suffix) {
      return mapper.normaliseQuestionKey(suffix, activityKey);
    }
  }
  return mapper.normaliseQuestionKey(raw, activityKey);
}

export function installFormativeRpcNormalizer(
  client: { rpc: (...args: unknown[]) => Promise<unknown> },
  mapperLoader: () => Promise<KeyMap>
) {
  const originalRpc = client.rpc.bind(client);
  client.rpc = (async (fn: string, params?: Record<string, unknown>, options?: unknown) => {
    if (fn === "mark_formative_response" && params && Array.isArray(params.p_responses)) {
      const mapper = await mapperLoader();
      const activityKey = String(params.p_activity_key || "").trim();
      const packageVersion = String(params.p_activity_version || "").trim();
      params = {
        ...params,
        p_activity_version: resolveFormativeActivityVersion(mapper, activityKey, packageVersion),
        p_responses: (params.p_responses as Array<Record<string, unknown>>).map((item) => ({
          ...item,
          question_id: resolveFormativeRpcQuestionId(
            mapper,
            activityKey,
            String(item.question_id || "")
          )
        }))
      };
    }
    return originalRpc(fn, params, options);
  }) as typeof client.rpc;
}
