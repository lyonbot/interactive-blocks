/* eslint-env node */

import { createVuePlugin } from "vite-plugin-vue2";

export default {
  mode: "development",
  root: __dirname,
  base: "./",
  plugins: [
    createVuePlugin(/* options */),
  ],
};
