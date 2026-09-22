import { describe, expect, it, vi } from "vitest";
import type { ActivityDocument } from "@learning-platform/ui";
import {
  assessHistoricalCompatibility,
  catalogueDraftHasWork,
  recoverCatalogueState
} from "./historical-state";

const baseline13 = {
  id: "u3-w01-baseline",
  version: "1.3.0",
  blocks: [
    { id: "q1", type: "single-choice", content: { questionId: "u3-w01-baseline:q1" } },
    { id: "q2", type: "single-choice", content: { questionId: "u3-w01-baseline:q2" } },
    { id: "q3", type: "single-choice", content: { questionId: "u3-w01-baseline:q3" } },
    { id: "q4", type: "single-choice", content: { questionId: "u3-w01-baseline:q4" } },
    { id: "q5", type: "single-choice", content: { questionId: "u3-w01-baseline:q5" } },
    { id: "q6", type: "single-choice", content: { questionId: "u3-w01-baseline:q6" } }
  ]
} as ActivityDocument;

describe("historical same-key recovery", () => {
  it("treats current-version state as normal", async () => {
    const current = {
      responses: { "u3-w01-baseline:q1": "A" },
      checked: { "u3-w01-baseline:q1": true },
      results: {}
    };
    const createStore = vi.fn();
    const recovered = await recoverCatalogueState({
      activity: baseline13,
      currentState: current,
      platform: { progress: { createStore } }
    });
    expect(recovered.kind).toBe("current");
    expect(createStore).not.toHaveBeenCalled();
  });

  it("recovers compatible historical state without saving", async () => {
    const saves: unknown[] = [];
    const historical = {
      responses: { "u3-w01-baseline:q1": "B", "u3-w01-baseline:q2": "C" },
      checked: { "u3-w01-baseline:q1": true },
      results: {}
    };
    const recovered = await recoverCatalogueState({
      activity: baseline13,
      currentState: { responses: {}, checked: {}, results: {} },
      platform: {
        progress: {
          createStore: ({ activityVersion }) => ({
            save(state) { saves.push({ activityVersion, state }); },
            hydrate: async () => (activityVersion === "1.2.0" ? historical : null),
            destroy: () => {}
          })
        }
      }
    });
    expect(recovered.kind).toBe("compatible");
    expect(recovered.sourceVersion).toBe("1.2.0");
    expect(recovered.state?.responses["u3-w01-baseline:q1"]).toBe("B");
    expect(saves).toEqual([]);
    expect(catalogueDraftHasWork(recovered.state)).toBe(true);
  });

  it("does not silently map a 10-question historical bank onto 6 current questions", () => {
    const historical = {
      responses: Object.fromEntries(
        Array.from({ length: 10 }, (_, index) => [`BAS-Q${String(index + 1).padStart(2, "0")}`, "C"])
      ),
      checked: {},
      results: {}
    };
    const compatibility = assessHistoricalCompatibility(baseline13, historical);
    expect(compatibility.compatible).toBe(false);
    expect(compatibility.reason).toBe("structure-mismatch");
    expect(compatibility.extraKeys?.length).toBe(10);
  });

  it("exposes incompatible historical state without writing a migrated copy", async () => {
    const saves: unknown[] = [];
    const historical = {
      responses: Object.fromEntries(
        Array.from({ length: 10 }, (_, index) => [`BAS-Q${String(index + 1).padStart(2, "0")}`, "C"])
      ),
      checked: {},
      results: {}
    };
    const recovered = await recoverCatalogueState({
      activity: baseline13,
      currentState: null,
      platform: {
        progress: {
          createStore: ({ activityVersion }) => ({
            save(state) { saves.push({ activityVersion, state }); },
            hydrate: async () => (activityVersion === "1.2.0" ? historical : null),
            destroy: () => {}
          })
        }
      }
    });
    expect(recovered.kind).toBe("incompatible");
    expect(recovered.sourceVersion).toBe("1.2.0");
    expect(recovered.state?.responses["BAS-Q01"]).toBe("C");
    expect(saves).toEqual([]);
  });

  it("does not blindly request unassigned 1.1.0–1.3.0 for week2 retrieval", async () => {
    const versions: string[] = [];
    const retrieval = {
      id: "week2-session1-retrieval",
      version: "1.0.0",
      blocks: [
        {
          id: "q1",
          type: "single-choice",
          content: { questionId: "week2-session1-retrieval:s1-q1", sourceQuestionId: "s1-q1" }
        }
      ]
    } as ActivityDocument;
    await recoverCatalogueState({
      activity: retrieval,
      currentState: null,
      platform: {
        progress: {
          createStore: ({ activityVersion }: { activityVersion: string }) => {
            versions.push(activityVersion);
            return { hydrate: async () => null, destroy: () => {} };
          }
        }
      }
    });
    expect(versions).toEqual([]);
  });
});

