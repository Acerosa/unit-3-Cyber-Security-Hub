import { describe, expect, it } from "vitest";
import { normalizeMcqQuestion, normalizeOption, optionId, optionLabel } from "./options";

describe("quiz option helpers", () => {
  it("uses Week 1 text / optionId display for published, local and string shapes", () => {
    expect(optionLabel({ optionId: "C", text: "River!Glass7-Planet" })).toBe("River!Glass7-Planet");
    expect(optionLabel({ id: "b", label: "Protecting systems, networks and data" })).toBe(
      "Protecting systems, networks and data"
    );
    expect(optionLabel("Installing every software update")).toBe("Installing every software update");
    expect(optionLabel({ optionId: "A" })).toBe("A");
  });

  it("normalises published { id, label } onto the Week 1 { optionId, text } shape", () => {
    const option = normalizeOption({ id: "b", label: "Protecting systems, networks and data" }, 1);
    expect(option.optionId).toBe("b");
    expect(option.text).toBe("Protecting systems, networks and data");
    expect(option.id).toBe("b");
    expect(option.label).toBe("Protecting systems, networks and data");
    expect(optionId({ id: "b", label: "Protecting systems, networks and data" }, 1)).toBe("b");
  });

  it("derives correctIndex from correctOptionId", () => {
    const question = normalizeMcqQuestion({
      id: "s1-q1",
      type: "single",
      prompt: "Which statement best describes cyber security?",
      correctOptionId: "b",
      options: [
        { id: "a", label: "Installing every software update on the same day it is released" },
        { id: "b", label: "Protecting systems, networks and data from unauthorised access, damage or disruption" }
      ]
    });
    expect(question.correctIndex).toBe(1);
    expect(question.options[1].text).toContain("Protecting systems");
    expect(optionLabel(question.options[1])).toContain("Protecting systems");
  });
});
