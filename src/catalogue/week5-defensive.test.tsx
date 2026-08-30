import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import pkg from "../../content/unit-3-cyber-security/package.json";
import { configureBundledPackage } from "../curriculum/runtime-weeks";
import { ActivityPage } from "../pages/ActivityPage";
import {
  activityScoreFromResults,
  catalogueActivity,
  scorableBlocks
} from "./week-activities";
import { questionIdFor, type ActivityBlockDocument, type ActivityDocument, type ActivityResult } from "@learning-platform/ui";

vi.mock("../adapters/load-hub-adapters", () => ({
  loadHubAdapters: async () => {},
  loadPageScripts: async () => {}
}));

beforeAll(() => {
  configureBundledPackage(pkg as import("../curriculum/from-package").ContentPackage);
});

afterEach(() => {
  delete window.Unit3Week5Progress;
  delete window.__lpPackage;
  cleanup();
});

function renderActivity(activity: string, page: string) {
  window.__lpPackage = pkg;
  const progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
  window.Unit3Week5Progress = progress;
  render(
    <ActivityPage
      context={{
        page,
        section: "week-5",
        root: "../..",
        view: "activity",
        week: 5,
        activity
      }}
      contentReady
      adaptersReady
    />
  );
  return progress;
}

function optionCard(index: number) {
  const blocks = Array.from(document.querySelectorAll('[data-lp-block="option-cards"]'));
  return blocks[index] as HTMLElement;
}

function checkCard(index: number, optionName: RegExp) {
  const card = optionCard(index);
  fireEvent.click(within(card).getByRole("radio", { name: optionName }));
  fireEvent.click(within(card).getByRole("button", { name: "Check answer" }));
  return card;
}

