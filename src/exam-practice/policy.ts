export const MINI_MOCK_SECONDS = 20 * 60;
export const MINI_MOCK_MAX = 20;

export const MINI_MOCK_QUESTIONS = [
  { id: "mm-1", marks: 3, outcome: "LO1" },
  { id: "mm-2", marks: 4, outcome: "LO1" },
  { id: "mm-3", marks: 3, outcome: "LO1" },
  { id: "mm-4", marks: 4, outcome: "LO2" },
  { id: "mm-5", marks: 6, outcome: "LO2" }
] as const;

export type MockStatus = "not-started" | "started" | "submitted";
export type MarkingStatus = "pending" | "finalised";

export type MockSitting = {
  studentId: string;
  status: MockStatus;
  startedAt: string | null;
  deadlineAt: string | null;
  extraSeconds: number;
  responses: Record<string, string>;
  submissionMethod: "manual" | "automatic" | null;
  submittedAt: string | null;
  markingStatus: MarkingStatus;
  awarded: Record<string, number> | null;
  feedback: Record<string, string> | null;
};

export type MarkedRow = {
  studentId: string;
  markingStatus: MarkingStatus;
  awarded: Record<string, number> | null;
};

export function emptySitting(studentId: string): MockSitting {
  return {
    studentId,
    status: "not-started",
    startedAt: null,
    deadlineAt: null,
    extraSeconds: 0,
    responses: {},
    submissionMethod: null,
    submittedAt: null,
    markingStatus: "pending",
    awarded: null,
    feedback: null
  };
}

export function deadlineFromStart(startedAt: string, extraSeconds: number): string {
  const extra = Number.isFinite(extraSeconds) && extraSeconds > 0 ? Math.floor(extraSeconds) : 0;
  return new Date(Date.parse(startedAt) + (MINI_MOCK_SECONDS + extra) * 1000).toISOString();
}

/** Students cannot grant themselves time. Only a teacher allowance is applied. */
export function authorisedExtraSeconds(teacherAllowance: number | null | undefined): number {
  const value = Number(teacherAllowance);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.min(Math.floor(value), 60 * 60);
}

export function remainingMs(deadlineAt: string, serverNow: string): number {
  return Date.parse(deadlineAt) - Date.parse(serverNow);
}

export function startSitting(
  current: MockSitting,
  serverNow: string,
  teacherAllowance: number | null | undefined
): MockSitting {
  if (current.status === "started" || current.status === "submitted") return current;
  const extraSeconds = authorisedExtraSeconds(teacherAllowance);
  const startedAt = serverNow;
  return {
    ...current,
    status: "started",
    startedAt,
    deadlineAt: deadlineFromStart(startedAt, extraSeconds),
    extraSeconds,
    responses: {}
  };
}

export function saveResponses(
  current: MockSitting,
  responses: Record<string, string>,
  serverNow: string
): MockSitting {
  if (current.status !== "started" || !current.deadlineAt) return current;
  if (remainingMs(current.deadlineAt, serverNow) <= 0) {
    return submitSitting(current, "automatic", current.deadlineAt);
  }
  const next: Record<string, string> = { ...current.responses };
  for (const question of MINI_MOCK_QUESTIONS) {
    if (typeof responses[question.id] === "string") next[question.id] = responses[question.id];
  }
  return { ...current, responses: next };
}

export function submitSitting(
  current: MockSitting,
  method: "manual" | "automatic",
  serverNow: string
): MockSitting {
  if (current.status === "submitted") return current;
  if (current.status !== "started" || !current.deadlineAt) return current;
  const expired = remainingMs(current.deadlineAt, serverNow) <= 0;
  return {
    ...current,
    status: "submitted",
    submissionMethod: expired ? "automatic" : method,
    submittedAt: expired ? current.deadlineAt : serverNow
  };
}

export function awardMarks(
  current: MockSitting,
  awarded: Record<string, number>,
  feedback: Record<string, string>
): MockSitting {
  if (current.status !== "submitted" || current.markingStatus === "finalised") return current;
  const safe: Record<string, number> = {};
  for (const question of MINI_MOCK_QUESTIONS) {
    const raw = awarded[question.id];
    if (typeof raw !== "number" || !Number.isFinite(raw)) continue;
    safe[question.id] = Math.max(0, Math.min(question.marks, raw));
  }
  return {
    ...current,
    awarded: safe,
    feedback: { ...feedback },
    markingStatus: "pending"
  };
}

export function finaliseMarks(current: MockSitting): MockSitting {
  if (current.status !== "submitted" || !current.awarded) return current;
  const complete = MINI_MOCK_QUESTIONS.every((question) => typeof current.awarded?.[question.id] === "number");
  if (!complete) return current;
  return { ...current, markingStatus: "finalised" };
}

export function learnerView(sitting: MockSitting): MockSitting {
  if (sitting.markingStatus !== "finalised") {
    return { ...sitting, awarded: null, feedback: null };
  }
  return sitting;
}

export function sittingScore(sitting: Pick<MockSitting, "awarded" | "markingStatus">): number | null {
  if (sitting.markingStatus !== "finalised" || !sitting.awarded) return null;
  return MINI_MOCK_QUESTIONS.reduce((sum, question) => sum + (sitting.awarded?.[question.id] || 0), 0);
}

export function classAverage(rows: MarkedRow[]): number | null {
  const scores = rows
    .map((row) => sittingScore(row))
    .filter((score): score is number => score != null);
  if (!scores.length) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function questionAverages(rows: MarkedRow[]): Record<string, number | null> {
  const result: Record<string, number | null> = {};
  for (const question of MINI_MOCK_QUESTIONS) {
    const scores = rows
      .filter((row) => row.markingStatus === "finalised" && row.awarded)
      .map((row) => row.awarded?.[question.id])
      .filter((score): score is number => typeof score === "number");
    result[question.id] = scores.length
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : null;
  }
  return result;
}

export function outcomeAverages(rows: MarkedRow[]): Record<string, number | null> {
  const groups = ["LO1", "LO2"];
  const result: Record<string, number | null> = {};
  for (const outcome of groups) {
    const questions = MINI_MOCK_QUESTIONS.filter((question) => question.outcome === outcome);
    const max = questions.reduce((sum, question) => sum + question.marks, 0);
    const scores = rows
      .filter((row) => row.markingStatus === "finalised" && row.awarded)
      .map((row) => questions.reduce((sum, question) => sum + (row.awarded?.[question.id] || 0), 0));
    result[outcome] = scores.length
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : null;
    result[`${outcome}Max`] = max;
  }
  return result;
}
