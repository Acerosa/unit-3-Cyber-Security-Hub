/**
 * Cyber-only restore adapter: persisted question identity → catalogue player identity.
 *
 * Finish/submit canonicalises catalogue keys such as
 * `week2-session1-retrieval:s1-q1` onto hosted keys such as `S1-Q1`.
 * Core reconstructs completed attempts with those hosted keys. The SPA player
 * binds catalogue `questionId`s. Reverse that mapping here. Do not teach Core.
 */
import { questionIdFor, type ActivityBlockDocument, type ActivityDocument } from "@learning-platform/ui";
import {
  localQuestionId,
  resolveFormativeRpcQuestionId
} from "../formative-contract";
import { requiredCatalogueBlocks, type CatalogueDraft } from "./activity-draft";

declare global {
  interface Window {
    Unit3QuestionKeyAliases?: {
      CATEGORY_OPTION_ALIASES?: Record<string, Record<string, string>>;
    };
  }
}

type KeyMap = {
  normaliseQuestionKey: (questionId: string, activityKey: string) => string;
};

type IdentityTarget =
  | { kind: "question"; catalogueId: string; block: ActivityBlockDocument }
  | { kind: "item"; catalogueId: string; itemId: string; block: ActivityBlockDocument };

export type CatalogueIdentityBind = {
  draft: CatalogueDraft;
  mappedKeys: string[];
  unmappedKeys: string[];
  ambiguousKeys: string[];
};

function storedIdentity(mapper: KeyMap, activityKey: string, questionId: string): string {
  try {
    return String(resolveFormativeRpcQuestionId(mapper, activityKey, questionId) || "").trim();
  } catch {
    return "";
  }
}

function reverseCategoryId(activityKey: string, stored: string): string {
  const raw = String(stored || "").trim();
  if (!raw) return raw;
  const table = window.Unit3QuestionKeyAliases?.CATEGORY_OPTION_ALIASES?.[activityKey];
  if (!table) return raw;
  const matches = Object.entries(table).filter(([, optionId]) => String(optionId) === raw);
  if (matches.length === 1) return matches[0][0];
  return raw;
}

function optionIdsFor(block: ActivityBlockDocument): string[] {
  return (block.content?.options || [])
    .map((option) => String(option.id || "").trim())
    .filter(Boolean);
}

function bindScalarToBlock(block: ActivityBlockDocument, value: unknown): unknown {
  if (typeof value !== "string") return value;
  const options = optionIdsFor(block);
  if (!options.length) return value;
  const exact = options.filter((id) => id === value);
  if (exact.length === 1) return exact[0];
  const caseInsensitive = options.filter((id) => id.toLowerCase() === value.toLowerCase());
  if (caseInsensitive.length === 1) return caseInsensitive[0];
  return value;
}

function bindValueToBlock(block: ActivityBlockDocument, value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => bindScalarToBlock(block, item));
  return bindScalarToBlock(block, value);
}

function classificationValue(activityKey: string, itemId: string, value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return reverseCategoryId(activityKey, value.trim());
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const category = String(record.categoryId || record.category || record.category_id || "").trim();
    if (category) return reverseCategoryId(activityKey, category);
    const nested = record[itemId];
    if (typeof nested === "string" && nested.trim()) return nested.trim();
  }
  return "";
}

function addTarget(
  index: Map<string, IdentityTarget[]>,
  stored: string,
  target: IdentityTarget
) {
  const key = String(stored || "").trim();
  if (!key) return;
  const existing = index.get(key) || [];
  const duplicate = existing.some((item) => (
    item.kind === target.kind
    && item.catalogueId === target.catalogueId
    && (item.kind === "question" || (item.kind === "item" && target.kind === "item" && item.itemId === target.itemId))
  ));
  if (duplicate) {
    index.set(key, existing);
    return;
  }
  existing.push(target);
  index.set(key, existing);
}

export function catalogueStoredIdentityIndex(
  activity: ActivityDocument,
  mapper: KeyMap
): Map<string, IdentityTarget[]> {
  const index = new Map<string, IdentityTarget[]>();
  const activityKey = String(activity.id || "").trim();
  for (const block of requiredCatalogueBlocks(activity)) {
    const catalogueId = String(questionIdFor(block) || "").trim();
    if (!catalogueId) continue;
    const questionTarget: IdentityTarget = { kind: "question", catalogueId, block };
    addTarget(index, catalogueId, questionTarget);
    addTarget(index, storedIdentity(mapper, activityKey, catalogueId), questionTarget);
    const local = localQuestionId(block);
    if (local && local !== catalogueId) {
      addTarget(index, local, questionTarget);
      addTarget(index, storedIdentity(mapper, activityKey, local), questionTarget);
    }
    const type = String(block.type || "").toLowerCase();
    const items = type === "classification" || type === "drag-drop" || type === "phrase-completion"
      ? (block.content?.items || [])
      : [];
    for (const item of items) {
      const itemId = String(item.id || "").trim();
      if (!itemId) continue;
      const itemTarget: IdentityTarget = { kind: "item", catalogueId, itemId, block };
      addTarget(index, itemId, itemTarget);
      addTarget(index, storedIdentity(mapper, activityKey, `${catalogueId}:${itemId}`), itemTarget);
      addTarget(index, storedIdentity(mapper, activityKey, itemId), itemTarget);
    }
  }
  return index;
}

