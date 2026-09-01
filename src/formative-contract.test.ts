import { describe, expect, it, vi } from "vitest";
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import {
  localQuestionId,
  resolveFormativeActivityVersion,
  resolveFormativeRpcQuestionId
} from "./formative-contract";

function loadMapper() {
  const root = path.resolve(__dirname, "..");
  const sandbox = { window: {} as Window & { Unit3ActivityKeyMap?: unknown } };
  vm.runInContext(fs.readFileSync(path.join(root, "js/core/question-key-aliases.js"), "utf8"), vm.createContext(sandbox));
  vm.runInContext(fs.readFileSync(path.join(root, "js/core/activity-key-map.js"), "utf8"), vm.createContext(sandbox));
  return sandbox.window.Unit3ActivityKeyMap as {
    catalogueVersionFor: (activityKey: string) => string;
    normaliseQuestionKey: (questionId: string, activityKey: string) => string;
    normaliseActivityVersion: (version: string, activityKey: string) => string;
  };
}

describe("formative contract mapping", () => {
  const mapper = loadMapper();

  it("maps week2-malware-symptoms hosted ids to MW-Q1", () => {
    const block = {
      id: "week2-malware-symptoms-q-1-mw-q1",
      type: "single-choice",
      content: {
        formative: true,
        questionId: "week2-malware-symptoms:mw-q1",
        sourceQuestionId: "mw-q1"
      }
    };
    expect(localQuestionId(block)).toBe("mw-q1");
    expect(resolveFormativeRpcQuestionId(mapper, "week2-malware-symptoms", "week2-malware-symptoms:mw-q1")).toBe("MW-Q1");
    expect(mapper.normaliseQuestionKey("mw-q1", "week2-malware-symptoms")).toBe("MW-Q1");
  });

  it("maps classification item suffix sort-01 to SORT-01", () => {
    expect(resolveFormativeRpcQuestionId(mapper, "week2-threat-vulnerability-sort", "week2-threat-vulnerability-sort:sort-01")).toBe("SORT-01");
  });

  it("uses catalogue version 1.1.0 for week2-malware-symptoms", () => {
    expect(resolveFormativeActivityVersion(mapper, "week2-malware-symptoms", "1.0.0")).toBe("1.1.0");
  });

  it("normalises RPC payloads via installFormativeRpcNormalizer", async () => {
    const mapperLoader = vi.fn(async () => mapper);
    const calls: unknown[] = [];
    const client = {
      rpc: vi.fn(async (fn: string, params: unknown) => {
        calls.push({ fn, params });
        return { data: [], error: null };
      })
    };
    const { installFormativeRpcNormalizer } = await import("./formative-contract");
    installFormativeRpcNormalizer(client, mapperLoader);
    await client.rpc("mark_formative_response", {
      p_activity_key: "week2-malware-symptoms",
      p_activity_version: "1.0.0",
      p_responses: [{ question_id: "week2-malware-symptoms:mw-q1", response_payload: { optionId: "b" } }]
    });
    const payload = calls[0] as { params: { p_activity_version: string; p_responses: Array<{ question_id: string }> } };
    expect(payload.params.p_activity_version).toBe("1.1.0");
    expect(payload.params.p_responses[0].question_id).toBe("MW-Q1");
  });
});
