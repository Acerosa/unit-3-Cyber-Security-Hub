import { useEffect, useMemo, useState } from "react";
import { catalogueActivity } from "../catalogue/week-activities";
import { activeContentPackage } from "../curriculum/apply-runtime";
import { readCatalogueDraft, saveCatalogueResponses } from "../exam-practice/catalogue-draft";
import { examPracticeReleased } from "../exam-practice/release";
import { examRemoteReady, SAVED_ANSWERS_LOAD_FAILED, SAVED_ANSWERS_LOADING } from "../exam-practice/resume-gate";
import { type ExamStore, type ReflectionDraft } from "../exam-practice/store";
import { createSitePath } from "../paths";

const TOPICS = [
  "Confidentiality, integrity and availability.",
  "Threats and vulnerabilities.",
  "Types of attackers.",
  "Motivations and targets.",
  "Impacts of cyber security incidents.",
  "Ethical, legal and operational considerations."
];

const COMMANDS = ["Identify", "Describe", "Explain", "Discuss"];
const TIME = [
  "Yes, I finished with time remaining.",
  "Yes, but I used almost all the time.",
  "No, I ran out of time."
];

const REFLECTION_ID = "u3-lo12-reflection";
const MOCK_ID = "u3-lo12-timed-mini-mock";

function reflectionResponses(draft: ReflectionDraft): Record<string, unknown> {
  return {
    "u3-lo12-reflection:topic": draft.topic,
    "u3-lo12-reflection:command": draft.command,
    "u3-lo12-reflection:time": draft.time,
    "u3-lo12-reflection:improve": draft.improve,
    "u3-lo12-reflection:revise": draft.revise
  };
}

