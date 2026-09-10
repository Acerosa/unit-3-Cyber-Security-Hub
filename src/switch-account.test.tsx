/**
 * @vitest-environment jsdom
 */
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAccountDialog, createPlatform } from "@learning-platform/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { JoinClassPanel } from "./components/JoinClassPanel";
import { EXPECTED_REGISTRATION_KEY } from "./enrolment";
import { switchUnit3Account } from "./switch-account";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem(key: string) { return values.has(key) ? values.get(key)! : null; },
    setItem(key: string, value: string) { values.set(key, String(value)); },
    removeItem(key: string) { values.delete(key); },
    has(key: string) { return values.has(key); },
    keys() { return [...values.keys()]; }
  };
}

describe("switchUnit3Account", () => {
  it("clears pending, signs out, then opens Core Sign in", async () => {
    const order: string[] = [];
    const clearPending = vi.fn(() => { order.push("clear"); });
    const signOut = vi.fn(async () => { order.push("signOut"); });
    const openSignIn = vi.fn(() => { order.push("openSignIn"); });
    const trigger = document.createElement("button");

    await switchUnit3Account({ clearPending, signOut, openSignIn, trigger });

    expect(order).toEqual(["clear", "signOut", "openSignIn"]);
    expect(openSignIn).toHaveBeenCalledWith(trigger);
  });
});

