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
    catalogueVersionFor: () => "1.0.0",
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
    const config = knowledgeReportConfig(reportActivity() as never);
    expect(config?.durationMinutes).toBe(30);
    expect(config?.minWords).toBe(500);
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
});
