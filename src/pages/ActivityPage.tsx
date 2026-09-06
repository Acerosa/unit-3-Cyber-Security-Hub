import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Callout,
  EmptyState,
  InteractiveActivity,
  PracticeProgressPanel,
  WeekAccessGuard,
  aggregatePracticeProgress,
  applyPracticeResult,
  emptyPracticeProgress,
  isCatalogueReactType,
  questionIdFor,
  type ActivityBlockDocument,
  type ActivityDocument,
  type ActivityResult,
  type PracticeProgressAggregate
} from "@learning-platform/ui";
import { isSessionAccessible, SESSION_NOT_RELEASED_COPY } from "@learning-platform/core/curriculum-runtime";
import { loadPageScripts } from "../adapters/load-hub-adapters";
import { renderCatalogueFallback } from "../catalogue/fallback";
import {
  CATALOGUE_PROGRESS_SCRIPTS,
  blockScorableTotal,
  catalogueActivity,
  catalogueActivityIdFromLegacyId,
  catalogueActivityIdFromSlug,
  cataloguePlayerMode,
  catalogueReflectionActivity,
  catalogueSequence,
  isCatalogueWeek,
  neighboursInSequence,
  scorableBlocks
} from "../catalogue/week-activities";
import { activeContentPackage, liveContentPackage } from "../curriculum/apply-runtime";
import { weekPageFromPackage } from "../curriculum/from-package";
import { runtimeWeekForTeachingWeek } from "../curriculum/runtime-weeks";
import { createSitePath } from "../paths";
import type { PageContext } from "../page-context";
import { findRoute } from "../page-copy";
import { ActivitySequenceNav } from "./ActivitySequenceNav";
import { PageHost } from "./PageHost";

function progressStore(week: number) {
  return window[`Unit3Week${week}Progress` as "Unit3Week2Progress"];
}

function activityHref(root: string, week: number, slug: string) {
  return createSitePath(root, `week-${week}/${slug}/`);
}

function requiredBlocks(activity: ActivityDocument | null | undefined): ActivityBlockDocument[] {
  return (activity?.blocks || []).filter((block) => isCatalogueReactType(block.type));
}

function persistableResponse(block: ActivityBlockDocument, result: ActivityResult): unknown {
  const type = String(block.type || "").toLowerCase();
  const responses = result.responses;
  if (type === "single-choice" || type === "option-cards") {
    if (responses && typeof responses === "object" && !Array.isArray(responses) && "optionId" in responses) {
      const optionId = (responses as { optionId?: string | null }).optionId;
      return optionId == null ? "" : optionId;
    }
    return responses == null ? "" : responses;
  }
  if (type === "short-response" || type === "reflection") {
    if (typeof responses === "string") return responses.trim();
    if (responses == null) return "";
    return String(responses).trim();
  }
  return responses && typeof responses === "object" ? responses : {};
}

