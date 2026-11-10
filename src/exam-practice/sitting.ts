export type AttemptRow = {
  attempt_id?: string;
  status?: string;
  score?: number | null;
};

export type ResponseRow = {
  question_key?: string;
  awarded_score?: number | null;
  max_score?: number | null;
  feedback_summary?: string | null;
  response_payload?: { text?: string } | null;
};

export type DraftPhase = {
  phase?: string;
  authoritativeStartedAt?: string | null;
  standardDurationSeconds?: number;
  serverNow?: string;
};

export type DraftRow = {
  revision?: number;
  started_at?: string | null;
  startedAt?: string | null;
  status?: string;
  state?: {
    responses?: Record<string, unknown>;
    knowledgeReportPhase?: DraftPhase;
    submission?: { status?: string };
    attemptId?: string;
  };
};

export type ReleasedResult = {
  questionKey: string;
  awarded: number;
  max: number;
  feedback: string;
  text: string;
};

export type Sitting =
  | { kind: "not-started" }
  | {
      kind: "in-progress";
      revision: number;
      responses: Record<string, string>;
      startedAt: string | null;
      durationSeconds: number | null;
      serverNow: string | null;
    }
  | { kind: "submitted"; attemptId: string | null; responses: Record<string, string> }
  | { kind: "released"; attemptId: string | null; responses: Record<string, string>; results: ReleasedResult[] };

type QueryClient = {
  schema: (name: string) => {
    from?: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => Promise<{ data?: unknown; error?: { message?: string } | null }>;
      };
    };
  };
};

function stringResponses(value: Record<string, unknown> | undefined): Record<string, string> {
  if (!value) return {};
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
}

function answerText(row: ResponseRow): string {
  const text = row.response_payload?.text;
  return typeof text === "string" ? text : "";
}

function answersFromResponses(rows: ResponseRow[]): Record<string, string> {
  const answers: Record<string, string> = {};
  rows.forEach((row) => {
    if (typeof row.question_key === "string") answers[row.question_key] = answerText(row);
  });
  return answers;
}

/**
 * A stored attempt is the authoritative sitting. Marks stay hidden until the
 * learner view includes a numeric score, which the database only does after release.
 */
export function resolveMiniMockSitting(input: {
  draft?: DraftRow | null;
  attempts?: AttemptRow[] | null;
  responses?: ResponseRow[] | null;
}): Sitting {
  const attempt = (input.attempts || [])[0];
  if (attempt) {
    const rows = input.responses || [];
    const responses = answersFromResponses(rows);
    const attemptId = typeof attempt.attempt_id === "string" ? attempt.attempt_id : null;
    const released = rows.some((row) => typeof row.awarded_score === "number");
    if (!released) return { kind: "submitted", attemptId, responses };
    return {
      kind: "released",
      attemptId,
      responses,
      results: rows
        .filter((row) => typeof row.question_key === "string" && typeof row.awarded_score === "number")
        .map((row) => ({
          questionKey: String(row.question_key),
          awarded: Number(row.awarded_score),
          max: Number(row.max_score || 0),
          feedback: typeof row.feedback_summary === "string" ? row.feedback_summary : "",
          text: answerText(row)
        }))
    };
  }

  const draft = input.draft;
  const phase = draft?.state?.knowledgeReportPhase;
  const draftAnswers = stringResponses(draft?.state?.responses);
  if (phase?.phase === "submitted" || draft?.state?.submission?.status === "submitted" || draft?.status === "completed") {
    return {
      kind: "submitted",
      attemptId: typeof draft?.state?.attemptId === "string" ? draft.state.attemptId : null,
      responses: draftAnswers
    };
  }
  const startedAt = typeof phase?.authoritativeStartedAt === "string"
    ? phase.authoritativeStartedAt
    : (typeof draft?.started_at === "string" ? draft.started_at : (typeof draft?.startedAt === "string" ? draft.startedAt : null));
  if (draft && (phase?.phase === "in_progress" || startedAt)) {
    return {
      kind: "in-progress",
      revision: Number(draft.revision) || 0,
      responses: draftAnswers,
      startedAt,
      durationSeconds: typeof phase?.standardDurationSeconds === "number" ? phase.standardDurationSeconds : null,
      serverNow: typeof phase?.serverNow === "string" ? phase.serverNow : null
    };
  }
  return { kind: "not-started" };
}

export function miniMockIsSubmitted(draft: DraftRow["state"] | null | undefined, attempts?: AttemptRow[] | null): boolean {
  if ((attempts || []).length > 0) return true;
  return draft?.knowledgeReportPhase?.phase === "submitted" || draft?.submission?.status === "submitted";
}

export async function readActivityRows(
  client: QueryClient | undefined,
  table: "my_attempts" | "my_responses",
  activityKey: string
): Promise<{ consulted: boolean; rows: Array<Record<string, unknown>> }> {
  const api = client?.schema("api");
  if (typeof api?.from !== "function") return { consulted: false, rows: [] };
  const result = await api.from(table).select("*").eq("activity_key", activityKey);
  if (result?.error) throw new Error(result.error.message || "The saved sitting could not be loaded.");
  return { consulted: true, rows: Array.isArray(result.data) ? result.data as Array<Record<string, unknown>> : [] };
}
