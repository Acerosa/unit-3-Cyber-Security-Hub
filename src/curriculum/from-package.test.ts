import { afterEach, describe, expect, it } from "vitest";
import { activityFromPackage, weekPageFromPackage } from "./from-package";
import { applyUnit3Curriculum } from "./apply-runtime";
import {
  CATALOGUE_WEEKS,
  catalogueActivity,
  cataloguePlayerMode,
  catalogueSequence,
  isCatalogueWeek,
  neighboursInSequence,
  WEEK_ACTIVITY_SLUGS
} from "../catalogue/week-activities";
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
  it("enables catalogue weeks 1–7 with slug maps for every week", () => {
    expect(CATALOGUE_WEEKS).toEqual([1, 2, 3, 4, 5, 6, 7]);
    CATALOGUE_WEEKS.forEach((week) => {
      expect(isCatalogueWeek(week)).toBe(true);
      expect(Object.keys(WEEK_ACTIVITY_SLUGS[week] || {}).length).toBeGreaterThan(0);
    });
  });

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

  it("builds Week 2 sessions from the packaged curriculum", () => {
    const page = weekPageFromPackage(pkg, "week-2");
    expect(page?.week.title).toBe("Threats and Vulnerabilities");
    expect(page?.sessions.map((session) => session.id)).toEqual([
      "week-2-session-1",
      "week-2-session-2"
    ]);
    const ids = page?.sessions.flatMap((session) => session.activities.map((item) => item.id)) || [];
    expect(ids).toContain("week2-session1-retrieval");
    expect(ids).toContain("week2-threat-vulnerability-sort");
    expect(ids).toContain("week2-vulnerabilities101-reflection");
    const sequence = catalogueSequence(page, 2);
    expect(sequence[0]?.slug).toBe("session1-retrieval");
    expect(neighboursInSequence(sequence, "week2-session1-retrieval").next?.slug).toBe("threat-vulnerability-learning");
    expect(neighboursInSequence(sequence, "week2-northbank-vulnerability-register").next).toBeNull();
    expect(cataloguePlayerMode(2, "week2-session1-retrieval", catalogueActivity(pkg, "week2-session1-retrieval"))).toBe("catalogue");
    expect(cataloguePlayerMode(2, "week2-threat-vulnerability-sort", catalogueActivity(pkg, "week2-threat-vulnerability-sort"))).toBe("catalogue");
    expect(cataloguePlayerMode(2, "week2-vulnerabilities101-reflection", catalogueActivity(pkg, "week2-vulnerabilities101-reflection"))).toBe("hybrid");
    expect(cataloguePlayerMode(2, "week2-northbank-vulnerability-register", catalogueActivity(pkg, "week2-northbank-vulnerability-register"))).toBe("host");
    expect(cataloguePlayerMode(2, "week2-ocr-question-practice", catalogueActivity(pkg, "week2-ocr-question-practice"))).toBe("host");
    expect(cataloguePlayerMode(2, "week2-six-mark-response-guide", catalogueActivity(pkg, "week2-six-mark-response-guide"))).toBe("catalogue");
    expect(cataloguePlayerMode(1, "u3-w01-baseline", catalogueActivity(pkg, "u3-w01-baseline"))).toBe("catalogue");
    expect(cataloguePlayerMode(3, "week3-session1-retrieval", catalogueActivity(pkg, "week3-session1-retrieval"))).toBe("catalogue");
    expect(cataloguePlayerMode(3, "week3-attacker-case-matching", catalogueActivity(pkg, "week3-attacker-case-matching"))).toBe("catalogue");
    expect(cataloguePlayerMode(3, "week3-justified-identification", catalogueActivity(pkg, "week3-justified-identification"))).toBe("catalogue");
    expect(cataloguePlayerMode(3, "week3-ocr-question-practice", catalogueActivity(pkg, "week3-ocr-question-practice"))).toBe("host");
    expect(cataloguePlayerMode(3, "week3-peer-marking", catalogueActivity(pkg, "week3-peer-marking"))).toBe("host");
  });

  it("restores Week 3 case matching as classification with case registry fields", () => {
    const activity = catalogueActivity(pkg, "week3-attacker-case-matching");
    const blocks = activity?.blocks || [];
    expect(blocks.some((block) => block.type === "classification")).toBe(true);
    expect(blocks.some((block) => block.type === "short-response")).toBe(true);
    expect(blocks.some((block) => block.type === "reflection")).toBe(false);
    const restored = activityFromPackage(pkg, "week3-attacker-case-matching");
    expect((restored?.cases as unknown[] | undefined)?.length).toBe(8);
    expect((restored?.attackerOptions as unknown[] | undefined)?.length).toBe(8);
    expect((restored?.cards as Array<{ correctType?: string }> | undefined)?.[0]?.correctType).toBeTruthy();
  });

  it("restores Week 3 justified identification as short-response blocks", () => {
    const activity = catalogueActivity(pkg, "week3-justified-identification");
    const blocks = activity?.blocks || [];
    const shorts = blocks.filter((block) => block.type === "short-response");
    expect(shorts.length).toBe(4);
    expect(shorts.every((block) => Number((block.content as { minChars?: number }).minChars || 0) >= 150)).toBe(true);
    expect(blocks.some((block) => block.type === "reflection")).toBe(false);
  });

  it("restores Week 4 targets-methods as classification and ethical-review as short-response", () => {
    expect(cataloguePlayerMode(4, "week4-targets-methods", catalogueActivity(pkg, "week4-targets-methods"))).toBe("catalogue");
    expect(cataloguePlayerMode(4, "week4-ethical-review", catalogueActivity(pkg, "week4-ethical-review"))).toBe("catalogue");
    expect(cataloguePlayerMode(4, "week4-mtm-mapping", catalogueActivity(pkg, "week4-mtm-mapping"))).toBe("host");
    expect(cataloguePlayerMode(4, "week4-northbank-exposure", catalogueActivity(pkg, "week4-northbank-exposure"))).toBe("host");
    expect(cataloguePlayerMode(4, "week4-analyse-practice", catalogueActivity(pkg, "week4-analyse-practice"))).toBe("host");
    expect(cataloguePlayerMode(4, "week4-ocr-question-practice", catalogueActivity(pkg, "week4-ocr-question-practice"))).toBe("host");

    const targets = catalogueActivity(pkg, "week4-targets-methods");
    expect((targets?.blocks || []).some((block) => block.type === "classification")).toBe(true);
    expect((targets?.blocks || []).some((block) => block.type === "short-response")).toBe(true);
    expect((targets?.blocks || []).some((block) => block.type === "reflection")).toBe(false);
    const restoredTargets = activityFromPackage(pkg, "week4-targets-methods");
    expect((restoredTargets?.classificationItems as unknown[] | undefined)?.length).toBe(8);
    expect((restoredTargets?.targetCategories as unknown[] | undefined)?.length).toBe(4);
    expect(restoredTargets?.attackerOptions).toBeUndefined();

    const ethical = catalogueActivity(pkg, "week4-ethical-review");
    const shorts = (ethical?.blocks || []).filter((block) => block.type === "short-response");
    expect(shorts.length).toBe(3);
    expect((ethical?.blocks || []).some((block) => block.type === "reflection")).toBe(false);
  });

  it("restores Week 5 impact-classification and exercise-debrief catalogue shapes", () => {
    expect(cataloguePlayerMode(5, "week5-impact-classification", catalogueActivity(pkg, "week5-impact-classification"))).toBe("catalogue");
    expect(cataloguePlayerMode(5, "week5-exercise-debrief", catalogueActivity(pkg, "week5-exercise-debrief"))).toBe("catalogue");
    expect(cataloguePlayerMode(5, "week5-ransomware-companion", catalogueActivity(pkg, "week5-ransomware-companion"))).toBe("host");
    expect(cataloguePlayerMode(5, "week5-stakeholder-grid", catalogueActivity(pkg, "week5-stakeholder-grid"))).toBe("host");
    expect(cataloguePlayerMode(5, "week5-impact-analysis", catalogueActivity(pkg, "week5-impact-analysis"))).toBe("host");

    const classify = catalogueActivity(pkg, "week5-impact-classification");
    const classifyBlock = (classify?.blocks || []).find((block) => block.type === "classification");
    expect(classifyBlock).toBeTruthy();
    const items = ((classifyBlock?.content as { items?: Array<{ id: string; correctCategoryId?: string }> }).items) || [];
    expect(items).toHaveLength(8);
    // Primary teaching answers for ambiguous multi-accept items (see D2c port script).
    expect(items.find((item) => item.id === "c6")?.correctCategoryId).toBe("More than one category");
    expect(items.find((item) => item.id === "c7")?.correctCategoryId).toBe("More than one category");
    expect(items.find((item) => item.id === "c2")?.correctCategoryId).toBe("Disruption");
    expect((classify?.blocks || []).some((block) => block.type === "short-response")).toBe(true);
    expect((classify?.blocks || []).some((block) => block.type === "reflection")).toBe(false);

    const debrief = catalogueActivity(pkg, "week5-exercise-debrief");
    expect((debrief?.blocks || []).filter((block) => block.type === "short-response")).toHaveLength(5);
    expect((debrief?.blocks || []).some((block) => block.type === "reflection")).toBe(false);
  });

  it("restores Week 6 ethical-classification and written catalogue shapes", () => {
    expect(cataloguePlayerMode(6, "week6-ethical-classification", catalogueActivity(pkg, "week6-ethical-classification"))).toBe("catalogue");
    expect(cataloguePlayerMode(6, "week6-operational-considerations", catalogueActivity(pkg, "week6-operational-considerations"))).toBe("catalogue");
    expect(cataloguePlayerMode(6, "week6-employee-monitoring", catalogueActivity(pkg, "week6-employee-monitoring"))).toBe("catalogue");
    expect(cataloguePlayerMode(6, "week6-legislation-matching", catalogueActivity(pkg, "week6-legislation-matching"))).toBe("host");
    expect(cataloguePlayerMode(6, "week6-government-initiatives", catalogueActivity(pkg, "week6-government-initiatives"))).toBe("host");
    expect(cataloguePlayerMode(6, "week6-ncsc-guidance", catalogueActivity(pkg, "week6-ncsc-guidance"))).toBe("host");
    expect(cataloguePlayerMode(6, "week6-discuss-learning", catalogueActivity(pkg, "week6-discuss-learning"))).toBe("host");

    const classify = catalogueActivity(pkg, "week6-ethical-classification");
    const classifyBlock = (classify?.blocks || []).find((block) => block.type === "classification");
    expect(classifyBlock).toBeTruthy();
    const items = ((classifyBlock?.content as { items?: Array<{ id: string; correctCategoryId?: string }> }).items) || [];
    expect(items).toHaveLength(8);
    // Primary teaching answers for multi-accept items (D3a): prefer Unethical when law needs more facts.
    expect(items.find((item) => item.id === "e1")?.correctCategoryId).toBe("Unethical");
    expect(items.find((item) => item.id === "e5")?.correctCategoryId).toBe("Unethical");
    expect(items.find((item) => item.id === "e3")?.correctCategoryId).toBe("Both unethical and unlawful");
    expect((classify?.blocks || []).some((block) => block.type === "short-response")).toBe(true);
    expect((classify?.blocks || []).some((block) => block.type === "reflection")).toBe(false);

    const operational = catalogueActivity(pkg, "week6-operational-considerations");
    expect((operational?.blocks || []).filter((block) => block.type === "short-response")).toHaveLength(8);
    expect((operational?.blocks || []).some((block) => block.type === "reflection")).toBe(false);

    const monitoring = catalogueActivity(pkg, "week6-employee-monitoring");
    expect((monitoring?.blocks || []).filter((block) => block.type === "short-response")).toHaveLength(6);
    expect((monitoring?.blocks || []).some((block) => block.type === "reflection")).toBe(false);
  });

  it("restores Week 7 testing-matching and written catalogue shapes", () => {
    expect(cataloguePlayerMode(7, "week7-testing-matching", catalogueActivity(pkg, "week7-testing-matching"))).toBe("catalogue");
    expect(cataloguePlayerMode(7, "week7-recommendation-practice", catalogueActivity(pkg, "week7-recommendation-practice"))).toBe("catalogue");
    expect(cataloguePlayerMode(7, "week7-sandbox-observation", catalogueActivity(pkg, "week7-sandbox-observation"))).toBe("catalogue");
    expect(cataloguePlayerMode(7, "week7-northbank-risk-register", catalogueActivity(pkg, "week7-northbank-risk-register"))).toBe("host");
    expect(cataloguePlayerMode(7, "week7-heightened-threat", catalogueActivity(pkg, "week7-heightened-threat"))).toBe("host");

    const classify = catalogueActivity(pkg, "week7-testing-matching");
    const classifyBlock = (classify?.blocks || []).find((block) => block.type === "classification");
    expect(classifyBlock).toBeTruthy();
    const items = ((classifyBlock?.content as { items?: Array<{ id: string; correctCategoryId?: string }> }).items) || [];
    expect(items).toHaveLength(8);
    // Preferred teaching answers; alternatives remain in remainder only (no multi-correct UI).
    expect(items.find((item) => item.id === "m3")?.correctCategoryId).toBe("Security functionality testing");
    expect(items.find((item) => item.id === "m5")?.correctCategoryId).toBe("NIDS");
    expect(items.find((item) => item.id === "m7")?.correctCategoryId).toBe("Anomaly-based detection");
    expect(items.find((item) => item.id === "m8")?.correctCategoryId).toBe("Signature-based detection");
    expect((classify?.blocks || []).some((block) => block.type === "short-response")).toBe(true);
    expect((classify?.blocks || []).some((block) => block.type === "reflection")).toBe(false);

    const recommendation = catalogueActivity(pkg, "week7-recommendation-practice");
    expect((recommendation?.blocks || []).filter((block) => block.type === "short-response")).toHaveLength(7);
    expect((recommendation?.blocks || []).some((block) => block.type === "reflection")).toBe(false);

    const sandbox = catalogueActivity(pkg, "week7-sandbox-observation");
    expect((sandbox?.blocks || []).filter((block) => block.type === "short-response")).toHaveLength(6);
    expect((sandbox?.blocks || []).some((block) => block.type === "reflection")).toBe(false);
  });

  it("meets D3c catalogue coverage and writing inserts for Weeks 1–7", () => {
    const week1Baseline = catalogueActivity(pkg, "u3-w01-baseline");
    expect((week1Baseline?.blocks || []).some((block) => block.type === "single-choice")).toBe(true);
    expect((week1Baseline?.blocks || []).some((block) => block.type === "short-response")).toBe(true);

    const week1Incidents = catalogueActivity(pkg, "u3-w01-incidents");
    expect((week1Incidents?.blocks || []).some((block) => block.type === "classification")).toBe(true);
    expect((week1Incidents?.blocks || []).some((block) => block.type === "short-response")).toBe(true);

    const week1Retrieval = catalogueActivity(pkg, "u3-w01-retrieval");
    expect((week1Retrieval?.blocks || []).filter((block) => block.type === "single-choice").length).toBeGreaterThanOrEqual(4);

    const insertIds = [
      "week2-threat-vulnerability-learning",
      "week2-threat-vulnerability-sort",
      "week2-six-mark-response-guide",
      "week3-attacker-types-learning",
      "week4-motivations-learning",
      "week4-targets-methods",
      "week5-impacts-learning",
      "week6-ethical-learning",
      "week6-legislation-retrieval",
      "week7-risk-management-learning",
      "week7-session2-retrieval"
    ];
    for (const id of insertIds) {
      const activity = catalogueActivity(pkg, id);
      expect(
        (activity?.blocks || []).some((block) => block.type === "short-response"),
        `${id} should include a writing checkpoint`
      ).toBe(true);
    }

    for (const week of [1, 2, 3, 4, 5, 6, 7] as const) {
      const ids = Object.keys(WEEK_ACTIVITY_SLUGS[week] || {});
      const catalogueActs = ids
        .map((id) => ({ id, activity: catalogueActivity(pkg, id), mode: cataloguePlayerMode(week, id, catalogueActivity(pkg, id)) }))
        .filter((row) => row.mode === "catalogue" || row.mode === "hybrid");
      const types = new Set<string>();
      for (const row of catalogueActs) {
        for (const block of row.activity?.blocks || []) {
          const type = String(block.type || "").toLowerCase();
          if (type === "single-choice" || type === "option-cards") types.add("sc");
          if (type === "classification") types.add("cl");
          if (type === "short-response" || type === "reflection") types.add("wr");
        }
      }
      expect(types.has("sc"), `week ${week} single-choice`).toBe(true);
      expect(types.has("cl"), `week ${week} classification`).toBe(true);
      expect(types.has("wr"), `week ${week} writing`).toBe(true);
    }
  });
});
