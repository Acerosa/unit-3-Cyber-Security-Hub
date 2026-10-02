import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import pkg from "../../content/unit-3-cyber-security/package.json";
import sessions from "../../content/unit-3-cyber-security/sessions.json";
import weeks from "../../content/unit-3-cyber-security/weeks.json";
import { countWords, knowledgeReportConfig } from "../catalogue/knowledge-report";
import { configureBundledPackage } from "../curriculum/runtime-weeks";
import { KnowledgeReportPage } from "./KnowledgeReportPage";
import { KnowledgeReportsPage } from "./KnowledgeReportsPage";

const ACTIVITY_ID = "u3-cyber-security-knowledge-report";

beforeAll(() => {
  configureBundledPackage(pkg as never);
  window.__lpPackage = pkg;
  window.Unit3ActivityKeyMap = {
    catalogueVersionFor: () => "1.1.0",
    normaliseQuestionKey: (questionId: string) => questionId.toUpperCase(),
    normaliseActivityVersion: (version: string) => version,
    normaliseOptionId: (value: string) => value
  };
});

afterEach(() => {
  cleanup();
});

function reportActivity() {
  const activity = (pkg.activities || []).find((item) => item.id === ACTIVITY_ID);
  expect(activity).toBeTruthy();
  return activity!;
}

describe("timed knowledge report content", () => {
  it("counts words and ignores empty whitespace", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   \n\t  ")).toBe(0);
    expect(countWords("one  two\nthree")).toBe(3);
  });

  it("keeps the cyber security report outside weeks and sessions", () => {
    expect(JSON.stringify(sessions)).not.toContain(ACTIVITY_ID);
    expect(JSON.stringify(weeks)).not.toContain(ACTIVITY_ID);
  });

  it("names topics in guidance without listing recall answers", () => {
    const activity = reportActivity();
    expect(activity.version).toBe("1.1.0");
    const config = knowledgeReportConfig(activity as never);
    expect(config?.durationMinutes).toBe(30);
    expect(config?.minWords).toBe(500);
    expect(config?.additionalTimeMinutes).toBe(15);
    expect(JSON.stringify(config)).not.toContain("400");
    const guidance = JSON.stringify(config?.guidance || []);
    expect(guidance).toContain("CIA Triad");
    expect(guidance).toContain("Name the three parts.");
    for (const answer of ["Confidentiality", "Integrity", "Availability"]) {
      expect(guidance).not.toContain(answer);
    }
  });
});

