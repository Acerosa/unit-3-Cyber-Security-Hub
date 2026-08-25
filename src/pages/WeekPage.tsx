import { useEffect, useState } from "react";
import { PracticeProgressPanel, WeekView } from "@learning-platform/ui";
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

export function WeekPage({
  context,
  adaptersReady
}: {
  context: PageContext;
  adaptersReady: boolean;
}) {
  const route = findRoute(context);
  const week = context.week || 1;
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);

  useEffect(() => {
    if (!adaptersReady) return;
    const read = () => {
      const store = window[`Unit3Week${week}Progress` as "Unit3Week2Progress"];
      const summary = store?.getCompletionSummary?.();
      if (summary) setProgress({ completed: summary.completed, total: summary.total });
    };
    read();
    window.addEventListener("unit3:backend-progress", read);
    return () => window.removeEventListener("unit3:backend-progress", read);
  }, [adaptersReady, week]);

  const weekBadge = `Week ${week}: ${WEEK_TITLES[week] || ""}`.trim();

  return (
    <>
      {progress ? (
        <PracticeProgressPanel
          title={`Week ${week} progress`}
          badge={weekBadge}
          score={{ correct: progress.completed, total: progress.total }}
          progress={progress.total > 0 ? progress.completed / progress.total : 0}
          completed={progress.total > 0 && progress.completed >= progress.total}
          message="Signed-in completion is confirmed by the learner service. Drafts stay in this browser until submitted."
          defaultCollapsed
        />
      ) : null}
      <WeekView
        week={{
          id: `week-${week}`,
          teachingWeek: week,
          title: route?.heading || `Week ${week}`,
          subtitle: (route?.subtitle || "").replace(/\s+/g, " ").trim(),
          status: "available"
        }}
        learningOutcomes={outcomeFromSubtitle(route?.subtitle || "")}
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
        previousWeek={week > 1 ? { label: `Week ${week - 1}`, href: createSitePath(context.root, `week-${week - 1}/`) } : null}
        nextWeek={week < 7 ? { label: `Week ${week + 1}`, href: createSitePath(context.root, `week-${week + 1}/`) } : null}
        sessions={[
          {
            id: `week-${week}-content`,
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
    </>
  );
}
