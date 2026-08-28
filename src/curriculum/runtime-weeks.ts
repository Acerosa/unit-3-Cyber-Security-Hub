import {
  overlayLiveWeekMetadata,
  weeksFromPublication,
  type RuntimeWeekRecord
} from "@learning-platform/core/curriculum-runtime";
import type { ContentPackage } from "./from-package";

export type { RuntimeWeekRecord };

let bundledPackage: ContentPackage | null = null;

export function configureBundledPackage(pkg: ContentPackage) {
  bundledPackage = pkg;
}

function requireBundled(): ContentPackage {
  if (!bundledPackage) {
    throw new Error("Unit 3 bundled curriculum is not configured");
  }
  return bundledPackage;
}

export function runtimeContentPackage(live?: ContentPackage | null): ContentPackage {
  const bundled = requireBundled();
  if (!live) return bundled;
  const teaching: ContentPackage = {
    ...bundled,
    ...(live.version ? { version: live.version } : {}),
    ...(live.hub ? { hub: live.hub } : {}),
    ...(live.curriculum ? { curriculum: live.curriculum } : {}),
    activities: live.activities?.length ? live.activities : bundled.activities,
    sessions: live.sessions?.length ? live.sessions : bundled.sessions,
    learningOutcomes: live.learningOutcomes?.length ? live.learningOutcomes : bundled.learningOutcomes
  };
  return overlayLiveWeekMetadata(teaching, live) as ContentPackage;
}

export function unit3RuntimeWeeks(live?: ContentPackage | null): RuntimeWeekRecord[] {
  return weeksFromPublication(requireBundled(), live);
}

export function runtimeWeekForTeachingWeek(
  live: ContentPackage | null | undefined,
  teachingWeek: number
): RuntimeWeekRecord | null {
  return unit3RuntimeWeeks(live).find((week) => week.teachingWeek === teachingWeek) || null;
}
