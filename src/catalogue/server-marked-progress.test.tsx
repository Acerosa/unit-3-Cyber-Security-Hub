import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import pkg from "../../content/unit-3-cyber-security/package.json";
import { configureBundledPackage } from "../curriculum/runtime-weeks";
import { ActivityPage } from "../pages/ActivityPage";

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

describe("server-marked catalogue progress", () => {
  it("uses server marking without requiring a local answer key", async () => {
    window.__lpPackage = pkg;
    window.Unit3Week5Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    const platform = {
      marking: {
        markBlock: vi.fn(async () => ({
          completed: true,
          correct: true,
          score: { correct: 1, total: 1 },
          status: "correct"
        }))
      }
    };

    render(
      <ActivityPage
        context={{
          page: "week-5-vulnerability-patterns",
          section: "week-5",
          root: "../..",
          view: "activity",
          week: 5,
          activity: "vulnerability-patterns"
        }}
        contentReady
        adaptersReady
        platform={platform}
      />
    );

    const first = document.querySelector('[data-lp-block="option-cards"]') as HTMLElement;
    fireEvent.click(within(first).getByRole("radio", { name: /A threat actor’s motivation/ }));
    fireEvent.click(within(first).getByRole("button", { name: "Check answer" }));

    await waitFor(() => {
      expect(platform.marking.markBlock).toHaveBeenCalled();
    });
    expect(first.querySelector("[data-lp-feedback-state='correct']")).toBeTruthy();
    expect(screen.getByText("1 / 8")).toBeTruthy();
    const payload = platform.marking.markBlock.mock.calls[0][0];
    expect(JSON.stringify(payload)).not.toMatch(/correctOptionId/);
    expect(payload.responses).toEqual(expect.objectContaining({ optionId: expect.any(String) }));
  });
});
