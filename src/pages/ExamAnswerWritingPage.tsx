import { useEffect, useMemo, useRef, useState } from "react";
import { catalogueActivity } from "../catalogue/week-activities";
import { activeContentPackage } from "../curriculum/apply-runtime";
import { confirmCatalogueResponses, readCatalogueDraft } from "../exam-practice/catalogue-draft";
import { PRACTICE_QUESTIONS } from "../exam-practice/practice-questions";
import { examPracticeReleased } from "../exam-practice/release";
import { examRemoteReady, SAVED_ANSWERS_LOAD_FAILED, SAVED_ANSWERS_LOADING } from "../exam-practice/resume-gate";
import { type ExamStore, type WritingAnswer } from "../exam-practice/store";
import { createSitePath } from "../paths";

function blankAnswer(): WritingAnswer {
  return { original: "", revised: "", missing: "", guidanceViewed: false };
}

const ACTIVITY_ID = "u3-lo12-answer-writing";

type SaveState = "loading" | "idle" | "saving" | "saved" | "retrying" | "failed" | "load-failed";

function saveMessage(state: SaveState): string {
  if (state === "loading") return SAVED_ANSWERS_LOADING;
  if (state === "saving") return "Saving";
  if (state === "saved") return "Saved";
  if (state === "retrying") return "Retrying";
  if (state === "failed") return "Could not save. Your answers are still in the editor.";
  if (state === "load-failed") return SAVED_ANSWERS_LOAD_FAILED;
  return "Not saved yet";
}

