/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AccountPage } from "./pages/AccountPage";

afterEach(() => {
  cleanup();
});

describe("Unit 3 canonical account page", () => {
  it("opens Core sign-in and create-account without a hub-owned signup form", () => {
    const onSignIn = vi.fn();
    const onCreateAccount = vi.fn();
    render(<AccountPage onSignIn={onSignIn} onCreateAccount={onCreateAccount} />);

    expect(screen.getByRole("heading", { name: "Learner account" })).toBeTruthy();
    expect(screen.queryByLabelText(/First name/i)).toBeNull();
    expect(screen.queryByLabelText(/College email address/i)).toBeNull();
    expect(screen.queryByText(/Step 1 of 2/i)).toBeNull();
    expect(screen.getByText(/Joining your Cyber Security class is a separate step/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(onSignIn).toHaveBeenCalledTimes(1);
    expect(onCreateAccount).toHaveBeenCalledTimes(1);
  });
});
