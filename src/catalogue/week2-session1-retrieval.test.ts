import { describe, expect, it } from "vitest";
import type { ActivityDocument, ActivityResult } from "@learning-platform/ui";
import {
  evidenceQuestionId,
  incorrectQuestionNumbers,
  publishedActivity,
  scorableBlocks,
  scriptsForActivityPage,
  toSubmitResponses
} from "./week2-session1-retrieval";

const sample: ActivityDocument = {
  id: "week2-session1-retrieval",
  version: "1.0.0",
  metadata: { title: "Session 1 Retrieval Quiz", summary: "hidden in the catalogue view" },
  blocks: [
    { id: "title", type: "heading", content: { prompt: "Session 1 Retrieval Quiz" } },
    {
      id: "q1",
      type: "single-choice",
      content: {
        questionId: "week2-session1-retrieval:s1-q1",
        prompt: "Which statement best describes cyber security?",
        options: [
          { id: "a", label: "Wrong" },
          { id: "b", label: "Protecting systems, networks and data" }
        ],
        correctOptionId: "b"
      }
    }
  ]
};

(sample.blocks![1].content as { sourceQuestionId?: string }).sourceQuestionId = "s1-q1";

describe("Week 2 Session 1 Retrieval catalogue pilot", () => {
  it("keeps progress and submit scripts and drops the week quiz engine", () => {
    expect(scriptsForActivityPage("week-2-session1-retrieval", [
      "js/week2-progress.js",
      "js/core/backend-progress.js",
      "js/week2-submit.js",
      "js/week2-quiz.js",
      "week-2/data/retrieval-session-1.js",
      "week-2/session1-retrieval/app.js"
    ])).toEqual([
      "js/week2-progress.js",
      "js/core/backend-progress.js",
      "js/week2-submit.js"
    ]);
    expect(scriptsForActivityPage("week-2-session2-retrieval", ["js/week2-quiz.js"])).toEqual([
      "js/week2-quiz.js"
    ]);
  });

  it("maps InteractiveActivity results onto the existing Week 2 submit evidence shape", () => {
    const activity = publishedActivity({ activities: [sample] }, "week2-session1-retrieval");
    const blocks = scorableBlocks(activity);
    expect(activity?.metadata?.title).toBeUndefined();
    expect(blocks).toHaveLength(1);
    expect(evidenceQuestionId(blocks[0])).toBe("s1-q1");

    const results: Record<string, ActivityResult> = {
      "week2-session1-retrieval:s1-q1": {
        completed: true,
        correct: true,
        attempts: 1,
        score: { correct: 1, total: 1 },
        responses: { optionId: "b" }
      }
    };
    expect(toSubmitResponses(blocks, results)).toEqual([
      {
        questionId: "s1-q1",
        response: {
          chosenIndex: 1,
          selectedOption: {
            id: "b",
            label: "Protecting systems, networks and data",
            optionId: "b",
            text: "Protecting systems, networks and data"
          }
        },
        correct: true,
        score: 1,
        responseType: "single-choice"
      }
    ]);
    expect(incorrectQuestionNumbers(blocks, results)).toEqual([]);
  });
});
