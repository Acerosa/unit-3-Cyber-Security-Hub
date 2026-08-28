import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { platformResolve } from "./vite.resolve";

export default defineConfig({
  plugins: [react()],
  resolve: platformResolve,
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"]
  }
});
