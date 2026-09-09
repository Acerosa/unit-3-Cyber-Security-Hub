import { afterEach, describe, expect, it, vi } from "vitest";
import type { ActivityDocument } from "@learning-platform/ui";
import { submitCatalogueDraft } from "./activity-draft";

afterEach(() => {
  vi.restoreAllMocks();
});

const malwareActivity = {
  id: "week2-malware-symptoms",
  version: "1.0.0",
  blocks: [
    {
      id: "week2-malware-symptoms-q-1-mw-q1",
      type: "single-choice",
      content: {
        questionId: "week2-malware-symptoms:mw-q1",
        sourceQuestionId: "mw-q1"
      }
    }
  ]
} as ActivityDocument;

describe("catalogue Finish evidence", () => {
  it("submits canonical MW-Q1 instead of the hosted catalogue question id", async () => {
    window.Unit3ActivityKeyMap = {
      catalogueVersionFor: () => "1.1.0",
      normaliseQuestionKey: (questionId: string) => (
        String(questionId || "").trim().toUpperCase() === "MW-Q1" || String(questionId || "").trim() === "mw-q1"
          ? "MW-Q1"
          : String(questionId || "")
      ),
      normaliseActivityVersion: (version: string) => version,
      normaliseOptionId: (value: string) => String(value || "").trim().toUpperCase()
    };
    const submit = vi.fn(async () => ({ status: "completed" }));

    const result = await submitCatalogueDraft(
      malwareActivity,
      {
        responses: { "week2-malware-symptoms:mw-q1": "c" },
        checked: { "week2-malware-symptoms:mw-q1": true },
        completed: false
      },
      {
        auth: { isSignedIn: () => true },
        submission: { submit }
      }
    );

    expect(result.status).toBe("submitted");
    expect(submit).toHaveBeenCalledTimes(1);
    const payload = submit.mock.calls[0][0];
    expect(payload.activityKey).toBe("week2-malware-symptoms");
    expect(payload.activityVersion).toBe("1.0.0");
    expect(payload.responses[0]).toEqual(expect.objectContaining({
      questionKey: "MW-Q1",
      evidenceType: "single-choice",
      value: expect.objectContaining({ optionId: "C" })
    }));
  });
});
