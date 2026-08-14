import { useEffect, useRef } from "react";
import { LoadingState } from "@learning-platform/ui";
import { loadPageScripts } from "../adapters/load-hub-adapters";

export function PageHost({
  root,
  scripts,
  adaptersReady,
  className
}: {
  root: string;
  scripts: string[];
  adaptersReady: boolean;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adaptersReady || !hostRef.current) return;
    const template = document.getElementById("unit3-page-body") as HTMLTemplateElement | null;
    if (template && hostRef.current.childNodes.length === 0) {
      hostRef.current.appendChild(template.content.cloneNode(true));
    }
    void loadPageScripts(root, scripts);
  }, [adaptersReady, root, scripts]);

  if (!adaptersReady) {
    return <LoadingState message="Loading Unit 3 materials..." />;
  }

  return <div ref={hostRef} className={className} data-unit3-host="" />;
}