describe("Week 5 vulnerability identification activities", () => {
  it("renders, rejects an incorrect choice, retries, then accepts the secure pattern", () => {
    renderActivity("vulnerability-patterns", "week-5-vulnerability-patterns");

    const first = optionCard(0);
    expect(within(first).getByRole("group")).toBeTruthy();
    expect(within(first).getByText(/demo login of admin \/ admin/i)).toBeTruthy();

    fireEvent.click(within(first).getByRole("radio", { name: /A threat actor’s motivation/ }));
    fireEvent.click(within(first).getByRole("button", { name: "Check answer" }));
    expect(within(first).getByRole("alert").textContent).toMatch(/Incorrect/);
    expect(within(first).getByText(/Default or shared logins are a vulnerability/)).toBeTruthy();

    fireEvent.click(within(first).getByRole("button", { name: "Try again" }));
    expect(within(first).queryByRole("alert")).toBeNull();

    fireEvent.click(within(first).getByRole("radio", { name: /Weak or default credentials/ }));
    fireEvent.click(within(first).getByRole("button", { name: "Check answer" }));
    expect(first.querySelector("[data-lp-feedback-state='correct']")).toBeTruthy();
    expect(screen.getByText("1 / 8")).toBeTruthy();
    expect(screen.getByText("1 of 8 correct")).toBeTruthy();
  });

  it("scores all pattern checks and records completion through the week progress store", () => {
    const progress = renderActivity("vulnerability-patterns", "week-5-vulnerability-patterns");
    const answers: Array<RegExp> = [
      /Weak or default credentials/,
      /Missing object-level access control/,
      /Untrusted input concatenated into a query/,
      /Secrets in source or config can be reused/,
      /Unpatched or outdated software/,
      /Untrusted text can be treated as HTML/,
      /Excessive permissions/,
      /A code and configuration review/
    ];
    answers.forEach((name, index) => checkCard(index, name));

    expect(progress.markCompleted).toHaveBeenCalledWith("week5-vulnerability-patterns", 8, 8);
    expect(screen.getByText("8 / 8")).toBeTruthy();
  });

  it("classifies threat, vulnerability and risk from keyboard dropdowns", () => {
    const progress = renderActivity("threat-vulnerability-risk", "week-5-threat-vulnerability-risk");
    const classify = document.querySelector('[data-lp-block="classification"]') as HTMLElement;
    expect(classify).toBeTruthy();
    expect(within(classify).getByText(/Use dropdown lists instead/)).toBeTruthy();

    const expected: Record<string, string> = {
      t1: "Vulnerability",
      t2: "Threat",
      t3: "Risk",
      t4: "Vulnerability",
      t5: "Threat",
      t6: "Risk",
      t7: "Vulnerability",
      t8: "Vulnerability"
    };
    Object.entries(expected).forEach(([id, value]) => {
      fireEvent.change(classify.querySelector(`[data-lp-item="${id}"]`) as HTMLSelectElement, {
        target: { value }
      });
    });
    fireEvent.click(within(classify).getByRole("button", { name: "Check types" }));
    expect(classify.querySelector("[data-lp-feedback-state='correct']")).toBeTruthy();
    expect(progress.markCompleted).toHaveBeenCalledWith("week5-threat-vulnerability-risk", 8, 8);
  });

  it("lets learners retry a mis-classified control and then complete scoring", () => {
    const progress = renderActivity("controls-matching", "week-5-controls-matching");
    const classify = document.querySelector('[data-lp-block="classification"]') as HTMLElement;
    fireEvent.change(classify.querySelector('[data-lp-item="c1"]') as HTMLSelectElement, {
      target: { value: "Detection" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c2"]') as HTMLSelectElement, {
      target: { value: "Access control" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c3"]') as HTMLSelectElement, {
      target: { value: "Input validation" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c4"]') as HTMLSelectElement, {
      target: { value: "Secrets hygiene" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c5"]') as HTMLSelectElement, {
      target: { value: "Secrets hygiene" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c6"]') as HTMLSelectElement, {
      target: { value: "Access control" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c7"]') as HTMLSelectElement, {
      target: { value: "Detection" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c8"]') as HTMLSelectElement, {
      target: { value: "Detection" }
    });
    fireEvent.click(within(classify).getByRole("button", { name: "Check types" }));
    expect(within(classify).getByRole("alert").textContent).toMatch(/Incorrect/);

    fireEvent.click(within(classify).getByRole("button", { name: "Try again" }));
    fireEvent.change(classify.querySelector('[data-lp-item="c1"]') as HTMLSelectElement, {
      target: { value: "Patching and updates" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c2"]') as HTMLSelectElement, {
      target: { value: "Access control" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c3"]') as HTMLSelectElement, {
      target: { value: "Input validation" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c4"]') as HTMLSelectElement, {
      target: { value: "Secrets hygiene" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c5"]') as HTMLSelectElement, {
      target: { value: "Secrets hygiene" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c6"]') as HTMLSelectElement, {
      target: { value: "Access control" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c7"]') as HTMLSelectElement, {
      target: { value: "Detection" }
    });
    fireEvent.change(classify.querySelector('[data-lp-item="c8"]') as HTMLSelectElement, {
      target: { value: "Detection" }
    });
    fireEvent.click(within(classify).getByRole("button", { name: "Check types" }));
    expect(classify.querySelector("[data-lp-feedback-state='correct']")).toBeTruthy();
    expect(progress.markCompleted).toHaveBeenCalledWith("week5-controls-matching", 8, 8);
  });

  it("selects secure rewrites without offering real-world exploit steps", () => {
    renderActivity("secure-rewrite", "week-5-secure-rewrite");
    const first = checkCard(0, /Use a parameterised query/);
    expect(first.querySelector("[data-lp-feedback-state='correct']")).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/OR 1=1/i);
    expect(document.body.textContent).not.toMatch(/<script>/i);
    expect(screen.getByRole("textbox")).toBeTruthy();
  });

  it("turns malformed option-cards into a short-response instead of crashing", () => {
    const activity = catalogueActivity(pkg as never, "week5-vulnerability-patterns");
    expect(activity).toBeTruthy();
    const brokenBlocks = activity?.blocks || [];
    const broken = {
      ...activity,
      blocks: brokenBlocks.map((block, index) => {
        if (index !== 3) return block;
        return {
          ...block,
          type: "single-choice",
          content: { ...(block.content || {}), options: [] }
        };
      })
    } as ActivityDocument;
    const normalised = catalogueActivity(
      { ...(pkg as object), activities: [broken] } as never,
      "week5-vulnerability-patterns"
    );
    const converted = (normalised?.blocks || []).find((block) => block.id === brokenBlocks[3]?.id);
    expect(converted?.type).toBe("short-response");
    expect((converted?.content as { prompt?: string })?.prompt).toBeTruthy();
  });

  it("aggregates block scores the same way the activity page records them", () => {
    const activity = catalogueActivity(pkg as never, "week5-secure-rewrite");
    const blocks = scorableBlocks(activity);
    expect(blocks).toHaveLength(6);
    const results: Record<string, ActivityResult> = {};
    blocks.forEach((block: ActivityBlockDocument, index) => {
      results[questionIdFor(block)] = {
        completed: true,
        correct: index !== 1,
        score: { correct: index === 1 ? 0 : 1, total: 1 },
        attempts: 1,
        responses: { optionId: "b" }
      };
    });
    expect(activityScoreFromResults(blocks, results)).toEqual({ correct: 5, total: 6 });
  });
});
