import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { setAuthoredHtml } from "@learning-platform/core";
import { activityFromPackage, type ContentPackage } from "./from-package";
import { applyUnit3Curriculum } from "./apply-runtime";
import { configureBundledPackage } from "./runtime-weeks";
import { cataloguePlayerMode, catalogueActivity } from "../catalogue/week-activities";
import pkg from "../../content/unit-3-cyber-security/package.json";

const WEEK6_IDS = [
  "week6-lo2-diagnostic",
  "week6-ethical-learning",
  "week6-ethical-classification",
  "week6-legislation-learning",
  "week6-legislation-matching",
  "week6-operational-considerations",
  "week6-government-initiatives",
  "week6-ncsc-guidance",
  "week6-exercise-decision-record",
  "week6-session1-review",
  "week6-legislation-retrieval",
  "week6-employee-monitoring",
  "week6-stakeholder-debate",
  "week6-discuss-learning",
  "week6-discuss-planner",
  "week6-ocr-question-practice",
  "week6-answer-improvement",
  "week6-revision-organiser"
] as const;

const HOST_WEEK6_IDS = [
  "week6-ocr-question-practice",
  "week6-answer-improvement",
  "week6-discuss-planner",
  "week6-stakeholder-debate",
  "week6-revision-organiser",
  "week6-exercise-decision-record",
  "week6-legislation-matching",
  "week6-government-initiatives",
  "week6-ncsc-guidance",
  "week6-discuss-learning"
] as const;

type OrganiserSection = {
  id?: string;
  code?: string;
  title?: string;
  fields?: Array<{ id?: string; label?: string; minLength?: number }>;
};

type ContentBlock = {
  id?: string;
  content?: { text?: string };
};

beforeAll(() => {
  configureBundledPackage(pkg as ContentPackage);
});

afterEach(() => {
  delete window.__lpPackage;
  delete window.__lpLivePackage;
  delete window.__lpPublishedCurriculum;
  delete window.Week6RevisionOrganiser;
  delete window.Week6LegislationMatching;
  document.body.replaceChildren();
  document.body.removeAttribute("data-curriculum-source");
});

function remainderOf(activity: { blocks?: ContentBlock[] } | undefined) {
  const remainder = (activity?.blocks || []).find((item) => String(item.id || "").endsWith("source-remainder"));
  const text = String(remainder?.content?.text || "");
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (!match) throw new Error("missing remainder json");
  return { remainder, parsed: JSON.parse(match[1]) as Record<string, unknown> };
}

function withRemainder(
  source: ContentPackage,
  activityId: string,
  nextRemainder: Record<string, unknown>
): ContentPackage {
  const edited = structuredClone(source);
  const activity = (edited.activities || []).find((item) => item.id === activityId);
  if (!activity) throw new Error(`missing ${activityId}`);
  const remainder = (activity.blocks || []).find((item) => String(item.id || "").endsWith("source-remainder")) as ContentBlock | undefined;
  if (!remainder?.content) throw new Error(`missing remainder for ${activityId}`);
  remainder.content.text = "```json\n" + JSON.stringify(nextRemainder, null, 2) + "\n```";
  return edited;
}

function productionShapedOrganiserPackage(): ContentPackage {
  const activity = (pkg.activities as Array<{ id: string; blocks?: ContentBlock[] }>).find(
    (item) => item.id === "week6-revision-organiser"
  );
  const { parsed } = remainderOf(activity);
  const stripped = { ...parsed };
  delete stripped.sections;
  delete stripped.total;
  delete stripped.activityName;
  delete stripped.activityVersion;
  return withRemainder(pkg as ContentPackage, "week6-revision-organiser", stripped);
}

