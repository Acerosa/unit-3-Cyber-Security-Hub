import { useEffect, useMemo, useRef, useState } from "react";
import { catalogueActivity } from "../catalogue/week-activities";
import { activeContentPackage } from "../curriculum/apply-runtime";
import { confirmCatalogueResponses, loadCatalogueResponses } from "../exam-practice/catalogue-draft";
import { PRACTICE_QUESTIONS } from "../exam-practice/practice-questions";
import { examPracticeReleased } from "../exam-practice/release";
import { type ExamStore, type WritingAnswer } from "../exam-practice/store";
import { createSitePath } from "../paths";

function blankAnswer(): WritingAnswer {
  return { original: "", revised: "", missing: "", guidanceViewed: false };
}

const ACTIVITY_ID = "u3-lo12-answer-writing";

type SaveState = "idle" | "saving" | "saved" | "retrying" | "failed";

function saveMessage(state: SaveState): string {
  if (state === "saving") return "Saving";
  if (state === "saved") return "Saved";
  if (state === "retrying") return "Retrying";
  if (state === "failed") return "Could not save. Your answers are still in the editor.";
  return "Not saved yet";
}

export function ExamAnswerWritingPage({
  root,
  released = examPracticeReleased(),
  store,
  platform,
  saveDelayMs = 400
}: {
  root: string;
  released?: boolean;
  store?: ExamStore;
  platform?: Parameters<typeof loadCatalogueResponses>[1];
  saveDelayMs?: number;
}) {
  const activity = useMemo(() => {
    const content = activeContentPackage();
    return content ? catalogueActivity(content, ACTIVITY_ID) : null;
  }, []);
  const [answers, setAnswers] = useState<Record<string, WritingAnswer>>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [notice, setNotice] = useState("");
  const answersRef = useRef(answers);
  const saveToken = useRef(0);
  const saveTimer = useRef<number | null>(null);
  answersRef.current = answers;

  useEffect(() => {
    if (store) {
      const loaded = store.load();
      setAnswers(loaded.writing.answers);
      setSaveState(loaded.writing.updatedAt ? "saved" : "idle");
      return;
    }
    if (!activity) return;
    let cancelled = false;
    void loadCatalogueResponses(activity, platform).then((responses) => {
      if (cancelled) return;
      const next: Record<string, WritingAnswer> = {};
      for (const question of PRACTICE_QUESTIONS) {
        const saved = responses[`u3-lo12-answer-writing:${question.id}`];
        if (saved && typeof saved === "object") next[question.id] = { ...blankAnswer(), ...(saved as WritingAnswer) };
      }
      setAnswers((current) => ({ ...next, ...current }));
      if (Object.keys(next).length) setSaveState("saved");
    });
    return () => { cancelled = true; };
  }, [activity, platform, store]);

  if (!released) {
    return <p>Exam practice is not available yet.</p>;
  }

  function update(id: string, patch: Partial<WritingAnswer>) {
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
    if (!activity || token !== saveToken.current) return;
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
      <p aria-live="polite">{notice || saveMessage(saveState)}</p>
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
              onChange={(event) => update(question.id, { original: event.target.value })}
            />
            <button
              type="button"
              className="lp-button"
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
                  onChange={(event) => update(question.id, { missing: event.target.value })}
                />
                <label htmlFor={`${question.id}-revised`}>Improved answer</label>
                <textarea
                  id={`${question.id}-revised`}
                  value={answer.revised}
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
