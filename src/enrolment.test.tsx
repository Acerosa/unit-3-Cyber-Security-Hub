/**
 * @vitest-environment jsdom
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { JoinClassPanel } from "./components/JoinClassPanel";
import {
  EXPECTED_GROUP_CODE,
  EXPECTED_REGISTRATION_KEY,
  JOIN_CLASS_MESSAGE,
  JOIN_CLASS_PROMPT,
  SIGN_IN_TO_CONTINUE,
  canMarkActivity,
  isCyberRegistrationOption,
  markBlockedError,
  needsJoinClass,
  withEnrolmentGuardedMarking
} from "./enrolment";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Cyber Security normal learner enrolment", () => {
  it("guest join panel asks the learner to sign in", () => {
    render(
      <JoinClassPanel
        platformState="signed-out"
        platform={{}}
        onSignIn={vi.fn()}
      />
    );
    expect(screen.getByText(SIGN_IN_TO_CONTINUE)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeTruthy();
  });

  it("guest requires sign-in before marking", () => {
    expect(needsJoinClass("signed-out")).toBe(false);
    expect(canMarkActivity("signed-out")).toBe(false);
    const error = markBlockedError("signed-out") as Error & { code?: string; learnerMessage?: string };
    expect(error?.code).toBe("AUTH_REQUIRED");
    expect(error?.learnerMessage).toBe(SIGN_IN_TO_CONTINUE);
  });

  it("authenticated learner with no group sees join-class prompt state", () => {
    expect(needsJoinClass("onboarding-required")).toBe(true);
    expect(needsJoinClass("no-enrolment")).toBe(true);
    expect(canMarkActivity("onboarding-required")).toBe(false);
    const error = markBlockedError("no-enrolment") as Error & { code?: string; learnerMessage?: string };
    expect(error?.code).toBe("JOIN_CLASS_REQUIRED");
    expect(error?.learnerMessage).toBe(JOIN_CLASS_MESSAGE);
  });

  it("enrolled Cyber Security learner does not see join prompt and can mark", () => {
    const enrolments = [{ status: "active", groupCode: EXPECTED_GROUP_CODE }];
    expect(needsJoinClass("ready", { enrolments })).toBe(false);
    expect(canMarkActivity("ready", { enrolments })).toBe(true);
    expect(markBlockedError("ready", { enrolments })).toBeNull();
  });

  it("other-course ready state still requires Cyber Security class join", () => {
    const enrolments = [{ status: "active", groupCode: "TLEVEL-DSD-Y2" }];
    expect(needsJoinClass("ready", { enrolments })).toBe(true);
    expect(canMarkActivity("ready", { enrolments })).toBe(false);
    const error = markBlockedError("ready", { enrolments }) as Error & { code?: string };
    expect(error?.code).toBe("JOIN_CLASS_REQUIRED");
  });

  it("L2E-only ready state does not count as Cyber Security access", () => {
    const enrolments = [{ status: "active", groupCode: "L2E-DELIVERY-A" }];
    expect(canMarkActivity("ready", { enrolments })).toBe(false);
    expect(needsJoinClass("ready", { enrolments })).toBe(true);
  });

  it("does not call mark_formative_response before valid enrolment", async () => {
    const markBlock = vi.fn(async (_input?: Record<string, unknown>) => ({ complete: true }));
    const platform = withEnrolmentGuardedMarking(
      {
        marking: { markBlock },
        learner: { getState: () => ({ context: { enrolments: [] } }) }
      },
      () => "onboarding-required"
    );
    await expect(platform.marking.markBlock({ activityKey: "week2-malware-symptoms" })).rejects.toMatchObject({
      code: "JOIN_CLASS_REQUIRED",
      learnerMessage: JOIN_CLASS_MESSAGE
    });
    expect(markBlock).not.toHaveBeenCalled();
  });

  it("blocks mark when platform is ready but only other-course enrolments exist", async () => {
    const markBlock = vi.fn(async (_input?: Record<string, unknown>) => ({ complete: true }));
    const platform = withEnrolmentGuardedMarking(
      {
        marking: { markBlock },
        learner: {
          getState: () => ({
            context: { enrolments: [{ status: "active", groupCode: "TLEVEL-DSD-Y2" }] }
          })
        }
      },
      () => "ready"
    );
    await expect(platform.marking.markBlock({ activityKey: "week2-malware-symptoms" })).rejects.toMatchObject({
      code: "JOIN_CLASS_REQUIRED"
    });
    expect(markBlock).not.toHaveBeenCalled();
  });

  it("enrolled learner can immediately mark through the guarded platform", async () => {
    const markBlock = vi.fn(async (_input?: Record<string, unknown>) => ({ complete: true, correct: true }));
    const platform = withEnrolmentGuardedMarking(
      {
        marking: { markBlock },
        learner: {
          getState: () => ({
            context: { enrolments: [{ status: "active", groupCode: EXPECTED_GROUP_CODE }] }
          })
        }
      },
      () => "ready"
    );
    await expect(platform.marking.markBlock({ activityKey: "week2-malware-symptoms" })).resolves.toMatchObject({
      complete: true
    });
    expect(markBlock).toHaveBeenCalledTimes(1);
  });

  it("does not create a second mark call for a single check", async () => {
    const markBlock = vi.fn(async (_input?: Record<string, unknown>) => ({ complete: true, correct: false }));
    const platform = withEnrolmentGuardedMarking(
      {
        marking: { markBlock },
        learner: {
          getState: () => ({
            context: { enrolments: [{ status: "active", groupCode: EXPECTED_GROUP_CODE }] }
          })
        }
      },
      () => "ready"
    );
    await platform.marking.markBlock({ activityKey: "week5-impact-classification" });
    expect(markBlock).toHaveBeenCalledTimes(1);
  });

  it("correct registration key creates enrolment via onboarding.complete and refreshes context", async () => {
    const complete = vi.fn(async () => ({ group_code: EXPECTED_GROUP_CODE, idempotent: false }));
    const onJoined = vi.fn();
    const platform = {
      onboarding: {
        getPending: () => ({
          firstName: "Normal",
          surname: "Learner",
          studentNumber: "STU-1"
        }),
        getRegistrationOptions: async () => [{
          registrationKey: EXPECTED_REGISTRATION_KEY,
          yearGroup: "Year 1",
          groupName: "Cyber Security Synthetic Test Group A",
          groupCode: EXPECTED_GROUP_CODE,
          courseTitle: "OCR Level 3 IT"
        }, {
          registrationKey: "tlevel-dsd-y2",
          yearGroup: "Year 2",
          groupName: "T Level Digital Software Development - Year 2",
          groupCode: "TLEVEL-DSD-Y2",
          courseTitle: "T Level"
        }],
        complete
      },
      learner: {
        getState: () => ({ status: "onboarding-required", context: null }),
        refresh: vi.fn(async () => undefined)
      }
    };

    render(
      <JoinClassPanel
        platformState="onboarding-required"
        platform={platform}
        onJoined={onJoined}
      />
    );

    expect(screen.getByText(JOIN_CLASS_PROMPT)).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Cyber Security Synthetic Test Group A/i })).toBeTruthy();
    });
    expect(screen.queryByRole("option", { name: /T Level/i })).toBeNull();

    fireEvent.change(screen.getByLabelText(/Class registration key/i), {
      target: { value: EXPECTED_REGISTRATION_KEY }
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Join class" }));
    });

    await waitFor(() => {
      expect(complete).toHaveBeenCalledTimes(1);
    });
    expect(complete).toHaveBeenCalledWith(
      { firstName: "Normal", surname: "Learner", studentNumber: "STU-1" },
      EXPECTED_REGISTRATION_KEY
    );
    expect(onJoined).toHaveBeenCalledTimes(1);
  });

  it("existing unenrolled account can join without recreating the account", async () => {
    const complete = vi.fn(async () => ({ group_code: EXPECTED_GROUP_CODE, idempotent: true }));
    const platform = {
      onboarding: {
        getPending: () => null,
        getRegistrationOptions: async () => [{
          registrationKey: EXPECTED_REGISTRATION_KEY,
          yearGroup: "Year 1",
          groupCode: EXPECTED_GROUP_CODE,
          groupName: "Cyber Security Synthetic Test Group A"
        }],
        complete
      },
      learner: {
        getState: () => ({
          status: "authenticated",
          context: {
            firstName: "Existing",
            surname: "Student",
            studentNumber: "STU-OLD",
            enrolments: [{ status: "active", groupCode: "TLEVEL-DSD-Y2" }]
          }
        })
      }
    };

    render(
      <JoinClassPanel
        platformState="ready"
        platform={platform}
      />
    );

    fireEvent.change(screen.getByLabelText(/Class registration key/i), {
      target: { value: EXPECTED_REGISTRATION_KEY }
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Join class" }));
    });
    await waitFor(() => expect(complete).toHaveBeenCalledTimes(1));
    expect(complete).toHaveBeenCalledWith(
      { firstName: "Existing", surname: "Student", studentNumber: "STU-OLD" },
      EXPECTED_REGISTRATION_KEY
    );
  });

  it("enrolled learner sees joined status instead of join prompt", () => {
    render(
      <JoinClassPanel
        platformState="ready"
        platform={{
          learner: {
            getState: () => ({
              status: "authenticated",
              context: {
                yearGroup: "Year 1",
                groupName: "Cyber Security Synthetic Test Group A",
                groupCode: EXPECTED_GROUP_CODE,
                enrolments: [{
                  status: "active",
                  groupCode: EXPECTED_GROUP_CODE,
                  groupName: "Cyber Security Synthetic Test Group A",
                  yearGroup: "Year 1"
                }]
              }
            })
          }
        }}
      />
    );
    expect(screen.getByText(/You are joined to/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Join class" })).toBeNull();
  });

  it("does not treat exclusive QA or Unit 14 groups as Cyber delivery options", () => {
    expect(isCyberRegistrationOption({
      registrationKey: "cyber-test-qa-reg",
      groupCode: "CYBER-TEST-QA"
    })).toBe(false);
    expect(isCyberRegistrationOption({
      registrationKey: "unit14-year-1-test",
      groupCode: "UNIT14-TEST-A"
    })).toBe(false);
    expect(isCyberRegistrationOption({
      registrationKey: EXPECTED_REGISTRATION_KEY,
      groupCode: EXPECTED_GROUP_CODE
    })).toBe(true);
  });
});
