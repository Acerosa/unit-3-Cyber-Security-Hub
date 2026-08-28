import type { BreadcrumbItem, ThemeControl } from "@learning-platform/ui";
import { Breadcrumbs } from "@learning-platform/ui";
import type { ReactNode } from "react";
import { Unit3Navigation, type Unit3NavigationItem } from "./Unit3Navigation";

export type Unit3HubShellProps = {
  brandTitle: string;
  brandTagline?: string;
  navigation: Unit3NavigationItem[];
  currentId?: string;
  currentIds?: string[];
  theme?: ThemeControl | null;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  resolveHref?: (path: string) => string;
  pageHeader?: { title: string; subtitle?: string } | null;
  footer?: { lines: string[] } | ReactNode;
  learnerHeader?: ReactNode;
  notice?: ReactNode;
  skipLabel?: string;
  mainId?: string;
  children: ReactNode;
};

export function Unit3HubShell({
  brandTitle,
  brandTagline,
  navigation,
  currentId = "home",
  currentIds = [],
  theme = null,
  actions,
  breadcrumbs,
  resolveHref,
  pageHeader,
  footer,
  learnerHeader,
  notice,
  skipLabel = "Skip to main content",
  mainId = "main-content",
  children
}: Unit3HubShellProps): ReactNode {
  const footerNode = footer && typeof footer === "object" && "lines" in footer
    ? (footer.lines as string[]).map((line) => <p key={line}>{line}</p>)
    : footer;

  return (
    <div className="lp-shell">
      <a className="lp-skip-link skip-link" href={`#${mainId}`}>{skipLabel}</a>
      <header className="lp-shell__banner" role="banner">
        <Unit3Navigation
          items={navigation}
          currentId={currentId}
          currentIds={currentIds}
          brandTitle={brandTitle}
          brandTagline={brandTagline}
          theme={theme}
          actions={actions}
        />
      </header>
      <div className="lp-shell__learner">{learnerHeader}</div>
      {notice}
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} resolveHref={resolveHref} /> : null}
      {pageHeader?.title ? (
        <div className="lp-page-header page-header">
          <h1>{pageHeader.title}</h1>
          {pageHeader.subtitle ? <p className="lp-page-header__subtitle">{pageHeader.subtitle}</p> : null}
        </div>
      ) : null}
      <main id={mainId} className="lp-shell__main site-main" tabIndex={-1}>
        {children}
      </main>
      <footer className="lp-shell__footer site-footer" role="contentinfo">
        {footerNode}
      </footer>
    </div>
  );
}
