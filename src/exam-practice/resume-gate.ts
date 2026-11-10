export const SAVED_ANSWERS_LOADING = "Loading your saved answers";
export const SAVED_ANSWERS_LOAD_FAILED = "Your saved answers could not be loaded. Refresh the page before typing.";

const SESSION_PENDING = new Set(["loading", "signing-in", "offline"]);

/** The hub label can stay on loading after sign-in. Keep reading until it settles. */
export function sessionStillSettling(platformState?: string): boolean {
  return platformState == null || platformState === "" || SESSION_PENDING.has(platformState);
}

export function resumeReadAttempts(platformState?: string): number {
  return sessionStillSettling(platformState) ? 12 : 1;
}

/**
 * Remote drafts are readable once this learner is signed in.
 * A signed-out first paint must not be treated as an empty answer.
 * The hub can remain labelled "loading" after the session exists; that
 * label must not keep a submitted paper locked on the loading message.
 */
export function examRemoteReady(platformState?: string, signedIn?: boolean): boolean {
  if (signedIn === true) return true;
  if (signedIn === false) return false;
  if (platformState == null || platformState === "") return true;
  if (platformState === "signed-out") return false;
  if (SESSION_PENDING.has(platformState)) return false;
  return true;
}
