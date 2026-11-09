import { useEffect, useState } from "react";
import { MOCK_QUESTIONS } from "../exam-practice/mock-questions";
import { remainingMs } from "../exam-practice/policy";
import { examPracticeReleased } from "../exam-practice/release";
import { browserExamStore, type ExamStore } from "../exam-practice/store";
import { formatCountdown } from "../catalogue/knowledge-report";
import { createSitePath } from "../paths";

export function ExamMiniMockPage({
  root,
  released = examPracticeReleased(),
  store
}: {
  root: string;
  released?: boolean;
  store?: ExamStore;
}) {
  const [active] = useState(() => store || browserExamStore("learner"));
  const [phase, setPhase] = useState<"intro" | "live" | "submitted">("intro");
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [deadlineAt, setDeadlineAt] = useState<string | null>(null);
  const [serverNow, setServerNow] = useState<string | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const loaded = active.load();
    setServerNow(loaded.serverNow);
    if (loaded.mock.status === "submitted") {
      setPhase("submitted");
      setResponses(loaded.mock.responses);
      setMethod(loaded.mock.submissionMethod);
      setDeadlineAt(loaded.mock.deadlineAt);
    } else if (loaded.mock.status === "started" && loaded.mock.deadlineAt) {
      setPhase("live");
      setResponses(loaded.mock.responses);
      setDeadlineAt(loaded.mock.deadlineAt);
    }
  }, [active]);

  useEffect(() => {
    if (phase !== "live" || !deadlineAt || !serverNow) return;
    const offset = Date.parse(serverNow) - Date.now();
    const timer = window.setInterval(() => {
      const clock = new Date(Date.now() + offset).toISOString();
      if (remainingMs(deadlineAt, clock) <= 0) {
        const saved = active.submitMock("automatic");
        setPhase("submitted");
        setMethod(saved.mock.submissionMethod);
        setNotice("Time is up. Your answers have been submitted.");
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active, deadlineAt, phase, serverNow]);

  if (!released) return <p>Exam practice is not available yet.</p>;

  const remaining = deadlineAt && serverNow ? remainingMs(deadlineAt, serverNow) : 20 * 60 * 1000;

  return (
    <article className="panel exam-practice">
      <h2>LO1 and LO2 Timed Mini-Mock</h2>
      {phase === "intro" ? (
        <>
          <p>20 minutes. 20 marks. About one minute per mark. No hints and no model answers.</p>
          <ul>
            <li>The timer starts on the server when you select Start Mini-Mock.</li>
            <li>You can move between questions. Answers are saved as you type.</li>
            <li>Refreshing the page does not restart the timer.</li>
            <li>When the time ends, the attempt is submitted and locked.</li>
          </ul>
          <button
            type="button"
            className="lp-button"
            onClick={() => {
              const started = active.startMock();
              setPhase(started.mock.status === "submitted" ? "submitted" : "live");
              setDeadlineAt(started.mock.deadlineAt);
              setServerNow(started.serverNow);
              setResponses(started.mock.responses);
              setMethod(started.mock.submissionMethod);
            }}
          >
            Start Mini-Mock
          </button>
        </>
      ) : null}
      {phase === "live" ? (
        <>
          <p className="knowledge-report__timer" role="timer" aria-live="polite">
            Time remaining {formatCountdown(remaining)}
          </p>
          {remaining < 2 * 60 * 1000 ? <p role="status">Less than two minutes remain.</p> : null}
          {MOCK_QUESTIONS.map((question, index) => (
            <section key={question.id}>
              <h3>Question {index + 1} · {question.command} · {question.marks} marks</h3>
              <p>{question.scenario}</p>
              <label htmlFor={question.id}>{question.prompt}</label>
              <textarea
                id={question.id}
                value={responses[question.id] || ""}
                onChange={(event) => {
                  const next = { ...responses, [question.id]: event.target.value };
                  setResponses(next);
                  const saved = active.saveMock(next);
                  if (saved.mock.status === "submitted") {
                    setPhase("submitted");
                    setMethod(saved.mock.submissionMethod);
                  }
                }}
              />
            </section>
          ))}
          <button
            type="button"
            className="lp-button"
            onClick={() => {
              const saved = active.submitMock("manual");
              setPhase("submitted");
              setMethod(saved.mock.submissionMethod);
              setNotice("Your mini-mock has been submitted.");
            }}
          >
            Submit Mini-Mock
          </button>
        </>
      ) : null}
      {phase === "submitted" ? (
        <>
          <h3>Submission confirmed</h3>
          <p>{notice || "Your answers are locked."}</p>
          <p>{method === "automatic" ? "Submitted automatically when the time ended." : "Submitted by you."}</p>
          <p>Marks are not shown until your teacher has finished marking.</p>
          <p><a href={createSitePath(root, "exam-practice/reflection/")}>Continue to Immediate Reflection</a></p>
        </>
      ) : null}
    </article>
  );
}
