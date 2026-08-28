import { createPlatform } from "@learning-platform/core";
import { createClient } from "@supabase/supabase-js";
import { validatePackage } from "@learning-platform/content";
import { APP_CONFIG } from "./config";
import { createSitePath } from "./paths";
import { configureBundledPackage } from "./curriculum/runtime-weeks";

const supabaseConfig = () => window.SUPABASE_CONFIG;

let bundledReady: Promise<import("./curriculum/from-package").ContentPackage> | null = null;

export function ensureBundledConfigured() {
  if (!bundledReady) {
    bundledReady = import("../content/unit-3-cyber-security/package.json").then((mod) => {
      configureBundledPackage(mod.default as import("./curriculum/from-package").ContentPackage);
      return mod.default as import("./curriculum/from-package").ContentPackage;
    });
  }
  return bundledReady;
}

export function createHubPlatform(root: string, createPlatformFn = createPlatform) {
  ensureBundledConfigured();
  const config = supabaseConfig();
  const client = createClient(config.projectUrl, config.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  const platform = createPlatformFn({
    hubCode: APP_CONFIG.hubId,
    courseKey: APP_CONFIG.courseKey,
    hubName: APP_CONFIG.siteName,
    platformVersion: APP_CONFIG.coreVersion,
    accountPath: createSitePath(root, "account/"),
    supabase: {
      projectUrl: config.projectUrl,
      publishableKey: config.publishableKey
    },
    navigation: APP_CONFIG.navigation.map((item) => ({
      ...item,
      path: item.id === "home" ? createSitePath(root) : createSitePath(root, item.path)
    })),
    navigationMode: "as-supplied",
    features: APP_CONFIG.features,
    theme: APP_CONFIG.theme
  }, {
    supabaseClient: client,
    localStorage: typeof window !== "undefined" ? window.localStorage : undefined,
    validatePackage,
    loadBundled: () => ensureBundledConfigured()
  });

  return Object.freeze({
    ...platform,
    client,
    assignment: platform.assignments || platform.assignment,
    enrolment: platform.enrolments || platform.enrolment,
    flags: platform.features || platform.flags
  });
}

export type HubPlatform = ReturnType<typeof createHubPlatform>;