export function ExamAnswerWritingPage({
  root,
  released = examPracticeReleased(),
  store,
  platform,
  platformState,
  contentReady,
  saveDelayMs = 400
}: {
  root: string;
  released?: boolean;
  store?: ExamStore;
  platform?: Parameters<typeof readCatalogueDraft>[1];
  platformState?: string;
  contentReady?: boolean;
  saveDelayMs?: number;
}) {
  const activity = useMemo(() => {
    if (contentReady === false) return null;
    const content = activeContentPackage();
    return content ? catalogueActivity(content, ACTIVITY_ID) : null;
  }, [contentReady]);
  const signedIn = platform?.auth?.isSignedIn?.();
  const remoteReady = examRemoteReady(platformState, signedIn);
  const [answers, setAnswers] = useState<Record<string, WritingAnswer>>({});
  const [saveState, setSaveState] = useState<SaveState>(store ? "idle" : "loading");
  const [notice, setNotice] = useState("");
  const answersRef = useRef(answers);
  const saveToken = useRef(0);
  const saveTimer = useRef<number | null>(null);
  const resumeReady = useRef(Boolean(store));
  answersRef.current = answers;
  const editable = saveState !== "loading" && saveState !== "load-failed";

  useEffect(() => {
    if (store) {
      const loaded = store.load();
      setAnswers(loaded.writing.answers);
      resumeReady.current = true;
      setSaveState(loaded.writing.updatedAt ? "saved" : "idle");
      return;
    }
    if (signedIn === false) {
      resumeReady.current = false;
      setAnswers({});
      setSaveState("loading");
      return;
    }
    if (contentReady === false || !activity || !remoteReady) {
      if (!resumeReady.current) setSaveState("loading");
      return;
    }
    let cancelled = false;
    resumeReady.current = false;
    setSaveState("loading");
    void readCatalogueDraft(activity, platform).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        resumeReady.current = false;
        setSaveState("load-failed");
        return;
      }
      const responses = result.draft?.responses || {};
      const next: Record<string, WritingAnswer> = {};
      for (const question of PRACTICE_QUESTIONS) {
        const saved = responses[`u3-lo12-answer-writing:${question.id}`];
        if (saved && typeof saved === "object") next[question.id] = { ...blankAnswer(), ...(saved as WritingAnswer) };
      }
      setAnswers(next);
      resumeReady.current = true;
      setSaveState(Object.keys(next).length ? "saved" : "idle");
    });
    return () => { cancelled = true; };
  }, [activity, contentReady, platform, remoteReady, store]);

  if (!released) {
    return <p>Exam practice is not available yet.</p>;
  }

  function update(id: string, patch: Partial<WritingAnswer>) {
    if (!resumeReady.current) return;
    const next = {
      ...answers,
      [id]: { ...blankAnswer(), ...answers[id], ...patch }
    };
    setAnswers(next);
    answersRef.current = next;
    if (store) {
      store.saveWriting(next);
      setSaveState("saved");
      return;
    }
    if (!activity || !platform) {
      setNotice("Sign in to save this practice with your learning record.");
      setSaveState("failed");
      return;
    }
    const token = saveToken.current + 1;
    saveToken.current = token;
    setSaveState("saving");
    setNotice("");
    if (saveTimer.current != null) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => { void persist(token, 0); }, saveDelayMs);
  }

  async function persist(token: number, tries: number) {
    if (!resumeReady.current || !activity || token !== saveToken.current) return;
    setSaveState(tries > 0 ? "retrying" : "saving");
    const current = answersRef.current;
    const responses: Record<string, unknown> = {};
    for (const [id, answer] of Object.entries(current)) {
      responses[`u3-lo12-answer-writing:${id}`] = answer;
    }
    const complete = PRACTICE_QUESTIONS.every((question) => {
      const answer = current[question.id];
      return Boolean(answer?.original.trim() && answer.guidanceViewed && answer.revised.trim());
    });
    const result = await confirmCatalogueResponses(activity, platform, responses, { completed: complete });
    if (token !== saveToken.current || result === "superseded") return;
    if (result === "saved") {
      setSaveState("saved");
      return;
    }
    if (tries < 2) {
      window.setTimeout(() => { void persist(token, tries + 1); }, 200);
      return;
    }
    setSaveState("failed");
  }

  return (
    <article className="panel exam-practice">
      <h2>OCR Answer-Writing Practice</h2>
      <p>20 minutes. Guided practice for LO1 and LO2. This is not the mock examination.</p>
      <p>For each question, write your own answer before you compare it. Comparing shows an indicative answer and why a developed point earns more marks.</p>
      <p aria-live="polite" role={saveState === "load-failed" ? "alert" : "status"}>{notice || saveMessage(saveState)}</p>
      {saveState === "failed" ? (
        <button type="button" className="lp-button" onClick={() => {
          const token = saveToken.current;
          void persist(token, 0);
        }}>
          Retry save
        </button>
      ) : null}
      {PRACTICE_QUESTIONS.map((question, index) => {
        const answer = answers[question.id] || blankAnswer();
        return (
          <section key={question.id} aria-labelledby={`${question.id}-title`}>
            <h3 id={`${question.id}-title`}>Question {index + 1} · {question.command} · {question.marks} marks</h3>
            <p>{question.scenario}</p>
            <p><strong>{question.prompt}</strong></p>
            <label htmlFor={`${question.id}-original`}>Your answer</label>
            <textarea
              id={`${question.id}-original`}
              value={answer.original}
              disabled={!editable}
              onChange={(event) => update(question.id, { original: event.target.value })}
            />
            <button
              type="button"
              className="lp-button"
              disabled={!editable}
              onClick={() => update(question.id, { guidanceViewed: true })}
            >
              Compare My Answer
            </button>
            {answer.guidanceViewed ? (
              <div>
                <h4>A weak answer</h4>
                <p>{question.weak}</p>
                <h4>A stronger answer</h4>
                <p>{question.stronger}</p>
                <h4>Why the stronger answer earns more</h4>
                <p>{question.why}</p>
                <h4>Indicative marking</h4>
                <p>{question.indicative}</p>
                <label htmlFor={`${question.id}-missing`}>What was your answer missing?</label>
                <textarea
                  id={`${question.id}-missing`}
                  value={answer.missing}
                  disabled={!editable}
                  onChange={(event) => update(question.id, { missing: event.target.value })}
                />
                <label htmlFor={`${question.id}-revised`}>Improved answer</label>
                <textarea
                  id={`${question.id}-revised`}
                  value={answer.revised}
                  disabled={!editable}
                  onChange={(event) => update(question.id, { revised: event.target.value })}
                />
              </div>
            ) : null}
          </section>
        );
      })}
      <p><a href={createSitePath(root, "exam-practice/")}>Back to Exam Practice</a></p>
    </article>
  );
}
