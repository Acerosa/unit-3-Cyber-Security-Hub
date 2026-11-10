export type TimedPaperSaveRow = {
  revision?: number | null;
  save_outcome?: string | null;
  saveOutcome?: string | null;
  started_at?: string | null;
  startedAt?: string | null;
  state?: {
    responses?: Record<string, unknown>;
    knowledgeReportPhase?: Record<string, unknown>;
  } | null;
};

export type TimedSaveDecision =
  | { action: "saved"; revision: number }
  | { action: "adopt"; revision: number }
  | { action: "conflict"; revision: number; responses: Record<string, string> }
  | { action: "locked"; revision: number; responses: Record<string, string> }
  | { action: "retry" }
  | { action: "failed" };

export function responseMap(value: unknown): Record<string, string> {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const responses: Record<string, string> = {};
  for (const [key, answer] of Object.entries(source)) {
    if (typeof answer === "string") responses[key] = answer;
  }
  return responses;
}

export function sameQuestionResponses(
  left: Record<string, string>,
  right: Record<string, string>,
  questionIds: string[]
) {
  return questionIds.every((id) => (left[id] || "") === (right[id] || ""));
}

export function firstSaveRow(data: unknown): TimedPaperSaveRow | null {
  if (Array.isArray(data)) return (data[0] as TimedPaperSaveRow | undefined) || null;
  if (data && typeof data === "object") return data as TimedPaperSaveRow;
  return null;
}

/**
 * A lost response is a conflict whose stored answers are the answers just sent.
 * Adopting that revision avoids a second write and keeps the confirmed text.
 */
export function decideTimedPaperSave(input: {
  sent: Record<string, string>;
  questionIds: string[];
  row: TimedPaperSaveRow | null;
  error: boolean;
  tries: number;
}): TimedSaveDecision {
  if (input.error || !input.row) {
    return input.tries < 2 ? { action: "retry" } : { action: "failed" };
  }
  const revision = Number(input.row.revision);
  const outcome = input.row.save_outcome || input.row.saveOutcome || "saved";
  const responses = responseMap(input.row.state?.responses);
  if (outcome === "saved") return { action: "saved", revision };
  if (outcome === "conflict" && sameQuestionResponses(input.sent, responses, input.questionIds)) {
    return { action: "adopt", revision };
  }
  if (outcome === "conflict") return { action: "conflict", revision, responses };
  if (outcome === "locked") return { action: "locked", revision, responses };
  return { action: "failed" };
}
