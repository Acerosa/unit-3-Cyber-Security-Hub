import { useEffect, useState } from "react";
import { PRACTICE_QUESTIONS } from "../exam-practice/practice-questions";
import { examPracticeReleased } from "../exam-practice/release";
import { browserExamStore, type ExamStore, type WritingAnswer } from "../exam-practice/store";
import { createSitePath } from "../paths";

function blankAnswer(): WritingAnswer {
  return { original: "", revised: "", missing: "", guidanceViewed: false };
}

export function ExamAnswerWritingPage({
  root,
  released = examPracticeReleased(),
  store
}: {
  root: string;
  released?: boolean;
  store?: ExamStore;
}) {
  const [answers, setAnswers] = useState<Record<string, WritingAnswer>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [active] = useState(() => store || browserExamStore("learner"));

  useEffect(() => {
    const loaded = active.load();
    setAnswers(loaded.writing.answers);
    setSavedAt(loaded.writing.updatedAt);
  }, [active]);

  if (!released) {
    return <p>Exam practice is not available yet.</p>;
  }

  function update(id: string, patch: Partial<WritingAnswer>) {
    const next = {
      ...answers,
      [id]: { ...blankAnswer(), ...answers[id], ...patch }
    };
    setAnswers(next);
    const saved = active.saveWriting(next);
    setSavedAt(saved.writing.updatedAt);
  }

  return (
    <article className="panel exam-practice">
      <h2>OCR Answer-Writing Practice</h2>
      <p>20 minutes. Guided practice for LO1 and LO2. This is not the mock examination.</p>
      <p>For each question, write your own answer before you compare it. Comparing shows an indicative answer and why a developed point earns more marks.</p>
      <p aria-live="polite">{savedAt ? `Saved ${new Date(savedAt).toLocaleTimeString("en-GB")}` : "Not saved yet"}</p>
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
