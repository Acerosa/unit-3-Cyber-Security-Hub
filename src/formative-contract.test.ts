import { describe, expect, it } from "vitest";
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import {
  createUnit3FormativeContractResolver,
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
  const resolveFormativeContract = createUnit3FormativeContractResolver(async () => mapper);

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

  it("normalises the reported production payload through resolveFormativeContract", async () => {
    const result = await resolveFormativeContract({
      activityKey: "week2-malware-symptoms",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "week2-malware-symptoms:mw-q1",
        response_type: "single-choice",
        response_payload: { optionId: "a" }
      }]
    });
    expect(result.activityKey).toBe("week2-malware-symptoms");
    expect(result.activityVersion).toBe("1.1.0");
    expect(result.responses[0].question_id).toBe("MW-Q1");
  });

  it("maps Week 6 legislation retrieval aliases", async () => {
    const result = await resolveFormativeContract({
      activityKey: "week6-legislation-retrieval",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "week6-legislation-retrieval:lrq1",
        response_type: "written",
        response_payload: { text: "answer" }
      }]
    });
    expect(result.responses[0].question_id).toBe("LR1");
  });

  it("maps Week 7 session 1 retrieval aliases", async () => {
    const result = await resolveFormativeContract({
      activityKey: "week7-session1-retrieval",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "week7-session1-retrieval:s1r-1",
        response_type: "written",
        response_payload: { text: "answer" }
      }]
    });
    expect(result.responses[0].question_id).toBe("S1R1");
  });

  it("fails closed for unknown closed-pattern question ids", () => {
    expect(() => mapper.normaliseQuestionKey("ocr-q999", "week2-ocr-question-practice")).toThrow(/unknown/i);
  });
});
