import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { APP_CONFIG } from "./config";
import { breadcrumbs } from "./page-copy";
import { navigationItems } from "./paths";
import { WeekPage } from "./pages/WeekPage";

afterEach(cleanup);

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
  });
});
