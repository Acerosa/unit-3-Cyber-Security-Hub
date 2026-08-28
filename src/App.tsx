import { LearnerHeader, LoadingState } from "@learning-platform/ui";
import { useEffect, useMemo } from "react";
import { Unit3HubShell } from "./components/Unit3HubShell";
import { APP_CONFIG } from "./config";
import { liveContentPackage } from "./curriculum/apply-runtime";
import { useHubPlatform } from "./hooks/useHubPlatform";
import { currentIds, type PageContext } from "./page-context";
import { breadcrumbs, findRoute, pageHeader } from "./page-copy";
import { ActivityPage } from "./pages/ActivityPage";
import { HomePage } from "./pages/HomePage";
import { PageHost } from "./pages/PageHost";
import { WeekPage } from "./pages/WeekPage";
import { buildUnit3Navigation, createSitePath } from "./paths";

function RouteRedirect({ root, to }: { root: string; to: string }) {
  useEffect(() => {
    window.location.replace(createSitePath(root, to));
  }, [root, to]);
  return <LoadingState message="Opening this week's activities..." />;
}

function PageBody({
  context,
  contentReady,
  adaptersReady
}: {
  context: PageContext;
  contentReady: boolean;
  adaptersReady: boolean;
}) {
  const route = findRoute(context);
  const scripts = route?.scripts || [];
  if (route?.redirectTo) {
    return <RouteRedirect root={context.root} to={route.redirectTo} />;
  }
  if (context.view === "home") {
    return <HomePage root={context.root} livePackage={contentReady ? liveContentPackage() : null} />;
  }
  if (context.view === "week") {
    return <WeekPage context={context} contentReady={contentReady} adaptersReady={adaptersReady} />;
  }
  if (context.view === "activity" || context.view === "week1-activity") {
    return <ActivityPage context={context} contentReady={contentReady} adaptersReady={adaptersReady} />;
  }
  return <PageHost root={context.root} scripts={scripts} adaptersReady={adaptersReady} />;
}

export function App({ context }: { context: PageContext }) {
  const { learner, theme, accountDialog, platform, contentReady, adaptersReady } = useHubPlatform(context.root);
  const header = pageHeader(context);
  const livePackage = contentReady ? liveContentPackage() : null;
  const navigation = useMemo(
    () => buildUnit3Navigation(context.root, livePackage),
    [context.root, livePackage]
  );

  return (
    <Unit3HubShell
      brandTitle={APP_CONFIG.shortName}
      brandTagline={APP_CONFIG.qualification}
      navigation={navigation}
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
      <PageBody context={context} contentReady={contentReady} adaptersReady={adaptersReady} />
    </Unit3HubShell>
  );
}
