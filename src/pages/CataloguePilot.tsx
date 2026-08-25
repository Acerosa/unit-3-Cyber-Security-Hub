import { useEffect, useRef, type ReactNode } from "react";
import {
  InteractiveActivity,
  questionIdFor,
  type ActivityBlockDocument,
  type ActivityDocument,
  type ActivityResult
} from "@learning-platform/ui";
import {
  incorrectQuestionNumbers,
  PILOT_ACTIVITY_ID,
  scorableBlocks,
  toSubmitResponses
} from "../catalogue/week2-session1-retrieval";

function renderFallback(block: ActivityBlockDocument): ReactNode {
  const type = String(block.type || "").toLowerCase();
  const content = (block.content || {}) as { text?: string; prompt?: string; level?: number };
  const text = String(content.text || content.prompt || "");
  if (type === "heading" && text) {
    const Tag = content.level === 3 ? "h3" : "h2";
    return <Tag>{text}</Tag>;
  }
  if (!text) return null;
  return <p>{text}</p>;
}

function optionIdFrom(result: ActivityResult): string | null {
  const responses = result.responses;
  if (responses && typeof responses === "object" && !Array.isArray(responses) && "optionId" in responses) {
    const optionId = (responses as { optionId?: string | null }).optionId;
    return optionId == null ? null : String(optionId);
  }
  return null;
}

export function CataloguePilot({
  activity,
  adaptersReady
}: {
  activity: ActivityDocument;
  adaptersReady: boolean;
}): ReactNode {
  const startedAt = useRef(new Date().toISOString());
  const resultsRef = useRef<Record<string, ActivityResult>>({});
  const submitOpenedRef = useRef(false);
  const blocks = scorableBlocks(activity);

  useEffect(() => {
    if (!adaptersReady) return;
    window.Unit3Week2Progress?.markStarted?.(PILOT_ACTIVITY_ID);
  }, [adaptersReady]);

  function openSubmit(results: Record<string, ActivityResult>) {
    const submit = window.Unit3Week2Submit;
    if (!submit?.renderSubmitPanel || submitOpenedRef.current) return;
    const responses = toSubmitResponses(blocks, results);
    const score = responses.reduce((sum, item) => sum + item.score, 0);
    window.Unit3Week2Progress?.markCompleted?.(PILOT_ACTIVITY_ID, score, blocks.length);
    submitOpenedRef.current = true;
    submit.renderSubmitPanel({
      activityId: PILOT_ACTIVITY_ID,
      getScore: () => score,
      getTotal: () => blocks.length,
      getQuestionsForReview: () => incorrectQuestionNumbers(blocks, results),
      getCompletionTimeSeconds: () => Math.max(
        1,
        Math.round((Date.now() - Date.parse(startedAt.current)) / 1000) || 1
      ),
      getResponses: () => responses,
      getStartedAt: () => startedAt.current,
      getCompletedAt: () => new Date().toISOString(),
      canSubmit: () => true
    });
  }

  function handleResult(result: ActivityResult, block: ActivityBlockDocument) {
    if (!result.completed || optionIdFrom(result) == null) {
      delete resultsRef.current[questionIdFor(block)];
      submitOpenedRef.current = false;
      const host = document.getElementById("w2-submit-host");
      if (host) {
        host.hidden = true;
        host.textContent = "";
      }
      return;
    }
    resultsRef.current = {
      ...resultsRef.current,
      [questionIdFor(block)]: result
    };
    if (Object.keys(resultsRef.current).length >= blocks.length) {
      openSubmit(resultsRef.current);
    }
  }

  return (
    <div data-unit3-catalogue-pilot={activity.id}>
      <InteractiveActivity
        activity={activity}
        renderFallback={renderFallback}
        onResult={handleResult}
      />
      <section id="w2-submit-host" className="panel" aria-labelledby="submit-heading" hidden>
        <h2 id="submit-heading">Submit your result</h2>
        <p className="panel-note">Submit only after you finish the quiz. Your result is saved to the Week 2 API and confirmed on this page.</p>
      </section>
    </div>
  );
}
