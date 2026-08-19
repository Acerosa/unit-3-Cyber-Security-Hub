import { afterEach, describe, expect, it } from "vitest";
import { activityFromPackage } from "./from-package";
import { applyUnit3Curriculum } from "./apply-runtime";
import pkg from "../../content/unit-3-cyber-security/package.json";

declare global {
  interface Window {
    Week2ThreatVulnerabilitySort?: { title?: string; cards?: Array<{ id: string }> };
  }
}

afterEach(() => {
  delete window.__lpPackage;
  delete window.__lpPublishedCurriculum;
  delete window.Week2ThreatVulnerabilitySort;
  document.body.removeAttribute("data-curriculum-source");
});

describe("Unit 3 package hydration", () => {
  it("restores sort cards from published blocks rather than Git banks", () => {
    const restored = activityFromPackage(pkg, "week2-threat-vulnerability-sort");
    expect(restored?.title).toBe("Threat or Vulnerability Sort");
    const cards = restored?.cards as Array<{ id: string }> | undefined;
    expect(Array.isArray(cards)).toBe(true);
    expect(cards?.[0]?.id).toBe("sort-01");
  });

  it("restores Week 2 retrieval options with Week 1 text and optionId fields", () => {
    const restored = activityFromPackage(pkg, "week2-session1-retrieval");
    const questions = restored?.questions as Array<{
      prompt?: string;
      options?: Array<{ optionId?: string; text?: string; id?: string; label?: string }>;
      correctIndex?: number;
      correctOptionId?: string;
    }>;
    expect(questions?.[0]?.prompt).toBe("Which statement best describes cyber security?");
    const options = questions?.[0]?.options || [];
    expect(options.length).toBe(4);
    expect(options[0]?.text).toBeTruthy();
    expect(options[0]?.optionId).toBeTruthy();
    expect(options[0]?.text).not.toBe("[object Object]");
    expect(options[0]?.text).not.toMatch(/\[object Object\]/);
    expect(typeof questions?.[0]?.correctIndex).toBe("number");
    expect(questions?.[0]?.correctIndex).toBeGreaterThanOrEqual(0);
    const correct = options[questions?.[0]?.correctIndex || 0];
    expect(correct?.optionId).toBe(questions?.[0]?.correctOptionId);
    expect(correct?.text).toMatch(/Protecting systems/);
  });

  it("applies a mutated published title without reading week data files", () => {
    const edited = structuredClone(pkg);
    const activity = edited.activities.find((item) => item.id === "week2-threat-vulnerability-sort");
    if (!activity) throw new Error("missing activity");
    activity.metadata.title = "Admin edited sort title";
    applyUnit3Curriculum({
      source: "published",
      package: edited,
      state: { state: "PUBLISHED" }
    }, window);
    expect(window.__lpPublishedCurriculum).toBe(true);
    expect(document.body.dataset.curriculumSource).toBe("published");
    expect(window.Week2ThreatVulnerabilitySort?.title).toBe("Admin edited sort title");
  });
});
