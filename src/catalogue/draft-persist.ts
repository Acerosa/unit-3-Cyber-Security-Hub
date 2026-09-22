export type PersistUiStatus = "idle" | "saving" | "saved" | "pending" | "error";

export const PERSIST_STATUS_COPY: Record<PersistUiStatus, string> = {
  idle: "",
  saving: "Saving...",
  saved: "Saved ✓",
  pending: "Saved on this device - waiting to sync",
  error: "Not saved online - retrying"
};

export type CorePersistSnapshot = {
  status?: string;
  dirty?: boolean;
  saving?: boolean;
  retryPending?: boolean;
  lastRemoteSaveSucceeded?: boolean | null;
};

/**
 * Map Core persistStatus() onto hub UI copy. Retry/backoff lives in Core.
 */
export function persistUiStatusFromCore(
  snapshot: CorePersistSnapshot | null | undefined
): PersistUiStatus {
  if (!snapshot) return "idle";
  if (snapshot.saving === true || snapshot.status === "saving") return "saving";
  if (snapshot.status === "failed" || snapshot.retryPending === true) return "error";
  if (snapshot.status === "pending" || snapshot.dirty === true) return "pending";
  if (snapshot.status === "synced" || snapshot.lastRemoteSaveSucceeded === true) return "saved";
  return "idle";
}
