/* eslint-env node */

import { resolve } from "path";
import { defineConfig } from "vite";
import packageJSON from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, packageJSON.source),
      name: "InteractiveBlocks",
      fileName: "index",
    },
    rollupOptions: {
      external: Object.keys(packageJSON.dependencies),
      output: {
        globals: {
          // "tiny-typed-emitter": "events",
        },
      },
    },
  },
});