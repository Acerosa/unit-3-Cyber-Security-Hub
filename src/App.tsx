import { LearnerHeader, LoadingState } from "@learning-platform/ui";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { focusJoinClassPanel, shouldOpenCoreOnboarding } from "./focus-join-class";
import { useHubPlatform } from "./hooks/useHubPlatform";
import { currentIds, type PageContext } from "./page-context";
import { breadcrumbs, findRoute, pageHeader } from "./page-copy";
import { AccountPage } from "./pages/AccountPage";
import { ActivityPage } from "./pages/ActivityPage";
import { HomePage } from "./pages/HomePage";
import { PageHost } from "./pages/PageHost";
import { WeekPage } from "./pages/WeekPage";
import { buildUnit3Navigation, buildUnit3NavigationFallback, createSitePath } from "./paths";
import { switchUnit3Account } from "./switch-account";

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
  authStatus,
  onJoined,
  onOpenSignIn,
  onOpenCreateAccount,
  onSwitchAccount,
  onRefreshSession,
  refreshStatus
}: {
  context: PageContext;
  contentReady: boolean;
  adaptersReady: boolean;
  platform?: unknown;
  platformState: string;
  authStatus?: string | null;
  onJoined?: () => void;
  onOpenSignIn?: (trigger?: EventTarget | null) => void;
  onOpenCreateAccount?: (trigger?: EventTarget | null) => void;
  onSwitchAccount?: (trigger?: EventTarget | null) => void | Promise<void>;
  onRefreshSession?: (trigger?: EventTarget | null) => void | Promise<void>;
  refreshStatus?: string;
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
      authStatus={authStatus}
      platform={platform as never}
      onSignIn={(trigger) => onOpenSignIn?.(trigger)}
      onSwitchAccount={onSwitchAccount}
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
        <WeekPage context={context} contentReady={contentReady} adaptersReady={adaptersReady} platform={platform} />
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
          onRefreshSession={onRefreshSession}
          refreshStatus={refreshStatus}
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
  const { learner, theme, accountDialog, platform, contentReady, adaptersReady, platformState, authStatus } = useHubPlatform(context.root);
  const header = pageHeader(context);
  const navigation = useMemo(
    () => (contentReady
      ? buildUnit3Navigation(context.root, liveContentPackage())
      : buildUnit3NavigationFallback(context.root)),
    [context.root, contentReady]
  );
  const enrolments = (learner as { enrolments?: EnrolmentRow[] } | null)?.enrolments;
  const joinNeeded = needsJoinClass(platformState, { enrolments });
  const signedIn = authStatus === "authenticated" || Boolean(learner) || joinNeeded;
  const [refreshStatus, setRefreshStatus] = useState("");
  const guardedPlatform = useMemo(
    () => withEnrolmentGuardedMarking(platform as never, () => platformState),
    [platform, platformState]
  );

  function openAccount(trigger?: EventTarget | null, options?: { mode?: "sign-in" | "register" }) {
    // Identity onboarding only when Auth has no learner profile. Returning
    // learners (learnerStatus authenticated) stay on JoinClass — even if
    // platformState briefly says onboarding-required after hub resolve.
    const learnerStatus = platform.learner?.getState?.()?.status || null;
    if (
      shouldOpenCoreOnboarding(platformState, learnerStatus)
      && options?.mode !== "register"
      && typeof accountDialog?.showOnboarding === "function"
    ) {
      accountDialog.showOnboarding();
      return;
    }
    accountDialog?.open(trigger, options);
  }

  function openJoinClass(trigger?: EventTarget | null) {
    if (focusJoinClassPanel()) return;
    openAccount(trigger);
  }

  /** Guest / post-sign-out: always open Core Sign in (never onboarding). */
  function openSignInDialog(trigger?: EventTarget | null) {
    accountDialog?.open(trigger, { mode: "sign-in" });
  }

  async function handleSwitchAccount(trigger?: EventTarget | null) {
    // Account was a no-op here: openAccount → showOnboarding while still signed in
    // as the wrong Auth identity. Sign out this hub locally, then open Sign in.
    const onboarding = platform.onboarding as { clearPending?: () => void } | undefined;
    await switchUnit3Account({
      clearPending: () => onboarding?.clearPending?.(),
      signOut: () => platform.auth.signOut(),
      openSignIn: openSignInDialog,
      trigger
    });
  }

  async function handleRefreshSession(trigger?: EventTarget | null) {
    setRefreshStatus("Refreshing your session…");
    const refresh = (platform as { refreshHubSession?: () => Promise<{
      ok?: boolean;
      requiresSignIn?: boolean;
      learnerMessage?: string;
    }> }).refreshHubSession;
    if (typeof refresh !== "function") {
      setRefreshStatus("Session refresh is unavailable right now.");
      return;
    }
    const result = await refresh();
    if (result?.requiresSignIn) {
      setRefreshStatus(result.learnerMessage || "Your session needs to be refreshed. Please sign in again.");
      openSignInDialog(trigger);
      return;
    }
    setRefreshStatus(result?.ok ? "Your session is up to date." : "Could not refresh your session.");
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
      didAutoOpenAccount.current,
      platform.learner?.getState?.()?.status || null
    );
    if (!action || !accountDialog) return;
    didAutoOpenAccount.current = true;
    const learnerStatus = platform.learner?.getState?.()?.status || null;
    if (
      action === "onboarding"
      && shouldOpenCoreOnboarding(platformState, learnerStatus)
      && typeof accountDialog.showOnboarding === "function"
    ) {
      accountDialog.showOnboarding();
      return;
    }
    if (action === "onboarding") {
      focusJoinClassPanel();
      return;
    }
    if (action === "sign-in") accountDialog.open();
  }, [accountDialog, context.view, platformState, platform]);

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
                  onClick={(event) => openJoinClass(event.currentTarget)}
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
          "OCR Level 3 IT learning resources"
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
        onOpenSignIn={platformState === "signed-out" ? openSignInDialog : openAccount}
        onOpenCreateAccount={openCreateAccount}
        onSwitchAccount={handleSwitchAccount}
        onRefreshSession={handleRefreshSession}
        refreshStatus={refreshStatus}
      />
    </Unit3HubShell>
  );
}
