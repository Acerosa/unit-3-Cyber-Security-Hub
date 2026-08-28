import { StatusBadge, WeekAccessLink } from "@learning-platform/ui";
import type { ContentPackage } from "../curriculum/from-package";
import { unit3RuntimeWeeks } from "../curriculum/runtime-weeks";
import { createSitePath } from "../paths";

const HOME_WEEK_COPY: Record<number, { description: string }> = {
  1: {
    description:
      "Start here for the Week 1 learning sequence: baseline check, CIA triad learning, incident classification, glossary and retrieval practice."
  },
  2: {
    description:
      "Threats and vulnerabilities: malware symptoms, Northbank analysis, OCR-style practice and a vulnerability register."
  },
  3: {
    description:
      "Types of attacker: OCR attacker profiles, case matching, justified identification and examination practice."
  },
  4: {
    description:
      "Motivations and targets: why attackers act, what they target, how methods connect, and OCR-style analyse practice."
  },
  5: {
    description:
      "Impacts of cyber security incidents: loss, disruption and safety, Northbank stakeholder analysis and OCR-style impact practice."
  },
  6: {
    description:
      "Ethical, legal and operational considerations: legislation, stakeholder debate, Discuss technique and LO2 revision."
  },
  7: {
    description:
      "Risk management, testing and monitoring: convert the Northbank vulnerability register into a risk register, compare testing methods and practise justified recommendations."
  }
};

function homeBadgeLabel(week: { available: boolean; status: string }) {
  if (week.available) return "Available";
  return week.status === "archived" ? "Archived" : "Planned";
}

export function HomePage({ root, livePackage }: { root: string; livePackage?: ContentPackage | null }) {
  const weeks = unit3RuntimeWeeks(livePackage);

  return (
    <>
      <section className="panel" aria-labelledby="welcome-heading">
        <h2 id="welcome-heading">Welcome</h2>
        <p>
          This hub brings together weekly lesson resources, interactive activities,
          retrieval practice and formative assessment tools for Unit 3 Cyber Security.
        </p>
        <p>
          Start with the current week’s overview. Activities and resources for that week
          are listed there so you can follow the learning sequence without hunting across
          the site.
        </p>
      </section>

      <section aria-labelledby="start-heading">
        <h2 id="start-heading">Where to start</h2>
        <div className="home-week-scroller" tabIndex={0} aria-label="Week cards">
          <div className="card-grid">
            {weeks.map((week) => {
              const copy = HOME_WEEK_COPY[week.teachingWeek];
              return (
                <article className="hub-card" key={week.id}>
                  <StatusBadge
                    status={week.available ? "available" : (week.status || "planned")}
                    label={homeBadgeLabel(week)}
                  />
                  <h3>{week.title}</h3>
                  <p>{copy?.description || week.title}</p>
                  <WeekAccessLink
                    week={week}
                    href={createSitePath(root, `week-${week.teachingWeek}/`)}
                    className="card-link"
                    lockedClassName="card-link card-link--locked"
                    renderLink={({ href, children, className }) => (
                      <a className={className} href={href}>{children}</a>
                    )}
                  >
                    {`Open Week ${week.teachingWeek}`}
                  </WeekAccessLink>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="panel" aria-labelledby="organisation-heading">
        <h2 id="organisation-heading">How activities are organised</h2>
        <p>
          Learning activities sit inside each week’s area. Use the Week 1 to Week 7 pages to find
          Session 1 and Session 2 tasks, directed independent study and any activities
          that are still marked as coming soon.
        </p>
        <p>
          If your tutor has asked you to open one activity directly, you can go to
          <a href={createSitePath(root, "activities/activity.html?activityId=U3-W01-INCIDENTS")}>
            {" "}Incident Classification
          </a>
          {" "}from here, or open it from the Week 1 Session 1 list.
        </p>
        <p>
          The Resources section is for material used across several weeks, such as platform
          links, examination support and the Northbank briefing. It does not replace the
          weekly learner journey.
        </p>
      </section>

      <section className="panel" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading">Privacy and formative assessment</h2>
        <div className="privacy-notice" role="note">
          <p>
            Some activities can send formative results to the staff-controlled learning platform.
            Do not enter email addresses, passwords or other sensitive personal information.
          </p>
          <p>
            This hub is not a secure examination system. Browser checks improve usability only;
            staff systems validate submitted values again where collection is used.
          </p>
        </div>
      </section>
    </>
  );
}
