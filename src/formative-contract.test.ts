import { describe, expect, it } from "vitest";
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { createFormativeMarkingService } from "@learning-platform/core/advanced";
import {
  canonicaliseFormativeClassificationResponse,
  canonicaliseFormativeResponsePayload,
  createUnit3FormativeContractResolver,
  localQuestionId,
  resolveFormativeActivityVersion,
  resolveFormativeRpcQuestionId
} from "./formative-contract";

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

function loadMapper() {
  const root = path.resolve(__dirname, "..");
  const sandbox = { window: {} as Window & { Unit3ActivityKeyMap?: unknown } };
  vm.runInContext(fs.readFileSync(path.join(root, "js/core/question-key-aliases.js"), "utf8"), vm.createContext(sandbox));
  vm.runInContext(fs.readFileSync(path.join(root, "js/core/activity-key-map.js"), "utf8"), vm.createContext(sandbox));
  return sandbox.window.Unit3ActivityKeyMap as KeyMap;
}

function classificationItems(activityKey: string) {
  const raw = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../content/unit-3-cyber-security/activities.json"),
      "utf8"
    )
  ) as unknown;
  const activities = Array.isArray(raw)
    ? raw
    : ((raw as { activities?: unknown[] }).activities || []);
  const activity = (activities as Array<{
    id?: string;
    blocks?: Array<{
      type?: string;
      content?: { items?: Array<{ id?: string; correctCategoryId?: string }> };
    }>;
  }>).find((item) => item.id === activityKey);
  const block = (activity?.blocks || []).find((item) => item.type === "classification");
  return (block?.content?.items || [])
    .map((item) => ({
      itemId: String(item.id || ""),
      categoryId: String(item.correctCategoryId || "")
    }))
    .filter((item) => item.itemId && item.categoryId);
}

const WEEK2_CATEGORY_OPTION: Record<string, string> = {
  threat: "A",
  vulnerability: "B"
};

const MALWARE_BLOCK = {
  id: "week2-malware-symptoms-q-1-mw-q1",
  type: "single-choice",
  content: {
    formative: true,
    questionId: "week2-malware-symptoms:mw-q1",
    sourceQuestionId: "mw-q1"
  }
};

