import { createPlatform } from "@learning-platform/core";
import { afterEach, describe, expect, it } from "vitest";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem(key: string) { return values.has(key) ? values.get(key)! : null; },
    setItem(key: string, value: string) { values.set(key, String(value)); },
    removeItem(key: string) { values.delete(key); }
  };
}

function fakeClient({
  session = { access_token: "managed", user: { id: "auth-user" } },
  enrolments = [{ status: "active", group_code: "CYBER-TEST-A", year_group: "Year 1" }],
  assignments = [
    { activity_key: "week2-malware-symptoms" },
    { activity_key: "foundations-requirements-classification" }
  ],
  access = { status: "enrolled", group_code: "CYBER-TEST-A", year_group: "Year 1" },
  hubAssignments = [{ activity_key: "week2-malware-symptoms" }]
}: {
  session?: { access_token: string; user: { id: string } } | null;
  enrolments?: Array<Record<string, string>>;
  assignments?: Array<Record<string, string>>;
  access?: Record<string, unknown>;
  hubAssignments?: Array<Record<string, string>>;
} = {}) {
  const calls: Array<{ type: string; name?: string; payload?: unknown }> = [];
  return {
    calls,
    auth: {
      onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
      getSession() { return Promise.resolve({ data: { session }, error: null }); },
      signInWithPassword() { return Promise.resolve({ data: { session }, error: null }); },
      signUp() { return Promise.resolve({ data: { session: null, user: { id: "auth-user" } }, error: null }); },
      signOut() { return Promise.resolve({ error: null }); }
    },
    schema() {
      return {
        from(view: string) {
          calls.push({ type: "view", name: view });
          const data = view === "my_profile"
            ? [{ student_number: "000123", first_name: "Ada", surname: "Lovelace" }]
            : view === "my_enrolments"
              ? enrolments
              : view === "my_assignments"
                ? assignments
                : [];
          return {
            select() { return this; },
            eq() { return this; },
            order() { return this; },
            then(resolve: (value: unknown) => unknown) {
              return Promise.resolve({ data, error: null }).then(resolve);
            }
          };
        },
        rpc(name: string, payload: unknown) {
          calls.push({ type: "rpc", name, payload });
          const data = name === "resolve_learner_hub_access"
            ? [access]
            : name === "my_hub_assignments"
              ? hubAssignments
              : [];
          return Promise.resolve({ data, error: null });
        }
      };
    }
  };
}

describe("Unit 3 hub access", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("loads only Cyber hub assignments when the learner also has a T Level enrolment", async () => {
    const client = fakeClient({
      enrolments: [
        { status: "active", group_code: "CYBER-TEST-A", year_group: "Year 1" },
        { status: "active", group_code: "TLEVEL-DSD-Y2", year_group: "Year 2" }
      ]
    });
    const platform = createPlatform({
      hubCode: "unit-3-cyber-security",
      hubName: "Unit 3 Cyber Security Hub",
      courseKey: "ocr-level-3-it"
    }, {
      supabaseClient: client,
      sessionStorage: memoryStorage(),
      localStorage: memoryStorage(),
      document: null,
      window: null
    });
    await platform.initialise();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(platform.state.getState?.().status).toBe("ready");
    expect(await platform.assignments?.getHubAssignments?.("unit-3-cyber-security")).toEqual([
      { activity_key: "week2-malware-symptoms" }
    ]);
    expect(client.calls.find((call) => call.type === "rpc" && call.name === "resolve_learner_hub_access")?.payload).toEqual({
      p_hub_code: "unit-3-cyber-security",
      p_course_key: "ocr-level-3-it"
    });
    expect(client.calls.some((call) => call.type === "rpc" && call.name === "resolve_learner_hub_access" && JSON.stringify(call.payload).includes("group"))).toBe(false);
    platform.destroy();
  });

  it("does not treat a T Level enrolment as Cyber authority when the resolver denies Cyber", async () => {
    const client = fakeClient({
      enrolments: [{ status: "active", group_code: "TLEVEL-DSD-Y2", year_group: "Year 2" }],
      access: { status: "no_enrolment" },
      hubAssignments: [{ activity_key: "foundations-requirements-classification" }]
    });
    const platform = createPlatform({
      hubCode: "unit-3-cyber-security",
      hubName: "Unit 3 Cyber Security Hub",
      courseKey: "ocr-level-3-it"
    }, {
      supabaseClient: client,
      sessionStorage: memoryStorage(),
      localStorage: memoryStorage(),
      document: null,
      window: null
    });
    await platform.initialise();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(platform.state.getState?.().status).toBe("no-enrolment");
    expect(client.calls.some((call) => call.type === "rpc" && call.name === "my_hub_assignments")).toBe(false);
    platform.destroy();
  });
});