describe("Week 6 published revision-organiser hydration", () => {
  it("demonstrates the original failure: heading reconstruction drops organiser fields and codes", () => {
    const productionShaped = productionShapedOrganiserPackage();
    const restored = activityFromPackage(productionShaped, "week6-revision-organiser") as {
      sections?: OrganiserSection[];
    };
    expect(restored.sections?.map((item) => item.id)).toEqual(["2-1", "2-2", "2-3", "2-4", "2-5", "2-6"]);
    expect(restored.sections?.every((item) => item.fields == null)).toBe(true);
    expect(restored.sections?.every((item) => item.code == null)).toBe(true);
    expect(() => {
      restored.sections?.forEach((section) => {
        section.fields!.forEach((field) => field.id);
      });
    }).toThrow();
  });

  it("keeps remainder sections, codes and fields when heading blocks are also present", () => {
    const restored = activityFromPackage(pkg as ContentPackage, "week6-revision-organiser") as {
      activityId?: string;
      total?: number;
      sections?: OrganiserSection[];
    };
    expect(restored.activityId).toBe("week6-revision-organiser");
    expect(restored.total).toBe(6);
    expect(restored.sections).toHaveLength(6);
    const section26 = restored.sections?.find((item) => item.id === "2-6" || item.code === "2.6");
    expect(section26?.code).toBe("2.6");
    expect(section26?.title).toContain("ethical, legal, operational, implications for stakeholders");
    expect(section26?.fields?.map((field) => field.id)).toEqual([
      "secure",
      "revision",
      "terminology",
      "misconception",
      "example",
      "practiceQuestion"
    ]);
  });

  it("prefers structured remainder sections over heading titles", () => {
    const activity = (pkg.activities as Array<{ id: string; blocks?: ContentBlock[] }>).find(
      (item) => item.id === "week6-revision-organiser"
    );
    const { parsed } = remainderOf(activity);
    const sections = (parsed.sections as OrganiserSection[]).map((section) =>
      section.id === "2-6" ? { ...section, title: "Remainder-owned 2.6 title" } : section
    );
    const edited = withRemainder(pkg as ContentPackage, "week6-revision-organiser", { ...parsed, sections });
    const restored = activityFromPackage(edited, "week6-revision-organiser") as { sections?: OrganiserSection[] };
    expect(restored.sections?.find((item) => item.id === "2-6")?.title).toBe("Remainder-owned 2.6 title");
    expect(restored.sections?.find((item) => item.id === "2-6")?.fields?.length).toBe(6);
  });

  it("hydrates the organiser global from a published package and renders section 2.6", () => {
    applyUnit3Curriculum(
      {
        source: "published",
        package: pkg as ContentPackage,
        state: { state: "PUBLISHED" }
      },
      window
    );
    expect(window.__lpPublishedCurriculum).toBe(true);
    const hydrated = window.Week6RevisionOrganiser as { sections?: OrganiserSection[]; activityId?: string };
    expect(hydrated.activityId).toBe("week6-revision-organiser");
    expect(hydrated.sections?.find((item) => item.code === "2.6")?.fields?.length).toBe(6);

    const host = document.createElement("div");
    host.id = "w6-activity-host";
    document.body.appendChild(host);
    const rendererWindow = window as unknown as {
      setAuthoredHtml?: typeof setAuthoredHtml;
      Unit3LearningText?: {
        createMounts: () => {
          destroyAll: () => void;
          mount: (parent: HTMLElement, options: { prompt?: string; wrapClass?: string }) => void;
        };
      };
    };
    rendererWindow.setAuthoredHtml = setAuthoredHtml;
    rendererWindow.Unit3LearningText = {
      createMounts() {
        return {
          destroyAll() {},
          mount(parent, options) {
            const wrap = document.createElement("div");
            wrap.className = options.wrapClass || "";
            const label = document.createElement("label");
            label.textContent = options.prompt || "";
            wrap.appendChild(label);
            parent.appendChild(wrap);
          }
        };
      }
    };

    const source = readFileSync(resolve(__dirname, "../../week-6/revision-organiser/app.js"), "utf8");
    const run = new Function("window", "document", "setAuthoredHtml", source);
    run(window, document, setAuthoredHtml);
    delete rendererWindow.Unit3LearningText;
    delete rendererWindow.setAuthoredHtml;

    expect(host.textContent).toContain("Section 2.6:");
    expect(host.textContent).toContain("ethical, legal, operational, implications for stakeholders");
    expect(host.textContent).toContain("Topics I am secure on");
    expect(host.querySelectorAll(".w6-review-item").length).toBeGreaterThanOrEqual(6);
  });

  it("keeps other Week 6 identifiers, host/catalogue split, and matching m4 unchanged", () => {
    WEEK6_IDS.forEach((id) => {
      const restored = activityFromPackage(pkg as ContentPackage, id);
      expect(restored?.activityId, id).toBe(id);
    });
    HOST_WEEK6_IDS.forEach((id) => {
      expect(cataloguePlayerMode(6, id, catalogueActivity(pkg as ContentPackage, id))).toBe("host");
    });
    const matching = activityFromPackage(pkg as ContentPackage, "week6-legislation-matching") as {
      dutyOptions?: string[];
      scenarios?: Array<{ id: string; duty?: string }>;
    };
    expect(matching.dutyOptions).toContain(
      "Unauthorised acts intended to impair, or reckless as to impairing, computer operations"
    );
    expect(matching.dutyOptions).not.toContain("Unauthorised modification of computer material");
    expect(matching.scenarios?.find((item) => item.id === "m4")?.duty).toBe(
      "Unauthorised acts intended to impair, or reckless as to impairing, computer operations"
    );

    const ethical = activityFromPackage(pkg as ContentPackage, "week6-ethical-learning") as {
      sections?: Array<{ id?: string; content?: string; check?: unknown }>;
    };
    expect(ethical.sections?.map((item) => item.id)).toEqual(["disclosure", "monitoring", "auth", "ethics-law"]);
    expect(ethical.sections?.every((item) => String(item.content || "").length > 0)).toBe(true);

    const debate = activityFromPackage(pkg as ContentPackage, "week6-stakeholder-debate") as {
      fields?: unknown[];
    };
    expect(Array.isArray(debate.fields) && debate.fields.length).toBeGreaterThan(0);
  });
});

declare global {
  interface Window {
    Week6RevisionOrganiser?: unknown;
    Week6LegislationMatching?: unknown;
  }
}
