import { resolveActivityVersion } from "@learning-platform/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { evidence } from "@learning-platform/core";
import { createCatalogueDraftStore } from "../catalogue/activity-draft";
import { formatCountdown } from "../catalogue/knowledge-report";
import { catalogueActivity } from "../catalogue/week-activities";
import { activeContentPackage } from "../curriculum/apply-runtime";
import { examPracticeReleased } from "../exam-practice/release";
import { examRemoteReady, resumeReadAttempts, SAVED_ANSWERS_LOAD_FAILED, SAVED_ANSWERS_LOADING } from "../exam-practice/resume-gate";
import { readActivityRows, resolveMiniMockSitting } from "../exam-practice/sitting";
import {
  decideTimedPaperSave,
  firstSaveRow,
  type TimedPaperSaveRow
} from "../exam-practice/timed-paper-save";
import { createSitePath } from "../paths";

const ACTIVITY_ID = "u3-lo12-timed-mini-mock";

type Phase = {
  phase?: string;
  standardDurationSeconds?: number;
  serverNow?: string;
  assessmentType?: string;
  authoritativeStartedAt?: string | null;
};

type Conflict = {
  revision: number;
  responses: Record<string, string>;
};

type RpcClient = {
  schema: (name: string) => {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data?: unknown; error?: { message?: string } | null }>;
    from?: (table: string) => { select: (columns: string) => { eq: (column: string, value: string) => Promise<{ data?: Array<Record<string, unknown>> }> } };
  };
};

function phaseOf(row: TimedPaperSaveRow | null): Phase | null {
  const value = row?.state?.knowledgeReportPhase;
  return value && typeof value === "object" ? value as Phase : null;
}

function statusLabel(saveState: string) {
  if (saveState === "saving") return "Saving";
  if (saveState === "saved") return "Saved";
  if (saveState === "retrying") return "Retrying. These answers are not saved yet.";
  if (saveState === "failed") return "These answers are not saved.";
  if (saveState === "conflict") return "This assessment was updated in another tab.";
  return "";
}

