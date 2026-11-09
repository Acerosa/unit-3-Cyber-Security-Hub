import { resolveActivityVersion } from "@learning-platform/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { evidence } from "@learning-platform/core";
import {
  createCatalogueDraftStore,
  type CatalogueDraft
} from "../catalogue/activity-draft";
import { confirmCatalogueResponses } from "../exam-practice/catalogue-draft";
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
  authoritativeStartedAt?: string | null;
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
  const [durationSeconds, setDurationSeconds] = useState(20 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [expired, setExpired] = useState(false);
  const [notice, setNotice] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "retrying" | "failed">("idle");
  const confirmedRef = useRef<Record<string, string>>({});
  const saveToken = useRef(0);
  const responsesRef = useRef(responses);
  responsesRef.current = responses;
  const [now, setNow] = useState(() => Date.now());
  const [results, setResults] = useState<Array<{ questionKey: string; awarded: number | null; max: number; feedback: string; text: string }>>([]);
  const submitting = useRef(false);
  const clockOffset = useRef(0);

  function applyDraft(hydrated: CatalogueDraft | null) {
    if (!hydrated) return;
    const timing = phaseOf(hydrated);
    const saved: Record<string, string> = {};
    for (const [key, value] of Object.entries(hydrated.responses || {})) {
      if (typeof value === "string") saved[key] = value;
    }
    setResponses(saved);
    confirmedRef.current = saved;
    responsesRef.current = saved;
    const started = typeof timing?.authoritativeStartedAt === "string" ? timing.authoritativeStartedAt : null;
    setStartedAt(started);
    if (timing?.serverNow) clockOffset.current = Date.parse(timing.serverNow) - Date.now();
    if (timing?.standardDurationSeconds) setDurationSeconds(timing.standardDurationSeconds);
    const locked = hydrated.submission?.status === "submitted" || timing?.phase === "submitted";
    setSubmitted(locked);
    setExpired(timing?.phase === "standard_expired" || locked);
  }

  useEffect(() => {
    if (!activity || !platform) return;
    const store = createCatalogueDraftStore(activity, platform as never);
    let cancelled = false;
    void (async () => {
      const hydrated = await store?.hydrate?.();
      if (cancelled) return;
      applyDraft(hydrated);
    })();
    return () => { cancelled = true; };
  }, [activity, platform]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = startedAt
    ? new Date(startedAt).getTime() + durationSeconds * 1000 - (now + clockOffset.current)
    : durationSeconds * 1000;
  const timeUp = Boolean(startedAt) && remaining <= 0;
  const submitRef = useRef<() => void>(() => {});
  useEffect(() => {
    if (timeUp && !submitted) submitRef.current();
  }, [submitted, timeUp]);
  useEffect(() => {
    if (submitted) void loadResults();
  }, [submitted]);

  if (!released) return <p>Exam practice is not available yet.</p>;
  if (!activity) return <p>The mini-mock is not in this curriculum package.</p>;

  async function loadResults() {
    const client = (platform as { client?: { schema: (name: string) => { from: (table: string) => { select: (columns: string) => { eq: (column: string, value: string) => Promise<{ data?: Array<Record<string, unknown>> }> } } } } } | undefined)?.client;
    if (!client) return;
    const { data } = await client.schema("api").from("my_responses").select("question_key, awarded_score, max_score, feedback_summary, response_payload").eq("activity_key", ACTIVITY_ID);
    setResults((data || []).map((row) => ({
      questionKey: String(row.question_key || ""),
      awarded: typeof row.awarded_score === "number" ? row.awarded_score : null,
      max: Number(row.max_score || 0),
      feedback: typeof row.feedback_summary === "string" ? row.feedback_summary : "",
      text: String((row.response_payload as { text?: string } | null)?.text || "")
    })));
  }

  async function submitPaper() {
    if (submitting.current || submitted || !platform?.submission?.submit || !activity) return;
    submitting.current = true;
    try {
      const result = await platform.submission.submit({
        activityKey: activity.id,
        activityVersion: resolveActivityVersion(activity),
        responses: questions.map((block) => {
          const id = String(block.content?.questionId || block.id);
          const text = timeUp ? (confirmedRef.current[id] || "") : (responsesRef.current[id] || "");
          return evidence.written(id, text);
        })
      });
      const row = result as { attempt_id?: string; attemptId?: string } | null;
      const attemptId = row?.attempt_id || row?.attemptId;
      const content = activeContentPackage();
      const reflection = content ? catalogueActivity(content, "u3-lo12-reflection") : null;
      if (reflection && attemptId) {
        const reflectionStore = createCatalogueDraftStore(reflection, platform as never);
        reflectionStore?.save?.({
          responses: {},
          checked: {},
          results: {},
          relatedActivityKey: activity.id,
          relatedAttemptId: attemptId
        }, { immediate: true });
      }
      setSubmitted(true);
      setExpired(true);
      await loadResults();
    } finally {
      submitting.current = false;
    }
  }
  submitRef.current = () => { void submitPaper(); };

  async function save(next: Record<string, string>, token: number, tries: number) {
    if (!activity || token !== saveToken.current || submitted) return;
    setSaveState(tries > 0 ? "retrying" : "saving");
    const result = await confirmCatalogueResponses(activity, platform as never, next);
    if (token !== saveToken.current) return;
    if (result === "saved") {
      confirmedRef.current = next;
      setSaveState("saved");
      return;
    }
    if (result === "rejected") {
      setSaveState("failed");
      setNotice("These answers were not saved. The server kept the earlier version.");
      return;
    }
    if (tries < 2) {
      window.setTimeout(() => { void save(responsesRef.current, token, tries + 1); }, 200);
      return;
    }
    setSaveState("failed");
    setNotice("These answers are not saved. They are still in the boxes.");
  }

  return (
    <article className="panel exam-practice">
      <h2>LO1 and LO2 Timed Mini-Mock</h2>
      <section aria-labelledby="mini-mock-instructions">
        <h3 id="mini-mock-instructions">Examination instructions</h3>
        <ul>
          <li>There are five questions. The paper is out of 20 marks.</li>
          <li>The time starts when the server records your start. Refreshing does not add time.</li>
          <li>Answer all five questions. They are submitted together.</li>
          <li>When the time ends, the saved answers are submitted. You cannot change them.</li>
          <li>Marks and comments stay hidden until your teacher releases them.</li>
        </ul>
      </section>
      {!startedAt && !submitted ? (
        <button
          type="button"
          className="lp-button"
          onClick={() => {
            void (async () => {
              const store = createCatalogueDraftStore(activity, platform as never);
              if (!store) {
                setNotice("Sign in to start the mini-mock. The server records the start time.");
                return;
              }
              store.save?.({ responses, checked: {}, results: {} }, { immediate: true });
              await store.flush?.();
              let hydrated = await store.hydrate?.() || null;
              for (let attempt = 0; attempt < 8 && !phaseOf(hydrated)?.authoritativeStartedAt; attempt += 1) {
                await new Promise((resolve) => window.setTimeout(resolve, 250));
                hydrated = await store.hydrate?.() || null;
              }
              applyDraft(hydrated);
              setNotice("The sitting uses the server start time. Refreshing restores these answers and does not open a second attempt.");
            })();
          }}
        >
          Start Mini-Mock
        </button>
      ) : null}
      {startedAt && !submitted ? (
        <p className="knowledge-report__timer" role="timer">Time remaining {formatCountdown(remaining)}</p>
      ) : null}
      <p role="status">{notice || (saveState === "saving" ? "Saving" : saveState === "saved" ? "Saved" : saveState === "retrying" ? "Retrying. These answers are not saved yet." : saveState === "failed" ? "These answers are not saved." : "")}</p>
      {questions.map((block) => {
        const id = String(block.content?.questionId || block.id);
        return (
          <section key={id}>
            <label htmlFor={id}>{String(block.content?.prompt || "Your answer")}</label>
            <textarea
              id={id}
              value={responses[id] || ""}
              disabled={submitted || expired || timeUp || !startedAt}
              onChange={(event) => {
                const next = { ...responsesRef.current, [id]: event.target.value };
                responsesRef.current = next;
                setResponses(next);
                const token = saveToken.current + 1;
                saveToken.current = token;
                setSaveState("saving");
                window.setTimeout(() => { void save(responsesRef.current, token, 0); }, 300);
              }}
            />
          </section>
        );
      })}
      {startedAt && !submitted ? (
        <button
          type="button"
          className="lp-button"
          onClick={() => { void submitPaper(); }}
        >
          Submit Mini-Mock
        </button>
      ) : null}
      {submitted ? (
        <>
          <h3>Submission confirmed</h3>
          {results.some((row) => row.awarded != null) ? (
            <>
              <p>Total {results.reduce((sum, row) => sum + (row.awarded || 0), 0)} / 20</p>
              {results.map((row) => (
                <section key={row.questionKey}>
                  <h4>{row.questionKey} · {row.awarded ?? "—"} / {row.max}</h4>
                  <p>{row.text}</p>
                  {row.feedback ? <p>{row.feedback}</p> : null}
                </section>
              ))}
            </>
          ) : (
            <p>Your answers are locked. Marks stay hidden until your teacher releases them.</p>
          )}
          <p><a href={createSitePath(root, "exam-practice/reflection/")}>Continue to Immediate Reflection</a></p>
        </>
      ) : null}
    </article>
  );
}
