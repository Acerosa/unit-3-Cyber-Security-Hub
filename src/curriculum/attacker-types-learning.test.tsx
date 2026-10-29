import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { learnerSafePackage } from "@learning-platform/content";
import { afterEach, describe, expect, it, vi } from "vitest";
import pkg from "../../content/unit-3-cyber-security/package.json";
import { ActivityBlock } from "@learning-platform/ui";
import { catalogueActivity, cataloguePlayerMode } from "../catalogue/week-activities";
import { configureBundledPackage } from "./runtime-weeks";
import { ActivityPage } from "../pages/ActivityPage";

type Block = {
  id?: string;
  type?: string;
  content?: {
    prompt?: string;
    scenario?: string;
    text?: string;
    correctOptionId?: string;
    options?: Array<{ id: string; label: string }>;
    feedback?: { correct?: string; incorrect?: string };
    level?: number;
  };
};

const ACTIVITY_ID = "week3-attacker-types-learning";
const GENERIC_PROMPT = "Which OCR attacker type is most likely?";

function isAttackerQuestion(block: Block) {
  return block.type === "single-choice" && String(block.content?.prompt || "").includes(GENERIC_PROMPT);
}
const contentPackage = pkg as import("./from-package").ContentPackage;

function attackerActivity() {
  const activity = (contentPackage.activities || []).find((item) => item.id === ACTIVITY_ID);
  if (!activity) throw new Error("missing attacker types activity");
  return activity;
}

function choiceBlocks(activity: { blocks?: Block[] }) {
  return (activity.blocks || []).filter(isAttackerQuestion);
}

afterEach(() => {
  delete window.__lpPackage;
  delete window.__lpLivePackage;
  delete window.Unit3Week2Progress;
  delete window.Unit3Week3Progress;
  cleanup();
});

