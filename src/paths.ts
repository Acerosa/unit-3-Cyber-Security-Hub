import type { Unit3NavigationItem } from "./components/Unit3Navigation";
import { APP_CONFIG } from "./config";
import type { ContentPackage } from "./curriculum/from-package";
import { unit3RuntimeWeeks } from "./curriculum/runtime-weeks";

export function createSitePath(root: string, path = ""): string {
  const cleanRoot = root || ".";
  return path ? `${cleanRoot}/${path}` : `${cleanRoot}/`;
}

export function navigationItems(
  items: Array<{ id: string; label: string; path: string }>,
  root: string
) {
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    path: item.id === "home" ? createSitePath(root) : createSitePath(root, item.path)
  }));
}

/** Structural navigation with runtime week access metadata from published curriculum. */
export function buildUnit3Navigation(root: string, livePackage?: ContentPackage | null): Unit3NavigationItem[] {
  const runtimeWeeks = unit3RuntimeWeeks(livePackage);
  const weekById = new Map(runtimeWeeks.map((week) => [week.id, week]));

  return APP_CONFIG.navigation.map((item) => {
    const teachingWeek = item.id.startsWith("week-") ? Number(item.id.replace("week-", "")) : 0;
    const runtimeWeek = item.id.startsWith("week-")
      ? weekById.get(item.id) || {
        id: item.id,
        teachingWeek,
        status: "",
        available: false,
        title: item.label
      }
      : undefined;
    return {
      id: item.id,
      label: item.label,
      path: item.id === "home" ? createSitePath(root) : createSitePath(root, item.path),
      runtimeWeek
    };
  });
}
