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

  export interface LearnerState {
    status: string;
    context?: {
      firstName?: string;
      fullName?: string;
      displayName?: string;
      yearGroup?: string;
      academicYear?: string;
      contactEmail?: string;
    } | null;
  }

  export interface PlatformFacade {
    config: { hubName: string; accountPath: string };
    theme: ThemeService;
    auth: { signOut: () => Promise<void> };
    learner: {
      subscribe: (listener: (state: LearnerState) => void) => () => void;
    };
    state: {
      getState?: () => { status: string };
      subscribe: (listener: (snapshot: { status: string }) => void) => () => void;
    };
    onboarding: unknown;
    progress?: { getProgress?: () => Promise<unknown> };
    assignments?: {
      getAssignments?: () => Promise<unknown>;
      getHubAssignments?: (hubCode: string) => Promise<unknown>;
    };
    assignment?: unknown;
    enrolments?: unknown;
    enrolment?: unknown;
    features?: unknown;
    flags?: unknown;
    initialise: () => Promise<unknown>;
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
  }): { element: HTMLElement; open: (trigger?: EventTarget | null) => void; destroy?: () => void };
}

declare module "*.js";
declare module "@learning-platform/content" {
  export function validatePackage(pkg: unknown): { valid: boolean; issues?: unknown[] };
  export function validateLearnerSafePackage(pkg: unknown): { valid: boolean; issues?: unknown[] };
}
