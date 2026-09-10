import { APP_CONFIG } from "./config";

/** Live standalone Reports SPA (Phase 1B). Curriculum scope only — never learner identity. */
export const REPORTS_SPA_BASE_URL = "https://acerosa.github.io/learning-platform-reports/";

export const REPORT_LINK_LABEL = "View lesson report";

export type SessionReportScope = {
  hub?: string;
  week: number;
  session: number;
};

const FORBIDDEN_REPORT_QUERY_KEYS = Object.freeze([
  "learnerId",
  "learner_id",
  "studentId",
  "student_id",
  "studentNumber",
  "email",
  "uid",
  "userId",
  "user_id",
  "auth_uid",
  "access_token",
  "refresh_token",
  "token",
  "assignmentId",
  "attemptId"
]);

/**
 * Resolve a 1-based session number from package metadata or session id.
 * Does not inspect completion, scores, or reporting membership.
 */
export function resolveSessionNumber(input: {
  sessionId: string;
  sortOrder?: number | string | null;
  index?: number;
}): number {
  const fromMeta = Number(input.sortOrder);
  if (Number.isFinite(fromMeta) && fromMeta > 0) {
    return Math.trunc(fromMeta);
  }
  const match = String(input.sessionId || "").match(/session-(\d+)/i);
  if (match) {
    return Number(match[1]);
  }
  const index = Number(input.index);
  if (Number.isFinite(index) && index >= 0) {
    return Math.trunc(index) + 1;
  }
  throw new Error("SESSION_NUMBER_UNRESOLVED");
}

/**
 * Build a Reports SPA deep link with hub + week + session only.
 * Never embeds learner identity, tokens, scores, or assignment ids.
 */
export function buildSessionReportUrl(scope: SessionReportScope): string {
  const hub = String(scope.hub || APP_CONFIG.hubId).trim();
  const week = Number(scope.week);
  const session = Number(scope.session);
  if (!hub || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(hub)) {
    throw new Error("INVALID_REPORT_HUB");
  }
  if (!Number.isInteger(week) || week < 1) {
    throw new Error("INVALID_REPORT_WEEK");
  }
  if (!Number.isInteger(session) || session < 1) {
    throw new Error("INVALID_REPORT_SESSION");
  }

  const params = new URLSearchParams({
    hub,
    week: String(week),
    session: String(session)
  });
  for (const key of FORBIDDEN_REPORT_QUERY_KEYS) {
    if (params.has(key)) {
      throw new Error("REPORT_URL_IDENTITY_FORBIDDEN");
    }
  }

  const url = new URL(REPORTS_SPA_BASE_URL);
  url.search = params.toString();
  return url.toString();
}

export function assertCurriculumScopeOnly(url: string): void {
  const parsed = new URL(url);
  const keys = [...parsed.searchParams.keys()];
  if (keys.sort().join(",") !== "hub,session,week") {
    throw new Error("REPORT_URL_UNEXPECTED_PARAMS");
  }
  for (const key of FORBIDDEN_REPORT_QUERY_KEYS) {
    if (parsed.searchParams.has(key)) {
      throw new Error("REPORT_URL_IDENTITY_FORBIDDEN");
    }
  }
}