export function ExamReflectionPage({
  root,
  released = examPracticeReleased(),
  store,
  platform,
  platformState,
  contentReady,
  mockSubmitted
}: {
  root: string;
  released?: boolean;
  store?: ExamStore;
  platform?: Parameters<typeof readCatalogueDraft>[1];
  platformState?: string;
  contentReady?: boolean;
  mockSubmitted?: boolean;
}) {
  const reflection = useMemo(() => {
    if (contentReady === false) return null;
    const content = activeContentPackage();
    return content ? catalogueActivity(content, REFLECTION_ID) : null;
  }, [contentReady]);
  const miniMock = useMemo(() => {
    if (contentReady === false) return null;
    const content = activeContentPackage();
    return content ? catalogueActivity(content, MOCK_ID) : null;
  }, [contentReady]);
  const signedIn = platform?.auth?.isSignedIn?.();
  const remoteReady = examRemoteReady(platformState, signedIn);
  const [draft, setDraft] = useState<ReflectionDraft>({
    topic: "",
    command: "",
    time: "",
    improve: "",
    revise: "",
    submittedAt: null
  });
  const [available, setAvailable] = useState(Boolean(store) || mockSubmitted === true);
  const [relatedAttempt, setRelatedAttempt] = useState<string | null>(null);
  const [resume, setResume] = useState<"loading" | "ready" | "failed">(store || mockSubmitted === false ? "ready" : "loading");

  useEffect(() => {
    if (store) {
      setDraft(store.load().reflection);
      setAvailable(true);
      setResume("ready");
      return;
    }
    if (mockSubmitted === false) {
      setAvailable(false);
      setResume("ready");
      return;
    }
    if (signedIn === false) {
      setResume("loading");
      setDraft({ topic: "", command: "", time: "", improve: "", revise: "", submittedAt: null });
      return;
    }
    if (contentReady === false || !remoteReady) {
      if (resume !== "ready") setResume("loading");
      return;
    }
    let cancelled = false;
    setResume("loading");
    void (async () => {
      if (miniMock && platform && mockSubmitted == null) {
        const mockResult = await readCatalogueDraft(miniMock, platform);
        if (cancelled) return;
        if (!mockResult.ok) {
          setResume("failed");
          return;
        }
        const mockDraft = mockResult.draft as { knowledgeReportPhase?: { phase?: string }; submission?: { status?: string }; attemptId?: string } | null;
        const submitted = mockDraft?.knowledgeReportPhase?.phase === "submitted" || mockDraft?.submission?.status === "submitted";
        setAvailable(submitted);
        if (typeof mockDraft?.attemptId === "string") setRelatedAttempt(mockDraft.attemptId);
      }
      if (!reflection || !platform) {
        if (!cancelled) setResume("ready");
        return;
      }
      const savedResult = await readCatalogueDraft(reflection, platform);
      if (cancelled) return;
      if (!savedResult.ok) {
        setResume("failed");
        return;
      }
      const saved = savedResult.draft?.responses || {};
      setDraft({
        topic: String(saved["u3-lo12-reflection:topic"] || ""),
        command: String(saved["u3-lo12-reflection:command"] || ""),
        time: String(saved["u3-lo12-reflection:time"] || ""),
        improve: String(saved["u3-lo12-reflection:improve"] || ""),
        revise: String(saved["u3-lo12-reflection:revise"] || ""),
        submittedAt: typeof saved.submittedAt === "string" ? saved.submittedAt : null
      });
      setResume("ready");
    })();
    return () => { cancelled = true; };
  }, [contentReady, miniMock, mockSubmitted, platform, reflection, remoteReady, store]);

  if (!released) return <p>Exam practice is not available yet.</p>;
  if (resume === "loading") {
    return <article className="panel"><h2>Immediate Reflection</h2><p role="status">{SAVED_ANSWERS_LOADING}</p></article>;
  }
  if (resume === "failed") {
    return <article className="panel"><h2>Immediate Reflection</h2><p role="alert">{SAVED_ANSWERS_LOAD_FAILED}</p></article>;
  }
  if (!available) {
    return (
      <article className="panel">
        <h2>Immediate Reflection</h2>
        <p>This opens after you submit the mini-mock. It does not show your mark.</p>
        <p><a href={createSitePath(root, "exam-practice/mini-mock/")}>Back to the mini-mock</a></p>
      </article>
    );
  }

  if (draft.submittedAt) {
    return (
      <article className="panel">
        <h2>Reflection saved</h2>
        <p>Your reflection is stored with your mini-mock. It does not show your mark.</p>
        <p><a href={createSitePath(root, "exam-practice/")}>Back to Exam Practice</a></p>
      </article>
    );
  }

  return (
    <form
      className="panel exam-practice"
      onSubmit={(event) => {
        event.preventDefault();
        if (resume !== "ready") return;
        if (store) {
          const saved = store.saveReflection(draft);
          setDraft(saved.reflection);
          return;
        }
        const submittedAt = new Date().toISOString();
        if (reflection && platform) {
          saveCatalogueResponses(reflection, platform, {
            ...reflectionResponses(draft),
            submittedAt
          }, {
            completed: true,
            relatedActivityKey: MOCK_ID,
            ...(relatedAttempt ? { relatedAttemptId: relatedAttempt } : {})
          });
        }
        setDraft({ ...draft, submittedAt });
      }}
    >
      <h2>Immediate Reflection</h2>
      <p>5–10 minutes. This is your own review. It is not marked, and it does not reveal your mini-mock score.</p>
      <fieldset>
        <legend>Which topic did you find most difficult?</legend>
        {TOPICS.map((topic) => (
          <label key={topic}>
            <input
              type="radio"
              name="topic"
              value={topic}
              checked={draft.topic === topic}
              onChange={() => setDraft({ ...draft, topic })}
              required
            />
            {topic}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Which examination command word did you find most difficult?</legend>
        {COMMANDS.map((command) => (
          <label key={command}>
            <input
              type="radio"
              name="command"
              value={command}
              checked={draft.command === command}
              onChange={() => setDraft({ ...draft, command })}
              required
            />
            {command}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Did you manage your time?</legend>
        {TIME.map((time) => (
          <label key={time}>
            <input
              type="radio"
              name="time"
              value={time}
              checked={draft.time === time}
              onChange={() => setDraft({ ...draft, time })}
              required
            />
            {time}
          </label>
        ))}
      </fieldset>
      <label htmlFor="improve">What do you think you need to improve?</label>
      <textarea id="improve" value={draft.improve} onChange={(event) => setDraft({ ...draft, improve: event.target.value })} required />
      <label htmlFor="revise">Identify two topics you will revise before the mock examination.</label>
      <textarea id="revise" value={draft.revise} onChange={(event) => setDraft({ ...draft, revise: event.target.value })} required />
      <button type="submit" className="lp-button">Save reflection</button>
    </form>
  );
}
