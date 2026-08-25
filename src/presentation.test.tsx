import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { APP_CONFIG } from "./config";
import { breadcrumbs, pageHeader } from "./page-copy";
import { navigationItems } from "./paths";
import { WeekPage } from "./pages/WeekPage";

vi.mock("./adapters/load-hub-adapters", () => ({
  loadHubAdapters: async () => {},
  loadPageScripts: async () => {}
}));

afterEach(() => {
  delete window.Unit3Week2Progress;
  cleanup();
});

describe("Unit 3 presentation", () => {
  it("keeps Home, Weeks 1–7, Resources, Help and Account in the authoritative nav", () => {
    const labels = APP_CONFIG.navigation.map((item) => item.label);
    expect(labels).toEqual([
      "Home",
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
      "Week 6",
      "Week 7",
      "Resources",
      "Help",
      "Account"
    ]);
    const items = navigationItems([...APP_CONFIG.navigation], "../..");
    expect(items.find((item) => item.id === "week-6")?.path).toBe("../../week-6/");
    expect(items.find((item) => item.id === "home")?.path).toBe("../../");
  });

  it("builds nested breadcrumbs with path rather than raw href", () => {
    const items = breadcrumbs({
      page: "week-6-ncsc-guidance",
      section: "week-6",
      root: "../..",
      view: "activity",
      week: 6,
      activity: "ncsc-guidance"
    });
    expect(items.map((item) => item.label)).toEqual([
      "Home",
      "Week 6",
      "8. NCSC Exercise in a Box Guidance"
    ]);
    expect(items[0].path).toBe("");
    expect(items[1].path).toBe("week-6/");
    expect(items[0].href).toBeUndefined();
  });

  it("keeps learner-facing activity copy free of API and TEST language", () => {
    const header = pageHeader({
      page: "week1-activity",
      section: "week-1",
      root: "..",
      view: "week1-activity",
      activityId: "U3-W01-BASELINE"
    });
    expect(header.title).toBe("Week 1 activity");
    expect(header.subtitle).toMatch(/practice/i);
    expect(header.subtitle).not.toMatch(/API|TEST/i);
    expect(header.title).not.toMatch(/API|TEST/i);
  });

  it("renders WeekView exam context around hub-owned week content", () => {
    render(
      <WeekPage
        context={{ page: "week-2", section: "week-2", root: "..", view: "week", week: 2 }}
        adaptersReady={false}
      />
    );
    expect(screen.getByText("Examination context")).toBeTruthy();
    expect(screen.getByText("OCR Level 3 IT")).toBeTruthy();
    expect(screen.getByText("Learning this week")).toBeTruthy();
    expect(screen.queryByRole("complementary", { name: "Week 2 progress" })).toBeNull();
  });

  it("docks the catalogue progress panel from Unit 3 completion summary", () => {
    window.Unit3Week2Progress = {
      getCompletionSummary: () => ({ completed: 3, total: 10 })
    };
    render(
      <WeekPage
        context={{ page: "week-2", section: "week-2", root: "..", view: "week", week: 2 }}
        adaptersReady
      />
    );

    const panel = screen.getByRole("complementary", { name: "Week 2 progress" });
    expect(panel.getAttribute("data-lp-practice-progress-panel")).toBe("");
    expect(panel.getAttribute("data-lp-docked")).toBe("left");
    expect(panel.getAttribute("data-lp-collapsed")).toBe("true");
    expect(screen.getByLabelText("3 of 10 correct")).toBeTruthy();
    expect(panel.querySelector("[data-lp-progress-badge]")).toBeNull();
    expect(document.querySelector("[data-unit3-host]")).toBeTruthy();
    expect(screen.queryByText("3 of 10 complete (30%)")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Show progress details" }));
    expect(panel.getAttribute("data-lp-collapsed")).toBe("false");
    expect(panel.querySelector("[data-lp-progress-badge]")?.textContent).toMatch(
      /Week 2: Threats and Vulnerabilities/
    );
    expect(screen.getByRole("button", { name: "Hide progress details" })).toBeTruthy();
  });
});
