import inventory from "../test/fixtures/route-inventory.json";
import { APP_CONFIG } from "./config";

declare global {
  interface Window {
    APP_CONFIG: typeof APP_CONFIG;
    SUPABASE_CONFIG: {
      projectUrl: string;
      publishableKey: string;
      enabledActivities: string[];
      backendMode: string;
    };
    LearningPlatform?: { platform: unknown; coreVersion: string };
    Unit3Week1Progress?: WeekProgress;
    Unit3Week2Progress?: WeekProgress;
    Unit3Week3Progress?: WeekProgress;
    Unit3Week4Progress?: WeekProgress;
    Unit3Week5Progress?: WeekProgress;
    Unit3Week6Progress?: WeekProgress;
    Unit3Week7Progress?: WeekProgress;
  }
}

export type WeekProgress = {
  ACTIVITY_CATALOG?: Array<{ activityId: string }>;
  getCompletionSummary?: () => { completed: number; total: number; inProgress?: number; notStarted?: number };
};

window.APP_CONFIG = APP_CONFIG;

export const SHARED_ADAPTERS = inventory.sharedAdapters;
