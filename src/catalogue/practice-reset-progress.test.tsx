import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import pkg from "../../content/unit-3-cyber-security/package.json";
import { configureBundledPackage } from "../curriculum/runtime-weeks";
import { ActivityPage } from "../pages/ActivityPage";
import { accessibleCatalogueActivityTotal } from "../pages/WeekPage";
import { weekPageFromPackage } from "../curriculum/from-package";
import { activeContentPackage } from "../curriculum/apply-runtime";

vi.mock("../adapters/load-hub-adapters", () => ({
  loadHubAdapters: async () => {},
  loadPageScripts: async () => {}
}));

afterEach(() => {
  cleanup();
  delete window.__lpPackage;
  delete window.__lpLivePackage;
});

function mockPlatform(drafts: Record<string, {
  responses: Record<string, unknown>;
  checked: Record<string, boolean>;
  results?: Record<string, unknown>;
}>) {
  return {
    auth: { isSignedIn: () => true },
    progress: {
      createStore: ({ activityKey }: { activityKey: string }) => ({
        hydrate: async () => drafts[activityKey] || { responses: {}, checked: {}, results: {} },
        save: (state: {
          responses?: Record<string, unknown>;
          checked?: Record<string, boolean>;
          results?: Record<string, unknown>;
        }) => {
          drafts[activityKey] = {
            responses: { ...(state.responses || {}) },
            checked: { ...(state.checked || {}) },
            results: { ...(state.results || {}) }
          };
          return state;
        }
      })
    },
    marking: {
      markBlock: async ({ responses }: { responses: Record<string, string> }) => ({
        completed: true,
        correct: false,
        score: { correct: 0, total: Object.keys(responses || {}).length || 1 },
        status: "incorrect",
        canRetry: true
      })
    }
  };
}

describe("catalogue practice reset and week progress", () => {
  it("counts Week 1 as 56 practice activities", () => {
    configureBundledPackage(pkg as import("../curriculum/from-package").ContentPackage);
    window.__lpPackage = pkg;
    const content = activeContentPackage();
    const model = weekPageFromPackage(content!, "week-1");
    expect(accessibleCatalogueActivityTotal(content, model)).toBe(56);
  });

  it("clears classification draft responses on Try again without dropping other activity drafts", async () => {
    configureBundledPackage(pkg as import("../curriculum/from-package").ContentPackage);
    window.__lpPackage = pkg;
    const drafts: Record<string, {
      responses: Record<string, unknown>;
      checked: Record<string, boolean>;
      results?: Record<string, unknown>;
    }> = {
      "u3-w01-definition-choice": {
        responses: { "u3-w01-definition-choice:d1": "a" },
        checked: { "u3-w01-definition-choice:d1": true, "u3-w01-definition-choice:d2": true }
      }
    };
    const platform = mockPlatform(drafts);

    render(
      <ActivityPage
        context={{
          page: "week-1-incidents",
          section: "week-1",
          root: "../..",
          view: "activity",
          week: 1,
          activity: "incidents"
        }}
        contentReady
        adaptersReady
        platform={platform}
      />
    );

    await waitFor(() => {
      expect(document.querySelector('[data-lp-block="classification"]')).toBeTruthy();
    });

    const classify = document.querySelector('[data-lp-block="classification"]') as HTMLElement;
    const placeButtons = screen.getAllByRole("button", { name: /Place in / });
    const itemButtons = screen.getAllByRole("button").filter((button) => (
      classify.contains(button)
      && !/Place in |Check types|Try again/i.test(button.textContent || "")
    ));
    expect(itemButtons.length).toBeGreaterThan(0);
    expect(placeButtons.length).toBeGreaterThan(0);

    for (const item of itemButtons) {
      fireEvent.click(item);
      fireEvent.click(placeButtons[0]);
    }
    fireEvent.click(screen.getByRole("button", { name: "Check types" }));

    await waitFor(() => {
      expect(drafts["u3-w01-incidents"]).toBeTruthy();
      expect(drafts["u3-w01-incidents"].checked["u3-w01-incidents"]).toBe(true);
      expect(Object.keys(drafts["u3-w01-incidents"].responses["u3-w01-incidents"] as object).length)
        .toBeGreaterThan(0);
      expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    await waitFor(() => {
      expect(drafts["u3-w01-incidents"].checked["u3-w01-incidents"]).toBe(false);
      expect(drafts["u3-w01-incidents"].responses["u3-w01-incidents"]).toEqual({});
    });
    expect(screen.queryByRole("button", { name: /· Placed/ })).toBeNull();
    expect(drafts["u3-w01-definition-choice"].checked["u3-w01-definition-choice:d1"]).toBe(true);
  });
});
