import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import pkg from "../../content/unit-3-cyber-security/package.json";
import { configureBundledPackage } from "../curriculum/runtime-weeks";
import { JOIN_CLASS_MESSAGE, withEnrolmentGuardedMarking } from "../enrolment";
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

  it("persists a checked catalogue response without submitting an attempt", async () => {
    window.__lpPackage = pkg;
    window.Unit3Week5Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    const save = vi.fn();
    const submit = vi.fn();
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
          save,
          hydrate: async () => null
        })
      },
      submission: { submit }
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
      expect(save).toHaveBeenCalled();
    });
    const persisted = save.mock.calls.some((call) => {
      const payload = call[0] || {};
      const checked = payload.checked && typeof payload.checked === "object"
        ? Object.values(payload.checked).some(Boolean)
        : false;
      return payload.completed === false && checked;
    });
    expect(persisted).toBe(true);
    expect(submit).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Finish activity" })).toBeNull();
  });

  it("shows join-class feedback instead of a generic retry when other-course ready blocks marking", async () => {
    window.__lpPackage = pkg;
    window.Unit3Week5Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    const markBlock = vi.fn(async () => ({ completed: true, correct: true }));
    const platform = withEnrolmentGuardedMarking(
      {
        marking: { markBlock },
        learner: {
          getState: () => ({
            context: { enrolments: [{ status: "active", groupCode: "TLEVEL-DSD-Y2" }] }
          })
        }
      },
      () => "ready"
    );

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

    expect(await screen.findByText(JOIN_CLASS_MESSAGE)).toBeTruthy();
    expect(markBlock).not.toHaveBeenCalled();
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

  it("shows Correct and authored feedback after a successful Week 1 check", async () => {
    window.__lpPackage = pkg;
    const platform = {
      marking: {
        markBlock: vi.fn(async () => ({
          completed: true,
          correct: true,
          score: { correct: 1, total: 1 },
          status: "correct",
          canRetry: true
        }))
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
    expect(first.closest("[data-lp-activity-version]")?.getAttribute("data-lp-activity-version")).toBe("1.0.0");
    fireEvent.click(within(first).getByRole("radio", { name: "False" }));
    fireEvent.click(within(first).getByRole("button", { name: "Check answer" }));

    await waitFor(() => {
      expect(first.querySelector("[data-lp-feedback-state='correct']")).toBeTruthy();
    });
    expect(within(first).getByText(/Cyber security protects information systems, networks and data/)).toBeTruthy();
    const payload = platform.marking.markBlock.mock.calls[0][0];
    expect(payload.activityKey).toBe("u3-w01-misconceptions");
    expect(payload.activityVersion).toBe("1.0.0");
    expect(payload.block.content.questionId).toBe("u3-w01-misconceptions:m1");
    expect(JSON.stringify(payload)).not.toMatch(/correctOptionId/);
  });

  it("shows Incorrect and authored feedback for a wrong Week 1 answer", async () => {
    window.__lpPackage = pkg;
    const platform = {
      marking: {
        markBlock: vi.fn(async () => ({
          completed: true,
          correct: false,
          score: { correct: 0, total: 1 },
          status: "incorrect",
          canRetry: true
        }))
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
    fireEvent.click(within(first).getByRole("radio", { name: "True" }));
    fireEvent.click(within(first).getByRole("button", { name: "Check answer" }));

    await waitFor(() => {
      expect(first.querySelector("[data-lp-feedback-state='incorrect']")).toBeTruthy();
    });
    expect(within(first).getByText(/Cyber security protects information systems, networks and data/)).toBeTruthy();
  });

  it("replaces the latest checked response on retry", async () => {
    window.__lpPackage = pkg;
    const save = vi.fn();
    const markBlock = vi.fn()
      .mockResolvedValueOnce({
        completed: true,
        correct: false,
        score: { correct: 0, total: 1 },
        status: "incorrect",
        canRetry: true
      })
      .mockResolvedValueOnce({
        completed: true,
        correct: true,
        score: { correct: 1, total: 1 },
        status: "correct",
        canRetry: true
      });
    const platform = {
      auth: { isSignedIn: () => true },
      marking: { markBlock },
      progress: {
        createStore: () => ({
          save,
          hydrate: async () => null
        })
      },
      submission: { submit: vi.fn() }
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
    fireEvent.click(within(first).getByRole("radio", { name: "True" }));
    fireEvent.click(within(first).getByRole("button", { name: "Check answer" }));
    await waitFor(() => {
      expect(first.querySelector("[data-lp-feedback-state='incorrect']")).toBeTruthy();
    });
    expect(within(first).getByText(/Cyber security protects information systems, networks and data/)).toBeTruthy();
    expect(screen.queryByText("Your answer was recorded.")).toBeNull();
    const incorrectSave = save.mock.calls.map((call) => call[0]).find((payload) => (
      payload?.results?.["u3-w01-misconceptions:m1"]?.correct === false
    ));
    expect(incorrectSave?.checked["u3-w01-misconceptions:m1"]).toBe(true);
    expect(incorrectSave?.responses["u3-w01-misconceptions:m1"]).toBe("true");
    fireEvent.click(within(first).getByRole("button", { name: "Try again" }));
    fireEvent.click(within(first).getByRole("radio", { name: "False" }));
    fireEvent.click(within(first).getByRole("button", { name: "Check answer" }));
    await waitFor(() => {
      expect(first.querySelector("[data-lp-feedback-state='correct']")).toBeTruthy();
    });
    expect(markBlock).toHaveBeenCalledTimes(2);
    expect(markBlock.mock.calls[1][0].responses).toEqual({ optionId: "false" });
    const lastSave = save.mock.calls.at(-1)?.[0];
    expect(lastSave.checked["u3-w01-misconceptions:m1"]).toBe(true);
    expect(lastSave.responses["u3-w01-misconceptions:m1"]).toBe("false");
    expect(lastSave.results["u3-w01-misconceptions:m1"]).toEqual(expect.objectContaining({
      correct: true,
      status: "correct"
    }));
    expect(lastSave.completed).toBe(false);
    expect(JSON.stringify(lastSave)).not.toMatch(/correctOptionId/);
  });

  it("hydrates a persisted checked response after mount", async () => {
    window.__lpPackage = pkg;
    const platform = {
      auth: { isSignedIn: () => true },
      marking: { markBlock: vi.fn() },
      progress: {
        createStore: () => ({
          save: vi.fn(),
          hydrate: async () => ({
            responses: { "u3-w01-misconceptions:m1": "false" },
            checked: { "u3-w01-misconceptions:m1": true },
            completed: false
          })
        })
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

    expect(await screen.findByText("Your answer was recorded.")).toBeTruthy();
    const first = document.querySelector('[data-lp-block="option-cards"]') as HTMLElement;
    expect((within(first).getByRole("radio", { name: /False/ }) as HTMLInputElement).checked).toBe(true);
  });

  it("does not replace Incorrect feedback with recorded when hydrate arrives after Check", async () => {
    window.__lpPackage = pkg;
    const markBlock = vi.fn(async () => ({
      completed: true,
      correct: false,
      score: { correct: 0, total: 1 },
      status: "incorrect",
      canRetry: true
    }));
    let resolveHydrate: ((value: unknown) => void) | undefined;
    const platform = {
      auth: { isSignedIn: () => true },
      marking: { markBlock },
      progress: {
        createStore: () => ({
          save: vi.fn(),
          hydrate: () => new Promise((resolve) => {
            resolveHydrate = resolve;
          })
        })
      },
      submission: { submit: vi.fn() }
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
    fireEvent.click(within(first).getByRole("radio", { name: "True" }));
    fireEvent.click(within(first).getByRole("button", { name: "Check answer" }));
    await waitFor(() => {
      expect(first.querySelector("[data-lp-feedback-state='incorrect']")).toBeTruthy();
    });
    expect(within(first).getByText(/Cyber security protects information systems, networks and data/)).toBeTruthy();
    resolveHydrate?.({
      responses: { "u3-w01-misconceptions:m1": "true" },
      checked: { "u3-w01-misconceptions:m1": true },
      completed: false
    });
    await waitFor(() => {
      expect(first.querySelector("[data-lp-feedback-state='incorrect']")).toBeTruthy();
    });
    expect(within(first).getByText(/Cyber security protects information systems, networks and data/)).toBeTruthy();
    expect(screen.queryByText("Your answer was recorded.")).toBeNull();
    expect(markBlock).toHaveBeenCalledTimes(1);
  });

  it("restores Incorrect and authored feedback after remount without marking again", async () => {
    window.__lpPackage = pkg;
    const markBlock = vi.fn();
    const platform = {
      auth: { isSignedIn: () => true },
      marking: { markBlock },
      progress: {
        createStore: () => ({
          save: vi.fn(),
          hydrate: async () => ({
            responses: { "u3-w01-misconceptions:m1": "true" },
            checked: { "u3-w01-misconceptions:m1": true },
            results: {
              "u3-w01-misconceptions:m1": {
                correct: false,
                status: "incorrect",
                canRetry: true,
                score: { correct: 0, total: 1 }
              }
            },
            completed: false
          })
        })
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
    expect(await screen.findByText(/Cyber security protects information systems, networks and data/)).toBeTruthy();
    expect(first.querySelector("[data-lp-feedback-state='incorrect']")).toBeTruthy();
    expect((within(first).getByRole("radio", { name: /True/ }) as HTMLInputElement).checked).toBe(true);
    expect(screen.queryByText("Your answer was recorded.")).toBeNull();
    expect(markBlock).not.toHaveBeenCalled();
  });

  it("restores Correct and authored feedback after remount without marking again", async () => {
    window.__lpPackage = pkg;
    const markBlock = vi.fn();
    const platform = {
      auth: { isSignedIn: () => true },
      marking: { markBlock },
      progress: {
        createStore: () => ({
          save: vi.fn(),
          hydrate: async () => ({
            responses: { "u3-w01-misconceptions:m1": "false" },
            checked: { "u3-w01-misconceptions:m1": true },
            results: {
              "u3-w01-misconceptions:m1": {
                correct: true,
                status: "correct",
                canRetry: true,
                score: { correct: 1, total: 1 }
              }
            },
            completed: false
          })
        })
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
    expect(await screen.findByText(/Cyber security protects information systems, networks and data/)).toBeTruthy();
    expect(first.querySelector("[data-lp-feedback-state='correct']")).toBeTruthy();
    expect((within(first).getByRole("radio", { name: /False/ }) as HTMLInputElement).checked).toBe(true);
    expect(screen.queryByText("Your answer was recorded.")).toBeNull();
    expect(markBlock).not.toHaveBeenCalled();
  });

  it("does not invent Correct or Incorrect for a saved unchecked draft", async () => {
    window.__lpPackage = pkg;
    const markBlock = vi.fn();
    const platform = {
      auth: { isSignedIn: () => true },
      marking: { markBlock },
      progress: {
        createStore: () => ({
          save: vi.fn(),
          hydrate: async () => ({
            responses: { "u3-w01-misconceptions:m1": "true" },
            checked: { "u3-w01-misconceptions:m1": false },
            completed: false
          })
        })
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
    await waitFor(() => {
      expect((within(first).getByRole("radio", { name: /True/ }) as HTMLInputElement).checked).toBe(true);
    });
    expect(first.querySelector("[data-lp-feedback-state='correct']")).toBeNull();
    expect(first.querySelector("[data-lp-feedback-state='incorrect']")).toBeNull();
    expect(screen.queryByText("Your answer was recorded.")).toBeNull();
    expect(markBlock).not.toHaveBeenCalled();
  });

  it("keeps checked state after the activity is submitted", async () => {
    window.__lpPackage = pkg;
    const platform = {
      auth: { isSignedIn: () => true },
      marking: { markBlock: vi.fn() },
      progress: {
        createStore: () => ({
          save: vi.fn(),
          hydrate: async () => ({
            responses: { "u3-w01-misconceptions:m1": "false" },
            checked: { "u3-w01-misconceptions:m1": true },
            completed: false,
            submission: { status: "submitted" }
          })
        })
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

    expect(await screen.findByText("Your answer was recorded.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Finish activity" })).toBeNull();
  });

  it("surfaces an assignment failure instead of inventing a local mark", async () => {
    window.__lpPackage = pkg;
    const platform = {
      marking: {
        markBlock: vi.fn(async () => {
          throw Object.assign(new Error("This activity is not assigned to you. Contact your tutor."), {
            code: "ACTIVITY_NOT_ASSIGNED",
            learnerMessage: "This activity is not assigned to you. Contact your tutor."
          });
        })
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
    fireEvent.click(within(first).getByRole("radio", { name: "False" }));
    fireEvent.click(within(first).getByRole("button", { name: "Check answer" }));

    expect(await screen.findByText("This activity is not assigned to you. Contact your tutor.")).toBeTruthy();
    expect(first.querySelector("[data-lp-feedback-state='correct']")).toBeNull();
  });
});
