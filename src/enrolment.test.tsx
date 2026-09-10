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
    expect(screen.getByRole("button", { name: "Open Account" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Open Account" })).toBeNull();
  });

  it("guest Open Account opens the Core account flow instead of a second signup page", () => {
    const onSignIn = vi.fn();
    render(
      <JoinClassPanel
        platformState="signed-out"
        platform={{}}
        onSignIn={onSignIn}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Open Account" }));
    expect(onSignIn).toHaveBeenCalledTimes(1);
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

  it("inactive Cyber enrolment cannot bypass JoinClass", () => {
    const enrolments = [{ status: "withdrawn", groupCode: EXPECTED_GROUP_CODE }];
    expect(needsJoinClass("no-enrolment", { enrolments })).toBe(true);
    expect(canMarkActivity("no-enrolment", { enrolments })).toBe(false);
    expect(needsJoinClass("ready", { enrolments })).toBe(true);
    expect(canMarkActivity("ready", { enrolments })).toBe(false);
    const error = markBlockedError("no-enrolment", { enrolments }) as Error & { code?: string };
    expect(error?.code).toBe("JOIN_CLASS_REQUIRED");
  });

  it("exclusive Unit 3 QA enrolment can mark without joining CYBER-TEST-A", () => {
    const enrolments = [{ status: "active", groupCode: "CYBER-TEST-QA" }];
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

  it("exclusive Unit 3 QA learner can mark through the guarded platform", async () => {
    const markBlock = vi.fn(async (_input?: Record<string, unknown>) => ({ complete: true, correct: false }));
    const platform = withEnrolmentGuardedMarking(
      {
        marking: { markBlock },
        learner: {
          getState: () => ({
            context: { enrolments: [{ status: "active", groupCode: "CYBER-TEST-QA" }] }
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

  it("correct class key joins through onboarding.joinClass without a group picker", async () => {
    const complete = vi.fn(async () => ({ student_number: "STU-1" }));
    const joinClass = vi.fn(async () => ({ groupCode: EXPECTED_GROUP_CODE, status: "enrolled_created" }));
    const onJoined = vi.fn();
    const platform = {
      onboarding: {
        getPending: () => ({
          firstName: "Normal",
          surname: "Learner",
          studentNumber: "STU-1"
        }),
        complete,
        joinClass
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
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(screen.queryByText(/Or choose an open class/i)).toBeNull();

    fireEvent.change(screen.getByLabelText(/Class registration key/i), {
      target: { value: EXPECTED_REGISTRATION_KEY }
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Join class" }));
    });

    await waitFor(() => {
      expect(joinClass).toHaveBeenCalledTimes(1);
    });
    expect(complete).toHaveBeenCalledWith({
      firstName: "Normal",
      surname: "Learner",
      studentNumber: "STU-1"
    });
    expect(joinClass).toHaveBeenCalledWith(EXPECTED_REGISTRATION_KEY);
    expect(onJoined).toHaveBeenCalledTimes(1);
  });

  it("existing unenrolled account can join without recreating the account", async () => {
    const complete = vi.fn(async () => ({ student_number: "STU-OLD" }));
    const joinClass = vi.fn(async () => ({ groupCode: EXPECTED_GROUP_CODE, status: "enrolled" }));
    const platform = {
      onboarding: {
        getPending: () => null,
        complete,
        joinClass
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
        platformState="no-enrolment"
        platform={platform}
      />
    );

    expect(screen.queryByLabelText(/First name/i)).toBeNull();
    expect(screen.queryByLabelText(/^Surname$/i)).toBeNull();
    expect(screen.queryByLabelText(/Student ID/i)).toBeNull();
    expect(screen.queryByRole("combobox")).toBeNull();
    fireEvent.change(screen.getByLabelText(/Class registration key/i), {
      target: { value: EXPECTED_REGISTRATION_KEY }
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Join class" }));
    });
    await waitFor(() => expect(joinClass).toHaveBeenCalledTimes(1));
    expect(complete).not.toHaveBeenCalled();
    expect(joinClass).toHaveBeenCalledWith(EXPECTED_REGISTRATION_KEY);
  });

  it("returning learner with empty local profile fields still uses class-key only", async () => {
    const complete = vi.fn(async () => ({ student_number: "STU-OLD" }));
    const joinClass = vi.fn(async () => ({ groupCode: EXPECTED_GROUP_CODE, status: "enrolled_created" }));
    const platform = {
      onboarding: {
        getPending: () => null,
        complete,
        joinClass
      },
      learner: {
        getState: () => ({
          status: "authenticated",
          context: {
            firstName: "",
            surname: "",
            studentNumber: "STU-OLD",
            enrolments: []
          }
        })
      }
    };

    render(
      <JoinClassPanel
        platformState="no-enrolment"
        platform={platform}
      />
    );

    expect(screen.queryByLabelText(/First name/i)).toBeNull();
    expect(screen.getByLabelText(/Class registration key/i)).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/Class registration key/i), {
      target: { value: EXPECTED_REGISTRATION_KEY }
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Join class" }));
    });
    await waitFor(() => expect(joinClass).toHaveBeenCalledWith(EXPECTED_REGISTRATION_KEY));
    expect(complete).not.toHaveBeenCalled();
  });

  it("wrong class key is denied and does not invent a second Auth identity", async () => {
    const complete = vi.fn(async () => ({ student_number: "STU-1" }));
    const joinClass = vi.fn(async () => {
      throw Object.assign(new Error("denied"), {
        learnerMessage: "Could not join your class. Check the registration key and try again."
      });
    });
    const platform = {
      onboarding: {
        getPending: () => ({
          firstName: "Normal",
          surname: "Learner",
          studentNumber: "STU-1"
        }),
        complete,
        joinClass
      },
      learner: {
        getState: () => ({ status: "onboarding-required", context: null })
      }
    };

    render(
      <JoinClassPanel
        platformState="onboarding-required"
        platform={platform}
      />
    );

    fireEvent.change(screen.getByLabelText(/Class registration key/i), {
      target: { value: "not-the-class-key" }
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Join class" }));
    });
    await waitFor(() => expect(joinClass).toHaveBeenCalledWith("not-the-class-key"));
    expect(screen.getByText(/Could not join your class/i)).toBeTruthy();
    expect(screen.queryByLabelText(/College email address/i)).toBeNull();
    expect(screen.queryByLabelText(/^Password$/i)).toBeNull();
  });

  it("surfaces Student ID already-linked instead of the generic platform message", async () => {
    const complete = vi.fn(async () => {
      throw Object.assign(new Error("conflict"), {
        code: "23505",
        learnerMessage: "The learner service could not complete that request. Try again shortly.",
        cause: { code: "23505", message: "STUDENT_NUMBER_ALREADY_LINKED" }
      });
    });
    const joinClass = vi.fn(async () => ({ groupCode: EXPECTED_GROUP_CODE, status: "enrolled" }));
    const platform = {
      onboarding: {
        getPending: () => ({
          firstName: "Other",
          surname: "Learner",
          studentNumber: "123456"
        }),
        complete,
        joinClass
      },
      learner: {
        getState: () => ({ status: "onboarding-required", context: null })
      }
    };

    render(
      <JoinClassPanel
        platformState="onboarding-required"
        platform={platform}
      />
    );

    fireEvent.change(screen.getByLabelText(/Class registration key/i), {
      target: { value: EXPECTED_REGISTRATION_KEY }
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Join class" }));
    });

    await waitFor(() => {
      expect(screen.getByText(/already linked to another learning account/i)).toBeTruthy();
    });
    expect(complete).toHaveBeenCalledTimes(1);
    expect(joinClass).not.toHaveBeenCalled();
  });

  it("shows Switch account after Student ID already-linked when a switch handler is provided", async () => {
    const onSwitchAccount = vi.fn();
    const complete = vi.fn(async () => {
      throw Object.assign(new Error("conflict"), {
        cause: { message: "STUDENT_NUMBER_ALREADY_LINKED" }
      });
    });
    render(
      <JoinClassPanel
        platformState="onboarding-required"
        platform={{
          onboarding: {
            getPending: () => ({
              firstName: "Other",
              surname: "Learner",
              studentNumber: "123456"
            }),
            complete,
            joinClass: vi.fn()
          },
          learner: {
            getState: () => ({ status: "onboarding-required", context: null })
          }
        }}
        onSignIn={vi.fn()}
        onSwitchAccount={onSwitchAccount}
      />
    );

    fireEvent.change(screen.getByLabelText(/Class registration key/i), {
      target: { value: EXPECTED_REGISTRATION_KEY }
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Join class" }));
    });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Switch account" })).toBeTruthy();
    });
    expect(screen.queryByRole("button", { name: "Account" })).toBeNull();
  });

  it("does not re-run complete for an already linked learner who only needs JoinClass", async () => {
    const complete = vi.fn(async () => ({ student_number: "123456" }));
    const joinClass = vi.fn(async () => ({ groupCode: EXPECTED_GROUP_CODE, status: "enrolled" }));
    const platform = {
      onboarding: {
        getPending: () => null,
        complete,
        joinClass
      },
      learner: {
        getState: () => ({
          status: "authenticated",
          context: {
            firstName: "Linked",
            surname: "Learner",
            studentNumber: "123456",
            enrolments: [{ status: "active", groupCode: "TLEVEL-DSD-Y2" }]
          }
        })
      }
    };

    render(
      <JoinClassPanel
        platformState="no-enrolment"
        platform={platform}
      />
    );

    fireEvent.change(screen.getByLabelText(/Class registration key/i), {
      target: { value: EXPECTED_REGISTRATION_KEY }
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Join class" }));
    });
    await waitFor(() => expect(joinClass).toHaveBeenCalledTimes(1));
    expect(complete).not.toHaveBeenCalled();
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

  it("exclusive Unit 3 QA enrolment shows joined status instead of join prompt", () => {
    render(
      <JoinClassPanel
        platformState="ready"
        platform={{
          learner: {
            getState: () => ({
              status: "authenticated",
              context: {
                yearGroup: "Year 1",
                groupName: "Cyber Security Synthetic QA Group",
                groupCode: "CYBER-TEST-QA",
                enrolments: [{
                  status: "active",
                  groupCode: "CYBER-TEST-QA",
                  groupName: "Cyber Security Synthetic QA Group",
                  yearGroup: "Year 1"
                }]
              }
            })
          }
        }}
      />
    );
    expect(screen.getByText(/You are joined to/i)).toBeTruthy();
    expect(screen.getByText(/Cyber Security Synthetic QA Group/)).toBeTruthy();
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
