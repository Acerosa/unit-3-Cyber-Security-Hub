import { EmptyState } from "@learning-platform/ui";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  createCatalogueDraftStore,
  submitWrittenReport,
  type CatalogueDraft
} from "../catalogue/activity-draft";
import { catalogueActivity } from "../catalogue/week-activities";
import {
  countWords,
  formatCountdown,
  isClipboardShortcut,
  knowledgeReportConfig,
  reportQuestionId
} from "../catalogue/knowledge-report";
import { activeContentPackage } from "../curriculum/apply-runtime";
import type { PageContext } from "../page-context";

type ReportPhase = "intro" | "writing" | "submitted";

function draftText(draft: CatalogueDraft | null | undefined, questionId: string): string {
  const value = draft?.responses?.[questionId];
  return typeof value === "string" ? value : "";
}

function blockClipboard(event: { preventDefault: () => void }) {
  event.preventDefault();
}

export function KnowledgeReportPage({
  context,
  contentReady,
  platform
}: {
  context: PageContext;
  contentReady: boolean;
  platform?: unknown;
}) {
  const activity = useMemo(() => {
    const content = contentReady ? activeContentPackage() : null;
    return content && context.activityId
      ? catalogueActivity(content, context.activityId)
      : null;
  }, [contentReady, context.activityId]);
  const config = knowledgeReportConfig(activity);
  const questionId = activity ? reportQuestionId(activity) : "";
  const learnerSignedIn = Boolean(
    (platform as { auth?: { isSignedIn?: () => boolean } } | null)?.auth?.isSignedIn?.()
  );
  const storeRef = useRef<ReturnType<typeof createCatalogueDraftStore>>(null);
  const finaliseRef = useRef(false);
  const [phase, setPhase] = useState<ReportPhase>("intro");
  const [text, setText] = useState("");
  const [serverStartedAt, setServerStartedAt] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [notice, setNotice] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [lockedRemaining, setLockedRemaining] = useState<number | null>(null);
  const [deferExpiry, setDeferExpiry] = useState(false);
  const textRef = useRef(text);
  const expiryRetryRef = useRef<number | null>(null);
  textRef.current = text;

  const durationMs = (config?.durationMinutes || 0) * 60 * 1000;
  const minWords = config?.minWords || 0;
  const words = countWords(text);
  const remainingMs = serverStartedAt
    ? new Date(serverStartedAt).getTime() + durationMs - now
    : durationMs;
  const expired = phase === "writing" && serverStartedAt != null && remainingMs <= 0 && !deferExpiry;
  const frozen = phase === "submitted" || expired || busy;

  useEffect(() => {
    finaliseRef.current = false;
    setPhase("intro");
    setText("");
    setServerStartedAt(null);
    setNotice("");
    setConfirming(false);
    setReady(false);
    if (!activity) {
      storeRef.current = null;
      setReady(true);
      return;
    }
    const store = createCatalogueDraftStore(activity, platform as never);
    storeRef.current = store;
    let cancelled = false;
    (async () => {
      const hydrated = store ? await store.hydrate?.() : null;
      if (cancelled) return;
      if (hydrated?.submission?.status === "submitted" || hydrated?.completed) {
        setText(draftText(hydrated, questionId));
        setPhase("submitted");
        setLockedRemaining(0);
        setNotice("Your report has been submitted.");
      } else if (hydrated?.startedAt) {
        setText(draftText(hydrated, questionId));
        setServerStartedAt(hydrated.startedAt);
        setPhase("writing");
      } else {
        setText(draftText(hydrated, questionId));
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
      if (expiryRetryRef.current != null) {
        window.clearTimeout(expiryRetryRef.current);
        expiryRetryRef.current = null;
      }
    };
  }, [activity, platform, questionId, learnerSignedIn]);

  useEffect(() => {
    if (phase !== "writing" || !serverStartedAt) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [phase, serverStartedAt]);

  useEffect(() => {
    if (phase !== "writing" || frozen) return;
    const store = storeRef.current;
    if (!store || !questionId) return;
    store.save?.({
      responses: { [questionId]: text },
      checked: {},
      results: {}
    });
  }, [text, phase, frozen, questionId]);

  async function acceptedText(): Promise<string> {
    const store = storeRef.current;
    const saved = await store?.flush?.();
    const fromServer = draftText(saved?.state, questionId);
    if (saved?.state && questionId in (saved.state.responses || {})) {
      setText(fromServer);
      return fromServer;
    }
    return text;
  }

  async function finalise(becauseExpired: boolean) {
    if (!activity || !config || finaliseRef.current) return;
    finaliseRef.current = true;
    setBusy(true);
    setConfirming(false);
    storeRef.current?.save?.({
      responses: { [questionId]: textRef.current },
      checked: {},
      results: {}
    });
    const latest = await acceptedText();
    const result = await submitWrittenReport(activity, questionId, latest, platform as never, minWords);
    setBusy(false);
    if (result.status === "submitted" || result.code === "TIMED_REPORT_ALREADY_SUBMITTED") {
      setLockedRemaining(becauseExpired ? 0 : Math.max(0, remainingMs));
      setPhase("submitted");
      setNotice(becauseExpired
        ? "Time is up. Your report has been saved and submitted."
        : "Your report has been submitted.");
      return;
    }
    finaliseRef.current = false;
    if (becauseExpired && result.code === "MINIMUM_WORDS_NOT_MET") {
      setDeferExpiry(true);
      if (expiryRetryRef.current != null) window.clearTimeout(expiryRetryRef.current);
      expiryRetryRef.current = window.setTimeout(() => {
        expiryRetryRef.current = null;
        setDeferExpiry(false);
      }, 15000);
      setNotice("Keep writing until the time is up or you reach the minimum word count.");
      return;
    }
    setNotice(result.reason || "Your report is still saved on this device. It has not been sent to your learning record yet.");
  }

  useEffect(() => {
    if (!expired || phase !== "writing" || !ready) return;
    void finalise(true);
    // finalise is stable enough for the expiry edge; the ref blocks repeats.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired, phase, ready]);

  async function startTask() {
    if (!activity || !questionId || busy) return;
    setBusy(true);
    setNotice("");
    const store = storeRef.current;
    store?.save?.({
      responses: { [questionId]: text },
      checked: {},
      results: {}
    });
    const saved = await store?.flush?.();
    const startedAt = saved?.startedAt || null;
    setBusy(false);
    if (!startedAt) {
      setNotice("The timer could not be started. Check that you are signed in, then try again.");
      return;
    }
    setServerStartedAt(startedAt);
    setNow(Date.now());
    setPhase("writing");
  }

  function onEditorKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (frozen) return;
    if (isClipboardShortcut(event)) event.preventDefault();
  }

  if (!contentReady || !ready) return null;
  if (!activity || !config) {
    return (
      <EmptyState
        heading="Knowledge Report"
        message="This knowledge report is not available."
      />
    );
  }

  const title = activity.metadata?.title || "Knowledge Report";
  const minimumMet = words >= minWords;

  return (
    <article className="knowledge-report" aria-labelledby="knowledge-report-title">
      <header className="knowledge-report__header">
        <h2 id="knowledge-report-title">{title}</h2>
        {phase === "intro" ? (
          <>
            {config.brief ? <p>{config.brief}</p> : null}
            <p>Time allowed: {config.durationMinutes} minutes</p>
            <p>Minimum expected word count: {config.minWords} words</p>
            <button className="lp-button" type="button" onClick={() => { void startTask(); }} disabled={busy}>
              Start Task
            </button>
          </>
        ) : (
          <div className="knowledge-report__status">
            <p className="knowledge-report__timer" role="timer">
              <span className="visually-hidden">Time remaining </span>
              {formatCountdown(phase === "submitted" ? (lockedRemaining ?? 0) : remainingMs)}
            </p>
            <p id="knowledge-report-word-count">
              {minimumMet
                ? `Word count: ${words} ✓ Minimum reached`
                : `Word count: ${words} / ${minWords} minimum`}
            </p>
          </div>
        )}
      </header>

      {phase !== "intro" ? (
        <div className="knowledge-report__layout">
          <div className="knowledge-report__editor">
            <label className="visually-hidden" htmlFor="knowledge-report-text">Your report</label>
            <textarea
              id="knowledge-report-text"
              className="knowledge-report__textarea"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={onEditorKeyDown}
              onCopy={blockClipboard}
              onCut={blockClipboard}
              onPaste={blockClipboard}
              onDrop={blockClipboard}
              readOnly={frozen}
              spellCheck
              aria-describedby="knowledge-report-word-count"
              data-academic-integrity="exclude"
            />
            {phase === "writing" && !minimumMet ? (
              <p id="knowledge-report-minimum">Minimum {minWords} words required before you can submit.</p>
            ) : null}
            {confirming ? (
              <div role="group" aria-labelledby="knowledge-report-confirm-heading">
                <p id="knowledge-report-confirm-heading">
                  Submit this report? You will not be able to change it after you submit.
                </p>
                <button className="lp-button" type="button" onClick={() => { void finalise(false); }} disabled={busy}>
                  Submit Report
                </button>
                <button className="lp-button lp-button--secondary" type="button" onClick={() => setConfirming(false)}>
                  Keep writing
                </button>
              </div>
            ) : (
              <button
                className="lp-button"
                type="button"
                disabled={phase !== "writing" || !minimumMet || busy || expired}
                aria-describedby={minimumMet ? undefined : "knowledge-report-minimum"}
                onClick={() => setConfirming(true)}
              >
                Submit Report
              </button>
            )}
            {notice ? (
              <p role="status">{notice}</p>
            ) : null}
          </div>
          <aside className="knowledge-report__guidance" aria-labelledby="knowledge-report-guidance-heading">
            <h3 id="knowledge-report-guidance-heading">Guidance</h3>
            {config.guidance.map((section) => (
              <section key={section.heading}>
                <h4>{section.heading}</h4>
                <ul>
                  {(section.prompts || []).map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
              </section>
            ))}
            {config.sentenceStarters.length ? (
              <section>
                <h4>Sentence starters</h4>
                <ul>
                  {config.sentenceStarters.map((starter) => (
                    <li key={starter}>{starter}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      ) : null}
      {phase === "intro" && notice ? <p role="status">{notice}</p> : null}
    </article>
  );
}