function uniqueQuestionTarget(targets: IdentityTarget[]): IdentityTarget | null {
  const questions = targets.filter((item) => item.kind === "question");
  const items = targets.filter((item) => item.kind === "item");
  if (questions.length === 1 && items.length === 0) return questions[0];
  if (questions.length === 0 && items.length === 1) return items[0];
  return null;
}

function mergeItemResponse(
  responses: Record<string, unknown>,
  catalogueId: string,
  itemId: string,
  value: unknown
) {
  const current = responses[catalogueId];
  const next = current && typeof current === "object" && !Array.isArray(current)
    ? { ...(current as Record<string, unknown>) }
    : {};
  next[itemId] = value;
  responses[catalogueId] = next;
}

/**
 * Translate Core-reconstructed hosted keys onto the current catalogue player ids.
 * Same activity only. Never writes. Never drops an unmatched stored key.
 */
export function bindPersistedCatalogueDraft(
  activity: ActivityDocument,
  draft: CatalogueDraft | null | undefined,
  mapper: KeyMap
): CatalogueIdentityBind {
  const source: CatalogueDraft = {
    responses: { ...(draft?.responses || {}) },
    checked: { ...(draft?.checked || {}) },
    results: { ...(draft?.results || {}) },
    startedAt: draft?.startedAt,
    completed: draft?.completed,
    submission: draft?.submission
  };
  const keys = new Set<string>([
    ...Object.keys(source.responses),
    ...Object.keys(source.checked),
    ...Object.keys(source.results)
  ]);
  if (!keys.size) {
    return { draft: source, mappedKeys: [], unmappedKeys: [], ambiguousKeys: [] };
  }

  const index = catalogueStoredIdentityIndex(activity, mapper);
  const responses: Record<string, unknown> = {};
  const checked: Record<string, boolean> = {};
  const results = { ...source.results };
  const mappedKeys: string[] = [];
  const unmappedKeys: string[] = [];
  const ambiguousKeys: string[] = [];
  const activityKey = String(activity.id || "").trim();

  for (const stored of keys) {
    const targets = index.get(stored) || [];
    const unique = uniqueQuestionTarget(targets);
    if (targets.length > 0 && !unique) {
      ambiguousKeys.push(stored);
      if (stored in source.responses) responses[stored] = source.responses[stored];
      if (stored in source.checked) checked[stored] = Boolean(source.checked[stored]);
      continue;
    }
    if (!unique) {
      unmappedKeys.push(stored);
      if (stored in source.responses) responses[stored] = source.responses[stored];
      if (stored in source.checked) checked[stored] = Boolean(source.checked[stored]);
      continue;
    }

    mappedKeys.push(stored);
    if (unique.kind === "question") {
      if (stored in source.responses) {
        const incoming = source.responses[stored];
        if (incoming && typeof incoming === "object" && !Array.isArray(incoming)
          && (unique.block.type || "").toLowerCase() === "classification") {
          responses[unique.catalogueId] = incoming;
        } else {
          responses[unique.catalogueId] = bindValueToBlock(unique.block, incoming);
        }
      }
      if (stored in source.checked) checked[unique.catalogueId] = Boolean(source.checked[stored]);
      if (stored in source.results && stored !== unique.catalogueId) {
        results[unique.catalogueId] = source.results[stored];
        delete results[stored];
      }
      continue;
    }

    const category = classificationValue(activityKey, unique.itemId, source.responses[stored]);
    if (category) mergeItemResponse(responses, unique.catalogueId, unique.itemId, category);
    if (stored in source.checked) checked[unique.catalogueId] = true;
    if (stored in source.results && stored !== unique.catalogueId) {
      delete results[stored];
    }
  }

  if (ambiguousKeys.length && typeof console !== "undefined" && typeof console.warn === "function") {
    console.warn("UNIT3_RESPONSE_IDENTITY_AMBIGUOUS", {
      activityKey,
      keys: ambiguousKeys
    });
  }

  return {
    draft: {
      ...source,
      responses,
      checked,
      results
    },
    mappedKeys,
    unmappedKeys,
    ambiguousKeys
  };
}

export const UNMAPPED_RESPONSE_COPY =
  "We found saved answers that do not match the current questions. Your original answers are still saved.";
