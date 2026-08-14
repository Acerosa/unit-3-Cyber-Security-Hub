import type { BreadcrumbItem } from "@learning-platform/ui";
import inventory from "../test/fixtures/route-inventory.json";
import type { PageContext } from "./page-context";

export type RouteRecord = (typeof inventory.routes)[number];

export function findRoute(context: PageContext): RouteRecord | undefined {
  return inventory.routes.find((route) => route.page === context.page);
}

export function pageHeader(context: PageContext): { title: string; subtitle: string } {
  const route = findRoute(context);
  if (context.view === "week1-activity") {
    return {
      title: context.activityId || "Week 1 activity",
      subtitle: "API-driven formative activity. Answers are marked by the Week 1 Activity API."
    };
  }
  return {
    title: route?.heading || "Unit 3 Cyber Security Hub",
    subtitle: (route?.subtitle || "").replace(/\s+/g, " ").trim()
  };
}

export function breadcrumbs(context: PageContext): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: "Home", path: "" }];
  const route = findRoute(context);
  if (context.section.startsWith("week-")) {
    const week = context.week || Number(context.section.replace("week-", ""));
    items.push({
      label: `Week ${week}`,
      path: context.view === "week" ? undefined : `week-${week}/`
    });
  } else if (context.page === "resources" || context.page === "help" || context.page === "account") {
    items.push({ label: route?.heading || context.page, path: undefined });
    return items;
  }
  if (context.view !== "home" && context.view !== "week") {
    items.push({ label: route?.heading || context.activityId || "Activity", path: undefined });
  }
  if (items.length === 1 && context.view === "home") {
    items[0] = { label: "Home", path: undefined };
  }
  return items;
}
