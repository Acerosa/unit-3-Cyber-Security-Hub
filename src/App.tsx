import { LearnerHeader, LoadingState } from "@learning-platform/ui";
import { useEffect, useMemo, useRef } from "react";
import { JoinClassPanel } from "./components/JoinClassPanel";
import { Unit3HubShell } from "./components/Unit3HubShell";
import { APP_CONFIG } from "./config";
import { liveContentPackage } from "./curriculum/apply-runtime";
import {
  JOIN_CLASS_PROMPT,
  needsJoinClass,
  withEnrolmentGuardedMarking,
  type EnrolmentRow
} from "./enrolment";
import { accountPageAutoOpenAction } from "./account-auto-open";
import { useHubPlatform } from "./hooks/useHubPlatform";
import { currentIds, type PageContext } from "./page-context";
import { breadcrumbs, findRoute, pageHeader } from "./page-copy";
import { AccountPage } from "./pages/AccountPage";
import { ActivityPage } from "./pages/ActivityPage";
import { HomePage } from "./pages/HomePage";
import { PageHost } from "./pages/PageHost";
import { WeekPage } from "./pages/WeekPage";
import { buildUnit3Navigation, buildUnit3NavigationFallback, createSitePath } from "./paths";

function RouteRedirect({ root, to }: { root: string; to: string }) {
  useEffect(() => {
    window.location.replace(createSitePath(root, to));
  }, [root, to]);
  return <LoadingState message="Opening this week's activities..." />;
}

function PageBody({
  context,
  contentReady,
  adaptersReady,
  platform,
  platformState,
  onJoined,
  onOpenSignIn,
  onOpenCreateAccount
}: {
  context: PageContext;
  contentReady: boolean;
  adaptersReady: boolean;
  platform?: unknown;
  platformState: string;
  onJoined?: () => void;
  onOpenSignIn?: (trigger?: EventTarget | null) => void;
  onOpenCreateAccount?: (trigger?: EventTarget | null) => void;
}) {
  const route = findRoute(context);
  const scripts = route?.scripts || [];
  const enrolments = (platform as {
    learner?: { getState?: () => { context?: { enrolments?: EnrolmentRow[] } | null } };
  })?.learner?.getState?.()?.context?.enrolments;
  const joinGate = needsJoinClass(platformState, { enrolments }) || platformState === "signed-out";
  const showJoin = joinGate && (
    context.view === "home"
    || context.view === "week"
    || context.view === "activity"
    || context.view === "week1-activity"
    || (context.view === "account" && platformState !== "signed-out")
  );
  const joinPanel = showJoin ? (
    <JoinClassPanel
      compact
      root={context.root}
      platformState={platformState}
      platform={platform as never}
      onSignIn={(trigger) => onOpenSignIn?.(trigger)}
      onJoined={onJoined}
    />
  ) : null;

  if (route?.redirectTo) {
    return <RouteRedirect root={context.root} to={route.redirectTo} />;
  }
  if (!contentReady) {
    return (
      <>
        {joinPanel}
        <LoadingState message="Loading curriculum..." />
      </>
    );
  }
  if (context.view === "home") {
    return (
      <>
        {joinPanel}
        <HomePage root={context.root} livePackage={liveContentPackage()} />
      </>
    );
  }
  if (context.view === "week") {
    return (
      <>
        {joinPanel}
        <WeekPage context={context} contentReady={contentReady} adaptersReady={adaptersReady} />
      </>
    );
  }
  if (context.view === "activity" || context.view === "week1-activity") {
    return (
      <>
        {joinPanel}
        <ActivityPage context={context} contentReady={contentReady} adaptersReady={adaptersReady} platform={platform} />
      </>
    );
  }
  if (context.view === "account") {
    return (
      <>
        {joinPanel}
        <AccountPage
          onSignIn={(trigger) => onOpenSignIn?.(trigger)}
          onCreateAccount={(trigger) => onOpenCreateAccount?.(trigger)}
        />
      </>
    );
  }
  return (
    <>
      {joinPanel}
      <PageHost root={context.root} scripts={scripts} adaptersReady={adaptersReady} />
    </>
  );
}

export function App({ context }: { context: PageContext }) {
  const { learner, theme, accountDialog, platform, contentReady, adaptersReady, platformState } = useHubPlatform(context.root);
  const header = pageHeader(context);
  const navigation = useMemo(
    () => (contentReady
      ? buildUnit3Navigation(context.root, liveContentPackage())
      : buildUnit3NavigationFallback(context.root)),
    [context.root, contentReady]
  );
  const enrolments = (learner as { enrolments?: EnrolmentRow[] } | null)?.enrolments;
  const joinNeeded = needsJoinClass(platformState, { enrolments });
  const signedIn = Boolean(learner) || joinNeeded;
  const guardedPlatform = useMemo(
    () => withEnrolmentGuardedMarking(platform as never, () => platformState),
    [platform, platformState]
  );

  function openAccount(trigger?: EventTarget | null, options?: { mode?: "sign-in" | "register" }) {
    if (
      joinNeeded
      && options?.mode !== "register"
      && typeof accountDialog?.showOnboarding === "function"
    ) {
      accountDialog.showOnboarding();
      return;
    }
    accountDialog?.open(trigger, options);
  }

  function activateCreateAccountTab() {
    const tab = Array.from(accountDialog?.element?.querySelectorAll('[role="tab"]') || [])
      .find((node) => node.textContent === "Create account");
    if (tab instanceof HTMLElement) tab.click();
  }

  function openCreateAccount(trigger?: EventTarget | null) {
    accountDialog?.open(trigger, { mode: "register" });
    activateCreateAccountTab();
  }

  const didAutoOpenAccount = useRef(false);

  useEffect(() => {
    if (context.view !== "account") {
      didAutoOpenAccount.current = false;
      return;
    }
    const action = accountPageAutoOpenAction(
      context.view,
      platformState,
      didAutoOpenAccount.current
    );
    if (!action || !accountDialog) return;
    didAutoOpenAccount.current = true;
    if (action === "onboarding" && typeof accountDialog.showOnboarding === "function") {
      accountDialog.showOnboarding();
      return;
    }
    if (action === "sign-in") accountDialog.open();
  }, [accountDialog, context.view, platformState]);

  async function refreshAfterJoin() {
    const learner = platform.learner as { refresh?: () => Promise<unknown> };
    await learner.refresh?.();
  }

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
          {signedIn ? (
            <>
              <span className="student-account__name">
                {learner?.displayName || learner?.fullName || (joinNeeded ? "Finish joining your class" : "Learner")}
              </span>
              {joinNeeded ? (
                <button
                  className="lp-button"
                  type="button"
                  data-join-class-open=""
                  onClick={(event) => openAccount(event.currentTarget)}
                >
                  {JOIN_CLASS_PROMPT}
                </button>
              ) : null}
              <button
                className="lp-button lp-button--secondary"
                type="button"
                onClick={(event) => openAccount(event.currentTarget)}
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
      <PageBody
        context={context}
        contentReady={contentReady}
        adaptersReady={adaptersReady}
        platform={guardedPlatform}
        platformState={platformState}
        onJoined={() => { void refreshAfterJoin(); }}
        onOpenSignIn={openAccount}
        onOpenCreateAccount={openCreateAccount}
      />
    </Unit3HubShell>
  );
}
