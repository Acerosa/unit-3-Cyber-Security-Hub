import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import pkg from "../../content/unit-3-cyber-security/package.json";
import { configureBundledPackage } from "../curriculum/runtime-weeks";
import { ActivityPage } from "./ActivityPage";

vi.mock("../adapters/load-hub-adapters", () => ({
  loadHubAdapters: async () => {},
  loadPageScripts: async () => {}
}));

beforeAll(() => {
  configureBundledPackage(pkg as import("../curriculum/from-package").ContentPackage);
});

afterEach(() => {
  delete window.Unit3Week1Progress;
  delete window.Unit3BackendProgress;
  delete window.__lpPackage;
  cleanup();
});

function week1MisconceptionsContext() {
  return {
    page: "week-1-misconceptions",
    section: "week-1",
    root: "../..",
    view: "activity" as const,
    week: 1,
    activity: "misconceptions"
  };
}

async function checkEveryMisconception() {
  const blocks = [...document.querySelectorAll('[data-lp-block="option-cards"]')] as HTMLElement[];
  expect(blocks.length).toBeGreaterThan(0);
  for (const block of blocks) {
    fireEvent.click(within(block).getByRole("radio", { name: "False" }));
    fireEvent.click(within(block).getByRole("button", { name: "Check answer" }));
    await waitFor(() => {
      expect(block.querySelector("[data-lp-feedback-state]")).toBeTruthy();
    });
  }
}

describe("ActivityPage P0 persistence and finish", () => {
  it("forces progress reconcile after a successful Finish", async () => {
    window.__lpPackage = pkg;
    const reconcile = vi.fn(async () => []);
    window.Unit3BackendProgress = { reconcile };
    const submit = vi.fn(async () => ({ status: "completed" }));
    const platform = {
      auth: { isSignedIn: () => true },
      marking: {
        markBlock: vi.fn(async () => ({
          completed: true,
          correct: true,
          score: { correct: 1, total: 1 },
          status: "correct"
        }))
      },
      progress: {
        createStore: () => ({
          save: vi.fn(),
          hydrate: async () => null,
          isDirty: () => false
        })
      },
      submission: { submit }
    };

    render(
      <ActivityPage
        context={week1MisconceptionsContext()}
        contentReady
        adaptersReady
        platform={platform}
      />
    );

    await checkEveryMisconception();
    fireEvent.click(await screen.findByRole("button", { name: "Finish activity" }));

    await waitFor(() => {
      expect(submit).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(reconcile).toHaveBeenCalledWith({ force: true });
    });
    expect(screen.getByText("Saved to your learning record.")).toBeTruthy();
  });

  it("does not treat a failed Finish as remotely completed", async () => {
    window.__lpPackage = pkg;
    const reconcile = vi.fn(async () => []);
    window.Unit3BackendProgress = { reconcile };
    const submit = vi.fn(async () => {
      throw new Error("NETWORK_ERROR");
    });
    const platform = {
      auth: { isSignedIn: () => true },
      marking: {
        markBlock: vi.fn(async () => ({
          completed: true,
          correct: true,
          score: { correct: 1, total: 1 },
          status: "correct"
        }))
      },
      progress: {
        createStore: () => ({
          save: vi.fn(),
          hydrate: async () => null,
          isDirty: () => false
        })
      },
      submission: { submit }
    };

    render(
      <ActivityPage
        context={week1MisconceptionsContext()}
        contentReady
        adaptersReady
        platform={platform}
      />
    );

    await checkEveryMisconception();
    fireEvent.click(await screen.findByRole("button", { name: "Finish activity" }));

    expect(await screen.findByText(/has not been sent to your learning record/)).toBeTruthy();
    expect(reconcile).not.toHaveBeenCalledWith({ force: true });
    expect(screen.getByRole("button", { name: "Finish activity" })).toBeTruthy();
  });

  it("shows Saved after a confirmed remote draft persist", async () => {
    window.__lpPackage = pkg;
    const listeners: Array<(snapshot: {
      status: string;
      dirty: boolean;
      saving: boolean;
      lastRemoteSaveSucceeded: boolean;
    }) => void> = [];
    let lastSnapshot = {
      status: "idle",
      dirty: false,
      saving: false,
      lastRemoteSaveSucceeded: null as boolean | null
    };
    const store = {
      save: vi.fn(() => {
        lastSnapshot = {
          status: "synced",
          dirty: false,
          saving: false,
          lastRemoteSaveSucceeded: true
        };
        listeners.forEach((listener) => listener(lastSnapshot));
      }),
      hydrate: async () => null,
      isDirty: () => false,
      persistStatus: () => lastSnapshot,
      subscribePersistStatus: (listener: (snapshot: {
        status: string;
        dirty: boolean;
        saving: boolean;
        lastRemoteSaveSucceeded: boolean;
      }) => void) => {
        listeners.push(listener);
        return () => {};
      }
    };
    const platform = {
      auth: { isSignedIn: () => true },
      marking: {
        markBlock: vi.fn(async () => ({
          completed: true,
          correct: true,
          score: { correct: 1, total: 1 },
          status: "correct"
        }))
      },
      progress: {
        createStore: () => store
      }
    };

    render(
      <ActivityPage
        context={week1MisconceptionsContext()}
        contentReady
        adaptersReady
        platform={platform}
      />
    );

    const first = document.querySelector('[data-lp-block="option-cards"]') as HTMLElement;
    fireEvent.click(within(first).getByRole("radio", { name: /False/ }));
    fireEvent.click(within(first).getByRole("button", { name: "Check answer" }));

    await waitFor(() => {
      expect(store.save).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(document.querySelector('[data-lp-persist-status="saved"]')?.textContent).toMatch(/Saved/);
    });
  });
});