export function ExamMiniMockPage({
  root,
  released = examPracticeReleased(),
  platform,
  platformState,
  contentReady
}: {
  root: string;
  released?: boolean;
  platformState?: string;
  contentReady?: boolean;
  platform?: {
    submission?: { submit?: (payload: unknown) => Promise<unknown> };
    progress?: { createStore?: (options: unknown) => { save?: (state: unknown, options?: unknown) => void } };
    auth?: { isSignedIn?: () => boolean };
    client?: RpcClient;
  };
}) {
  const activity = useMemo(() => {
    if (contentReady === false) return null;
    const content = activeContentPackage();
    return content ? catalogueActivity(content, ACTIVITY_ID) : null;
  }, [contentReady]);
  const signedIn = platform?.auth?.isSignedIn?.();
  const remoteReady = examRemoteReady(platformState, signedIn);
  const questions = (activity?.blocks || []).filter((block) => block.type === "short-response");
  const questionIds = questions.map((block) => String(block.content?.questionId || block.id));
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(20 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [expired, setExpired] = useState(false);
  const [notice, setNotice] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "retrying" | "failed" | "conflict">("idle");
  const [conflict, setConflict] = useState<Conflict | null>(null);
  const confirmedRef = useRef<Record<string, string>>({});
  const serverAnswersRef = useRef<Record<string, string>>({});
  const revisionRef = useRef(0);
  const holdRef = useRef(false);
  const saveToken = useRef(0);
  const responsesRef = useRef(responses);
  responsesRef.current = responses;
  const [now, setNow] = useState(() => Date.now());
  const [results, setResults] = useState<Array<{ questionKey: string; awarded: number | null; max: number; feedback: string; text: string }>>([]);
  const submitting = useRef(false);
  const clockOffset = useRef(0);
  const [resume, setResume] = useState<"loading" | "ready" | "failed">(platform?.client ? "loading" : "ready");
  const resumeRef = useRef(resume);
  resumeRef.current = resume;

  function applyTiming(row: TimedPaperSaveRow | null) {
    const timing = phaseOf(row);
    const started = typeof timing?.authoritativeStartedAt === "string"
      ? timing.authoritativeStartedAt
      : (typeof row?.started_at === "string" ? row.started_at : (typeof row?.startedAt === "string" ? row.startedAt : null));
    if (started) setStartedAt(started);
    if (timing?.serverNow) clockOffset.current = Date.parse(timing.serverNow) - Date.now();
    if (timing?.standardDurationSeconds) setDurationSeconds(timing.standardDurationSeconds);
    const locked = timing?.phase === "submitted" || timing?.phase === "standard_expired";
    if (timing?.phase === "submitted") setSubmitted(true);
    if (locked) setExpired(true);
  }

  function rememberServer(row: TimedPaperSaveRow | null, replaceEditor: boolean) {
    const saved = row?.state?.responses
      ? Object.fromEntries(Object.entries(row.state.responses).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
      : {};
    serverAnswersRef.current = saved;
    confirmedRef.current = saved;
    if (typeof row?.revision === "number") revisionRef.current = row.revision;
    applyTiming(row);
    if (replaceEditor) {
      responsesRef.current = saved;
      setResponses(saved);
    }
  }

  useEffect(() => {
    if (!activity || !platform?.client) return;
    if (signedIn === false) {
      setResume("loading");
      setResponses({});
      responsesRef.current = {};
      return;
    }
    if (contentReady === false || !remoteReady) {
      if (resumeRef.current !== "ready") setResume("loading");
      return;
    }
    let cancelled = false;
    setResume("loading");
    const tries = resumeReadAttempts(platformState);
    void (async () => {
      for (let attempt = 0; attempt < tries && !cancelled; attempt += 1) {
        try {
          const { data, error } = await platform.client!.schema("api").rpc("get_activity_state", {
            p_activity_key: activity.id,
            p_activity_version: resolveActivityVersion(activity)
          });
          if (cancelled) return;
          if (error) throw new Error(error.message || "The saved sitting could not be loaded.");
          const row = firstSaveRow(data);
          const attempts = await readActivityRows(platform.client, "my_attempts", activity.id);
          const stored = await readActivityRows(platform.client, "my_responses", activity.id);
          if (cancelled) return;
          const sitting = resolveMiniMockSitting({
            draft: row,
            attempts: attempts.consulted ? attempts.rows : null,
            responses: stored.consulted ? stored.rows : null
          });
          if (sitting.kind === "in-progress" && row) {
            revisionRef.current = sitting.revision;
            rememberServer(row, true);
          } else if (sitting.kind === "submitted" || sitting.kind === "released") {
            holdRef.current = true;
            responsesRef.current = sitting.responses;
            setResponses(sitting.responses);
            setSubmitted(true);
            setExpired(true);
            if (sitting.kind === "released") setResults(sitting.results);
          }
          setResume("ready");
          return;
        } catch {
          if (cancelled || attempt === tries - 1) {
            if (!cancelled) setResume("failed");
            return;
          }
          await new Promise((resolve) => window.setTimeout(resolve, 500));
        }
      }
    })();
    return () => { cancelled = true; };
  }, [activity, contentReady, platform, platformState, remoteReady]);

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
    const client = platform?.client;
    if (!client?.schema("api").from) return;
    const { data } = await client.schema("api").from!("my_responses").select("question_key, awarded_score, max_score, feedback_summary, response_payload").eq("activity_key", ACTIVITY_ID);
    setResults((data || []).map((row) => {
      const score = row.awarded_score;
      return {
      questionKey: String(row.question_key || ""),
      awarded: typeof score === "number" ? score : null,
      max: Number(row.max_score || 0),
      feedback: typeof row.feedback_summary === "string" ? row.feedback_summary : "",
      text: String((row.response_payload as { text?: string } | null)?.text || "")
      };
    }));
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
          const text = timeUp
            ? (serverAnswersRef.current[id] || confirmedRef.current[id] || "")
            : (responsesRef.current[id] || "");
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
      holdRef.current = true;
      await loadResults();
    } finally {
      submitting.current = false;
    }
  }
  submitRef.current = () => { void submitPaper(); };

  async function save(next: Record<string, string>, token: number, tries: number, force = false) {
    if (resumeRef.current !== "ready" || !activity || !platform?.client || token !== saveToken.current || submitted) return;
    if (holdRef.current && !force) return;
    if (timeUp && force) return;
    setSaveState(tries > 0 ? "retrying" : "saving");
    let data: unknown = null;
    let error = false;
    try {
      const result = await platform.client.schema("api").rpc("save_activity_state", {
        p_activity_key: activity.id,
        p_activity_version: resolveActivityVersion(activity),
        p_state: { responses: next, checked: {}, results: {} },
        p_expected_revision: revisionRef.current
      });
      data = result.data;
      error = Boolean(result.error);
    } catch {
      error = true;
    }
    if (token !== saveToken.current) return;
    const decision = decideTimedPaperSave({
      sent: next,
      questionIds,
      row: firstSaveRow(data),
      error,
      tries
    });
    if (decision.action === "retry") {
      window.setTimeout(() => { void save(responsesRef.current, token, tries + 1, force); }, 200);
      return;
    }
    const row = firstSaveRow(data);
    if (decision.action === "saved" || decision.action === "adopt") {
      revisionRef.current = decision.revision;
      rememberServer(row, false);
      confirmedRef.current = next;
      serverAnswersRef.current = { ...serverAnswersRef.current, ...next };
      holdRef.current = false;
      setConflict(null);
      setSaveState("saved");
      setNotice("The sitting uses the server start time. Refreshing restores these answers and does not open a second attempt.");
      return;
    }
    if (decision.action === "conflict") {
      revisionRef.current = decision.revision;
      serverAnswersRef.current = decision.responses;
      applyTiming(row);
      holdRef.current = true;
      setConflict({ revision: decision.revision, responses: decision.responses });
      setSaveState("conflict");
      return;
    }
    if (decision.action === "locked") {
      applyTiming(row);
      serverAnswersRef.current = decision.responses;
      holdRef.current = true;
      setSaveState("failed");
      setNotice("The time has ended. These answers were not saved.");
      return;
    }
    setSaveState("failed");
    setNotice("These answers are not saved. They are still in the boxes.");
  }

  function useSavedVersion() {
    if (!conflict || submitted) return;
    const saved = conflict.responses;
    responsesRef.current = saved;
    confirmedRef.current = saved;
    setResponses(saved);
    holdRef.current = false;
    setConflict(null);
    setSaveState("saved");
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
          disabled={resume !== "ready"}
          onClick={() => {
            void (async () => {
              if (resumeRef.current !== "ready") return;
              if (!platform?.client) {
                setNotice("Sign in to start the mini-mock. The server records the start time.");
                return;
              }
              const token = saveToken.current + 1;
              saveToken.current = token;
              await save(responsesRef.current, token, 0, true);
            })();
          }}
        >
          Start Mini-Mock
        </button>
      ) : null}
      {startedAt && !submitted ? (
        <p className="knowledge-report__timer" role="timer">Time remaining {formatCountdown(remaining)}</p>
      ) : null}
      {resume === "loading" ? <p role="status">{SAVED_ANSWERS_LOADING}</p> : <p role="status">{statusLabel(saveState)}</p>}
      {resume === "failed" ? <p role="alert">{SAVED_ANSWERS_LOAD_FAILED}</p> : null}
      {notice ? <p>{notice}</p> : null}
      {conflict ? (
        <section role="alert" aria-labelledby="mini-mock-conflict">
          <h3 id="mini-mock-conflict">Updated in another tab</h3>
          <p>This assessment was updated in another tab. Your typing is still in the boxes. The saved version is shown below and has not replaced it.</p>
          <ul>
            {questionIds.map((id) => (
              <li key={id}>{id}: {conflict.responses[id] || ""}</li>
            ))}
          </ul>
          {!submitted ? (
            <button type="button" className="lp-button" onClick={useSavedVersion}>Use the saved version</button>
          ) : null}
          {!timeUp && !submitted ? (
            <button
              type="button"
              className="lp-button"
              onClick={() => {
                holdRef.current = false;
                const token = saveToken.current + 1;
                saveToken.current = token;
                void save(responsesRef.current, token, 0, true);
              }}
            >
              Save the answers in the boxes
            </button>
          ) : null}
        </section>
      ) : null}
      {questions.map((block) => {
        const id = String(block.content?.questionId || block.id);
        return (
          <section key={id}>
            <label htmlFor={id}>{String(block.content?.prompt || "Your answer")}</label>
            <textarea
              id={id}
              value={responses[id] || ""}
              disabled={submitted || expired || timeUp || !startedAt || resume !== "ready"}
              onChange={(event) => {
                const next = { ...responsesRef.current, [id]: event.target.value };
                responsesRef.current = next;
                setResponses(next);
                if (holdRef.current || submitted || timeUp) return;
                const token = saveToken.current + 1;
                saveToken.current = token;
                setSaveState("saving");
                window.setTimeout(() => { void save(responsesRef.current, token, 0); }, 300);
              }}
            />
          </section>
        );
      })}
      {startedAt && !submitted && !conflict ? (
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
