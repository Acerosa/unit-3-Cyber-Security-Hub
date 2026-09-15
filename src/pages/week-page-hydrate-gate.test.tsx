import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import pkg from "../../content/unit-3-cyber-security/package.json";
import { configureBundledPackage } from "../curriculum/runtime-weeks";
import type { PageContext } from "../page-context";
import { WeekPage } from "./WeekPage";

vi.mock("../adapters/load-hub-adapters", () => ({
  loadHubAdapters: async () => {},
  loadPageScripts: async () => {}
}));

vi.mock("../catalogue/activity-draft", async () => {
  const actual = await vi.importActual<typeof import("../catalogue/activity-draft")>("../catalogue/activity-draft");
  return {
    ...actual,
    createCatalogueDraftStore: vi.fn()
  };
});

import { createCatalogueDraftStore } from "../catalogue/activity-draft";

beforeAll(() => {
  configureBundledPackage(pkg as import("../curriculum/from-package").ContentPackage);
});

afterEach(() => {
  delete window.__lpPackage;
  delete window.__lpLivePackage;
  cleanup();
  vi.mocked(createCatalogueDraftStore).mockReset();
});

describe("WeekPage remote hydrate gate", () => {
  const context = {
    root: ".",
    view: "week",
    week: 1,
    section: "week-1",
    activity: "",
    activityId: ""
  } as PageContext;

  it("does not mass-hydrate get_activity_state while onboarding / join is required", async () => {
    window.__lpPackage = pkg;
    const hydrate = vi.fn(async () => ({ responses: {}, checked: {} }));
    vi.mocked(createCatalogueDraftStore).mockReturnValue({
      hydrate,
      save: vi.fn(),
      subscribe: () => () => {}
    } as never);

    render(
      <WeekPage
        context={context}
        contentReady
        adaptersReady
        platform={{ auth: { isSignedIn: () => true }, progress: { createStore: vi.fn() } }}
        platformState="onboarding-required"
      />
    );

    await waitFor(() => {
      expect(createCatalogueDraftStore).not.toHaveBeenCalled();
      expect(hydrate).not.toHaveBeenCalled();
    });
  });

  it("hydrates when the learner is enrolled and ready", async () => {
    window.__lpPackage = pkg;
    const hydrate = vi.fn(async () => ({ responses: {}, checked: {} }));
    vi.mocked(createCatalogueDraftStore).mockReturnValue({
      hydrate,
      save: vi.fn(),
      subscribe: () => () => {}
    } as never);

    render(
      <WeekPage
        context={context}
        contentReady
        adaptersReady
        platform={{ auth: { isSignedIn: () => true }, progress: { createStore: vi.fn() } }}
        platformState="ready"
      />
    );

    await waitFor(() => {
      expect(createCatalogueDraftStore).toHaveBeenCalled();
      expect(hydrate).toHaveBeenCalled();
    });
  });
});
