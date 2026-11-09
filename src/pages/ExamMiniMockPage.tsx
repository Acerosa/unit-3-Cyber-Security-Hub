import { resolveActivityVersion } from "@learning-platform/core";
import { useEffect, useMemo, useState } from "react";
import { evidence } from "@learning-platform/core";
import {
  createCatalogueDraftStore,
  type CatalogueDraft
} from "../catalogue/activity-draft";
import { formatCountdown } from "../catalogue/knowledge-report";
import { catalogueActivity } from "../catalogue/week-activities";
import { activeContentPackage } from "../curriculum/apply-runtime";
import { examPracticeReleased } from "../exam-practice/release";
import { createSitePath } from "../paths";

const ACTIVITY_ID = "u3-lo12-timed-mini-mock";

type Phase = {
  phase?: string;
  standardDurationSeconds?: number;
  serverNow?: string;
  assessmentType?: string;
};

function phaseOf(draft: CatalogueDraft | null): Phase | null {
  const value = (draft as { knowledgeReportPhase?: Phase } | null)?.knowledgeReportPhase;
  return value && typeof value === "object" ? value : null;
}

export function ExamMiniMockPage({
  root,
  released = examPracticeReleased(),
  platform
}: {
  root: string;
  released?: boolean;
  platform?: {
    submission?: { submit?: (payload: unknown) => Promise<unknown> };
    progress?: { createStore?: (options: unknown) => { hydrate?: () => Promise<CatalogueDraft | null>; save?: (state: unknown) => void } };
    auth?: { isSignedIn?: () => boolean };
  };
}) {
  const activity = useMemo(() => {
    const content = activeContentPackage();
    return content ? catalogueActivity(content, ACTIVITY_ID) : null;
  }, []);
  const questions = (activity?.blocks || []).filter((block) => block.type === "short-response");
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [serverNow, setServerNow] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(20 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!activity || !platform) return;
    const store = createCatalogueDraftStore(activity, platform as never);
    let cancelled = false;
    void (async () => {
      const hydrated = await store?.hydrate?.();
      if (cancelled || !hydrated) return;
      const timing = phaseOf(hydrated);
      const saved: Record<string, string> = {};
      for (const [key, value] of Object.entries(hydrated.responses || {})) {
        if (typeof value === "string") saved[key] = value;
      }
      setResponses(saved);
      setStartedAt(hydrated.startedAt || null);
      setServerNow(timing?.serverNow || null);
      if (timing?.standardDurationSeconds) setDurationSeconds(timing.standardDurationSeconds);
      if (hydrated.submission?.status === "submitted" || timing?.phase === "submitted") setSubmitted(true);
    })();
    return () => { cancelled = true; };
  }, [activity, platform]);

  if (!released) return <p>Exam practice is not available yet.</p>;
  if (!activity) return <p>The mini-mock is not in this curriculum package.</p>;

  const offset = serverNow ? Date.parse(serverNow) - Date.now() : 0;
  const remaining = startedAt
    ? new Date(startedAt).getTime() + durationSeconds * 1000 - (Date.now() + offset)
    : durationSeconds * 1000;

  async function save(next: Record<string, string>) {
    const store = createCatalogueDraftStore(activity!, platform as never);
    store?.save?.({ responses: next, checked: {}, results: {} });
  }

  return (
    <article className="panel exam-practice">
      <h2>LO1 and LO2 Timed Mini-Mock</h2>
      <p>20 marks. The deadline is the server start time plus the allowed minutes. Refreshing does not start a new sitting.</p>
      {!startedAt && !submitted ? (
        <button
          type="button"
          className="lp-button"
          onClick={() => {
            const store = createCatalogueDraftStore(activity, platform as never);
            store?.save?.({ responses, checked: {}, results: {}, startedAt: undefined });
            setNotice("Your sitting starts when the learning record confirms the server time.");
          }}
        >
          Start Mini-Mock
        </button>
      ) : null}
      {startedAt && !submitted ? (
        <p className="knowledge-report__timer" role="timer">Time remaining {formatCountdown(remaining)}</p>
      ) : null}
      {notice ? <p role="status">{notice}</p> : null}
      {questions.map((block) => {
        const id = String(block.content?.questionId || block.id);
        return (
          <section key={id}>
            <label htmlFor={id}>{String(block.content?.prompt || "Your answer")}</label>
            <textarea
              id={id}
              value={responses[id] || ""}
              disabled={submitted || !startedAt}
              onChange={(event) => {
                const next = { ...responses, [id]: event.target.value };
                setResponses(next);
                void save(next);
              }}
            />
          </section>
        );
      })}
      {startedAt && !submitted ? (
        <button
          type="button"
          className="lp-button"
          onClick={() => {
            void platform?.submission?.submit?.({
              activityKey: activity.id,
              activityVersion: resolveActivityVersion(activity),
              responses: questions.map((block) => evidence.written(
                String(block.content?.questionId || block.id),
                responses[String(block.content?.questionId || block.id)] || ""
              ))
            }).then(() => setSubmitted(true));
          }}
        >
          Submit Mini-Mock
        </button>
      ) : null}
      {submitted ? (
        <>
          <h3>Submission confirmed</h3>
          <p>Your answers are locked. Marks stay hidden until your teacher finalises them.</p>
          <p><a href={createSitePath(root, "exam-practice/reflection/")}>Continue to Immediate Reflection</a></p>
        </>
      ) : null}
    </article>
  );
}
