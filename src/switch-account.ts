/**
 * Leave the wrong Unit 3 Auth session and open Core Sign in.
 *
 * Uses Core local sign-out only (per-hub auth storage). Clears the Unit 3
 * pending-onboarding session key; does not touch other hubs' storage.
 */
export async function switchUnit3Account({
  clearPending,
  signOut,
  openSignIn,
  trigger = null
}: {
  clearPending?: () => void;
  signOut: () => Promise<unknown>;
  openSignIn: (trigger?: EventTarget | null) => void;
  trigger?: EventTarget | null;
}): Promise<void> {
  clearPending?.();
  await signOut();
  openSignIn(trigger);
}
