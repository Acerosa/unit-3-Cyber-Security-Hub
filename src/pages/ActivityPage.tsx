import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Callout,
  InteractiveActivity,
  PracticeProgressPanel,
  questionIdFor,
  type ActivityBlockDocument,
  type ActivityDocument,
  type ActivityResult,
  type ActivityScore
} from "@learning-platform/ui";
import { loadPageScripts } from "../adapters/load-hub-adapters";
import { renderCatalogueFallback } from "../catalogue/fallback";
import {
  CATALOGUE_PROGRESS_SCRIPTS,
  activityScoreFromResults,
  blockScorableTotal,
  catalogueActivity,
  catalogueActivityIdFromLegacyId,
  catalogueActivityIdFromSlug,
  cataloguePlayerMode,
  catalogueReflectionActivity,
  catalogueSequence,
  isCatalogueWeek,
  isScorableReactBlock,
  neighboursInSequence,
  scorableBlocks,
  sumScores
} from "../catalogue/week-activities";
import { activeContentPackage } from "../curriculum/apply-runtime";
import { weekPageFromPackage } from "../curriculum/from-package";
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

function isTextReactBlock(block: ActivityBlockDocument): boolean {
  const type = String(block.type || "").toLowerCase();
  return type === "reflection" || type === "short-response";
}

function textBlocks(activity: ActivityDocument | null | undefined): ActivityBlockDocument[] {
  return (activity?.blocks || []).filter((block) => isTextReactBlock(block));
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
  adaptersReady
}: {
  context: PageContext;
  contentReady: boolean;
  adaptersReady: boolean;
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
  const activity = content && activityId ? catalogueActivity(content, activityId) : null;
  const playerMode = cataloguePlayerMode(week, activityId, activity);
  const catalogueActivityDocument = playerMode === "hybrid" && activity
    ? catalogueReflectionActivity(activity)
    : activity;
  const { previous, next } = neighboursInSequence(sequence, activityId);
  const scoresRef = useRef<Record<string, ActivityScore>>({});
  const activityResultsRef = useRef<Record<string, ActivityResult>>({});
  const [practiceScore, setPracticeScore] = useState<ActivityScore>({ correct: 0, total: 0 });

  useEffect(() => {
    scoresRef.current = {};
    activityResultsRef.current = {};
    setPracticeScore({ correct: 0, total: 0 });
  }, [activityId]);

  useEffect(() => {
    if (!adaptersReady || playerMode !== "catalogue") return;
    const scripts = CATALOGUE_PROGRESS_SCRIPTS[week] || [];
    if (scripts.length) void loadPageScripts(context.root, scripts);
  }, [adaptersReady, context.root, playerMode, week]);

  useEffect(() => {
    if (!adaptersReady || playerMode === "host" || !activityId) return;
    progressStore(week)?.markStarted?.(activityId);
  }, [activityId, adaptersReady, playerMode, week]);

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

    if (isScorableReactBlock(block) && result.score && result.score.total > 0) {
      const blockId = questionIdFor(block);
      scoresRef.current = { ...scoresRef.current, [blockId]: result.score };
      activityResultsRef.current = { ...activityResultsRef.current, [blockId]: result };
      setPracticeScore(sumScores(scoresRef.current));
      const blocks = scorableBlocks(document);
      const finished = blocks.every((item) => activityResultsRef.current[questionIdFor(item)]?.completed);
      if (!finished) return;
      const score = activityScoreFromResults(blocks, activityResultsRef.current);
      progressStore(week)?.markCompleted?.(document.id, score.correct, score.total);
      return;
    }

    // Text-only catalogue activities (e.g. Week 1 reflections): complete when all text blocks are saved.
    if (!isTextReactBlock(block)) return;
    if (scorableBlocks(document).length > 0) return;
    const blockId = questionIdFor(block);
    activityResultsRef.current = { ...activityResultsRef.current, [blockId]: result };
    const blocks = textBlocks(document);
    if (!blocks.length) return;
    const finished = blocks.every((item) => activityResultsRef.current[questionIdFor(item)]?.completed);
    if (finished) progressStore(week)?.markCompleted?.(document.id);
  }, [week]);

  const scorableTotal = useMemo(
    () => scorableBlocks(catalogueActivityDocument).reduce((total, block) => total + blockScorableTotal(block), 0),
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
      renderFallback={renderCatalogueFallback}
      onResult={(result, block) => recordPracticeResult(catalogueActivityDocument, result, block)}
    />
  ) : null;

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
      {playerMode === "catalogue" && scorableTotal > 0 ? (
        <PracticeProgressPanel
          title={activity?.metadata?.title || route?.heading || `Week ${week} activity`}
          badge={`Week ${week}`}
          score={{
            correct: practiceScore.correct,
            total: Math.max(scorableTotal, practiceScore.total, 1)
          }}
          progress={scorableTotal > 0 ? practiceScore.total / Math.max(scorableTotal, 1) : 0}
          completed={scorableTotal > 0 && practiceScore.total >= scorableTotal}
          message="Check scored items to update. This is practice feedback, not a qualification grade."
          defaultCollapsed
        />
      ) : null}
    </div>
  );
}
