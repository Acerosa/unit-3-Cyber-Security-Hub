export function ActivitySequenceNav({
  weekHref,
  weekLabel,
  previous,
  next
}: {
  weekHref: string;
  weekLabel: string;
  previous?: { href: string; label: string } | null;
  next?: { href: string; label: string } | null;
}) {
  return (
    <nav className="lp-activity-nav" aria-label="Activities">
      {previous ? (
        <a className="lp-text-link" href={previous.href} rel="prev">
          Previous: {previous.label}
        </a>
      ) : (
        <a className="lp-text-link" href={weekHref}>{weekLabel}</a>
      )}
      {next ? (
        <a className="lp-button" href={next.href} rel="next">
          Next: {next.label}
        </a>
      ) : (
        <a className="lp-button" href={weekHref}>Back to {weekLabel}</a>
      )}
    </nav>
  );
}
