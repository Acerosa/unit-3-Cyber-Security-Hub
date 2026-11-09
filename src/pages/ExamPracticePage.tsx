import { examPracticeReleased } from "../exam-practice/release";
import { createSitePath } from "../paths";

const ACTIVITIES = [
  {
    href: "exam-practice/answer-writing/",
    title: "Answer-Writing Practice",
    duration: "20 minutes",
    type: "Guided practice",
    purpose: "Learn how Identify, Describe, Explain and Discuss earn marks, then compare your answer with guidance."
  },
  {
    href: "exam-practice/mini-mock/",
    title: "Timed Mini-Mock",
    duration: "20 minutes",
    type: "Independent assessment",
    purpose: "Answer 20 marks of LO1 and LO2 questions under timed conditions. There are no hints or model answers."
  },
  {
    href: "exam-practice/reflection/",
    title: "Immediate Reflection",
    duration: "5–10 minutes",
    type: "Self-assessment",
    purpose: "Record what was difficult and what you will revise. This is not marked and does not show your score."
  }
];

export function ExamPracticePage({
  root,
  released = examPracticeReleased()
}: {
  root: string;
  released?: boolean;
}) {
  if (!released) {
    return (
      <article className="panel">
        <h2>Exam Practice: LO1 and LO2</h2>
        <p>Exam practice is not available yet.</p>
      </article>
    );
  }
  return (
    <section className="panel" aria-labelledby="exam-practice-heading">
      <h2 id="exam-practice-heading">Exam Practice: LO1 and LO2</h2>
      <p>
        Practice for the Unit 3 examination using what you have studied so far.
        LO3 and LO4 are not included. You do not need to finish every earlier hub activity first.
      </p>
      <div className="card-grid">
        {ACTIVITIES.map((activity) => (
          <article className="hub-card" key={activity.href}>
            <h3>{activity.title}</h3>
            <p>{activity.duration}</p>
            <p>{activity.type}</p>
            <p>{activity.purpose}</p>
            <a className="lp-button card-link" href={createSitePath(root, activity.href)}>
              Open {activity.title}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
