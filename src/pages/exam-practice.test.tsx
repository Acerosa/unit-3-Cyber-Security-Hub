import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { confirmCatalogueResponses } from "../exam-practice/catalogue-draft";
import { SAVED_ANSWERS_LOAD_FAILED, SAVED_ANSWERS_LOADING } from "../exam-practice/resume-gate";
import { decideTimedPaperSave } from "../exam-practice/timed-paper-save";
import { MOCK_QUESTIONS } from "../exam-practice/mock-questions";
import {
  authorisedExtraSeconds,
  classAverage,
  deadlineFromStart,
  emptySitting,
  finaliseMarks,
  learnerView,
  MINI_MOCK_QUESTIONS,
  outcomeAverages,
  questionAverages,
  saveResponses,
  startSitting,
  submitSitting
} from "../exam-practice/policy";
import { createMemoryExamStore } from "../exam-practice/store";
import { configureBundledPackage } from "../curriculum/runtime-weeks";
import { buildUnit3Navigation } from "../paths";
import pkg from "../../content/unit-3-cyber-security/package.json";
import { ExamAnswerWritingPage } from "./ExamAnswerWritingPage";
import { ExamMiniMockPage } from "./ExamMiniMockPage";
import { ExamPracticePage } from "./ExamPracticePage";
import { ExamReflectionPage } from "./ExamReflectionPage";

afterEach(() => cleanup());

const START = "2026-11-09T15:00:00.000Z";

describe("exam practice policy", () => {
  it("starts one attempt and keeps the server deadline", () => {
    const started = startSitting(emptySitting("a"), START, 0);
    expect(started.status).toBe("started");
    expect(started.deadlineAt).toBe(deadlineFromStart(START, 0));
    const again = startSitting(started, "2026-11-09T15:05:00.000Z", 0);
    expect(again.startedAt).toBe(START);
    expect(again.deadlineAt).toBe(started.deadlineAt);
  });

  it("saves text, restores it, and submits automatically at the deadline", () => {
    const storage = new Map<string, string>();
    const memory = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => { storage.set(key, value); }
    };
    const first = createMemoryExamStore({ studentId: "a", now: () => START, storage: memory });
    first.startMock();
    first.saveMock({ "mm-1": "Confidentiality failed for the tax return." });
    const second = createMemoryExamStore({ studentId: "a", now: () => START, storage: memory });
    expect(second.load().mock.responses["mm-1"]).toContain("tax return");
    expect(second.load().mock.deadlineAt).toBe(first.load().mock.deadlineAt);
    const expired = saveResponses(
      second.load().mock.status === "started"
        ? { ...first.load().mock, awarded: null, feedback: null, markingStatus: "pending" }
        : emptySitting("a"),
      { "mm-1": "changed after the end" },
      "2026-11-09T15:20:00.000Z"
    );
    expect(expired.status).toBe("submitted");
    expect(expired.submissionMethod).toBe("automatic");
    expect(expired.responses["mm-1"]).toContain("tax return");
    const locked = saveResponses(expired, { "mm-1": "edited" }, "2026-11-09T15:21:00.000Z");
    expect(locked.responses["mm-1"]).not.toBe("edited");
  });

  it("ignores a student request for extra time", () => {
    expect(authorisedExtraSeconds(0)).toBe(0);
    const sitting = startSitting(emptySitting("a"), START, 15 * 60);
    expect(sitting.extraSeconds).toBe(15 * 60);
    expect(sitting.deadlineAt).toBe(deadlineFromStart(START, 15 * 60));
  });

  it("hides marks until finalised and averages only finalised scores", () => {
    let sitting = submitSitting(startSitting(emptySitting("a"), START, 0), "manual", START);
    sitting = {
      ...sitting,
      awarded: Object.fromEntries(MINI_MOCK_QUESTIONS.map((question) => [question.id, question.marks]))
    };
    expect(learnerView(sitting).awarded).toBeNull();
    const finalised = finaliseMarks({ ...sitting, markingStatus: "pending" });
    expect(learnerView(finalised).awarded?.["mm-1"]).toBe(3);
    const average = classAverage([
      { studentId: "a", markingStatus: "finalised", awarded: finalised.awarded },
      { studentId: "b", markingStatus: "pending", awarded: null }
    ]);
    expect(average).toBe(20);
    expect(questionAverages([{ studentId: "b", markingStatus: "pending", awarded: null }])["mm-1"]).toBeNull();
    expect(outcomeAverages([{ studentId: "a", markingStatus: "finalised", awarded: finalised.awarded }]).LO1).toBe(10);
  });

  it("does not load another student's sitting", () => {
    const storage = new Map<string, string>();
    const memory = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => { storage.set(key, value); }
    };
    createMemoryExamStore({ studentId: "a", now: () => START, storage: memory, storageKey: "shared" }).saveMock({});
    const other = createMemoryExamStore({ studentId: "b", now: () => START, storage: memory, storageKey: "shared" });
    expect(other.load().mock.studentId).toBe("b");
    expect(other.load().mock.status).toBe("not-started");
  });

  it("keeps model answers out of the learner mini-mock", () => {
    const paper = readFileSync(resolve("src/exam-practice/mock-questions.ts"), "utf8");
    const page = readFileSync(resolve("src/pages/ExamMiniMockPage.tsx"), "utf8");
    expect(paper).not.toMatch(/indicative|weak answer|awarded mark/i);
    expect(page).not.toMatch(/Gift Aid|guessable and has never/);
    expect(MOCK_QUESTIONS.reduce((sum, question) => sum + question.marks, 0)).toBe(20);
  });
});

