import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { renderCatalogueFallback } from "./fallback";
import type { ActivityBlockDocument } from "@learning-platform/ui";

function block(partial: { id?: string; type: string; content?: Record<string, unknown> }): ActivityBlockDocument {
  return {
    id: partial.id || "block-1",
    type: partial.type,
    content: (partial.content || {}) as ActivityBlockDocument["content"]
  } as ActivityBlockDocument;
}

describe("catalogue fallback", () => {
  it("keeps prose helpers and refuses to own React text types", () => {
    const { container: heading } = render(<>{renderCatalogueFallback(block({
      type: "heading",
      content: { text: "Title", level: 2 }
    }))}</>);
    expect(heading.querySelector("h2")?.textContent).toBe("Title");

    const { container: reflection } = render(<>{renderCatalogueFallback(block({
      type: "reflection",
      content: { prompt: "Write a note" }
    }))}</>);
    expect(reflection.querySelector("textarea")).toBeNull();
    expect(reflection.textContent).toMatch(/shared catalogue player/i);

    const { container: shortResponse } = render(<>{renderCatalogueFallback(block({
      type: "short-response",
      content: { prompt: "Short answer" }
    }))}</>);
    expect(shortResponse.querySelector("textarea")).toBeNull();
    expect(shortResponse.textContent).toMatch(/shared catalogue player/i);
  });
});
