import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_SCRIPT = [
  "theme-bootstrap.js",
  "js/config/app-config.js",
  "js/config/supabase-config.js",
  "cdn.jsdelivr.net",
  "learning-platform-core.iife.js",
  "js/core/platform.js",
  "js/core/supabase-client.js",
  "js/core/supabase-auth.js",
  "js/core/supabase-learning-api.js",
  "js/core/supabase-onboarding.js",
  "js/navigation.js",
  "js/supabase-auth-widget.js"
];

const SHARED_ADAPTERS = [
  "js/core/supabase-client.js",
  "js/core/supabase-auth.js",
  "js/core/supabase-learning-api.js",
  "js/core/supabase-onboarding.js",
  "js/core/backend-mode.js",
  "js/core/activity-key-map.js",
  "js/core/question-key-aliases.js",
  "js/core/supabase-submission-adapter.js",
  "js/core/supabase-evidence.js",
  "js/core/unit3-supabase-submit-runner.js",
  "js/core/week1-final-submit.js",
  "js/activity-utils.js",
  "js/course-context.js",
  "js/activity-engine-config.js",
  "js/learner-details.js",
  "js/submissions.js",
  "js/session-disclosure.js"
];

function walk(directory, acc = []) {
  for (const entry of readdirSync(directory)) {
    if (entry === "node_modules" || entry === "dist" || entry === ".git" || entry === "tests") continue;
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (entry === "index.html" || entry === "activity.html") acc.push(full);
  }
  return acc;
}

function posix(value) {
  return value.replaceAll("\\", "/");
}

function attr(html, name) {
  const match = html.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return match ? match[1].trim() : "";
}