describe("exam practice pages", () => {
  it("stays unpublished unless the review flag is on", () => {
    configureBundledPackage(pkg as never);
    render(<ExamPracticePage root="." released={false} />);
    expect(screen.getByText("Exam practice is not available yet.")).toBeTruthy();
    expect(buildUnit3Navigation(".", null, false).some((item) => item.id === "exam-practice")).toBe(false);
    expect(buildUnit3Navigation(".", null, true).some((item) => item.label === "Exam Practice")).toBe(true);
  });

  it("says Saved only after the server accepts the original and the improved answer", async () => {
    configureBundledPackage(pkg as never);
    (window as unknown as { __lpPackage?: unknown }).__lpPackage = pkg;
    let sent: Record<string, unknown> | null = null;
    const platform = {
      auth: { isSignedIn: () => true },
      progress: {
        createStore: () => ({
          hydrate: async () => ({ responses: {} }),
          save: (state: { responses: Record<string, unknown> }) => { sent = state.responses; },
          flush: async () => ({ activityKey: "u3-lo12-answer-writing", state: { responses: sent } }),
          isDirty: () => true
        })
      }
    };
    render(<ExamAnswerWritingPage root="." released platform={platform as never} saveDelayMs={0} />);
    expect(await screen.findByText("Not saved yet")).toBeTruthy();
    fireEvent.change(screen.getAllByLabelText("Your answer")[0], { target: { value: "Confidentiality." } });
    expect(screen.getByText("Saving")).toBeTruthy();
    expect(await screen.findByText("Saved")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Compare My Answer" })[0]);
    fireEvent.change(screen.getByLabelText("Improved answer"), { target: { value: "Confidentiality, because the other client can read the return." } });
    await vi.waitFor(() => {
      const saved = sent?.["u3-lo12-answer-writing:aw-1"] as { original?: string; revised?: string };
      expect(saved.revised).toContain("other client");
      expect(saved.original).toBe("Confidentiality.");
    });
    expect(screen.getAllByLabelText("Your answer")[0]).toHaveProperty("value", "Confidentiality.");
    expect(screen.getByText("Saved")).toBeTruthy();
  });

  it("keeps the typed answer when the server does not confirm the save", async () => {
    configureBundledPackage(pkg as never);
    (window as unknown as { __lpPackage?: unknown }).__lpPackage = pkg;
    const platform = {
      auth: { isSignedIn: () => true },
      progress: {
        createStore: () => ({
          hydrate: async () => ({ responses: {} }),
          save: () => {},
          flush: async () => ({ responses: {} }),
          isDirty: () => true
        })
      }
    };
    render(<ExamAnswerWritingPage root="." released platform={platform as never} saveDelayMs={0} />);
    expect(await screen.findByText("Not saved yet")).toBeTruthy();
    fireEvent.change(screen.getAllByLabelText("Your answer")[0], { target: { value: "Still here." } });
    expect(await screen.findByText("Could not save. Your answers are still in the editor.")).toBeTruthy();
    expect(screen.getAllByLabelText("Your answer")[0]).toHaveProperty("value", "Still here.");
  });

  it("shows the latest save when an older request fails after a newer one", async () => {
    configureBundledPackage(pkg as never);
    (window as unknown as { __lpPackage?: unknown }).__lpPackage = pkg;
    const releases: Array<(value: unknown) => void> = [];
    let sent: Record<string, unknown> | null = null;
    const platform = {
      auth: { isSignedIn: () => true },
      progress: {
        createStore: () => ({
          hydrate: async () => ({ responses: {} }),
          save: (state: { responses: Record<string, unknown> }) => { sent = state.responses; },
          flush: () => new Promise((resolve) => { releases.push(resolve); }),
          isDirty: () => true
        })
      }
    };
    render(<ExamAnswerWritingPage root="." released platform={platform as never} saveDelayMs={0} />);
    expect(await screen.findByText("Not saved yet")).toBeTruthy();
    fireEvent.change(screen.getAllByLabelText("Your answer")[0], { target: { value: "First." } });
    await vi.waitFor(() => expect(releases).toHaveLength(1));
    fireEvent.change(screen.getAllByLabelText("Your answer")[0], { target: { value: "Second." } });
    releases[0]({ responses: {} });
    await vi.waitFor(() => expect(releases).toHaveLength(2));
    releases[1]({ activityKey: "u3-lo12-answer-writing", state: { responses: sent } });
    expect(await screen.findByText("Saved")).toBeTruthy();
    expect(screen.queryByText("Could not save. Your answers are still in the editor.")).toBeNull();
    expect(screen.getAllByLabelText("Your answer")[0]).toHaveProperty("value", "Second.");
  });

  it("does not accept an older response as confirmation of the current answer", async () => {
    let releaseFirst: (value: unknown) => void = () => {};
    const first = new Promise((resolve) => { releaseFirst = resolve; });
    let calls = 0;
    const platform = {
      auth: { isSignedIn: () => true },
      progress: {
        createStore: () => ({
          save: () => {},
          flush: () => {
            calls += 1;
            if (calls === 1) return first;
            return Promise.resolve({
              activityKey: "race-activity",
              state: { responses: { answer: "current" } }
            });
          },
          isDirty: () => true
        })
      }
    };
    const activity = { id: "race-activity", version: "0.1.0" } as never;
    const older = confirmCatalogueResponses(activity, platform, { answer: "stale" });
    const newer = confirmCatalogueResponses(activity, platform, { answer: "current" });
    releaseFirst({ activityKey: "race-activity", state: { responses: { answer: "stale" } } });
    expect(await older).toBe("superseded");
    expect(await newer).toBe("saved");
    expect(calls).toBe(2);
  });

  it("reveals answer-writing guidance only after Compare My Answer", () => {
    const store = createMemoryExamStore({ now: () => START });
    render(<ExamAnswerWritingPage root="." released store={store} />);
    expect(screen.queryByText("A stronger answer")).toBeNull();
    fireEvent.change(screen.getAllByLabelText("Your answer")[0], { target: { value: "Confidentiality." } });
    fireEvent.click(screen.getAllByRole("button", { name: "Compare My Answer" })[0]);
    expect(screen.getByText("A stronger answer")).toBeTruthy();
    expect(store.load().writing.answers["aw-1"].guidanceViewed).toBe(true);
    expect(store.load().writing.answers["aw-1"].original).toBe("Confidentiality.");
  });

  it("submits the reflection without a mark", () => {
    const store = createMemoryExamStore({ now: () => START });
    render(<ExamReflectionPage root="." released store={store} />);
    fireEvent.click(screen.getByLabelText("Threats and vulnerabilities."));
    fireEvent.click(screen.getByLabelText("Explain"));
    fireEvent.click(screen.getByLabelText("No, I ran out of time."));
    fireEvent.change(screen.getByLabelText("What do you think you need to improve?"), {
      target: { value: "Link the cause to the scenario." }
    });
    fireEvent.change(screen.getByLabelText("Identify two topics you will revise before the mock examination."), {
      target: { value: "CIA and legal duties." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save reflection" }));
    expect(store.load().reflection.submittedAt).toBe(START);
    expect(store.load().mock.awarded).toBeNull();
  });

  it("keeps the deployed knowledge report and adds a separate timed paper", () => {
    const report = (pkg as { activities: Array<{ id: string; version: string; metadata?: { knowledgeReport?: Record<string, unknown> } }> }).activities
      .find((activity) => activity.id === "u3-cyber-security-knowledge-report");
    const paper = (pkg as { activities: Array<{ id: string; version: string; blocks?: Array<{ type?: string; content?: { maxMarks?: number } }>; metadata?: { knowledgeReport?: Record<string, unknown> } }> }).activities
      .find((activity) => activity.id === "u3-lo12-timed-mini-mock");
    expect(report?.version).toBe("1.1.0");
    expect(report?.metadata?.knowledgeReport).toMatchObject({
      durationMinutes: 30,
      minWords: 500,
      additionalTimeMinutes: 15,
      additionalTimeThresholdWords: 400
    });
    expect(report?.metadata?.knowledgeReport?.assessmentType).toBeUndefined();
    expect(paper?.metadata?.knowledgeReport?.assessmentType).toBe("timed-written-paper");
    expect(paper?.metadata?.knowledgeReport?.minWords).toBeUndefined();
    expect(paper?.metadata?.knowledgeReport?.additionalTimeMinutes).toBeUndefined();
    const marks = (paper?.blocks || [])
      .filter((block) => block.type === "short-response")
      .map((block) => block.content?.maxMarks);
    expect(marks).toEqual([3, 4, 3, 4, 6]);
  });

  it("does not keep a second examination timer or records table in the mini-mock page", () => {
    const page = readFileSync(resolve("src/pages/ExamMiniMockPage.tsx"), "utf8");
    const save = readFileSync(resolve("src/exam-practice/timed-paper-save.ts"), "utf8");
    const paper = (pkg as { activities: Array<{ id: string; metadata?: { knowledgeReport?: Record<string, unknown> } }> }).activities
      .find((activity) => activity.id === "u3-lo12-timed-mini-mock");
    expect(page).toContain("createCatalogueDraftStore");
    expect(page).toContain("p_expected_revision");
    expect(page).toContain("authoritativeStartedAt");
    expect(page).toContain("standardDurationSeconds");
    expect(page).toContain("disabled={submitted || expired || timeUp || !startedAt || resume !== \"ready\"}");
    expect(page).not.toContain("notice ||");
    expect(page).not.toContain("lo12_exam_records");
    expect(page).not.toContain("additionalTimeMinutes");
    expect(save).toContain("save_outcome");
    expect(save).not.toContain("lo12_exam_records");
    expect(paper?.metadata?.knowledgeReport?.assessmentType).toBe("timed-written-paper");
    expect(paper?.metadata?.knowledgeReport?.durationMinutes).toBe(20);
  });

  it("keeps answer-writing and reflection as ordinary catalogue activities", () => {
    const activities = (pkg as { activities: Array<{ id: string; metadata?: { knowledgeReport?: unknown }; blocks?: Array<{ type?: string; content?: { prompt?: string; text?: string } }> }> }).activities;
    const writing = activities.find((activity) => activity.id === "u3-lo12-answer-writing");
    const reflection = activities.find((activity) => activity.id === "u3-lo12-reflection");
    expect(writing?.metadata?.knowledgeReport).toBeUndefined();
    expect(reflection?.metadata?.knowledgeReport).toBeUndefined();
    expect((writing?.blocks || []).filter((block) => block.type === "short-response")).toHaveLength(6);
    expect((reflection?.blocks || []).filter((block) => block.type === "short-response")).toHaveLength(5);
    const reflectionText = JSON.stringify(reflection);
    expect(reflectionText).not.toMatch(/indicative|maxMarks|marking guidance/i);
    const writingText = JSON.stringify(writing);
    expect(writingText).not.toMatch(/Award one mark|indicative/i);
  });

  it("keeps a confirmed answer when a lost save response is retried", () => {
    const sent = { "u3-lo12-timed-mini-mock:mm-1": "BETA newer confirmed answer" };
    const ids = ["u3-lo12-timed-mini-mock:mm-1"];
    expect(decideTimedPaperSave({
      sent,
      questionIds: ids,
      row: null,
      error: true,
      tries: 0
    }).action).toBe("retry");
    expect(decideTimedPaperSave({
      sent,
      questionIds: ids,
      row: {
        revision: 4,
        save_outcome: "conflict",
        state: { responses: sent }
      },
      error: false,
      tries: 1
    })).toMatchObject({ action: "adopt", revision: 4 });
    expect(decideTimedPaperSave({
      sent: { "u3-lo12-timed-mini-mock:mm-1": "ALPHA stale overwrite" },
      questionIds: ids,
      row: {
        revision: 4,
        save_outcome: "conflict",
        state: { responses: sent }
      },
      error: false,
      tries: 0
    })).toMatchObject({ action: "conflict", revision: 4 });
  });

  it("shows the save status and a conflict without replacing the typed answer", async () => {
    configureBundledPackage(pkg as never);
    (window as unknown as { __lpPackage?: unknown }).__lpPackage = pkg;
    const calls: Array<Record<string, unknown>> = [];
    const started = "2026-11-10T07:00:00.000Z";
    const platform = {
      client: {
        schema: () => ({
          rpc: async (fn: string, args: Record<string, unknown>) => {
            calls.push({ fn, ...args });
            if (fn === "get_activity_state") {
              return {
                data: [{
                  revision: 3,
                  started_at: started,
                  state: {
                    responses: { "u3-lo12-timed-mini-mock:mm-1": "BETA newer confirmed answer" },
                    knowledgeReportPhase: {
                      authoritativeStartedAt: started,
                      standardDurationSeconds: 1200,
                      serverNow: started,
                      phase: "in_progress"
                    }
                  }
                }]
              };
            }
            return {
              data: [{
                revision: 3,
                save_outcome: "conflict",
                started_at: started,
                state: {
                  responses: { "u3-lo12-timed-mini-mock:mm-1": "BETA newer confirmed answer" },
                  knowledgeReportPhase: {
                    authoritativeStartedAt: started,
                    standardDurationSeconds: 1200,
                    serverNow: started,
                    phase: "in_progress"
                  }
                }
              }]
            };
          }
        })
      }
    };
    render(<ExamMiniMockPage root="." released platform={platform as never} />);
    const box = await screen.findByLabelText(/Explain which cyber security aim has failed/i);
    expect((box as HTMLTextAreaElement).value).toBe("BETA newer confirmed answer");
    fireEvent.change(box, { target: { value: "ALPHA stale overwrite" } });
    expect(screen.getByRole("status").textContent).toBe("Saving");
    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
    expect(screen.getByRole("status").textContent).toBe("This assessment was updated in another tab.");
    expect(screen.queryByRole("status")?.textContent).not.toBe("Saved");
    expect((box as HTMLTextAreaElement).value).toBe("ALPHA stale overwrite");
    expect(screen.getByText(/BETA newer confirmed answer/)).toBeTruthy();
    const saveCall = calls.find((call) => call.fn === "save_activity_state");
    expect(saveCall?.p_expected_revision).toBe(3);
    fireEvent.click(screen.getByRole("button", { name: "Use the saved version" }));
    expect((box as HTMLTextAreaElement).value).toBe("BETA newer confirmed answer");
    expect(screen.getByRole("status").textContent).toBe("Saved");
    expect(calls.filter((call) => call.fn === "save_activity_state")).toHaveLength(1);
  });

  it("keeps the save status visible after the mini-mock starts", async () => {
    configureBundledPackage(pkg as never);
    (window as unknown as { __lpPackage?: unknown }).__lpPackage = pkg;
    const platform = {
      client: {
        schema: () => ({
          rpc: async (fn: string) => {
            if (fn === "get_activity_state") return { data: [] };
            return {
              data: [{
                revision: 1,
                save_outcome: "saved",
                started_at: "2026-11-10T07:00:00.000Z",
                state: {
                  responses: {},
                  knowledgeReportPhase: {
                    authoritativeStartedAt: "2026-11-10T07:00:00.000Z",
                    standardDurationSeconds: 1200,
                    serverNow: "2026-11-10T07:00:00.000Z",
                    phase: "in_progress"
                  }
                }
              }]
            };
          }
        })
      }
    };
    render(<ExamMiniMockPage root="." released platform={platform as never} />);
    const start = await screen.findByRole("button", { name: "Start Mini-Mock" });
    await waitFor(() => expect(start).toHaveProperty("disabled", false));
    fireEvent.click(start);
    expect(await screen.findByText(/The sitting uses the server start time/)).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Saved");
    expect(screen.getByRole("timer")).toBeTruthy();
  });

  it("restores a saved answer after refresh and does not save the empty page", async () => {
    configureBundledPackage(pkg as never);
    (window as unknown as { __lpPackage?: unknown }).__lpPackage = pkg;
    const saves: unknown[] = [];
    let releaseHydrate: (value: unknown) => void = () => {};
    const platform = {
      auth: { isSignedIn: () => true },
      progress: {
        createStore: () => ({
          hydrate: () => new Promise((resolve) => { releaseHydrate = resolve; }),
          save: (state: unknown) => { saves.push(state); },
          flush: async () => ({ activityKey: "u3-lo12-answer-writing" }),
          isDirty: () => false
        })
      }
    };
    const view = render(<ExamAnswerWritingPage root="." released platform={platform as never} platformState="signed-out" />);
    expect(screen.getByText(SAVED_ANSWERS_LOADING)).toBeTruthy();
    expect(screen.queryByText("Not saved yet")).toBeNull();
    expect(screen.getAllByLabelText("Your answer")[0]).toHaveProperty("disabled", true);
    expect(saves).toHaveLength(0);
    view.rerender(<ExamAnswerWritingPage root="." released platform={platform as never} platformState="ready" />);
    expect(screen.getByText(SAVED_ANSWERS_LOADING)).toBeTruthy();
    releaseHydrate({
      responses: {
        "u3-lo12-answer-writing:aw-1": {
          original: "Confidentiality and integrity.",
          revised: "",
          missing: "",
          guidanceViewed: false
        }
      }
    });
    expect(await screen.findByDisplayValue("Confidentiality and integrity.")).toBeTruthy();
    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.queryByText("Not saved yet")).toBeNull();
    expect(saves).toHaveLength(0);
  });

  it("restores a saved answer when the hub has settled without a class enrolment", async () => {
    configureBundledPackage(pkg as never);
    (window as unknown as { __lpPackage?: unknown }).__lpPackage = pkg;
    const platform = {
      auth: { isSignedIn: () => true },
      progress: {
        createStore: () => ({
          hydrate: async () => ({
            responses: {
              "u3-lo12-answer-writing:aw-1": {
                original: "Still stored.",
                revised: "",
                missing: "",
                guidanceViewed: false
              }
            }
          }),
          save: () => {},
          flush: async () => ({ activityKey: "u3-lo12-answer-writing" })
        })
      }
    };
    render(<ExamAnswerWritingPage root="." released platform={platform as never} platformState="no-enrolment" />);
    expect(await screen.findByDisplayValue("Still stored.")).toBeTruthy();
    expect(screen.getByText("Saved")).toBeTruthy();
  });

  it("shows an error and keeps the assessment locked when loading fails", async () => {
    configureBundledPackage(pkg as never);
    (window as unknown as { __lpPackage?: unknown }).__lpPackage = pkg;
    const saves: unknown[] = [];
    const platform = {
      auth: { isSignedIn: () => true },
      progress: {
        createStore: () => ({
          hydrate: async () => { throw new Error("offline"); },
          save: (state: unknown) => { saves.push(state); },
          flush: async () => { throw new Error("offline"); }
        })
      }
    };
    render(<ExamAnswerWritingPage root="." released platform={platform as never} platformState="ready" />);
    expect(await screen.findByRole("alert")).toHaveProperty("textContent", SAVED_ANSWERS_LOAD_FAILED);
    expect(screen.queryByText("Not saved yet")).toBeNull();
    fireEvent.change(screen.getAllByLabelText("Your answer")[0], { target: { value: "Should not save." } });
    expect(screen.getAllByLabelText("Your answer")[0]).toHaveProperty("value", "");
    expect(saves).toHaveLength(0);
  });

  it("waits for a signed-in session before reading the mini-mock and does not save an empty paper", async () => {
    configureBundledPackage(pkg as never);
    (window as unknown as { __lpPackage?: unknown }).__lpPackage = pkg;
    const calls: string[] = [];
    let releaseGet: (value: unknown) => void = () => {};
    let signedIn = false;
    const platform = {
      auth: { isSignedIn: () => signedIn },
      client: {
        schema: () => ({
          rpc: (fn: string) => {
            calls.push(fn);
            if (fn === "get_activity_state") return new Promise((resolve) => { releaseGet = resolve; });
            return Promise.resolve({ data: [] });
          }
        })
      }
    };
    const view = render(<ExamMiniMockPage root="." released platform={platform as never} platformState="signed-out" />);
    expect(screen.getByText(SAVED_ANSWERS_LOADING)).toBeTruthy();
    expect(calls).toHaveLength(0);
    signedIn = true;
    view.rerender(<ExamMiniMockPage root="." released platform={platform as never} platformState="ready" />);
    expect(screen.getByText(SAVED_ANSWERS_LOADING)).toBeTruthy();
    releaseGet({
      data: [{
        revision: 2,
        started_at: "2026-11-10T07:00:00.000Z",
        state: {
          responses: { "u3-lo12-timed-mini-mock:mm-1": "Kept after refresh." },
          knowledgeReportPhase: {
            authoritativeStartedAt: "2026-11-10T07:00:00.000Z",
            standardDurationSeconds: 1200,
            serverNow: "2026-11-10T07:00:00.000Z",
            phase: "in_progress"
          }
        }
      }]
    });
    expect(await screen.findByDisplayValue("Kept after refresh.")).toBeTruthy();
    expect(calls).toEqual(["get_activity_state"]);
  });

  it("locks the mini-mock when the saved sitting cannot be loaded", async () => {
    configureBundledPackage(pkg as never);
    (window as unknown as { __lpPackage?: unknown }).__lpPackage = pkg;
    const calls: string[] = [];
    const platform = {
      auth: { isSignedIn: () => true },
      client: {
        schema: () => ({
          rpc: async (fn: string) => {
            calls.push(fn);
            if (fn === "get_activity_state") throw new Error("offline");
            return { data: [] };
          }
        })
      }
    };
    render(<ExamMiniMockPage root="." released platform={platform as never} platformState="ready" />);
    expect(await screen.findByRole("alert")).toHaveProperty("textContent", SAVED_ANSWERS_LOAD_FAILED);
    expect(screen.getByRole("button", { name: "Start Mini-Mock" })).toHaveProperty("disabled", true);
    fireEvent.click(screen.getByRole("button", { name: "Start Mini-Mock" }));
    expect(calls).toEqual(["get_activity_state"]);
  });

  it("restores a saved reflection and does not replace it with an empty form", async () => {
    configureBundledPackage(pkg as never);
    (window as unknown as { __lpPackage?: unknown }).__lpPackage = pkg;
    const saves: unknown[] = [];
    const platform = {
      auth: { isSignedIn: () => true },
      progress: {
        createStore: (options: { activityKey: string }) => ({
          hydrate: async () => options.activityKey === "u3-lo12-timed-mini-mock"
            ? { submission: { status: "submitted" }, attemptId: "attempt-1" }
            : {
              responses: {
                "u3-lo12-reflection:topic": "Threats and vulnerabilities.",
                "u3-lo12-reflection:command": "Explain",
                "u3-lo12-reflection:time": "No, I ran out of time.",
                "u3-lo12-reflection:improve": "Use the scenario.",
                "u3-lo12-reflection:revise": "CIA and legal duties."
              }
            },
          save: (state: unknown) => { saves.push(state); }
        })
      }
    };
    render(<ExamReflectionPage root="." released platform={platform as never} platformState="ready" />);
    expect(screen.getByText(SAVED_ANSWERS_LOADING)).toBeTruthy();
    expect(await screen.findByDisplayValue("Use the scenario.")).toBeTruthy();
    expect(screen.getByLabelText("Threats and vulnerabilities.")).toHaveProperty("checked", true);
    expect(saves).toHaveLength(0);
  });

  it("hides reflection until the mini-mock is submitted", () => {
    render(<ExamReflectionPage root="." released mockSubmitted={false} />);
    expect(screen.getByText(/after you submit the mini-mock/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Save reflection" })).toBeNull();
  });
});
