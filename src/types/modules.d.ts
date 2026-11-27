declare module "@learning-platform/core/curriculum-runtime" {
  export type RuntimeWeekRecord = {
    id: string;
    teachingWeek: number;
    status: string;
    available: boolean;
    title: string;
  };

  export function isWeekAvailable(status?: string | null): boolean;
  export function isSessionAvailable(status?: string | null): boolean;
  export function isSessionAccessible(weekStatus?: string | null, sessionStatus?: string | null): boolean;
  export const SESSION_NOT_RELEASED_COPY: string;
  export function overlayLiveWeekMetadata<T extends Record<string, unknown>>(
    base: T | null | undefined,
    live: T | null | undefined
  ): T | null | undefined;
  export function weeksFromPublication<T extends Record<string, unknown>>(
    basePackage: T | null | undefined,
    livePackage?: T | null
  ): RuntimeWeekRecord[];
}

declare module "@learning-platform/core" {
  export type ThemePreference = "light" | "dark" | "system";

  export interface ThemeService {
    modes: readonly ThemePreference[];
    getPreference(): ThemePreference;
    getResolvedTheme(): "light" | "dark";
    setPreference(mode: ThemePreference): unknown;
    subscribe(listener: (state: { preference: ThemePreference; resolvedTheme: "light" | "dark" }) => void): () => void;
    apply(): unknown;
    destroy(): void;
  }

  export interface AuthState {
    status: string;
    session?: {
      user?: { id?: string } | null;
      access_token?: string;
    } | null;
  }

  export interface LearnerState {
    status: string;
    context?: {
      firstName?: string;
      fullName?: string;
      displayName?: string;
      yearGroup?: string;
      academicYear?: string;
      contactEmail?: string;
      studentNumber?: string;
      enrolments?: Array<Record<string, unknown>>;
    } | null;
  }

  export interface PlatformAuth {
    signOut: () => Promise<void>;
    getState?: () => AuthState;
    subscribe?: (listener: (state: AuthState) => void) => () => void;
    isSignedIn?: () => boolean;
  }

  export interface PlatformLearner {
    subscribe: (listener: (state: LearnerState) => void) => () => void;
    getState?: () => LearnerState;
    refresh?: () => Promise<unknown>;
  }

  export interface PlatformSnapshot {
    status: string;
  }

  export interface PlatformFacade {
    config: { hubName: string; accountPath: string };
    theme: ThemeService;
    auth: PlatformAuth;
    learner: PlatformLearner;
    state: {
      getState?: () => PlatformSnapshot;
      subscribe: (listener: (snapshot: PlatformSnapshot) => void) => () => void;
    };
    onboarding: unknown;
    progress?: {
      getProgress?: () => Promise<unknown>;
      getActivityState?: (activityKey: string, activityVersion: string) => Promise<unknown>;
      createStore?: (options?: unknown) => unknown;
    };
    assignments?: {
      getAssignments?: () => Promise<unknown>;
      getHubAssignments?: (hubCode: string) => Promise<unknown>;
    };
    assignment?: unknown;
    enrolments?: unknown;
    enrolment?: unknown;
    features?: unknown;
    flags?: unknown;
    initialise: () => Promise<PlatformSnapshot | unknown>;
    destroy: () => void;
    curriculum: {
      loadLatest: () => Promise<{
        source?: string;
        package?: unknown;
        state?: { state?: string };
        publication?: unknown;
      }>;
      renderStatus?: (state: unknown) => string;
    };
  }

  export function createPlatform(options: Record<string, unknown>, dependencies?: Record<string, unknown>): PlatformFacade;
  export function resolveActivityVersion(activity?: { version?: string; activityVersion?: string } | null): string;
  export function setAuthoredHtml(target: Element | null | undefined, html: string): Element | null | undefined;
  export const evidence: {
    singleChoice: (key: string, optionId: string) => unknown;
    written: (key: string, text: string) => unknown;
    reflection: (key: string, text: string) => unknown;
    classification: (key: string, categoryId: string, itemId?: string | null) => unknown;
    ordering: (key: string, itemIds: string[]) => unknown;
    matching: (key: string, pairs: Array<{ left: string; right: string }>) => unknown;
  };
  export function createAccountDialog(options: {
    authService: unknown;
    learnerContext: unknown;
    onboardingService: unknown;
  }): {
    element: HTMLElement;
    open: (trigger?: EventTarget | null, options?: { mode?: "sign-in" | "register" }) => void;
    showOnboarding?: () => void;
    destroy?: () => void;
  };
}

declare module "*.js";
declare module "@learning-platform/content" {
  export function validatePackage(pkg: unknown): { valid: boolean; issues?: unknown[] };
  export function validateLearnerSafePackage(pkg: unknown): { valid: boolean; issues?: unknown[] };
}

declare module "@learning-platform/core/advanced" {
  export type HubSupabaseClient = {
    auth: {
      getSession: () => Promise<{ data: { session: { access_token?: string } | null } }>;
    };
    schema: (name: string) => {
      rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data?: unknown; error?: { message?: string } | null }>;
      from?: (table: string) => {
        select: (columns: string) => {
          eq: (column: string, value: string) => Promise<{ data?: unknown; error?: { message?: string } | null }>;
        };
      };
    };
  };

  export function createSupabaseClient(
    config: { projectUrl: string; publishableKey: string; hubCode: string },
    dependencies?: { createClient?: unknown; client?: unknown; authStorage?: unknown }
  ): HubSupabaseClient;

  export function createAuthStorageKey(projectUrl: string, hubCode: string): string;

  export type FormativeMarkingContractInput = {
    activityKey: string;
    activityVersion: string;
    responses: ReadonlyArray<{
      question_id: string;
      response_type: string;
      response_payload: unknown;
    }>;
  };

  export function createFormativeMarkingService(options: {
    auth?: { isSignedIn?: () => boolean };
    api?: {
      markFormativeResponse?: (payload: Record<string, unknown>) => Promise<unknown>;
    };
    resolveFormativeContract?: (
      input: FormativeMarkingContractInput
    ) => unknown | Promise<unknown>;
  }): {
    markBlock: (input: {
      activityKey: string;
      activityVersion: string;
      block: Record<string, unknown>;
      responses?: unknown;
      content?: unknown;
    }) => Promise<Record<string, unknown>>;
  };
}
