import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import pkg from "../content/unit-3-cyber-security/package.json";
import { APP_CONFIG } from "./config";
import { configureBundledPackage } from "./curriculum/runtime-weeks";
import { breadcrumbs, pageHeader } from "./page-copy";
import { navigationItems } from "./paths";
import { ActivityPage } from "./pages/ActivityPage";
import { PageHost } from "./pages/PageHost";
import { WeekPage } from "./pages/WeekPage";

vi.mock("./adapters/load-hub-adapters", () => ({
  loadHubAdapters: async () => {},
  loadPageScripts: async () => {}
}));

beforeAll(() => {
  configureBundledPackage(pkg as import("./curriculum/from-package").ContentPackage);
});

afterEach(() => {
  delete window.Unit3Week2Progress;
  delete window.Unit3Week2Submit;
  delete window.Unit3Week3Progress;
  delete window.Unit3Week4Progress;
  delete window.Unit3Week5Progress;
  delete window.Unit3Week6Progress;
  delete window.Unit3Week7Progress;
  delete window.__lpPackage;
  delete window.__lpLivePackage;
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
        contentReady={false}
        adaptersReady={false}
      />
    );
    expect(screen.getByText("Loading curriculum...")).toBeTruthy();
    expect(screen.queryByText("Examination context")).toBeNull();
  });

  it("docks the catalogue progress panel from Unit 3 completion summary", () => {
    window.__lpPackage = pkg;
    window.Unit3Week2Progress = {
      getCompletionSummary: () => ({ completed: 3, total: 10 })
    };
    render(
      <WeekPage
        context={{ page: "week-2", section: "week-2", root: "..", view: "week", week: 2 }}
        contentReady
        adaptersReady
      />
    );

    const panel = screen.getByRole("complementary", { name: "Week 2 progress" });
    expect(panel.getAttribute("data-lp-practice-progress-panel")).toBe("");
    expect(panel.getAttribute("data-lp-docked")).toBe("left");
    expect(panel.getAttribute("data-lp-collapsed")).toBe("true");
    expect(screen.getByLabelText("3 of 10 correct")).toBeTruthy();
    expect(panel.querySelector("[data-lp-progress-badge]")).toBeNull();
    expect(screen.getAllByRole("link", { name: "Open activity" }).length).toBeGreaterThan(0);
    expect(screen.queryByText("3 of 10 complete (30%)")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Show progress details" }));
    expect(panel.getAttribute("data-lp-collapsed")).toBe("false");
    expect(panel.querySelector("[data-lp-progress-badge]")?.textContent).toMatch(
      /Week 2: Threats and Vulnerabilities/
    );
    expect(screen.getByRole("button", { name: "Hide progress details" })).toBeTruthy();
  });

  it("lists Week 2 catalogue activities as linked cards, not one stacked session", () => {
    window.__lpPackage = pkg;
    window.Unit3Week2Progress = {
      getCompletionSummary: () => ({ completed: 0, total: 11 }),
      markStarted: vi.fn(),
      markCompleted: vi.fn()
    };
    render(
      <WeekPage
        context={{ page: "week-2", section: "week-2", root: "..", view: "week", week: 2 }}
        contentReady
        adaptersReady
      />
    );

    const links = screen.getAllByRole("link", { name: "Open activity" });
    expect(links).toHaveLength(11);
    expect(links.map((link) => link.getAttribute("href"))).toEqual(expect.arrayContaining([
      "../week-2/session1-retrieval/",
      "../week-2/threat-vulnerability-sort/",
      "../week-2/vulnerabilities101/",
      "../week-2/ocr-practice/",
      "../week-2/vulnerability-register/"
    ]));
    expect(screen.getAllByText("Session 1 Retrieval Quiz").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Threat or Vulnerability Sort").length).toBeGreaterThan(0);
    expect(links[0].getAttribute("href")).toContain("week-2/session1-retrieval/");
    expect(screen.queryByText("Which statement best describes cyber security?")).toBeNull();
    expect(document.querySelector('[data-lp-block="classification"]')).toBeNull();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
    expect(screen.getByRole("complementary", { name: "Week 2 progress" }).getAttribute("data-lp-docked")).toBe("left");
  });

  it("renders a Week 2 activity with a link to the next activity", () => {
    window.__lpPackage = pkg;
    window.Unit3Week2Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-2-session1-retrieval",
          section: "week-2",
          root: "../..",
          view: "activity",
          week: 2,
          activity: "session1-retrieval"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(screen.getByText("Which statement best describes cyber security?")).toBeTruthy();
    expect(document.querySelector('[data-lp-activity="week2-session1-retrieval"]')).toBeTruthy();
    const next = screen.getByRole("link", { name: /Next: Threats and Vulnerabilities Learning/ });
    expect(next.getAttribute("href")).toContain("week-2/threat-vulnerability-learning/");
    expect(screen.getByRole("link", { name: "Week 2 activities" }).getAttribute("href")).toContain("week-2/");
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("renders Week 2 classification through InteractiveActivity", () => {
    window.__lpPackage = pkg;
    window.Unit3Week2Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-2-threat-vulnerability-sort",
          section: "week-2",
          root: "../..",
          view: "activity",
          week: 2,
          activity: "threat-vulnerability-sort"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-block="classification"]')).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
    expect(screen.getByRole("link", { name: /Next: TryHackMe: Vulnerabilities 101/ }).getAttribute("href")).toContain("week-2/vulnerabilities101/");
  });

  it("keeps TryHackMe hybrid: practical shell plus catalogue reflection", () => {
    window.__lpPackage = pkg;
    window.Unit3Week2Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-2-vulnerabilities101",
          section: "week-2",
          root: "../..",
          view: "activity",
          week: 2,
          activity: "vulnerabilities101"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector("[data-unit3-host]")).toBeTruthy();
    expect(document.querySelector('[data-lp-block="reflection"]')).toBeTruthy();
    expect(screen.getByRole("link", { name: /Next: Session 2 Retrieval Quiz/ })).toBeTruthy();
  });

  it("keeps Week 2 host engines on PageHost without catalogue player", () => {
    window.__lpPackage = pkg;
    window.Unit3Week2Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-2-ocr-practice",
          section: "week-2",
          root: "../..",
          view: "activity",
          week: 2,
          activity: "ocr-practice"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector("[data-unit3-host]")).toBeTruthy();
    expect(document.querySelector("[data-lp-activity]")).toBeNull();
  });

  it("renders Week 1 baseline with OptionCards and short-response writing", () => {
    window.__lpPackage = pkg;
    render(
      <ActivityPage
        context={{
          page: "week-1-baseline",
          section: "week-1",
          root: "../..",
          view: "activity",
          week: 1,
          activity: "baseline"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="u3-w01-baseline"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="option-cards"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="short-response"]')).toBeTruthy();
    expect(document.querySelector("textarea[data-lp-response]")).toBeTruthy();
    expect(document.querySelector("[data-lp-char-count]")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Save response/i })).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("renders Week 1 incidents as catalogue classification", () => {
    window.__lpPackage = pkg;
    render(
      <ActivityPage
        context={{
          page: "week-1-incidents",
          section: "week-1",
          root: "../..",
          view: "activity",
          week: 1,
          activity: "incidents"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="u3-w01-incidents"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="classification"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="short-response"]')).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("exposes OptionCards, classification and writing on catalogue path for Weeks 1–7", () => {
    window.__lpPackage = pkg;
    window.Unit3Week2Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    window.Unit3Week3Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    window.Unit3Week4Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    window.Unit3Week5Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    window.Unit3Week6Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    window.Unit3Week7Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };

    const samples: Array<{
      week: number;
      activity: string;
      page: string;
      section: string;
      expectOptionCards?: boolean;
      expectClassification?: boolean;
      expectWriting?: boolean;
    }> = [
      { week: 1, activity: "retrieval-quiz", page: "week-1-retrieval-quiz", section: "week-1", expectOptionCards: true },
      { week: 1, activity: "incidents", page: "week-1-incidents", section: "week-1", expectClassification: true, expectWriting: true },
      { week: 2, activity: "session1-retrieval", page: "week-2-session1-retrieval", section: "week-2", expectOptionCards: true },
      { week: 2, activity: "threat-vulnerability-sort", page: "week-2-threat-vulnerability-sort", section: "week-2", expectClassification: true, expectWriting: true },
      { week: 3, activity: "session1-retrieval", page: "week-3-session1-retrieval", section: "week-3", expectOptionCards: true },
      { week: 3, activity: "attacker-case-matching", page: "week-3-attacker-case-matching", section: "week-3", expectClassification: true, expectWriting: true },
      { week: 4, activity: "motivations-learning", page: "week-4-motivations-learning", section: "week-4", expectOptionCards: true, expectWriting: true },
      { week: 4, activity: "targets-methods", page: "week-4-targets-methods", section: "week-4", expectClassification: true, expectWriting: true },
      { week: 5, activity: "impacts-learning", page: "week-5-impacts-learning", section: "week-5", expectOptionCards: true, expectWriting: true },
      { week: 5, activity: "impact-classification", page: "week-5-impact-classification", section: "week-5", expectClassification: true, expectWriting: true },
      { week: 6, activity: "ethical-learning", page: "week-6-ethical-learning", section: "week-6", expectOptionCards: true, expectWriting: true },
      { week: 6, activity: "ethical-classification", page: "week-6-ethical-classification", section: "week-6", expectClassification: true, expectWriting: true },
      { week: 7, activity: "risk-management-learning", page: "week-7-risk-management-learning", section: "week-7", expectOptionCards: true, expectWriting: true },
      { week: 7, activity: "testing-matching", page: "week-7-testing-matching", section: "week-7", expectClassification: true, expectWriting: true }
    ];

    for (const sample of samples) {
      cleanup();
      render(
        <ActivityPage
          context={{
            page: sample.page,
            section: sample.section,
            root: "../..",
            view: "activity",
            week: sample.week,
            activity: sample.activity
          }}
          contentReady
          adaptersReady
        />
      );
      if (sample.expectOptionCards) {
        expect(document.querySelector('[data-lp-block="option-cards"]'), `week ${sample.week} ${sample.activity} option-cards`).toBeTruthy();
      }
      if (sample.expectClassification) {
        expect(document.querySelector('[data-lp-block="classification"]'), `week ${sample.week} ${sample.activity} classification`).toBeTruthy();
      }
      if (sample.expectWriting) {
        const writing =
          document.querySelector('[data-lp-block="short-response"]') ||
          document.querySelector('[data-lp-block="reflection"]');
        expect(writing, `week ${sample.week} ${sample.activity} writing`).toBeTruthy();
        expect(document.querySelector("[data-lp-char-count]"), `week ${sample.week} ${sample.activity} char-count`).toBeTruthy();
      }
      expect(document.querySelector("[data-unit3-host]")).toBeNull();
    }
  });
  it("renders Week 2 six-mark guide as catalogue MCQ without host scripts", () => {
    window.__lpPackage = pkg;
    window.Unit3Week2Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-2-six-mark-guide",
          section: "week-2",
          root: "../..",
          view: "activity",
          week: 2,
          activity: "six-mark-guide"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week2-six-mark-response-guide"]')).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
    expect(screen.getByRole("complementary", { name: "Six-Mark Response Guide" })).toBeTruthy();
  });

  it("paints Week 2 catalogue cards when content is ready before adapters", () => {
    window.__lpPackage = pkg;
    render(
      <WeekPage
        context={{ page: "week-2", section: "week-2", root: "..", view: "week", week: 2 }}
        contentReady
        adaptersReady={false}
      />
    );

    expect(screen.getAllByRole("link", { name: "Open activity" })).toHaveLength(11);
    expect(screen.queryByText("Loading Unit 3 materials...")).toBeNull();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("paints a catalogue activity when content is ready before adapters", () => {
    window.__lpPackage = pkg;
    render(
      <ActivityPage
        context={{
          page: "week-2-session1-retrieval",
          section: "week-2",
          root: "../..",
          view: "activity",
          week: 2,
          activity: "session1-retrieval"
        }}
        contentReady
        adaptersReady={false}
      />
    );

    expect(document.querySelector('[data-lp-activity="week2-session1-retrieval"]')).toBeTruthy();
    expect(screen.getByText("Which statement best describes cyber security?")).toBeTruthy();
    expect(screen.queryByText("Loading Unit 3 materials...")).toBeNull();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("keeps PageHost waiting on adapters", () => {
    render(<PageHost root=".." scripts={[]} adaptersReady={false} />);
    expect(screen.getByText("Loading Unit 3 materials...")).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("renders Week 3 case matching as catalogue classification", () => {
    window.__lpPackage = pkg;
    window.Unit3Week3Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-3-attacker-case-matching",
          section: "week-3",
          root: "../..",
          view: "activity",
          week: 3,
          activity: "attacker-case-matching"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week3-attacker-case-matching"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="classification"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="short-response"]')).toBeTruthy();
    expect(document.querySelector("textarea[data-lp-response]")).toBeTruthy();
    expect(document.querySelector("[data-lp-char-count]")).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("renders Week 3 justified identification as catalogue short responses", () => {
    window.__lpPackage = pkg;
    window.Unit3Week3Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-3-justified-identification",
          section: "week-3",
          root: "../..",
          view: "activity",
          week: 3,
          activity: "justified-identification"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week3-justified-identification"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-lp-block="short-response"]').length).toBe(4);
    expect(document.querySelector("textarea[data-lp-response]")).toBeTruthy();
    expect(document.querySelector("[data-lp-char-count]")).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("keeps Week 3 OCR practice on the host shell", () => {
    window.__lpPackage = pkg;
    window.Unit3Week3Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-3-ocr-practice",
          section: "week-3",
          root: "../..",
          view: "activity",
          week: 3,
          activity: "ocr-practice"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector("[data-unit3-host]")).toBeTruthy();
    expect(document.querySelector("[data-lp-activity]")).toBeNull();
  });

  it("renders Week 4 targets-methods as catalogue classification", () => {
    window.__lpPackage = pkg;
    window.Unit3Week4Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-4-targets-methods",
          section: "week-4",
          root: "../..",
          view: "activity",
          week: 4,
          activity: "targets-methods"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week4-targets-methods"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="classification"]')).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("renders Week 4 ethical-review as catalogue short responses", () => {
    window.__lpPackage = pkg;
    window.Unit3Week4Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-4-ethical-review",
          section: "week-4",
          root: "../..",
          view: "activity",
          week: 4,
          activity: "ethical-review"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week4-ethical-review"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-lp-block="short-response"]').length).toBe(3);
    expect(document.querySelector("textarea[data-lp-response]")).toBeTruthy();
    expect(document.querySelector("[data-lp-char-count]")).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("keeps Week 4 multi-field worksheets on the host shell", () => {
    window.__lpPackage = pkg;
    window.Unit3Week4Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-4-mtm-mapping",
          section: "week-4",
          root: "../..",
          view: "activity",
          week: 4,
          activity: "mtm-mapping"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector("[data-unit3-host]")).toBeTruthy();
    expect(document.querySelector("[data-lp-activity]")).toBeNull();
  });

  it("renders Week 5 impact-classification as catalogue classification", () => {
    window.__lpPackage = pkg;
    window.Unit3Week5Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-5-impact-classification",
          section: "week-5",
          root: "../..",
          view: "activity",
          week: 5,
          activity: "impact-classification"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week5-impact-classification"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="classification"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="short-response"]')).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("renders Week 5 exercise-debrief as catalogue short responses", () => {
    window.__lpPackage = pkg;
    window.Unit3Week5Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-5-exercise-debrief",
          section: "week-5",
          root: "../..",
          view: "activity",
          week: 5,
          activity: "exercise-debrief"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week5-exercise-debrief"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-lp-block="short-response"]').length).toBe(5);
    expect(document.querySelector("textarea[data-lp-response]")).toBeTruthy();
    expect(document.querySelector("[data-lp-char-count]")).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("keeps Week 5 ransomware companion on the host shell", () => {
    window.__lpPackage = pkg;
    window.Unit3Week5Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-5-ransomware-companion",
          section: "week-5",
          root: "../..",
          view: "activity",
          week: 5,
          activity: "ransomware-companion"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector("[data-unit3-host]")).toBeTruthy();
    expect(document.querySelector("[data-lp-activity]")).toBeNull();
  });

  it("renders Week 6 ethical-classification as catalogue classification", () => {
    window.__lpPackage = pkg;
    window.Unit3Week6Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-6-ethical-classification",
          section: "week-6",
          root: "../..",
          view: "activity",
          week: 6,
          activity: "ethical-classification"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week6-ethical-classification"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="classification"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="short-response"]')).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("renders Week 6 operational-considerations as catalogue short responses", () => {
    window.__lpPackage = pkg;
    window.Unit3Week6Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-6-operational-considerations",
          section: "week-6",
          root: "../..",
          view: "activity",
          week: 6,
          activity: "operational-considerations"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week6-operational-considerations"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-lp-block="short-response"]').length).toBe(8);
    expect(document.querySelector("textarea[data-lp-response]")).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("renders Week 6 employee-monitoring as catalogue short responses", () => {
    window.__lpPackage = pkg;
    window.Unit3Week6Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-6-employee-monitoring",
          section: "week-6",
          root: "../..",
          view: "activity",
          week: 6,
          activity: "employee-monitoring"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week6-employee-monitoring"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-lp-block="short-response"]').length).toBe(6);
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("keeps Week 6 legislation-matching on the host shell", () => {
    window.__lpPackage = pkg;
    window.Unit3Week6Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-6-legislation-matching",
          section: "week-6",
          root: "../..",
          view: "activity",
          week: 6,
          activity: "legislation-matching"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector("[data-unit3-host]")).toBeTruthy();
    expect(document.querySelector("[data-lp-activity]")).toBeNull();
  });

  it("renders Week 7 testing-matching as catalogue classification", () => {
    window.__lpPackage = pkg;
    window.Unit3Week7Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-7-testing-matching",
          section: "week-7",
          root: "../..",
          view: "activity",
          week: 7,
          activity: "testing-matching"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week7-testing-matching"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="classification"]')).toBeTruthy();
    expect(document.querySelector('[data-lp-block="short-response"]')).toBeTruthy();
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("renders Week 7 recommendation-practice as catalogue short responses", () => {
    window.__lpPackage = pkg;
    window.Unit3Week7Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-7-recommendation-practice",
          section: "week-7",
          root: "../..",
          view: "activity",
          week: 7,
          activity: "recommendation-practice"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week7-recommendation-practice"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-lp-block="short-response"]').length).toBe(7);
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("renders Week 7 sandbox-observation as catalogue short responses", () => {
    window.__lpPackage = pkg;
    window.Unit3Week7Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-7-sandbox-observation",
          section: "week-7",
          root: "../..",
          view: "activity",
          week: 7,
          activity: "sandbox-observation"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector('[data-lp-activity="week7-sandbox-observation"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-lp-block="short-response"]').length).toBe(6);
    expect(document.querySelector("[data-unit3-host]")).toBeNull();
  });

  it("keeps Week 7 risk-register on the host shell", () => {
    window.__lpPackage = pkg;
    window.Unit3Week7Progress = { markStarted: vi.fn(), markCompleted: vi.fn() };
    render(
      <ActivityPage
        context={{
          page: "week-7-risk-register",
          section: "week-7",
          root: "../..",
          view: "activity",
          week: 7,
          activity: "risk-register"
        }}
        contentReady
        adaptersReady
      />
    );

    expect(document.querySelector("[data-unit3-host]")).toBeTruthy();
    expect(document.querySelector("[data-lp-activity]")).toBeNull();
  });
});
