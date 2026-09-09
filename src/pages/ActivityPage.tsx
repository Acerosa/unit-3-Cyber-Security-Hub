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
import {
  allCatalogueQuestionsChecked,
  createCatalogueDraftStore,
  emptyCatalogueDraft,
  learnerSafeCheckedResult,
  learnerSafeCheckedResults,
  persistCatalogueDraft,
  submitCatalogueDraft,
  type CatalogueDraft
} from "../catalogue/activity-draft";
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

function draftAlreadyTouched(draft: CatalogueDraft): boolean {
  return Boolean(
    Object.keys(draft.responses).length
    || Object.keys(draft.checked).length
    || Object.keys(draft.results || {}).length
  );
}

function restorePracticeFromDraft(document: ActivityDocument, draft: CatalogueDraft) {
  let progress = emptyPracticeProgress();
  for (const block of requiredBlocks(document)) {
    const qid = questionIdFor(block);
    if (!draft.checked[qid]) continue;
    const marked = draft.results?.[qid];
    if (!marked) continue;
    progress = applyPracticeResult(progress, qid, {
      completed: true,
      correct: marked.correct,
      score: marked.score,
      attempts: 1,
      responses: draft.responses[qid]
    });
  }
  return progress;
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
  const draftRef = useRef<CatalogueDraft>(emptyCatalogueDraft());
  const finishInFlight = useRef(false);
  const [practice, setPractice] = useState<PracticeProgressAggregate>(
    aggregatePracticeProgress(emptyPracticeProgress(), { requiredBlocks: 0, scorableTotal: 0 })
  );
  const [initialDraft, setInitialDraft] = useState<CatalogueDraft>(emptyCatalogueDraft());
  const [readyToFinish, setReadyToFinish] = useState(false);
  const [finishNotice, setFinishNotice] = useState("");

  useEffect(() => {
    progressRef.current = emptyPracticeProgress();
    draftRef.current = emptyCatalogueDraft();
    finishInFlight.current = false;
    setPractice(aggregatePracticeProgress(emptyPracticeProgress(), { requiredBlocks: 0, scorableTotal: 0 }));
    setInitialDraft(emptyCatalogueDraft());
    setReadyToFinish(false);
    setFinishNotice("");
  }, [activityId]);

  useEffect(() => {
    if (!adaptersReady || !activity || playerMode === "host") return;
    let cancelled = false;
    const store = createCatalogueDraftStore(activity, platform as never);
    const startedAt = new Date().toISOString();
    void (store?.hydrate ? store.hydrate() : Promise.resolve(null)).then((resolved) => {
      if (cancelled) return;
      const responses = resolved?.responses && typeof resolved.responses === "object" ? resolved.responses : {};
      const checked = resolved?.checked && typeof resolved.checked === "object" ? resolved.checked : {};
      if (draftAlreadyTouched(draftRef.current)) return;
      const next: CatalogueDraft = {
        responses,
        checked,
        results: learnerSafeCheckedResults(resolved?.results),
        startedAt: resolved?.startedAt || startedAt,
        completed: false,
        submission: resolved?.submission
      };
      draftRef.current = next;
      setInitialDraft(next);
      progressRef.current = restorePracticeFromDraft(activity, next);
      setPractice(aggregatePracticeProgress(progressRef.current, {
        requiredBlocks: requiredBlocks(activity).length,
        scorableTotal: scorableBlocks(activity).reduce((total, item) => total + blockScorableTotal(item), 0)
      }));
      setReadyToFinish(
        Boolean(activity && allCatalogueQuestionsChecked(activity, next) && next.submission?.status !== "submitted")
      );
    });
    return () => { cancelled = true; };
  }, [activity, adaptersReady, platform, playerMode]);

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
    const qid = questionIdFor(block);
    const next: CatalogueDraft = {
      ...draftRef.current,
      responses: { ...draftRef.current.responses },
      checked: { ...draftRef.current.checked },
      results: { ...(draftRef.current.results || {}) },
      startedAt: draftRef.current.startedAt || new Date().toISOString(),
      completed: false
    };
    if (result.completed === false) {
      next.checked[qid] = false;
      delete next.results[qid];
      draftRef.current = next;
      persistCatalogueDraft(createCatalogueDraftStore(document, platform as never), next, { remote: false });
      setInitialDraft(next);
      setReadyToFinish(false);
      return;
    }
    next.responses[qid] = persistableResponse(block, result);
    if (result.completed) {
      next.checked[qid] = true;
      const marked = learnerSafeCheckedResult({
        correct: result.correct,
        canRetry: result.canRetry,
        status: result.status,
        score: result.score
      });
      if (marked) next.results[qid] = marked;
    }
    draftRef.current = next;
    persistCatalogueDraft(
      createCatalogueDraftStore(document, platform as never),
      next,
      draftRef.current.submission?.status === "submitted"
        ? { remote: false }
        : result.completed ? { immediate: true } : { remote: false }
    );
    if (document) {
      setReadyToFinish(
        allCatalogueQuestionsChecked(document, next) && next.submission?.status !== "submitted"
      );
    }

    const host = typeof window !== "undefined"
      ? window.document.querySelector(`[data-lp-activity="${document.id}"]`)
      : null;
    host?.dispatchEvent(new CustomEvent("lp-block-result", {
      bubbles: true,
      detail: {
        questionId: qid,
        response: next.responses[qid],
        completed: result.completed
      }
    }));

    if (!result.completed) return;

    progressRef.current = applyPracticeResult(progressRef.current, qid, result);
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
  }, [platform, week]);

  const finishActivity = useCallback(async () => {
    if (!catalogueActivityDocument || finishInFlight.current) return;
    if (!allCatalogueQuestionsChecked(catalogueActivityDocument, draftRef.current)) return;
    if (draftRef.current.submission?.status === "submitted") return;
    finishInFlight.current = true;
    const store = createCatalogueDraftStore(catalogueActivityDocument, platform as never);
    persistCatalogueDraft(store, draftRef.current, { immediate: true });
    const result = await submitCatalogueDraft(catalogueActivityDocument, draftRef.current, platform as never);
    const next: CatalogueDraft = {
      ...draftRef.current,
      submission: { status: result.status }
    };
    draftRef.current = next;
    persistCatalogueDraft(store, next, { remote: false });
    setReadyToFinish(false);
    setFinishNotice(result.reason || (result.status === "submitted"
      ? "Saved to your learning record."
      : "Your work is still saved on this device."));
    if (result.status !== "submitted") finishInFlight.current = false;
  }, [catalogueActivityDocument, platform]);

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

  const readyToSubmit = Boolean(
    catalogueActivityDocument
    && readyToFinish
    && draftRef.current.submission?.status !== "submitted"
  );

  const cataloguePlayer = playerMode !== "host" && catalogueActivityDocument ? (
    <>
      <InteractiveActivity
        activity={catalogueActivityDocument}
        platform={platform}
        initialResponses={initialDraft.responses}
        initialChecked={initialDraft.checked}
        initialResults={initialDraft.results}
        renderFallback={renderCatalogueFallback}
        onResult={(result, block) => recordPracticeResult(catalogueActivityDocument, result, block)}
      />
      {readyToSubmit ? (
        <p className="lp-activity-ready" data-lp-finish-ready="">
          All questions checked. Finish the activity to save it to your learning record.
        </p>
      ) : null}
      {readyToSubmit ? (
        <button
          type="button"
          className="lp-button"
          data-lp-finish-activity={catalogueActivityDocument.id}
          onClick={() => { void finishActivity(); }}
        >
          Finish activity
        </button>
      ) : null}
      {finishNotice ? (
        <p className="lp-activity-status" data-lp-submit-state={draftRef.current.submission?.status || ""}>
          {finishNotice}
        </p>
      ) : null}
    </>
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
