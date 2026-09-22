import { beforeAll, describe, expect, it, vi } from "vitest";
import type { ActivityDocument } from "@learning-platform/ui";
import pkg from "../../content/unit-3-cyber-security/package.json";
import { ensureFormativeMapper } from "../formative-contract";
import { catalogueActivity } from "./week-activities";
import {
  bindPersistedCatalogueDraft,
  UNMAPPED_RESPONSE_COPY
} from "./response-identity";

const retrievalActivity = () => (
  catalogueActivity(pkg as never, "week2-session1-retrieval") as ActivityDocument
);

const sortActivity = () => (
  catalogueActivity(pkg as never, "week2-threat-vulnerability-sort") as ActivityDocument
);

describe("Cyber response identity restore adapter", () => {
  beforeAll(async () => {
    await ensureFormativeMapper();
  });

  it("maps production S1-Q1 onto the catalogue radio key", async () => {
    const mapper = await ensureFormativeMapper();
    const bound = bindPersistedCatalogueDraft(
      retrievalActivity(),
      {
        responses: { "S1-Q1": "B" },
        checked: { "S1-Q1": true },
        results: {}
      },
      mapper
    );
    expect(bound.mappedKeys).toEqual(["S1-Q1"]);
    expect(bound.unmappedKeys).toEqual([]);
    expect(bound.ambiguousKeys).toEqual([]);
    expect(bound.draft.responses["week2-session1-retrieval:s1-q1"]).toBe("b");
    expect(bound.draft.checked["week2-session1-retrieval:s1-q1"]).toBe(true);
    expect(bound.draft.responses["S1-Q1"]).toBeUndefined();
  });

  it("maps S1-Q1 through S1-Q10 onto their intended catalogue controls", async () => {
    const mapper = await ensureFormativeMapper();
    const stored = Object.fromEntries(
      Array.from({ length: 10 }, (_, index) => [`S1-Q${index + 1}`, "B"])
    );
    const bound = bindPersistedCatalogueDraft(
      retrievalActivity(),
      { responses: stored, checked: Object.fromEntries(Object.keys(stored).map((key) => [key, true])), results: {} },
      mapper
    );
    expect(bound.mappedKeys).toHaveLength(10);
    expect(bound.unmappedKeys).toEqual([]);
    expect(bound.ambiguousKeys).toEqual([]);
    for (let index = 1; index <= 10; index += 1) {
      expect(bound.draft.responses[`week2-session1-retrieval:s1-q${index}`]).toBe("b");
      expect(bound.draft.checked[`week2-session1-retrieval:s1-q${index}`]).toBe(true);
    }
  });

  it("does not write or submit while binding", async () => {
    const mapper = await ensureFormativeMapper();
    const save = vi.fn();
    const submit = vi.fn();
    bindPersistedCatalogueDraft(
      retrievalActivity(),
      { responses: { "S1-Q1": "B" }, checked: { "S1-Q1": true }, results: {} },
      mapper
    );
    expect(save).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });

  it("does not guess when a stored key maps to more than one control", async () => {
    const mapper = await ensureFormativeMapper();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const colliding = {
      id: "week2-session1-retrieval",
      version: "1.0.0",
      blocks: [
        {
          id: "left",
          type: "single-choice",
          content: {
            questionId: "week2-session1-retrieval:s1-q1",
            sourceQuestionId: "s1-q1",
            options: [{ id: "a" }, { id: "b" }]
          }
        },
        {
          id: "right",
          type: "single-choice",
          content: {
            questionId: "week2-session1-retrieval:s1-q1-dup",
            sourceQuestionId: "s1-q1",
            options: [{ id: "a" }, { id: "b" }]
          }
        }
      ]
    } as ActivityDocument;
    const bound = bindPersistedCatalogueDraft(
      colliding,
      { responses: { "S1-Q1": "B" }, checked: { "S1-Q1": true }, results: {} },
      mapper
    );
    expect(bound.ambiguousKeys).toEqual(["S1-Q1"]);
    expect(bound.mappedKeys).toEqual([]);
    expect(bound.draft.responses["S1-Q1"]).toBe("B");
    expect(bound.draft.responses["week2-session1-retrieval:s1-q1"]).toBeUndefined();
    expect(bound.draft.responses["week2-session1-retrieval:s1-q1-dup"]).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      "UNIT3_RESPONSE_IDENTITY_AMBIGUOUS",
      expect.objectContaining({ activityKey: "week2-session1-retrieval", keys: ["S1-Q1"] })
    );
    warn.mockRestore();
  });

  it("preserves unknown stored keys instead of dropping them", async () => {
    const mapper = await ensureFormativeMapper();
    const bound = bindPersistedCatalogueDraft(
      retrievalActivity(),
      {
        responses: { "S1-Q1": "B", "ZZZ-UNKNOWN": "C" },
        checked: { "S1-Q1": true, "ZZZ-UNKNOWN": true },
        results: {}
      },
      mapper
    );
    expect(bound.draft.responses["week2-session1-retrieval:s1-q1"]).toBe("b");
    expect(bound.draft.responses["ZZZ-UNKNOWN"]).toBe("C");
    expect(bound.unmappedKeys).toEqual(["ZZZ-UNKNOWN"]);
    expect(UNMAPPED_RESPONSE_COPY).toMatch(/do not match the current questions/);
  });

  it("keeps Core nested classification reconstruction on catalogue keys", async () => {
    const mapper = await ensureFormativeMapper();
    const nested = {
      "sort-01": "threat",
      "sort-02": "vulnerability"
    };
    const bound = bindPersistedCatalogueDraft(
      sortActivity(),
      {
        responses: { "week2-threat-vulnerability-sort": nested },
        checked: { "week2-threat-vulnerability-sort": true },
        results: {}
      },
      mapper
    );
    expect(bound.draft.responses["week2-threat-vulnerability-sort"]).toEqual(nested);
    expect(bound.unmappedKeys).toEqual([]);
    expect(bound.ambiguousKeys).toEqual([]);
  });

  it("maps hosted classification item letters onto catalogue categories", async () => {
    const mapper = await ensureFormativeMapper();
    const bound = bindPersistedCatalogueDraft(
      sortActivity(),
      {
        responses: { "SORT-01": "A", "SORT-02": "B" },
        checked: { "SORT-01": true, "SORT-02": true },
        results: {}
      },
      mapper
    );
    expect(bound.draft.responses["week2-threat-vulnerability-sort"]).toEqual({
      "sort-01": "threat",
      "sort-02": "vulnerability"
    });
    expect(bound.draft.checked["week2-threat-vulnerability-sort"]).toBe(true);
  });

  it("maps text responses by key only", async () => {
    const mapper = await ensureFormativeMapper();
    const activity = {
      id: "week2-session1-retrieval",
      version: "1.0.0",
      blocks: [
        {
          id: "notes",
          type: "short-response",
          content: {
            questionId: "week2-session1-retrieval:s1-q1",
            sourceQuestionId: "s1-q1"
          }
        }
      ]
    } as ActivityDocument;
    const bound = bindPersistedCatalogueDraft(
      activity,
      { responses: { "S1-Q1": "A phishing email is a threat." }, checked: { "S1-Q1": true }, results: {} },
      mapper
    );
    expect(bound.draft.responses["week2-session1-retrieval:s1-q1"]).toBe("A phishing email is a threat.");
  });

  it("does not map Week 1 BAS-Q keys onto u3-w01 catalogue ids", async () => {
    const mapper = await ensureFormativeMapper();
    const baseline = {
      id: "u3-w01-baseline",
      version: "1.3.0",
      blocks: [
        { id: "q1", type: "single-choice", content: { questionId: "u3-w01-baseline:q1" } }
      ]
    } as ActivityDocument;
    const bound = bindPersistedCatalogueDraft(
      baseline,
      { responses: { "BAS-Q01": "C" }, checked: { "BAS-Q01": true }, results: {} },
      mapper
    );
    expect(bound.unmappedKeys).toEqual(["BAS-Q01"]);
    expect(bound.draft.responses["BAS-Q01"]).toBe("C");
    expect(bound.draft.responses["u3-w01-baseline:q1"]).toBeUndefined();
  });
});
