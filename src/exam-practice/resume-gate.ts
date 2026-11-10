export const SAVED_ANSWERS_LOADING = "Loading your saved answers";
export const SAVED_ANSWERS_LOAD_FAILED = "Your saved answers could not be loaded. Refresh the page before typing.";

/** Remote drafts are readable only after the hub has a learner session. */
export function examRemoteReady(platformState?: string, signedIn?: boolean): boolean {
  if (signedIn === false) return false;
  if (platformState == null || platformState === "") return true;
  return platformState === "ready" || platformState === "no-assignments";
}
