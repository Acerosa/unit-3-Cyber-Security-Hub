import { cleanup, render, screen, within } from "@testing-library/react";
import { useEffect, useState, type ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import pkg from "../content/unit-3-cyber-security/package.json";
import { Unit3Navigation } from "./components/Unit3Navigation";
import type { ContentPackage } from "./curriculum/from-package";
import { configureBundledPackage, runtimeContentPackage } from "./curriculum/runtime-weeks";
import { HomePage } from "./pages/HomePage";
import { WeekPage } from "./pages/WeekPage";
import { buildUnit3Navigation } from "./paths";

const bundled = pkg as ContentPackage;

beforeAll(() => {
  configureBundledPackage(bundled);
});

afterEach(() => {
  cleanup();
  delete window.__lpPackage;
  delete window.__lpLivePackage;
  delete window.__lpPublishedCurriculum;
});

function withWeekStatus(source: ContentPackage, updates: Record<string, string>): ContentPackage {
  const clone = structuredClone(source);
  for (const week of clone.weeks || []) {
    if (updates[week.id] && week.metadata) week.metadata.status = updates[week.id];
  }
  return clone;
}

function applyLiveCurriculum(live: ContentPackage) {
  window.__lpLivePackage = live;
  window.__lpPackage = runtimeContentPackage(live);
}

function DeferredCurriculum({
  live,
  children
}: {
  live: ContentPackage;
  children: (pkg: ContentPackage | null) => ReactNode;
}) {
  const [current, setCurrent] = useState<ContentPackage | null>(null);
  useEffect(() => {
    let cancelled = false;
    void Promise.resolve(live).then((next) => {
      if (!cancelled) setCurrent(next);
    });
    return () => {
      cancelled = true;
    };
  }, [live]);
  return <>{children(current)}</>;
}

describe("Unit 3 shared week visibility", () => {
  it("A — available week is linked in navigation, home and direct route", () => {
    const live = withWeekStatus(bundled, { "week-1": "available" });
    applyLiveCurriculum(live);

    render(<HomePage root="." livePackage={live} />);
    expect(screen.getByRole("link", { name: "Open Week 1" })).toBeTruthy();
    cleanup();

    render(<Unit3Navigation items={buildUnit3Navigation(".", live)} brandTitle="Unit 3" />);
    expect(within(screen.getByRole("navigation", { name: "Main navigation" })).getByRole("link", { name: "Week 1" })).toBeTruthy();
    cleanup();

    render(
      <WeekPage
        context={{ page: "week-1", section: "week-1", root: "..", view: "week", week: 1 }}
        contentReady
        adaptersReady={false}
      />
    );
    expect(screen.getByText("Examination context")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Week not available yet" })).toBeNull();
  });

  it("B — planned week is locked in navigation, home and direct route", () => {
    const live = withWeekStatus(bundled, { "week-2": "planned" });
    applyLiveCurriculum(live);

    render(<HomePage root="." livePackage={live} />);
    expect(screen.queryByRole("link", { name: "Open Week 2" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Threats and Vulnerabilities" })).toBeTruthy();
    cleanup();

    render(<Unit3Navigation items={buildUnit3Navigation(".", live)} brandTitle="Unit 3" />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).queryByRole("link", { name: "Week 2" })).toBeNull();
    expect(within(nav).getByText("Week 2")).toBeTruthy();
    cleanup();

    render(
      <WeekPage
        context={{ page: "week-2", section: "week-2", root: "..", view: "week", week: 2 }}
        contentReady
        adaptersReady={false}
      />
    );
    expect(screen.getByRole("heading", { name: "Week not available yet" })).toBeTruthy();
    expect(screen.queryByText("Learning this week")).toBeNull();
  });

  it("C — make available unlocks navigation after runtime reload", () => {
    const planned = withWeekStatus(bundled, { "week-3": "planned" });
    const available = withWeekStatus(bundled, { "week-3": "available" });

    const { rerender } = render(<HomePage root="." livePackage={planned} />);
    expect(screen.queryByRole("link", { name: "Open Week 3" })).toBeNull();
    rerender(<HomePage root="." livePackage={available} />);
    expect(screen.getByRole("link", { name: "Open Week 3" })).toBeTruthy();
  });

  it("D — hide from learners locks navigation, home and direct route", () => {
    const available = withWeekStatus(bundled, { "week-3": "available" });
    const planned = withWeekStatus(bundled, { "week-3": "planned" });

    const { rerender: rerenderHome } = render(<HomePage root="." livePackage={available} />);
    expect(screen.getByRole("link", { name: "Open Week 3" })).toBeTruthy();
    rerenderHome(<HomePage root="." livePackage={planned} />);
    expect(screen.queryByRole("link", { name: "Open Week 3" })).toBeNull();
    cleanup();

    const { rerender: rerenderWeek } = render(
      <WeekPage
        context={{ page: "week-3", section: "week-3", root: "..", view: "week", week: 3 }}
        contentReady
        adaptersReady={false}
      />
    );
    applyLiveCurriculum(available);
    expect(screen.getByText("Examination context")).toBeTruthy();
    applyLiveCurriculum(planned);
    rerenderWeek(
      <WeekPage
        context={{ page: "week-3", section: "week-3", root: "..", view: "week", week: 3 }}
        contentReady
        adaptersReady={false}
      />
    );
    expect(screen.getByRole("heading", { name: "Week not available yet" })).toBeTruthy();
  });

  it("E — non-sequential availability keeps weeks 1 and 3 open while week 2 is locked", () => {
    const live = withWeekStatus(bundled, {
      "week-1": "available",
      "week-2": "planned",
      "week-3": "available"
    });
    applyLiveCurriculum(live);

    render(<HomePage root="." livePackage={live} />);
    expect(screen.getByRole("link", { name: "Open Week 1" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Open Week 2" })).toBeNull();
    expect(screen.getByRole("link", { name: "Open Week 3" })).toBeTruthy();
    cleanup();

    render(<Unit3Navigation items={buildUnit3Navigation(".", live)} brandTitle="Unit 3" />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Week 1" })).toBeTruthy();
    expect(within(nav).queryByRole("link", { name: "Week 2" })).toBeNull();
    expect(within(nav).getByRole("link", { name: "Week 3" })).toBeTruthy();
  });

  it("F — live publication status overrides bundled fallback both ways", () => {
    const bundledAvailable = withWeekStatus(bundled, { "week-4": "available" });
    const livePlanned = withWeekStatus(bundled, { "week-4": "planned" });
    expect(runtimeContentPackage(livePlanned).weeks?.find((week) => week.id === "week-4")?.metadata?.status)
      .toBe("planned");

    render(<HomePage root="." livePackage={livePlanned} />);
    expect(screen.queryByRole("link", { name: "Open Week 4" })).toBeNull();
    cleanup();

    const bundledPlanned = withWeekStatus(bundled, { "week-4": "planned" });
    const liveAvailable = withWeekStatus(bundled, { "week-4": "available" });
    expect(runtimeContentPackage(liveAvailable).weeks?.find((week) => week.id === "week-4")?.metadata?.status)
      .toBe("available");
    render(<HomePage root="." livePackage={liveAvailable} />);
    expect(screen.getByRole("link", { name: "Open Week 4" })).toBeTruthy();
  });
});
