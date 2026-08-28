import { resolve } from "node:path";

const coreRoot = resolve(__dirname, "node_modules/@learning-platform/core");

export const platformResolve = {
  alias: {
    "@learning-platform/core/curriculum-runtime": resolve(
      coreRoot,
      "dist/curriculum-runtime.esm.js"
    )
  }
};