describe("Knowledge Report pages", () => {
  function platform() {
    const submit = vi.fn(async () => ({ attempt_id: "attempt" }));
    const store = {
      save: vi.fn(),
      flush: vi.fn(async () => ({
        startedAt: new Date().toISOString(),
        state: { responses: { "u3-cyber-security-knowledge-report-response": "" } }
      })),
      hydrate: vi.fn(async () => null)
    };
    return {
      submit,
      platform: {
        auth: { isSignedIn: () => true },
        progress: { createStore: () => store },
        submission: { submit }
      }
    };
  }

  const context = {
    page: "knowledge-report-cyber-security",
    section: "knowledge-reports",
    root: "../..",
    view: "knowledge-report",
    activityId: ACTIVITY_ID
  };

  it("lists the cyber security report and starts only after Start Task", async () => {
    render(<KnowledgeReportsPage root="." contentReady />);
    expect(screen.getByRole("heading", { name: "Cyber Security Knowledge Report" })).toBeTruthy();
    expect(screen.getByText("30 minutes")).toBeTruthy();
    expect(screen.getByText("Minimum 500 words")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Start Knowledge Report" }).getAttribute("href")).toContain(
      "knowledge-reports/cyber-security/"
    );

    const { platform: hub } = platform();
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    expect(screen.queryByRole("timer")).toBeNull();
    const start = await screen.findByRole("button", { name: "Start Task" });
    fireEvent.click(start);
    expect((await screen.findByRole("timer")).textContent || "").toMatch(/30:00|29:59/);
    expect(screen.getByLabelText("Your report")).toBeTruthy();
  });

  it("resumes the server sitting once sign-in is restored", async () => {
    const startedAt = new Date(Date.now() - 60_000).toISOString();
    let signedIn = false;
    const store = {
      save: vi.fn(),
      flush: vi.fn(),
      hydrate: vi.fn(async () => ({
        startedAt,
        responses: { "u3-cyber-security-knowledge-report-response": "kept after refresh" }
      }))
    };
    const hub = {
      auth: { isSignedIn: () => signedIn },
      progress: { createStore: () => store },
      submission: { submit: vi.fn() }
    };
    const view = render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    expect(await screen.findByRole("button", { name: "Start Task" })).toBeTruthy();
    expect(store.hydrate).not.toHaveBeenCalled();
    signedIn = true;
    view.rerender(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    const timer = await screen.findByRole("timer");
    expect(timer.textContent || "").toMatch(/29:|28:5/);
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).value).toBe("kept after refresh");
  });

  it("blocks copy, cut and paste and keeps submit disabled below 500 words", async () => {
    const { platform: hub, submit } = platform();
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    fireEvent.click(await screen.findByRole("button", { name: "Start Task" }));
    const editor = await screen.findByLabelText("Your report");
    expect(fireEvent.paste(editor)).toBe(false);
    expect(fireEvent.copy(editor)).toBe(false);
    expect(fireEvent.cut(editor)).toBe(false);
    expect(fireEvent.keyDown(editor, { key: "v", metaKey: true })).toBe(false);
    expect(fireEvent.keyDown(editor, { key: "z", metaKey: true })).toBe(true);
    fireEvent.change(editor, { target: { value: "one two three" } });
    expect(screen.getByText("Word count: 3 / 500 minimum")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Submit Report" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText("Minimum 500 words required before you can submit.")).toBeTruthy();
    fireEvent.change(editor, { target: { value: "word ".repeat(500) } });
    const submitButton = screen.getByRole("button", { name: "Submit Report" });
    expect((submitButton as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(submitButton);
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByText("Submit this report? You will not be able to change it after you submit.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Submit Report" }));
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    const payload = submit.mock.calls[0][0] as { responses: Array<{ questionKey: string }> };
    expect(payload.responses[0].questionKey).toBe("u3-cyber-security-knowledge-report-response");
  });

  function visibleText() {
    return document.body.textContent || "";
  }

  function assertLearnerThresholdHidden() {
    expect(visibleText()).not.toMatch(/\b400\b/);
    expect(visibleText()).toContain("500");
  }

  it("keeps the original server timer after a refresh in standard time", async () => {
    const startedAt = new Date(Date.now() - 90_000).toISOString();
    const { platform: hub } = platform();
    hub.progress.createStore = () => ({
      save: vi.fn(),
      flush: vi.fn(),
      hydrate: vi.fn(async () => ({
        startedAt,
        responses: { "u3-cyber-security-knowledge-report-response": "kept after typing" },
        knowledgeReportPhase: { phase: "standard" }
      }))
    });
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    const timer = await screen.findByRole("timer");
    expect(timer.textContent || "").toMatch(/28:/);
    expect(timer.textContent || "").not.toContain("30:00");
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).value).toBe("kept after typing");
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).readOnly).toBe(false);
    assertLearnerThresholdHidden();
  });

  it("reopens a below-threshold report locked, with additional time offered but not started", async () => {
    const startAdditionalTime = vi.fn();
    const { platform: hub } = platform();
    hub.progress.createStore = () => ({
      save: vi.fn(),
      flush: vi.fn(),
      hydrate: vi.fn(async () => ({
        startedAt: new Date(Date.now() - 31 * 60_000).toISOString(),
        responses: { "u3-cyber-security-knowledge-report-response": "saved standard work" },
        knowledgeReportPhase: {
          phase: "additional_available",
          standardTimeWordCount: 348,
          additionalTimeStartedAt: null
        }
      }))
    });
    (hub as { knowledgeReport?: { startAdditionalTime: typeof startAdditionalTime } }).knowledgeReport = {
      startAdditionalTime
    };
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    expect(await screen.findByRole("button", { name: "Continue with additional time" })).toBeTruthy();
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).readOnly).toBe(true);
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).value).toBe("saved standard work");
    expect(screen.getByText("Standard time complete")).toBeTruthy();
    expect(screen.getByText("Your work has been saved.")).toBeTruthy();
    expect(screen.getByText("Additional time available: 15 minutes")).toBeTruthy();
    expect(visibleText()).not.toContain("Additional time:");
    expect(startAdditionalTime).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Start Task" })).toBeNull();
    assertLearnerThresholdHidden();
  });

  it("continues the additional-time timer from the server timestamp after refresh", async () => {
    const additionalTimeStartedAt = new Date(Date.now() - 2 * 60_000).toISOString();
    const draft = {
      startedAt: new Date(Date.now() - 32 * 60_000).toISOString(),
      responses: { "u3-cyber-security-knowledge-report-response": "continued writing" },
      knowledgeReportPhase: {
        phase: "additional",
        additionalTimeStartedAt,
        additionalTimeSeconds: 900
      }
    };
    const { platform: hub } = platform();
    hub.progress.createStore = () => ({
      save: vi.fn(),
      flush: vi.fn(async () => ({ startedAt: draft.startedAt, state: draft })),
      hydrate: vi.fn(async () => draft)
    });
    const view = render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    const timer = await screen.findByRole("timer");
    expect(timer.textContent || "").toMatch(/Additional time: 1[23]:/);
    expect(timer.textContent || "").not.toContain("15:00");
    const editor = screen.getByLabelText("Your report") as HTMLTextAreaElement;
    expect(editor.readOnly).toBe(false);
    fireEvent.change(editor, { target: { value: "continued writing with another sentence" } });
    view.unmount();
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    const resumed = await screen.findByRole("timer");
    expect(resumed.textContent || "").toMatch(/Additional time: 1[23]:/);
    expect(resumed.textContent || "").not.toContain("15:00");
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).readOnly).toBe(false);
    assertLearnerThresholdHidden();
  });

  it("reopens a finished additional-time report as read-only with no new sitting", async () => {
    const submit = vi.fn(async () => ({ attempt_id: "attempt" }));
    const accepted = {
      startedAt: new Date(Date.now() - 50 * 60_000).toISOString(),
      responses: { "u3-cyber-security-knowledge-report-response": "accepted final draft" },
      knowledgeReportPhase: {
        phase: "additional_expired",
        additionalTimeStartedAt: new Date(Date.now() - 16 * 60_000).toISOString(),
        additionalTimeSeconds: 900,
        standardTimeWordCount: 348
      }
    };
    const { platform: hub } = platform();
    hub.submission.submit = submit;
    hub.progress.createStore = () => ({
      save: vi.fn(),
      flush: vi.fn(async () => ({ startedAt: accepted.startedAt, state: accepted })),
      hydrate: vi.fn(async () => accepted)
    });
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    expect(await screen.findByText("Additional time is complete. Your report has been saved and submitted.")).toBeTruthy();
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).readOnly).toBe(true);
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).value).toBe("accepted final draft");
    expect(screen.queryByRole("button", { name: "Continue with additional time" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Start Task" })).toBeNull();
    expect(visibleText()).not.toContain("15:00");
    expect(submit).toHaveBeenCalledTimes(1);
    assertLearnerThresholdHidden();
  });

  function expiredStandardDraft(text = "saved standard work") {
    return {
      startedAt: new Date(Date.now() - 31 * 60_000).toISOString(),
      responses: { "u3-cyber-security-knowledge-report-response": text },
      knowledgeReportPhase: { phase: "standard", additionalTimeStartedAt: null }
    };
  }

  function phaseRow(phase: string, text = "saved standard work") {
    return {
      state: {
        responses: { "u3-cyber-security-knowledge-report-response": text },
        knowledgeReportPhase: {
          phase,
          additionalTimeStartedAt: null,
          additionalTimeSeconds: 900
        }
      }
    };
  }

  it("reconciles a below-threshold expiry to additional time without refreshing or starting the clock", async () => {
    const startAdditionalTime = vi.fn();
    const submit = vi.fn();
    const getActivityState = vi.fn(async () => phaseRow("additional_available"));
    const flush = vi.fn(async () => null);
    const { platform: hub } = platform();
    hub.submission.submit = submit;
    hub.progress.createStore = () => ({
      save: vi.fn(),
      flush,
      hydrate: vi.fn(async () => expiredStandardDraft())
    });
    (hub.progress as { getActivityState?: typeof getActivityState }).getActivityState = getActivityState;
    (hub as { knowledgeReport?: { startAdditionalTime: typeof startAdditionalTime } }).knowledgeReport = {
      startAdditionalTime
    };
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    expect(await screen.findByRole("button", { name: "Continue with additional time" })).toBeTruthy();
    const editor = screen.getByLabelText("Your report") as HTMLTextAreaElement;
    expect(editor.readOnly).toBe(true);
    expect(editor.value).toBe("saved standard work");
    expect(screen.getByText("Standard time complete")).toBeTruthy();
    expect(screen.getByText("Additional time available: 15 minutes")).toBeTruthy();
    expect(screen.queryByText("Your report is still saved on this device. It has not been sent to your learning record yet.")).toBeNull();
    expect(visibleText()).not.toContain("Additional time:");
    expect((screen.getByRole("timer").textContent || "")).toContain("00:00");
    expect(getActivityState).toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
    expect(startAdditionalTime).not.toHaveBeenCalled();
    expect((screen.getByRole("button", { name: "Continue with additional time" }) as HTMLButtonElement).disabled).toBe(false);
    assertLearnerThresholdHidden();
  });

  it("reconciles a server-finalised expiry to the completed report without an additional-time offer", async () => {
    const submit = vi.fn(async () => ({ attempt_id: "attempt" }));
    const getActivityState = vi.fn(async () => phaseRow("standard_complete", "completed standard report"));
    const { platform: hub } = platform();
    hub.submission.submit = submit;
    hub.progress.createStore = () => ({
      save: vi.fn(),
      flush: vi.fn(async () => null),
      hydrate: vi.fn(async () => expiredStandardDraft("completed standard report"))
    });
    (hub.progress as { getActivityState?: typeof getActivityState }).getActivityState = getActivityState;
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    expect(await screen.findByText("Standard time complete. Your report has been saved and submitted.")).toBeTruthy();
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).readOnly).toBe(true);
    expect(screen.queryByRole("button", { name: "Continue with additional time" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
    expect(visibleText()).not.toContain("Additional time");
    expect(visibleText()).not.toContain("Additional time:");
    expect(submit).toHaveBeenCalledTimes(1);
    expect(getActivityState).toHaveBeenCalledTimes(1);
    assertLearnerThresholdHidden();
  });

  it("locks the editor and shows a checking state while expiry reconciliation is delayed", async () => {
    let resolveState: (value: unknown) => void = () => {};
    const getActivityState = vi.fn(() => new Promise((resolve) => {
      resolveState = resolve;
    }));
    const startAdditionalTime = vi.fn();
    const { platform: hub } = platform();
    hub.progress.createStore = () => ({
      save: vi.fn(),
      flush: vi.fn(async () => null),
      hydrate: vi.fn(async () => expiredStandardDraft("still being checked"))
    });
    (hub.progress as { getActivityState?: typeof getActivityState }).getActivityState = getActivityState;
    (hub as { knowledgeReport?: { startAdditionalTime: typeof startAdditionalTime } }).knowledgeReport = {
      startAdditionalTime
    };
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    expect(await screen.findByText("Standard time complete")).toBeTruthy();
    expect(await screen.findByText("Checking your report…")).toBeTruthy();
    const editor = screen.getByLabelText("Your report") as HTMLTextAreaElement;
    expect(editor.readOnly).toBe(true);
    expect(editor.value).toBe("still being checked");
    expect(screen.queryByRole("button", { name: "Continue with additional time" })).toBeNull();
    expect(visibleText()).not.toContain("Additional time:");
    expect(startAdditionalTime).not.toHaveBeenCalled();
    expect(screen.queryByText("Your report is still saved on this device. It has not been sent to your learning record yet.")).toBeNull();
    await waitFor(() => expect(getActivityState).toHaveBeenCalledTimes(1));
    resolveState(phaseRow("additional_available", "still being checked"));
    expect(await screen.findByRole("button", { name: "Continue with additional time" })).toBeTruthy();
    expect(screen.queryByText("Checking your report…")).toBeNull();
    expect(startAdditionalTime).not.toHaveBeenCalled();
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).readOnly).toBe(true);
    assertLearnerThresholdHidden();
  });

  it("keeps the locked draft and retries a failed expiry reconciliation without starting additional time", async () => {
    const startAdditionalTime = vi.fn();
    const submit = vi.fn();
    const getActivityState = vi.fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(phaseRow("additional_available", "kept on this page"));
    const { platform: hub } = platform();
    hub.submission.submit = submit;
    hub.progress.createStore = () => ({
      save: vi.fn(),
      flush: vi.fn(async () => null),
      hydrate: vi.fn(async () => expiredStandardDraft("kept on this page"))
    });
    (hub.progress as { getActivityState?: typeof getActivityState }).getActivityState = getActivityState;
    (hub as { knowledgeReport?: { startAdditionalTime: typeof startAdditionalTime } }).knowledgeReport = {
      startAdditionalTime
    };
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    const retry = await screen.findByRole("button", { name: "Try again" });
    const editor = screen.getByLabelText("Your report") as HTMLTextAreaElement;
    expect(editor.readOnly).toBe(true);
    expect(editor.value).toBe("kept on this page");
    expect(screen.queryByRole("button", { name: "Continue with additional time" })).toBeNull();
    expect(visibleText()).not.toContain("Additional time:");
    expect(startAdditionalTime).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(retry);
    expect(await screen.findByRole("button", { name: "Continue with additional time" })).toBeTruthy();
    expect(editor.readOnly).toBe(true);
    expect(editor.value).toBe("kept on this page");
    expect(getActivityState).toHaveBeenCalledTimes(2);
    expect(submit).not.toHaveBeenCalled();
    expect(startAdditionalTime).not.toHaveBeenCalled();
    expect(visibleText()).not.toContain("Additional time:");
    assertLearnerThresholdHidden();
  });

  it("handles repeated timer ticks at expiry with one reconciliation and no extra submission", async () => {
    const submit = vi.fn();
    const flush = vi.fn(async () => ({
      state: {
        responses: { "u3-cyber-security-knowledge-report-response": "saved standard work" },
        knowledgeReportPhase: { phase: "additional_available", additionalTimeStartedAt: null }
      }
    }));
    const getActivityState = vi.fn();
    const { platform: hub } = platform();
    hub.submission.submit = submit;
    hub.progress.createStore = () => ({
      save: vi.fn(),
      flush,
      hydrate: vi.fn(async () => expiredStandardDraft())
    });
    (hub.progress as { getActivityState?: typeof getActivityState }).getActivityState = getActivityState;
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    expect(await screen.findByRole("button", { name: "Continue with additional time" })).toBeTruthy();
    await new Promise((resolve) => setTimeout(resolve, 800));
    expect(flush).toHaveBeenCalledTimes(1);
    expect(getActivityState).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getAllByRole("button", { name: "Continue with additional time" })).toHaveLength(1);
    expect(visibleText()).not.toContain("Additional time:");
    expect((screen.getByRole("timer").textContent || "")).toContain("00:00");
    assertLearnerThresholdHidden();
  });

  it("follows a jumped server clock to the expiry screen without refreshing", async () => {
    const startedAt = new Date().toISOString();
    const startAdditionalTime = vi.fn();
    const submit = vi.fn();
    const getActivityState = vi.fn(async () => phaseRow("additional_available"));
    getActivityState.mockImplementation(async () => ({
      state: {
        ...phaseRow("additional_available").state,
        knowledgeReportPhase: {
          phase: "additional_available",
          additionalTimeStartedAt: null,
          additionalTimeSeconds: 900,
          serverNow: new Date(Date.parse(startedAt) + 1_801_000).toISOString()
        }
      }
    }));
    const { platform: hub } = platform();
    hub.submission.submit = submit;
    hub.progress.createStore = () => ({
      save: vi.fn(),
      flush: vi.fn(async () => null),
      hydrate: vi.fn(async () => ({
        startedAt,
        responses: { "u3-cyber-security-knowledge-report-response": "saved standard work" },
        knowledgeReportPhase: {
          phase: "standard",
          serverNow: new Date().toISOString()
        }
      }))
    });
    (hub.progress as { getActivityState?: typeof getActivityState }).getActivityState = getActivityState;
    (hub as { knowledgeReport?: { startAdditionalTime: typeof startAdditionalTime } }).knowledgeReport = {
      startAdditionalTime
    };
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    expect(await screen.findByRole("button", { name: "Continue with additional time" })).toBeTruthy();
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).readOnly).toBe(true);
    expect((screen.getByRole("timer").textContent || "")).toContain("00:00");
    expect(screen.queryByText("Your report is still saved on this device. It has not been sent to your learning record yet.")).toBeNull();
    expect(submit).not.toHaveBeenCalled();
    expect(startAdditionalTime).not.toHaveBeenCalled();
    expect(visibleText()).not.toContain("Additional time:");
    assertLearnerThresholdHidden();
  });

  it("starts the 15-minute timer from the server row when the test clock is already ahead", async () => {
    const startedAt = new Date(Date.now() - 31 * 60_000).toISOString();
    const serverNow = new Date(Date.parse(startedAt) + 1_801_000).toISOString();
    const submit = vi.fn();
    const startAdditionalTime = vi.fn(async () => [{
      state: {
        responses: { "u3-cyber-security-knowledge-report-response": "saved standard work" },
        knowledgeReportPhase: {
          phase: "additional",
          additionalTimeStartedAt: serverNow,
          additionalTimeSeconds: 900,
          serverNow
        }
      }
    }]);
    const { platform: hub } = platform();
    hub.submission.submit = submit;
    hub.progress.createStore = () => ({
      save: vi.fn(),
      flush: vi.fn(async () => null),
      hydrate: vi.fn(async () => ({
        startedAt,
        responses: { "u3-cyber-security-knowledge-report-response": "saved standard work" },
        knowledgeReportPhase: {
          phase: "additional_available",
          additionalTimeStartedAt: null,
          additionalTimeSeconds: 900,
          serverNow
        }
      }))
    });
    (hub as { knowledgeReport?: { startAdditionalTime: typeof startAdditionalTime } }).knowledgeReport = {
      startAdditionalTime
    };
    render(<KnowledgeReportPage context={context} contentReady platform={hub} />);
    fireEvent.click(await screen.findByRole("button", { name: "Continue with additional time" }));
    const timer = await screen.findByRole("timer");
    expect(timer.textContent || "").toMatch(/Additional time: 15:00|Additional time: 14:5/);
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).readOnly).toBe(false);
    expect((screen.getByLabelText("Your report") as HTMLTextAreaElement).value).toBe("saved standard work");
    expect(submit).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Continue with additional time" })).toBeNull();
    assertLearnerThresholdHidden();
  });

  it("does not show the internal threshold on the opening screen", () => {
    render(<KnowledgeReportsPage root="." contentReady />);
    expect(screen.getByText("Minimum 500 words")).toBeTruthy();
    expect(screen.getByText("30 minutes")).toBeTruthy();
    assertLearnerThresholdHidden();
  });
});
