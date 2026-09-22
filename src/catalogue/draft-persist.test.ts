import { describe, expect, it } from "vitest";
import { persistUiStatusFromCore, PERSIST_STATUS_COPY } from "./draft-persist";

describe("Core persist status mapping", () => {
  it("maps Core snapshots onto learner-facing copy", () => {
    expect(persistUiStatusFromCore({ status: "saving", saving: true })).toBe("saving");
    expect(persistUiStatusFromCore({ status: "synced", lastRemoteSaveSucceeded: true })).toBe("saved");
    expect(persistUiStatusFromCore({ status: "pending", dirty: true })).toBe("pending");
    expect(persistUiStatusFromCore({ status: "failed", retryPending: true })).toBe("error");
    expect(PERSIST_STATUS_COPY.saved).toBe("Saved ✓");
    expect(PERSIST_STATUS_COPY.pending).toBe("Saved on this device - waiting to sync");
    expect(PERSIST_STATUS_COPY.error).toBe("Not saved online - retrying");
  });

  it("does not treat idle Core state as saved", () => {
    expect(persistUiStatusFromCore({ status: "idle" })).toBe("idle");
    expect(persistUiStatusFromCore(null)).toBe("idle");
  });
});
