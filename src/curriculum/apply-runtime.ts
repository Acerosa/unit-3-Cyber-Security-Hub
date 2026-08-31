import globals from "./runtime-globals.json";
import { activityFromPackage, type ContentPackage } from "./from-package";
import { runtimeContentPackage } from "./runtime-weeks";
import { setAuthoredHtml } from "@learning-platform/core";

export type CurriculumRuntime = {
  source?: string;
  package?: ContentPackage | null;
  state?: { state?: string; message?: string } | null;
  publication?: { version?: string; hub?: string; course?: string } | null;
};

function bannerHost(doc: Document) {
  let host = doc.getElementById("lp-publication-status");
  if (!host) {
    host = doc.createElement("div");
    host.id = "lp-publication-status";
    doc.body.prepend(host);
  }
  return host;
}

export function applyUnit3Curriculum(
  runtime: CurriculumRuntime,
  target: Window & typeof globalThis = window,
  renderStatus?: (state: unknown) => string
) {
  const livePackage = runtime.package || null;
  const pkg = runtimeContentPackage(livePackage);
  const source = runtime.source || "none";
  target.__lpLivePackage = livePackage || undefined;
  target.__lpPackage = pkg || undefined;
  target.__lpPublishedCurriculum = Boolean(pkg);
  if (target.document?.body) {
    target.document.body.dataset.curriculumSource = source;
    target.document.body.dataset.publicationState = runtime.state?.state || "ERROR";
  }
  if (runtime.state && target.document && typeof renderStatus === "function") {
    setAuthoredHtml(bannerHost(target.document), renderStatus(runtime.state));
  }
  if (source !== "published") {
    console.warn("UNIT3_CURRICULUM_FALLBACK", source, runtime.state?.state || "ERROR");
  }
  if (!pkg) return runtime;
  Object.entries(globals).forEach(([activityId, globalName]) => {
    const restored = activityFromPackage(pkg, activityId);
    if (restored) {
      Object.defineProperty(target, globalName, {
        configurable: true,
        writable: true,
        value: restored
      });
    }
  });
  return runtime;
}

export function liveContentPackage(): ContentPackage | null {
  if (typeof window !== "undefined" && window.__lpLivePackage) {
    return window.__lpLivePackage as ContentPackage;
  }
  return null;
}

export function activeContentPackage(pkg?: ContentPackage | null): ContentPackage | null {
  if (pkg) return pkg;
  if (typeof window !== "undefined" && window.__lpPackage) {
    return window.__lpPackage as ContentPackage;
  }
  return null;
}

import { ensureBundledConfigured } from "../platform";

export async function loadUnit3Curriculum(platform: {
  curriculum: {
    loadLatest: () => Promise<unknown>;
    renderStatus?: (state: unknown) => string;
  };
}) {
  const [, runtime] = await Promise.all([
    ensureBundledConfigured(),
    platform.curriculum.loadLatest()
  ]);
  return applyUnit3Curriculum(runtime as CurriculumRuntime, window, (state) => platform.curriculum.renderStatus?.(state) || "");
}
