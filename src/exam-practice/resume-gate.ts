export const SAVED_ANSWERS_LOADING = "Loading your saved answers";
export const SAVED_ANSWERS_LOAD_FAILED = "Your saved answers could not be loaded. Refresh the page before typing.";

const SESSION_PENDING = new Set(["loading", "signing-in", "offline"]);

/**
 * Remote drafts are readable once the learner session has settled.
 * Reading during the first signed-out paint, then never again, leaves a
 * saved answer looking empty.
 */
export function examRemoteReady(platformState?: string, signedIn?: boolean): boolean {
  if (signedIn === false) return false;
  if (platformState == null || platformState === "") return true;
  if (platformState === "signed-out") return false;
  if (SESSION_PENDING.has(platformState)) return false;
  return true;
}
