import type { ActivityDocument } from "@learning-platform/ui";
import { EmptyState } from "@learning-platform/ui";
import { knowledgeReportActivities, knowledgeReportConfig } from "../catalogue/knowledge-report";
import { activeContentPackage } from "../curriculum/apply-runtime";
import { createSitePath } from "../paths";

export function KnowledgeReportsPage({
  root,
  contentReady
}: {
  root: string;
  contentReady: boolean;
}) {
  const content = contentReady ? activeContentPackage() : null;
  const reports = knowledgeReportActivities((content?.activities || []) as ActivityDocument[]);

  if (!contentReady) return null;
  if (!reports.length) {
    return (
      <EmptyState
        heading="Knowledge Reports"
        message="No knowledge reports are available yet."
      />
    );
  }

  return (
    <section className="panel" aria-labelledby="knowledge-reports-heading">
      <h2 id="knowledge-reports-heading">Knowledge Reports</h2>
      <p>
        A timed opportunity to demonstrate what you have learned so far.
      </p>
      <div className="card-grid">
        {reports.map((activity) => {
          const config = knowledgeReportConfig(activity);
          if (!config) return null;
          const title = activity.metadata?.title || "Knowledge Report";
          const href = createSitePath(
            root,
            `knowledge-reports/${config.slug || "report"}/`
          );
          return (
            <article className="hub-card" key={activity.id}>
              <h3>{title}</h3>
              <p>{config.durationMinutes} minutes</p>
              <p>Minimum {config.minWords} words</p>
              {config.brief ? <p>{config.brief}</p> : null}
              <a className="lp-button card-link" href={href}>
                Start Knowledge Report
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
