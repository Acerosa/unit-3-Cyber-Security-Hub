import react from "@vitejs/plugin-react";
import { learnerSafeContentPlugin, writeLearnerSafeJsonFile } from "@learning-platform/content/learner-safe";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { defineConfig } from "vite";
import { platformResolve } from "./vite.resolve";

function collectHtml(directory: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(directory)) {
    if (entry === "node_modules" || entry === "dist" || entry === "tests") continue;
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) collectHtml(full, acc);
    else if (entry === "index.html" || entry === "activity.html") acc.push(full);
  }
  return acc;
}

function htmlInputs() {
  return Object.fromEntries(
    collectHtml(process.cwd()).map((file) => {
      const relative = file.replace(process.cwd() + "/", "");
      const name = relative === "index.html"
        ? "home"
        : relative.replace(/\.html$/, "").replaceAll("/", "-");
      return [name, file];
    })
  );
}

function copyRuntimeFiles() {
  const dist = resolve("dist");
  const inventory = JSON.parse(readFileSync(resolve("test/fixtures/route-inventory.json"), "utf8"));
  const files = new Set<string>([
    "js/core/theme-bootstrap.js",
    "content/unit-3-cyber-security/package.json",
    ...inventory.sharedAdapters,
    ...inventory.routes.flatMap((route: { scripts: string[] }) => route.scripts)
  ]);
  files.forEach((file) => {
    const from = resolve(file);
    if (!existsSync(from)) return;
    const to = join(dist, file);
    mkdirSync(dirname(to), { recursive: true });
    const rel = file.replace(/\\/g, "/");
    if ((rel.includes("/content/") || rel.startsWith("content/")) && rel.endsWith(".json")) {
      writeLearnerSafeJsonFile(from, to);
      return;
    }
    cpSync(from, to);
  });
  writeFileSync(join(dist, ".nojekyll"), "");
}

function copyStaticAssets() {
  return {
    name: "copy-unit3-runtime-assets",
    closeBundle() {
      copyRuntimeFiles();
    }
  };
}

export default defineConfig({
  base: "./",
  resolve: platformResolve,
  plugins: [react(), learnerSafeContentPlugin(), copyStaticAssets()],
  build: {
    sourcemap: true,
    rollupOptions: {
      input: htmlInputs()
    }
  }
});
