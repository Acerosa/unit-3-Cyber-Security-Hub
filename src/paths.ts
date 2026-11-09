import type { Unit3NavigationItem } from "./components/Unit3Navigation";
import { APP_CONFIG } from "./config";
import type { ContentPackage } from "./curriculum/from-package";
import { unit3RuntimeWeeks } from "./curriculum/runtime-weeks";
import { examPracticeReleased } from "./exam-practice/release";

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

/** Structural navigation only — safe before bundled curriculum is configured. */
export function buildUnit3NavigationFallback(root: string): Unit3NavigationItem[] {
  return APP_CONFIG.navigation.map((item) => ({
    id: item.id,
    label: item.label,
    path: item.id === "home" ? createSitePath(root) : createSitePath(root, item.path)
  }));
}

/** Structural navigation with runtime week access metadata from published curriculum. */
export function buildUnit3Navigation(
  root: string,
  livePackage?: ContentPackage | null,
  released = examPracticeReleased()
): Unit3NavigationItem[] {
  const runtimeWeeks = unit3RuntimeWeeks(livePackage);
  const weekById = new Map(runtimeWeeks.map((week) => [week.id, week]));

  const items = APP_CONFIG.navigation.map((item) => {
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
  if (!released) return items;
  const account = items.findIndex((item) => item.id === "account");
  const exam = {
    id: "exam-practice",
    label: "Exam Practice",
    path: createSitePath(root, "exam-practice/")
  };
  if (account < 0) return [...items, exam];
  return [...items.slice(0, account), exam, ...items.slice(account)];
}
