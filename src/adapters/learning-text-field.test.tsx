/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from "vitest";
import { fireEvent, waitFor } from "@testing-library/react";
import { installUnit3LearningText } from "./learning-text-field";

describe("Unit3LearningText.mount", () => {
  afterEach(() => {
    document.body.replaceChildren();
    delete window.Unit3LearningText;
  });

  it("mounts LearningTextField without a Save button and syncs values", async () => {
    installUnit3LearningText();
    const host = document.createElement("div");
    document.body.appendChild(host);

    let latest = "";
    const handle = window.Unit3LearningText!.mount(host, {
      id: "pilot-field",
      prompt: "Pilot prompt",
      minChars: 20,
      value: "",
      onChange: (value) => {
        latest = value;
      }
    });

    await waitFor(() => {
      expect(host.querySelector("textarea.lp-textarea")).toBeTruthy();
    });

    expect(host.querySelector("button")).toBeNull();
    expect(host.querySelector("[data-lp-learning-text-field]")).toBeTruthy();
    expect(host.textContent).toContain("0 / 20 characters minimum");

    const field = host.querySelector("textarea") as HTMLTextAreaElement;
    fireEvent.change(field, { target: { value: "Typed in host field" } });
    expect(latest).toBe("Typed in host field");
    expect(handle.getValue()).toBe("Typed in host field");
    expect(handle.metMin()).toBe(false);

    fireEvent.paste(field, {
      clipboardData: { getData: () => "nope" }
    } as unknown as Event);
    await waitFor(() => {
      expect(host.textContent).toMatch(/Paste is disabled/);
    });

    handle.destroy();
    expect(host.querySelector("textarea")).toBeNull();
  });

  it("createMounts tracks and destroys nested field wrappers", async () => {
    installUnit3LearningText();
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const batch = window.Unit3LearningText!.createMounts();
    batch.mount(parent, {
      wrapClass: "w4-reflection-field",
      id: "batch-a",
      prompt: "Batch A",
      minChars: 10,
      value: "hello"
    });
    batch.mount(parent, {
      wrapClass: "w4-reflection-field",
      id: "batch-b",
      prompt: "Batch B",
      minChars: 10,
      value: ""
    });
    await waitFor(() => {
      expect(parent.querySelectorAll("textarea.lp-textarea").length).toBe(2);
    });
    batch.destroyAll();
    expect(parent.querySelector("textarea")).toBeNull();
  });
});