function fakeSupabaseRpc(onRpc: (payload: Record<string, unknown>) => unknown[]) {
  const calls: Array<{ name: string; payload: Record<string, unknown> }> = [];
  const client = {
    schema() {
      return {
        rpc(name: string, payload: Record<string, unknown>) {
          calls.push({ name, payload });
          return Promise.resolve({ data: onRpc(payload), error: null });
        }
      };
    }
  };
  return { client, calls };
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

  it("canonicalises malware lowercase optionId to uppercase", async () => {
    const result = await resolveFormativeContract({
      activityKey: "week2-malware-symptoms",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "week2-malware-symptoms:mw-q1",
        response_type: "single-choice",
        response_payload: { optionId: "b" }
      }]
    });
    expect(result.activityVersion).toBe("1.1.0");
    expect(result.responses[0].question_id).toBe("MW-Q1");
    expect(result.responses[0].response_payload).toEqual({ optionId: "B" });
  });

  it.each([
    ["week2-session1-retrieval", "a", "A"],
    ["week2-session2-retrieval", "d", "D"],
    ["week2-threat-vulnerability-learning", "c", "C"],
    ["week2-six-mark-response-guide", "a", "A"]
  ] as const)("canonicalises %s optionId %s → %s", async (activityKey, input, expected) => {
    const result = await resolveFormativeContract({
      activityKey,
      activityVersion: "1.0.0",
      responses: [{
        question_id: `${activityKey}:q1`,
        response_type: "single-choice",
        response_payload: { optionId: input }
      }]
    });
    expect((result.responses[0].response_payload as { optionId: string }).optionId).toBe(expected);
  });

  it("leaves week2-ocr-question-practice lowercase canonical IDs unchanged", async () => {
    const result = await resolveFormativeContract({
      activityKey: "week2-ocr-question-practice",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "week2-ocr-question-practice:ocr-q1",
        response_type: "single-choice",
        response_payload: { optionId: "b" }
      }]
    });
    expect((result.responses[0].response_payload as { optionId: string }).optionId).toBe("b");
  });

  it("leaves Week 3 uppercase client option IDs unchanged", async () => {
    const result = await resolveFormativeContract({
      activityKey: "week3-session1-retrieval",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "week3-session1-retrieval:s1q1",
        response_type: "single-choice",
        response_payload: { optionId: "B" }
      }]
    });
    expect((result.responses[0].response_payload as { optionId: string }).optionId).toBe("B");
  });

  it("does not mutate genuine classification payloads", async () => {
    const payload = { categoryId: "cia-confidentiality", itemId: "impact-01" };
    const result = await resolveFormativeContract({
      activityKey: "week5-impact-classification",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "week5-impact-classification:impact-01",
        response_type: "classification",
        response_payload: payload
      }]
    });
    expect(result.responses[0].response_type).toBe("classification");
    expect(result.responses[0].response_payload).toEqual(payload);
  });

  it("does not mutate written text payloads", async () => {
    const result = await resolveFormativeContract({
      activityKey: "week6-legislation-retrieval",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "week6-legislation-retrieval:lrq1",
        response_type: "written",
        response_payload: { text: "answer" }
      }]
    });
    expect(result.responses[0].response_payload).toEqual({ text: "answer" });
  });

  it("does not mutate coding sourceCode payloads", async () => {
    const payload = { sourceCode: "print('hi')" };
    const result = await resolveFormativeContract({
      activityKey: "week-1-input-and-output",
      activityVersion: "0.1.0",
      responses: [{
        question_id: "u14-w1-io-code",
        response_type: "coding",
        response_payload: payload
      }]
    });
    expect(result.responses[0].response_payload).toEqual(payload);
  });

  it("maps Week 6 legislation retrieval question aliases", async () => {
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

describe("canonicaliseFormativeResponsePayload", () => {
  const mapper = loadMapper();

  it("only transforms single-choice optionId", () => {
    expect(
      canonicaliseFormativeResponsePayload(mapper, "week2-malware-symptoms", "single-choice", { optionId: "b" })
    ).toEqual({ optionId: "B" });
    expect(
      canonicaliseFormativeResponsePayload(mapper, "week2-threat-vulnerability-sort", "classification", {
        categoryId: "threat",
        itemId: "sort-01"
      })
    ).toEqual({ categoryId: "threat", itemId: "sort-01" });
  });
});

describe("production-shaped formative marking path", () => {
  const mapper = loadMapper();
  const resolveFormativeContract = createUnit3FormativeContractResolver(async () => mapper);

  it("sends canonical version, question, and optionId through schema(api).rpc", async () => {
    const { client, calls } = fakeSupabaseRpc(() => ([{
      question_id: "MW-Q1",
      awarded_score: 1,
      max_score: 1,
      is_correct: true,
      requires_review: false,
      marking_source: "server",
      can_retry: true
    }]));

    const api = {
      markFormativeResponse: (payload: Record<string, unknown>) =>
        client.schema("api").rpc("mark_formative_response", payload).then((r: { data: unknown }) => r.data)
    };

    const marking = createFormativeMarkingService({
      auth: { isSignedIn: () => true },
      api,
      resolveFormativeContract
    });

    await marking.markBlock({
      activityKey: "week2-malware-symptoms",
      activityVersion: "1.0.0",
      block: MALWARE_BLOCK,
      responses: { optionId: "b" }
    });

    const rpc = calls[0];
    expect(rpc.name).toBe("mark_formative_response");
    expect(rpc.payload.p_activity_key).toBe("week2-malware-symptoms");
    expect(rpc.payload.p_activity_version).toBe("1.1.0");
    expect(rpc.payload.p_responses).toEqual([{
      question_id: "MW-Q1",
      response_type: "single-choice",
      response_payload: { optionId: "B" }
    }]);
    expect(JSON.stringify(rpc.payload).includes("correctOptionId")).toBe(false);
  });
});

describe("39-question legacy option-case regression", () => {
  const mapper = loadMapper();
  const resolveFormativeContract = createUnit3FormativeContractResolver(async () => mapper);

  const affectedActivities = [
    { activityKey: "week2-malware-symptoms", count: 10, letters: ["a", "b", "c", "d"] },
    { activityKey: "week2-session1-retrieval", count: 10, letters: ["a", "b", "c", "d"] },
    { activityKey: "week2-session2-retrieval", count: 10, letters: ["a", "b", "c", "d"] },
    { activityKey: "week2-threat-vulnerability-learning", count: 6, letters: ["a", "b", "c", "d"] },
    { activityKey: "week2-six-mark-response-guide", count: 3, letters: ["a", "b", "c"] }
  ];

  it("canonicalises all 39 legacy lowercase letters for affected activities", async () => {
    let total = 0;
    for (const { activityKey, count, letters } of affectedActivities) {
      for (let index = 0; index < count; index += 1) {
        const letter = letters[index % letters.length];
        const result = await resolveFormativeContract({
          activityKey,
          activityVersion: "1.0.0",
          responses: [{
            question_id: `${activityKey}:q${index + 1}`,
            response_type: "single-choice",
            response_payload: { optionId: letter }
          }]
        });
        const out = (result.responses[0].response_payload as { optionId: string }).optionId;
        expect(out).toBe(letter.toUpperCase());
        total += 1;
      }
    }
    expect(total).toBe(39);
  });
});

describe("formative classification → hosted optionId", () => {
  const mapper = loadMapper();
  const resolveFormativeContract = createUnit3FormativeContractResolver(async () => mapper);

  const week2 = classificationItems("week2-threat-vulnerability-sort");
  const week3 = classificationItems("week3-attacker-case-matching");
  const week4 = classificationItems("week4-targets-methods");

  it("loads all 28 catalogue classification items", () => {
    expect(week2).toHaveLength(12);
    expect(week3).toHaveLength(8);
    expect(week4).toHaveLength(8);
  });

  it.each(week2.map((item) => [item.itemId, item.categoryId] as const))(
    "week2-threat-vulnerability-sort %s classification → hosted optionId",
    async (itemId, categoryId) => {
      const result = await resolveFormativeContract({
        activityKey: "week2-threat-vulnerability-sort",
        activityVersion: "1.0.0",
        responses: [{
          question_id: `week2-threat-vulnerability-sort:${itemId}`,
          response_type: "classification",
          response_payload: { categoryId, itemId }
        }]
      });
      expect(result.activityVersion).toBe("1.1.0");
      expect(result.responses[0].question_id).toBe(itemId.toUpperCase());
      expect(result.responses[0].response_type).toBe("single-choice");
      expect(result.responses[0].response_payload).toEqual({
        optionId: WEEK2_CATEGORY_OPTION[categoryId]
      });
    }
  );

  it("maps both week2 category aliases without using option order", async () => {
    const threat = await resolveFormativeContract({
      activityKey: "week2-threat-vulnerability-sort",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "sort-02",
        response_type: "classification",
        response_payload: { categoryId: "threat", itemId: "sort-02" }
      }]
    });
    const vulnerability = await resolveFormativeContract({
      activityKey: "week2-threat-vulnerability-sort",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "sort-01",
        response_type: "classification",
        response_payload: { categoryId: "vulnerability", itemId: "sort-01" }
      }]
    });
    expect(threat.responses[0].response_payload).toEqual({ optionId: "A" });
    expect(vulnerability.responses[0].response_payload).toEqual({ optionId: "B" });
  });

  it.each(week3.map((item) => [item.itemId, item.categoryId] as const))(
    "week3-attacker-case-matching %s classification → hosted optionId",
    async (itemId, categoryId) => {
      const result = await resolveFormativeContract({
        activityKey: "week3-attacker-case-matching",
        activityVersion: "1.0.0",
        responses: [{
          question_id: `week3-attacker-case-matching:${itemId}`,
          response_type: "classification",
          response_payload: { categoryId, itemId }
        }]
      });
      expect(result.activityVersion).toBe("1.1.0");
      expect(result.responses[0].question_id).toBe(itemId);
      expect(result.responses[0].response_type).toBe("single-choice");
      expect(result.responses[0].response_payload).toEqual({ optionId: categoryId });
    }
  );

  it.each(week4.map((item) => [item.itemId, item.categoryId] as const))(
    "week4-targets-methods %s classification → hosted optionId",
    async (itemId, categoryId) => {
      const result = await resolveFormativeContract({
        activityKey: "week4-targets-methods",
        activityVersion: "1.0.0",
        responses: [{
          question_id: `week4-targets-methods:${itemId}`,
          response_type: "classification",
          response_payload: { categoryId, itemId }
        }]
      });
      expect(result.activityVersion).toBe("1.1.0");
      expect(result.responses[0].question_id).toBe(itemId.toUpperCase());
      expect(result.responses[0].response_type).toBe("single-choice");
      expect(result.responses[0].response_payload).toEqual({ optionId: categoryId });
    }
  );

  it("does not guess an unknown activity classification", async () => {
    const payload = { categoryId: "threat", itemId: "sort-01" };
    const result = await resolveFormativeContract({
      activityKey: "week2-malware-symptoms",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "week2-malware-symptoms:mw-q1",
        response_type: "classification",
        response_payload: payload
      }]
    });
    expect(result.responses[0].response_type).toBe("classification");
    expect(result.responses[0].response_payload).toEqual(payload);
  });

  it("does not guess an unknown category on an allowlisted activity", async () => {
    const payload = { categoryId: "not-a-real-category", itemId: "sort-01" };
    const result = await resolveFormativeContract({
      activityKey: "week2-threat-vulnerability-sort",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "sort-01",
        response_type: "classification",
        response_payload: payload
      }]
    });
    expect(result.responses[0].response_type).toBe("classification");
    expect(result.responses[0].response_payload).toEqual(payload);
  });

  it("leaves malformed classification payloads unchanged", async () => {
    const result = await resolveFormativeContract({
      activityKey: "week2-threat-vulnerability-sort",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "sort-01",
        response_type: "classification",
        response_payload: "threat"
      }]
    });
    expect(result.responses[0].response_type).toBe("classification");
    expect(result.responses[0].response_payload).toBe("threat");
  });

  it("does not translate week3 categories onto week2", async () => {
    const result = await resolveFormativeContract({
      activityKey: "week2-threat-vulnerability-sort",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "sort-01",
        response_type: "classification",
        response_payload: { categoryId: "insider", itemId: "sort-01" }
      }]
    });
    expect(result.responses[0].response_type).toBe("classification");
    expect(result.responses[0].response_payload).toEqual({
      categoryId: "insider",
      itemId: "sort-01"
    });
  });

  it("does not translate week2 letters onto genuine classification activities", () => {
    expect(mapper.isFormativeClassificationOptionActivity?.("week5-impact-classification")).toBe(false);
    expect(
      canonicaliseFormativeClassificationResponse(
        mapper,
        "week5-impact-classification",
        "classification",
        { categoryId: "threat", itemId: "x" }
      )
    ).toEqual({
      response_type: "classification",
      response_payload: { categoryId: "threat", itemId: "x" }
    });
  });

  it("leaves existing single-choice option-case canonicalisation unchanged", async () => {
    const result = await resolveFormativeContract({
      activityKey: "week2-malware-symptoms",
      activityVersion: "1.0.0",
      responses: [{
        question_id: "week2-malware-symptoms:mw-q1",
        response_type: "single-choice",
        response_payload: { optionId: "b" }
      }]
    });
    expect(result.responses[0].question_id).toBe("MW-Q1");
    expect(result.responses[0].response_type).toBe("single-choice");
    expect(result.responses[0].response_payload).toEqual({ optionId: "B" });
  });
});

