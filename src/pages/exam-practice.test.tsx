import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { confirmCatalogueResponses } from "../exam-practice/catalogue-draft";
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
    const migration = readFileSync(resolve("../learning-platform-backend/supabase/migrations/20261109160000_timed_written_paper.sql"), "utf8");
    expect(page).toContain("createCatalogueDraftStore");
    expect(page).not.toContain("lo12_exam_records");
    expect(migration).not.toContain("create table learning.lo12_exam_records");
    expect(migration).toContain("assessmentType");
    expect(migration).toContain("learning.effective_timed_duration_seconds");
    expect(migration).toContain("Expiry locks every question");
    expect(migration).toContain("authoritativeStartedAt");
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

  it("hides reflection until the mini-mock is submitted", () => {
    render(<ExamReflectionPage root="." released mockSubmitted={false} />);
    expect(screen.getByText(/after you submit the mini-mock/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Save reflection" })).toBeNull();
  });
});
