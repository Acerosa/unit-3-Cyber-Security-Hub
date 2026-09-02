/**
 * Unit 3 formative marking contract normalisation.
 * Bridges catalogue React blocks to hosted Supabase stable keys.
 */
import type { ActivityBlockDocument } from "@learning-platform/ui";

type KeyMap = {
  catalogueVersionFor: (activityKey: string) => string;
  normaliseQuestionKey: (questionId: string, activityKey: string) => string;
  normaliseActivityVersion: (version: string, activityKey: string) => string;
  normaliseOptionId: (value: string, activityKey: string) => string;
  isFormativeClassificationOptionActivity?: (activityKey: string) => boolean;
  normaliseFormativeClassificationResponse?: (
    activityKey: string,
    responseType: string,
    payload: unknown
  ) => { response_type: string; response_payload: unknown } | null;
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

export type FormativeContractInput = {
  activityKey: string;
  activityVersion: string;
  responses: ReadonlyArray<{
    question_id: string;
    response_type: string;
    response_payload: unknown;
  }>;
};

export type FormativeContractResult = {
  activityKey: string;
  activityVersion: string;
  responses: Array<{
    question_id: string;
    response_type: string;
    response_payload: unknown;
  }>;
};

/**
 * Canonicalise single-choice optionId only. Does not map categoryId or other fields.
 */
export function canonicaliseFormativeResponsePayload(
  mapper: KeyMap,
  activityKey: string,
  responseType: string,
  payload: unknown
): unknown {
  if (responseType !== "single-choice") return payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return payload;
  const record = payload as Record<string, unknown>;
  const raw = typeof record.optionId === "string" ? record.optionId.trim() : "";
  if (!raw) return payload;
  const canonical = mapper.normaliseOptionId(raw, activityKey);
  if (canonical === raw) return payload;
  return { ...record, optionId: canonical };
}

/**
 * Activity-scoped classification → hosted single-choice optionId.
 * Only the three proven Batch-B classification/single-choice drift activities.
 */
export function canonicaliseFormativeClassificationResponse(
  mapper: KeyMap,
  activityKey: string,
  responseType: string,
  payload: unknown
): { response_type: string; response_payload: unknown } {
  const unchanged = { response_type: responseType, response_payload: payload };
  if (typeof mapper.normaliseFormativeClassificationResponse !== "function") {
    return unchanged;
  }
  const mapped = mapper.normaliseFormativeClassificationResponse(
    activityKey,
    responseType,
    payload
  );
  if (!mapped || mapped.response_type !== "single-choice") return unchanged;
  return {
    response_type: mapped.response_type,
    response_payload: canonicaliseFormativeResponsePayload(
      mapper,
      activityKey,
      mapped.response_type,
      mapped.response_payload
    )
  };
}

export function createUnit3FormativeContractResolver(
  mapperLoader: () => Promise<KeyMap> = ensureFormativeMapper
) {
  return async function resolveFormativeContract(
    input: FormativeContractInput
  ): Promise<FormativeContractResult> {
    const mapper = await mapperLoader();
    return {
      activityKey: input.activityKey,
      activityVersion: resolveFormativeActivityVersion(
        mapper,
        input.activityKey,
        input.activityVersion
      ),
      responses: input.responses.map((item) => {
        const classified = canonicaliseFormativeClassificationResponse(
          mapper,
          input.activityKey,
          item.response_type,
          item.response_payload
        );
        return {
          ...item,
          question_id: resolveFormativeRpcQuestionId(
            mapper,
            input.activityKey,
            item.question_id
          ),
          response_type: classified.response_type,
          response_payload: classified.response_type === item.response_type
            ? canonicaliseFormativeResponsePayload(
              mapper,
              input.activityKey,
              item.response_type,
              item.response_payload
            )
            : classified.response_payload
        };
      })
    };
  };
}
