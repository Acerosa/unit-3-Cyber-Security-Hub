import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { activityFromPackage } from "./from-package";
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

function dataFile(name: string) {
  return readFileSync(resolve(__dirname, `../../week-6/data/${name}`), "utf8");
}

function packageActivity(id: string) {
  return (pkg.activities as Array<{ id: string; version: string }>).find((item) => item.id === id);
}

describe("Week 6 OCR 2.6 legal alignment", () => {
  it("keeps Week 6 activity identifiers and versions unchanged", () => {
    WEEK6_IDS.forEach((id) => {
      const activity = packageActivity(id);
      expect(activity, id).toBeTruthy();
      expect(activity?.version).toBe("1.0.0");
      expect(activityFromPackage(pkg as import("./from-package").ContentPackage, id)?.activityId).toBe(id);
    });
  });

  it("teaches current Computer Misuse Act 1990 offences rather than unauthorised modification as the live section 3 label", () => {
    const learning = dataFile("legislation-learning.js");
    const matching = dataFile("legislation-matching.js");
    const restoredLearning = activityFromPackage(
      pkg as import("./from-package").ContentPackage,
      "week6-legislation-learning"
    ) as { laws?: Array<{ purpose?: string; dutyOffence?: string }> };
    const restoredMatching = activityFromPackage(
      pkg as import("./from-package").ContentPackage,
      "week6-legislation-matching"
    ) as { dutyOptions?: string[]; scenarios?: Array<{ id: string; duty?: string }> };

    expect(learning).toContain("unauthorised access to computer material");
    expect(learning).toContain("unauthorised access with intent to commit or facilitate further offences");
    expect(learning).toContain("unauthorised acts intended to impair, or reckless as to impairing, computer operations");
    expect(restoredLearning.laws?.[0]?.dutyOffence).toContain(
      "unauthorised acts intended to impair, or reckless as to impairing, computer operations"
    );

    expect(matching).toContain("Unauthorised acts intended to impair, or reckless as to impairing, computer operations");
    expect(matching).not.toMatch(/duty:\s*'Unauthorised modification of computer material'/);
    expect(restoredMatching.dutyOptions).toContain(
      "Unauthorised acts intended to impair, or reckless as to impairing, computer operations"
    );
    expect(restoredMatching.dutyOptions).not.toContain("Unauthorised modification of computer material");
    expect(restoredMatching.scenarios?.find((item) => item.id === "m4")?.duty).toBe(
      "Unauthorised acts intended to impair, or reckless as to impairing, computer operations"
    );
  });

  it("names UK GDPR, the Data Protection Act 2018 and Data (Use and Access) Act 2025 without inventing penalties or notification periods", () => {
    const learning = dataFile("legislation-learning.js");
    const restored = activityFromPackage(
      pkg as import("./from-package").ContentPackage,
      "week6-legislation-learning"
    ) as { laws?: Array<{ purpose?: string; dutyOffence?: string }> };
    const dataProtection = restored.laws?.find((item) => /data protection/i.test(item.purpose || "") || /UK GDPR/.test(item.purpose || ""));

    expect(learning).toContain("UK GDPR");
    expect(learning).toContain("Data Protection Act 2018");
    expect(learning).toContain("Data (Use and Access) Act 2025");
    expect(learning).toMatch(/amends, rather than replaces/);
    expect(learning).toContain("lawful processing");
    expect(learning).toContain("security of personal data");
    expect(learning).toContain("accountability");
    expect(learning).toContain("transparency");
    expect(learning).not.toMatch(/72 hour/i);
    expect(learning).not.toMatch(/notification period of/i);
    expect(dataProtection?.purpose).toContain("UK GDPR");
    expect(dataProtection?.purpose).toContain("Data Protection Act 2018");
    expect(dataProtection?.purpose).toContain("Data (Use and Access) Act 2025");
  });

  it("treats the Police and Justice Act 2006 as an amendment of the Computer Misuse Act 1990", () => {
    const learning = dataFile("legislation-learning.js");
    const matching = dataFile("legislation-matching.js");
    expect(learning).toContain("The Police and Justice Act 2006 amended the Computer Misuse Act 1990");
    expect(learning).toContain("making, supplying or obtaining articles");
    expect(learning).toContain("possessing legitimate security testing tools is not automatically unlawful");
    expect(matching).toContain("Possessing legitimate authorised security testing tools is not automatically unlawful");
  });

  it("keeps government initiatives as supporting OCR content and identifies Cyber Streetwise as historical", () => {
    const initiatives = dataFile("government-initiatives.js");
    const restored = activityFromPackage(
      pkg as import("./from-package").ContentPackage,
      "week6-government-initiatives"
    ) as { teachingNote?: string; initiatives?: Array<{ id: string; purpose?: string }> };
    expect(initiatives).toContain("not a separately prescribed compulsory category under section 2.6");
    expect(initiatives).toContain("historical public awareness campaign");
    expect(initiatives).toContain("Cyber Aware");
    expect(restored.teachingNote).toContain("supporting teaching examples");
    expect(restored.initiatives?.find((item) => item.id === "streetwise")?.purpose).toMatch(/historical/i);
  });

  it("labels OCR 2.6 as ethical, legal, operational and stakeholder implications", () => {
    const revision = dataFile("revision-organiser.js");
    const restored = activityFromPackage(
      pkg as import("./from-package").ContentPackage,
      "week6-revision-organiser"
    ) as { sections?: Array<{ code?: string; title?: string; fields?: unknown[] }> };
    expect(revision).toContain("Other considerations (ethical, legal, operational, implications for stakeholders)");
    expect(revision).not.toContain("Other considerations (ethical, legal, operational, government initiatives)");
    const section26 = restored.sections?.find((item) => item.code === "2.6" || item.title?.includes("implications for stakeholders"));
    expect(section26?.code).toBe("2.6");
    expect(section26?.title).toContain("implications for stakeholders");
    expect(Array.isArray(section26?.fields) && section26.fields.length).toBeGreaterThan(0);
  });

  it("keeps Northbank stakeholder roles and does not treat one law as the only possible answer where several may apply", () => {
    const monitoring = activityFromPackage(
      pkg as import("./from-package").ContentPackage,
      "week6-employee-monitoring"
    ) as { stakeholderRoles?: Array<{ label?: string }>; scenario?: string };
    const labels = (monitoring.stakeholderRoles || []).map((item) => String(item.label));
    expect(labels).toEqual(
      expect.arrayContaining(["Employees", "Managers", "Customers", "The data protection regulator", "Shareholders"])
    );
    expect(monitoring.scenario).toContain("Northbank Community Health Partnership");

    const matching = activityFromPackage(
      pkg as import("./from-package").ContentPackage,
      "week6-legislation-matching"
    ) as { scenarios?: Array<{ id: string; feedback?: string }> };
    expect(matching.scenarios?.find((item) => item.id === "m2")?.feedback).toMatch(/Computer Misuse Act 1990 may also apply/i);

    const retrieval = dataFile("legislation-retrieval.js");
    expect(retrieval).toContain("The same incident can raise more than one legal consideration");
  });
});