describe("Attacker Types Learning scenarios", () => {
  it("keeps the situation once in prompt, with one correct option and evidence-based feedback", () => {
    const questions = choiceBlocks(attackerActivity());
    expect(questions).toHaveLength(8);
    const answers = new Set<string>();
    for (const block of questions) {
      const content = block.content || {};
      const prompt = String(content.prompt || "");
      const evidence = prompt.split("\n\n")[0] || "";
      const options = content.options || [];
      const correct = options.find((option) => option.id === content.correctOptionId);
      expect(content.scenario).toBeUndefined();
      expect(evidence.length).toBeGreaterThan(120);
      expect(prompt.endsWith(GENERIC_PROMPT)).toBe(true);
      expect(prompt.split(GENERIC_PROMPT).length - 1).toBe(1);
      expect(correct?.label).toBeTruthy();
      answers.add(String(correct?.label));
      for (const option of options) {
        expect(evidence.toLowerCase().includes(option.label.toLowerCase())).toBe(false);
      }
      expect(String(content.feedback?.correct || "").length).toBeGreaterThan(80);
      expect(String(content.feedback?.incorrect || "").length).toBeGreaterThan(40);
      expect(content.feedback?.incorrect).not.toMatch(/avoid stereotypes/i);
      expect(content.feedback?.correct?.toLowerCase()).toContain(String(correct?.label).toLowerCase());
    }
    expect(answers).toEqual(new Set([
      "Hacktivist",
      "Cyber-criminal",
      "Insider",
      "Script kiddie",
      "Vulnerability broker",
      "Scammer",
      "Phisher",
      "Cyber-terrorist"
    ]));
  });

  it("teaches the eight OCR types before the formative questions", () => {
    const blocks = (attackerActivity().blocks || []) as Block[];
    const firstQuestion = blocks.findIndex((block) => isAttackerQuestion(block));
    const headings = blocks
      .slice(0, firstQuestion)
      .filter((block) => block.type === "heading" && block.content?.level === 3)
      .map((block) => block.content?.text);
    expect(headings).toEqual([
      "Hacktivist",
      "Cyber-criminal",
      "Insider",
      "Script kiddie",
      "Vulnerability broker",
      "Scammer",
      "Phisher",
      "Cyber-terrorist",
      "Pairs that are easy to mix up",
      "Insiders at Northbank"
    ]);
    expect(String(blocks.find((block) => block.id?.endsWith("-intro"))?.content?.text || "")).toMatch(/eight OCR attacker types/i);
  });

  it("still exposes the situation after learner answer keys are removed", () => {
    const safe = learnerSafePackage(attackerActivity()) as { blocks?: Block[] };
    for (const block of choiceBlocks(safe)) {
      expect(block.content?.scenario).toBeUndefined();
      expect(String(block.content?.prompt || "").length).toBeGreaterThan(120);
      expect(block.content?.correctOptionId).toBeUndefined();
      expect(String(block.content?.feedback?.correct || "").length).toBeGreaterThan(80);
    }
  });

  it("renders the scenario before the question and keeps check, retry and feedback", () => {
    window.__lpPackage = contentPackage;
    configureBundledPackage(contentPackage);
    window.Unit3Week3Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-3-attacker-types-learning",
          section: "week-3",
          root: "../..",
          view: "activity",
          week: 3,
          activity: "attacker-types-learning"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(screen.getByRole("heading", { name: "Hacktivist" })).toBeTruthy();
    const firstQuestion = document.querySelector(
      '[data-lp-block-id="week3-attacker-types-learning-q-1-KC1"]'
    ) as HTMLElement;
    expect(firstQuestion).toBeTruthy();
    expect(firstQuestion.textContent).toMatch(/funding campaign/);
    expect(firstQuestion.textContent?.match(/funding campaign/g)).toHaveLength(1);
    expect(firstQuestion.querySelector("[data-lp-scenario]")).toBeNull();
    const teaching = screen.getByRole("heading", { name: "Hacktivist" });
    expect(teaching.compareDocumentPosition(firstQuestion) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(firstQuestion).getByRole("group", { name: /funding campaign/ })).toBeTruthy();

    const insider = document.querySelector(
      '[data-lp-block-id="week3-attacker-types-learning-q-3-KC3"]'
    ) as HTMLElement;
    expect(insider.textContent).toMatch(/records officer/);
    expect(insider.textContent?.match(/records officer/g)).toHaveLength(1);
    fireEvent.click(within(insider).getByRole("radio", { name: /Scammer/ }));
    fireEvent.click(within(insider).getByRole("button", { name: "Check answer" }));
    expect(within(insider).getByRole("alert").textContent).toMatch(/how this person reached the files/i);
    fireEvent.click(within(insider).getByRole("button", { name: "Try again" }));
    expect(within(insider).queryByRole("alert")).toBeNull();
    fireEvent.click(within(insider).getByRole("radio", { name: /Insider/ }));
    fireEvent.click(within(insider).getByRole("button", { name: "Check answer" }));
    const feedback = insider.querySelector("[data-lp-feedback-state='correct']");
    expect(feedback?.textContent).toMatch(/legitimate access/i);
  });

  it("renders a separate scenario when that evidence is not already in the prompt", () => {
    render(
      <ActivityBlock
        block={{
          id: "fixture-scenario",
          type: "single-choice",
          content: {
            prompt: GENERIC_PROMPT,
            scenario: "A caller asks reception for a remote-access code and claims to be from IT support.",
            options: [
              { id: "A", label: "Hacktivist" },
              { id: "B", label: "Scammer" }
            ]
          }
        }}
      />
    );
    const scenario = document.querySelector("[data-lp-scenario]");
    expect(scenario?.textContent).toMatch(/remote-access code/);
    expect(document.body.textContent?.match(/remote-access code/g)).toHaveLength(1);
    expect(screen.getByRole("group", { name: GENERIC_PROMPT }).getAttribute("aria-describedby")).toBe(
      "fixture-scenario-scenario"
    );
  });

  it("keeps Week 2 OCR evidence on the host quiz, separate from the short command", () => {
    const activity = (contentPackage.activities || []).find((item) => item.id === "week2-ocr-question-practice");
    expect(cataloguePlayerMode(2, "week2-ocr-question-practice", activity || null)).toBe("host");
    const separate = ((activity?.blocks || []) as Block[]).filter(
      (block) => typeof block.content?.scenario === "string" && block.content.scenario.trim()
    );
    expect(separate.map((block) => block.id)).toEqual([
      "week2-ocr-question-practice-q-4-ocr-q4",
      "week2-ocr-question-practice-q-5-ocr-q5",
      "week2-ocr-question-practice-q-7-ocr-q7"
    ]);
    for (const block of separate) {
      const scenario = String(block.content?.scenario);
      expect(String(block.content?.prompt || "").includes(scenario)).toBe(false);
    }
  });

  it("renders Week 2 retrieval evidence from the prompt, once", () => {
    window.__lpPackage = contentPackage;
    configureBundledPackage(contentPackage);
    window.Unit3Week2Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-2-session2-retrieval",
          section: "week-2",
          root: "../..",
          view: "activity",
          week: 2,
          activity: "session2-retrieval"
        }}
        contentReady
        adaptersReady
      />
    );

    const threat = document.querySelector('[data-lp-block-id="week2-session2-retrieval-q-9-s2-q9"]') as HTMLElement;
    expect(threat.textContent).toMatch(/pretends to be from IT support/);
    expect(threat.textContent?.match(/pretends to be from IT support/g)).toHaveLength(1);
    expect(within(threat).getByRole("group", { name: /what is the threat/ })).toBeTruthy();
    const catalogue = catalogueActivity(contentPackage, "week2-session2-retrieval");
    const unchanged = (catalogue?.blocks || []).find((block) => block.id === "week2-session2-retrieval-q-8-s2-q8");
    expect((unchanged?.content as { scenario?: string } | undefined)?.scenario).toBeUndefined();
  });
});