describe("production-shaped classification formative RPC", () => {
  const mapper = loadMapper();
  const resolveFormativeContract = createUnit3FormativeContractResolver(async () => mapper);

  it("sends canonical single-choice optionId for a sort item", async () => {
    const { client, calls } = fakeSupabaseRpc(() => ([{
      question_id: "SORT-01",
      awarded_score: 1,
      max_score: 1,
      is_correct: true,
      requires_review: false,
      marking_source: "server",
      can_retry: true
    }]));
    const api = {
      markFormativeResponse: (payload: Record<string, unknown>) =>
        client.schema("api").rpc("mark_formative_response", payload).then((r: { data: unknown }) => r.data)
    };
    const marking = createFormativeMarkingService({
      auth: { isSignedIn: () => true },
      api,
      resolveFormativeContract
    });
    await marking.markBlock({
      activityKey: "week2-threat-vulnerability-sort",
      activityVersion: "1.0.0",
      block: {
        id: "week2-threat-vulnerability-sort-classification",
        type: "classification",
        content: {
          formative: true,
          questionId: "week2-threat-vulnerability-sort",
          items: [{ id: "sort-01" }]
        }
      },
      responses: { "sort-01": "threat" }
    });
    expect(calls[0].payload.p_activity_key).toBe("week2-threat-vulnerability-sort");
    expect(calls[0].payload.p_activity_version).toBe("1.1.0");
    expect(calls[0].payload.p_responses).toEqual([{
      question_id: "SORT-01",
      response_type: "single-choice",
      response_payload: { optionId: "A" }
    }]);
    expect(JSON.stringify(calls[0].payload)).not.toMatch(/categoryId|correctOptionId|correctCategoryId/);
  });

  it("sends canonical single-choice optionId for an attacker-case item", async () => {
    const { client, calls } = fakeSupabaseRpc(() => ([{
      question_id: "C1",
      awarded_score: 1,
      max_score: 1,
      is_correct: true,
      requires_review: false,
      marking_source: "server",
      can_retry: true
    }]));
    const api = {
      markFormativeResponse: (payload: Record<string, unknown>) =>
        client.schema("api").rpc("mark_formative_response", payload).then((r: { data: unknown }) => r.data)
    };
    const marking = createFormativeMarkingService({
      auth: { isSignedIn: () => true },
      api,
      resolveFormativeContract
    });
    await marking.markBlock({
      activityKey: "week3-attacker-case-matching",
      activityVersion: "1.0.0",
      block: {
        id: "week3-attacker-case-matching-classification",
        type: "classification",
        content: {
          formative: true,
          questionId: "week3-attacker-case-matching",
          items: [{ id: "C1" }]
        }
      },
      responses: { C1: "insider" }
    });
    expect(calls[0].payload.p_responses).toEqual([{
      question_id: "C1",
      response_type: "single-choice",
      response_payload: { optionId: "insider" }
    }]);
  });

  it("sends canonical single-choice optionId for a targets-methods item", async () => {
    const { client, calls } = fakeSupabaseRpc(() => ([{
      question_id: "TM1",
      awarded_score: 1,
      max_score: 1,
      is_correct: true,
      requires_review: false,
      marking_source: "server",
      can_retry: true
    }]));
    const api = {
      markFormativeResponse: (payload: Record<string, unknown>) =>
        client.schema("api").rpc("mark_formative_response", payload).then((r: { data: unknown }) => r.data)
    };
    const marking = createFormativeMarkingService({
      auth: { isSignedIn: () => true },
      api,
      resolveFormativeContract
    });
    await marking.markBlock({
      activityKey: "week4-targets-methods",
      activityVersion: "1.0.0",
      block: {
        id: "week4-targets-methods-classification",
        type: "classification",
        content: {
          formative: true,
          questionId: "week4-targets-methods",
          items: [{ id: "tm1" }]
        }
      },
      responses: { tm1: "motivation" }
    });
    expect(calls[0].payload.p_activity_version).toBe("1.1.0");
    expect(calls[0].payload.p_responses).toEqual([{
      question_id: "TM1",
      response_type: "single-choice",
      response_payload: { optionId: "motivation" }
    }]);
  });
});
