import { useEffect, useState } from "react";
import { examPracticeReleased } from "../exam-practice/release";
import { browserExamStore, type ExamStore, type ReflectionDraft } from "../exam-practice/store";
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

export function ExamReflectionPage({
  root,
  released = examPracticeReleased(),
  store
}: {
  root: string;
  released?: boolean;
  store?: ExamStore;
}) {
  const [active] = useState(() => store || browserExamStore("learner"));
  const [draft, setDraft] = useState<ReflectionDraft>({
    topic: "",
    command: "",
    time: "",
    improve: "",
    revise: "",
    submittedAt: null
  });

  useEffect(() => {
    setDraft(active.load().reflection);
  }, [active]);

  if (!released) return <p>Exam practice is not available yet.</p>;

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
        const saved = active.saveReflection(draft);
        setDraft(saved.reflection);
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
