type AccountPageProps = {
  onSignIn: (trigger?: EventTarget | null) => void;
  onCreateAccount: (trigger?: EventTarget | null) => void;
  onRefreshSession?: (trigger?: EventTarget | null) => void | Promise<void>;
  refreshStatus?: string;
};

export function AccountPage({
  onSignIn,
  onCreateAccount,
  onRefreshSession,
  refreshStatus = ""
}: AccountPageProps) {
  return (
    <section className="panel unit3-account" aria-labelledby="account-heading" data-unit3-account="core">
      <h2 id="account-heading">Learner account</h2>
      <p>
        Sign in or create an account to save your Unit 3 progress.
        If you already created an account on another learning hub, sign in using
        the same email and password.
      </p>
      <p>
        Joining your Cyber Security class is a separate step. After you are signed in,
        enter the class registration key from your tutor.
      </p>
      <div className="unit3-account__actions">
        <button
          className="lp-button"
          type="button"
          data-account-sign-in=""
          onClick={(event) => onSignIn(event.currentTarget)}
        >
          Sign in
        </button>
        <button
          className="lp-button lp-button--secondary"
          type="button"
          data-account-create=""
          onClick={(event) => onCreateAccount(event.currentTarget)}
        >
          Create account
        </button>
        {onRefreshSession ? (
          <button
            className="lp-button lp-button--secondary"
            type="button"
            data-account-refresh-session=""
            onClick={(event) => { void onRefreshSession(event.currentTarget); }}
          >
            Having trouble? Refresh session
          </button>
        ) : null}
      </div>
      {refreshStatus ? (
        <p className="unit3-account__status" role="status" aria-live="polite">
          {refreshStatus}
        </p>
      ) : null}
    </section>
  );
}