describe("JoinClass Switch account UX", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("offers Switch account only after STUDENT_NUMBER_ALREADY_LINKED", async () => {
    const onSwitchAccount = vi.fn();
    const onSignIn = vi.fn();
    const platform = {
      onboarding: {
        getPending: () => ({
          firstName: "Other",
          surname: "Learner",
          studentNumber: "123456"
        }),
        complete: vi.fn(async () => {
          throw Object.assign(new Error("conflict"), {
            cause: { message: "STUDENT_NUMBER_ALREADY_LINKED" }
          });
        }),
        joinClass: vi.fn()
      },
      learner: {
        getState: () => ({ status: "onboarding-required", context: null })
      }
    };

    render(
      <JoinClassPanel
        platformState="onboarding-required"
        platform={platform}
        onSignIn={onSignIn}
        onSwitchAccount={onSwitchAccount}
      />
    );

    expect(screen.getByRole("button", { name: "Account" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Switch account" })).toBeNull();

    fireEvent.change(screen.getByLabelText(/Class registration key/i), {
      target: { value: EXPECTED_REGISTRATION_KEY }
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Join class" }));
    });

    await waitFor(() => {
      expect(screen.getByText(/already linked to another learning account/i)).toBeTruthy();
    });
    expect(screen.getByRole("button", { name: "Switch account" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Account" })).toBeNull();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Switch account" }));
    });
    expect(onSwitchAccount).toHaveBeenCalledTimes(1);
    expect(onSignIn).not.toHaveBeenCalled();
  });

  it("does not show Switch account for a linked learner who only needs JoinClass", async () => {
    const joinClass = vi.fn(async () => ({ groupCode: "CYBER-TEST-A", status: "enrolled" }));
    render(
      <JoinClassPanel
        platformState="no-enrolment"
        platform={{
          onboarding: {
            getPending: () => null,
            complete: vi.fn(),
            joinClass
          },
          learner: {
            getState: () => ({
              status: "authenticated",
              context: {
                firstName: "Linked",
                surname: "Learner",
                studentNumber: "123456",
                enrolments: []
              }
            })
          }
        }}
        onSignIn={vi.fn()}
        onSwitchAccount={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/Class registration key/i), {
      target: { value: EXPECTED_REGISTRATION_KEY }
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Join class" }));
    });
    await waitFor(() => expect(joinClass).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("button", { name: "Switch account" })).toBeNull();
    expect(screen.getByRole("button", { name: "Account" })).toBeTruthy();
  });

  it("guest Sign in opens Core Sign in dialog without legacy auth fields", () => {
    const onSignIn = vi.fn();
    render(
      <JoinClassPanel
        platformState="signed-out"
        platform={{}}
        onSignIn={onSignIn}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it("switch account clears only the Unit 3 pending key and opens Core Sign in", async () => {
    const unit3Pending = "learning-platform.pending-onboarding.v1:unit-3-cyber-security";
    const tlevelPending = "learning-platform.pending-onboarding.v1:tlevel-digital-software";
    const l2ePending = "learning-platform.pending-onboarding.v1:l2e-digital";
    const unit3Auth = "sb-example-auth-token--unit-3-cyber-security";
    const tlevelAuth = "sb-example-auth-token--tlevel-digital-software";
    const session = memoryStorage();
    const local = memoryStorage();
    session.setItem(unit3Pending, JSON.stringify({
      firstName: "Wrong",
      surname: "Account",
      studentNumber: "123456"
    }));
    session.setItem(tlevelPending, JSON.stringify({
      firstName: "Keep",
      surname: "TLevel",
      studentNumber: "999999"
    }));
    session.setItem(l2ePending, JSON.stringify({
      firstName: "Keep",
      surname: "L2E",
      studentNumber: "888888"
    }));
    local.setItem(unit3Auth, "unit3-session");
    local.setItem(tlevelAuth, "tlevel-session");

    let signedIn = true;
    const signOutCalls: Array<{ scope?: string }> = [];
    const client = {
      auth: {
        onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
        getSession() {
          return Promise.resolve({
            data: { session: signedIn ? { access_token: "unit3" } : null },
            error: null
          });
        },
        async signOut(options?: { scope?: string }) {
          signOutCalls.push(options || {});
          signedIn = false;
          local.removeItem(unit3Auth);
          return { error: null };
        },
        signInWithPassword() { return Promise.resolve({ data: { session: null }, error: null }); },
        signUp() { return Promise.resolve({ data: { session: null, user: null }, error: null }); }
      },
      schema() {
        return {
          from() {
            return {
              select() { return this; },
              eq() { return this; },
              order() { return this; },
              then(resolve: (value: unknown) => unknown) {
                return Promise.resolve({ data: [], error: null }).then(resolve);
              }
            };
          },
          rpc() { return Promise.resolve({ data: [], error: null }); }
        };
      }
    };

    const platform = createPlatform({
      hubCode: "unit-3-cyber-security",
      hubName: "Unit 3 Cyber Security Hub",
      supabase: {
        projectUrl: "https://example.supabase.co",
        publishableKey: "sb_publishable_example"
      }
    }, {
      supabaseClient: client,
      sessionStorage: session,
      localStorage: local
    }) as ReturnType<typeof createPlatform> & {
      auth: {
        initialise: () => Promise<unknown>;
        isSignedIn: () => boolean;
        signOut: () => Promise<unknown>;
      };
      onboarding: { clearPending: () => void };
      destroy: () => void;
    };

    await platform.auth.initialise();
    expect(platform.auth.isSignedIn()).toBe(true);

    const dialog = createAccountDialog({
      authService: platform.auth,
      learnerContext: platform.learner,
      onboardingService: platform.onboarding
    }) as {
      element: HTMLElement;
      open: (trigger?: EventTarget | null, options?: { mode?: "sign-in" | "register" }) => void;
    };
    document.body.append(dialog.element);

    await switchUnit3Account({
      clearPending: () => platform.onboarding.clearPending(),
      signOut: () => platform.auth.signOut(),
      openSignIn: (trigger) => dialog.open(trigger, { mode: "sign-in" })
    });

    expect(signOutCalls).toEqual([{ scope: "local" }]);
    expect(session.has(unit3Pending)).toBe(false);
    expect(session.getItem(tlevelPending)).toBeTruthy();
    expect(session.getItem(l2ePending)).toBeTruthy();
    expect(local.has(unit3Auth)).toBe(false);
    expect(local.getItem(tlevelAuth)).toBe("tlevel-session");
    expect(platform.auth.isSignedIn()).toBe(false);

    expect(dialog.element.querySelector("#lp-account-email")).toBeTruthy();
    expect(dialog.element.querySelector("#lp-account-password")).toBeTruthy();
    expect(dialog.element.textContent).toContain("Sign in");
    expect(dialog.element.querySelector("#lp-register-student-number")).toBeTruthy();
    const studentField = dialog.element.querySelector("#lp-register-student-number")
      ?.closest(".lp-form__field") as HTMLElement | null;
    expect(studentField?.hidden).toBe(true);

    platform.destroy();
  });
});