function metaContent(html, name) {
  const match = html.match(new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]*)"`, "i"))
    || html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+name="${name}"`, "i"));
  return match ? match[1] : "";
}

function dataRoot(file) {
  const rel = posix(relative(root, dirname(file)));
  if (!rel || rel === ".") return ".";
  return rel.split("/").map(() => "..").join("/");
}

function hrefTo(file, target) {
  let value = posix(relative(dirname(file), join(root, target)));
  if (!value.startsWith(".")) value = "./" + value;
  return value;
}

function repoPathFromSrc(file, src) {
  const clean = src.split(/[?#]/)[0];
  return posix(relative(root, join(dirname(file), clean)));
}

function shouldSkipScript(src) {
  return SKIP_SCRIPT.some((token) => src.includes(token));
}

function classify(route) {
  if (route === "index.html") return { view: "home", page: "home", section: "home" };
  if (route === "account/index.html") return { view: "account", page: "account", section: "account" };
  if (route === "help/index.html") return { view: "help", page: "help", section: "help" };
  if (route === "resources/index.html") return { view: "resources", page: "resources", section: "resources" };
  if (route === "activities/activity.html") {
    return { view: "week1-activity", page: "week1-activity", section: "week-1" };
  }
  const weekIndex = route.match(/^week-([1-7])\/index\.html$/);
  if (weekIndex) {
    return { view: "week", page: `week-${weekIndex[1]}`, section: `week-${weekIndex[1]}`, week: Number(weekIndex[1]) };
  }
  const nested = route.match(/^week-([1-7])\/([^/]+)\//);
  if (nested) {
    const view = /glossary|retrieval-quiz/.test(nested[2]) && nested[1] === "1" ? "redirect" : "activity";
    return {
      view,
      page: `week-${nested[1]}-${nested[2]}`,
      section: `week-${nested[1]}`,
      week: Number(nested[1]),
      activity: nested[2]
    };
  }
  return { view: "static", page: posix(route).replace(/\/index\.html$/, "").replaceAll("/", "-"), section: "home" };
}

function extractMain(html) {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return match ? match[1].trim() : "";
}

function extractHeader(html) {
  const block = html.match(/<header class="page-header[^"]*"[^>]*>([\s\S]*?)<\/header>/i);
  if (!block) return { title: "", subtitle: "" };
  const title = (block[1].match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || ["", ""])[1].replace(/<[^>]+>/g, "").trim();
  const subtitle = (block[1].match(/class="page-subtitle"[^>]*>([\s\S]*?)<\/p>/i) || ["", ""])[1].replace(/<[^>]+>/g, "").trim();
  return { title, subtitle };
}

function extractScripts(file, html) {
  const scripts = [];
  const pattern = /<script\b([^>]*)>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const srcMatch = match[1].match(/\bsrc=["']([^"']+)["']/);
    if (!srcMatch) continue;
    const src = srcMatch[1];
    if (shouldSkipScript(src)) continue;
    const repoPath = repoPathFromSrc(file, src);
    if (!repoPath || repoPath.startsWith("..")) continue;
    if (SHARED_ADAPTERS.includes(repoPath)) continue;
    if (!scripts.includes(repoPath)) scripts.push(repoPath);
  }
  return scripts;
}

function escapeTemplate(html) {
  return html.replaceAll("</template", "<\\/template");
}

const files = walk(root).filter((file) => {
  const rel = posix(relative(root, file));
  return !rel.includes("/tests/");
}).sort();

const inventory = [];

for (const file of files) {
  const route = posix(relative(root, file));
  const html = readFileSync(file, "utf8");
  const classified = classify(route);
  const title = attr(html, "title") || classified.page;
  const description = metaContent(html, "description");
  const header = extractHeader(html);
  const mainHtml = extractMain(html);
  const scripts = extractScripts(file, html);
  const activityId = (html.match(/data-activity-id="([^"]+)"/) || [])[1] || "";
  const refresh = (html.match(/http-equiv="refresh"[^>]+content="([^"]+)"/i) || [])[1] || "";
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/i) || [])[1] || "";
  const replace = (html.match(/location\.replace\(['"]([^'"]+)['"]\)/) || [])[1] || "";
  const view = classified.view === "activity" && (refresh || replace) ? "redirect" : classified.view;
  const rootAttr = dataRoot(file);
  const bootstrapSrc = hrefTo(file, "js/core/theme-bootstrap.js") + "?v=2";
  const moduleSrc = hrefTo(file, "src/main.tsx");

  const record = {
    route,
    view,
    page: classified.page,
    section: classified.section,
    week: classified.week || null,
    activity: classified.activity || (view === "week1-activity" ? "activity-api" : ""),
    activityId,
    title,
    description,
    heading: header.title || title.replace(/\s+\|.*/, ""),
    subtitle: header.subtitle,
    scripts,
    redirectTo: replace || (canonical ? canonical : "")
  };
  inventory.push(record);

  const bodyAttrs = [
    `data-page="${classified.page}"`,
    `data-section="${classified.section}"`,
    `data-root="${rootAttr}"`,
    `data-view="${view}"`
  ];
  if (classified.week) bodyAttrs.push(`data-week="${classified.week}"`);
  if (record.activity) bodyAttrs.push(`data-activity="${record.activity}"`);
  if (activityId) bodyAttrs.push(`data-activity-id="${activityId}"`);

  const redirectHead = view === "redirect" && (refresh || replace)
    ? `  ${refresh ? `<meta http-equiv="refresh" content="${refresh}">\n` : ""}${canonical ? `  <link rel="canonical" href="${canonical}">\n` : ""}${replace ? `  <script>location.replace(${JSON.stringify(replace)});</script>\n` : ""}`
    : "";

  const template = view === "redirect"
    ? (mainHtml || `<p><a href="${record.redirectTo}">Continue</a></p>`)
    : mainHtml;

  const shell = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${description ? `<meta name="description" content="${description}">` : ""}
  <meta name="theme-color" content="#0b1f33">
  <link rel="icon" href="data:,">
  <title>${title}</title>
${redirectHead}  <script src="${bootstrapSrc}"></script>
</head>
<body ${bodyAttrs.join(" ")}>
  <noscript><p>JavaScript is required for the Unit 3 Cyber Security Hub.</p></noscript>
  <div id="root"></div>
  <template id="unit3-page-body">${escapeTemplate(template)}</template>
  <script type="module" src="${moduleSrc}"></script>
</body>
</html>
`;

  writeFileSync(file, shell);
}

mkdirSync(join(root, "test/fixtures"), { recursive: true });
writeFileSync(
  join(root, "test/fixtures/route-inventory.json"),
  JSON.stringify({ sharedAdapters: SHARED_ADAPTERS, routes: inventory }, null, 2) + "\n"
);

console.log("wrote", inventory.length, "learner shells");
console.log("views", inventory.reduce((acc, item) => {
  acc[item.view] = (acc[item.view] || 0) + 1;
  return acc;
}, {}));
