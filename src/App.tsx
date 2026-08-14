import { HubShell, LearnerHeader } from "@learning-platform/ui";
import { APP_CONFIG } from "./config";
import { useHubPlatform } from "./hooks/useHubPlatform";
import { currentIds, type PageContext } from "./page-context";
import { breadcrumbs, findRoute, pageHeader } from "./page-copy";
import { ActivityPage } from "./pages/ActivityPage";
import { PageHost } from "./pages/PageHost";
import { WeekPage } from "./pages/WeekPage";
import { createSitePath, navigationItems } from "./paths";

function PageBody({ context, adaptersReady }: { context: PageContext; adaptersReady: boolean }) {
  const route = findRoute(context);
  const scripts = route?.scripts || [];
  if (context.view === "week") {
    return <WeekPage context={context} adaptersReady={adaptersReady} />;
  }
  if (context.view === "activity" || context.view === "week1-activity") {
    return <ActivityPage context={context} adaptersReady={adaptersReady} />;
  }
  return <PageHost root={context.root} scripts={scripts} adaptersReady={adaptersReady} />;
}

export function App({ context }: { context: PageContext }) {
  const { learner, theme, accountDialog, platform, adaptersReady } = useHubPlatform(context.root);
  const header = pageHeader(context);

  return (
    <HubShell
      brandTitle={APP_CONFIG.shortName}
      brandTagline={APP_CONFIG.qualification}
      navigation={navigationItems([...APP_CONFIG.navigation], context.root)}
      currentId={context.section}
      currentIds={currentIds(context)}
      theme={theme}
      actions={(
        <div className="student-account" data-student-account="">
          {learner ? (
            <>
              <span className="student-account__name">{learner.displayName || learner.fullName || "Learner"}</span>
              <button
                className="lp-button lp-button--secondary"
                type="button"
                onClick={(event) => accountDialog?.open(event.currentTarget)}
              >
                Account
              </button>
            </>
          ) : (
            <button
              className="lp-button lp-button--secondary"
              type="button"
              data-student-sign-in=""
              onClick={(event) => accountDialog?.open(event.currentTarget)}
            >
              Sign in
            </button>
          )}
        </div>
      )}
      breadcrumbs={breadcrumbs(context)}
      resolveHref={(path) => createSitePath(context.root, path)}
      pageHeader={header}
      learnerHeader={(
        <LearnerHeader
          learner={learner}
          hubName={platform.config.hubName}
          accountHref={platform.config.accountPath}
          onSignOut={() => platform.auth.signOut()}
        />
      )}
      footer={{
        lines: [
          "Unit 3 Cyber Security Hub",
          "OCR Level 3 IT formative learning resources",
          "Results collection is for formative assessment only."
        ]
      }}
    >
      <PageBody context={context} adaptersReady={adaptersReady} />
    </HubShell>
  );
}