export function ActivityPage({
  context,
  contentReady,
  adaptersReady,
  platform
}: {
  context: PageContext;
  contentReady: boolean;
  adaptersReady: boolean;
  platform?: unknown;
}) {
  const route = findRoute(context);
  const week = context.week
    || (context.section.startsWith("week-") ? Number(context.section.replace("week-", "")) : 0);
  const content = contentReady ? activeContentPackage() : null;
  const model = useMemo(
    () => (isCatalogueWeek(week) && content ? weekPageFromPackage(content, `week-${week}`) : null),
    [content, week]
  );
  const sequence = useMemo(() => catalogueSequence(model, week), [model, week]);
  const activityId = catalogueActivityIdFromSlug(week, context.activity)
    || catalogueActivityIdFromLegacyId(context.activityId);
  const livePackage = contentReady ? liveContentPackage() : null;
  const runtimeWeek = runtimeWeekForTeachingWeek(livePackage, week);
  const sessionForActivity = content && activityId
    ? (content.sessions || []).find((session) => (session.relationships?.activities || []).includes(activityId))
    : undefined;
  const sessionAccessible = isSessionAccessible(
    model?.week.status || runtimeWeek?.status,
    sessionForActivity?.metadata?.status
  );
  const activity = content && activityId && sessionAccessible ? catalogueActivity(content, activityId) : null;
  const playerMode = cataloguePlayerMode(week, activityId, activity);
  const catalogueActivityDocument = playerMode === "hybrid" && activity
    ? catalogueReflectionActivity(activity)
    : activity;
  const { previous, next } = neighboursInSequence(sequence, activityId);
  const progressRef = useRef(emptyPracticeProgress());
  const [practice, setPractice] = useState<PracticeProgressAggregate>(
    aggregatePracticeProgress(emptyPracticeProgress(), { requiredBlocks: 0, scorableTotal: 0 })
  );

  useEffect(() => {
    progressRef.current = emptyPracticeProgress();
    setPractice(aggregatePracticeProgress(emptyPracticeProgress(), { requiredBlocks: 0, scorableTotal: 0 }));
  }, [activityId]);

  useEffect(() => {
    if (!adaptersReady || playerMode !== "catalogue") return;
    const scripts = CATALOGUE_PROGRESS_SCRIPTS[week] || [];
    if (scripts.length) void loadPageScripts(context.root, scripts);
  }, [adaptersReady, context.root, playerMode, week]);

  useEffect(() => {
    if (!adaptersReady || playerMode === "host" || !activityId || !sessionAccessible) return;
    progressStore(week)?.markStarted?.(activityId);
  }, [activityId, adaptersReady, playerMode, sessionAccessible, week]);

  const recordPracticeResult = useCallback((
    document: ActivityDocument,
    result: ActivityResult,
    block: ActivityBlockDocument
  ) => {
    const host = typeof window !== "undefined"
      ? window.document.querySelector(`[data-lp-activity="${document.id}"]`)
      : null;
    host?.dispatchEvent(new CustomEvent("lp-block-result", {
      bubbles: true,
      detail: {
        questionId: questionIdFor(block),
        response: persistableResponse(block, result),
        completed: result.completed
      }
    }));

    if (!result.completed) return;

    progressRef.current = applyPracticeResult(progressRef.current, questionIdFor(block), result);
    const required = requiredBlocks(document);
    const scorable = scorableBlocks(document);
    const aggregate = aggregatePracticeProgress(progressRef.current, {
      requiredBlocks: required.length,
      scorableTotal: scorable.reduce((total, item) => total + blockScorableTotal(item), 0)
    });
    setPractice(aggregate);
    const scorableDone = scorable.length > 0
      && scorable.every((item) => progressRef.current.completed[questionIdFor(item)]);
    if (scorableDone) {
      progressStore(week)?.markCompleted?.(document.id, aggregate.score.correct, aggregate.score.total);
      return;
    }
    if (aggregate.complete) {
      progressStore(week)?.markCompleted?.(document.id);
    }
  }, [week]);

  const scorableTotal = useMemo(
    () => scorableBlocks(catalogueActivityDocument).reduce((total, block) => total + blockScorableTotal(block), 0),
    [catalogueActivityDocument]
  );
  const requiredTotal = useMemo(
    () => requiredBlocks(catalogueActivityDocument).length,
    [catalogueActivityDocument]
  );

  const nav = sequence.length ? (
    <ActivitySequenceNav
      weekHref={createSitePath(context.root, `week-${week}/`)}
      weekLabel={`Week ${week} activities`}
      previous={previous ? {
        href: activityHref(context.root, week, previous.slug),
        label: previous.title
      } : null}
      next={next ? {
        href: activityHref(context.root, week, next.slug),
        label: next.title
      } : null}
    />
  ) : null;

  const cataloguePlayer = playerMode !== "host" && catalogueActivityDocument ? (
    <InteractiveActivity
      activity={catalogueActivityDocument}
      platform={platform}
      renderFallback={renderCatalogueFallback}
      onResult={(result, block) => recordPracticeResult(catalogueActivityDocument, result, block)}
    />
  ) : null;

  if (contentReady && activityId && !sessionAccessible) {
    const guardWeek = runtimeWeek || {
      id: `week-${week}`,
      teachingWeek: week,
      status: model?.week.status || "",
      available: false,
      title: `Week ${week}`
    };
    if (!guardWeek.available) {
      return <WeekAccessGuard week={guardWeek}><div /></WeekAccessGuard>;
    }
    return (
      <EmptyState
        heading={SESSION_NOT_RELEASED_COPY}
        message="This session is not available yet."
        action={{ label: `Back to week ${week}`, href: createSitePath(context.root, `week-${week}/`) }}
      />
    );
  }

  return (
    <div data-lp-week-page="">
      <Callout
        tone="info"
        title="Formative activity"
        message="This activity is for practice. It is not a qualification grade, and you can retry it."
      />
      {playerMode !== "catalogue" ? (
        <PageHost
          root={context.root}
          scripts={route?.scripts || []}
          adaptersReady={adaptersReady}
        />
      ) : null}
      {cataloguePlayer}
      {nav}
      {playerMode === "catalogue" && requiredTotal > 0 ? (
        <PracticeProgressPanel
          title={activity?.metadata?.title || route?.heading || `Week ${week} activity`}
          badge={`Week ${week}`}
          score={scorableTotal > 0 ? {
            correct: practice.score.correct,
            total: Math.max(scorableTotal, practice.score.total, 1)
          } : undefined}
          progress={practice.completion}
          completed={practice.complete}
          message="Check items to update progress. Scores update only when the server returns a mark. This is practice feedback, not a qualification grade."
          defaultCollapsed
        />
      ) : null}
    </div>
  );
}
