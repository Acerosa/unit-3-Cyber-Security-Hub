import { describe, expect, it } from "vitest";
import { accountPageAutoOpenAction } from "./account-auto-open";

describe("account page auto-open", () => {
  it("opens Core sign-in once for a signed-out learner", () => {
    expect(accountPageAutoOpenAction("account", "signed-out", false)).toBe("sign-in");
    expect(accountPageAutoOpenAction("account", "signed-out", true)).toBeNull();
  });

  it("does not reopen after signup returns the learner to signed-out", () => {
    expect(accountPageAutoOpenAction("account", "signing-in", true)).toBeNull();
    expect(accountPageAutoOpenAction("account", "signed-out", true)).toBeNull();
  });

  it("does not auto-open Core on other pages", () => {
    expect(accountPageAutoOpenAction("home", "signed-out", false)).toBeNull();
  });
});
