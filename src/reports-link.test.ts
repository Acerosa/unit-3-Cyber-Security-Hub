import { describe, expect, it } from "vitest";
import { APP_CONFIG } from "./config";
import {
  REPORTS_SPA_BASE_URL,
  assertCurriculumScopeOnly,
  buildSessionReportUrl,
  resolveSessionNumber
} from "./reports-link";

describe("reports-link", () => {
  it("builds a Reports SPA URL with hub, week and session only", () => {
    const href = buildSessionReportUrl({ week: 1, session: 1 });
    expect(href).toBe(
      `${REPORTS_SPA_BASE_URL}?hub=unit-3-cyber-security&week=1&session=1`
    );
    expect(href).toContain(APP_CONFIG.hubId);
    assertCurriculumScopeOnly(href);
  });

  it("works for later Unit 3 weeks and sessions without hard-coding Week 1", () => {
    expect(buildSessionReportUrl({ week: 6, session: 2 })).toBe(
      `${REPORTS_SPA_BASE_URL}?hub=unit-3-cyber-security&week=6&session=2`
    );
  });

  it("never includes learner identity or auth tokens in the query string", () => {
    const href = buildSessionReportUrl({ week: 2, session: 1 });
    expect(href).not.toMatch(/student|learner|email|uid|token|assignment|attempt/i);
    const params = new URL(href).searchParams;
    expect([...params.keys()].sort()).toEqual(["hub", "session", "week"]);
  });

  it("resolves session numbers from package sortOrder then session id", () => {
    expect(
      resolveSessionNumber({ sessionId: "week-1-session-2", sortOrder: 2, index: 0 })
    ).toBe(2);
    expect(resolveSessionNumber({ sessionId: "week-3-session-1", index: 9 })).toBe(1);
    expect(resolveSessionNumber({ sessionId: "custom", index: 0 })).toBe(1);
  });

  it("does not calculate report readiness or completion counts", () => {
    const source = [
      buildSessionReportUrl.toString(),
      resolveSessionNumber.toString(),
      assertCurriculumScopeOnly.toString()
    ].join("\n");
    expect(source).not.toMatch(/completed|27|28|strength|latest_percentage|my_hub_activity_progress/);
  });
});
