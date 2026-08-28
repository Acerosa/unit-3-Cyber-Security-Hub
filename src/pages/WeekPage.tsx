import { useEffect, useMemo, useState } from "react";
import { PracticeProgressPanel, WeekAccessGuard, WeekView } from "@learning-platform/ui";
import { loadPageScripts } from "../adapters/load-hub-adapters";
import {
  CATALOGUE_PROGRESS_SCRIPTS,
  isCatalogueWeek,
  slugForCatalogueActivity
} from "../catalogue/week-activities";
import { activeContentPackage, liveContentPackage } from "../curriculum/apply-runtime";
import { weekPageFromPackage } from "../curriculum/from-package";
import { runtimeWeekForTeachingWeek } from "../curriculum/runtime-weeks";
import { createSitePath } from "../paths";
import type { PageContext } from "../page-context";
import { findRoute } from "../page-copy";
import { PageHost } from "./PageHost";

const WEEK_TITLES: Record<number, string> = {
  1: "Introduction to Cyber Security",
  2: "Threats and Vulnerabilities",
  3: "Types of attacker",
  4: "Motivations and targets",
  5: "Impacts of cyber security incidents",
  6: "Ethical, legal and operational considerations",
  7: "Risk management, testing and monitoring"
};

function outcomeFromSubtitle(subtitle: string) {
  const match = subtitle.match(/\b(LO\d)\b/i);
  return match ? [{ id: match[1].toUpperCase(), title: match[1].toUpperCase() }] : [];
}

function progressStore(week: number) {
  return window[`Unit3Week${week}Progress` as "Unit3Week2Progress"];
}

function adjacentWeekLink(
  root: string,
  teachingWeek: number,
  livePackage: ReturnType<typeof liveContentPackage>
) {
  const record = runtimeWeekForTeachingWeek(livePackage, teachingWeek);
  if (!record?.available) return null;
  return {
    label: `Week ${teachingWeek}`,
    href: createSitePath(root, `week-${teachingWeek}/`)
  };
}

export function WeekPage({
  context,
  contentReady,
  adaptersReady
}: {
  context: PageContext;
  contentReady: boolean;
  adaptersReady: boolean;
}) {
  const route = findRoute(context);
  const week = context.week || 1;
  const weekId = `week-${week}`;
  const weekBadge = `Week ${week}: ${WEEK_TITLES[week] || ""}`.trim();
  const livePackage = contentReady ? liveContentPackage() : null;
  const content = contentReady ? activeContentPackage() : null;
  const runtimeWeek = useMemo(
    () => runtimeWeekForTeachingWeek(livePackage, week),
    [livePackage, week]
  );
  const guardWeek = runtimeWeek || {
    id: weekId,
    teachingWeek: week,
    status: "",
    available: false,
    title: route?.heading || `Week ${week}`
  };
  const model = useMemo(
    () => (isCatalogueWeek(week) && content ? weekPageFromPackage(content, weekId) : null),
    [content, week, weekId]
  );
  const useCatalogue = Boolean(model?.sessions.some((session) => session.activities.length));
  const [legacyProgress, setLegacyProgress] = useState<{ completed: number; total: number } | null>(null);

  useEffect(() => {
    if (!adaptersReady) return;
    if (useCatalogue) {
      const scripts = CATALOGUE_PROGRESS_SCRIPTS[week] || [];
      if (scripts.length) void loadPageScripts(context.root, scripts);
    }
    const read = () => {
      const summary = progressStore(week)?.getCompletionSummary?.();
      if (summary) setLegacyProgress({ completed: summary.completed, total: summary.total });
    };
    read();
    window.addEventListener("unit3:backend-progress", read);
    return () => window.removeEventListener("unit3:backend-progress", read);
  }, [adaptersReady, context.root, useCatalogue, week]);

  const catalogueSessions = useMemo(() => {
    if (!useCatalogue || !model || !content) return [];
    return model.sessions.map((session) => ({
      id: session.id,
      title: session.title,
      kind: session.kind,
      summary: session.summary,
      defaultOpen: session.defaultOpen,
      activities: session.activities.map((item) => {
        const published = (content.activities || []).find((entry) => entry.id === item.id);
        const slug = slugForCatalogueActivity(week, item.id);
        return {
          title: item.title,
          description: published?.metadata?.summary || "",
          activityType: published?.metadata?.activityType || "Activity",
          href: createSitePath(context.root, `week-${week}/${slug}/`),
          headingLevel: 3 as const,
          actionLabel: "Open activity",
          status: "Available"
        };
      })
    }));
  }, [content, context.root, model, useCatalogue, week]);

  const panel = legacyProgress
    ? {
      title: `Week ${week} progress`,
      badge: weekBadge,
      score: { correct: legacyProgress.completed, total: legacyProgress.total },
      progress: legacyProgress.total > 0 ? legacyProgress.completed / legacyProgress.total : 0,
      completed: legacyProgress.total > 0 && legacyProgress.completed >= legacyProgress.total,
      message: useCatalogue
        ? "Open each activity in order. Signed-in completion is confirmed by the learner service."
        : "Signed-in completion is confirmed by the learner service. Drafts stay in this browser until submitted."
    }
    : null;

  const weekStatus = model?.week.status || guardWeek.status || "";
  const previousWeek = adjacentWeekLink(context.root, week - 1, livePackage);
  const nextWeek = adjacentWeekLink(context.root, week + 1, livePackage);

  return (
    <WeekAccessGuard week={guardWeek}>
      <div data-lp-week-page="">
        {panel ? (
          <PracticeProgressPanel
            title={panel.title}
            badge={panel.badge}
            score={panel.score}
            progress={panel.progress}
            completed={panel.completed}
            message={panel.message}
            defaultCollapsed
          />
        ) : null}
        <WeekView
          week={{
            id: weekId,
            teachingWeek: week,
            title: route?.heading || `Week ${week}`,
            subtitle: (route?.subtitle || "").replace(/\s+/g, " ").trim(),
            status: weekStatus
          }}
          learningOutcomes={
            useCatalogue && model?.learningOutcomes.length
              ? model.learningOutcomes
              : outcomeFromSubtitle(route?.subtitle || "")
          }
          context={{
            type: "exam",
            contextType: "exam",
            heading: "Examination context",
            description: "Formative OCR Unit 3 Cyber Security learning. This is not a live examination.",
            items: [
              { label: "Qualification", value: "OCR Level 3 IT" },
              { label: "Unit", value: "Unit 3 Cyber Security" },
              { label: "Week", value: weekBadge }
            ]
          }}
          features={{
            showTitle: false,
            showAssignmentContext: false,
            showProjectContext: false,
            showExamContext: true,
            showProgress: false
          }}
          previousWeek={week > 1 && previousWeek ? previousWeek : null}
          nextWeek={week < 7 && nextWeek ? nextWeek : null}
          sessions={useCatalogue ? catalogueSessions : [
            {
              id: `${weekId}-content`,
              title: "Learning this week",
              kind: "session",
              defaultOpen: true,
              activities: [
                {
                  children: (
                    <PageHost
                      root={context.root}
                      scripts={route?.scripts || []}
                      adaptersReady={adaptersReady}
                    />
                  )
                }
              ]
            }
          ]}
        />
      </div>
    </WeekAccessGuard>
  );
}

export function weekPageOpenable(
  teachingWeek: number,
  livePackage: ReturnType<typeof liveContentPackage>
): boolean {
  return runtimeWeekForTeachingWeek(livePackage, teachingWeek)?.available === true;
}
