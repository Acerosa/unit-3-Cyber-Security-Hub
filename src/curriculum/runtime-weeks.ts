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

function mergeActivities(
  bundled: ContentPackage["activities"],
  live: ContentPackage["activities"]
): ContentPackage["activities"] {
  const bundledList = bundled || [];
  const liveList = live || [];
  if (!liveList.length) return bundledList;
  const liveById = new Map(liveList.map((item) => [item.id, item]));
  const seen = new Set<string>();
  const merged: NonNullable<ContentPackage["activities"]> = [];
  for (const item of liveList) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }
  for (const item of bundledList) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }
  return merged;
}

export function runtimeContentPackage(live?: ContentPackage | null): ContentPackage {
  const bundled = requireBundled();
  if (!live) return bundled;
  const teaching: ContentPackage = {
    ...bundled,
    ...(live.version ? { version: live.version } : {}),
    ...(live.hub ? { hub: live.hub } : {}),
    ...(live.curriculum ? { curriculum: live.curriculum } : {}),
    activities: mergeActivities(bundled.activities, live.activities),
    sessions: bundled.sessions,
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
