import type { ReactNode } from "react";
import { isCatalogueReactType, normaliseActivityType, type ActivityBlockDocument } from "@learning-platform/ui";

/**
 * Prose-only fallback for InteractiveActivity.
 * Never fake short-response / reflection — those must render via catalogue React.
 */
export function renderCatalogueFallback(block: ActivityBlockDocument): ReactNode {
  const type = normaliseActivityType(block.type);
  if (isCatalogueReactType(type)) {
    return (
      <p className="lp-card__meta" data-lp-block={type}>
        This {type} block should render through the shared catalogue player.
      </p>
    );
  }
  const content = (block.content || {}) as { text?: string; prompt?: string; level?: number };
  const text = String(content.text || content.prompt || "");
  if (type === "heading" && text) {
    const Tag = content.level === 3 ? "h3" : "h2";
    return <Tag>{text}</Tag>;
  }
  if (type === "paragraph" && text) return <p>{text}</p>;
  if (type === "markdown") {
    if (!text || text.trim().startsWith("```json")) return null;
    return <p data-lp-block="markdown">{text}</p>;
  }
  if (type === "callout" && text) {
    return (
      <aside className="lp-card" data-lp-block="callout">
        <p>{text}</p>
      </aside>
    );
  }
  if (text) return <p data-lp-block={type}>{text}</p>;
  return (
    <p className="lp-card__meta" data-lp-block={type}>
      This {type || "unknown"} block is not part of the React activity catalogue yet.
    </p>
  );
}
