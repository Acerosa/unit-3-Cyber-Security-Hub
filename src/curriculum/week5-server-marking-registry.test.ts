import { describe, expect, it } from "vitest";
import activities from "../../content/unit-3-cyber-security/activities.json";
import pkg from "../../content/unit-3-cyber-security/package.json";
import { WEEK_HOST_ACTIVITY_IDS } from "../catalogue/week-activities";
import {
  collectWeek5PackageQuestions,
  missingServerMarkingKeys,
  WEEK5_REVISED_ACTIVITY_IDS,
  type Week5ActivitySource
} from "./week5-client-marking-keys";
import { WEEK5_SERVER_MARKING_REGISTRY } from "./week5-server-marking-registry";

const packageActivities = (pkg as unknown as { activities: Week5ActivitySource[] }).activities;
const activityDocuments = activities as unknown as Week5ActivitySource[];

describe("week 5 server marking registry", () => {
  it("registers every revised package question the client submits", () => {
    const questions = collectWeek5PackageQuestions(packageActivities);
    expect(questions).toHaveLength(WEEK5_SERVER_MARKING_REGISTRY.length);
    expect(missingServerMarkingKeys(questions, WEEK5_SERVER_MARKING_REGISTRY)).toEqual([]);
    expect(questions.map((question) => `${question.activityId}:${question.stableKey}`)).toContain(
      "week5-ransomware-companion:SPOT-1"
    );
    expect(questions.map((question) => `${question.activityId}:${question.stableKey}`)).toContain(
      "week5-impacts-learning:K5"
    );
  });

  it("fails validation when the marking import does not contain the package question", () => {
    const questions = collectWeek5PackageQuestions(packageActivities);
    const withoutSpot = WEEK5_SERVER_MARKING_REGISTRY.filter((row) =>
      !(row.activityId === "week5-ransomware-companion" && row.stableKey === "SPOT-1")
    );
    expect(missingServerMarkingKeys(questions, withoutSpot)).toContain(
      "week5-ransomware-companion SPOT-1"
    );
  });

  it("keeps authored feedback on automatically marked questions", () => {
    const questions = collectWeek5PackageQuestions(packageActivities);
    const automatic = questions.filter((question) =>
      question.mode === "single-choice"
      || question.mode === "classification"
      || question.mode === "ordering-exact"
    );
    expect(automatic.length).toBeGreaterThan(0);
    expect(automatic.filter((question) => !question.hasAuthoredFeedback).map((question) =>
      `${question.activityId}:${question.stableKey}`
    )).toEqual([]);
  });

  it("publishes marking version 1.2.0 only for the revised catalogue activities", () => {
    const catalogueIds = new Set(
      WEEK5_SERVER_MARKING_REGISTRY
        .filter((row) => row.serverVersion === "1.2.0")
        .map((row) => row.activityId)
    );
    expect([...catalogueIds].sort()).toEqual(
      WEEK5_REVISED_ACTIVITY_IDS.filter((id) => id !== "week5-ocr-question-practice").sort()
    );
    for (const activity of packageActivities) {
      const id = String(activity.id || "");
      if (catalogueIds.has(id)) {
        expect(activity.version).toBe("1.2.0");
      } else {
        expect(activity.version).not.toBe("1.2.0");
      }
    }
    for (const activity of activityDocuments) {
      const id = String(activity.id || "");
      if (catalogueIds.has(id)) expect(activity.version).toBe("1.2.0");
    }
    expect(WEEK_HOST_ACTIVITY_IDS[5]).toContain("week5-ocr-question-practice");
    expect(WEEK_HOST_ACTIVITY_IDS[5]).not.toContain("week5-ransomware-companion");
    expect(
      WEEK5_SERVER_MARKING_REGISTRY.find((row) =>
        row.activityId === "week5-ocr-question-practice" && row.stableKey === "OCR1"
      )?.serverVersion
    ).toBe("1.1.0");
  });
});
